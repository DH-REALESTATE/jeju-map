// REALJEJU 5.801 background module loader
(function initRealjejuModuleLoader(global) {
  "use strict";
  const loadedModules = new Map();

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

  global.realjejuModules = Object.freeze({ load: loadScript });

  function preloadPropertyInfo() {
    return loadScript("property-info", "/js/property-info_5.801.js?v=20260814-building-floors-db-5801")
      .then(() => true)
      .catch((error) => {
        console.error("[realjeju module] property-info load failed", error);
        return false;
      });
  }

  global.realjejuPreloadPropertyInfo = preloadPropertyInfo;

  function scheduleBackgroundModules() {
    preloadPropertyInfo().then((loaded) => {
      if (!loaded) global.setTimeout(preloadPropertyInfo, 700);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scheduleBackgroundModules, { once: true });
  else scheduleBackgroundModules();
})(window);
