# REALJEJU split build

Source: `realjeju_2.361(3).html`

## Files
- `index.html`: HTML only, loads split CSS/JS files.
- `css/base.css`: global/common styles.
- `css/map.css`: map/roadview/marker related styles.
- `css/detail.css`: property detail panel styles.
- `css/property-register.css`: property registration/address/photo styles.
- `css/broker.css`: broker home/agency related styles.
- `css/admin.css`: admin page styles.
- `js/app.js`: common/global bootstrap logic.
- `js/map.js`: map/roadview/marker related logic.
- `js/property-detail.js`: detail panel/listing view logic.
- `js/property-register.js`: property register/photo/address/upload logic.
- `js/broker-home.js`: broker home/agency/listing management logic.
- `js/admin.js`: admin/application/approval logic.

## Note
This is an actual code split. The original inline CSS and JavaScript were extracted and distributed into feature files by selector/function keywords.
