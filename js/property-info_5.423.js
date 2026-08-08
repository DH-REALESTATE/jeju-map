// REALJEJU 5.423 property-info background module
// 필지 상세, 실거래가, 공시지가, 건축물대장, 추천 중개사 패널을 한 경계에서 관리합니다.
/* PATCH 5.295: 필지 상세 통합 화면, 실거래가, 주변 중개사, 건축물대장 */
(function initParcelPropertyExperience5293()
{
  if (window.__realjejuParcelPropertyExperience5293) return;
  window.__realjejuParcelPropertyExperience5293 = true;

  const buildingCache = new Map();
  const tradeCache = new Map();
  const tradeCoordinateCache = new Map();
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
    const sharedOwnerCount = finite(possession.sharedOwnerCount);
    const roadOwnership = ownership === "-"
      ? "-"
      : ownership + (sharedOwnerCount == null ? "" : " (공유인수 " + Math.max(0, sharedOwnerCount).toLocaleString("ko-KR") + ")");
    const zone = feature.landUseZone || info.landUseZone || "-";
    const jimokLabel = String(jimok).trim();
    const overviewDetail = jimokLabel === "묘지"
      ? ownership
      : (jimokLabel === "도로" ? roadOwnership : zone);
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
    return '<section id="parcel-property-auction" class="parcel-property-block"><h2>경매 정보</h2><div class="parcel-property-empty">현재 등록된 경매물건이 없습니다.</div></section>';
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
    return String(value || "").replace(/\s+/g, "").replace(/^산/, "산").replace(/-0+(?=\d)/g, "-").replace(/^0+(?=\d)/, "");
  }

  function tradeCoordinateKey(row, feature)
  {
    const supplied = String(row && row.coordinateKey || "").trim();
    if (supplied) return supplied;
    return [
      String(feature && feature.pnu || "").replace(/\D/g, "").slice(0, 5),
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

  function tradeRowsHtml(rows)
  {
    if (!rows.length) return '<div class="parcel-property-empty">조건에 맞는 거래가 없습니다.</div>';
    return '<div class="parcel-trade-table"><div class="parcel-trade-head"><span>거래일</span><span>실거래가</span><span>면적당 단가</span><span>거리</span></div>' + rows.map(function(row) {
      const area = finite(row.areaM2);
      const amount = finite(row.amountManWon);
      const isSale = String(row.dealKind || "sale") === "sale";
      const unitPrice = isSale && area && amount != null ? amount * 10000 / area : null;
      const propertyName = String(row.propertyName || "").trim();
      const typeLabel = [tradePropertyLabel(row), propertyName, tradeKindLabel(row)].filter(Boolean).join(" · ");
      return '<div class="parcel-trade-row"><span>' + esc(row.dealDate || "-") + (typeLabel ? '<small>' + esc(typeLabel) + '</small>' : '') + '</span><strong>' + esc(formatTradePrimaryAmount(row)) + (area == null ? "" : '<small data-parcel-property-area-sqm="' + area + '">' + esc(formatArea(area)) + '</small>') + '</strong><span' + (unitPrice == null ? "" : ' data-parcel-trade-unit-price-sqm="' + unitPrice + '"') + '>' + (unitPrice == null ? "-" : esc((unitPrice / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 2 }) + "만원")) + '</span><em>' + esc(formatDistance(row.distance)) + '</em></div>';
    }).join("") + '</div>';
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
    const pnu = String(feature.pnu || "");
    const lawdCode = pnu.replace(/\D/g, "").slice(0, 5);
    const city = pnu.slice(0, 5) === "50130" ? "서귀포시" : "제주시";
    const missing = new Map();
    records.forEach(function(row) {
      const key = tradeCoordinateKey(row, feature);
      const lat = finite(row && row.lat);
      const lng = finite(row && row.lng);
      if (lat != null && lng != null) {
        tradeCoordinateCache.set(key, { lat: lat, lng: lng });
        return;
      }
      if (!tradeCoordinateCache.has(key) && !missing.has(key) && missing.size < 30) {
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
      tradeCoordinateCache.set(key, result);
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
      const coordinate = tradeCoordinateCache.get(tradeCoordinateKey(row, feature));
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
    const directCandidates = [
      [feature && feature.lat, feature && feature.lng],
      [feature && feature.latitude, feature && feature.longitude],
      [feature && feature.center && feature.center.lat, feature && feature.center && feature.center.lng],
      [feature && feature.centroid && feature.centroid.lat, feature && feature.centroid && feature.centroid.lng]
    ];
    for (let index = 0; index < directCandidates.length; index += 1) {
      const lat = Number(directCandidates[index][0]);
      const lng = Number(directCandidates[index][1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: lat, lng: lng };
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

  function renderParcelTradeGraph(target, rows, range)
  {
    if (!target) return;
    const selectedRange = range === "1y" || range === "all" ? range : "3y";
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
      target.classList.add("parcel-property-empty");
      target.textContent = "표시할 주변 유사거래가 없습니다.";
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
    const height = 300;
    const left = 58;
    const right = 18;
    const top = 24;
    const bottom = 44;
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
    const summary = '<div class="parcel-trade-graph-summary"><strong>' + esc(latest.row.dealDate.slice(0, 7)) + '</strong><span><b>매매</b> ' + esc(parcelTradeGraphAmount(latest.amount)) + '</span></div>';
    const svg = '<svg class="parcel-trade-graph-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="주변 유사거래 그래프">'
      + '<g class="parcel-trade-graph-grid">' + yLabels + xLabels + '</g>'
      + '<path class="parcel-trade-graph-area" d="' + area + '"></path>'
      + '<polyline class="parcel-trade-graph-line" points="' + polyline + '"></polyline>'
      + '<g class="parcel-trade-graph-points">' + circles + '</g>'
      + '</svg>';
    target.classList.remove("parcel-property-loading");
    // 주변 유사거래 그래프 아래에는 이미 조회한 데이터 중 선택 기간의 최신 5건만 공통 상세 행으로 표시합니다.
    const recentTradeRows = filtered
      .slice()
      .sort(function(a, b) { return b.date - a.date; })
      .slice(0, 5);
    const recentTradeList = recentTradeRows.length
      ? '<div class="parcel-trade-graph-recent-list">' +
        recentTradeRows.map(function(item) {
          const row = item.row || {};
          const areaM2 = finite(row.areaM2);
          const distance = finite(row.distance);
          const location = [row.umdName, row.jibun].filter(Boolean).join(" ");
          const parcelLabel = [location || "거래 필지", row.jimok].filter(Boolean).join(" · ");
          const detailParts = [];
          if (row.dealDate) detailParts.push(esc(row.dealDate));
          if (areaM2 !== null) {
            detailParts.push(
              '<span data-parcel-property-area-sqm="' + esc(String(areaM2)) + '">' +
              esc(formatArea(areaM2)) +
              '</span>'
            );
          }
          if (distance !== null) detailParts.push(esc(formatDistance(distance)));
          return (
            '<div class="parcel-property-info-row">' +
              '<span>' + esc(parcelLabel) + '</span>' +
              '<strong>' + esc(formatTradeAmount(row.amountManWon)) +
                (detailParts.length ? '<small>' + detailParts.join(" · ") + '</small>' : '') +
              '</strong>' +
            '</div>'
          );
        }).join("") +
        '</div>'
      : '';

    target.classList.remove("parcel-property-empty");
    target.innerHTML = controls + summary + svg + recentTradeList;
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


  async function loadTrades(panel, feature)
  {
    const exactTarget = panel.querySelector("[data-parcel-exact-trades]");
    const similarTarget = panel.querySelector("[data-parcel-similar-trades]");
    const graphTarget = panel.querySelector("[data-parcel-trade-chart]");
    const pnu = String(feature.pnu || "");
    if (!pnu || !exactTarget || !graphTarget) return;
    try {
      const sourceJibun = normalizeJibun(feature.jibun || (feature.landCharacteristics || {}).jibun);
      const targetUmdName = parcelTradeUmdName(feature);
      const featurePoint = parcelTradeFeaturePoint(feature);
      let data = tradeCache.get(pnu);
      if (!data) {
        // 필지 조회에서는 공공데이터를 호출하지 않고 미리 적재된 Supabase 거래 레코드만 조회합니다.
        data = await settleParcelTradePromise(
          invokeFunction("land-trades", {
            pnu: pnu,
            jibun: sourceJibun,
            umdName: targetUmdName,
            serviceTypes: REALJEJU_TRADE_SERVICE_TYPES,
            lat: featurePoint ? featurePoint.lat : null,
            lng: featurePoint ? featurePoint.lng : null,
            radiusMeters: 500,
            nearbyLimit: 5
          }),
          15000,
          "실거래가 조회 시간이 초과되었습니다."
        );
        tradeCache.set(pnu, data);
      }
      const records = Array.isArray(data.records) ? data.records : [];
      const exactAll = records.filter(function(row) {
        const jibunMatch = sourceJibun && normalizeJibun(row.jibun) === sourceJibun;
        const umdMatch = !targetUmdName || String(row.umdName || "").trim() === targetUmdName;
        return jibunMatch && umdMatch;
      });
      const exact = exactAll.slice(0, 8);
      const info = feature.landCharacteristics || {};
      const graphJimok = String(feature.jimok || info.jimok || "").trim();
      const graphZone = String(feature.landUseZone || info.landUseZone || "").trim();
      const exactSale = exactAll.find(function(row) {
        return String(row && row.dealKind || "sale") === "sale";
      });
      const graphPropertyType = exactSale ? tradePropertyLabel(exactSale) : "토지";
      const nearbyRecords = Array.isArray(data.nearbyRecords) ? data.nearbyRecords : [];
      const graphCandidates = nearbyRecords.filter(function(row) {
        const isSale = String(row && row.dealKind || "sale") === "sale";
        const propertyMatch = tradePropertyLabel(row) === graphPropertyType;
        const rowJimok = String(row.jimok || "").trim();
        const jimokMatch = graphPropertyType !== "토지" || !graphJimok || !rowJimok || rowJimok === graphJimok;
        const rowZone = String(row.landUseZone || "").trim();
        const zoneMatch = graphPropertyType !== "토지" || !graphZone || !rowZone || rowZone === graphZone;
        const differentParcel = normalizeJibun(row.jibun) !== sourceJibun;
        return isSale && propertyMatch && jimokMatch && zoneMatch && differentParcel;
      });
      exactTarget.classList.remove("parcel-property-loading");
      exactTarget.innerHTML = tradeRowsHtml(exact);
      const graphRows = graphCandidates.slice().sort(function(a, b) {
        return String(b.dealDate || "").localeCompare(String(a.dealDate || ""));
      });
      renderParcelTradeGraph(graphTarget, graphRows, "3y");
      graphTarget.onclick = function(event) {
        const button = event.target.closest("[data-parcel-trade-range]");
        if (!button) return;
        renderParcelTradeGraph(graphTarget, graphRows, button.getAttribute("data-parcel-trade-range"));
      };
    } catch (error) {
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
    return prices.slice(0, 5).map(function(item) {
      const period = esc(String(item.year || "-") + "." + String(item.month || "01").padStart(2, "0"));
      return '<div class="parcel-building-house-price-record">'
        + infoRow("기준연월", period)
        + infoRow("개별주택가격", esc(formatIndividualHousingPrice(item.housePrice)))
        + infoRow("대지면적", areaValue(item.calculatedLandAreaM2 == null ? item.landRegisterAreaM2 : item.calculatedLandAreaM2))
        + infoRow("건물연면적", areaValue(item.calculatedBuildingAreaM2 == null ? item.totalBuildingAreaM2 : item.calculatedBuildingAreaM2))
        + '</div>';
    }).join("");
  }

  function buildingFloorContent(floors, purposeName, detailsPending)
  {
    const rows = Array.isArray(floors) ? floors : [];
    if (!rows.length) return detailsPending
      ? '<div class="parcel-property-loading">건축물현황을 불러오는 중입니다.</div>'
      : '<div class="parcel-property-empty">건축물현황 정보가 존재하지 않습니다.</div>';
    const list = rows.map(function(floor) {
      const floorName = [floor.floorType, floor.floorNumber].filter(Boolean).join(" ") || "-";
      const purpose = [floor.mainPurpose, floor.otherPurpose].filter(Boolean).join(" · ") || "-";
      const detail = esc(floor.structureName || "-") + " · " + areaValue(floor.area);
      return '<div class="parcel-property-info-row parcel-building-floor-row">'
        + '<span class="parcel-building-floor-name">' + esc(floorName) + '</span>'
        + '<span class="parcel-building-floor-purpose">' + esc(purpose) + '</span>'
        + '<span class="parcel-building-floor-detail">' + detail + '</span>'
        + '</div>';
    }).join("");
    return '<h3 class="parcel-building-floor-title"><span>건축물현황</span><span class="parcel-building-group-link">' + esc(purposeName || "-") + '</span></h3>'
      + '<div class="parcel-building-floor-list">' + list + '</div>'
      ;
  }

  function buildingRecordContent(record, wastewater, housingPrices, floors, allRecords, detailsPending)
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
	const elevator = '<section class="parcel-building-group" data-parcel-building-elevator><h3>승강기</h3>'
	  + infoRow("승용", passengerElevatorCount == null ? "-" : esc(String(passengerElevatorCount)))
	  + infoRow("비상용", emergencyElevatorCount == null ? "-" : esc(String(emergencyElevatorCount))) + '</section>';
    const parking = '<section class="parcel-building-group"><h3>주차장</h3>'
      + infoRow("자주식", '<span>옥내 ' + esc(String(record.indoorAutoCount || 0)) + '대</span><span>옥외 ' + esc(String(record.outdoorAutoCount || 0)) + '대</span>')
      + infoRow("기계식", '<span>옥내 ' + esc(String(record.indoorMechCount || 0)) + '대</span><span>옥외 ' + esc(String(record.outdoorMechCount || 0)) + '대</span>') + '</section>';
    const wastewaterRows = detailsPending
      ? '<div class="parcel-property-loading">오수정화시설을 불러오는 중입니다.</div>'
      : (wastewater
        ? infoRow("형식", esc(wastewater.modeName || "-")) + infoRow("형식 (기타)", esc(wastewater.etcMode || "-")) + infoRow("용량 (인용)", esc(wastewater.capacityPeople || "-")) + infoRow("용량 (루베)", esc(wastewater.capacityCubicMeter || "-"))
        : '<div class="parcel-property-empty">오수정화시설 정보가 없습니다.</div>');
    return '<section class="parcel-building-group"><h3>' + esc(record.kind === "recap" ? "총괄표제부" : "표제부") + '</h3>'
      + infoRow("건물이름", esc(record.buildingName || "-"))
      + infoRow("주용도", esc(record.mainPurpose || "-"))
      + infoRow("기타용도", esc(record.otherPurpose || "-"))
      + infoRow("주구조", esc(structureName || "-"))
      + infoRow("지붕구조", esc(roofName || "-"))
      + infoRow("높이", buildingHeight == null ? "-" : esc(new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(buildingHeight)) + "m")
      + infoRow("지상/지하", groundFloorCount == null && undergroundFloorCount == null ? "-" : esc(String(groundFloorCount == null ? 0 : groundFloorCount)) + "/" + esc(String(undergroundFloorCount == null ? 0 : undergroundFloorCount)))
      + infoRow("대지면적", areaValue(record.platArea))
      + infoRow("건축면적", areaValue(record.archArea, record.buildingCoverageRatio == null ? "" : '<small>(건폐율 ' + esc(String(record.buildingCoverageRatio)) + '%)</small>'))
      + infoRow("연면적", areaValue(record.totalArea))
      + infoRow("용적률산정연면적", areaValue(record.floorRatioArea, record.floorAreaRatio == null ? "" : '<small>(용적률 ' + esc(String(record.floorAreaRatio)) + '%)</small>'))
      + infoRow("세대 수", '<span>세대 ' + esc(String(record.householdCount || 0)) + '</span><span>가구 ' + esc(String(record.familyCount || 0)) + '</span><span>호수 ' + esc(String(record.unitCount || 0)) + '</span>')
      + infoRow("외필지 수", esc(String(record.extraLotCount || 0))) + '</section>'
      + '<section class="parcel-building-group parcel-building-floor-group">' + buildingFloorContent(floors, record.mainPurpose || record.otherPurpose || "-", detailsPending) + '</section>'
	  + elevator
      + '<section class="parcel-building-group"><h3>오수정화시설</h3>' + wastewaterRows + '</section>'
      + parking
      + '<section class="parcel-building-group"><h3>일자정보</h3>' + infoRow("허가일", esc(formatDate(record.permitDate))) + infoRow("착공일", esc(formatDate(record.startDate))) + infoRow("사용승인일", esc(formatDate(record.approvalDate))) + '</section>'
      + '<section class="parcel-building-group"><h3>호별정보</h3><div class="parcel-property-empty">전유부/대지권 정보가 존재하지 않습니다.</div></section>'
      + '<section class="parcel-building-group"><h3>개별주택공시가격</h3>' + individualHousingPriceContent(housingPrices) + '</section>';
  }

  function renderBuilding(panel, data, selectedIndex)
  {
    const target = panel.querySelector("[data-parcel-building-content]");
    if (!target) return;
    const records = Array.isArray(data.records) ? data.records : [];
    const buildingTab = panel.querySelector('[data-parcel-section-target="parcel-property-building"]');
    if (buildingTab && records.length) buildingTab.classList.remove("is-empty");
    if (!records.length) {
      target.classList.remove("parcel-property-loading");
      target.innerHTML = '<div class="parcel-property-empty">' + (data.upstreamUnavailable === true
        ? '건물 정보를 불러오지 못했습니다.'
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
    target.innerHTML = '<div class="parcel-building-selector-head"><h3>건축물대장 선택</h3><span>전체보기 ' + records.length + '</span></div><div class="parcel-building-card-list' + (records.length === 1 ? ' is-single' : '') + '">' + records.map(function(item, itemIndex) {
      return '<button type="button" class="parcel-building-card' + (itemIndex === index ? " is-active" : "") + '" data-parcel-building-index="' + itemIndex + '"><small>' + esc(item.kind === "recap" ? "총괄" : (item.dongName || "표제부")) + '</small><strong>' + esc(item.mainPurpose || item.buildingName || "건물") + '</strong></button>';
    }).join("") + '</div><div class="parcel-building-details">' + buildingRecordContent(record, wastewater, housingPrices, floors, records, data.detailsPending === true) + '</div>';
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
  }

  function isStableBuildingComponentStatus(status)
  {
    return status === "complete" || status === "not_found" || status === "skipped";
  }

  function isStableBuildingPayload(data)
  {
    const statuses = data && data.componentStatuses;
    return Boolean(statuses) && ["title", "recap", "floors", "wastewater"].every(function(name) {
      return isStableBuildingComponentStatus(statuses[name]);
    });
  }

  function storeStableBuildingPayload(pnu, data)
  {
    if (isStableBuildingPayload(data)) buildingCache.set(pnu, data);
    else buildingCache.delete(pnu);
  }

  async function loadBuilding(panel, feature)
  {
    const pnu = String(feature.pnu || "");
    const target = panel.querySelector("[data-parcel-building-content]");
    if (!pnu || !target) return;
    try {
      const cached = buildingCache.get(pnu);
      if (cached && cached.detailsPending !== true) {
        panel.__parcelBuildingData = cached;
        renderBuilding(panel, cached, panel.dataset.parcelBuildingIndex || 0);
        return;
      }
      let basic = cached;
      if (!basic) {
        basic = await invokeFunction("building-register", { pnu: pnu, scope: "basic" });
      }
      if (panel.dataset.parcelPnu !== pnu) return;
      const basicView = Object.assign({}, basic, {
        wastewater: [],
        floors: [],
        detailsPending: true
      });
      panel.__parcelBuildingData = basicView;
      renderBuilding(panel, basicView, 0);

      const basicRecords = Array.isArray(basic.records) ? basic.records : [];
      const basicStable = basic.componentStatuses
        && isStableBuildingComponentStatus(basic.componentStatuses.title)
        && isStableBuildingComponentStatus(basic.componentStatuses.recap);
      if (!basicRecords.length && basicStable) {
        const noBuilding = Object.assign({}, basicView, {
          detailsPending: false,
          detailsComplete: true,
          componentStatuses: Object.assign({}, basic.componentStatuses, {
            floors: "skipped",
            wastewater: "skipped"
          })
        });
        storeStableBuildingPayload(pnu, noBuilding);
        panel.__parcelBuildingData = noBuilding;
        renderBuilding(panel, noBuilding, 0);
        return;
      }

      // 기본 표제부는 먼저 보여주고 층별·오수정보는 뒤에서 받아 같은 패널을 갱신합니다.
      void invokeFunction("building-register", { pnu: pnu, scope: "details" }).then(function(details) {
        const detailRecords = Array.isArray(details.records) ? details.records : [];
        const merged = {
          pnu: pnu,
          scope: "all",
          detailsComplete: details.detailsComplete === true,
          detailsPending: false,
          records: basicRecords.length ? basicRecords : detailRecords,
          wastewater: Array.isArray(details.wastewater) ? details.wastewater : [],
          floors: Array.isArray(details.floors) ? details.floors : [],
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
    const buildingCard = event.target.closest("[data-parcel-building-index]");
    if (buildingCard) {
      const panel = buildingCard.closest(".parcel-land-info-panel");
      if (panel && panel.__parcelBuildingData) renderBuilding(panel, panel.__parcelBuildingData, buildingCard.dataset.parcelBuildingIndex);
    }
  });

  const preloadRecommendedBrokers = function() {
    void loadRecommendedBrokerPool();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preloadRecommendedBrokers, { once: true });
  else preloadRecommendedBrokers();

  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(function() {
      document.querySelectorAll(".parcel-land-info-panel:not([data-parcel-property-enhanced])").forEach(enhancePanel);
      document.querySelectorAll(".parcel-land-info-panel[data-parcel-property-enhanced]").forEach(refreshUnits);
    });
    const start = function() {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      document.querySelectorAll(".parcel-land-info-panel").forEach(enhancePanel);
    };
    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
