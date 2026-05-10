// REALJEJU map.js - split from realjeju_2.361(3).html

const normalized = value.length === 3 ? value.split('').map(ch => ch + ch).join('') : value;
	if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return hex;

let viewMap = {};

const count = Number(viewMap[getViewCountKey(viewKey)] || 0);
	return `조회 ${Number.isFinite(count) ? count : 0}`;
}

const ids = [...new Set((items || []).map(item => getItemViewKey(item)).filter(Boolean))];
	if (!ids.length) return {};
	try {

const fetched = await fetchViewCounts(items);
	if (renderSeq !== state.viewRenderSeq) return;
	viewMap = { ...viewMap, ...fetched };
	Object.entries(fetched).forEach(([viewKey, count]) => {
		updateViewCountElements(viewKey, count);
	});
}

const nextCount = Number(json?.views);
		if (!Number.isFinite(nextCount)) return null;
		viewMap[key] = nextCount;
		updateViewCountElements(key, nextCount);
		return nextCount;
	} catch (err) {
		return null;
	}
}

const state = {
	map: null,
	viewRenderSeq: 0,
	clusterer: null,
	markers: [],
	all: [],
	filtered: [],
	selectedFeatures: new Set(),
	selectedMarkerId: null,
	selectedMarkerIds: new Set(),
	selectedClusterKey: null,
	selectionMode: null,
	lockedListIds: null,
	lastViewportListIds: [],
	recommendItem: null,
	recommendAgent: null,
	lastRecommendPoolKey: "",
	isRecommendCardDismissed: false,
	isRecommendAgentDismissed: false,
	isListOpen: false
};

const REMOTE_BASE = "https://jeju-map.vercel.app/";

let roadview = null;

let roadviewClient = null;

let roadviewOverlay = null;

let roadviewFullscreenBtn = null;

let currentMapTypeMode = "roadmap";

const DEFAULT_MAP_CENTER = { lat: 33.483115, lng: 126.478993, level: 5 };

const GEOLOCATION_MAP_LEVEL = 4;

let preventMapViewportChange = false;

let addressSearchMarker = null;

const mapResultCount = document.getElementById("mapResultCount");

const mapEmptyState = document.getElementById("mapEmptyState");

const mapTypeRoadBtn = document.getElementById("mapTypeRoadBtn");

const mapTypeSatelliteBtn = document.getElementById("mapTypeSatelliteBtn");

const mapTypeCadastralBtn = document.getElementById("mapTypeCadastralBtn");

const mapAgentCard = document.getElementById("mapAgentCard");

const mapAgentCloseBtn = document.getElementById("mapAgentCloseBtn");

const mapAgentHideTodayCheck = document.getElementById("mapAgentHideTodayCheck");

const mapAgentPhoto = document.getElementById("mapAgentPhoto");

const mapAgentName = document.getElementById("mapAgentName");

const mapAgentNameRole = document.getElementById("mapAgentNameRole");

const mapAgentDesc = document.getElementById("mapAgentDesc");

const mapAgentBadgeDesc = document.getElementById("mapAgentBadgeDesc");

const mapAgentAddress = document.getElementById("mapAgentAddress");

const mapAgentRegNo = document.getElementById("mapAgentRegNo");

const mapAgentPhone = document.getElementById("mapAgentPhone");

const mapRecommendCard = document.getElementById("mapRecommendCard");

const mapRecommendCloseBtn = document.getElementById("mapRecommendCloseBtn");

const mapRecommendHideTodayCheck = document.getElementById("mapRecommendHideTodayCheck");

const mapRecommendBody = document.getElementById("mapRecommendBody");

const mapRecommendThumb = document.getElementById("mapRecommendThumb");

const mapRecommendType = document.getElementById("mapRecommendType");

const mapRecommendDeal = document.getElementById("mapRecommendDeal");

const mapRecommendPrice = document.getElementById("mapRecommendPrice");

const mapRecommendTitleText = document.getElementById("mapRecommendTitleText");

const mapRecommendAddress = document.getElementById("mapRecommendAddress");

const saved = Number(localStorage.getItem(key) || 0);
	return Number.isFinite(saved) && saved > Date.now();
}

state.isRecommendAgentDismissed = isHideUntilActive(RECOMMEND_AGENT_HIDE_KEY);
state.isRecommendCardDismissed = isHideUntilActive(RECOMMEND_ITEM_HIDE_KEY);

if (mapAgentHideTodayCheck) mapAgentHideTodayCheck.checked = state.isRecommendAgentDismissed;
if (mapRecommendHideTodayCheck) mapRecommendHideTodayCheck.checked = state.isRecommendCardDismissed;

function updateMapTypeButtons()
{
	if (mapTypeRoadBtn) mapTypeRoadBtn.classList.toggle("active", currentMapTypeMode === "roadmap");
	if (mapTypeSatelliteBtn) mapTypeSatelliteBtn.classList.toggle("active", currentMapTypeMode === "satellite");
	if (mapTypeCadastralBtn) mapTypeCadastralBtn.classList.toggle("active", currentMapTypeMode === "cadastral");
}

function setMapTypeMode(mode)
{
	if (!state.map || !window.kakao || !kakao.maps) return;

	currentMapTypeMode = mode;

	try {
		state.map.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
	} catch (e) {}

	if (mode === "satellite") {
		state.map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
	} else if (mode === "cadastral") {
		state.map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
		state.map.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
	} else {
		state.map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
	}

	updateMapTypeButtons();
}

window.setMapTypeMode = setMapTypeMode;

const ids = (items || [])
	.map(item => normalizeItemId(item?.id))
	.filter(Boolean);
	state.lockedListIds = ids.length ? ids : null;
}

const idSet = new Set(state.lockedListIds.map(normalizeItemId));

const lockedIdSet = new Set(state.lockedListIds.map(normalizeItemId).filter(Boolean));

const clusters = state.clusterer && state.clusterer.getClusters
	? state.clusterer.getClusters()
	: (state.clusterer && state.clusterer._clusters) || [];

	if (state.selectionMode === "cluster") {

const clusterItems = (cluster.getMarkers ? cluster.getMarkers() : [])
			.map(marker => marker.__property)
			.filter(Boolean);

			if (!clusterItems.length) return false;
			return getClusterKeyFromItems(clusterItems) === state.selectedClusterKey;
		});

		return selectedClusterStillVisible;
	}

	if (state.selectedMarkerId != null) {

const targetId = normalizeItemId(state.selectedMarkerId);

const clusterItems = (cluster.getMarkers ? cluster.getMarkers() : [])
			.map(marker => marker.__property)
			.filter(Boolean);

			if (!clusterItems.length) return false;

const markerStillVisible = state.markers.some(marker => {

const item = marker && marker.__property;
			return item && normalizeItemId(item.id) === targetId;
		});

		if (markerStillVisible) {
			state.selectedClusterKey = null;
			return true;
		}
	}

	return false;
}

function getViewportFilteredItems(items)
{
	if (!state.map || !window.kakao || !kakao.maps) return items || [];

const bounds = state.map.getBounds();
	if (!bounds) return items || [];

	return (items || []).filter(item => {

const pos = new kakao.maps.LatLng(lat, lng);
		return bounds.contain(pos);
	});
}

function updateMapEmptyState(items)
{
	if (!mapEmptyState) return;
	mapEmptyState.classList.remove("open");
}

const idSet = new Set(recommendIds.map(normalizeItemId));
	return list.filter(item => item && idSet.has(normalizeItemId(item.id)));
}

const pool = getRecommendationPool(items);
	if (!pool.length) return null;

	if (state.selectedMarkerId != null) {

const selected = pool.find(item => normalizeItemId(item.id) === normalizeItemId(state.selectedMarkerId));
		if (selected) return selected;
	}

	if (pool.length === 1) return pool[0];

function renderRecommendAgentCard(agent)
{
	if (!mapAgentCard) return;
	mapAgentCard.style.display = "none";
	mapAgentCard.setAttribute("aria-hidden", "true");
	state.recommendAgent = null;
}

function refreshRecommendAgentCard()
{
	if (!mapAgentCard) return;
	if (state.isRecommendAgentDismissed) {
		renderRecommendAgentCard(null);
		return;
	}

function renderRecommendationCard(item)
{
	if (!mapRecommendCard) return;

	if (!item || state.isRecommendCardDismissed) {
		mapRecommendCard.style.display = "none";
		mapRecommendCard.onclick = null;
		mapRecommendCard.setAttribute("aria-hidden", "true");
		return;
	}

	state.recommendItem = item;
	mapRecommendCard.style.display = "block";
	mapRecommendCard.setAttribute("aria-hidden", "false");

	if (mapRecommendThumb) {
		mapRecommendThumb.style.backgroundImage = `url('${escapeHtml(item.image || "")}')`;
	}
	if (mapRecommendType) {
		mapRecommendType.textContent = getCardTypeBadgeLabel(item.type || "-");
	}
	if (mapRecommendDeal) {
		mapRecommendDeal.textContent = item.dealType || "매매";
	}
	if (mapRecommendPrice) {
		mapRecommendPrice.textContent = item.price || "-";
	}
	if (mapRecommendTitleText) {
		mapRecommendTitleText.textContent = item.title || "추천 매물";
	}
	if (mapRecommendAddress) {
		mapRecommendAddress.textContent = item.address || "-";
	}

	mapRecommendCard.onclick = async (e) => {
		if (e.target.closest(".map-recommend-close")) return;
		if (e.target.closest(".map-recommend-footer")) return;
		if (e.target.closest("label, input")) return;
		if (e.target.closest("a, button")) return;

function refreshRecommendationCard(items)
{
	if (!mapRecommendCard) return;
	if (state.isRecommendCardDismissed) {
		renderRecommendationCard(null);
		return;
	}

const poolKey = pool.map(item => normalizeItemId(item.id)).sort((a, b) => a.localeCompare(b)).join(",");

	if (!pool.length) {
		state.recommendItem = null;
		state.lastRecommendPoolKey = "";
		renderRecommendationCard(null);
		return;
	}

const sortedLockedItems = sortItems(lockedItems);
			renderList(sortedLockedItems);
			setResultInfo(`선택 매물 ${sortedLockedItems.length}건`);
			setListInfo(`총 ${sortedLockedItems.length}개 매물`);
			refreshRecommendAgentCard();
			refreshRecommendationCard(state.filtered);
			return sortedLockedItems;
		}

		clearListLock();
		state.selectedClusterKey = null;
		state.selectedMarkerId = null;
		state.selectionMode = null;
		updateMarkerSelection(null);

		setTimeout(() => {
			refreshClusterBadges();
		}, 0);
	}

const shouldPreserveList = sidebar.classList.contains("expanded")
	&& state.selectionMode === "single"
	&& state.selectedMarkerId != null
	&& viewportItems.length === 0
	&& Array.isArray(state.lastViewportListIds)
	&& state.lastViewportListIds.length > 0;

	if (shouldPreserveList) {

const preservedIdSet = new Set(state.lastViewportListIds.map(normalizeItemId));

const preservedItems = sortItems((state.filtered || []).filter(item => preservedIdSet.has(normalizeItemId(item.id))));
		if (preservedItems.length) {
			renderList(preservedItems);
			setResultInfo(`총 ${preservedItems.length}건`);
			setListInfo(`총 ${preservedItems.length}개 매물`);
			refreshRecommendAgentCard();
			refreshRecommendationCard(state.filtered);
			return preservedItems;
		}
	}

	renderList(viewportItems);
	setResultInfo(`총 ${viewportItems.length}건`);
	setListInfo(`총 ${viewportItems.length}개 매물`);
	if (viewportItems.length) {
		state.lastViewportListIds = viewportItems.map(item => normalizeItemId(item.id));
	}
	refreshRecommendAgentCard();
	refreshRecommendationCard(state.filtered);
	return viewportItems;
}

function openSidebarList()
{
	state.isListOpen = true;
	updateSidebarWidth();
	refreshMapLayout();
}

function closeSidebarList()
{
	state.isListOpen = false;
	updateSidebarWidth();
	refreshMapLayout();
}

function moveMapToDefaultCenter()
{
	if (!state.map || !window.kakao || !kakao.maps) return;

const defaultLatLng = new kakao.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng);
	state.map.setCenter(defaultLatLng);
	state.map.setLevel(DEFAULT_MAP_CENTER.level, { animate: false });
}

function applyInitialMapCenter()
{
	if (!state.map || !window.kakao || !kakao.maps) return Promise.resolve(false);
	moveMapToDefaultCenter();
	return Promise.resolve(false);
}

function refreshMapLayout()
{
	return;
}

const FEATURE_ALIAS_MAP = {
	"주차 가능": ["주차 가능", "주차가능", "주차", "parking"],
	"반려동물": ["반려동물", "반려동물 가능", "애완동물 가능"],
	"도시가스": ["도시가스", "lng"],
	"복층형": ["복층형", "복층", "duplex"],
	"베란다": ["베란다", "발코니", "balcony", "테라스", "veranda"],
	"엘리베이터": ["엘리베이터", "승강기", "elevator", "lift"],
	"풀옵션": ["풀옵션", "풀 옵션", "full option", "옵션 완비", "가전 가구 완비"],
	"즉시입주": ["즉시입주", "즉시 입주", "바로 입주", "즉시 가능"],
	"오션뷰": ["오션뷰", "오션 뷰", "바다뷰", "바다전망", "바다조망", "ocean view", "sea view"]
};

const token = normalizeFeatureToken(feature);
		if (!token) return;
		normalized.add(token);
	});

	Object.entries(FEATURE_ALIAS_MAP).forEach(([label, aliases]) => {

const aliasTokens = [label, ...(aliases || [])].map(normalizeFeatureToken).filter(Boolean);
		if (aliasTokens.some(token => normalized.has(token))) {
			aliasTokens.forEach(token => normalized.add(token));
			normalized.add(normalizeFeatureToken(label));
		}
	});

	return [...normalized];
}

const aliasTokens = [label, ...((FEATURE_ALIAS_MAP[label] || []))]
	.map(normalizeFeatureToken)
	.filter(Boolean);

const matches = [...text.matchAll(/([\d,.]+)\s*㎡/g)].map(match => {

function setResultInfo(text)
{
	if (mapResultCount) mapResultCount.textContent = text;
}

const res = await fetch("https://jeju-map.vercel.app/recommend.json", { cache: "no-store" });
		if (!res.ok) throw new Error(`recommend.json 불러오기 실패: ${res.status}`);

const rawIds = Array.isArray(data)
		? data
		: (Array.isArray(data?.ids) ? data.ids : []);

		recommendIds = rawIds
		.map(value => Number(value))
		.filter(value => Number.isFinite(value));

		recommendAgents = (Array.isArray(data?.agents) ? data.agents : [])
		.map(normalizeRecommendAgent)
		.filter(Boolean);
	} catch (err) {
		console.error("추천 데이터 불러오기 실패:", err);
		recommendIds = [];
		recommendAgents = [];
	}
}

async function loadProperties()
{
	try {
		const [resMain, resOneroom] = await Promise.all([
		fetch("https://jeju-map.vercel.app/properties.json", { cache: "no-store" }),
		fetch("https://jeju-map.vercel.app/properties_oneroom.json", { cache: "no-store" })
		]);
		if (!resMain.ok) throw new Error("properties.json 불러오기 실패");
		if (!resOneroom.ok) throw new Error("properties_oneroom.json 불러오기 실패");

		const [dataMain, dataOneroom] = await Promise.all([
		resMain.json(),
		resOneroom.json()
		]);

const remoteData = data.map((item) => ({
			...item,
			image: toRemotePath(item.image),
			desc_folder: toRemotePath(item.desc_folder),
			image_folder: toRemotePath(item.image_folder),
			agent_folder: toRemotePath(item.agent_folder)
		}));

const normalized = remoteData
		.map(normalizeProperty)
		.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));

const enriched = await Promise.all(
		normalized.map(async (item) => {

function createMarkerImage(item, isSelected = false, label = "1")
{

const svg = `
	<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
	<defs>
	<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
	<feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="rgba(0,0,0,0.28)"/>
	</filter>
	</defs>
	<g filter="url(#shadow)">
	<circle cx="${center}" cy="${center}" r="${radius}"
	fill="${bgColor}"
	stroke="${strokeColor}"
	stroke-width="${strokeWidth}"/>
	<text x="${center + textMetrics.xOffset}" y="${center + 1}"
	dominant-baseline="middle"
	text-anchor="middle"
	font-size="${fontSize}"
	font-weight="800"
	font-family="${UI_FONT_STACK}"
	text-rendering="geometricPrecision"
	fill="${textColor}"
	stroke="${textColor}"
	stroke-width="${textMetrics.strokeWidth}"
	paint-order="stroke fill"
	style="font-variant-numeric: tabular-nums; font-feature-settings: 'tnum' 1, 'lnum' 1; letter-spacing: ${textMetrics.letterSpacing};">${text}</text>
	</g>
	</svg>
	`;

	return new kakao.maps.MarkerImage(
	"data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
	new kakao.maps.Size(canvasSize, canvasSize),
	{ offset: new kakao.maps.Point(center, center) }
	);
}

function updateMarkerSelection(selectedId, selectedIds = null)
{
	state.selectedMarkerId = selectedId;
	state.selectedMarkerIds = new Set(Array.isArray(selectedIds) ? selectedIds.map(normalizeItemId) : (selectedId != null ? [normalizeItemId(selectedId)] : []));
	state.markers.forEach(marker => {

const item = marker.__property;

const isSelected = item && state.selectedMarkerIds.has(normalizeItemId(item.id));
		marker.setImage(createMarkerImage(item, isSelected, "1"));
	});
}

function getClusterKeyFromItems(items)
{
	return items.map(item => normalizeItemId(item.id)).sort((a, b) => a.localeCompare(b)).join(",");
}

const clusterMarker = cluster.getClusterMarker ? cluster.getClusterMarker() : null;
	if (!clusterMarker) return;

const clusterItems = cluster.getMarkers().map(marker => marker.__property).filter(Boolean);
	if (!clusterItems.length) return;

const suppressClusterBadgeMapEvent = function (e) {
		if (e) {
			if (typeof e.preventDefault === "function") e.preventDefault();
			if (typeof e.stopPropagation === "function") e.stopPropagation();
			if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
		}
		if (window.kakao && kakao.maps && kakao.maps.event && typeof kakao.maps.event.preventMap === "function") {
			kakao.maps.event.preventMap();
		}
	};

const triggerClusterListOnly = async function (e) {
		suppressClusterBadgeMapEvent(e);
		await handleClusterBadgeInteraction(cluster);
		return false;
	};

	el.addEventListener("pointerdown", suppressClusterBadgeMapEvent);
	el.addEventListener("pointerup", suppressClusterBadgeMapEvent);
	el.addEventListener("mousedown", suppressClusterBadgeMapEvent);
	el.addEventListener("mouseup", suppressClusterBadgeMapEvent);
	el.addEventListener("touchstart", suppressClusterBadgeMapEvent, { passive: false });
	el.addEventListener("touchend", suppressClusterBadgeMapEvent, { passive: false });
	el.addEventListener("click", triggerClusterListOnly, { passive: false });

	wrap.appendChild(el);
	clusterMarker.setContent(wrap);
}

function refreshClusterBadges()
{
	if (!state.clusterer) return;

const clusters = state.clusterer.getClusters ? state.clusterer.getClusters() : state.clusterer._clusters;
	if (!clusters || !clusters.length) return;

const selectedIdSet = state.selectedMarkerIds instanceof Set
	? state.selectedMarkerIds
	: new Set(Array.isArray(state.selectedMarkerIds) ? state.selectedMarkerIds.map(normalizeItemId) : []);

const lockedIdSet = Array.isArray(state.lockedListIds) && state.lockedListIds.length
	? new Set(state.lockedListIds.map(normalizeItemId).filter(Boolean))
	: null;

	clusters.forEach(cluster => {
		if (!cluster || typeof cluster.getClusterMarker !== "function") return;

const clusterItems = cluster.getMarkers().map(marker => marker.__property).filter(Boolean);
		if (!clusterItems.length) return;

const ids = clusterItems.map(item => normalizeItemId(item.id)).filter(Boolean);

const overlapsSelectedMarkers = ids.length > 0 && ids.some(id => selectedIdSet.has(id));

const isSelected = state.selectedClusterKey === key || overlapsSelectedMarkers || overlapsLockedSelection;
		setClusterBadgeSelected(cluster, isSelected);
	});
}

async function closeRoadviewPanel()
{
	try {
		if (document.fullscreenElement === roadviewOverlay) {
			await document.exitFullscreen();
		}
	} catch (err) {
		console.error("전체화면 해제 실패:", err);
	}

const mapWrap = document.querySelector(".map-wrap");
	if (roadviewOverlay) {
		roadviewOverlay.classList.remove("open");
	}
	if (mapWrap) {
		mapWrap.classList.remove("is-roadview-open");
	}
}

async function hideRoadview()
{
	await closeRoadviewPanel();
}

function resolveImageJsonPaths(item, payload)
{
	if (!payload || typeof payload !== "object") return payload || {};
	return {
		...payload,
		image: resolveRelativeImagePath(item, payload.image || ""),
		images: Array.isArray(payload.images)
		? payload.images.map((img) => resolveRelativeImagePath(item, img)).filter(Boolean)
		: []
	};
}

const imageList = Array.isArray(imageData.images)
	? imageData.images.map(v => toRemotePath(String(v || "").trim())).filter(Boolean)
	: [];

const cleaned = item.images
	.map(v => String(v || "").trim())
	.filter(Boolean);

	if (!cleaned.length) return fallback;

	return cleaned;
}

const lockedCenter = state.map.getCenter();

const lockedLevel = state.map.getLevel();
	state.suppressClusterMapMove = true;

const restoreMapViewport = () =>
	{
		if (!state.map || !lockedCenter || lockedLevel == null) return;
		state.map.setLevel(lockedLevel, { animate: false, __allowClusterRestore: true });
		state.map.setCenter(lockedCenter, { __allowClusterRestore: true });
	};

	try {
		await handleClusterSelection(cluster);
		restoreMapViewport();
		setTimeout(restoreMapViewport, 0);
		setTimeout(restoreMapViewport, 60);
		setTimeout(restoreMapViewport, 120);
		setTimeout(restoreMapViewport, 240);
		setTimeout(restoreMapViewport, 420);
	} finally {
		setTimeout(() => {
			state.suppressClusterMapMove = false;
			isClusterClicking = false;
		}, 480);
	}
}

const clusterItems = (cluster && cluster.getMarkers ? cluster.getMarkers() : [])
	.map(marker => marker.__property)
	.filter(Boolean);
	if (!clusterItems.length) return;

const item = sortedClusterItems[0];
			highlightCard(item.id);
			updateMarkerSelection(item.id, [normalizeItemId(item.id)]);
			setResultInfo("선택 매물 1건");
			setListInfo("총 1개 매물");
		} else {
			updateMarkerSelection(null, sortedClusterItems.map(v => v.id));
			setResultInfo(`선택 매물 ${sortedClusterItems.length}건`);
			setListInfo(`총 ${sortedClusterItems.length}개 매물`);
			setClusterBadgeSelected(cluster, true);
		}

		refreshClusterBadges();
	}, 0);
}

function initMap()
{
	state.map = new kakao.maps.Map(document.getElementById("map"), {
		center: new kakao.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng),
		level: DEFAULT_MAP_CENTER.level
	});

	state.suppressClusterMapMove = false;

const __originalMapSetCenter = state.map.setCenter.bind(state.map);
	state.map.setCenter = function(latlng, opts) {
		if (state.suppressClusterMapMove && !(opts && opts.__allowClusterRestore)) return;
		return __originalMapSetCenter(latlng);
	};

const __originalMapPanTo = state.map.panTo.bind(state.map);
	state.map.panTo = function(latlng, padding, opts) {
		if (state.suppressClusterMapMove) return;
		return __originalMapPanTo(latlng, padding, opts);
	};

const __originalMapSetLevel = state.map.setLevel.bind(state.map);
	state.map.setLevel = function(level, opts) {
		if (state.suppressClusterMapMove && !(opts && opts.__allowClusterRestore)) return;
		if (opts && opts.__allowClusterRestore) {

const nextOpts = Object.assign({}, opts);
			delete nextOpts.__allowClusterRestore;
			return __originalMapSetLevel(level, nextOpts);
		}
		return __originalMapSetLevel(level, opts);
	};

	state.map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);

	state.clusterer = new kakao.maps.MarkerClusterer({
		map: state.map,
		averageCenter: true,
		minLevel: 3,
		disableClickZoom: true,
		clickable: false,
		calculator: [5, 10, 20, 50],
		styles: [
		{
			width: "54px",
			height: "54px",
			background: hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA),
			color: "#ffffff",
			borderRadius: "50%",
			border: "0",
			boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
			textAlign: "center",
			fontWeight: "900",
			fontSize: "20px",
			lineHeight: "54px"
		},
		{
			width: "54px",
			height: "54px",
			background: hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA),
			color: "#ffffff",
			borderRadius: "50%",
			border: "0",
			boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
			textAlign: "center",
			fontWeight: "900",
			fontSize: "20px",
			lineHeight: "54px"
		},
		{
			width: "54px",
			height: "54px",
			background: hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA),
			color: "#ffffff",
			borderRadius: "50%",
			border: "0",
			boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
			textAlign: "center",
			fontWeight: "900",
			fontSize: "20px",
			lineHeight: "54px"
		},
		{
			width: "54px",
			height: "54px",
			background: hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA),
			color: "#ffffff",
			borderRadius: "50%",
			border: "0",
			boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
			textAlign: "center",
			fontWeight: "900",
			fontSize: "20px",
			lineHeight: "54px"
		}
		]
	});

const viewportItems = refreshViewportList();
		updateMapEmptyState(viewportItems);

		setTimeout(() => {
			refreshClusterBadges();
		}, 0);
	});

	kakao.maps.event.addListener(state.map, "idle", () => {
		if (!state.filtered) return;
		renderMarkers(state.filtered, { preserveViewport: true });

const viewportItems = refreshViewportList();
		updateMapEmptyState(viewportItems);
	});
}

function initRoadview()
{
	roadviewClient = new kakao.maps.RoadviewClient();

const roadviewContainer = document.createElement("div");
	roadviewContainer.id = "roadviewPanel";
	roadviewContainer.className = "roadview-overlay";

const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.className = "roadview-close-btn";
	closeBtn.setAttribute("aria-label", "로드뷰 닫기");
	closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

const fullscreenBtn = document.createElement("button");
	fullscreenBtn.type = "button";
	fullscreenBtn.className = "roadview-fullscreen-btn";
	fullscreenBtn.textContent = "전체화면";

const inner = document.createElement("div");
	inner.id = "roadviewInner";
	inner.className = "roadview-inner";

	closeBtn.addEventListener("click", async () => {
		await closeRoadviewPanel();
	});

	fullscreenBtn.addEventListener("click", async () => {
		try {
			if (!document.fullscreenElement) {
				await roadviewContainer.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (err) {
			console.error("전체화면 전환 실패:", err);
		}
	});

	document.addEventListener("fullscreenchange", () => {
		if (!roadviewFullscreenBtn) return;
		roadviewFullscreenBtn.textContent =
		document.fullscreenElement === roadviewOverlay ? "전체화면 해제" : "전체화면";
	});

	roadviewContainer.appendChild(closeBtn);
	roadviewContainer.appendChild(fullscreenBtn);
	roadviewContainer.appendChild(inner);
	document.querySelector(".map-wrap").appendChild(roadviewContainer);

	roadview = new kakao.maps.Roadview(inner);
	roadviewOverlay = roadviewContainer;
	roadviewFullscreenBtn = fullscreenBtn;
}

function showRoadview(lat, lng)
{
	if (!roadviewClient || !roadviewOverlay || !roadview) {
		alert("로드뷰가 초기화되지 않았습니다.");
		return;
	}

const position = new kakao.maps.LatLng(lat, lng);

const mapWrap = document.querySelector(".map-wrap");

	roadviewClient.getNearestPanoId(position, 100, function (panoId) {
		if (!panoId) {
			alert("이 위치 주변에는 로드뷰가 없습니다.");
			return;
		}

		if (mapWrap) {
			mapWrap.classList.add("is-roadview-open");
		}
		roadviewOverlay.classList.add("open");
		roadview.setPanoId(panoId, position);
		setTimeout(() => {
			if (roadview && typeof roadview.relayout === "function") {
				roadview.relayout();
			}
		}, 30);
	});
}

function clearMapObjects()
{
	if (state.clusterer) {
		state.clusterer.clear();
	}

	state.markers.forEach(marker => marker.setMap(null));
	state.markers = [];
}

function renderMarkers(data, options = {})
{
	clearMapObjects();

const markerItems = preserveViewport ? getViewportFilteredItems(data) : (data || []);
	if (!markerItems.length) return;

const bounds = new kakao.maps.LatLngBounds();

const markerList = [];

	markerItems.forEach(item => {

const position = new kakao.maps.LatLng(item.lat, item.lng);

const item = state.filtered.find(v => v.id === id) || state.all.find(v => v.id === id);
	if (!item || !state.map) return;

	await hideRoadview();

	state.selectionMode = "single";
	state.selectedClusterKey = null;
	updateMarkerSelection(id, [normalizeItemId(id)]);

	highlightCard(id);

	setTimeout(() => {
		refreshClusterBadges();
	}, 0);
}

function renderList(data)
{
	if (!data.length) {
		propertyList.innerHTML = `
		<div class="card" style="padding:18px; cursor:default; border-bottom:0;">
		<div class="card-body" style="padding:0; text-align:left;">
		<div class="map-empty-state-desc">
		<div class="empty-title">조건에 맞는 매물이 없습니다.</div>
		<div class="empty-sub">지도를 이동 하거나 필터를 변경해 보세요.</div>
		</div>
		</div>
		</div>
		`;
		return;
	}

	propertyList.innerHTML = data.map(item => {

function syncLeftAllButtonToMapFilters()
{

const okOceanView = !selectedOceanViewOnly || hasOceanView;
		return okKeyword && okDeal && okType && okDealMethod && okFeature && okPet && okParking && okCityGas && okDuplex && okVeranda && okElevator && okFullOption && okImmediateMoveIn && okOceanView;
	});

	state.selectedMarkerId = null;
	state.selectedClusterKey = null;
	state.selectionMode = null;
	clearListLock();

function focusMapByAddress(lat, lng, label = "")
{
	if (!state.map || !window.kakao || !kakao.maps) return;

const latLng = new kakao.maps.LatLng(Number(lat), Number(lng));
	state.map.setLevel(4, { animate: { duration: 220 } });
	state.map.panTo(latLng);
	if (!addressSearchMarker) {
		addressSearchMarker = new kakao.maps.Marker({
			map: state.map,
			position: latLng,
			zIndex: 20
		});
	} else {
		addressSearchMarker.setPosition(latLng);
		addressSearchMarker.setMap(state.map);
	}
	setAddressSearchStatus(label ? `${label} 위치로 이동했습니다.` : "검색 위치로 이동했습니다.");
}

function searchAddressByGeocoder(geocoder, query)
{
	return new Promise(resolve => {
		geocoder.addressSearch(query, (result, status) => {
			if (status === kakao.maps.services.Status.OK && Array.isArray(result) && result.length) {
				resolve(result[0]);
				return;
			}
			resolve(null);
		});
	});
}

function searchAddressByKeyword(places, query)
{
	return new Promise(resolve => {
		places.keywordSearch(query, (result, status) => {
			if (status === kakao.maps.services.Status.OK && Array.isArray(result) && result.length) {
				resolve(result[0]);
				return;
			}
			resolve(null);
		});
	});
}

const query = String(subAddressSearchInput?.value || "").trim();
	if (!query) {
		setAddressSearchStatus("검색할 주소지를 입력하세요.", true);
		if (subAddressSearchInput) subAddressSearchInput.focus();
		return;
	}
	if (!window.kakao || !kakao.maps || !kakao.maps.services) {
		setAddressSearchStatus("주소 검색 서비스를 불러오지 못했습니다.", true);
		return;
	}
	setAddressSearchStatus("주소를 검색하는 중입니다.");

const geocoder = new kakao.maps.services.Geocoder();

const places = new kakao.maps.services.Places();

const found = await searchAddressByGeocoder(geocoder, q);
		if (found) {
			focusMapByAddress(found.y, found.x, found.address_name || query);
			return;
		}
	}

	for (const q of queries) {

const found = await searchAddressByKeyword(places, q);
		if (found) {
			focusMapByAddress(found.y, found.x, found.place_name || found.address_name || query);
			return;
		}
	}

	setAddressSearchStatus("검색 결과가 없습니다.", true);
}

const hideToday = !!(mapAgentHideTodayCheck && mapAgentHideTodayCheck.checked);
			state.isRecommendAgentDismissed = true;
			if (hideToday) {
				localStorage.setItem(RECOMMEND_AGENT_HIDE_KEY, String(getHideUntilEndOfToday()));
			} else {
				localStorage.removeItem(RECOMMEND_AGENT_HIDE_KEY);
			}
			state.recommendAgent = null;
			renderRecommendAgentCard(null);
		});
	}

	if (mapRecommendCloseBtn) {
		mapRecommendCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

const value = input.dataset.value || "";

			if (value === "전체" || value === "all") {
				selectedDeal.clear();
			} else {
				if (input.checked) {
					selectedDeal.add(value);
				} else {
					selectedDeal.delete(value);
				}
			}

			syncDealFilterUI();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	});

	if (dealFilterResetBtn) {
		dealFilterResetBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			selectedDeal.clear();
			syncDealFilterUI();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	}

	typeButtons.forEach(input => {
		input.addEventListener("change", () => {

const value = input.dataset.value || "";

			if (value === "전체" || value === "all") {
				selectedType.clear();
			} else {
				if (input.checked) {
					selectedType.add(value);
				} else {
					selectedType.delete(value);
				}
			}

			syncTypeFilterUI();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	});

	if (typeFilterResetBtn) {
		typeFilterResetBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			selectedType.clear();
			syncTypeFilterUI();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	}

	syncDealFilterUI();
	syncTypeFilterUI();
	syncDealMethodFilterUI();
	syncExtraFilterUI();

	(featureButtons || []).forEach(btn => {
		btn.addEventListener("click", () => {

function moveMapToCurrentLocation()
{
	if (!state.map || !window.kakao || !kakao.maps) return;
	if (!navigator.geolocation) {
		alert("이 브라우저에서는 현위치를 사용할 수 없습니다.");
		return;
	}

	navigator.geolocation.getCurrentPosition(
	(position) => {
		if (!state.map) return;

const lat = Number(position.coords && position.coords.latitude);

const lng = Number(position.coords && position.coords.longitude);

		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			alert("현위치를 가져오지 못했습니다.");
			return;
		}

const currentLatLng = new kakao.maps.LatLng(lat, lng);
		state.map.setCenter(currentLatLng);
		state.map.setLevel(GEOLOCATION_MAP_LEVEL, { animate: { duration: 300 } });
	},
	() => {
		alert("현위치를 가져오지 못했습니다. 브라우저 위치 권한을 확인해 주세요.");
	},
	{
		enableHighAccuracy: false,
		timeout: 8000,
		maximumAge: 0
	}
	);
}

const currentLocationBtn = document.getElementById("currentLocationBtn");
	if (!zoomInBtn || !zoomOutBtn || !currentLocationBtn) return;

	zoomInBtn.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (!state.map) return;

const nextLevel = Math.max(1, state.map.getLevel() - 1);
		state.map.setLevel(nextLevel, { animate: { duration: 300 } });
	});

	zoomOutBtn.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (!state.map) return;
		state.map.setLevel(state.map.getLevel() + 1, { animate: { duration: 300 } });
	});

	currentLocationBtn.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		moveMapToCurrentLocation();
	});
}

const removeTargets = listData
						.map(item => item && item.name ? `${userId}/${item.name}` : "")
						.filter(path => path && path !== savedPath && /^.+\/profile-/i.test(path));
					if (removeTargets.length) {
						const { error: removeError } = await bucket.remove(removeTargets);
						if (removeError) console.warn("이전 프로필 사진 삭제 실패:", removeError);
					}
				} else if (listError) {
					console.warn("이전 프로필 사진 목록 조회 실패:", listError);
				}
			} catch (cleanupErr) {
				console.warn("이전 프로필 사진 정리 오류:", cleanupErr);
			}

			const { data: urlData } = bucket.getPublicUrl(savedPath);
			return urlData && urlData.publicUrl ? urlData.publicUrl : (authProfilePhotoUrl || "");
		} catch (err) {
			console.warn("프로필 사진 업로드 오류:", err);
			return authProfilePhotoUrl || "";
		}
	}

	if (typeof window !== "undefined") {

const query = String(address || "").trim();
		if (!query) return;
		if (!window.kakao || !kakao.maps || !kakao.maps.services) {
			openAuthErrorModal("지도 주소 검색 서비스를 불러오지 못했습니다.", "주소 검색", null);
			return;
		}

const geocoder = new kakao.maps.services.Geocoder();

const places = new kakao.maps.services.Places();

const found = await new Promise(resolve => {
				geocoder.addressSearch(q, (result, status) => {
					if (status === kakao.maps.services.Status.OK && Array.isArray(result) && result.length) {
						resolve(result[0]);
						return;
					}
					resolve(null);
				});
			});
			if (found) {
				if (typeof focusMapByAddress === "function") {
					focusMapByAddress(found.y, found.x, found.address_name || query);
				}
				return;
			}
		}

		for (const q of queries) {

const defaultRadioValues = {
			propertyAddressLocationMode: "marker",
			propertyLoan: "check",
			propertyPet: "check",
			maintenanceElectricType: "usage",
			maintenanceWaterType: "usage",
			maintenanceGasType: "usage",
			maintenanceHeatingType: "usage",
			maintenanceInternetType: "usage",
			maintenanceTvType: "usage",
			maintenanceEtcType: "none"
		};

		return Array.from(page.querySelectorAll("input[type='checkbox'], input[type='radio']")).some((input) => {
			if (!input.checked) return false;
			if (input.closest(".property-registrant-card")) return false;
			if (input.type === "radio" && defaultRadioValues[input.name] === input.value) return false;
			return true;
		});
	}

const addressMode = document.querySelector('input[name="propertyAddressLocationMode"][value="marker"]');
		if (addressMode) addressMode.checked = true;
		// PATCH 2.262: 새 글 시작 초기화에는 주소 지도/좌표/마커 상태까지 포함
		if (typeof window.realjejuResetPropertyAddressLocation === "function") window.realjejuResetPropertyAddressLocation();

const checked = Array.from(document.querySelectorAll(".property-deal-check:checked")).map((input) => input.value);
		box.innerHTML = checked.map(getPropertyPriceFieldHtml).join("");
		bindPropertyMoneyCommaInputs(box);
		restorePropertyPriceValues(previousValues);
	}

window.realjejuPropertyPhotoFiles = propertyPhotoPreviewState.items
			.filter((photo) => photo && photo.file)
			.map((photo) => photo.file);

window.realjejuExistingPropertyPhotos = propertyPhotoPreviewState.items
			.filter((photo) => photo && photo.existingPhoto && !photo.file)
			.map((photo, index) => ({
				...photo.existingPhoto,
				order: index + 1
			}));
	}

const deals = Array.from(document.querySelectorAll(".property-deal-check")).map((input) => {

const deletedAt = payload.deleted_at ? new Date(payload.deleted_at).getTime() : NaN;
				return Number.isFinite(deletedAt) && deletedAt <= deadline;
			})
			.map((row) => row.id)
			.filter(Boolean);
		if (!expiredIds.length) return false;

		const { error } = await client
			.from("property_listings")
			.delete()
			.in("id", expiredIds)
			.eq("user_id", userId);
		if (error) {
			console.warn("휴지통 만료 매물 삭제 실패:", error);
			return false;
		}
		return true;
	}

function checkedValues(selector)
	{
		return Array.from(document.querySelectorAll(selector))
			.filter((input) => input.checked)
			.map((input) => input.value);
	}

const row = getRequiredFieldRow(label);
			if (!row || seenRows.has(row) || !isVisibleRequiredElement(row)) return;
			seenRows.add(row);
			if (hasRequiredFieldValue(row)) return;
			missing.push({
				label: getRequiredLabelText(label),
				target: getRequiredFieldTarget(row)
			});
		});
		if (!missing.length) return null;
		return {
			message: "필수 입력 항목이 비어 있습니다.\n[항목]\n" + missing.map((item) => item.label).join("\n"),
			target: missing[0].target
		};
	}

const isVisible = (el) => !!(el && el.offsetParent !== null && getComputedStyle(el).display !== "none" && !el.closest(".is-hidden"));
			if (isVisible(loanRow) && !radioValue("propertyLoan")) {
				missingCheckedItems.push({ label: "대출*", target: document.querySelector('input[name="propertyLoan"]') });
			}
			if (isVisible(parkingRow) && !radioValue("propertyParking")) {
				missingCheckedItems.push({ label: "주차*", target: document.querySelector('input[name="propertyParking"]') });
			}
			if (missingCheckedItems.length) {
				return {
					message: "체크하지 않은 항목이 있습니다.\n[항목]\n" + missingCheckedItems.map((item) => item.label).join("\n"),
					target: missingCheckedItems[0].target
				};
			}
		}
		return null;
	}

function parseCrossroadFieldMap(text)
	{

const fields = parseCrossroadFieldMap(value);
		// PATCH 2.237: 교차로 간편등록 면적은 처음 5개 유효 줄만 기준으로 판정

const firstLines = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5).join("\n");

const firstFiveRows = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5);

const headlineDealMap = { "매매": "sale", "전세": "jeonse", "월세": "monthly", "년세": "yearly" };
			if (headlineDealMap[headlineDeal]) dealTypes.push(headlineDealMap[headlineDeal]);
		} else {
			if (getFirstMatch(value, /매매가\s*[:：]?\s*([^\n]+)/)) dealTypes.push("sale");
			if (fieldValue(fields, ["전세금"])) dealTypes.push("jeonse");
			if (fieldValue(fields, ["월세금"])) dealTypes.push("monthly");
			if (fieldValue(fields, ["년세금"]) || fieldValue(fields, ["연세금"])) dealTypes.push("yearly");
		}

const locationMapEl = document.getElementById("propertyAddressLocationMap");

let addressLocationMap = null;

let addressLocationMarker = null;

function markQuickAddressFallbackMap()
	{
		if (locationHelp) locationHelp.textContent = "주소 좌표를 찾지 못했습니다. 위치 직접검색으로 지도를 이동해 주세요.";
	}

function getAddressLocationMode(){
		return locationModeRadios.find(radio => radio.checked)?.value || "marker";
	}

function createKakaoBounds(bounds){
		if (!bounds || !window.kakao || !kakao.maps) return null;
		return new kakao.maps.LatLngBounds(
			new kakao.maps.LatLng(bounds.swLat, bounds.swLng),
			new kakao.maps.LatLng(bounds.neLat, bounds.neLng)
		);
	}

function moveAddressRectangleByDelta(latDiff, lngDiff){
		if (!addressLocationBounds || !window.kakao || !kakao.maps) return;
		addressLocationBounds = {
			swLat: addressLocationBounds.swLat + latDiff,
			swLng: addressLocationBounds.swLng + lngDiff,
			neLat: addressLocationBounds.neLat + latDiff,
			neLng: addressLocationBounds.neLng + lngDiff
		};

const centerLng = (addressLocationBounds.swLng + addressLocationBounds.neLng) / 2;
		addressLocationCenter = new kakao.maps.LatLng(centerLat, centerLng);
		selectedAddress.lat = centerLat;
		selectedAddress.lng = centerLng;
		if (addressInput) {
			addressInput.dataset.lat = centerLat;
			addressInput.dataset.lng = centerLng;
		}
		addressLocationRectangle?.setBounds(createKakaoBounds(addressLocationBounds));
		setAddressLocationDataset(getAddressLocationMode());
	}

function startAddressRectangleDrag(latLng){
		if (getAddressLocationMode() !== "rectangle" || !isLatLngInsideAddressBounds(latLng)) return;
		isAddressRectangleDragging = true;
		addressRectangleDragStartLatLng = latLng;
		addressLocationMap?.setDraggable(false);
	}

function updateAddressRectangle(center){
		if (!addressLocationMap || !center || !window.kakao || !kakao.maps) return;
		addressLocationBounds = getRectangleBoundsFromCenter(center);

function renderAddressLocationMap(){
		if (!selectedAddress || !locationRow || !locationMapEl || !window.kakao || !kakao.maps) return;

const lng = Number(selectedAddress.lng);
		if (!lat || !lng) return;
		locationRow.classList.add("open");
		locationRow.setAttribute("aria-hidden", "false");
		addressLocationCenter = new kakao.maps.LatLng(lat, lng);
		if (!addressLocationMap) {
			addressLocationMap = new kakao.maps.Map(locationMapEl, {
				center: addressLocationCenter,
				level: 3
			});
			addressLocationMarker = new kakao.maps.Marker({
				position: addressLocationCenter,
				draggable: true
			});
			kakao.maps.event.addListener(addressLocationMarker, "dragend", () => {
				addressLocationCenter = addressLocationMarker.getPosition();
				selectedAddress.lat = addressLocationCenter.getLat();
				selectedAddress.lng = addressLocationCenter.getLng();
				if (addressInput) {
					addressInput.dataset.lat = selectedAddress.lat;
					addressInput.dataset.lng = selectedAddress.lng;
				}
				setAddressLocationDataset(getAddressLocationMode());
			});
			kakao.maps.event.addListener(addressLocationMap, "mousedown", (mouseEvent) => {
				startAddressRectangleDrag(mouseEvent.latLng);
			});
			kakao.maps.event.addListener(addressLocationMap, "mousemove", (mouseEvent) => {
				if (!isAddressRectangleDragging || !addressRectangleDragStartLatLng) return;

const lngDiff = mouseEvent.latLng.getLng() - addressRectangleDragStartLatLng.getLng();
				moveAddressRectangleByDelta(latDiff, lngDiff);
				addressRectangleDragStartLatLng = mouseEvent.latLng;
			});
		} else {
			addressLocationMap.setCenter(addressLocationCenter);
			addressLocationMarker.setPosition(addressLocationCenter);
			setTimeout(() => addressLocationMap.relayout(), 0);
		}
		setTimeout(() => {
			addressLocationMap.relayout();
			addressLocationMap.setCenter(addressLocationCenter);
			applyAddressLocationMode();
		}, 40);
	}

const mode = getAddressLocationMode();
		locationRow?.setAttribute("data-location-mode", mode);
		if (!addressLocationMap || !addressLocationCenter) return;
		if (mode === "marker") {
			addressLocationMarker?.setMap(addressLocationMap);
			addressLocationRectangle?.setMap(null);
			if (locationHelp) locationHelp.textContent = "지도상에 표시된 포인트를 원하는 위치로 끌어다 놓으세요.";
		}
		else if (mode === "rectangle") {
			addressLocationMarker?.setMap(null);
			updateAddressRectangle(addressLocationCenter);
			if (locationHelp) locationHelp.textContent = "지도상에 표시된 사각형을 원하는 지역으로 끌어다 놓으세요.";
		}
		else {
			addressLocationMarker?.setMap(null);
			addressLocationRectangle?.setMap(null);
			if (locationHelp) locationHelp.textContent = "지도 위치를 공개하지 않습니다.";
		}
		setAddressLocationDataset(mode);
	}

function searchAddressByGeocoder(query){
		return new Promise(resolve => {
			if (!window.kakao || !kakao.maps || !kakao.maps.services) {
				resolve([]);
				return;
			}

const geocoder = new kakao.maps.services.Geocoder();
			geocoder.addressSearch(query, (result, status) => {
				if (status === kakao.maps.services.Status.OK && Array.isArray(result)) {
					console.info("[REALJEJU 주소검색][Geocoder]", query, status, result.length);
					resolve(result);
				} else {
					console.info("[REALJEJU 주소검색][Geocoder]", query, status);
					resolve([]);
				}
			});
		});
	}

function searchAddressByKeyword(query){
		return new Promise(resolve => {
			if (!window.kakao || !kakao.maps || !kakao.maps.services) {
				resolve([]);
				return;
			}

const places = new kakao.maps.services.Places();
			places.keywordSearch(query, (result, status) => {
				if (status === kakao.maps.services.Status.OK && Array.isArray(result)) {
					console.info("[REALJEJU 주소검색][Places]", query, status, result.length);
					resolve(result);
				} else {
					console.info("[REALJEJU 주소검색][Places]", query, status);
					resolve([]);
				}
			}, { size: 10 });
		});
	}

const query = String(locationDirectSearchInput?.value || "").trim();
		if (!query || !window.kakao || !kakao.maps || !kakao.maps.services) return;

const list = await searchAddressByKeyword(q);
				if (list.length) {
					found = normalizeAddressResult(list[0]);
					break;
				}
			}
		}
		if (!found || !found.lat || !found.lng || !addressLocationMap || !window.kakao || !kakao.maps) return;

const nextCenter = new kakao.maps.LatLng(Number(found.lat), Number(found.lng));
		addressLocationCenter = nextCenter;
		selectedAddress.lat = found.lat;
		selectedAddress.lng = found.lng;
		if (addressInput) {
			addressInput.dataset.lat = found.lat;
			addressInput.dataset.lng = found.lng;
		}
		addressLocationMap.setCenter(nextCenter);

const mode = getAddressLocationMode();
		if (mode === "marker") {
			addressLocationMarker?.setPosition(nextCenter);
		}
		else if (mode === "rectangle") {
			updateAddressRectangle(nextCenter);
		}
		setAddressLocationDataset(mode);
	}

async function applyQuickAddressToLocationMap(query){

const value = String(query || "").trim();
		if (!value) return false;
		selectedAddress = {
			roadAddress: "",
			jibunAddress: value,
			zonecode: "",
			lat: quickAddressFallbackCenter.lat,
			lng: quickAddressFallbackCenter.lng,
			isFallbackCenter: true
		};
		applyAddressInputDataset(selectedAddress);
		if (window.kakao && kakao.maps) {
			renderAddressLocationMap();
			markQuickAddressFallbackMap();
		}
		if (!window.kakao || !kakao.maps || !kakao.maps.services) return false;

const list = await searchAddressByKeyword(q);
				if (list.length) {
					found = normalizeAddressResult(list[0]);
					break;
				}
			}
		}
		if (!found || !found.lat || !found.lng) return false;

		selectedAddress = found;
		applyAddressInputDataset(selectedAddress);
		renderAddressLocationMap();

const mode = data.locationDisplayType || data.location_display_type || "marker";

window.realjejuApplyQuickAddressToLocationMap = applyQuickAddressToLocationMap;
