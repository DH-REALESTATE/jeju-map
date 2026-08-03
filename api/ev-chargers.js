const EV_CHARGER_API_URL = "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
const EV_CHARGER_REGION_CODE = "50";
const EV_CHARGER_RESPONSE_CACHE_MS = 90 * 1000;

let cachedResponse = null;
let cachedAt = 0;
let inflightRequest = null;

const STATUS_LABELS = {
	"1": "통신 이상",
	"2": "충전 가능",
	"3": "충전 중",
	"4": "운영 중지",
	"5": "점검 중",
	"9": "상태 미확인"
};

const CHARGER_TYPE_LABELS = {
	"01": "DC차데모",
	"02": "AC완속",
	"03": "DC차데모·AC3상",
	"04": "DC콤보",
	"05": "DC차데모·DC콤보",
	"06": "DC차데모·AC3상·DC콤보",
	"07": "AC3상",
	"08": "DC콤보(완속)",
	"09": "NACS",
	"10": "DC콤보·NACS"
};

function normalizeServiceKey(value)
{
	const raw = String(value || "").trim();
	if (!raw) return "";
	try {
		return decodeURIComponent(raw);
	} catch (error) {
		return raw;
	}
}

function decodeXmlEntities(value)
{
	return String(value || "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&#(\d+);/g, (match, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (match, code) => String.fromCodePoint(parseInt(code, 16)));
}

function getXmlTagValue(xml, tagName)
{
	const match = String(xml || "").match(new RegExp("<" + tagName + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + tagName + ">", "i"));
	if (!match) return "";
	return decodeXmlEntities(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim());
}

function parseXmlItems(xml)
{
	const rows = [];
	const itemPattern = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
	let match;
	while ((match = itemPattern.exec(String(xml || "")))) {
		const itemXml = match[1];
		const row = {};
		[
			"statNm", "statId", "chgerId", "chgerType", "addr", "location", "lat", "lng",
			"useTime", "busiId", "bnm", "busiNm", "busiCall", "stat", "statUpdDt",
			"lastTsdt", "lastTedt", "nowTsdt", "output", "method", "parkingFree",
			"note", "limitYn", "limitDetail", "delYn", "delDetail", "trafficYn"
		].forEach((key) => {
			row[key] = getXmlTagValue(itemXml, key);
		});
		rows.push(row);
	}
	return {
		resultCode: getXmlTagValue(xml, "resultCode"),
		resultMessage: getXmlTagValue(xml, "resultMsg"),
		rows
	};
}

function parseUpstreamPayload(payloadText, contentType)
{
	const text = String(payloadText || "").trim();
	if (!text) throw new Error("EMPTY_UPSTREAM_RESPONSE");
	if (String(contentType || "").includes("json") || text.startsWith("{")) {
		const data = JSON.parse(text);
		const response = data && data.response ? data.response : data;
		const header = response && response.header ? response.header : {};
		const body = response && response.body ? response.body : response;
		const itemContainer = body && body.items
			? body.items
			: (response && response.items ? response.items : (data && data.items ? data.items : {}));
		const rawItems = itemContainer && Object.prototype.hasOwnProperty.call(itemContainer, "item")
			? itemContainer.item
			: [];
		return {
			resultCode: String(header.resultCode || header.resultcode || body.resultCode || body.resultcode || response.resultCode || response.resultcode || ""),
			resultMessage: String(header.resultMsg || header.resultmsg || body.resultMsg || body.resultmsg || response.resultMsg || response.resultmsg || ""),
			rows: Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : [])
		};
	}
	return parseXmlItems(text);
}

function normalizeCoordinate(value)
{
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
}

function normalizeText(value)
{
	return String(value == null ? "" : value).trim();
}

function normalizeOfficialDate(value)
{
	return normalizeText(value).replace(/[^0-9]/g, "").slice(0, 14);
}

function buildStationResponse(rows)
{
	const stationMap = new Map();
	(rows || []).forEach((rawRow) => {
		const statId = normalizeText(rawRow && rawRow.statId);
		const chgerId = normalizeText(rawRow && rawRow.chgerId);
		const lat = normalizeCoordinate(rawRow && rawRow.lat);
		const lng = normalizeCoordinate(rawRow && rawRow.lng);
		if (!statId || lat === null || lng === null) return;
		let station = stationMap.get(statId);
		if (!station) {
			station = {
				id: statId,
				statId,
				name: normalizeText(rawRow.statNm) || "전기차 충전소",
				address: normalizeText(rawRow.addr),
				location: normalizeText(rawRow.location),
				lat,
				lng,
				useTime: normalizeText(rawRow.useTime),
				operator: normalizeText(rawRow.busiNm || rawRow.bnm),
				operatorPhone: normalizeText(rawRow.busiCall),
				parkingFree: normalizeText(rawRow.parkingFree),
				limitYn: normalizeText(rawRow.limitYn),
				limitDetail: normalizeText(rawRow.limitDetail),
				totalCount: 0,
				availableCount: 0,
				chargingCount: 0,
				unavailableCount: 0,
				statusUpdatedAt: "",
				chargers: []
			};
			stationMap.set(statId, station);
		}
		const statusCode = normalizeText(rawRow.stat);
		const typeCode = normalizeText(rawRow.chgerType).padStart(2, "0");
		const statusUpdatedAt = normalizeOfficialDate(rawRow.statUpdDt);
		station.chargers.push({
			id: chgerId,
			typeCode,
			typeLabel: CHARGER_TYPE_LABELS[typeCode] || "충전기",
			statusCode,
			statusLabel: STATUS_LABELS[statusCode] || "상태 미확인",
			statusUpdatedAt,
			capacity: normalizeText(rawRow.output),
			method: normalizeText(rawRow.method)
		});
		station.totalCount += 1;
		if (statusCode === "2") station.availableCount += 1;
		else if (statusCode === "3") station.chargingCount += 1;
		else station.unavailableCount += 1;
		if (statusUpdatedAt > station.statusUpdatedAt) station.statusUpdatedAt = statusUpdatedAt;
	});
	return Array.from(stationMap.values()).sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

async function fetchOfficialStations(serviceKey)
{
	const requestUrl = new URL(EV_CHARGER_API_URL);
	requestUrl.searchParams.set("serviceKey", serviceKey);
	requestUrl.searchParams.set("pageNo", "1");
	requestUrl.searchParams.set("numOfRows", "9999");
	requestUrl.searchParams.set("zcode", EV_CHARGER_REGION_CODE);
	requestUrl.searchParams.set("dataType", "JSON");
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 12000);
	try {
		const response = await fetch(requestUrl, {
			headers: { Accept: "application/json, application/xml;q=0.9, text/xml;q=0.8" },
			signal: controller.signal
		});
		if (!response.ok) throw new Error("UPSTREAM_HTTP_" + response.status);
		const parsed = parseUpstreamPayload(await response.text(), response.headers.get("content-type"));
		if (parsed.resultCode && parsed.resultCode !== "00") {
			throw new Error("UPSTREAM_RESULT_" + parsed.resultCode);
		}
		const stations = buildStationResponse(parsed.rows);
		if (!stations.length) throw new Error("UPSTREAM_EMPTY_STATIONS");
		return stations;
	} finally {
		clearTimeout(timeoutId);
	}
}

async function getOfficialStations(serviceKey)
{
	if (cachedResponse && Date.now() - cachedAt < EV_CHARGER_RESPONSE_CACHE_MS) return cachedResponse;
	if (inflightRequest) return inflightRequest;
	inflightRequest = fetchOfficialStations(serviceKey)
		.then((stations) => {
			cachedResponse = stations;
			cachedAt = Date.now();
			return stations;
		})
		.finally(() => {
			inflightRequest = null;
		});
	return inflightRequest;
}

module.exports = async function handler(req, res)
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).json({ ok: false, code: "METHOD_NOT_ALLOWED" });
		return;
	}
	const serviceKey = normalizeServiceKey(process.env.EV_CHARGER_SERVICE_KEY);
	if (!serviceKey) {
		res.setHeader("Cache-Control", "no-store");
		res.status(503).json({ ok: false, code: "EV_CHARGER_KEY_NOT_CONFIGURED" });
		return;
	}
	try {
		const stations = await getOfficialStations(serviceKey);
		res.setHeader("Cache-Control", "public, max-age=30, s-maxage=120, stale-while-revalidate=300");
		res.status(200).json({
			ok: true,
			source: "한국환경공단 공공데이터포털",
			updatedAt: new Date().toISOString(),
			count: stations.length,
			stations
		});
	} catch (error) {
		console.error("전기차 충전소 공식 API 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
		res.setHeader("Cache-Control", "no-store");
		res.status(502).json({ ok: false, code: "EV_CHARGER_UPSTREAM_FAILED" });
	}
};

module.exports.__test = {
	buildStationResponse,
	parseUpstreamPayload,
	normalizeServiceKey
};
