// REALJEJU app.js - split from realjeju_2.361(3).html

const globalBrandLink = document.querySelector('.global-brand');
if (globalBrandLink) {
	globalBrandLink.addEventListener('click', () => {
		window.location.href = "https://realjeju.app";
	});
}

const update = () => {
		if (textarea.value.length > 5000) textarea.value = textarea.value.slice(0, 5000);
		counter.textContent = textarea.value.length + "/5000";
	};

	textarea.addEventListener("input", update);
	update();
})();

const update = () => {
		if (textarea.value.length > 800) textarea.value = textarea.value.slice(0, 800);
		counter.textContent = textarea.value.length + "/800";
	};

	textarea.addEventListener("input", update);
	update();
})();

const chk = document.getElementById("registrantLicensedAgentChk");

const input = document.getElementById("registrantManagerNameInput");
	if (!chk || !input) return;

function toggle()
	{
		if (chk.checked)
		{
			input.disabled = false;
		}
		else
		{
			input.value = "";
			input.disabled = true;
		}
	}

	chk.addEventListener("change", toggle);
	toggle();
})();

const UI_FONT_STACK = 'Inter, Pretendard, Noto Sans KR, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif';

//const BADGE_BASE_HEX = '#3B82F6'; // 제주코발트블루

const BADGE_BASE_HEX = '#3B82F6';
document.documentElement.style.setProperty('--brand', BADGE_BASE_HEX);

const BADGE_BASE_ALPHA = 0.9; // 0.8, 0.6, 0.3 등으로 사용자가 직접 조정

function hexToRgba(hex, alpha = 1)
{

const value = String(hex || '').replace('#', '').trim();

const r = parseInt(normalized.slice(0, 2), 16);

const g = parseInt(normalized.slice(2, 4), 16);

const b = parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const APP_NAME = "REALJEJU.APP";

const APP_VERSION = "2.358";

function applyAppVersion()
{
	document.title = APP_NAME;

const ogTitleMeta = document.getElementById("ogTitleMeta");
	if (ogTitleMeta) ogTitleMeta.setAttribute("content", APP_NAME);

const ogDescriptionMeta = document.getElementById("ogDescriptionMeta");
	if (ogDescriptionMeta) ogDescriptionMeta.setAttribute("content", APP_NAME);
}

applyAppVersion();

const normalizedId = normalizeItemId(id);

const nextUrl = `${url.pathname}${url.search}${url.hash}`;

const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	if (nextUrl === currentUrl) return;

const method = replace ? "replaceState" : "pushState";
	window.history[method]({}, "", nextUrl);
}

function normalizeItemId(value)
{
	if (value == null) return "";
	return String(value).trim();
}

function getViewCountKey(value)
{
	return String(value || "").trim();
}

function getItemViewKey(item)
{
	if (!item || typeof item !== "object") return "";
	return getViewCountKey(item.id || item.listingNo || "");
}

function getViewCountText(viewKey)
{

function updateViewCountElements(viewKey, count)
{

const key = getViewCountKey(viewKey);
	if (!key) return;
	document.querySelectorAll(`.card-date[data-view-key="${key}"]`).forEach(el => {
		el.textContent = `조회 ${Number.isFinite(Number(count)) ? Number(count) : 0}`;
	});
}

function shouldUseListViewCounts()
{
	return !!(state && state.isListOpen && !document.body.classList.contains("sidebar-list-collapsed"));
}

async function fetchViewCounts(items)
{
	if (!shouldUseListViewCounts()) return {};

const res = await fetch(`/api/views?ids=${encodeURIComponent(ids.join(","))}`);
		if (!res.ok) return {};

const json = await res.json();
		return json && typeof json.items === "object" ? (json.items || {}) : {};
	} catch (err) {
		return {};
	}
}

async function refreshCardViewCounts(items)
{
	if (!shouldUseListViewCounts()) return;

const renderSeq = ++state.viewRenderSeq;

async function incrementViewCount(viewKey)
{
	if (!shouldUseListViewCounts()) return null;

const key = getViewCountKey(viewKey);
	if (!key) return null;
	try {

const json = await res.json().catch(() => ({}));
		if (!res.ok) {
			return null;
		}

let recommendIds = [];

let recommendAgents = [];

function toRemotePath(path)
{
	if (!path || typeof path !== "string") return path || "";
	if (/^https?:\/\//i.test(path)) return path;
	return new URL(path.replace(/^\.\//, ""), REMOTE_BASE).toString();
}

let selectedDeal = new Set();

let selectedType = new Set();

let selectedDealMethod = "all";

let selectedPetOnly = false;

let selectedParkingOnly = false;

let selectedCityGasOnly = false;

let selectedDuplexOnly = false;

let selectedVerandaOnly = false;

let selectedElevatorOnly = false;

let selectedFullOptionOnly = false;

let selectedImmediateMoveInOnly = false;

let selectedOceanViewOnly = false;

let agentCache = {};

let agentPromiseCache = {};

const infoCache = {};

const imageCache = {};

let currentHeroImages = [];

let currentHeroIndex = 0;

let globalAreaUnit = "m2";

let isClusterClicking = false;

let addressSearchStatusTimer = null;

const sidebar = document.getElementById("sidebar");

const propertyList = document.getElementById("propertyList");

const sidebarListPanel = document.querySelector(".sidebar-list-panel");

const keywordInput = document.getElementById("keyword");

const subAddressSearchForm = document.getElementById("subAddressSearchForm");

const subAddressSearchInput = document.getElementById("subAddressSearchInput");

const subAddressSearchStatus = document.getElementById("subAddressSearchStatus");

const areaUnitPyBtn = document.getElementById("areaUnitPyBtn");

const areaUnitM2Btn = document.getElementById("areaUnitM2Btn");

const RECOMMEND_AGENT_HIDE_KEY = "realjeju_hide_recommend_agent_until";

const RECOMMEND_ITEM_HIDE_KEY = "realjeju_hide_recommend_item_until";

function getHideUntilEndOfToday()
{

const end = new Date();
	end.setHours(24, 0, 0, 0);
	return end.getTime();
}

function isHideUntilActive(key)
{

const dealButtons = document.querySelectorAll("#dealButtons input");

const dealFilterDropdown = document.getElementById("dealFilterDropdown");

const dealFilterTrigger = document.getElementById("dealFilterTrigger");

const dealFilterMenu = document.getElementById("dealFilterMenu");

const dealFilterLabel = document.getElementById("dealFilterLabel");

const dealFilterResetBtn = document.getElementById("dealFilterResetBtn");

const dealMethodInputs = document.querySelectorAll('input[name="dealMethodFilter"]');

const dealMethodFilterDropdown = document.getElementById("dealMethodFilterDropdown");

const dealMethodFilterTrigger = document.getElementById("dealMethodFilterTrigger");

const dealMethodFilterMenu = document.getElementById("dealMethodFilterMenu");

const dealMethodFilterLabel = document.getElementById("dealMethodFilterLabel");

const typeButtons = document.querySelectorAll("#typeButtons input");

const typeFilterDropdown = document.getElementById("typeFilterDropdown");

const typeFilterTrigger = document.getElementById("typeFilterTrigger");

const typeFilterMenu = document.getElementById("typeFilterMenu");

const typeFilterLabel = document.getElementById("typeFilterLabel");

const typeFilterResetBtn = document.getElementById("typeFilterResetBtn");

const featureButtons = document.querySelectorAll("#featureButtons button");

const listInfoText = document.getElementById("listInfoText");

const appVersionText = document.getElementById("appVersionText");

const sortLabel = document.getElementById("sortLabel");

let currentSort = "latest";

if (appVersionText) {
	appVersionText.innerHTML = `<!-- <i class="fa-solid fa-location-dot" aria-hidden="true">--></i><span class="brand-name">${APP_NAME}</span>`;
	appVersionText.style.cursor = "pointer";
	appVersionText.setAttribute("role", "button");
	appVersionText.setAttribute("aria-label", `${APP_NAME} 새로고침`);
	appVersionText.addEventListener("click", () => {
		window.window.location.href = "https://realjeju.app";
	});
}

syncSortLabelUI();

const authModal = document.getElementById("authModal");

const authModalClose = document.getElementById("authModalClose");

const authModalForm = document.getElementById("authModalForm");

function getTypeBadgeTheme(typeText)
{

const t = String(typeText || "").trim();
	if (t === "아파트") return { bg: "rgba(59,130,246,0.08)", color: BADGE_BASE_HEX };
	if (["단독주택", "단독", "빌라", "연립", "다가구", "다세대", "다가구ㆍ다세대", "다세대주택"].includes(t)) {
		return { bg: "rgba(59,130,246,0.06)", color: "#1E3A8A" };
	}
	if (["상가", "상가건물", "사무실", "공장", "상가ㆍ사무실"].includes(t)) {
		return { bg: "rgba(59,130,246,0.10)", color: "#3730A3" };
	}
	if (["hotel", "호텔", "pension", "펜션"].includes(t)) {
		return { bg: "rgba(59,130,246,0.10)", color: BADGE_BASE_HEX };
	}
	if (["토지", "임야", "토지ㆍ임야", "전", "대", "답", "과수원"].includes(t)) {
		return { bg: "rgba(16,185,129,0.08)", color: "#047857" };
	}
	return { bg: "#f3f4f6", color: "#374151" };
}

function applyTypeBadgeTheme(el, typeText)
{
	if (!el) return;

const theme = getTypeBadgeTheme(typeText);
	el.style.background = theme.bg;
	el.style.color = theme.color;
	el.style.boxShadow = "inset 0 0 0 1px rgba(15, 41, 66, 0.06)";
}

function openAuthModal()
{
	if (!authModal) return;
	authModal.classList.add("open");
	authModal.setAttribute("aria-hidden", "false");
	document.body.style.overflow = "hidden";
}

function closeAuthModal()
{
	if (!authModal) return;
	authModal.classList.remove("open");
	authModal.setAttribute("aria-hidden", "true");
	document.body.style.overflow = "";
}

function updateGlobalAreaUnitButtons()
{
	if (areaUnitPyBtn) areaUnitPyBtn.classList.toggle("active", globalAreaUnit === "py");
	if (areaUnitM2Btn) areaUnitM2Btn.classList.toggle("active", globalAreaUnit === "m2");
}

function setGlobalAreaUnit(unit)
{
	globalAreaUnit = unit;
	applyGlobalAreaUnit();
}

window.setGlobalAreaUnit = setGlobalAreaUnit;

function lockListToItems(items)
{

function clearListLock()
{
	state.lockedListIds = null;
}

function getLockedListItems()
{
	if (!Array.isArray(state.lockedListIds) || !state.lockedListIds.length) return null;

const lockedItems = (state.filtered || []).filter(item => idSet.has(normalizeItemId(item.id)));
	return lockedItems.length ? lockedItems : null;
}

function isLockedSelectionStillVisible()
{
	if (!Array.isArray(state.lockedListIds) || !state.lockedListIds.length) return false;

const selectedClusterStillVisible = (clusters || []).some(cluster => {

let matchedClusterKey = null;

const targetInsideCluster = (clusters || []).some(cluster => {

const containsTarget = clusterItems.some(item => normalizeItemId(item.id) === targetId);
			if (!containsTarget) return false;

			matchedClusterKey = clusterItems.length > 1
			? getClusterKeyFromItems(clusterItems)
			: null;
			return true;
		});

		if (targetInsideCluster) {
			state.selectedClusterKey = matchedClusterKey;
			return true;
		}

const lat = Number(item.lat);

const lng = Number(item.lng);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

function getRecommendationPool(items)
{

const list = Array.isArray(items) ? items : [];
	if (!recommendIds.length) return [];

function getRecommendationCandidate(items)
{

const previousId = state.recommendItem ? normalizeItemId(state.recommendItem.id) : null;

const candidates = pool.filter(item => normalizeItemId(item.id) !== previousId);

const source = candidates.length ? candidates : pool;

const randomIndex = Math.floor(Math.random() * source.length);
	return source[randomIndex];
}

function normalizeRecommendAgent(agent)
{
	if (!agent || typeof agent !== "object") return null;

function getRecommendationAgentCandidate()
{
	if (!Array.isArray(recommendAgents) || !recommendAgents.length) return null;
	if (recommendAgents.length === 1) return recommendAgents[0];

const previousId = state.recommendAgent ? normalizeItemId(state.recommendAgent.id) : null;

const candidates = recommendAgents.filter(agent => normalizeItemId(agent.id) !== previousId);

const source = candidates.length ? candidates : recommendAgents;

const randomIndex = Math.floor(Math.random() * source.length);
	return source[randomIndex];
}

const hasCurrent = state.recommendAgent
	&& recommendAgents.some(agent => normalizeItemId(agent.id) === normalizeItemId(state.recommendAgent.id));

	if (!hasCurrent) {
		state.recommendAgent = getRecommendationAgentCandidate();
	}

	renderRecommendAgentCard(state.recommendAgent);
}

const pool = getRecommendationPool(items);

const keepCurrent = state.lastRecommendPoolKey === poolKey
	&& state.recommendItem
	&& pool.some(item => normalizeItemId(item.id) === normalizeItemId(state.recommendItem.id));

	if (!keepCurrent) {
		state.recommendItem = getRecommendationCandidate(pool);
		state.lastRecommendPoolKey = poolKey;
	}

	renderRecommendationCard(state.recommendItem);
}

function refreshViewportList()
{

const lockedItems = getLockedListItems();
	if (lockedItems) {

const shouldKeepLockedItems = sidebar.classList.contains("expanded") || isLockedSelectionStillVisible();
		if (shouldKeepLockedItems) {

const viewportItems = sortItems(getViewportFilteredItems(state.filtered));

	if (state.initialRandomListActive !== false && isInitialAllListMode() && !sidebar.classList.contains("expanded") && !state.selectionMode) {
		propertyList.innerHTML = "";
		setResultInfo(`총 ${state.filtered.length}건`);
		setListInfo(`총 ${state.filtered.length}개 매물`);
		refreshRecommendAgentCard();
		refreshRecommendationCard(state.filtered);
		return [];
	}

function updateSidebarWidth()
{

const rootStyle = document.documentElement.style;

const listWidth = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-list-width").trim() || "360px";

const nextWidth = state.isListOpen ? listWidth : "0px";
	rootStyle.setProperty("--sidebar-current-width", nextWidth);
	document.body.classList.toggle("sidebar-list-collapsed", !state.isListOpen);
}

function escapeHtml(str)
{
	return String(str ?? "")
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/g, "&#39;");
}

function normalizeImageArray(item)
{
	if (Array.isArray(item.images) && item.images.length) {
		return item.images.filter(Boolean);
	}
	if (item.image) return [item.image];
	return [];
}

function normalizeFeatureToken(value)
{
	return String(value || "")
	.trim()
	.toLowerCase()
	.replace(/\s+/g, " ");
}

function normalizeFeatureList(features)
{

const rawList = Array.isArray(features) ? features : [];

const normalized = new Set();
	rawList.forEach(feature => {

function hasFeatureLabel(item, label)
{

const featureTokens = Array.isArray(item?.featuresNormalized)
	? item.featuresNormalized
	: normalizeFeatureList(item?.features);

const tokenSet = new Set(featureTokens);

	return aliasTokens.some(token => tokenSet.has(token));
}

function normalizeProperty(item, index)
{

function parseAreaNumbers(areaText)
{

const text = String(areaText || "").trim();

const value = Number(String(match[1]).replace(/,/g, ""));
		return Number.isFinite(value) ? value : null;
	}).filter(v => v !== null);

	return matches;
}

function isApartmentType(typeText)
{

const text = String(typeText || "").trim();
	return /아파트|빌라|연립|투룸/.test(text);
}

function isHotelType(typeText)
{

const text = String(typeText || "").trim().toLowerCase();
	return text === "hotel" || text === "호텔";
}

function isPensionType(typeText)
{

const text = String(typeText || "").trim().toLowerCase();
	return text === "pension" || text === "펜션";
}

function isHotelPensionType(typeText)
{
	return isHotelType(typeText) || isPensionType(typeText);
}

function isDetachedHouseType(typeText)
{

const text = String(typeText || "").trim();
	return ["단독", "단독주택"].includes(text);
}

function isMultiFamilyHouseType(typeText)
{

const text = String(typeText || "").trim();
	return ["다가구", "다가구주택"].includes(text);
}

function isLandSubtypeType(typeText)
{

const text = String(typeText || "").trim();
	return ["전", "대", "답", "과수원", "목장용지"].includes(text);
}

function getCardTypeBadgeLabel(typeText)
{

const text = String(typeText || "").trim();
	if (isLandSubtypeType(text)) return "토지";
	return text || "-";
}

function getDisplayTypeLabel(typeText)
{

function getSummaryTypeBadgeLabel(typeText)
{

const label = getDisplayTypeLabel(typeText);
	return label.startsWith("토지(") ? "토지" : label;
}

function isCommercialType(typeText)
{

const text = String(typeText || "").trim();
	return ["상가", "상가건물", "사무실", "공장", "상가ㆍ사무실"].includes(text);
}

function parseDetachedHouseAreas(areaText)
{

const raw = String(areaText || "-").trim();

const landMatch = raw.match(/대지 면적\s*([\d,.]+)㎡/);

const totalMatch = raw.match(/연면적\s*([\d,.]+)㎡/);

const land = landMatch ? Number(String(landMatch[1]).replace(/,/g, "")) : null;

const total = totalMatch ? Number(String(totalMatch[1]).replace(/,/g, "")) : null;

	return { raw, land, total };
}

function parseApartmentAreas(areaText)
{

const raw = String(areaText || "-").trim();

const supplyMatch = raw.match(/(?:공급|계약)(?:면적)?\s*([\d,.]+)㎡/);

const privateMatch = raw.match(/전용(?:면적)?\s*([\d,.]+)㎡/);

let supply = supplyMatch ? Number(String(supplyMatch[1]).replace(/,/g, "")) : null;

let privateArea = privateMatch ? Number(String(privateMatch[1]).replace(/,/g, "")) : null;

	if (!Number.isFinite(supply) || !Number.isFinite(privateArea)) {

const values = parseAreaNumbers(raw);
		if (!Number.isFinite(supply) && values.length >= 1) supply = values[0];
		if (!Number.isFinite(privateArea) && values.length >= 2) privateArea = values[1];
	}

	return { raw, supply, private: privateArea };
}

function formatDetachedHouseAreaDisplay(areaText, unit = "m2")
{
	const { raw, total } = parseDetachedHouseAreas(areaText);

	if (Number.isFinite(total)) {
		return `${formatSingleAreaValue(total, unit)}`;
	}

	return escapeHtml(raw);
}

function formatDetachedHouseCardAreaDisplay(areaText, unit)
{
	const { raw, land, total } = parseDetachedHouseAreas(areaText);

	if (Number.isFinite(land) && Number.isFinite(total)) {
		return `대지${formatSingleAreaValue(land, unit)}ㆍ연${formatSingleAreaValue(total, unit)}`;
	}

	return escapeHtml(raw);
}

function formatSingleAreaValue(value, unit)
{
	if (!Number.isFinite(value)) return "-";
	if (unit === "py") {
		return `${(value / 3.3058).toFixed(1)}평`;
	}
	return `${value.toLocaleString('ko-KR')}㎡`;
}

function formatAreaByUnit(areaText, unit, typeText = "")
{

const raw = String(areaText || "-").trim();

const values = parseAreaNumbers(raw);

	if (isDetachedHouseType(typeText)) {
		return formatDetachedHouseAreaDisplay(raw, unit);
	}

	if (isApartmentType(typeText) && values.length >= 2) {

const privateArea = formatSingleAreaValue(values[1], unit);
		return privateArea;
	}

	if (values.length >= 1) {
		return formatSingleAreaValue(values[0], unit);
	}

	return escapeHtml(raw);
}

function getPrimaryAreaForUnitPrice(areaText, typeText = "")
{

const raw = String(areaText || "-").trim();

	if (isDetachedHouseType(typeText)) {
		const { total } = parseDetachedHouseAreas(raw);
		return Number.isFinite(total) ? total : null;
	}

	if (isApartmentType(typeText) || isHotelPensionType(typeText)) {
		const { private: privateArea } = parseApartmentAreas(raw);
		return Number.isFinite(privateArea) ? privateArea : null;
	}

const values = parseAreaNumbers(raw);
	return values.length >= 1 && Number.isFinite(values[0]) ? values[0] : null;
}

function parsePriceTextToWon(priceText)
{

const raw = String(priceText || "").replace(/\s+/g, "");
	if (!raw || raw === "-") return null;

let totalWon = 0;

const eokMatch = raw.match(/([\d,.]+)억/);
	if (eokMatch) {
		totalWon += Number(String(eokMatch[1]).replace(/,/g, "")) * 100000000;
	}

const manwonMatch = raw.match(/억([\d,]+)/) || (!eokMatch ? raw.match(/^([\d,]+)$/) : null);
	if (manwonMatch) {
		totalWon += Number(String(manwonMatch[1]).replace(/,/g, "")) * 10000;
	}

	if (!eokMatch && /만원/.test(raw)) {

const onlyManwon = raw.match(/([\d,]+)만원/);
		if (onlyManwon) {
			totalWon += Number(String(onlyManwon[1]).replace(/,/g, "")) * 10000;
		}
	}

	return Number.isFinite(totalWon) && totalWon > 0 ? totalWon : null;
}

const manwonPerM2 = Math.round((totalWon / areaM2) / 10000);

const manwonPerPyeong = Math.round(((totalWon / areaM2) * 3.3058) / 10000);

	if (globalAreaUnit === "py") {
		return `단위 가격 ${manwonPerPyeong.toLocaleString('ko-KR')}만원/평`;
	}

	return `단위 가격 ${manwonPerM2.toLocaleString('ko-KR')}만원/㎡`;
}

function formatCardAreaByUnit(areaText, unit, typeText = "")
{
	if (isDetachedHouseType(typeText)) {
		return formatDetachedHouseCardAreaDisplay(areaText, unit);
	}

	if (isHotelPensionType(typeText)) {

const parsed = parseApartmentAreas(areaText || "-");

const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";

const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return `계약${supplyText}ㆍ전용${privateText}`;
	}

	if (/상가|상가건물|사무실|공장/.test(typeText)) {

const raw = String(areaText || "-").trim();

		if (/계약|전용/.test(raw)) {

const parsed = parseApartmentAreas(raw);

const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";

const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
			return `계약${supplyText}ㆍ전용${privateText}`;
		}

const totalMatch =
		raw.match(/연면적\s*([\d,.]+)㎡/) ||
		raw.match(/연면적\s*([\d,.]+)평/) ||
		raw.match(/\(연\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(연\)\s*([\d,.]+)평/) ||
		raw.match(/연\s*([\d,.]+)㎡/) ||
		raw.match(/연\s*([\d,.]+)평/);

const landMatch =
		raw.match(/대지 면적\s*([\d,.]+)㎡/) ||
		raw.match(/대지 면적\s*([\d,.]+)평/) ||
		raw.match(/\(대지\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(대지\)\s*([\d,.]+)평/) ||
		raw.match(/대지\s*([\d,.]+)㎡/) ||
		raw.match(/대지\s*([\d,.]+)평/);

const totalValue = totalMatch ? Number(String(totalMatch[1]).replace(/,/g, "")) : null;

const landValue = landMatch ? Number(String(landMatch[1]).replace(/,/g, "")) : null;

const totalText = Number.isFinite(totalValue) ? formatSingleAreaValue(totalValue, unit) : null;

const landText = Number.isFinite(landValue) ? formatSingleAreaValue(landValue, unit) : null;

		if (landText && totalText) {
			return `대지${landText}ㆍ연${totalText}`;
		}
		if (totalText) {
			return `연${totalText}`;
		}
		if (landText) {
			return `대지${landText}`;
		}
		return formatAreaByUnit(areaText, unit, typeText);
	}

	if (/콘도/.test(typeText)) {

const raw = String(areaText || "-").trim();

const buildMatch =
		raw.match(/건축면적\s*([\d,.]+)㎡/) ||
		raw.match(/건축면적\s*([\d,.]+)평/) ||
		raw.match(/\(건축\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(건축\)\s*([\d,.]+)평/) ||
		raw.match(/건축\s*([\d,.]+)㎡/) ||
		raw.match(/건축\s*([\d,.]+)평/);

const totalMatch =
		raw.match(/연면적\s*([\d,.]+)㎡/) ||
		raw.match(/연면적\s*([\d,.]+)평/) ||
		raw.match(/\(연\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(연\)\s*([\d,.]+)평/) ||
		raw.match(/연\s*([\d,.]+)㎡/) ||
		raw.match(/연\s*([\d,.]+)평/);

const buildValue = buildMatch ? Number(String(buildMatch[1]).replace(/,/g, "")) : null;

const totalValue = totalMatch ? Number(String(totalMatch[1]).replace(/,/g, "")) : null;

const buildText = Number.isFinite(buildValue) ? formatSingleAreaValue(buildValue, unit) : null;

const totalText = Number.isFinite(totalValue) ? formatSingleAreaValue(totalValue, unit) : null;

		if (buildText && totalText) {
			return `건축${buildText}ㆍ연${totalText}`;
		}
		if (buildText) {
			return `건축${buildText}`;
		}
		if (totalText) {
			return `연${totalText}`;
		}
		return formatAreaByUnit(areaText, unit, typeText);
	}

	if (/오피스텔/.test(typeText)) {

const parsed = parseApartmentAreas(areaText || "-");

const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";

const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return `계약${supplyText}ㆍ전용${privateText}`;
	}

	if (/원룸|투룸/.test(typeText)) {

const parsed = parseApartmentAreas(areaText || "-");

const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";

const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return `공급${supplyText}ㆍ전용${privateText}`;
	}

	if (isApartmentType(typeText)) {

const parsed = parseApartmentAreas(areaText || "-");

const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";

const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return `공급${supplyText}ㆍ전용${privateText}`;
	}

	if (/토지|임야|과수원|목장용지|대지|전|대|답/.test(typeText)) {

const value = formatAreaByUnit(areaText, unit, typeText);

const landType = String(typeText || "").trim();

		if (["전", "대", "답", "과수원", "목장용지", "임야"].includes(landType)) {
			return `${value}ㆍ${landType}`;
		}

		return value;
	}
	return formatAreaByUnit(areaText, unit, typeText);
}

const text = String(typeText || "").trim();
	if (text === "임야") return "임야";
	if (text === "목장용지") return "토지(목장)";
	if (["전", "대", "답", "과수원"].includes(text)) return `토지(${text})`;
	if (["토지", "토지ㆍ임야"].includes(text)) return "토지";
	return text || "-";
}

const raw = String(valueText || "-").trim();

const parsed = parseApartmentAreas(raw);

const parsed = parseDetachedHouseAreas(raw);

const buildMatch =
		raw.match(/건축면적\s*([\d,.]+)㎡/) ||
		raw.match(/건축면적\s*([\d,.]+)평/) ||
		raw.match(/\(건축\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(건축\)\s*([\d,.]+)평/) ||
		raw.match(/건축\s*([\d,.]+)㎡/) ||
		raw.match(/건축\s*([\d,.]+)평/);

const totalMatch =
		raw.match(/연면적\s*([\d,.]+)㎡/) ||
		raw.match(/연면적\s*([\d,.]+)평/) ||
		raw.match(/\(연\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(연\)\s*([\d,.]+)평/) ||
		raw.match(/연\s*([\d,.]+)㎡/) ||
		raw.match(/연\s*([\d,.]+)평/);

const buildValue = buildMatch ? Number(String(buildMatch[1]).replace(/,/g, "")) : null;

const totalValue = totalMatch ? Number(String(totalMatch[1]).replace(/,/g, "")) : null;

function setListInfo(text)
{
	if (listInfoText) listInfoText.textContent = text;
}

async function loadAgent(agentPath)
{

const normalizedAgentPath = toRemotePath(agentPath);
	if (!normalizedAgentPath) return null;
	if (agentCache[normalizedAgentPath]) return agentCache[normalizedAgentPath];
	if (agentPromiseCache[normalizedAgentPath]) return agentPromiseCache[normalizedAgentPath];

	agentPromiseCache[normalizedAgentPath] = (async () => {
		try {

const res = await fetch(normalizedAgentPath, { cache: "no-store" });
			if (!res.ok) throw new Error(`agent.json 불러오기 실패: ${res.status}`);

const data = await res.json();

const remoteData = {
				...data,
				agentImage: toRemotePath(data?.agentImage)
			};
			agentCache[normalizedAgentPath] = remoteData;
			return remoteData;
		} catch (e) {
			console.error("agent 로딩 실패", e);
			return null;
		} finally {
			delete agentPromiseCache[normalizedAgentPath];
		}
	})();

	return agentPromiseCache[normalizedAgentPath];
}

async function loadRecommendData()
{
	try {

const data = await res.json();

const data = [
		...(Array.isArray(dataMain) ? dataMain : []),
		...(Array.isArray(dataOneroom) ? dataOneroom : [])
		];

function getBadgeConfig(text)
{

const len = String(text ?? "").length;
	if (len === 1) return { size: 42, fontSize: 18.8 };
	if (len === 2) return { size: 52, fontSize: 18.8 };
	return { size: 62, fontSize: 18.8 };
}

function getBadgeWidthByText(text)
{
	return getBadgeConfig(text).size;
}

function getBadgeTextMetrics(text)
{

const value = String(text ?? "");

	if (value === "1") {
		return {
			xOffset: -0.72,
			strokeWidth: 0.28,
			letterSpacing: "0px",
			clusterTranslateX: "-0.72px"
		};
	}

	if (value === "11") {
		return {
			xOffset: -0.4,
			strokeWidth: 0.28,
			letterSpacing: "0px",
			clusterTranslateX: "-0.4px"
		};
	}

	return {
		xOffset: 0,
		strokeWidth: 0.3,
		letterSpacing: "0px",
		clusterTranslateX: "0px"
	};
}

const text = String(label ?? "1");
	const { size, fontSize } = getBadgeConfig(text);

const textMetrics = getBadgeTextMetrics(text);

const shadowPad = 10;

const canvasSize = size + shadowPad;

const center = canvasSize / 2;

const strokeWidth = isSelected ? 1 : 0;

const radius = (size - strokeWidth) / 2;

const bgColor = isSelected ? "rgba(255,255,255,0.98)" : hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA);

const textColor = isSelected ? BADGE_BASE_HEX : "#ffffff";

const strokeColor = isSelected ? BADGE_BASE_HEX : "none";

function setClusterBadgeSelected(cluster, isSelected)
{

const count = clusterItems.length;

const label = count > 99 ? "99+" : String(count);
	const { size, fontSize } = getBadgeConfig(label);

const bg = isSelected ? "rgba(255,255,255,0.98)" : hexToRgba(BADGE_BASE_HEX, BADGE_BASE_ALPHA);

const color = isSelected ? BADGE_BASE_HEX : "#ffffff";

const textMetrics = getBadgeTextMetrics(label);

const wrap = document.createElement("div");
	wrap.style.width = `${size}px`;
	wrap.style.height = `${size}px`;
	wrap.style.minWidth = `${size}px`;
	wrap.style.display = "flex";
	wrap.style.alignItems = "center";
	wrap.style.justifyContent = "center";
	wrap.style.pointerEvents = "none";
	wrap.style.transform = `translateX(0)`;

const el = document.createElement("button");
	el.type = "button";
	el.style.width = `${size}px`;
	el.style.height = `${size}px`;
	el.style.minWidth = `${size}px`;
	el.style.padding = "0";
	el.style.borderRadius = "50%";
	el.style.display = "flex";
	el.style.alignItems = "center";
	el.style.justifyContent = "center";
	el.style.background = bg;
	el.style.color = color;
	el.style.fontSize = `${fontSize}px`;
	el.style.fontWeight = "800";
	el.style.fontFamily = UI_FONT_STACK;
	el.style.lineHeight = "1";
	el.style.textAlign = "center";
	el.style.letterSpacing = textMetrics.letterSpacing;
	el.style.fontVariantNumeric = "tabular-nums";
	el.style.fontFeatureSettings = "'tnum' 1, 'lnum' 1";
	el.style.webkitFontSmoothing = "antialiased";
	el.style.border = isSelected ? `1px solid ${BADGE_BASE_HEX}` : "0";
	el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.28)";
	el.style.boxSizing = "border-box";
	el.style.whiteSpace = "nowrap";
	el.style.cursor = "pointer";
	el.style.pointerEvents = "auto";
	el.style.userSelect = "none";
	el.style.touchAction = "none";
	el.textContent = label;

const key = getClusterKeyFromItems(clusterItems);

const overlapsLockedSelection = !!(lockedIdSet && ids.length > 0 && ids.some(id => lockedIdSet.has(id)));

function makeAgentInitial(text)
{

const raw = String(text || "담당").trim();
	return raw.length >= 2 ? raw.slice(-2) : raw;
}

function resolveRelativeImagePath(item, value)
{
	if (!value || typeof value !== "string") return value || "";

const trimmed = String(value || "").trim();
	if (!trimmed) return "";
	if (/^(?:https?:)?\/\//.test(trimmed) || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("/")) {
		return trimmed;
	}

const folder = String(item?.image_folder || "");

const basePath = folder.replace(/image\.json(?:\?.*)?$/i, "");
	return basePath ? `${basePath}${trimmed}` : trimmed;
}

async function loadJsonFile(path, cacheStore, errorLabel)
{
	if (!path) return {};
	if (cacheStore[path]) return cacheStore[path];

	try {

const res = await fetch(path, { cache: "no-store" });
		if (!res.ok) throw new Error(`${errorLabel} 불러오기 실패: ${res.status}`);

const data = await res.json();
		cacheStore[path] = data;
		return data;
	} catch (err) {
		console.error(`${errorLabel} 로딩 실패:`, err);
		return {};
	}
}

async function loadPropertyInfo(item)
{
	return await loadJsonFile(item.desc_folder, infoCache, "info.json");
}

async function loadPropertyImages(item)
{

const payload = await loadJsonFile(item.image_folder, imageCache, "image.json");
	return resolveImageJsonPaths(item, payload);
}

const mainImage = toRemotePath(String(imageData.image || "").trim())
	|| imageList[0]
	|| toRemotePath(String(item.image || "").trim());

function getHeroImages(item)
{

const fallback = item.image ? [item.image] : [];

	if (!Array.isArray(item.images) || !item.images.length) {
		return fallback;
	}

function setHeroSlide(index)
{
	if (!currentHeroImages.length) return;
	currentHeroIndex = (index + currentHeroImages.length) % currentHeroImages.length;

function nextHeroSlide()
{
	setHeroSlide(currentHeroIndex + 1);
}

function prevHeroSlide()
{
	setHeroSlide(currentHeroIndex - 1);
}

function nextLightboxImage()
{
	if (!currentHeroImages.length) return;
	setHeroSlide(currentHeroIndex + 1);
	updateLightboxImage();
}

function prevLightboxImage()
{
	if (!currentHeroImages.length) return;
	setHeroSlide(currentHeroIndex - 1);
	updateLightboxImage();
}

function highlightCard(id)
{
	document.querySelectorAll(".card").forEach(card => {
		card.classList.toggle("active", normalizeItemId(card.dataset.id) === normalizeItemId(id));
	});
}

const preserveViewport = !!options.preserveViewport;

const rawSearch = String(window.location.search || "");

const params = new URLSearchParams(rawSearch);

async function focusProperty(id)
{

const thumb = escapeHtml(item.image || "");

const dealLabel = escapeHtml(item.dealType || "매매");

const priceText = escapeHtml(item.price || "-");

const addressText = escapeHtml(item.address || "-");

const rawTypeText = item.type || "-";

const typeText = escapeHtml(getCardTypeBadgeLabel(rawTypeText));

const titleText = escapeHtml(item.title || "매물명");

const viewKey = getItemViewKey(item);

const viewText = getViewCountText(viewKey);

const agentName = escapeHtml(item.agentName || "담당자");

const agentTitle = escapeHtml(item.agentTitle || "");

const agentInitial = makeAgentInitial(item.agentName || "담당자");

const isDetachedHouse = isDetachedHouseType(item.type || "");

const item = data.find(v => normalizeItemId(v.id) === normalizeItemId(card.dataset.id));
			if (!item) return;

const leftAllBtn = document.querySelector('#featureButtons button[data-value="all"]');
	if (!leftAllBtn) return;

const isTypeAll = !(selectedType instanceof Set) || selectedType.size === 0;

const isDealAll = !(selectedDeal instanceof Set) || selectedDeal.size === 0;

const isMethodAll = !selectedDealMethod || selectedDealMethod === "all";

const isAllState = isTypeAll && isDealAll && isMethodAll;
	leftAllBtn.classList.toggle('all-active', isAllState && state.selectedFeatures.size === 0);
}

function syncFeatureButtons()
{

const isAll = state.selectedFeatures.size === 0;

	(featureButtons || []).forEach(btn => {

const value = btn.dataset.value;

		if (value === "all") {
			btn.classList.toggle("all-active", isAll);
			btn.classList.remove("active");
		} else {
			btn.classList.toggle("active", state.selectedFeatures.has(value));
			btn.classList.remove("all-active");
		}
	});
}

function scrollListToTop()
{
	if (sidebarListPanel) sidebarListPanel.scrollTop = 0;
	if (propertyList) propertyList.scrollTop = 0;
	requestAnimationFrame(() => {
		if (sidebarListPanel) sidebarListPanel.scrollTop = 0;
		if (propertyList) propertyList.scrollTop = 0;
	});
	setTimeout(() => {
		if (sidebarListPanel) sidebarListPanel.scrollTop = 0;
		if (propertyList) propertyList.scrollTop = 0;
	}, 0);
}

function isInitialAllListMode()
{

const keyword = String(keywordInput?.value || "").trim();
	return !keyword
	&& (!selectedDeal || selectedDeal.size === 0)
	&& (!selectedType || selectedType.size === 0)
	&& (!selectedDealMethod || selectedDealMethod === "all")
	&& state.selectedFeatures.size === 0
	&& !selectedPetOnly
	&& !selectedParkingOnly
	&& !selectedCityGasOnly
	&& !selectedDuplexOnly
	&& !selectedVerandaOnly
	&& !selectedElevatorOnly
	&& !selectedFullOptionOnly
	&& !selectedImmediateMoveInOnly
	&& !selectedOceanViewOnly;
}

function shuffleItems(items)
{

const list = Array.isArray(items) ? [...items] : [];
	for (let i = list.length - 1; i > 0; i -= 1) {

const j = Math.floor(Math.random() * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	return list;
}


state.initialRandomListActive = true;
state.initialRandomListIds = [];

function applyFilter()
{

const keyword = String(keywordInput?.value || "").trim().toLowerCase();

const dealValues = selectedDeal instanceof Set ? selectedDeal : new Set();

const typeValues = selectedType instanceof Set ? selectedType : new Set();

const isDealAll = dealValues.size === 0;

const isTypeAll = typeValues.size === 0;

const methodValue = selectedDealMethod || "all";

	state.filtered = state.all.filter(item => {

const rawItemText = JSON.stringify(item ?? {}).toLowerCase();

const searchableText = `${text} ${rawItemText}`.replace(/\s+/g, " ");

const okKeyword = !keyword || searchableText.includes(keyword);

const okDeal = isDealAll || dealValues.has(item.dealType);

const itemType = (item.type ?? "").trim();

const isSaleDeal = item.dealType === "매매";

const matchesTypeValue = (typeValue) =>
		(typeValue === "아파트" && ["아파트", "아파트ㆍ빌라"].includes(itemType)) ||
		(typeValue === "오피스텔" && itemType === "오피스텔") ||
		(typeValue === "빌라" && ["빌라", "연립", "다세대", "다세대주택", "다가구ㆍ다세대"].includes(itemType)) ||
		(typeValue === "단독주택" && ["주택", "단독", "단독주택"].includes(itemType)) ||
		(typeValue === "다가구주택" && ["다가구", "다가구주택"].includes(itemType)) ||
		(typeValue === "원룸 / 투룸" && ["원룸", "투룸", "원룸ㆍ투룸"].includes(itemType)) ||
		(typeValue === "상가" && ["상가", "상가건물", "상가ㆍ사무실"].includes(itemType)) ||
		(typeValue === "사무실" && ["사무실", "상가ㆍ사무실"].includes(itemType)) ||
		(typeValue === "건물" && ["건물", "빌딩", "상가건물", "통건물"].includes(itemType)) ||
		(typeValue === "공장 / 창고" && ["공장", "창고", "공장/창고", "공장ㆍ창고", "창고시설"].includes(itemType)) ||
		(typeValue === "호텔" && (["hotel", "호텔"].includes(itemType) || isHotelPensionType(itemType) && String(itemType).toLowerCase().includes("hotel"))) ||
		(typeValue === "펜션" && (["pension", "펜션"].includes(itemType) || isHotelPensionType(itemType) && String(itemType).toLowerCase().includes("pension"))) ||
		(typeValue === "토지" && ["토지", "임야", "토지ㆍ임야", "전", "대", "답", "과수원", "목장용지"].includes(itemType)) ||
		(typeValue === "아파트오피스텔" && (["아파트", "아파트ㆍ빌라"].includes(itemType) || (itemType === "오피스텔" && isSaleDeal))) ||
		(typeValue === "빌라주택" && ["빌라", "연립", "단독", "단독주택", "다가구", "다세대", "다가구ㆍ다세대", "다세대주택"].includes(itemType)) ||
		(typeValue === "호텔펜션" && (["hotel", "호텔", "pension", "펜션"].includes(itemType) || isHotelPensionType(itemType)));

const okType = isTypeAll || [...typeValues].some(matchesTypeValue);

const rawMethodText = String(
		item.dealMethod ?? item.listingMethod ?? item.tradeMethod ?? item.ownerType ?? item.sellerType ?? item.listingType ?? item.userType ?? ""
		).trim().toLowerCase();

const isDirectListing = rawMethodText.includes("direct")
		|| rawMethodText.includes("private")
		|| rawMethodText.includes("owner")
		|| rawMethodText.includes("personal")
		|| rawMethodText.includes("개인")
		|| rawMethodText.includes("직거래");

const okFeature =
		state.selectedFeatures.size === 0 ||
		[...state.selectedFeatures].every(feature => hasFeatureLabel(item, feature));

const hasPetAllow = hasFeatureLabel(item, "반려동물");

const hasParking = hasFeatureLabel(item, "주차 가능");

const hasCityGas = hasFeatureLabel(item, "도시가스");

const hasDuplex = hasFeatureLabel(item, "복층형");

const hasVeranda = hasFeatureLabel(item, "베란다");

const hasElevator = hasFeatureLabel(item, "엘리베이터");

const hasFullOption = hasFeatureLabel(item, "풀옵션");

const hasImmediateMoveIn = Array.isArray(item?.featuresNormalized)
		? item.featuresNormalized.includes(normalizeFeatureToken("즉시입주"))
		: normalizeFeatureList(item?.features).includes(normalizeFeatureToken("즉시입주"));

const hasOceanView = hasFeatureLabel(item, "오션뷰");

const okPet = !selectedPetOnly || hasPetAllow;

const okParking = !selectedParkingOnly || hasParking;

const okCityGas = !selectedCityGasOnly || hasCityGas;

const okDuplex = !selectedDuplexOnly || hasDuplex;

const okVeranda = !selectedVerandaOnly || hasVeranda;

const okElevator = !selectedElevatorOnly || hasElevator;

const okFullOption = !selectedFullOptionOnly || hasFullOption;

const okImmediateMoveIn = !selectedImmediateMoveInOnly || hasImmediateMoveIn;

const viewportItems = getViewportFilteredItems(state.filtered);

const shouldHideInitialList = state.initialRandomListActive !== false && isInitialAllListMode();

function getSortDateValue(item)
{

const value = item?.date ? new Date(item.date).getTime() : NaN;
	return Number.isFinite(value) ? value : 0;
}

function sortItems(items)
{

const list = Array.isArray(items) ? [...items] : [];

	if (currentSort === "price-desc") {
		list.sort((a, b) => {

const priceDiff = (parsePriceTextToWon(b?.price || "") ?? -1) - (parsePriceTextToWon(a?.price || "") ?? -1);
			if (priceDiff !== 0) return priceDiff;
			return getSortDateValue(b) - getSortDateValue(a);
		});
		return list;
	}

	if (currentSort === "price-asc") {
		list.sort((a, b) => {

const aPrice = parsePriceTextToWon(a?.price || "");

const bPrice = parsePriceTextToWon(b?.price || "");
			if (aPrice == null && bPrice == null) return getSortDateValue(b) - getSortDateValue(a);
			if (aPrice == null) return 1;
			if (bPrice == null) return -1;

const priceDiff = aPrice - bPrice;
			if (priceDiff !== 0) return priceDiff;
			return getSortDateValue(b) - getSortDateValue(a);
		});
		return list;
	}

	list.sort((a, b) => getSortDateValue(b) - getSortDateValue(a));
	return list;
}

function syncSortLabelUI()
{
	if (!sortLabel) return;

	sortLabel.classList.remove("sort-latest", "sort-price-desc", "sort-price-asc");

	if (currentSort === "latest") {
		sortLabel.textContent = "최신순";
		sortLabel.title = "최신 등록순";
		sortLabel.classList.add("sort-latest");
		return;
	}

	sortLabel.textContent = "가격순";

	if (currentSort === "price-desc") {
		sortLabel.title = "가격 높은 순";
		sortLabel.classList.add("sort-price-desc");
	} else {
		sortLabel.title = "가격 낮은 순";
		sortLabel.classList.add("sort-price-asc");
	}
}

function setAddressSearchStatus(message, isError = false)
{
	if (!subAddressSearchStatus) return;
	clearTimeout(addressSearchStatusTimer);
	if (!message) {
		subAddressSearchStatus.textContent = "";
		subAddressSearchStatus.classList.remove("show", "error");
		return;
	}
	subAddressSearchStatus.textContent = message;
	subAddressSearchStatus.classList.toggle("error", !!isError);
	subAddressSearchStatus.classList.add("show");
	addressSearchStatusTimer = setTimeout(() => {
		subAddressSearchStatus.classList.remove("show", "error");
	}, isError ? 2600 : 1800);
}

async function handleSubAddressSearch()
{

const queries = query.includes("제주") ? [query] : [query, `제주 ${query}`, `제주특별자치도 ${query}`];

	for (const q of queries) {

function normalizeRealjejuPhone(value)
	{
		return String(value || "").replace(/[^0-9]/g, "");
	}

async function requireProfileSetupIfNeeded(supabaseClient, user, profileData)
	{
		currentRealjejuAuthUser = user || null;

const profile = profileData || null;

const needsSetup = !profile || profile.profile_completed !== true || !profile.name || !profile.phone;
		currentRealjejuProfileCompleted = !needsSetup;
		if (needsSetup) {
			if (authProfileNameInput) authProfileNameInput.value = profile && profile.name ? profile.name : "";
			if (authProfilePhoneInput) authProfilePhoneInput.value = profile && profile.phone ? formatRealjejuPhoneInputValue(profile.phone) : "";
			if (authProfileRoleRequestSelect) authProfileRoleRequestSelect.value = profile && profile.role_request ? profile.role_request : "user";
			if (authProfilePrivacyAgreeCheck) authProfilePrivacyAgreeCheck.checked = false;
			setAuthProfilePhotoPreview(profile && profile.profile_image ? profile.profile_image : "");
		}
		return needsSetup;
	}

	if (authModalForm) {
		authModalForm.addEventListener("submit", (e) => {
			e.preventDefault();
		});
	}

const extraFilterDropdown = document.getElementById("extraFilterDropdown");

const extraFilterTrigger = document.getElementById("extraFilterTrigger");

const extraFilterMenu = document.getElementById("extraFilterMenu");

const extraFilterLabel = document.getElementById("extraFilterLabel");

const extraParkingChk = document.getElementById("extraParkingChk");

const extraPetChk = document.getElementById("extraPetChk");

const extraCityGasChk = document.getElementById("extraCityGasChk");

const extraDuplexChk = document.getElementById("extraDuplexChk");

const extraVerandaChk = document.getElementById("extraVerandaChk");

const extraElevatorChk = document.getElementById("extraElevatorChk");

const extraFullOptionChk = document.getElementById("extraFullOptionChk");

const extraImmediateMoveInChk = document.getElementById("extraImmediateMoveInChk");

const extraOceanViewChk = document.getElementById("extraOceanViewChk");

const extraFilterResetBtn = document.getElementById("extraFilterResetBtn");

function closeDealFilterMenu()
	{
		if (!dealFilterDropdown || !dealFilterTrigger) return;
		dealFilterDropdown.classList.remove("open");
		dealFilterTrigger.setAttribute("aria-expanded", "false");
	}

function syncDealFilterUI()
	{
		if (!dealFilterDropdown) return;

const activeLabels = selectedDeal instanceof Set ? Array.from(selectedDeal) : [];

const hasActive = activeLabels.length > 0;
		dealFilterDropdown.classList.toggle("has-active", hasActive);
		if (dealFilterLabel) dealFilterLabel.textContent = hasActive ? activeLabels.join(", ") : "거래 유형";

		(dealButtons || []).forEach(input => {

const value = input.dataset.value || "";
			if (value === "all" || value === "전체") {
				input.checked = false;
			} else {
				input.checked = hasActive && selectedDeal.has(value);
			}
		});
	}

function closeTypeFilterMenu()
	{
		if (!typeFilterDropdown || !typeFilterTrigger) return;
		typeFilterDropdown.classList.remove("open");
		typeFilterTrigger.setAttribute("aria-expanded", "false");
	}

function syncTypeFilterUI()
	{
		if (!typeFilterDropdown) return;

const activeLabels = selectedType instanceof Set ? Array.from(selectedType) : [];

const hasActive = activeLabels.length > 0;
		typeFilterDropdown.classList.toggle("has-active", hasActive);
		if (typeFilterLabel) typeFilterLabel.textContent = hasActive ? activeLabels.join(", ") : "매물 종류";

		(typeButtons || []).forEach(input => {

const value = input.dataset.value || "";
			if (value === "all" || value === "전체") {
				input.checked = false;
			} else {
				input.checked = hasActive && selectedType.has(value);
			}
		});
	}

function closeDealMethodFilterMenu()
	{
		if (!dealMethodFilterDropdown || !dealMethodFilterTrigger) return;
		dealMethodFilterDropdown.classList.remove("open");
		dealMethodFilterTrigger.setAttribute("aria-expanded", "false");
	}

function syncDealMethodFilterUI()
	{
		if (!dealMethodFilterDropdown) return;

const method = selectedDealMethod || "all";

function closeExtraFilterMenu()
	{
		if (!extraFilterDropdown || !extraFilterTrigger) return;
		extraFilterDropdown.classList.remove("open");
		extraFilterTrigger.setAttribute("aria-expanded", "false");
	}

const value = checked ? checked.value : "all";

function syncExtraFilterUI()
	{
		if (!extraFilterDropdown) return;

const activeLabels = [];
		if (selectedImmediateMoveInOnly) activeLabels.push("즉시입주");
		if (selectedParkingOnly) activeLabels.push("주차 가능");
		if (selectedPetOnly) activeLabels.push("반려동물");
		if (selectedCityGasOnly) activeLabels.push("도시가스");
		if (selectedDuplexOnly) activeLabels.push("복층형");
		if (selectedVerandaOnly) activeLabels.push("베란다");
		if (selectedElevatorOnly) activeLabels.push("엘리베이터");
		if (selectedFullOptionOnly) activeLabels.push("풀옵션");
		if (selectedOceanViewOnly) activeLabels.push("오션뷰");

const hasActive = activeLabels.length > 0;
		extraFilterDropdown.classList.toggle("has-active", hasActive);

		if (extraParkingChk) extraParkingChk.checked = !!selectedParkingOnly;
		if (extraPetChk) extraPetChk.checked = !!selectedPetOnly;
		if (extraCityGasChk) extraCityGasChk.checked = !!selectedCityGasOnly;
		if (extraDuplexChk) extraDuplexChk.checked = !!selectedDuplexOnly;
		if (extraVerandaChk) extraVerandaChk.checked = !!selectedVerandaOnly;
		if (extraElevatorChk) extraElevatorChk.checked = !!selectedElevatorOnly;
		if (extraFullOptionChk) extraFullOptionChk.checked = !!selectedFullOptionOnly;
		if (extraImmediateMoveInChk) extraImmediateMoveInChk.checked = !!selectedImmediateMoveInOnly;
		if (extraOceanViewChk) extraOceanViewChk.checked = !!selectedOceanViewOnly;
		if (extraFilterLabel) extraFilterLabel.textContent = hasActive ? activeLabels.join(", ") : "기타 조건";
	}

const parts = [];

async function copyTextWithFallback(textToCopy)
{
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(textToCopy);
			return true;
		}
	} catch (err) {
		console.error("clipboard api 실패:", err);
	}

	try {

const textarea = document.createElement("textarea");
		textarea.value = textToCopy;
		textarea.setAttribute("readonly", "");
		textarea.style.position = "fixed";
		textarea.style.top = "-9999px";
		textarea.style.left = "-9999px";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		textarea.setSelectionRange(0, textarea.value.length);

const ok = document.execCommand("copy");
		document.body.removeChild(textarea);
		return !!ok;
	} catch (err) {
		console.error("execCommand 복사 실패:", err);
		return false;
	}
}

const smsUrl = /iPhone|iPad|iPod/.test(navigator.userAgent) ? `sms:&body=${body}` : `sms:?body=${body}`;
	if (typeof closeShareMenu === "function") closeShareMenu();
	location.href = smsUrl;
};

function initCustomZoomButtons()
{

const zoomInBtn = document.getElementById("zoomInBtn");

const zoomOutBtn = document.getElementById("zoomOutBtn");

/* ===== AUTH MODAL FUNCTION PATCH FROM 1.897 ONLY ===== */
(function () {

const authModal = document.getElementById("authModal");

const authModalClose = document.getElementById("authModalClose");

const authModalBack = document.getElementById("authModalBack");

const authModalForm = document.getElementById("authModalForm");

const authLoginScreen = document.getElementById("authLoginScreen");

const authSignupTermsScreen = document.getElementById("authSignupTermsScreen");

const authSignupFormScreen = document.getElementById("authSignupFormScreen");

const authForgotPasswordScreen = document.getElementById("authForgotPasswordScreen");

const authResetPasswordScreen = document.getElementById("authResetPasswordScreen");

const authProfileSetupScreen = document.getElementById("authProfileSetupScreen");

const authMyInfoScreen = document.getElementById("authMyInfoScreen");

const authSignupForm = document.getElementById("authSignupForm");

const authForgotPasswordForm = document.getElementById("authForgotPasswordForm");

const authResetPasswordForm = document.getElementById("authResetPasswordForm");

const authProfileSetupForm = document.getElementById("authProfileSetupForm");

const authSignupFormLoginBtn = document.getElementById("authSignupFormLoginBtn");

const authSignupOpenBtn = document.getElementById("authSignupOpenBtn");

const authFindIdBtn = document.getElementById("authFindIdBtn");

const authForgotPasswordOpenBtn = document.getElementById("authForgotPasswordOpenBtn");

const authForgotLoginSwitchBtn = document.getElementById("authForgotLoginSwitchBtn");

const authEmailInput = document.getElementById("authEmailInput");

const authPasswordInput = document.getElementById("authPasswordInput");

const authSignupEmailInput = document.getElementById("authSignupEmailInput");

const authSignupPasswordInput = document.getElementById("authSignupPasswordInput");

const authSignupPasswordConfirmInput = document.getElementById("authSignupPasswordConfirmInput");

const authForgotEmailInput = document.getElementById("authForgotEmailInput");

const authResetPasswordInput = document.getElementById("authResetPasswordInput");

const authResetPasswordConfirmInput = document.getElementById("authResetPasswordConfirmInput");

const authProfilePhotoInput = document.getElementById("authProfilePhotoInput");

const authProfilePhotoPreview = document.getElementById("authProfilePhotoPreview");

const authProfilePhotoSelectBtn = document.getElementById("authProfilePhotoSelectBtn");

let authProfilePhotoFile = null;

let authProfilePhotoUrl = "";
	if (typeof window !== "undefined") window.authProfilePhotoUrl = "";

const authProfileNameInput = document.getElementById("authProfileNameInput");

const authProfilePhoneInput = document.getElementById("authProfilePhoneInput");

const authProfileEmailInput = document.getElementById("authProfileEmailInput");

const authProfileRoleRequestSelect = document.getElementById("authProfileRoleRequestSelect");

const authProfilePrivacyAgreeCheck = document.getElementById("authProfilePrivacyAgreeCheck");

const authProfileAgentRegisterBtn = document.getElementById("authProfileAgentRegisterBtn");

const authErrorModal = document.getElementById("authErrorModal");

const authErrorTitle = document.getElementById("authErrorTitle");

const authErrorMessage = document.getElementById("authErrorMessage");

const authErrorConfirmBtn = document.getElementById("authErrorConfirmBtn");

const authErrorCancelBtn = document.getElementById("authErrorCancelBtn");

const authLoginSwitchBtn = document.getElementById("authLoginSwitchBtn");

const authTermsAllBtn = document.getElementById("authTermsAllBtn");

const authTermsNextBtn = document.getElementById("authTermsNextBtn");

const authTermChecks = Array.from(document.querySelectorAll(".auth-term-check"));

const termsFullPage = document.getElementById("termsFullPage");

const termsFullClose = document.getElementById("termsFullClose");

const termsFullHeaderTitle = document.getElementById("termsFullHeaderTitle");

const termsFullMainTitle = document.getElementById("termsFullMainTitle");

const termsFullContent = document.getElementById("termsFullContent");

const termsFullBody = document.getElementById("termsFullBody");

let currentTermsKey = null;

let authErrorReturnFocusTarget = null;

let authErrorConfirmAction = null;

let authErrorCancelAction = null;

let isRealjejuProfileSetupRequired = false;

let isRealjejuSavingProfile = false;

let currentRealjejuAuthUser = null;

let currentRealjejuProfileCompleted = false;

const REALJEJU_PROFILE_PROMPT_SESSION_KEY = "realjeju_profile_prompted_this_login";

const REALJEJU_PROFILE_CACHE_PREFIX = "realjeju_profile_cache_";

const globalAccountDropdown = document.getElementById("globalAccountDropdown");

const globalAccountEmail = document.getElementById("globalAccountEmail");
	/* PATCH: 드롭다운은 topbar 내부 overflow/transform 영향을 받지 않게 body 직속으로 이동 */
	if (globalAccountDropdown && globalAccountDropdown.parentElement !== document.body) {
		document.body.appendChild(globalAccountDropdown);
	}

function escapeAuthHtml(value)
	{
		return String(value == null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	}

function getRealjejuProfileCacheKey(userId)
	{
		return REALJEJU_PROFILE_CACHE_PREFIX + String(userId || "guest");
	}

function readRealjejuCachedProfile(userId)
	{
		try {

const raw = localStorage.getItem(getRealjejuProfileCacheKey(userId));
			if (!raw) return null;

const cached = JSON.parse(raw);
			return cached && cached.name ? cached : null;
		} catch (err) {
			return null;
		}
	}

function writeRealjejuCachedProfile(userId, profile)
	{
		if (!userId || !profile || !profile.name) return;
		try {
			localStorage.setItem(getRealjejuProfileCacheKey(userId), JSON.stringify({
				name: profile.name || "",
				phone: profile.phone || "",
				role_request: profile.role_request || "user",
				profile_completed: profile.profile_completed === true,
				profile_image: profile.profile_image || ""
			}));
		} catch (err) {}
	}

function clearRealjejuCachedProfile(userId)
	{
		try {
			if (userId) localStorage.removeItem(getRealjejuProfileCacheKey(userId));
		} catch (err) {}
	}

function closeGlobalAccountDropdown()
	{
		if (!globalAccountDropdown) return;
		globalAccountDropdown.classList.remove("open");
		if (globalAuthTrigger) globalAuthTrigger.classList.remove("account-open");
		globalAccountDropdown.setAttribute("aria-hidden", "true");
		globalAccountDropdown.style.display = "none";
	}

function toggleGlobalAccountDropdown()
	{
		if (!globalAccountDropdown) return;

const isOpen = globalAccountDropdown.classList.contains("open");
		globalAccountDropdown.classList.toggle("open", !isOpen);
		if (globalAuthTrigger) globalAuthTrigger.classList.toggle("account-open", !isOpen);
		globalAccountDropdown.setAttribute("aria-hidden", isOpen ? "true" : "false");
		globalAccountDropdown.style.display = isOpen ? "none" : "block";
	}

	/* ===== PATCH: 우측 상단 계정 메뉴 hover 열림 ===== */

let globalAccountHoverCloseTimer = null;



	if (globalAuthTrigger && globalAccountDropdown) {
}


	/* ===== PATCH: 계정 드롭다운 hover 완전 안정화 ===== */

const accountHoverTrigger = document.querySelector(".global-auth-trigger");

const accountHoverDropdown = document.querySelector(".global-account-dropdown");

	if (accountHoverTrigger && accountHoverDropdown) {

const openAccountHoverDropdown = () => {
			if (!(accountHoverTrigger.dataset && accountHoverTrigger.dataset.authState === "logged-in")) return;
			accountHoverDropdown.classList.add("open");
			accountHoverDropdown.setAttribute("aria-hidden", "false");
			accountHoverDropdown.style.display = "block";
		};

const closeAccountHoverDropdown = () => {
			accountHoverDropdown.classList.remove("open");
			accountHoverDropdown.setAttribute("aria-hidden", "true");
			accountHoverDropdown.style.display = "none";
		};

const isInsideAccountHoverZone = (event) => {

const triggerRect = accountHoverTrigger.getBoundingClientRect();

const dropdownRect = accountHoverDropdown.getBoundingClientRect();

const x = event.clientX;

const y = event.clientY;

const bridgeLeft = Math.min(triggerRect.left, dropdownRect.left);

const bridgeRight = Math.max(triggerRect.right, dropdownRect.right);

const bridgeTop = Math.min(triggerRect.top, dropdownRect.top);

const bridgeBottom = Math.max(triggerRect.bottom, dropdownRect.bottom);
			return x >= bridgeLeft && x <= bridgeRight && y >= bridgeTop && y <= bridgeBottom;
		};

const closeAccountHoverDropdownIfOutside = (event) => {
			if (isInsideAccountHoverZone(event)) return;
			closeAccountHoverDropdown();
		};

		accountHoverTrigger.addEventListener("mouseenter", openAccountHoverDropdown);
		accountHoverTrigger.addEventListener("mouseleave", closeAccountHoverDropdownIfOutside);
		accountHoverDropdown.addEventListener("mouseenter", openAccountHoverDropdown);
		accountHoverDropdown.addEventListener("mouseleave", closeAccountHoverDropdownIfOutside);
		document.addEventListener("mousemove", (event) => {
			if (!accountHoverDropdown.classList.contains("open")) return;
			if (isInsideAccountHoverZone(event)) return;
			closeAccountHoverDropdown();
		});
	}

function applyLoggedOutAccountUI()
	{
		renderTopbarMenu(false);
		closeGlobalAccountDropdown();
		if (currentRealjejuAuthUser && currentRealjejuAuthUser.id) clearRealjejuCachedProfile(currentRealjejuAuthUser.id);
		currentRealjejuAuthUser = null;
		currentRealjejuProfileCompleted = false;
		if (typeof window.realjejuResetRegistrantInfo === "function") window.realjejuResetRegistrantInfo();
		if (typeof window.realjejuGoHome === "function") window.realjejuGoHome();
		if (globalAuthTrigger) {
			globalAuthTrigger.dataset.authState = "logged-out";
			globalAuthTrigger.classList.remove("logged-in");
			globalAuthTrigger.innerHTML = '<span>회원가입</span><span class="auth-dot">·</span><span>로그인</span>';
		}
		if (globalAccountEmail) globalAccountEmail.textContent = "";
		if (globalAccountDropdown) globalAccountDropdown.classList.remove("profile-incomplete");
		if (typeof window.realjejuGoHome === "function") window.realjejuGoHome();

function getRoleLabel(role)
	{

const topbarMenu = document.getElementById("topbarMenu");
		if (!topbarMenu) return;

const wrap = document.createElement("span");
				wrap.className = "topbar-menu-free-wrap";

const badge = document.createElement("span");
				badge.className = "badge-free";
				badge.textContent = "무료";

				wrap.appendChild(button);
				wrap.appendChild(badge);
				return wrap;
			}

const button = document.createElement("button");
			button.type = "button";
			button.className = "topbar-menu-item";
			
			if (label === "부동산 홈") button.classList.add("active");
			button.textContent = label;
			return button;
		}));
	}

const topbarMenu = document.getElementById("topbarMenu");
		if (!topbarMenu) return;

const wrap = document.createElement("span");
				wrap.className = "topbar-menu-free-wrap";

const badge = document.createElement("span");
				badge.className = "badge-free";
				badge.textContent = "무료";

				wrap.appendChild(button);
				wrap.appendChild(badge);
				return wrap;
			}

function syncAuthProfileEmail(user)
	{

const emailInput = document.getElementById("authProfileEmailInput");
		if (emailInput) {
			emailInput.value = user && user.email ? user.email : "";
		}
	}

function formatRealjejuPhoneInputValue(value)
	{

const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
		if (digits.length <= 3) return digits;
		if (digits.length <= 7) return digits.slice(0, 3) + "-" + digits.slice(3);
		return digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
	}

function bindRealjejuPhoneAutoHyphen(input)
	{
		if (!input || input.dataset.phoneAutoHyphenBound === "1") return;
		input.dataset.phoneAutoHyphenBound = "1";
		input.setAttribute("inputmode", "numeric");
		input.setAttribute("maxlength", "13");
		input.addEventListener("input", function(e) {
			e.target.value = formatRealjejuPhoneInputValue(e.target.value);
		});
		input.addEventListener("blur", function(e) {
			e.target.value = formatRealjejuPhoneInputValue(e.target.value);
		});
	}

	bindRealjejuPhoneAutoHyphen(authProfilePhoneInput);

function applyLoggedInAccountUI(user, profile)
	{
		if (!user) return;
		if (typeof window.realjejuResetRegistrantInfo === "function") window.realjejuResetRegistrantInfo();
		currentRealjejuAuthUser = user;

window.realjejuCurrentAuthUser = user;

window.realjejuCurrentProfile = profile || null;

const email = user.email || "로그인 사용자";

const displayName = profile && profile.name ? profile.name : email;

const profileImage = (profile && profile.profile_image) ? profile.profile_image : (window.authProfilePhotoUrl || REALJEJU_DEFAULT_PROFILE_IMAGE);
			globalAuthTrigger.dataset.authState = "logged-in";
			globalAuthTrigger.classList.add("logged-in");
			globalAuthTrigger.innerHTML = '<img class="topbar-profile-image" src="' + escapeAuthHtml(profileImage || REALJEJU_DEFAULT_PROFILE_IMAGE) + '" alt="프로필">' + '<span class="account-email-text">' + escapeAuthHtml(displayName) + '</span>' + '<i class="fa-solid fa-chevron-down auth-arrow"></i>';

async function openProfileSetupFromAccountMenu()
	{
		closeGlobalAccountDropdown();

const supabaseForProfile = getRealjejuSupabaseClient();
		if (!supabaseForProfile) {
			openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "개인정보 설정", null);
			return;
		}
		try {
			const { data: userData } = await supabaseForProfile.auth.getUser();

const user = userData && userData.user ? userData.user : null;
			if (!user) {
				openAuthModal();
				return;
			}
			currentRealjejuAuthUser = user;
			const { data: profile } = await supabaseForProfile
				.from("profiles")
				.select("name, phone, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			fillAuthProfileSetupForm(profile);
			openProfileSetupModalNow();
		} catch (err) {
			console.warn("개인정보 설정 열기 실패:", err);
			openAuthErrorModal("개인정보 설정을 열지 못했습니다.", "개인정보 설정", null);
		}
	}

function setTextById(id, value)
	{

const el = document.getElementById(id);

const safeValue = value || "-";
		if (!el) return;
		if ("value" in el) {
			el.value = safeValue;
			return;
		}
		el.textContent = safeValue;
	}

function setValueById(id, value)
	{

const el = document.getElementById(id);
		if (!el || !("value" in el)) return;
		el.value = value || "";
	}

async function handleRealjejuLogout()
	{

const homeBtn = Array.from(document.querySelectorAll(".topbar-menu-item")).find((btn) => {

const label = String(btn.textContent || "").trim();
				return label === "부동산 홈" || label === "홈";
			});
			if (homeBtn) homeBtn.classList.add("active");
		}

		forceGoHomeAfterLogout();

const supabaseForLogout = getRealjejuSupabaseClient();
		try {
			if (supabaseForLogout) await supabaseForLogout.auth.signOut();
		} catch (err) {
			console.warn("로그아웃 실패:", err);
		}
		sessionStorage.removeItem(REALJEJU_PROFILE_PROMPT_SESSION_KEY);
		applyLoggedOutAccountUI();
		forceGoHomeAfterLogout();
		setTimeout(forceGoHomeAfterLogout, 50);
		setTimeout(forceGoHomeAfterLogout, 250);
	}

async function initRealjejuAccountUI()
	{

const supabaseForInit = getRealjejuSupabaseClient();
		if (!supabaseForInit) {
			applyLoggedOutAccountUI();
			return;
		}
		try {
			const { data: userData } = await supabaseForInit.auth.getUser();

const user = userData && userData.user ? userData.user : null;
			if (!user) {
				applyLoggedOutAccountUI();
				return;
			}

const cachedProfile = readRealjejuCachedProfile(user.id);
			if (cachedProfile && cachedProfile.name) applyLoggedInAccountUI(user, cachedProfile);
			const { data: profile } = await supabaseForInit
				.from("profiles")
				.select("status, name, phone, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (profile && profile.status && profile.status !== "active") {
				clearRealjejuCachedProfile(user.id);
				await supabaseForInit.auth.signOut();
				applyLoggedOutAccountUI();
				return;
			}
			applyLoggedInAccountUI(user, profile);
			currentRealjejuAuthUser = user;

window.realjejuCurrentAuthUser = user;

const accountMenuItem = e.target.closest(".global-account-menu-item[data-account-action]");
		if (accountMenuItem && globalAccountDropdown && globalAccountDropdown.contains(accountMenuItem)) {
			e.preventDefault();
			e.stopImmediatePropagation();

const REALJEJU_SUPABASE_URL = window.REALJEJU_SUPABASE_URL || "https://jctovfrcvfosoowribej.supabase.co";

const REALJEJU_SUPABASE_PUBLIC_KEY = window.REALJEJU_SUPABASE_PUBLIC_KEY || "sb_publishable_IX_sRsjfEGdPin-kqtYGLw_FH0PPE2b";

const REALJEJU_AUTH_REDIRECT_URL = window.REALJEJU_AUTH_REDIRECT_URL || "https://realjeju.app";

let realjejuSupabaseClient = null;

function getRealjejuSupabaseClient()
	{
		if (realjejuSupabaseClient) return realjejuSupabaseClient;

const isUrlReady = REALJEJU_SUPABASE_URL && REALJEJU_SUPABASE_URL.startsWith("https://") && REALJEJU_SUPABASE_URL.includes(".supabase.co");

const isKeyReady = REALJEJU_SUPABASE_PUBLIC_KEY && REALJEJU_SUPABASE_PUBLIC_KEY.startsWith("sb_publishable_");
		if (!isUrlReady || !isKeyReady) return null;
		if (!window.supabase || typeof window.supabase.createClient !== "function") return null;
		realjejuSupabaseClient = window.supabase.createClient(REALJEJU_SUPABASE_URL, REALJEJU_SUPABASE_PUBLIC_KEY, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true
			}
		});
		return realjejuSupabaseClient;
	}

// PATCH 2.313: 매물 저장 등 다른 스크립트에서도 같은 Supabase 클라이언트를 쓰도록 전역 노출

window.getRealjejuSupabaseClient = getRealjejuSupabaseClient;

const TERMS_JSON_URLS = {
		service: "https://realjeju.app/terms/terms_of_service.json",
		location: "https://realjeju.app/terms/terms_location_service.json",
		privacy: "https://realjeju.app/terms/privacy_policy.json"
	};

const TERMS_HEADER_TITLES = {
		service: "서비스 이용약관",
		location: "위치기반 서비스 이용약관",
		privacy: "개인정보처리방침"
	};

function updateAuthBackVisibility(show)
	{
		if (!authModalBack) return;
		authModalBack.classList.toggle("visible", !!show);
		authModalBack.setAttribute("aria-hidden", show ? "false" : "true");
	}

function showAuthLoginScreen()
	{
		if (authModal) authModal.classList.remove("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(false);
		if (authLoginScreen) authLoginScreen.classList.remove("auth-screen-hidden");
	}

function showAuthSignupTermsScreen()
	{
		if (authModal) authModal.classList.remove("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(true);
		if (authSignupTermsScreen) authSignupTermsScreen.classList.remove("auth-screen-hidden");
	}

function showAuthSignupFormScreen()
	{
		if (authModal) authModal.classList.remove("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(true);
		if (authSignupFormScreen) authSignupFormScreen.classList.remove("auth-screen-hidden");
	}

function showAuthForgotPasswordScreen()
	{
		if (authModal) authModal.classList.remove("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(true);
		if (authForgotPasswordScreen) authForgotPasswordScreen.classList.remove("auth-screen-hidden");
		if (authForgotEmailInput && authEmailInput && authEmailInput.value) authForgotEmailInput.value = authEmailInput.value;
		setTimeout(() => { if (authForgotEmailInput) authForgotEmailInput.focus(); }, 0);
	}

function showAuthResetPasswordScreen()
	{
		if (authModal) authModal.classList.remove("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(true);
		if (authResetPasswordScreen) authResetPasswordScreen.classList.remove("auth-screen-hidden");
		setTimeout(() => { if (authResetPasswordInput) authResetPasswordInput.focus(); }, 0);
	}

function showAuthProfileSetupScreen()
	{
		if (authModal) authModal.classList.add("profile-page-mode");
		hideAllAuthScreens();
		updateAuthBackVisibility(false);
		if (authProfileSetupScreen) authProfileSetupScreen.classList.remove("auth-screen-hidden");
		setTimeout(() => { if (authProfileNameInput) authProfileNameInput.focus(); }, 0);
	}

const REALJEJU_DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";

function setProfileImageElement(img, url)
	{
		if (!img) return;
		img.src = url || REALJEJU_DEFAULT_PROFILE_IMAGE;
	}

function setAuthProfilePhotoPreview(url)
	{
		authProfilePhotoUrl = url || "";
		if (typeof window !== "undefined") window.authProfilePhotoUrl = authProfilePhotoUrl;
		setProfileImageElement(authProfilePhotoPreview, authProfilePhotoUrl);
	}

function setMyInfoProfileImage(url)
	{
		setProfileImageElement(document.getElementById("myInfoProfileImage"), url || "");
	}

function clearAuthProfilePhotoFile()
	{
		authProfilePhotoFile = null;
		if (authProfilePhotoInput) authProfilePhotoInput.value = "";
	}

async function uploadAuthProfilePhotoIfNeeded(client, userId)
	{
		if (!authProfilePhotoFile || !client || !userId) {
			return authProfilePhotoUrl || "";
		}

const ext = String(authProfilePhotoFile.name || "jpg")
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "") || "jpg";

const bucket = client.storage.from("profiles");

const filePath = `${userId}/profile-${Date.now()}.${ext}`;

		try {
			const { data, error } = await bucket.upload(filePath, authProfilePhotoFile, {
				cacheControl: "3600",
				upsert: true
			});

			if (error) {
				console.warn("프로필 사진 업로드 실패:", error);
				return authProfilePhotoUrl || "";
			}

const savedPath = data && data.path ? data.path : filePath;
			try {
				const { data: listData, error: listError } = await bucket.list(userId, { limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } });
				if (!listError && Array.isArray(listData)) {

window.uploadAuthProfilePhotoIfNeeded = uploadAuthProfilePhotoIfNeeded;

window.setAuthProfilePhotoPreview = setAuthProfilePhotoPreview;

window.setMyInfoProfileImage = setMyInfoProfileImage;

window.clearAuthProfilePhotoFile = clearAuthProfilePhotoFile;
	}

	if (authProfilePhotoSelectBtn && authProfilePhotoInput)
	{
		authProfilePhotoSelectBtn.addEventListener("click", () =>
		{
			authProfilePhotoInput.click();
		});

		authProfilePhotoInput.addEventListener("change", () =>
		{

const file = authProfilePhotoInput.files && authProfilePhotoInput.files[0] ? authProfilePhotoInput.files[0] : null;
			if (!file) return;

			if (!/^image\//.test(file.type || "")) {
				openAuthErrorModal("이미지 파일만 선택할 수 있습니다.", "프로필 사진", authProfilePhotoInput);
				authProfilePhotoInput.value = "";
				authProfilePhotoFile = null;
				return;
			}

			authProfilePhotoFile = file;

const reader = new FileReader();
			reader.onload = () =>
			{
				setProfileImageElement(authProfilePhotoPreview, reader.result);
			};
			reader.readAsDataURL(file);
		});
	}

function fillAuthProfileSetupForm(profile)
	{

const source = profile || {};
		if (authProfileNameInput) authProfileNameInput.value = source.name ? source.name : "";
		if (authProfilePhoneInput) authProfilePhoneInput.value = source.phone ? formatRealjejuPhoneInputValue(source.phone) : "";
		if (authProfileRoleRequestSelect) authProfileRoleRequestSelect.value = source.role_request ? source.role_request : "user";
		if (authProfilePrivacyAgreeCheck) authProfilePrivacyAgreeCheck.checked = false;
		if (authProfilePhotoInput) authProfilePhotoInput.value = "";
		authProfilePhotoFile = null;
		setAuthProfilePhotoPreview(source.profile_image || "");
	}

function openProfileSetupModalNow()
	{
		isRealjejuProfileSetupRequired = true;
		showAuthProfileSetupScreen();
		if (authModal) {
			authModal.classList.add("open");
			authModal.setAttribute("aria-hidden", "false");
			document.body.style.overflow = "hidden";
		}
	}

function requireProfileSetupIfNeeded(supabaseClient, user, profileData)
	{
		currentRealjejuAuthUser = user || null;

const profile = profileData || null;

const needsSetup = !profile || profile.profile_completed !== true || !profile.name || !profile.phone;
		currentRealjejuProfileCompleted = !needsSetup;
		if (needsSetup) fillAuthProfileSetupForm(profile);
		return needsSetup;
	}

function openAuthModal()
	{
		if (!authModal) return;
		showAuthLoginScreen();
		authModal.classList.add("open");
		authModal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
	}

function closeAuthModal()
	{
		if (!authModal) return;
		if (isAuthBusy() || isAuthErrorOpen()) return;
		if (authProfileSetupScreen && !authProfileSetupScreen.classList.contains("auth-screen-hidden")) {
			isRealjejuProfileSetupRequired = false;
			showAuthLoginScreen();
		}
		authModal.classList.remove("open");
		authModal.classList.remove("profile-page-mode");
		authModal.setAttribute("aria-hidden", "true");
		document.body.style.overflow = "";
	}

function openAuthErrorModal(message, title, returnFocusTarget, confirmAction)
	{
		if (!authErrorModal) return;
		/* PATCH: 개인정보 설정 전체페이지 위에서도 에러창이 반드시 보이도록 body 직속 + 최상단 레이어 고정 */
		if (authErrorModal.parentElement !== document.body) {
			document.body.appendChild(authErrorModal);
		}
		authErrorModal.style.zIndex = "200000";
		authErrorModal.classList.remove("confirm-mode");
		authErrorReturnFocusTarget = returnFocusTarget || authEmailInput || null;
		authErrorConfirmAction = typeof confirmAction === "function" ? confirmAction : null;
		authErrorCancelAction = null;
		if (authErrorTitle) authErrorTitle.textContent = title || "로그인 오류";
		if (authErrorMessage) authErrorMessage.textContent = message || "아이디와 비밀번호를 입력하세요.";
		if (authErrorConfirmBtn) authErrorConfirmBtn.textContent = "확인";
		authErrorModal.classList.add("open");
		authErrorModal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		setTimeout(() => {
			if (authErrorConfirmBtn) authErrorConfirmBtn.focus();
		}, 0);
	}

function openAuthConfirmModal(message, title, confirmAction, cancelAction)
	{
		if (!authErrorModal) return;
		if (authErrorModal.parentElement !== document.body) {
			document.body.appendChild(authErrorModal);
		}
		authErrorModal.style.zIndex = "200000";
		authErrorModal.classList.add("confirm-mode");
		authErrorReturnFocusTarget = null;
		authErrorConfirmAction = typeof confirmAction === "function" ? confirmAction : null;
		authErrorCancelAction = typeof cancelAction === "function" ? cancelAction : null;
		if (authErrorTitle) authErrorTitle.textContent = title || "확인";
		if (authErrorMessage) authErrorMessage.textContent = message || "";
		if (authErrorConfirmBtn) authErrorConfirmBtn.textContent = "확인";
		if (authErrorCancelBtn) authErrorCancelBtn.textContent = "취소";
		authErrorModal.classList.add("open");
		authErrorModal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		setTimeout(() => {
			if (authErrorConfirmBtn) authErrorConfirmBtn.focus();
		}, 0);
	}

function closeAuthErrorModal()
	{
		if (!authErrorModal) return;
		if (isAuthBusy()) return;

const focusTarget = authErrorReturnFocusTarget;

const confirmAction = authErrorConfirmAction;
		authErrorReturnFocusTarget = null;
		authErrorConfirmAction = null;
		authErrorCancelAction = null;

		/* PATCH: aria-hidden 적용 전 에러창 내부 포커스를 먼저 해제 */
		if (authErrorModal.contains(document.activeElement)) {
			document.activeElement.blur();
		}

		authErrorModal.classList.remove("open");
		authErrorModal.classList.remove("confirm-mode");
		authErrorModal.setAttribute("aria-hidden", "true");
		document.body.style.overflow = authModal && authModal.classList.contains("open") ? "hidden" : "";

		// PATCH 2.269: 확인 액션은 타이머로 미루지 않고 모달 닫힘 직후 같은 흐름에서 실행
		if (typeof confirmAction === "function") {

const result = confirmAction();
			if (result && typeof result.catch === "function") result.catch((error) => {
				console.warn("확인 모달 액션 실행 실패:", error);
			});
			return;
		}
		if (focusTarget && authModal && authModal.classList.contains("open")) {
			setTimeout(() => focusTarget.focus(), 0);
		}
	}

function maskRealjejuEmail(email)
	{

const value = String(email || "").trim();

const parts = value.split("@");
		if (parts.length !== 2 || !parts[0] || !parts[1]) return value || "re****@gmail.com";

const local = parts[0];

const visible = local.slice(0, Math.min(2, local.length));
		return visible + "****@" + parts[1];
	}

function isValidRealjejuPassword(password)
	{
		return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(password || ""));
	}

async function handleFindId()
	{

let email = String(authEmailInput?.value || "").trim();

const supabaseForFindId = getRealjejuSupabaseClient();
		if (!email && supabaseForFindId) {
			try {
				const { data } = await supabaseForFindId.auth.getUser();
				if (data && data.user && data.user.email) email = data.user.email;
			} catch (err) {
				console.warn("아이디 찾기 사용자 확인 실패:", err);
			}
		}
		openAuthErrorModal("아이디는 가입한 이메일 주소입니다.\n가입한 이메일을 확인해 주세요.\n\n" + maskRealjejuEmail(email), "아이디 찾기", authEmailInput);
	}

function syncAuthTermsState()
	{

const allChecked = authTermChecks.length > 0 && authTermChecks.every((check) => check.checked);
		if (authTermsNextBtn) {
			authTermsNextBtn.disabled = !allChecked;
			authTermsNextBtn.classList.toggle("enabled", allChecked);
		}
	}

function escapeTermsHtml(value)
	{
		return String(value == null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	}

function normalizeTermsData(data, key)
	{
		if (!data || typeof data !== "object") return { title: "서비스 이용약관", sections: [] };
		if (data[key] && typeof data[key] === "object") return data[key];
		if (data.service && typeof data.service === "object") return data.service;
		return data;
	}

function renderTermsContentHtml(content)
	{

let html = "";
		if (Array.isArray(content)) {
			content.forEach((line) => {
				if (line && typeof line === "object") {
					html += renderTermsArticleHtml(line);
				} else {
					html += "<p>" + escapeTermsHtml(line).replace(/\n/g, "<br>") + "</p>";
				}
			});
		} else if (content != null) {
			html += "<p>" + escapeTermsHtml(content).replace(/\n/g, "<br>") + "</p>";
		}
		return html;
	}

function renderTermsArticleHtml(article)
	{
		if (!article || typeof article !== "object") return "";

let html = "";
		if (article.title) html += "<h3>" + escapeTermsHtml(article.title) + "</h3>";
		html += renderTermsContentHtml(article.content);

const nestedArticles = Array.isArray(article.articles) ? article.articles : [];
		nestedArticles.forEach((nestedArticle) => {
			html += renderTermsArticleHtml(nestedArticle);
		});
		return html;
	}

function renderTermsFullHtml(term)
	{

let html = "";

const sections = Array.isArray(term && term.sections) ? term.sections : [];
		sections.forEach((section) => {
			if (!section || typeof section !== "object") return;
			if (section.title) html += "<h2>" + escapeTermsHtml(section.title) + "</h2>";

const articles = Array.isArray(section.articles) ? section.articles : [];
			articles.forEach((article) => {
				html += renderTermsArticleHtml(article);
			});
			if (!articles.length) html += renderTermsContentHtml(section.content);
		});
		if (!html && term) html += renderTermsContentHtml(term.content);
		return html || "<p>약관 내용을 불러오지 못했습니다.</p>";
	}

async function openTermsFullPage(key = "service")
	{
		if (!termsFullPage || !termsFullContent) return;
		currentTermsKey = key;

const url = TERMS_JSON_URLS[key];
		if (!url) return;
		termsFullPage.classList.add("open");
		termsFullPage.setAttribute("aria-hidden", "false");
		if (termsFullBody) termsFullBody.scrollTop = 0;

const fallbackHeaderTitle = TERMS_HEADER_TITLES[key] || "약관";
		if (termsFullHeaderTitle) termsFullHeaderTitle.textContent = fallbackHeaderTitle;
		if (termsFullMainTitle) termsFullMainTitle.textContent = fallbackHeaderTitle;
		termsFullContent.innerHTML = "<div class=\"terms-full-loading\">약관을 불러오는 중입니다.</div>";
		document.body.style.overflow = "hidden";
		try {

const requestUrl = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();

const rawText = await res.text();

const cleanedText = rawText.replace(/^\uFEFF/, "").trim();
			if (!cleanedText) throw new Error("EMPTY_TERMS_RESPONSE");

const data = JSON.parse(cleanedText);

const term = normalizeTermsData(data, key);

const title = (term && term.title) || fallbackHeaderTitle;
			if (termsFullHeaderTitle) termsFullHeaderTitle.textContent = fallbackHeaderTitle;
			if (termsFullMainTitle) termsFullMainTitle.textContent = title;
			termsFullContent.innerHTML = renderTermsFullHtml(term);
			if (termsFullBody) termsFullBody.scrollTop = 0;
		} catch (err) {
			console.error("약관 불러오기 실패:", err);
			termsFullContent.innerHTML = "<div class=\"terms-full-error\">약관을 불러오지 못했습니다.<br>개발자도구 콘솔에서 오류 내용을 확인하세요.</div>";
		}
	}

function closeTermsFullPage()
	{
		if (!termsFullPage) return;
		if (currentTermsKey) {

let isRealjejuLoggingIn = false;

let isRealjejuSigningUp = false;

function isAuthBusy()
	{
		return isRealjejuSigningUp === true || isRealjejuLoggingIn === true || isRealjejuSavingProfile === true;
	}

function isAuthErrorOpen()
	{
		return !!(authErrorModal && authErrorModal.classList.contains("open"));
	}

	if (authModalForm) {
		authModalForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (isRealjejuLoggingIn) return;

const emailValue = String(authEmailInput?.value || "").trim();

const passwordValue = String(authPasswordInput?.value || "").trim();
			if (!emailValue || !passwordValue) {
				openAuthErrorModal("아이디와 비밀번호를 입력하세요.", "로그인 오류", !emailValue ? authEmailInput : authPasswordInput);
				return;
			}

const loginSubmitBtn = authModalForm.querySelector(".auth-modal-submit");

const supabaseForLogin = getRealjejuSupabaseClient();
			if (!supabaseForLogin) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "로그인 오류", authEmailInput);
				return;
			}

			try {
				isRealjejuLoggingIn = true;
				if (loginSubmitBtn) {
					loginSubmitBtn.disabled = true;
				}
				const { data, error } = await supabaseForLogin.auth.signInWithPassword({
					email: emailValue,
					password: passwordValue
				});
				if (error) {
					openAuthErrorModal("아이디 또는 비밀번호가 올바르지 않습니다.", "로그인 오류", authEmailInput);
					return;
				}
				if (data && data.user) {
					const { data: profileData, error: profileError } = await supabaseForLogin
						.from("profiles")
						.select("status, name, phone, role_request, profile_completed, profile_image")
						.eq("id", data.user.id)
						.maybeSingle();

					if (profileError) {
						await supabaseForLogin.auth.signOut();
						openAuthErrorModal("회원 정보를 확인하지 못했습니다.", "로그인 오류", authEmailInput);
						return;
					}

					if (profileData && profileData.status && profileData.status !== "active") {
						await supabaseForLogin.auth.signOut();
						openAuthErrorModal("현재 이용할 수 없는 계정입니다.", "로그인 오류", authEmailInput);
						return;
					}

					if (authPasswordInput) authPasswordInput.value = "";
					isRealjejuLoggingIn = false;
					currentRealjejuProfileCompleted = !!(profileData && profileData.profile_completed === true && profileData.name && profileData.phone);
					applyLoggedInAccountUI(data.user, profileData);
					currentRealjejuAuthUser = data.user;
					closeAuthModal();
				}
			} catch (err) {
				console.error("로그인 실패:", err);
				openAuthErrorModal("로그인 처리 중 오류가 발생했습니다.", "로그인 오류", authEmailInput);
			} finally {
				isRealjejuLoggingIn = false;
				if (loginSubmitBtn) {
					loginSubmitBtn.disabled = false;
				}
			}
		});
	}


	if (authProfileSetupForm) {
		authProfileSetupForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (isRealjejuSavingProfile) return;

const profileNameValue = String(authProfileNameInput?.value || "").trim();

const profilePhoneValue = normalizeRealjejuPhone(authProfilePhoneInput?.value || "");

const profileRoleRequestValue = authProfileRoleRequestSelect ? authProfileRoleRequestSelect.value : "user";

			if (!profileNameValue) {
				openAuthErrorModal("이름을 입력하세요.", "개인정보 설정", authProfileNameInput);
				return;
			}
			if (!profilePhoneValue || profilePhoneValue.length < 10) {
				openAuthErrorModal("휴대폰번호를 입력하세요.", "개인정보 설정", authProfilePhoneInput);
				return;
			}
			if (!authProfilePrivacyAgreeCheck || !authProfilePrivacyAgreeCheck.checked) {
				openAuthErrorModal("개인정보 수집 및 이용에 동의해 주세요.", "개인정보 설정", authProfilePrivacyAgreeCheck);
				return;
			}

const supabaseForProfile = getRealjejuSupabaseClient();
			if (!supabaseForProfile) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "개인정보 설정", authProfileNameInput);
				return;
			}

let user = currentRealjejuAuthUser;
			syncAuthProfileEmail(user);
			if (!user) {
				const { data } = await supabaseForProfile.auth.getUser();
				user = data && data.user ? data.user : null;
			}
			if (!user || !user.id) {
				openAuthErrorModal("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", "개인정보 설정", authProfileNameInput);
				return;
			}

const profileSubmitBtn = authProfileSetupForm.querySelector(".auth-modal-submit");
			try {
				isRealjejuSavingProfile = true;
				if (profileSubmitBtn) profileSubmitBtn.disabled = true;

const authProfileSubmitBtn = authProfileSetupForm.querySelector(".auth-modal-submit");
		if (authProfileSubmitBtn) {
			authProfileSubmitBtn.addEventListener("click", (e) => {
				if (!authProfileSetupScreen || authProfileSetupScreen.classList.contains("auth-screen-hidden")) return;

const profileNameValue = String(authProfileNameInput?.value || "").trim();

const cancelAction = authErrorCancelAction;
			authErrorReturnFocusTarget = null;
			authErrorConfirmAction = null;
			authErrorCancelAction = null;
			if (authErrorModal.contains(document.activeElement)) {
				document.activeElement.blur();
			}
			authErrorModal.classList.remove("open");
			authErrorModal.classList.remove("confirm-mode");
			authErrorModal.setAttribute("aria-hidden", "true");
			document.body.style.overflow = authModal && authModal.classList.contains("open") ? "hidden" : "";
			// PATCH 2.269: 취소 액션도 별도 타이머 없이 즉시 실행해 모달 이후 흐름을 단순화
			if (typeof cancelAction === "function") {

const result = cancelAction();
				if (result && typeof result.catch === "function") result.catch((error) => {
					console.warn("확인 모달 취소 액션 실행 실패:", error);
				});
			}
		});
	}

	/* PATCH: 에러/안내창은 [확인] 버튼 외에는 닫히지 않음 */
	if (authErrorModal) {
		authErrorModal.addEventListener("click", (e) => {
			if (e.target === authErrorModal) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
	}

	if (authFindIdBtn) {
		authFindIdBtn.addEventListener("click", (e) => {
			e.preventDefault();
			handleFindId();
		});
	}

	if (authForgotPasswordOpenBtn) {
		authForgotPasswordOpenBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			showAuthForgotPasswordScreen();
		});
	}

	if (authForgotLoginSwitchBtn) {
		authForgotLoginSwitchBtn.addEventListener("click", (e) => {
			e.preventDefault();
			showAuthLoginScreen();
		});
	}

	if (authForgotPasswordForm) {
		authForgotPasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();

const forgotEmailValue = String(authForgotEmailInput?.value || "").trim();
			if (!forgotEmailValue) {
				openAuthErrorModal("가입한 이메일을 입력하세요.", "비밀번호 찾기", authForgotEmailInput);
				return;
			}

const forgotSubmitBtn = authForgotPasswordForm.querySelector(".auth-modal-submit");

const supabaseForForgot = getRealjejuSupabaseClient();
			if (!supabaseForForgot) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "비밀번호 찾기", authForgotEmailInput);
				return;
			}

			try {
				if (forgotSubmitBtn) forgotSubmitBtn.disabled = true;
				const { error } = await supabaseForForgot.auth.resetPasswordForEmail(forgotEmailValue, {
					redirectTo: REALJEJU_AUTH_REDIRECT_URL
				});
				if (error) {
					openAuthErrorModal(error.message || "비밀번호 재설정 메일 발송에 실패했습니다.", "비밀번호 찾기", authForgotEmailInput);
					return;
				}
				showAuthLoginScreen();
				if (authEmailInput) authEmailInput.value = forgotEmailValue;
				openAuthErrorModal("비밀번호 재설정 메일을 보냈습니다.\n이메일을 확인해 주세요.", "비밀번호 찾기", authEmailInput);
			} catch (err) {
				console.error("비밀번호 재설정 메일 발송 실패:", err);
				openAuthErrorModal("비밀번호 재설정 메일 발송 중 오류가 발생했습니다.", "비밀번호 찾기", authForgotEmailInput);
			} finally {
				if (forgotSubmitBtn) forgotSubmitBtn.disabled = false;
			}
		});
	}

	if (authResetPasswordForm) {
		authResetPasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();

const resetPasswordValue = String(authResetPasswordInput?.value || "").trim();

const resetPasswordConfirmValue = String(authResetPasswordConfirmInput?.value || "").trim();
			if (!resetPasswordValue || !resetPasswordConfirmValue) {
				openAuthErrorModal("새 비밀번호를 입력하세요.", "비밀번호 변경", !resetPasswordValue ? authResetPasswordInput : authResetPasswordConfirmInput);
				return;
			}
			if (!isValidRealjejuPassword(resetPasswordValue)) {
				openAuthErrorModal("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.", "비밀번호 변경", authResetPasswordInput);
				return;
			}
			if (resetPasswordValue !== resetPasswordConfirmValue) {
				openAuthErrorModal("비밀번호가 서로 다릅니다.", "비밀번호 변경", authResetPasswordConfirmInput);
				return;
			}

const resetSubmitBtn = authResetPasswordForm.querySelector(".auth-modal-submit");

const supabaseForReset = getRealjejuSupabaseClient();
			if (!supabaseForReset) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "비밀번호 변경", authResetPasswordInput);
				return;
			}

			try {
				if (resetSubmitBtn) resetSubmitBtn.disabled = true;
				const { error } = await supabaseForReset.auth.updateUser({
					password: resetPasswordValue
				});
				if (error) {
					openAuthErrorModal(error.message || "비밀번호 변경에 실패했습니다.", "비밀번호 변경", authResetPasswordInput);
					return;
				}
				if (authResetPasswordInput) authResetPasswordInput.value = "";
				if (authResetPasswordConfirmInput) authResetPasswordConfirmInput.value = "";
				await supabaseForReset.auth.signOut();
				showAuthLoginScreen();
				openAuthErrorModal("비밀번호가 변경되었습니다. 다시 로그인해 주세요.", "비밀번호 변경 완료", authEmailInput);
			} catch (err) {
				console.error("비밀번호 변경 실패:", err);
				openAuthErrorModal("비밀번호 변경 처리 중 오류가 발생했습니다.", "비밀번호 변경", authResetPasswordInput);
			} finally {
				if (resetSubmitBtn) resetSubmitBtn.disabled = false;
			}
		});
	}

	if (authSignupForm) {
		authSignupForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (isRealjejuSigningUp) return;

const signupEmailValue = String(authSignupEmailInput?.value || "").trim();

const signupPasswordValue = String(authSignupPasswordInput?.value || "").trim();

const signupPasswordConfirmValue = String(authSignupPasswordConfirmInput?.value || "").trim();
			if (!signupEmailValue || !signupPasswordValue || !signupPasswordConfirmValue) {
				openAuthErrorModal("아이디와 비밀번호를 입력하세요.", "회원가입 오류", !signupEmailValue ? authSignupEmailInput : (!signupPasswordValue ? authSignupPasswordInput : authSignupPasswordConfirmInput));
				return;
			}

			if (!isValidRealjejuPassword(signupPasswordValue)) {
				openAuthErrorModal("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.", "회원가입 오류", authSignupPasswordInput);
				return;
			}

			if (signupPasswordValue !== signupPasswordConfirmValue) {
				openAuthErrorModal("비밀번호가 서로 다릅니다.", "회원가입 오류", authSignupPasswordConfirmInput);
				return;
			}

const signupSubmitBtn = authSignupForm.querySelector(".auth-modal-submit");

const supabaseForSignup = getRealjejuSupabaseClient();
			if (!supabaseForSignup) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "회원가입 오류", authSignupEmailInput);
				return;
			}

			try {
				isRealjejuSigningUp = true;
				if (signupSubmitBtn) {
					signupSubmitBtn.disabled = true;
				}
				const { data, error } = await supabaseForSignup.auth.signUp({
					email: signupEmailValue,
					password: signupPasswordValue
				});
				if (error) {

const errorMessage = String(error.message || "");
					if (errorMessage.toLowerCase().includes("already") || errorMessage.includes("registered")) {
						openAuthErrorModal("이미 가입된 아이디입니다.", "회원가입 오류", authSignupEmailInput);
					} else {
						openAuthErrorModal(errorMessage || "회원가입에 실패했습니다.", "회원가입 오류", authSignupEmailInput);
					}
					return;
				}
				if (data && data.user) {
					if (authSignupPasswordInput) authSignupPasswordInput.value = "";
					if (authSignupPasswordConfirmInput) authSignupPasswordConfirmInput.value = "";
					showAuthLoginScreen();
					if (authEmailInput) authEmailInput.value = signupEmailValue;
					openAuthErrorModal("가입이 완료되었습니다. 이메일을 확인해 주세요.", "회원가입 완료", authEmailInput);
				}
			} catch (err) {
				console.error("회원가입 실패:", err);
				openAuthErrorModal("회원가입 처리 중 오류가 발생했습니다.", "회원가입 오류", authSignupEmailInput);
			} finally {
				isRealjejuSigningUp = false;
				if (signupSubmitBtn) {
					signupSubmitBtn.disabled = false;
				}
			}
		});
	}

	if (authSignupOpenBtn) {
		authSignupOpenBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			showAuthSignupTermsScreen();
			syncAuthTermsState();
		});
	}

	if (authLoginSwitchBtn) {
		authLoginSwitchBtn.addEventListener("click", (e) => {
			e.preventDefault();
			showAuthLoginScreen();
		});
	}

	if (authSignupFormLoginBtn) {
		authSignupFormLoginBtn.addEventListener("click", (e) => {
			e.preventDefault();
			showAuthLoginScreen();
		});
	}

	if (authTermsAllBtn) {
		authTermsAllBtn.addEventListener("click", (e) => {
			e.preventDefault();

const allChecked = authTermChecks.length > 0 && authTermChecks.every((check) => check.checked);
			authTermChecks.forEach((check) => {
				check.checked = !allChecked;
			});
			syncAuthTermsState();
		});
	}

	authTermChecks.forEach((check) => {
		check.addEventListener("change", syncAuthTermsState);
	});

	document.querySelectorAll(".auth-terms-open[data-terms-key]").forEach((el) => {
		el.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			openTermsFullPage(el.dataset.termsKey || "service");
		});
	});

	if (termsFullClose) {
		termsFullClose.addEventListener("click", (e) => {
			e.preventDefault();
			closeTermsFullPage();
		});
	}

	if (authTermsNextBtn) {
		authTermsNextBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (authTermsNextBtn.disabled) return;
			showAuthSignupFormScreen();
		});
	}

	/* PATCH: 에러/안내창 열린 상태에서는 Enter/ESC로 닫히지 않음 */
	window.addEventListener("keydown", (e) => {
		if (!authErrorModal || !authErrorModal.classList.contains("open")) return;
		if (e.key === "Enter" || e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
		}
	});

	setTimeout(() => {
		initRealjejuAccountUI();
	}, 700);

	setTimeout(async () => {

const hasRecoveryToken = window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery");
		if (!hasRecoveryToken) return;

const supabaseForRecovery = getRealjejuSupabaseClient();
		if (!supabaseForRecovery) return;
		try {
			await supabaseForRecovery.auth.getSession();
		} catch (err) {
			console.warn("비밀번호 재설정 세션 확인 실패:", err);
		}
		if (authModal) {
			authModal.classList.add("open");
			authModal.setAttribute("aria-hidden", "false");
			document.body.style.overflow = "hidden";
		}
		showAuthResetPasswordScreen();
	}, 500);

async function requireRealjejuProfileCompletedForFeature(featureName)
	{
		if (currentRealjejuProfileCompleted) return true;

const supabaseForFeature = getRealjejuSupabaseClient();
		if (!supabaseForFeature) {
			openAuthErrorModal("로그인 후 이용 가능합니다.", featureName || "이용 안내", null, openAuthModal);
			return false;
		}

let user = currentRealjejuAuthUser;
		if (!user) {
			try {
				const { data } = await supabaseForFeature.auth.getUser();
				user = data && data.user ? data.user : null;
			} catch (err) {
				user = null;
			}
		}
		if (!user || !user.id) {
			openAuthErrorModal("로그인 후 이용 가능합니다.", featureName || "이용 안내", null, openAuthModal);
			return false;
		}
		currentRealjejuAuthUser = user;
		try {
			const { data: profile } = await supabaseForFeature
				.from("profiles")
				.select("name, phone, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			currentRealjejuProfileCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
			if (currentRealjejuProfileCompleted) return true;
			fillAuthProfileSetupForm(profile);
		} catch (err) {
			console.warn("개인정보 설정 상태 확인 실패:", err);
		}
		openAuthErrorModal("개인정보 입력 후 이용 가능합니다.", featureName || "이용 안내", null, openProfileSetupModalNow);
		return false;
	}

	document.addEventListener("click", async (e) => {

const ok = await requireRealjejuProfileCompletedForFeature(target.dataset.featureName || target.textContent.trim() || "이용 안내");
		if (!ok) {
			e.preventDefault();
			e.stopPropagation();
		}
	}, true);

const myInfoEditProfileBtn = document.getElementById("myInfoEditProfileBtn");
	if (myInfoEditProfileBtn) {
		myInfoEditProfileBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openProfileSetupFromAccountMenu();
		});
	}

const myInfoCloseBtn = document.getElementById("myInfoCloseBtn");
	if (myInfoCloseBtn) {
		myInfoCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			closeAuthModal();
		});
	}

const authProfileCloseBtn = document.getElementById("authProfileCloseBtn");
	if (authProfileCloseBtn) {
		authProfileCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			closeAuthModal();
		});
	}

const queries = query.includes("제주") ? [query] : [query, `제주 ${query}`, `제주특별자치도 ${query}`];

		for (const q of queries) {

const user = userData && userData.user ? userData.user : null;
			if (!user) return openAuthModal();

const el = document.getElementById(id);
			if (el) el.value = "";
		});

const chk = document.getElementById("registrantLicensedAgentChk");

const manager = document.getElementById("registrantManagerNameInput");
		if (chk) chk.checked = false;
		if (manager) manager.disabled = true;
	}

function setPropertyRegistrantValue(id, value)
	{

const el = document.getElementById(id);
		if (el) el.value = value || "";
	}

async function loadPropertyRegistrantInfoDirect()
	{
		resetPropertyRegistrantInputs();

const client = getRealjejuSupabaseClient();
		if (!client) return;

		try
		{
			const { data: userData } = await client.auth.getUser();

const user = userData && userData.user ? userData.user : null;
			if (!user) return;

let profile = null;
			try
			{
				const { data: profileData } = await client
					.from("profiles")
					.select("name, phone, role_request")
					.eq("id", user.id)
					.maybeSingle();
				profile = profileData || null;

window.realjejuCurrentProfile = profile;
			}
			catch (profileError)
			{
				console.warn("매물등록 등록자 정보 profiles 조회 실패:", profileError);
			}

const el = document.getElementById(id);
			return el && String(el.value || "").trim() !== "";
		})) return true;

const propertyType = document.getElementById("propertyTypeSelect");
		if (propertyType && propertyType.value && propertyType.value !== "apartment") return true;

const buildingUse = document.getElementById("buildingUseSelect");
		if (buildingUse && buildingUse.value) return true;

const direction = document.getElementById("propertyDirectionSelect");
		if (direction && direction.value) return true;

// PATCH 2.268: 매물등록 화면의 실제 스크롤 컨테이너와 첫 콘텐츠를 같은 기준으로 맨 위에 맞춤

// PATCH 2.283: 확인 후에는 먼저 맨 위로 이동하고 열린 페이지에서 값만 즉시 초기화

const submitBtn = document.getElementById("propertySubmitBtn");

const propertyTypeSelect = document.getElementById("propertyTypeSelect");
		if (propertyTypeSelect) propertyTypeSelect.value = "apartment";

const maintenanceTab = document.querySelector('#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="fixed"]');
		if (maintenanceTab) maintenanceTab.click();
		["maintenanceElectricType", "maintenanceWaterType", "maintenanceGasType", "maintenanceHeatingType", "maintenanceInternetType", "maintenanceTvType"].forEach((name) => {

const radio = document.querySelector(`input[name="${name}"][value="usage"]`);
			if (radio) radio.checked = true;
		});

function formatPropertyNumber(value)
	{

const num = Number(value);
		if (!Number.isFinite(num)) return "";

const fixed = Math.round(num * 100) / 100;
		return String(fixed).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
	}

function formatPropertyCommaNumber(value)
	{

const digits = String(value || "").replace(/[^0-9]/g, "");
		return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
	}

// PATCH 2.215: 대지면적은 소수점을 유지하면서 3자리 콤마 표시

function parsePropertyDecimalNumber(value)
	{

const num = Number(String(value || "").replace(/,/g, ""));
		return Number.isFinite(num) ? num : 0;
	}

function formatPropertyDecimalComma(value)
	{

const raw = String(value || "").replace(/,/g, "").replace(/[^\d.]/g, "");
		if (!raw) return "";

const dotIndex = raw.indexOf(".");

const integerPart = dotIndex >= 0 ? raw.slice(0, dotIndex) : raw;

const decimalPart = dotIndex >= 0 ? raw.slice(dotIndex + 1).replace(/\./g, "") : "";

const formattedInteger = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
		return dotIndex >= 0 ? `${formattedInteger}.${decimalPart}` : formattedInteger;
	}

function formatPropertyManwonKorean(value)
	{

const manwon = Number(String(value || "").replace(/[^0-9]/g, ""));
		if (!Number.isFinite(manwon) || manwon < 10000) return "";

const eok = Math.floor(manwon / 10000);

const rest = manwon % 10000;

const inner = (eok ? `${formatPropertyCommaNumber(eok)}억` : "") + (rest ? ` ${formatPropertyCommaNumber(rest)}` : "");
		return `${inner.trim()}${rest ? "만원" : "원"}`;
	}

function updatePropertyMoneyKoreanHint(input)
	{
		if (!input || !input.id) return;

const hint = document.querySelector(`[data-money-korean-for="${CSS.escape(input.id)}"]`);
		if (hint) hint.textContent = formatPropertyManwonKorean(input.value);
		updatePropertyMoneyUnitPosition(input);
	}

function updatePropertyMoneyUnitPosition(input)
	{
		if (!input) return;

const wrap = input.closest(".property-money-input-wrap, .property-money-inline, .property-unit-input");
		if (!wrap) return;

const computed = window.getComputedStyle(input);

const text = String(input.value || "");

const canvas = updatePropertyMoneyUnitPosition.canvas || (updatePropertyMoneyUnitPosition.canvas = document.createElement("canvas"));

const context = canvas.getContext("2d");
		context.font = `${computed.fontStyle} ${computed.fontVariant} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

const textWidth = context.measureText(text || "0").width;

const paddingLeft = Number.parseFloat(computed.paddingLeft) || 0;

const maxLeft = Math.max(54, input.clientWidth - 210);

const nextLeft = Math.min(maxLeft, paddingLeft + textWidth + 6);
		wrap.style.setProperty("--money-unit-left", `${Math.round(nextLeft)}px`);
	}

function bindPropertyMoneyCommaInputs(root)
	{

const scope = root || document;

const ids = [
			"priceMonthlyDepositInput", "priceMonthlyRentInput", "priceSaleInput",
			"priceJeonseDepositInput", "priceYearlyDepositInput", "priceYearlyRentInput",
			"priceShortDepositInput", "priceShortRentInput", "propertyPremiumInput",
			"maintenanceFixedTotalInput", "maintenanceCommonInput", "maintenanceElectricInput",
			"maintenanceWaterInput", "maintenanceGasInput", "maintenanceHeatingInput",
			"maintenanceInternetInput", "maintenanceTvInput", "maintenanceEtcInput",
			"maintenanceTotalInput"
		];
		ids.forEach((id) => {

const input = scope.getElementById ? scope.getElementById(id) : scope.querySelector(`#${CSS.escape(id)}`);
			if (!input || input.dataset.commaBound === "1") return;
			input.dataset.commaBound = "1";
			input.setAttribute("inputmode", "numeric");
			input.addEventListener("input", () => {

const nextValue = formatPropertyCommaNumber(input.value);
				if (input.value !== nextValue) input.value = nextValue;
				updatePropertyMoneyKoreanHint(input);
			});
			if (input.value) input.value = formatPropertyCommaNumber(input.value);
			updatePropertyMoneyKoreanHint(input);
		});
	}

// PATCH 2.217: 금액 외 면적/세대수/주차대수 숫자 입력도 3자리 콤마 표시

function bindPropertyPlainNumberCommaInputs(root)
	{

const scope = root || document;
		scope.querySelectorAll(".property-comma-number-input, .property-comma-decimal-input").forEach((input) => {
			if (input.dataset.plainCommaBound === "1") return;
			input.dataset.plainCommaBound = "1";
			input.addEventListener("input", () => {

const formatter = input.classList.contains("property-comma-decimal-input")
					? formatPropertyDecimalComma
					: formatPropertyCommaNumber;

const nextValue = formatter(input.value);
				if (input.value !== nextValue) input.value = nextValue;
			});
			if (input.value) {

const formatter = input.classList.contains("property-comma-decimal-input")
					? formatPropertyDecimalComma
					: formatPropertyCommaNumber;
				input.value = formatter(input.value);
			}
		});
	}

function bindPropertyAreaAutoCalc()
	{
		document.querySelectorAll(".property-area-m2").forEach((input) => {
			if (input.dataset.areaBound === "1") return;
			input.dataset.areaBound = "1";
			input.addEventListener("input", () => {

const nextValue = formatPropertyDecimalComma(input.value);
				if (input.value !== nextValue) input.value = nextValue;

const target = document.getElementById(input.dataset.pyTarget || "");
				if (!target || target.dataset.locked === "1") return;
				target.dataset.locked = "1";
				target.value = input.value ? formatPropertyDecimalComma(formatPropertyNumber(parsePropertyDecimalNumber(input.value) / 3.305785)) : "";
				target.dataset.locked = "";
			});
		});

		document.querySelectorAll(".property-area-py").forEach((input) => {
			if (input.dataset.areaBound === "1") return;
			input.dataset.areaBound = "1";
			input.addEventListener("input", () => {

const nextValue = formatPropertyDecimalComma(input.value);
				if (input.value !== nextValue) input.value = nextValue;

const target = document.getElementById(input.dataset.m2Target || "");
				if (!target || target.dataset.locked === "1") return;
				target.dataset.locked = "1";
				target.value = input.value ? formatPropertyDecimalComma(formatPropertyNumber(parsePropertyDecimalNumber(input.value) * 3.305785)) : "";
				target.dataset.locked = "";
			});
		});
	}

function getPropertyPriceFieldHtml(type)
	{

// PATCH 2.212: 거래유형을 추가/해제해도 이미 입력한 가격 값은 유지

function collectPropertyPriceValues(baseValues)
	{

const priceInputIds = [
			"priceMonthlyDepositInput", "priceMonthlyRentInput", "priceSaleInput",
			"priceJeonseDepositInput", "priceYearlyDepositInput", "priceYearlyRentInput",
			"priceShortDepositInput", "priceShortRentInput"
		];
		return priceInputIds.reduce((values, id) => {

const input = document.getElementById(id);
			if (input) values[id] = input.value;
			return values;
		}, { ...(baseValues || {}) });
	}

function restorePropertyPriceValues(values)
	{
		if (!values || typeof values !== "object") return;
		Object.entries(values).forEach(([id, value]) => {

const input = document.getElementById(id);
			if (!input || value === undefined) return;
			input.value = value;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));
		});
	}

function renderPropertyPriceFields()
	{

const box = document.getElementById("propertyPriceDynamic");
		if (!box) return;

const previousValues = collectPropertyPriceValues(renderPropertyPriceFields.priceValues);
		renderPropertyPriceFields.priceValues = previousValues;

const propertyTypeSelect = document.getElementById("propertyTypeSelect");

const exclusiveAreaRow = document.getElementById("exclusiveAreaRow");

const supplyAreaRow = document.getElementById("supplyAreaRow");

const landAreaRow = document.getElementById("landAreaRow");

const landRoadRow = document.getElementById("landRoadRow");

const exclusiveAreaLabel = document.getElementById("exclusiveAreaLabel");

const supplyAreaLabel = document.getElementById("supplyAreaLabel");

const landAreaLabel = document.getElementById("landAreaLabel");
		if (!propertyTypeSelect || !exclusiveAreaRow || !supplyAreaRow || !landAreaRow || !landRoadRow || !exclusiveAreaLabel || !supplyAreaLabel || !landAreaLabel) return;

const type = propertyTypeSelect.value || "";
		exclusiveAreaRow.style.display = "grid";
		supplyAreaRow.style.display = "grid";
		landAreaRow.style.display = "none";
		landRoadRow.style.display = "none";
		if (exclusiveAreaRow.parentNode && landAreaRow.previousElementSibling !== supplyAreaRow) {
			exclusiveAreaRow.parentNode.insertBefore(landAreaRow, supplyAreaRow.nextSibling);
		}

let firstLabel = "전용 면적";

function updatePropertyInfoFieldsByType()
	{

const propertyTypeSelect = document.getElementById("propertyTypeSelect");

const infoCard = document.getElementById("propertyInfoCard");

const landInfoCard = document.getElementById("propertyLandInfoCard");

const maintenanceCard = document.getElementById("propertyMaintenanceCard");

const premiumCard = document.getElementById("propertyPremiumCard");
		if (!propertyTypeSelect || !infoCard || !landInfoCard) return;

const type = propertyTypeSelect.value || "";
		document.body.setAttribute("data-property-type", type);

const buildingTypes = ["building", "factory_warehouse"];

const noMaintenanceTypes = ["land", "hotel", "pension", "building", "factory_warehouse"];

		if (type === "land") {
			infoCard.classList.add("is-hidden");
			landInfoCard.classList.remove("is-hidden");
			if (maintenanceCard) maintenanceCard.classList.add("is-hidden");
			if (premiumCard) premiumCard.classList.remove("is-visible");
			syncPropertyCountRowsVisibility();
			return;
		}
		landInfoCard.classList.add("is-hidden");
		infoCard.classList.remove("is-hidden");
		if (premiumCard) premiumCard.classList.toggle("is-visible", type === "store");
		if (maintenanceCard) {
			maintenanceCard.classList.toggle("is-hidden", noMaintenanceTypes.includes(type));
		}

let mode = "residential";
		if (commercialTypes.includes(type)) mode = "commercial";
		else if (buildingTypes.includes(type)) mode = "building";
		else if (residentialTypes.includes(type)) mode = "residential";
		infoCard.dataset.infoMode = mode;

const wholeFloorTypes = ["house", "multi_family_house", "building", "factory_warehouse"];
		infoCard.dataset.infoFloorMode = wholeFloorTypes.includes(type) ? "whole" : "level";

		syncPropertyCountRowsVisibility();
		updateBuildingUseLivingAccommodationBadge();
	}

// PATCH 2.259: 총점포수/총세대수 행 표시는 입력값 유무만 기준으로 한곳에서 처리

function hasPropertyCountValue(inputId)
	{

const input = document.getElementById(inputId);
		return !!String(input && input.value ? input.value : "").replace(/[^0-9]/g, "");
	}

function updatePropertyCountRowVisibility(rowId, inputId, visible)
	{

const row = document.getElementById(rowId);
		if (!row) return;

const shouldShow = !!visible || hasPropertyCountValue(inputId);
		row.classList.toggle("is-visible", shouldShow);
		row.setAttribute("aria-hidden", shouldShow ? "false" : "true");
	}

function syncPropertyCountRowsVisibility(options)
	{

const config = options || {};
		updatePropertyCountRowVisibility("propertyStoreCountRow", "propertyStoreCountInput", !!config.store);
		updatePropertyCountRowVisibility("propertyHouseholdCountRow", "propertyHouseholdCountInput", !!config.household);
	}

window.realjejuSyncPropertyCountRowsVisibility = syncPropertyCountRowsVisibility;

// PATCH 2.247: 건축물용도 오른쪽 보조 문구는 원룸/투룸 + 숙박시설 조합에서만 표시

function updateBuildingUseLivingAccommodationBadge()
	{

const propertyTypeSelect = document.getElementById("propertyTypeSelect");

const buildingUseSelect = document.getElementById("buildingUseSelect");

const badge = document.getElementById("buildingUseLivingAccommodationBadge");
		if (!propertyTypeSelect || !buildingUseSelect || !badge) return;

const shouldShow = propertyTypeSelect.value === "room" && buildingUseSelect.value === "숙박시설";
		badge.classList.toggle("is-visible", shouldShow);
	}

const selected = document.querySelector('input[name="propertyParking"]:checked');
		if (!box) return;
		box.classList.toggle("open", !!selected && selected.value === "possible");
	}

// PATCH 2.295: 방/욕실 해당없음 체크 시 입력칸을 비우고 비활성화

function updatePropertyRoomBathNotApplicable()
	{

const checkbox = document.getElementById("propertyRoomBathNotApplicableChk");

const roomInput = document.getElementById("propertyRoomCountInput");

const bathInput = document.getElementById("propertyBathCountInput");
		if (!checkbox || !roomInput || !bathInput) return;

const isDisabled = checkbox.checked;
		[roomInput, bathInput].forEach((input) => {
			input.disabled = isDisabled;
			if (isDisabled && input.value) {
				input.value = "";
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
			}
		});
	}

// PATCH 2.300: 방/욕실 value가 비어 있고 placeholder가 0인 화면 상태도 0으로 간주

function syncPropertyRoomBathZeroState()
	{

const checkbox = document.getElementById("propertyRoomBathNotApplicableChk");

const roomInput = document.getElementById("propertyRoomCountInput");

const bathInput = document.getElementById("propertyBathCountInput");
		if (!checkbox || !roomInput || !bathInput || checkbox.checked) return;

const visibleNumberValue = (input) => {

const raw = String(input.value || "").replace(/,/g, "").trim();
			if (raw) return raw;
			return String(input.getAttribute("placeholder") || "").replace(/,/g, "").trim();
		};

const roomValue = visibleNumberValue(roomInput);

const bathValue = visibleNumberValue(bathInput);
		if (roomValue === "0" && bathValue === "0") {
			checkbox.checked = true;
			updatePropertyRoomBathNotApplicable();
		}
	}

window.realjejuSyncPropertyRoomBathZeroState = syncPropertyRoomBathZeroState;

function bindPropertyRoomBathNotApplicable()
	{

const checkbox = document.getElementById("propertyRoomBathNotApplicableChk");

const roomInput = document.getElementById("propertyRoomCountInput");

const bathInput = document.getElementById("propertyBathCountInput");
		if (!checkbox || !roomInput || !bathInput) return;
		if (checkbox.dataset.roomBathNaBound !== "1") {
			checkbox.dataset.roomBathNaBound = "1";
			checkbox.addEventListener("change", updatePropertyRoomBathNotApplicable);
		}
		[roomInput, bathInput].forEach((input) => {
			if (input.dataset.roomBathNaBound === "1") return;
			input.dataset.roomBathNaBound = "1";
			input.addEventListener("input", () => {
				if (input.value && checkbox.checked) {
					checkbox.checked = false;
					updatePropertyRoomBathNotApplicable();
				}
				syncPropertyRoomBathZeroState();
			});
			input.addEventListener("change", syncPropertyRoomBathZeroState);
		});
		syncPropertyRoomBathZeroState();
		updatePropertyRoomBathNotApplicable();
	}

function clearPropertyFloorLevelRadios()
	{
		document.querySelectorAll('input[name="propertyFloorLevel"]').forEach((radio) => {
			radio.checked = false;
		});
	}

function bindPropertyFloorExclusiveOptions()
	{

const basementCheck = document.getElementById("propertyBasementCheck");

const semiBasementCheck = document.getElementById("propertySemiBasementCheck");

const levelUseCheck = document.getElementById("propertyFloorLevelUseCheck");

const wholeBuildingCheck = document.getElementById("propertyWholeBuildingCheck");

const levelRadios = Array.from(document.querySelectorAll('input[name="propertyFloorLevel"]'));
		if (!basementCheck || !semiBasementCheck || !levelUseCheck) return;

const clearBasementOptions = () => {
			basementCheck.checked = false;
			semiBasementCheck.checked = false;
		};

const clearLevelOptions = () => {
			levelUseCheck.checked = false;
			clearPropertyFloorLevelRadios();
		};

		if (basementCheck.dataset.exclusiveBound !== "1") {
			basementCheck.dataset.exclusiveBound = "1";
			basementCheck.addEventListener("change", () => {
				if (!basementCheck.checked) return;
				semiBasementCheck.checked = false;
				clearLevelOptions();
				if (wholeBuildingCheck) wholeBuildingCheck.checked = false;
				updatePropertyFloorLevelRadioState();
			});
		}

		if (semiBasementCheck.dataset.exclusiveBound !== "1") {
			semiBasementCheck.dataset.exclusiveBound = "1";
			semiBasementCheck.addEventListener("change", () => {
				if (!semiBasementCheck.checked) return;
				basementCheck.checked = false;
				clearLevelOptions();
				if (wholeBuildingCheck) wholeBuildingCheck.checked = false;
				updatePropertyFloorLevelRadioState();
			});
		}

		if (levelUseCheck.dataset.exclusiveBound !== "1") {
			levelUseCheck.dataset.exclusiveBound = "1";
			levelUseCheck.addEventListener("change", () => {
				if (levelUseCheck.checked) {
					clearBasementOptions();
					if (wholeBuildingCheck) wholeBuildingCheck.checked = false;
				} else {
					clearPropertyFloorLevelRadios();
				}
				updatePropertyFloorLevelRadioState();
			});
		}

		levelRadios.forEach((radio) => {
			if (radio.dataset.exclusiveBound === "1") return;
			radio.dataset.exclusiveBound = "1";
			radio.addEventListener("change", () => {
				if (!radio.checked) return;
				clearBasementOptions();
				levelUseCheck.checked = true;
				if (wholeBuildingCheck) wholeBuildingCheck.checked = false;
				updatePropertyFloorLevelRadioState();
			});
		});

		if (wholeBuildingCheck && wholeBuildingCheck.dataset.exclusiveBound !== "1") {
			wholeBuildingCheck.dataset.exclusiveBound = "1";
			wholeBuildingCheck.addEventListener("change", () => {
				if (!wholeBuildingCheck.checked) return;
				clearBasementOptions();
				clearLevelOptions();
				updatePropertyFloorLevelRadioState();
			});
		}
		updatePropertyFloorLevelRadioState();
	}

function updatePropertyFloorLevelRadioState()
	{

const levelUseCheck = document.getElementById("propertyFloorLevelUseCheck");

const levelRadios = Array.from(document.querySelectorAll('input[name="propertyFloorLevel"]'));
		if (!levelUseCheck || !levelRadios.length) return;
		levelRadios.forEach((radio) => {
			radio.disabled = !levelUseCheck.checked;
			if (!levelUseCheck.checked) radio.checked = false;
		});
	}

function updatePropertyPetVisibilityByDeal()
	{

const infoCard = document.getElementById("propertyInfoCard");
		if (!infoCard) return;

const isSale = Array.from(document.querySelectorAll(".property-deal-check")).some((input) => input.checked && input.value === "sale");
		infoCard.classList.toggle("is-sale-deal", isSale);
	}

// PATCH 2.234: 대출/반려동물은 값이 없으면 항상 확인 필요를 기본 선택

function ensureDefaultCheckRadios()
	{
		if (!radioValue("propertyLoan")) setRadio("propertyLoan", "check");
		if (!radioValue("propertyPet")) setRadio("propertyPet", "check");
	}

// PATCH 2.308: 사진은 최대 20장까지 등록하고 카운터를 한곳에서 갱신

const PROPERTY_PHOTO_MAX_COUNT = 20;

// PATCH 2.303: 사진 드래그/선택 파일을 하단 썸네일로 바로 보여줌

const propertyPhotoPreviewState = {
		items: [],
		nextId: 1,
		draggingId: null
	};

// PATCH 2.358: 수정 화면에서 기존 사진과 새로 선택한 파일을 같은 썸네일 목록으로 관리

function syncPropertyPhotoFiles()
	{

function clearPropertyPhotoDropTarget()
	{
		document.querySelectorAll(".property-photo-preview-item.is-drop-target").forEach((el) => {
			el.classList.remove("is-drop-target");
		});
	}

function reorderPropertyPhotoPreview(dragId, targetId)
	{

const fromIndex = propertyPhotoPreviewState.items.findIndex((photo) => photo.id === dragId);

const toIndex = propertyPhotoPreviewState.items.findIndex((photo) => photo.id === targetId);
		if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
		const [moving] = propertyPhotoPreviewState.items.splice(fromIndex, 1);
		propertyPhotoPreviewState.items.splice(toIndex, 0, moving);
		syncPropertyPhotoFiles();
		renderPropertyPhotoPreview();
	}

function renderPropertyPhotoPreview()
	{

const grid = document.getElementById("propertyPhotoPreviewGrid");

const uploadBox = document.getElementById("propertyPhotoUploadBox");

const count = document.getElementById("propertyPhotoCount");
		if (!grid) return;
		grid.innerHTML = "";
		grid.classList.toggle("is-hidden", propertyPhotoPreviewState.items.length === 0);
		if (uploadBox) uploadBox.classList.toggle("has-photo-preview", propertyPhotoPreviewState.items.length > 0);
		if (count) count.textContent = `(${propertyPhotoPreviewState.items.length}/${PROPERTY_PHOTO_MAX_COUNT})`;
		propertyPhotoPreviewState.items.forEach((item) => {

const box = document.createElement("div");
			box.className = "property-photo-preview-item";
			box.dataset.photoId = String(item.id);
			box.draggable = true;
			box.setAttribute("aria-label", "사진 순서 변경");
			box.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
			});

			box.addEventListener("dragstart", (event) => {
				propertyPhotoPreviewState.draggingId = item.id;
				box.classList.add("is-dragging");
				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData("text/plain", String(item.id));
			});
			box.addEventListener("dragover", (event) => {
				event.preventDefault();
				if (propertyPhotoPreviewState.draggingId && propertyPhotoPreviewState.draggingId !== item.id) {
					clearPropertyPhotoDropTarget();
					box.classList.add("is-drop-target");
					event.dataTransfer.dropEffect = "move";
				}
			});
			box.addEventListener("dragleave", () => {
				box.classList.remove("is-drop-target");
			});
			box.addEventListener("drop", (event) => {
				event.preventDefault();
				event.stopPropagation();

const dragId = Number(event.dataTransfer.getData("text/plain") || propertyPhotoPreviewState.draggingId);
				clearPropertyPhotoDropTarget();
				reorderPropertyPhotoPreview(dragId, item.id);
				propertyPhotoPreviewState.draggingId = null;
			});
			box.addEventListener("dragend", () => {
				propertyPhotoPreviewState.draggingId = null;
				box.classList.remove("is-dragging");
				clearPropertyPhotoDropTarget();
			});

const img = document.createElement("img");
			img.src = item.url;
			img.alt = item.file?.name || item.name || item.existingPhoto?.name || "매물 사진";
			img.draggable = false;

const removeBtn = document.createElement("button");
			removeBtn.type = "button";
			removeBtn.className = "property-photo-remove-btn";
			removeBtn.setAttribute("aria-label", "사진 삭제");
			removeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
			removeBtn.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (item.objectUrl) URL.revokeObjectURL(item.url);
				propertyPhotoPreviewState.items = propertyPhotoPreviewState.items.filter((photo) => photo.id !== item.id);
				syncPropertyPhotoFiles();
				renderPropertyPhotoPreview();
			});

const name = document.createElement("div");
			name.className = "property-photo-preview-name";
			name.textContent = item.file?.name || item.name || item.existingPhoto?.original_name || item.existingPhoto?.name || "사진";

			box.appendChild(img);
			box.appendChild(removeBtn);
			box.appendChild(name);
			grid.appendChild(box);
		});
	}

function addPropertyPhotoFiles(files)
	{

const imageFiles = Array.from(files || []).filter((file) => {
			return /^image\//.test(file.type || "") || /\.(jpe?g|png|gif|webp|bmp|heic|heif)$/i.test(file.name || "");
		});
		if (!imageFiles.length) return;

const remainingCount = PROPERTY_PHOTO_MAX_COUNT - propertyPhotoPreviewState.items.length;
		if (remainingCount <= 0) {
			if (typeof openAuthErrorModal === "function") openAuthErrorModal("사진은 최대 20장까지 등록할 수 있습니다.", "사진 등록", null);
			return;
		}

const filesToAdd = imageFiles.slice(0, remainingCount);
		filesToAdd.forEach((file) => {
			propertyPhotoPreviewState.items.push({
				id: propertyPhotoPreviewState.nextId++,
				file,
				url: URL.createObjectURL(file),
				objectUrl: true,
				name: file.name || "사진"
			});
		});
		syncPropertyPhotoFiles();
		renderPropertyPhotoPreview();
		// PATCH 2.310: 사진 제한 안내 문구는 한 문장만 표시
		if (imageFiles.length > remainingCount && typeof openAuthErrorModal === "function") openAuthErrorModal("사진은 최대 20장까지 등록할 수 있습니다.", "사진 등록", null);
	}

function clearPropertyPhotoPreview()
	{
		propertyPhotoPreviewState.items.forEach((item) => { if (item.objectUrl) URL.revokeObjectURL(item.url); });
		propertyPhotoPreviewState.items = [];
		propertyPhotoPreviewState.draggingId = null;
		syncPropertyPhotoFiles();

const input = document.getElementById("propertyPhotoUploadInput");
		if (input) input.value = "";
		renderPropertyPhotoPreview();
	}

window.realjejuClearPropertyPhotoPreview = clearPropertyPhotoPreview;

// PATCH 2.358: 매물 수정 진입 시 DB에 저장된 사진을 하단 사진 미리보기 영역에 복원

function loadPropertyPhotoPreviewFromPhotos(photos)
	{
		clearPropertyPhotoPreview();

const rows = Array.isArray(photos) ? photos : [];
		rows.forEach((photo) => {
			if (!photo) return;

const url = String(photo.url || photo.publicUrl || "").trim();
			if (!url) return;
			propertyPhotoPreviewState.items.push({
				id: propertyPhotoPreviewState.nextId++,
				url,
				objectUrl: false,
				name: photo.original_name || photo.name || "저장된 사진",
				existingPhoto: { ...photo, url }
			});
		});
		syncPropertyPhotoFiles();
		renderPropertyPhotoPreview();
	}

window.realjejuLoadPropertyPhotoPreviewFromPhotos = loadPropertyPhotoPreviewFromPhotos;

function bindPropertyPhotoPreviewUpload()
	{

const uploadBox = document.getElementById("propertyPhotoUploadBox");

const input = document.getElementById("propertyPhotoUploadInput");

const selectBtn = document.getElementById("propertyPhotoSelectBtn");
		if (!uploadBox || !input || uploadBox.dataset.photoPreviewBound === "1") return;
		uploadBox.dataset.photoPreviewBound = "1";

		if (selectBtn) {
			selectBtn.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				input.click();
			});
		}

		input.addEventListener("change", () => {
			addPropertyPhotoFiles(input.files);
			input.value = "";
		});

		["dragenter", "dragover"].forEach((type) => {
			uploadBox.addEventListener(type, (event) => {
				event.preventDefault();
				if (propertyPhotoPreviewState.draggingId) return;
				uploadBox.classList.add("is-dragover");
			});
		});

		["dragleave", "drop"].forEach((type) => {
			uploadBox.addEventListener(type, () => {
				uploadBox.classList.remove("is-dragover");
			});
		});

		uploadBox.addEventListener("drop", (event) => {
			event.preventDefault();
			addPropertyPhotoFiles(event.dataTransfer ? event.dataTransfer.files : []);
		});
	}

const num = Number(value);
		if (!Number.isFinite(num) || num <= 0) return "";
		return num.toLocaleString("ko-KR");
	}

const labels = { sale: "매매", jeonse: "전세", monthly: "월세", yearly: "년세", short: "단기" };
		return labels[deal] || deal || "-";
	}

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

const prices = payload.prices || {};

const price = [deposit, rent].filter(Boolean).join(" / ");
			return price ? `월세 ${price}` : "-";
		}
		if (deals.includes("yearly")) {

const price = [deposit, rent].filter(Boolean).join(" / ");
			return price ? `년세 ${price}` : "-";
		}
		if (deals.includes("short")) {

const price = [deposit, rent].filter(Boolean).join(" / ");
			return price ? `단기 ${price}` : "-";
		}
		return "-";
	}

const photos = Array.isArray(row.photos) ? row.photos : [];

const first = photos.find((photo) => photo && (photo.url || photo.publicUrl));

const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";

const yy = String(date.getFullYear()).slice(2);

const mm = String(date.getMonth() + 1).padStart(2, "0");

const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}.${mm}.${dd}`;
	}

// PATCH 2.349: 현재날짜 갱신은 updated_at을 바꾸므로 목록 날짜도 갱신일 기준으로 표시한다

// PATCH 2.353: 현재날짜 갱신 사용건수는 payload 안에 날짜별로 누적해 오늘치만 합산한다

const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "";

const yyyy = String(date.getFullYear());

const mm = String(date.getMonth() + 1).padStart(2, "0");

const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

const counts = payload.relist_usage_by_date && typeof payload.relist_usage_by_date === "object" ? payload.relist_usage_by_date : {};

const count = Number(counts[dateKey]);
		return Number.isFinite(count) && count > 0 ? count : 0;
	}

// PATCH 2.340: DB status 제약을 건드리지 않고 거래완료 상태는 payload 관리상태로 판별한다

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

const match = source.match(/(?:매물번호\s*[:：]?\s*)?([가-힣A-Za-z]{1,4}[-\s]?\d{2,5})/);
		if (match) return match[1].replace(/\s+/g, "");
		return String(row?.id || "").slice(0, 8) || "-";
	}

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

// PATCH 2.343: 삭제는 즉시 DB 삭제하지 않고 휴지통으로 이동하며, 영구삭제만 실제 삭제한다

const id = String(listingId || "").trim();
		if (!id || !action) return;

const user = currentRealjejuAuthUser;

const nowIso = new Date().toISOString();
			if (action === "permanent_delete") {
				const { error } = await client
					.from("property_listings")
					.delete()
					.eq("id", id)
					.eq("user_id", user.id);
				if (error) throw error;
			}
			else {

const update = { updated_at: nowIso };

const payload = row && row.payload && typeof row.payload === "object" ? { ...row.payload } : {};
				if (action === "refresh") {

const relistCounts = payload.relist_usage_by_date && typeof payload.relist_usage_by_date === "object" ? { ...payload.relist_usage_by_date } : {};

const propertySelect = document.getElementById("propertyTypeSelect");
		if (propertyMenu && propertySelect) {

const propertySelect = document.getElementById("propertyTypeSelect");

const propertyValues = Array.from(filters.property || []);

const dealValues = Array.from(filters.deal || []);

const values = filters[type] instanceof Set ? filters[type] : new Set();
			input.checked = values.has(input.dataset.value || "");

const deadline = Date.now() - (7 * 24 * 60 * 60 * 1000);

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

const el = document.getElementById(id);
		if (!el || value === undefined || value === null) return;
		el.value = String(value);
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

const select = document.getElementById(id);
		if (!select || value === undefined || value === null) return;
		select.value = String(value || "");

const wrap = select.closest("[data-register-dropdown]");
		if (wrap) {

const label = wrap.querySelector("[data-register-dropdown-label]");

const radio = document.querySelector(`input[name="${name}"][value="${CSS.escape(String(value || ""))}"]`);
		if (!radio) return;
		radio.checked = true;
		radio.dispatchEvent(new Event("change", { bubbles: true }));
	}

const el = document.getElementById(id);
		if (!el) return;
		el.checked = !!checked;
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

// PATCH 2.322: 저장 당시 폼 상태가 있으면 수정 화면에서 빠진 항목 없이 우선 복원

const tab = document.querySelector(`#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="${CSS.escape(String(type || "fixed"))}"]`);
		if (tab) tab.click();
	}

// PATCH 2.322: 기존 저장 데이터의 관리비 탭과 세부 체크값을 수정 화면에 다시 표시

const maintenanceType = maintenance.type || "fixed";
		// PATCH 2.323: 기존 저장분에 부과기준 값이 없으면 기타 부과 기본값으로 복원

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};

const prices = payload.prices || {};

const areas = payload.areas || {};

const building = payload.building || {};

const rooms = payload.rooms || {};

const floors = payload.floors || {};

const moveIn = payload.move_in || {};

const registrant = payload.registrant || {};

const address = payload.address || {};

const status = row.status || "pending";

const isClosed = effectiveStatus === "closed";

const isHidden = effectiveStatus === "hidden" || effectiveStatus === "archive";

const isDeleted = effectiveStatus === "deleted";

const closedAction = isClosed ? "published" : "closed";
				// PATCH 2.341: 상태별 관리 메뉴 문구를 현재 화면 맥락에 맞춰 명확하게 표시

const closedLabel = isClosed ? "거래중으로 변경" : "거래완료";

const hiddenAction = isHidden ? "published" : "hidden";

const hiddenLabel = isHidden ? "숨김해제" : "숨김";

const restoreOrClosedAction = isDeleted ? "published" : closedAction;

const restoreOrClosedLabel = isDeleted ? "복원" : closedLabel;

const deleteAction = isDeleted ? "permanent_delete" : "delete";

const list = Array.isArray(rows) ? rows : [];

const usageCount = Math.min(tradingCount, 100);

const premiumCount = 0;
		// PATCH 2.353: 오늘 현재날짜 갱신 사용건수를 매물 payload에서 합산한다

const setText = (id, text) => {

const el = document.getElementById(id);
			if (el) el.textContent = text;
		};

const setWidth = (id, value, max) => {

const el = document.getElementById(id);
			if (el) el.style.width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
		};

const id = String(listingId || "").trim();
		if (!id) return;

const user = currentRealjejuAuthUser;

const topbarBtn = e.target.closest(".topbar-menu-item");
		if (!topbarBtn) return;
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.remove("active");
		});
		topbarBtn.classList.add("active");
	}, true);

const menu = document.getElementById(menuId);

window.openAuthModal = openAuthModal;

window.openAuthErrorModal = openAuthErrorModal;

window.openAuthConfirmModal = openAuthConfirmModal;

window.closeAuthErrorModal = closeAuthErrorModal;

window.requireRealjejuProfileCompletedForFeature = requireRealjejuProfileCompletedForFeature;

window.handleRealjejuLogout = handleRealjejuLogout;

window.openTermsFullPage = openTermsFullPage;

window.closeTermsFullPage = closeTermsFullPage;
})();

/* PATCH: auth modal dialog 내부 클릭은 overlay로 전파하지 않음 */
document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".auth-modal-dialog").forEach(function (dialog) {
		dialog.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	});
});

/* PATCH: 개인정보 설정 저장 버튼 강제 연결 - submit 이벤트 미동작 대비 */
(function () {

const SUPABASE_URL = window.REALJEJU_SUPABASE_URL || "https://jctovfrcvfosoowribej.supabase.co";

const SUPABASE_PUBLIC_KEY = window.REALJEJU_SUPABASE_PUBLIC_KEY || "sb_publishable_IX_sRsjfEGdPin-kqtYGLw_FH0PPE2b";

let fallbackSupabaseClient = null;

function qs(id) { return document.getElementById(id); }

function normalizePhone(value) { return String(value || "").replace(/[^0-9]/g, ""); }

function getClient() {
		if (fallbackSupabaseClient) return fallbackSupabaseClient;
		if (!window.supabase || typeof window.supabase.createClient !== "function") return null;
		fallbackSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
		return fallbackSupabaseClient;
	}

function showProfileError(message, focusTarget) {

const modal = qs("authErrorModal");

const title = qs("authErrorTitle");

const body = qs("authErrorMessage");

const confirm = qs("authErrorConfirmBtn");
		if (!modal) { alert(message); if (focusTarget && focusTarget.focus) focusTarget.focus(); return; }
		if (modal.parentElement !== document.body) document.body.appendChild(modal);
		modal.style.zIndex = "300000";
		if (title) title.textContent = "개인정보 설정";
		if (body) body.textContent = message;
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		if (confirm) {
			confirm.onclick = function (ev) {
				ev.preventDefault();
				modal.classList.remove("open");
				modal.setAttribute("aria-hidden", "true");
				document.body.style.overflow = qs("authModal") && qs("authModal").classList.contains("open") ? "hidden" : "";
				if (focusTarget && focusTarget.focus) setTimeout(() => focusTarget.focus(), 0);
			};
			setTimeout(() => confirm.focus(), 0);
		}
	}

function formatFallbackPhoneInputValue(value) {

const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
		if (digits.length <= 3) return digits;
		if (digits.length <= 7) return digits.slice(0, 3) + "-" + digits.slice(3);
		return digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
	}

const fallbackPhoneInput = qs("authProfilePhoneInput");
	if (fallbackPhoneInput && fallbackPhoneInput.dataset.phoneAutoHyphenBound !== "1") {
		fallbackPhoneInput.dataset.phoneAutoHyphenBound = "1";
		fallbackPhoneInput.setAttribute("inputmode", "numeric");
		fallbackPhoneInput.setAttribute("maxlength", "13");
		fallbackPhoneInput.addEventListener("input", function(e) {
			e.target.value = formatFallbackPhoneInputValue(e.target.value);
		});
		fallbackPhoneInput.addEventListener("blur", function(e) {
			e.target.value = formatFallbackPhoneInputValue(e.target.value);
		});
	}

async function saveProfile(e) {
		if (e) { e.preventDefault(); e.stopPropagation(); }

const screen = qs("authProfileSetupScreen");
		if (screen && screen.classList.contains("auth-screen-hidden")) return;

const nameInput = qs("authProfileNameInput");

const phoneInput = qs("authProfilePhoneInput");

const roleSelect = qs("authProfileRoleRequestSelect");

const agreeCheck = qs("authProfilePrivacyAgreeCheck");

const saveBtn = qs("authProfileSaveBtn") || (qs("authProfileSetupForm") ? qs("authProfileSetupForm").querySelector(".auth-modal-submit") : null);

const name = String(nameInput && nameInput.value || "").trim();

const phone = normalizePhone(phoneInput && phoneInput.value || "");

const role = roleSelect && roleSelect.value ? roleSelect.value : "user";
		if (!name) return showProfileError("이름을 입력하세요.", nameInput);
		if (!phone || phone.length < 10) return showProfileError("휴대폰번호를 입력하세요.", phoneInput);
		if (!agreeCheck || !agreeCheck.checked) return showProfileError("개인정보 수집 및 이용에 동의해 주세요.", agreeCheck);

const client = getClient();
		if (!client) return showProfileError("Supabase 연결 설정을 확인하세요.", nameInput);
		try {
			if (saveBtn) saveBtn.disabled = true;

const userResult = await client.auth.getUser();

const user = userResult && userResult.data && userResult.data.user ? userResult.data.user : null;
			if (!user || !user.id) return showProfileError("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", nameInput);

const now = new Date().toISOString();

const uploadedProfileImage = await (typeof uploadAuthProfilePhotoIfNeeded === "function" ? uploadAuthProfilePhotoIfNeeded : window.uploadAuthProfilePhotoIfNeeded)(client, user.id);

const profilePayload = { id: user.id, email: user.email || "", name: name, phone: phone, role_request: role, profile_completed: true, privacy_agreed_at: now, updated_at: now };
			if (uploadedProfileImage) profilePayload.profile_image = uploadedProfileImage;

let result = await client.from("profiles").upsert(profilePayload, { onConflict: "id" });
			if (result && result.error && /profile_image/i.test(String(result.error.message || ""))) {
				delete profilePayload.profile_image;
				result = await client.from("profiles").upsert(profilePayload, { onConflict: "id" });
			}
			if (result && result.error && (String(result.error.code || "") === "23505" || /profiles_email_key|duplicate key/i.test(String(result.error.message || "")))) {

const retryPayload = { id: user.id, name: name, phone: phone, role_request: role, profile_completed: true, privacy_agreed_at: now, updated_at: now };
				if (uploadedProfileImage) retryPayload.profile_image = uploadedProfileImage;
				result = await client.from("profiles").update(retryPayload).eq("id", user.id);
			}
			if (result && result.error) { console.error("개인정보 저장 실패:", result.error); return showProfileError("개인정보 저장에 실패했습니다.", nameInput); }
			showProfileError("개인정보가 저장되었습니다.", null);

const dropdown = qs("globalAccountDropdown");
			if (dropdown) dropdown.classList.remove("profile-incomplete");
			if (typeof writeRealjejuCachedProfile === "function") writeRealjejuCachedProfile(user.id, { name: name, phone: phone, role_request: role, profile_completed: true, profile_image: uploadedProfileImage || window.authProfilePhotoUrl || "" });

const accountNameText = document.querySelector(".account-email-text");
			if (accountNameText) accountNameText.textContent = name;

const finalProfileImage = uploadedProfileImage || window.authProfilePhotoUrl || "";

window.authProfilePhotoUrl = finalProfileImage;

const fallbackProfileImage = (typeof REALJEJU_DEFAULT_PROFILE_IMAGE !== "undefined")
					? REALJEJU_DEFAULT_PROFILE_IMAGE
					: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";
				topbarProfileImgAfterSave.src = finalProfileImage || fallbackProfileImage;
			}
			if (typeof window.clearAuthProfilePhotoFile === "function") window.clearAuthProfilePhotoFile();
			if (typeof window.setAuthProfilePhotoPreview === "function") window.setAuthProfilePhotoPreview(finalProfileImage);
			if (typeof window.setMyInfoProfileImage === "function") window.setMyInfoProfileImage(finalProfileImage);

const authModal = qs("authModal");
			if (authModal) { authModal.classList.add("profile-page-mode"); authModal.classList.add("open"); authModal.setAttribute("aria-hidden", "false"); }
		} catch (err) {
			console.error("개인정보 저장 오류:", err);
			showProfileError("개인정보 저장 중 오류가 발생했습니다.", nameInput);
		} finally {
			if (saveBtn) saveBtn.disabled = false;
		}
	}
	document.addEventListener("change", function (e) {
		if (!e.target || e.target.id !== "authProfileRoleRequestSelect") return;

const role = e.target.value || "user";

const closeBtn = e.target.closest("#authProfileCloseBtn, #myInfoCloseBtn");
		if (!closeBtn) return;
		e.preventDefault();
		e.stopPropagation();
		if (typeof window.closeAuthModal === "function") window.closeAuthModal();
	}, true);

	document.addEventListener("click", function (e) {

const btn = e.target.closest("#authProfileSaveBtn, #authProfileSetupForm .auth-modal-submit");
		if (!btn) return;
		saveProfile(e);
	}, true);
	document.addEventListener("submit", function (e) {
		if (e.target && e.target.id === "authProfileSetupForm") saveProfile(e);
	}, true);
})();

const dropdowns = document.querySelectorAll("[data-register-dropdown]");
	if (!dropdowns.length) return;

const closeAll = (except = null) =>
	{
		dropdowns.forEach((dropdown) =>
		{
			if (dropdown === except) return;
			dropdown.classList.remove("open");

const trigger = dropdown.querySelector("[data-register-dropdown-trigger]");
			if (trigger) trigger.setAttribute("aria-expanded", "false");
		});
	};

	dropdowns.forEach((dropdown) =>
	{

const select = dropdown.querySelector("select");

const trigger = dropdown.querySelector("[data-register-dropdown-trigger]");

const label = dropdown.querySelector("[data-register-dropdown-label]");

const placeholder = select.options[0] ? select.options[0].textContent.trim() : "선택";

const syncLabel = () =>
		{

const selectedOption = select.options[select.selectedIndex];

const selectedText = selectedOption ? selectedOption.textContent.trim() : placeholder;
			label.textContent = select.value ? selectedText : placeholder;
			options.forEach((option) =>
			{
				option.classList.toggle("active", option.dataset.value === select.value);
				option.setAttribute("aria-selected", option.dataset.value === select.value ? "true" : "false");
			});
		};

		trigger.addEventListener("click", (event) =>
		{
			event.preventDefault();
			event.stopPropagation();

const willOpen = !dropdown.classList.contains("open");
			closeAll(dropdown);
			dropdown.classList.toggle("open", willOpen);
			trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});

		options.forEach((option) =>
		{
			option.addEventListener("click", (event) =>
			{
				event.preventDefault();
				event.stopPropagation();
				select.value = option.dataset.value || "";
				select.dispatchEvent(new Event("change", { bubbles: true }));
				syncLabel();
				dropdown.classList.remove("open");
				trigger.setAttribute("aria-expanded", "false");
			});
		});

		select.addEventListener("change", syncLabel);
		syncLabel();
	});

	document.addEventListener("click", () => closeAll());
	document.addEventListener("keydown", (event) =>
	{
		if (event.key === "Escape") closeAll();
	});
})();

(function () {

const raw = String(value || "").trim();
		if (!raw) return "";

const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) {
			return separated[1] + "-" + separated[2].padStart(2, "0") + "-" + separated[3].padStart(2, "0");
		}

const digits = raw.replace(/\D/g, "").slice(0, 8);
		if (digits.length === 8) {
			return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
		}

		return raw;
	}

function syncTextToPicker() {

const textInput = document.getElementById("propertyMoveInDateInput");

const pickerInput = document.getElementById("propertyMoveInDatePicker");

const pickerBtn = document.getElementById("propertyMoveInDatePickerBtn");

	if (!textInput || !pickerInput || !pickerBtn) return;

function normalizeMoveInDate(value) {

const raw = String(value || "").trim();
		if (!raw) return "";

const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) {
			return separated[1] + "-" + separated[2].padStart(2, "0") + "-" + separated[3].padStart(2, "0");
		}

const digits = raw.replace(/\D/g, "").slice(0, 8);
		if (digits.length === 8) {
			return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
		}

		return raw;
	}

function syncTextToPicker() {

const value = normalizeMoveInDate(textInput.value);
		textInput.value = value;

		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			pickerInput.value = value;
		} else {
			pickerInput.value = "";
		}
	}

	textInput.addEventListener("blur", syncTextToPicker);
	textInput.addEventListener("change", syncTextToPicker);

	pickerInput.addEventListener("change", function () {
		if (!pickerInput.value) return;
		textInput.value = pickerInput.value;
	});

	pickerBtn.addEventListener("click", function () {
		syncTextToPicker();

		try {
			if (typeof pickerInput.showPicker === "function") {
				pickerInput.showPicker();
				return;
			}
		} catch (error) {}

		pickerInput.style.pointerEvents = "auto";
		pickerInput.focus();
		pickerInput.click();
		setTimeout(function () {
			pickerInput.style.pointerEvents = "none";
		}, 300);
	});

const nowCheck = document.getElementById("propertyMoveInNowChk");
	if (nowCheck) {
		nowCheck.addEventListener("change", function () {
			if (nowCheck.checked) {
				textInput.value = "즉시입주";
				textInput.disabled = true;
				pickerInput.value = "";
				pickerInput.disabled = true;
				pickerBtn.disabled = true;
				pickerBtn.style.pointerEvents = "none";
				pickerBtn.style.opacity = "0.45";
			} else {
				if (textInput.value === "즉시입주") textInput.value = "";
				textInput.disabled = false;
				pickerInput.disabled = false;
				pickerBtn.disabled = false;
				pickerBtn.style.pointerEvents = "";
				pickerBtn.style.opacity = "";
			}
		});
	}

})();

(function () {

const textInput = document.getElementById("propertyMoveInDateInput");

const pickerInput = document.getElementById("propertyMoveInDatePicker");

const pickerBtn = document.getElementById("propertyMoveInDatePickerBtn");

const nowCheck = document.getElementById("propertyMoveInNowChk");

	if (!textInput || !pickerInput || !pickerBtn) return;

function formatMoveInDateTyping(value) {

const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
		if (digits.length <= 4) return digits;
		if (digits.length <= 6) return digits.slice(0, 4) + "-" + digits.slice(4);
		return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6);
	}

function normalizeMoveInDate(value) {

const raw = String(value || "").trim();
		if (!raw || raw === "즉시입주") return raw;

const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) {
			return separated[1] + "-" + separated[2].padStart(2, "0") + "-" + separated[3].padStart(2, "0");
		}

const digits = raw.replace(/\D/g, "").slice(0, 8);
		if (digits.length === 8) {
			return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
		}

		return formatMoveInDateTyping(raw);
	}

function syncTextToPicker() {
		if (nowCheck && nowCheck.checked) return;

const value = normalizeMoveInDate(textInput.value);
		textInput.value = value;

		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			pickerInput.value = value;
		} else {
			pickerInput.value = "";
		}
	}

	textInput.addEventListener("input", function () {
		if (nowCheck && nowCheck.checked) return;
		textInput.value = formatMoveInDateTyping(textInput.value);
		if (/^\d{4}-\d{2}-\d{2}$/.test(textInput.value)) {
			pickerInput.value = textInput.value;
		} else {
			pickerInput.value = "";
		}
	});

	textInput.addEventListener("blur", syncTextToPicker);
	textInput.addEventListener("change", syncTextToPicker);

	pickerInput.addEventListener("change", function () {
		if (!pickerInput.value || (nowCheck && nowCheck.checked)) return;
		textInput.value = pickerInput.value;
	});

	pickerBtn.addEventListener("click", function () {
		if (nowCheck && nowCheck.checked) return;

		syncTextToPicker();

		try {
			if (typeof pickerInput.showPicker === "function") {
				pickerInput.showPicker();
				return;
			}
		} catch (error) {}

		pickerInput.style.pointerEvents = "auto";
		pickerInput.focus();
		pickerInput.click();
		setTimeout(function () {
			pickerInput.style.pointerEvents = "none";
		}, 300);
	});

	if (nowCheck) {
		nowCheck.addEventListener("change", function () {
			if (nowCheck.checked) {
				textInput.value = "즉시입주";
				textInput.disabled = true;
				pickerInput.value = "";
				pickerInput.disabled = true;
				pickerBtn.disabled = true;
				pickerBtn.style.pointerEvents = "none";
				pickerBtn.style.opacity = "0.45";
			} else {
				if (textInput.value === "즉시입주") textInput.value = "";
				textInput.disabled = false;
				pickerInput.disabled = false;
				pickerBtn.disabled = false;
				pickerBtn.style.pointerEvents = "";
				pickerBtn.style.opacity = "";
			}
		});
	}
})();

(function () {

function onlyDateDigits(value) {
		return String(value || "").replace(/\D/g, "").slice(0, 8);
	}

const value = onlyDateDigits(digits);

		if (value.length < 4) return value;
		if (value.length === 4) return value + "-";
		if (value.length <= 6) return value.slice(0, 4) + "-" + value.slice(4);
		if (value.length === 6) return value.slice(0, 4) + "-" + value.slice(4, 6) + "-";

		return value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8);
	}

const raw = String(value || "").trim();
		if (!raw) return "";

const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) {
			return separated[1] + "-" + separated[2].padStart(2, "0") + "-" + separated[3].padStart(2, "0");
		}

function syncPickerValue() {

const value = textInput.value;
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			pickerInput.value = value;
		} else {
			pickerInput.value = "";
		}
	}

	textInput.addEventListener("input", function (event) {
		if (event.inputType && event.inputType.indexOf("delete") !== -1) {
			syncPickerValue();
			return;
		}

const textInput = document.getElementById("propertyMoveInDateInput");

const pickerInput = document.getElementById("propertyMoveInDatePicker");

const pickerBtn = document.getElementById("propertyMoveInDatePickerBtn");

const nowCheck = document.getElementById("propertyMoveInNowChk");

	if (!textInput || !pickerInput || !pickerBtn) return;

function onlyDateDigits(value) {
		return String(value || "").replace(/\D/g, "").slice(0, 8);
	}

function formatMoveInDateFromDigits(digits) {

const value = onlyDateDigits(digits);

		if (value.length < 4) return value;
		if (value.length === 4) return value + "-";
		if (value.length <= 6) return value.slice(0, 4) + "-" + value.slice(4);
		if (value.length === 6) return value.slice(0, 4) + "-" + value.slice(4, 6) + "-";

		return value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8);
	}

function normalizeMoveInDate(value) {

const raw = String(value || "").trim();
		if (!raw) return "";

const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) {
			return separated[1] + "-" + separated[2].padStart(2, "0") + "-" + separated[3].padStart(2, "0");
		}

const digits = onlyDateDigits(raw);
		if (digits.length === 8) {
			return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
		}

		return formatMoveInDateFromDigits(digits);
	}

function syncPickerValue() {

const value = textInput.value;
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			pickerInput.value = value;
		} else {
			pickerInput.value = "";
		}
	}

	textInput.addEventListener("input", function (event) {
		if (nowCheck && nowCheck.checked) return;
		if (event.inputType && event.inputType.indexOf("delete") !== -1) {
			syncPickerValue();
			return;
		}

const digits = onlyDateDigits(textInput.value);
		textInput.value = formatMoveInDateFromDigits(digits);
		syncPickerValue();
	});

	textInput.addEventListener("blur", function () {
		if (nowCheck && nowCheck.checked) return;
		textInput.value = normalizeMoveInDate(textInput.value);
		syncPickerValue();
	});

	textInput.addEventListener("change", function () {
		if (nowCheck && nowCheck.checked) return;
		textInput.value = normalizeMoveInDate(textInput.value);
		syncPickerValue();
	});

	pickerInput.addEventListener("change", function () {
		if (nowCheck && nowCheck.checked) return;
		if (!pickerInput.value) return;
		textInput.value = pickerInput.value;
		syncPickerValue();
	});

	pickerBtn.addEventListener("click", function () {
		if (nowCheck && nowCheck.checked) return;
		textInput.value = normalizeMoveInDate(textInput.value);
		syncPickerValue();

		try {
			if (typeof pickerInput.showPicker === "function") {
				pickerInput.showPicker();
				return;
			}
		} catch (error) {}

		pickerInput.style.pointerEvents = "auto";
		pickerInput.focus();
		pickerInput.click();
		setTimeout(function () {
			pickerInput.style.pointerEvents = "none";
		}, 300);
	});
	if (nowCheck) {
		nowCheck.addEventListener("change", function () {
			if (nowCheck.checked) {
				textInput.value = "즉시입주";
				textInput.disabled = true;
				pickerInput.value = "";
				pickerInput.disabled = true;
				pickerBtn.disabled = true;
				pickerBtn.style.pointerEvents = "none";
				pickerBtn.style.opacity = "0.45";
			} else {
				if (textInput.value === "즉시입주") textInput.value = "";
				textInput.disabled = false;
				pickerInput.disabled = false;
				pickerBtn.disabled = false;
				pickerBtn.style.pointerEvents = "";
				pickerBtn.style.opacity = "";
			}
		});
	}

})();

(function () {

const dongHoRow = document.getElementById("propertyDongHoRow");

const propertyTypeSelect = document.getElementById("propertyTypeSelect");
	if (!dongHoRow || !propertyTypeSelect) return;

function updateDongHoVisibility() {

const shouldShow = visibleTypeValues.includes(propertyTypeSelect.value);
		dongHoRow.classList.toggle("is-visible", shouldShow);
	}

	propertyTypeSelect.addEventListener("change", updateDongHoVisibility);

	document.addEventListener("click", function (event) {

const propertyTypeSelect = document.getElementById("propertyTypeSelect");

const facilityCard = document.getElementById("propertyFacilityCard");

	if (!propertyTypeSelect || !facilityCard) return;

function updateFacilityVisibility() {

const shouldShow = showFacilityTypes.includes(propertyTypeSelect.value);
		facilityCard.classList.toggle("is-hidden", !shouldShow);
	}

	propertyTypeSelect.addEventListener("change", updateFacilityVisibility);

	document.addEventListener("click", function (event) {

function alignRegisterBottomBar() {

const rect = pageInner.getBoundingClientRect();

		bottomBar.style.justifyContent = "flex-start";
		bottomBar.style.paddingLeft = "0";
		bottomBar.style.paddingRight = "0";

		bottomInner.style.width = rect.width + "px";
		bottomInner.style.marginLeft = rect.left + "px";
		bottomInner.style.marginRight = "0";
		bottomInner.style.boxSizing = "border-box";
		bottomInner.style.display = "flex";
		bottomInner.style.alignItems = "center";
		bottomInner.style.justifyContent = "flex-end";
	}

	window.addEventListener("resize", alignRegisterBottomBar);
	window.addEventListener("orientationchange", alignRegisterBottomBar);
	document.addEventListener("DOMContentLoaded", alignRegisterBottomBar);

const observer = new MutationObserver(alignRegisterBottomBar);
	observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

	alignRegisterBottomBar();
})();

(function () {

const card = document.getElementById("propertyMaintenanceCard");
	if (!card) return;

const tabs = card.querySelectorAll(".maintenance-tab");

const sections = card.querySelectorAll(".maintenance-section");

	tabs.forEach(function (tab) {
		tab.addEventListener("click", function () {

const type = tab.getAttribute("data-maintenance-type");

			tabs.forEach(function (item) {
				item.classList.toggle("active", item === tab);
			});

			sections.forEach(function (section) {
				section.classList.toggle("active", section.getAttribute("data-maintenance-section") === type);
			});
		});
	});

function syncFixedInputs() {
		card.querySelectorAll(".maintenance-fee-row").forEach(function (row) {

const checked = row.querySelector("input[type='radio']:checked");
			if (!input || !checked) return;

const enabled = checked.value === "fixed";
			input.disabled = !enabled;
			if (!enabled) input.value = "";
		});
	}

function syncUnder100Mode() {

const under100 = document.getElementById("maintenanceUnder100kChk");
		if (!under100) return;

/* ===== PATCH: 매물등록 진입 시 등록자 정보 최신 조회 ===== */
(function bindRegistrantInfoOnRegisterOpen()
{

function setValue(id, value)
	{

const el = document.getElementById(id);
		if (el) el.value = value || "";
	}

function getInputValue(id)
	{

const el = document.getElementById(id);
		return el && "value" in el ? String(el.value || "").trim() : "";
	}

function getTextValue(id)
	{

const el = document.getElementById(id);
		return el ? String(el.textContent || "").trim() : "";
	}

function cleanInfoValue(value)
	{

const text = String(value || "").trim();
		return ["", "-", "해당 없음", "미신청", "승인 대기중"].includes(text) ? "" : text;
	}

function resetRegistrantInfo()
	{

const chk = document.getElementById("registrantLicensedAgentChk");

const manager = document.getElementById("registrantManagerNameInput");
		if (chk) chk.checked = false;
		if (manager) manager.disabled = true;
	}

function bindLicensedAgentToggle()
	{

const chk = document.getElementById("registrantLicensedAgentChk");

const manager = document.getElementById("registrantManagerNameInput");
		if (!chk || !manager || chk.dataset.registrantToggleBound === "1") return;
		chk.dataset.registrantToggleBound = "1";

function sync()
		{
			if (chk.checked)
			{
				manager.disabled = false;
			}
			else
			{
				manager.value = "";
				manager.disabled = true;
			}
		}

		chk.addEventListener("change", sync);
		sync();
	}

function applyMyInfoFallback()
	{

const name = cleanInfoValue(getTextValue("myInfoNameValue"));

async function loadRegistrantInfoForRegister()
	{
		resetRegistrantInfo();
		bindLicensedAgentToggle();

const client = typeof getRealjejuSupabaseClient === "function" ? getRealjejuSupabaseClient() : null;

let profile = null;

const user = userData && userData.user ? userData.user : null;
				if (user)
				{

window.realjejuCurrentAuthUser = user;

					try
					{
						const { data: profileData } = await client
							.from("profiles")
							.select("name, phone, role_request")
							.eq("id", user.id)
							.maybeSingle();
						profile = profileData || null;

const domName = cleanInfoValue(getTextValue("myInfoNameValue"));

const domPhone = cleanInfoValue(getTextValue("myInfoPhoneValue"));

window.realjejuResetRegistrantInfo = resetRegistrantInfo;

window.realjejuLoadRegistrantInfoForRegister = loadRegistrantInfoForRegister;
})();

function bind()
	{

const chk = document.getElementById("registrantLicensedAgentChk");

const manager = document.getElementById("registrantManagerNameInput");
		if (!chk || !manager || chk.dataset.directRegistrantToggleBound === "1") return;
		chk.dataset.directRegistrantToggleBound = "1";

function sync()
		{
			if (chk.checked)
			{
				manager.disabled = false;
			}
			else
			{
				manager.value = "";
				manager.disabled = true;
			}
		}

		chk.addEventListener("change", sync);
		sync();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

const TABLE_NAME = "property_listings";

// PATCH 2.312: 매물 사진은 등록 전 1920px JPEG로 리사이즈한 뒤 Storage에 저장

const PROPERTY_PHOTOS_BUCKET = "property-photos";

const PROPERTY_PHOTO_MAX_EDGE = 1920;

const PROPERTY_PHOTO_JPEG_QUALITY = 0.86;

// PATCH 2.316: 저장 완료 모달 확인 전까지 중복 저장 요청을 차단

let propertyListingSaveInFlight = false;

	function $(id)
	{
		return document.getElementById(id);
	}

function value(id)
	{

const el = $(id);
		if (!el) return "";
		if ("value" in el) return String(el.value || "").trim();
		return String(el.textContent || "").trim();
	}

function checked(id)
	{
		return !!($(id)?.checked);
	}

function radioValue(name)
	{
		return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
	}

function numberValue(id)
	{

const text = value(id).replace(/,/g, "");
		if (!text) return null;

const num = Number(text);
		return Number.isFinite(num) ? num : null;
	}

function selectedOptionText(selectId)
	{

const select = $(selectId);
		if (!select) return "";
		return select.options[select.selectedIndex]?.textContent?.trim() || "";
	}

// PATCH 2.322: 수정 화면 복원을 위해 현재 매물등록 폼의 실제 입력 상태를 payload에 함께 저장

const state = { inputs: {}, checks: {}, radios: {}, selects: {} };
		if (!page) return state;
		page.querySelectorAll("input, textarea, select").forEach((el) => {
			if (!el.id && !el.name) return;
			if (el.type === "file" || el.type === "button" || el.type === "submit") return;
			if (el.type === "radio") {
				if (el.name && el.checked) state.radios[el.name] = el.value;
				return;
			}
			if (el.type === "checkbox") {
				if (el.id) state.checks[el.id] = !!el.checked;
				return;
			}
			if (el.tagName === "SELECT") {
				if (el.id) state.selects[el.id] = el.value || "";
				return;
			}
			if (el.id) state.inputs[el.id] = el.value || "";
		});
		return state;
	}

// PATCH 2.312: DB에서 ID를 받지 않고 프론트에서 매물 UUID를 먼저 확정

function createListingId()
	{
		if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();

const bytes = new Uint8Array(16);
		window.crypto.getRandomValues(bytes);
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}

// PATCH 2.312: 사진 파일을 canvas에서 긴 변 1920px 기준 JPEG로 변환

const img = new Image();

const objectUrl = URL.createObjectURL(file);
			img.onload = () => {
				try {

const sourceWidth = img.naturalWidth || img.width;

const sourceHeight = img.naturalHeight || img.height;
					if (!sourceWidth || !sourceHeight) throw new Error("이미지 크기를 확인할 수 없습니다.");

const scale = Math.min(1, PROPERTY_PHOTO_MAX_EDGE / Math.max(sourceWidth, sourceHeight));

const targetWidth = Math.max(1, Math.round(sourceWidth * scale));

const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

const canvas = document.createElement("canvas");
					canvas.width = targetWidth;
					canvas.height = targetHeight;

const ctx = canvas.getContext("2d");
					if (!ctx) throw new Error("이미지 변환을 준비할 수 없습니다.");
					ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
					canvas.toBlob((blob) => {
						URL.revokeObjectURL(objectUrl);
						if (!blob) {
							reject(new Error("이미지 변환에 실패했습니다."));
							return;
						}
						resolve({
							blob,
							width: targetWidth,
							height: targetHeight,
							originalName: file.name || "photo",
							originalSize: file.size || 0
						});
					}, "image/jpeg", PROPERTY_PHOTO_JPEG_QUALITY);
				}
				catch (err) {
					URL.revokeObjectURL(objectUrl);
					reject(err);
				}
			};
			img.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				reject(new Error("이미지를 읽을 수 없습니다."));
			};
			img.src = objectUrl;
		});
	}

// PATCH 2.312: DB 저장 성공 후 user_id/listing_id 폴더에 사진 업로드

const files = Array.isArray(window.realjejuPropertyPhotoFiles) ? window.realjejuPropertyPhotoFiles : [];
		if (!files.length) return { photos: [], failedCount: 0 };

const bucket = client.storage.from(PROPERTY_PHOTOS_BUCKET);

const photos = [];

let failedCount = 0;

		for (let i = 0; i < files.length; i += 1) {

const order = i + 1;
			try {

const fileName = `photo-${String(order).padStart(3, "0")}.jpg`;

const path = `${userId}/${listingId}/${fileName}`;
				const { error } = await bucket.upload(path, resized.blob, {
					cacheControl: "31536000",
					contentType: "image/jpeg",
					upsert: true
				});
				if (error) throw error;

const publicData = bucket.getPublicUrl(path);
				photos.push({
					path,
					url: publicData?.data?.publicUrl || "",
					name: fileName,
					order,
					width: resized.width,
					height: resized.height,
					size: resized.blob.size,
					mime_type: "image/jpeg",
					original_name: resized.originalName,
					original_size: resized.originalSize
				});
			}
			catch (err) {
				failedCount += 1;
				console.warn("매물 사진 업로드 실패:", err);
			}
		}

		return { photos, failedCount };
	}

function collectPricePayload()
	{
		return {
			sale: {
				price: numberValue("priceSaleInput")
			},
			jeonse: {
				deposit: numberValue("priceJeonseDepositInput")
			},
			monthly: {
				deposit: numberValue("priceMonthlyDepositInput"),
				rent: numberValue("priceMonthlyRentInput")
			},
			yearly: {
				deposit: numberValue("priceYearlyDepositInput"),
				rent: numberValue("priceYearlyRentInput")
			},
			short: {
				deposit: numberValue("priceShortDepositInput"),
				rent: numberValue("priceShortRentInput")
			}
		};
	}

function collectListingPayload(status)
	{

const addressInput = $("propertyAddressInput");

const dealTypes = checkedValues(".property-deal-check");

const title = value("propertyLocationSummaryInput") || selectedOptionText("propertyTypeSelect") || "신규 매물";

const rawLat = addressInput?.dataset.lat;

const rawLng = addressInput?.dataset.lng;

const lat = rawLat === undefined || rawLat === "" ? null : Number(rawLat);

const lng = rawLng === undefined || rawLng === "" ? null : Number(rawLng);
		// PATCH 2.323: 기타 부과 관리비는 부과기준 라디오가 비어 있지 않게 기본값을 함께 저장

const maintenanceType = document.querySelector("#propertyMaintenanceCard .maintenance-tab.active")?.getAttribute("data-maintenance-type") || "";

// PATCH 2.314: 화면에 보이는 빨간 * 라벨은 저장 전 필수 입력으로 공통 검증

function isVisibleRequiredElement(el)
	{
		if (!el) return false;
		if (el.closest(".is-hidden")) return false;

let node = el;
		while (node && node !== document.body) {
			if (node instanceof HTMLElement) {

const style = window.getComputedStyle(node);
				if (style.display === "none" || style.visibility === "hidden") return false;
			}
			node = node.parentElement;
		}
		return !!(el.offsetParent || el.getClientRects().length);
	}

function getRequiredLabelText(label)
	{

const clone = label.cloneNode(true);
		clone.querySelectorAll(".property-required").forEach((mark) => mark.remove());
		return String(clone.textContent || "").replace(/\s+/g, " ").trim() + "*";
	}

function getRequiredFieldTarget(row)
	{
		if (!row) return null;
		return row.querySelector("button[data-register-dropdown-trigger], input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled)");
	}

function hasRequiredFieldValue(row)
	{
		if (!row || !isVisibleRequiredElement(row)) return true;
		if (row.classList.contains("property-room-row") && checked("propertyRoomBathNotApplicableChk")) return true;
		if (row.querySelector("#propertyMoveInDateInput") && (checked("propertyMoveInNowChk") || checked("propertyMoveInNegotiableChk"))) return true;

const radios = controls.filter((control) => control.type === "radio");
		if (radios.length) return radios.some((control) => control.checked);

const checks = controls.filter((control) => control.type === "checkbox");

const textControls = controls.filter((control) => control.type !== "checkbox");
		if (checks.length && !textControls.length) return checks.some((control) => control.checked);
		if (row.querySelector(".property-area-pair")) {
			return textControls.some((control) => String(control.value || "").trim() !== "");
		}
		return textControls.every((control) => String(control.value || "").trim() !== "");
	}

function validateVisibleRequiredFields()
	{

const missing = [];

const seenRows = new Set();
		page.querySelectorAll(".property-form-label .property-required, .property-form-label.property-required").forEach((requiredMark) => {

const label = requiredMark.closest(".property-form-label");
			if (!label || !isVisibleRequiredElement(label)) return;

function validateListing(payload, status)
	{
		if (status === "published") {

const requiredValidation = validateVisibleRequiredFields();
			if (requiredValidation) return requiredValidation;
		}
		if (!payload.property_type) return { message: "매물 종류를 선택하세요.", target: $("propertyTypeSelect") };
		if (!payload.address1) return { message: "주소를 입력하세요.", target: $("propertyAddressInput") };
		if (status === "published" && (!payload.deal_types || !payload.deal_types.length)) {
			return { message: "거래 유형을 선택하세요.", target: document.querySelector(".property-deal-check") };
		}
		if (status === "published") {

const missingCheckedItems = [];

const loanRow = document.querySelector(".property-loan-row");

const parkingRow = document.querySelector(".property-parking-row");

async function saveListing(status)
	{
		if (propertyListingSaveInFlight) return;
		// PATCH 2.313: 저장 스크립트는 전역 Supabase 클라이언트 팩토리를 명시적으로 사용

const payload = collectListingPayload(status);

const submitBtn = $("propertySubmitBtn");

const draftBtn = $("propertyDraftSaveBtn");

const setSaveButtonsDisabled = (disabled) => {
			[submitBtn, draftBtn].forEach((btn) => { if (btn) btn.disabled = disabled; });
		};
		propertyListingSaveInFlight = true;
		[submitBtn, draftBtn].forEach((btn) => { if (btn) btn.disabled = true; });

let keepButtonsLockedUntilConfirm = false;

		try {

const existingListingId = page?.dataset.listingId || "";

const listingId = existingListingId || createListingId();

let error = null;
			// PATCH 2.315: 이미 저장된 작성 화면은 새 매물을 만들지 않고 같은 row를 수정
			if (existingListingId) {

const updateRow = { ...row };
				delete updateRow.id;
				delete updateRow.user_id;

const updateResult = await client
					.from(TABLE_NAME)
					.update(updateRow)
					.eq("id", existingListingId)
					.eq("user_id", user.id);
				error = updateResult.error;
			} else {

const insertResult = await client
					.from(TABLE_NAME)
					.insert(row);
				error = insertResult.error;
			}

			// PATCH 2.312: UUID 충돌은 극히 드물지만 DB primary key 오류면 한 번만 새 ID로 재시도
			if (!existingListingId && error && (String(error.code || "") === "23505" || /duplicate key/i.test(String(error.message || "")))) {
				row.id = createListingId();

const savedListingId = row.id;

const hasSelectedPhotoFiles = Array.isArray(window.realjejuPropertyPhotoFiles) && window.realjejuPropertyPhotoFiles.length > 0;

const existingPreviewPhotos = Array.isArray(window.realjejuExistingPropertyPhotos) ? window.realjejuExistingPropertyPhotos : [];
			// PATCH 2.358: 수정 화면에 복원된 기존 사진과 새로 업로드한 사진을 합쳐 저장

let completeMessage = existingListingId ? (status === "draft" ? "임시저장 내용이 수정되었습니다." : "매물이 수정되었습니다.") : (status === "draft" ? "임시저장되었습니다." : "매물이 등록되었습니다.");
			if (uploadResult.failedCount > 0) completeMessage += `\n사진 ${uploadResult.failedCount}장은 업로드되지 않았습니다.`;

// PATCH 2.329: 수정 모드의 왼쪽 하단 버튼은 임시저장이 아니라 취소로 동작

function isPropertyListingEditMode()
	{

function bind()
	{

const submitBtn = $("propertySubmitBtn");

const draftBtn = $("propertyDraftSaveBtn");
		if (submitBtn && submitBtn.dataset.listingSaveBound !== "1") {
			submitBtn.dataset.listingSaveBound = "1";
			submitBtn.addEventListener("click", () => saveListing("published"));
		}
		if (draftBtn && draftBtn.dataset.listingSaveBound !== "1") {
			draftBtn.dataset.listingSaveBound = "1";
			draftBtn.addEventListener("click", () => {
				if (isPropertyListingEditMode()) {
					cancelPropertyListingEdit();
					return;
				}
				saveListing("draft");
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

function setInput(id, value)
	{

const el = $(id);
		if (!el || value === null || value === undefined || value === "") return;
		el.value = String(value);
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

function clearInput(id)
	{

const el = $(id);
		if (!el) return;
		el.value = "";
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

// PATCH 2.259: 간편등록은 공통 표시 함수에 총점포수/총세대수 표시 여부만 전달

function syncQuickImportTotalCountRowsVisibility(parsed)
	{
		if (typeof window.realjejuSyncPropertyCountRowsVisibility !== "function") return;
		window.realjejuSyncPropertyCountRowsVisibility({
			store: !!(parsed && parsed.hasStoreCountSource),
			household: !!(parsed && parsed.hasHouseholdSource)
		});
	}

function setCheck(selector, checked)
	{

const el = typeof selector === "string"
			? (document.getElementById(selector) || document.querySelector(selector))
			: selector;
		if (!el) return;
		el.checked = !!checked;
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

function setRadio(name, value)
	{

const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
		if (radio) setCheck(radio, true);
	}

function clearRadio(name)
	{
		document.querySelectorAll(`input[name="${name}"]`).forEach((radio) => {
			radio.checked = false;
			radio.dispatchEvent(new Event("change", { bubbles: true }));
		});
	}

function setSelectValue(id, value)
	{

const select = $(id);
		if (!select || value === null || value === undefined) return;
		select.value = value;

const wrap = select.closest("[data-register-dropdown]");
		if (wrap) {

const label = wrap.querySelector("[data-register-dropdown-label]");

function setMaintenanceTab(type)
	{

const tab = document.querySelector(`#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="${CSS.escape(type)}"]`);
		if (tab) tab.click();
	}

function parseMoneyToManwon(text)
	{

const value = String(text || "").replace(/,/g, "");

const eok = value.match(/(\d+(?:\.\d+)?)\s*억/);

const man = value.match(/(\d+(?:\.\d+)?)\s*만/);
		if (eok) return Math.round((Number(eok[1]) * 10000) + (man ? Number(man[1]) : 0));
		if (man) return Math.round(Number(man[1]));

const raw = value.match(/전세금\s*([0-9]+)/);
		return raw ? Math.round(Number(raw[1]) / 10000) : "";
	}

function getFirstMatch(text, regex)
	{

const match = String(text || "").match(regex);
		return match ? match[1].trim() : "";
	}

// PATCH 2.225: 입주가능일 날짜형 값을 YYYY-MM-DD로 추출

function parseMoveInDateText(text)
	{

const raw = String(text || "").trim();
		if (!raw) return "";
		if (/즉시입주|즉시\s*입주/.test(raw)) return "즉시입주";

const separated = raw.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
		if (separated) return `${separated[1]}-${separated[2].padStart(2, "0")}-${separated[3].padStart(2, "0")}`;

const compact = raw.match(/(\d{8})/);
		if (compact) return `${compact[1].slice(0, 4)}-${compact[1].slice(4, 6)}-${compact[1].slice(6, 8)}`;
		return "";
	}

function normalizeCrossroadLabel(label)
	{
		return String(label || "").replace(/\s+/g, "").trim();
	}

// PATCH 2.291: 용도지역은 "1종전용주거지역"처럼 제/공백이 빠진 교차로 표기도 드롭다운 값과 맞춤

function normalizeLandUseZoneLabel(label)
	{
		return normalizeCrossroadLabel(label).replace(/^제?([1-3])종/, "제$1종");
	}

const fields = {};
		String(text || "").split(/\n/).forEach((line) => {

const row = line.trim();
			if (!row || /^\[[^\]]+\]$/.test(row)) return;

let label = "";

let content = "";
			if (row.includes("\t")) {

const parts = row.split(/\t+/);
				label = parts.shift();
				content = parts.join(" ");
			} else {

const colon = row.match(/^([^:：]+)[:：]\s*(.+)$/);
				if (!colon) return;
				label = colon[1];
				content = colon[2];
			}

const key = normalizeCrossroadLabel(label);

const value = String(content || "").trim();
			if (key && value && !fields[key]) fields[key] = value;
		});
		return fields;
	}

function fieldValue(fields, labels)
	{
		for (const label of labels) {

const value = fields[normalizeCrossroadLabel(label)];
			if (value) return value;
		}
		return "";
	}

function normalizeAddress(text)
	{

const full = String(text || "");

const normalizeJejuPrefix = (value) => String(value || "")
			.replace(/^제주도\s*/, "제주특별자치도 ")
			.replace(/^제주\s+/, "제주특별자치도 ")
			.replace(/\s+/g, " ")
			.trim();

const splitCompactEupMyeonRi = (value) => String(value || "")
			.replace(/([가-힣]+(?:읍|면))([가-힣]+리)(?=\s|$|\d)/g, "$1 $2")
			.replace(/\s+/g, " ")
			.trim();

const exact = full.match(/(?:제주(?:특별자치도|도)?[ \t]*)?(?:제주시|서귀포시)[ \t]+[가-힣0-9-]+(?:읍|면)[ \t]*[가-힣0-9-]+리(?:[ \t]+\d+(?:-\d+)?)?|(?:제주(?:특별자치도|도)?[ \t]*)?(?:제주시|서귀포시)[ \t]+[가-힣0-9 \t-]+(?:동|읍|면|리)(?:[ \t]+\d+(?:-\d+)?)?/);
		if (exact) return splitCompactEupMyeonRi(normalizeJejuPrefix(exact[0]));

const line = full.split(/\n/).find((row) => {

const cleaned = row.replace(/^[🔹\s]*소재지\s*[:：]\s*/, "").trim();
			return /제주시|서귀포시|소재지|수덕로|노형동/.test(cleaned) && (/\d/.test(cleaned) || /(?:동|읍|면|리)/.test(cleaned));
		});
		return line ? splitCompactEupMyeonRi(normalizeJejuPrefix(line.replace(/^[🔹\s]*소재지\s*[:：]\s*/, ""))) : "";
	}

// PATCH 2.271: 관리비 항목이 있는 매물만 처음 10개 유효 줄을 본문 후보에서 제외

function extractCrossroadDescription(text)
	{

const value = String(text || "");

const hasMaintenanceSection = /(^|\n)\s*(\[관리비\]|월\s*관리비|월관리비|관리비\s*합계|관리비\s*\t)/.test(value);

const minimumMetaLineCount = hasMaintenanceSection ? 10 : 5;

const isStructuredLine = (line) => {

const row = String(line || "").trim();
			if (!row) return true;
			if (/^\[[^\]]+\]$/.test(row)) return true;
			if (/^(월\s*관리비|월관리비|기본정보|건물정보)$/i.test(row)) return true;
			if (/^관리비\s*부과내역\s*없음$/.test(row)) return true;
			if (/^(총\s*주차대수|난방시설|냉방시설|가구|가전|주방\/욕실|건물보안|기타시설)\s*[:：]/.test(row)) return true;

let label = "";
			if (row.includes("\t")) {
				label = row.split(/\t+/)[0];
			} else {

const colon = row.match(/^([^:：]+)[:：]\s*(.+)$/);
				if (colon) label = colon[1];
			}
			return !!label && structuredLabels.has(normalizeCrossroadLabel(label));
		};

let nonEmptyCount = 0;

const lines = value.split(/\r?\n/);
		for (let i = 0; i < lines.length; i++) {

const row = lines[i].trim();
			if (!row) continue;
			nonEmptyCount += 1;
			if (nonEmptyCount <= minimumMetaLineCount) continue;
			if (isStructuredLine(row)) continue;
			return lines.slice(i).join("\n").trim();
		}

const legacyStart = value.indexOf("(디-");
		return legacyStart >= 0 ? value.slice(legacyStart).trim() : value.trim();
	}

function trimCrossroadDescriptionTail(description)
	{

const value = String(description || "");

const lines = value.split(/\r?\n/);

const nonEmptyIndexes = [];
		lines.forEach((line, index) => {
			if (line.trim()) nonEmptyIndexes.push(index);
		});

const tailStartIndex = nonEmptyIndexes[Math.max(0, nonEmptyIndexes.length - 10)] ?? 0;

const crossroadTailIndex = lines.findIndex((line, index) => {
			return index >= tailStartIndex && /제주교차로\s+부동산\s+추천중개업소/.test(line.trim());
		});

const withoutCrossroadTail = crossroadTailIndex >= 0 ? lines.slice(0, crossroadTailIndex).join("\n") : value;
		return withoutCrossroadTail.replace(/\n(?:[ \t]*\n){9,}[\s\S]*$/, "").trimEnd();
	}

function splitCrossroadDescriptionTitle(description)
	{

const lines = trimCrossroadDescriptionTail(description).split(/\r?\n/);

const firstIndex = lines.findIndex((line) => line.trim());
		if (firstIndex < 0) return { title: "", body: "" };
		return {
			title: lines[firstIndex].trim(),
			body: lines.slice(firstIndex + 1).join("\n").replace(/^\s*\n+/, "").trimStart()
		};
	}

function parseCrossroadListing(text)
	{

const value = String(text || "");

const title = getFirstMatch(value, /\[(?:전세|매매|월세|년세)\]\s*([^\n]+)/) || getFirstMatch(value, /\((?:디|D)-?\d+\)\s*([^\n]+)/i);

const totalArea = getFirstMatch(firstLines, /연\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		// PATCH 2.240: 공급면적과 계약면적을 분리해서 원문 라벨 그대로 화면에 반영

const supplyArea = getFirstMatch(firstLines, /공급\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");

const contractArea = getFirstMatch(firstLines, /계약\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");

const exclusiveArea = getFirstMatch(firstLines, /전용\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");

const buildingArea = getFirstMatch(firstLines, /건축\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");

const landArea = getFirstMatch(firstLines, /대지\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");

const storeCountSourceText = fieldValue(fields, ["총점포수", "총 점포수", "총 점포"]);

const storeCountMatch = value.match(/총\s*점포\s*수?\s*[:：\t ]*([\d,]+)\s*개/);

const storeCount = (storeCountSourceText || (storeCountMatch ? storeCountMatch[1] : "")).replace(/[^0-9]/g, "");

const hasStoreCountSource = !!storeCount;

const householdSourceText = fieldValue(fields, ["총세대수", "총 세대수", "총 세대"]);

const householdMatch = value.match(/총\s*세대\s*수?\s*[:：\t ]*([\d,]+)\s*세대/);

const household = (householdSourceText || (householdMatch ? householdMatch[1] : "")).replace(/[^0-9]/g, "");

const hasHouseholdSource = !!household;

const rooms = value.match(/방\s*\/?\s*욕실수\s*[:：]?\s*(\d+)\s*\/\s*(\d+)/) || value.match(/방\s*(\d+)\s*\/\s*욕실\s*(\d+)/);

const floors = value.match(/해당층\/총층\s*[:：]?\s*([가-힣]+|\d+)\s*\/\s*(\d+)/) || (fieldValue(fields, ["해당층/총층"]).match(/([가-힣]+|\d+)\s*\/\s*(\d+)/));
		// PATCH 2.293: "총 주차대수: 2대"처럼 세대당/점포당 괄호가 없어도 총 주차대수를 반영

const parking = value.match(/총\s*주차\s*대수\s*[:：]?\s*([\d,]+)\s*대(?:\s*\((?:세대당|점포당)\s*([\d.]+)\s*대\))?/);

const maintenanceRawText = fieldValue(fields, ["관리비"]);

const maintenanceNone = /관리비\s*없음|없음/.test(maintenanceRawText) || /관리비\s*부과내역\s*없음/.test(value);
		// PATCH 2.273: 교차로 관리비가 "관리비 150,000원"으로 들어오는 경우도 총 관리비로 처리

const maintenanceWon = (
			fieldValue(fields, ["관리비 합계"])
			|| (/원/.test(maintenanceRawText) ? maintenanceRawText : "")
			|| getFirstMatch(value, /관리비\s*합계\s*([\d,]+)\s*원/)
			|| getFirstMatch(value, /^관리비\s*[\t ]+([\d,]+)\s*원/m)
		).replace(/[^0-9]/g, "");

const landRoad = getFirstMatch(value, /도로\s*[:：]\s*([^\n]+)/);

const landType = fieldValue(fields, ["지목"]) || getFirstMatch(value, /지목\s*[:：]?\s*([가-힣]+)/) || (/^\s*\[매매\]\s*([가-힣]+)\s*$/m.exec(firstLines)?.[1] || "");
		// PATCH 2.291: 교차로 용도지역 텍스트를 토지 용도지역 드롭다운 값으로 정규화

const landUseZoneOptions = [
			"제1종 전용주거지역", "제2종 전용주거지역", "제1종 일반주거지역", "제2종 일반주거지역", "제3종 일반주거지역", "준주거지역",
			"중심상업지역", "일반상업지역", "근린상업지역", "유통상업지역",
			"전용공업지역", "일반공업지역", "준공업지역",
			"보전녹지지역", "생산녹지지역", "자연녹지지역",
			"보전관리지역", "생산관리지역", "계획관리지역",
			"농림지역", "자연환경보전지역"
		];

const landUseZoneRaw = fieldValue(fields, ["용도지역"]) || getFirstMatch(value, /용도지역\s*[:：]?\s*([가-힣0-9\s]+지역)/);

const landUseZone = landUseZoneOptions.find(option => normalizeLandUseZoneLabel(option) === normalizeLandUseZoneLabel(landUseZoneRaw)) || "";

const buildingKindText = fieldValue(fields, ["건물종류"]);

const buildingUseText = fieldValue(fields, ["건축물용도"]);
		// PATCH 2.284: 교차로 매물 유형은 처음 5줄 중 두 번째 줄을 최우선 기준으로 사용

const crossroadTypeLine = firstFiveRows[1] || "";

const listingTypeTitle = getFirstMatch(firstLines, /^\s*\[(?:매매|전세|월세|년세)\]\s*([^\n]+)/m);

const propertyTypeClues = [firstLines, buildingKindText, buildingUseText].join("\n");

const strongPropertyTypeClues = [listingTypeTitle, buildingKindText, buildingUseText].join("\n");

const landTitleTypes = /^(전|답|대|임야|과수원|공장용지|주차장|잡종지|창고용지|목장용지|도로|하천)$/;
		// PATCH 2.240: 처음 5줄에 적힌 면적명 조합만으로 표시 모드와 입력 대상을 고정

const areaMode = landArea && buildingArea && totalArea
			? "land_building_total"
			: (contractArea && exclusiveArea
				? "contract_private"
				: (supplyArea && exclusiveArea
				? "supply_private"
				: (landArea && totalArea ? "land_total" : (landArea ? "land_only" : ""))));

const supply = areaMode === "land_building_total" || areaMode === "land_total" ? totalArea : (contractArea || supplyArea);

const exclusive = areaMode === "land_building_total" ? buildingArea : exclusiveArea;

const basicFloor = fieldValue(fields, ["지하층/지상층"]).match(/(-?\d+)\s*\/\s*(\d+)/);

const roomBath = rooms || fieldValue(fields, ["방/욕실수"]).match(/(\d+)\s*\/\s*(\d+)/);

const dealTypes = [];
		// PATCH 2.249: 보증금만으로 월세를 체크하지 않고 첫 5줄의 거래유형과 실제 금액 항목으로만 판단

const headlineDeal = getFirstMatch(firstLines, /^\s*\[(매매|전세|월세|년세)\]/m);
		if (headlineDeal) {

const direction = fieldValue(fields, ["방향"]) || getFirstMatch(value, /방향\s*[:：]?\s*([가-힣]+향)/);

const maintenanceIncludes = fieldValue(fields, ["관리비 포함 내역"]);

const maintenanceBaseText = fieldValue(fields, ["부과기준"]);

const maintenanceReasonText = fieldValue(fields, ["부과사유"]);

const heatingText = fieldValue(fields, ["난방시설"]);

const coolingText = fieldValue(fields, ["냉방시설"]);

const furnitureText = fieldValue(fields, ["가구"]);

const applianceText = fieldValue(fields, ["가전"]);

const etcFacilityText = fieldValue(fields, ["기타시설"]);

const moveInText = fieldValue(fields, ["입주가능일"]);

const moveInDate = parseMoveInDateText(moveInText);
		// PATCH 2.253: 간편등록에서는 대출 항목을 매물 유형과 무관하게 우선 확인 필요로 시작

const loanStatus = "check";

const address = normalizeAddress(value);

const description = extractCrossroadDescription(value);

function applyParsedListing(parsed)
	{

const dealTypes = Array.isArray(parsed.dealTypes) && parsed.dealTypes.length ? parsed.dealTypes : (parsed.deal ? [parsed.deal] : []);
		if (dealTypes.length) {
			document.querySelectorAll(".property-deal-check").forEach((input) => { input.checked = false; });
			dealTypes.forEach((deal) => setCheck(`.property-deal-check[value="${deal}"]`, true));
			if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
			setTimeout(() => {
				setInput("priceJeonseDepositInput", parsed.priceJeonse);
				setInput("priceSaleInput", parsed.priceSale);
				setInput("priceMonthlyDepositInput", parsed.priceMonthlyDeposit);
				setInput("priceMonthlyRentInput", parsed.priceMonthlyRent);
				setInput("priceYearlyDepositInput", parsed.priceMonthlyDeposit);
				setInput("priceYearlyRentInput", parsed.priceYearlyRent);
			}, 0);
		}
		setInput("propertyLocationSummaryInput", parsed.title);
		setInput("propertyAddressInput", parsed.address);

const maintenanceWon = Number(String(parsed.maintenanceWon || "").replace(/[^0-9]/g, ""));

const isUnder100k = Number.isFinite(maintenanceWon) && maintenanceWon > 0 && maintenanceWon < 100000;

const includes = parsed.maintenanceIncludes || "";
			// PATCH 2.274: 관리비 포함 내역이 없으면 공용관리비와 기타관리비를 기본 선택

const furnitureText = parsed.furnitureText || parsed.description;
		if (/침대/.test(furnitureText)) setCheck("furnitureBedChk", true);
		if (/신발장/.test(furnitureText)) setCheck("furnitureShoesChk", true);
		if (/붙박이장/.test(furnitureText)) setCheck("furnitureBuiltInChk", true);

function bindQuickPropertySourceOptions()
	{

const options = Array.from(document.querySelectorAll('input[name="quickPropertySource"]'));
		if (!options.length) return;
		options.forEach((input) => {
			if (input.dataset.quickSourceBound === "1") return;
			input.dataset.quickSourceBound = "1";
			input.addEventListener("change", () => {
				if (input.checked) {
					options.forEach((other) => {
						if (other !== input) other.checked = false;
					});
				}
				if (!options.some((option) => option.checked)) {
					$("quickPropertySourceCrossroad")?.click();

const crossroad = options.find((option) => option.value === "crossroad");
					if (crossroad) crossroad.checked = true;
				}
			});
		});
	}

function getQuickPropertySource()
	{

const selected = document.querySelector('input[name="quickPropertySource"]:checked');
		return selected ? selected.value : "crossroad";
	}

// PATCH 2.263: 간편매물등록 모달은 열 때마다 이전 붙여넣기 내용을 비움

function resetQuickPropertyModal()
	{

const textarea = $("quickPropertyTextarea");
		if (textarea) {
			textarea.value = "";
			textarea.dispatchEvent(new Event("input", { bubbles: true }));
		}
		document.querySelectorAll('input[name="quickPropertySource"]').forEach((input) => {
			input.checked = input.value === "crossroad";
		});
	}

function openQuickPropertyModal()
	{

const modal = $("quickPropertyModal");

const textarea = $("quickPropertyTextarea");
		if (!modal) return;
		resetQuickPropertyModal();
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		setTimeout(() => textarea?.focus(), 30);
	}

function closeQuickPropertyModal()
	{

async function pasteQuickPropertyText()
	{

const textarea = $("quickPropertyTextarea");
		if (!textarea) return;
		try {
			if (navigator.clipboard && navigator.clipboard.readText) {

const text = await navigator.clipboard.readText();
				if (text) {
					textarea.value = text;
					textarea.dispatchEvent(new Event("input", { bubbles: true }));
				}
			}
		} catch (err) {
			console.warn("간편 매물 클립보드 붙여넣기 실패:", err);
			textarea.focus();
		}
	}

function applyQuickPropertyText()
	{

const textarea = $("quickPropertyTextarea");

const text = String(textarea?.value || "").trim();
		if (!text) {
			textarea?.focus();
			return;
		}

function bind()
	{

let quickPropertyBackdropPointerStarted = false;
		btn.addEventListener("click", (event) => {
			event.preventDefault();
			openQuickPropertyModal();
		});

		$("quickPropertyPasteBtn")?.addEventListener("click", (event) => {
			event.preventDefault();
			pasteQuickPropertyText();
		});
		$("quickPropertyCancelBtn")?.addEventListener("click", (event) => {
			event.preventDefault();
			closeQuickPropertyModal();
		});
		$("quickPropertyApplyBtn")?.addEventListener("click", (event) => {
			event.preventDefault();
			applyQuickPropertyText();
		});
		$("quickPropertyModal")?.addEventListener("pointerdown", (event) => {
			quickPropertyBackdropPointerStarted = event.target === $("quickPropertyModal");
		});
		$("quickPropertyModal")?.addEventListener("click", (event) => {
			if (quickPropertyBackdropPointerStarted && event.target === $("quickPropertyModal")) closeQuickPropertyModal();
			quickPropertyBackdropPointerStarted = false;
		});
		document.addEventListener("keydown", (event) => {

const modal = $("quickPropertyModal");
			if (event.key === "Escape" && modal?.classList.contains("open")) closeQuickPropertyModal();
		});
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
	else bind();
})();

/* ===== PATCH: 로그인/로그아웃/세션 복구 시 부동산 홈 전환 ===== */
(function bindAuthStateGoHome()
{

let authHomeBound = false;

const authModal = document.getElementById("authModal");
		if (authModal) {
			authModal.classList.remove("open", "profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}

		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.remove("active");
		});

const homeBtn = Array.from(document.querySelectorAll(".topbar-menu-item")).find((btn) => {

const text = String(btn.textContent || "").trim();
			return text === "부동산 홈" || text === "홈";
		});

		if (homeBtn) homeBtn.classList.add("active");

		try {
			window.scrollTo(0, 0);
		} catch (error) {}
	}

function bind()
	{
		if (authHomeBound) return;

const client = typeof getRealjejuSupabaseClient === "function" ? getRealjejuSupabaseClient() : null;
		if (!client || !client.auth || typeof client.auth.onAuthStateChange !== "function") return;

		authHomeBound = true;

		client.auth.onAuthStateChange(function (event)
		{
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")
			{
				goRealjejuHome();
			}
		});
	}

window.realjejuGoHome = goRealjejuHome;

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

/* ===== PATCH: 모든 휴대폰 입력 010-0000-0000 자동 포맷 ===== */
(function bindRealjejuPhoneInputs()
{

function formatPhoneNumber(value)
	{

const digits = String(value || "").replace(/[^0-9]/g, "").slice(0, 11);

		if (digits.length === 0) return "";
		if (digits.length <= 3)
		{
			return digits.length === 3 ? digits + "-" : digits;
		}
		if (digits.length <= 7)
		{
			return digits.slice(0, 3) + "-" + digits.slice(3) + (digits.length === 7 ? "-" : "");
		}
		return digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
	}

function bindPhoneInput(input)
	{
		if (!input || input.dataset.realjejuPhoneFormatBound === "1") return;
		input.dataset.realjejuPhoneFormatBound = "1";
		input.setAttribute("inputmode", "numeric");
		input.setAttribute("maxlength", "13");

		input.addEventListener("input", function ()
		{

const before = input.value;

const beforeCursor = input.selectionStart || before.length;

const formatted = formatPhoneNumber(before);
			input.value = formatted;

const diff = formatted.length - before.length;

const nextCursor = Math.max(0, Math.min(formatted.length, beforeCursor + diff));
			try {
				input.setSelectionRange(nextCursor, nextCursor);
			} catch (error) {}
		});

		if (input.value) input.value = formatPhoneNumber(input.value);
	}

function bindAll()
	{
		document.querySelectorAll('input[type="tel"]').forEach(bindPhoneInput);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bindAll);
	} else {
		bindAll();
	}

	document.addEventListener("focusin", function (event)
	{

const input = event.target && event.target.matches ? event.target : null;
		if (input && input.matches('input[type="tel"]')) bindPhoneInput(input);
	});
})();

/* ===== PATCH: 전화번호 입력 백스페이스/커서 개선 ===== */
(function enhancePhoneInputs(){

function formatPhone(value){

const d = String(value||"").replace(/[^0-9]/g,"").slice(0,11);
		if (d.length <= 3) return d.length===3 ? d+"-" : d;
		if (d.length <= 7) return d.slice(0,3)+"-"+d.slice(3) + (d.length===7 ? "-" : "");
		return d.slice(0,3)+"-"+d.slice(3,7)+"-"+d.slice(7);
	}

function bind(input){
		if (!input || input.dataset.realjejuPhoneBackspaceBound === "1") return;
		input.dataset.realjejuPhoneBackspaceBound = "1";

		input.setAttribute("inputmode","numeric");
		input.setAttribute("maxlength","13");

		input.addEventListener("input", function(){

const before = input.value;

const pos = input.selectionStart || before.length;

const formatted = formatPhone(before);
			input.value = formatted;

let newPos = pos;
			if (formatted[pos-1] === '-') newPos = pos + 1;

			try { input.setSelectionRange(newPos, newPos); } catch(e){}
		});

		input.addEventListener("keydown", function(e){
			if (e.key !== "Backspace") return;

const pos = input.selectionStart;

			if (pos > 0 && input.value[pos-1] === '-') {
				e.preventDefault();

const newVal = input.value.slice(0,pos-2) + input.value.slice(pos);
				input.value = newVal;

const newPos = pos - 1;
				try { input.setSelectionRange(newPos,newPos); } catch(e){}
			}
		});

		if (input.value) input.value = formatPhone(input.value);
	}

function init(){
		document.querySelectorAll('input[type="tel"]').forEach(bind);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

const addressInput = document.getElementById("propertyAddressInput");

const modal = document.getElementById("propertyAddressSearchModal");
	if (!addressInput || !modal) return;

const searchScreen = document.getElementById("propertyAddressSearchScreen");

const closeBtn = document.getElementById("propertyAddressSearchCloseBtn");

const form = document.getElementById("propertyAddressSearchForm");

const searchInput = document.getElementById("propertyAddressSearchInput");

const guide = document.getElementById("propertyAddressSearchGuide");

const results = document.getElementById("propertyAddressSearchResults");

const editBtn = document.getElementById("propertyAddressEditBtn");

const roadEl = document.getElementById("propertyAddressSelectedRoad");

const jibunEl = document.getElementById("propertyAddressSelectedJibun");

const confirmBtn = document.getElementById("propertyAddressConfirmBtn");

const propertyTypeSelect = document.getElementById("propertyTypeSelect");

const locationRow = document.getElementById("propertyAddressLocationRow");

const locationModeRadios = Array.from(document.querySelectorAll('input[name="propertyAddressLocationMode"]'));

const locationHelp = document.getElementById("propertyAddressLocationHelp");

const locationDirectSearchBtn = document.getElementById("propertyAddressLocationDirectSearchBtn");

const locationDirectSearchBox = document.getElementById("propertyAddressLocationDirectSearchBox");

const locationDirectSearchInput = document.getElementById("propertyAddressLocationDirectSearchInput");

let selectedAddress = null;

let addressLocationRectangle = null;

let addressLocationCenter = null;

let addressLocationBounds = null;

let isAddressRectangleDragging = false;

let addressRectangleDragStartLatLng = null;

const quickAddressFallbackCenter = { lat: 33.3617, lng: 126.5292 };

// PATCH 2.262: 매물등록 새 글 시작 시 주소 지도와 좌표 상태를 완전히 비움

window.REALJEJU_PROPERTY_ADDRESS = null;
	}

function normalizeAddressResult(item){

const roadAddress = item?.road_address?.address_name || item?.road_address_name || "";

const jibunAddress = item?.address?.address_name || item?.address_name || "";

const displayAddress = roadAddress || jibunAddress || item?.place_name || "";

const zonecode = item?.road_address?.zone_no || item?.zone_no || "";
		return {
			roadAddress: roadAddress || displayAddress,
			jibunAddress: jibunAddress || displayAddress,
			zonecode,
			lat: item?.y || "",
			lng: item?.x || "",
			raw: item
		};
	}

// PATCH 2.318: 간편입력 주소 검색 실패 시에도 주소값과 지도 영역은 먼저 열어 둔다

function applyAddressInputDataset(address)
	{
		if (!addressInput) return;

const addressRoad = address.roadAddress || "";

const addressJibun = address.jibunAddress || addressRoad || "";

const address1 = addressJibun || addressRoad || "";

function buildPropertyAddressSearchQueries(keyword){

const q = String(keyword || "").trim().replace(/\s+/g, " ");
		if (!q) return [];
		// PATCH 2.318: 제주시/서귀포시 주소 모두 카카오 주소검색 후보에 안정적으로 포함

const compactRoad = q
			.replace(/^제주도\s+/, "제주특별자치도 ")
			.replace(/^제주\s+/, "제주특별자치도 ")
			.replace(/([가-힣]+로)\s*(\d)/g, "$1 $2");

const jejuDoAlias = compactRoad.replace(/^제주특별자치도\s+/, "제주도 ");

const base = Array.from(new Set([q, compactRoad, jejuDoAlias].filter(Boolean)));

const alreadyHasCity = /(?:제주시|서귀포시)/.test(compactRoad);

const prefixes = alreadyHasCity
			? ["", "제주특별자치도 ", "제주도 "]
			: ["", "제주 ", "제주시 ", "서귀포시 ", "제주특별자치도 제주시 ", "제주특별자치도 서귀포시 ", "제주특별자치도 "];

const queries = [];
		prefixes.forEach(prefix => {
			base.forEach(value => {

const next = `${prefix}${value}`.trim();

const cleaned = next
					.replace(/제주특별자치도\s+제주특별자치도\s+/g, "제주특별자치도 ")
					.replace(/제주도\s+제주도\s+/g, "제주도 ")
					.replace(/제주특별자치도\s+제주도\s+/g, "제주특별자치도 ")
					.replace(/제주도\s+제주특별자치도\s+/g, "제주특별자치도 ")
					.replace(/\s+/g, " ")
					.trim();
				if (cleaned && !queries.includes(cleaned)) queries.push(cleaned);
			});
		});
		return queries;
	}

function getPublicRegionAddress(address){

const value = String(address || "").trim();

const match = value.match(/^(.+?(?:읍|면|동|리))(?=\s|$)/);
		return match ? match[1] : value;
	}

function setAddressLocationDataset(mode){
		if (!addressInput) return;
		addressInput.dataset.locationDisplayType = mode;
		if (addressLocationBounds) {
			addressInput.dataset.locationSwLat = addressLocationBounds.swLat;
			addressInput.dataset.locationSwLng = addressLocationBounds.swLng;
			addressInput.dataset.locationNeLat = addressLocationBounds.neLat;
			addressInput.dataset.locationNeLng = addressLocationBounds.neLng;
		}
	}

function getRectangleBoundsFromCenter(center){
		if (!center) return null;

const lat = Number(center.getLat ? center.getLat() : center.Ma || 0);

const lng = Number(center.getLng ? center.getLng() : center.La || 0);

const halfMeter = 100;

const latDelta = halfMeter / 111320;

const lngDelta = halfMeter / (111320 * Math.max(Math.cos(lat * Math.PI / 180), 0.000001));
		return {
			swLat: lat - latDelta,
			swLng: lng - lngDelta,
			neLat: lat + latDelta,
			neLng: lng + lngDelta
		};
	}

function isLatLngInsideAddressBounds(latLng){
		if (!latLng || !addressLocationBounds) return false;

const lat = latLng.getLat();

const lng = latLng.getLng();
		return lat >= addressLocationBounds.swLat
			&& lat <= addressLocationBounds.neLat
			&& lng >= addressLocationBounds.swLng
			&& lng <= addressLocationBounds.neLng;
	}

const centerLat = (addressLocationBounds.swLat + addressLocationBounds.neLat) / 2;

const lat = Number(selectedAddress.lat);

const latDiff = mouseEvent.latLng.getLat() - addressRectangleDragStartLatLng.getLat();

function applyAddressLocationMode(){

function closeModal(){
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
	}

function updateSearchValueState(){
		if (!form || !searchInput) return;
		form.classList.toggle("has-value", !!String(searchInput.value || "").trim());
	}

function renderGuide(){
		if (guide) guide.style.display = "block";
		if (results) {
			results.classList.remove("open");
			results.innerHTML = "";
		}
	}

const address = normalizeAddressResult(item);

async function searchAddressLocationDirect(){

let found = null;

const queries = buildPropertyAddressSearchQueries(query);
		for (const q of queries) {

const list = await searchAddressByGeocoder(q);
			if (list.length) {
				found = normalizeAddressResult(list[0]);
				break;
			}
		}
		if (!found) {
			for (const q of queries) {

let found = null;

const queries = buildPropertyAddressSearchQueries(value);
		for (const q of queries) {

const list = await searchAddressByGeocoder(q);
			if (list.length) {
				found = normalizeAddressResult(list[0]);
				break;
			}
		}
		if (!found) {
			for (const q of queries) {

const addressRoad = found.roadAddress || "";

const addressJibun = found.jibunAddress || addressRoad || value;

const address1 = addressJibun || addressRoad || value;

const publicAddress = address1;

function restorePropertyAddressLocation(saved)
	{

const data = saved && typeof saved === "object" ? saved : {};

const addressRoad = data.addressRoad || data.roadAddress || "";

const addressJibun = data.addressJibun || data.jibunAddress || data.address1 || data.addressDisplay || data.publicAddress || data.public_address || "";

const address1 = data.address1 || addressJibun || addressRoad || "";

const publicAddress = data.publicAddress || data.public_address || data.addressDisplay || address1;

const rawLat = data.lat;

const rawLng = data.lng;

const lat = rawLat === undefined || rawLat === "" ? NaN : Number(rawLat);

async function handleSearch(){

const queries = buildPropertyAddressSearchQueries(query);
		console.info("[REALJEJU 주소검색] 검색어 후보", queries);

const seen = new Set();

const merged = [];
		for (const q of queries) {

const list = await searchAddressByGeocoder(q);
			list.forEach(item => {

const normalized = normalizeAddressResult(item);

const key = `${normalized.roadAddress}|${normalized.jibunAddress}`;
				if (key.trim() && !seen.has(key)) {
					seen.add(key);
					merged.push(item);
				}
			});
			if (merged.length >= 8) break;
		}
		if (!merged.length) {
			for (const q of queries) {

const list = await searchAddressByKeyword(q);
				list.forEach(item => {

const normalized = normalizeAddressResult(item);

function confirmAddress(){
		if (!selectedAddress) return;

const addressRoad = selectedAddress.roadAddress || "";

const addressJibun = selectedAddress.jibunAddress || "";

const address1 = addressJibun || addressRoad || "";

window.realjejuResetPropertyAddressLocation = resetPropertyAddressLocationState;

window.realjejuRestorePropertyAddressLocation = restorePropertyAddressLocation;
	editBtn?.addEventListener("click", showSearchScreen);
	confirmBtn?.addEventListener("click", confirmAddress);
})();

function isPropertySaveCompleteModal() {

const modal = document.getElementById("authErrorModal");
		if (!modal || !modal.classList.contains("open")) return false;

const title = document.getElementById("authErrorTitle");

const message = document.getElementById("authErrorMessage");

const titleText = String(title && title.textContent || "").trim();

const messageText = String(message && message.textContent || "").trim();
		return /매물\s*(등록|수정)\s*완료/.test(titleText)
			|| /매물이\s*(등록|수정)되었습니다/.test(messageText)
			|| /매물\s*(등록|수정)이\s*완료\s*되었습니다/.test(messageText);
	}

const _alert = window.alert;

window.alert = function(msg){
    _alert(msg);
    try{
