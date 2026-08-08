// REALJEJU 5.422 background module loader
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
    loadedModules.set(name, promise);
    return promise;
  }

  global.realjejuModules = Object.freeze({ load: loadScript });

  function preloadPropertyInfo() {
    loadScript("property-info", "/js/property-info_5.422.js?v=20260808-workspace-module-split-5422")
      .catch((error) => console.error("[realjeju module] property-info load failed", error));
  }

  function scheduleBackgroundModules() {
    if ("requestIdleCallback" in global) global.requestIdleCallback(preloadPropertyInfo, { timeout: 700 });
    else global.setTimeout(preloadPropertyInfo, 0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scheduleBackgroundModules, { once: true });
  else scheduleBackgroundModules();
})(window);
