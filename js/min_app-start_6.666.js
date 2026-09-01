/* REALJEJU 6.666 | 2026-08-20 */
/* REALJEJU VERSION: 6.666 */
(function startRealjejuCore(global) {
  "use strict";
  if (typeof global.startRealjejuApp === "function") {
    global.startRealjejuApp();
  } else {
    console.error("[realjeju] app core start function is unavailable");
  }
})(window);
