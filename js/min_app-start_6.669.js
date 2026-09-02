/* REALJEJU 6.669 | 2026-08-20 */
/* REALJEJU VERSION: 6.669 */
(function startRealjejuCore(global) {
  "use strict";
  if (typeof global.startRealjejuApp === "function") {
    global.startRealjejuApp();
  } else {
    console.error("[realjeju] app core start function is unavailable");
  }
})(window);
