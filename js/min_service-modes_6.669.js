/* REALJEJU 6.669 | 2026-08-20 */
/* REALJEJU VERSION: 6.669 */
(() => {
  "use strict";

  const MODE_KEYS = new Set(["realestate", "parcel", "local-business", "ev-charger"]);
  const EV_CHARGER_SERVICE_VISIBLE_LEVEL = 5;
  const MODE_CLASSES = [
    "service-mode-realestate",
    "service-mode-parcel",
    "service-mode-local-business",
    "service-mode-ev-charger",
    "service-mode-local-business-list"
  ];

  let currentMode = "realestate";
  let localBusinessUserMapType = "";
  const SEARCH_STORAGE_PREFIX = "realjeju.serviceAddressSearch.v1.";

  function getMapApi() {
    return window.realjejuServiceModeMapApi || null;
  }

  function normalizeMode(mode) {
    return MODE_KEYS.has(mode) ? mode : "realestate";
  }

  function normalizeMapType(mode) {
    return ["roadmap", "satellite", "terrain"].includes(mode) ? mode : "roadmap";
  }

  function getLocalBusinessMapType() {
    return localBusinessUserMapType || "roadmap";
  }

  function applyLocalBusinessMapType() {
    if (currentMode !== "local-business") return false;
    getMapApi()?.setMapType?.(getLocalBusinessMapType());
    return true;
  }

  function syncBodyMode(mode) {
    const body = document.body;
    if (!body) return;
    body.classList.remove(...MODE_CLASSES);
    body.classList.add("service-mode-" + mode);
    body.dataset.serviceMode = mode;
  }

  function relayoutMap() {
    requestAnimationFrame(() => {
      getMapApi()?.relayout?.();
    });
  }

  function getAddressSearchInput() {
    return document.getElementById("subAddressSearchInput");
  }

  function readSearchValue(mode) {
    try {
      return window.sessionStorage.getItem(SEARCH_STORAGE_PREFIX + normalizeMode(mode)) || "";
    } catch (error) {
      return "";
    }
  }

  function writeSearchValue(mode, value) {
    try {
      window.sessionStorage.setItem(SEARCH_STORAGE_PREFIX + normalizeMode(mode), String(value || ""));
    } catch (error) {}
  }

  function rememberCurrentSearchValue() {
    const input = getAddressSearchInput();
    if (input) writeSearchValue(currentMode, input.value);
  }

  function restoreSearchValue(mode) {
    const input = getAddressSearchInput();
    if (!input) return;
    input.value = readSearchValue(mode);
    const status = document.getElementById("subAddressSearchStatus");
    if (status) status.textContent = "";
  }

  function bindSearchMemory() {
    const input = getAddressSearchInput();
    if (!input || input.dataset.serviceSearchMemoryBound === "1") return;
    input.dataset.serviceSearchMemoryBound = "1";
    input.addEventListener("input", () => writeSearchValue(currentMode, input.value));
    restoreSearchValue(currentMode);
  }

  function syncServiceRecentSurface() {
    if (typeof window.realjejuRenderSideRecentViewedList === "function") {
      window.realjejuRenderSideRecentViewedList();
      return;
    }
    const list = document.getElementById("realjejuSideRecentList");
    const empty = document.getElementById("realjejuSideRecentEmpty");
    if (!list || !empty) return;
    if (currentMode === "ev-charger" || currentMode === "local-business") {
      list.hidden = true;
      list.style.display = "none";
      list.innerHTML = "";
      empty.hidden = false;
      empty.style.display = "block";
      empty.textContent = currentMode === "ev-charger"
        ? "최근 조회한 충전소 정보가\n없습니다."
        : "최근 조회한 업체가 없습니다.";
    }
  }

function closeTransientUiForModeChange(previousMode, nextMode) {
	if (previousMode === nextMode) return;
	if (typeof window.realjejuClosePropertyInfoTransientPickers === "function") {
		window.realjejuClosePropertyInfoTransientPickers();
	}
	document.querySelectorAll("[data-parcel-building-unit-picker], [data-parcel-common-housing-picker], [data-parcel-building-all-modal]").forEach((surface) => surface.remove());
}

  function waitForServiceModeUiPaint() {
    return new Promise((resolve) => {
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => resolve());
        return;
      }
      window.setTimeout(resolve, 0);
    });
  }

  async function apply(mode) {
	const nextMode = normalizeMode(mode);
	const previousMode = currentMode;
	rememberCurrentSearchValue();
	closeTransientUiForModeChange(previousMode, nextMode);
	currentMode = nextMode;
    syncBodyMode(currentMode);
    restoreSearchValue(currentMode);
    syncServiceRecentSurface();

    if (currentMode === "ev-charger") {
      await waitForServiceModeUiPaint();
    }

    const api = getMapApi();
    if (!api) return false;

    if (previousMode !== currentMode) {
      api.clearAddressSearchMarker?.();
      api.clearParcelBoundary?.();
    }

    if (currentMode === "realestate") {
      api.clearParcelBoundary?.();
      await api.setEvChargerVisible?.(false);
      await api.setLocalBusinessMapVisible?.(false);
      /* REALJEJU preserve the service-scoped realestate map type. */
      api.restorePropertyMarkersVisible?.();
    } else if (currentMode === "parcel") {
      api.closePropertyList?.();
      await api.setLocalBusinessMapVisible?.(false);
      await api.setEvChargerVisible?.(false);
      api.setPropertyMarkersVisible?.(false);
      api.setMapType?.("satellite");
    } else if (currentMode === "local-business") {
      await api.setEvChargerVisible?.(false);
      api.setMapType?.(getLocalBusinessMapType());
      await api.setLocalBusinessMapVisible?.(true);
    } else if (currentMode === "ev-charger") {
      api.closePropertyList?.();
      await api.setLocalBusinessMapVisible?.(false);
      api.setPropertyMarkersVisible?.(false);
      api.setMapType?.("roadmap");
      api.relayout?.();
      if (typeof api.activateEvChargers === "function") {
        await api.activateEvChargers();
      } else {
        api.ensureFacilityLevel?.(EV_CHARGER_SERVICE_VISIBLE_LEVEL);
        await api.setEvChargerVisible?.(true);
      }
    }

    relayoutMap();
    return true;
  }

  window.realjejuServiceModes = Object.freeze({
    apply,
	sync(mode) {
		const nextMode = normalizeMode(mode);
		rememberCurrentSearchValue();
		closeTransientUiForModeChange(currentMode, nextMode);
		currentMode = nextMode;
      syncBodyMode(currentMode);
      restoreSearchValue(currentMode);
      syncServiceRecentSurface();
      applyLocalBusinessMapType();
      return currentMode;
    },
    rememberUserMapType(mode) {
      if (currentMode !== "local-business") return false;
      localBusinessUserMapType = normalizeMapType(mode);
      return true;
    },
    getCurrentMode() {
      return currentMode;
    }
  });

  function getInitialServiceMode() {
    const bodyMode = String(document.body?.dataset?.globalCategory || document.body?.dataset?.serviceMode || "").trim();
    if (MODE_KEYS.has(bodyMode)) return bodyMode;
    const pathname = String(window.location?.pathname || "").replace(/\/+$/, "") || "/";
    if (pathname === "/parcels") return "parcel";
    if (pathname === "/companies") return "local-business";
    if (pathname === "/ev-chargers") return "ev-charger";
    return "realestate";
  }

  function initializeServiceModes() {
    bindSearchMemory();
    const initialMode = getInitialServiceMode();
    Promise.resolve(apply(initialMode)).catch((error) => {
      console.warn("[realjeju service mode] 초기 서비스 적용 실패:", error);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeServiceModes, { once: true });
  } else {
    initializeServiceModes();
  }
})();
