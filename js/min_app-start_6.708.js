/* REALJEJU 6.708 | 2026-09-06 */
/* REALJEJU VERSION: 6.708 */
(function startRealjejuCore(global) {
  "use strict";
  if (typeof global.startRealjejuApp === "function") {
    global.startRealjejuApp();
  } else {
    console.error("[realjeju] app core start function is unavailable");
  }
})(window);
