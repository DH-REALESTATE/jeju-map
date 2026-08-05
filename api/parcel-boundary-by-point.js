const VWORLD_WFS_URL = "https://api.vworld.kr/req/wfs";
const VWORLD_PARCEL_TYPENAME = "lt_c_landinfobasemap";
const VWORLD_DEFAULT_API_DOMAIN = "https://realjeju.app";
const VWORLD_UPSTREAM_TIMEOUT_MS = 4200;
const VWORLD_UPSTREAM_MAX_ATTEMPTS = 3;
const VWORLD_UPSTREAM_RETRY_DELAY_MS = 180;
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

function normalizeVworldApiDomain(value)
{
	const normalized = String(value || "").trim().replace(/\/$/, "");
	if (!normalized) return VWORLD_DEFAULT_API_DOMAIN;
	return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
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
	const text = String(payloadText || "").replace(/^\uFEFF/, "").trim();
	if (!text) throw new Error("EMPTY_UPSTREAM_RESPONSE");
	if (text.startsWith("{") || text.startsWith("[")) return JSON.parse(text);
	if (text.startsWith("<")) {
		const serviceException = text.match(/<ServiceException\b([^>]*)>([\s\S]*?)<\/ServiceException>/i);
		const exceptionText = text.match(/<ExceptionText\b[^>]*>([\s\S]*?)<\/ExceptionText>/i);
		const attributes = serviceException ? String(serviceException[1] || "") : "";
		const codeMatch = attributes.match(/\bcode=["']([^"']+)["']/i);
		const upstreamCode = String(codeMatch ? codeMatch[1] : "XML_ERROR")
			.trim()
			.toUpperCase()
			.replace(/[^A-Z0-9_]+/g, "_");
		const rawMessage = serviceException ? serviceException[2] : (exceptionText ? exceptionText[1] : "");
		const upstreamMessage = String(rawMessage || "")
			.replace(/<[^>]+>/g, " ")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;|&apos;/g, "'")
			.replace(/&amp;/g, "&")
			.replace(/\s+/g, " ")
			.trim();
		const error = new Error(`VWORLD_${upstreamCode}${upstreamMessage ? `: ${upstreamMessage}` : ""}`);
		error.upstreamCode = upstreamCode;
		throw error;
	}

	const openingParenthesis = text.indexOf("(");
	const closingParenthesis = text.lastIndexOf(")");
	if (openingParenthesis >= 1 && closingParenthesis > openingParenthesis) {
		return JSON.parse(text.slice(openingParenthesis + 1, closingParenthesis));
	}

	// 일부 WFS 게이트웨이는 JSON 앞뒤에 짧은 안내 문자열을 붙인다.
	// 본문 안에 온전한 GeoJSON 객체가 있으면 그 객체만 안전하게 읽는다.
	const firstObjectBrace = text.indexOf("{");
	const lastObjectBrace = text.lastIndexOf("}");
	if (firstObjectBrace >= 0 && lastObjectBrace > firstObjectBrace) {
		try {
			return JSON.parse(text.slice(firstObjectBrace, lastObjectBrace + 1));
		} catch (error) {
			// 아래 공통 오류로 정리한다.
		}
	}
	throw new Error("INVALID_UPSTREAM_RESPONSE");
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

function waitForRetry(delayMs)
{
	return new Promise(resolve => setTimeout(resolve, delayMs));
}

function isRetryableUpstreamError(error)
{
	const message = String(error && error.message ? error.message : "");
	return message === "fetch failed"
		|| (error && error.name === "AbortError")
		|| /^UPSTREAM_HTTP_(502|503|504)$/.test(message);
}

async function fetchVworldFeatureCollection(requestUrl, apiDomain)
{
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), VWORLD_UPSTREAM_TIMEOUT_MS);
	try {
		const response = await fetch(requestUrl, {
			headers: {
				Accept: "application/json, text/javascript;q=0.9",
				"Accept-Language": "ko-KR,ko;q=0.9",
				Referer: apiDomain,
				"User-Agent": "REALJEJU-Parcel-Boundary/1.0"
			},
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`);
		const responseText = await response.text();
		try {
			return parseVworldPayload(responseText);
		} catch (error) {
			if (String(error && error.message ? error.message : "") !== "INVALID_UPSTREAM_RESPONSE") throw error;
			const contentType = String(response.headers.get("content-type") || "unknown").split(";")[0].trim();
			const safePreview = String(responseText || "")
				.replace(/<[^>]*>/g, " ")
				.replace(/\s+/g, " ")
				.trim()
				.slice(0, 120);
			const invalidResponseError = new Error(
				`VWORLD_INVALID_RESPONSE (${contentType})${safePreview ? `: ${safePreview}` : ""}`
			);
			invalidResponseError.upstreamCode = "INVALID_RESPONSE";
			throw invalidResponseError;
		}
	} finally {
		clearTimeout(timeoutId);
	}
}

function buildVworldWfsRequestUrl(apiKey, apiDomain, lat, lng, outputFormat)
{
	const requestUrl = new URL(VWORLD_WFS_URL);
	const buffer = PARCEL_QUERY_BUFFER_DEGREES;
	requestUrl.searchParams.set("key", apiKey);
	requestUrl.searchParams.set("domain", apiDomain);
	requestUrl.searchParams.set("SERVICE", "WFS");
	requestUrl.searchParams.set("version", "1.1.0");
	requestUrl.searchParams.set("request", "GetFeature");
	requestUrl.searchParams.set("TYPENAME", VWORLD_PARCEL_TYPENAME);
	requestUrl.searchParams.set("OUTPUT", outputFormat);
	requestUrl.searchParams.set("SRSNAME", "EPSG:4326");
	requestUrl.searchParams.set("BBOX", [lng - buffer, lat - buffer, lng + buffer, lat + buffer].join(","));
	requestUrl.searchParams.set("MAXFEATURES", "20");
	if (outputFormat === "text/javascript") requestUrl.searchParams.set("callback", "parseResponse");
	return requestUrl;
}

function shouldUseVworldJsonpFallback(error)
{
	const message = String(error && error.message ? error.message : "");
	const upstreamCode = String(error && error.upstreamCode ? error.upstreamCode : "");
	return message === "INVALID_UPSTREAM_RESPONSE"
		|| upstreamCode === "INVALID_RESPONSE"
		|| upstreamCode === "INVALID_PARAMETER_VALUE";
}

async function fetchParcelBoundary(apiKey, apiDomain, lat, lng)
{
	let lastError = null;
	for (let attempt = 1; attempt <= VWORLD_UPSTREAM_MAX_ATTEMPTS; attempt += 1) {
		try {
			let featureCollection;
			try {
				const geoJsonRequestUrl = buildVworldWfsRequestUrl(apiKey, apiDomain, lat, lng, "application/json");
				featureCollection = await fetchVworldFeatureCollection(geoJsonRequestUrl, apiDomain);
			} catch (geoJsonError) {
				if (!shouldUseVworldJsonpFallback(geoJsonError)) throw geoJsonError;
				const jsonpRequestUrl = buildVworldWfsRequestUrl(apiKey, apiDomain, lat, lng, "text/javascript");
				featureCollection = await fetchVworldFeatureCollection(jsonpRequestUrl, apiDomain);
			}
			const feature = chooseParcelFeature(featureCollection, lng, lat);
			if (!feature) return null;
			return normalizeParcelResponse(feature);
		} catch (error) {
			lastError = error;
			if (!isRetryableUpstreamError(error) || attempt >= VWORLD_UPSTREAM_MAX_ATTEMPTS) throw error;
			await waitForRetry(VWORLD_UPSTREAM_RETRY_DELAY_MS * attempt);
		}
	}
	throw lastError || new Error("VWORLD_UPSTREAM_FAILED");
}

async function getParcelBoundary(apiKey, apiDomain, lat, lng)
{
	const key = buildPointCacheKey(lat, lng);
	const cached = getCachedResponse(key);
	if (cached) return cached;
	if (inflightRequests.has(key)) return inflightRequests.get(key);

	const request = fetchParcelBoundary(apiKey, apiDomain, lat, lng)
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
	res.setHeader("X-Realjeju-Function-Region", String(process.env.VERCEL_REGION || "unknown"));
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
	const apiDomain = normalizeVworldApiDomain(process.env.VWORLD_API_DOMAIN);

	try {
		const parcel = await getParcelBoundary(apiKey, apiDomain, lat, lng);
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
		const upstreamCode = String(error && error.upstreamCode ? error.upstreamCode : "").trim();
		res.status(502).json({
			ok: false,
			code: upstreamCode ? `VWORLD_${upstreamCode}` : "VWORLD_UPSTREAM_FAILED"
		});
	}
};

module.exports.__test = {
	getAllowedCorsOrigin,
	buildPointCacheKey,
	chooseParcelFeature,
	geometryContainsPoint,
	isRetryableUpstreamError,
	isJejuCoordinate,
	isPointInRing,
	normalizeVworldApiDomain,
	normalizeFeatureProperties,
	parseVworldPayload
};
