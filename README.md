# REALJEJU Ver 2.366 stable split

Source: `realjeju_2.361(3).html`

## Important
This build prioritizes runtime stability. The full original JavaScript execution order is preserved in:

- `js/app.js`

CSS is actually split into:

- `css/base.css`
- `css/map.css`
- `css/detail.css`
- `css/property-register.css`
- `css/broker.css`
- `css/admin.css`

The feature JS files exist as future split targets but are not loaded by `index.html`, because moving JS functions without a dependency graph broke Kakao map initialization.

## Version
Visible version strings were normalized to `Ver 2.366` where detectable.
