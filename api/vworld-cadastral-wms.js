const VWORLD_WMS_URL = "https://api.vworld.kr/req/wms";
const VWORLD_CADASTRAL_LAYER = "lt_c_landinfobasemap";
const VWORLD_DEFAULT_API_DOMAIN = "https://realjeju.app";
const VWORLD_WMS_TIMEOUT_MS = 6500;
const VWORLD_WMS_MAX_SIZE = 4096;

const KOREA_QUERY_BOUNDS = Object.freeze({
	minLng: 120,
	maxLng: 135,
	minLat: 30,
	maxLat: 40
});

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

function normalizeVworldApiDomain(value)
{
	const normalized = String(value || "").trim().replace(/\/$/, "");
	if (!normalized) return VWORLD_DEFAULT_API_DOMAIN;
	return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
}

function normalizeImageSize(value)
{
	const number = Number(value);
	if (!Number.isInteger(number) || number < 64 || number > VWORLD_WMS_MAX_SIZE) return null;
	return number;
}

function normalizeBbox(value)
{
	const parts = String(value || "").split(",").map(Number);
	if (parts.length !== 4 || parts.some(number => !Number.isFinite(number))) return null;
	const [south, west, north, east] = parts;
	if (south >= north || west >= east) return null;
	if (
		south < KOREA_QUERY_BOUNDS.minLat
		|| north > KOREA_QUERY_BOUNDS.maxLat
		|| west < KOREA_QUERY_BOUNDS.minLng
		|| east > KOREA_QUERY_BOUNDS.maxLng
	) return null;
	if (north - south > 8 || east - west > 12) return null;
	return [south, west, north, east].map(number => Number(number.toFixed(8)));
}

function buildVworldWmsUrl(apiKey, apiDomain, bbox, width, height)
{
	const requestUrl = new URL(VWORLD_WMS_URL);
	requestUrl.searchParams.set("service", "WMS");
	requestUrl.searchParams.set("version", "1.3.0");
	requestUrl.searchParams.set("request", "GetMap");
	requestUrl.searchParams.set("key", apiKey);
	requestUrl.searchParams.set("domain", apiDomain);
	requestUrl.searchParams.set("layers", VWORLD_CADASTRAL_LAYER);
	requestUrl.searchParams.set("styles", VWORLD_CADASTRAL_LAYER);
	requestUrl.searchParams.set("crs", "EPSG:4326");
	// WMS 1.3.0의 EPSG:4326 축 순서는 위도, 경도입니다.
	requestUrl.searchParams.set("bbox", bbox.join(","));
	requestUrl.searchParams.set("width", String(width));
	requestUrl.searchParams.set("height", String(height));
	requestUrl.searchParams.set("format", "image/png");
	requestUrl.searchParams.set("transparent", "TRUE");
	requestUrl.searchParams.set("exceptions", "text/xml");
	return requestUrl;
}

function isPngBuffer(buffer)
{
	return Buffer.isBuffer(buffer)
		&& buffer.length >= 8
		&& buffer[0] === 0x89
		&& buffer[1] === 0x50
		&& buffer[2] === 0x4e
		&& buffer[3] === 0x47
		&& buffer[4] === 0x0d
		&& buffer[5] === 0x0a
		&& buffer[6] === 0x1a
		&& buffer[7] === 0x0a;
}

async function fetchVworldWmsImage(requestUrl, apiDomain)
{
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), VWORLD_WMS_TIMEOUT_MS);
	try {
		const response = await fetch(requestUrl, {
			headers: {
				Accept: "image/png,image/*;q=0.9",
				"Accept-Language": "ko-KR,ko;q=0.9",
				Referer: apiDomain,
				"User-Agent": "REALJEJU-VWorld-Cadastral-WMS/1.0"
			},
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`);
		const imageBuffer = Buffer.from(await response.arrayBuffer());
		if (!isPngBuffer(imageBuffer)) {
			const contentType = String(response.headers.get("content-type") || "unknown").split(";")[0].trim();
			const safePreview = imageBuffer.toString("utf8", 0, Math.min(imageBuffer.length, 160))
				.replace(/<[^>]*>/g, " ")
				.replace(/\s+/g, " ")
				.trim();
			throw new Error(`INVALID_WMS_IMAGE (${contentType})${safePreview ? `: ${safePreview}` : ""}`);
		}
		return imageBuffer;
	} finally {
		clearTimeout(timeoutId);
	}
}

module.exports = async function handler(req, res)
{
	applyCorsHeaders(req, res);
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

	const bbox = normalizeBbox(req.query && req.query.bbox);
	const width = normalizeImageSize(req.query && req.query.width);
	const height = normalizeImageSize(req.query && req.query.height);
	if (!bbox || width === null || height === null) {
		res.setHeader("Cache-Control", "no-store");
		res.status(400).json({ ok: false, code: "INVALID_WMS_PARAMETERS" });
		return;
	}

	const apiKey = String(process.env.VWORLD_API_KEY || "").trim();
	if (!apiKey) {
		res.setHeader("Cache-Control", "no-store");
		res.status(503).json({ ok: false, code: "VWORLD_KEY_NOT_CONFIGURED" });
		return;
	}
	const apiDomain = normalizeVworldApiDomain(process.env.VWORLD_API_DOMAIN);
	const requestUrl = buildVworldWmsUrl(apiKey, apiDomain, bbox, width, height);

	try {
		const imageBuffer = await fetchVworldWmsImage(requestUrl, apiDomain);
		res.setHeader("Content-Type", "image/png");
		res.setHeader("Content-Length", String(imageBuffer.length));
		res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800");
		res.status(200).send(imageBuffer);
	} catch (error) {
		console.error("브이월드 지적 WMS 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
		res.setHeader("Cache-Control", "no-store");
		res.status(502).json({ ok: false, code: "VWORLD_WMS_UPSTREAM_FAILED" });
	}
};

module.exports.__test = {
	buildVworldWmsUrl,
	getAllowedCorsOrigin,
	isPngBuffer,
	normalizeBbox,
	normalizeImageSize,
	normalizeVworldApiDomain
};
