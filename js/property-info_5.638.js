// REALJEJU 5.638 property-info background module
// 필지 상세, 실거래가, 공시지가, 건축물대장, 추천 중개사 패널을 한 경계에서 관리합니다.
/* PATCH 5.295: 필지 상세 통합 화면, 실거래가, 주변 중개사, 건축물대장 */
(function initParcelPropertyExperience5293()
{
  if (window.__realjejuParcelPropertyExperience5293) return;
  window.__realjejuParcelPropertyExperience5293 = true;

  const buildingCache = new Map();
  const tradeCache = new Map();
  const tradeCoordinateCache = new Map();
  const BUILDING_BROWSER_CACHE_TTL_MS = 30 * 60 * 1000;
  const TRADE_BROWSER_CACHE_TTL_MS = 5 * 60 * 1000;
  const TRADE_COORDINATE_BROWSER_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  let recommendedBrokerPool = [];
  let recommendedBrokerPoolPromise = null;

  function esc(value)
  {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function finite(value)
  {
    if (value == null || (typeof value === "string" && !value.trim())) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function getTimedCache(cache, key)
  {
    const entry = cache.get(key);
    if (!entry) return null;
    if (!Number.isFinite(entry.expiresAt) || entry.expiresAt <= Date.now()) {
      cache.delete(key);
      return null;
    }
    return entry.value;
  }

  function setTimedCache(cache, key, value, ttlMs)
  {
    cache.set(key, { value: value, expiresAt: Date.now() + ttlMs });
    return value;
  }

  function currentAreaUnit()
  {
    return globalAreaUnit === "py" ? "pyeong" : "sqm";
  }

  function formatArea(squareMeters)
  {
    const area = finite(squareMeters);
    if (area == null) return "-";
    const isPyeong = currentAreaUnit() === "pyeong";
    const value = isPyeong ? area / 3.305785 : area;
    const digits = value >= 100 ? 0 : 1;
    return value.toLocaleString("ko-KR", { maximumFractionDigits: digits }) + (isPyeong ? "평" : "㎡");
  }

  function formatDate(value)
  {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length < 8) return value || "-";
    return Number(digits.slice(0, 4)) + "년 " + Number(digits.slice(4, 6)) + "월 " + Number(digits.slice(6, 8)) + "일";
  }

  function formatDistance(value)
  {
    const meters = finite(value);
    if (meters == null) return "-";
    if (meters >= 1000) {
      return (meters / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "km";
    }
    return Math.round(meters).toLocaleString("ko-KR") + "m";
  }

  function formatTradeAmount(manWon)
  {
    const amount = finite(manWon);
    if (amount == null) return "-";
    if (amount >= 10000) {
      const eok = amount / 10000;
      return eok.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "억";
    }
    return Math.round(amount).toLocaleString("ko-KR") + "만원";
  }

  function getClient()
  {
    try {
      return typeof window.getRealjejuSupabaseClient === "function"
        ? window.getRealjejuSupabaseClient()
        : null;
    } catch (error) {
      return null;
    }
  }

  async function invokeFunction(name, body)
  {
    // Interactive property panels are database-only. Public-data refreshes are
    // reserved for the authenticated offline loader/worker path.
    body = Object.assign({}, body || {}, {
      dbOnly: true,
      db_only: true,
      refresh: false,
      runtimeMode: "database-only",
      contractVersion: "property-dataset-db-only-v1"
    });
    const client = getClient();
    if (!client || !client.functions || typeof client.functions.invoke !== "function") {
      throw new Error("공공데이터 연결이 준비되지 않았습니다.");
    }
    const result = await client.functions.invoke(name, { body: body });
    if (result.error) {
      let message = String(result.error.message || "공공데이터 요청에 실패했습니다.");
      const context = result.error.context;
      if (context) {
        try {
          const response = typeof context.clone === "function" ? context.clone() : context;
          const payload = await response.json();
          if (payload && (payload.error || payload.message)) {
            message = String(payload.error || payload.message);
          }
        } catch (jsonError) {
          try {
            const response = typeof context.clone === "function" ? context.clone() : context;
            const responseText = String(await response.text()).trim();
            if (responseText) message = responseText;
          } catch (textError) {}
        }
      }
      throw new Error(message);
    }
    return result.data || {};
  }

  function functionErrorHtml(prefix)
  {
    return '<div class="parcel-property-empty">' + esc(prefix) + '</div>';
  }

  function infoRow(label, value, extraClass)
  {
    return '<div class="parcel-property-info-row' + (extraClass ? " " + extraClass : "") + '"><span>' + esc(label) + '</span><strong>' + (value || "-") + '</strong></div>';
  }

  function areaValue(value, suffix)
  {
    const number = finite(value);
    if (number == null) return "-";
    return '<span data-parcel-property-area-sqm="' + number + '">' + esc(formatArea(number)) + '</span>' + (suffix || "");
  }

  function refreshUnits(root)
  {
    (root || document).querySelectorAll("[data-parcel-property-area-sqm]").forEach(function(node) {
      const next = formatArea(node.dataset.parcelPropertyAreaSqm);
      if (node.textContent !== next) node.textContent = next;
    });
    (root || document).querySelectorAll("[data-parcel-trade-unit-price-sqm]").forEach(function(node) {
      const pricePerSquareMeter = finite(node.dataset.parcelTradeUnitPriceSqm);
      if (pricePerSquareMeter == null) return;
      const unitPrice = currentAreaUnit() === "pyeong" ? pricePerSquareMeter * 3.305785 : pricePerSquareMeter;
      node.textContent = (unitPrice / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "만원";
    });
  }

  function distanceMeters(lat1, lng1, lat2, lng2)
  {
    const toRadians = function(value) { return value * Math.PI / 180; };
    const radius = 6371000;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function parcelPoint(feature)
  {
    const lat = finite(feature && feature.selectionLat);
    const lng = finite(feature && feature.selectionLng);
    if (lat != null && lng != null) return { lat: lat, lng: lng };
    const geometry = feature && feature.geometry;
    const coordinates = geometry && geometry.coordinates;
    const points = [];
    (function collect(value) {
      if (!Array.isArray(value)) return;
      if (value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
        points.push([Number(value[0]), Number(value[1])]);
        return;
      }
      value.forEach(collect);
    })(coordinates);
    if (!points.length) return null;
    return {
      lng: points.reduce(function(sum, point) { return sum + point[0]; }, 0) / points.length,
      lat: points.reduce(function(sum, point) { return sum + point[1]; }, 0) / points.length
    };
  }

  function buildOverview(feature)
  {
    const info = feature.landCharacteristics || {};
    const possession = feature.landPossession || {};
    const area = finite(feature.areaM2 || info.areaM2);
    const jimok = feature.jimok || info.jimok || "-";
    const ownership = String(possession.ownershipType || "").trim().replace(/\s*\([^)]*\)\s*$/, "") || "-";
    const zone = feature.landUseZone || info.landUseZone || "-";
    const jimokLabel = String(jimok).trim();
    const ownershipSummaryJimoks = new Set(["도로", "철도용지", "하천", "제방", "구거", "유지", "수도용지", "묘지"]);
    const overviewDetail = ownershipSummaryJimoks.has(jimokLabel)
      ? ownership
      : zone;
    const roadAddress = feature.roadAddress || feature.road_address || "";
    return '<section class="parcel-property-overview">'
      + (roadAddress ? '<p class="parcel-property-road-address">' + esc(roadAddress) + '</p>' : "")
      + '<p class="parcel-property-overview-primary">' + esc(jimok) + ' · ' + esc(overviewDetail) + '</p>'
      + '<p class="parcel-property-overview-secondary">토지 <span data-parcel-property-area-sqm="' + (area == null ? "" : area) + '">' + esc(formatArea(area)) + '</span><span data-parcel-building-summary></span></p>'
      + '</section>';
  }

  function buildNavigation()
  {
    return '<nav class="parcel-property-tabs" aria-label="필지 상세 구분">'
      + '<button type="button" class="is-active" data-parcel-section-target="parcel-property-realtrade">실거래가</button>'
      + '<button type="button" data-parcel-section-target="parcel-property-land">토지</button>'
      + '<button type="button" data-parcel-section-target="parcel-property-building">건물</button>'
      + '<button type="button" data-parcel-section-target="parcel-property-auction">경매</button>'
      + '</nav>';
  }

  function buildTradeShell()
  {
    return '<section id="parcel-property-realtrade" class="parcel-property-block parcel-property-realtrade">'
      + '<h2>실거래가</h2><div class="parcel-property-loading" data-parcel-exact-trades>실거래가를 불러오는 중입니다.</div>'
      + '<div class="parcel-property-subsection"><h3>추천 중개사</h3><div data-parcel-nearby-brokers class="parcel-property-loading">추천 중개사를 불러오는 중입니다.</div></div>'
      + '<div class="parcel-property-subsection parcel-property-trade-graph-section"><h3>주변 유사거래</h3><div data-parcel-trade-chart class="parcel-property-loading">주변 유사거래를 불러오는 중입니다.</div></div>'
      // 주변 유사거래는 현재 사용하지 않으므로 임시 주석 처리
      // + '<div class="parcel-property-subsection"><h3>주변 유사거래</h3><p class="parcel-property-trade-tags" data-parcel-trade-tags>#토지 #같은지목 #같은용도지역 #500m</p><div data-parcel-similar-trades class="parcel-property-loading">주변 거래를 불러오는 중입니다.</div></div>'
      + '</section>';
  }

  function buildAuctionShell()
  {
    return '<section id="parcel-property-auction" class="parcel-property-block"><h2>경매 정보</h2><div class="parcel-property-empty realjeju-property-state-message">현재 등록된 경매물건이 없습니다.</div></section>';
  }

  function buildBuildingShell()
  {
    return '<section id="parcel-property-building" class="parcel-property-block parcel-property-building"><h2>건물 정보</h2><div data-parcel-building-content class="parcel-property-loading">건축물대장을 불러오는 중입니다.</div></section>';
  }

  function setActiveTab(panel, sectionId)
  {
    panel.querySelectorAll("[data-parcel-section-target]").forEach(function(button) {
      button.classList.toggle("is-active", button.dataset.parcelSectionTarget === sectionId);
    });
  }

  function bindPanelNavigation(panel)
  {
    const scroller = panel.parentElement;
    if (!scroller) return;
    let scheduled = false;
    scroller.addEventListener("scroll", function() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function() {
        scheduled = false;
        const lockedTarget = String(panel.__parcelNavigationLockTarget || "");
        if (lockedTarget) {
          setActiveTab(panel, lockedTarget);
          clearTimeout(panel.__parcelNavigationLockTimer);
          panel.__parcelNavigationLockTimer = setTimeout(function() {
            panel.__parcelNavigationLockTarget = "";
          }, 220);
          return;
        }
        const tabs = panel.querySelector(".parcel-property-tabs");
        if (!tabs) return;
        const threshold = tabs.getBoundingClientRect().bottom + 18;
        let active = "parcel-property-realtrade";
        ["parcel-property-realtrade", "parcel-property-land", "parcel-property-building", "parcel-property-auction"].forEach(function(id) {
          const section = panel.querySelector("#" + id);
          if (section && section.getBoundingClientRect().top <= threshold) active = id;
        });
        setActiveTab(panel, active);
      });
    }, { passive: true });
  }

  function parcelBrokerDailyKey(feature)
  {
    const now = new Date();
    const dateKey = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
    const point = parcelPoint(feature);
    const parcelKey = String(feature && feature.pnu || "").trim()
      || (point ? point.lat.toFixed(6) + "," + point.lng.toFixed(6) : "parcel");
    return parcelKey + "|" + dateKey;
  }

  function parcelBrokerSeed(value)
  {
    let hash = 2166136261;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function shuffleParcelBrokers(rows, seedText)
  {
    const next = rows.slice();
    let seed = parcelBrokerSeed(seedText) || 1;
    for (let index = next.length - 1; index > 0; index -= 1) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      const targetIndex = (seed >>> 0) % (index + 1);
      const current = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = current;
    }
    return next;
  }

  function parcelBrokerCachedOffice(row)
  {
    const rows = state && Array.isArray(state.brokerOfficeRows) ? state.brokerOfficeRows : [];
    const agencyId = String(row && row.id || "").trim();
    const userId = String(row && row.user_id || "").trim();
    const officeName = String(row && row.office_name || "").trim();
    return rows.find(function(office) {
      return !!(
        (agencyId && String(office.agencyId || office.agency_id || "") === agencyId)
        || (userId && String(office.userId || office.user_id || "") === userId)
        || (officeName && String(office.officeName || office.office_name || "").trim() === officeName)
      );
    }) || null;
  }

  function normalizeParcelBroker(row, point)
  {
    const cached = parcelBrokerCachedOffice(row) || {};
    const lat = finite(row && row.lat) != null ? finite(row.lat) : finite(cached.lat);
    const lng = finite(row && row.lng) != null ? finite(row.lng) : finite(cached.lng);
    return {
      agencyId: String(row && row.id || cached.agencyId || cached.agency_id || "").trim(),
      userId: String(row && row.user_id || cached.userId || cached.user_id || "").trim(),
      publicId: String(cached.publicId || cached.public_id || "").trim(),
      officeName: String(row && row.office_name || cached.officeName || cached.office_name || "중개사무소").trim(),
      ownerName: String(row && row.owner_name || cached.ownerName || cached.owner_name || "").trim(),
      address: String(row && row.office_address || cached.address || cached.office_address || "").trim(),
      phone: String(row && row.phone || cached.phone || "").trim(),
      regNo: String(row && row.office_reg_no || cached.regNo || cached.office_reg_no || "").trim(),
      profileImage: String(
        (row && (
          row.profileImage ||
          row.profile_image ||
          row.profilePhoto ||
          row.profile_photo ||
          row.avatarUrl ||
          row.avatar_url ||
          row.agentImage ||
          row.agent_image ||
          row.image
        )) ||
        cached.profileImage ||
        cached.profile_image ||
        cached.profilePhoto ||
        cached.profile_photo ||
        cached.avatarUrl ||
        cached.avatar_url ||
        cached.agentImage ||
        cached.agent_image ||
        cached.image ||
        ""
      ).trim(),
      kakaoUrl: String(cached.kakaoUrl || cached.kakao_url || "").trim(),
      lat: lat,
      lng: lng,
      distance: point && lat != null && lng != null ? distanceMeters(point.lat, point.lng, lat, lng) : null
    };
  }

  function parcelBrokerRegionName(feature)
  {
    const info = feature && feature.landCharacteristics && typeof feature.landCharacteristics === "object"
      ? feature.landCharacteristics
      : {};
    const direct = String(
      info.legalDongName ||
      feature && (
        feature.legalDongName ||
        feature.adminRegionName ||
        feature.regionName
      ) ||
      ""
    ).trim();
    const address = String(feature && (feature.address || feature.jibunAddress || feature.jibun) || "").trim();
    const regionSource = [address, direct].filter(Boolean).join(" ");
    const ruralMatch = regionSource.match(/([가-힣0-9]+(?:읍|면))\s*([가-힣0-9]+리)/);
    if (ruralMatch) return ruralMatch[1] + " " + ruralMatch[2];
    const matches = regionSource.match(/[가-힣0-9]+(?:읍|면|동|리)/g);
    return matches && matches.length ? matches[matches.length - 1] : "";
  }

  function parcelBrokerListingAddressRegionName(listing)
  {
    const payload = listing && listing.payload && typeof listing.payload === "object" ? listing.payload : {};
    const address = payload.address && typeof payload.address === "object" ? payload.address : {};
    const regionSource = [
      address.address1,
      address.addressJibun,
      address.publicAddress,
      address.addressDisplay,
      payload.address1,
      payload.addressJibun,
      payload.publicAddress,
      payload.addressDisplay,
      listing && listing.address
    ].map(function(value) { return String(value || "").trim(); }).filter(Boolean).join(" ");
    const ruralMatch = regionSource.match(/([가-힣0-9]+(?:읍|면))\s*([가-힣0-9]+리)/);
    if (ruralMatch) return ruralMatch[1] + " " + ruralMatch[2];
    const matches = regionSource.match(/[가-힣0-9]+(?:읍|면|동|리)/g);
    return matches && matches.length ? matches[matches.length - 1] : "";
  }

  function selectParcelBrokersForDay(rows, feature, listingRows)
  {
    const point = parcelPoint(feature);
    const normalized = rows.map(function(row) {
      const office = normalizeParcelBroker(row, point);
      office.officeDistance = office.distance;
      return office;
    });

    const officeByAgencyId = new Map();
    const officeByUserId = new Map();
    normalized.forEach(function(office) {
      if (office.agencyId) officeByAgencyId.set(String(office.agencyId), office);
      if (office.userId) officeByUserId.set(String(office.userId), office);
    });
    const regionName = parcelBrokerRegionName(feature);
    if (regionName) {
      const topRegionListing = (Array.isArray(listingRows) ? listingRows : []).find(function(listing) {
        return parcelBrokerListingAddressRegionName(listing) === regionName;
      });
      if (topRegionListing) {
        const payload = topRegionListing.payload && typeof topRegionListing.payload === "object"
          ? topRegionListing.payload
          : {};
        const registrant = payload.registrant && typeof payload.registrant === "object"
          ? payload.registrant
          : {};
        let topOffice = officeByAgencyId.get(String(topRegionListing.agency_id || registrant.agency_id || ""))
          || officeByUserId.get(String(topRegionListing.user_id || registrant.agency_user_id || ""));
        if (!topOffice && (registrant.office_name || registrant.representative)) {
          topOffice = normalizeParcelBroker({
            id: topRegionListing.agency_id || registrant.agency_id,
            user_id: topRegionListing.user_id || registrant.agency_user_id,
            office_name: registrant.office_name,
            owner_name: registrant.representative,
            office_reg_no: registrant.office_reg_no,
            office_address: registrant.office_address,
            phone: registrant.phone1 || registrant.phone2,
            profile_image: registrant.agent_image
          }, point);
          topOffice.officeDistance = topOffice.distance;
        }
        if (topOffice) {
          topOffice.distance = topOffice.officeDistance;
          return [topOffice];
        }
      }
    }
    return [];
  }

  function parcelBrokerSpecialtyText(office)
  {
    if (typeof getBrokerOfficeSpecialtyStats !== "function") return "전문 분야 등록 전";
    const stat = getBrokerOfficeSpecialtyStats(office) || {};
    const total = Math.max(0, Number(stat.total) || 0);
    const labels = [
      ["apartment", "아파트 전문"],
      ["officetel", "오피스텔 전문"],
      ["land", "토지 전문"],
      ["commercial", "상가 전문"],
      ["studio", "원룸/투룸 전문"]
    ];
    const specialties = labels.map(function(entry) {
      const key = entry[0];
      const count = Math.max(0, Number(stat.counts && stat.counts[key]) || 0);
      const savedRatio = Number(stat.ratios && stat.ratios[key]);
      const ratio = Number.isFinite(savedRatio) ? savedRatio : (total ? count / total : 0);
      const selected = !!(stat.specialtyFlags && stat.specialtyFlags[key])
        || (total >= BROKER_SPECIALTY_MIN_LISTINGS && count > 0 && ratio >= BROKER_SPECIALTY_RATIO);
      return { label: entry[1], count: count, selected: selected };
    }).filter(function(entry) { return entry.selected; }).sort(function(a, b) { return b.count - a.count; });
    return specialties.length ? specialties.slice(0, 2).map(function(entry) { return entry.label; }).join(" · ") : "전문 분야 등록 전";
  }

  async function enrichParcelBrokerProfiles(client, offices)
  {
    const userIds = Array.from(new Set(
      offices.map(function(office) { return String(office.userId || "").trim(); }).filter(Boolean)
    ));
    if (!userIds.length) return;

    let profileRows = [];
    if (typeof fetchPublicBrokerProfileRowsByUserIds === "function") {
      try {
        const publicRows = await fetchPublicBrokerProfileRowsByUserIds(client, userIds);
        if (Array.isArray(publicRows)) profileRows = publicRows;
      } catch (_error) {}
    }

    function readProfileImage(profile)
    {
      if (!profile) return "";
      if (typeof getAdminApplicationProfileImage === "function") {
        const sharedImage = String(getAdminApplicationProfileImage(profile) || "").trim();
        if (sharedImage) return sharedImage;
      }
      return String(
        profile.profileImage ||
        profile.profile_image ||
        profile.profilePhoto ||
        profile.profile_photo ||
        profile.avatarUrl ||
        profile.avatar_url ||
        profile.agentImage ||
        profile.agent_image ||
        profile.image ||
        ""
      ).trim();
    }

    const profiles = new Map();
    profileRows.forEach(function(profile) {
      const profileId = String(profile && (profile.id || profile.user_id || profile.userId) || "").trim();
      if (profileId) profiles.set(profileId, profile);
    });

    const missingImageUserIds = userIds.filter(function(userId) {
      return !readProfileImage(profiles.get(userId));
    });

    if (missingImageUserIds.length) {
      try {
        const result = await client
          .from("profiles")
          .select("id,name,profile_image")
          .in("id", missingImageUserIds);
        if (!result.error && Array.isArray(result.data)) {
          result.data.forEach(function(profile) {
            const profileId = String(profile && profile.id || "").trim();
            if (profileId) profiles.set(profileId, profile);
          });
        }
      } catch (_error) {}
    }

    offices.forEach(function(office) {
      const profile = profiles.get(String(office.userId || "").trim());
      if (!profile) return;
      if (!office.ownerName) office.ownerName = String(profile.name || profile.full_name || "").trim();
      if (!office.profileImage) office.profileImage = readProfileImage(profile);
    });
  }

  function renderParcelBrokerCompactCard(office)
  {
    const phone = String(office.phone || "").trim();
    return '<article class="parcel-nearby-broker-card"><div><strong>' + esc(office.officeName || "중개사무소") + '</strong><span>' + esc(office.ownerName || "") + '</span><p>' + esc(office.address || "") + '</p>' + (office.distance == null ? "" : '<em>' + esc(formatDistance(office.distance)) + '</em>') + '</div>' + (phone ? '<a href="tel:' + esc(phone.replace(/[^0-9+]/g, "")) + '" aria-label="' + esc(office.officeName || "중개사무소") + ' 전화">전화</a>' : "") + '</article>';
  }

  async function loadRecommendedBrokerPool()
  {
    if (recommendedBrokerPoolPromise) return recommendedBrokerPoolPromise;
    const client = getClient();
    if (!client) return [];
    recommendedBrokerPoolPromise = (async function() {
      const result = await client.from("recommended_brokers")
        .select("id,agency_id,user_id,office_name,owner_name,office_reg_no,office_address,phone,profile_image,active")
        .eq("active", true)
        .order("id", { ascending: true });
      if (result.error) throw result.error;
      recommendedBrokerPool = (Array.isArray(result.data) ? result.data : []).map(function(row) {
        return normalizeParcelBroker({
          id: row.agency_id,
          user_id: row.user_id,
          office_name: row.office_name,
          owner_name: row.owner_name,
          office_reg_no: row.office_reg_no,
          office_address: row.office_address,
          phone: row.phone,
          profile_image: row.profile_image
        }, null);
      }).filter(function(office) {
        return !!(office.agencyId || office.userId || office.regNo);
      });
      return recommendedBrokerPool;
    })().catch(function(error) {
      console.warn("추천 중개사 최초 로딩 실패:", error);
      recommendedBrokerPoolPromise = null;
      recommendedBrokerPool = [];
      return recommendedBrokerPool;
    });
    return recommendedBrokerPoolPromise;
  }

  async function loadNearbyBrokers(panel, feature)
  {
    const target = panel.querySelector("[data-parcel-nearby-brokers]");
    if (!target) return;
    const pool = await loadRecommendedBrokerPool();
    if (!pool.length) {
      target.innerHTML = '<div class="parcel-property-empty">등록된 추천 중개사가 없습니다.</div>';
      return;
    }
    const featured = pool[Math.floor(Math.random() * pool.length)];
    const agentCard = typeof buildBrokerOfficeAgentCard === "function" ? buildBrokerOfficeAgentCard(featured) : null;
    if (agentCard) {
      agentCard.categoryLabel = "공인중개사";
      agentCard.showListingsAction = true;
      if (!String(agentCard.image || "").trim()) {
        agentCard.image = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23eef3f9'/%3E%3Ccircle cx='80' cy='60' r='29' fill='%2394a3b8'/%3E%3Cpath d='M30 142c4-31 23-49 50-49s46 18 50 49' fill='%2394a3b8'/%3E%3C/svg%3E";
      }
    }
    let featuredHtml = agentCard && typeof renderSidebarAgentCard === "function" ? renderSidebarAgentCard(agentCard) : "";
    featuredHtml = featuredHtml
      .replace('<span>매물 보기</span>', '<span>매물 더보기</span>');
    target.classList.remove("parcel-property-loading");
    target.innerHTML = '<div class="parcel-nearby-broker-featured">' + featuredHtml + '</div>';
    const listingsButton = target.querySelector("[data-local-business-card-listings]");
    if (listingsButton && typeof openBrokerOfficeListingPanel === "function") {
      listingsButton.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        void openBrokerOfficeListingPanel(featured, { preserveBrokerLayer: true, preserveMapMarkers: true });
      });
    }
    const phoneButton = target.querySelector("[data-sidebar-agent-phone]");
    if (phoneButton) {
      phoneButton.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        const phone = String(phoneButton.dataset.sidebarAgentPhone || "").trim();
        if (phone) window.location.href = "tel:" + phone;
      });
    }
  }

  function normalizeJibun(value)
  {
    const compact = String(value || "").replace(/\s+/g, "");
    const matched = compact.match(/산?\d+(?:-\d+)?/);
    if (!matched) return "";
    return matched[0]
      .replace(/^산0+(?=\d)/, "산")
      .replace(/^0+(?=\d)/, "")
      .replace(/-0+(?=\d)/g, "-");
  }

  function parcelJibunFromPnu(value)
  {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length !== 19) return "";
    const mainNumber = Number(digits.slice(11, 15));
    const subNumber = Number(digits.slice(15, 19));
    if (!mainNumber) return "";
    return (digits.slice(10, 11) === "2" ? "산" : "") + String(mainNumber) +
      (subNumber > 0 ? "-" + String(subNumber) : "");
  }

  function tradeCoordinateKey(row, feature)
  {
    const supplied = String(row && row.coordinateKey || "").trim();
    if (supplied) return supplied;
    return [
      String(feature && feature.pnu || "").replace(/\D/g, "").slice(0, 3),
      String(row && row.umdName || "").replace(/\s+/g, ""),
      normalizeJibun(row && row.jibun)
    ].join("|");
  }


  const REALJEJU_TRADE_SERVICE_TYPES = [
    "land-sale",
    "apt-sale",
    "apt-rent",
    "rowhouse-sale",
    "rowhouse-rent",
    "single-house-sale",
    "single-house-rent",
    "officetel-sale",
    "officetel-rent"
  ];

  function tradeKindLabel(row)
  {
    const kind = String(row && row.tradeKind || "").trim();
    if (kind) return kind;
    return String(row && row.dealKind || "") === "rent" ? "전월세" : "매매";
  }

  function tradePropertyLabel(row)
  {
    return String(row && row.propertyType || "토지").trim() || "토지";
  }

  function formatTradePrimaryAmount(row)
  {
    const kind = tradeKindLabel(row);
    if (kind === "월세") {
      return formatTradeAmount(row && row.depositManWon) + " / " + formatTradeAmount(row && row.monthlyRentManWon);
    }
    if (kind === "전세") return formatTradeAmount(row && row.depositManWon);
    return formatTradeAmount(row && row.amountManWon);
  }

  function exactTradeBuildingPosition(row)
  {
    function withSuffix(value, suffix) {
      const text = String(value || "").trim();
      if (!text) return "";
      return text.endsWith(suffix) ? text : text + suffix;
    }
    const dong = withSuffix(row && (row.dong || row.aptDong || row.buildingDong || row.dongName), "동");
    const floorValue = String(row && row.floor || "").trim().replace(/층$/, "");
    const floor = withSuffix(floorValue, "층");
    const maskedHo = floorValue ? floorValue + "**호" : "";
    return [dong, floor, maskedHo].filter(Boolean).join(" ") || "-";
  }

  function tradeRowsHtml(rows, requestedUnit)
  {
    if (!rows.length) return '<div class="parcel-property-empty">조건에 맞는 거래가 없습니다.</div>';
    const unit = requestedUnit === "m2" ? "m2" : "py";
    const representative = rows[0] || {};
    const typeLabel = [tradePropertyLabel(representative), String(representative.propertyName || "").trim(), tradeKindLabel(representative)].filter(Boolean).join(" · ");
    const representativeKind = exactTradeKindKey(representative);
    const isMonthlyTable = representativeKind === "monthly";
    const isJeonseTable = representativeKind === "jeonse";
    const rowHtml = rows.map(function(row) {
      if (isMonthlyTable) {
        return '<div class="parcel-trade-row"><span>' + esc(exactTradeDateText(row.dealDate, false)) + '</span><span>' + esc(exactTradeBuildingPosition(row)) + '</span><strong>' + esc(formatTradeAmount(row.depositManWon)) + '</strong><strong>' + esc(formatTradeAmount(row.monthlyRentManWon)) + '</strong></div>';
      }
      const area = finite(row.areaM2);
      const kind = exactTradeKindKey(row);
      const amount = kind === "jeonse" ? finite(row.depositManWon) : (kind === "sale" ? finite(row.amountManWon) : null);
      const unitArea = area == null ? null : (unit === "py" ? area / 3.305785 : area);
      const unitPrice = amount != null && unitArea && unitArea > 0 ? amount / unitArea : null;
      return '<div class="parcel-trade-row"><span>' + esc(exactTradeDateText(row.dealDate, false)) + '</span><span>' + esc(exactTradeBuildingPosition(row)) + '</span><strong>' + esc(formatTradePrimaryAmount(row)) + '</strong><span>' + (unitPrice == null ? "-" : esc(unitPrice.toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "만원")) + '</span></div>';
    });
    const visibleRows = rowHtml.slice(0, 5).join("");
    const extraRowCount = Math.max(0, rowHtml.length - 5);
    const extraRows = rowHtml.slice(5).map(function(html, index) {
      return html.replace('class="parcel-trade-row"', 'class="parcel-trade-row parcel-trade-extra-row" data-parcel-trade-extra-index="' + index + '" hidden');
    }).join("");
    const accordion = rowHtml.length > 5
      ? '<div class="parcel-trade-accordion" data-parcel-trade-accordion data-parcel-trade-total="' + extraRowCount + '">' + extraRows
        + '<div class="parcel-trade-controls"><button type="button" class="parcel-trade-more" data-parcel-trade-more><span class="parcel-trade-more-label">거래내역 더보기 (' + extraRowCount.toLocaleString("ko-KR") + '건)</span><i aria-hidden="true"></i></button>'
        + '<button type="button" class="parcel-trade-collapse" data-parcel-trade-collapse hidden>접기<i aria-hidden="true"></i></button></div></div>'
      : '';
    const tableHead = isMonthlyTable
      ? '<div class="parcel-trade-head"><span>거래일</span><span>동/층/호</span><span>보증금</span><span>임대료(월세)</span></div>'
      : '<div class="parcel-trade-head"><span>거래일</span><span>동/층/호</span><span>' + (isJeonseTable ? "보증금" : "실거래가") + '</span><span>' + (unit === "m2" ? "면적(㎡)당 단가" : "면적(평)당 단가") + '</span></div>';
    return (typeLabel ? '<div class="parcel-trade-property-line">' + esc(typeLabel) + '</div>' : '') + '<div class="parcel-trade-table">' + tableHead + visibleRows + accordion + '</div>';
  }

  function geocodeAddress(address)
  {
    return new Promise(function(resolve) {
      let settled = false;
      function finish(value) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(value);
      }
      // 주소 좌표 변환 응답이 누락돼도 주변 유사거래 로딩이 계속 남지 않도록 종료 시간을 보장합니다.
      const timeoutId = setTimeout(function() { finish(null); }, 3000);
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services || !window.kakao.maps.services.Geocoder) {
        finish(null);
        return;
      }
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function(result, status) {
        if (status !== window.kakao.maps.services.Status.OK || !result || !result[0]) {
          finish(null);
          return;
        }
        finish({ lat: Number(result[0].y), lng: Number(result[0].x) });
      });
    });
  }

  async function attachTradeDistances(records, feature)
  {
    const point = parcelPoint(feature);
    if (!point) return records;
    const dbOnlyCoordinates = true;
    if (dbOnlyCoordinates) {
      return records.map(function(row) {
        const lat = finite(row && row.lat);
        const lng = finite(row && row.lng);
        const coordinate = lat != null && lng != null
          ? { lat: lat, lng: lng }
          : getTimedCache(tradeCoordinateCache, tradeCoordinateKey(row, feature));
        return Object.assign({}, row, {
          distance: coordinate ? distanceMeters(point.lat, point.lng, coordinate.lat, coordinate.lng) : null
        });
      });
    }
    const pnu = String(feature.pnu || "");
    const lawdCode = pnu.replace(/\D/g, "").slice(0, 3);
    const city = pnu.slice(0, 3) === "50130" ? "서귀포시" : "제주시";
    const missing = new Map();
    records.forEach(function(row) {
      const key = tradeCoordinateKey(row, feature);
      const lat = finite(row && row.lat);
      const lng = finite(row && row.lng);
      if (lat != null && lng != null) {
        setTimedCache(tradeCoordinateCache, key, { lat: lat, lng: lng }, TRADE_COORDINATE_BROWSER_CACHE_TTL_MS);
        return;
      }
      if (!getTimedCache(tradeCoordinateCache, key) && !missing.has(key) && missing.size < 30) {
        missing.set(key, row);
      }
    });
    const saves = [];
    await Promise.all(Array.from(missing.entries()).map(async function(entry) {
      const key = entry[0];
      const row = entry[1];
      const address = "제주특별자치도 " + city + " " + String(row.umdName || "") + " " + String(row.jibun || "");
      const result = await geocodeAddress(address);
      if (!result) return;
      setTimedCache(tradeCoordinateCache, key, result, TRADE_COORDINATE_BROWSER_CACHE_TTL_MS);
      saves.push({
        lawdCode: lawdCode,
        umdName: String(row.umdName || "").trim(),
        jibun: String(row.jibun || "").trim(),
        address: address,
        lat: result.lat,
        lng: result.lng
      });
    }));
    if (saves.length) {
      // DB 좌표 캐시 저장은 화면 렌더링의 필수 조건이 아니므로 완료를 기다리지 않습니다.
      void invokeFunction("land-trades", { action: "cacheCoordinates", coordinates: saves }).catch(function(error) {
        console.warn("[realjeju land-trades coordinate-cache]", error);
      });
    }
    return records.map(function(row) {
      const coordinate = getTimedCache(tradeCoordinateCache, tradeCoordinateKey(row, feature));
      return Object.assign({}, row, {
        distance: coordinate ? distanceMeters(point.lat, point.lng, coordinate.lat, coordinate.lng) : null
      });
    });
  }

  function parcelTradeUmdName(feature)
  {
    const address = String(feature?.address || feature?.jibunAddress || "").trim();
    const matches = address.match(/[^\s]+(?:읍|면|동|리)(?=\s|$)/g) || [];
    return String(matches[matches.length - 1] || "").trim();
  }

  function parcelTradeFeaturePoint(feature)
  {
    const coordinateNumber = function(value) {
      if (value === null || value === undefined || String(value).trim() === "") return null;
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    };
    const directCandidates = [
      [feature && feature.selectionLat, feature && feature.selectionLng],
      [feature && feature.lat, feature && feature.lng],
      [feature && feature.latitude, feature && feature.longitude],
      [feature && feature.center && feature.center.lat, feature && feature.center && feature.center.lng],
      [feature && feature.centroid && feature.centroid.lat, feature && feature.centroid && feature.centroid.lng]
    ];
    for (let index = 0; index < directCandidates.length; index += 1) {
      const lat = coordinateNumber(directCandidates[index][0]);
      const lng = coordinateNumber(directCandidates[index][1]);
      if (lat != null && lng != null && !(lat === 0 && lng === 0)) return { lat: lat, lng: lng };
    }
    const points = [];
    const collect = function(value) {
      if (!Array.isArray(value)) return;
      if (value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
        const lng = Number(value[0]);
        const lat = Number(value[1]);
        if (lat >= 32 && lat <= 35 && lng >= 124 && lng <= 129) points.push({ lat: lat, lng: lng });
        return;
      }
      value.forEach(collect);
    };
    collect(feature && feature.geometry && feature.geometry.coordinates);
    if (!points.length) return null;
    return points.reduce(function(result, point) {
      result.lat += point.lat / points.length;
      result.lng += point.lng / points.length;
      return result;
    }, { lat: 0, lng: 0 });
  }

  function parcelTradeGraphAmount(value)
  {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "-";
    if (amount >= 10000) {
      const eok = Math.round((amount / 10000) * 100) / 100;
      return eok.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "억";
    }
    return Math.round(amount).toLocaleString("ko-KR") + "만원";
  }

  function parcelTradeGraphDate(row)
  {
    const value = String(row && row.dealDate || "").trim();
    const matched = value.match(/^(\d{4})[.\/-]?(\d{2})[.\/-]?(\d{2})$/);
    if (!matched) return null;
    const date = new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3]));
    return Number.isFinite(date.getTime()) ? date : null;
  }

  function renderParcelTradeGraph(target, rows, range, radiusMeters)
  {
    if (!target) return;
    const selectedRange = range === "1y" || range === "all" ? range : "3y";
    const selectedRadiusMeters = Number(radiusMeters) === 1000 ? 1000 : 500;
    const saleRows = (Array.isArray(rows) ? rows : []).filter(function(row) {
      return String(row && row.dealKind || "sale") === "sale";
    });
    const all = saleRows.map(function(row) {
      return { row: row, date: parcelTradeGraphDate(row), amount: Number(row && row.amountManWon) };
    }).filter(function(item) {
      return item.date && Number.isFinite(item.amount) && item.amount > 0;
    }).sort(function(a, b) {
      return a.date - b.date;
    });
    const controls = '<div class="parcel-trade-graph-ranges">'
      + '<button type="button" data-parcel-trade-range="3y" class="' + (selectedRange === "3y" ? "is-active" : "") + '">3년간</button>'
      + '<button type="button" data-parcel-trade-range="1y" class="' + (selectedRange === "1y" ? "is-active" : "") + '">1년간</button>'
      + '<button type="button" data-parcel-trade-range="all" class="' + (selectedRange === "all" ? "is-active" : "") + '">전체</button>'
      + '</div>';
    if (!all.length) {
      target.classList.remove("parcel-property-loading");
      // 주변 유사거래가 없을 때도 별도 그래프 여백을 만들지 않고 공통 빈 상태 규격을 사용합니다.
      target.classList.remove("parcel-property-empty");
      target.innerHTML = controls + '<div class="parcel-property-empty">표시할 주변 유사거래가 없습니다.</div>';
      return;
    }
    const anchor = new Date();
    let cutoff = null;
    if (selectedRange === "3y") {
      cutoff = new Date(anchor.getFullYear() - 3, anchor.getMonth(), anchor.getDate());
    } else if (selectedRange === "1y") {
      cutoff = new Date(anchor.getFullYear() - 1, anchor.getMonth(), anchor.getDate());
    }
    const filtered = cutoff ? all.filter(function(item) { return item.date >= cutoff; }) : all;
    if (!filtered.length) {
      target.classList.remove("parcel-property-loading");
      target.innerHTML = controls + '<div class="parcel-property-empty">선택한 기간의 주변 유사거래가 없습니다.</div>';
      return;
    }
    const width = 640;
    const height = 360;
    const left = 64;
    const right = 22;
    const top = 30;
    const bottom = 46;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const maxAmount = Math.max.apply(null, filtered.map(function(item) { return item.amount; }));
    const yMax = Math.max(1, Math.ceil(maxAmount / 1000) * 1000);
    const pointAt = function(item, index) {
      const x = filtered.length === 1 ? left + plotWidth / 2 : left + (index / (filtered.length - 1)) * plotWidth;
      const y = top + plotHeight - (item.amount / yMax) * plotHeight;
      return { x: x, y: y, item: item };
    };
    const points = filtered.map(pointAt);
    const polyline = points.map(function(point) { return point.x.toFixed(1) + "," + point.y.toFixed(1); }).join(" ");
    const area = points.length
      ? "M " + points[0].x.toFixed(1) + " " + (top + plotHeight) + " L " + points.map(function(point) { return point.x.toFixed(1) + " " + point.y.toFixed(1); }).join(" L ") + " L " + points[points.length - 1].x.toFixed(1) + " " + (top + plotHeight) + " Z"
      : "";
    const latest = filtered[filtered.length - 1];
    const labelIndexes = Array.from(new Set([0, Math.floor((filtered.length - 1) / 2), filtered.length - 1]));
    const xLabels = labelIndexes.map(function(index) {
      const point = points[index];
      const label = "'" + String(point.item.date.getFullYear()).slice(-2) + "." + String(point.item.date.getMonth() + 1).padStart(2, "0");
      return '<text x="' + point.x.toFixed(1) + '" y="' + (height - 12) + '" text-anchor="middle">' + esc(label) + '</text>';
    }).join("");
    const yValues = [yMax, yMax / 2, 0];
    const yLabels = yValues.map(function(value, index) {
      const y = top + (index / 2) * plotHeight;
      return '<line x1="' + left + '" y1="' + y.toFixed(1) + '" x2="' + (width - right) + '" y2="' + y.toFixed(1) + '"></line>'
        + '<text x="' + (left - 8) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="end">' + esc(value === 0 ? "0" : parcelTradeGraphAmount(value)) + '</text>';
    }).join("");
    const circles = points.map(function(point) {
      return '<circle cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="5"><title>' + esc(point.item.row.dealDate + " " + parcelTradeGraphAmount(point.item.amount)) + '</title></circle>';
    }).join("");
    const latestPoint = points[points.length - 1];
    const summary = '<div class="parcel-trade-graph-summary"><strong data-parcel-nearby-graph-date>' + esc(latest.row.dealDate.slice(0, 7).replace(/-/g, ".")) + '</strong><span><b>매매</b> <em data-parcel-nearby-graph-amount>' + esc(parcelTradeGraphAmount(latest.amount)) + '</em></span></div>';
    const svg = '<svg class="parcel-trade-graph-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="주변 유사거래 그래프">'
      + '<g class="parcel-trade-graph-grid">' + yLabels + xLabels + '</g>'
      + '<path class="parcel-trade-graph-area" d="' + area + '"></path>'
      + '<polyline class="parcel-trade-graph-line" points="' + polyline + '"></polyline>'
      + '<g class="parcel-trade-graph-points">' + circles + '</g>'
      + '<line class="parcel-trade-graph-cursor" data-parcel-nearby-graph-cursor x1="' + latestPoint.x.toFixed(1) + '" y1="' + top + '" x2="' + latestPoint.x.toFixed(1) + '" y2="' + (top + plotHeight) + '"></line>'
      + '<circle class="parcel-trade-graph-focus" data-parcel-nearby-graph-focus cx="' + latestPoint.x.toFixed(1) + '" cy="' + latestPoint.y.toFixed(1) + '" r="9"></circle>'
      + '<rect data-parcel-nearby-graph-hit x="' + left + '" y="' + top + '" width="' + plotWidth + '" height="' + plotHeight + '" fill="transparent"></rect>'
      + '</svg>';
    target.classList.remove("parcel-property-loading");
    // 주변 유사거래 목록은 같은 필지가 반복되지 않도록 묶고 최신 5건만 표시합니다.
    const recentTradeSeen = new Set();
    const recentTradeRows = filtered
      .slice()
      .sort(function(a, b) { return b.date - a.date; })
      .filter(function(item) {
        const row = item.row || {};
        const parcelKey = [row.umdName, row.jibun, row.apartmentName || row.buildingName]
          .map(function(value) { return String(value || "").replace(/\s+/g, ""); })
          .filter(Boolean)
          .join("|");
        if (!parcelKey || recentTradeSeen.has(parcelKey)) return false;
        recentTradeSeen.add(parcelKey);
        return true;
      })
      .slice(0, 5);
    const recentTradeList = recentTradeRows.length
      ? '<div class="parcel-trade-graph-recent-list">' +
        recentTradeRows.map(function(item) {
          const row = item.row || {};
          const areaM2 = finite(row.areaM2);
          const distance = finite(row.distance);
          const location = [row.umdName, row.jibun].filter(Boolean).join(" ");
          const parcelLabel = [location || "거래 필지", row.jimok].filter(Boolean).join(" · ");
          const dateLabel = row.dealDate ? esc(String(row.dealDate).replace(/-/g, ".")) : "-";
          const areaLabel = areaM2 !== null
            ? '<span data-parcel-property-area-sqm="' + esc(String(areaM2)) + '">' + esc(formatArea(areaM2)) + '</span>'
            : "-";
          const distanceLabel = distance !== null ? esc(formatDistance(distance)) : "-";
          return (
            '<div class="parcel-property-info-row parcel-similar-trade-row">' +
              '<span class="parcel-similar-trade-location">' + esc(parcelLabel) + '</span>' +
              '<span class="parcel-similar-trade-date">' + dateLabel + '</span>' +
              '<span class="parcel-similar-trade-area">' + areaLabel + '</span>' +
              '<span class="parcel-similar-trade-distance">' + distanceLabel + '</span>' +
              '<strong class="parcel-similar-trade-amount">' + esc(formatTradeAmount(row.amountManWon)) + '</strong>' +
            '</div>'
          );
        }).join("") +
        '</div>'
      : '';

    target.classList.remove("parcel-property-empty");
    target.innerHTML = controls + summary + svg + recentTradeList;
    const graphSvg = target.querySelector(".parcel-trade-graph-svg");
    const graphHit = target.querySelector("[data-parcel-nearby-graph-hit]");
    const graphCursor = target.querySelector("[data-parcel-nearby-graph-cursor]");
    const graphFocus = target.querySelector("[data-parcel-nearby-graph-focus]");
    const graphDate = target.querySelector("[data-parcel-nearby-graph-date]");
    const graphAmount = target.querySelector("[data-parcel-nearby-graph-amount]");
    function selectNearbyGraphPoint(point) {
      if (!point) return;
      if (graphCursor) {
        graphCursor.setAttribute("x1", point.x.toFixed(1));
        graphCursor.setAttribute("x2", point.x.toFixed(1));
      }
      if (graphFocus) {
        graphFocus.setAttribute("cx", point.x.toFixed(1));
        graphFocus.setAttribute("cy", point.y.toFixed(1));
      }
      if (graphDate) graphDate.textContent = String(point.item.row.dealDate || "-").slice(0, 7).replace(/-/g, ".");
      if (graphAmount) graphAmount.textContent = parcelTradeGraphAmount(point.item.amount);
    }
    if (graphSvg && graphHit) {
      graphHit.onpointermove = function(event) {
        const rect = graphSvg.getBoundingClientRect();
        if (!rect.width) return;
        const viewX = (event.clientX - rect.left) / rect.width * width;
        let nearest = points[0];
        points.forEach(function(point) {
          if (Math.abs(point.x - viewX) < Math.abs(nearest.x - viewX)) nearest = point;
        });
        selectNearbyGraphPoint(nearest);
      };
    }
  }

  function settleParcelTradePromise(promise, timeoutMs, message)
  {
    return new Promise(function(resolve, reject) {
      let settled = false;
      const timeoutId = setTimeout(function() {
        if (settled) return;
        settled = true;
        reject(new Error(message));
      }, timeoutMs);
      Promise.resolve(promise).then(function(value) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(value);
      }, function(error) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  let parcelTradeTaskSequence = 0;
  const parcelTradeTaskTokens = new WeakMap();

  function beginParcelTradeTask(panel)
  {
    const token = ++parcelTradeTaskSequence;
    parcelTradeTaskTokens.set(panel, token);
    return function isCurrentParcelTradeTask() {
      return panel.isConnected &&
        parcelTradeTaskTokens.get(panel) === token &&
        parcelTradeTaskSequence === token;
    };
  }

  function waitForParcelTradePaint()
  {
    return new Promise(function(resolve) {
      window.requestAnimationFrame(function() { resolve(); });
    });
  }

  const EXACT_TRADE_KIND_TABS = [
    { key: "sale", label: "매매" },
    { key: "jeonse", label: "전세" },
    { key: "monthly", label: "월세" }
  ];

  function exactTradeKindKey(row)
  {
    const label = String(tradeKindLabel(row) || "").trim();
    if (label === "전세") return "jeonse";
    if (label === "월세" || label === "년세" || label === "연세") return "monthly";
    return "sale";
  }

  function exactTradeFirstArea(row, keys)
  {
    for (let index = 0; index < keys.length; index += 1) {
      const value = finite(row && row[keys[index]]);
      if (value != null && value > 0) return value;
    }
    return null;
  }

  function exactTradeAreaInfo(row)
  {
    return {
      supplyM2: exactTradeFirstArea(row, ["supplyAreaM2", "supplyArea", "contractAreaM2", "contractArea"]),
      exclusiveM2: exactTradeFirstArea(row, ["exclusiveAreaM2", "exclusiveArea", "areaM2"])
    };
  }

  function exactTradeAreaNumber(value)
  {
    return value == null ? "" : String(Math.round(Number(value) * 1000) / 1000);
  }

  function exactTradeAreaKey(row)
  {
    const area = exactTradeAreaInfo(row);
    if (area.supplyM2 == null && area.exclusiveM2 == null) return "unknown";
    return exactTradeAreaNumber(area.supplyM2) + ":" + exactTradeAreaNumber(area.exclusiveM2);
  }

  function exactTradeAreaGroups(rows)
  {
    const groups = new Map();
    rows.forEach(function(row) {
      const key = exactTradeAreaKey(row);
      if (key === "unknown") return;
      if (!groups.has(key)) {
        const area = exactTradeAreaInfo(row);
        groups.set(key, { key: key, supplyM2: area.supplyM2, exclusiveM2: area.exclusiveM2, count: 0 });
      }
      groups.get(key).count += 1;
    });
    return Array.from(groups.values()).sort(function(a, b) {
      return Number(b.supplyM2 || b.exclusiveM2 || 0) - Number(a.supplyM2 || a.exclusiveM2 || 0);
    });
  }

  function exactTradeAreaText(value, unit)
  {
    if (value == null) return "-";
    const numeric = Number(value);
    if (unit === "py") {
      const py = numeric / 3.305785;
      return (Math.round(py * 100) / 100).toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "평";
    }
    return (Math.round(numeric * 1000) / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 3 }) + "㎡";
  }

  function exactTradeDateStamp(value)
  {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length < 6) return null;
    const year = Number(digits.slice(0, 4));
    const month = Number(digits.slice(4, 6));
    const day = digits.length >= 8 ? Number(digits.slice(6, 8)) : 1;
    const stamp = Date.UTC(year, Math.max(0, month - 1), Math.max(1, day));
    return Number.isFinite(stamp) ? stamp : null;
  }

  function exactTradeDateText(value, shortYear)
  {
    const stamp = typeof value === "number" ? value : exactTradeDateStamp(value);
    if (stamp == null) return "-";
    const date = new Date(stamp);
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return (shortYear ? year.slice(2) : year) + "." + month + "." + day;
  }

  function exactTradeMonthText(value, shortYear)
  {
    const stamp = typeof value === "number" ? value : exactTradeDateStamp(value);
    if (stamp == null) return "-";
    const date = new Date(stamp);
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return (shortYear ? year.slice(2) : year) + "." + month;
  }

  function exactTradeMoneyValue(row, kind)
  {
    if (kind === "jeonse") return finite(row && row.depositManWon);
    if (kind === "sale") return finite(row && row.amountManWon);
    return null;
  }

  function exactTradeGraphModel(rows, range)
  {
    let points = rows.map(function(row) {
      const kind = exactTradeKindKey(row);
      const stamp = exactTradeDateStamp(row && row.dealDate);
      const value = exactTradeMoneyValue(row, kind);
      return { kind: kind, stamp: stamp, value: value };
    }).filter(function(point) {
      return (point.kind === "sale" || point.kind === "jeonse") && point.stamp != null && point.value != null && point.value > 0;
    }).sort(function(a, b) { return a.stamp - b.stamp; });
    if (!points.length) return null;
    const latestStamp = points[points.length - 1].stamp;
    const cutoff = range === "1y" ? latestStamp - 366 * 86400000 : (range === "3y" ? latestStamp - 1096 * 86400000 : (range === "5y" ? latestStamp - 1827 * 86400000 : -Infinity));
    points = points.filter(function(point) { return point.stamp >= cutoff; });
    if (!points.length) return null;
    const monthlyGroups = new Map();
    points.forEach(function(point) {
      const date = new Date(point.stamp);
      const monthStamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
      const key = point.kind + ":" + monthStamp;
      if (!monthlyGroups.has(key)) monthlyGroups.set(key, { kind: point.kind, stamp: monthStamp, total: 0, count: 0 });
      const group = monthlyGroups.get(key);
      group.total += point.value;
      group.count += 1;
    });
    points = Array.from(monthlyGroups.values()).map(function(group) {
      return { kind: group.kind, stamp: group.stamp, value: group.total / group.count };
    }).sort(function(a, b) { return a.stamp - b.stamp; });
    const firstMonth = points[0].stamp;
    const lastMonth = points[points.length - 1].stamp;
    const timeline = [];
    for (let cursor = firstMonth; cursor <= lastMonth;) {
      timeline.push(cursor);
      const date = new Date(cursor);
      cursor = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
    }
    function expandMonthlySeries(kind) {
      const source = points.filter(function(point) { return point.kind === kind; });
      if (!source.length) return [];
      let latest = null;
      return timeline.map(function(stamp) {
        const current = source.find(function(point) { return point.stamp === stamp; });
        if (current) latest = current;
        if (!latest) latest = source[0];
        return { kind: kind, stamp: stamp, value: latest.value, sourceStamp: latest.stamp };
      });
    }
    const sale = expandMonthlySeries("sale");
    const jeonse = expandMonthlySeries("jeonse");
    const width = 640;
    const height = 360;
    const left = 64;
    const right = 22;
    const top = 30;
    const bottom = 46;
    const minStamp = timeline[0];
    const maxStamp = timeline[timeline.length - 1];
    const rawMax = Math.max.apply(null, points.map(function(point) { return point.value; }));
    const amountStep = rawMax >= 10000 ? 10000 : 1000;
    const maxValue = Math.max(amountStep, Math.ceil(rawMax / amountStep) * amountStep);
    function xFor(stamp) {
      if (maxStamp === minStamp) return left + (width - left - right) / 2;
      return left + (stamp - minStamp) / (maxStamp - minStamp) * (width - left - right);
    }
    function yFor(value) {
      return top + (1 - value / maxValue) * (height - top - bottom);
    }
    function pathFor(series) {
      const pathPoints = series.slice();
      if (pathPoints.length && pathPoints[pathPoints.length - 1].stamp < maxStamp) {
        pathPoints.push({
          kind: pathPoints[pathPoints.length - 1].kind,
          stamp: maxStamp,
          value: pathPoints[pathPoints.length - 1].value
        });
      }
      return pathPoints.map(function(point, index) {
        return (index ? "L" : "M") + xFor(point.stamp).toFixed(2) + " " + yFor(point.value).toFixed(2);
      }).join(" ");
    }
    function areaPathFor(series) {
      if (!series.length) return "";
      return pathFor(series)
        + " L" + xFor(series[series.length - 1].stamp).toFixed(2) + " " + (height - bottom)
        + " L" + xFor(series[0].stamp).toFixed(2) + " " + (height - bottom)
        + " Z";
    }
    return {
      points: points,
      sale: sale,
      jeonse: jeonse,
      timeline: timeline,
      width: width,
      height: height,
      left: left,
      right: right,
      top: top,
      bottom: bottom,
      minStamp: minStamp,
      maxStamp: maxStamp,
      maxValue: maxValue,
      xFor: xFor,
      yFor: yFor,
      salePath: pathFor(sale),
      jeonsePath: pathFor(jeonse),
      saleAreaPath: areaPathFor(sale),
      jeonseAreaPath: areaPathFor(jeonse)
    };
  }

  function exactTradeGraphSnapshot(model, stamp)
  {
    function latestAt(series) {
      let match = null;
      series.forEach(function(point) {
        if (point.stamp <= stamp) match = point;
      });
      return match || series[0] || null;
    }
    const sale = latestAt(model.sale);
    const jeonse = latestAt(model.jeonse);
    return {
      stamp: stamp,
      sale: sale,
      jeonse: jeonse,
      ratio: sale && jeonse && sale.value > 0 ? jeonse.value / sale.value * 100 : null
    };
  }

  function exactTradeGraphHtml(model, range)
  {
    if (!model) return '<div class="parcel-exact-graph-empty">선택 면적의 매매·전세 그래프 데이터가 없습니다.</div>';
    const initial = exactTradeGraphSnapshot(model, model.maxStamp);
    const midValue = model.maxValue / 2;
    const axisY = [
      '<line x1="' + model.left + '" y1="' + model.top + '" x2="' + (model.width - model.right) + '" y2="' + model.top + '"/>',
      '<line x1="' + model.left + '" y1="' + model.yFor(midValue) + '" x2="' + (model.width - model.right) + '" y2="' + model.yFor(midValue) + '"/>',
      '<line x1="' + model.left + '" y1="' + (model.height - model.bottom) + '" x2="' + (model.width - model.right) + '" y2="' + (model.height - model.bottom) + '"/>'
    ].join("");
    const saleDots = model.sale.map(function(point) {
      return '<circle class="parcel-exact-graph-dot is-sale" cx="' + model.xFor(point.stamp) + '" cy="' + model.yFor(point.value) + '" r="4"/>';
    }).join("");
    const jeonseDots = model.jeonse.map(function(point) {
      return '<circle class="parcel-exact-graph-dot is-jeonse" cx="' + model.xFor(point.stamp) + '" cy="' + model.yFor(point.value) + '" r="4"/>';
    }).join("");
    return '<div class="parcel-exact-graph-ranges">' + [
      { key: "5y", label: "5년간" }, { key: "3y", label: "3년간" }, { key: "1y", label: "1년간" }, { key: "all", label: "전체" }
    ].map(function(item) {
      return '<button type="button" data-parcel-exact-graph-range="' + item.key + '" class="' + (range === item.key ? "is-active" : "") + '">' + item.label + '</button>';
    }).join("") + '</div>' +
      '<div class="parcel-exact-graph-readout">' +
        '<strong data-parcel-exact-graph-date>' + exactTradeMonthText(initial.stamp, false) + '</strong>' +
        '<span><b>매매</b><em data-parcel-exact-graph-sale>' + (initial.sale ? formatTradeAmount(initial.sale.value) : "-") + '</em><small data-parcel-exact-graph-sale-date>' + (initial.sale ? "(" + exactTradeMonthText(initial.sale.sourceStamp || initial.sale.stamp, false) + ")" : "") + '</small></span>' +
        '<span><b>전세</b><em data-parcel-exact-graph-jeonse>' + (initial.jeonse ? formatTradeAmount(initial.jeonse.value) : "-") + '</em><small data-parcel-exact-graph-jeonse-date>' + (initial.jeonse ? "(" + exactTradeMonthText(initial.jeonse.sourceStamp || initial.jeonse.stamp, false) + ")" : "") + '</small></span>' +
        '<span class="parcel-exact-graph-ratio"><b>전세가율</b><em data-parcel-exact-graph-ratio>' + (initial.ratio == null ? "-" : initial.ratio.toFixed(2) + "%") + '</em></span>' +
      '</div>' +
      '<div class="parcel-exact-graph-canvas"><svg data-parcel-exact-graph-svg viewBox="0 0 ' + model.width + ' ' + model.height + '" role="img" aria-label="실거래가 매매 전세 그래프">' +
        '<g class="parcel-exact-graph-grid">' + axisY + '</g>' +
        '<g class="parcel-exact-graph-axis-labels">' +
          '<text x="' + (model.left - 12) + '" y="' + (model.top + 5) + '" text-anchor="end">' + formatTradeAmount(model.maxValue) + '</text>' +
          '<text x="' + (model.left - 12) + '" y="' + (model.yFor(midValue) + 5) + '" text-anchor="end">' + formatTradeAmount(midValue) + '</text>' +
          '<text x="' + (model.left - 12) + '" y="' + (model.height - model.bottom + 5) + '" text-anchor="end">0</text>' +
          '<text x="' + model.left + '" y="' + (model.height - 14) + '" text-anchor="middle">' + exactTradeMonthText(model.minStamp, true) + '</text>' +
          '<text x="' + (model.width - model.right) + '" y="' + (model.height - 14) + '" text-anchor="middle">' + exactTradeMonthText(model.maxStamp, true) + '</text>' +
        '</g>' +
        (model.saleAreaPath ? '<path class="parcel-exact-graph-area is-sale" d="' + model.saleAreaPath + '"/>' : "") +
        (model.jeonseAreaPath ? '<path class="parcel-exact-graph-area is-jeonse" d="' + model.jeonseAreaPath + '"/>' : "") +
        (model.salePath ? '<path class="parcel-exact-graph-line is-sale" d="' + model.salePath + '"/>' + saleDots : "") +
        (model.jeonsePath ? '<path class="parcel-exact-graph-line is-jeonse" d="' + model.jeonsePath + '"/>' + jeonseDots : "") +
        '<line data-parcel-exact-graph-cursor class="parcel-exact-graph-cursor" x1="' + model.xFor(initial.stamp) + '" y1="' + model.top + '" x2="' + model.xFor(initial.stamp) + '" y2="' + (model.height - model.bottom) + '"/>' +
        '<circle data-parcel-exact-sale-cursor class="parcel-exact-graph-focus is-sale" r="8"/>' +
        '<circle data-parcel-exact-jeonse-cursor class="parcel-exact-graph-focus is-jeonse" r="8"/>' +
        '<rect data-parcel-exact-graph-hit x="' + model.left + '" y="' + model.top + '" width="' + (model.width - model.left - model.right) + '" height="' + (model.height - model.top - model.bottom) + '" fill="transparent"/>' +
      '</svg></div>';
  }

  function updateExactTradeGraphReadout(target, model, stamp)
  {
    const snapshot = exactTradeGraphSnapshot(model, stamp);
    const date = target.querySelector("[data-parcel-exact-graph-date]");
    const sale = target.querySelector("[data-parcel-exact-graph-sale]");
    const saleDate = target.querySelector("[data-parcel-exact-graph-sale-date]");
    const jeonse = target.querySelector("[data-parcel-exact-graph-jeonse]");
    const jeonseDate = target.querySelector("[data-parcel-exact-graph-jeonse-date]");
    const ratio = target.querySelector("[data-parcel-exact-graph-ratio]");
    if (date) date.textContent = exactTradeMonthText(snapshot.stamp, false);
    if (sale) sale.textContent = snapshot.sale ? formatTradeAmount(snapshot.sale.value) : "-";
    if (saleDate) saleDate.textContent = snapshot.sale ? "(" + exactTradeMonthText(snapshot.sale.sourceStamp || snapshot.sale.stamp, false) + ")" : "";
    if (jeonse) jeonse.textContent = snapshot.jeonse ? formatTradeAmount(snapshot.jeonse.value) : "-";
    if (jeonseDate) jeonseDate.textContent = snapshot.jeonse ? "(" + exactTradeMonthText(snapshot.jeonse.sourceStamp || snapshot.jeonse.stamp, false) + ")" : "";
    if (ratio) ratio.textContent = snapshot.ratio == null ? "-" : snapshot.ratio.toFixed(2) + "%";
    const x = model.xFor(snapshot.stamp);
    const cursor = target.querySelector("[data-parcel-exact-graph-cursor]");
    if (cursor) {
      cursor.setAttribute("x1", x);
      cursor.setAttribute("x2", x);
    }
    [
      { node: target.querySelector("[data-parcel-exact-sale-cursor]"), point: snapshot.sale },
      { node: target.querySelector("[data-parcel-exact-jeonse-cursor]"), point: snapshot.jeonse }
    ].forEach(function(item) {
      if (!item.node) return;
      if (!item.point) {
        item.node.style.display = "none";
        return;
      }
      item.node.style.display = "";
      item.node.setAttribute("cx", x);
      item.node.setAttribute("cy", model.yFor(item.point.value));
    });
  }

  function openExactTradeAreaModal(target)
  {
    const oldModal = document.querySelector("[data-parcel-exact-area-modal]");
    if (oldModal) oldModal.remove();
    const rows = Array.isArray(target.__parcelExactTradeRows) ? target.__parcelExactTradeRows : [];
    const groups = exactTradeAreaGroups(rows);
    const unit = target.__parcelExactTradeAreaUnit === "m2" ? "m2" : "py";
    const modal = document.createElement("div");
    modal.className = "parcel-exact-area-modal";
    modal.setAttribute("data-parcel-exact-area-modal", "");
    modal.innerHTML = '<div class="parcel-exact-area-dialog" role="dialog" aria-modal="true" aria-label="면적 선택">' +
      '<header><div class="parcel-exact-area-units" aria-label="면적 단위">' +
        '<button type="button" data-parcel-exact-area-unit="py" class="' + (unit === "py" ? "is-active" : "") + '">평수</button>' +
        '<button type="button" data-parcel-exact-area-unit="m2" class="' + (unit === "m2" ? "is-active" : "") + '">제곱미터</button>' +
      '</div><h3>면적 선택</h3><button type="button" class="parcel-exact-area-close" data-parcel-exact-area-close aria-label="닫기"></button></header>' +
      '<div class="parcel-exact-area-table"><div class="parcel-exact-area-head"><span>분양면적</span><span>전용면적</span><span>전체 거래건수</span></div>' +
      (groups.length ? groups.map(function(group) {
        return '<button type="button" class="parcel-exact-area-row ' + (group.key === target.__parcelExactTradeAreaKey ? "is-active" : "") + '" data-parcel-exact-area-key="' + escapeHtml(group.key) + '"><span>' + exactTradeAreaText(group.supplyM2, unit) + '</span><span>' + exactTradeAreaText(group.exclusiveM2, unit) + '</span><strong>' + group.count.toLocaleString("ko-KR") + '</strong></button>';
      }).join("") : '<div class="parcel-property-empty">선택할 면적 정보가 없습니다.</div>') + '</div></div>';
    modal.onclick = function(event) {
      if (event.target === modal || event.target.closest("[data-parcel-exact-area-close]")) {
        modal.remove();
        return;
      }
      const unitButton = event.target.closest("[data-parcel-exact-area-unit]");
      if (unitButton) {
        event.preventDefault();
        event.stopPropagation();
        const nextUnit = unitButton.getAttribute("data-parcel-exact-area-unit") === "m2" ? "m2" : "py";
        target.__parcelExactTradeAreaUnit = nextUnit;
        modal.remove();
        renderExactTradeExperience(target, rows);
        window.requestAnimationFrame(function() {
          openExactTradeAreaModal(target);
        });
        return;
      }
      const areaButton = event.target.closest("[data-parcel-exact-area-key]");
      if (areaButton) {
        target.__parcelExactTradeAreaKey = areaButton.getAttribute("data-parcel-exact-area-key") || "";
        const selectedAreaRows = rows.filter(function(row) {
          return exactTradeAreaKey(row) === target.__parcelExactTradeAreaKey;
        });
        const currentKind = target.__parcelExactTradeKind || "sale";
        const currentKindExists = selectedAreaRows.some(function(row) {
          return exactTradeKindKey(row) === currentKind;
        });
        if (!currentKindExists) {
          const availableTab = EXACT_TRADE_KIND_TABS.find(function(tab) {
            return selectedAreaRows.some(function(row) { return exactTradeKindKey(row) === tab.key; });
          });
          if (availableTab) target.__parcelExactTradeKind = availableTab.key;
        }
        modal.remove();
        renderExactTradeExperience(target, rows);
      }
    };
    document.body.appendChild(modal);
  }

  function wireExactTradeExperience(target, graphModel)
  {
    target.onclick = function(event) {
      const kindButton = event.target.closest("[data-parcel-exact-kind]");
      if (kindButton) {
        target.__parcelExactTradeKind = kindButton.getAttribute("data-parcel-exact-kind") || "sale";
        target.__parcelExactTradeAreaKey = "";
        renderExactTradeExperience(target, target.__parcelExactTradeRows || []);
        return;
      }
      if (event.target.closest("[data-parcel-exact-area-open]")) {
        openExactTradeAreaModal(target);
        return;
      }
      const rangeButton = event.target.closest("[data-parcel-exact-graph-range]");
      if (rangeButton) {
        target.__parcelExactTradeRange = rangeButton.getAttribute("data-parcel-exact-graph-range") || "3y";
        renderExactTradeExperience(target, target.__parcelExactTradeRows || []);
      }
    };
    if (!graphModel) return;
    const svg = target.querySelector("[data-parcel-exact-graph-svg]");
    const hit = target.querySelector("[data-parcel-exact-graph-hit]");
    if (!svg || !hit) return;
    updateExactTradeGraphReadout(target, graphModel, graphModel.maxStamp);
    hit.onpointermove = function(event) {
      const rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      const viewX = (event.clientX - rect.left) / rect.width * graphModel.width;
      const ratio = Math.max(0, Math.min(1, (viewX - graphModel.left) / (graphModel.width - graphModel.left - graphModel.right)));
      const targetStamp = graphModel.minStamp + ratio * (graphModel.maxStamp - graphModel.minStamp);
      let nearest = graphModel.timeline[0];
      graphModel.timeline.forEach(function(stamp) {
        if (Math.abs(stamp - targetStamp) < Math.abs(nearest - targetStamp)) nearest = stamp;
      });
      updateExactTradeGraphReadout(target, graphModel, nearest);
    };
  }

  function isLandExactTradeExperience(rows)
  {
    if (!rows.length) return true;
    return rows.every(function(row) {
      const serviceType = String(row && row.serviceType || "").toLowerCase();
      const propertyType = String(row && row.propertyType || "").trim();
      return serviceType.indexOf("land-") === 0 || propertyType === "토지";
    });
  }

  function exactTradeEmptyStateHtml(coverage)
  {
    const status = String(coverage && coverage.status || "unknown");
    if (status === "complete") {
      return '<div class="parcel-property-empty">최근 10년 실제 거래 내역이 없습니다.</div>';
    }
    if (status === "partial") {
      return '<div class="parcel-property-empty realjeju-property-state-message">실거래 정보를 확인 중입니다.</div>';
    }
    if (status === "not_loaded") {
      return '<div class="parcel-property-empty">실거래 데이터가 아직 DB에 적재되지 않았습니다.</div>';
    }
    if (status === "stale") {
      return '<div class="parcel-property-empty">실거래 데이터 갱신이 필요합니다.</div>';
    }
    return '<div class="parcel-property-empty">실거래 정보가 존재하지 않습니다.</div>';
  }

  function renderExactTradeExperience(target, sourceRows, cacheCoverage)
  {
    const rows = Array.isArray(sourceRows) ? sourceRows.slice() : [];
    target.__parcelExactTradeRows = rows;
    if (cacheCoverage !== undefined) target.__parcelExactTradeCacheCoverage = cacheCoverage;
    const resolvedCoverage = target.__parcelExactTradeCacheCoverage || null;
    if (isLandExactTradeExperience(rows)) {
      const oldModal = document.querySelector("[data-parcel-exact-area-modal]");
      if (oldModal) oldModal.remove();
      target.onclick = null;
      target.innerHTML = rows.length
        ? '<div class="parcel-land-trade-only">' + tradeRowsHtml(rows.slice().sort(function(a, b) {
          return String(b.dealDate || "").localeCompare(String(a.dealDate || ""));
        }).slice(0, 500)) + '</div>'
        : exactTradeEmptyStateHtml(resolvedCoverage);
      return;
    }
    const kind = target.__parcelExactTradeKind || "sale";
    const unit = target.__parcelExactTradeAreaUnit === "m2" ? "m2" : "py";
    const range = target.__parcelExactTradeRange || "3y";
    const kindRows = rows.filter(function(row) { return exactTradeKindKey(row) === kind; });
    const groups = exactTradeAreaGroups(rows);
    let selectedKey = target.__parcelExactTradeAreaKey || "";
    if (!groups.some(function(group) { return group.key === selectedKey; })) {
      selectedKey = kindRows.length ? exactTradeAreaKey(kindRows[0]) : (groups[0] ? groups[0].key : "");
      target.__parcelExactTradeAreaKey = selectedKey;
    }
    const selectedGroup = groups.find(function(group) { return group.key === selectedKey; }) || null;
    const historyRows = kindRows.filter(function(row) { return !selectedKey || exactTradeAreaKey(row) === selectedKey; }).sort(function(a, b) {
      return String(b.dealDate || "").localeCompare(String(a.dealDate || ""));
    });
    const latest = historyRows[0] || null;
    const graphRows = rows.filter(function(row) { return !selectedKey || exactTradeAreaKey(row) === selectedKey; });
    const graphModel = exactTradeGraphModel(graphRows, range);
    target.innerHTML = '<div class="parcel-exact-trade-ui">' +
      '<div class="parcel-exact-kind-tabs" role="tablist" aria-label="실거래 유형">' + EXACT_TRADE_KIND_TABS.map(function(tab) {
        return '<button type="button" role="tab" aria-selected="' + (kind === tab.key ? "true" : "false") + '" data-parcel-exact-kind="' + tab.key + '" class="' + (kind === tab.key ? "is-active" : "") + '">' + tab.label + '</button>';
      }).join("") + '</div>' +
      '<div class="parcel-exact-summary"><div class="parcel-exact-latest"><span>최근 실거래가</span><strong>' + (latest ? escapeHtml(formatTradePrimaryAmount(latest)) : "-") + '</strong><time>' + (latest ? exactTradeDateText(latest.dealDate, true) : "거래 없음") + '</time></div>' +
      '<button type="button" class="parcel-exact-area-trigger" data-parcel-exact-area-open><strong>' + (selectedGroup && selectedGroup.supplyM2 != null ? "분양 " + exactTradeAreaText(selectedGroup.supplyM2, unit) : "분양면적 -") + '</strong><span>전용 ' + (selectedGroup ? exactTradeAreaText(selectedGroup.exclusiveM2, unit) : "-") + '</span><i aria-hidden="true"></i></button></div>' +
      '<div class="parcel-exact-divider"></div>' +
      '<h3 class="parcel-exact-history-title">거래내역 (' + historyRows.length.toLocaleString("ko-KR") + '건)</h3>' +
      tradeRowsHtml(historyRows.slice(0, 500), unit) +
      '<section class="parcel-exact-graph"><h3>실거래가 그래프</h3>' + exactTradeGraphHtml(graphModel, range) + '</section>' +
    '</div>';
    wireExactTradeExperience(target, graphModel);
  }

  function exactTradeRowsFromResponse(data, sourceJibun)
  {
    const records = Array.isArray(data && data.records) ? data.records.slice() : [];
    return records.filter(function(row) {
      return sourceJibun && normalizeJibun(row && row.jibun) === sourceJibun;
    });
  }


  async function loadTrades(panel, feature, radiusMeters, range)
  {
    const exactTarget = panel.querySelector("[data-parcel-exact-trades]");
    const similarTarget = panel.querySelector("[data-parcel-similar-trades]");
    const graphTarget = panel.querySelector("[data-parcel-trade-chart]");
    const pnu = String(feature.pnu || "");
    if (!pnu || !exactTarget || !graphTarget) return;
    const selectedRadiusMeters = Number(radiusMeters) === 1000 ? 1000 : 500;
    const selectedRange = range === "1y" || range === "all" ? range : "3y";
    const isCurrentTask = beginParcelTradeTask(panel);
    try {
      const sourceJibun = normalizeJibun(
        feature.jibun || (feature.landCharacteristics || {}).jibun || parcelJibunFromPnu(pnu)
      );
      const targetUmdName = parcelTradeUmdName(feature);
      const featurePoint = parcelTradeFeaturePoint(feature);
      const tradeCacheKey = pnu + ":" + selectedRadiusMeters;
      let data = getTimedCache(tradeCache, tradeCacheKey);
      if (!data) {
        const exactTradeCacheKey = pnu + ":exact";
        try {
          let exactData = getTimedCache(tradeCache, exactTradeCacheKey);
          if (!exactData) {
            exactData = await settleParcelTradePromise(
              invokeFunction("land-trades", {
                pnu: pnu,
                jibun: sourceJibun,
                umdName: targetUmdName,
                serviceTypes: REALJEJU_TRADE_SERVICE_TYPES,
                nearbyServiceTypes: [],
                lat: null,
                lng: null,
                radiusMeters: 500,
                nearbyLimit: 1
              }),
              6000,
              "정확 필지 실거래가 조회 시간이 초과되었습니다."
            );
            if (!isCurrentTask()) return;
            setTimedCache(tradeCache, exactTradeCacheKey, exactData, TRADE_BROWSER_CACHE_TTL_MS);
          }
          if (!isCurrentTask()) return;
          exactTarget.classList.remove("parcel-property-loading");
          renderExactTradeExperience(
            exactTarget,
            exactTradeRowsFromResponse(exactData, sourceJibun),
            exactData.cacheCoverage
          );
          await waitForParcelTradePaint();
        } catch (error) {
          console.warn("[realjeju exact land-trades]", error);
        }
        // 필지 조회에서는 공공데이터를 호출하지 않고 미리 적재된 Supabase 거래 레코드만 조회합니다.
        data = await settleParcelTradePromise(
          invokeFunction("land-trades", {
            pnu: pnu,
            jibun: sourceJibun,
            umdName: targetUmdName,
            serviceTypes: REALJEJU_TRADE_SERVICE_TYPES,
            nearbyServiceTypes: [
              "land-sale",
              "apt-sale",
              "rowhouse-sale",
              "single-house-sale",
              "officetel-sale"
            ],
            lat: featurePoint ? featurePoint.lat : null,
            lng: featurePoint ? featurePoint.lng : null,
            radiusMeters: selectedRadiusMeters,
            nearbyLimit: 50
          }),
          9000,
          "실거래가 조회 시간이 초과되었습니다."
        );
        if (!isCurrentTask()) return;
        setTimedCache(tradeCache, tradeCacheKey, data, TRADE_BROWSER_CACHE_TTL_MS);
      }
      if (!isCurrentTask()) return;
      // 법정동ㆍ지번 일치 판정은 Edge Function의 공통 정규화 결과를 신뢰하고,
      // 화면에서는 반환된 정확 거래를 다시 다른 문자열 규칙으로 제거하지 않습니다.
      const exactAll = exactTradeRowsFromResponse(data, sourceJibun);
      const info = feature.landCharacteristics || {};
      const graphJimok = String(feature.jimok || info.jimok || "").trim();
      const graphZone = String(feature.landUseZone || info.landUseZone || "").trim();
      const exactSale = exactAll.find(function(row) {
        return String(row && row.dealKind || "sale") === "sale";
      });
      const graphPropertyType = exactSale ? tradePropertyLabel(exactSale) : "토지";
      const nearbyRecords = Array.isArray(data.nearbyRecords) ? data.nearbyRecords.slice() : [];
      const normalizedTargetUmd = String(targetUmdName || "").replace(/\s+/g, "");
      const saleCandidates = nearbyRecords.filter(function(row) {
        const isSale = String(row && row.dealKind || "sale") === "sale";
        const rowUmd = String(row && row.umdName || "").replace(/\s+/g, "");
        const sameUmd = !normalizedTargetUmd || rowUmd === normalizedTargetUmd ||
          rowUmd.endsWith(normalizedTargetUmd) || normalizedTargetUmd.endsWith(rowUmd);
        const sameParcel = sameUmd && normalizeJibun(row && row.jibun) === sourceJibun;
        return isSale && !sameParcel;
      });
      const samePropertyCandidates = saleCandidates.filter(function(row) {
        return tradePropertyLabel(row) === graphPropertyType;
      });
      const strictCandidates = samePropertyCandidates.filter(function(row) {
        const rowJimok = String(row && row.jimok || "").trim();
        const jimokMatch = graphPropertyType !== "토지" || !graphJimok || !rowJimok || rowJimok === graphJimok;
        const rowZone = String(row && row.landUseZone || "").trim();
        const zoneMatch = graphPropertyType !== "토지" || !graphZone || !rowZone || rowZone === graphZone;
        return jimokMatch && zoneMatch;
      });
      // 공공 원본의 지목ㆍ용도지역 누락만으로 전체 후보가 사라지지 않게
      // 동일 유형, 전체 매매 후보 순으로 완화합니다. 선택한 거리 범위는 서버가 보장합니다.
      const graphCandidates = strictCandidates.length
        ? strictCandidates
        : (samePropertyCandidates.length ? samePropertyCandidates : saleCandidates);
      await waitForParcelTradePaint();
      if (!isCurrentTask()) return;
      exactTarget.classList.remove("parcel-property-loading");
      renderExactTradeExperience(exactTarget, exactAll, data.cacheCoverage);
      const graphRows = graphCandidates.slice().sort(function(a, b) {
        return String(b.dealDate || "").localeCompare(String(a.dealDate || ""));
      }).slice(0, 24);
      renderParcelTradeGraph(graphTarget, graphRows, selectedRange, selectedRadiusMeters);
      graphTarget.onclick = function(event) {
        const rangeButton = event.target.closest("[data-parcel-trade-range]");
        if (!rangeButton) return;
        renderParcelTradeGraph(graphTarget, graphRows, rangeButton.getAttribute("data-parcel-trade-range"), selectedRadiusMeters);
      };
    } catch (error) {
      if (!isCurrentTask()) return;
      console.error("[realjeju land-trades]", error);
      if (exactTarget) {
        exactTarget.classList.remove("parcel-property-loading");
        exactTarget.innerHTML = functionErrorHtml("실거래가를 불러오지 못했습니다.");
      }
      if (similarTarget) {
        similarTarget.classList.remove("parcel-property-loading");
        similarTarget.innerHTML = functionErrorHtml("주변 거래를 불러오지 못했습니다.");
      }
      if (graphTarget) {
        graphTarget.classList.remove("parcel-property-loading");
        graphTarget.innerHTML = functionErrorHtml("주변 유사거래를 불러오지 못했습니다.");
      }
    } finally {
      if (!isCurrentTask()) return;
      [
        { target: exactTarget, message: "실거래가를 불러오지 못했습니다." },
        { target: similarTarget, message: "주변 거래를 불러오지 못했습니다." },
        { target: graphTarget, message: "주변 유사거래를 불러오지 못했습니다." }
      ].forEach(function(item) {
        if (!item.target || !item.target.classList.contains("parcel-property-loading")) return;
        item.target.classList.remove("parcel-property-loading");
        item.target.innerHTML = functionErrorHtml(item.message);
      });
    }
  }

  function formatIndividualHousingPrice(value)
  {
    const price = finite(value);
    if (price == null) return "-";
    return Math.round(price).toLocaleString("ko-KR") + "원";
  }

  function individualHousingPriceContent(rows)
  {
    const prices = Array.isArray(rows) ? rows : [];
    if (!prices.length) return '<div class="parcel-property-empty">개별주택공시가격이 존재하지 않습니다.</div>';
    return prices.slice(0, 3).map(function(item) {
      const period = esc(String(item.year || "-") + "." + String(item.month || "01").padStart(2, "0"));
      return '<div class="parcel-building-house-price-record">'
        + infoRow("기준연월", period)
        + infoRow("개별주택가격", esc(formatIndividualHousingPrice(item.housePrice)))
        + infoRow("대지면적", areaValue(item.calculatedLandAreaM2 == null ? item.landRegisterAreaM2 : item.calculatedLandAreaM2))
        + infoRow("건물연면적", areaValue(item.calculatedBuildingAreaM2 == null ? item.totalBuildingAreaM2 : item.calculatedBuildingAreaM2))
        + '</div>';
    }).join("");
  }

  function commonHousingPriceLabel(value, kind)
  {
    const raw = String(value || "").trim();
    if (!raw) return kind === "dong" ? "동 선택" : (kind === "floor" ? "층 선택" : "호 선택");
    const suffix = kind === "dong" ? "동" : (kind === "floor" ? "층" : "호");
    return raw.endsWith(suffix) ? raw : raw + suffix;
  }

  function commonHousingPriceModel(rows, selection)
  {
    const prices = Array.isArray(rows) ? rows : [];
    const unique = function(values) {
      return Array.from(new Set(values.filter(Boolean))).sort(function(a, b) {
        return String(a).localeCompare(String(b), "ko-KR", { numeric: true });
      });
    };
    const clean = function(value, suffix) { return String(value || "").trim().replace(new RegExp(suffix + "$"), "").trim(); };
    const cleanDong = function(value) {
      const raw = clean(value, "동").replace(/\s+/g, " ");
      const numberedDong = raw.match(/([A-Za-z]?\d{1,4})$/);
      return numberedDong ? numberedDong[1].toUpperCase() : raw;
    };
    const dongs = unique(prices.map(function(item) { return cleanDong(item.dong); }));
    const requestedDong = cleanDong(selection && selection.dong);
    const selectedDong = dongs.includes(requestedDong) ? requestedDong : (dongs[0] || "");
    const dongRows = selectedDong ? prices.filter(function(item) { return cleanDong(item.dong) === selectedDong; }) : prices;
    const floors = unique(dongRows.map(function(item) { return clean(item.floor, "층"); }));
    const requestedFloor = clean(selection && selection.floor, "층");
    const selectedFloor = floors.includes(requestedFloor) ? requestedFloor : (floors[0] || "");
    const floorRows = selectedFloor ? dongRows.filter(function(item) { return clean(item.floor, "층") === selectedFloor; }) : dongRows;
    const units = unique(floorRows.map(function(item) { return clean(item.ho, "호"); }));
    const requestedUnit = clean(selection && selection.ho, "호");
    const selectedUnit = units.includes(requestedUnit) ? requestedUnit : (units[0] || "");
    const selectedRows = (selectedUnit ? floorRows.filter(function(item) { return clean(item.ho, "호") === selectedUnit; }) : floorRows).slice().sort(function(left, right) {
      return Number(String(right.year || "0") + String(right.month || "01").padStart(2, "0"))
        - Number(String(left.year || "0") + String(left.month || "01").padStart(2, "0"));
    });
    return {
      dongs: dongs,
      floors: floors,
      units: units,
      selectedDong: selectedDong,
      selectedFloor: selectedFloor,
      selectedUnit: selectedUnit,
      selectedRows: selectedRows.filter(function(item) {
        const key = [
          cleanDong(item.dong), clean(item.floor, "층"), clean(item.ho, "호"),
          item.year || "", item.month || "", item.officialPrice || "", item.exclusiveAreaM2 || ""
        ].join("|");
        if (this.has(key)) return false;
        this.add(key);
        return true;
      }, new Set())
    };
  }

  function commonHousingHeadlinePrice(value)
  {
    const price = Math.round(finite(value) || 0);
    if (!price) return "-";
    const eok = Math.floor(price / 100000000);
    const man = Math.round((price % 100000000) / 10000);
    if (eok && man) return eok.toLocaleString("ko-KR") + "억 " + man.toLocaleString("ko-KR") + "만원";
    if (eok) return eok.toLocaleString("ko-KR") + "억";
    return man.toLocaleString("ko-KR") + "만원";
  }

  function commonHousingAxisPrice(value)
  {
    const price = finite(value);
    if (price == null) return "-";
    if (price >= 100000000) return (price / 100000000).toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "억";
    return Math.round(price / 10000).toLocaleString("ko-KR") + "만";
  }

  function commonHousingGraphHtml(rows, focusIndex)
  {
    const history = (Array.isArray(rows) ? rows : []).slice().sort(function(left, right) {
      return Number(String(left.year || "0") + String(left.month || "01").padStart(2, "0"))
        - Number(String(right.year || "0") + String(right.month || "01").padStart(2, "0"));
    });
    if (!history.length) return '<div class="parcel-common-housing-graph-empty">공시가격 그래프 정보가 없습니다.</div>';
    const width = 640;
    const height = 360;
    const left = 72;
    const right = 620;
    const top = 36;
    const bottom = 310;
    const values = history.map(function(item) { return finite(item.officialPrice) || 0; });
    let min = Math.min.apply(null, values);
    let max = Math.max.apply(null, values);
    const spread = Math.max(max - min, max * 0.12, 10000000);
    min = Math.max(0, min - spread * 0.18);
    max += spread * 0.18;
    const x = function(index) { return history.length === 1 ? (left + right) / 2 : left + (right - left) * index / (history.length - 1); };
    const y = function(value) { return bottom - (bottom - top) * (value - min) / Math.max(1, max - min); };
    const points = history.map(function(item, index) { return x(index).toFixed(2) + "," + y(values[index]).toFixed(2); }).join(" ");
    const focused = Math.max(0, Math.min(history.length - 1, history.length - 1 - (Number(focusIndex) || 0)));
    const focusX = x(focused);
    const focusY = y(values[focused]);
    const yGrid = [0, 1, 2, 3, 4].map(function(index) {
      const value = max - (max - min) * index / 4;
      const py = top + (bottom - top) * index / 4;
      return '<line x1="' + left + '" y1="' + py + '" x2="' + right + '" y2="' + py + '"></line>'
        + '<text x="' + (left - 12) + '" y="' + (py + 5) + '" text-anchor="end">' + esc(commonHousingAxisPrice(value)) + '</text>';
    }).join("");
    const labelIndexes = Array.from(new Set([0, Math.round((history.length - 1) * .25), Math.round((history.length - 1) * .5), Math.round((history.length - 1) * .75), history.length - 1]));
    const xLabels = labelIndexes.map(function(index) {
      return '<text x="' + x(index) + '" y="342" text-anchor="middle">\'' + esc(String(history[index].year || "").slice(-2)) + '년</text>';
    }).join("");
    const circles = history.map(function(item, index) {
      return '<circle data-parcel-common-housing-history-index="' + (history.length - 1 - index) + '" cx="' + x(index) + '" cy="' + y(values[index]) + '" r="4"></circle>';
    }).join("");
    const focusPeriod = esc(String(history[focused].year || "-").slice(-2) + "." + String(history[focused].month || "01").padStart(2, "0"));
    return '<div class="parcel-common-housing-graph"><svg data-parcel-common-housing-graph viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="공동주택공시가격 그래프">'
      + '<rect class="parcel-common-housing-graph-hit" x="0" y="0" width="' + width + '" height="' + height + '"></rect>'
      + '<g class="parcel-common-housing-grid">' + yGrid + '</g>'
      + '<polyline class="parcel-common-housing-line" points="' + points + '"></polyline>'
      + '<g class="parcel-common-housing-dots">' + circles + '</g>'
      + '<line data-parcel-common-housing-graph-cursor class="parcel-common-housing-focus-line" x1="' + focusX + '" y1="' + top + '" x2="' + focusX + '" y2="' + bottom + '"></line>'
      + '<circle data-parcel-common-housing-graph-focus class="parcel-common-housing-focus-dot" cx="' + focusX + '" cy="' + focusY + '" r="8"></circle>'
      + '<text data-parcel-common-housing-graph-label class="parcel-common-housing-focus-label" x="' + focusX + '" y="24" text-anchor="middle">\'' + focusPeriod + '</text>'
      + '<g class="parcel-common-housing-x-labels">' + xLabels + '</g></svg></div>';
  }

  function commonHousingPriceSectionContent(rows, status, selection, focusIndex, visibleCount, pageIndex)
  {
    const prices = Array.isArray(rows) ? rows : [];
    if (status === "loading") return '<div class="parcel-property-loading">공동주택공시가격을 불러오는 중입니다.</div>';
    if (status === "unavailable") return '<div class="parcel-property-empty">공동주택공시가격을 불러오지 못했습니다.</div>';
    if (!prices.length) return '<div class="parcel-property-empty">공동주택공시가격이 존재하지 않습니다.</div>';
    const model = commonHousingPriceModel(prices, selection || {});
    const history = model.selectedRows;
    if (!history.length) return '<div class="parcel-property-empty">선택한 동·층·호의 공동주택공시가격이 존재하지 않습니다.</div>';
    const activeIndex = Math.max(0, Math.min(history.length - 1, Number(focusIndex) || 0));
    const active = history[activeIndex];
    const area = history.find(function(item) { return finite(item.exclusiveAreaM2) != null; });
    const count = [5, 10, 20].includes(Number(visibleCount)) ? Number(visibleCount) : 5;
    const pageCount = Math.max(1, Math.ceil(history.length / count));
    const page = Math.max(0, Math.min(pageCount - 1, Number(pageIndex) || 0));
    const tableRows = history.slice(page * count, page * count + count);
    const selector = function(kind, value) {
      return '<button type="button" class="parcel-common-housing-selector" data-parcel-common-housing-open="' + kind + '"><span>' + esc(commonHousingPriceLabel(value, kind)) + '</span><i aria-hidden="true"></i></button>';
    };
    return '<div class="parcel-common-housing-selectors">'
      + selector("dong", model.selectedDong) + selector("floor", model.selectedFloor) + selector("ho", model.selectedUnit) + '</div>'
      + '<div class="parcel-common-housing-area"><span>전용면적</span><strong>' + (area ? areaValue(area.exclusiveAreaM2) : "-") + '</strong></div>'
      + '<div class="parcel-common-housing-highlight"><button type="button" data-parcel-common-housing-older aria-label="이전 연도"' + (activeIndex >= history.length - 1 ? ' disabled' : '') + '>‹</button>'
      + '<div><span>' + esc(String(active.year || "-") + "년 " + String(active.month || "01").padStart(2, "0") + "월") + '</span><strong>' + esc(commonHousingHeadlinePrice(active.officialPrice)) + '</strong></div>'
      + '<button type="button" data-parcel-common-housing-newer aria-label="다음 연도"' + (activeIndex <= 0 ? ' disabled' : '') + '>›</button></div>'
      + commonHousingGraphHtml(history, activeIndex)
      + '<div class="parcel-common-housing-table"><div class="parcel-common-housing-table-head"><span>기준연도</span><span>공시가격</span></div>'
      + tableRows.map(function(item) {
        return '<div class="parcel-common-housing-table-row"><span>' + esc(String(item.year || "-") + "." + String(item.month || "01").padStart(2, "0")) + '</span><strong>' + esc(formatIndividualHousingPrice(item.officialPrice)) + '</strong></div>';
      }).join("")
      + '<div class="parcel-common-housing-table-footer"><div>' + [5, 10, 20].map(function(value) {
        return '<button type="button" data-parcel-common-housing-count="' + value + '" class="' + (count === value ? "is-active" : "") + '">' + value + '건</button>';
      }).join("") + '</div><div><button type="button" data-parcel-common-housing-page="prev"' + (page <= 0 ? ' disabled' : '') + '>‹</button><span>' + (page + 1) + '/' + pageCount + '</span><button type="button" data-parcel-common-housing-page="next"' + (page >= pageCount - 1 ? ' disabled' : '') + '>›</button></div></div></div>';
  }

  function closeCommonHousingPricePicker()
  {
    const modal = document.querySelector("[data-parcel-common-housing-picker]");
    if (modal) modal.remove();
  }

  function openCommonHousingPricePicker(kind, values, selected, onSelect)
  {
    closeCommonHousingPricePicker();
    const labels = { dong: "동", floor: "층", ho: "호" };
    const modal = document.createElement("div");
    modal.className = "parcel-building-unit-picker";
    modal.setAttribute("data-parcel-common-housing-picker", "");
    modal.setAttribute("data-parcel-common-housing-picker-kind", kind);
    modal.innerHTML = '<div class="parcel-building-unit-picker-dialog" role="dialog" aria-modal="true" aria-label="' + labels[kind] + ' 선택">'
      + values.map(function(value) {
        const active = value === selected;
        return '<button type="button" data-parcel-common-housing-picker-value="' + esc(value) + '" class="parcel-building-unit-picker-row' + (active ? " is-selected" : "") + '"><i aria-hidden="true"></i><span>' + esc(commonHousingPriceLabel(value, kind)) + '</span></button>';
      }).join("") + '</div>';
    document.body.appendChild(modal);
    const close = function() {
      document.removeEventListener("keydown", onKeyDown);
      modal.remove();
    };
    const onKeyDown = function(event) { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKeyDown);
    let committed = false;
    Array.from(modal.querySelectorAll("[data-parcel-common-housing-picker-value]")).forEach(function(option) {
      option.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (committed) return;
        committed = true;
        const value = String(option.getAttribute("data-parcel-common-housing-picker-value") || "");
        onSelect(value);
        close();
      }, true);
    });
    modal.addEventListener("click", function(event) {
      if (event.target !== modal) return;
      event.preventDefault();
      event.stopPropagation();
      close();
    });
  }

  function wireCommonHousingPriceSelector(target, rows, status)
  {
    let stateTarget = target;
    let section = target && target.querySelector("[data-parcel-common-housing-price]");
    if (!section) return;
    let content = section.querySelector("[data-parcel-common-housing-content]");
    if (!content) return;
    const savedSelection = target.__parcelCommonHousingSelection && typeof target.__parcelCommonHousingSelection === "object"
      ? target.__parcelCommonHousingSelection
      : {};
    let currentSelection = {
      dong:String(savedSelection.dong || ""),
      floor:String(savedSelection.floor || ""),
      ho:String(savedSelection.ho || "")
    };
    const render = function(selection, focusIndex, visibleCount, pageIndex) {
      const model = commonHousingPriceModel(rows, selection || {});
      currentSelection = {
        dong: model.selectedDong,
        floor: model.selectedFloor,
        ho: model.selectedUnit
      };
      const liveTargets = Array.from(document.querySelectorAll("[data-parcel-building-content]"));
      const visibleTarget = liveTargets.find(function(candidate) {
        return candidate.isConnected && candidate.getClientRects().length > 0 && getComputedStyle(candidate).visibility !== "hidden";
      });
      if (visibleTarget) stateTarget = visibleTarget;
      const liveSection = stateTarget && stateTarget.querySelector("[data-parcel-common-housing-price]");
      const liveContent = liveSection && liveSection.querySelector("[data-parcel-common-housing-content]");
      if (liveSection && liveContent) {
        section = liveSection;
        content = liveContent;
      }
      stateTarget.__parcelCommonHousingSelection = Object.assign({}, currentSelection);
      section.__parcelCommonHousingSelection = {
        dong: model.selectedDong,
        floor: model.selectedFloor,
        ho: model.selectedUnit
      };
      section.__parcelCommonHousingFocusIndex = Math.max(0, Number(focusIndex) || 0);
      section.__parcelCommonHousingVisibleCount = [5, 10, 20].includes(Number(visibleCount)) ? Number(visibleCount) : 5;
      section.__parcelCommonHousingPageIndex = Math.max(0, Number(pageIndex) || 0);
      content.innerHTML = commonHousingPriceSectionContent(
        rows,
        status,
        section.__parcelCommonHousingSelection,
        section.__parcelCommonHousingFocusIndex,
        section.__parcelCommonHousingVisibleCount,
        section.__parcelCommonHousingPageIndex
      );
      if (typeof handleCommonHousingContentClick === "function") content.onclick = handleCommonHousingContentClick;
      const graph = content.querySelector("[data-parcel-common-housing-graph]");
      if (graph) {
        const graphDots = Array.from(graph.querySelectorAll("[data-parcel-common-housing-history-index]"));
        const cursorLine = graph.querySelector("[data-parcel-common-housing-graph-cursor]");
        const focusDot = graph.querySelector("[data-parcel-common-housing-graph-focus]");
        const focusLabel = graph.querySelector("[data-parcel-common-housing-graph-label]");
        const periodLabel = content.querySelector(".parcel-common-housing-highlight span");
        const priceLabel = content.querySelector(".parcel-common-housing-highlight strong");
        const olderButton = content.querySelector("[data-parcel-common-housing-older]");
        const newerButton = content.querySelector("[data-parcel-common-housing-newer]");

        const selectGraphPoint = function(dot) {
          if (!dot) return;
          const nextIndex = Number(dot.getAttribute("data-parcel-common-housing-history-index"));
          const item = model.selectedRows[nextIndex];
          if (!item) return;
          const cx = dot.getAttribute("cx");
          const cy = dot.getAttribute("cy");
          section.__parcelCommonHousingFocusIndex = nextIndex;
          if (cursorLine) {
            cursorLine.setAttribute("x1", cx);
            cursorLine.setAttribute("x2", cx);
          }
          if (focusDot) {
            focusDot.setAttribute("cx", cx);
            focusDot.setAttribute("cy", cy);
          }
          if (focusLabel) {
            focusLabel.setAttribute("x", cx);
            focusLabel.textContent = "'" + String(item.year || "-").slice(-2) + "." + String(item.month || "01").padStart(2, "0");
          }
          if (periodLabel) periodLabel.textContent = String(item.year || "-") + "년 " + String(item.month || "01").padStart(2, "0") + "월";
          if (priceLabel) priceLabel.textContent = commonHousingHeadlinePrice(item.officialPrice);
          if (olderButton) olderButton.disabled = nextIndex >= model.selectedRows.length - 1;
          if (newerButton) newerButton.disabled = nextIndex <= 0;
        };

        const selectNearestGraphPoint = function(event) {
          if (!graphDots.length) return;
          const bounds = graph.getBoundingClientRect();
          if (!bounds.width) return;
          const pointerX = (event.clientX - bounds.left) * 640 / bounds.width;
          let nearest = graphDots[0];
          let nearestDistance = Math.abs(Number(nearest.getAttribute("cx")) - pointerX);
          graphDots.slice(1).forEach(function(dot) {
            const distance = Math.abs(Number(dot.getAttribute("cx")) - pointerX);
            if (distance < nearestDistance) {
              nearest = dot;
              nearestDistance = distance;
            }
          });
          selectGraphPoint(nearest);
        };

        graph.addEventListener("pointermove", selectNearestGraphPoint);
        graph.addEventListener("click", selectNearestGraphPoint);
      }
    };
    const commitSelection = function(selection) {
      const committedModel = commonHousingPriceModel(rows, selection || {});
      currentSelection = {
        dong: committedModel.selectedDong,
        floor: committedModel.selectedFloor,
        ho: committedModel.selectedUnit
      };
      stateTarget.__parcelCommonHousingSelection = Object.assign({}, currentSelection);
      section.__parcelCommonHousingSelection = Object.assign({}, currentSelection);
      render(currentSelection, 0, section.__parcelCommonHousingVisibleCount, 0);
    };
    const handleCommonHousingContentClick = function(event) {
      const selection = currentSelection;
      const model = commonHousingPriceModel(rows, selection);
      const opener = event.target.closest("[data-parcel-common-housing-open]");
      if (opener) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        const kind = String(opener.getAttribute("data-parcel-common-housing-open") || "");
        const values = kind === "dong" ? model.dongs : (kind === "floor" ? model.floors : model.units);
        const selected = kind === "dong" ? model.selectedDong : (kind === "floor" ? model.selectedFloor : model.selectedUnit);
        openCommonHousingPricePicker(kind, values, selected, function(value) {
          const nextSelection = Object.assign({}, currentSelection);
          if (kind === "dong") {
            nextSelection.dong = value;
            nextSelection.floor = "";
            nextSelection.ho = "";
          } else if (kind === "floor") {
            nextSelection.floor = value;
            nextSelection.ho = "";
          } else {
            nextSelection.ho = value;
          }
          commitSelection(nextSelection);
        });
        return;
      }
      if (event.target.closest("[data-parcel-common-housing-older]")) {
        render(selection, Math.min(model.selectedRows.length - 1, section.__parcelCommonHousingFocusIndex + 1), section.__parcelCommonHousingVisibleCount, section.__parcelCommonHousingPageIndex);
        return;
      }
      if (event.target.closest("[data-parcel-common-housing-newer]")) {
        render(selection, Math.max(0, section.__parcelCommonHousingFocusIndex - 1), section.__parcelCommonHousingVisibleCount, section.__parcelCommonHousingPageIndex);
        return;
      }
      const countButton = event.target.closest("[data-parcel-common-housing-count]");
      if (countButton) {
        render(selection, section.__parcelCommonHousingFocusIndex, Number(countButton.getAttribute("data-parcel-common-housing-count")), 0);
        return;
      }
      const pageButton = event.target.closest("[data-parcel-common-housing-page]");
      if (pageButton && !pageButton.disabled) {
        const delta = pageButton.getAttribute("data-parcel-common-housing-page") === "next" ? 1 : -1;
        render(selection, section.__parcelCommonHousingFocusIndex, section.__parcelCommonHousingVisibleCount, section.__parcelCommonHousingPageIndex + delta);
      }
    };
    content.onclick = handleCommonHousingContentClick;
    render(currentSelection, 0, 5, 0);
    content.onclick = handleCommonHousingContentClick;
  }

  function buildingFloorContent(floors, purposeName, detailsPending)
  {
    const rows = Array.isArray(floors) ? floors : [];
    if (!rows.length) return detailsPending
      ? '<div class="parcel-property-loading">건축물현황을 불러오는 중입니다.</div>'
      : '<div class="parcel-property-empty">건축물현황 정보가 존재하지 않습니다.</div>';
    const rowHtml = rows.map(function(floor) {
      const floorType = String(floor.floorType || "").trim();
      const floorNumber = String(floor.floorNumber == null ? "" : floor.floorNumber).trim().replace(/층$/, "");
      const floorName = floorNumber ? floorType + floorNumber + "층" : (floorType || "-");
      const purpose = [floor.mainPurpose, floor.otherPurpose].filter(Boolean).join(" · ") || "-";
      const detail = esc(floor.structureName || "-");
      const floorArea = areaValue(floor.area);
      return '<div class="parcel-property-info-row parcel-building-floor-row">'
        + '<span class="parcel-building-floor-main"><span class="parcel-building-floor-name">' + esc(floorName) + '</span>'
        + '<span class="parcel-building-floor-purpose">' + esc(purpose) + '</span></span>'
        + '<span class="parcel-building-floor-detail">' + detail
        + '<span class="parcel-building-floor-detail-separator" aria-hidden="true"> · </span>'
        + '<span class="parcel-building-floor-area">' + floorArea + '</span></span>'
        + '</div>';
    });
    const visibleRows = rowHtml.slice(0, 5).join("");
    const extraRowCount = Math.max(0, rowHtml.length - 5);
    const extraRows = rowHtml.slice(5).map(function(html, index) {
      return html.replace('class="parcel-property-info-row parcel-building-floor-row"', 'class="parcel-property-info-row parcel-building-floor-row parcel-building-floor-extra-row" data-parcel-building-floor-extra-index="' + index + '" hidden');
    }).join("");
    const accordion = rowHtml.length > 5
      ? extraRows + '<div class="parcel-trade-controls parcel-building-floor-controls"><button type="button" class="parcel-trade-more" data-parcel-building-floor-more><span class="parcel-building-floor-more-label">건축물현황 더보기 (' + extraRowCount.toLocaleString("ko-KR") + '건)</span><i aria-hidden="true"></i></button>'
        + '<button type="button" class="parcel-trade-collapse" data-parcel-building-floor-collapse hidden>접기<i aria-hidden="true"></i></button></div>'
      : '';
    return '<h3 class="parcel-building-floor-title"><span>건축물현황</span><span class="parcel-building-group-link">' + esc(purposeName || "-") + '</span></h3>'
      + '<div class="parcel-building-floor-list" data-parcel-building-floor-accordion data-parcel-building-floor-total="' + extraRowCount + '">' + visibleRows + accordion + '</div>'
      ;
  }

  function isCommonHousingBuilding(record, allRecords)
  {
    const records = [record].concat(Array.isArray(allRecords) ? allRecords : []);
    const purposeText = records.map(function(item) {
      return [item && item.mainPurpose, item && item.otherPurpose].filter(Boolean).join(" ");
    }).join(" ");
    return /(공동주택|아파트|연립주택|다세대주택)/.test(purposeText);
  }

  function apartmentBusinessSection(record, businesses, businessStatus, allRecords)
  {
    if (!isCommonHousingBuilding(record, allRecords)) return '';
    const rows = (Array.isArray(businesses) ? businesses : []).filter(function(item, index, list) {
      const key = String(item && (item.storeId || [item.name, item.branchName, item.address, item.floor, item.unit].join('|')) || '');
      return key && list.findIndex(function(candidate) {
        return String(candidate && (candidate.storeId || [candidate.name, candidate.branchName, candidate.address, candidate.floor, candidate.unit].join('|')) || '') === key;
      }) === index;
    }).sort(function(left, right) {
      const leftFloor = Number(String(left && left.floor || '').replace(/[^0-9-]/g, ''));
      const rightFloor = Number(String(right && right.floor || '').replace(/[^0-9-]/g, ''));
      if (Number.isFinite(leftFloor) && Number.isFinite(rightFloor) && leftFloor !== rightFloor) return leftFloor - rightFloor;
      return String(left && left.name || '').localeCompare(String(right && right.name || ''), 'ko');
    });
    const records = [record].concat(Array.isArray(allRecords) ? allRecords : []);
    const complexName = String(record && record.buildingName || records.map(function(item) {
      return String(item && item.buildingName || '');
    }).find(Boolean) || '').trim();
    let content = '';
    if (businessStatus === 'loading' || !businessStatus) {
      content = '<div class="parcel-property-empty">상가업소정보를 불러오는 중입니다.</div>';
    } else if (businessStatus === 'unavailable') {
      content = '<div class="parcel-property-empty">상가업소정보를 불러오지 못했습니다.</div>';
    } else if (!rows.length) {
      content = '<div class="parcel-property-empty">단지 내 상가업소정보가 존재하지 않습니다.</div>';
    } else {
      content = '<div class="parcel-apartment-business-list">' + rows.map(function(item) {
        const name = [item.name, item.branchName].filter(Boolean).join(' ');
        const floorRaw = String(item.floor || '').trim();
        const floor = floorRaw && /층$/.test(floorRaw) ? floorRaw : (floorRaw ? floorRaw + '층' : '');
        const category = String(item.smallCategory || item.mediumCategory || item.largeCategory || '업종 정보 없음');
        return '<div class="parcel-apartment-business-row">'
          + '<div class="parcel-apartment-business-main"><strong>' + esc(name) + '</strong>'
          + (floor ? '<span>' + esc(floor) + '</span>' : '') + '</div>'
          + '<div class="parcel-apartment-business-category">' + esc(category) + '</div></div>';
      }).join('') + '</div>';
    }
    return '<section class="parcel-building-group parcel-apartment-business-group"><details open>'
      + '<summary aria-expanded="true" onclick="event.preventDefault(); event.stopPropagation(); var details=this.parentElement; details.open=!details.open; this.setAttribute(&quot;aria-expanded&quot;, String(details.open));"><span>상가업소정보</span><em>' + esc(complexName) + '</em></summary>'
      + content + '</details></section>';
  }


  let activeBuildingUnitRows = [];
  let activeBuildingUnitStatus = "skipped";
  let activeBuildingUnitPending = false;
  let activeBuildingUnitSelection = {};

  function buildingUnitText(value)
  {
    return String(value == null ? "" : value).trim();
  }

  function buildingUnitDongKey(value)
  {
    return buildingUnitText(value).replace(/\s+/g, "").replace(/동$/g, "");
  }

  function buildingUnitHoKey(value)
  {
    return buildingUnitText(value).replace(/\s+/g, "").replace(/호$/g, "");
  }

  function buildingUnitFloorKey(row)
  {
    return [buildingUnitText(row.floorType), buildingUnitText(row.floorNumber), buildingUnitText(row.floorName)].join("|");
  }

  function buildingUnitDongLabel(value)
  {
    const text = buildingUnitText(value);
    if (!text) return "동 정보 없음";
    return /동$/.test(text) ? text : text + "동";
  }

  function buildingUnitHoLabel(value)
  {
    const text = buildingUnitText(value);
    if (!text) return "호 정보 없음";
    return /호$/.test(text) ? text : text + "호";
  }

  function buildingUnitFloorLabel(row)
  {
    const type = buildingUnitText(row.floorType);
    const number = finite(row.floorNumber);
    const name = buildingUnitText(row.floorName);
    if (/각\s*층/.test(type + " " + name)) return "각층";
    if (type && number != null && number !== 0) return type + " " + number + "층";
    if (name && !/^0(?:층)?$/.test(name)) return /층$/.test(name) ? name : name + "층";
    if (number != null && number !== 0) return number + "층";
    return "층 정보 없음";
  }

  function buildingUnitNaturalSort(a, b)
  {
    return String(a.label).localeCompare(String(b.label), "ko", { numeric: true, sensitivity: "base" });
  }

  function buildingUnitUniqueOptions(rows, mapper)
  {
    const map = new Map();
    rows.forEach(function(row) {
      const option = mapper(row);
      if (option && option.value && !map.has(option.value)) map.set(option.value, option);
    });
    return Array.from(map.values()).sort(buildingUnitNaturalSort);
  }

  function buildingUnitRowsForRecord(rows, record)
  {
    const source = Array.isArray(rows) ? rows : [];
    if (!record || record.kind === "recap") return source;
    const dongKey = buildingUnitDongKey(record.dongName);
    if (!dongKey) return source;
    const matched = source.filter(function(row) { return buildingUnitDongKey(row.dongName) === dongKey; });
    return matched.length ? matched : source;
  }

  function buildingUnitModel(rows, selection)
  {
    const source = Array.isArray(rows) ? rows : [];
    const wanted = selection || {};
    const dongs = buildingUnitUniqueOptions(source, function(row) {
      const value = buildingUnitDongKey(row.dongName);
      return value ? { value: value, label: buildingUnitDongLabel(row.dongName) } : null;
    });
    const selectedDong = dongs.some(function(item) { return item.value === wanted.dong; })
      ? wanted.dong : (dongs[0] ? dongs[0].value : "");
    const dongRows = selectedDong
      ? source.filter(function(row) { return buildingUnitDongKey(row.dongName) === selectedDong; }) : source;
    const floors = buildingUnitUniqueOptions(dongRows, function(row) {
      const value = buildingUnitFloorKey(row);
      return value.replace(/\|/g, "") ? { value: value, label: buildingUnitFloorLabel(row) } : null;
    });
    const selectedFloor = floors.some(function(item) { return item.value === wanted.floor; })
      ? wanted.floor : (floors[0] ? floors[0].value : "");
    const floorRows = selectedFloor
      ? dongRows.filter(function(row) { return buildingUnitFloorKey(row) === selectedFloor; }) : dongRows;
    const units = buildingUnitUniqueOptions(floorRows, function(row) {
      const value = buildingUnitHoKey(row.hoName);
      return value ? { value: value, label: buildingUnitHoLabel(row.hoName) } : null;
    });
    const selectedHo = units.some(function(item) { return item.value === wanted.ho; })
      ? wanted.ho : (units[0] ? units[0].value : "");
    const selectedRows = selectedHo
      ? floorRows.filter(function(row) { return buildingUnitHoKey(row.hoName) === selectedHo; }) : floorRows;
    return {
      dongs: dongs,
      floors: floors,
      units: units,
      selectedDong: selectedDong,
      selectedFloor: selectedFloor,
      selectedHo: selectedHo,
      selectedRows: selectedRows
    };
  }

  function buildingUnitArea(value)
  {
    const number = finite(value);
    if (number == null) return "-";
    return (Math.round(number * 100) / 100).toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "㎡";
  }

  function buildingUnitMainAttachment(value)
  {
    const text = buildingUnitText(value);
    if (text.includes("부속")) return "부속";
    if (text.includes("주")) return "주";
    return text || "-";
  }

  function buildingUnitType(value)
  {
    const text = buildingUnitText(value);
    if (text.includes("전유")) return "전유";
    if (text.includes("공용")) return "공용";
    return text || "-";
  }


  /* 5.638: 호별정보 선택기는 전유부의 실제 동/층/호만 계층적으로 사용한다. */
  buildingUnitModel = function(rows, selection)
  {
    const source = Array.isArray(rows) ? rows : [];
    const selected = selection && typeof selection === "object" ? selection : {};
    const clean = function(value) { return buildingUnitText(value).trim(); };
    const numeric = function(value) {
      const match = clean(value).match(/-?\d+/);
      return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
    };
    const suffix = function(value, unit) {
      const text = clean(value);
      if (!text) return "";
      return text.endsWith(unit) ? text : text + unit;
    };
    const dongValue = function(row) {
      return suffix(row && (row.dongName || row.buildingName), "동");
    };
    const hoValue = function(row) {
      return suffix(row && row.hoName, "호");
    };
    const floorMeta = function(row) {
      const type = clean(row && row.floorType);
      const name = clean(row && row.floorName);
      let number = Number(row && row.floorNumber);
      if (!Number.isFinite(number) || number === 0) {
        const match = name.match(/-?\d+/);
        number = match ? Number(match[0]) : 0;
      }
      if (!number) return null;
      const basement = type.includes("지하") || name.includes("지하") || number < 0;
      const absolute = Math.abs(number);
      return {
        key: (basement ? "B" : "G") + ":" + absolute,
        label: (basement ? "지하 " : "지상 ") + absolute + "층",
        order: basement ? 10000 + absolute : absolute,
      };
    };
    const uniqueOptions = function(items, valueOf, labelOf, orderOf) {
      const map = new Map();
      items.forEach(function(item) {
        const value = valueOf(item);
        if (!value || map.has(value)) return;
        map.set(value, { value: value, label: labelOf(item), order: orderOf(item) });
      });
      return Array.from(map.values()).sort(function(a, b) {
        if (a.order !== b.order) return a.order - b.order;
        return a.label.localeCompare(b.label, "ko", { numeric: true });
      }).map(function(item) { return { value: item.value, label: item.label }; });
    };

    const strictRows = source.filter(function(row) {
      return buildingUnitType(row && row.exclusivePublic) === "전유"
        && !!dongValue(row)
        && !!hoValue(row)
        && !!floorMeta(row);
    });
    const selectorRows = strictRows;

    const dongs = uniqueOptions(
      selectorRows,
      dongValue,
      dongValue,
      function(row) { return numeric(dongValue(row)); }
    );
    const selectedDong = dongs.some(function(item) { return item.value === selected.dong; })
      ? selected.dong
      : (dongs[0] ? dongs[0].value : "");
    const dongRows = selectorRows.filter(function(row) { return dongValue(row) === selectedDong; });

    const floors = uniqueOptions(
      dongRows,
      function(row) { const meta = floorMeta(row); return meta ? meta.key : ""; },
      function(row) { const meta = floorMeta(row); return meta ? meta.label : ""; },
      function(row) { const meta = floorMeta(row); return meta ? meta.order : Number.POSITIVE_INFINITY; }
    );
    const selectedFloor = floors.some(function(item) { return item.value === selected.floor; })
      ? selected.floor
      : (floors[0] ? floors[0].value : "");
    const floorRows = dongRows.filter(function(row) {
      const meta = floorMeta(row);
      return meta && meta.key === selectedFloor;
    });

    const units = uniqueOptions(
      floorRows,
      hoValue,
      hoValue,
      function(row) { return numeric(hoValue(row)); }
    );
    const selectedHo = units.some(function(item) { return item.value === selected.ho; })
      ? selected.ho
      : (units[0] ? units[0].value : "");

    let selectedRows = selectedDong && selectedFloor && selectedHo ? source.filter(function(row) {
      const type = buildingUnitType(row && row.exclusivePublic);
      const sameUnit = dongValue(row) === selectedDong && hoValue(row) === selectedHo;
      if (!sameUnit) return false;
      // 전유부는 사용자가 선택한 실제 층만 표시합니다. 공용부는 같은
      // 동·호에 배분된 각층·지상·지하 행을 모두 표시해야 대지권/전유부
      // 상세가 공공데이터 원문과 동일하게 완성됩니다.
      if (type === "공용") return true;
      const meta = floorMeta(row);
      return type === "전유" && meta && meta.key === selectedFloor;
    }) : [];
    if (!selectedRows.length) {
      selectedRows = floorRows.filter(function(row) { return hoValue(row) === selectedHo; });
    }

    return {
      dongs: dongs,
      floors: floors,
      units: units,
      selectedDong: selectedDong,
      selectedFloor: selectedFloor,
      selectedHo: selectedHo,
      selectedRows: selectedRows,
    };
  };

  function buildingUnitSelector(kind, option, disabled)
  {
    const label = option ? option.label : (kind === "dong" ? "동 정보 없음" : kind === "floor" ? "층 정보 없음" : "호 정보 없음");
    return '<button type="button" class="parcel-building-unit-selector" data-parcel-building-unit-open="' + kind + '"' + (disabled ? ' disabled' : '') + '><span>' + esc(label) + '</span><i aria-hidden="true"></i></button>';
  }

  function buildingUnitLandRightNumber(value)
  {
    const parsed = Number(String(value == null ? "" : value).replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed <= 0) return "";
    return parsed.toLocaleString("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    });
  }

  function buildingUnitLandRightValue(model)
  {
    const ratioRow = (model.selectedRows || []).find(function(row) {
      return buildingUnitLandRightNumber(row && row.landRightNumerator)
        && buildingUnitLandRightNumber(row && row.landRightDenominator);
    });
    if (!ratioRow) return "-";
    return buildingUnitLandRightNumber(ratioRow.landRightDenominator)
      + "분의 "
      + buildingUnitLandRightNumber(ratioRow.landRightNumerator);
  }

  function buildingUnitLandRightContent(model)
  {
    return '<div class="parcel-building-unit-land-right">'
      + '<div class="parcel-building-unit-land-right-line"><strong>대지권 비율</strong><span>'
      + esc(buildingUnitLandRightValue(model))
      + '</span></div>'
      + '</div>';
  }

  function buildingUnitTable(model)
  {
    const seen = new Set();
    const rows = model.selectedRows.filter(function(row) {
      const key = [row.exclusivePublic, row.floorType, row.floorNumber, row.floorName, row.area, row.mainAttachment, row.mainPurpose, row.otherPurpose].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort(function(a, b) {
      const aType = buildingUnitType(a.exclusivePublic) === "전유" ? 0 : 1;
      const bType = buildingUnitType(b.exclusivePublic) === "전유" ? 0 : 1;
      return aType - bType;
    });
    if (!rows.length) return '<div class="parcel-property-empty">선택한 호의 전유부 정보가 존재하지 않습니다.</div>';
    return '<div class="parcel-building-unit-subtitle">전유부</div>'
      + '<div class="parcel-building-unit-table">'
      + '<div class="parcel-building-unit-table-head"><span>구분</span><span>층</span><span>면적</span><span>건축물</span><span>용도</span></div>'
      + rows.map(function(row) {
        const purpose = buildingUnitText(row.otherPurpose) || buildingUnitText(row.mainPurpose) || "-";
        return '<div class="parcel-building-unit-table-row"><strong>' + esc(buildingUnitType(row.exclusivePublic)) + '</strong><span>' + esc(buildingUnitFloorLabel(row)) + '</span><strong>' + esc(buildingUnitArea(row.area)) + '</strong><span>' + esc(buildingUnitMainAttachment(row.mainAttachment)) + '</span><span>' + esc(purpose) + '</span></div>';
      }).join("") + '</div>';
  }

  function buildingUnitSectionContent(record, allRecords)
  {
    const rows = buildingUnitRowsForRecord(activeBuildingUnitRows, record);
    if (!isCommonHousingBuilding(record, allRecords) && !rows.length) return "";
    if (activeBuildingUnitPending) {
      return '<section class="parcel-building-group parcel-building-unit-group" data-parcel-building-unit-floor><h3>호별정보</h3><div class="parcel-property-loading">호별정보를 불러오는 중입니다.</div></section>';
    }
    if (activeBuildingUnitStatus === "unavailable" || activeBuildingUnitStatus === "skipped") {
      return '<section class="parcel-building-group parcel-building-unit-group" data-parcel-building-unit-floor><h3>호별정보</h3><div class="parcel-property-empty">호별정보를 불러오지 못했습니다.</div></section>';
    }
    if (!rows.length) {
      return '<section class="parcel-building-group parcel-building-unit-group" data-parcel-building-unit-floor><h3>호별정보</h3><div class="parcel-property-empty">호별정보가 존재하지 않습니다.</div></section>';
    }
    const model = buildingUnitModel(rows, activeBuildingUnitSelection);
    const dong = model.dongs.find(function(item) { return item.value === model.selectedDong; });
    const floor = model.floors.find(function(item) { return item.value === model.selectedFloor; });
    const unit = model.units.find(function(item) { return item.value === model.selectedHo; });
    return '<section class="parcel-building-group parcel-building-unit-group" data-parcel-building-unit-floor><h3>호별정보</h3>'
      + '<div class="parcel-building-unit-selectors">'
      + buildingUnitSelector("dong", dong, !model.dongs.length)
      + buildingUnitSelector("floor", floor, !model.floors.length)
      + buildingUnitSelector("ho", unit, !model.units.length)
      + '</div>'
      + buildingUnitLandRightContent(model)
      + buildingUnitTable(model)
      + '</section>';
  }

  function closeBuildingUnitPicker()
  {
    const modal = document.querySelector("[data-parcel-building-unit-picker]");
    if (modal) modal.remove();
  }

  function openBuildingUnitPicker(kind, options, selectedValue, onSelect)
  {
    closeBuildingUnitPicker();
    const modal = document.createElement("div");
    modal.className = "parcel-building-unit-picker";
    modal.setAttribute("data-parcel-building-unit-picker", "true");
    modal.setAttribute("data-parcel-building-unit-picker-kind", kind);
    const dialog = document.createElement("div");
    dialog.className = "parcel-building-unit-picker-dialog";
    options.forEach(function(option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "parcel-building-unit-picker-row" + (option.value === selectedValue ? " is-selected" : "");
      button.setAttribute("data-value", option.value);
      button.innerHTML = '<i aria-hidden="true"></i><span>' + esc(option.label) + '</span>';
      button.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        onSelect(option.value);
        closeBuildingUnitPicker();
      });
      dialog.appendChild(button);
    });
    modal.appendChild(dialog);
    modal.addEventListener("click", function(event) {
      if (event.target === modal) closeBuildingUnitPicker();
    });
    document.body.appendChild(modal);
  }

  document.addEventListener("click", function(event) {
    const opener = event.target.closest("[data-parcel-building-unit-open]");
    if (!opener || opener.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    const panel = opener.closest(".parcel-land-info-panel");
    const data = panel && panel.__parcelBuildingData;
    if (!panel || !data) return;
    const records = Array.isArray(data.records) ? data.records : [];
    const index = Math.max(0, Math.min(records.length - 1, Number(panel.dataset.parcelBuildingIndex) || 0));
    const record = records[index] || {};
    const rows = buildingUnitRowsForRecord(Array.isArray(data.units) ? data.units : [], record);
    const model = buildingUnitModel(rows, panel.__parcelBuildingUnitSelection || {});
    const kind = opener.getAttribute("data-parcel-building-unit-open");
    const options = kind === "dong" ? model.dongs : kind === "floor" ? model.floors : model.units;
    const selected = kind === "dong" ? model.selectedDong : kind === "floor" ? model.selectedFloor : model.selectedHo;
    openBuildingUnitPicker(kind, options, selected, function(value) {
      const next = { dong: model.selectedDong, floor: model.selectedFloor, ho: model.selectedHo };
      if (kind === "dong") { next.dong = value; next.floor = ""; next.ho = ""; }
      else if (kind === "floor") { next.floor = value; next.ho = ""; }
      else next.ho = value;
      panel.__parcelBuildingUnitSelection = next;
      renderBuilding(panel, data, index);
    });
  }, true);

  function buildingRecordContent(record, wastewater, housingPrices, commonHousingPrices, commonHousingStatus, businesses, businessStatus, floors, allRecords, detailsPending)
  {
	const records = Array.isArray(allRecords) ? allRecords : [record];
	function readBuildingDetail(key)
	{
	  const directValue = record && record[key];
	  if (directValue !== null && directValue !== undefined && String(directValue).trim() !== "") return directValue;
	  const titleRecord = records.find(function(item) {
		if (!item || item.kind === "recap") return false;
		const value = item[key];
		return value !== null && value !== undefined && String(value).trim() !== "";
	  });
	  return titleRecord ? titleRecord[key] : null;
	}
	function readElevatorCount(item, aliases)
	{
	  if (!item) return null;
	  for (const alias of aliases) {
		const rawValue = item[alias];
		if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") continue;
		const value = Number(rawValue);
		if (Number.isFinite(value)) return Math.max(0, value);
	  }
	  return null;
	}
	function aggregateElevatorCount(aliases)
	{
	  const recapValues = records
		.filter(function(item) { return item && item.kind === "recap"; })
		.map(function(item) { return readElevatorCount(item, aliases); })
		.filter(function(value) { return value != null; });
	  if (recapValues.length) return Math.max(0, ...recapValues);
	  const titleValues = records
		.filter(function(item) { return !item || item.kind !== "recap"; })
		.map(function(item) { return readElevatorCount(item, aliases); })
		.filter(function(value) { return value != null; });
	  return titleValues.length ? titleValues.reduce(function(total, value) { return total + value; }, 0) : null;
	}
	const passengerElevatorCount = aggregateElevatorCount([
	  "passengerElevatorCount", "rideUseElvtCnt", "rideUseElvtcnt", "rideuseelvtcnt"
	]);
	const emergencyElevatorCount = aggregateElevatorCount([
	  "emergencyElevatorCount", "emgenUseElvtCnt", "emgenUseElvtcnt", "emgenuseelvtcnt"
	]);
	const structureName = readBuildingDetail("structureName");
	const roofName = readBuildingDetail("roofName");
	const buildingHeight = readBuildingDetail("height");
	const groundFloorCount = readBuildingDetail("groundFloorCount");
	const undergroundFloorCount = readBuildingDetail("undergroundFloorCount");
	const numericBuildingHeight = Number(buildingHeight);
	const numericGroundFloorCount = Number(groundFloorCount);
	const numericUndergroundFloorCount = Number(undergroundFloorCount);
	const hasBuildingHeight = buildingHeight != null && Number.isFinite(numericBuildingHeight) && numericBuildingHeight > 0;
	const hasFloorCount = (groundFloorCount != null && Number.isFinite(numericGroundFloorCount) && numericGroundFloorCount > 0)
	  || (undergroundFloorCount != null && Number.isFinite(numericUndergroundFloorCount) && numericUndergroundFloorCount > 0);
	const elevator = '<section class="parcel-building-group parcel-building-elevator-group" data-parcel-building-elevator><h3>승강기</h3>'
	  + infoRow("승용", passengerElevatorCount == null ? "-" : esc(String(passengerElevatorCount)))
	  + infoRow("비상용", emergencyElevatorCount == null ? "-" : esc(String(emergencyElevatorCount))) + '</section>';
    const parkingCountText = function(primaryValue, legacyValue) {
      const value = primaryValue != null && primaryValue !== "" ? primaryValue : legacyValue;
      return value == null || value === "" ? "-" : esc(String(value)) + "대";
    };
    const parking = '<section class="parcel-building-group parcel-building-parking-group"><h3>주차장</h3>'
      + infoRow("자주식", '<span>옥내 ' + parkingCountText(record.indoorAutoParkingCount, record.indoorAutoCount) + '</span><span>옥외 ' + parkingCountText(record.outdoorAutoParkingCount, record.outdoorAutoCount) + '</span>')
      + infoRow("기계식", '<span>옥내 ' + parkingCountText(record.indoorMechanicalParkingCount, record.indoorMechCount) + '</span><span>옥외 ' + parkingCountText(record.outdoorMechanicalParkingCount, record.outdoorMechCount) + '</span>') + '</section>';
    const wastewaterRows = detailsPending
      ? '<div class="parcel-property-loading">오수정화시설을 불러오는 중입니다.</div>'
      : (wastewater
        ? infoRow("형식", esc(wastewater.modeName || "-")) + infoRow("형식 (기타)", esc(wastewater.etcMode || "-")) + infoRow("용량 (인용)", esc(wastewater.capacityPeople || "-")) + infoRow("용량 (루베)", esc(wastewater.capacityCubicMeter || "-"))
        : '<div class="parcel-property-empty">오수정화시설 정보가 없습니다.</div>');
    return '<section class="parcel-building-group parcel-building-title-register"><h3>' + esc(record.kind === "recap" ? "총괄표제부" : "표제부") + '</h3>'
      + infoRow("건물이름", esc(record.buildingName || "-"))
      + infoRow("주용도", esc(record.mainPurpose || "-"))
      + infoRow("기타용도", esc(record.otherPurpose || "-"))
      + infoRow("주구조", esc(structureName || "-"))
      + infoRow("지붕구조", esc(roofName || "-"))
      + infoRow("높이", hasBuildingHeight ? esc(new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(numericBuildingHeight)) + "m" : "-")
      + infoRow("지상/지하", hasFloorCount ? esc(String(groundFloorCount == null ? 0 : numericGroundFloorCount)) + "/" + esc(String(undergroundFloorCount == null ? 0 : numericUndergroundFloorCount)) : "-")
      + infoRow("대지면적", areaValue(record.platArea))
      + infoRow("건축면적", areaValue(record.archArea, record.buildingCoverageRatio == null ? "" : '<small>(건폐율 ' + esc(String(record.buildingCoverageRatio)) + '%)</small>'))
      + infoRow("연면적", areaValue(record.totalArea))
      + infoRow("용적률산정연면적", areaValue(record.floorRatioArea, record.floorAreaRatio == null ? "" : '<small>(용적률 ' + esc(String(record.floorAreaRatio)) + '%)</small>'))
      + infoRow("세대 수", '<span>세대 ' + esc(String(record.householdCount || 0)) + '</span><span>가구 ' + esc(String(record.familyCount || 0)) + '</span><span>호수 ' + esc(String(record.unitCount || 0)) + '</span>')
      + infoRow("외필지 수", esc(String(record.extraLotCount || 0))) + '</section>'
      + '<section class="parcel-building-group parcel-building-floor-group">' + buildingFloorContent(floors, record.mainPurpose || record.otherPurpose || "-", detailsPending) + '</section>'
	  + elevator
      + '<section class="parcel-building-group parcel-building-wastewater-group"><h3>오수정화시설</h3>' + wastewaterRows + '</section>'
      + parking
      + '<section class="parcel-building-group parcel-building-date-group"><h3>일자정보</h3>' + infoRow("허가일", esc(formatDate(record.permitDate))) + infoRow("착공일", esc(formatDate(record.startDate))) + infoRow("사용승인일", esc(formatDate(record.approvalDate))) + '</section>'
      + buildingUnitSectionContent(record, allRecords)
      + (isCommonHousingBuilding(record, allRecords)
        ? '<section class="parcel-building-group" data-parcel-common-housing-price><h3>공동주택공시가격</h3><div data-parcel-common-housing-content></div></section>'
        : '<section class="parcel-building-group"><h3>개별주택공시가격</h3>' + individualHousingPriceContent(housingPrices) + '</section>')
      + apartmentBusinessSection(record, businesses, businessStatus, allRecords);
  }

  function alignBuildingCardList(target, behavior)
  {
    const cardList = target ? target.querySelector(".parcel-building-card-list") : null;
    if (!cardList || cardList.classList.contains("is-single") || cardList.__parcelBuildingModalOpen || cardList.__parcelBuildingManualScroll) return;
    const activeCard = cardList.querySelector(".parcel-building-card.is-active");
    if (!activeCard) return;
    const maxScrollLeft = Math.max(0, cardList.scrollWidth - cardList.clientWidth);
    const centeredScrollLeft = activeCard.offsetLeft - ((cardList.clientWidth - activeCard.offsetWidth) / 2);
    cardList.scrollTo({
      left: Math.max(0, Math.min(maxScrollLeft, centeredScrollLeft)),
      behavior: behavior === "smooth" ? "smooth" : "auto"
    });
  }

  function animateBuildingCardListScroll(cardList, targetLeft, duration, onComplete)
  {
    if (!cardList) return;
    if (cardList.__parcelBuildingModalOpen) return;
    if (cardList.__parcelBuildingAnimationFrame) cancelAnimationFrame(cardList.__parcelBuildingAnimationFrame);
    const startLeft = cardList.scrollLeft;
    const distance = targetLeft - startLeft;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runTime = reducedMotion ? 0 : Math.max(0, Number(duration) || 0);
    cardList.classList.add("is-animating");
    function finish()
    {
      cardList.scrollLeft = targetLeft;
      cardList.classList.remove("is-animating");
      cardList.__parcelBuildingAnimationFrame = 0;
      if (typeof onComplete === "function") onComplete();
    }
    if (runTime === 0 || Math.abs(distance) < 0.5) {
      finish();
      return;
    }
    const startedAt = performance.now();
    function frame(now)
    {
      const progress = Math.min(1, (now - startedAt) / runTime);
      const eased = 1 - Math.pow(1 - progress, 3);
      cardList.scrollLeft = startLeft + (distance * eased);
      if (progress < 1) cardList.__parcelBuildingAnimationFrame = requestAnimationFrame(frame);
      else finish();
    }
    cardList.__parcelBuildingAnimationFrame = requestAnimationFrame(frame);
  }

  function markBuildingCardManualScroll(cardList)
  {
    if (!cardList) return;
    if (cardList.__parcelBuildingAnimationFrame) {
      cancelAnimationFrame(cardList.__parcelBuildingAnimationFrame);
      cardList.__parcelBuildingAnimationFrame = 0;
    }
    cardList.__parcelBuildingProgrammaticScroll = false;
    cardList.__parcelBuildingManualScroll = true;
    cardList.classList.remove("is-animating");
    const panel = cardList.closest(".parcel-land-info-panel");
    if (panel) panel.__parcelBuildingScrollTarget = cardList.scrollLeft;
  }

  function enableBuildingCardDrag(panel, cardList)
  {
    if (!panel || !cardList || cardList.classList.contains("is-single") || cardList.__parcelBuildingDragReady) return;
    cardList.__parcelBuildingDragReady = true;
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;
    let scrollSyncTimer = 0;

    function finishDrag(event)
    {
      if (pointerId == null || (event && event.pointerId !== pointerId)) return;
      if (cardList.hasPointerCapture && cardList.hasPointerCapture(pointerId)) cardList.releasePointerCapture(pointerId);
      pointerId = null;
      cardList.classList.remove("is-dragging");
      panel.__parcelBuildingScrollTarget = cardList.scrollLeft;
      if (dragged) {
        cardList.__parcelBuildingSuppressClick = true;
        setTimeout(function() { cardList.__parcelBuildingSuppressClick = false; }, 0);
      }
    }

    cardList.addEventListener("pointerdown", function(event) {
      if (event.button !== 0 || !event.target.closest(".parcel-building-card")) return;
      markBuildingCardManualScroll(cardList);
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = cardList.scrollLeft;
      dragged = false;
      cardList.__parcelBuildingProgrammaticScroll = false;
      cardList.scrollTo({ left: cardList.scrollLeft, behavior: "auto" });
      cardList.classList.add("is-dragging");
    });

    cardList.addEventListener("pointermove", function(event) {
      if (pointerId == null || event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (!dragged && Math.abs(distance) > 3) {
        dragged = true;
        if (cardList.setPointerCapture) cardList.setPointerCapture(pointerId);
      }
      if (!dragged) return;
      event.preventDefault();
      cardList.scrollLeft = startScrollLeft - distance;
      panel.__parcelBuildingScrollTarget = cardList.scrollLeft;
    });

    cardList.addEventListener("pointerup", finishDrag);
    cardList.addEventListener("pointercancel", finishDrag);
    cardList.addEventListener("wheel", function() {
      markBuildingCardManualScroll(cardList);
    }, { passive: true });
    cardList.addEventListener("touchstart", function() {
      markBuildingCardManualScroll(cardList);
    }, { passive: true });
    cardList.addEventListener("click", function(event) {
      if (!cardList.__parcelBuildingSuppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    cardList.addEventListener("scroll", function() {
      clearTimeout(scrollSyncTimer);
      scrollSyncTimer = setTimeout(function() {
        if (!cardList.__parcelBuildingProgrammaticScroll) panel.__parcelBuildingScrollTarget = cardList.scrollLeft;
      }, 120);
    }, { passive: true });
  }

  function wireBuildingCardScrollbar(cardList)
  {
    if (!cardList || cardList.__parcelBuildingScrollbarWired) return;
    const carousel = cardList.closest(".parcel-building-carousel");
    const track = carousel ? carousel.querySelector("[data-parcel-building-card-scrollbar]") : null;
    const thumb = track ? track.querySelector("[data-parcel-building-card-scrollbar-thumb]") : null;
    if (!track || !thumb) return;
    cardList.__parcelBuildingScrollbarWired = true;

    const syncScrollbar = function() {
      const trackWidth = track.clientWidth;
      const viewportWidth = cardList.clientWidth;
      const contentWidth = cardList.scrollWidth;
      const maxScrollLeft = Math.max(0, contentWidth - viewportWidth);
      if (!(trackWidth > 0) || !(maxScrollLeft > 0)) {
        track.hidden = true;
        return;
      }
      track.hidden = false;
      const thumbWidth = Math.max(24, Math.min(trackWidth, trackWidth * (viewportWidth / contentWidth)));
      const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
      const thumbLeft = maxScrollLeft > 0 ? maxThumbLeft * (cardList.scrollLeft / maxScrollLeft) : 0;
      thumb.style.width = thumbWidth + "px";
      thumb.style.transform = "translate3d(" + Math.max(0, Math.min(maxThumbLeft, thumbLeft)) + "px,0,0)";
    };

    cardList.addEventListener("scroll", syncScrollbar, { passive: true });
    if (typeof ResizeObserver === "function") {
      const resizeObserver = new ResizeObserver(syncScrollbar);
      resizeObserver.observe(cardList);
      resizeObserver.observe(track);
      cardList.__parcelBuildingScrollbarResizeObserver = resizeObserver;
    }

    track.addEventListener("pointerdown", function(event) {
      if (event.target === thumb) return;
      markBuildingCardManualScroll(cardList);
      event.preventDefault();
      syncScrollbar();
      const rect = track.getBoundingClientRect();
      const thumbWidth = thumb.getBoundingClientRect().width;
      const maxThumbLeft = Math.max(0, rect.width - thumbWidth);
      const maxScrollLeft = Math.max(0, cardList.scrollWidth - cardList.clientWidth);
      const thumbLeft = Math.max(0, Math.min(maxThumbLeft, event.clientX - rect.left - (thumbWidth / 2)));
      cardList.scrollLeft = maxThumbLeft > 0 ? maxScrollLeft * (thumbLeft / maxThumbLeft) : 0;
    });

    thumb.addEventListener("pointerdown", function(event) {
      markBuildingCardManualScroll(cardList);
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startScrollLeft = cardList.scrollLeft;
      const trackWidth = track.clientWidth;
      const thumbWidth = thumb.getBoundingClientRect().width;
      const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
      const maxScrollLeft = Math.max(0, cardList.scrollWidth - cardList.clientWidth);
      thumb.setPointerCapture(event.pointerId);

      const moveThumb = function(moveEvent) {
        if (!thumb.hasPointerCapture(moveEvent.pointerId)) return;
        moveEvent.preventDefault();
        const scrollDelta = maxThumbLeft > 0 ? (moveEvent.clientX - startX) * (maxScrollLeft / maxThumbLeft) : 0;
        cardList.scrollLeft = Math.max(0, Math.min(maxScrollLeft, startScrollLeft + scrollDelta));
      };
      const finishThumb = function(finishEvent) {
        if (thumb.hasPointerCapture(finishEvent.pointerId)) thumb.releasePointerCapture(finishEvent.pointerId);
        thumb.removeEventListener("pointermove", moveThumb);
        thumb.removeEventListener("pointerup", finishThumb);
        thumb.removeEventListener("pointercancel", finishThumb);
      };
      thumb.addEventListener("pointermove", moveThumb);
      thumb.addEventListener("pointerup", finishThumb);
      thumb.addEventListener("pointercancel", finishThumb);
    });

    requestAnimationFrame(syncScrollbar);
  }

  function openBuildingRegisterModal(panel, data, records, selectedIndex, openingEvent)
  {
    if (openingEvent) {
      openingEvent.preventDefault();
      openingEvent.stopPropagation();
      openingEvent.stopImmediatePropagation();
    }
    const oldModal = document.querySelector("[data-parcel-building-all-modal]");
    if (oldModal) {
      if (typeof oldModal.__parcelBuildingReleaseCardPosition === "function") {
        oldModal.__parcelBuildingReleaseCardPosition();
      }
      oldModal.remove();
    }
    const initialCardList = panel.querySelector(".parcel-building-card-list");
    const initialCardScrollLeft = initialCardList ? initialCardList.scrollLeft : null;
    const initialCardWidth = initialCardList ? initialCardList.getBoundingClientRect().width : null;
    const lockedCardStyleProperties = [
      "scroll-snap-type",
      "scroll-behavior",
      "overflow-x",
      "overflow-anchor",
      "pointer-events",
      "width",
      "min-width",
      "max-width",
      "flex-basis"
    ];
    const initialCardInlineStyles = initialCardList ? lockedCardStyleProperties.map(function(property) {
      return {
        property: property,
        value: initialCardList.style.getPropertyValue(property),
        priority: initialCardList.style.getPropertyPriority(property)
      };
    }) : [];
    if (initialCardList && initialCardList.__parcelBuildingAnimationFrame) {
      cancelAnimationFrame(initialCardList.__parcelBuildingAnimationFrame);
      initialCardList.__parcelBuildingAnimationFrame = 0;
    }
    if (panel.__parcelBuildingAlignFrame) {
      cancelAnimationFrame(panel.__parcelBuildingAlignFrame);
      panel.__parcelBuildingAlignFrame = 0;
    }
    panel.__parcelBuildingModalOpen = true;
    if (initialCardList) {
      initialCardList.__parcelBuildingModalOpen = true;
      initialCardList.__parcelBuildingProgrammaticScroll = false;
      initialCardList.classList.remove("is-animating");
      initialCardList.style.setProperty("scroll-snap-type", "none", "important");
      initialCardList.style.setProperty("scroll-behavior", "auto", "important");
      initialCardList.style.setProperty("overflow-x", "hidden", "important");
      initialCardList.style.setProperty("overflow-anchor", "none", "important");
      initialCardList.style.setProperty("pointer-events", "none", "important");
      if (Number.isFinite(initialCardWidth) && initialCardWidth > 0) {
        const lockedWidth = initialCardWidth + "px";
        initialCardList.style.setProperty("width", lockedWidth, "important");
        initialCardList.style.setProperty("min-width", lockedWidth, "important");
        initialCardList.style.setProperty("max-width", lockedWidth, "important");
        initialCardList.style.setProperty("flex-basis", lockedWidth, "important");
      }
      if (Number.isFinite(initialCardScrollLeft)) {
        initialCardList.scrollLeft = initialCardScrollLeft;
      }
    }
    const initialCardScrollTarget = panel.__parcelBuildingScrollTarget;
    let cardPositionLocked = true;
    const restoreCardPosition = function() {
      const currentCardList = panel.querySelector(".parcel-building-card-list");
      if (!cardPositionLocked || !currentCardList || !Number.isFinite(initialCardScrollLeft)) return;
      if (Math.abs(currentCardList.scrollLeft - initialCardScrollLeft) > 0.1) {
        currentCardList.scrollLeft = initialCardScrollLeft;
      }
      panel.__parcelBuildingScrollTarget = Number.isFinite(initialCardScrollTarget)
        ? initialCardScrollTarget
        : initialCardScrollLeft;
    };
    const lockCardPosition = function(event) {
      const scroller = event.target;
      if (!cardPositionLocked || !scroller || !scroller.classList || !scroller.classList.contains("parcel-building-card-list")) return;
      restoreCardPosition();
    };
    const releaseCardPosition = function() {
      if (!cardPositionLocked) return;
      cardPositionLocked = false;
      panel.removeEventListener("scroll", lockCardPosition, true);
      panel.__parcelBuildingModalOpen = false;
      const currentCardList = panel.querySelector(".parcel-building-card-list");
      if (currentCardList) {
        currentCardList.__parcelBuildingModalOpen = false;
        initialCardInlineStyles.forEach(function(style) {
          if (style.value) currentCardList.style.setProperty(style.property, style.value, style.priority);
          else currentCardList.style.removeProperty(style.property);
        });
        if (Number.isFinite(initialCardScrollLeft)) currentCardList.scrollLeft = initialCardScrollLeft;
      }
    };
    panel.addEventListener("scroll", lockCardPosition, true);
    const rows = Array.isArray(records) ? records : [];
    let titleSequence = 0;
    const modal = document.createElement("div");
    modal.__parcelBuildingReleaseCardPosition = releaseCardPosition;
    modal.className = "parcel-exact-area-modal parcel-building-all-modal";
    modal.setAttribute("data-parcel-building-all-modal", "");
    modal.innerHTML = '<div class="parcel-exact-area-dialog parcel-building-all-dialog" role="dialog" aria-modal="true" aria-label="건축물대장 선택">'
      + '<header><span aria-hidden="true"></span><h3>건축물대장 선택</h3><button type="button" class="parcel-exact-area-close" data-parcel-building-all-close aria-label="닫기"></button></header>'
      + '<div class="parcel-building-all-list">'
      + (rows.length ? rows.map(function(item, itemIndex) {
        const isRecap = item && item.kind === "recap";
        if (!isRecap) titleSequence += 1;
        const registerLabel = isRecap ? "총괄" : "주" + titleSequence;
        const primary = isRecap
          ? (item.mainPurpose || item.buildingName || item.dongName || "총괄표제부")
          : (item.dongName || item.buildingName || "표제부");
        const secondary = isRecap ? "" : (item.mainPurpose || item.otherPurpose || item.buildingName || "건물");
        return '<button type="button" class="parcel-building-all-row' + (itemIndex === selectedIndex ? ' is-active' : '') + '" data-parcel-building-all-index="' + itemIndex + '">'
          + '<strong>' + esc(registerLabel) + '</strong><span><b>' + esc(primary) + '</b>'
          + (secondary && secondary !== primary ? '<small>' + esc(secondary) + '</small>' : '')
          + '</span></button>';
      }).join("") : '<div class="parcel-property-empty">선택할 건축물대장이 없습니다.</div>')
      + '</div></div>';
    modal.addEventListener("click", function(event) {
      if (event.target === modal || event.target.closest("[data-parcel-building-all-close]")) {
        releaseCardPosition();
        modal.remove();
        return;
      }
      const row = event.target.closest("[data-parcel-building-all-index]");
      if (!row) return;
      const nextIndex = Number(row.getAttribute("data-parcel-building-all-index"));
      if (!Number.isFinite(nextIndex)) return;
      const currentIndex = Number(panel.dataset.parcelBuildingIndex);
      const direction = Number.isFinite(currentIndex) && nextIndex < currentIndex ? "prev" : "next";
      releaseCardPosition();
      modal.remove();
      renderBuilding(panel, data, nextIndex, {
        animate: true,
        allowAutoAlign: true,
        centerSelected: true,
        direction: direction
      });
    });
    document.body.appendChild(modal);
    restoreCardPosition();
  }

  function renderBuilding(panel, data, selectedIndex, options)
  {
    activeBuildingUnitRows = Array.isArray(data && data.units) ? data.units : [];
    activeBuildingUnitPending = Boolean(data && data.detailsPending === true);
    activeBuildingUnitStatus = activeBuildingUnitPending ? "loading" : String(data && data.componentStatuses && data.componentStatuses.units || (activeBuildingUnitRows.length ? "complete" : "unavailable"));
    activeBuildingUnitSelection = panel && panel.__parcelBuildingUnitSelection || {};
    const target = panel.querySelector("[data-parcel-building-content]");
    if (!target) return;
    const renderOptions = options || {};
    renderOptions.animate = renderOptions.allowAutoAlign === true && renderOptions.animate === true;
    const previousCardList = target.querySelector(".parcel-building-card-list");
    const previousManualScroll = Boolean(previousCardList && previousCardList.__parcelBuildingManualScroll);
    const previousScrollLeft = previousCardList ? previousCardList.scrollLeft : null;
    const sourceRecords = Array.isArray(data.records) ? data.records : [];
    const buildingCardCollator = new Intl.Collator("ko-KR", { numeric: true, sensitivity: "base" });
    const auxiliaryBuildingPattern = /재활용|보관소|기계실|전기실|관리실|경비실|주차|부속|창고|기타|정화조|펌프실|보일러실/;
    const records = sourceRecords.map(function(record, sourceIndex) {
      const dongText = String(record && record.dongName || "").trim();
      const descriptor = [dongText, record && record.buildingName, record && record.mainPurpose, record && record.otherPurpose]
        .filter(Boolean)
        .join(" ");
      const numberMatch = dongText.match(/\d+/);
      const isAuxiliary = auxiliaryBuildingPattern.test(descriptor);
      let group = 3;
      if (record && record.kind === "recap") group = 0;
      else if (numberMatch && /동/.test(dongText) && !isAuxiliary) group = 1;
      else if (numberMatch && !isAuxiliary) group = 2;
      else if (!isAuxiliary) group = 3;
      else group = 4;
      return {
        record: record,
        sourceIndex: sourceIndex,
        group: group,
        number: numberMatch ? Number(numberMatch[0]) : Number.MAX_SAFE_INTEGER,
        descriptor: descriptor
      };
    }).sort(function(a, b) {
      if (a.group !== b.group) return a.group - b.group;
      if (a.number !== b.number) return a.number - b.number;
      const textOrder = buildingCardCollator.compare(a.descriptor, b.descriptor);
      return textOrder || a.sourceIndex - b.sourceIndex;
    }).map(function(item) {
      return item.record;
    });
    const buildingTab = panel.querySelector('[data-parcel-section-target="parcel-property-building"]');
    if (buildingTab && records.length) buildingTab.classList.remove("is-empty");
    if (!records.length) {
      target.classList.remove("parcel-property-loading");
      target.innerHTML = '<div class="parcel-property-empty realjeju-property-state-message">' + (data.upstreamUnavailable === true
        ? '건축물대장 정보를 현재 확인할 수 없습니다.'
        : '건축물대장 정보가 존재하지 않습니다.') + '</div>';
      if (buildingTab) buildingTab.classList.add("is-empty");
      return;
    }
    const index = Math.max(0, Math.min(records.length - 1, Number(selectedIndex) || 0));
    const record = records[index];
    const wastewater = Array.isArray(data.wastewater) ? data.wastewater[0] : null;
    target.classList.remove("parcel-property-loading");
    const housingPrices = panel.__parcelFeature && Array.isArray(panel.__parcelFeature.individualHousingPrices)
      ? panel.__parcelFeature.individualHousingPrices
      : [];
    const commonHousingPrices = data && Array.isArray(data.commonHousingPrices) ? data.commonHousingPrices : [];
    const commonHousingStatus = String(data && data.commonHousingStatus || (data && data.detailsPending ? 'loading' : 'unavailable'));
    const businesses = data && Array.isArray(data.businesses) ? data.businesses : [];
    const businessStatus = String(data && data.businessStatus || (data && data.detailsPending ? 'loading' : ''));
    const allFloors = Array.isArray(data.floors) ? data.floors : [];
    const floors = (record.kind === "recap" ? allFloors : allFloors.filter(function(floor) {
      return !record.managementKey || !floor.managementKey || floor.managementKey === record.managementKey;
    })).slice().sort(function(a, b) {
      function floorOrder(floor) {
        const type = String(floor && floor.floorType || "").trim();
        const numberText = String(floor && floor.floorNumber || "").trim();
        const combined = type + " " + numberText;
        const matched = combined.match(/\d+(?:\.\d+)?/);
        const number = matched ? Number(matched[0]) : 0;
        if (/옥탑|옥상/.test(combined)) return { group: 3, number: number };
        if (/지하|^B\s*\d/i.test(combined)) return { group: 1, number: number };
        return { group: 2, number: number };
      }
      const aOrder = floorOrder(a);
      const bOrder = floorOrder(b);
      if (aOrder.group !== bOrder.group) return bOrder.group - aOrder.group;
      if (aOrder.number === bOrder.number) return 0;
      return aOrder.group === 1 ? aOrder.number - bOrder.number : bOrder.number - aOrder.number;
    });
    target.innerHTML = '<div class="parcel-building-selector-head"><h3>건축물대장 선택</h3><button type="button" class="parcel-building-show-all" data-parcel-building-show-all>전체보기 ' + records.length + '</button></div><div class="parcel-building-carousel">'
      + (records.length > 1 ? '<button type="button" class="parcel-building-carousel-nav is-prev" data-parcel-building-nav="prev" aria-label="이전 건축물대장"' + (index === 0 ? ' disabled' : '') + '><span aria-hidden="true"></span></button>' : '')
      + '<div class="parcel-building-card-list' + (records.length === 1 ? ' is-single' : '') + '">' + records.map(function(item, itemIndex) {
      return '<button type="button" class="parcel-building-card' + (itemIndex === index ? " is-active" : "") + '" data-parcel-building-index="' + itemIndex + '"><small>' + esc(item.kind === "recap" ? "총괄" : (item.dongName || "표제부")) + '</small><strong>' + esc(item.mainPurpose || item.buildingName || "건물") + '</strong></button>';
    }).join("") + '</div>'
      + (records.length > 1 ? '<div class="parcel-building-card-scrollbar" data-parcel-building-card-scrollbar><span data-parcel-building-card-scrollbar-thumb></span></div>' : '')
      + (records.length > 1 ? '<button type="button" class="parcel-building-carousel-nav is-next" data-parcel-building-nav="next" aria-label="다음 건축물대장"' + (index === records.length - 1 ? ' disabled' : '') + '><span aria-hidden="true"></span></button>' : '')
      + '</div><div class="parcel-building-details">' + buildingRecordContent(record, wastewater, housingPrices, commonHousingPrices, commonHousingStatus, businesses, businessStatus, floors, records, data.detailsPending === true) + '</div>';
    wireCommonHousingPriceSelector(target, commonHousingPrices, commonHousingStatus);
    const showAllButton = target.querySelector("[data-parcel-building-show-all]");
    if (showAllButton) showAllButton.addEventListener("click", function(event) {
      openBuildingRegisterModal(panel, data, records, index, event);
    });
    const nextCardList = target.querySelector(".parcel-building-card-list");
    if (nextCardList) nextCardList.__parcelBuildingManualScroll = renderOptions.animate === true ? false : previousManualScroll;
    enableBuildingCardDrag(panel, nextCardList);
    wireBuildingCardScrollbar(nextCardList);
    if (nextCardList && previousScrollLeft != null) {
      nextCardList.__parcelBuildingProgrammaticScroll = renderOptions.animate === true;
      nextCardList.scrollLeft = previousScrollLeft;
    }
    const summary = panel.querySelector("[data-parcel-building-summary]");
    if (summary) {
      const recordTotalArea = finite(record.totalArea);
      const recordManagementKey = String(record.managementKey || "");
      const floorRows = Array.isArray(floors) ? floors : [];
      const scopedFloorRows = record.kind === "recap" || records.length === 1 || !recordManagementKey
        ? floorRows
        : floorRows.filter(function(floor) {
            return String(floor && floor.managementKey || "") === recordManagementKey;
          });
      const floorTotalArea = scopedFloorRows.reduce(function(total, floor) {
        const floorArea = finite(floor && (floor.area != null ? floor.area : (floor.areaM2 != null ? floor.areaM2 : floor.totalArea)));
        return floorArea != null && floorArea > 0 ? total + floorArea : total;
      }, 0);
      const summaryArea = recordTotalArea != null && recordTotalArea > 0
        ? recordTotalArea
        : (floorTotalArea > 0 ? floorTotalArea : null);
      summary.innerHTML = ' · 건물 ' + (summaryArea == null
        ? '-'
        : '<span data-parcel-property-area-sqm="' + summaryArea + '">' + esc(formatArea(summaryArea)) + '</span>')
        + (record.approvalDate ? ' · ' + esc(String(record.approvalDate).slice(0, 4)) + '년' : "");
    }
    panel.dataset.parcelBuildingIndex = String(index);
    refreshUnits(panel);
    if (renderOptions.animate !== true && previousScrollLeft == null) alignBuildingCardList(target, "auto");
    if (panel.__parcelBuildingAlignFrame) cancelAnimationFrame(panel.__parcelBuildingAlignFrame);
    panel.__parcelBuildingAlignFrame = requestAnimationFrame(function()
    {
      panel.__parcelBuildingAlignFrame = 0;
      if (panel.__parcelBuildingModalOpen || (nextCardList && nextCardList.__parcelBuildingModalOpen)) return;
      if (renderOptions.animate === true && nextCardList && previousScrollLeft != null) {
        const firstCard = nextCardList.querySelector(".parcel-building-card");
        const listStyle = window.getComputedStyle(nextCardList);
        const gap = Number.parseFloat(listStyle.columnGap || listStyle.gap) || 0;
        const cardStep = (firstCard ? firstCard.offsetWidth : 0) + gap;
        const direction = renderOptions.direction === "prev" ? -1 : 1;
        const maxScrollLeft = Math.max(0, nextCardList.scrollWidth - nextCardList.clientWidth);
        const activeCard = nextCardList.querySelector(".parcel-building-card.is-active");
        const centeredScrollLeft = activeCard
          ? activeCard.offsetLeft - ((nextCardList.clientWidth - activeCard.offsetWidth) / 2)
          : previousScrollLeft + (cardStep * direction);
        const requestedScrollLeft = renderOptions.centerSelected === true
          ? centeredScrollLeft
          : previousScrollLeft + (cardStep * direction);
        const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, requestedScrollLeft));
        panel.__parcelBuildingScrollTarget = nextScrollLeft;
        animateBuildingCardListScroll(nextCardList, nextScrollLeft, 180, function() {
          if (!nextCardList.isConnected) return;
          nextCardList.__parcelBuildingProgrammaticScroll = false;
          panel.__parcelBuildingScrollTarget = nextScrollLeft;
        });
        return;
      }
      if (previousScrollLeft == null) alignBuildingCardList(target, "auto");
      if (nextCardList) panel.__parcelBuildingScrollTarget = nextCardList.scrollLeft;
    });
  }

  function isStableBuildingComponentStatus(status)
  {
    return status === "complete" || status === "not_found" || status === "skipped";
  }

  function isStableBuildingPayload(data)
  {
    const statuses = data && data.componentStatuses;
    return Boolean(statuses) && ["title", "recap", "floors", "wastewater", "units"].every(function(name) {
      return isStableBuildingComponentStatus(statuses[name]);
    });
  }

  function storeStableBuildingPayload(pnu, data)
  {
    if (isStableBuildingPayload(data)) setTimedCache(buildingCache, pnu, data, BUILDING_BROWSER_CACHE_TTL_MS);
    else buildingCache.delete(pnu);
  }

  async function loadBuilding(panel, feature)
  {
    const pnu = String(feature.pnu || "");
    const target = panel.querySelector("[data-parcel-building-content]");
    if (!pnu || !target) return;
    try {
      // The Edge Function's DB cache is the source of truth. A browser-memory
      // payload can predate a completed unit crawl and must never suppress a
      // fresh DB-backed response, otherwise only a sparse subset of floors can
      // remain visible for the whole browser-cache lifetime.
      buildingCache.delete(pnu);
      const basic = await invokeFunction("building-register", { pnu: pnu, scope: "basic" });
      if (panel.dataset.parcelPnu !== pnu) return;
      const basicView = Object.assign({}, basic, {
        wastewater: [],
        floors: [],
        units: [],
        detailsPending: true
      });
      const basicRecords = Array.isArray(basic.records) ? basic.records : [];
      panel.__parcelBuildingData = basicView;
      if (basicRecords.length) {
        renderBuilding(panel, basicView, 0);
      } else {
        target.classList.add("parcel-property-loading");
        target.textContent = "건축물대장을 불러오는 중입니다.";
      }

      // 표제부가 없어도 층별개요가 저장된 건물이 있으므로 상세 DB 조회를 항상 진행합니다.
      // 기본 표제부는 먼저 보여주고 층별·오수정보는 뒤에서 받아 같은 패널을 갱신합니다.
      const commonHousing = basicRecords.some(function(item) {
        return isCommonHousingBuilding(item, basicRecords);
      });
      const businessesPromise = commonHousing
        ? invokeFunction("apartment-businesses", { pnu: pnu }).catch(function(error) {
            console.error("[realjeju apartment-businesses]", error);
            return { status: 'unavailable', items: [] };
          })
        : Promise.resolve({ status: 'skipped', items: [] });
      const commonHousingPricesPromise = commonHousing
        ? invokeFunction("common-housing-prices", { pnu: pnu }).catch(function(error) {
            console.error("[realjeju common-housing-prices]", error);
            return { status: 'unavailable', items: [] };
          })
        : Promise.resolve({ status: 'skipped', items: [] });
      void Promise.all([
        invokeFunction("building-register", { pnu: pnu, scope: "details" }),
        businessesPromise,
        commonHousingPricesPromise,
      ]).then(function(results) {
        const details = results[0] || {};
        const businessData = results[1] || {};
        const commonHousingData = results[2] || {};
        const detailRecords = Array.isArray(details.records) ? details.records : [];
        const merged = {
          pnu: pnu,
          scope: "all",
          detailsComplete: details.detailsComplete === true,
          detailsPending: false,
          records: basicRecords.length ? basicRecords : detailRecords,
          wastewater: Array.isArray(details.wastewater) ? details.wastewater : [],
          units: Array.isArray(details.units) ? details.units : [],
          floors: Array.isArray(details.floors) ? details.floors : [],
          businesses: Array.isArray(businessData.items) ? businessData.items : [],
          businessStatus: String(businessData.status || 'unavailable'),
          commonHousingPrices: Array.isArray(commonHousingData.items) ? commonHousingData.items : [],
          commonHousingStatus: String(commonHousingData.status || 'unavailable'),
          upstreamUnavailable: !basicRecords.length && !detailRecords.length
            && (basic.upstreamUnavailable === true || details.upstreamUnavailable === true),
          warning: String(basic.warning || details.warning || "")
        };
        merged.componentStatuses = Object.assign({}, basic.componentStatuses || {}, details.componentStatuses || {});
        storeStableBuildingPayload(pnu, merged);
        if (panel.dataset.parcelPnu !== pnu) return;
        panel.__parcelBuildingData = merged;
        renderBuilding(panel, merged, panel.dataset.parcelBuildingIndex || 0);
      }).catch(function(error) {
        console.error("[realjeju building-register details]", error);
        const settled = Object.assign({}, basicView, {
          detailsPending: false,
          upstreamUnavailable: !basicRecords.length
        });
        buildingCache.delete(pnu);
        if (panel.dataset.parcelPnu !== pnu) return;
        panel.__parcelBuildingData = settled;
        renderBuilding(panel, settled, panel.dataset.parcelBuildingIndex || 0);
      });
    } catch (error) {
      console.error("[realjeju building-register]", error);
      target.classList.remove("parcel-property-loading");
      target.innerHTML = functionErrorHtml("건물 정보를 불러오지 못했습니다.");
    }
  }

  function enhancePanel(panel)
  {
    if (!panel || panel.dataset.parcelPropertyEnhanced === "true") return;
    const feature = typeof window.getParcelBoundaryInfo === "function" ? window.getParcelBoundaryInfo() : null;
    if (!feature) return;
    panel.dataset.parcelPropertyEnhanced = "true";
    panel.dataset.parcelPnu = String(feature.pnu || "");
    panel.__parcelFeature = feature;
    const addressHeader = panel.querySelector(".parcel-land-info-address");
    const detachedLand = document.createElement("section");
    detachedLand.id = "parcel-property-land";
    detachedLand.className = "parcel-property-block parcel-property-land";
    Array.from(panel.children).forEach(function(child) {
      if (child !== addressHeader) detachedLand.appendChild(child);
    });
    panel.innerHTML = "";
    if (addressHeader) panel.appendChild(addressHeader);
    panel.insertAdjacentHTML("beforeend", buildOverview(feature) + buildNavigation() + buildTradeShell());
    panel.appendChild(detachedLand);
    panel.insertAdjacentHTML("beforeend", buildBuildingShell() + buildAuctionShell());
    const tabs = panel.querySelector(":scope > .parcel-property-tabs");
    if (addressHeader && tabs) {
      const stickyHead = document.createElement("div");
      stickyHead.className = "parcel-property-sticky-head";
      stickyHead.appendChild(addressHeader);
      stickyHead.appendChild(tabs);
      panel.insertBefore(stickyHead, panel.firstChild);
    }
    bindPanelNavigation(panel);
    refreshUnits(panel);
    loadNearbyBrokers(panel, feature);
    loadTrades(panel, feature);
    loadBuilding(panel, feature);
  }

  document.addEventListener("click", function(event) {
    const tab = event.target.closest("[data-parcel-section-target]");
    if (tab) {
      const panel = tab.closest(".parcel-land-info-panel");
      const section = panel && panel.querySelector("#" + tab.dataset.parcelSectionTarget);
      if (section) {
        const requestedTarget = String(tab.dataset.parcelSectionTarget || "");
        setActiveTab(panel, requestedTarget);
        clearTimeout(panel.__parcelNavigationLockTimer);
        panel.__parcelNavigationLockTarget = requestedTarget;
        panel.__parcelNavigationLockTimer = setTimeout(function() {
          panel.__parcelNavigationLockTarget = "";
        }, 1000);
        const scroller = panel.closest(".property-list");
        const stickyHead = panel.querySelector(":scope > .parcel-property-sticky-head");
        if (scroller && stickyHead && typeof scroller.scrollTo === "function") {
          const scrollerRect = scroller.getBoundingClientRect();
          const sectionRect = section.getBoundingClientRect();
          const stickyHeight = stickyHead.getBoundingClientRect().height;
          const targetTop = scroller.scrollTop + sectionRect.top - scrollerRect.top - stickyHeight;
          scroller.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        } else {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      return;
    }
    const buildingFloorMore = event.target.closest("[data-parcel-building-floor-more]");
    if (buildingFloorMore) {
      const accordion = buildingFloorMore.closest("[data-parcel-building-floor-accordion]");
      if (accordion) {
        const hiddenRows = Array.from(accordion.querySelectorAll(".parcel-building-floor-extra-row[hidden]"));
        hiddenRows.slice(0, 10).forEach(function(row) { row.hidden = false; });
        const remaining = Math.max(0, hiddenRows.length - 10);
        const label = buildingFloorMore.querySelector(".parcel-building-floor-more-label");
        const collapseButton = accordion.querySelector("[data-parcel-building-floor-collapse]");
        if (collapseButton) collapseButton.hidden = false;
        if (remaining > 0) {
          if (label) label.textContent = "건축물현황 더보기 (" + remaining.toLocaleString("ko-KR") + "건)";
        } else {
          buildingFloorMore.hidden = true;
        }
      }
      return;
    }
    const buildingFloorCollapse = event.target.closest("[data-parcel-building-floor-collapse]");
    if (buildingFloorCollapse) {
      const accordion = buildingFloorCollapse.closest("[data-parcel-building-floor-accordion]");
      if (accordion) {
        accordion.querySelectorAll(".parcel-building-floor-extra-row").forEach(function(row) { row.hidden = true; });
        buildingFloorCollapse.hidden = true;
        const moreButton = accordion.querySelector("[data-parcel-building-floor-more]");
        const moreLabel = moreButton && moreButton.querySelector(".parcel-building-floor-more-label");
        const total = Math.max(0, Number(accordion.dataset.parcelBuildingFloorTotal) || 0);
        if (moreLabel) moreLabel.textContent = "건축물현황 더보기 (" + total.toLocaleString("ko-KR") + "건)";
        if (moreButton) {
          moreButton.hidden = false;
          requestAnimationFrame(function() {
            moreButton.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      }
      return;
    }
    const tradeMore = event.target.closest("[data-parcel-trade-more]");
    if (tradeMore) {
      const accordion = tradeMore.closest("[data-parcel-trade-accordion]");
      if (accordion) {
        const hiddenRows = Array.from(accordion.querySelectorAll(".parcel-trade-extra-row[hidden]"));
        hiddenRows.slice(0, 10).forEach(function(row) { row.hidden = false; });
        const remaining = Math.max(0, hiddenRows.length - 10);
        const label = tradeMore.querySelector(".parcel-trade-more-label");
        const collapseButton = accordion.querySelector("[data-parcel-trade-collapse]");
        if (collapseButton) collapseButton.hidden = false;
        if (remaining > 0) {
          if (label) label.textContent = "거래내역 더보기 (" + remaining.toLocaleString("ko-KR") + "건)";
        } else {
          tradeMore.hidden = true;
        }
      }
      return;
    }
    const tradeCollapse = event.target.closest("[data-parcel-trade-collapse]");
    if (tradeCollapse) {
      const accordion = tradeCollapse.closest("[data-parcel-trade-accordion]");
      if (accordion) {
        accordion.querySelectorAll(".parcel-trade-extra-row").forEach(function(row) { row.hidden = true; });
        tradeCollapse.hidden = true;
        const moreButton = accordion.querySelector("[data-parcel-trade-more]");
        const moreLabel = moreButton && moreButton.querySelector(".parcel-trade-more-label");
        const total = Math.max(0, Number(accordion.dataset.parcelTradeTotal) || 0);
        if (moreLabel) moreLabel.textContent = "거래내역 더보기 (" + total.toLocaleString("ko-KR") + "건)";
        if (moreButton) {
          moreButton.hidden = false;
          requestAnimationFrame(function() {
            moreButton.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      }
      return;
    }
    const buildingNav = event.target.closest("[data-parcel-building-nav]");
    if (buildingNav) {
      const panel = buildingNav.closest(".parcel-land-info-panel");
      const records = panel && panel.__parcelBuildingData && Array.isArray(panel.__parcelBuildingData.records)
        ? panel.__parcelBuildingData.records
        : [];
      if (panel && records.length) {
        const currentIndex = Math.max(0, Math.min(records.length - 1, Number(panel.dataset.parcelBuildingIndex) || 0));
        const nextIndex = buildingNav.dataset.parcelBuildingNav === "prev" ? currentIndex - 1 : currentIndex + 1;
      renderBuilding(panel, panel.__parcelBuildingData, Math.max(0, Math.min(records.length - 1, nextIndex)), {
        animate: true,
        allowAutoAlign: true,
        direction: buildingNav.dataset.parcelBuildingNav === "prev" ? "prev" : "next"
      });
      }
      return;
    }
    const buildingCard = event.target.closest("[data-parcel-building-index]");
    if (buildingCard) {
      const panel = buildingCard.closest(".parcel-land-info-panel");
      if (panel && panel.__parcelBuildingData) {
        const records = Array.isArray(panel.__parcelBuildingData.records) ? panel.__parcelBuildingData.records : [];
        const currentIndex = Math.max(0, Math.min(records.length - 1, Number(panel.dataset.parcelBuildingIndex) || 0));
        const selectedIndex = Math.max(0, Math.min(records.length - 1, Number(buildingCard.dataset.parcelBuildingIndex) || 0));
        renderBuilding(panel, panel.__parcelBuildingData, selectedIndex, {
          animate: true,
          allowAutoAlign: true,
          centerSelected: true,
          direction: selectedIndex < currentIndex ? "prev" : "next"
        });
      }
    }
  });

  const preloadRecommendedBrokers = function() {
    void loadRecommendedBrokerPool();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preloadRecommendedBrokers, { once: true });
  else preloadRecommendedBrokers();

  if (typeof MutationObserver !== "undefined") {
    const pendingParcelPanels = new Set();
    let pendingParcelFrame = 0;

    function queueParcelPanel(panel) {
      if (!panel || panel.dataset.parcelPropertyEnhanced === "true") return;
      pendingParcelPanels.add(panel);
      if (pendingParcelFrame) return;
      pendingParcelFrame = requestAnimationFrame(function() {
        pendingParcelFrame = 0;
        const panels = Array.from(pendingParcelPanels);
        pendingParcelPanels.clear();
        panels.forEach(function(candidate) {
          if (candidate.isConnected && candidate.dataset.parcelPropertyEnhanced !== "true") {
            enhancePanel(candidate);
          }
        });
      });
    }

    function collectAddedParcelPanels(node) {
      if (!node || node.nodeType !== 1) return;
      if (node.matches && node.matches(".parcel-land-info-panel")) queueParcelPanel(node);
      if (node.querySelectorAll) node.querySelectorAll(".parcel-land-info-panel").forEach(queueParcelPanel);
    }

    // 패널 내부 로딩 문구와 비동기 결과 변경은 다시 감시하지 않는다.
    // 새 패널 노드만 한 번 예약해 아파트처럼 DOM이 큰 필지에서도 재귀 갱신으로 UI가 멈추지 않게 한다.
    const observer = new MutationObserver(function(records) {
      records.forEach(function(record) {
        record.addedNodes.forEach(collectAddedParcelPanels);
      });
    });
    const start = function() {
      observer.observe(document.body, { childList: true, subtree: true });
      document.querySelectorAll(".parcel-land-info-panel").forEach(queueParcelPanel);
    };
    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
