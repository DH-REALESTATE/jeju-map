/* REALJEJU 6.666 | 2026-08-20 */
/* REALJEJU VERSION: 6.666 */
// REALJEJU 6.140 user-action module loader
(function initRealjejuModuleLoader(global) {
  "use strict";

  const loadedModules = new Map();
  let workspaceReady = false;
  let runtimeTailScheduleStarted = false;
  let runtimeTailReady = false;
  let coreLoadPromise = null;
  let coreScheduleStarted = false;
  if (typeof global.realjejuWorkspaceReady !== "boolean") global.realjejuWorkspaceReady = false;

  function loadScript(name, src) {
    if (loadedModules.has(name)) return loadedModules.get(name);
    const promise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-realjeju-module="' + name + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.realjejuModule = name;
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
    const retryablePromise = promise.catch((error) => {
      loadedModules.delete(name);
      const failedScript = document.querySelector('script[data-realjeju-module="' + name + '"]');
      if (failedScript && failedScript.dataset.loaded !== "true") failedScript.remove();
      throw error;
    });
    loadedModules.set(name, retryablePromise);
    return retryablePromise;
  }

  function preloadCoreApp() {
    if (typeof global.startRealjejuApp === "function"
      && typeof global.realjejuEnsureFeatureBootstrap === "function") {
      return Promise.resolve(true);
    }
    if (coreLoadPromise) return coreLoadPromise;
    coreLoadPromise = loadScript("app-core", "/js/min_app-core_6.666.js?v=20261071-nearby-next-margin-6180")
      .then(() => loadScript("service-modes", "/js/min_service-modes_6.666.js?v=20261071-nearby-next-margin-6180"))
      .then(() => loadScript("app-start", "/js/min_app-start_6.666.js?v=20261071-nearby-next-margin-6180"))
      .then(() => true)
      .catch((error) => {
        coreLoadPromise = null;
        console.error("[realjeju module] app core load failed", error);
        return false;
      });
    return coreLoadPromise;
  }

  function preloadPropertyInfo() {
    return loadScript("property-info", "/js/min_property-info_6.666.js?v=20261047-parcel-nearby-map-reuse-6104")
      .then(() => true)
      .catch((error) => {
        console.error("[realjeju module] property-info load failed", error);
        return false;
      });
  }

  function preloadAppFeatures() {
    return loadScript("app-features", "/js/min_app-features_6.666.js?v=20261071-nearby-next-margin-6180")
      .then(() => true)
      .catch((error) => {
        console.error("[realjeju module] app features load failed", error);
        return false;
      });
  }

  function preloadRuntimeTail() {
    return loadScript("runtime-tail", "/js/min_runtime-tail_6.666.js?v=20261071-nearby-next-margin-6180")
      .then(() => {
        runtimeTailReady = true;
        return true;
      })
      .catch((error) => {
        console.error("[realjeju module] runtime tail load failed", error);
        return false;
      });
  }

  function ensureRuntimeTail() {
    return preloadCoreApp()
      .then((coreLoaded) => {
        if (!coreLoaded) return false;
        const featureBootstrap = typeof global.realjejuEnsureFeatureBootstrap === "function"
          ? global.realjejuEnsureFeatureBootstrap()
          : preloadAppFeatures();
        return Promise.resolve(featureBootstrap)
          .then((featuresReady) => {
            if (!featuresReady) return false;
            return preloadRuntimeTail();
          });
      })
      .catch((error) => {
        console.error("[realjeju module] feature bootstrap failed", error);
        return false;
      });
  }

  function scheduleRuntimeTailAfterFirstPaint() {
    if (runtimeTailScheduleStarted) return;
    runtimeTailScheduleStarted = true;
    const load = () => {
      void ensureRuntimeTail();
    };
    const queueIdle = () => {
      if (typeof global.requestIdleCallback === "function") {
        global.requestIdleCallback(load, { timeout: 900 });
      } else {
        global.setTimeout(load, 0);
      }
    };

    // Load deferred runtime owners only after the first map paint.
    if (document.visibilityState === "hidden" || typeof global.requestAnimationFrame !== "function") {
      global.setTimeout(load, 0);
      return;
    }
    global.requestAnimationFrame(queueIdle);
  }

  function scheduleCoreAfterFirstPaint() {
    if (coreScheduleStarted) return;
    coreScheduleStarted = true;
    void preloadCoreApp();
  }

  function preloadKakaoShare() {
    if (global.Kakao) return Promise.resolve(true);
    return loadScript("kakao-share", "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js")
      .then(() => true)
      .catch((error) => {
        console.error("[realjeju module] kakao share load failed", error);
        return false;
      });
  }

  function preloadWorkspace() {
    return preloadCoreApp()
      .then((coreLoaded) => {
        if (!coreLoaded) throw new Error("app core is required before workspace");
        return preloadAppFeatures();
      })
      .then((featuresLoaded) => {
        if (!featuresLoaded) throw new Error("app features are required before workspace");
        return loadScript("workspace", "/js/min_workspace-app_6.666.js?v=20261071-nearby-next-margin-6180");
      })
      .then(() => {
        workspaceReady = true;
        // 6.140: account-only observers can bind after the workspace module is actually available.
        global.realjejuWorkspaceReady = true;
        document.dispatchEvent(new CustomEvent("realjeju:workspace-ready"));
        return true;
      })
      .catch((error) => {
        console.error("[realjeju module] workspace load failed", error);
        return false;
      });
  }

  function hasCachedAuthSession() {
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = String(localStorage.key(index) || "");
        if (/^sb-.+-auth-token$/.test(key) && localStorage.getItem(key)) return true;
      }
    } catch (error) {}
    return /(?:access_token|refresh_token|type=recovery)/.test(String(location.hash || "") + String(location.search || ""));
  }

  function requiresWorkspaceForCurrentPath() {
    const path = String(location.pathname || "/");
    return /^\/(?:admin|account|terms|company)(?:\/|$)/.test(path)
      || /^\/properties\/(?:broker|register|favorites|my)(?:\/|$)/.test(path);
  }

  const workspaceTriggerSelector = [
    "#detailAuthTrigger",
    "#mainLandingLoginBtn",
    "#mainLandingSignupBtn",
    "#realjejuSideAccountTrigger",
    "#globalTopbarMoreBtn",
    "#globalTopbarManagementMenuItem",
    "[data-account-action]",
    "[data-side-nav-action='favorites']",
    "[data-side-nav-action='broker-home']",
    "[data-side-nav-action='register']",
    "[data-side-nav-action='admin']",
    ".auth-terms-open",
    "[data-main-landing-action='notice']"
  ].join(",");

  const workspaceTopbarLabels = new Set([
    "관심 부동산",
    "중개사 홈",
    "매물 등록",
    "관리자 페이지",
    "운영자 페이지"
  ]);

  function findWorkspaceTrigger(target) {
    if (!target || typeof target.closest !== "function") return null;
    const directTrigger = target.closest(workspaceTriggerSelector);
    if (directTrigger) return directTrigger;
    const topbarItem = target.closest(".topbar-menu-item");
    if (topbarItem && workspaceTopbarLabels.has(String(topbarItem.textContent || "").trim())) return topbarItem;
    return null;
  }

  document.addEventListener("pointerdown", (event) => {
    if (!workspaceReady && findWorkspaceTrigger(event.target)) preloadWorkspace();
  }, true);

  // 6.140: a first user action wins over the idle schedule, while module dedupe prevents double loading.
  document.addEventListener("pointerdown", () => {
    void ensureRuntimeTail();
  }, { capture: true, once: true });

  // 6.141: 지연 로딩 전 랜딩 버튼 클릭은 runtime 준비 뒤 한 번만 재실행한다.
  document.addEventListener("click", (event) => {
    const trigger = event.target && typeof event.target.closest === "function"
      ? event.target.closest("[data-main-landing-action], [data-main-landing-category]")
      : null;
    if (!trigger || runtimeTailReady) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    ensureRuntimeTail().then((loaded) => {
      if (loaded && trigger.isConnected) trigger.click();
    });
  }, true);

  document.addEventListener("click", (event) => {
    const trigger = findWorkspaceTrigger(event.target);
    if (!trigger || workspaceReady) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    preloadWorkspace().then((loaded) => {
      if (loaded && trigger.isConnected) trigger.click();
    });
  }, true);


  // 상단 서비스 메뉴로 페이지를 바꾸면 오른쪽 메뉴는 항상 첫 항목부터 보여줍니다.
  document.addEventListener("click", (event) => {
    const categoryButton = event.target && typeof event.target.closest === "function"
      ? event.target.closest("#globalCategoryMenu .global-category-item")
      : null;
    if (!categoryButton) return;
    const resetSideNavScroll = () => {
      const sideNav = document.getElementById("realjejuSideNav");
      if (sideNav) sideNav.scrollTop = 0;
    };
    resetSideNavScroll();
    if (typeof global.requestAnimationFrame === "function") {
      global.requestAnimationFrame(resetSideNavScroll);
    } else {
      global.setTimeout(resetSideNavScroll, 0);
    }

  }, true);

  global.realjejuModules = Object.freeze({ load: loadScript });
  global.realjejuPreloadCoreApp = preloadCoreApp;
  global.realjejuPreloadAppFeatures = preloadAppFeatures;
  global.realjejuPreloadPropertyInfo = preloadPropertyInfo;
  global.realjejuPreloadKakaoShare = preloadKakaoShare;
  global.realjejuPreloadRuntimeTail = preloadRuntimeTail;
  global.realjejuEnsureRuntimeTail = ensureRuntimeTail;
  global.realjejuScheduleRuntimeTailAfterFirstPaint = scheduleRuntimeTailAfterFirstPaint;
  global.realjejuPreloadWorkspace = preloadWorkspace;

  if (hasCachedAuthSession() || requiresWorkspaceForCurrentPath()) {
    preloadWorkspace();
  } else if (document.documentElement.classList.contains("realjeju-route-booting")) {
    preloadCoreApp();
  } else {
    scheduleCoreAfterFirstPaint();
  }
})(window);
