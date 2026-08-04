const VWORLD_WFS_URL = "https://api.vworld.kr/req/wfs";
const VWORLD_PARCEL_TYPENAME = "lt_c_landinfobasemap";
const VWORLD_UPSTREAM_TIMEOUT_MS = 7000;
const PARCEL_QUERY_BUFFER_DEGREES = 0.000025;
const PARCEL_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PARCEL_CACHE_MAX_ENTRIES = 300;

const JEJU_QUERY_BOUNDS = Object.freeze({
	minLng: 125.75,
	maxLng: 127.35,
	minLat: 32.85,
	maxLat: 34.25
});

const responseCache = new Map();
const inflightRequests = new Map();

function getAllowedCorsOrigin(req)
{
	const origin = String(req && req.headers ? req.headers.origin || "" : "").trim();
	if (!origin) return "";
	try {
		const url = new URL(origin);
		const isLocalPreview = url.protocol === "http:"
			&& (url.hostname === "localhost" || url.hostname === "127.0.0.1");
		const isRealjejuOrigin = url.protocol === "https:"
			&& [
				"realjeju.app",
				"www.realjeju.app",
				"xn--hq1bpbu67bkjdltmojb.xn--mk1bu44c"
			].includes(url.hostname);
		return isLocalPreview || isRealjejuOrigin ? origin : "";
	} catch (error) {
		return "";
	}
}

function applyCorsHeaders(req, res)
{
	const allowedOrigin = getAllowedCorsOrigin(req);
	if (!allowedOrigin) return;
	res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Vary", "Origin");
}

function normalizeApiKey(value)
{
	return String(value || "").trim();
}

function normalizeCoordinate(value)
{
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
}

function isJejuCoordinate(lat, lng)
{
	return lat >= JEJU_QUERY_BOUNDS.minLat
		&& lat <= JEJU_QUERY_BOUNDS.maxLat
		&& lng >= JEJU_QUERY_BOUNDS.minLng
		&& lng <= JEJU_QUERY_BOUNDS.maxLng;
}

function buildPointCacheKey(lat, lng)
{
	return `${Number(lng).toFixed(6)},${Number(lat).toFixed(6)}`;
}

function parseVworldPayload(payloadText)
{
	const text = String(payloadText || "").trim();
	if (!text) throw new Error("EMPTY_UPSTREAM_RESPONSE");
	if (text.startsWith("{") || text.startsWith("[")) return JSON.parse(text);

	const openingParenthesis = text.indexOf("(");
	const closingParenthesis = text.lastIndexOf(")");
	if (openingParenthesis < 1 || closingParenthesis <= openingParenthesis) {
		throw new Error("INVALID_UPSTREAM_RESPONSE");
	}
	return JSON.parse(text.slice(openingParenthesis + 1, closingParenthesis));
}

function isCoordinatePair(value)
{
	return Array.isArray(value)
		&& value.length >= 2
		&& Number.isFinite(Number(value[0]))
		&& Number.isFinite(Number(value[1]));
}

function isPointOnSegment(point, start, end, epsilon = 1e-10)
{
	if (!isCoordinatePair(point) || !isCoordinatePair(start) || !isCoordinatePair(end)) return false;
	const px = Number(point[0]);
	const py = Number(point[1]);
	const ax = Number(start[0]);
	const ay = Number(start[1]);
	const bx = Number(end[0]);
	const by = Number(end[1]);
	const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);
	if (Math.abs(cross) > epsilon) return false;
	return px >= Math.min(ax, bx) - epsilon
		&& px <= Math.max(ax, bx) + epsilon
		&& py >= Math.min(ay, by) - epsilon
		&& py <= Math.max(ay, by) + epsilon;
}

function isPointInRing(point, ring)
{
	if (!isCoordinatePair(point) || !Array.isArray(ring) || ring.length < 3) return false;
	const x = Number(point[0]);
	const y = Number(point[1]);
	let inside = false;
	for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
		const currentPoint = ring[index];
		const previousPoint = ring[previous];
		if (!isCoordinatePair(currentPoint) || !isCoordinatePair(previousPoint)) continue;
		if (isPointOnSegment(point, previousPoint, currentPoint)) return true;
		const xi = Number(currentPoint[0]);
		const yi = Number(currentPoint[1]);
		const xj = Number(previousPoint[0]);
		const yj = Number(previousPoint[1]);
		const intersects = ((yi > y) !== (yj > y))
			&& x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersects) inside = !inside;
	}
	return inside;
}

function isPointInPolygonCoordinates(point, polygonCoordinates)
{
	if (!Array.isArray(polygonCoordinates) || !polygonCoordinates.length) return false;
	if (!isPointInRing(point, polygonCoordinates[0])) return false;
	for (let index = 1; index < polygonCoordinates.length; index += 1) {
		if (isPointInRing(point, polygonCoordinates[index])) return false;
	}
	return true;
}

function geometryContainsPoint(geometry, point)
{
	if (!geometry || !Array.isArray(geometry.coordinates)) return false;
	if (geometry.type === "Polygon") {
		return isPointInPolygonCoordinates(point, geometry.coordinates);
	}
	if (geometry.type === "MultiPolygon") {
		return geometry.coordinates.some((polygon) => isPointInPolygonCoordinates(point, polygon));
	}
	return false;
}

function countGeometryVertices(geometry)
{
	let count = 0;
	function visit(value)
	{
		if (!Array.isArray(value)) return;
		if (isCoordinatePair(value)) {
			count += 1;
			return;
		}
		value.forEach(visit);
	}
	visit(geometry && geometry.coordinates);
	return count;
}

function chooseParcelFeature(featureCollection, lng, lat)
{
	const point = [Number(lng), Number(lat)];
	const features = Array.isArray(featureCollection && featureCollection.features)
		? featureCollection.features
		: [];
	const candidates = features.filter((feature) => {
		const geometry = feature && feature.geometry;
		return geometry
			&& (geometry.type === "Polygon" || geometry.type === "MultiPolygon")
			&& geometryContainsPoint(geometry, point);
	});
	if (!candidates.length) return null;
	return candidates.sort((a, b) => countGeometryVertices(a.geometry) - countGeometryVertices(b.geometry))[0];
}

function normalizeFeatureProperties(properties)
{
	const source = properties && typeof properties === "object" ? properties : {};
	return {
		pnu: String(source.pnu || source.PNU || "").trim(),
		sidoName: String(source.sido_nm || source.sidoName || "").trim(),
		sigunguName: String(source.sgg_nm || source.sigunguName || "").trim(),
		eupmyeondongName: String(source.emd_nm || source.eupmyeondongName || "").trim(),
		riName: String(source.ri_nm || source.riName || "").trim(),
		jibun: String(source.jibun || "").trim(),
		jimok: String(source.jimok || "").trim()
	};
}

function normalizeParcelResponse(feature)
{
	if (!feature || !feature.geometry) return null;
	const properties = normalizeFeatureProperties(feature.properties);
	return {
		ok: true,
		source: "VWorld LX맵(연속지적도)",
		pnu: properties.pnu,
		geometry: feature.geometry,
		jibun: properties.jibun,
		jimok: properties.jimok,
		address: [properties.sidoName, properties.sigunguName, properties.eupmyeondongName, properties.riName, properties.jibun]
			.filter(Boolean)
			.join(" "),
		properties
	};
}

function getCachedResponse(key)
{
	const cached = responseCache.get(key);
	if (!cached) return null;
	if (Date.now() - cached.savedAt > PARCEL_CACHE_TTL_MS) {
		responseCache.delete(key);
		return null;
	}
	responseCache.delete(key);
	responseCache.set(key, cached);
	return cached.value;
}

function saveCachedResponse(key, value)
{
	responseCache.delete(key);
	responseCache.set(key, { savedAt: Date.now(), value });
	while (responseCache.size > PARCEL_CACHE_MAX_ENTRIES) {
		const oldestKey = responseCache.keys().next().value;
		if (!oldestKey) break;
		responseCache.delete(oldestKey);
	}
}

async function fetchParcelBoundary(apiKey, lat, lng)
{
	const requestUrl = new URL(VWORLD_WFS_URL);
	const buffer = PARCEL_QUERY_BUFFER_DEGREES;
	requestUrl.searchParams.set("key", apiKey);
	requestUrl.searchParams.set("SERVICE", "WFS");
	requestUrl.searchParams.set("version", "1.1.0");
	requestUrl.searchParams.set("request", "GetFeature");
	requestUrl.searchParams.set("TYPENAME", VWORLD_PARCEL_TYPENAME);
	requestUrl.searchParams.set("OUTPUT", "text/javascript");
	requestUrl.searchParams.set("SRSNAME", "EPSG:4326");
	requestUrl.searchParams.set("BBOX", [lng - buffer, lat - buffer, lng + buffer, lat + buffer].join(","));
	requestUrl.searchParams.set("MAXFEATURES", "20");
	requestUrl.searchParams.set("callback", "parseResponse");

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), VWORLD_UPSTREAM_TIMEOUT_MS);
	try {
		const response = await fetch(requestUrl, {
			headers: { Accept: "application/json, text/javascript;q=0.9" },
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`);
		const featureCollection = parseVworldPayload(await response.text());
		const feature = chooseParcelFeature(featureCollection, lng, lat);
		if (!feature) return null;
		return normalizeParcelResponse(feature);
	} finally {
		clearTimeout(timeoutId);
	}
}

async function getParcelBoundary(apiKey, lat, lng)
{
	const key = buildPointCacheKey(lat, lng);
	const cached = getCachedResponse(key);
	if (cached) return cached;
	if (inflightRequests.has(key)) return inflightRequests.get(key);

	const request = fetchParcelBoundary(apiKey, lat, lng)
		.then((value) => {
			if (value) saveCachedResponse(key, value);
			return value;
		})
		.finally(() => {
			inflightRequests.delete(key);
		});
	inflightRequests.set(key, request);
	return request;
}

module.exports = async function handler(req, res)
{
	applyCorsHeaders(req, res);
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	if (req.method === "OPTIONS") {
		res.status(204).end();
		return;
	}
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).json({ ok: false, code: "METHOD_NOT_ALLOWED" });
		return;
	}

	const lat = normalizeCoordinate(req.query && req.query.lat);
	const lng = normalizeCoordinate(req.query && req.query.lng);
	if (lat === null || lng === null) {
		res.setHeader("Cache-Control", "no-store");
		res.status(400).json({ ok: false, code: "INVALID_COORDINATES" });
		return;
	}
	if (!isJejuCoordinate(lat, lng)) {
		res.setHeader("Cache-Control", "no-store");
		res.status(400).json({ ok: false, code: "OUTSIDE_JEJU" });
		return;
	}

	const apiKey = normalizeApiKey(process.env.VWORLD_API_KEY);
	if (!apiKey) {
		res.setHeader("Cache-Control", "no-store");
		res.status(503).json({ ok: false, code: "VWORLD_KEY_NOT_CONFIGURED" });
		return;
	}

	try {
		const parcel = await getParcelBoundary(apiKey, lat, lng);
		if (!parcel) {
			res.setHeader("Cache-Control", "public, max-age=30, s-maxage=60");
			res.status(404).json({ ok: false, code: "PARCEL_NOT_FOUND" });
			return;
		}
		res.setHeader("Cache-Control", "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400");
		res.status(200).json(parcel);
	} catch (error) {
		console.error("필지 경계 공식 API 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
		res.setHeader("Cache-Control", "no-store");
		res.status(502).json({ ok: false, code: "VWORLD_UPSTREAM_FAILED" });
	}
};

module.exports.__test = {
	getAllowedCorsOrigin,
	buildPointCacheKey,
	chooseParcelFeature,
	geometryContainsPoint,
	isJejuCoordinate,
	isPointInRing,
	normalizeFeatureProperties,
	parseVworldPayload
};
