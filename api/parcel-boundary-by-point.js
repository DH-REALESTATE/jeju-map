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

const inflightRequests = new Map();
let parcelInformationSnapshotRpcUnavailableUntil = 0;

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

async function loadParcelInformationSnapshot(pnu, priceOnly)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  if (Date.now() < parcelInformationSnapshotRpcUnavailableUntil) return null;
  const response = await supabaseAdminFetch(
    "/rest/v1/rpc/get_parcel_information_snapshot_6047",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        p_pnu: normalizedPnu,
        p_price_only: priceOnly === true
      })
    }
  );
  if (!response || !response.ok) {
    const errorText = response ? await response.text().catch(() => "") : "";
    if (response && (response.status === 404 || /PGRST202|could not find.*function/i.test(errorText))) {
      parcelInformationSnapshotRpcUnavailableUntil = Date.now() + (5 * 60 * 1000);
    } else if (response) {
      console.warn("[parcel-boundary-by-point] snapshot RPC failed:", response.status);
    }
    return null;
  }
  const payload = await response.json().catch(() => null);
  const snapshot = Array.isArray(payload) ? payload[0] : payload;
  return snapshot && typeof snapshot === "object" ? snapshot : null;
}

async function loadOfflineLandUsePlan(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_land_use_plan_current?select=relation_type,law_name,zone_code,zone_name,source_standard_date,payload&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=id.asc&limit=1000`
    );
    if (!response || !response.ok) {
      if (response) {
        console.warn("[parcel-boundary-by-point] offline land-use lookup failed:", response.status);
      }
      return null;
    }
    rows = await response.json().catch(() => []);
  }
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

async function loadOfflineLandBasic(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_land_characteristics_current?select=pnu,legal_dong_name,jibun,jimok_name,area_m2,land_use_zone_name_1,land_use_situation_name,terrain_height_name,terrain_shape_name,road_side_name,published_land_price,standard_year,standard_month,source_standard_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&limit=1`
    );
    if (!response || !response.ok) {
      if (response) {
        console.warn("[parcel-boundary-by-point] offline land-basic lookup failed:", response.status);
      }
      return null;
    }
    rows = await response.json().catch(() => []);
  }
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

async function loadOfflineIndividualLandPrices(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_land_prices?select=base_year,base_month,official_price_per_m2,announcement_date,standard_land,data_reference_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=base_year.desc,base_month.desc&limit=20`
    );
    if (!response || !response.ok) {
      if (response) {
        console.warn("[parcel-boundary-by-point] offline D151 lookup failed:", response.status);
      }
      return null;
    }
    rows = await response.json().catch(() => []);
  }
  if (!Array.isArray(rows)) return null;
  return rows.reduce((items, row) => {
    const year = String(row?.base_year ?? "").trim();
    const month = String(row?.base_month ?? "1").trim().padStart(2, "0");
    const pricePerSquareMeter = Number(row?.official_price_per_m2);
    if (!/^\d{4}$/.test(year) || !Number.isFinite(pricePerSquareMeter) || pricePerSquareMeter <= 0) {
      return items;
    }
    items.push({
      year,
      month,
      pricePerSquareMeter,
      announcedAt: String(row?.announcement_date || "").trim(),
      standardLand: row?.standard_land ? "Y" : "N",
      lastUpdatedAt: String(row?.data_reference_date || "").trim()
    });
    return items;
  }, []);
}

async function loadOfflineIndividualHousingPrices(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_individual_housing_prices?select=base_year,base_month,house_price,building_register_key,dong_code,land_register_area_m2,calculated_land_area_m2,total_building_area_m2,calculated_building_area_m2,data_reference_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=base_year.desc,base_month.desc&limit=100`
    );
    if (!response || !response.ok) {
      if (response) console.warn("[parcel-boundary-by-point] offline D169 lookup failed:", response.status);
      return null;
    }
    rows = await response.json().catch(() => []);
  }
  if (!Array.isArray(rows)) return null;
  return rows.reduce((items, row) => {
    const year = String(row?.base_year ?? "").trim();
    const month = String(row?.base_month ?? "1").trim().padStart(2, "0");
    const housePrice = Number(row?.house_price);
    if (!/^\d{4}$/.test(year) || !Number.isFinite(housePrice) || housePrice <= 0) return items;
    const numberOrNull = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
    items.push({
      year,
      month,
      housePrice,
      buildingRegisterKey: String(row?.building_register_key || "").trim(),
      dongCode: String(row?.dong_code || "").trim(),
      landRegisterAreaM2: numberOrNull(row?.land_register_area_m2),
      calculatedLandAreaM2: numberOrNull(row?.calculated_land_area_m2),
      totalBuildingAreaM2: numberOrNull(row?.total_building_area_m2),
      calculatedBuildingAreaM2: numberOrNull(row?.calculated_building_area_m2),
      lastUpdatedAt: String(row?.data_reference_date || "").trim()
    });
    return items;
  }, []);
}

async function loadOfflineLandPossession(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return null;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_land_ownership_current?select=pnu,ownership_code,ownership_name,owner_count,ownership_change_date,ownership_change_reason,source_standard_date,payload&pnu=eq.${encodeURIComponent(normalizedPnu)}&limit=1`
    );
    if (!response || !response.ok) {
      if (response) {
        console.warn("[parcel-boundary-by-point] offline ownership lookup failed:", response.status);
      }
      return null;
    }
    rows = await response.json().catch(() => []);
  }
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || String(row.pnu || "").trim() !== normalizedPnu) return null;
  const payload = row.payload && typeof row.payload === "object" ? row.payload : {};
  const sharedOwnerCount = Number(row.owner_count);
  const areaM2 = Number(payload.areaM2);
  const publishedLandPrice = Number(payload.publishedLandPrice);
  const standardYearMonth = String(payload.standardYearMonth || "").trim();
  const standardYearMonthParts = standardYearMonth.match(/^(\d{4})[-.]?(\d{1,2})$/);
  return {
    pnu: normalizedPnu,
    ownershipCode: String(row.ownership_code || "").trim(),
    ownershipType: String(row.ownership_name || "").trim(),
    sharedOwnerCount: Number.isFinite(sharedOwnerCount) ? sharedOwnerCount : null,
    ownershipChangeDate: String(row.ownership_change_date || "").trim(),
    ownershipChangeReason: String(row.ownership_change_reason || "").trim(),
    legalDongName: String(payload.legalDongName || "").trim(),
    jibun: String(payload.jibun || "").trim(),
    jimok: String(payload.jimok || "").trim(),
    areaM2: Number.isFinite(areaM2) && areaM2 > 0 ? areaM2 : null,
    publishedLandPrice: Number.isFinite(publishedLandPrice) && publishedLandPrice > 0 ? publishedLandPrice : null,
    standardYear: standardYearMonthParts ? standardYearMonthParts[1] : "",
    standardMonth: standardYearMonthParts ? standardYearMonthParts[2].padStart(2, "0") : "",
    lastUpdatedAt: String(row.source_standard_date || "").trim()
  };
}

async function loadOfflineLandMoves(pnu, prefetchedRows)
{
  const normalizedPnu = String(pnu || "").trim();
  if (!/^\d{19}$/.test(normalizedPnu)) return [];
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const response = await supabaseAdminFetch(
      `/rest/v1/realjeju_land_movements_current?select=movement_date,movement_reason,movement_reason_code,area_m2,jimok_name,source_standard_date&pnu=eq.${encodeURIComponent(normalizedPnu)}&order=movement_date.desc.nullslast&limit=100`
    );
    if (!response || !response.ok) {
      if (response) {
        console.warn("[parcel-boundary-by-point] offline land-movement lookup failed:", response.status);
      }
      return null;
    }
    rows = await response.json().catch(() => []);
  }
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    movedAt: String(row.movement_date || "").trim(),
    reason: String(row.movement_reason || "").trim(),
    reasonCode: String(row.movement_reason_code || "").trim(),
    areaM2: Number.isFinite(Number(row.area_m2)) ? Number(row.area_m2) : null,
    jimok: String(row.jimok_name || "").trim(),
    lastUpdatedAt: String(row.source_standard_date || "").trim()
  }));
}

async function loadRoadContactParcelsByBounds(bounds, limit)
{
  const response = await supabaseAdminFetch(
    "/rest/v1/rpc/get_jeju_road_contact_parcels_in_bounds",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        p_west: Number(bounds.west),
        p_south: Number(bounds.south),
        p_east: Number(bounds.east),
        p_north: Number(bounds.north),
        p_limit: Number(limit)
      })
    }
  );
  if (!response || !response.ok) {
    if (response) console.warn("[parcel-boundary-by-point] road-contact bounds RPC failed:", response.status);
    return null;
  }
  const rows = await response.json().catch(() => []);
  return (Array.isArray(rows) ? rows : []).reduce((items, row) => {
    const pnu = String(row?.pnu || "").trim();
    const jimok = String(row?.jimok || "").trim();
    let geometry = row?.geometry || null;
    if (typeof geometry === "string") {
      try { geometry = JSON.parse(geometry); } catch (_) { geometry = null; }
    }
    if (!/^\d{19}$/.test(pnu) || !jimok || !geometry) return items;
    items.push({ pnu, jimok, geometry });
    return items;
  }, []);
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

async function loadPermanentParcelInformation(pnu, prefetchedRows)
{
  const result = new Map();
  if (!/^\d{19}$/.test(String(pnu || ""))) return result;
  let rows = Array.isArray(prefetchedRows) ? prefetchedRows : null;
  if (!rows) {
    const query = new URLSearchParams({
      select: "data_type,payload,cache_status,expires_at",
      pnu: `eq.${pnu}`,
      data_type: `in.(${PARCEL_INFORMATION_CACHE_TYPES.join(",")})`
    });
    const response = await supabaseAdminFetch(`/rest/v1/${PARCEL_INFORMATION_CACHE_TABLE}?${query.toString()}`);
    if (!response || !response.ok) return result;
    rows = await response.json().catch(() => []);
  }
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
	if (inflightRequests.has(key)) return inflightRequests.get(key);

	const request = fetchParcelBoundary(apiKey, apiDomain, lat, lng)
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

const PRIMARY_LAND_USE_ZONE_NAMES = new Set([
  "제1종전용주거지역", "제2종전용주거지역", "제1종일반주거지역", "제2종일반주거지역",
  "제3종일반주거지역", "준주거지역", "중심상업지역", "일반상업지역", "근린상업지역",
  "유통상업지역", "전용공업지역", "일반공업지역", "준공업지역", "보전녹지지역",
  "생산녹지지역", "자연녹지지역", "보전관리지역", "생산관리지역", "계획관리지역",
  "자연환경보전지역", "농림지역"
]);

function isPrimaryLandUseZoneName(districtName) {
  const normalized = String(districtName || "").replace(/\s+/g, "").replace(/\([^)]*\)$/g, "").trim();
  return PRIMARY_LAND_USE_ZONE_NAMES.has(normalized);
}

function selectRepresentativeLandUseZone(items) {
  const includedPlanningZones = (Array.isArray(items) ? items : []).filter((item) => (
    item && item.lawGroup === "national-planning" && item.relation === "포함"
  ));
  return includedPlanningZones.find((item) => isPrimaryLandUseZoneName(item.districtName))
    || includedPlanningZones[0]
    || null;
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

	const boundaryOnly = ["1", "true", "yes"].includes(String(req.query && req.query.boundaryOnly || "").trim().toLowerCase());
	const priceOnly = ["1", "true", "yes"].includes(String(req.query && req.query.priceOnly || "").trim().toLowerCase());
	const roadContactBounds = ["1", "true", "yes"].includes(String(req.query && req.query.roadContactBounds || "").trim().toLowerCase());
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
	if (requestedPnu && !priceOnly && !parcelWorkerAuthorized(req)) {
		res.setHeader("Cache-Control", "no-store");
		res.status(403).json({ ok: false, code: "WORKER_AUTH_REQUIRED" });
		return;
	}
	if (roadContactBounds) {
		const bounds = {
			west: Number(req.query && req.query.west),
			south: Number(req.query && req.query.south),
			east: Number(req.query && req.query.east),
			north: Number(req.query && req.query.north)
		};
		const spanLng = bounds.east - bounds.west;
		const spanLat = bounds.north - bounds.south;
		const validBounds = Object.values(bounds).every(Number.isFinite)
			&& bounds.west >= 124 && bounds.east <= 128
			&& bounds.south >= 32 && bounds.north <= 35
			&& spanLng > 0 && spanLat > 0 && spanLng <= 0.25 && spanLat <= 0.25;
		if (!validBounds) {
			res.setHeader("Cache-Control", "no-store");
			res.status(400).json({ ok: false, code: "INVALID_BOUNDS" });
			return;
		}
		const limit = Math.max(1, Math.min(1200, Math.trunc(Number(req.query && req.query.limit) || 1200)));
		try {
			const parcels = await loadRoadContactParcelsByBounds(bounds, limit);
			if (!Array.isArray(parcels)) {
				res.setHeader("Cache-Control", "no-store");
				res.status(502).json({ ok: false, code: "ROAD_CONTACT_DATABASE_LOOKUP_FAILED" });
				return;
			}
			res.setHeader("Cache-Control", "public, max-age=120, s-maxage=600, stale-while-revalidate=3600");
			res.status(200).json({ ok: true, roadContactBounds: true, parcels });
		} catch (error) {
			console.error("도로접면 필지 DB 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
			res.setHeader("Cache-Control", "no-store");
			res.status(502).json({ ok: false, code: "ROAD_CONTACT_DATABASE_LOOKUP_FAILED" });
		}
		return;
	}
	if (priceOnly) {
		if (!/^\d{19}$/.test(requestedPnu)) {
			res.setHeader("Cache-Control", "no-store");
			res.status(400).json({ ok: false, code: "INVALID_PNU" });
			return;
		}
		try {
			const snapshot = await loadParcelInformationSnapshot(requestedPnu, true);
			const individualLandPrices = await loadOfflineIndividualLandPrices(
				requestedPnu,
				snapshot && Array.isArray(snapshot.individualLandPriceRows)
					? snapshot.individualLandPriceRows
					: undefined
			);
			if (!Array.isArray(individualLandPrices)) {
				res.setHeader("Cache-Control", "no-store");
				res.status(502).json({ ok: false, code: "LAND_PRICE_DATABASE_LOOKUP_FAILED" });
				return;
			}
			res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800");
			res.status(200).json({
				ok: true,
				pnu: requestedPnu,
				priceOnly: true,
				individualLandPrices,
				individualLandPricesStatus: individualLandPrices.length ? "ok" : "not-found"
			});
		} catch (error) {
			console.error("필지 공시지가 DB 조회 실패:", error && error.message ? error.message : "UNKNOWN_ERROR");
			res.setHeader("Cache-Control", "no-store");
			res.status(502).json({ ok: false, code: "LAND_PRICE_DATABASE_LOOKUP_FAILED" });
		}
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
		if (boundaryOnly) {
			res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800");
			res.status(200).json({
				...parcel,
				dbContract: "parcel-master-boundary-property-db-only-v4",
				dataSource: "database",
				boundaryOnly: true,
				apiCapabilities: {
					priceOnly: true,
					roadContactBounds: true
				},
				propertyInformationAvailable: false,
				datasetStates: { boundary: "loaded" }
			});
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
	  const snapshot = await loadParcelInformationSnapshot(parcel.pnu, false);
	  const snapshotRows = (key) => snapshot && Array.isArray(snapshot[key]) ? snapshot[key] : undefined;
	  const [permanentCache, offlineLandUsePlan, offlineLandBasic, offlineLandPossession, offlineLandMoves, offlineIndividualLandPrices, offlineIndividualHousingPrices] = await Promise.all([
	    loadPermanentParcelInformation(parcel.pnu, snapshotRows("cacheRows")),
	    loadOfflineLandUsePlan(parcel.pnu, snapshotRows("landUsePlanRows")),
	    loadOfflineLandBasic(parcel.pnu, snapshotRows("landBasicRows")),
	    loadOfflineLandPossession(parcel.pnu, snapshotRows("landPossessionRows")),
	    loadOfflineLandMoves(parcel.pnu, snapshotRows("landMovementRows")),
	    loadOfflineIndividualLandPrices(parcel.pnu, snapshotRows("individualLandPriceRows")),
	    loadOfflineIndividualHousingPrices(parcel.pnu, snapshotRows("individualHousingPriceRows"))
	  ]);
	  const ownershipLandBasic = offlineLandPossession
	    && (offlineLandPossession.jimok || Number.isFinite(offlineLandPossession.areaM2))
	    ? {
	        pnu: parcel.pnu,
	        legalDongName: String(offlineLandPossession.legalDongName || "").trim(),
	        jibun: String(offlineLandPossession.jibun || "").trim(),
	        jimok: String(offlineLandPossession.jimok || "").trim(),
	        areaM2: Number.isFinite(offlineLandPossession.areaM2) ? offlineLandPossession.areaM2 : null,
	        landUseZone: "",
	        landUseSituation: "",
	        terrainHeight: "",
	        terrainShape: "",
	        roadSide: "",
	        publishedLandPrice: Number.isFinite(offlineLandPossession.publishedLandPrice)
	          ? offlineLandPossession.publishedLandPrice
	          : null,
	        standardYear: String(offlineLandPossession.standardYear || "").trim(),
	        standardMonth: String(offlineLandPossession.standardMonth || "").trim(),
	        lastUpdatedAt: String(offlineLandPossession.lastUpdatedAt || "").trim()
	      }
	    : null;
	  const movementLandBasicSource = Array.isArray(offlineLandMoves)
	    ? offlineLandMoves.find((item) => item && (
	        String(item.jimok || "").trim()
	        || (Number.isFinite(item.areaM2) && item.areaM2 > 0)
	      ))
	    : null;
	  const movementLandBasic = movementLandBasicSource
	    ? {
	        pnu: parcel.pnu,
	        legalDongName: String(parcel.legalDongName || "").trim(),
	        jibun: String(parcel.jibun || "").trim(),
	        jimok: String(movementLandBasicSource.jimok || "").trim(),
	        areaM2: Number.isFinite(movementLandBasicSource.areaM2) && movementLandBasicSource.areaM2 > 0
	          ? movementLandBasicSource.areaM2
	          : null,
	        landUseZone: "",
	        landUseSituation: "",
	        terrainHeight: "",
	        terrainShape: "",
	        roadSide: "",
	        publishedLandPrice: null,
	        standardYear: "",
	        standardMonth: "",
	        lastUpdatedAt: String(movementLandBasicSource.lastUpdatedAt || "").trim()
	      }
	    : null;
	  // D195가 없는 도로ㆍ하천ㆍ묘지 등은 같은 PNU의 D161, D157 순서로 공통 보완합니다.
	  const effectiveOfflineLandBasic = offlineLandBasic || ownershipLandBasic || movementLandBasic;
	  const permanentWrites = [];

  // Boundary geometry and property datasets are independent. A parcel polygon
  // must be returned whenever its boundary lookup succeeds, even when
  // land_basic or every detailed property dataset is still not_loaded.
	  const propertyInformationAvailable = PARCEL_INFORMATION_CACHE_TYPES.some(
	    (dataType) => permanentCache.has(dataType)
	  ) || (Array.isArray(offlineLandUsePlan) && offlineLandUsePlan.length > 0)
	    || Boolean(effectiveOfflineLandBasic)
	    || Boolean(offlineLandPossession)
	    || (Array.isArray(offlineLandMoves) && offlineLandMoves.length > 0);

	  if (permanentCache.has(PARCEL_CACHE_TYPE.LAND_BASIC)) {
	    const cached = permanentCache.get(PARCEL_CACHE_TYPE.LAND_BASIC) || {};
	    landCharacteristics = cached.value || null;
	    landCharacteristicsStatus = String(cached.status || (landCharacteristics ? "available" : "not-found"));
	  }
	  if (effectiveOfflineLandBasic) {
	    landCharacteristics = effectiveOfflineLandBasic;
	    landCharacteristicsStatus = "available";
	    if (effectiveOfflineLandBasic.legalDongName) parcel.legalDongName = effectiveOfflineLandBasic.legalDongName;
	    if (effectiveOfflineLandBasic.jibun) parcel.jibun = effectiveOfflineLandBasic.jibun;
	    if (parcel.legalDongName || parcel.jibun) {
	      parcel.address = [parcel.legalDongName, parcel.jibun].filter(Boolean).join(" ");
	    }
	    if (effectiveOfflineLandBasic.jimok) parcel.jimok = effectiveOfflineLandBasic.jimok;
	    if (Number.isFinite(effectiveOfflineLandBasic.areaM2)) parcel.areaM2 = effectiveOfflineLandBasic.areaM2;
	    if (isPrimaryLandUseZoneName(effectiveOfflineLandBasic.landUseZone)) {
	      parcel.landUseZone = String(effectiveOfflineLandBasic.landUseZone || "").trim();
	    }
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
	    const includedPlanningZone = selectRepresentativeLandUseZone(landUsePlan);
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
  if (Array.isArray(offlineIndividualLandPrices)) {
    individualLandPrices = offlineIndividualLandPrices;
    individualLandPricesStatus = individualLandPrices.length ? "ok" : "not-found";
    permanentCache.set(PARCEL_CACHE_TYPE.INDIVIDUAL_LAND_PRICES, {
      items: individualLandPrices,
      status: individualLandPricesStatus
    });
  }
  if (Array.isArray(offlineIndividualHousingPrices)) {
    individualHousingPrices = offlineIndividualHousingPrices;
    individualHousingPricesStatus = individualHousingPrices.length ? "ok" : "not-found";
    permanentCache.set(PARCEL_CACHE_TYPE.INDIVIDUAL_HOUSING_PRICES, {
      items: individualHousingPrices,
      status: individualHousingPricesStatus
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
			dbContract: "parcel-master-boundary-property-db-only-v4",
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
