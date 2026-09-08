/* REALJEJU 6.714 | 2026-09-08 */
/* REALJEJU VERSION: 6.714 */
(function startRealjejuCore(global) {
  "use strict";
  if (typeof global.startRealjejuApp === "function") {
    global.startRealjejuApp();
  } else {
    console.error("[realjeju] app core start function is unavailable");
  }
})(window);
