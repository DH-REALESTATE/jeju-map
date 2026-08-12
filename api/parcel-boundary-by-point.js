const VWORLD_WFS_URL = "https://api.vworld.kr/req/wfs";
const VWORLD_LAND_CHARACTERISTICS_URL = "https://api.vworld.kr/ned/data/getLandCharacteristics";
const VWORLD_LAND_POSSESSION_URL = "https://api.vworld.kr/ned/data/getPossessionAttr";
const VWORLD_PARCEL_TYPENAME = "lt_c_landinfobasemap";
const VWORLD_DEFAULT_API_DOMAIN = "https://realjeju.app";
const VWORLD_UPSTREAM_TIMEOUT_MS = 4200;
const VWORLD_LAND_CHARACTERISTICS_TIMEOUT_MS = 5000;
const VWORLD_LAND_POSSESSION_TIMEOUT_MS = 5000;
const VWORLD_UPSTREAM_MAX_ATTEMPTS = 3;
const VWORLD_UPSTREAM_RETRY_DELAY_MS = 180;
const PARCEL_QUERY_BUFFER_DEGREES = 0.000025;
// Interactive parcel lookup is DB-only. Do not retain pre-reset parcel rows in
// a warm serverless instance after the permanent cache has been purged.
const PARCEL_CACHE_TTL_MS = 0;
const PARCEL_CACHE_MAX_ENTRIES = 300;
const PARCEL_INFORMATION_CACHE_TABLE = "parcel_information_cache";
const PARCEL_BOUNDARY_POINT_CACHE_TABLE = "parcel_boundary_point_cache";
const DAY_MS = 24 * 60 * 60 * 1000;
const PARCEL_INFORMATION_CACHE_POLICY = Object.freeze({
  boundary: Object.freeze({ completeTtlMs: 365 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  land_basic: Object.freeze({ completeTtlMs: 90 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  ownership: Object.freeze({ completeTtlMs: 7 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  land_use: Object.freeze({ completeTtlMs: 30 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  land_movement: Object.freeze({ completeTtlMs: 30 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  individual_land_prices: Object.freeze({ completeTtlMs: 30 * DAY_MS, notFoundTtlMs: 7 * DAY_MS }),
  individual_housing_prices: Object.freeze({ completeTtlMs: 30 * DAY_MS, notFoundTtlMs: 7 * DAY_MS })
});
const PARCEL_CACHE_TYPE = Object.freeze({
  BOUNDARY: "boundary",
  LAND_BASIC: "land_basic",
  OWNERSHIP: "ownership",
  LAND_USE: "land_use",
  LAND_MOVEMENT: "land_movement",
  INDIVIDUAL_LAND_PRICES: "individual_land_prices",
  INDIVIDUAL_HOUSING_PRICES: "individual_housing_prices",
  BUILDING_REGISTER: "building_register",
  COMMON_HOUSING_PRICES: "common_housing_prices",
  APARTMENT_BUSINESSES: "apartment_businesses"
});
const PARCEL_INFORMATION_CACHE_TYPES = Object.freeze(
  Object.values(PARCEL_CACHE_TYPE).filter((dataType) => dataType !== PARCEL_CACHE_TYPE.BOUNDARY)
);

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
	// Parcel cache rows can be replaced or removed by the offline loader. A
	// browser/CDN response cache must never outlive that database state.
	res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
	res.setHeader("CDN-Cache-Control", "no-store");
	res.setHeader("Vercel-CDN-Cache-Control", "no-store");
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

function getSupabaseAdminConfig()
{
  const url = String(
    process.env.REALJEJU_SUPABASE_URL
    || process.env.SUPABASE_URL
    || process.env.NEXT_PUBLIC_SUPABASE_URL
    || "https://jctovfrcvfosoowribej.supabase.co"
  ).trim().replace(/\/$/, "");
  const key = String(
    process.env.REALJEJU_SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || ""
  ).trim();
  return url && key ? { url, key } : null;
}

async function supabaseAdminFetch(path, options)
{
  const config = getSupabaseAdminConfig();
  if (!config) return null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);
  try {
    return await fetch(config.url + path, {
      ...(options || {}),
      headers: {
        Authorization: `Bearer ${config.key}`,
        apikey: config.key,
        ...((options && options.headers) || {})
      },
      signal: controller.signal
    });
  } catch (error) {
    console.warn("[parcel permanent cache] request failed:", error && error.message ? error.message : error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadOfflineLandUsePlan(pnu)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  const response = await supabaseAdminFetch(
    `/rest/v1/realjeju_land_use_plan_current?select=relation_type,law_name,zone_code,zone_name,source_standard_date,payload&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=id.asc&limit=1000`
  );
  if (!response || !response.ok) {
    if (response) {
      console.warn("[parcel-boundary-by-point] offline land-use lookup failed:", response.status);
    }
    return null;
  }

  const rows = await response.json().catch(() => []);
  if (!Array.isArray(rows)) return null;
  const relationByCode = { "1": "포함", "2": "저촉", "3": "접합" };
  const seen = new Set();
  const items = rows.reduce((items, row) => {
    const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
    const relationCode = String(payload["저촉여부코드"] || "").trim();
    const rawRelation = String(row.relation_type || payload["저촉여부"] || "").trim();
    const relation = relationByCode[relationCode] || (rawRelation === "접함" ? "접합" : rawRelation);
    const districtCode = String(row.zone_code || payload["용도지역지구코드"] || "").trim();
    const districtName = String(row.zone_name || payload["용도지역지구명"] || "").trim();
    if (!relation || !districtName) return items;
    const key = `${relation}|${districtCode}|${districtName}`;
    if (seen.has(key)) return items;
    seen.add(key);
    items.push({
      relationCode,
      relation,
      districtCode,
      districtName,
      lawGroup: isNationalPlanningLandUseRecord(districtCode, districtName)
        ? "national-planning"
        : "other",
      lawName: String(row.law_name || "").trim(),
      registeredAt: String(payload["등록일자"] || "").trim(),
      lastUpdatedAt: String(payload["데이터기준일자"] || row.source_standard_date || "").trim()
    });
    return items;
  }, []);
  const parcelPayload = rows
    .map((row) => row && row.payload && typeof row.payload === "object" ? row.payload : null)
    .find((payload) => payload && (payload["법정동명"] || payload["지번"])) || {};
  const legalDongName = String(parcelPayload["법정동명"] || "").trim();
  const jibun = String(parcelPayload["지번"] || "").trim();
  items.legalDongName = legalDongName;
  items.jibun = jibun;
  items.address = [legalDongName, jibun].filter(Boolean).join(" ");
  return items;
}

async function loadOfflineLandBasic(pnu)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  const response = await supabaseAdminFetch(
    `/rest/v1/realjeju_land_characteristics_current?select=pnu,legal_dong_name,jibun,jimok_name,area_m2,land_use_zone_name_1,land_use_situation_name,terrain_height_name,terrain_shape_name,road_side_name,published_land_price,standard_year,standard_month,source_standard_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&limit=1`
  );
  if (!response || !response.ok) {
    if (response) {
      console.warn("[parcel-boundary-by-point] offline land-basic lookup failed:", response.status);
    }
    return null;
  }
  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || String(row.pnu || "").trim() !== normalizedPnu) return null;
  const areaM2 = Number(row.area_m2);
  const publishedLandPrice = Number(row.published_land_price);
  const standardMonth = String(row.standard_month || "").padStart(2, "0");
  return {
    pnu: normalizedPnu,
    legalDongName: String(row.legal_dong_name || "").trim(),
    jibun: String(row.jibun || "").trim(),
    jimok: String(row.jimok_name || "").trim(),
    areaM2: Number.isFinite(areaM2) ? areaM2 : null,
    landUseZone: String(row.land_use_zone_name_1 || "").trim(),
    landUseSituation: String(row.land_use_situation_name || "").trim(),
    terrainHeight: String(row.terrain_height_name || "").trim(),
    terrainShape: String(row.terrain_shape_name || "").trim(),
    roadSide: String(row.road_side_name || "").trim(),
    publishedLandPrice: Number.isFinite(publishedLandPrice) ? publishedLandPrice : null,
    standardYear: String(row.standard_year || "").trim(),
    standardMonth,
    lastUpdatedAt: String(row.source_standard_date || "").trim()
  };
}

async function loadOfflineLandPossession(pnu)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  const response = await supabaseAdminFetch(
    `/rest/v1/realjeju_land_ownership_current?select=pnu,ownership_code,ownership_name,owner_count,ownership_change_date,ownership_change_reason,source_standard_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&limit=1`
  );
  if (!response || !response.ok) {
    if (response) {
      console.warn("[parcel-boundary-by-point] offline ownership lookup failed:", response.status);
    }
    return null;
  }
  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || String(row.pnu || "").trim() !== normalizedPnu) return null;
  const sharedOwnerCount = Number(row.owner_count);
  return {
    pnu: normalizedPnu,
    ownershipCode: String(row.ownership_code || "").trim(),
    ownershipType: String(row.ownership_name || "").trim(),
    sharedOwnerCount: Number.isFinite(sharedOwnerCount) ? sharedOwnerCount : null,
    ownershipChangeDate: String(row.ownership_change_date || "").trim(),
    ownershipChangeReason: String(row.ownership_change_reason || "").trim(),
    lastUpdatedAt: String(row.source_standard_date || "").trim()
  };
}

async function loadOfflineLandMoves(pnu)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return [];
  const response = await supabaseAdminFetch(
    `/rest/v1/realjeju_land_movements_current?select=movement_date,movement_reason,movement_reason_code,area_m2,jimok_name,source_standard_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=movement_date.desc.nullslast&limit=100`
  );
  if (!response || !response.ok) {
    if (response) {
      console.warn("[parcel-boundary-by-point] offline land-movement lookup failed:", response.status);
    }
    return null;
  }
  const rows = await response.json().catch(() => []);
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    movedAt: String(row.movement_date || "").trim(),
    reason: String(row.movement_reason || "").trim(),
    reasonCode: String(row.movement_reason_code || "").trim(),
    areaM2: Number.isFinite(Number(row.area_m2)) ? Number(row.area_m2) : null,
    jimok: String(row.jimok_name || "").trim(),
    lastUpdatedAt: String(row.source_standard_date || "").trim()
  }));
}

async function loadParcelMasterBoundaryByPointRpc(lat, lng)
{
  const normalizedLat = normalizeCoordinate(lat);
  const normalizedLng = normalizeCoordinate(lng);
  if (normalizedLat === null || normalizedLng === null) return null;
  const response = await supabaseAdminFetch(
    "/rest/v1/rpc/find_jeju_parcel_by_point",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p_lng: normalizedLng, p_lat: normalizedLat })
    }
  );
  if (!response || !response.ok) {
    if (response) {
      console.warn("[parcel-boundary-by-point] parcel point RPC failed:", response.status);
    }
    return null;
  }

  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  const pnu = String(row && row.pnu || "").trim();
  if (!/^\d{19}$/.test(pnu) || !row.geometry) return null;
  const representativeLng = Number(row.lng);
  const representativeLat = Number(row.lat);
  const sourceVersion = String(row.source_version || "").trim();
  return {
    pnu,
    geometry: row.geometry,
    lng: Number.isFinite(representativeLng) ? representativeLng : normalizedLng,
    lat: Number.isFinite(representativeLat) ? representativeLat : normalizedLat,
    sourceVersion,
    source_version: sourceVersion
  };
}

function parcelWorkerAuthorized(req)
{
	const expected = String(process.env.REALJEJU_WORKER_SECRET || "").trim();
	const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
	const headerToken = String(req && req.headers && req.headers["x-realjeju-worker-secret"] || "").trim();
	const bearerToken = String(req && req.headers && req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
	return Boolean(
		(expected && (headerToken === expected || bearerToken === expected))
		|| (serviceRoleKey && bearerToken === serviceRoleKey)
	);
}

function boundaryCoordinateBounds(geometry)
{
	const bounds = { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity };
	const visit = (value) => {
		if (!Array.isArray(value)) return;
		if (value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
			const lng = Number(value[0]);
			const lat = Number(value[1]);
			bounds.minLng = Math.min(bounds.minLng, lng);
			bounds.maxLng = Math.max(bounds.maxLng, lng);
			bounds.minLat = Math.min(bounds.minLat, lat);
			bounds.maxLat = Math.max(bounds.maxLat, lat);
			return;
		}
		value.forEach(visit);
	};
	visit(geometry && geometry.coordinates);
	return Number.isFinite(bounds.minLng) ? bounds : null;
}

function pointInBoundaryRing(ring, lng, lat)
{
	if (!Array.isArray(ring) || ring.length < 3) return false;
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const xi = Number(ring[i] && ring[i][0]);
		const yi = Number(ring[i] && ring[i][1]);
		const xj = Number(ring[j] && ring[j][0]);
		const yj = Number(ring[j] && ring[j][1]);
		if (![xi, yi, xj, yj].every(Number.isFinite)) continue;
		const intersects = ((yi > lat) !== (yj > lat))
			&& (lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi);
		if (intersects) inside = !inside;
	}
	return inside;
}

function cachedBoundaryContainsPoint(parcel, lng, lat)
{
	const geometry = parcel && parcel.geometry;
	if (!geometry || !Array.isArray(geometry.coordinates)) return false;
	const polygonContains = (polygon) => Array.isArray(polygon)
		&& pointInBoundaryRing(polygon[0], lng, lat)
		&& !polygon.slice(1).some((hole) => pointInBoundaryRing(hole, lng, lat));
	if (geometry.type === "Polygon") return polygonContains(geometry.coordinates);
	if (geometry.type === "MultiPolygon") return geometry.coordinates.some(polygonContains);
	return false;
}

async function loadParcelMasterBoundaryByPnu(pnu)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;

  const response = await supabaseAdminFetch(
    `/rest/v1/jeju_parcels?select=pnu,lng,lat,source_version&pnu=eq.${encodeURIComponent(normalizedPnu)}&limit=1`
  );
  if (!response || !response.ok) return null;
  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || String(row.pnu || "").trim() !== normalizedPnu) return null;

  const representativeLng = Number(row.lng);
  const representativeLat = Number(row.lat);
  return {
    pnu: normalizedPnu,
    lng: Number.isFinite(representativeLng) ? representativeLng : null,
    lat: Number.isFinite(representativeLat) ? representativeLat : null,
    geometry: null,
    source: "jeju_parcels",
    sourceVersion: String(row.source_version || "").trim()
  };
}

async function loadParcelMasterBoundary(lat, lng)
{
  const response = await supabaseAdminFetch("/rest/v1/rpc/find_jeju_parcel_by_point", {
    method: "POST",
    body: JSON.stringify({
      p_lng: Number(lng),
      p_lat: Number(lat)
    })
  });
  if (!response || !response.ok) return null;
  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  const pnu = String(row && row.pnu || "").trim();
  if (!pnu || !row || !row.geometry) return null;

  let geometry = row.geometry;
  if (typeof geometry === "string") {
    try {
      geometry = JSON.parse(geometry);
    } catch (_) {
      return null;
    }
  }
  if (!geometry || !["Polygon", "MultiPolygon"].includes(String(geometry.type || ""))) {
    return null;
  }

  const representativeLng = Number(row.lng);
  const representativeLat = Number(row.lat);
  return {
    pnu,
    lng: Number.isFinite(representativeLng) ? representativeLng : Number(lng),
    lat: Number.isFinite(representativeLat) ? representativeLat : Number(lat),
    geometry,
    source: "jeju_parcels",
    sourceVersion: String(row.source_version || "").trim()
  };
}

async function loadPermanentBoundary(pointKey, lat, lng)
{
  if (!pointKey) return null;
  const query = new URLSearchParams({
    select: "payload",
    point_key: `eq.${pointKey}`,
    order: "updated_at.desc",
    limit: "1"
  });
  const response = await supabaseAdminFetch(`/rest/v1/${PARCEL_BOUNDARY_POINT_CACHE_TABLE}?${query.toString()}`);
  if (!response || !response.ok) return null;
  const rows = await response.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (row && row.payload) return row.payload;

  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return null;
  const bboxQuery = new URLSearchParams({
    select: "payload",
    min_lng: `lte.${Number(lng)}`,
    max_lng: `gte.${Number(lng)}`,
    min_lat: `lte.${Number(lat)}`,
    max_lat: `gte.${Number(lat)}`,
    order: "updated_at.desc",
    limit: "20"
  });
  const bboxResponse = await supabaseAdminFetch(`/rest/v1/${PARCEL_BOUNDARY_POINT_CACHE_TABLE}?${bboxQuery.toString()}`);
  if (!bboxResponse || !bboxResponse.ok) return null;
  const bboxRows = await bboxResponse.json().catch(() => []);
  const matched = (Array.isArray(bboxRows) ? bboxRows : []).find((candidate) =>
    candidate && candidate.payload && cachedBoundaryContainsPoint(candidate.payload, Number(lng), Number(lat))
  );
  return matched && matched.payload ? matched.payload : null;
}

async function storePermanentBoundary(pointKey, parcel)
{
  if (!pointKey || !parcel || !/^\d{19}$/.test(String(parcel.pnu || ""))) return;
  const bounds = boundaryCoordinateBounds(parcel.geometry);
  const row = {
    point_key: pointKey,
    pnu: String(parcel.pnu),
    payload: parcel,
    min_lng: bounds ? bounds.minLng : null,
    max_lng: bounds ? bounds.maxLng : null,
    min_lat: bounds ? bounds.minLat : null,
    max_lat: bounds ? bounds.maxLat : null,
    expires_at: new Date(Date.now() + PARCEL_INFORMATION_CACHE_POLICY.boundary.completeTtlMs).toISOString(),
    updated_at: new Date().toISOString()
  };
  const response = await supabaseAdminFetch(
    `/rest/v1/${PARCEL_BOUNDARY_POINT_CACHE_TABLE}?on_conflict=point_key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify([row])
    }
  );
  if (response && !response.ok) console.warn("[parcel boundary point cache] store failed:", response.status);
}

async function loadPermanentParcelInformation(pnu)
{
  const result = new Map();
  if (!/^\d{19}$/.test(String(pnu || ""))) return result;
  const query = new URLSearchParams({
    select: "data_type,payload,cache_status,expires_at",
    pnu: `eq.${pnu}`,
    data_type: `in.(${PARCEL_INFORMATION_CACHE_TYPES.join(",")})`
  });
  const response = await supabaseAdminFetch(`/rest/v1/${PARCEL_INFORMATION_CACHE_TABLE}?${query.toString()}`);
  if (!response || !response.ok) return result;
  const rows = await response.json().catch(() => []);
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row && row.data_type && isUsablePermanentCacheRow(row)) {
      result.set(String(row.data_type), row.payload || {});
    }
  }
  return result;
}

function normalizePermanentCacheStatus(payload)
{
  const status = String(payload && payload.status ? payload.status : "").trim().toLowerCase();
  if (["not-found", "not_found", "empty", "no_data"].includes(status)) return "not_found";
  if (/(error|fail|timeout|unavailable|invalid|unauthor)/.test(status)) return null;
  return "complete";
}

function getPermanentCacheExpiresAt(dataType, cacheStatus)
{
  const policy = PARCEL_INFORMATION_CACHE_POLICY[dataType];
  if (!policy) return null;
  const ttlMs = cacheStatus === "not_found" ? policy.notFoundTtlMs : policy.completeTtlMs;
  return new Date(Date.now() + ttlMs).toISOString();
}

function isUsablePermanentCacheRow(row)
{
  return Boolean(row && row.payload && ["complete", "not_found"].includes(String(row.cache_status || "")));
}

async function storePermanentParcelInformation(rows)
{
  const validRows = (Array.isArray(rows) ? rows : []).filter((row) =>
    row
      && /^\d{19}$/.test(String(row.pnu || ""))
      && Object.prototype.hasOwnProperty.call(PARCEL_INFORMATION_CACHE_POLICY, String(row.data_type || ""))
      && row.payload
  );
  if (!validRows.length) return;
  const preparedRows = validRows.map((row) => {
    const dataType = String(row.data_type);
    const cacheStatus = normalizePermanentCacheStatus(row.payload);
    if (!cacheStatus) return null;
    return {
      pnu: String(row.pnu),
      data_type: dataType,
      point_key: row.point_key ? String(row.point_key) : null,
      payload: row.payload,
      source: String(row.source || "vworld"),
      cache_status: cacheStatus,
      expires_at: getPermanentCacheExpiresAt(dataType, cacheStatus),
      updated_at: new Date().toISOString()
    };
  }).filter(Boolean);
  if (!preparedRows.length) return;
  const response = await supabaseAdminFetch(
    `/rest/v1/${PARCEL_INFORMATION_CACHE_TABLE}?on_conflict=pnu,data_type`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(preparedRows)
    }
  );
  if (response && !response.ok) {
    console.warn("[parcel permanent cache] store failed:", response.status);
  }
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

function normalizeParcelDisplayJibun(value)
{
	return String(value || "").trim().replace(/(\d)\s*[가-힣]+$/u, "$1").trim();
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
		jibun: normalizeParcelDisplayJibun(source.jibun),
		jimok: String(source.jimok || "").trim()
	};
}

function calculateGeoJsonAreaM2(geometry)
{
	if (!geometry || !Array.isArray(geometry.coordinates)) return null;
	const polygons = geometry.type === "Polygon"
		? [geometry.coordinates]
		: (geometry.type === "MultiPolygon" ? geometry.coordinates : []);
	if (!polygons.length) return null;
	const earthRadius = 6378137;
	const toRadians = (value) => Number(value) * Math.PI / 180;
	const ringArea = (ring) => {
		if (!Array.isArray(ring) || ring.length < 3) return 0;
		let area = 0;
		for (let index = 0; index < ring.length; index += 1) {
			const current = ring[index];
			const next = ring[(index + 1) % ring.length];
			if (!Array.isArray(current) || !Array.isArray(next)) continue;
			area += (toRadians(next[0]) - toRadians(current[0]))
				* (2 + Math.sin(toRadians(current[1])) + Math.sin(toRadians(next[1])));
		}
		return Math.abs(area * earthRadius * earthRadius / 2);
	};
	const areaM2 = polygons.reduce((total, polygon) => {
		if (!Array.isArray(polygon) || !polygon.length) return total;
		const outerArea = ringArea(polygon[0]);
		const holeArea = polygon.slice(1).reduce((sum, ring) => sum + ringArea(ring), 0);
		return total + Math.max(0, outerArea - holeArea);
	}, 0);
	return Number.isFinite(areaM2) && areaM2 > 0 ? areaM2 : null;
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
		areaM2: calculateGeoJsonAreaM2(feature.geometry),
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

function getLandCharacteristicsContainer(payload)
{
	if (!payload || typeof payload !== "object") return null;
	return payload.landCharacteristicss
		|| payload.landCharacteristics
		|| (payload.response && payload.response.body)
		|| payload;
}

function getLandCharacteristicsRows(payload)
{
	const container = getLandCharacteristicsContainer(payload);
	if (!container || typeof container !== "object") return [];
	const items = container.field
		|| container.fields
		|| (container.items && container.items.item)
		|| container.item
		|| [];
	return Array.isArray(items) ? items : (items && typeof items === "object" ? [items] : []);
}

function normalizeLandCharacteristics(payload)
{
	const container = getLandCharacteristicsContainer(payload);
	const resultCode = String(
		(container && (container.resultCode || container.code))
		|| payload.resultCode
		|| ""
	).trim();
	if (resultCode && !["0", "00", "SUCCESS"].includes(resultCode.toUpperCase())) {
		const error = new Error(`VWORLD_LAND_CHARACTERISTICS_${resultCode}`);
		error.upstreamCode = resultCode;
		throw error;
	}
	const rows = getLandCharacteristicsRows(payload);
	if (!rows.length) return null;
	const row = rows.slice().sort((a, b) => {
		const aKey = `${String(a.stdrYear || "").padStart(4, "0")}${String(a.stdrMt || "").padStart(2, "0")}`;
		const bKey = `${String(b.stdrYear || "").padStart(4, "0")}${String(b.stdrMt || "").padStart(2, "0")}`;
		return bKey.localeCompare(aKey);
	})[0];
	const secondaryZone = String(row.prposArea2Nm || "").trim();
	const hasSecondaryZone = secondaryZone && !/^(지정되지\s*않음|미지정|없음|-)$/.test(secondaryZone);
	const areaM2 = Number(row.lndpclAr);
	const publishedLandPrice = Number(row.pblntfPclnd);
	return {
		pnu: String(row.pnu || "").trim(),
		legalDongName: String(row.ldCodeNm || "").trim(),
		jibun: String(row.mnnmSlno || "").trim(),
		jimok: String(row.lndcgrCodeNm || "").trim(),
		areaM2: Number.isFinite(areaM2) ? areaM2 : null,
		landUseZone: [String(row.prposArea1Nm || "").trim(), hasSecondaryZone ? secondaryZone : ""].filter(Boolean).join(", "),
		landUseSituation: String(row.ladUseSittnNm || "").trim(),
		terrainHeight: String(row.tpgrphHgCodeNm || "").trim(),
		terrainShape: String(row.tpgrphFrmCodeNm || "").trim(),
		roadSide: String(row.roadSideCodeNm || "").trim(),
		publishedLandPrice: Number.isFinite(publishedLandPrice) ? publishedLandPrice : null,
		standardYear: String(row.stdrYear || "").trim(),
		standardMonth: String(row.stdrMt || "").trim(),
		lastUpdatedAt: String(row.lastUpdtDt || "").trim()
	};
}

async function fetchLandCharacteristics(apiKey, apiDomain, pnu)
{
	if (!pnu) return null;
	const requestUrl = new URL(VWORLD_LAND_CHARACTERISTICS_URL);
	requestUrl.searchParams.set("pnu", pnu);
	requestUrl.searchParams.set("format", "json");
	requestUrl.searchParams.set("numOfRows", "100");
	requestUrl.searchParams.set("pageNo", "1");
	requestUrl.searchParams.set("key", apiKey);
	requestUrl.searchParams.set("domain", apiDomain);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), VWORLD_LAND_CHARACTERISTICS_TIMEOUT_MS);
	try {
		const response = await fetch(requestUrl, {
			headers: {
				Accept: "application/json",
				Referer: apiDomain,
				"User-Agent": "REALJEJU-Land-Characteristics/1.0"
			},
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`);
		const responseText = String(await response.text()).replace(/^\uFEFF/, "").trim();
		if (!responseText) throw new Error("EMPTY_UPSTREAM_RESPONSE");
		return normalizeLandCharacteristics(JSON.parse(responseText));
	} finally {
		clearTimeout(timeoutId);
	}
}

function getLandPossessionContainer(payload)
{
	if (!payload || typeof payload !== "object") return null;
	return payload.possessions
		|| payload.possession
		|| (payload.response && payload.response.body)
		|| payload;
}

function getLandPossessionRows(payload)
{
	const container = getLandPossessionContainer(payload);
	if (!container || typeof container !== "object") return [];
	const items = container.field
		|| container.fields
		|| (container.items && container.items.item)
		|| container.item
		|| [];
	return Array.isArray(items) ? items : (items && typeof items === "object" ? [items] : []);
}

function normalizeLandPossession(payload)
{
	const container = getLandPossessionContainer(payload);
	const resultCode = String(
		(container && (container.resultCode || container.code))
		|| payload.resultCode
		|| ""
	).trim();
	if (resultCode && !["0", "00", "SUCCESS"].includes(resultCode.toUpperCase())) {
		const error = new Error(`VWORLD_LAND_POSSESSION_${resultCode}`);
		error.upstreamCode = resultCode;
		throw error;
	}
	const rows = getLandPossessionRows(payload);
	if (!rows.length) return null;
	const row = rows.slice().sort((a, b) => {
		const aKey = `${String(a.ownshipChgDe || "")}|${String(a.stdrYm || "")}|${String(a.lastUpdtDt || "")}`;
		const bKey = `${String(b.ownshipChgDe || "")}|${String(b.stdrYm || "")}|${String(b.lastUpdtDt || "")}`;
		return bKey.localeCompare(aKey);
	})[0];
	const sharedOwnerCount = Number(row.cnrsPsnCo);
	return {
		pnu: String(row.pnu || "").trim(),
		ownershipType: String(row.posesnSeCodeNm || "").trim(),
		ownershipTypeCode: String(row.posesnSeCode || "").trim(),
		ownershipChangeDate: String(row.ownshipChgDe || "").trim(),
		ownershipChangeCause: String(row.ownshipChgCauseCodeNm || "").trim(),
		ownershipChangeCauseCode: String(row.ownshipChgCauseCode || "").trim(),
		sharedOwnerCount: Number.isFinite(sharedOwnerCount) ? sharedOwnerCount : null,
		standardYearMonth: String(row.stdrYm || "").trim(),
		lastUpdatedAt: String(row.lastUpdtDt || "").trim()
	};
}

async function fetchLandPossession(apiKey, apiDomain, pnu)
{
	if (!pnu) return null;
	const requestUrl = new URL(VWORLD_LAND_POSSESSION_URL);
	requestUrl.searchParams.set("pnu", pnu);
	requestUrl.searchParams.set("format", "json");
	requestUrl.searchParams.set("numOfRows", "100");
	requestUrl.searchParams.set("pageNo", "1");
	requestUrl.searchParams.set("key", apiKey);
	requestUrl.searchParams.set("domain", apiDomain);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), VWORLD_LAND_POSSESSION_TIMEOUT_MS);
	try {
		const response = await fetch(requestUrl, {
			headers: {
				Accept: "application/json",
				Referer: apiDomain,
				"User-Agent": "REALJEJU-Land-Possession/1.0"
			},
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`UPSTREAM_HTTP_${response.status}`);
		const responseText = String(await response.text()).replace(/^\uFEFF/, "").trim();
		if (!responseText) throw new Error("EMPTY_UPSTREAM_RESPONSE");
		return normalizeLandPossession(JSON.parse(responseText));
	} finally {
		clearTimeout(timeoutId);
	}
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

function getVworldAttributeContainer(payload, names) {
  if (Array.isArray(payload?.__realjejuRows)) return payload;
  for (const name of names) {
    if (payload?.[name] && typeof payload[name] === "object") return payload[name];
  }
  return payload?.response?.body || payload?.response || null;
}

function getVworldAttributeRows(container) {
  const rawRows =
    container?.__realjejuRows ||
    container?.field ||
    container?.fields ||
    container?.items?.item ||
    container?.items ||
    container?.data ||
    [];
  return Array.isArray(rawRows) ? rawRows : rawRows ? [rawRows] : [];
}

function assertVworldAttributeResult(payload, container, fallbackMessage) {
  const resultCode = String(
    container?.resultCode ?? payload?.resultCode ?? payload?.response?.header?.resultCode ?? ""
  ).trim();
  if (resultCode && !["0", "00", "000"].includes(resultCode)) {
    throw new Error(
      String(
        container?.resultMsg ||
        payload?.resultMsg ||
        payload?.response?.header?.resultMsg ||
        fallbackMessage
      )
    );
  }
}

function isNationalPlanningLandUseRecord(districtCode, districtName) {
  return (
    /^UQ/i.test(districtCode) ||
    /용도지역|용도지구|용도구역|녹지지역|주거지역|상업지역|공업지역|관리지역|농림지역|자연환경보전지역|취락지구|개발진흥지구|고도지구|방화지구|방재지구|보호지구|경관지구|복합용도지구|성장관리계획구역|도시지역|토지거래계약에관한허가구역/.test(
      districtName
    )
  );
}

function normalizeLandUsePlan(payload) {
  const container = getVworldAttributeContainer(payload, ["landUses", "landUse"]);
  if (!container) return [];
  assertVworldAttributeResult(payload, container, "토지이용계획정보 조회에 실패했습니다.");
  const seen = new Set();

  return getVworldAttributeRows(container).reduce((result, row) => {
    const relationCode = String(row?.cnflcAt ?? "").trim();
    const rawRelation = String(row?.cnflcAtNm ?? "").trim();
    const relationByCode = { "1": "포함", "2": "저촉", "3": "접합" };
    const relation = relationByCode[relationCode] || (rawRelation === "접함" ? "접합" : rawRelation);
    const districtCode = String(row?.prposAreaDstrcCode ?? "").trim();
    const districtName = String(row?.prposAreaDstrcCodeNm ?? "").trim();
    if (!relation || !districtName) return result;
    const key = `${relation}|${districtCode}|${districtName}`;
    if (seen.has(key)) return result;
    seen.add(key);
    result.push({
      relationCode,
      relation,
      districtCode,
      districtName,
      lawGroup: isNationalPlanningLandUseRecord(districtCode, districtName)
        ? "national-planning"
        : "other",
      registeredAt: String(row?.registDt ?? "").trim(),
      lastUpdatedAt: String(row?.lastUpdtDt ?? "").trim()
    });
    return result;
  }, []);
}

function normalizeIndividualLandPrices(payload) {
  const container = getVworldAttributeContainer(payload, ["indvdLandPrices", "individualLandPrices"]);
  if (!container) return [];
  assertVworldAttributeResult(payload, container, "개별공시지가정보 조회에 실패했습니다.");
  const seen = new Set();

  return getVworldAttributeRows(container)
    .reduce((result, row) => {
      const year = String(row?.stdrYear ?? "").trim();
      const month = String(row?.stdrMt ?? "01").trim().padStart(2, "0");
      const pricePerSquareMeter = Number(row?.pblntfPclnd ?? 0);
      if (!/^\d{4}$/.test(year) || !Number.isFinite(pricePerSquareMeter) || pricePerSquareMeter <= 0) {
        return result;
      }
      const key = `${year}.${month}`;
      if (seen.has(key)) return result;
      seen.add(key);
      result.push({
        year,
        month,
        pricePerSquareMeter,
        announcedAt: String(row?.pblntfDe ?? "").trim(),
        standardLand: String(row?.stdLandAt ?? "").trim(),
        lastUpdatedAt: String(row?.lastUpdtDt ?? "").trim()
      });
      return result;
    }, [])
    .sort((left, right) => Number(`${right.year}${right.month}`) - Number(`${left.year}${left.month}`))
    .slice(0, 20);
}

function normalizeIndividualHousingPrices(payload) {
  const container = getVworldAttributeContainer(payload, ["indvdHousingPrices", "individualHousingPrices"]);
  if (!container) return [];
  assertVworldAttributeResult(payload, container, "개별주택가격정보 조회에 실패했습니다.");
  const seen = new Set();

  return getVworldAttributeRows(container)
    .reduce((result, row) => {
      const year = String(row?.stdrYear ?? "").trim();
      const month = String(row?.stdrMt ?? "01").trim().padStart(2, "0");
      const housePrice = Number(row?.housePc ?? 0);
      if (!/^\d{4}$/.test(year) || !Number.isFinite(housePrice) || housePrice <= 0) return result;
      const key = `${year}.${month}|${String(row?.bildRegstrEsntlNo ?? "").trim()}`;
      if (seen.has(key)) return result;
      seen.add(key);
      const landRegisterAreaM2 = Number(row?.ladRegstrAr);
      const calculatedLandAreaM2 = Number(row?.calcPlotAr);
      const totalBuildingAreaM2 = Number(row?.buldAllTotAr);
      const calculatedBuildingAreaM2 = Number(row?.buldCalcTotAr);
      result.push({
        year,
        month,
        housePrice,
        buildingRegisterKey: String(row?.bildRegstrEsntlNo ?? "").trim(),
        dongCode: String(row?.dongCode ?? "").trim(),
        landRegisterAreaM2: Number.isFinite(landRegisterAreaM2) ? landRegisterAreaM2 : null,
        calculatedLandAreaM2: Number.isFinite(calculatedLandAreaM2) ? calculatedLandAreaM2 : null,
        totalBuildingAreaM2: Number.isFinite(totalBuildingAreaM2) ? totalBuildingAreaM2 : null,
        calculatedBuildingAreaM2: Number.isFinite(calculatedBuildingAreaM2) ? calculatedBuildingAreaM2 : null,
        lastUpdatedAt: String(row?.lastUpdtDt ?? "").trim()
      });
      return result;
    }, [])
    .sort((left, right) => Number(`${right.year}${right.month}`) - Number(`${left.year}${left.month}`))
    .slice(0, 20);
}

async function fetchVworldAttributeJson(endpoint, apiKey, apiDomain, pnu) {
  const pageSize = 1000;
  const allRows = [];
  let firstPayload = null;
  for (let pageNo = 1; pageNo <= 100; pageNo += 1) {
    const query = new URLSearchParams({
      pnu,
      format: "json",
      numOfRows: String(pageSize),
      pageNo: String(pageNo),
      key: apiKey
    });
    if (apiDomain) query.set("domain", apiDomain);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(`https://api.vworld.kr/ned/data/${endpoint}?${query.toString()}`, {
        headers: { Accept: "application/json", "User-Agent": "REALJEJU/1.0" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`VWorld 속성정보 응답 오류(${response.status})`);
      const payload = await response.json();
      if (!firstPayload) firstPayload = payload;
      const container = getVworldAttributeContainer(payload, [
        "landUses", "landUse", "landMoves", "landMove", "indvdLandPrices",
        "individualLandPrices", "indvdHousingPrices", "individualHousingPrices"
      ]);
      assertVworldAttributeResult(payload, container, "VWorld 속성정보 조회에 실패했습니다.");
      const pageRows = getVworldAttributeRows(container);
      const totalCount = Number(container?.totalCount ?? payload?.totalCount ?? pageRows.length);
      allRows.push(...pageRows);
      if (pageRows.length < pageSize || allRows.length >= totalCount) break;
    } finally {
      clearTimeout(timer);
    }
  }
  return { ...(firstPayload || {}), __realjejuRows: allRows };
}

function normalizeLandMoves(payload) {
  const container = getVworldAttributeContainer(payload, ["landMoves", "landMove"]);
  if (!container) return [];
  assertVworldAttributeResult(payload, container, "토지이동이력정보 조회에 실패했습니다.");
  const seen = new Set();
  return getVworldAttributeRows(container).reduce((result, row) => {
    const movedAt = String(row?.ladMvmnDe ?? "").trim();
    const reason = String(row?.ladMvmnPrvonshCodeNm ?? "").trim();
    const reasonCode = String(row?.ladMvmnPrvonshCode ?? "").trim();
    if (!movedAt && !reason) return result;
    const key = `${movedAt}|${reasonCode}|${reason}`;
    if (seen.has(key)) return result;
    seen.add(key);
    const areaM2 = Number(row?.lndpclAr);
    result.push({
      movedAt,
      reason,
      reasonCode,
      areaM2: Number.isFinite(areaM2) ? areaM2 : null,
      jimok: String(row?.lndcgrCodeNm ?? "").trim(),
      erasedAt: String(row?.ladMvmnErsrDe ?? "").trim(),
      lastUpdatedAt: String(row?.lastUpdtDt ?? "").trim()
    });
    return result;
  }, []).sort((left, right) => String(left.movedAt).localeCompare(String(right.movedAt)));
}

async function fetchLandUsePlan(apiKey, apiDomain, pnu) {
  return normalizeLandUsePlan(
    await fetchVworldAttributeJson("getLandUseAttr", apiKey, apiDomain, pnu)
  );
}

async function fetchLandMoves(apiKey, apiDomain, pnu) {
  return normalizeLandMoves(
    await fetchVworldAttributeJson("getLandMoveAttr", apiKey, apiDomain, pnu)
  );
}

async function fetchIndividualLandPrices(apiKey, apiDomain, pnu) {
  return normalizeIndividualLandPrices(
    await fetchVworldAttributeJson("getIndvdLandPriceAttr", apiKey, apiDomain, pnu)
  );
}

async function fetchIndividualHousingPrices(apiKey, apiDomain, pnu) {
  return normalizeIndividualHousingPrices(
    await fetchVworldAttributeJson("getIndvdHousingPriceAttr", apiKey, apiDomain, pnu)
  );
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

	const refreshRequested = ["1", "true", "yes"].includes(String(req.query && req.query.refresh || "").trim().toLowerCase());
	const requestedPnu = String(req.query && req.query.pnu || "").trim();
	if (refreshRequested && !parcelWorkerAuthorized(req)) {
		res.setHeader("Cache-Control", "no-store");
		res.status(403).json({ ok: false, code: "WORKER_AUTH_REQUIRED" });
		return;
	}
	if (requestedPnu && !/^\d{19}$/.test(requestedPnu)) {
		res.setHeader("Cache-Control", "no-store");
		res.status(400).json({ ok: false, code: "INVALID_PNU" });
		return;
	}
	if (requestedPnu && !parcelWorkerAuthorized(req)) {
		res.setHeader("Cache-Control", "no-store");
		res.status(403).json({ ok: false, code: "WORKER_AUTH_REQUIRED" });
		return;
	}
	const apiKey = normalizeApiKey(process.env.VWORLD_API_KEY);
	if (refreshRequested && !apiKey) {
		res.setHeader("Cache-Control", "no-store");
		res.status(503).json({ ok: false, code: "VWORLD_KEY_NOT_CONFIGURED" });
		return;
	}
	const apiDomain = normalizeVworldApiDomain(process.env.VWORLD_API_DOMAIN);

	try {
		const parcel = requestedPnu
				? await loadParcelMasterBoundaryByPnu(requestedPnu)
				: await loadParcelMasterBoundaryByPointRpc(lat, lng);
		if (!parcel) {
			res.setHeader("Cache-Control", "public, max-age=30, s-maxage=60");
			res.status(404).json({ ok: false, code: "PARCEL_NOT_FOUND" });
			return;
		}
		let landCharacteristics = null;
		let landCharacteristicsStatus = "unavailable";
		let landPossession = null;
		let landPossessionStatus = "unavailable";
		let landUsePlan = [];
  let landUsePlanStatus = "unavailable";
  let landMoves = [];
  let landMovesStatus = "unavailable";
  let individualLandPrices = [];
  let individualLandPricesStatus = "unavailable";
  let individualHousingPrices = [];
  let individualHousingPricesStatus = "unavailable";
	  const [permanentCache, offlineLandUsePlan, offlineLandBasic, offlineLandPossession, offlineLandMoves] = await Promise.all([
	    loadPermanentParcelInformation(parcel.pnu),
	    loadOfflineLandUsePlan(parcel.pnu),
	    loadOfflineLandBasic(parcel.pnu),
	    loadOfflineLandPossession(parcel.pnu),
	    loadOfflineLandMoves(parcel.pnu)
	  ]);
	  const permanentWrites = [];

  // Boundary geometry and property datasets are independent. A parcel polygon
  // must be returned whenever its boundary lookup succeeds, even when
  // land_basic or every detailed property dataset is still not_loaded.
	  const propertyInformationAvailable = PARCEL_INFORMATION_CACHE_TYPES.some(
	    (dataType) => permanentCache.has(dataType)
	  ) || (Array.isArray(offlineLandUsePlan) && offlineLandUsePlan.length > 0)
	    || Boolean(offlineLandBasic)
	    || Boolean(offlineLandPossession)
	    || (Array.isArray(offlineLandMoves) && offlineLandMoves.length > 0);

	  if (permanentCache.has(PARCEL_CACHE_TYPE.LAND_BASIC)) {
	    const cached = permanentCache.get(PARCEL_CACHE_TYPE.LAND_BASIC) || {};
	    landCharacteristics = cached.value || null;
	    landCharacteristicsStatus = String(cached.status || (landCharacteristics ? "available" : "not-found"));
	  }
	  if (offlineLandBasic) {
	    landCharacteristics = offlineLandBasic;
	    landCharacteristicsStatus = "available";
	    permanentCache.set(PARCEL_CACHE_TYPE.LAND_BASIC, {
	      value: landCharacteristics,
	      status: landCharacteristicsStatus
	    });
	  }
  if (permanentCache.has(PARCEL_CACHE_TYPE.OWNERSHIP)) {
    const cached = permanentCache.get(PARCEL_CACHE_TYPE.OWNERSHIP) || {};
    landPossession = cached.value || null;
    landPossessionStatus = String(cached.status || (landPossession ? "available" : "not-found"));
  }
	  if (offlineLandPossession) {
	    landPossession = offlineLandPossession;
	    landPossessionStatus = "available";
	    permanentCache.set(PARCEL_CACHE_TYPE.OWNERSHIP, {
	      value: landPossession,
	      status: landPossessionStatus
	    });
	  }
	  if (permanentCache.has(PARCEL_CACHE_TYPE.LAND_USE)) {
	    const cached = permanentCache.get(PARCEL_CACHE_TYPE.LAND_USE) || {};
	    landUsePlan = Array.isArray(cached.items) ? cached.items : [];
	    landUsePlanStatus = String(cached.status || (landUsePlan.length ? "ok" : "not-found"));
	  }
	  if (Array.isArray(offlineLandUsePlan)) {
	    landUsePlan = offlineLandUsePlan;
	    landUsePlanStatus = landUsePlan.length ? "ok" : "not-found";
	    const offlineAddress = String(offlineLandUsePlan.address || "").trim();
	    const offlineJibun = String(offlineLandUsePlan.jibun || "").trim();
	    const offlineLegalDongName = String(offlineLandUsePlan.legalDongName || "").trim();
	    if (offlineAddress) parcel.address = offlineAddress;
	    if (offlineJibun) parcel.jibun = offlineJibun;
	    if (offlineLegalDongName) parcel.legalDongName = offlineLegalDongName;
	    const includedPlanningZone = landUsePlan.find((item) => (
	      item && item.lawGroup === "national-planning" && item.relation === "포함"
	    ));
	    if (includedPlanningZone) parcel.landUseZone = String(includedPlanningZone.districtName || "").trim();
	    permanentCache.set(PARCEL_CACHE_TYPE.LAND_USE, {
	      items: landUsePlan,
	      status: landUsePlanStatus
	    });
	  }
  if (permanentCache.has(PARCEL_CACHE_TYPE.LAND_MOVEMENT)) {
    const cached = permanentCache.get(PARCEL_CACHE_TYPE.LAND_MOVEMENT) || {};
    landMoves = Array.isArray(cached.items) ? cached.items : [];
    landMovesStatus = String(cached.status || (landMoves.length ? "ok" : "not-found"));
  }
	  if (Array.isArray(offlineLandMoves)) {
	    landMoves = offlineLandMoves;
	    landMovesStatus = landMoves.length ? "ok" : "not-found";
	    permanentCache.set(PARCEL_CACHE_TYPE.LAND_MOVEMENT, {
	      items: landMoves,
	      status: landMovesStatus
	    });
	  }
  if (permanentCache.has(PARCEL_CACHE_TYPE.INDIVIDUAL_LAND_PRICES)) {
    const cached = permanentCache.get(PARCEL_CACHE_TYPE.INDIVIDUAL_LAND_PRICES) || {};
    individualLandPrices = Array.isArray(cached.items) ? cached.items : [];
    individualLandPricesStatus = String(cached.status || (individualLandPrices.length ? "ok" : "not-found"));
  }
  if (permanentCache.has(PARCEL_CACHE_TYPE.INDIVIDUAL_HOUSING_PRICES)) {
    const cached = permanentCache.get(PARCEL_CACHE_TYPE.INDIVIDUAL_HOUSING_PRICES) || {};
    individualHousingPrices = Array.isArray(cached.items) ? cached.items : [];
    individualHousingPricesStatus = String(cached.status || (individualHousingPrices.length ? "ok" : "not-found"));
  }

  const missingRequests = [];
  if (refreshRequested) missingRequests.push(
			fetchLandCharacteristics(apiKey, apiDomain, parcel.pnu)
				.then((value) => {
					landCharacteristics = value;
					landCharacteristicsStatus = value ? "available" : "not-found";
					permanentWrites.push({ pnu: parcel.pnu, data_type: PARCEL_CACHE_TYPE.LAND_BASIC, payload: { value, status: landCharacteristicsStatus } });
				})
				.catch((landError) => {
					landCharacteristicsStatus = "unavailable";
					console.warn("토지특성 공식 API 조회 실패:", landError && landError.message ? landError.message : "UNKNOWN_ERROR");
				})
  );
  if (refreshRequested) missingRequests.push(
			fetchLandPossession(apiKey, apiDomain, parcel.pnu)
				.then((value) => {
					landPossession = value;
					landPossessionStatus = value ? "available" : "not-found";
					permanentWrites.push({ pnu: parcel.pnu, data_type: PARCEL_CACHE_TYPE.OWNERSHIP, payload: { value, status: landPossessionStatus } });
				})
				.catch((possessionError) => {
					landPossessionStatus = "unavailable";
					console.warn("토지소유 공식 API 조회 실패:", possessionError && possessionError.message ? possessionError.message : "UNKNOWN_ERROR");
				})
  );
  if (refreshRequested) missingRequests.push(
    fetchLandMoves(apiKey, apiDomain, parcel.pnu)
      .then((result) => {
        landMoves = result;
        landMovesStatus = result.length ? "ok" : "not-found";
        permanentWrites.push({ pnu: parcel.pnu, data_type: PARCEL_CACHE_TYPE.LAND_MOVEMENT, payload: { items: result, status: landMovesStatus } });
      })
      .catch((error) => {
        console.warn("[parcel-boundary-by-point] land-moves lookup failed:", error?.message || error);
        landMovesStatus = "unavailable";
      })
  );
  if (refreshRequested) missingRequests.push(
    fetchIndividualLandPrices(apiKey, apiDomain, parcel.pnu)
      .then((result) => {
        individualLandPrices = result;
        individualLandPricesStatus = result.length ? "ok" : "not-found";
        permanentWrites.push({ pnu: parcel.pnu, data_type: PARCEL_CACHE_TYPE.INDIVIDUAL_LAND_PRICES, payload: { items: result, status: individualLandPricesStatus } });
      })
      .catch((error) => {
        console.warn("[parcel-boundary-by-point] land-price lookup failed:", error?.message || error);
        individualLandPricesStatus = "unavailable";
      })
  );
  if (refreshRequested) missingRequests.push(
    fetchIndividualHousingPrices(apiKey, apiDomain, parcel.pnu)
      .then((result) => {
        individualHousingPrices = result;
        individualHousingPricesStatus = result.length ? "ok" : "not-found";
        permanentWrites.push({ pnu: parcel.pnu, data_type: PARCEL_CACHE_TYPE.INDIVIDUAL_HOUSING_PRICES, payload: { items: result, status: individualHousingPricesStatus } });
      })
      .catch((error) => {
        console.warn("[parcel-boundary-by-point] housing-price lookup failed:", error?.message || error);
        individualHousingPricesStatus = "unavailable";
      })
  );
  await Promise.all(missingRequests);
  await storePermanentParcelInformation(permanentWrites);
		permanentWrites.forEach((row) => {
			if (row && row.data_type) permanentCache.set(row.data_type, row.payload || {});
		});
		const resolveDatasetState = (dataType) => {
			if (!permanentCache.has(dataType)) return "not_loaded";
			const cached = permanentCache.get(dataType) || {};
			const status = String(cached.status || "").trim().toLowerCase();
			if (["not-found", "not_found", "empty", "loaded_empty"].includes(status)) return "loaded_empty";
			if (["stale", "expired"].includes(status)) return "stale";
			return "loaded";
		};
		const datasetStates = Object.freeze({
			boundary: "loaded",
			land_basic: resolveDatasetState(PARCEL_CACHE_TYPE.LAND_BASIC),
			ownership: resolveDatasetState(PARCEL_CACHE_TYPE.OWNERSHIP),
			land_use: resolveDatasetState(PARCEL_CACHE_TYPE.LAND_USE),
			land_movement: resolveDatasetState(PARCEL_CACHE_TYPE.LAND_MOVEMENT),
			individual_land_prices: resolveDatasetState(PARCEL_CACHE_TYPE.INDIVIDUAL_LAND_PRICES),
			individual_housing_prices: resolveDatasetState(PARCEL_CACHE_TYPE.INDIVIDUAL_HOUSING_PRICES),
			building_register: resolveDatasetState(PARCEL_CACHE_TYPE.BUILDING_REGISTER),
			common_housing_prices: resolveDatasetState(PARCEL_CACHE_TYPE.COMMON_HOUSING_PRICES),
			apartment_businesses: resolveDatasetState(PARCEL_CACHE_TYPE.APARTMENT_BUSINESSES)
		});
		res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
		res.status(200).json({
			...parcel,
			dbContract: "parcel-master-boundary-property-db-only-v3",
			dataSource: refreshRequested ? "authorized-public-loader" : "database",
			propertyInformationAvailable,
			datasetStates,
			landCharacteristics,
			landCharacteristicsStatus,
			landPossession,
			landPossessionStatus,
      landUsePlan,
      landUsePlanStatus,
      landMoves,
      landMovesStatus,
      individualLandPrices,
      individualLandPricesStatus,
      individualHousingPrices,
      individualHousingPricesStatus,
		});
	} catch (error) {
		console.error("필지 경계 DB 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
		res.setHeader("Cache-Control", "no-store");
		const upstreamCode = String(error && error.upstreamCode ? error.upstreamCode : "").trim();
		res.status(502).json({
			ok: false,
			code: upstreamCode || "PARCEL_DATABASE_LOOKUP_FAILED"
		});
	}
};

module.exports.__test = {
  normalizeLandUsePlan,
  normalizeIndividualLandPrices,
  normalizeIndividualHousingPrices,
	getAllowedCorsOrigin,
	buildPointCacheKey,
	chooseParcelFeature,
	geometryContainsPoint,
	isRetryableUpstreamError,
	isJejuCoordinate,
	isPointInRing,
	normalizeVworldApiDomain,
	normalizeFeatureProperties,
	normalizeLandCharacteristics,
	normalizeLandPossession,
	parseVworldPayload
};
