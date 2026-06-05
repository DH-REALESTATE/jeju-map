// REALJEJU app.js - original JS order preserved / Ver 2.551

const globalBrandLink = document.querySelector('.global-brand');
if (globalBrandLink) {
	globalBrandLink.addEventListener('click', () => {
		window.location.href = "https://realjeju.app";
	});
}

/* PATCH 2.981: 공지사항 페이지 */
(function bindNoticePage()
{
	function formatNoticeDate(value)
	{
		const date = new Date(value || "");
		if (Number.isNaN(date.getTime())) return "";
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}.${mm}.${dd}`;
	}

	function escapeNoticeHtml(value)
	{
		return String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function renderDefaultNotices(listEl)
	{
		const rows = [
			{
				title: "리얼제주 공지사항 게시판 오픈 안내",
				content: "서비스 업데이트, 점검 일정, 이용 안내를 이곳에서 순차적으로 안내드립니다.",
				category: "중요",
				is_pinned: true,
				created_at: "2026-05-25"
			},
			{
				title: "매물 정보 확인 안내",
				content: "매물 정보와 거래 조건은 등록 중개사무소 또는 거래 당사자에게 최종 확인해 주세요.",
				category: "안내",
				is_pinned: false,
				created_at: "2026-05-25"
			},
			{
				title: "관리자 공지사항 관리 기능 준비",
				content: "Supabase notices 테이블 설정 후 관리자 페이지에서 공지 작성, 수정, 공개 여부, 상단 고정을 관리할 수 있습니다.",
				category: "업데이트",
				is_pinned: false,
				created_at: "2026-05-25"
			}
		];
		listEl.innerHTML = rows.map((row) => `
			<article class="notice-item ${row.is_pinned ? "is-pinned" : ""}">
				<div class="notice-item-meta">
					<span class="notice-badge ${row.is_pinned ? "" : "notice-badge-soft"}">${escapeNoticeHtml(row.category)}</span>
					<time datetime="${escapeNoticeHtml(row.created_at)}">${escapeNoticeHtml(formatNoticeDate(row.created_at))}</time>
				</div>
				<div>
					<h2 class="notice-item-title">${escapeNoticeHtml(row.title)}</h2>
					<p class="notice-item-desc">${escapeNoticeHtml(row.content)}</p>
				</div>
			</article>
		`).join("");
	}

	async function loadPublicNotices()
	{
		const listEl = document.getElementById("noticeList");
		if (!listEl) return;
		const client = getRealjejuSupabaseClient();
		if (!client) {
			renderDefaultNotices(listEl);
			return;
		}
		listEl.innerHTML = '<div class="notice-empty">공지사항을 불러오는 중입니다.</div>';
		try {
			const { data, error } = await client
				.from("notices")
				.select("id, title, content, category, is_pinned, is_visible, created_at, updated_at, deleted_at")
				.eq("is_visible", true)
				.is("deleted_at", null)
				.order("is_pinned", { ascending: false })
				.order("created_at", { ascending: false });
			if (error) throw error;
			const rows = Array.isArray(data) ? data : [];
			if (!rows.length) {
				listEl.innerHTML = '<div class="notice-empty">등록된 공지사항이 없습니다.</div>';
				return;
			}
			listEl.innerHTML = rows.map((row) => {
				const category = String(row.category || (row.is_pinned ? "중요" : "공지")).trim();
				const dateText = formatNoticeDate(row.created_at || row.updated_at);
				return `
					<article class="notice-item ${row.is_pinned ? "is-pinned" : ""}">
						<div class="notice-item-meta">
							<span class="notice-badge ${row.is_pinned ? "" : "notice-badge-soft"}">${escapeNoticeHtml(category)}</span>
							<time datetime="${escapeNoticeHtml(String(row.created_at || ""))}">${escapeNoticeHtml(dateText)}</time>
						</div>
						<div>
							<h2 class="notice-item-title">${escapeNoticeHtml(row.title || "제목 없음")}</h2>
							<p class="notice-item-desc">${escapeNoticeHtml(row.content || "")}</p>
						</div>
					</article>
				`;
			}).join("");
		} catch (err) {
			console.warn("공지사항 로드 실패:", err);
			renderDefaultNotices(listEl);
		}
	}

	function setNoticeTopbarActive()
	{
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.toggle("active", String(btn.textContent || "").trim() === "공지사항");
		});
	}

	function syncNoticeAdminButton()
	{
		const btn = document.getElementById("noticeAdminManageBtn");
		if (!btn) return;
		const user = window.currentRealjejuAuthUser || (typeof currentRealjejuAuthUser !== "undefined" ? currentRealjejuAuthUser : null);
		const hasAdminMenu = Array.from(document.querySelectorAll(".topbar-menu-item")).some((item) => String(item.textContent || "").trim() === "관리자 페이지");
		const accountLabel = String(document.querySelector(".global-auth-trigger")?.textContent || "").trim();
		const isAdmin = (typeof isAdminUser === "function" && isAdminUser(user)) || hasAdminMenu || accountLabel.includes("관리자");
		btn.hidden = !isAdmin;
	}

	function closeNoticePage()
	{
		const panel = document.getElementById("noticePagePanel");
		if (panel) panel.setAttribute("aria-hidden", "true");
		document.body.classList.remove("notice-page-open");
	}

	function openNoticePage()
	{
		const panel = document.getElementById("noticePagePanel");
		if (!panel) return;
		if (typeof closeAuthModal === "function") closeAuthModal();
		if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		if (typeof window.closePaymentPage === "function") window.closePaymentPage();
		if (typeof window.closePropertyRegisterPage === "function") window.closePropertyRegisterPage();
		if (typeof window.closeAdminPage === "function") window.closeAdminPage();
		if (typeof window.closeBrokerHomePage === "function") window.closeBrokerHomePage();
		document.body.classList.remove(
			"auth-page-open",
			"payment-page-open",
			"profile-page-open",
			"myinfo-page-open",
			"profile-edit-page-open",
			"broker-office-info-page-open",
			"broker-office-edit-page-open",
			"property-register-page-open",
			"admin-page-open",
			"broker-home-page-open",
			"my-suite-page-open",
			"notice-page-open"
		);
		[
			"mySuitePanel",
			"paymentPagePanel",
			"myInfoPagePanel",
			"profileEditPagePanel",
			"brokerOfficeInfoPagePanel",
			"brokerOfficeEditPagePanel",
			"brokerHomePanel",
			"adminPagePanel",
			"propertyRegisterPage"
		].forEach((id) => {
			const el = document.getElementById(id);
			if (el) el.setAttribute("aria-hidden", "true");
		});
		document.body.classList.add("sidebar-list-collapsed", "notice-page-open");
		panel.setAttribute("aria-hidden", "false");
		panel.scrollTop = 0;
		setNoticeTopbarActive();
		syncNoticeAdminButton();
		loadPublicNotices();
	}

	document.addEventListener("click", function(event) {
		const menuBtn = event.target && event.target.closest ? event.target.closest(".topbar-menu-item") : null;
		if (!menuBtn) return;
		if (String(menuBtn.textContent || "").trim() !== "공지사항") {
			closeNoticePage();
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
		openNoticePage();
	}, true);

	document.addEventListener("click", function(event) {
		const manageBtn = event.target && event.target.closest ? event.target.closest("#noticeAdminManageBtn") : null;
		if (!manageBtn) return;
		event.preventDefault();
		event.stopPropagation();
		const adminOpener = typeof window.openAdminPage === "function" ? window.openAdminPage : (typeof openAdminPage === "function" ? openAdminPage : null);
		if (adminOpener) {
			Promise.resolve(adminOpener("notices")).then(() => {
				const manager = document.getElementById("adminNoticeManager");
				if (manager) manager.scrollIntoView({ block: "start", behavior: "smooth" });
				const titleInput = document.getElementById("adminNoticeTitleInput");
				if (titleInput && typeof titleInput.focus === "function") titleInput.focus({ preventScroll: true });
			});
		}
	}, true);

	window.openNoticePage = openNoticePage;
	window.closeNoticePage = closeNoticePage;
	window.loadPublicNotices = loadPublicNotices;
})();

/* ===== PATCH: 매물 등록 - 상세 정보 글자수 ===== */
(function bindPropertyDetailDescriptionCounter()
{
	const textarea = document.getElementById("propertyDetailDescriptionInput");
	const counter = document.getElementById("propertyDetailDescriptionCount");
	if (!textarea || !counter) return;

	const update = () => {
		if (textarea.value.length > 5000) textarea.value = textarea.value.slice(0, 5000);
		counter.textContent = textarea.value.length + "/5000";
	};

	textarea.addEventListener("input", update);
	update();
})();

/* PATCH 2.551: 내 정보 페이지형 패널에서 상단 메뉴 이동 시 지도 복귀 보장 */
(function bindProfilePageTopbarExit()
{
	function closeProfilePagePanel()
	{
		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) panel.setAttribute("aria-hidden", "true");
		});
		const authModal = document.getElementById("authModal");
		if (authModal) {
			authModal.classList.remove("open", "profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.remove("profile-page-active");
		document.body.classList.remove("auth-page-open", "profile-page-open", "myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open");
		["authProfileSetupScreen", "authBrokerOfficeInfoScreen", "authBrokerOfficeScreen"].forEach((id) => {
			const screen = document.getElementById(id);
			if (screen) screen.classList.add("auth-screen-hidden");
		});
		document.body.style.overflow = "";
	}

	function closeOverlayPanelsForHome()
	{
		if (typeof window.realjejuGoHome === "function") {
			window.realjejuGoHome({ resetDetail: true });
			return;
		}
		closeProfilePagePanel();
		try {
			if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		} catch (error) {}
		try {
			if (typeof window.closePaymentPage === "function") window.closePaymentPage();
		} catch (error) {}
		try {
			if (typeof window.closePropertyRegisterPage === "function") window.closePropertyRegisterPage();
		} catch (error) {}
		try {
			if (typeof window.closeAdminPage === "function") window.closeAdminPage();
		} catch (error) {}
		try {
			if (typeof window.closeBrokerHomePage === "function") window.closeBrokerHomePage();
		} catch (error) {}

		document.body.classList.remove(
			"auth-page-open",
			"payment-page-open",
			"profile-page-open",
			"myinfo-page-open",
			"profile-edit-page-open",
			"broker-office-info-page-open",
			"broker-office-edit-page-open",
			"property-register-page-open",
			"admin-page-open",
			"broker-home-page-open",
			"my-suite-page-open",
			"notice-page-open",
			"detail-page-panel-open",
			"shared-detail-mode"
		);
		document.body.classList.add("sidebar-list-collapsed");
		if (typeof state !== "undefined" && state) state.isListOpen = false;

		[
			["paymentPagePanel", "true"],
			["myInfoPagePanel", "true"],
			["propertyRegisterPage", "true"],
			["adminPagePanel", "true"],
			["brokerHomePanel", "true"],
			["mySuitePanel", "true"],
			["noticePagePanel", "true"]
		].forEach(function(item) {
			const panel = document.getElementById(item[0]);
			if (panel) panel.setAttribute("aria-hidden", item[1]);
		});
		try {
			if (typeof closeDetailPanel === "function") closeDetailPanel();
		} catch (error) {}
		try {
			if (typeof hideRoadview === "function") Promise.resolve(hideRoadview()).catch(() => {});
		} catch (error) {}
		const mapWrap = document.querySelector(".map-wrap");
		if (mapWrap) mapWrap.classList.remove("is-roadview-open");

		try {
			if (typeof refreshMapLayout === "function") {
				refreshMapLayout();
				setTimeout(refreshMapLayout, 80);
				setTimeout(refreshMapLayout, 240);
			}
		} catch (error) {}
	}

	document.addEventListener("click", function(event) {
		const menuBtn = event.target && event.target.closest ? event.target.closest(".topbar-menu-item") : null;
		if (!menuBtn) return;
		const label = String(menuBtn.textContent || "").trim();
		if (label === "부동산 홈" || label === "홈") {
			setTimeout(closeOverlayPanelsForHome, 0);
			return;
		}
		setTimeout(closeProfilePagePanel, 0);
	}, true);
})();


/* ===== PATCH: 중개사무소 메모 글자수 ===== */
(function bindPropertyAgencyMemoCounter()
{
	const textarea = document.getElementById("propertyAgencyMemoInput");
	const counter = document.getElementById("propertyAgencyMemoCount");
	if (!textarea || !counter) return;

	const update = () => {
		if (textarea.value.length > 800) textarea.value = textarea.value.slice(0, 800);
		counter.textContent = textarea.value.length + "/800";
	};

	textarea.addEventListener("input", update);
	update();
})();


/* ===== PATCH: 소속공인중개사 체크 시 담당자 정보 활성화 ===== */
(function bindRegistrantLicensedAgentToggle()
{
	const chk = document.getElementById("registrantLicensedAgentChk");
	const manager = document.getElementById("registrantManagerNameInput");
	const phone = document.getElementById("registrantPhone2Input");
	if (!chk || !manager || !phone) return;

	function toggle()
	{
		const enabled = chk.checked;
		[manager, phone].forEach((input) => {
			input.disabled = !enabled;
			if (!enabled) input.value = "";
		});
	}

	chk.addEventListener("change", toggle);
	toggle();
})();

const UI_FONT_STACK = 'Inter, Pretendard, Noto Sans KR, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif';
//const BADGE_BASE_HEX = '#3B82F6'; // 제주코발트블루
const BADGE_BASE_HEX = '#3B82F6';
document.documentElement.style.setProperty('--brand', BADGE_BASE_HEX);
const BADGE_BASE_ALPHA = 0.84;
function hexToRgba(hex, alpha = 1)
{
	const value = String(hex || '').replace('#', '').trim();
	const normalized = value.length === 3 ? value.split('').map(ch => ch + ch).join('') : value;
	if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return hex;
	const r = parseInt(normalized.slice(0, 2), 16);
	const g = parseInt(normalized.slice(2, 4), 16);
	const b = parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const APP_NAME = "REALJEJU.APP";
const APP_VERSION = "3.271";

const REALJEJU_PROPERTY_TYPE_ALIAS_MAP = {
	apartment: "apartment",
	"apt": "apartment",
	"아파트": "apartment",
	officetel: "officetel",
	"office_tel": "officetel",
	"오피스텔": "officetel",
	room: "room",
	"oneroom": "room",
	"one_room": "room",
	"원룸": "room",
	"투룸": "room",
	"원룸투룸": "room",
	villa: "villa",
	"빌라": "villa",
	"연립": "villa",
	"다세대": "villa",
	"연립다세대": "villa",
	house: "house",
	"detached_house": "house",
	"single_house": "house",
	"single_family_house": "house",
	"단독": "house",
	"단독주택": "house",
	multi_family_house: "multi_family_house",
	"multi_family": "multi_family_house",
	"다가구": "multi_family_house",
	"다가구주택": "multi_family_house",
	store: "store",
	"shop": "store",
	"retail": "store",
	"상가": "store",
	"상가건물": "store",
	office: "office",
	"사무실": "office",
	"업무시설": "office",
	building: "building",
	"빌딩": "building",
	"건물": "building",
	factory_warehouse: "factory_warehouse",
	"factory": "factory_warehouse",
	"warehouse": "factory_warehouse",
	"factorywarehouse": "factory_warehouse",
	"공장": "factory_warehouse",
	"창고": "factory_warehouse",
	"공장창고": "factory_warehouse",
	hotel: "hotel",
	"호텔": "hotel",
	pension: "pension",
	"펜션": "pension",
	"콘도": "pension",
	"모텔": "pension",
	"숙박": "pension",
	"농어촌민박": "pension",
	land: "land",
	"land_forest": "land",
	"landforest": "land",
	"토지": "land",
	"임야": "land",
	"토지임야": "land",
	"대지": "land",
	"전": "land",
	"답": "land",
	"과수원": "land"
};

const REALJEJU_PROPERTY_TYPE_FUZZY_PATTERNS = [
	{ value: "factory_warehouse", patterns: ["공장창고", "공장/창고", "공장", "창고"] },
	{ value: "multi_family_house", patterns: ["다가구주택", "다가구"] },
	{ value: "apartment", patterns: ["아파트", "apt"] },
	{ value: "officetel", patterns: ["오피스텔형", "오피스텔", "아파텔", "officetel"] },
	{ value: "room", patterns: ["원룸투룸", "원룸/투룸", "원룸", "투룸", "one_room", "oneroom"] },
	{ value: "villa", patterns: ["연립다세대", "연립/다세대", "다세대", "연립", "빌라"] },
	{ value: "house", patterns: ["단독/다가구", "단독다가구", "단독주택", "단독"] },
	{ value: "store", patterns: ["상가건물", "상가점포", "상가"] },
	{ value: "office", patterns: ["사무실", "업무시설"] },
	{ value: "building", patterns: ["빌딩", "건물"] },
	{ value: "hotel", patterns: ["호텔"] },
	{ value: "pension", patterns: ["농어촌민박", "펜션", "콘도", "모텔", "숙박"] },
	{ value: "land", patterns: ["토지/임야", "토지임야", "토지", "임야", "과수원", "대지"] }
];

function normalizeRealjejuPropertyTypeKey(value)
{
	return String(value || "")
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/[\/·ㆍ|_-]+/g, "")
		.trim();
}

function resolveRealjejuPropertyTypeValue(value)
{
	const text = String(value || "").trim();
	if (!text) return "";
	const exact = REALJEJU_PROPERTY_TYPE_ALIAS_MAP[normalizeRealjejuPropertyTypeKey(text)];
	if (exact) return exact;
	const key = normalizeRealjejuPropertyTypeKey(text);
	if (!key) return "";
	for (const item of REALJEJU_PROPERTY_TYPE_FUZZY_PATTERNS) {
		if (item.patterns.some((pattern) => {
			const patternKey = normalizeRealjejuPropertyTypeKey(pattern);
			return patternKey && key.includes(patternKey);
		})) return item.value;
	}
	return "";
}

function findRealjejuPropertyTypeOption(select, ...values)
{
	if (!select) return null;
	const wrap = select.closest("[data-register-dropdown]");
	const optionNodes = wrap
		? Array.from(wrap.querySelectorAll(".property-register-dropdown-option[data-value]"))
		: Array.from(select.options || []);
	const options = optionNodes
		.map((option) => ({
			node: option,
			value: String(option.dataset?.value || option.value || "").trim(),
			text: String(option.textContent || "").trim()
		}))
		.filter((option) => option.value);
	if (!options.length) return null;
	for (const raw of values) {
		const text = String(raw || "").trim();
		if (!text) continue;
		const exactValue = options.find((option) => option.value === text);
		if (exactValue) return exactValue.node;
		const exactText = options.find((option) => option.text.replace(/\s+/g, " ").trim() === text.replace(/\s+/g, " ").trim());
		if (exactText) return exactText.node;
		const alias = resolveRealjejuPropertyTypeValue(text);
		if (alias) {
			const aliasOption = options.find((option) => option.value === alias);
			if (aliasOption) return aliasOption.node;
		}
		const textKey = normalizeRealjejuPropertyTypeKey(text);
		const containsText = options.find((option) => {
			const optionKey = normalizeRealjejuPropertyTypeKey(option.text);
			return textKey && optionKey && (textKey.includes(optionKey) || optionKey.includes(textKey));
		});
		if (containsText) return containsText.node;
	}
	return null;
}

function syncRealjejuPropertyTypeSelect(select, ...values)
{
	if (!select) return "";
	const wrap = select.closest("[data-register-dropdown]");
	const label = wrap?.querySelector("[data-register-dropdown-label]");
	const activeOption = wrap?.querySelector(".property-register-dropdown-option.active[data-value], .property-register-dropdown-option[aria-selected='true'][data-value]");
	const option = findRealjejuPropertyTypeOption(
		select,
		...values,
		select.value,
		select.dataset.selectedValue,
		select.dataset.lastValue,
		wrap?.dataset.selectedValue,
		activeOption?.dataset?.value,
		activeOption?.textContent,
		label?.textContent
	);
	if (!option) {
		select.value = "";
		select.dataset.selectedValue = "";
		select.dataset.lastValue = "";
		if (wrap) wrap.dataset.selectedValue = "";
		return "";
	}
	const value = String(option.dataset?.value || option.value || "").trim();
	if (!value) return "";
	select.value = value;
	select.dataset.selectedValue = value;
	select.dataset.lastValue = value;
	if (wrap) {
		wrap.dataset.selectedValue = value;
		if (label) label.textContent = String(option.textContent || "").trim();
		wrap.querySelectorAll(".property-register-dropdown-option[data-value]").forEach((btn) => {
			const isActive = String(btn.dataset.value || "").trim() === value;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-selected", isActive ? "true" : "false");
		});
	}
	return value;
}

function resolvePropertyRegisterTypeValue(select, ...values)
{
	if (!select) return "";
	const wrap = select.closest("[data-register-dropdown]");
	const label = wrap?.querySelector("[data-register-dropdown-label]");
	const activeOption = wrap?.querySelector(".property-register-dropdown-option.active[data-value], .property-register-dropdown-option[aria-selected='true'][data-value]");
	const selectedOption = select.options && select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
	const option = findRealjejuPropertyTypeOption(
		select,
		...values,
		select.value,
		select.dataset.selectedValue,
		select.dataset.lastValue,
		wrap?.dataset.selectedValue,
		activeOption?.dataset?.value,
		activeOption?.textContent,
		selectedOption?.value,
		selectedOption?.textContent,
		label?.textContent
	);
	if (!option) return "";
	return syncRealjejuPropertyTypeSelect(select, option.dataset?.value || option.value || option.textContent || "");
}

function getPropertyRegisterTypeDebugText(select)
{
	if (!select) return "";
	const wrap = select.closest("[data-register-dropdown]");
	const label = wrap?.querySelector("[data-register-dropdown-label]");
	const activeOption = wrap?.querySelector(".property-register-dropdown-option.active[data-value], .property-register-dropdown-option[aria-selected='true'][data-value]");
	const selectedOption = select.options && select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
	return [
		select.value,
		select.dataset.selectedValue,
		select.dataset.lastValue,
		wrap?.dataset.selectedValue,
		activeOption?.dataset?.value,
		activeOption?.textContent,
		selectedOption?.value,
		selectedOption?.textContent,
		label?.textContent
	].map((value) => String(value || "").trim()).filter(Boolean).join(" / ");
}
const REALJEJU_TRASH_RETENTION_DAYS = 15;
const REALJEJU_TRASH_RETENTION_MS = REALJEJU_TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const REALJEJU_TRASH_PURGE_CACHE_MS = 10 * 60 * 1000;

function getRealjejuTrashCutoffDate()
{
	return new Date(Date.now() - REALJEJU_TRASH_RETENTION_MS);
}

function getRealjejuTrashCutoffIso()
{
	return getRealjejuTrashCutoffDate().toISOString();
}

function isRealjejuExpiredTrashDate(value)
{
	if (!value) return false;
	const time = new Date(value).getTime();
	return Number.isFinite(time) && time <= Date.now() - REALJEJU_TRASH_RETENTION_MS;
}
const REALJEJU_AGENT_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";
const REALJEJU_BROKER_ROLE_VALUES = new Set(["broker", "agent", "agent_sub", "agent_staff", "corporation", "중개사", "공인중개사", "대표 공인중개사", "소속 공인중개사", "중개보조원", "법인"]);

function isRealjejuBrokerRole(role)
{
	return REALJEJU_BROKER_ROLE_VALUES.has(String(role || "").trim());
}

function getBrokerOfficeRowStatus(row)
{
	const raw = String(row && row.status ? row.status : "").trim();
	const compact = raw.replace(/\s+/g, "").toLowerCase();
	if (!compact && row && (row.id || row.user_id || row.office_name || row.office_reg_no || row.office_address || row.phone || row.email)) return "new";
	if (["active", "approved", "approve", "accepted", "승인", "승인완료", "완료"].includes(compact)) return "active";
	if (["new", "waiting", "wait", "applied", "apply", "신청", "가입신청", "신청중"].includes(compact)) return "new";
	if (["pending", "대기", "승인대기", "대기중"].includes(compact)) return "pending";
	if (["rejected", "reject", "denied", "거부", "반려", "승인거부"].includes(compact)) return "rejected";
	if (["deleted", "delete", "trash", "withdrawn", "삭제", "휴지통"].includes(compact)) return "deleted";
	return compact;
}

function isBrokerOfficeRowOwnedByUser(row, user)
{
	if (!row || !user || !user.id) return false;
	const rowUserId = String(row.user_id || "").trim();
	return !!rowUserId && rowUserId === String(user.id);
}

function pickCurrentRealjejuBrokerOffice(rows, user)
{
	const visibleRows = (Array.isArray(rows) ? rows : []).filter((row) => {
		if (!row || row.deleted_at) return false;
		if (getBrokerOfficeRowStatus(row) === "deleted") return false;
		return isBrokerOfficeRowOwnedByUser(row, user);
	});
	return visibleRows.find((row) => getBrokerOfficeRowStatus(row) === "active")
		|| visibleRows.find((row) => row && (row.owner_name || row.office_reg_no || row.office_address))
		|| visibleRows[0]
		|| null;
}

function getBrokerOfficeLookupEmail(user, profile)
{
	const candidates = [
		user && user.email,
		profile && profile.email,
		window.realjejuCurrentProfile && window.realjejuCurrentProfile.email
	];
	const found = candidates.find((value) => String(value || "").trim());
	return found ? String(found).trim().toLowerCase() : "";
}

function mergeBrokerOfficeRows(...rowSets)
{
	const merged = [];
	const seen = new Set();
	rowSets.flat().forEach((row) => {
		if (!row || typeof row !== "object") return;
		const key = String(row.id || `${row.user_id || ""}:${row.email || ""}:${row.office_name || ""}`).trim();
		if (key && seen.has(key)) return;
		if (key) seen.add(key);
		merged.push(row);
	});
	return merged;
}

const BROKER_OFFICE_LOOKUP_CACHE_MS = 30000;
const brokerOfficeRowsCache = new Map();
const brokerOfficeRowsInflight = new Map();

async function fetchSharedBrokerOfficeRows(client, user, profile)
{
	if (!client || !user || !user.id) return [];
	const canUseEmailLookup = isRealjejuBrokerRole(profile && profile.role_request);
	const email = canUseEmailLookup ? getBrokerOfficeLookupEmail(user, profile) : "";
	const cacheKey = `${String(user.id)}|${email}`;
	const cached = brokerOfficeRowsCache.get(cacheKey);
	if (cached && Date.now() - cached.time < BROKER_OFFICE_LOOKUP_CACHE_MS) return cached.rows;
	if (brokerOfficeRowsInflight.has(cacheKey)) return brokerOfficeRowsInflight.get(cacheKey);

	const promise = (async () => {
		let userRows = [];
		let emailRows = [];
		try {
			const { data, error } = await client
				.from("agencies")
				.select("*")
				.eq("user_id", user.id)
				.order("updated_at", { ascending: false })
				.order("created_at", { ascending: false })
				.limit(10);
			if (error) throw error;
			userRows = Array.isArray(data) ? data : [];
		} catch (err) {
			console.warn("중개사무소 user_id 조회 실패:", err);
		}

		if (email) {
			try {
				const { data, error } = await client
					.from("agencies")
					.select("*")
					.ilike("email", email)
					.order("updated_at", { ascending: false })
					.order("created_at", { ascending: false })
					.limit(10);
				if (error) throw error;
				emailRows = Array.isArray(data) ? data : [];
			} catch (err) {
				console.warn("중개사무소 이메일 조회 실패:", err);
			}
		}

			const safeEmailRows = emailRows.filter((row) => {
				if (isBrokerOfficeRowOwnedByUser(row, user)) return true;
				if (String(row && row.user_id || "").trim()) return false;
				return getBrokerOfficeRowStatus(row) !== "active";
			});
			const rows = mergeBrokerOfficeRows(userRows, safeEmailRows);
			brokerOfficeRowsCache.set(cacheKey, { time: Date.now(), rows });
			return rows;
		})().finally(() => {
		brokerOfficeRowsInflight.delete(cacheKey);
	});

	brokerOfficeRowsInflight.set(cacheKey, promise);
	return promise;
}

async function fetchMySuiteBrokerOfficeRows(client, user, profile)
{
	return fetchSharedBrokerOfficeRows(client, user, profile);
}

window.realjejuFetchBrokerOfficeRows = fetchSharedBrokerOfficeRows;

function applyAppVersion()
{
	document.title = APP_NAME;

	const ogTitleMeta = document.getElementById("ogTitleMeta");
	if (ogTitleMeta) ogTitleMeta.setAttribute("content", APP_NAME);

	const ogDescriptionMeta = document.getElementById("ogDescriptionMeta");
	if (ogDescriptionMeta) ogDescriptionMeta.setAttribute("content", APP_NAME);
}

applyAppVersion();

try {
	localStorage.removeItem("realjejuScreenZoom");
	document.documentElement.style.zoom = "";
	document.body.style.zoom = "";
	delete document.body.dataset.screenZoom;
} catch (err) {}

const DETAIL_QUERY_KEY = "id";

function getDetailUrlById(id)
{
	const normalizedId = normalizeItemId(id);
	const url = new URL(window.location.href);
	if (normalizedId) {
		url.searchParams.set(DETAIL_QUERY_KEY, normalizedId);
	} else {
		url.searchParams.delete(DETAIL_QUERY_KEY);
	}
	return url;
}

function syncDetailUrl(id, { replace = false } = {})
{
	const url = getDetailUrlById(id);
	const nextUrl = `${url.pathname}${url.search}${url.hash}`;
	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	if (nextUrl === currentUrl) return;
	const method = replace ? "replaceState" : "pushState";
	window.history[method]({}, "", nextUrl);
}

function clearDetailUrl(options = {})
{
	syncDetailUrl("", options);
}

function setSharedDetailMode(enabled)
{
	document.body.classList.toggle("shared-detail-mode", !!enabled);
	if (enabled) {
		sidebar.classList.add("expanded");
		const panel = document.getElementById('sidebarDetailPanel');
		if (panel) {
			panel.style.display = 'block';
			panel.style.opacity = '';
			panel.style.pointerEvents = '';
			panel.style.visibility = '';
		}
	}
	updateSidebarWidth();
	refreshMapLayout();
}

function shouldUseSharedDetailMode()
{
	return false;
}

function normalizeItemId(value)
{
	if (value == null) return "";
	return String(value).trim();
}

let viewMap = {};
let favoriteCountMap = {};
let inquiryCountMap = {};
let detailEngagementCountSeq = 0;
let engagementCountRpcDisabled = false;
const mapListingOwnerCache = {
	profilesByUserId: new Map(),
	agenciesById: new Map(),
	agenciesByUserId: new Map(),
	agenciesByOfficeName: new Map()
};
const mapListingOwnerDataInflight = new Map();

function clearRealjejuSessionCaches()
{
	try {
		brokerOfficeRowsCache.clear();
		brokerOfficeRowsInflight.clear();
		mapListingOwnerCache.profilesByUserId.clear();
		mapListingOwnerCache.agenciesById.clear();
		mapListingOwnerCache.agenciesByUserId.clear();
		mapListingOwnerCache.agenciesByOfficeName.clear();
		mapListingOwnerDataInflight.clear();
	} catch (err) {}
}

const recentViewIncrementMap = new Map();
const detailEngagementFetchedAtMap = new Map();
const VIEW_INCREMENT_DEDUPE_MS = 2000;
const DETAIL_ENGAGEMENT_CACHE_MS = 30000;
const DETAIL_INQUIRY_COUNT_ENABLED = false;
const VIEW_COUNT_RPC_ENABLED = true;
let viewCountRpcDisabled = !VIEW_COUNT_RPC_ENABLED;
let mapListingsLoadPromise = null;
let mapListingsLastLoadedAt = 0;
const MAP_LISTINGS_BOOTSTRAP_CACHE_MS = 2500;
const MAP_LISTING_SUMMARY_SELECT = [
	"id",
	"user_id",
	"agency_id",
	"listing_no",
	"status",
	"property_type",
	"property_type_label",
	"deal_types",
	"title",
	"public_address",
	"address1",
	"lat",
	"lng",
	"updated_at",
	"created_at",
	"photos",
	"payload"
].join(",");
const MAP_LISTING_MARKER_FALLBACK_SELECT = [
	"id",
	"listing_no",
	"status",
	"property_type",
	"property_type_label",
	"deal_types",
	"title",
	"public_address",
	"address1",
	"lat",
	"lng",
	"updated_at",
	"created_at",
	"payload"
].join(",");
const LEFT_LIST_PAGE_SIZE = 30;

function preferCachedAgency(current, next)
{
	if (!current) return next;
	if (!next) return current;
	if (current.status !== "active" && next.status === "active") return next;
	if (current.status === "active" && next.status !== "active") return current;
	const currentTime = Date.parse(current.updated_at || current.created_at || "") || 0;
	const nextTime = Date.parse(next.updated_at || next.created_at || "") || 0;
	return nextTime >= currentTime ? next : current;
}

function cacheMapListingProfile(profile)
{
	if (!profile || typeof profile !== "object") return null;
	const key = getViewCountKey(profile.id);
	if (!key) return null;
	mapListingOwnerCache.profilesByUserId.set(key, profile);
	return profile;
}

function cacheMapListingAgency(agency)
{
	if (!agency || typeof agency !== "object") return null;
	const idKey = getViewCountKey(agency.id);
	const userKey = getViewCountKey(agency.user_id);
	const officeKey = String(agency.office_name || "").trim();
	if (idKey) {
		const next = preferCachedAgency(mapListingOwnerCache.agenciesById.get(idKey), agency);
		mapListingOwnerCache.agenciesById.set(idKey, next);
	}
	if (userKey) {
		const next = preferCachedAgency(mapListingOwnerCache.agenciesByUserId.get(userKey), agency);
		mapListingOwnerCache.agenciesByUserId.set(userKey, next);
	}
	if (officeKey) {
		const next = preferCachedAgency(mapListingOwnerCache.agenciesByOfficeName.get(officeKey), agency);
		mapListingOwnerCache.agenciesByOfficeName.set(officeKey, next);
	}
	return agency;
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
	const count = Number(viewMap[getViewCountKey(viewKey)] || 0);
	return `조회 ${Number.isFinite(count) ? count : 0}`;
}

function formatDetailSummaryDate(value)
{
	const raw = String(value || "").trim();
	if (!raw) return "-";
	const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (match) return `${match[1]}-${match[2]}-${match[3]}`;
	const date = new Date(raw);
	if (Number.isNaN(date.getTime())) return "-";
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function getDetailCountValue(item, keys)
{
	for (const key of keys) {
		const value = item && item[key];
		const numberValue = Number(value);
		if (Number.isFinite(numberValue)) return numberValue;
	}
	return 0;
}

function getDetailViewCount(item)
{
	const key = getItemViewKey(item);
	const mappedCount = Number(viewMap[getViewCountKey(key)]);
	if (Number.isFinite(mappedCount)) return mappedCount;
	return getDetailCountValue(item, ["viewCount", "view_count", "views", "readCount", "read_count"]);
}

function getDetailFavoriteCount(item)
{
	const key = getItemViewKey(item);
	const mappedCount = Number(favoriteCountMap[getViewCountKey(key)]);
	if (Number.isFinite(mappedCount)) return mappedCount;
	return getDetailCountValue(item, ["favoriteCount", "favorite_count", "wishCount", "wish_count"]);
}

function getDetailInquiryCount(item)
{
	const key = getItemViewKey(item);
	const mappedCount = Number(inquiryCountMap[getViewCountKey(key)]);
	if (Number.isFinite(mappedCount)) return mappedCount;
	return getDetailCountValue(item, ["inquiryCount", "inquiry_count", "contactCount", "contact_count"]);
}

function getDetailSummaryMetaText(item)
{
	const dateText = formatDetailSummaryDate(item?.dateLabel || item?.date || item?.updated_at || item?.created_at);
	const inquiryCount = getDetailInquiryCount(item);
	const favoriteCount = getDetailFavoriteCount(item);
	const viewCount = getDetailViewCount(item);
	return `등록일 ${dateText} · 문의 ${inquiryCount} · 관심 ${favoriteCount} · 조회 ${viewCount}`;
}

function renderDetailSummaryMeta(item)
{
	const detailSummaryAddress = document.getElementById("detailSummaryAddress");
	if (!detailSummaryAddress) return;
	detailSummaryAddress.textContent = getDetailSummaryMetaText(item);
}

function updateViewCountElements(viewKey, count)
{
	const key = getViewCountKey(viewKey);
	if (!key) return;
	document.querySelectorAll(`.card-date[data-view-key="${key}"]`).forEach(el => {
		el.textContent = `조회 ${Number.isFinite(Number(count)) ? Number(count) : 0}`;
	});
	if (currentDetailItem && getItemViewKey(currentDetailItem) === key) {
		renderDetailSummaryMeta(currentDetailItem);
	}
}

function shouldUseListViewCounts()
{
	return !viewCountRpcDisabled && !!(state && state.isListOpen && !document.body.classList.contains("sidebar-list-collapsed"));
}

function isMissingRpcError(error)
{
	const message = String(error && (error.message || error.details || "") || "");
	return error && (error.code === "PGRST202" || message.includes("Could not find the function"));
}

function disableViewCountRpc(error)
{
	if (!isMissingRpcError(error)) return false;
	viewCountRpcDisabled = true;
	return true;
}

async function fetchViewCounts(items)
{
	if (!shouldUseListViewCounts()) return {};
	const ids = [...new Set((items || []).map(item => getItemViewKey(item)).filter(Boolean))];
	if (!ids.length) return {};
	try {
		await loadSupabaseScript();
		const client = getMapListingsSupabaseClient();
		if (!client || typeof client.rpc !== "function") return {};
		const { data, error } = await client.rpc("get_property_view_counts", {
			p_listing_ids: ids
		});
		if (error) throw error;
		return data && typeof data === "object" && !Array.isArray(data) ? data : {};
	} catch (err) {
		if (disableViewCountRpc(err)) return {};
		console.warn("조회수 불러오기 실패:", err);
		return {};
	}
}

async function refreshCardViewCounts(items)
{
	if (!shouldUseListViewCounts()) return;
	const renderSeq = ++state.viewRenderSeq;
	const fetched = await fetchViewCounts(items);
	if (renderSeq !== state.viewRenderSeq) return;
	viewMap = { ...viewMap, ...fetched };
	Object.entries(fetched).forEach(([viewKey, count]) => {
		updateViewCountElements(viewKey, count);
	});
}

async function incrementViewCount(viewKey)
{
	if (viewCountRpcDisabled) return null;
	const key = getViewCountKey(viewKey);
	if (!key) return null;
	const now = Date.now();
	const lastIncrementedAt = Number(recentViewIncrementMap.get(key) || 0);
	if (now - lastIncrementedAt < VIEW_INCREMENT_DEDUPE_MS) {
		const cachedCount = Number(viewMap[key]);
		return Number.isFinite(cachedCount) ? cachedCount : null;
	}
	recentViewIncrementMap.set(key, now);
	try {
		await loadSupabaseScript();
		const client = getMapListingsSupabaseClient();
		if (!client || typeof client.rpc !== "function") return null;
		const { data, error } = await client.rpc("increment_property_view", {
			p_listing_id: key
		});
		if (error) throw error;
		const nextCount = Number(data);
		if (!Number.isFinite(nextCount)) return null;
		viewMap[key] = nextCount;
		updateViewCountElements(key, nextCount);
		return nextCount;
	} catch (err) {
		recentViewIncrementMap.delete(key);
		if (disableViewCountRpc(err)) return null;
		console.warn("조회수 증가 실패:", err);
		return null;
	}
}

function isMissingColumnError(error, columnName)
{
	const message = String(error && (error.message || error.details || "") || "");
	return message.includes(columnName) || message.includes(`'${columnName}'`) || message.includes(`"${columnName}"`);
}

async function refreshDetailEngagementCounts(item)
{
	const key = getItemViewKey(item);
	if (!key) return;
	const hasCachedCounts = [viewMap[key], favoriteCountMap[key], inquiryCountMap[key]]
		.some(value => Number.isFinite(Number(value)));
	const fetchedAt = Number(detailEngagementFetchedAtMap.get(key) || 0);
	if (hasCachedCounts && Date.now() - fetchedAt < DETAIL_ENGAGEMENT_CACHE_MS) {
		if (currentDetailItem && getItemViewKey(currentDetailItem) === key) renderDetailSummaryMeta(currentDetailItem);
		return;
	}
	const seq = ++detailEngagementCountSeq;
	try {
		await loadSupabaseScript();
		const client = getMapListingsSupabaseClient();
		if (!client) return;

		if (!engagementCountRpcDisabled && typeof client.rpc === "function") {
			try {
				const { data, error } = await client.rpc("get_property_engagement_counts", {
					p_listing_ids: [key]
				});
				if (error) throw error;
				const row = Array.isArray(data) ? data.find(item => getViewCountKey(item && item.listing_id) === key) : null;
				if (row) {
					const views = Number(row.views);
					const favorites = Number(row.favorites);
					const inquiries = Number(row.inquiries);
					if (Number.isFinite(views)) viewMap[key] = views;
					if (Number.isFinite(favorites)) favoriteCountMap[key] = favorites;
					if (Number.isFinite(inquiries)) inquiryCountMap[key] = inquiries;
					detailEngagementFetchedAtMap.set(key, Date.now());
					if (seq === detailEngagementCountSeq && currentDetailItem && getItemViewKey(currentDetailItem) === key) {
						renderDetailSummaryMeta(currentDetailItem);
					}
					return;
				}
			} catch (engagementError) {
				if (disableViewCountRpc(engagementError) || isMissingRpcError(engagementError)) {
					engagementCountRpcDisabled = true;
				} else {
					console.warn("상세 서버 집계 불러오기 실패:", engagementError);
				}
			}
		}

		if (!viewCountRpcDisabled && typeof client.rpc === "function") {
			try {
				const { data, error } = await client.rpc("get_property_view_counts", {
					p_listing_ids: [key]
				});
				if (error) throw error;
				const count = Number(data && data[key]);
				if (Number.isFinite(count)) viewMap[key] = count;
			} catch (viewError) {
				if (!disableViewCountRpc(viewError)) console.warn("상세 조회수 불러오기 실패:", viewError);
			}
		}

		if (DETAIL_INQUIRY_COUNT_ENABLED) {
			try {
				const { data, error } = await client
					.from("support_inquiries")
					.select("listing_id")
					.eq("listing_id", key);
				if (error) throw error;
				inquiryCountMap[key] = Array.isArray(data) ? data.length : 0;
			} catch (inquiryError) {
				if (isMissingColumnError(inquiryError, "listing_id")) {
					inquiryCountMap[key] = 0;
				} else {
					console.warn("상세 문의수 불러오기 실패:", inquiryError);
				}
			}
		}

		if (seq === detailEngagementCountSeq && currentDetailItem && getItemViewKey(currentDetailItem) === key) {
			detailEngagementFetchedAtMap.set(key, Date.now());
			renderDetailSummaryMeta(currentDetailItem);
		}
	} catch (err) {
		console.warn("상세 집계 불러오기 실패:", err);
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
	leftListSourceIds: [],
	leftListSourceKey: "",
	leftListItems: [],
	leftListSeq: 0,
	leftListVisibleCount: LEFT_LIST_PAGE_SIZE,
	leftListTotalCount: 0,
	leftListRenderedCount: 0,
	leftListLoading: false,
	recommendItem: null,
	recommendAgent: null,
	lastRecommendPoolKey: "",
	isRecommendCardDismissed: false,
	isRecommendAgentDismissed: false,
	isListOpen: false
};

let recommendIds = [];
let recommendAgents = [];

const REMOTE_BASE = "https://jeju-map.vercel.app/";

function toRemotePath(path)
{
	if (!path || typeof path !== "string") return path || "";
	if (/^https?:\/\//i.test(path)) return path;
	return new URL(path.replace(/^\.\//, ""), REMOTE_BASE).toString();
}

let roadview = null;
let roadviewClient = null;
let roadviewOverlay = null;
let roadviewFullscreenBtn = null;
let selectedDeal = new Set();
let selectedType = new Set();
let selectedDealMethod = "all";
let selectedPriceRange = "all";
let selectedPetOnly = false;
let selectedParkingOnly = false;
let selectedCityGasOnly = false;
let selectedDuplexOnly = false;
let selectedVerandaOnly = false;
let selectedElevatorOnly = false;
let selectedFullOptionOnly = false;
let selectedImmediateMoveInOnly = false;
let selectedOceanViewOnly = false;
let currentDetailItem = null;
let agentCache = {};
let agentPromiseCache = {};
const infoCache = {};
const imageCache = {};
let currentHeroImages = [];
let currentHeroIndex = 0;
let detailSimilarRenderSeq = 0;
let detailAreaMode = "total";
let globalAreaUnit = "m2";
let currentMapTypeMode = "roadmap";
const DEFAULT_MAP_CENTER = { lat: 33.483115, lng: 126.478993, level: 5 };
const GEOLOCATION_MAP_LEVEL = 4;
let preventMapViewportChange = false;
let isClusterClicking = false;
let allowDetailOpenFromListClick = false;
let addressSearchMarker = null;
let addressSearchStatusTimer = null;
let subAddressSearchIsComposing = false;
let pendingSubAddressSearchAfterComposition = false;
let subAddressSearchRafId = null;

const sidebar = document.getElementById("sidebar");
const propertyList = document.getElementById("propertyList");
const sidebarListPanel = document.querySelector(".sidebar-list-panel");
const mapPanelToggle = document.getElementById("mapPanelToggle");
const keywordInput = document.getElementById("keyword");
const subAddressSearchForm = document.getElementById("subAddressSearchForm");
const subAddressSearchInput = document.getElementById("subAddressSearchInput");
const subAddressSearchStatus = document.getElementById("subAddressSearchStatus");
const mapResultCount = document.getElementById("mapResultCount");
const mapEmptyState = document.getElementById("mapEmptyState");
const mapTypeRoadBtn = document.getElementById("mapTypeRoadBtn");
const mapTypeSatelliteBtn = document.getElementById("mapTypeSatelliteBtn");
const mapTypeCadastralBtn = document.getElementById("mapTypeCadastralBtn");
const areaUnitPyBtn = document.getElementById("areaUnitPyBtn");
const areaUnitM2Btn = document.getElementById("areaUnitM2Btn");
const mapAgentCard = document.getElementById("mapAgentCard");
const mapAgentCloseBtn = document.getElementById("mapAgentCloseBtn");
const mapAgentHideTodayCheck = document.getElementById("mapAgentHideTodayCheck");
const mapAgentPhoto = document.getElementById("mapAgentPhoto");
const mapAgentName = document.getElementById("mapAgentName");
const mapAgentNameRole = document.getElementById("mapAgentNameRole");
const mapAgentOffice = document.getElementById("mapAgentOffice");
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
	const saved = Number(localStorage.getItem(key) || 0);
	return Number.isFinite(saved) && saved > Date.now();
}

state.isRecommendAgentDismissed = isHideUntilActive(RECOMMEND_AGENT_HIDE_KEY);
state.isRecommendCardDismissed = isHideUntilActive(RECOMMEND_ITEM_HIDE_KEY);

if (mapAgentHideTodayCheck) mapAgentHideTodayCheck.checked = state.isRecommendAgentDismissed;
if (mapRecommendHideTodayCheck) mapRecommendHideTodayCheck.checked = state.isRecommendCardDismissed;
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
const priceFilterDropdown = document.getElementById("priceFilterDropdown");
const priceFilterTrigger = document.getElementById("priceFilterTrigger");
const priceFilterMenu = document.getElementById("priceFilterMenu");
const priceFilterLabel = document.getElementById("priceFilterLabel");
const priceFilterOptions = document.getElementById("priceFilterOptions");
const priceFilterMessage = document.getElementById("priceFilterMessage");
const approvalYearInputs = document.querySelectorAll('input[name="approvalYear"]');
const approvalYearFilterDropdown = document.getElementById("approvalYearFilterDropdown");
const approvalYearFilterTrigger = document.getElementById("approvalYearFilterTrigger");
const approvalYearFilterMenu = document.getElementById("approvalYearFilterMenu");
const approvalYearFilterLabel = document.getElementById("approvalYearFilterLabel");
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

const detailCloseBtn = document.getElementById("detailCloseBtn");
const detailHero = document.getElementById("detailHero");
const detailHeroSlides = document.getElementById("detailHeroSlides");
const detailHeroPrevBtn = document.getElementById("detailHeroPrevBtn");
const detailHeroNextBtn = document.getElementById("detailHeroNextBtn");
const detailHeroDots = document.getElementById("detailHeroDots");
const detailHeroBadge = document.getElementById("detailHeroBadge");
const detailHeroDeal = document.getElementById("detailHeroDeal");
const detailHeroPrice = document.getElementById("detailHeroPrice");
const detailHeroAddress = document.getElementById("detailHeroAddress");
const detailHeroFeatures = document.getElementById("detailHeroFeatures");
const detailTitle = document.getElementById("detailTitle");
const detailListingNo = document.getElementById("detailListingNo");
const detailTopbarId = document.getElementById("detailTopbarId");
const detailTypeBadge = document.getElementById("detailTypeBadge");
const detailPrice = document.getElementById("detailPrice");
const detailAddress = document.getElementById("detailAddress");
const detailDesc = document.getElementById("detailDesc");
const detailDescTitle = document.getElementById("detailDescTitle");
const detailDescCard = document.getElementById("detailDescCard");
const detailInfoListTop = document.getElementById("detailInfoListTop");
const detailInfoList = document.getElementById("detailInfoList");
const detailLocationCard = document.getElementById("detailLocationCard");
const detailLocationMapEl = document.getElementById("detailLocationMap");
const detailFeatures = document.getElementById("detailFeatures");
const detailPhone = document.getElementById("detailPhone");
const detailMapBtn = document.getElementById("detailMapBtn");
const detailRoadviewBtn = document.getElementById("detailRoadviewBtn");
const detailCallBtn = document.getElementById("detailCallBtn");
const detailShareBtn = document.getElementById("detailShareBtn");
const DETAIL_SHARE_ICON_HTML = '<i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i>';
const REALJEJU_KAKAO_JS_KEY = "b7db2d3c35122f3ec33c88ea6d3195fb";
const detailShareMenu = document.getElementById("detailShareMenu");
const detailShareFeedback = document.getElementById("detailShareFeedback");
const detailAuthTrigger = document.getElementById("detailAuthTrigger");
const authModal = document.getElementById("authModal");
const authModalClose = document.getElementById("authModalClose");
const authModalForm = document.getElementById("authModalForm");
const detailShareKakaoBtn = document.getElementById("detailShareKakaoBtn");
const detailCopyLinkBtn = document.getElementById("detailCopyLinkBtn");
const detailAreaValue = document.getElementById("detailAreaValue");
const detailAreaToggleBtn = document.getElementById("detailAreaToggleBtn");
const detailAreaLabel = document.getElementById("detailAreaLabel");
const detailAreaTypeToggleBtn = document.getElementById("detailAreaTypeToggleBtn");
const detailAreaWrap = document.querySelector(".detail-area-wrap");
const detailTypeValue = document.getElementById("detailTypeValue");
const detailRegionValue = document.getElementById("detailRegionValue");

const detailAgentAvatar = document.getElementById("detailAgentAvatar");
const detailAgentName = document.getElementById("detailAgentName");
const detailAgentTitle = document.getElementById("detailAgentTitle");
const detailAgentOffice = document.getElementById("detailAgentOffice");
const detailAgentAddress = document.getElementById("detailAgentAddress");
const detailAgentRegNo = document.getElementById("detailAgentRegNo");
const detailAgentPhoneInline = document.getElementById("detailAgentPhoneInline");
const detailSimilarCard = document.getElementById("detailSimilarCard");
const detailSimilarGrid = document.getElementById("detailSimilarGrid");

const detailImageLightbox = document.getElementById("detailImageLightbox");
const detailImageLightboxImg = document.getElementById("detailImageLightboxImg");
const detailImageLightboxClose = document.getElementById("detailImageLightboxClose");
const detailImageLightboxPrev = document.getElementById("detailImageLightboxPrev");
const detailImageLightboxNext = document.getElementById("detailImageLightboxNext");
const detailImageLightboxCount = document.getElementById("detailImageLightboxCount");
const detailSummaryTop = document.querySelector(".detail-summary-top");

function syncProfilePageBodyState()
{
	const isProfilePageOpen = !!(authModal && authModal.classList.contains("open") && authModal.classList.contains("profile-page-mode"));
	document.body.classList.toggle("profile-page-open", isProfilePageOpen);
	if (isProfilePageOpen && authModal) {
		const topbar = document.querySelector(".global-topbar");
		if (topbar && topbar.nextSibling !== authModal) {
			topbar.parentNode.insertBefore(authModal, topbar.nextSibling);
		}
	}
	document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
		if (isProfilePageOpen) btn.classList.remove("active");
	});
	const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
	if (topbarAccountTrigger) {
		topbarAccountTrigger.classList.toggle("profile-page-active", isProfilePageOpen);
	}
	if (isProfilePageOpen) document.body.style.overflow = "";
	if (isProfilePageOpen && authModal && !authModal.dataset.profileScrollInitialized) {
		authModal.dataset.profileScrollInitialized = "1";
		authModal.scrollTop = 0;
	} else if (!isProfilePageOpen && authModal) {
		delete authModal.dataset.profileScrollInitialized;
	}
}

if (authModal && typeof MutationObserver !== "undefined") {
	new MutationObserver(syncProfilePageBodyState).observe(authModal, {
		attributes: true,
		attributeFilter: ["class", "aria-hidden"]
	});
	syncProfilePageBodyState();
}

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
	document.body.classList.add("auth-page-open", "sidebar-list-collapsed");
	authModal.classList.add("open");
	authModal.setAttribute("aria-hidden", "false");
	syncProfilePageBodyState();
	document.body.style.overflow = "";
}

function releaseFocusBeforeAriaHidden(container)
{
	const active = document.activeElement;
	if (!container || !active || !container.contains(active)) return;
	const fallback = document.getElementById("detailAuthTrigger") || document.querySelector(".global-auth-trigger") || document.body;
	if (fallback && typeof fallback.focus === "function") {
		fallback.focus({ preventScroll: true });
		return;
	}
	if (typeof active.blur === "function") active.blur();
}

if (typeof window !== "undefined") window.realjejuReleaseFocusBeforeAriaHidden = releaseFocusBeforeAriaHidden;

function closeAuthModal()
{
	if (!authModal) return;
	releaseFocusBeforeAriaHidden(authModal);
	authModal.classList.remove("open");
	authModal.setAttribute("aria-hidden", "true");
	document.body.classList.remove("auth-page-open");
	syncProfilePageBodyState();
	document.body.style.overflow = "";
}

function syncSummaryBadgeRow()
{
	if (!detailSummaryTop || !detailSummaryDealBadge || !detailSummaryTypeBadge) return;
	if (detailSummaryDealBadge.parentElement !== detailSummaryTop) {
		detailSummaryTop.appendChild(detailSummaryDealBadge);
	}
}

const detailScroll = document.querySelector(".detail-scroll");

function updateGlobalAreaUnitButtons()
{
	if (areaUnitPyBtn) areaUnitPyBtn.classList.toggle("active", globalAreaUnit === "py");
	if (areaUnitM2Btn) areaUnitM2Btn.classList.toggle("active", globalAreaUnit === "m2");
}

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

function setGlobalAreaUnit(unit)
{
	globalAreaUnit = unit;
	applyGlobalAreaUnit();
}

window.setGlobalAreaUnit = setGlobalAreaUnit;

function lockListToItems(items)
{
	const ids = (items || [])
	.map(item => normalizeItemId(item?.id))
	.filter(Boolean);
	state.lockedListIds = ids.length ? ids : null;
}

function clearListLock()
{
	state.lockedListIds = null;
}

function getLockedListItems()
{
	if (!Array.isArray(state.lockedListIds) || !state.lockedListIds.length) return null;
	const idSet = new Set(state.lockedListIds.map(normalizeItemId));
	const lockedItems = (state.filtered || []).filter(item => idSet.has(normalizeItemId(item.id)));
	return lockedItems.length ? lockedItems : null;
}

function isLockedSelectionStillVisible()
{
	if (!Array.isArray(state.lockedListIds) || !state.lockedListIds.length) return false;

	const lockedIdSet = new Set(state.lockedListIds.map(normalizeItemId).filter(Boolean));
	const clusters = state.clusterer && state.clusterer.getClusters
	? state.clusterer.getClusters()
	: (state.clusterer && state.clusterer._clusters) || [];

	if (state.selectionMode === "cluster") {
		const selectedClusterStillVisible = (clusters || []).some(cluster => {
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
		let matchedClusterKey = null;

		const targetInsideCluster = (clusters || []).some(cluster => {
			const clusterItems = (cluster.getMarkers ? cluster.getMarkers() : [])
			.map(marker => marker.__property)
			.filter(Boolean);

			if (!clusterItems.length) return false;

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

function applyGlobalAreaUnit()
{
	updateGlobalAreaUnitButtons();
	refreshViewportList();

	if (state.selectedMarkerId != null) {
		highlightCard(state.selectedMarkerId);
	}

	if (currentDetailItem && detailAreaValue) {
		detailAreaValue.dataset.areaUnit = globalAreaUnit;
		syncDetailAreaDisplay(currentDetailItem);
		refreshCurrentDetailInfoRowsForAreaUnit();

		const detailSummaryUnitPriceEl = document.getElementById("detailSummaryUnitPrice");
		if (detailSummaryUnitPriceEl) {
			const unitPriceText = formatUnitPriceLine(currentDetailItem);
			detailSummaryUnitPriceEl.textContent = unitPriceText;
			detailSummaryUnitPriceEl.style.display = unitPriceText ? "block" : "none";
		}
	}
}

function getViewportFilteredItems(items)
{
	if (!state.map || !window.kakao || !kakao.maps) return items || [];
	const bounds = state.map.getBounds();
	if (!bounds) return items || [];

	return (items || []).filter(item => {
		const lat = Number(item.lat);
		const lng = Number(item.lng);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
		const pos = new kakao.maps.LatLng(lat, lng);
		return bounds.contain(pos);
	});
}

function updateMapEmptyState(items)
{
	if (!mapEmptyState) return;
	mapEmptyState.classList.remove("open");
}

function getRecommendationPool(items)
{
	const list = Array.isArray(items) ? items : [];
	if (!recommendIds.length) return [];

	const idSet = new Set(recommendIds.map(normalizeItemId));
	return list.filter(item => item && idSet.has(normalizeItemId(item.id)));
}

function getRecommendationCandidate(items)
{
	const pool = getRecommendationPool(items);
	if (!pool.length) return null;

	if (state.selectedMarkerId != null) {
		const selected = pool.find(item => normalizeItemId(item.id) === normalizeItemId(state.selectedMarkerId));
		if (selected) return selected;
	}

	if (pool.length === 1) return pool[0];

	const previousId = state.recommendItem ? normalizeItemId(state.recommendItem.id) : null;
	const candidates = pool.filter(item => normalizeItemId(item.id) !== previousId);
	const source = candidates.length ? candidates : pool;
	const randomIndex = Math.floor(Math.random() * source.length);
	return source[randomIndex];
}

function normalizeRecommendAgent(agent)
{
	if (!agent || typeof agent !== "object") return null;
	const normalizedPhone = String(agent.phone || "").trim();
	return {
		...agent,
		id: normalizeItemId(agent.id),
		image: toRemotePath(agent.image || ""),
		phone: normalizedPhone,
		office: agent.office || "",
		name: agent.name || "",
		desc: agent.desc || "",
		address: agent.address || "",
		regNo: agent.regNo || "",
		link: agent.link || ""
	};
}

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

	const hasCurrent = state.recommendAgent
	&& recommendAgents.some(agent => normalizeItemId(agent.id) === normalizeItemId(state.recommendAgent.id));

	if (!hasCurrent) {
		state.recommendAgent = getRecommendationAgentCandidate();
	}

	renderRecommendAgentCard(state.recommendAgent);
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
		mapRecommendAddress.textContent = formatDisplayPropertyAddress(item.address) || "-";
	}

	mapRecommendCard.onclick = async (e) => {
		if (e.target.closest(".map-recommend-close")) return;
		if (e.target.closest(".map-recommend-footer")) return;
		if (e.target.closest("label, input")) return;
		if (e.target.closest("a, button")) return;

		const normalizedId = normalizeItemId(item.id);

		await hideRoadview();
		state.selectionMode = "single";
		state.selectedClusterKey = null;
		state.selectedMarkerId = normalizedId;
		clearListLock();
		highlightCard(normalizedId);
		updateMarkerSelection(normalizedId, [normalizedId]);

		if (detailScroll) detailScroll.scrollTop = 0;
		allowDetailOpenFromListClick = true;
		try {
			await openDetailPanel(item, { syncUrl: false });
		} finally {
			allowDetailOpenFromListClick = false;
		}

		syncDetailUrl(item.id);

		if (detailScroll) detailScroll.scrollTop = 0;
		await focusProperty(item.id);

		setTimeout(() => {
			highlightCard(normalizedId);
			refreshClusterBadges();
		}, 0);
	};
}

function refreshRecommendationCard(items)
{
	if (!mapRecommendCard) return;
	if (state.isRecommendCardDismissed) {
		renderRecommendationCard(null);
		return;
	}

	const pool = getRecommendationPool(items);
	const poolKey = pool.map(item => normalizeItemId(item.id)).sort((a, b) => a.localeCompare(b)).join(",");

	if (!pool.length) {
		state.recommendItem = null;
		state.lastRecommendPoolKey = "";
		renderRecommendationCard(null);
		return;
	}

	const keepCurrent = state.lastRecommendPoolKey === poolKey
	&& state.recommendItem
	&& pool.some(item => normalizeItemId(item.id) === normalizeItemId(state.recommendItem.id));

	if (!keepCurrent) {
		state.recommendItem = getRecommendationCandidate(pool);
		state.lastRecommendPoolKey = poolKey;
	}

	renderRecommendationCard(state.recommendItem);
}

function refreshViewportList(options = {})
{
	const lockedItems = getLockedListItems();
	if (lockedItems) {
		const shouldKeepLockedItems = sidebar.classList.contains("expanded") || isLockedSelectionStillVisible();
		if (shouldKeepLockedItems) {
			const sortedLockedItems = sortItems(lockedItems);
			if (getLeftListSourceKey(sortedLockedItems) !== state.leftListSourceKey) {
				resetLeftListPagination(sortedLockedItems);
			}
			if (!state.leftListItems.length && sortedLockedItems.length) {
				renderLeftListInitialLoading();
				loadMoreLeftListItems({ sourceItems: sortedLockedItems });
			} else {
				renderList(state.leftListItems);
			}
			setResultInfo(`선택 매물 ${sortedLockedItems.length}건`);
			setListInfo(state.leftListItems.length < sortedLockedItems.length ? `${sortedLockedItems.length}개 중 ${state.leftListItems.length}개` : `총 ${sortedLockedItems.length}개 매물`);
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

	const viewportItems = sortItems(getViewportFilteredItems(state.filtered));
	if (getLeftListSourceKey(viewportItems) !== state.leftListSourceKey) {
		resetLeftListPagination(viewportItems);
	}

	if (state.initialRandomListActive !== false && isInitialAllListMode() && !sidebar.classList.contains("expanded") && !state.selectionMode) {
		propertyList.innerHTML = "";
		setResultInfo(`총 ${state.filtered.length}건`);
		setListInfo(`총 ${state.filtered.length}개 매물`);
		refreshRecommendAgentCard();
		refreshRecommendationCard(state.filtered);
		return [];
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

	if (!state.leftListItems.length && viewportItems.length) {
		renderLeftListInitialLoading();
		loadMoreLeftListItems({ sourceItems: viewportItems });
	} else {
		renderList(state.leftListItems);
		setPagedListInfo(viewportItems.length, state.leftListItems.length);
		if (state.leftListItems.length) {
			state.lastViewportListIds = state.leftListItems.map(item => normalizeItemId(item.id));
		}
	}
	refreshRecommendAgentCard();
	refreshRecommendationCard(state.filtered);
	return viewportItems;
}

function updateSidebarWidth()
{
	const rootStyle = document.documentElement.style;
	const listWidth = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-list-width").trim() || "360px";
	const nextWidth = state.isListOpen ? listWidth : "0px";
	rootStyle.setProperty("--sidebar-current-width", nextWidth);
	document.body.classList.toggle("sidebar-list-collapsed", !state.isListOpen);
	updateMapPanelToggleState();
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
	if (!state || !state.map) return;
	const run = () => {
		try {
			const lockedCenter = typeof state.map.getCenter === "function" ? state.map.getCenter() : null;
			if (state.map && typeof state.map.relayout === "function") {
				state.map.relayout();
			}
			if (lockedCenter && typeof state.map.setCenter === "function") {
				state.map.setCenter(lockedCenter, { __allowClusterRestore: true });
			}
		} catch (error) {
			console.warn("지도 레이아웃 갱신 실패:", error);
		}
	};

	run();
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(run);
		requestAnimationFrame(() => requestAnimationFrame(run));
	}
	setTimeout(run, 80);
	setTimeout(run, 240);
}

function updateMapPanelToggleState()
{
	if (!mapPanelToggle || !sidebar) return;
	const collapsed = document.body.classList.contains("map-panels-collapsed");
	const detailActive = sidebar.classList.contains("expanded") && !document.body.classList.contains("detail-page-panel-open");
	document.body.classList.toggle("map-detail-panel-active", detailActive);

	mapPanelToggle.hidden = !(detailActive || collapsed);
	mapPanelToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
	mapPanelToggle.setAttribute("aria-label", collapsed ? "패널 펼치기" : "패널 접기");
	mapPanelToggle.title = collapsed ? "패널 펼치기" : "패널 접기";
}

function setMapPanelsCollapsed(collapsed)
{
	document.body.classList.toggle("map-panels-collapsed", !!collapsed);
	updateMapPanelToggleState();
	refreshMapLayout();
	setTimeout(refreshMapLayout, 260);
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

function formatDetailDescriptionHtml(text)
{
	return String(text || "")
	.replace(/^(?:[ \t]*\r?\n)+/, "")
	.replace(/(?:\r?\n[ \t]*)+$/, "")
	.split(/\r?\n/)
	.map((line) => {
		const safeLine = escapeHtml(line);
		return /^\s*✅/.test(line) ? `<span class="detail-desc-check-heading">${safeLine}</span>` : safeLine;
	})
	.join("<br>");
}

let daumPostcodeLoadPromise = null;
let supabaseScriptLoadPromise = null;

function loadDaumPostcodeScript()
{
	if (window.daum && window.daum.Postcode) {
		return Promise.resolve(window.daum.Postcode);
	}

	if (daumPostcodeLoadPromise) {
		return daumPostcodeLoadPromise;
	}

	daumPostcodeLoadPromise = new Promise((resolve, reject) => {
		const existingScript = document.querySelector('script[data-realjeju-postcode="true"]');
		if (existingScript) {
			existingScript.addEventListener("load", () => {
				if (window.daum && window.daum.Postcode) {
					resolve(window.daum.Postcode);
					return;
				}
				reject(new Error("주소 검색 스크립트가 준비되지 않았습니다."));
			}, { once: true });
			existingScript.addEventListener("error", () => {
				reject(new Error("주소 검색 스크립트를 불러오지 못했습니다."));
			}, { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
		script.async = true;
		script.dataset.realjejuPostcode = "true";
		script.addEventListener("load", () => {
			if (window.daum && window.daum.Postcode) {
				resolve(window.daum.Postcode);
				return;
			}
			reject(new Error("주소 검색 스크립트가 준비되지 않았습니다."));
		}, { once: true });
		script.addEventListener("error", () => {
			reject(new Error("주소 검색 스크립트를 불러오지 못했습니다."));
		}, { once: true });
		document.head.appendChild(script);
	});

	return daumPostcodeLoadPromise;
}

function loadExternalStylesheet(href, key)
{
	if (!href || document.querySelector(`link[data-realjeju-style="${key}"]`)) return;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	link.dataset.realjejuStyle = key;
	document.head.appendChild(link);
}

function loadNonBlockingExternalAssets()
{
	loadExternalStylesheet("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css", "pretendard");
	loadExternalStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css", "fontawesome");
}

function scheduleNonBlockingExternalAssets()
{
	if (document.readyState === "complete") {
		loadNonBlockingExternalAssets();
		return;
	}
	window.addEventListener("load", loadNonBlockingExternalAssets, { once: true });
}

function loadSupabaseScript()
{
	if (window.supabase && typeof window.supabase.createClient === "function") {
		return Promise.resolve(window.supabase);
	}

	if (supabaseScriptLoadPromise) {
		return supabaseScriptLoadPromise;
	}

	supabaseScriptLoadPromise = new Promise((resolve, reject) => {
		const existingScript = document.querySelector('script[data-realjeju-supabase="true"]');
		if (existingScript) {
			existingScript.addEventListener("load", () => {
				if (window.supabase && typeof window.supabase.createClient === "function") {
					resolve(window.supabase);
					return;
				}
				reject(new Error("Supabase 스크립트가 준비되지 않았습니다."));
			}, { once: true });
			existingScript.addEventListener("error", () => {
				reject(new Error("Supabase 스크립트를 불러오지 못했습니다."));
			}, { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
		script.async = true;
		script.dataset.realjejuSupabase = "true";
		script.addEventListener("load", () => {
			if (window.supabase && typeof window.supabase.createClient === "function") {
				resolve(window.supabase);
				return;
			}
			reject(new Error("Supabase 스크립트가 준비되지 않았습니다."));
		}, { once: true });
		script.addEventListener("error", () => {
			reject(new Error("Supabase 스크립트를 불러오지 못했습니다."));
		}, { once: true });
		document.head.appendChild(script);
	});

	return supabaseScriptLoadPromise;
}

function scheduleSupabaseScriptLoad()
{
	const run = () => {
		loadSupabaseScript()
		.then(() => {
			if (typeof window.realjejuInitAccountUI === "function") {
				window.realjejuInitAccountUI();
			}
		})
		.catch(err => {
			console.warn("Supabase 스크립트 로드 실패:", err);
		});
	};

	if (document.readyState === "complete") {
		run();
		return;
	}
	window.addEventListener("load", run, { once: true });
}


function normalizeImageArray(item)
{
	if (Array.isArray(item.images) && item.images.length) {
		return item.images.filter(Boolean);
	}
	if (item.image) return [item.image];
	return [];
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

function hasFeatureLabel(item, label)
{
	const aliasTokens = [label, ...((FEATURE_ALIAS_MAP[label] || []))]
	.map(normalizeFeatureToken)
	.filter(Boolean);
	const featureTokens = Array.isArray(item?.featuresNormalized)
	? item.featuresNormalized
	: normalizeFeatureList(item?.features);
	const tokenSet = new Set(featureTokens);

	return aliasTokens.some(token => tokenSet.has(token));
}

function normalizeProperty(item, index)
{
	const normalizedFeatures = normalizeFeatureList(item.features);
	return {
		id: item.id ?? index + 1,
		title: item.title ?? "제목 없음",
		listingNo: item.listingNo ?? "",
		dealType: item.dealFilter ?? item.dealType ?? "매매",
		type: item.typeFilter ?? item.type ?? "",
		features: Array.isArray(item.features) ? item.features : [],
		featuresNormalized: normalizedFeatures,
		price: item.price ?? "-",
		markerPrice: item.markerPrice ?? "",
		filterPriceManwon: item.filterPriceManwon ?? null,
		area: item.area ?? "-",
		address: item.address ?? "-",
		region: item.region ?? "",
		desc: item.desc ?? "",
		lat: Number(item.lat),
		lng: Number(item.lng),
		image: item.image ?? "",
		images: normalizeImageArray(item),
		link: item.link ?? "#",
		agent_folder: item.agent_folder ?? "",
		agentName: item.agentName ?? "",
		agentTitle: item.agentTitle ?? "",
		agentOffice: item.agentOffice ?? "",
		agentAddress: item.agentAddress ?? "",
		agentRegNo: item.agentRegNo ?? "",
		agentImage: item.agentImage ?? "",
		buildingName: item.buildingName ?? item.complexName ?? "",
		phone1: item.phone1 ?? "",
		phone2: item.phone2 ?? "",
		linkKakaotalk: item.linkKakaotalk ?? item.kakao_url ?? item.kakaoUrl ?? item.kakao ?? item.kakao_open_chat ?? item.kakao_open_chat_url ?? item.open_chat_url ?? "",
		linkCrossroad: item.linkCrossroad ?? "",
		date: item.date ?? "",
		dateLabel: item.dateLabel ?? "",
		desc_folder: item.desc_folder ?? "",
		image_folder: item.image_folder ?? "",
		infoRows: Array.isArray(item.infoRows) ? item.infoRows : [],
		sections: Array.isArray(item.sections) ? item.sections : [],
		payload: item.payload && typeof item.payload === "object" ? item.payload : null,
		locationDisplayType: item.locationDisplayType ?? item.location_display_type ?? "marker",
		locationBounds: item.locationBounds ?? item.location_bounds ?? null,
		dealMethod: item.dealMethod ?? item.listingMethod ?? "",
		brokerStatus: item.brokerStatus ?? "",
		floors: item.floors && typeof item.floors === "object" ? item.floors : {},
		maintenance: item.maintenance && typeof item.maintenance === "object" ? item.maintenance : {}
	};
}


function parseAreaNumbers(areaText)
{
	const text = String(areaText || "").trim();
	const matches = [...text.matchAll(/([\d,.]+)\s*(㎡|평)/g)].map(match => {
		const value = Number(String(match[1]).replace(/,/g, ""));
		if (!Number.isFinite(value)) return null;
		return match[2] === "평" ? value * 3.3058 : value;
	}).filter(v => v !== null);

	if (matches.length) return matches;

	return [...text.matchAll(/[\d,.]+/g)].map(match => {
		const value = Number(String(match[0]).replace(/,/g, ""));
		return Number.isFinite(value) ? value : null;
	}).filter(v => v !== null);
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
	const text = String(typeText || "").trim();
	if (["전", "대", "답", "과수원", "목장용지", "임야", "토지", "토지ㆍ임야"].includes(text)) return getLandTypeDetailLabel(text);
	if (["다가구", "다가구주택"].includes(text)) return "다가구주택";
	if (["단독", "단독주택"].includes(text)) return "단독주택";
	if (text === "연립") return "빌라";
	if (isHotelType(text)) return "호텔";
	if (isPensionType(text)) return "펜션";
	return text || "-";
}

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
	const landMatch = raw.match(/대지\s*(?:면적)?\s*([\d,.]+)\s*(?:㎡|평)?/);
	const totalMatch = raw.match(/연\s*(?:면적)?\s*([\d,.]+)\s*(?:㎡|평)?/);

	const land = landMatch ? Number(String(landMatch[1]).replace(/,/g, "")) : null;
	const total = totalMatch ? Number(String(totalMatch[1]).replace(/,/g, "")) : null;

	return { raw, land, total };
}

function parseApartmentAreas(areaText)
{
	const raw = String(areaText || "-").trim();
	const labelMatch = raw.match(/(공급|계약)(?:면적)?\s*[\d,.]+(?:\s*㎡)?/);
	const areaLabel = labelMatch && labelMatch[1] === "계약" ? "계약" : "공급";
	const supplyMatch = raw.match(/(?:공급|계약)(?:면적)?\s*([\d,.]+)\s*㎡?/);
	const privateMatch = raw.match(/전용(?:면적)?\s*([\d,.]+)\s*㎡?/);

	let supply = supplyMatch ? Number(String(supplyMatch[1]).replace(/,/g, "")) : null;
	let privateArea = privateMatch ? Number(String(privateMatch[1]).replace(/,/g, "")) : null;

	if (!Number.isFinite(supply) || !Number.isFinite(privateArea)) {
		const values = parseAreaNumbers(raw);
		if (!Number.isFinite(supply) && values.length >= 1) supply = values[0];
		if (!Number.isFinite(privateArea) && values.length >= 2) privateArea = values[1];
	}

	return { raw, supply, private: privateArea, areaLabel };
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
		return `${(value / 3.3058).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}평`;
	}
	return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}㎡`;
}

function formatCardAreaPair(label, firstText, privateText)
{
	const safeLabel = escapeHtml(label || "공급");
	const safeFirst = escapeHtml(firstText || "-");
	const safePrivate = escapeHtml(privateText || "-");
	return `<span class="area-label">${safeLabel}</span><span class="area-value">${safeFirst}</span><span class="area-separator">ㆍ</span><span class="area-label">전용</span><span class="area-value">${safePrivate}</span>`;
}

function findCardLabeledAreaValue(raw, patterns)
{
	for (const pattern of patterns) {
		const match = String(raw || "").match(pattern);
		if (!match) continue;
		const value = Number(String(match[1] || "").replace(/,/g, ""));
		if (Number.isFinite(value)) return value;
	}
	return null;
}

function formatRepresentativeCardAreaByUnit(areaText, unit)
{
	const raw = String(areaText || "-").trim();
	const exclusiveValue = findCardLabeledAreaValue(raw, [
		/전용\s*(?:면적)?\s*([\d,.]+)\s*(?:㎡|평)?/
	]);
	if (Number.isFinite(exclusiveValue)) return formatSingleAreaValue(exclusiveValue, unit);

	const values = parseAreaNumbers(raw);
	if (values.length === 1) return formatSingleAreaValue(values[0], unit);

	const totalValue = findCardLabeledAreaValue(raw, [
		/연\s*면적\s*([\d,.]+)\s*(?:㎡|평)?/,
		/연면적\s*([\d,.]+)\s*(?:㎡|평)?/,
		/\(연\)\s*([\d,.]+)\s*(?:㎡|평)?/,
		/연\s*([\d,.]+)\s*(?:㎡|평)?/
	]);
	if (Number.isFinite(totalValue)) return formatSingleAreaValue(totalValue, unit);

	return values.length ? formatSingleAreaValue(values[0], unit) : escapeHtml(raw);
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

function formatUnitPriceLine(detailItem)
{
	const totalWon = parsePriceTextToWon(detailItem?.price || "");
	const areaM2 = getPrimaryAreaForUnitPrice(detailItem?.area || "", detailItem?.type || "");

	if (!Number.isFinite(totalWon) || !Number.isFinite(areaM2) || areaM2 <= 0) return "";

	const manwonPerM2 = Math.round((totalWon / areaM2) / 10000);
	const manwonPerPyeong = Math.round(((totalWon / areaM2) * 3.3058) / 10000);

	if (globalAreaUnit === "py") {
		return `단위 가격 ${manwonPerPyeong.toLocaleString('ko-KR')}만원/평`;
	}

	return `단위 가격 ${manwonPerM2.toLocaleString('ko-KR')}만원/㎡`;
}

function formatCardAreaByUnit(areaText, unit, typeText = "")
{
	return formatRepresentativeCardAreaByUnit(areaText, unit);

	const rawAreaText = String(areaText || "-").trim();
	const landTotalAreas = parseDetachedHouseAreas(rawAreaText);
	const labeledApartmentAreas = parseApartmentAreas(rawAreaText);
	const primaryAreaLabel = labeledApartmentAreas.areaLabel || (/오피스텔|호텔|펜션/.test(typeText) ? "계약" : "공급");

	if (!/계약|전용/.test(rawAreaText) && Number.isFinite(landTotalAreas.land) && Number.isFinite(landTotalAreas.total)) {
		return `대지${formatSingleAreaValue(landTotalAreas.land, unit)}ㆍ연${formatSingleAreaValue(landTotalAreas.total, unit)}`;
	}

	if (/공급|계약|전용/.test(rawAreaText) && Number.isFinite(labeledApartmentAreas.supply) && Number.isFinite(labeledApartmentAreas.private)) {
		const privateText = formatSingleAreaValue(labeledApartmentAreas.private, unit);
		const supplyText = formatSingleAreaValue(labeledApartmentAreas.supply, unit);
		return formatCardAreaPair(primaryAreaLabel, supplyText, privateText);
	}

	if (isDetachedHouseType(typeText)) {
		return formatDetachedHouseCardAreaDisplay(areaText, unit);
	}

	if (isHotelPensionType(typeText)) {
		const parsed = parseApartmentAreas(areaText || "-");
		const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";
		const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return formatCardAreaPair("계약", supplyText, privateText);
	}

	if (/상가|상가건물|사무실|공장/.test(typeText)) {
		const raw = String(areaText || "-").trim();

		if (/계약|전용/.test(raw)) {
			const parsed = parseApartmentAreas(raw);
			const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";
			const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
			return formatCardAreaPair(parsed.areaLabel || "계약", supplyText, privateText);
		}

		const totalMatch =
		raw.match(/연면적\s*([\d,.]+)㎡/) ||
		raw.match(/연면적\s*([\d,.]+)평/) ||
		raw.match(/\(연\)\s*([\d,.]+)㎡/) ||
		raw.match(/\(연\)\s*([\d,.]+)평/) ||
		raw.match(/연\s*([\d,.]+)㎡/) ||
		raw.match(/연\s*([\d,.]+)평/);

		const landMatch =
		raw.match(/대지면적\s*([\d,.]+)㎡/) ||
		raw.match(/대지면적\s*([\d,.]+)평/) ||
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
		return formatCardAreaPair("계약", supplyText, privateText);
	}

	if (/원룸|투룸/.test(typeText)) {
		const parsed = parseApartmentAreas(areaText || "-");
		const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";
		const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return formatCardAreaPair(parsed.areaLabel || "공급", supplyText, privateText);
	}

	if (isApartmentType(typeText)) {
		const parsed = parseApartmentAreas(areaText || "-");
		const privateText = Number.isFinite(parsed.private) ? formatSingleAreaValue(parsed.private, unit) : "-";
		const supplyText = Number.isFinite(parsed.supply) ? formatSingleAreaValue(parsed.supply, unit) : "-";
		return formatCardAreaPair(parsed.areaLabel || "공급", supplyText, privateText);
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

function getLandTypeDetailLabel(typeText)
{
	const text = String(typeText || "").trim();
	if (text === "임야") return "임야";
	if (text === "목장용지") return "토지(목장)";
	if (["전", "대", "답", "과수원"].includes(text)) return `토지(${text})`;
	if (["토지", "토지ㆍ임야"].includes(text)) return "토지";
	return text || "-";
}

function setDetailAreaValueHTML(valueText)
{
	if (!detailAreaValue) return;
	const raw = String(valueText || "-").trim();
	const matched = raw.match(/^(\d[\d,]*(?:\.\d+)?)([^0-9].*)$/);

	if (matched) {
		const [, num, rest] = matched;
		detailAreaValue.innerHTML = `<span class="area-num">${num}</span><span class="area-rest">${rest}</span>`;
	} else {
		detailAreaValue.textContent = raw;
	}
}

syncSummaryBadgeRow();

function syncDetailAreaDisplay(detailItem)
{
	if (!detailItem || !detailAreaValue || !detailAreaLabel) return;

	const unit = detailAreaValue.dataset.areaUnit || "m2";
	const typeText = detailItem.type || "";

	if (detailAreaWrap) {
		detailAreaWrap.classList.remove("land-two-line");
	}

	const rawAreaText = String(detailItem.area || "-").trim();
	const landTotalAreas = parseDetachedHouseAreas(rawAreaText);
	const pairedAreas = parseApartmentAreas(rawAreaText);

	if (/공급|계약|전용/.test(rawAreaText) && Number.isFinite(pairedAreas.supply) && Number.isFinite(pairedAreas.private)) {
		const showSupply = detailAreaMode === "supply";
		const targetValue = showSupply ? pairedAreas.supply : pairedAreas.private;

		detailAreaLabel.textContent = showSupply ? `면적(${pairedAreas.areaLabel || "공급"})` : "면적(전용)";
		setDetailAreaValueHTML(formatSingleAreaValue(targetValue, unit));

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (!/계약|전용/.test(rawAreaText) && Number.isFinite(landTotalAreas.land) && Number.isFinite(landTotalAreas.total)) {
		const targetValue = detailAreaMode === "land" ? landTotalAreas.land : landTotalAreas.total;

		detailAreaLabel.textContent = detailAreaMode === "land" ? "면적(대지)" : "면적(연)";
		setDetailAreaValueHTML(formatSingleAreaValue(targetValue, unit));

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (isDetachedHouseType(typeText)) {
		const parsed = parseDetachedHouseAreas(detailItem.area || "-");
		const targetValue = detailAreaMode === "land" ? parsed.land : parsed.total;

		detailAreaLabel.textContent = detailAreaMode === "land" ? "면적(대지)" : "면적(연)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (isHotelPensionType(typeText)) {
		const parsed = parseApartmentAreas(detailItem.area || "-");
		const showSupply = detailAreaMode === "supply";
		const targetValue = showSupply ? parsed.supply : parsed.private;

		detailAreaLabel.textContent = showSupply ? `면적(${parsed.areaLabel || "계약"})` : "면적(전용)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (isCommercialType(typeText)) {
		const raw = String(detailItem.area || "-").trim();

		if (/계약|전용/.test(raw)) {
			const parsed = parseApartmentAreas(raw);
			const showSupply = detailAreaMode === "supply";
			const targetValue = showSupply ? parsed.supply : parsed.private;

			detailAreaLabel.textContent = showSupply ? `면적(${parsed.areaLabel || "계약"})` : "면적(전용)";
			setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

			if (detailAreaTypeToggleBtn) {
				detailAreaTypeToggleBtn.style.display = "inline-flex";
			}
			return;
		}

		const parsed = parseDetachedHouseAreas(raw);
		const targetValue = detailAreaMode === "land" ? parsed.land : parsed.total;

		detailAreaLabel.textContent = detailAreaMode === "land" ? "면적(대지)" : "면적(연)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (/콘도/.test(typeText)) {
		const raw = String(detailItem.area || "-").trim();

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
		const showBuild = detailAreaMode === "build";
		const targetValue = showBuild ? buildValue : totalValue;

		detailAreaLabel.textContent = showBuild ? "면적(건축)" : "면적(연)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (/오피스텔/.test(typeText)) {
		const parsed = parseApartmentAreas(detailItem.area || "-");
		const showSupply = detailAreaMode === "supply";
		const targetValue = showSupply ? parsed.supply : parsed.private;

		detailAreaLabel.textContent = showSupply ? `면적(${parsed.areaLabel || "계약"})` : "면적(전용)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (isApartmentType(typeText) || /원룸|투룸/.test(typeText)) {
		const parsed = parseApartmentAreas(detailItem.area || "-");
		const showSupply = detailAreaMode === "supply";
		const targetValue = showSupply ? parsed.supply : parsed.private;

		detailAreaLabel.textContent = showSupply ? `면적(${parsed.areaLabel || "공급"})` : "면적(전용)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (/토지|임야|과수원/.test(typeText)) {
		detailAreaLabel.textContent = "면적";
		setDetailAreaValueHTML(formatAreaByUnit(detailItem.area || "-", unit, typeText));

		if (detailAreaWrap) {
			detailAreaWrap.classList.add("land-two-line");
		}

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "none";
		}
		return;
	}

	detailAreaLabel.textContent = "면적";
	setDetailAreaValueHTML(formatAreaByUnit(detailItem.area || "-", unit, typeText));

	if (detailAreaTypeToggleBtn) {
		detailAreaTypeToggleBtn.style.display = "none";
	}

	if (detailAreaToggleBtn) {
		detailAreaToggleBtn.style.display = "none";
		detailAreaToggleBtn.style.display = "none";
	}
}

function setResultInfo(text)
{
	if (mapResultCount) mapResultCount.textContent = text;
}

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
	recommendIds = [];
	recommendAgents = [];
}

let realjejuMapListingsSupabaseClient = null;

function getMapListingsSupabaseClient()
{
	if (typeof window.getRealjejuSupabaseClient === "function") {
		const client = window.getRealjejuSupabaseClient();
		if (client) return client;
	}
	if (realjejuMapListingsSupabaseClient) return realjejuMapListingsSupabaseClient;
	const url = window.REALJEJU_SUPABASE_URL || "https://jctovfrcvfosoowribej.supabase.co";
	const key = window.REALJEJU_SUPABASE_PUBLIC_KEY || "sb_publishable_IX_sRsjfEGdPin-kqtYGLw_FH0PPE2b";
	if (!window.supabase || typeof window.supabase.createClient !== "function") return null;
	realjejuMapListingsSupabaseClient = window.supabase.createClient(url, key, {
		auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
	});
	return realjejuMapListingsSupabaseClient;
}

function getMapDealLabel(deal)
{
	const labels = { sale: "매매", jeonse: "전세", monthly: "월세", yearly: "년세", short: "단기" };
	return labels[deal] || deal || "";
}

function formatMapManwon(value)
{
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return "";
	if (num >= 10000) {
		const eok = Math.floor(num / 10000);
		const rest = Math.round(num % 10000);
		return rest ? `${eok}억 ${rest.toLocaleString("ko-KR")}` : `${eok}억`;
	}
	return num.toLocaleString("ko-KR");
}

function getMapListingPrice(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const prices = payload.prices || {};
	const deals = Array.isArray(row.deal_types) ? row.deal_types : [];
	if (deals.includes("sale") && prices.sale?.price) return formatMapManwon(prices.sale.price);
	if (deals.includes("jeonse") && prices.jeonse?.deposit) return formatMapManwon(prices.jeonse.deposit);
	if (deals.includes("monthly")) {
		const deposit = formatMapManwon(prices.monthly?.deposit);
		const rent = formatMapManwon(prices.monthly?.rent);
		return [deposit, rent].filter(Boolean).join(" / ") || "-";
	}
	if (deals.includes("yearly")) {
		const deposit = formatMapManwon(prices.yearly?.deposit);
		const rent = formatMapManwon(prices.yearly?.rent);
		return [deposit, rent].filter(Boolean).join(" / ") || "-";
	}
	if (deals.includes("short")) {
		const deposit = formatMapManwon(prices.short?.deposit);
		const rent = formatMapManwon(prices.short?.rent);
		return [deposit, rent].filter(Boolean).join(" / ") || "-";
	}
	return "-";
}

const PRICE_FILTER_CONFIG = {
	"매매": {
		label: "매매가",
		key: "sale",
		valueKey: "price",
		ranges: [
			{ value: "sale-under-1", label: "1억 이하", min: 0, max: 10000 },
			{ value: "sale-1-3", label: "1억 ~ 3억", min: 10000, max: 30000 },
			{ value: "sale-3-5", label: "3억 ~ 5억", min: 30000, max: 50000 },
			{ value: "sale-5-10", label: "5억 ~ 10억", min: 50000, max: 100000 },
			{ value: "sale-over-10", label: "10억 이상", min: 100000, max: Infinity }
		]
	},
	"전세": {
		label: "전세가",
		key: "jeonse",
		valueKey: "deposit",
		ranges: [
			{ value: "jeonse-under-1", label: "1억 이하", min: 0, max: 10000 },
			{ value: "jeonse-1-2", label: "1억 ~ 2억", min: 10000, max: 20000 },
			{ value: "jeonse-2-3", label: "2억 ~ 3억", min: 20000, max: 30000 },
			{ value: "jeonse-3-5", label: "3억 ~ 5억", min: 30000, max: 50000 },
			{ value: "jeonse-over-5", label: "5억 이상", min: 50000, max: Infinity }
		]
	},
	"월세": {
		label: "월세",
		key: "monthly",
		valueKey: "rent",
		ranges: [
			{ value: "monthly-under-50", label: "50만 이하", min: 0, max: 50 },
			{ value: "monthly-50-100", label: "50만 ~ 100만", min: 50, max: 100 },
			{ value: "monthly-100-200", label: "100만 ~ 200만", min: 100, max: 200 },
			{ value: "monthly-over-200", label: "200만 이상", min: 200, max: Infinity }
		]
	},
	"년세": {
		label: "년세",
		key: "yearly",
		valueKey: "rent",
		ranges: [
			{ value: "yearly-under-500", label: "500만 이하", min: 0, max: 500 },
			{ value: "yearly-500-1000", label: "500만 ~ 1,000만", min: 500, max: 1000 },
			{ value: "yearly-1000-2000", label: "1,000만 ~ 2,000만", min: 1000, max: 2000 },
			{ value: "yearly-over-2000", label: "2,000만 이상", min: 2000, max: Infinity }
		]
	}
};

PRICE_FILTER_CONFIG["연세"] = PRICE_FILTER_CONFIG["년세"];

function getPriceFilterConfigForDeal(deal)
{
	return PRICE_FILTER_CONFIG[String(deal || "").trim()] || null;
}

function getPriceFilterRange(value, deal)
{
	const config = getPriceFilterConfigForDeal(deal);
	if (!config || value === "all") return null;
	return config.ranges.find(range => range.value === value) || null;
}

function getMapListingFilterPriceManwon(item, deal)
{
	const config = getPriceFilterConfigForDeal(deal);
	const markerPrice = Number(item?.filterPriceManwon);
	if (Number.isFinite(markerPrice) && markerPrice > 0) return markerPrice;
	const payload = item && item.payload && typeof item.payload === "object" ? item.payload : {};
	const prices = payload.prices && typeof payload.prices === "object" ? payload.prices : {};
	const priceRow = config ? prices[config.key] : null;
	const rawValue = priceRow ? Number(priceRow[config.valueKey]) : NaN;
	if (Number.isFinite(rawValue) && rawValue > 0) return rawValue;
	if (config && config.key === "sale") {
		const fallback = parsePriceTextToWon(item?.price || "");
		return Number.isFinite(fallback) ? Math.round(fallback / 10000) : null;
	}
	return null;
}

function isPriceInRange(value, range)
{
	const num = Number(value);
	if (!Number.isFinite(num) || !range) return false;
	const min = Number(range.min || 0);
	const max = Number(range.max);
	return num >= min && (max === Infinity ? true : num <= max);
}

function getRegisterAreaModeByType(propertyTypeValue)
{
	const type = String(propertyTypeValue || "").trim();
	if (["house", "multi_family_house", "building", "factory_warehouse"].includes(type)) return "land_building_total";
	if (type === "land") return "land_only";
	if (["officetel", "office", "store"].includes(type)) return "contract_private";
	return "supply_private";
}

function getCurrentPropertyRegisterAreaMode(propertyTypeValue)
{
	const propertyTypeSelect = document.getElementById("propertyTypeSelect");
	const pastedMode = String(propertyTypeSelect && propertyTypeSelect.dataset ? propertyTypeSelect.dataset.areaMode || "" : "").trim();
	return pastedMode || getRegisterAreaModeByType(propertyTypeValue);
}

function normalizeAreaLabel(label)
{
	const text = String(label || "")
		.replace(/\*/g, "")
		.replace(/\s+/g, "")
		.trim();
	const labels = {
		대지: "대지면적",
		대지면적: "대지면적",
		건축: "건축면적",
		건축면적: "건축면적",
		연: "연면적",
		연면적: "연면적",
		계약: "계약면적",
		계약면적: "계약면적",
		공급: "공급면적",
		공급면적: "공급면적",
		전용: "전용면적",
		전용면적: "전용면적"
	};
	return labels[text] || text;
}

function getPropertyRegisterAreaLabel(id, fallback)
{
	const el = document.getElementById(id);
	const label = el ? normalizeAreaLabel(el.textContent || "") : "";
	return label || fallback;
}

	function getCurrentPropertyRegisterAreaLabels()
	{
		return {
			land: getPropertyRegisterAreaLabel("landAreaLabel", "대지면적"),
			exclusive: getPropertyRegisterAreaLabel("exclusiveAreaLabel", "전용면적"),
			supply: getPropertyRegisterAreaLabel("supplyAreaLabel", "공급면적")
		};
	}

	function isPropertyAreaRowVisible(row)
	{
		if (!row) return false;
		const style = window.getComputedStyle(row);
		return style.display !== "none" && style.visibility !== "hidden";
	}

	function getPropertyRegisterAreaItemDefs()
	{
		return [
			{ key: "exclusive", rowId: "exclusiveAreaRow", labelId: "exclusiveAreaLabel", m2Id: "exclusiveAreaM2Input", pyId: "exclusiveAreaPyInput" },
			{ key: "supply", rowId: "supplyAreaRow", labelId: "supplyAreaLabel", m2Id: "supplyAreaM2Input", pyId: "supplyAreaPyInput" },
			{ key: "land", rowId: "landAreaRow", labelId: "landAreaLabel", m2Id: "landAreaM2Input", pyId: "landAreaPyInput" }
		];
	}

	function getAreaKeyFromLabel(label)
	{
		const normalized = normalizeAreaLabel(label);
		if (normalized === "대지면적") return "land";
		if (normalized === "건축면적" || normalized === "전용면적") return "exclusive";
		if (normalized === "연면적" || normalized === "계약면적" || normalized === "공급면적") return "supply";
		return "";
	}

	function collectPropertyRegisterAreaItems()
	{
		return getPropertyRegisterAreaItemDefs()
			.map((def) => {
				const row = document.getElementById(def.rowId);
				if (!isPropertyAreaRowVisible(row)) return null;
				const label = getPropertyRegisterAreaLabel(def.labelId, "");
				const m2Text = String(document.getElementById(def.m2Id)?.value || "").trim();
				const pyText = String(document.getElementById(def.pyId)?.value || "").trim();
				const m2Value = Number(m2Text.replace(/,/g, ""));
				const pyValue = Number(pyText.replace(/,/g, ""));
				return {
					key: def.key,
					label,
					m2_text: m2Text,
					py_text: pyText,
					m2: Number.isFinite(m2Value) ? m2Value : null,
					py: Number.isFinite(pyValue) ? pyValue : null
				};
			})
			.filter(Boolean);
	}

	function getPropertyRegisterAreaItemByKey(items, key)
	{
		const list = Array.isArray(items) ? items : [];
		return list.find((item) => String(item?.key || "") === key)
			|| list.find((item) => getAreaKeyFromLabel(item?.label) === key)
			|| null;
	}

	function getPropertyRegisterAreaItemNumber(items, key, unit)
	{
		const item = getPropertyRegisterAreaItemByKey(items, key);
		if (!item) return null;
		const raw = unit === "py" ? item.py : item.m2;
		const num = Number(raw);
		return Number.isFinite(num) ? num : null;
	}

	function getAreaLabelsForMode(mode)
	{
		const normalized = String(mode || "").trim();
		if (normalized === "land_building_total") return { land: "대지면적", exclusive: "건축면적", supply: "연면적" };
		if (normalized === "land_total") return { land: "대지면적", exclusive: "", supply: "연면적" };
		if (normalized === "land_only") return { land: "대지면적", exclusive: "", supply: "" };
		if (normalized === "contract_private") return { land: "", exclusive: "전용면적", supply: "계약면적" };
		if (normalized === "supply_private") return { land: "", exclusive: "전용면적", supply: "공급면적" };
		return { land: "", exclusive: "", supply: "" };
	}

	function getStoredAreaInputValue(payload, key, unit)
	{
		const inputs = payload?.form_state?.inputs && typeof payload.form_state.inputs === "object" ? payload.form_state.inputs : {};
		const inputIds = {
			land: { m2: "landAreaM2Input", py: "landAreaPyInput" },
			exclusive: { m2: "exclusiveAreaM2Input", py: "exclusiveAreaPyInput" },
			supply: { m2: "supplyAreaM2Input", py: "supplyAreaPyInput" }
		};
		const id = inputIds[key]?.[unit];
		return id ? inputs[id] : "";
	}

	function getStoredAreaValue(source, payload, key, unit)
	{
		const field = `${key}_${unit}`;
		const direct = source && Object.prototype.hasOwnProperty.call(source, field) ? source[field] : "";
		if (String(direct ?? "").trim() !== "") return direct;
		return getStoredAreaInputValue(payload, key, unit);
	}

	function hasPositiveStoredAreaValue(source, payload, key)
	{
		const raw = getStoredAreaValue(source, payload, key, "m2");
		const text = String(raw ?? "").replace(/,/g, "").trim();
		if (!text) return false;
		const num = Number(text);
		return Number.isFinite(num) ? num > 0 : true;
	}

	function getAreaModeFromStoredValues(areas, payload, fallback = "")
	{
		const source = areas && typeof areas === "object" ? areas : {};
		const hasLand = hasPositiveStoredAreaValue(source, payload, "land");
		const hasExclusive = hasPositiveStoredAreaValue(source, payload, "exclusive");
		const hasSupply = hasPositiveStoredAreaValue(source, payload, "supply");
		if (hasLand && hasExclusive && hasSupply) return "land_building_total";
		if (hasLand && hasSupply && !hasExclusive) return "land_total";
		if (hasLand && !hasExclusive && !hasSupply) return "land_only";
		return fallback;
	}

	function getDirectStoredAreaLabels(areas, payload)
	{
		const source = areas && typeof areas === "object" ? areas : {};
		const nested = source.labels || source.area_labels || payload?.form_state?.areaLabels || {};
		return {
			land: normalizeAreaLabel(source.land_label || nested.land || ""),
			exclusive: normalizeAreaLabel(source.exclusive_label || nested.exclusive || ""),
			supply: normalizeAreaLabel(source.supply_label || nested.supply || "")
		};
	}

	function getAreaModeFromStoredLabels(areas, payload, fallback = "")
	{
		const valueMode = getAreaModeFromStoredValues(areas, payload, "");
		if (["land_building_total", "land_total", "land_only"].includes(valueMode)) return valueMode;
		const items = Array.isArray(areas?.area_items) ? areas.area_items : (Array.isArray(payload?.form_state?.areaItems) ? payload.form_state.areaItems : []);
		const directLabels = getDirectStoredAreaLabels(areas, payload);
		const labels = new Set([
			...items.map((item) => normalizeAreaLabel(item?.label)),
			...Object.values(directLabels).map(normalizeAreaLabel)
		].filter(Boolean));
		if (labels.has("대지면적") && labels.has("건축면적") && labels.has("연면적")) return "land_building_total";
		if (labels.has("대지면적") && labels.has("연면적") && !labels.has("건축면적")) return "land_total";
		if (labels.has("대지면적") && labels.size === 1) return "land_only";
		if (labels.has("계약면적")) return "contract_private";
		if (labels.has("공급면적")) return "supply_private";
		return getAreaModeFromStoredValues(areas, payload, fallback);
	}

function getStoredAreaLabels(areas, payload)
{
	const source = areas && typeof areas === "object" ? areas : {};
	const directLabels = getDirectStoredAreaLabels(source, payload);
	const valueMode = getAreaModeFromStoredValues(source, payload, "");
	const mode = valueMode || String(source.area_mode || payload?.form_state?.areaMode || "");
	const modeLabels = getAreaLabelsForMode(mode);
	if (["land_building_total", "land_total", "land_only"].includes(valueMode)) return modeLabels;
	return {
		land: directLabels.land || modeLabels.land || "",
		exclusive: directLabels.exclusive || modeLabels.exclusive || "",
		supply: directLabels.supply || modeLabels.supply || ""
	};
}

function findOriginalAreaLabelByValue(row, value)
{
	const num = Number(String(value ?? "").replace(/,/g, ""));
	if (!Number.isFinite(num) || num <= 0) return "";
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const formInputs = payload.form_state && payload.form_state.inputs && typeof payload.form_state.inputs === "object" ? payload.form_state.inputs : {};
	const source = [
		payload.description,
		formInputs.propertyDetailDescriptionInput
	].filter(Boolean).join("\n");
	if (!source) return "";
	const labelPattern = /(대지\s*면적|건축\s*면적|연\s*면적|계약\s*면적|공급\s*면적|전용\s*면적)/;
	for (const line of source.split(/\n/)) {
		const labelMatch = line.match(labelPattern);
		if (!labelMatch) continue;
		const numbers = String(line).match(/[\d,]+(?:\.\d+)?/g) || [];
		const hasSameNumber = numbers.some((numberText) => {
			const lineNum = Number(String(numberText || "").replace(/,/g, ""));
			return Number.isFinite(lineNum) && Math.abs(lineNum - num) < 0.01;
		});
		if (hasSameNumber) return normalizeAreaLabel(labelMatch[1]);
	}
	return "";
}

function getAreaDisplayLabel(row, areas, key, fallback)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const labels = getStoredAreaLabels(areas, payload);
	const savedLabel = labels[key] || "";
	if (savedLabel) return savedLabel;
	const valueKey = `${key}_m2`;
	const originalLabel = findOriginalAreaLabelByValue(row, areas ? areas[valueKey] : null);
	return originalLabel || normalizeAreaLabel(fallback);
}

	function getListingAreaMode(row, areas, typeText = "")
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const savedMode = String(areas?.area_mode || payload.areaMode || payload.form_state?.areaMode || "").trim();
		const labelMode = getAreaModeFromStoredLabels(areas, payload, "");
		if (labelMode) return labelMode;
		if (savedMode) return savedMode;
		const typeValue = String(row?.property_type || payload.property_type || "").trim();
	const label = String(typeText || row?.property_type_label || payload.property_type_label || "").trim();
	if (["house", "multi_family_house", "building", "factory_warehouse"].includes(typeValue) || /단독|다가구|건물|공장|창고/.test(label)) return "land_building_total";
	if (typeValue === "land" || /토지|임야|대지|전|답|과수원|목장용지/.test(label)) return "land_only";
	if (["officetel", "office", "store"].includes(typeValue) || /오피스텔|사무실|상가/.test(label)) return "contract_private";
	return "supply_private";
}

function formatMapAreaPart(label, value)
{
	const formatted = formatDetailAreaM2(value);
	const areaLabel = normalizeAreaLabel(label);
	return formatted ? `${areaLabel}${formatted}` : "";
}

function getMapListingArea(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const areas = payload.areas || {};
	const typeText = String(row.property_type_label || row.property_type || "");
	const areaMode = getListingAreaMode(row, areas, typeText);
	const parts = [];
	if (areaMode === "land_building_total") {
		parts.push(
			formatMapAreaPart(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2),
			formatMapAreaPart(getAreaDisplayLabel(row, areas, "exclusive", "건축면적"), areas.exclusive_m2),
			formatMapAreaPart(getAreaDisplayLabel(row, areas, "supply", "연면적"), areas.supply_m2)
		);
		return parts.filter(Boolean).join("ㆍ") || "-";
	}
	if (areaMode === "land_total") {
		parts.push(
			formatMapAreaPart(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2),
			formatMapAreaPart(getAreaDisplayLabel(row, areas, "supply", "연면적"), areas.supply_m2)
		);
		return parts.filter(Boolean).join("ㆍ") || "-";
	}
	if (areaMode === "land_only") {
		const landValue = formatDetailAreaM2(areas.land_m2 || areas.supply_m2 || areas.exclusive_m2);
		return landValue || "-";
	}
	const primaryFallback = areaMode === "contract_private" || /오피스텔|호텔|펜션/.test(typeText) ? "계약면적" : "공급면적";
	const primaryLabel = getAreaDisplayLabel(row, areas, "supply", primaryFallback);
	if (areas.supply_m2) parts.push(formatMapAreaPart(primaryLabel, areas.supply_m2));
	if (areas.exclusive_m2) parts.push(formatMapAreaPart(getAreaDisplayLabel(row, areas, "exclusive", "전용면적"), areas.exclusive_m2));
	if (areas.land_m2) {
		const landLabel = getAreaDisplayLabel(row, areas, "land", "");
		if (landLabel) parts.push(formatMapAreaPart(landLabel, areas.land_m2));
	}
	if (!parts.length && areas.land_m2) parts.push(formatDetailAreaM2(areas.land_m2));
	return parts.join("ㆍ") || "-";
}

function normalizePropertyListingNoCandidate(value)
{
	const text = String(value || "").trim().replace(/\s+/g, "");
	if (!text) return "";
	const digitCount = (text.match(/\d/g) || []).length;
	return digitCount >= 2 ? text : "";
}

function extractPropertyListingNoCandidate(source)
{
	const text = String(source || "");
	const match = text.match(/^\s*\(([^)]*)\)/);
	return normalizePropertyListingNoCandidate(match && match[1]);
}

function getPropertyListingNoMode()
{
	const checked = document.querySelector('input[name="propertyListingNoMode"]:checked');
	return checked && checked.value === "manual" ? "manual" : "auto";
}

function syncPropertyListingNoModeUI()
{
	const input = document.getElementById("propertyListingNoInput");
	const mode = getPropertyListingNoMode();
	if (!input) return;
	input.readOnly = mode !== "manual";
	input.placeholder = mode === "manual" ? "" : "10166031";
	if (mode !== "manual") input.value = "";
}

function setPropertyListingNoMode(mode)
{
	const nextMode = mode === "manual" ? "manual" : "auto";
	const radio = document.querySelector(`input[name="propertyListingNoMode"][value="${nextMode}"]`);
	if (radio) {
		radio.checked = true;
		radio.dispatchEvent(new Event("change", { bubbles: true }));
	}
	syncPropertyListingNoModeUI();
}

function setPropertyListingNoManualValue(value)
{
	const listingNo = normalizePropertyListingNoCandidate(value);
	const input = document.getElementById("propertyListingNoInput");
	if (!input) return "";
	if (!listingNo) {
		setPropertyListingNoMode("auto");
		return "";
	}
	setPropertyListingNoMode("manual");
	if (input.value !== listingNo) {
		input.value = listingNo;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		input.dispatchEvent(new Event("change", { bubbles: true }));
	}
	return listingNo;
}

function getMapListingNo(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const storedNo = normalizePropertyListingNoCandidate(row?.listing_no || payload.listing_no || "");
	if (storedNo) return storedNo;
	const source = [row?.title, payload.description, payload.agency_memo].filter(Boolean).join("\n");
	const extractedNo = extractPropertyListingNoCandidate(source);
	if (extractedNo) return extractedNo;
	return String(row?.id || "").slice(0, 8) || "";
}

function formatDetailWon(value)
{
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return "";
	return `${num.toLocaleString("ko-KR")}원`;
}

function formatDetailManwon(value)
{
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return "";
	return `${num.toLocaleString("ko-KR")}만원`;
}

function formatCardMaintenanceAmount(value)
{
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return "";
	const manwon = num >= 10000 ? num / 10000 : num;
	const rounded = Math.round(manwon * 10) / 10;
	return `${Number.isInteger(rounded) ? rounded.toLocaleString("ko-KR") : rounded.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}만`;
}

function getCardMaintenanceDisplay(maintenance)
{
	if (!maintenance || typeof maintenance !== "object") return "";
	if (maintenance.type === "none") return "관리비 없음";
	if (maintenance.type === "unknown") return "";
	const total = maintenance.type === "fixed" ? maintenance.fixed_total_won : maintenance.total_won;
	const amount = formatCardMaintenanceAmount(total) || formatCardMaintenanceAmount(maintenance.common_manwon);
	return amount ? `관리비 ${amount}` : "";
}

function normalizeMaintenanceNoFeeText(value, fallback = "관리비 없음")
{
	const text = String(value ?? "").trim();
	if (!text) return fallback;
	const compact = text.replace(/\s+/g, "");
	if (compact === "관리비없음") return "관리비 없음";
	if (compact === "관리비부과내역없음") return "관리비 부과내역 없음";
	return text
		.replace(/관리비\s*없음/g, "관리비 없음")
		.replace(/관리비\s*부과내역\s*없음/g, "관리비 부과내역 없음");
}

function getMaintenanceBaseLabel(value)
{
	const labels = {
		prev_month: "직전 월",
		recent_3_months: "최근 3개월 평균",
		recent_1_year: "최근 1년 평균",
		etc: "기타"
	};
	return labels[value] || value || "";
}

function getMaintenanceDetailTypeLabel(value)
{
	const labels = {
		usage_by_household: "세대별 사용량에 따라 부과",
		area_rule: "관리규약에 따라 부과",
		common_area_usage: "공용관리비는 면적 / 세대별 부과\n사용료는 사용량에 따라 부과",
		broker_unprovided: "중개의뢰인 관리비 미제시",
		divide_total: "전체 사용량을 세대수로 나누어 부과",
		etc: "기타"
	};
	return labels[value] || value || "";
}

function getMaintenanceUnknownReasonLabel(value)
{
	const labels = {
		single_house: "건축법 시행령 별표 1의 제1호 가목의 단독주택",
		commercial_building: "오피스텔 제외 상가 건물에 해당",
		unconfirmed: "미등기건물, 신축건물 등 관리비 내역 확인불가"
	};
	return labels[value] || value || "";
}

function getMaintenanceFeeTypeLabel(value, amount)
{
	if (value === "fixed") return formatDetailManwon(amount) || "정액";
	if (value === "usage") return "쓴 만큼";
	if (value === "none") return "없음";
	return "";
}

function getMaintenanceInfoRows(maintenance)
{
	if (!maintenance || typeof maintenance !== "object") return [];
	const typeLabels = {
		fixed: "정액 관리비",
		extra: "기타 부과",
		none: "관리비 없음",
		unknown: "확인 불가"
	};
	const includeLabels = [
		["include_common", "공용"],
		["include_electric", "전기료"],
		["include_water", "수도료"],
		["include_gas", "가스비"],
		["include_heating", "난방비"],
		["include_internet", "인터넷"],
		["include_tv", "TV"],
		["include_etc", "기타"]
	].filter(([key]) => !!maintenance[key]).map(([, label]) => label);
	const feeRows = [
		["전기료", "electric_type", "electric_manwon"],
		["수도료", "water_type", "water_manwon"],
		["가스비", "gas_type", "gas_manwon"],
		["난방비", "heating_type", "heating_manwon"],
		["인터넷", "internet_type", "internet_manwon"],
		["TV", "tv_type", "tv_manwon"],
		["기타", "etc_type", "etc_manwon"]
	].map(([label, typeKey, amountKey]) => ({ label, value: getMaintenanceFeeTypeLabel(maintenance[typeKey], maintenance[amountKey]) }));

	const rows = [
		{ label: "관리비 유형", value: typeLabels[maintenance.type] || maintenance.type || "" }
	];
	if (maintenance.type === "none") {
		rows.push(
			{ label: "관리비", value: normalizeMaintenanceNoFeeText(maintenance.no_fee_value, "관리비 없음") },
			{ label: "사유", value: normalizeMaintenanceNoFeeText(maintenance.no_fee_reason, "관리비 부과내역 없음") }
		);
		return rows;
	}
	if (maintenance.type === "unknown") {
		rows.push({ label: "확인 불가 사유", value: getMaintenanceUnknownReasonLabel(maintenance.unknown_reason) });
		return rows;
	}
	if (maintenance.type === "fixed") {
		rows.push(
			{ label: "10만원 미만/미제공", value: maintenance.under_100k_or_unprovided ? "해당" : "" },
			{ label: "부과 기준", value: getMaintenanceBaseLabel(maintenance.fixed_base) },
			{ label: "총 관리비", value: formatDetailWon(maintenance.fixed_total_won) },
			{ label: "관리비 포함", value: includeLabels.join(", ") },
			{ label: "공용", value: formatDetailManwon(maintenance.common_manwon) }
		);
		return rows.concat(feeRows);
	}
	rows.push(
		{ label: "부과 기준", value: getMaintenanceBaseLabel(maintenance.extra_base) },
		{ label: "총 관리비", value: formatDetailWon(maintenance.total_won) },
		{ label: "관리비 포함", value: includeLabels.join(", ") },
		{ label: "부과기준", value: getMaintenanceDetailTypeLabel(maintenance.detail_type) }
	);
	return rows;
}

function getOptionStatusLabel(value)
{
	const labels = { check: "확인 필요", possible: "가능", impossible: "불가능" };
	return labels[value] || value || "";
}

function getHeatingLabel(value)
{
	const labels = { individual: "개별난방", central: "중앙난방", district: "지역난방" };
	return labels[value] || value || "";
}

function getFloorDisplay(floors)
{
	if (!floors || typeof floors !== "object") return "";
	if (floors.whole_building) return "건물 전체";
	const prefix = [floors.basement ? "지하" : "", floors.semi_basement ? "반지하" : ""].filter(Boolean).join(" ");
	const level = floors.use_level_label ? ({ low: "저층", middle: "중층", high: "고층" }[floors.level_label] || floors.level_label || "") : "";
	const formatFloorText = (value) => {
		const text = String(value ?? "").trim();
		if (!text) return "";
		return /^-?\d+$/.test(text) ? text + "층" : text;
	};
	const currentFloor = formatFloorText(floors.current_floor);
	const totalFloor = formatFloorText(floors.total_floor);
	const numeric = currentFloor && totalFloor && currentFloor === totalFloor
		? currentFloor
		: [currentFloor, totalFloor].filter(Boolean).join(" / ");
	return [prefix, level || numeric].filter(Boolean).join(" ");
}

function getParkingLabel(building)
{
	if (!building || typeof building !== "object") return "";
	const status = building.parking === "possible" ? "가능" : (building.parking === "impossible" ? "불가능" : building.parking || "");
	const detail = [
		building.parking_total ? `총 ${building.parking_total}대` : "",
		building.parking_per_household ? `세대당 ${building.parking_per_household}대` : ""
	].filter(Boolean).join(" · ");
	return [status, detail].filter(Boolean).join(" · ");
}

function joinFacilityValues(...values)
{
	return values
		.flatMap(value => Array.isArray(value) ? value : [])
		.map(value => String(value || "").trim())
		.filter(Boolean)
		.join(", ");
}

function getMapListingFeatures(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const features = [];
	if (payload.building?.parking === "possible") features.push("주차 가능");
	if (payload.building?.heating_fuel && /도시가스|lng/i.test(String(payload.building.heating_fuel))) features.push("도시가스");
	if (payload.facilities?.veranda) features.push("베란다");
	if (payload.move_in?.now) features.push("즉시입주");
	if (payload.facilities?.furniture_built_in) features.push("풀옵션");
	return features;
}

function parseDetailAreaNumber(value)
{
	const text = String(value ?? "").replace(/,/g, "").trim();
	if (!text) return null;
	const num = Number(text);
	return Number.isFinite(num) && num > 0 ? num : null;
}

function formatDetailAreaM2(value, unit = globalAreaUnit)
{
	const num = parseDetailAreaNumber(value);
	const areaUnit = unit === "py" ? "py" : "m2";
	return Number.isFinite(num) ? formatSingleAreaValue(num, areaUnit) : "";
}

function isLandListingRow(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const type = String(row?.property_type || payload.property_type || "").trim().toLowerCase();
	const label = String(row?.property_type_label || payload.property_type_label || "").trim();
	return type === "land" || /^(토지|임야|토지\s*[\/ㆍ·]\s*임야|전|답|대지|과수원|목장용지)$/.test(label);
}

function getMapListingAreaInfoRows(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const areas = payload.areas || {};
	const typeText = String(row?.property_type_label || row?.property_type || "");
	const areaMode = getListingAreaMode(row, areas, typeText);
	const rows = [];
	const pushArea = (label, value) => {
		const formatted = formatDetailAreaM2(value);
		if (formatted) rows.push({ label: normalizeAreaLabel(label), value: formatted });
	};
	if (areaMode === "land_building_total") {
		pushArea(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2);
		pushArea(getAreaDisplayLabel(row, areas, "exclusive", "건축면적"), areas.exclusive_m2);
		pushArea(getAreaDisplayLabel(row, areas, "supply", "연면적"), areas.supply_m2);
		return rows;
	}
	if (areaMode === "land_total") {
		pushArea(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2);
		pushArea(getAreaDisplayLabel(row, areas, "supply", "연면적"), areas.supply_m2);
		return rows;
	}
	if (areaMode === "land_only") {
		pushArea(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2 || areas.supply_m2 || areas.exclusive_m2);
		return rows;
	}
	if (areaMode === "contract_private") {
		pushArea(getAreaDisplayLabel(row, areas, "exclusive", "전용면적"), areas.exclusive_m2);
		pushArea(getAreaDisplayLabel(row, areas, "supply", "계약면적"), areas.supply_m2);
		pushArea(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2);
		return rows;
	}
	pushArea(getAreaDisplayLabel(row, areas, "exclusive", "전용면적"), areas.exclusive_m2);
	pushArea(getAreaDisplayLabel(row, areas, "supply", "공급면적"), areas.supply_m2);
	pushArea(getAreaDisplayLabel(row, areas, "land", "대지면적"), areas.land_m2);
	return rows;
}

function getMapListingSections(row)
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const building = payload.building || {};
	const rooms = payload.rooms || {};
	const floors = payload.floors || {};
	const moveIn = payload.move_in || {};
	const areas = payload.areas || {};
	const facilities = payload.facilities || {};
	const directionText = [building.direction, building.direction_base ? `${building.direction_base} 기준` : ""].filter(Boolean).join(" · ");
	const roomBathText = rooms.not_applicable ? "해당없음" : [rooms.room_count, rooms.bath_count].filter(v => v !== null && v !== undefined && v !== "").join(" / ");
	const moveInText = [moveIn.now ? "즉시입주" : "", moveIn.negotiable ? "협의 가능" : "", moveIn.date || ""].filter(Boolean).join(" · ");
	const heatingText = [getHeatingLabel(building.heating), building.heating_fuel || ""].filter(Boolean).join(" · ");
	const isLandListing = isLandListingRow(row);
	if (isLandListing) {
		const landAreaRows = getMapListingAreaInfoRows(row);
		return [
			{
				title: "기본 정보",
				rows: [
					{ label: "매물번호", value: getMapListingNo(row) },
					{ label: "매물유형", value: row.property_type_label || row.property_type || "" },
					{ label: "거래유형", value: Array.isArray(row.deal_types) ? row.deal_types.map(getMapDealLabel).filter(Boolean).join(", ") : "" },
					{ label: "주소", value: formatDisplayPropertyAddress(row.public_address || row.address1 || "") },
					...landAreaRows
				]
			},
			{
				title: "매물 정보",
				rows: [
					{ label: "토지종류", value: areas.land_type || "" },
					{ label: "용도지역", value: areas.land_use_zone || "" },
					{ label: "도로조건", value: areas.land_road || "" }
				]
			},
			{
				title: "상세 정보",
				rows: [
					{ label: "유튜브 링크", value: payload.youtube_url || "" }
				]
			}
		];
	}
	const sections = [
		{
			title: "기본 정보",
			rows: [
				{ label: "매물번호", value: getMapListingNo(row) },
				{ label: "매물유형", value: row.property_type_label || row.property_type || "" },
				{ label: "거래유형", value: Array.isArray(row.deal_types) ? row.deal_types.map(getMapDealLabel).filter(Boolean).join(", ") : "" },
				{ label: "주소", value: formatDisplayPropertyAddress(row.public_address || row.address1 || "") },
				{ label: "건축물 용도", value: payload.building_use || "" },
				...getMapListingAreaInfoRows(row)
			]
		},
		{
			title: "매물 정보",
			rows: [
				{ label: "사용승인일", value: building.approval_date || "" },
				{ label: "방 / 욕실", value: roomBathText },
				{ label: "층 정보", value: getFloorDisplay(floors) },
				{ label: "총 점포수", value: building.store_count ? `${building.store_count}개` : "" },
				{ label: "총 세대수", value: building.household_count ? `${building.household_count}세대` : "" },
				{ label: "방향", value: directionText },
				{ label: "대출", value: getOptionStatusLabel(building.loan) },
				{ label: "반려동물 가능", value: getOptionStatusLabel(building.pet) },
				{ label: "주차", value: getParkingLabel(building) },
				{ label: "난방방식", value: heatingText },
				{ label: "입주가능일", value: moveInText }
			]
		},
		{
			title: "관리비",
			rows: getMaintenanceInfoRows(payload.maintenance)
		},
		{
			title: "시설 정보",
			rows: [
				{ label: "매물 특징", value: joinFacilityValues(facilities.features) },
				{ label: "냉방시설", value: joinFacilityValues(facilities.cooling) },
				{ label: "가구", value: joinFacilityValues(facilities.furniture) },
				{ label: "가전", value: joinFacilityValues(facilities.appliances) },
				{ label: "주방 / 욕실", value: joinFacilityValues(facilities.kitchen_bath) },
				{ label: "건물보안", value: joinFacilityValues(facilities.security) },
				{ label: "기타시설", value: joinFacilityValues(facilities.etc) }
			]
		},
		{
			title: "상세 정보",
			rows: [
				{ label: "유튜브 링크", value: payload.youtube_url || "" }
			]
		}
	];
	return isLandListingRow(row) ? sections.filter(section => section.title !== "관리비") : sections;
}

function getMapListingInfoRows(row)
{
	return getMapListingSections(row).flatMap(section => Array.isArray(section.rows) ? section.rows : []);
}

function getMapDealCodeFromLabel(label)
{
	const text = String(label || "").trim();
	const codes = { 매매: "sale", 전세: "jeonse", 월세: "monthly", 연세: "yearly", 년세: "yearly", 단기: "short" };
	return codes[text] || text;
}

function createDetailSectionSourceFromItem(item)
{
	const payload = item && item.payload && typeof item.payload === "object" ? item.payload : {};
	const payloadDeals = Array.isArray(payload.deal_types) ? payload.deal_types : [];
	const dealTypes = payloadDeals.length ? payloadDeals : [getMapDealCodeFromLabel(item?.dealType)].filter(Boolean);
	return {
		id: item?.id,
		listing_no: item?.listingNo,
		property_type: payload.property_type || item?.type || "",
		property_type_label: item?.type || payload.property_type_label || payload.propertyTypeLabel || payload.property_type || "",
		deal_types: dealTypes,
		public_address: item?.address || payload.public_address || payload.address1 || "",
		address1: item?.address || payload.address1 || payload.public_address || "",
		payload
	};
}

function refreshCurrentDetailInfoRowsForAreaUnit()
{
	if (!currentDetailItem || (!detailInfoListTop && !detailInfoList)) return;
	const payload = currentDetailItem.payload && typeof currentDetailItem.payload === "object" ? currentDetailItem.payload : {};
	if (!payload.areas || typeof payload.areas !== "object") return;
	const source = createDetailSectionSourceFromItem(currentDetailItem);
	currentDetailItem.sections = getMapListingSections(source);
	currentDetailItem.infoRows = getMapListingInfoRows(source);
	if (detailInfoListTop) detailInfoListTop.innerHTML = "";
	if (detailInfoList) detailInfoList.innerHTML = "";
	renderDetailInfoRows(currentDetailItem);
}

function mapPropertyListingRowToMapItem(row, profilesByUserId = new Map(), agenciesById = new Map(), agenciesByUserId = new Map(), agenciesByOfficeName = new Map())
{
	const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
	const registrant = payload.registrant || {};
	const savedOfficeName = String(registrant.office_name || "").trim();
	const photos = Array.isArray(row.photos) ? row.photos : [];
	const images = photos.map(photo => photo?.url || photo?.publicUrl || "").filter(Boolean);
	const dealTypes = Array.isArray(row.deal_types) ? row.deal_types : [];
	const primaryDeal = dealTypes[0] || "";
	const lat = Number(row.lat);
	const lng = Number(row.lng);
	const agency = agenciesById.get(String(row.agency_id || "")) || agenciesByUserId.get(String(row.user_id || "")) || agenciesByOfficeName.get(savedOfficeName) || {};
	const listingProfile = profilesByUserId.get(String(row.user_id || "")) || {};
	const agencyProfile = profilesByUserId.get(String(agency.user_id || "")) || {};
	const profile = { ...agencyProfile, ...listingProfile };
	const hasBrokerProfile = isRealjejuBrokerRole(profile.role_request);
	const hasAgency = !!((agency && agency.id) || savedOfficeName || hasBrokerProfile);
	const firstText = (...values) => values.map(value => String(value || "").trim()).find(Boolean) || "";
	const agentName = firstText(
		registrant.manager_name,
		registrant.representative,
		registrant.owner_name,
		registrant.name,
		agency.owner_name,
		profile.name,
		profile.full_name,
		row.agent_name,
		row.owner_name
	) || (hasAgency ? "대표" : "개인");
	const agentOffice = hasAgency ? (agency.office_name || savedOfficeName || "중개사 매물") : "개인 매물 · 직거래";
	const agentPhone = hasAgency ? (agency.phone || registrant.phone1 || profile.phone || "") : (profile.phone || registrant.phone1 || "");
	const agentImage = firstText(
		profile.profile_image,
		profile.avatar_url,
		registrant.profile_image,
		registrant.agent_image,
		payload.agentImage,
		payload.agent_image
	) || REALJEJU_AGENT_FALLBACK_IMAGE;
	const agentAddress = firstText(
		agency.office_address,
		agency.address,
		agency.office_addr,
		registrant.office_address,
		registrant.address,
		payload.office_address,
		payload.agentAddress,
		payload.agent_address
	);
	const agentRegNo = firstText(
		agency.office_reg_no,
		agency.reg_no,
		agency.registration_no,
		agency.license_no,
		registrant.office_reg_no,
		registrant.reg_no,
		registrant.registration_no,
		registrant.license_no,
		payload.office_reg_no,
		payload.agentRegNo,
		payload.agent_reg_no
	);
	const linkKakaotalk = firstText(
		registrant.kakao_url,
		registrant.kakaoUrl,
		registrant.kakao,
		registrant.kakao_open_chat,
		registrant.kakao_open_chat_url,
		agency.kakao_url,
		agency.kakaoUrl,
		agency.kakao,
		agency.kakao_open_chat,
		agency.kakao_open_chat_url,
		agency.open_chat_url,
		payload.linkKakaotalk,
		payload.kakao_url,
		payload.kakaotalk_url
	);
	const buildingName = firstText(
		payload.building_name,
		payload.complex_name,
		payload.address?.buildingName,
		payload.address?.complexName,
		payload.address?.building_name,
		payload.address?.complex_name
	);
	const savedAddress = payload.address && typeof payload.address === "object" ? payload.address : {};

	return normalizeProperty({
		id: row.id,
		listingNo: getMapListingNo(row),
		title: row.title || row.property_type_label || "등록 매물",
		dealType: getMapDealLabel(primaryDeal),
		dealFilter: getMapDealLabel(primaryDeal),
		type: row.property_type_label || row.property_type || "",
		typeFilter: row.property_type_label || row.property_type || "",
		features: getMapListingFeatures(row),
		price: getMapListingPrice(row),
		markerPrice: getMapListingPrice(row),
		area: getMapListingArea(row),
		address: row.public_address || row.address1 || "-",
		region: String(row.public_address || row.address1 || "").split(/\s+/).slice(0, 2).join(" "),
		desc: payload.description || "",
		payload,
		lat,
		lng,
		image: images[0] || "",
		images,
		link: "#",
		date: row.updated_at || row.created_at || "",
		dateLabel: row.updated_at || row.created_at || "",
		agentName,
		agentTitle: hasAgency ? "대표" : "개인 매물",
		agentOffice,
		agentAddress,
		agentRegNo,
		agentImage,
		linkKakaotalk,
		buildingName,
		phone1: agentPhone,
		phone2: registrant.phone2 || "",
		infoRows: getMapListingInfoRows(row),
		sections: getMapListingSections(row),
		locationDisplayType: row.location_display_type || savedAddress.locationDisplayType || "marker",
		locationBounds: savedAddress.locationBounds || savedAddress.location_bounds || null,
		dealMethod: hasAgency ? "broker" : "direct",
		listingMethod: hasAgency ? "broker" : "direct",
		ownerType: hasAgency ? "중개" : "직거래",
		floors: payload.floors || {},
		maintenance: payload.maintenance || {}
	});
}

function buildMarkerPricePayload(dealType, priceValue)
{
	const value = Number(priceValue);
	if (!Number.isFinite(value) || value <= 0) return {};
	const deal = String(dealType || "").trim();
	if (deal === "sale") return { sale: { price: value } };
	if (deal === "jeonse") return { jeonse: { deposit: value } };
	if (deal === "monthly") return { monthly: { rent: value } };
	if (deal === "yearly") return { yearly: { rent: value } };
	if (deal === "short") return { short: { rent: value } };
	return {};
}

function mapPropertyListingMarkerRowToMapItem(row)
{
	const dealTypes = Array.isArray(row?.deal_types) ? row.deal_types : [];
	const primaryDeal = String(row?.deal_type || dealTypes[0] || "").trim();
	const priceValue = Number(row?.price_value);
	const priceText = Number.isFinite(priceValue) && priceValue > 0 ? formatMapManwon(priceValue) : "";
	const payload = {
		prices: buildMarkerPricePayload(primaryDeal, priceValue)
	};
	const typeText = row?.property_type_label || row?.property_type || "";
	const addressText = row?.public_address || row?.address1 || "";
	const brokerStatus = String(row?.broker_status || "").trim().toLowerCase();

	return normalizeProperty({
		id: row?.id,
		listingNo: row?.listing_no || "",
		title: row?.title || typeText || "등록 매물",
		dealType: getMapDealLabel(primaryDeal),
		dealFilter: getMapDealLabel(primaryDeal),
		type: typeText,
		typeFilter: typeText,
		features: Array.isArray(row?.features) ? row.features : [],
		price: priceText,
		markerPrice: priceText,
		filterPriceManwon: Number.isFinite(priceValue) ? priceValue : null,
		area: "-",
		address: addressText || "-",
		region: String(addressText || "").split(/\s+/).slice(0, 2).join(" "),
		desc: "",
		payload,
		lat: Number(row?.lat),
		lng: Number(row?.lng),
		image: "",
		images: [],
		link: "#",
		date: row?.updated_at || row?.created_at || "",
		dateLabel: row?.updated_at || row?.created_at || "",
		agentName: "",
		agentOffice: "",
		dealMethod: row?.deal_method || (row?.agency_id ? "broker" : ""),
		listingMethod: row?.deal_method || (row?.agency_id ? "broker" : ""),
		ownerType: row?.deal_method === "direct" ? "직거래" : (row?.agency_id ? "중개" : ""),
		brokerStatus
	});
}

async function loadMapListingOwnerDataRaw(client, rows)
{
	const userIds = [...new Set((rows || []).map(row => row?.user_id).filter(Boolean).map(String))];
	const agencyIds = [...new Set((rows || []).map(row => row?.agency_id).filter(Boolean).map(String))];
	const officeNames = [...new Set((rows || []).map(row => {
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const registrant = payload.registrant && typeof payload.registrant === "object" ? payload.registrant : {};
		return String(registrant.office_name || "").trim();
	}).filter(Boolean))];
	const profilesByUserId = new Map();
	const agenciesById = new Map();
	const agenciesByUserId = new Map();
	const agenciesByOfficeName = new Map();
	const preferAgency = (current, next) => {
		return preferCachedAgency(current, next);
	};
	const rememberProfile = (profile) => {
		const cached = cacheMapListingProfile(profile);
		if (!cached) return;
		profilesByUserId.set(String(cached.id || ""), cached);
	};
	const rememberAgency = (agency) => {
		const cached = cacheMapListingAgency(agency);
		if (!cached) return;
		const idKey = String(cached.id || "");
		const userKey = String(cached.user_id || "");
		const officeKey = String(cached.office_name || "").trim();
		if (idKey) agenciesById.set(idKey, preferAgency(agenciesById.get(idKey), cached));
		if (userKey) agenciesByUserId.set(userKey, preferAgency(agenciesByUserId.get(userKey), cached));
		if (officeKey) agenciesByOfficeName.set(officeKey, preferAgency(agenciesByOfficeName.get(officeKey), cached));
	};

	userIds.forEach(userId => {
		const cachedProfile = mapListingOwnerCache.profilesByUserId.get(userId);
		if (cachedProfile) profilesByUserId.set(userId, cachedProfile);
		const cachedAgency = mapListingOwnerCache.agenciesByUserId.get(userId);
		if (cachedAgency) rememberAgency(cachedAgency);
	});
	agencyIds.forEach(agencyId => {
		const cachedAgency = mapListingOwnerCache.agenciesById.get(agencyId);
		if (cachedAgency) rememberAgency(cachedAgency);
	});
	officeNames.forEach(officeName => {
		const cachedAgency = mapListingOwnerCache.agenciesByOfficeName.get(officeName);
		if (cachedAgency) rememberAgency(cachedAgency);
	});

	const profileUserIdsToFetch = userIds.filter(userId => !profilesByUserId.has(userId));
	if (profileUserIdsToFetch.length) {
		try {
			const { data, error } = await client
				.from("profiles")
				.select("id, name, phone, profile_image, role_request")
				.in("id", profileUserIdsToFetch);
			if (error) throw error;
			(Array.isArray(data) ? data : []).forEach(profile => {
				rememberProfile(profile);
			});
		} catch (err) {
			console.warn("지도 매물 프로필 정보 조회 실패:", err);
		}
	}

	const agencyIdsToFetch = agencyIds.filter(agencyId => !agenciesById.has(agencyId));
	if (agencyIdsToFetch.length) {
		try {
			const { data, error } = await client
				.from("agencies")
				.select("*")
				.in("id", agencyIdsToFetch);
			if (error) throw error;
			(Array.isArray(data) ? data : []).forEach(agency => {
				rememberAgency(agency);
			});
		} catch (err) {
			console.warn("지도 매물 중개사무소 정보 조회 실패:", err);
		}
	}

	const agencyUserIdsToFetch = userIds.filter(userId => !agenciesByUserId.has(userId));
	if (agencyUserIdsToFetch.length) {
		try {
			const { data, error } = await client
				.from("agencies")
				.select("*")
				.in("user_id", agencyUserIdsToFetch);
			if (error) throw error;
			(Array.isArray(data) ? data : []).forEach(agency => {
				rememberAgency(agency);
			});
		} catch (err) {
			console.warn("지도 매물 최신 중개사무소 정보 조회 실패:", err);
		}
	}

	const officeNamesToFetch = officeNames.filter(officeName => !agenciesByOfficeName.has(officeName));
	if (officeNamesToFetch.length) {
		try {
			const { data, error } = await client
				.from("agencies")
				.select("*")
				.in("office_name", officeNamesToFetch);
			if (error) throw error;
			(Array.isArray(data) ? data : []).forEach(agency => {
				rememberAgency(agency);
			});
		} catch (err) {
			console.warn("지도 매물 중개사무소명 정보 조회 실패:", err);
		}
	}

	const agencyUserIds = [...new Set(
		[...agenciesById.values(), ...agenciesByUserId.values()]
			.map(agency => agency && agency.user_id)
			.filter(Boolean)
			.map(String)
	)].filter(userId => !profilesByUserId.has(userId));

	if (agencyUserIds.length) {
		try {
			const { data, error } = await client
				.from("profiles")
				.select("id, name, phone, profile_image, role_request")
				.in("id", agencyUserIds);
			if (error) throw error;
			(Array.isArray(data) ? data : []).forEach(profile => {
				rememberProfile(profile);
			});
		} catch (err) {
			console.warn("지도 매물 중개사무소 대표 프로필 조회 실패:", err);
		}
	}

	return { profilesByUserId, agenciesById, agenciesByUserId, agenciesByOfficeName };
}

function getMapListingOwnerDataKey(rows)
{
	const unique = (values) => [...new Set(values.filter(Boolean).map(String))].sort().join(",");
	const userIds = unique((rows || []).map(row => row && row.user_id));
	const agencyIds = unique((rows || []).map(row => row && row.agency_id));
	const officeNames = unique((rows || []).map(row => {
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const registrant = payload.registrant && typeof payload.registrant === "object" ? payload.registrant : {};
		return String(registrant.office_name || "").trim();
	}));
	return `${userIds}|${agencyIds}|${officeNames}`;
}

async function loadMapListingOwnerData(client, rows)
{
	const key = getMapListingOwnerDataKey(rows);
	if (key && mapListingOwnerDataInflight.has(key)) return mapListingOwnerDataInflight.get(key);

	const promise = loadMapListingOwnerDataRaw(client, rows).finally(() => {
		if (key) mapListingOwnerDataInflight.delete(key);
	});
	if (key) mapListingOwnerDataInflight.set(key, promise);
	return promise;
}

function isMapListingMarkerRpcMissing(error)
{
	const text = [
		error?.code,
		error?.message,
		error?.details,
		error?.hint
	].filter(Boolean).join(" ");
	return /PGRST202|get_map_listing_markers|schema cache|function/i.test(text);
}

async function fetchMapListingMarkerRows(client)
{
	if (client && typeof client.rpc === "function") {
		try {
			const { data, error } = await client.rpc("get_map_listing_markers");
			if (error) throw error;
			return Array.isArray(data) ? data : [];
		} catch (error) {
			if (!isMapListingMarkerRpcMissing(error)) throw error;
		}
	}

	const { data, error } = await client
		.from("property_listings")
		.select(MAP_LISTING_MARKER_FALLBACK_SELECT)
		.eq("status", "published")
		.order("updated_at", { ascending: false });
	if (error) throw error;

	return (Array.isArray(data) ? data : []).map(row => {
		const payload = row?.payload && typeof row.payload === "object" ? row.payload : {};
		const dealTypes = Array.isArray(row?.deal_types) ? row.deal_types : [];
		const primaryDeal = dealTypes[0] || "";
		return {
			id: row?.id,
			listing_no: row?.listing_no,
			property_type: row?.property_type,
			property_type_label: row?.property_type_label,
			deal_type: primaryDeal,
			deal_types: dealTypes,
			title: row?.title,
			public_address: row?.public_address,
			address1: row?.address1,
			lat: row?.lat,
			lng: row?.lng,
			updated_at: row?.updated_at,
			created_at: row?.created_at,
			features: getMapListingFeatures(row),
			price_value: getMapListingFilterPriceManwon(mapPropertyListingRowToMapItem(row), getMapDealLabel(primaryDeal)),
			broker_status: payload.broker_status || "",
			deal_method: payload.registrant?.office_name || row?.agency_id ? "broker" : ""
		};
	});
}

async function fetchLeftListRowsByIds(ids)
{
	const listingIds = (ids || []).map(normalizeItemId).filter(Boolean);
	if (!listingIds.length) return [];
	await loadSupabaseScript();
	const client = getMapListingsSupabaseClient();
	if (!client) throw new Error("Supabase 클라이언트를 초기화하지 못했습니다.");

	const { data, error } = await client
		.from("property_listings")
		.select(MAP_LISTING_SUMMARY_SELECT)
		.in("id", listingIds);
	if (error) throw error;

	const rowMap = new Map();
	(Array.isArray(data) ? data : []).forEach(row => {
		const id = normalizeItemId(row && row.id);
		if (!id) return;
		rowMap.set(id, mapPropertyListingRowToMapItem(row));
	});

	return listingIds.map(id => rowMap.get(id)).filter(Boolean);
}

async function runLoadProperties()
{
	try {
		await loadSupabaseScript();
		const client = getMapListingsSupabaseClient();
		if (!client) throw new Error("Supabase 클라이언트를 초기화하지 못했습니다.");

			const rows = await fetchMapListingMarkerRows(client);
			const normalized = rows
				.filter(row => {
					const effectiveStatus = String(row?.broker_status || "").trim().toLowerCase();
					return !["closed", "hidden", "archive", "deleted"].includes(effectiveStatus)
						&& !row?.deleted_at
						&& Number.isFinite(Number(row?.lat))
						&& Number.isFinite(Number(row?.lng));
				})
			.map(row => mapPropertyListingMarkerRowToMapItem(row))
			.filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));

		state.all = [...normalized].sort((a, b) => getSortDateValue(b) - getSortDateValue(a));
		syncSortLabelUI();
		await loadFavoriteListingStateFromServer();
		applyFilter();
		updateMapEmptyState();
		setGlobalAreaUnit("m2");
		applyGlobalAreaUnit();
		updateMapTypeButtons();
		const activeMySuiteTab = document.querySelector(".my-suite-tab.active[data-my-suite-tab]");
			if (document.body.classList.contains("my-suite-page-open") && activeMySuiteTab && activeMySuiteTab.dataset.mySuiteTab === "favorites") {
				renderRealjejuMySuiteFavoritesContent();
			}
		mapListingsLastLoadedAt = Date.now();
	} catch (err) {
		console.error("매물 데이터 불러오기 실패:", err);
		propertyList.innerHTML = `
		<div class="card" style="padding:18px; cursor:default; border-bottom:0;">
		<div class="card-body" style="padding:0;">
		<h3 style="margin-bottom:6px;">매물 데이터를 불러오지 못했습니다</h3>
		<div>Supabase property_listings 조회 권한과 등록 매물 좌표를 확인해 주세요.</div>
		</div>
		</div>
		`;
		setResultInfo("총 0건");
		setListInfo("총 0개 매물");
	}
}

async function loadProperties(options = {})
{
	const force = !!(options && options.force);
	if (!force && mapListingsLoadPromise) return mapListingsLoadPromise;
	if (!force && mapListingsLastLoadedAt && Date.now() - mapListingsLastLoadedAt < MAP_LISTINGS_BOOTSTRAP_CACHE_MS) return true;

	mapListingsLoadPromise = runLoadProperties().finally(() => {
		mapListingsLoadPromise = null;
	});
	return mapListingsLoadPromise;
}

window.realjejuReloadMapListings = () => loadProperties({ force: true });

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

function createMarkerImage(item, isSelected = false, label = "1")
{
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

	const svg = `
	<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
	<defs>
	<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
	<feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="rgba(0,0,0,0.20)"/>
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


function setClusterBadgeSelected(cluster, isSelected)
{
	const clusterMarker = cluster.getClusterMarker ? cluster.getClusterMarker() : null;
	if (!clusterMarker) return;

	const clusterItems = cluster.getMarkers().map(marker => marker.__property).filter(Boolean);
	if (!clusterItems.length) return;

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
	el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.20)";
	el.style.boxSizing = "border-box";
	el.style.whiteSpace = "nowrap";
	el.style.cursor = "pointer";
	el.style.pointerEvents = "auto";
	el.style.userSelect = "none";
	el.style.touchAction = "none";
	el.textContent = label;

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

		const key = getClusterKeyFromItems(clusterItems);
		const ids = clusterItems.map(item => normalizeItemId(item.id)).filter(Boolean);
		const overlapsSelectedMarkers = ids.length > 0 && ids.some(id => selectedIdSet.has(id));
		const overlapsLockedSelection = !!(lockedIdSet && ids.length > 0 && ids.some(id => lockedIdSet.has(id)));
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
		roadviewOverlay.classList.remove("detail-panel-roadview");
		if (mapWrap && roadviewOverlay.parentElement !== mapWrap) {
			mapWrap.appendChild(roadviewOverlay);
		}
	}
	if (mapWrap) {
		mapWrap.classList.remove("is-roadview-open");
	}
}

async function hideRoadview()
{
	await closeRoadviewPanel();
}

function makeAgentInitial(text)
{
	const raw = String(text || "담당").trim();
	return raw.length >= 2 ? raw.slice(-2) : raw;
}

function formatDisplayPhone(value)
{
	const digits = String(value || "").replace(/[^0-9]/g, "");
	if (!digits) return "";
	if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
	if (digits.startsWith("02")) {
		if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
		return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
	}
	if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
	return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function formatDisplayPhones(...values)
{
	return values.map(formatDisplayPhone).filter(Boolean).join(" / ");
}

function formatDisplayPropertyAddress(value)
{
	return String(value || "")
		.trim()
		.replace(/^제주특별자치도\s*/, "")
		.replace(/\s{2,}/g, " ");
}

function getCardRegionName(value)
{
	const text = formatDisplayPropertyAddress(value);
	if (!text) return "";
	const normalized = text
		.replace(/[()[\],]/g, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
	if (!normalized) return "";
	const eupMyeonRiMatch = normalized.match(/[가-힣0-9-]+(?:읍|면)\s+([가-힣0-9-]+리)(?=\s|$|\d)/);
	if (eupMyeonRiMatch && eupMyeonRiMatch[1]) return eupMyeonRiMatch[1];
	const compactEupMyeonRiMatch = normalized.match(/[가-힣0-9-]+(?:읍|면)([가-힣0-9-]+리)(?=\s|$|\d)/);
	if (compactEupMyeonRiMatch && compactEupMyeonRiMatch[1]) return compactEupMyeonRiMatch[1];
	const cityMatch = normalized.match(/(?:제주시|서귀포시)\s+([가-힣0-9-]+(?:읍|면|동))(?=\s|$|\d)/);
	if (cityMatch && cityMatch[1]) return cityMatch[1];
	const tokens = normalized.split(" ").filter(Boolean);
	for (const token of tokens) {
		const directMatch = token.match(/^([가-힣0-9-]+(?:읍|면|동))(?:\d.*)?$/);
		if (directMatch && directMatch[1]) return directMatch[1];
	}
	for (let i = 0; i < tokens.length - 1; i += 1) {
		if (!/(?:읍|면)$/.test(tokens[i])) continue;
		const nextRiMatch = tokens[i + 1].match(/^([가-힣0-9-]+리)(?:\d.*)?$/);
		if (nextRiMatch && nextRiMatch[1]) return nextRiMatch[1];
	}
	return "";
}

function getCardDisplayRegionName(item)
{
	if (!item || typeof item !== "object") return "";
	const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
	const payloadAddress = payload.address && typeof payload.address === "object" ? payload.address : {};
	const candidates = [
		item.address,
		item.region,
		payloadAddress.publicAddress,
		payloadAddress.addressDisplay,
		payloadAddress.addressJibun,
		payloadAddress.address1,
		payloadAddress.roadAddress,
		payload.description
	];
	for (const candidate of candidates) {
		const region = getCardRegionName(candidate);
		if (region) return region;
	}
	return "";
}

function getDisplayAgentTitle(title, item)
{
	const raw = String(title || "").trim();
	if (raw === "담당자") return "대표";
	if (!raw && item && item.agentOffice) return "대표";
	return raw;
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

async function resolveDetailDataFromDatabase(item)
{
	const listingId = String(item?.id || "").trim();
	if (!listingId) return item;
	try {
		const client = getMapListingsSupabaseClient();
		if (!client) return item;
		const { data: row, error } = await client
			.from("property_listings")
			.select("*")
			.eq("id", listingId)
			.maybeSingle();
		if (error || !row) {
			if (error) console.warn("상세 매물 DB 조회 실패:", error);
			return item;
		}

		const ownerData = await loadMapListingOwnerData(client, [row]);
		let dbItem = mapPropertyListingRowToMapItem(row, ownerData.profilesByUserId, ownerData.agenciesById, ownerData.agenciesByUserId, ownerData.agenciesByOfficeName);

		if (String(dbItem.agentOffice || "").trim() === "개인 매물 · 직거래" || String(dbItem.dealMethod || "").trim() === "direct") {
			try {
				const listingUserId = String(row.user_id || "").trim();
				if (listingUserId) {
					const { data: agencyRows } = await client
						.from("agencies")
						.select("*")
						.eq("user_id", listingUserId)
						.order("created_at", { ascending: false })
						.limit(5);
					const agencies = (Array.isArray(agencyRows) ? agencyRows : []).filter(candidate => candidate && candidate.status !== "deleted" && !candidate.deleted_at);
					const agency = agencies.find(candidate => candidate && getBrokerOfficeRowStatus(candidate) === "active") || agencies[0] || null;
					let profile = null;
					try {
						const { data: profileData } = await client
							.from("profiles")
							.select("id, name, phone, profile_image, role_request")
							.eq("id", listingUserId)
							.maybeSingle();
						profile = profileData || null;
					} catch (profileError) {
						console.warn("상세 매물 프로필 DB 조회 실패:", profileError);
					}

					if (agency) {
						const profilesByUserId = new Map();
						const agenciesById = new Map();
						const agenciesByUserId = new Map();
						const agenciesByOfficeName = new Map();
						if (profile) profilesByUserId.set(listingUserId, profile);
						agenciesById.set(String(agency.id || ""), agency);
						agenciesByUserId.set(listingUserId, agency);
						if (agency.office_name) agenciesByOfficeName.set(String(agency.office_name || "").trim(), agency);
						dbItem = mapPropertyListingRowToMapItem(row, profilesByUserId, agenciesById, agenciesByUserId, agenciesByOfficeName);
					}
				}
			} catch (fallbackError) {
				console.warn("상세 매물 중개사무소 DB 보강 실패:", fallbackError);
			}
		}

		return {
			...item,
			...dbItem,
			image: dbItem.image || item.image || "",
			images: Array.isArray(dbItem.images) && dbItem.images.length ? dbItem.images : (Array.isArray(item.images) ? item.images : []),
			sections: Array.isArray(dbItem.sections) && dbItem.sections.length ? dbItem.sections : (Array.isArray(item.sections) ? item.sections : []),
			infoRows: Array.isArray(dbItem.infoRows) && dbItem.infoRows.length ? dbItem.infoRows : (Array.isArray(item.infoRows) ? item.infoRows : [])
		};
	} catch (error) {
		console.warn("상세 매물 DB 정보 구성 실패:", error);
		return item;
	}
}

async function resolveDetailData(item)
{
	const dbItem = await resolveDetailDataFromDatabase(item);
	const [info, imageData] = await Promise.all([
	loadPropertyInfo(dbItem),
	loadPropertyImages(dbItem)
	]);

	const imageList = Array.isArray(imageData.images)
	? imageData.images.map(v => toRemotePath(String(v || "").trim())).filter(Boolean)
	: [];

	const mainImage = toRemotePath(String(imageData.image || "").trim())
	|| imageList[0]
	|| toRemotePath(String(dbItem.image || "").trim());

	const itemImages = normalizeImageArray(dbItem).map(v => toRemotePath(String(v || "").trim())).filter(Boolean);
	const mergedImages = imageList.length
	? imageList
	: (itemImages.length ? itemImages : (mainImage ? [mainImage] : []));
	const firstText = (...values) => values.map(value => String(value || "").trim()).find(Boolean) || "";
	const agentOffice = firstText(dbItem.agentOffice);
	const agentName = firstText(dbItem.agentName) || (agentOffice ? "대표" : "");

	return {
		...dbItem,
		desc: info.desc ?? dbItem.desc ?? "",
		sections: Array.isArray(info.sections) && info.sections.length ? info.sections : (Array.isArray(dbItem.sections) ? dbItem.sections : []),
		infoRows: Array.isArray(info.infoRows) && info.infoRows.length ? info.infoRows : (Array.isArray(dbItem.infoRows) ? dbItem.infoRows : []),
		propertyType: info.propertyType ?? "",
		image: mainImage,
		images: mergedImages,
		agentName,
		agentTitle: getDisplayAgentTitle(firstText(dbItem.agentTitle), { ...dbItem, agentOffice }),
		agentOffice,
		agentAddress: firstText(dbItem.agentAddress),
		agentRegNo: firstText(dbItem.agentRegNo),
		agentImage: firstText(dbItem.agentImage),
		phone1: firstText(dbItem.phone1),
		phone2: firstText(dbItem.phone2),
		linkCrossroad: firstText(dbItem.linkCrossroad),
		linkKakaotalk: firstText(
			dbItem.linkKakaotalk,
			dbItem.kakao_url,
			dbItem.kakaoUrl,
			dbItem.kakao,
			dbItem.kakao_open_chat,
			dbItem.kakao_open_chat_url,
			dbItem.open_chat_url,
			dbItem.payload && dbItem.payload.kakao_url,
			dbItem.payload && dbItem.payload.kakaotalk_url,
			dbItem.payload && dbItem.payload.linkKakaotalk,
			dbItem.payload && dbItem.payload.registrant && dbItem.payload.registrant.kakao_url
		)
	};
}

function renderDetailInfoRows(info)
{
	const sections = Array.isArray(info.sections) ? info.sections : [];
	const topList = detailInfoListTop || detailInfoList;
	const bottomList = detailInfoListTop ? detailInfoList : null;
	const renderSectionsHtml = (items) => {
		const visibleSections = (items || []).map(section => {
			const rows = Array.isArray(section.rows)
			? section.rows.filter(row => String(row?.value || "").trim() !== "")
			: [];
			return rows.length ? { ...section, rows } : null;
		}).filter(Boolean);
		if (!visibleSections.length) return "";
		return `
		<div class="detail-info-sections">
		${visibleSections.map(section => `
			<div class="detail-info-section">
			<div class="detail-info-section-title">${escapeHtml(section.title || "")}</div>
			<div class="detail-info-list">
			${section.rows.map(row => `
			<div class="detail-info-row">
			<div class="detail-info-label">${escapeHtml(row.label || "")}</div>
			<div class="detail-info-value">${escapeHtml(row.value || "")}</div>
			</div>
			`).join("")}
			</div>
			</div>
			`).join("")}
		</div>
		`;
	};

	if (sections.length) {
		const visibleSections = sections.map(section => {
			const rows = Array.isArray(section.rows)
			? section.rows.filter(row => String(row?.value || "").trim() !== "")
			: [];
			return rows.length ? { ...section, rows } : null;
		}).filter(Boolean);
		const basicIndex = visibleSections.findIndex(section => String(section.title || "").trim() === "기본 정보");
		const topIndex = basicIndex >= 0 ? basicIndex : 0;
		const topSections = visibleSections.length && topIndex >= 0 ? [visibleSections[topIndex]] : [];
		const bottomSections = visibleSections.filter((section, index) => index !== topIndex);
		topList.innerHTML = renderSectionsHtml(topSections);
		if (bottomList) bottomList.innerHTML = renderSectionsHtml(bottomSections);
		return;
	}

	const rows = Array.isArray(info.infoRows)
	? info.infoRows.filter(row => String(row?.value || "").trim() !== "")
	: [];

	if (!rows.length) {
		topList.innerHTML = "";
		if (bottomList) bottomList.innerHTML = "";
		return;
	}

	topList.innerHTML = `
	<div class="detail-info-sections">
	<div class="detail-info-section">
	<div class="detail-info-list">
	${rows.map(row => `
	<div class="detail-info-row">
	<div class="detail-info-label">${escapeHtml(row.label || "")}</div>
	<div class="detail-info-value">${escapeHtml(row.value || "")}</div>
	</div>
	`).join("")}
	</div>
	</div>
	</div>
	`;
	if (bottomList) bottomList.innerHTML = "";
}

let detailLocationMapInstance = null;
let detailLocationMarker = null;
let detailLocationRectangle = null;

function normalizeDetailLocationBounds(detailItem)
{
	const payloadAddress = detailItem?.payload?.address && typeof detailItem.payload.address === "object" ? detailItem.payload.address : {};
	const raw = detailItem?.locationBounds || detailItem?.location_bounds || payloadAddress.locationBounds || payloadAddress.location_bounds || null;
	if (!raw || typeof raw !== "object") return null;
	const swLat = Number(raw.swLat ?? raw.sw_lat);
	const swLng = Number(raw.swLng ?? raw.sw_lng);
	const neLat = Number(raw.neLat ?? raw.ne_lat);
	const neLng = Number(raw.neLng ?? raw.ne_lng);
	if (![swLat, swLng, neLat, neLng].every(Number.isFinite)) return null;
	return { swLat, swLng, neLat, neLng };
}

function getDetailLocationDisplayType(detailItem)
{
	const payloadAddress = detailItem?.payload?.address && typeof detailItem.payload.address === "object" ? detailItem.payload.address : {};
	return String(detailItem?.locationDisplayType || detailItem?.location_display_type || payloadAddress.locationDisplayType || "marker").trim() || "marker";
}

function createDetailFallbackBounds(lat, lng)
{
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

function clearDetailLocationMap()
{
	detailLocationMarker?.setMap(null);
	detailLocationRectangle?.setMap(null);
}

function renderDetailLocationMap(detailItem)
{
	if (!detailLocationCard || !detailLocationMapEl) return;
	const mode = getDetailLocationDisplayType(detailItem);
	const lat = Number(detailItem?.lat);
	const lng = Number(detailItem?.lng);
	if (mode === "hidden" || !Number.isFinite(lat) || !Number.isFinite(lng) || !window.kakao || !kakao.maps) {
		clearDetailLocationMap();
		detailLocationCard.style.display = "none";
		return;
	}
	detailLocationCard.style.display = "block";
	setTimeout(() => {
		const center = new kakao.maps.LatLng(lat, lng);
		if (!detailLocationMapInstance) {
			detailLocationMapInstance = new kakao.maps.Map(detailLocationMapEl, {
				center,
				level: 4
			});
		} else {
			detailLocationMapInstance.relayout();
			detailLocationMapInstance.setCenter(center);
		}
		clearDetailLocationMap();
		if (mode === "rectangle") {
			const bounds = normalizeDetailLocationBounds(detailItem) || createDetailFallbackBounds(lat, lng);
			const kakaoBounds = new kakao.maps.LatLngBounds(
				new kakao.maps.LatLng(bounds.swLat, bounds.swLng),
				new kakao.maps.LatLng(bounds.neLat, bounds.neLng)
			);
			detailLocationRectangle = new kakao.maps.Rectangle({
				map: detailLocationMapInstance,
				bounds: kakaoBounds,
				strokeWeight: 2,
				strokeColor: "#3B82F6",
				strokeOpacity: 0.95,
				fillColor: "#3B82F6",
				fillOpacity: 0.18
			});
			detailLocationMapInstance.setBounds(kakaoBounds);
			return;
		}
		detailLocationMarker = new kakao.maps.Marker({
			map: detailLocationMapInstance,
			position: center
		});
		detailLocationMapInstance.setCenter(center);
	}, 40);
}

function stripHtmlText(html)
{
	return String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getDetailSimilarItems(detailItem)
{
	const currentId = normalizeItemId(detailItem && detailItem.id);
	const currentType = String(detailItem && detailItem.type || "").trim();
	const currentDeal = String(detailItem && detailItem.dealType || "").trim();
	const currentRegion = String(detailItem && detailItem.region || "").trim();
	const source = (state.all || []).filter(item => normalizeItemId(item && item.id) !== currentId);
	const scored = source.map(item => {
		let score = 0;
		if (currentType && String(item.type || "").trim() === currentType) score += 5;
		if (currentDeal && String(item.dealType || "").trim() === currentDeal) score += 4;
		if (currentRegion && String(item.region || "").trim() === currentRegion) score += 2;
		if (detailItem && detailItem.agentOffice && item.agentOffice === detailItem.agentOffice) score += 1;
		return { item, score };
	});
	const preferred = scored.filter(entry => entry.score > 0).sort((a, b) => b.score - a.score);
	const fallback = scored.filter(entry => entry.score <= 0);
	return preferred.concat(fallback).slice(0, 8).map(entry => entry.item);
}

function getDetailSimilarImage(item)
{
	const images = normalizeImageArray(item);
	return images[0] || item.image || "";
}

function mergeDetailSimilarItems(baseItems, fetchedItems)
{
	const fetchedById = new Map();
	(Array.isArray(fetchedItems) ? fetchedItems : []).forEach(item => {
		const id = normalizeItemId(item && item.id);
		if (id) fetchedById.set(id, item);
	});
	return (Array.isArray(baseItems) ? baseItems : []).map(baseItem => {
		const id = normalizeItemId(baseItem && baseItem.id);
		const fetched = fetchedById.get(id);
		if (!fetched) return baseItem;
		const fetchedImages = normalizeImageArray(fetched);
		const baseImages = normalizeImageArray(baseItem);
		const merged = {
			...baseItem,
			...fetched,
			image: fetched.image || baseItem.image || "",
			images: fetchedImages.length ? fetchedImages : baseImages
		};
		const stateIndex = (state.all || []).findIndex(item => normalizeItemId(item && item.id) === id);
		if (stateIndex >= 0) state.all[stateIndex] = { ...state.all[stateIndex], ...merged };
		return merged;
	});
}

async function hydrateDetailSimilarItems(items)
{
	const ids = (items || []).map(item => normalizeItemId(item && item.id)).filter(Boolean);
	if (!ids.length) return items || [];
	try {
		const fetchedItems = await fetchLeftListRowsByIds(ids);
		return mergeDetailSimilarItems(items, fetchedItems);
	} catch (error) {
		console.warn("비슷한 조건 매물 사진 보강 실패:", error);
		return items || [];
	}
}

async function renderDetailSimilarListings(detailItem)
{
	if (!detailSimilarCard || !detailSimilarGrid) return;
	const renderSeq = ++detailSimilarRenderSeq;
	if (document.body.classList.contains("my-suite-page-open") || document.body.classList.contains("broker-home-page-open") || document.body.classList.contains("admin-page-open")) {
		detailSimilarCard.style.display = "none";
		detailSimilarGrid.innerHTML = "";
		return;
	}
	const items = await hydrateDetailSimilarItems(getDetailSimilarItems(detailItem));
	if (renderSeq !== detailSimilarRenderSeq || normalizeItemId(currentDetailItem && currentDetailItem.id) !== normalizeItemId(detailItem && detailItem.id)) return;
	if (!items.length) {
		detailSimilarCard.style.display = "none";
		detailSimilarGrid.innerHTML = "";
		return;
	}
	detailSimilarGrid.innerHTML = items.map((item) => {
		const image = getDetailSimilarImage(item);
		const type = String(item.type || "").trim() || "-";
		const areaText = stripHtmlText(formatCardAreaByUnit(item.area || "", globalAreaUnit, item.type || ""));
		const metaText = [type, areaText].filter(Boolean).join(" ");
		const priceText = `${item.dealType || ""} ${item.price || ""}`.trim() || "-";
		return `
		<button type="button" class="detail-similar-item" data-similar-id="${escapeHtml(normalizeItemId(item.id))}">
			<div class="detail-similar-thumb">${image ? `<img src="${escapeHtml(image)}" alt="">` : `<span>사진 없음</span>`}</div>
			<div class="detail-similar-meta">${escapeHtml(metaText)}</div>
			<div class="detail-similar-price">${escapeHtml(priceText)}</div>
		</button>
		`;
	}).join("");
	detailSimilarCard.style.display = "block";
}

function getHeroImages(item)
{
	const fallback = item.image ? [item.image] : [];

	if (!Array.isArray(item.images) || !item.images.length) {
		return fallback;
	}

	const cleaned = item.images
	.map(v => String(v || "").trim())
	.filter(Boolean);

	if (!cleaned.length) return fallback;

	return cleaned;
}

function renderHeroSlider(images)
{
	currentHeroImages = images;
	currentHeroIndex = 0;

	detailHeroSlides.innerHTML = images.map((src, index) => `
	<div class="detail-hero-slide ${index === 0 ? 'active' : ''}" style="background-image:url('${escapeHtml(src)}')"></div>
	`).join("");

	detailHeroDots.textContent = images.length ? `1 / ${images.length}` : "";

	detailHeroPrevBtn.style.display = images.length > 1 ? "flex" : "none";
	detailHeroNextBtn.style.display = images.length > 1 ? "flex" : "none";
	detailHeroDots.style.display = images.length ? "flex" : "none";

	detailHero.style.backgroundImage = images.length ? `url('${escapeHtml(images[0])}')` : "";
}

function setHeroSlide(index)
{
	if (!currentHeroImages.length) return;
	currentHeroIndex = (index + currentHeroImages.length) % currentHeroImages.length;

	const slides = detailHeroSlides.querySelectorAll(".detail-hero-slide");
	slides.forEach((slide, i) => {
		slide.classList.toggle("active", i === currentHeroIndex);
	});

	detailHeroDots.textContent = `${currentHeroIndex + 1} / ${currentHeroImages.length}`;
	detailHero.style.backgroundImage = `url('${escapeHtml(currentHeroImages[currentHeroIndex])}')`;
}

function nextHeroSlide()
{
	setHeroSlide(currentHeroIndex + 1);
}

function prevHeroSlide()
{
	setHeroSlide(currentHeroIndex - 1);
}

function openDetailImageLightbox()
{
	if (!currentHeroImages.length) return;
	if (detailImageLightbox && detailImageLightbox.parentElement !== document.body) document.body.appendChild(detailImageLightbox);
	detailImageLightbox.classList.add("open");
	document.body.style.overflow = "hidden";
	updateLightboxImage();
}

function closeDetailImageLightbox()
{
	detailImageLightbox.classList.remove("open");
	detailImageLightboxImg.src = "";
	document.body.style.overflow = "";
}

function updateLightboxImage()
{
	if (!currentHeroImages.length) return;

	detailImageLightboxImg.src = currentHeroImages[currentHeroIndex];
	const hasMultiple = currentHeroImages.length > 1;
	detailImageLightboxPrev.style.display = hasMultiple ? "flex" : "flex";
	detailImageLightboxNext.style.display = hasMultiple ? "flex" : "flex";
	detailImageLightboxPrev.style.visibility = hasMultiple ? "visible" : "hidden";
	detailImageLightboxNext.style.visibility = hasMultiple ? "visible" : "hidden";
	if (detailImageLightboxCount) {
		detailImageLightboxCount.textContent = `${currentHeroIndex + 1} / ${currentHeroImages.length}`;
		detailImageLightboxCount.style.display = "flex";
	}
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

async function openDetailPanel(item, options = {})
{
	const { syncUrl = true, replaceUrl = false, forceOpen = false, overlayPage = false } = options || {};
	if (syncUrl && item && item.id != null) {
		syncDetailUrl(item.id, { replace: replaceUrl });
	}
	if (!forceOpen && !allowDetailOpenFromListClick) return;
	setMapPanelsCollapsed(false);
	if (overlayPage) {
		document.body.classList.remove("shared-detail-mode");
		document.body.classList.add("detail-page-panel-open");
	} else if (shouldUseSharedDetailMode()) {
		document.body.classList.remove("detail-page-panel-open");
		setSharedDetailMode(true);
	} else {
		document.body.classList.remove("detail-page-panel-open");
		setSharedDetailMode(false);
		openSidebarList();
	}
	if (detailScroll) detailScroll.scrollTop = 0;
	const sidebarDetailPanelEl = document.getElementById("sidebarDetailPanel");
	if (sidebarDetailPanelEl) {
		sidebarDetailPanelEl.style.display = "block";
		sidebarDetailPanelEl.style.opacity = "";
		sidebarDetailPanelEl.style.pointerEvents = "";
		sidebarDetailPanelEl.style.visibility = "";
	}
	sidebar.classList.add("expanded");
	updateMapPanelToggleState();
	updateSidebarWidth();
	refreshMapLayout();

	const detailItem = await resolveDetailData(item);
	currentDetailItem = detailItem;

	const heroImages = getHeroImages(detailItem);
	renderHeroSlider(heroImages);

	const listingNoText = String(detailItem.listingNo || detailItem.id || "").replace(/매물번호\s*[:：]?\s*/g, "").trim();
	const listingNoHtml = listingNoText
		? `<span class="detail-topbar-id-label">매물번호</span><span class="detail-topbar-id-value">${escapeHtml(listingNoText)}</span>`
		: "";
	if (detailTopbarId) {
		detailTopbarId.innerHTML = listingNoHtml;
	}
	if (detailListingNo) {
		detailListingNo.innerHTML = listingNoHtml;
	}
	detailTitle.textContent = detailItem.title || "";
	detailPrice.textContent = `${detailItem.dealType || ""} ${detailItem.price || ""}`.trim();
	detailAddress.textContent = formatDisplayPropertyAddress(detailItem.address);

	if (detailHeroBadge) detailHeroBadge.style.display = "none";
	detailHeroBadge.textContent = detailItem.type || "";
	detailHeroBadge.style.display = detailItem.type ? "inline-flex" : "none";

	detailHeroDeal.textContent = detailItem.dealType || "";
	detailHeroPrice.textContent = detailItem.price || "";
	detailHeroAddress.textContent = formatDisplayPropertyAddress(detailItem.address);

	detailHeroFeatures.innerHTML = "";

	const rawDetailAreaText = String(detailItem.area || "").trim();
	const hasPairedDetailArea = /공급|계약|전용/.test(rawDetailAreaText) && Number.isFinite(parseApartmentAreas(rawDetailAreaText).private);
	detailAreaMode = /콘도/.test(detailItem.type || "")
	? "build"
	: ((hasPairedDetailArea || isApartmentType(detailItem.type || "") || /원룸|투룸/.test(detailItem.type || "") || isHotelPensionType(detailItem.type || "")) ? "private" : "total");
	detailAreaValue.dataset.areaRaw = detailItem.area || "-";
	detailAreaValue.dataset.areaUnit = globalAreaUnit;
	detailAreaValue.dataset.areaType = detailItem.type || "";
	if (detailAreaToggleBtn) {
		detailAreaToggleBtn.style.display = (hasPairedDetailArea || isApartmentType(detailItem.type || "") || /오피스텔|원룸|투룸/.test(detailItem.type || "") || isHotelPensionType(detailItem.type || "")) ? "inline-flex" : "none";
	}
	syncDetailAreaDisplay(detailItem);
	detailTypeValue.textContent = getDisplayTypeLabel(detailItem.type);
	detailRegionValue.textContent = detailItem.region || "-";

	const detailSummaryTypeBadge = document.getElementById("detailSummaryTypeBadge");
	const detailSummaryDealBadge = document.getElementById("detailSummaryDealBadge");
	const detailSummaryPrice = document.getElementById("detailSummaryPrice");
	const detailSummaryUnitPrice = document.getElementById("detailSummaryUnitPrice");
	const detailSummaryAddress = document.getElementById("detailSummaryAddress");

	if (detailSummaryTypeBadge) {
		const summaryTypeText = getSummaryTypeBadgeLabel(detailItem.type);
		detailSummaryTypeBadge.textContent = summaryTypeText;
		detailSummaryTypeBadge.setAttribute("data-type", summaryTypeText);
		applyTypeBadgeTheme(detailSummaryTypeBadge, summaryTypeText);
		detailSummaryTypeBadge.style.display = detailItem.type ? "inline-flex" : "none";
	}
	if (detailSummaryDealBadge) {
		detailSummaryDealBadge.textContent = detailItem.dealType || "";
		detailSummaryDealBadge.style.display = detailItem.dealType ? "inline-flex" : "none";
	}
	if (detailSummaryPrice) {
		detailSummaryPrice.textContent = `${detailItem.dealType || ""} ${detailItem.price || ""}`.trim();
	}
	renderDetailSummaryMeta(detailItem);
	refreshDetailEngagementCounts(detailItem);
	const detailDescText = detailItem.desc || "";
	detailDesc.innerHTML = formatDetailDescriptionHtml(detailDescText);
	if (detailDescCard) detailDescCard.style.display = detailDescText ? "block" : "none";
	if (detailDescTitle) detailDescTitle.style.display = detailDescText ? "block" : "none";
	if (detailDesc) detailDesc.style.display = detailDescText ? "block" : "none";
	if (detailInfoListTop) detailInfoListTop.innerHTML = "";
	detailInfoList.innerHTML = "";

	renderDetailInfoRows(detailItem);
	renderDetailLocationMap(detailItem);
	if (detailScroll) detailScroll.scrollTop = 0;

	if (detailItem.agentName || detailItem.agentOffice || detailItem.phone1 || detailItem.phone2 || detailItem.agentImage) {
		const isBrokerAgent = !!(detailItem.agentOffice || detailItem.agentAddress || detailItem.agentRegNo);
		detailAgentName.textContent = detailItem.agentName || "";
		detailAgentTitle.textContent = getDisplayAgentTitle(detailItem.agentTitle, detailItem);
		detailAgentOffice.textContent = detailItem.agentOffice || "";
		detailAgentAddress.textContent = detailItem.agentAddress || "";
		detailAgentRegNo.textContent = detailItem.agentRegNo ? `등록번호 ${detailItem.agentRegNo}` : "";

		const phoneText = formatDisplayPhones(detailItem.phone1, detailItem.phone2);
		detailAgentPhoneInline.textContent = phoneText || "";
		if (phoneText) detailAgentPhoneInline.textContent = phoneText;

		if (detailItem.agentImage) {
			detailAgentAvatar.innerHTML = `<img src="${escapeHtml(detailItem.agentImage)}" alt="agent">`;
			const detailAgentAvatarImg = detailAgentAvatar.querySelector("img");
			if (detailAgentAvatarImg) {
				detailAgentAvatarImg.onerror = function () {
					this.onerror = null;
					if (this.src !== REALJEJU_AGENT_FALLBACK_IMAGE) {
						this.src = REALJEJU_AGENT_FALLBACK_IMAGE;
						return;
					}
					detailAgentAvatar.textContent = makeAgentInitial(detailItem.agentName || "담당");
				};
			}
		} else {
			detailAgentAvatar.textContent = makeAgentInitial(detailItem.agentName || "담당");
		}
	} else {
		detailAgentName.textContent = "중개사 정보 확인 중";
		detailAgentTitle.textContent = "";
		detailAgentOffice.textContent = "등록된 공인중개사 정보가 없습니다.";
		detailAgentAddress.textContent = "";
		detailAgentRegNo.textContent = "";
		detailAgentPhoneInline.textContent = "";
		detailAgentAvatar.textContent = "담당";
	}


	detailHeroFeatures.innerHTML = "";
	detailFeatures.innerHTML = "";

	if (detailSummaryTop) {
		let inlineRoadviewBtn = document.getElementById("detailInlineRoadviewBtn");
		if (!inlineRoadviewBtn) {
			inlineRoadviewBtn = document.createElement("button");
			inlineRoadviewBtn.type = "button";
			inlineRoadviewBtn.id = "detailInlineRoadviewBtn";
			inlineRoadviewBtn.className = "detail-inline-roadview-btn";
			inlineRoadviewBtn.innerHTML = '<i class="fa-solid fa-street-view"></i>로드뷰';
			detailSummaryTop.appendChild(inlineRoadviewBtn);
		}
		inlineRoadviewBtn.style.display = detailItem.lat && detailItem.lng ? "inline-flex" : "none";
		inlineRoadviewBtn.onclick = () => {
			showRoadview(detailItem.lat, detailItem.lng);
		};
	}

	detailPhone.textContent = "";
	const detailCallNumber = [detailItem.phone1, detailItem.phone2].filter(Boolean)[0] || "";
	detailCallBtn.disabled = !detailCallNumber;
	detailCallBtn.style.opacity = detailCallNumber ? "1" : "0.55";
	detailCallBtn.style.cursor = detailCallNumber ? "pointer" : "default";
	detailCallBtn.onclick = () => {
		if (!detailCallNumber) return;
		location.href = `tel:${detailCallNumber}`;
	};

	detailMapBtn.style.display = "none";
	const detailKakaoUrl = [
		detailItem.linkKakaotalk,
		detailItem.kakao_url,
		detailItem.kakaoUrl,
		detailItem.kakao,
		detailItem.kakao_open_chat,
		detailItem.kakao_open_chat_url,
		detailItem.open_chat_url,
		detailItem.payload && detailItem.payload.linkKakaotalk,
		detailItem.payload && detailItem.payload.kakao_url,
		detailItem.payload && detailItem.payload.kakaotalk_url,
		detailItem.payload && detailItem.payload.registrant && detailItem.payload.registrant.kakao_url
	].map(value => String(value || "").trim()).find(Boolean) || "";
	detailRoadviewBtn.setAttribute("aria-label", "카톡상담");
	detailRoadviewBtn.title = detailKakaoUrl ? "카카오 오픈채팅으로 상담하기" : "";
	detailRoadviewBtn.style.setProperty("display", detailKakaoUrl ? "inline-flex" : "none");
	detailRoadviewBtn.disabled = !detailKakaoUrl;

	detailMapBtn.onclick = () => {
		if (!detailItem.linkCrossroad) return;
		window.open(detailItem.linkCrossroad, "_blank");
	};

	detailRoadviewBtn.onclick = () => {
		if (!detailKakaoUrl) return;
		window.open(detailKakaoUrl, "_blank");
	};

	renderDetailSimilarListings(detailItem);
}

function hardCloseDetailPanel()
{
	startDetailDropdownSuppress();
	document.body.classList.remove("detail-page-panel-open", "map-panels-collapsed");
	const panel = document.getElementById('sidebarDetailPanel');
	if (panel) {
		panel.style.display = 'none';
		panel.style.opacity = '0';
		panel.style.pointerEvents = 'none';
		panel.style.visibility = 'hidden';
	}
	sidebar.classList.remove("expanded");
	updateMapPanelToggleState();
}


function closeDetailPanel()
{
	startDetailDropdownSuppress();
	document.body.classList.remove("detail-page-panel-open", "map-panels-collapsed");
	const panel = document.getElementById('sidebarDetailPanel');
	if (panel) {
		panel.style.display = 'none';
		panel.style.opacity = '0';
		panel.style.pointerEvents = 'none';
		panel.style.visibility = 'hidden';
	}

	sidebar.classList.remove("expanded");
	updateMapPanelToggleState();
	currentDetailItem = null;
	clearDetailUrl({ replace: true });
	setSharedDetailMode(false);
}

async function handleClusterBadgeInteraction(cluster)
{
	isClusterClicking = true;
	allowDetailOpenFromListClick = false;
	hardCloseDetailPanel();

	if (!cluster || !state.map) {
		await handleClusterSelection(cluster);
		setTimeout(() => {
			isClusterClicking = false;
		}, 120);
		return;
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

async function handleClusterSelection(cluster)
{
	await hideRoadview();
	hardCloseDetailPanel();
	currentDetailItem = null;
	state.selectedMarkerId = null;
	state.selectedMarkerIds = new Set();
	state.selectedClusterKey = null;
	state.selectionMode = null;

	const clusterItems = (cluster && cluster.getMarkers ? cluster.getMarkers() : [])
	.map(marker => marker.__property)
	.filter(Boolean);
	if (!clusterItems.length) return;

	const sortedClusterItems = sortItems(clusterItems);
	lockListToItems(sortedClusterItems);

	setTimeout(() => {
		hardCloseDetailPanel();
		openSidebarList();
		resetLeftListPagination(sortedClusterItems);
		renderLeftListInitialLoading();
		loadMoreLeftListItems({ sourceItems: sortedClusterItems });

		if (sortedClusterItems.length === 1) {
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
			boxShadow: "0 5px 14px rgba(0,0,0,0.13)",
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
			boxShadow: "0 5px 14px rgba(0,0,0,0.13)",
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
			boxShadow: "0 5px 14px rgba(0,0,0,0.13)",
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
			boxShadow: "0 5px 14px rgba(0,0,0,0.13)",
			textAlign: "center",
			fontWeight: "900",
			fontSize: "20px",
			lineHeight: "54px"
		}
		]
	});

	// cluster 기본 클릭 동작 비활성화: 숫자 뱃지는 custom DOM click만 사용

	kakao.maps.event.addListener(state.map, "dragstart", () => {
		state.initialRandomListActive = false;
	});

	kakao.maps.event.addListener(state.map, "zoom_changed", () => {
		state.initialRandomListActive = false;
	});

	kakao.maps.event.addListener(state.map, "click", async function () {
		state.initialRandomListActive = false;
		await hideRoadview();

		state.selectedClusterKey = null;
		state.selectedMarkerId = null;
		state.selectionMode = null;

		closeDetailPanel();
		closeSidebarList();
		highlightCard(-1);
		updateMarkerSelection(null);

		clearListLock();
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
	const detailPanelMode = document.body.classList.contains("detail-page-panel-open");

	roadviewClient.getNearestPanoId(position, 100, function (panoId) {
		if (!panoId) {
			alert("이 위치 주변에는 로드뷰가 없습니다.");
			return;
		}

		if (detailPanelMode) {
			roadviewOverlay.classList.add("detail-panel-roadview");
			if (roadviewOverlay.parentElement !== document.body) document.body.appendChild(roadviewOverlay);
		} else {
			roadviewOverlay.classList.remove("detail-panel-roadview");
			if (mapWrap && roadviewOverlay.parentElement !== mapWrap) mapWrap.appendChild(roadviewOverlay);
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

function highlightCard(id)
{
	document.querySelectorAll(".card").forEach(card => {
		card.classList.toggle("active", normalizeItemId(card.dataset.id) === normalizeItemId(id));
	});
}



function renderMarkers(data, options = {})
{
	clearMapObjects();

	const preserveViewport = !!options.preserveViewport;
	const markerItems = preserveViewport ? getViewportFilteredItems(data) : (data || []);
	if (!markerItems.length) return;

	const bounds = new kakao.maps.LatLngBounds();
	const markerList = [];

	markerItems.forEach(item => {
		const position = new kakao.maps.LatLng(item.lat, item.lng);

		const marker = new kakao.maps.Marker({
			position,
			image: createMarkerImage(item, normalizeItemId(state.selectedMarkerId) === normalizeItemId(item.id), "1"),
			clickable: true
		});

		marker.__property = item;

		kakao.maps.event.addListener(marker, "click", async function () {
			await hideRoadview();
			allowDetailOpenFromListClick = false;
			currentDetailItem = null;
			hardCloseDetailPanel();

			state.selectedClusterKey = null;
			state.selectedMarkerId = null;
			state.selectedMarkerIds = new Set();
			state.selectionMode = null;
			lockListToItems([item]);

			highlightCard(item.id);
			updateMarkerSelection(item.id, [item.id]);

			setTimeout(() => {
				hardCloseDetailPanel();
				openSidebarList();
				resetLeftListPagination([item]);
				renderLeftListInitialLoading();
				loadMoreLeftListItems({ sourceItems: [item] });
				setResultInfo("선택 매물 1건");
				setListInfo("총 1개 매물");
				refreshClusterBadges();
			}, 0);
		});

		markerList.push(marker);
		state.markers.push(marker);
		bounds.extend(position);
	});

	state.clusterer.addMarkers(markerList);

	setTimeout(() => {
		refreshClusterBadges();
	}, 0);

	return;
}

async function openDetailFromUrl({ replaceHistory = true } = {})
{
	const rawSearch = String(window.location.search || "");
	const hasExplicitDetailQuery = /(?:^\?|&)id=/.test(rawSearch);
	const params = new URLSearchParams(rawSearch);
	const targetId = hasExplicitDetailQuery ? normalizeItemId(params.get(DETAIL_QUERY_KEY)) : "";

	if (!hasExplicitDetailQuery || !targetId) {
		setSharedDetailMode(false);
		return false;
	}

	setSharedDetailMode(false);

	let item = (state.all || []).find(v => normalizeItemId(v.id) === targetId);
	if (!item) {
		const seedItem = { id: targetId };
		const dbItem = await resolveDetailDataFromDatabase(seedItem);
		if (dbItem && dbItem !== seedItem && normalizeItemId(dbItem.id) === targetId) {
			item = dbItem;
		}
	}
	if (!item) {
		setSharedDetailMode(false);
		return false;
	}

	await hideRoadview();
	state.selectionMode = "single";
	state.selectedClusterKey = null;
	state.selectedMarkerId = targetId;
	clearListLock();
	highlightCard(targetId);
	updateMarkerSelection(targetId, [targetId]);

	if (detailScroll) detailScroll.scrollTop = 0;
	const previousAllow = allowDetailOpenFromListClick;
	allowDetailOpenFromListClick = true;
	try {
		await openDetailPanel(item, { syncUrl: false });
	} finally {
		allowDetailOpenFromListClick = previousAllow;
	}

	if (replaceHistory) {
		syncDetailUrl(item.id, { replace: true });
	}

	if (detailScroll) detailScroll.scrollTop = 0;
	await focusProperty(item.id);

	setTimeout(() => {
		highlightCard(targetId);
		refreshClusterBadges();
	}, 0);

	return true;
}

async function focusProperty(id)
{
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

async function moveMapToProperty(item)
{
	if (!item || !state.map || !window.kakao || !kakao.maps) return;
	const lat = Number(item.lat);
	const lng = Number(item.lng);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

	await hideRoadview();
	const position = new kakao.maps.LatLng(lat, lng);
	state.map.panTo(position);
}

const REALJEJU_FAVORITE_LISTINGS_KEY = "realjeju_favorite_listing_ids";
const REALJEJU_FAVORITE_TRASH_KEY = "realjeju_favorite_listing_trash_ids";
const REALJEJU_FAVORITE_REFRESHED_AT_KEY = "realjeju_favorite_listing_refreshed_at";
const REALJEJU_FAVORITE_SNAPSHOT_KEY = "realjeju_favorite_listing_snapshots";
const REALJEJU_FAVORITE_TABLE = "favorite_listings";
let mySuiteFavoriteView = "active";
let mySuiteFavoriteAreaUnit = "m2";
let mySuiteFavoritePropertyFilter = new Set();
let mySuiteFavoriteDealFilter = new Set();
const MY_SUITE_FAVORITES_PER_PAGE = 30;
let mySuiteFavoritePage = 1;
let realjejuFavoriteUserId = "";
let realjejuFavoriteListingIds = new Set();
let realjejuFavoriteTrashIds = new Set();
let realjejuFavoriteRefreshedAt = {};
let realjejuFavoriteLoadPromise = null;
let realjejuFavoriteLoaded = false;
const realjejuFavoriteThumbHydratedIds = new Set();
const realjejuFavoriteThumbHydratingIds = new Set();

function getListingPaginationItems(totalPages, currentPage)
{
	const pages = [];
	if (totalPages <= 9) {
		for (let i = 1; i <= totalPages; i += 1) pages.push(i);
		return pages;
	}
	pages.push(1);
	const start = Math.max(2, currentPage - 2);
	const end = Math.min(totalPages - 1, currentPage + 2);
	if (start > 2) pages.push("ellipsis");
	for (let i = start; i <= end; i += 1) pages.push(i);
	if (end < totalPages - 1) pages.push("ellipsis");
	pages.push(totalPages);
	return pages;
}

function setMySuiteFavoriteListingPage(value)
{
	const next = Math.floor(Number(value));
	if (!Number.isFinite(next) || next < 1) {
		mySuiteFavoritePage = 1;
		return;
	}
	mySuiteFavoritePage = next;
}

function getMySuiteFavoriteListingPage(totalPages)
{
	const maxPage = Math.max(1, Number(totalPages) || 1);
	if (!Number.isFinite(mySuiteFavoritePage) || mySuiteFavoritePage < 1) mySuiteFavoritePage = 1;
	if (mySuiteFavoritePage > maxPage) mySuiteFavoritePage = maxPage;
	return mySuiteFavoritePage;
}

function renderMySuiteFavoriteListingPagination(totalCount, totalPages, currentPage)
{
	if (totalCount <= MY_SUITE_FAVORITES_PER_PAGE || totalPages <= 1) return "";
	const items = getListingPaginationItems(totalPages, currentPage);
	return `
		<nav class="broker-listing-pagination" aria-label="관심매물 페이지">
			${items.map((item) => {
				if (item === "ellipsis") return '<span class="broker-listing-page-ellipsis">…</span>';
				const page = Number(item);
				return `<button type="button" class="broker-listing-page-btn ${page === currentPage ? "active" : ""}" data-favorite-listing-page="${page}" aria-current="${page === currentPage ? "page" : "false"}">${page}</button>`;
			}).join("")}
		</nav>
	`;
}

function scrollMySuiteFavoritesToTop()
{
	const panel = document.getElementById("mySuitePanel");
	if (panel) panel.scrollTop = 0;
	const anchor = document.querySelector("#mySuiteContent .my-suite-favorites-filterbar");
	if (anchor && typeof anchor.scrollIntoView === "function") {
		anchor.scrollIntoView({ block: "start", inline: "nearest" });
	}
}

function clearLegacyFavoriteLocalStorage()
{
	try {
		localStorage.removeItem(REALJEJU_FAVORITE_LISTINGS_KEY);
		localStorage.removeItem(REALJEJU_FAVORITE_TRASH_KEY);
		localStorage.removeItem(REALJEJU_FAVORITE_REFRESHED_AT_KEY);
		localStorage.removeItem(REALJEJU_FAVORITE_SNAPSHOT_KEY);
	} catch (err) {}
}

function getCurrentFavoriteUserId()
{
	const user = getFavoriteCachedAuthUser();
	return normalizeItemId(user && user.id);
}

function getFavoriteCachedAuthUser()
{
	const windowUser = window.realjejuCurrentAuthUser || null;
	try {
		return windowUser || currentRealjejuAuthUser || null;
	} catch (err) {
		return windowUser;
	}
}

function getRealjejuSessionUserId(user)
{
	return String(user && user.id ? user.id : "").trim();
}

function getRealjejuActiveSessionUser()
{
	const windowUser = window.realjejuCurrentAuthUser || null;
	try {
		return windowUser || currentRealjejuAuthUser || null;
	} catch (err) {
		return windowUser;
	}
}

function isRealjejuActiveSessionUser(user)
{
	const userId = getRealjejuSessionUserId(user);
	const activeId = getRealjejuSessionUserId(getRealjejuActiveSessionUser());
	return !!userId && activeId === userId;
}

function setRealjejuActiveSession(user, profile = null, options = {})
{
	const previousId = getRealjejuSessionUserId(getRealjejuActiveSessionUser());
	const nextId = getRealjejuSessionUserId(user);
	const accountChanged = !!(previousId && nextId && previousId !== nextId);
	if (accountChanged || options.forceReset === true) {
		window.realjejuCurrentProfile = null;
		window.realjejuCurrentBrokerOffice = null;
		window.realjejuCurrentIsAdmin = false;
		if (typeof clearRealjejuSessionCaches === "function") clearRealjejuSessionCaches();
		if (typeof clearFavoriteListingState === "function") clearFavoriteListingState();
		if (typeof window.realjejuResetRegistrantInfo === "function") window.realjejuResetRegistrantInfo();
	}
	window.realjejuCurrentAuthUser = user || null;
	try {
		currentRealjejuAuthUser = user || null;
	} catch (err) {}
	window.realjejuCurrentProfile = profile || null;
	window.realjejuCurrentBrokerOffice = null;
	window.realjejuCurrentIsAdmin = typeof isAdminUser === "function" ? isAdminUser(user, profile || null) : false;
	try {
		currentRealjejuProfileCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
	} catch (err) {}
}

function setFavoriteCachedAuthUser(user)
{
	const previousId = normalizeItemId(window.realjejuCurrentAuthUser && window.realjejuCurrentAuthUser.id);
	const nextId = normalizeItemId(user && user.id);
	if (typeof setRealjejuActiveSession === "function") {
		setRealjejuActiveSession(user || null, previousId && nextId && previousId === nextId ? (window.realjejuCurrentProfile || null) : null);
		return;
	}
	window.realjejuCurrentAuthUser = user || null;
	try {
		currentRealjejuAuthUser = user || null;
	} catch (err) {}
}

function clearFavoriteListingState()
{
	realjejuFavoriteUserId = "";
	realjejuFavoriteListingIds = new Set();
	realjejuFavoriteTrashIds = new Set();
	realjejuFavoriteRefreshedAt = {};
	realjejuFavoriteLoadPromise = null;
	realjejuFavoriteLoaded = false;
	realjejuFavoriteThumbHydratedIds.clear();
	realjejuFavoriteThumbHydratingIds.clear();
	syncFavoriteHeartButtons();
}

function syncFavoriteStateUserBoundary()
{
	const userId = getCurrentFavoriteUserId();
	if (realjejuFavoriteUserId && userId && realjejuFavoriteUserId !== userId) {
		clearFavoriteListingState();
	}
	if (!userId && realjejuFavoriteUserId) {
		clearFavoriteListingState();
	}
	return userId;
}

function getFavoriteListingSet()
{
	syncFavoriteStateUserBoundary();
	return new Set(realjejuFavoriteListingIds);
}

function saveFavoriteListingSet(set)
{
	realjejuFavoriteListingIds = new Set([...set].map((id) => normalizeItemId(id)).filter(Boolean));
}

function getFavoriteTrashSet()
{
	syncFavoriteStateUserBoundary();
	return new Set(realjejuFavoriteTrashIds);
}

function saveFavoriteTrashSet(set)
{
	realjejuFavoriteTrashIds = new Set([...set].map((id) => normalizeItemId(id)).filter(Boolean));
}

function getFavoriteSnapshotMap()
{
	return {};
}

function saveFavoriteSnapshotMap(map)
{
	return map;
}

function makeFavoriteListingSnapshot(item)
{
	if (!item || typeof item !== "object") return null;
	const listingId = normalizeItemId(item.id);
	if (!listingId) return null;
	return {
		id: listingId,
		listingNo: item.listingNo || "",
		title: item.title || "",
		dealType: item.dealType || "",
		type: item.type || item.typeFilter || "",
		typeFilter: item.typeFilter || item.type || "",
		price: item.price || "",
		area: item.area || "",
		address: item.address || "",
		image: item.image || "",
		date: item.date || "",
		dateLabel: item.dateLabel || "",
		maintenance: item.maintenance || {}
	};
}

function saveFavoriteListingSnapshot(item)
{
	const snapshot = makeFavoriteListingSnapshot(item);
	if (!snapshot) return false;
	return true;
}

function getFavoriteRefreshedAtMap()
{
	syncFavoriteStateUserBoundary();
	return { ...realjejuFavoriteRefreshedAt };
}

function saveFavoriteRefreshedAtMap(map)
{
	realjejuFavoriteRefreshedAt = map && typeof map === "object" && !Array.isArray(map) ? { ...map } : {};
}

async function getFavoriteSupabaseUser()
{
	const cachedUser = getFavoriteCachedAuthUser();
	if (cachedUser && cachedUser.id) return cachedUser;
	const client = getRealjejuSupabaseClient();
	if (!client) return null;
	try {
		const { data, error } = await client.auth.getUser();
		if (error) return null;
		const user = data && data.user ? data.user : null;
		if (user && user.id) {
			setFavoriteCachedAuthUser(user);
		}
		return user;
	} catch (err) {
		return null;
	}
}

function refreshFavoriteViewsAfterStateChange()
{
	syncFavoriteHeartButtons();
	const activeMySuiteTab = document.querySelector('.my-suite-tab.active[data-my-suite-tab="favorites"]');
	if (document.body.classList.contains("my-suite-page-open") && activeMySuiteTab) {
		renderRealjejuMySuiteFavoritesContent();
	}
}

function renderRealjejuMySuiteFavoritesContent()
{
	const renderer = window.realjejuRenderMySuiteFavoritesContent;
	if (typeof renderer === "function") {
		renderer();
		return true;
	}
	if (typeof renderMySuiteFavoritesContent === "function") {
		renderMySuiteFavoritesContent();
		return true;
	}
	return false;
}

function closeManagedListingMenus()
{
	if (typeof closeFavoriteListingMenus === "function") closeFavoriteListingMenus();
	if (typeof closeBrokerListingMenus === "function") closeBrokerListingMenus();
	document.querySelectorAll([
		"[data-admin-listing-menu-panel].open",
		"[data-admin-user-menu-panel].open",
		".broker-listing-more-menu.open",
		".broker-home-filter-menu.open",
		".global-account-dropdown.open",
		".extra-filter-dropdown.open",
		"[data-register-dropdown].open"
	].join(", ")).forEach((menu) => {
		menu.classList.remove("open", "account-open");
		const trigger = menu.querySelector("[aria-expanded='true']");
		if (trigger) trigger.setAttribute("aria-expanded", "false");
	});
	const accountDropdown = document.getElementById("globalAccountDropdown");
	if (accountDropdown) {
		accountDropdown.classList.remove("open");
		accountDropdown.setAttribute("aria-hidden", "true");
		accountDropdown.style.display = "none";
	}
	document.querySelectorAll(".global-auth-trigger.account-open, #detailAuthTrigger.account-open").forEach((trigger) => {
		trigger.classList.remove("account-open");
	});
}

let detailDropdownSuppressTimer = null;

function startDetailDropdownSuppress()
{
	closeManagedListingMenus();
	document.body.classList.add("detail-dropdown-suppress");
	clearTimeout(detailDropdownSuppressTimer);
	detailDropdownSuppressTimer = setTimeout(() => {
		document.body.classList.remove("detail-dropdown-suppress");
		closeManagedListingMenus();
	}, 600);
}

function isDropdownBlockedByDetailPanel()
{
	return document.body.classList.contains("detail-page-panel-open") || document.body.classList.contains("detail-dropdown-suppress");
}

function isBlockedDropdownTargetWhileDetailOpen(target)
{
	if (!isDropdownBlockedByDetailPanel()) return false;
	if (!target || typeof target.closest !== "function") return false;
	if (target.closest("#sidebarDetailPanel, .detail-image-lightbox, .detail-share-menu")) return false;
	return !!target.closest([
		".global-topbar-right",
		".global-account-dropdown",
		"[data-favorite-menu]",
		"[data-favorite-filter-menu]",
		"[data-broker-home-filter-menu]",
		"[data-broker-listing-menu]",
		"[data-admin-listing-menu]",
		"[data-admin-user-menu]",
		".broker-listing-more-menu",
		".broker-home-filter-menu",
		".extra-filter-dropdown",
		"[data-register-dropdown]",
		"[data-register-dropdown-trigger]"
	].join(", "));
}

function blockDropdownWhileDetailOpen(event)
{
	if (!isBlockedDropdownTargetWhileDetailOpen(event.target)) return;
	closeManagedListingMenus();
	if (event.type === "click" || event.type === "pointerdown" || event.type === "mousedown") {
		event.preventDefault();
	}
	event.stopImmediatePropagation();
}

["pointerover", "mouseover", "pointerdown", "mousedown", "click"].forEach((eventName) => {
	document.addEventListener(eventName, blockDropdownWhileDetailOpen, true);
});

document.addEventListener("pointerover", function(event) {
	if (!document.body.classList.contains("detail-page-panel-open")) return;
	if (!event.target.closest(".global-topbar-right, [data-favorite-menu], [data-broker-listing-menu], [data-admin-listing-menu], [data-admin-user-menu]")) return;
	closeManagedListingMenus();
	event.stopPropagation();
}, true);

async function openManagedListingDetailPanel(listingId, sourceItem = null)
{
	const id = normalizeItemId(listingId);
	if (!id) return false;
	closeManagedListingMenus();
	const item = sourceItem && typeof sourceItem === "object" ? { ...sourceItem, id } : { id };
	await openDetailPanel(item, { syncUrl: true, forceOpen: true, overlayPage: true });
	return true;
}

async function loadFavoriteListingStateFromServer(options = {})
{
	const force = options && options.force === true;
	if (realjejuFavoriteLoadPromise && !force) return realjejuFavoriteLoadPromise;

	realjejuFavoriteLoadPromise = (async () => {
		clearLegacyFavoriteLocalStorage();
		const client = getRealjejuSupabaseClient();
		const user = await getFavoriteSupabaseUser();
		const userId = normalizeItemId(user && user.id);
		if (!client || !userId) {
			clearFavoriteListingState();
			return false;
		}
		if (!force && realjejuFavoriteLoaded && realjejuFavoriteUserId === userId) {
			return true;
		}
		await purgeExpiredFavoriteTrashRows(client, userId);
		const { data, error } = await client
			.from(REALJEJU_FAVORITE_TABLE)
			.select("listing_id, status, refreshed_at")
			.eq("user_id", userId)
			.in("status", ["active", "trash"]);
		if (error) throw error;

		realjejuFavoriteUserId = userId;
		realjejuFavoriteListingIds = new Set();
		realjejuFavoriteTrashIds = new Set();
		realjejuFavoriteRefreshedAt = {};

		(Array.isArray(data) ? data : []).forEach((row) => {
			const listingId = normalizeItemId(row && row.listing_id);
			if (!listingId) return;
			if (row.status === "trash") realjejuFavoriteTrashIds.add(listingId);
			else realjejuFavoriteListingIds.add(listingId);
			if (row.refreshed_at) realjejuFavoriteRefreshedAt[listingId] = row.refreshed_at;
		});
		realjejuFavoriteLoaded = true;
		refreshFavoriteViewsAfterStateChange();
		return true;
	})().catch((err) => {
		console.warn("관심매물 동기화 실패:", err);
		realjejuFavoriteLoaded = false;
		return false;
	}).finally(() => {
		realjejuFavoriteLoadPromise = null;
	});

	return realjejuFavoriteLoadPromise;
}

window.realjejuReloadFavoriteListings = function()
{
	return loadFavoriteListingStateFromServer({ force: true });
};

async function requireFavoriteSupabaseContext()
{
	const client = getRealjejuSupabaseClient();
	const user = await getFavoriteSupabaseUser();
	if (!client || !user || !user.id) {
		if (typeof openAuthErrorModal === "function") {
			openAuthErrorModal("로그인 후 관심매물을 이용할 수 있습니다.", "관심매물", null, typeof openAuthModal === "function" ? openAuthModal : null);
		}
		return null;
	}
	const userId = normalizeItemId(user.id);
	if (realjejuFavoriteUserId && realjejuFavoriteUserId !== userId) clearFavoriteListingState();
	if (!realjejuFavoriteUserId) realjejuFavoriteUserId = userId;
	return { client, user, userId };
}

async function refreshFavoriteListingDate(id)
{
	const listingId = normalizeItemId(id);
	if (!listingId) return false;
	const refreshedAt = getFavoriteRefreshedAtMap();
	const now = new Date().toISOString();
	refreshedAt[listingId] = now;
	saveFavoriteRefreshedAtMap(refreshedAt);
	const context = await requireFavoriteSupabaseContext();
	if (!context) return false;
	const { error } = await context.client
		.from(REALJEJU_FAVORITE_TABLE)
		.update({ refreshed_at: now, updated_at: now })
		.eq("user_id", context.userId)
		.eq("listing_id", listingId);
	if (error) {
		console.warn("관심매물 날짜 갱신 실패:", error);
		await loadFavoriteListingStateFromServer({ force: true });
		return false;
	}
	return true;
}

function getFavoriteListingDateValue(item)
{
	const listingId = normalizeItemId(item && item.id);
	const refreshedAt = listingId ? getFavoriteRefreshedAtMap()[listingId] : "";
	return refreshedAt || item?.dateLabel || item?.date;
}

function getMySuiteFavoriteAreaUnit()
{
	return mySuiteFavoriteAreaUnit === "py" ? "py" : "m2";
}

function syncMySuiteFavoriteAreaCells()
{
	const unit = getMySuiteFavoriteAreaUnit();
	document.querySelectorAll(".my-suite-favorites-list .broker-listing-area[data-favorite-area-raw]").forEach((areaEl) => {
		const raw = areaEl.dataset.favoriteAreaRaw || "-";
		const type = areaEl.dataset.favoriteAreaType || "";
		areaEl.innerHTML = formatCardAreaByUnit(raw, unit, type);
	});
}

function toggleMySuiteFavoriteAreaUnit(event)
{
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	mySuiteFavoriteAreaUnit = getMySuiteFavoriteAreaUnit() === "m2" ? "py" : "m2";
	syncMySuiteFavoriteAreaCells();
}

window.realjejuToggleMySuiteFavoriteAreaUnit = toggleMySuiteFavoriteAreaUnit;

function isFavoriteListing(id)
{
	return getFavoriteListingSet().has(normalizeItemId(id));
}

async function purgeExpiredFavoriteTrashRows(client, userId)
{
	if (!client || !userId) return false;
	try {
		const { error } = await client
			.from(REALJEJU_FAVORITE_TABLE)
			.delete()
			.eq("user_id", userId)
			.eq("status", "trash")
			.lte("updated_at", getRealjejuTrashCutoffIso());
		if (error) throw error;
		return true;
	} catch (err) {
		console.warn(`${REALJEJU_TRASH_RETENTION_DAYS}일 지난 관심매물 휴지통 정리 실패:`, err);
		return false;
	}
}

async function setFavoriteListing(id, shouldFavorite)
{
	const listingId = normalizeItemId(id);
	if (!listingId) return false;
	const context = await requireFavoriteSupabaseContext();
	if (!context) return false;
	if (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== context.userId) await loadFavoriteListingStateFromServer();
	const favorites = getFavoriteListingSet();
	const trash = getFavoriteTrashSet();
	if (shouldFavorite) favorites.add(listingId);
	else favorites.delete(listingId);
	if (shouldFavorite) trash.delete(listingId);
	saveFavoriteListingSet(favorites);
	saveFavoriteTrashSet(trash);
	refreshFavoriteViewsAfterStateChange();
	try {
		const now = new Date().toISOString();
		if (shouldFavorite) {
			const { error } = await context.client
				.from(REALJEJU_FAVORITE_TABLE)
				.upsert({
					user_id: context.userId,
					listing_id: listingId,
					status: "active",
					updated_at: now
				}, { onConflict: "user_id,listing_id" });
			if (error) throw error;
		} else {
			const { error } = await context.client
				.from(REALJEJU_FAVORITE_TABLE)
				.delete()
				.eq("user_id", context.userId)
				.eq("listing_id", listingId);
			if (error) throw error;
		}
		return favorites.has(listingId);
	} catch (err) {
		console.warn("관심매물 저장 실패:", err);
		await loadFavoriteListingStateFromServer({ force: true });
		if (typeof openAuthErrorModal === "function") openAuthErrorModal("관심매물 저장에 실패했습니다.", "관심매물", null);
		return isFavoriteListing(listingId);
	}
}

async function moveFavoriteListingToTrash(id)
{
	const listingId = normalizeItemId(id);
	if (!listingId) return false;
	const context = await requireFavoriteSupabaseContext();
	if (!context) return false;
	if (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== context.userId) await loadFavoriteListingStateFromServer();
	const favorites = getFavoriteListingSet();
	const trash = getFavoriteTrashSet();
	favorites.delete(listingId);
	trash.add(listingId);
	saveFavoriteListingSet(favorites);
	saveFavoriteTrashSet(trash);
	refreshFavoriteViewsAfterStateChange();
	try {
		const now = new Date().toISOString();
		const { error } = await context.client
			.from(REALJEJU_FAVORITE_TABLE)
			.upsert({
				user_id: context.userId,
				listing_id: listingId,
				status: "trash",
				updated_at: now
			}, { onConflict: "user_id,listing_id" });
		if (error) throw error;
		return true;
	} catch (err) {
		console.warn("관심매물 휴지통 이동 실패:", err);
		await loadFavoriteListingStateFromServer({ force: true });
		if (typeof openAuthErrorModal === "function") openAuthErrorModal("관심매물 삭제에 실패했습니다.", "관심매물", null);
		return false;
	}
}

async function restoreFavoriteListingFromTrash(id)
{
	const listingId = normalizeItemId(id);
	if (!listingId) return false;
	const context = await requireFavoriteSupabaseContext();
	if (!context) return false;
	if (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== context.userId) await loadFavoriteListingStateFromServer();
	const favorites = getFavoriteListingSet();
	const trash = getFavoriteTrashSet();
	trash.delete(listingId);
	favorites.add(listingId);
	saveFavoriteListingSet(favorites);
	saveFavoriteTrashSet(trash);
	refreshFavoriteViewsAfterStateChange();
	try {
		const now = new Date().toISOString();
		const { error } = await context.client
			.from(REALJEJU_FAVORITE_TABLE)
			.upsert({
				user_id: context.userId,
				listing_id: listingId,
				status: "active",
				updated_at: now
			}, { onConflict: "user_id,listing_id" });
		if (error) throw error;
		return true;
	} catch (err) {
		console.warn("관심매물 복원 실패:", err);
		await loadFavoriteListingStateFromServer({ force: true });
		if (typeof openAuthErrorModal === "function") openAuthErrorModal("관심매물 복원에 실패했습니다.", "관심매물", null);
		return false;
	}
}

async function permanentlyDeleteFavoriteListing(id)
{
	const listingId = normalizeItemId(id);
	if (!listingId) return false;
	const context = await requireFavoriteSupabaseContext();
	if (!context) return false;
	if (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== context.userId) await loadFavoriteListingStateFromServer();
	const favorites = getFavoriteListingSet();
	const trash = getFavoriteTrashSet();
	const refreshedAt = getFavoriteRefreshedAtMap();
	favorites.delete(listingId);
	trash.delete(listingId);
	delete refreshedAt[listingId];
	saveFavoriteListingSet(favorites);
	saveFavoriteTrashSet(trash);
	saveFavoriteRefreshedAtMap(refreshedAt);
	refreshFavoriteViewsAfterStateChange();
	try {
		const { error } = await context.client
			.from(REALJEJU_FAVORITE_TABLE)
			.delete()
			.eq("user_id", context.userId)
			.eq("listing_id", listingId);
		if (error) throw error;
		return true;
	} catch (err) {
		console.warn("관심매물 영구삭제 실패:", err);
		await loadFavoriteListingStateFromServer({ force: true });
		if (typeof openAuthErrorModal === "function") openAuthErrorModal("관심매물 영구삭제에 실패했습니다.", "관심매물", null);
		return false;
	}
}

function getFavoriteListingItems(view = "active")
{
	const targetIds = view === "trash" ? getFavoriteTrashSet() : getFavoriteListingSet();
	const allItems = Array.isArray(state && state.all) ? state.all : [];
	const snapshots = getFavoriteSnapshotMap();
	return [...targetIds].map((id) => {
		const live = allItems.find((item) => normalizeItemId(item && item.id) === id);
		return live || snapshots[id] || null;
	}).filter(Boolean);
}

function mergeFavoriteListingThumbItems(items)
{
	const rows = Array.isArray(items) ? items : [];
	if (!rows.length) return false;
	if (!Array.isArray(state.all)) state.all = [];
	let changed = false;
	rows.forEach((item) => {
		const id = normalizeItemId(item && item.id);
		if (!id) return;
		realjejuFavoriteThumbHydratedIds.add(id);
		realjejuFavoriteThumbHydratingIds.delete(id);
		const images = normalizeImageArray(item);
		if (!images.length) return;
		const index = state.all.findIndex((entry) => normalizeItemId(entry && entry.id) === id);
		if (index >= 0) {
			const currentImages = normalizeImageArray(state.all[index]);
			if (!currentImages.length) {
				state.all[index] = {
					...state.all[index],
					...item,
					image: item.image || images[0] || state.all[index].image || "",
					images
				};
				changed = true;
			}
			return;
		}
		state.all.push({
			...item,
			image: item.image || images[0] || "",
			images
		});
		changed = true;
	});
	return changed;
}

function hydrateFavoriteListingThumbs(items)
{
	const ids = (Array.isArray(items) ? items : [])
		.filter((item) => !normalizeImageArray(item).length)
		.map((item) => normalizeItemId(item && item.id))
		.filter((id) => id && !realjejuFavoriteThumbHydratedIds.has(id) && !realjejuFavoriteThumbHydratingIds.has(id));
	if (!ids.length || typeof fetchLeftListRowsByIds !== "function") return;
	ids.forEach((id) => realjejuFavoriteThumbHydratingIds.add(id));
	fetchLeftListRowsByIds(ids)
		.then((rows) => {
			ids.forEach((id) => {
				realjejuFavoriteThumbHydratedIds.add(id);
				realjejuFavoriteThumbHydratingIds.delete(id);
			});
			if (!mergeFavoriteListingThumbItems(rows)) return;
			const activeMySuiteTab = document.querySelector('.my-suite-tab.active[data-my-suite-tab="favorites"]');
			if (document.body.classList.contains("my-suite-page-open") && activeMySuiteTab) {
				renderRealjejuMySuiteFavoritesContent();
			}
		})
		.catch((error) => {
			console.warn("관심매물 썸네일 보강 실패:", error);
			ids.forEach((id) => {
				realjejuFavoriteThumbHydratedIds.add(id);
				realjejuFavoriteThumbHydratingIds.delete(id);
			});
		});
}

function getFavoriteFilterLabel(value)
{
	return String(value || "").trim() || "-";
}

function getFavoritePropertyFilterValue(item)
{
	return getFavoriteFilterLabel(getDisplayTypeLabel(item && (item.type || item.typeFilter)));
}

function getFavoriteDealFilterValue(item)
{
	return getFavoriteFilterLabel(item && item.dealType || "매매");
}

	function getUniqueFavoriteFilterOptions(items, getter)
	{
		return [...new Set((Array.isArray(items) ? items : []).map(getter).filter(Boolean))]
			.sort((a, b) => String(a).localeCompare(String(b), "ko-KR"));
	}

	function getHomeFilterOptionValues(kind)
	{
		const selector = kind === "deal" ? "#dealButtons input" : "#typeButtons input";
		const values = Array.from(document.querySelectorAll(selector))
			.map((input) => getFavoriteFilterLabel(input.dataset.value || input.value || ""))
			.filter((value) => value && value !== "-" && value !== "all" && value !== "전체");
		return [...new Set(values)];
	}

	function getFavoriteFilterOptions(kind, items, getter)
	{
		const commonValues = getHomeFilterOptionValues(kind);
		if (commonValues.length) return commonValues;
		return getUniqueFavoriteFilterOptions(items, getter);
	}

function getFilteredFavoriteListingItems(items)
{
	const list = Array.isArray(items) ? items : [];
	return list.filter((item) => {
		if (mySuiteFavoritePropertyFilter.size && !mySuiteFavoritePropertyFilter.has(getFavoritePropertyFilterValue(item))) return false;
		if (mySuiteFavoriteDealFilter.size && !mySuiteFavoriteDealFilter.has(getFavoriteDealFilterValue(item))) return false;
		return true;
	});
}

function renderFavoriteFilterMenu(type, options, selectedSet)
{
	const safeType = type === "deal" ? "deal" : "property";
	const values = Array.isArray(options) ? options : [];
	if (!values.length) {
		return `<div class="broker-home-filter-reset-row"><button type="button" class="broker-home-filter-reset-btn" data-favorite-filter-reset="${safeType}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>초기화</button></div>`;
	}
	return [
		...values.map((value) => `
			<label class="broker-home-filter-option ${selectedSet.has(value) ? "active" : ""}">
				<input type="checkbox" class="broker-home-filter-check" data-favorite-filter-option="${safeType}" data-value="${escapeHtml(value)}" ${selectedSet.has(value) ? "checked" : ""} />
				<span>${escapeHtml(value)}</span>
			</label>
		`),
		`<div class="broker-home-filter-reset-row"><button type="button" class="broker-home-filter-reset-btn" data-favorite-filter-reset="${safeType}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>초기화</button></div>`
	].join("");
}

function getLeftListSourceKey(items)
{
	return (Array.isArray(items) ? items : [])
	.map(item => normalizeItemId(item && item.id))
	.filter(Boolean)
	.join(",");
}

function resetLeftListPagination(items = [])
{
	const list = Array.isArray(items) ? items : [];
	state.leftListSourceIds = list.map(item => normalizeItemId(item && item.id)).filter(Boolean);
	state.leftListSourceKey = getLeftListSourceKey(list);
	state.leftListItems = [];
	state.leftListSeq += 1;
	state.leftListVisibleCount = LEFT_LIST_PAGE_SIZE;
	state.leftListRenderedCount = 0;
	state.leftListTotalCount = state.leftListSourceIds.length;
	setLeftListLoading(false);
}

function ensureLeftListSource(items)
{
	const list = Array.isArray(items) ? items : [];
	const key = getLeftListSourceKey(list);
	if (key !== state.leftListSourceKey) {
		resetLeftListPagination(list);
		return true;
	}
	state.leftListTotalCount = state.leftListSourceIds.length;
	return false;
}

function getCurrentLeftListSourceItems()
{
	const lockedItems = getLockedListItems();
	if (lockedItems) return sortItems(lockedItems);
	return sortItems(getViewportFilteredItems(state.filtered));
}

function renderLeftListInitialLoading()
{
	if (!propertyList) return;
	propertyList.innerHTML = '<div class="left-list-loading" style="display:flex;" aria-live="polite">불러오는 중...</div>';
}

function setPagedListInfo(total, rendered)
{
	const totalCount = Number(total) || 0;
	const renderedCount = Number(rendered) || 0;
	if (!totalCount) {
		setResultInfo("총 0건");
		setListInfo("총 0개 매물");
		return;
	}
	setResultInfo(`총 ${totalCount}건`);
	setListInfo(renderedCount < totalCount ? `${totalCount}개 중 ${renderedCount}개` : `총 ${totalCount}개 매물`);
}

function setLeftListLoading(isLoading)
{
	state.leftListLoading = !!isLoading;
	if (propertyList) propertyList.classList.toggle("is-loading-more", !!isLoading);
}

async function loadMoreLeftListItems(options = {})
{
	if (document.body.classList.contains("sidebar-list-collapsed")) return;
	if (state.leftListLoading) return;
	const sourceItems = Array.isArray(options.sourceItems) ? options.sourceItems : getCurrentLeftListSourceItems();
	ensureLeftListSource(sourceItems);
	const total = Number(state.leftListTotalCount || 0);
	const rendered = Number(state.leftListRenderedCount || 0);
	if (!total) {
		setLeftListLoading(false);
		renderList([]);
		return;
	}
	if (rendered >= total) return;
	const nextIds = state.leftListSourceIds.slice(rendered, rendered + LEFT_LIST_PAGE_SIZE);
	if (!nextIds.length) return;
	const seq = state.leftListSeq;
	setLeftListLoading(true);
	try {
		const nextItems = await fetchLeftListRowsByIds(nextIds);
		if (seq !== state.leftListSeq) return;
		state.leftListItems = [...state.leftListItems, ...nextItems];
		state.leftListRenderedCount = Math.min(total, rendered + nextIds.length);
		setLeftListLoading(false);
		renderList(state.leftListItems);
		setPagedListInfo(total, state.leftListItems.length);
		if (state.leftListItems.length) {
			state.lastViewportListIds = state.leftListItems.map(item => normalizeItemId(item.id));
		}
	} catch (error) {
		console.error("왼쪽 매물 목록 추가 로딩 실패:", error);
		setLeftListLoading(false);
		if (!state.leftListItems.length) {
			propertyList.innerHTML = `
			<div class="card" style="padding:18px; cursor:default; border-bottom:0;">
			<div class="card-body" style="padding:0; text-align:left;">
			<div class="map-empty-state-desc">
			<div class="empty-title">매물 목록을 불러오지 못했습니다.</div>
			<div class="empty-sub">잠시 후 다시 시도해 주세요.</div>
			</div>
			</div>
			</div>
			`;
		}
	}
}

function syncFavoriteHeartButtons()
{
	document.querySelectorAll(".favorite-heart-btn[data-favorite-id]").forEach((btn) => {
		const active = isFavoriteListing(btn.dataset.favoriteId);
		btn.classList.toggle("active", active);
		btn.setAttribute("aria-label", active ? "관심매물 해제" : "관심매물 추가");
		btn.setAttribute("aria-pressed", active ? "true" : "false");
	});
}

function closeFavoriteListingMenus(exceptId)
{
	document.querySelectorAll("[data-favorite-menu-panel].open").forEach((menu) => {
		if (exceptId && menu.dataset.favoriteMenuPanel === exceptId) return;
		menu.classList.remove("open");
	});
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

	const hasMoreListItems = Number(state.leftListRenderedCount || 0) < Number(state.leftListTotalCount || 0);
	propertyList.innerHTML = data.map(item => {
		const thumb = String(item.image || "").trim();
		const thumbClass = thumb ? "thumb" : "thumb thumb-empty";
		const thumbStyle = thumb ? ` style="background-image:url('${escapeHtml(thumb)}')"` : "";
		const dealLabel = escapeHtml(item.dealType || "매매");
		const priceText = escapeHtml(item.price || "-");
		const priceDisplayText = priceText && priceText !== "-" ? `${dealLabel} ${priceText}` : priceText;
		const addressText = escapeHtml(formatDisplayPropertyAddress(item.address) || "-");
		const regionText = escapeHtml(getCardDisplayRegionName(item));
		const rawTypeText = item.type || "-";
		const typeLabel = getCardTypeBadgeLabel(rawTypeText);
		const buildingNameText = String(item.buildingName || "").trim();
		const typeText = escapeHtml(buildingNameText && !typeLabel.includes(buildingNameText) ? `${typeLabel} · ${buildingNameText}` : typeLabel);
		const titleText = escapeHtml(String(item.title || "매물명").replace(/^\s*\([^)]*\)\s*/, "").trim() || "매물명");

		const isDetachedHouse = isDetachedHouseType(item.type || "");
		const cardAreaHtml = isDetachedHouse
		? `<span class="area-display" data-area-raw="${escapeHtml(item.area || "-")}" data-area-unit="${globalAreaUnit}" data-area-type="${escapeHtml(rawTypeText || "")}">${formatCardAreaByUnit(item.area || "-", globalAreaUnit, rawTypeText || "")}</span>`
		: `<span class="area-display" data-area-raw="${escapeHtml(item.area || "-")}" data-area-unit="${globalAreaUnit}" data-area-type="${escapeHtml(rawTypeText || "")}">${formatCardAreaByUnit(item.area || "-", globalAreaUnit, rawTypeText || "")}</span>`;
		const cardFloorText = escapeHtml(getFloorDisplay(item.floors || ""));
		const cardMaintenanceText = escapeHtml(getCardMaintenanceDisplay(item.maintenance || ""));
		const cardInfoHtml = [
			cardFloorText ? `<span>${cardFloorText}</span>` : "",
			cardAreaHtml,
			cardMaintenanceText ? `<span>${cardMaintenanceText}</span>` : ""
		].filter(Boolean).join("<span>, </span>");

		return `
		<article class="card" data-id="${item.id}">
		<div class="card-inner-row">
		<div class="${thumbClass}"${thumbStyle}>
			${thumb ? "" : `<span class="thumb-empty-text">사진 없음</span>`}
			<button type="button" class="favorite-heart-btn ${isFavoriteListing(item.id) ? "active" : ""}" data-favorite-id="${escapeHtml(item.id)}" aria-label="${isFavoriteListing(item.id) ? "관심매물 해제" : "관심매물 추가"}" aria-pressed="${isFavoriteListing(item.id) ? "true" : "false"}" title="관심매물">
				<svg class="favorite-heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 20.25C7.85 16.42 4 13.2 4 9.2C4 6.73 5.93 4.75 8.35 4.75C9.75 4.75 11.06 5.42 12 6.48C12.94 5.42 14.25 4.75 15.65 4.75C18.07 4.75 20 6.73 20 9.2C20 13.2 16.15 16.42 12 20.25Z"></path>
				</svg>
			</button>
		</div>

		<div class="card-body">
		<div class="card-price-line">
		<span class="card-price">${priceDisplayText}</span>
		</div>

		<div class="card-title">${typeText}</div>

		<div class="card-spec">${cardInfoHtml}</div>

		<div class="card-address">${titleText || addressText}</div>
		${regionText ? `<div class="card-region">${regionText}</div>` : ""}
		</div>
		</div>
		</article>
		`;
	}).join("") + (hasMoreListItems ? '<div class="left-list-loading" aria-live="polite">불러오는 중...</div>' : "");

	refreshCardViewCounts(data);

	document.querySelectorAll(".card").forEach(card => {
		card.addEventListener("click", async function (e) {
			if (e.target.closest("a, button")) return;

			const item = data.find(v => normalizeItemId(v.id) === normalizeItemId(card.dataset.id));
			if (!item) return;

			const normalizedId = normalizeItemId(item.id);

			await hideRoadview();
			state.selectionMode = "single";
			state.selectedClusterKey = null;
			state.selectedMarkerId = normalizedId;
			clearListLock();
			highlightCard(normalizedId);
			updateMarkerSelection(normalizedId, [normalizedId]);

			if (detailScroll) detailScroll.scrollTop = 0;
			allowDetailOpenFromListClick = true;
			try {
				await openDetailPanel(item, { syncUrl: false });
			} finally {
				allowDetailOpenFromListClick = false;
			}

			await incrementViewCount(getItemViewKey(item));

			syncDetailUrl(item.id);

			if (detailScroll) detailScroll.scrollTop = 0;
			await focusProperty(item.id);

			setTimeout(() => {
				highlightCard(normalizedId);
				refreshClusterBadges();
			}, 0);
		});
	});

		document.querySelectorAll(".favorite-heart-btn[data-favorite-id]").forEach((btn) => {
			btn.addEventListener("click", async (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (btn.disabled) return;
				btn.disabled = true;
				const active = await setFavoriteListing(btn.dataset.favoriteId, !isFavoriteListing(btn.dataset.favoriteId));
				if (active) {
					const listingItem = data.find((item) => normalizeItemId(item.id) === normalizeItemId(btn.dataset.favoriteId));
					saveFavoriteListingSnapshot(listingItem);
				}
				btn.classList.toggle("active", active);
				btn.setAttribute("aria-label", active ? "관심매물 해제" : "관심매물 추가");
				btn.setAttribute("aria-pressed", active ? "true" : "false");
				if (currentDetailItem && getItemViewKey(currentDetailItem) === getViewCountKey(btn.dataset.favoriteId)) {
					refreshDetailEngagementCounts(currentDetailItem);
				}
				btn.disabled = false;
			const mySuitePanel = document.getElementById("mySuitePanel");
				const activeFavoriteTab = document.querySelector('.my-suite-tab.active[data-my-suite-tab="favorites"]');
				if (mySuitePanel && mySuitePanel.getAttribute("aria-hidden") === "false" && activeFavoriteTab) {
					renderRealjejuMySuiteFavoritesContent();
				}
		});
	});
}

function syncLeftAllButtonToMapFilters()
{
	const leftAllBtn = document.querySelector('#featureButtons button[data-value="all"]');
	if (!leftAllBtn) return;
	const isTypeAll = !(selectedType instanceof Set) || selectedType.size === 0;
	const isDealAll = !(selectedDeal instanceof Set) || selectedDeal.size === 0;
	const isMethodAll = !selectedDealMethod || selectedDealMethod === "all";
	const isPriceAll = !selectedPriceRange || selectedPriceRange === "all";
	const isAllState = isTypeAll && isDealAll && isMethodAll && isPriceAll;
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
	&& (!selectedPriceRange || selectedPriceRange === "all")
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
	const activeDealForPrice = dealValues.size === 1 ? Array.from(dealValues)[0] : "";
	const activePriceRange = selectedPriceRange || "all";
	const priceRange = activePriceRange === "all" ? null : getPriceFilterRange(activePriceRange, activeDealForPrice);

	state.filtered = state.all.filter(item => {
		const text = [
		item.title ?? "",
		item.listingNo ?? "",
		item.region ?? "",
		item.address ?? "",
		item.desc ?? "",
		item.type ?? "",
		item.agentName ?? "",
		item.agentOffice ?? "",
		item.date ?? "",
		item.dateLabel ?? "",
		...(item.features ?? [])
		].join(" ").toLowerCase();
		const rawItemText = JSON.stringify(item ?? {}).toLowerCase();
		const searchableText = `${text} ${rawItemText}`.replace(/\s+/g, " ");

		const okKeyword = !keyword || searchableText.includes(keyword);
		const okDeal = isDealAll || dealValues.has(item.dealType);
		const okPrice = !priceRange || isPriceInRange(getMapListingFilterPriceManwon(item, activeDealForPrice), priceRange);

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
		const isBrokerListing = !isDirectListing && (
		rawMethodText.includes("broker")
		|| rawMethodText.includes("agent")
		|| rawMethodText.includes("agency")
		|| rawMethodText.includes("공인")
		|| rawMethodText.includes("중개")
		|| !!item.agent_folder
		|| !!item.agentOffice
		|| !!item.agentName
		);
		const okDealMethod = methodValue === "all"
		|| (methodValue === "broker" && isBrokerListing)
		|| (methodValue === "direct" && isDirectListing);


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
		const okOceanView = !selectedOceanViewOnly || hasOceanView;
		return okKeyword && okDeal && okPrice && okType && okDealMethod && okFeature && okPet && okParking && okCityGas && okDuplex && okVeranda && okElevator && okFullOption && okImmediateMoveIn && okOceanView;
	});

	state.selectedMarkerId = null;
	state.selectedClusterKey = null;
	state.selectionMode = null;
	clearListLock();

	const viewportItems = getViewportFilteredItems(state.filtered);
	const shouldHideInitialList = state.initialRandomListActive !== false && isInitialAllListMode();
	const sortedViewportItems = sortItems(viewportItems);
	resetLeftListPagination(sortedViewportItems);
	scrollListToTop();
	if (shouldHideInitialList) {
		propertyList.innerHTML = "";
	} else if (sortedViewportItems.length) {
		renderLeftListInitialLoading();
		loadMoreLeftListItems({ sourceItems: sortedViewportItems });
	} else {
		renderList([]);
	}
	scrollListToTop();
	preventMapViewportChange = true;
	renderMarkers(state.filtered, { preserveViewport: true });
	preventMapViewportChange = false;
	updateMapEmptyState(sortedViewportItems);

	if (shouldHideInitialList) {
		setResultInfo(`총 ${state.filtered.length}건`);
		setListInfo(`총 ${state.filtered.length}개 매물`);
	} else {
		setPagedListInfo(sortedViewportItems.length, state.leftListItems.length);
	}
	syncLeftAllButtonToMapFilters();

	if (!shouldHideInitialList && !sortedViewportItems.length) {
		closeDetailPanel();
		return;
	}
}

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

async function handleSubAddressSearch()
{
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
	const queries = query.includes("제주") ? [query] : [query, `제주 ${query}`, `제주특별자치도 ${query}`];

	for (const q of queries) {
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

function runSubAddressSearchOnceInputSettles()
{
	if (subAddressSearchRafId != null) {
		cancelAnimationFrame(subAddressSearchRafId);
	}
	subAddressSearchRafId = requestAnimationFrame(() => {
		subAddressSearchRafId = null;
		handleSubAddressSearch();
	});
}

function handleLeftListScroll()
{
	if (!sidebarListPanel) return;
	const distanceToBottom = sidebarListPanel.scrollHeight - sidebarListPanel.scrollTop - sidebarListPanel.clientHeight;
	if (distanceToBottom <= 180) loadMoreLeftListItems();
}

function initEvents()
{
	if (keywordInput) keywordInput.addEventListener("input", () => {
		state.initialRandomListActive = false;
		applyFilter();
	});

	if (subAddressSearchForm) subAddressSearchForm.addEventListener("submit", (e) => {
		e.preventDefault();
		if (subAddressSearchIsComposing) {
			pendingSubAddressSearchAfterComposition = true;
			return;
		}
		pendingSubAddressSearchAfterComposition = false;
		runSubAddressSearchOnceInputSettles();
	});

	if (subAddressSearchInput) {
		subAddressSearchInput.addEventListener("compositionstart", () => {
			subAddressSearchIsComposing = true;
		});

		subAddressSearchInput.addEventListener("compositionend", () => {
			subAddressSearchIsComposing = false;
			if (!pendingSubAddressSearchAfterComposition) return;
			pendingSubAddressSearchAfterComposition = false;
			runSubAddressSearchOnceInputSettles();
		});

		subAddressSearchInput.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				subAddressSearchInput.value = "";
				setAddressSearchStatus("");
				return;
			}

			if (e.key === "Enter" && (e.isComposing || e.keyCode === 229 || subAddressSearchIsComposing)) {
				pendingSubAddressSearchAfterComposition = true;
				e.preventDefault();
			}
		});
	}

	if (sortLabel) {
		sortLabel.addEventListener("click", () => {
			if (currentSort === "latest") {
				currentSort = "price-desc";
			} else if (currentSort === "price-desc") {
				currentSort = "price-asc";
			} else {
				currentSort = "latest";
			}

			state.initialRandomListActive = false;
			syncSortLabelUI();
			refreshViewportList();
		});
	}

	if (sidebarListPanel) {
		sidebarListPanel.addEventListener("scroll", handleLeftListScroll, { passive: true });
	}

	if (mapPanelToggle) {
		mapPanelToggle.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			setMapPanelsCollapsed(!document.body.classList.contains("map-panels-collapsed"));
		});
		updateMapPanelToggleState();
	}

	if (detailAreaToggleBtn) {
		detailAreaToggleBtn.style.display = "none";
		detailAreaToggleBtn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();

			const currentUnit = detailAreaValue.dataset.areaUnit || "m2";
			const nextUnit = currentUnit === "m2" ? "py" : "m2";

			detailAreaValue.dataset.areaUnit = nextUnit;
			detailAreaToggleBtn.textContent = nextUnit === "m2" ? "평" : "㎡";

			if (currentDetailItem) {
				syncDetailAreaDisplay(currentDetailItem);
			}
		});
	}

	if (detailAreaTypeToggleBtn) {
		detailAreaTypeToggleBtn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (!currentDetailItem) return;

			const typeText = currentDetailItem.type || "";
			const rawAreaText = String(currentDetailItem.area || "").trim();
			const landTotalAreas = parseDetachedHouseAreas(rawAreaText);
			const pairedAreas = parseApartmentAreas(rawAreaText);

			if (/공급|계약|전용/.test(rawAreaText) && Number.isFinite(pairedAreas.supply) && Number.isFinite(pairedAreas.private)) {
				detailAreaMode = detailAreaMode === "supply" ? "private" : "supply";
				syncDetailAreaDisplay(currentDetailItem);
				return;
			}

			if (!/계약|전용/.test(rawAreaText) && Number.isFinite(landTotalAreas.land) && Number.isFinite(landTotalAreas.total)) {
				detailAreaMode = detailAreaMode === "land" ? "total" : "land";
				syncDetailAreaDisplay(currentDetailItem);
				return;
			}

			if (isDetachedHouseType(typeText)) {
				detailAreaMode = detailAreaMode === "land" ? "total" : "land";
				syncDetailAreaDisplay(currentDetailItem);
				return;
			}

			if (isCommercialType(typeText)) {
				const raw = String(currentDetailItem.area || "").trim();

				if (/계약|전용/.test(raw)) {
					detailAreaMode = detailAreaMode === "supply" ? "private" : "supply";
				} else {
					detailAreaMode = detailAreaMode === "land" ? "total" : "land";
				}

				syncDetailAreaDisplay(currentDetailItem);
				return;
			}

			if (/콘도/.test(typeText)) {
				detailAreaMode = detailAreaMode === "build" ? "total" : "build";
				syncDetailAreaDisplay(currentDetailItem);
				return;
			}

			if (isApartmentType(typeText) || /오피스텔|원룸|투룸/.test(typeText) || isHotelPensionType(typeText)) {
				detailAreaMode = detailAreaMode === "supply" ? "private" : "supply";
				syncDetailAreaDisplay(currentDetailItem);
			}
		});
	}

	detailCloseBtn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		closeDetailPanel();
	});

	if (mapAgentCloseBtn) {
		mapAgentCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
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
			const hideToday = !!(mapRecommendHideTodayCheck && mapRecommendHideTodayCheck.checked);
			state.isRecommendCardDismissed = true;
			if (hideToday) {
				localStorage.setItem(RECOMMEND_ITEM_HIDE_KEY, String(getHideUntilEndOfToday()));
			} else {
				localStorage.removeItem(RECOMMEND_ITEM_HIDE_KEY);
			}
			state.recommendItem = null;
			state.lastRecommendPoolKey = "";
			renderRecommendationCard(null);
		});
	}

	if (mapAgentHideTodayCheck) {
		mapAgentHideTodayCheck.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	}

	if (mapRecommendHideTodayCheck) {
		mapRecommendHideTodayCheck.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	}

	if (detailAuthTrigger) {
		detailAuthTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (typeof detailAuthTrigger.blur === "function") detailAuthTrigger.blur();
			if (detailAuthTrigger.dataset && detailAuthTrigger.dataset.authState === "logged-in") {
				if (typeof toggleGlobalAccountDropdown === "function") toggleGlobalAccountDropdown();
				return;
			}
			openAuthModal();
		});
	}

	if (authModalClose) {
		authModalClose.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeAuthModal();
		});
	}

	/* PATCH: 모달 바깥 클릭/마우스 이동으로 닫히지 않도록 overlay close 제거 */
	if (authModal) {
		authModal.addEventListener("click", (e) => {
			if (e.target === authModal) {
				e.preventDefault();
			}
		});
	}


function normalizeRealjejuPhone(value)
	{
		return String(value || "").replace(/[^0-9]/g, "");
	}

	function isValidRealjejuMobilePhone(value)
	{
		return /^010\d{8}$/.test(normalizeRealjejuPhone(value));
	}

		function isValidRealjejuOfficePhone(value)
		{
			const phone = normalizeRealjejuPhone(value);
			if (phone.startsWith("010")) return /^010\d{8}$/.test(phone);
			if (/^02\d{7,8}$/.test(phone)) return true;
			if (/^(031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)\d{7,8}$/.test(phone)) return true;
			return false;
		}

		function isValidRealjejuBrokerOfficeEmail(value)
		{
			return /^[^\s@]+@[^\s@]+$/.test(String(value || "").trim());
		}

		function isValidRealjejuKakaoOpenChatUrl(value)
		{
			const url = String(value || "").trim();
			if (!url) return true;
			return /^https?:\/\/\S+$/i.test(url);
		}

	const REALJEJU_KAKAO_URL_COLUMN_MESSAGE = "카카오 오픈 채팅방 저장 컬럼이 없습니다.\nsql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행해 주세요.";

		function isRealjejuKakaoUrlColumnError(error)
		{
			const text = [
				error && error.code,
				error && error.message,
				error && error.details,
				error && error.hint
			].map(value => String(value || "")).join(" ");
			return /kakao_url/i.test(text) && /(42703|schema cache|column|could not find)/i.test(text);
		}

		function isRealjejuMissingKakaoRpcError(error)
		{
			const text = [
				error && error.code,
				error && error.message,
				error && error.details,
				error && error.hint
			].map(value => String(value || "")).join(" ");
			return /save_my_agency_kakao_url|save_my_agency_profile|PGRST202|schema cache|function/i.test(text);
		}

		function isRealjejuAgencyNotFoundError(error)
		{
			const text = [
				error && error.code,
				error && error.message,
				error && error.details,
				error && error.hint
			].map(value => String(value || "")).join(" ");
			return /P0002|agency not found/i.test(text);
		}

		async function saveRealjejuAgencyProfile(client, agencyId, payload)
		{
			if (!client) throw new Error("Supabase client missing");
			const params = {
				p_agency_id: agencyId ? String(agencyId) : null,
				p_office_name: String(payload && payload.office_name || "").trim(),
				p_owner_name: String(payload && payload.owner_name || "").trim(),
				p_office_reg_no: String(payload && payload.office_reg_no || "").trim(),
				p_office_address: String(payload && payload.office_address || "").trim(),
				p_phone: String(payload && payload.phone || "").trim(),
				p_email: String(payload && payload.email || "").trim(),
				p_kakao_url: String(payload && payload.kakao_url || "").trim()
			};
			const { data, error } = await client.rpc("save_my_agency_profile", params);
			if (error) throw error;
			const row = Array.isArray(data) ? data[0] : data;
			if (!row || !row.id) throw new Error("중개사무소 정보 저장 확인 실패");
			return row;
		}

		async function saveRealjejuAgencyKakaoUrl(client, agencyId, kakaoUrl)
		{
			const url = String(kakaoUrl || "").trim();
			const { data, error } = await client.rpc("save_my_agency_kakao_url", {
				p_agency_id: agencyId ? String(agencyId) : null,
				p_kakao_url: url
			});
			if (error) throw error;
			const row = Array.isArray(data) ? data[0] : data;
			if (!row || (!url && row.kakao_url)) throw new Error("카카오 오픈 채팅방 저장 확인 실패");
			if (url && String(row.kakao_url || "").trim() !== url) throw new Error("카카오 오픈 채팅방 저장 확인 실패");
			return row;
		}

	async function requireProfileSetupIfNeeded(supabaseClient, user, profileData)
	{
		const profile = profileData || null;
		setRealjejuActiveSession(user || null, profile);
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

	function openShareMenu()
	{
		if (!detailShareMenu || !detailShareBtn) return;
		detailShareMenu.style.display = "flex";
		detailShareMenu.classList.add("open");
		detailShareMenu.setAttribute("aria-hidden", "false");
		detailShareMenu.style.top = "";
		detailShareMenu.style.left = "";
		detailShareMenu.style.right = "";
		detailShareMenu.style.visibility = "visible";
	}

	function closeShareMenu()
	{
		if (!detailShareMenu) return;
		detailShareMenu.classList.remove("open");
		detailShareMenu.style.display = "none";
		detailShareMenu.style.visibility = "hidden";
		detailShareMenu.setAttribute("aria-hidden", "true");
	}

	window.closeDetailShareMenu = function (event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		closeShareMenu();
	};

	function toggleShareMenu()
	{
		if (!detailShareMenu) return;
		const isOpen = detailShareMenu.style.display === "flex" || detailShareMenu.classList.contains("open");
		if (isOpen) {
			closeShareMenu();
		} else {
			openShareMenu();
		}
	}

	if (detailShareBtn) {
		detailShareBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			toggleShareMenu();
		});
	}

	const mySuiteTabCopy = {
		favorites: ["관심매물", "관심매물을 한 곳에서 확인할 수 있도록 준비중입니다."],
		inquiries: ["1:1 문의내역", "문의하신 내용을 확인하고 새 문의를 남길 수 있습니다."],
		reports: ["허위매물 신고", "허위매물 신고내역을 한 곳에서 확인할 수 있도록 준비중입니다."],
		payment: ["이용권 결제", "이용권 결제와 결제내역을 이곳에서 확인할 수 있도록 준비중입니다."],
		myinfo: ["내 정보", "프로필과 계정 정보를 이곳에서 확인할 수 있도록 준비중입니다."],
		"broker-office": ["중개사 정보", "중개사무소 정보와 가입 신청 상태를 이곳에서 확인할 수 있도록 준비중입니다."]
	};
	let mySuiteProfileSaving = false;
	let mySuiteProfilePhotoFile = null;
	let mySuiteProfilePhotoUrl = "";

	function escapeMySuiteHtml(value)
	{
		return String(value == null ? "" : value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function formatMySuitePhone(value)
	{
		const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
		if (!digits) return "";
		if (digits.length <= 3) return digits.length === 3 ? digits + "-" : digits;
		if (digits.length <= 7) return digits.slice(0, 3) + "-" + digits.slice(3) + (digits.length === 7 ? "-" : "");
		return digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
	}

	function bindMySuitePhoneInput(input)
	{
		if (!input || input.dataset.mySuitePhoneBound === "1") return;
		input.dataset.mySuitePhoneBound = "1";
		input.addEventListener("keydown", (event) => {
			if (event.key !== "Backspace") return;
			const start = input.selectionStart || 0;
			const end = input.selectionEnd || start;
			if (start !== end || start < 1 || input.value[start - 1] !== "-") return;
			event.preventDefault();
			const beforeDigits = input.value.slice(0, start - 1).replace(/\D/g, "");
			const afterDigits = input.value.slice(start).replace(/\D/g, "");
			const digits = (beforeDigits.slice(0, -1) + afterDigits).slice(0, 11);
			input.value = formatMySuitePhone(digits);
			const nextDigitCount = Math.max(0, beforeDigits.length - 1);
			let pos = 0;
			let seen = 0;
			while (pos < input.value.length && seen < nextDigitCount) {
				if (/\d/.test(input.value[pos])) seen += 1;
				pos += 1;
			}
			try { input.setSelectionRange(pos, pos); } catch (err) {}
		});
		input.addEventListener("input", () => {
			const formatted = formatMySuitePhone(input.value);
			input.value = formatted;
			try { input.setSelectionRange(formatted.length, formatted.length); } catch (err) {}
		});
		if (input.value) input.value = formatMySuitePhone(input.value);
	}

	function getMySuiteBrokerLookupEmail(user, profile)
	{
		const candidates = [
			user && user.email,
			profile && profile.email,
			window.realjejuCurrentProfile && window.realjejuCurrentProfile.email
		];
		const found = candidates.find((value) => String(value || "").trim());
		return found ? String(found).trim().toLowerCase() : "";
	}

	function mergeMySuiteBrokerOfficeRows(...rowSets)
	{
		const merged = [];
		const seen = new Set();
		rowSets.flat().forEach((row) => {
			if (!row || typeof row !== "object") return;
			const key = String(row.id || `${row.user_id || ""}:${row.email || ""}:${row.office_name || ""}`).trim();
			if (key && seen.has(key)) return;
			if (key) seen.add(key);
			merged.push(row);
		});
		return merged;
	}

	async function fetchMySuiteBrokerOfficeRows(client, user, profile)
	{
		if (!client || !user || !user.id) return [];
		if (typeof window.realjejuFetchBrokerOfficeRows === "function") {
			return window.realjejuFetchBrokerOfficeRows(client, user, profile);
		}
		return [];
	}

	async function uploadMySuiteProfilePhotoIfNeeded(client, userId)
	{
		if (!mySuiteProfilePhotoFile || !client || !userId) return mySuiteProfilePhotoUrl || "";
		const ext = String(mySuiteProfilePhotoFile.name || "jpg")
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "") || "jpg";
		const bucket = client.storage.from("profiles");
		const filePath = `${userId}/profile-${Date.now()}.${ext}`;
		try {
			const { data, error } = await bucket.upload(filePath, mySuiteProfilePhotoFile, {
				cacheControl: "3600",
				upsert: true
			});
			if (error) {
				console.warn("마이페이지 프로필 사진 업로드 실패:", error);
				return mySuiteProfilePhotoUrl || "";
			}
			const savedPath = data && data.path ? data.path : filePath;
			try {
				const { data: listData, error: listError } = await bucket.list(userId, { limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } });
				if (!listError && Array.isArray(listData)) {
					const removeTargets = listData
						.map((item) => item && item.name ? `${userId}/${item.name}` : "")
						.filter((path) => path && path !== savedPath && /^.+\/profile-/i.test(path));
					if (removeTargets.length) {
						const { error: removeError } = await bucket.remove(removeTargets);
						if (removeError) console.warn("마이페이지 이전 프로필 사진 삭제 실패:", removeError);
					}
				}
			} catch (cleanupErr) {
				console.warn("마이페이지 이전 프로필 사진 정리 오류:", cleanupErr);
			}
			const { data: urlData } = bucket.getPublicUrl(savedPath);
			return urlData && urlData.publicUrl ? urlData.publicUrl : (mySuiteProfilePhotoUrl || "");
		} catch (err) {
			console.warn("마이페이지 프로필 사진 업로드 오류:", err);
			return mySuiteProfilePhotoUrl || "";
		}
	}

	async function fetchMySuiteProfileAndBrokerOffice()
	{
		const client = getRealjejuSupabaseClient();
		if (!client) return { user: null, profile: null, brokerOffice: null };
		const { data: userData } = await client.auth.getUser();
		const user = userData && userData.user ? userData.user : (window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null);
		if (!user || !user.id) return { user: null, profile: null, brokerOffice: null };
		const { data: profile } = await client
			.from("profiles")
			.select("status, name, email, phone, role, role_request, profile_completed, profile_image")
			.eq("id", user.id)
			.maybeSingle();
		let brokerOffice = null;
		if (isRealjejuBrokerRole(profile && profile.role_request)) {
			try {
				const officeRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
				brokerOffice = pickCurrentRealjejuBrokerOffice(officeRows, user);
			} catch (err) {
				brokerOffice = null;
			}
		}
		return { user, profile: profile || null, brokerOffice };
	}

	function closeMySuitePage()
	{
		document.body.classList.remove("my-suite-page-open", "detail-page-panel-open");
		const panel = document.getElementById("mySuitePanel");
		if (panel) {
			panel.setAttribute("aria-hidden", "true");
			panel.style.display = "";
			panel.style.zIndex = "";
		}
	}
	window.closeMySuitePage = closeMySuitePage;

	function releaseGlobalAccountDropdownFocus(dropdown)
	{
		const targetDropdown = dropdown || document.getElementById("globalAccountDropdown");
		const active = document.activeElement;
		if (!targetDropdown || !active || !targetDropdown.contains(active)) return;
		const accountTrigger = document.getElementById("detailAuthTrigger") || document.querySelector(".global-auth-trigger");
		if (accountTrigger && typeof accountTrigger.focus === "function") {
			accountTrigger.focus({ preventScroll: true });
			return;
		}
		if (typeof active.blur === "function") active.blur();
	}
	window.realjejuReleaseGlobalAccountDropdownFocus = releaseGlobalAccountDropdownFocus;

	function getFavoriteListingThumbHtml(item)
	{
		const images = normalizeImageArray(item || {});
		const image = String((images && images[0]) || (item && item.image) || "").trim();
		if (!image) return '<div class="broker-listing-thumb-empty">사진 없음</div>';
		return `<img src="${escapeMySuiteHtml(image)}" alt="">`;
	}

	function formatMySuiteFavoriteDate(value)
	{
		const raw = String(value || "").trim();
		if (!raw) return "-";
		const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (match) return `${match[1].slice(2)}.${match[2]}.${match[3]}`;
		const date = new Date(raw);
		if (Number.isNaN(date.getTime())) return raw || "-";
		const yy = String(date.getFullYear()).slice(2);
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}.${mm}.${dd}`;
	}

	function renderMySuiteFavoritesContent()
		{
			const content = document.getElementById("mySuiteContent");
			if (!content) return;
			const favoriteUserId = getCurrentFavoriteUserId();
			if (favoriteUserId && (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== favoriteUserId)) {
					loadFavoriteListingStateFromServer().then(() => {
						const activeMySuiteTab = document.querySelector('.my-suite-tab.active[data-my-suite-tab="favorites"]');
						if (document.body.classList.contains("my-suite-page-open") && activeMySuiteTab) {
							renderRealjejuMySuiteFavoritesContent();
						}
					});
			}
			const favoriteBaseItems = getFavoriteListingItems(mySuiteFavoriteView);
			const favorites = getFilteredFavoriteListingItems(favoriteBaseItems);
			const totalPages = Math.max(1, Math.ceil(favorites.length / MY_SUITE_FAVORITES_PER_PAGE));
			const currentPage = getMySuiteFavoriteListingPage(totalPages);
			const startIndex = (currentPage - 1) * MY_SUITE_FAVORITES_PER_PAGE;
			const pageFavorites = favorites.slice(startIndex, startIndex + MY_SUITE_FAVORITES_PER_PAGE);
			hydrateFavoriteListingThumbs(pageFavorites);
			const activeCount = getFavoriteListingItems("active").length;
			const trashCount = getFavoriteListingItems("trash").length;
			const propertyOptions = getFavoriteFilterOptions("property", favoriteBaseItems, getFavoritePropertyFilterValue);
			const dealOptions = getFavoriteFilterOptions("deal", favoriteBaseItems, getFavoriteDealFilterValue);
			const propertyFilterLabel = mySuiteFavoritePropertyFilter.size ? [...mySuiteFavoritePropertyFilter].join(", ") : "매물 유형";
			const dealFilterLabel = mySuiteFavoriteDealFilter.size ? [...mySuiteFavoriteDealFilter].join(", ") : "거래 유형";
			content.className = "my-suite-content my-suite-favorites-content";

			content.innerHTML = `
				<div class="my-suite-favorites-filterbar">
					<button type="button" class="broker-home-filter-btn ${mySuiteFavoriteView === "active" ? "active" : ""}" data-favorite-view="active">관심매물 <span>${activeCount}</span></button>
					<div class="broker-home-filter-item">
						<button type="button" class="broker-home-filter-btn ${mySuiteFavoritePropertyFilter.size ? "active" : ""}" data-favorite-filter-menu="property">${escapeMySuiteHtml(propertyFilterLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
						<div class="broker-home-filter-menu" data-favorite-filter-panel="property">${renderFavoriteFilterMenu("property", propertyOptions, mySuiteFavoritePropertyFilter)}</div>
					</div>
					<div class="broker-home-filter-item">
						<button type="button" class="broker-home-filter-btn ${mySuiteFavoriteDealFilter.size ? "active" : ""}" data-favorite-filter-menu="deal">${escapeMySuiteHtml(dealFilterLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
						<div class="broker-home-filter-menu" data-favorite-filter-panel="deal">${renderFavoriteFilterMenu("deal", dealOptions, mySuiteFavoriteDealFilter)}</div>
					</div>
					<div class="broker-home-filter-spacer" aria-hidden="true"></div>
					<button type="button" class="broker-home-filter-btn ${mySuiteFavoriteView === "trash" ? "active" : ""}" data-favorite-view="trash">휴지통 <span>${trashCount}</span></button>
				</div>
				${!favorites.length ? "" : `
			<div class="broker-listing-shell my-suite-favorites-shell">
				<div class="broker-listing-list my-suite-favorites-list">
					<div class="broker-listing-head" aria-hidden="true">
						<div>사진</div>
						<div>매물유형</div>
						<div>상태</div>
						<div>등록날짜</div>
						<div>매물번호</div>
						<div>제목</div>
						<div><button type="button" class="broker-listing-area-toggle" data-my-suite-favorite-area-toggle>면적 <i class="fa-solid fa-right-left broker-listing-area-toggle-icon" aria-hidden="true"></i></button></div>
						<div>가격</div>
						<div></div>
						<div></div>
						<div>관리</div>
					</div>
					${pageFavorites.map((item) => {
						const rowId = escapeMySuiteHtml(item.id);
						const isTrashView = mySuiteFavoriteView === "trash";
						const listingNo = escapeMySuiteHtml(item.listingNo || "-");
						const created = escapeMySuiteHtml(formatMySuiteFavoriteDate(getFavoriteListingDateValue(item)));
						const typeText = escapeMySuiteHtml(getDisplayTypeLabel(item.type || item.typeFilter || "-"));
						const titleText = escapeMySuiteHtml(String(item.title || "제목 없음").replace(/^\s*\([^)]*\)\s*/, "").trim() || "제목 없음");
						const addressText = escapeMySuiteHtml(formatDisplayPropertyAddress(item.address) || "-");
						const rawArea = item.area || "-";
						const rawType = item.type || "";
						const areaHtml = formatCardAreaByUnit(rawArea, getMySuiteFavoriteAreaUnit(), rawType);
						const dealLabel = escapeMySuiteHtml(item.dealType || "매매");
						const priceLabel = escapeMySuiteHtml(item.price || "-");
						const priceHtml = `<span class="broker-listing-price-deal">${dealLabel}</span><span class="broker-listing-price-amount">${priceLabel}</span>`;
						return `
							<div class="broker-listing-row my-suite-favorite-row" data-favorite-listing-id="${rowId}">
								<div class="broker-listing-cell broker-listing-photo-cell"><div class="broker-listing-thumb">${getFavoriteListingThumbHtml(item)}</div></div>
								<div class="broker-listing-cell broker-listing-type">${typeText}</div>
								<div class="broker-listing-cell"><span class="broker-listing-status published">${mySuiteFavoriteView === "trash" ? "휴지통" : "관심"}</span></div>
								<div class="broker-listing-cell broker-listing-meta">${created}</div>
								<div class="broker-listing-cell broker-listing-no">${listingNo}</div>
								<div class="broker-listing-title-cell">
									<div class="broker-listing-title">${titleText}</div>
									<div class="broker-listing-address">${addressText}</div>
								</div>
								<div class="broker-listing-cell broker-listing-area" data-favorite-area-raw="${escapeMySuiteHtml(rawArea)}" data-favorite-area-type="${escapeMySuiteHtml(rawType)}">${areaHtml}</div>
								<div class="broker-listing-cell broker-listing-price">${priceHtml}</div>
								<div class="broker-listing-cell"></div>
								<div class="broker-listing-cell"></div>
								<div class="broker-listing-menu-cell">
									<button type="button" class="broker-listing-menu-btn" data-favorite-menu="${rowId}" aria-label="관심매물 관리 메뉴">⋮</button>
									<div class="broker-listing-more-menu" data-favorite-menu-panel="${rowId}">
										${isTrashView ? `
										<button type="button" class="broker-listing-menu-item" data-favorite-action="refresh" data-listing-id="${rowId}">현재날짜로 갱신</button>
										<button type="button" class="broker-listing-menu-item" data-favorite-action="restore" data-listing-id="${rowId}">복원</button>
										<button type="button" class="broker-listing-menu-item danger" data-favorite-action="permanent_delete" data-listing-id="${rowId}">영구삭제</button>
										` : `
										<button type="button" class="broker-listing-menu-item" data-favorite-action="unfavorite" data-listing-id="${rowId}">관심매물 해제</button>
										<button type="button" class="broker-listing-menu-item" data-favorite-action="report" data-listing-id="${rowId}">허위매물 신고</button>
										<button type="button" class="broker-listing-menu-item danger" data-favorite-action="delete" data-listing-id="${rowId}">삭제</button>
										`}
									</div>
								</div>
							</div>
						`;
					}).join("")}
				</div>
				${renderMySuiteFavoriteListingPagination(favorites.length, totalPages, currentPage)}
			</div>
				`}
			`;
		}
		window.realjejuRenderMySuiteFavoritesContent = renderMySuiteFavoritesContent;

		function renderMySuiteBasicContent(key)
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		const copy = mySuiteTabCopy[key] || mySuiteTabCopy.favorites;
		content.className = "my-suite-content";
		content.innerHTML = `
			<h2 class="my-suite-content-title" id="mySuiteContentTitle">${escapeMySuiteHtml(copy[0])}</h2>
			<p class="my-suite-content-desc" id="mySuiteContentDesc">${escapeMySuiteHtml(copy[1])}</p>
		`;
	}

	function getMySuiteInquiryStatusLabel(status)
	{
		const value = String(status || "pending").trim();
		if (value === "answered") return "답변완료";
		if (value === "checking") return "확인중";
		return "답변대기";
	}

	function formatMySuiteInquiryDate(value)
	{
		const date = new Date(value || "");
		if (Number.isNaN(date.getTime())) return "-";
		const yy = String(date.getFullYear()).slice(2);
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}.${mm}.${dd}`;
	}

	function renderMySuiteInquiryForm()
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-inquiries-content";
		content.innerHTML = `
			<div class="my-suite-inquiry-head">
				<div>
					<h2 class="my-suite-content-title" id="mySuiteContentTitle">1:1 문의하기</h2>
					<p class="my-suite-content-desc" id="mySuiteContentDesc">문의 내용을 남기면 관리자 답변을 이곳에서 확인할 수 있습니다.</p>
				</div>
				<button type="button" class="my-suite-inquiry-secondary" data-my-suite-inquiry-action="list">목록</button>
			</div>
			<form class="my-suite-inquiry-form" id="mySuiteInquiryForm">
				<div class="my-suite-inquiry-title-row">
					<label class="my-suite-inquiry-label" for="mySuiteInquiryTitleInput">제목</label>
					<input type="text" class="profile-suite-input my-suite-inquiry-input" id="mySuiteInquiryTitleInput" maxlength="50" autocomplete="off" required>
				</div>
				<label class="my-suite-inquiry-label" for="mySuiteInquiryMessageInput">문의 내용</label>
				<textarea class="profile-suite-input my-suite-inquiry-textarea" id="mySuiteInquiryMessageInput" maxlength="500" required></textarea>
				<div class="my-suite-inquiry-counter" id="mySuiteInquiryMessageCounter">0 / 500</div>
				<p class="my-suite-inquiry-status" id="mySuiteInquiryStatus" aria-live="polite"></p>
				<div class="my-suite-inquiry-actions">
					<button type="button" class="my-suite-inquiry-secondary" data-my-suite-inquiry-action="list">취소</button>
					<button type="submit" class="my-suite-inquiry-primary">문의 등록</button>
				</div>
			</form>
		`;
		updateMySuiteInquiryMessageCounter();
	}

	function updateMySuiteInquiryMessageCounter()
	{
		const messageInput = document.getElementById("mySuiteInquiryMessageInput");
		const counter = document.getElementById("mySuiteInquiryMessageCounter");
		if (!messageInput || !counter) return;
		if (messageInput.value.length > 500) messageInput.value = messageInput.value.slice(0, 500);
		counter.textContent = `${messageInput.value.length} / 500`;
	}

	async function renderMySuiteInquiriesContent()
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-inquiries-content";
		content.innerHTML = '<p class="my-suite-profile-loading">1:1 문의내역을 불러오는 중입니다.</p>';
		const client = getRealjejuSupabaseClient();
		if (!client) {
			content.innerHTML = '<p class="my-suite-profile-loading">문의내역을 불러올 수 없습니다.</p>';
			return;
		}
		try {
			const { data: userData, error: userError } = await client.auth.getUser();
			if (userError) throw userError;
			const user = userData && userData.user ? userData.user : null;
			if (!user || !user.id) {
				content.innerHTML = `
					<div class="my-suite-inquiry-empty">
						<h2 class="my-suite-content-title">1:1 문의내역</h2>
						<p class="my-suite-content-desc">로그인 후 문의내역을 확인할 수 있습니다.</p>
						<button type="button" class="my-suite-inquiry-primary" data-my-suite-action="login">로그인</button>
					</div>
				`;
				return;
			}
			await purgeExpiredMySuiteInquiries(client, user.id);
			const inquiryQuery = client
				.from("support_inquiries")
				.select("id, user_id, author_email, author_name, title, message, status, admin_reply, replied_at, created_at")
				.eq("user_id", user.id)
				.or("status.is.null,status.neq.deleted")
				.order("created_at", { ascending: false });
			const { data, error } = await inquiryQuery;
			if (error) throw error;
			const inquiries = Array.isArray(data) ? data : [];
			content.innerHTML = `
				<div class="my-suite-inquiry-head">
					<div>
						<h2 class="my-suite-content-title" id="mySuiteContentTitle">1:1 문의내역</h2>
						<p class="my-suite-content-desc" id="mySuiteContentDesc">문의하신 내용을 확인하고 새 문의를 남길 수 있습니다.</p>
					</div>
				</div>
				${!inquiries.length ? '<div class="my-suite-inquiry-empty-text">아직 등록한 문의가 없습니다.</div>' : `
				<div class="my-suite-inquiry-list">
					${inquiries.map((row) => {
						const id = escapeMySuiteHtml(row.id || "");
						const answered = !!String(row.admin_reply || "").trim();
						const status = escapeMySuiteHtml(getMySuiteInquiryStatusLabel(answered ? "answered" : row.status));
						return `
							<article class="my-suite-inquiry-item" data-inquiry-id="${id}">
								<div class="my-suite-inquiry-row">
									<button type="button" class="my-suite-inquiry-main" data-my-suite-inquiry-toggle="${id}">
										<span class="my-suite-inquiry-date">${escapeMySuiteHtml(formatMySuiteInquiryDate(row.created_at))}</span>
										<span class="my-suite-inquiry-title">${escapeMySuiteHtml(row.title || "제목 없음")}</span>
										<span class="my-suite-inquiry-state ${answered ? "answered" : "pending"}">${status}</span>
									</button>
									<button type="button" class="my-suite-inquiry-delete" data-my-suite-inquiry-delete="${id}">삭제</button>
								</div>
								<div class="my-suite-inquiry-detail">
									<div class="my-suite-inquiry-detail-block">
										<strong>문의 내용</strong>
										<p>${escapeMySuiteHtml(row.message || "-")}</p>
									</div>
									<div class="my-suite-inquiry-detail-block answer">
										<strong>관리자 답변</strong>
										<p>${answered ? escapeMySuiteHtml(row.admin_reply) : "아직 답변이 등록되지 않았습니다."}</p>
										${row.replied_at ? `<span>답변일 ${escapeMySuiteHtml(formatMySuiteInquiryDate(row.replied_at))}</span>` : ""}
									</div>
								</div>
							</article>
						`;
					}).join("")}
				</div>
				`}
				<div class="my-suite-inquiry-bottom-actions">
					<button type="button" class="my-suite-inquiry-primary" data-my-suite-inquiry-action="write">문의하기</button>
				</div>
			`;
		} catch (err) {
			console.warn("1:1 문의내역 로드 실패:", err);
			content.innerHTML = `
				<div class="my-suite-inquiry-empty">
					<h2 class="my-suite-content-title">1:1 문의내역</h2>
					<p class="my-suite-content-desc">문의내역을 불러오지 못했습니다.</p>
					<button type="button" class="my-suite-inquiry-primary" data-my-suite-inquiry-action="write">문의하기</button>
				</div>
			`;
		}
	}

	async function deleteMySuiteInquiry(inquiryId)
	{
		const id = String(inquiryId || "").trim();
		if (!id) return;
		const client = getRealjejuSupabaseClient();
		if (!client) return;
		try {
			const { data: userData, error: userError } = await client.auth.getUser();
			if (userError) throw userError;
			const user = userData && userData.user ? userData.user : null;
			if (!user || !user.id) throw new Error("로그인이 필요합니다.");
			let { error } = await client
				.from("support_inquiries")
				.update({ status: "deleted", deleted_at: new Date().toISOString() })
				.eq("id", id)
				.eq("user_id", user.id);
			if (error && /deleted_at/i.test(String(error.message || error.details || ""))) {
				const retry = await client
					.from("support_inquiries")
					.update({ status: "deleted" })
					.eq("id", id)
					.eq("user_id", user.id);
				error = retry.error;
			}
			if (error) throw error;
			await renderMySuiteInquiriesContent();
		} catch (err) {
			console.warn("1:1 문의 삭제 실패:", err);
			if (typeof openAuthErrorModal === "function") openAuthErrorModal("문의 삭제에 실패했습니다.", "1:1 문의내역", null);
		}
	}

	async function purgeExpiredMySuiteInquiries(client, userId)
	{
		if (!client || !userId) return false;
		try {
			const { error } = await client
				.from("support_inquiries")
				.delete()
				.eq("user_id", userId)
				.eq("status", "deleted")
				.lte("deleted_at", getRealjejuTrashCutoffIso());
			if (error) throw error;
			return true;
		} catch (err) {
			console.warn(`${REALJEJU_TRASH_RETENTION_DAYS}일 지난 1:1 문의 휴지통 정리 실패:`, err);
			return false;
		}
	}

	async function submitMySuiteInquiry(form)
	{
		if (!form || form.dataset.saving === "1") return;
		const statusEl = document.getElementById("mySuiteInquiryStatus");
		const titleInput = document.getElementById("mySuiteInquiryTitleInput");
		const messageInput = document.getElementById("mySuiteInquiryMessageInput");
		const title = String(titleInput && titleInput.value || "").trim();
		const message = String(messageInput && messageInput.value || "").trim();
		if (messageInput && messageInput.value.length > 500) messageInput.value = messageInput.value.slice(0, 500);
		if (!title || !message) {
			if (statusEl) statusEl.textContent = "제목과 문의 내용을 입력해 주세요.";
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			if (statusEl) statusEl.textContent = "문의 등록을 사용할 수 없습니다.";
			return;
		}
		try {
			form.dataset.saving = "1";
			if (statusEl) statusEl.textContent = "문의 등록 중입니다.";
			const { data: userData, error: userError } = await client.auth.getUser();
			if (userError) throw userError;
			const user = userData && userData.user ? userData.user : null;
			if (!user || !user.id) throw new Error("로그인이 필요합니다.");
			let authorName = "";
			try {
				const { data: profileData } = await client
					.from("profiles")
					.select("name")
					.eq("id", user.id)
					.maybeSingle();
				authorName = String(profileData && profileData.name || "").trim();
			} catch (profileError) {
				console.warn("1:1 문의 작성자 이름 조회 실패:", profileError);
			}
			const { error } = await client.from("support_inquiries").insert({
				user_id: user.id,
				author_email: user.email || "",
				author_name: authorName,
				title,
				message,
				status: "pending"
			});
			if (error) throw error;
			await renderMySuiteInquiriesContent();
		} catch (err) {
			console.warn("1:1 문의 등록 실패:", err);
			if (statusEl) statusEl.textContent = "문의 등록에 실패했습니다.";
		} finally {
			form.dataset.saving = "";
		}
	}

	async function submitMySuiteInquiryReply(form)
	{
		if (!form || form.dataset.saving === "1") return;
		const inquiryId = String(form.dataset.mySuiteInquiryReplyForm || "").trim();
		const textarea = form.querySelector(".my-suite-inquiry-reply-textarea");
		const statusEl = form.querySelector(".my-suite-inquiry-reply-status");
		if (textarea && textarea.value.length > 1000) textarea.value = textarea.value.slice(0, 1000);
		const reply = String(textarea && textarea.value || "").trim();
		if (!inquiryId) return;
		if (!reply) {
			if (statusEl) statusEl.textContent = "답변 내용을 입력해 주세요.";
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			if (statusEl) statusEl.textContent = "답변 등록을 사용할 수 없습니다.";
			return;
		}
		try {
			form.dataset.saving = "1";
			if (statusEl) statusEl.textContent = "답변 등록 중입니다.";
			const { error } = await client.rpc("reply_admin_support_inquiry", {
				p_inquiry_id: inquiryId,
				p_reply: reply
			});
			if (error) throw error;
			if (document.body.classList.contains("admin-page-open") && typeof window.loadAdminInquiries === "function") {
				await window.loadAdminInquiries();
			} else {
				await renderMySuiteInquiriesContent();
			}
		} catch (err) {
			console.warn("1:1 문의 답변 등록 실패:", err);
			if (statusEl) statusEl.textContent = `답변 등록에 실패했습니다${formatAdminRpcError(err)}. ${getAdminRpcSchemaHelp()}`;
		} finally {
			form.dataset.saving = "";
		}
	}

	async function renderMySuiteProfileContent()
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-content-profile";
		content.innerHTML = '<p class="my-suite-profile-loading">내 정보를 불러오는 중입니다.</p>';

		function safeHtml(value)
		{
			return String(value ?? "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		}

		function safePhone(value)
		{
			const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
			if (digits.length <= 3) return digits || "-";
			if (digits.length <= 7) return digits.slice(0, 3) + "-" + digits.slice(3);
			return digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
		}

		function safeRoleLabel(role)
		{
			const value = String(role || "").trim();
			const labels = {
				user: "일반회원",
				tenant: "일반회원",
				broker: "중개사",
				agent: "대표 공인중개사",
				agent_sub: "소속 공인중개사",
				agent_staff: "중개보조원",
				corporation: "법인",
				admin: "관리자",
				owner: "임대인",
				landlord: "임대인"
			};
			if (labels[value]) return labels[value];
			if (value === "중개사" || value === "공인중개사" || value === "대표 공인중개사" || value === "소속 공인중개사" || value === "중개보조원") return value;
			if (value === "법인" || value === "관리자" || value === "임대인" || value === "일반회원") return value;
			return value || "일반회원";
		}

		function safeIsBroker(role)
		{
			return isRealjejuBrokerRole(role);
		}

		function safeBrokerStatus(profile, brokerOffice)
		{
			const officeStatus = getBrokerOfficeRowStatus(brokerOffice);
			if (officeStatus === "active") return brokerOffice.office_name || "승인 완료";
			if (!safeIsBroker(profile && profile.role_request)) return "해당 없음";
			if (!brokerOffice) return "미신청";
			if (officeStatus === "new") return "가입 신청 진행중";
			if (officeStatus === "pending") return "승인 대기중";
			if (officeStatus === "rejected") return "반려";
			return brokerOffice.office_name || "미신청";
		}

		function renderProfileCard(user, profile, brokerOffice)
		{
			if (!user) {
				content.innerHTML = `
					<div class="my-suite-profile-card">
						<p class="my-suite-profile-loading">로그인 후 내 정보를 확인할 수 있습니다.</p>
						<div class="my-suite-profile-actions">
							<button type="button" class="my-suite-profile-btn primary" data-my-suite-action="login">로그인</button>
						</div>
					</div>
				`;
				return;
			}

			const completed = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
			const displayName = profile && profile.name ? profile.name : "";
			const email = user.email || (profile && profile.email) || "-";
			const phone = profile && profile.phone ? safePhone(profile.phone) : "";
			const role = safeRoleLabel(profile && profile.role_request);
			const brokerStatus = safeBrokerStatus(profile, brokerOffice);
			const brokerRole = safeIsBroker(profile && profile.role_request);
			const officeStatus = getBrokerOfficeRowStatus(brokerOffice);
			const isApplicationWaiting = brokerOffice && (officeStatus === "new" || officeStatus === "pending");
			const isBrokerOfficeActive = brokerOffice && officeStatus === "active";
			const brokerActionLabel = isBrokerOfficeActive
				? "중개사 정보"
				: (isApplicationWaiting ? "가입 신청 진행중" : "중개사무소 가입 신청");
			const brokerAction = isBrokerOfficeActive
				? "broker-office-info"
				: (isApplicationWaiting ? "broker-office-pending" : "broker-office-apply");

			content.innerHTML = `
					<div class="myinfo-page-card my-suite-myinfo-card">
						<div class="myinfo-page-photo-box my-suite-myinfo-photo-box">
							<img src="" alt="프로필 사진" class="myinfo-page-photo" id="mySuiteProfileImage">
						</div>
						<div class="myinfo-page-row">
							<span class="myinfo-page-label">이름</span>
						<span class="myinfo-page-value">${safeHtml(displayName)}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">이메일</span>
						<span class="myinfo-page-value">${safeHtml(email)}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">휴대폰번호</span>
						<span class="myinfo-page-value">${safeHtml(phone)}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">회원유형</span>
						<span class="myinfo-page-value">${safeHtml(role)}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">프로필 상태</span>
						<span class="myinfo-page-value">${completed ? "완료" : "미완료"}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">중개사무소</span>
						<span class="myinfo-page-value">${safeHtml(brokerStatus)}</span>
					</div>
					<div class="myinfo-page-actions">
						<button type="button" class="myinfo-page-primary" data-my-suite-action="profile-edit">수정</button>
					</div>
				</div>
			`;
			const img = document.getElementById("mySuiteProfileImage");
			if (img) {
				const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";
				img.src = profile && profile.profile_image ? profile.profile_image : fallbackImage;
			}
		}

		let user = window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null;
		let profile = window.realjejuCurrentProfile || null;
		let brokerOffice = window.realjejuCurrentBrokerOffice || null;
		let loadedFromServer = false;

		try {
			const loaded = await fetchMySuiteProfileAndBrokerOffice();
			if (loaded && loaded.user) {
				user = loaded.user;
				profile = loaded.profile || profile;
				brokerOffice = loaded.brokerOffice || brokerOffice;
				loadedFromServer = true;
				if (!isRealjejuActiveSessionUser(user)) return;
				setRealjejuActiveSession(user, profile || null);
				window.realjejuCurrentBrokerOffice = brokerOffice || null;
			}
		} catch (err) {
			console.warn("마이페이지 내 정보 로드 실패:", err);
		}

		if (user) {
			try {
				renderProfileCard(user, profile, brokerOffice);
			} catch (err) {
				console.warn("마이페이지 내 정보 렌더 실패:", err);
				content.innerHTML = `
					<div class="my-suite-profile-card">
						<p class="my-suite-profile-loading">내 정보를 표시하지 못했습니다.</p>
					</div>
				`;
			}
			return;
		}

		if (!loadedFromServer) {
			renderProfileCard(null, null, null);
			return;
		}

		try {
			renderProfileCard(user, profile, brokerOffice);
		} catch (err) {
			console.warn("마이페이지 내 정보 렌더 실패:", err);
			content.innerHTML = `
				<div class="my-suite-profile-card">
					<p class="my-suite-profile-loading">내 정보를 표시하지 못했습니다.</p>
				</div>
			`;
		}
	}

	async function renderMySuiteBrokerOfficeContent()
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-content-profile";
		content.innerHTML = '<p class="my-suite-profile-loading">중개사 정보를 불러오는 중입니다.</p>';

		const safeHtml = (value) => String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
		const statusLabel = (status) => {
			const value = getBrokerOfficeRowStatus({ status });
			if (value === "active") return "승인 완료";
			if (value === "new") return "가입 신청 진행중";
			if (value === "pending") return "승인 대기중";
			if (value === "rejected") return "반려";
			return "미신청";
		};
		const firstValue = (...values) => {
			const found = values.find((value) => String(value || "").trim());
			return found ? String(found).trim() : "";
		};
		const normalizeBrokerOffice = (office) => {
			const data = office || {};
			return {
				...data,
				office_name: firstValue(data.office_name, data.name, data.company_name),
				owner_name: firstValue(data.owner_name, data.representative, data.representative_name, data.owner),
				office_reg_no: firstValue(data.office_reg_no, data.license_no, data.reg_no, data.registration_no),
				office_address: firstValue(data.office_address, data.address, data.office_addr),
				phone: formatDisplayPhone(firstValue(data.phone, data.office_phone, data.tel)),
				email: firstValue(data.email, data.office_email),
				kakao_url: firstValue(data.kakao_url, data.kakaoUrl, data.kakao, data.kakao_open_chat, data.kakao_open_chat_url, data.open_chat_url)
			};
		};
		const fetchDetailedBrokerOffice = async (user, currentOffice, profile) => {
			const client = getRealjejuSupabaseClient();
			if (!client || !user || !user.id) return currentOffice || null;
			try {
				const rows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
				const list = (Array.isArray(rows) ? rows : []).filter((row) => row && row.status !== "deleted" && !row.deleted_at);
				const currentId = currentOffice && currentOffice.id ? String(currentOffice.id) : "";
				const detailed = (currentId ? list.find((row) => row && String(row.id || "") === currentId) : null)
					|| list.find((row) => row && getBrokerOfficeRowStatus(row) === "active" && (row.office_reg_no || row.office_address || row.email))
					|| list.find((row) => row && (row.office_reg_no || row.office_address || row.email))
					|| list.find((row) => row && getBrokerOfficeRowStatus(row) === "active")
					|| list[0]
					|| null;
				if (!detailed) return null;
				const mergedOffice = {
					...(currentOffice || {}),
					...detailed
				};
				const currentKakaoUrl = firstValue(
					currentOffice && currentOffice.kakao_url,
					currentOffice && currentOffice.kakaoUrl,
					currentOffice && currentOffice.kakao,
					currentOffice && currentOffice.kakao_open_chat,
					currentOffice && currentOffice.kakao_open_chat_url,
					currentOffice && currentOffice.open_chat_url
				);
				const mergedKakaoUrl = firstValue(
					mergedOffice.kakao_url,
					mergedOffice.kakaoUrl,
					mergedOffice.kakao,
					mergedOffice.kakao_open_chat,
					mergedOffice.kakao_open_chat_url,
					mergedOffice.open_chat_url
				);
				if (!mergedKakaoUrl && currentKakaoUrl) mergedOffice.kakao_url = currentKakaoUrl;
				return mergedOffice;
			} catch (err) {
				console.warn("마이페이지 중개사 상세 정보 조회 실패:", err);
				return currentOffice || null;
			}
		};
		const renderEmpty = (message, actionLabel, action, description) => {
			content.innerHTML = `
					<div class="myinfo-page-card my-suite-myinfo-card">
					<p class="my-suite-profile-loading">${safeHtml(message)}</p>
					${description ? `<p class="my-suite-profile-desc">${safeHtml(description)}</p>` : ""}
					${action ? `<div class="myinfo-page-actions"><button type="button" class="myinfo-page-primary" data-my-suite-action="${safeHtml(action)}">${safeHtml(actionLabel)}</button></div>` : ""}
				</div>
			`;
		};
		const renderBrokerCard = (brokerOffice) => {
			const office = normalizeBrokerOffice(brokerOffice);
			content.innerHTML = `
				<div class="myinfo-page-card my-suite-myinfo-card">
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">상태</span>
						<span class="myinfo-page-value">${safeHtml(statusLabel(office.status))}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">중개사무소명</span>
						<span class="myinfo-page-value">${safeHtml(office.office_name || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">대표자명</span>
						<span class="myinfo-page-value">${safeHtml(office.owner_name || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">등록번호</span>
						<span class="myinfo-page-value">${safeHtml(office.office_reg_no || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">주소</span>
						<span class="myinfo-page-value">${safeHtml(office.office_address || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">연락처</span>
						<span class="myinfo-page-value">${safeHtml(office.phone || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">이메일</span>
						<span class="myinfo-page-value">${safeHtml(office.email || "-")}</span>
					</div>
					<div class="myinfo-page-row">
						<span class="myinfo-page-label">카카오 오픈 채팅방</span>
						<span class="myinfo-page-value">${office.kakao_url ? `<a href="${safeHtml(office.kakao_url)}" target="_blank" rel="noopener noreferrer">${safeHtml(office.kakao_url)}</a>` : "-"}</span>
					</div>
					<div class="myinfo-page-actions">
						<button type="button" class="myinfo-page-primary" data-my-suite-action="broker-office-edit-inline">수정</button>
					</div>
				</div>
			`;
		};

		try {
			const { user, profile, brokerOffice } = await fetchMySuiteProfileAndBrokerOffice();
			if (!user) {
				renderEmpty("로그인 후 중개사 정보를 확인할 수 있습니다.", "로그인", "login");
				return;
			}
			const detailedBrokerOffice = await fetchDetailedBrokerOffice(user, brokerOffice || window.realjejuCurrentBrokerOffice || null, profile || null);
			if (!isRealjejuActiveSessionUser(user)) return;
			setRealjejuActiveSession(user, profile || null);
			window.realjejuCurrentBrokerOffice = detailedBrokerOffice || null;
			if (!detailedBrokerOffice) {
				renderEmpty(
					"등록된 중개사무소 정보가 없습니다.",
					"중개사무소 가입 신청",
					"broker-office-apply",
					"중개사무소 정보를 등록하면 매물 등록과 중개사 전용 기능을 이용할 수 있습니다."
				);
				return;
			}
			renderBrokerCard(detailedBrokerOffice);
		} catch (err) {
			console.warn("마이페이지 중개사 정보 로드 실패:", err);
			const brokerOffice = window.realjejuCurrentBrokerOffice || null;
			if (brokerOffice) renderBrokerCard(brokerOffice);
			else renderEmpty("중개사 정보를 표시하지 못했습니다.", "", "");
		}
	}

	function renderMySuiteContent(key)
	{
			if (key === "favorites") {
				renderRealjejuMySuiteFavoritesContent();
				return;
			}
		if (key === "inquiries") {
			renderMySuiteInquiriesContent();
			return;
		}
		if (key === "myinfo") {
			renderMySuiteProfileContent();
			return;
		}
		if (key === "broker-office") {
			renderMySuiteBrokerOfficeContent();
			return;
		}
		renderMySuiteBasicContent(key);
	}

	function openMySuitePage(tabKey)
	{
		const key = mySuiteTabCopy[tabKey] ? tabKey : "favorites";
		if (key === "favorites") {
			mySuiteFavoriteView = "active";
			setMySuiteFavoriteListingPage(1);
		}
		const panel = document.getElementById("mySuitePanel");
		if (!panel) return;
		const dropdown = document.getElementById("globalAccountDropdown");
		if (dropdown) {
			window.realjejuReleaseGlobalAccountDropdownFocus(dropdown);
			dropdown.classList.remove("open");
			dropdown.style.display = "none";
			dropdown.setAttribute("aria-hidden", "true");
		}
		if (typeof closeAuthModal === "function") closeAuthModal();
		document.body.classList.remove("broker-home-page-open", "admin-page-open", "property-register-page-open", "payment-page-open", "myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "profile-page-open", "notice-page-open");
		document.body.classList.add("sidebar-list-collapsed", "my-suite-page-open");
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (typeof sidebar !== "undefined" && sidebar) sidebar.classList.remove("expanded");
		["brokerHomePanel", "adminPagePanel", "propertyRegisterPage", "paymentPagePanel", "myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel", "noticePagePanel"].forEach((id) => {
			const el = document.getElementById(id);
			if (el) {
				if (id === "brokerHomePanel" && typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(el);
				el.setAttribute("aria-hidden", "true");
			}
		});
		panel.setAttribute("aria-hidden", "false");
		panel.style.display = "block";
		panel.style.zIndex = "120";
		panel.scrollTop = 0;
		document.querySelectorAll(".my-suite-tab").forEach((btn) => btn.classList.toggle("active", btn.dataset.mySuiteTab === key));
		renderMySuiteContent(key);
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.toggle("active", key === "favorites" && String(btn.textContent || "").trim() === "관심매물");
		});
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.add("profile-page-active");
	}
	window.openMySuitePage = openMySuitePage;

	document.addEventListener("click", async (e) => {
		const inquiryActionBtn = e.target.closest("[data-my-suite-inquiry-action]");
		if (inquiryActionBtn) {
			e.preventDefault();
			e.stopPropagation();
			if (inquiryActionBtn.dataset.mySuiteInquiryAction === "write") renderMySuiteInquiryForm();
			else renderMySuiteInquiriesContent();
			return;
		}

		const inquiryDeleteBtn = e.target.closest("[data-my-suite-inquiry-delete]");
		if (inquiryDeleteBtn) {
			e.preventDefault();
			e.stopPropagation();
			await deleteMySuiteInquiry(inquiryDeleteBtn.dataset.mySuiteInquiryDelete);
			return;
		}

		const inquiryToggle = e.target.closest("[data-my-suite-inquiry-toggle]");
		if (inquiryToggle) {
			e.preventDefault();
			e.stopPropagation();
			const item = inquiryToggle.closest(".my-suite-inquiry-item");
			if (item) item.classList.toggle("open");
			return;
		}

		const favoriteAreaToggle = e.target.closest("[data-my-suite-favorite-area-toggle]");
		if (favoriteAreaToggle) {
			toggleMySuiteFavoriteAreaUnit(e);
			return;
		}

		const favoriteViewBtn = e.target.closest("[data-favorite-view]");
		if (favoriteViewBtn) {
				e.preventDefault();
				e.stopPropagation();
				mySuiteFavoriteView = favoriteViewBtn.dataset.favoriteView === "trash" ? "trash" : "active";
				setMySuiteFavoriteListingPage(1);
				renderRealjejuMySuiteFavoritesContent();
				return;
			}

		const favoriteFilterMenuBtn = e.target.closest("[data-favorite-filter-menu]");
		if (favoriteFilterMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const type = favoriteFilterMenuBtn.dataset.favoriteFilterMenu === "deal" ? "deal" : "property";
			document.querySelectorAll("[data-favorite-filter-panel].open").forEach((menu) => {
				if (menu.dataset.favoriteFilterPanel !== type) menu.classList.remove("open");
			});
			const menu = document.querySelector(`[data-favorite-filter-panel="${type}"]`);
			if (menu) menu.classList.toggle("open");
			return;
		}

		const favoriteFilterOption = e.target.closest("[data-favorite-filter-option]");
		if (favoriteFilterOption) {
			e.stopPropagation();
			const type = favoriteFilterOption.dataset.favoriteFilterOption === "deal" ? "deal" : "property";
			const value = getFavoriteFilterLabel(favoriteFilterOption.dataset.value);
			const targetSet = type === "deal" ? mySuiteFavoriteDealFilter : mySuiteFavoritePropertyFilter;
			if (favoriteFilterOption.checked) targetSet.add(value);
			else targetSet.delete(value);
			setMySuiteFavoriteListingPage(1);
			renderRealjejuMySuiteFavoritesContent();
			return;
		}

		const favoriteFilterReset = e.target.closest("[data-favorite-filter-reset]");
		if (favoriteFilterReset) {
			e.preventDefault();
			e.stopPropagation();
			const type = favoriteFilterReset.dataset.favoriteFilterReset === "deal" ? "deal" : "property";
			if (type === "deal") mySuiteFavoriteDealFilter.clear();
			else mySuiteFavoritePropertyFilter.clear();
			setMySuiteFavoriteListingPage(1);
			renderRealjejuMySuiteFavoritesContent();
			return;
		}

		const favoritePageBtn = e.target.closest("[data-favorite-listing-page]");
		if (favoritePageBtn) {
			e.preventDefault();
			e.stopPropagation();
			setMySuiteFavoriteListingPage(favoritePageBtn.dataset.favoriteListingPage);
			closeFavoriteListingMenus();
			renderRealjejuMySuiteFavoritesContent();
			scrollMySuiteFavoritesToTop();
			return;
		}

		const favoriteFilterMenuArea = e.target.closest("[data-favorite-filter-panel]");
		if (favoriteFilterMenuArea) {
			e.stopPropagation();
			return;
		}

		const favoriteMenuBtn = e.target.closest("[data-favorite-menu]");
		if (favoriteMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const listingId = favoriteMenuBtn.dataset.favoriteMenu;
			const menu = document.querySelector(`[data-favorite-menu-panel="${CSS.escape(listingId)}"]`);
			const willOpen = menu && !menu.classList.contains("open");
			closeFavoriteListingMenus(listingId);
			if (menu) menu.classList.toggle("open", !!willOpen);
			return;
		}

		const favoriteActionBtn = e.target.closest("[data-favorite-action][data-listing-id]");
		if (favoriteActionBtn) {
			e.preventDefault();
			e.stopPropagation();
			if (favoriteActionBtn.disabled) return;
			favoriteActionBtn.disabled = true;
			const action = favoriteActionBtn.dataset.favoriteAction;
			const listingId = favoriteActionBtn.dataset.listingId;
			closeFavoriteListingMenus();
				if (action === "refresh") {
					await refreshFavoriteListingDate(listingId);
					renderRealjejuMySuiteFavoritesContent();
					return;
				}
			if (action === "delete") {
				if (mySuiteFavoriteView === "trash") {
					const trash = getFavoriteTrashSet();
					trash.delete(normalizeItemId(listingId));
					saveFavoriteTrashSet(trash);
				} else {
					await moveFavoriteListingToTrash(listingId);
				}
					renderRealjejuMySuiteFavoritesContent();
					syncFavoriteHeartButtons();
					return;
				}
				if (action === "permanent_delete") {
					await permanentlyDeleteFavoriteListing(listingId);
					renderRealjejuMySuiteFavoritesContent();
					syncFavoriteHeartButtons();
					return;
				}
				if (action === "restore") {
					const restored = await restoreFavoriteListingFromTrash(listingId);
					if (restored && !getFavoriteListingItems("trash").length) mySuiteFavoriteView = "active";
					renderRealjejuMySuiteFavoritesContent();
					syncFavoriteHeartButtons();
					return;
			}
			if (action === "unfavorite") {
				await setFavoriteListing(listingId, false);
				renderRealjejuMySuiteFavoritesContent();
				syncFavoriteHeartButtons();
				return;
			}
			if (action === "report") {
				favoriteActionBtn.disabled = false;
				openAuthErrorModal("허위매물 신고 기능은 준비중입니다.", "허위매물 신고", favoriteActionBtn);
			}
			return;
		}

			const favoriteRow = e.target.closest(".my-suite-favorite-row[data-favorite-listing-id]");
			if (favoriteRow && !e.target.closest("button")) {
				e.preventDefault();
				e.stopPropagation();
				const listingId = normalizeItemId(favoriteRow.dataset.favoriteListingId);
			const item = getFavoriteListingItems(mySuiteFavoriteView).find((entry) => normalizeItemId(entry && entry.id) === listingId) || { id: listingId };
			await openManagedListingDetailPanel(listingId, item);
				return;
			}
		});

		document.addEventListener("wheel", (e) => {
			if (!document.body.classList.contains("my-suite-page-open")) return;
			const wheelTarget = e.target;
			if (!wheelTarget || typeof wheelTarget.closest !== "function") return;
			if (!wheelTarget.closest(".my-suite-favorites-content")) return;
			if (wheelTarget.closest("#sidebarDetailPanel")) return;
			const panel = document.getElementById("mySuitePanel");
			if (!panel || !Number.isFinite(e.deltaY) || e.deltaY === 0) return;
			if (panel.scrollHeight <= panel.clientHeight) return;
			panel.scrollTop += e.deltaY;
			e.preventDefault();
		}, { passive: false });

		// PATCH 3.229: 중개사 홈 리스트 영역에서도 휠 스크롤을 패널로 확실히 전달
		document.addEventListener("wheel", (e) => {
			if (!document.body.classList.contains("broker-home-page-open")) return;
			const wheelTarget = e.target;
			if (!wheelTarget || typeof wheelTarget.closest !== "function") return;
			if (!wheelTarget.closest("#brokerHomePanel")) return;
			if (wheelTarget.closest("#sidebarDetailPanel")) return;
			const panel = document.getElementById("brokerHomePanel");
			if (!panel || !Number.isFinite(e.deltaY) || e.deltaY === 0) return;
			if (panel.scrollHeight <= panel.clientHeight) return;
			panel.scrollTop += e.deltaY;
			e.preventDefault();
		}, { passive: false });

		function getMySuiteEditFallbackProfile()
		{
			const cachedProfile = window.realjejuCurrentProfile || null;
		const fallbackProfile = cachedProfile ? { ...cachedProfile } : {};
		const rows = Array.from(document.querySelectorAll("#mySuiteContent .myinfo-page-row"));
		rows.forEach((row) => {
			const label = row.querySelector(".myinfo-page-label");
			const value = row.querySelector(".myinfo-page-value");
			const labelText = label ? label.textContent.trim() : "";
			const valueText = value ? value.textContent.trim() : "";
			if (!valueText) return;
			if (labelText === "이름") fallbackProfile.name = fallbackProfile.name || valueText;
			if (labelText === "휴대폰번호") fallbackProfile.phone = fallbackProfile.phone || valueText;
			if (labelText === "회원유형" && !fallbackProfile.role_request) {
				if (valueText === "법인") fallbackProfile.role_request = "corporation";
				else if (valueText === "대표 공인중개사") fallbackProfile.role_request = "agent";
				else if (valueText === "소속 공인중개사") fallbackProfile.role_request = "agent_sub";
				else if (valueText === "중개보조원") fallbackProfile.role_request = "agent_staff";
				else fallbackProfile.role_request = "user";
			}
		});
		const profileImage = document.getElementById("mySuiteProfileImage");
		if (profileImage && profileImage.src && !fallbackProfile.profile_image) fallbackProfile.profile_image = profileImage.src;
		return fallbackProfile;
	}

	function getMySuiteEditFallbackUser()
	{
		const cachedUser = window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null;
		if (cachedUser) return cachedUser;
		const rows = Array.from(document.querySelectorAll("#mySuiteContent .myinfo-page-row"));
		let email = "";
		rows.forEach((row) => {
			const label = row.querySelector(".myinfo-page-label");
			const value = row.querySelector(".myinfo-page-value");
			if (label && label.textContent.trim() === "이메일" && value) email = value.textContent.trim();
		});
		if (!email || email === "-") return null;
		return { id: "", email: email };
	}

	function renderMySuiteInlineProfileEditPage(profile, user)
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-content-profile";
		const safeHtml = (value) => String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
		const currentProfileImage = profile && profile.profile_image ? profile.profile_image : "";
		const phoneValue = profile && profile.phone ? String(profile.phone).replace(/\D/g, "") : "";
		const formattedPhone = phoneValue.length === 11
			? phoneValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
			: (profile && profile.phone ? profile.phone : "");
		mySuiteProfilePhotoFile = null;
		mySuiteProfilePhotoUrl = currentProfileImage;
		if (typeof window !== "undefined") window.authProfilePhotoUrl = currentProfileImage;
		const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";
		content.innerHTML = `
			<form class="myinfo-page-card my-suite-myinfo-card" id="mySuiteProfileEditForm">
				<div class="my-suite-profile-edit-photo-control">
					<div class="myinfo-page-photo-box my-suite-myinfo-photo-box">
						<img src="${safeHtml(currentProfileImage || fallbackImage)}" alt="프로필 사진" class="myinfo-page-photo" id="mySuiteProfileEditImage">
					</div>
					<button type="button" class="profile-suite-photo-btn" data-my-suite-action="profile-photo">프로필 사진 수정</button>
					<input type="file" id="mySuiteProfilePhotoInput" accept="image/*" hidden>
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteProfileNameInput">이름</label>
					<input type="text" class="profile-suite-input" id="mySuiteProfileNameInput" value="${safeHtml(profile && profile.name ? profile.name : "")}" autocomplete="name">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteProfileEmailInput">이메일</label>
					<input type="email" class="profile-suite-input" id="mySuiteProfileEmailInput" value="${safeHtml((user && user.email) || (profile && profile.email) || "")}" readonly>
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteProfilePhoneInput">휴대폰번호</label>
					<input type="tel" class="profile-suite-input" id="mySuiteProfilePhoneInput" value="${safeHtml(formattedPhone)}" autocomplete="tel" inputmode="numeric" maxlength="13" data-phone-auto-hyphen-bound="1" data-realjeju-phone-format-bound="1" data-realjeju-phone-backspace-bound="1">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteProfileRoleSelect">회원유형</label>
					<div class="auth-profile-select-wrap profile-suite-select-wrap">
						<select class="profile-suite-input" id="mySuiteProfileRoleSelect">
							<option value="user">일반회원</option>
							<option value="agent">대표 공인중개사</option>
							<option value="agent_sub">소속 공인중개사</option>
							<option value="agent_staff">중개보조원</option>
							<option value="corporation">법인</option>
						</select>
						<span class="auth-profile-select-arrow">▾</span>
					</div>
				</div>
				<div class="myinfo-page-actions">
					<button type="button" class="myinfo-page-secondary" data-my-suite-action="profile-cancel">취소</button>
					<button type="submit" class="myinfo-page-primary" data-my-suite-action="profile-save">저장</button>
				</div>
			</form>
		`;
		const roleSelect = document.getElementById("mySuiteProfileRoleSelect");
		if (roleSelect) roleSelect.value = profile && profile.role_request ? profile.role_request : "user";
		bindMySuitePhoneInput(document.getElementById("mySuiteProfilePhoneInput"));
	}

	async function openMySuiteProfileEdit()
	{
		const supabaseForProfile = getRealjejuSupabaseClient();
		let user = getMySuiteEditFallbackUser();
		let profile = getMySuiteEditFallbackProfile();

		if (supabaseForProfile) {
			try {
				const { data: userData } = await supabaseForProfile.auth.getUser();
				user = userData && userData.user ? userData.user : user;
			} catch (authError) {
				console.warn("마이페이지 내 정보 수정 로그인 조회 실패:", authError);
			}
		}

		if (!user) {
			closeMySuitePage();
			openAuthModal();
			return;
		}

		setRealjejuActiveSession(user, profile || null);
		if (supabaseForProfile && user.id) {
			try {
			const { data: loadedProfile } = await supabaseForProfile
				.from("profiles")
				.select("name, phone, role, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (!isRealjejuActiveSessionUser(user)) return;
			profile = loadedProfile || profile;
			} catch (profileError) {
				console.warn("마이페이지 내 정보 수정 프로필 조회 실패:", profileError);
			}
		}

		setRealjejuActiveSession(user, profile || null);
		renderMySuiteInlineProfileEditPage(profile, user);
	}

	async function saveMySuiteProfileEdit()
	{
		const nameInput = document.getElementById("mySuiteProfileNameInput");
		const phoneInput = document.getElementById("mySuiteProfilePhoneInput");
		const roleSelect = document.getElementById("mySuiteProfileRoleSelect");
		const saveBtn = document.querySelector('[data-my-suite-action="profile-save"]');
		const name = String(nameInput && nameInput.value || "").trim();
		const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
		const role = roleSelect && roleSelect.value ? roleSelect.value : "user";
		if (!name) return openAuthErrorModal("이름을 입력하세요.", "내 정보 수정", nameInput);
		if (!isValidRealjejuMobilePhone(phone)) return openAuthErrorModal("휴대폰번호를 정확히 입력하세요.", "내 정보 수정", phoneInput);
		const client = getRealjejuSupabaseClient();
		if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "내 정보 수정", nameInput);
		if (mySuiteProfileSaving) return;
		const originalSaveText = saveBtn ? saveBtn.textContent : "";
		try {
			mySuiteProfileSaving = true;
			if (saveBtn) {
				saveBtn.disabled = true;
				saveBtn.textContent = "저장 중...";
			}
			const { data: userData } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : (window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null);
			if (!user || !user.id) return openAuthErrorModal("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", "내 정보 수정", nameInput);
			if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "내 정보 수정", nameInput);
			const now = new Date().toISOString();
			const profileImage = await uploadMySuiteProfilePhotoIfNeeded(client, user.id) || mySuiteProfilePhotoUrl || window.authProfilePhotoUrl || (window.realjejuCurrentProfile && window.realjejuCurrentProfile.profile_image) || "";
			if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "내 정보 수정", nameInput);
			const profilePayload = {
				id: user.id,
				email: user.email || "",
				name: name,
				phone: phone,
				role_request: role,
				profile_completed: true,
				privacy_agreed_at: now,
				updated_at: now
			};
			if (profileImage) profilePayload.profile_image = profileImage;
			let result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
			if (result && result.error && /profile_image/i.test(String(result.error.message || ""))) {
				delete profilePayload.profile_image;
				result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
			}
			if (result && result.error) {
				console.error("마이페이지 내 정보 저장 실패:", result.error);
				return openAuthErrorModal("내 정보 저장에 실패했습니다.", "내 정보 수정", nameInput);
			}
			const savedProfile = {
				name: name,
				email: user.email || "",
				phone: phone,
				role_request: role,
				profile_completed: true,
				profile_image: profileImage
			};
			setRealjejuActiveSession(user, savedProfile);
			mySuiteProfilePhotoFile = null;
			mySuiteProfilePhotoUrl = profileImage;
			window.authProfilePhotoUrl = profileImage;
			renderMySuiteProfileContent();
		} catch (err) {
			console.error("마이페이지 내 정보 저장 오류:", err);
			openAuthErrorModal("내 정보 저장 중 오류가 발생했습니다.", "내 정보 수정", nameInput);
		} finally {
			mySuiteProfileSaving = false;
			if (saveBtn) {
				saveBtn.disabled = false;
				saveBtn.textContent = originalSaveText || "저장";
			}
		}
	}

	function renderMySuiteInlineBrokerOfficeEditPage(brokerOffice)
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-content-profile";
		const firstValue = (...values) => {
			const found = values.find((value) => String(value || "").trim());
			return found ? String(found).trim() : "";
		};
		const office = {
			...(brokerOffice || {}),
			office_name: firstValue(brokerOffice && brokerOffice.office_name, brokerOffice && brokerOffice.name, brokerOffice && brokerOffice.company_name),
			owner_name: firstValue(brokerOffice && brokerOffice.owner_name, brokerOffice && brokerOffice.representative, brokerOffice && brokerOffice.representative_name, brokerOffice && brokerOffice.owner),
			office_reg_no: firstValue(brokerOffice && brokerOffice.office_reg_no, brokerOffice && brokerOffice.license_no, brokerOffice && brokerOffice.reg_no, brokerOffice && brokerOffice.registration_no),
			office_address: firstValue(brokerOffice && brokerOffice.office_address, brokerOffice && brokerOffice.address, brokerOffice && brokerOffice.office_addr),
			phone: formatDisplayPhone(firstValue(brokerOffice && brokerOffice.phone, brokerOffice && brokerOffice.office_phone, brokerOffice && brokerOffice.tel)),
			email: firstValue(brokerOffice && brokerOffice.email, brokerOffice && brokerOffice.office_email),
			kakao_url: firstValue(brokerOffice && brokerOffice.kakao_url, brokerOffice && brokerOffice.kakaoUrl, brokerOffice && brokerOffice.kakao, brokerOffice && brokerOffice.kakao_open_chat, brokerOffice && brokerOffice.kakao_open_chat_url, brokerOffice && brokerOffice.open_chat_url)
		};
		const safeHtml = (value) => String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
		content.innerHTML = `
			<form class="myinfo-page-card my-suite-myinfo-card" id="mySuiteBrokerOfficeEditForm" data-agency-id="${safeHtml(office.id || "")}">
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerOfficeNameInput">중개사무소명</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerOfficeNameInput" value="${safeHtml(office.office_name)}">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerOwnerInput">대표자명</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerOwnerInput" value="${safeHtml(office.owner_name)}">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerRegNoInput">등록번호</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerRegNoInput" value="${safeHtml(office.office_reg_no)}">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerAddressInput">주소</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerAddressInput" value="${safeHtml(office.office_address)}">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerPhoneInput">연락처</label>
					<input type="tel" class="profile-suite-input" id="mySuiteBrokerPhoneInput" value="${safeHtml(office.phone)}" inputmode="numeric" maxlength="13" data-phone-auto-hyphen-bound="1" data-realjeju-phone-format-bound="1" data-realjeju-phone-backspace-bound="1">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerEmailInput">이메일</label>
					<input type="email" class="profile-suite-input" id="mySuiteBrokerEmailInput" value="${safeHtml(office.email)}">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerKakaoInput">카카오 오픈 채팅방</label>
					<input type="url" class="profile-suite-input" id="mySuiteBrokerKakaoInput" value="${safeHtml(office.kakao_url)}" autocomplete="url">
				</div>
				<div class="myinfo-page-actions">
					<button type="button" class="myinfo-page-secondary" data-my-suite-action="broker-office-cancel-inline">취소</button>
					<button type="submit" class="myinfo-page-primary" data-my-suite-action="broker-office-save-inline">저장</button>
				</div>
			</form>
		`;
		bindMySuitePhoneInput(document.getElementById("mySuiteBrokerPhoneInput"));
	}

	const MY_SUITE_BROKER_OFFICE_APPLY_ROLE_MESSAGE = "내 정보에서 회원유형을 중개사 또는 법인으로\n변경한 뒤 신청해 주세요.";
	const MY_SUITE_BROKER_OFFICE_EDIT_ROLE_MESSAGE = "내 정보에서 회원유형을 중개사 또는 법인으로\n변경한 뒤 신청해 주세요.";

	function isMySuiteBrokerRoleValue(role)
	{
		return isRealjejuBrokerRole(role);
	}

	async function requireMySuiteBrokerRoleForBrokerOffice(client, user, returnFocusTarget, options = {})
	{
		if (!client || !user || !user.id) return false;
		const modalTitle = options.title || "중개사 정보";
		const roleMessage = options.message || MY_SUITE_BROKER_OFFICE_APPLY_ROLE_MESSAGE;
		try {
			const { data: profile, error } = await client
				.from("profiles")
				.select("role_request")
				.eq("id", user.id)
				.maybeSingle();
			if (error) {
				console.error("마이페이지 중개사 정보 수정 회원유형 확인 실패:", error);
				openAuthErrorModal("회원유형 확인에 실패했습니다.", modalTitle, returnFocusTarget || null);
				return false;
			}
			const role = profile && profile.role_request ? profile.role_request : "";
			if (!isMySuiteBrokerRoleValue(role)) {
				openAuthErrorModal(roleMessage, modalTitle, returnFocusTarget || null);
				return false;
			}
			if (!isRealjejuActiveSessionUser(user)) return false;
			setRealjejuActiveSession(user, {
				...(window.realjejuCurrentProfile || {}),
				role_request: role
			});
			return true;
		} catch (err) {
			console.error("마이페이지 중개사 정보 수정 회원유형 확인 오류:", err);
			openAuthErrorModal("회원유형 확인 중 오류가 발생했습니다.", modalTitle, returnFocusTarget || null);
			return false;
		}
	}

	async function openMySuiteBrokerOfficeEdit()
	{
		let brokerOffice = window.realjejuCurrentBrokerOffice || null;
		try {
			const loaded = await fetchMySuiteProfileAndBrokerOffice();
			if (loaded && loaded.user) {
				if (!isRealjejuActiveSessionUser(loaded.user)) return;
				setRealjejuActiveSession(loaded.user, loaded.profile || null);
				if (!isMySuiteBrokerRoleValue(loaded.profile && loaded.profile.role_request)) {
					openAuthErrorModal(MY_SUITE_BROKER_OFFICE_EDIT_ROLE_MESSAGE, "중개사 정보", null);
					return;
				}
				brokerOffice = loaded.brokerOffice || brokerOffice;
				window.realjejuCurrentBrokerOffice = brokerOffice || null;
			}
		} catch (err) {
			console.warn("마이페이지 중개사 정보 수정 로드 실패:", err);
		}
		if (!brokerOffice) {
			openAuthErrorModal("수정할 중개사무소 정보가 없습니다.", "중개사 정보", null);
			return;
		}
		renderMySuiteInlineBrokerOfficeEditPage(brokerOffice);
	}

	function pickMySuiteUpdatedBrokerOfficeRow(rows, agencyId)
	{
		const list = (Array.isArray(rows) ? rows : []).filter((row) => row && row.status !== "deleted" && !row.deleted_at);
		const id = String(agencyId || "").trim();
		return (id ? list.find((row) => row && String(row.id || "") === id) : null)
			|| list.find((row) => row && getBrokerOfficeRowStatus(row) === "active")
			|| list[0]
			|| null;
	}

	async function saveMySuiteBrokerOfficeEdit()
	{
		const form = document.getElementById("mySuiteBrokerOfficeEditForm");
		const officeNameInput = document.getElementById("mySuiteBrokerOfficeNameInput");
		const ownerInput = document.getElementById("mySuiteBrokerOwnerInput");
		const regNoInput = document.getElementById("mySuiteBrokerRegNoInput");
		const addressInput = document.getElementById("mySuiteBrokerAddressInput");
		const phoneInput = document.getElementById("mySuiteBrokerPhoneInput");
		const emailInput = document.getElementById("mySuiteBrokerEmailInput");
		const kakaoInput = document.getElementById("mySuiteBrokerKakaoInput");
		const saveBtn = document.querySelector('[data-my-suite-action="broker-office-save-inline"]');
		const officeName = String(officeNameInput && officeNameInput.value || "").trim();
		const owner = String(ownerInput && ownerInput.value || "").trim();
		const regNo = String(regNoInput && regNoInput.value || "").trim();
		const address = String(addressInput && addressInput.value || "").trim();
		const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
		const email = String(emailInput && emailInput.value || "").trim();
		const kakaoUrl = String(kakaoInput && kakaoInput.value || "").trim();
		if (!officeName) return openAuthErrorModal("중개사무소명을 입력하세요.", "중개사 정보", officeNameInput);
		if (!owner) return openAuthErrorModal("대표자명을 입력하세요.", "중개사 정보", ownerInput);
		if (!regNo) return openAuthErrorModal("등록번호를 입력하세요.", "중개사 정보", regNoInput);
			if (!address) return openAuthErrorModal("주소를 입력하세요.", "중개사 정보", addressInput);
			if (!isValidRealjejuOfficePhone(phone)) return openAuthErrorModal("연락처를 정확히 입력하세요.", "중개사 정보", phoneInput);
			if (!email) return openAuthErrorModal("이메일을 입력하세요.", "중개사 정보", emailInput);
			if (!isValidRealjejuBrokerOfficeEmail(email)) return openAuthErrorModal("이메일 주소를 정확히 입력하세요.", "중개사 정보", emailInput);
			if (!isValidRealjejuKakaoOpenChatUrl(kakaoUrl)) return openAuthErrorModal("카카오 오픈 채팅방 주소는 http 또는 https로 시작해야 합니다.", "중개사 정보", kakaoInput);
			const client = getRealjejuSupabaseClient();
		if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "중개사 정보", officeNameInput);
		const originalSaveText = saveBtn ? saveBtn.textContent : "";
		try {
			if (saveBtn) {
				saveBtn.disabled = true;
				saveBtn.textContent = "저장 중...";
			}
			const { data: userData } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : (window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null);
			if (!user || !user.id) return openAuthModal();
			if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "중개사 정보", officeNameInput);
			const canEditBrokerOffice = await requireMySuiteBrokerRoleForBrokerOffice(client, user, officeNameInput, {
				title: "중개사 정보",
				message: MY_SUITE_BROKER_OFFICE_EDIT_ROLE_MESSAGE
			});
			if (!canEditBrokerOffice) return;
			const agencyId = form ? form.dataset.agencyId || "" : "";
			const agencyPayload = {
				office_name: officeName,
				owner_name: owner,
				office_reg_no: regNo,
				office_address: address,
				phone: phone,
				email: email,
				kakao_url: kakaoUrl
			};
			let updatedOffice = null;
			try {
				updatedOffice = await saveRealjejuAgencyProfile(client, agencyId, agencyPayload);
				if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "중개사 정보", officeNameInput);
			} catch (error) {
				console.error("마이페이지 중개사 정보 저장 실패:", error);
				if (isRealjejuKakaoUrlColumnError(error) || isRealjejuMissingKakaoRpcError(error)) {
					return openAuthErrorModal("중개사 정보 저장 기능이 아직 DB에 설치되지 않았습니다.\nsql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행해 주세요.", "중개사 정보", kakaoInput || officeNameInput);
				}
				if (isRealjejuAgencyNotFoundError(error)) return openAuthErrorModal("수정할 중개사무소를 찾지 못했습니다. 관리자 페이지에서 해당 계정 이메일과 중개사무소 이메일 연결 상태를 확인해 주세요.", "중개사 정보", officeNameInput);
				return openAuthErrorModal("중개사 정보 저장에 실패했습니다.", "중개사 정보", officeNameInput);
			}
			window.realjejuCurrentBrokerOffice = {
				...(window.realjejuCurrentBrokerOffice || {}),
				...(updatedOffice || {}),
				id: (updatedOffice && updatedOffice.id) || agencyId,
				user_id: (updatedOffice && updatedOffice.user_id) || user.id,
				office_name: officeName,
				owner_name: owner,
				office_reg_no: regNo,
				office_address: address,
				phone: phone,
				email: email,
				kakao_url: (updatedOffice && updatedOffice.kakao_url) || kakaoUrl,
				updated_at: updatedOffice && updatedOffice.updated_at
			};
			cacheMapListingAgency(window.realjejuCurrentBrokerOffice);
			renderMySuiteBrokerOfficeContent();
		} catch (err) {
			console.error("마이페이지 중개사 정보 저장 오류:", err);
			openAuthErrorModal("중개사 정보 저장 중 오류가 발생했습니다.", "중개사 정보", officeNameInput);
		} finally {
			if (saveBtn) {
				saveBtn.disabled = false;
				saveBtn.textContent = originalSaveText || "저장";
			}
		}
	}

	function getRealjejuCurrentUserEmail(user)
	{
		return String(
			(user && user.email)
			|| (window.realjejuCurrentAuthUser && window.realjejuCurrentAuthUser.email)
			|| (currentRealjejuAuthUser && currentRealjejuAuthUser.email)
			|| ""
		).trim();
	}

	function prefillBrokerOfficeApplyEmail(user, inputId = "brokerOwnerEmailLocalInput")
	{
		const emailInput = document.getElementById(inputId);
		if (!emailInput) return;
		const email = getRealjejuCurrentUserEmail(user);
		if (email) emailInput.value = email;
	}

	function getRealjejuCurrentProfilePhone(profile)
	{
		const raw = String(
			(profile && profile.phone)
			|| (window.realjejuCurrentProfile && window.realjejuCurrentProfile.phone)
			|| ""
		).trim();
		return formatDisplayPhone(raw) || formatRealjejuPhoneInputValue(raw);
	}

	function prefillBrokerOfficeApplyPhone(profile, inputId = "brokerOfficePhoneInput")
	{
		const phoneInput = document.getElementById(inputId);
		if (!phoneInput) return;
		const phone = getRealjejuCurrentProfilePhone(profile);
		if (phone) phoneInput.value = phone;
	}

	async function saveRealjejuOwnProfile(client, userId, profilePayload)
	{
		if (!client || !userId || !profilePayload) return { error: new Error("profile save context missing") };
		const updatePayload = { ...profilePayload };
		delete updatePayload.id;
		let result = await client.from("profiles").update(updatePayload).eq("id", userId).select("id").maybeSingle();
		if (result && !result.error && result.data && result.data.id) return result;
		if (result && result.error && /profile_image/i.test(String(result.error.message || ""))) {
			delete updatePayload.profile_image;
			delete profilePayload.profile_image;
			result = await client.from("profiles").update(updatePayload).eq("id", userId).select("id").maybeSingle();
			if (result && !result.error && result.data && result.data.id) return result;
		}
		return client.from("profiles").insert(profilePayload).select("id").maybeSingle();
	}

	function renderMySuiteBrokerOfficeApplyPage(user, profile)
	{
		const content = document.getElementById("mySuiteContent");
		if (!content) return;
		content.className = "my-suite-content my-suite-content-profile";
		content.innerHTML = `
			<form class="myinfo-page-card my-suite-myinfo-card" id="mySuiteBrokerOfficeApplyForm">
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyOfficeNameInput">중개사무소명</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerApplyOfficeNameInput" autocomplete="organization">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyOwnerInput">대표자명</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerApplyOwnerInput" autocomplete="name">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyRegNoInput">등록번호</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerApplyRegNoInput" autocomplete="off">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyAddressInput">주소</label>
					<input type="text" class="profile-suite-input" id="mySuiteBrokerApplyAddressInput" autocomplete="street-address">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyPhoneInput">연락처</label>
					<input type="tel" class="profile-suite-input" id="mySuiteBrokerApplyPhoneInput" inputmode="numeric" maxlength="13">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyEmailInput">이메일</label>
					<input type="email" class="profile-suite-input" id="mySuiteBrokerApplyEmailInput" autocomplete="email">
				</div>
				<div class="myinfo-page-row">
					<label class="myinfo-page-label" for="mySuiteBrokerApplyKakaoInput">카카오 오픈 채팅방</label>
					<input type="url" class="profile-suite-input" id="mySuiteBrokerApplyKakaoInput" autocomplete="url">
				</div>
				<div class="myinfo-page-actions">
					<button type="button" class="myinfo-page-secondary" data-my-suite-action="broker-office-cancel-inline">취소</button>
					<button type="submit" class="myinfo-page-primary" data-my-suite-action="broker-office-apply-submit">가입 신청</button>
				</div>
			</form>
		`;
		bindMySuitePhoneInput(document.getElementById("mySuiteBrokerApplyPhoneInput"));
		prefillBrokerOfficeApplyEmail(user, "mySuiteBrokerApplyEmailInput");
		prefillBrokerOfficeApplyPhone(profile, "mySuiteBrokerApplyPhoneInput");
	}

	async function saveMySuiteBrokerOfficeApply()
	{
		const officeNameInput = document.getElementById("mySuiteBrokerApplyOfficeNameInput");
		const ownerInput = document.getElementById("mySuiteBrokerApplyOwnerInput");
		const regNoInput = document.getElementById("mySuiteBrokerApplyRegNoInput");
		const addressInput = document.getElementById("mySuiteBrokerApplyAddressInput");
		const phoneInput = document.getElementById("mySuiteBrokerApplyPhoneInput");
		const emailInput = document.getElementById("mySuiteBrokerApplyEmailInput");
		const kakaoInput = document.getElementById("mySuiteBrokerApplyKakaoInput");
		const submitBtn = document.querySelector('[data-my-suite-action="broker-office-apply-submit"]');
		const officeName = String(officeNameInput && officeNameInput.value || "").trim();
		const ownerName = String(ownerInput && ownerInput.value || "").trim();
		const licenseNo = String(regNoInput && regNoInput.value || "").trim();
		const address = String(addressInput && addressInput.value || "").trim();
		const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
		const email = String(emailInput && emailInput.value || "").trim();
		const kakaoUrl = String(kakaoInput && kakaoInput.value || "").trim();
		if (!officeName) return openAuthErrorModal("중개사무소명을 입력하세요.", "중개사무소 가입 신청", officeNameInput);
		if (!ownerName) return openAuthErrorModal("대표자명을 입력하세요.", "중개사무소 가입 신청", ownerInput);
		if (!licenseNo) return openAuthErrorModal("등록번호를 입력하세요.", "중개사무소 가입 신청", regNoInput);
		if (!address) return openAuthErrorModal("주소를 입력하세요.", "중개사무소 가입 신청", addressInput);
			if (!phone) return openAuthErrorModal("연락처를 입력하세요.", "중개사무소 가입 신청", phoneInput);
			if (!isValidRealjejuOfficePhone(phone)) return openAuthErrorModal("연락처를 정확히 입력하세요.", "중개사무소 가입 신청", phoneInput);
			if (!email) return openAuthErrorModal("이메일을 입력하세요.", "중개사무소 가입 신청", emailInput);
			if (!isValidRealjejuBrokerOfficeEmail(email)) return openAuthErrorModal("이메일 주소를 정확히 입력하세요.", "중개사무소 가입 신청", emailInput);
			if (!isValidRealjejuKakaoOpenChatUrl(kakaoUrl)) return openAuthErrorModal("카카오 오픈 채팅방 주소는 http 또는 https로 시작해야 합니다.", "중개사무소 가입 신청", kakaoInput);
			const client = getRealjejuSupabaseClient();
		if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "중개사무소 가입 신청", null);
		const originalText = submitBtn ? submitBtn.textContent : "";
		try {
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = "신청 중...";
			}
			const { data: userData } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : (window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null);
			if (!user || !user.id) return openAuthModal();
			const canApplyBrokerOffice = await requireMySuiteBrokerRoleForBrokerOffice(client, user, officeNameInput, {
				title: "중개사무소 가입 신청",
				message: MY_SUITE_BROKER_OFFICE_APPLY_ROLE_MESSAGE
			});
			if (!canApplyBrokerOffice) return;
			const { data: existingAgency, error: existingAgencyError } = await client
				.from("agencies")
				.select("id")
				.eq("user_id", user.id)
				.or("status.is.null,status.neq.deleted")
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();
			if (existingAgencyError) {
				console.error("중개사무소 신청 여부 확인 실패:", existingAgencyError);
				return openAuthErrorModal("중개사무소 신청 여부 확인에 실패했습니다.", "중개사무소 가입 신청", null);
			}
			if (existingAgency) return openAuthErrorModal("이미 중개사무소 가입 신청이 접수되었습니다.", "중개사무소 가입 신청", null);
			const { error } = await client.from("agencies").insert({
				user_id: user.id,
				office_name: officeName,
				owner_name: ownerName,
				office_reg_no: licenseNo,
				office_address: address,
				phone: phone,
				email: email,
				...(kakaoUrl ? { kakao_url: kakaoUrl } : {}),
				status: "waiting",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			});
			if (error) {
				console.error("중개사무소 신청 실패:", error);
				if (isRealjejuKakaoUrlColumnError(error)) return openAuthErrorModal(REALJEJU_KAKAO_URL_COLUMN_MESSAGE, "중개사무소 가입 신청", kakaoInput || officeNameInput);
				return openAuthErrorModal("중개사무소 신청 저장에 실패했습니다.", "중개사무소 가입 신청", null);
			}
			openAuthErrorModal("중개사무소 가입 신청이 접수되었습니다.", "중개사무소 가입 신청", null, function () {
				renderMySuiteBrokerOfficeContent();
			});
		} catch (err) {
			console.error("중개사무소 신청 오류:", err);
			openAuthErrorModal("중개사무소 신청 중 오류가 발생했습니다.", "중개사무소 가입 신청", null);
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = originalText || "가입 신청";
			}
		}
	}

		async function openBrokerOfficeApplyFromMySuite()
		{
			const active = document.activeElement;
			if (active && typeof active.blur === "function") active.blur();
			const client = getRealjejuSupabaseClient();
			if (!client) {
				openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "중개사무소 가입 신청", null);
				return;
			}
			try {
				const { data: userData } = await client.auth.getUser();
				const user = userData && userData.user ? userData.user : (window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null);
				if (!user || !user.id) {
					openAuthModal();
					return;
				}
				const canApplyBrokerOffice = await requireMySuiteBrokerRoleForBrokerOffice(client, user, null, {
					title: "중개사무소 가입 신청",
					message: MY_SUITE_BROKER_OFFICE_APPLY_ROLE_MESSAGE
				});
				if (!canApplyBrokerOffice) return;
				let profile = window.realjejuCurrentProfile || null;
				if (!profile || !profile.phone) {
					try {
						const { data: profileData } = await client
							.from("profiles")
							.select("phone")
							.eq("id", user.id)
							.maybeSingle();
						if (profileData) profile = { ...(profile || {}), ...profileData };
					} catch (profileErr) {
						console.warn("중개사무소 가입 신청 전화번호 자동 입력 조회 실패:", profileErr);
					}
				}
				renderMySuiteBrokerOfficeApplyPage(user, profile);
			} catch (err) {
				console.warn("마이페이지 중개사무소 가입 신청 회원유형 확인 실패:", err);
				openAuthErrorModal("회원유형 확인 중 오류가 발생했습니다.", "중개사무소 가입 신청", null);
			}
		}

	window.openMySuitePage = openMySuitePage;

	document.addEventListener("click", (e) => {
		const mySuiteAction = e.target.closest("[data-my-suite-action]");
		if (mySuiteAction) {
			e.preventDefault();
			e.stopPropagation();
			if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
			const action = mySuiteAction.dataset.mySuiteAction;
			if (action === "login") {
				closeMySuitePage();
				openAuthModal();
				return;
			}
			if (action === "profile-edit") {
				openMySuiteProfileEdit();
				return;
			}
			if (action === "profile-photo") {
				const photoInput = document.getElementById("mySuiteProfilePhotoInput");
				if (photoInput) photoInput.click();
				return;
			}
			if (action === "profile-cancel") {
				renderMySuiteProfileContent();
				return;
			}
			if (action === "profile-save") {
				saveMySuiteProfileEdit();
				return;
			}
			if (action === "broker-office-edit-inline") {
				openMySuiteBrokerOfficeEdit();
				return;
			}
			if (action === "broker-office-cancel-inline") {
				renderMySuiteBrokerOfficeContent();
				return;
			}
			if (action === "broker-office-save-inline") {
				saveMySuiteBrokerOfficeEdit();
				return;
			}
			if (action === "broker-office-apply-submit") {
				saveMySuiteBrokerOfficeApply();
				return;
			}
			if (action === "broker-office-info") {
				closeMySuitePage();
				openBrokerOfficeInfoFromAccountMenu();
				return;
			}
			if (action === "broker-office-apply") {
				openBrokerOfficeApplyFromMySuite();
				return;
			}
			if (action === "broker-office-pending") {
				openAuthErrorModal("현재 승인 대기중입니다.", "중개사무소", null);
				return;
			}
		}

		if (e.target && e.target.id === "mySuiteProfilePhotoInput") return;

		const mySuiteTab = e.target.closest(".my-suite-tab[data-my-suite-tab]");
		if (mySuiteTab) {
			e.preventDefault();
			openMySuitePage(mySuiteTab.dataset.mySuiteTab);
			return;
		}

	});

	document.addEventListener("change", (e) => {
		if (!e.target || e.target.id !== "mySuiteProfilePhotoInput") return;
		const input = e.target;
		const file = input.files && input.files[0] ? input.files[0] : null;
		if (!file) return;
		if (!/^image\//.test(file.type || "")) {
			openAuthErrorModal("이미지 파일만 선택할 수 있습니다.", "프로필 사진", input);
			input.value = "";
			mySuiteProfilePhotoFile = null;
			return;
		}
		mySuiteProfilePhotoFile = file;
		const reader = new FileReader();
		reader.onload = () => {
			const preview = document.getElementById("mySuiteProfileEditImage");
			if (preview) preview.src = reader.result;
			mySuiteProfilePhotoUrl = "";
		};
		reader.readAsDataURL(file);
	}, true);

	document.addEventListener("submit", (e) => {
		if (e.target && e.target.id === "mySuiteInquiryForm") {
			e.preventDefault();
			submitMySuiteInquiry(e.target);
			return;
		}
		if (e.target && e.target.matches("[data-my-suite-inquiry-reply-form]")) {
			e.preventDefault();
			submitMySuiteInquiryReply(e.target);
			return;
		}
		if (e.target && e.target.id === "mySuiteProfileEditForm") {
			e.preventDefault();
			saveMySuiteProfileEdit();
		}
		if (e.target && e.target.id === "mySuiteBrokerOfficeEditForm") {
			e.preventDefault();
			saveMySuiteBrokerOfficeEdit();
		}
		if (e.target && e.target.id === "mySuiteBrokerOfficeApplyForm") {
			e.preventDefault();
			saveMySuiteBrokerOfficeApply();
		}
	});

	document.addEventListener("input", (e) => {
		if (e.target && e.target.id === "mySuiteInquiryMessageInput") {
			updateMySuiteInquiryMessageCounter();
		}
	});

	document.addEventListener("click", (e) => {
		if (!detailShareMenu) return;
		if (e.target.closest("#detailShareBtn") || e.target.closest("#detailShareMenu")) return;
		closeShareMenu();
	});

	window.addEventListener("resize", closeShareMenu);
	window.addEventListener("scroll", closeShareMenu, true);

	detailHeroPrevBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		prevHeroSlide();
	});

	detailHeroNextBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		nextHeroSlide();
	});

	detailHeroDots.addEventListener("click", (e) => {
		const btn = e.target.closest(".detail-hero-dot");
		if (!btn) return;
		const index = Number(btn.dataset.index);
		setHeroSlide(index);
	});

	detailHero.addEventListener("click", () => {
		openDetailImageLightbox();
	});

	if (detailSimilarGrid) {
		detailSimilarGrid.addEventListener("click", async (e) => {
			const btn = e.target.closest("[data-similar-id]");
			if (!btn) return;
			e.preventDefault();
			e.stopPropagation();

			const id = normalizeItemId(btn.dataset.similarId);
			const item = (state.all || []).find(candidate => normalizeItemId(candidate.id) === id);
			if (!item) return;

			await moveMapToProperty(item);
			await openDetailPanel(item, { syncUrl: true, forceOpen: true });
			if (detailScroll) detailScroll.scrollTop = 0;
		});
	}

	detailImageLightboxPrev.addEventListener("click", (e) => {
		e.stopPropagation();
		prevLightboxImage();
	});

	detailImageLightboxNext.addEventListener("click", (e) => {
		e.stopPropagation();
		nextLightboxImage();
	});

	detailImageLightboxClose.addEventListener("click", closeDetailImageLightbox);

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			if (authModal && authModal.classList.contains("open")) {
				closeAuthModal();
				return;
			}
			closeDetailImageLightbox();
			return;
		}

		if (detailImageLightbox.classList.contains("open")) {
			if (e.key === "ArrowLeft") prevLightboxImage();
			if (e.key === "ArrowRight") nextLightboxImage();
			return;
		}

		if (sidebar.classList.contains("expanded")) {
			if (e.key === "ArrowLeft") prevHeroSlide();
			if (e.key === "ArrowRight") nextHeroSlide();
		}
	});

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

	function closePriceFilterMenu()
	{
		if (!priceFilterDropdown || !priceFilterTrigger) return;
		priceFilterDropdown.classList.remove("open");
		priceFilterTrigger.setAttribute("aria-expanded", "false");
	}

	function syncDealMethodFilterUI()
	{
		if (!dealMethodFilterDropdown) return;
		const method = selectedDealMethod || "all";
		const hasActive = method !== "all";
		dealMethodFilterDropdown.classList.toggle("has-active", hasActive);

		if (dealMethodFilterLabel) {
			dealMethodFilterLabel.textContent = method === "broker"
			? "공인중개사 매물"
			: method === "direct"
			? "개인직거래 매물"
			: "거래 방식";
		}

		(dealMethodInputs || []).forEach(input => {
			input.checked = (input.value || "all") === method;
		});
	}

	function syncPriceFilterUI()
	{
		if (!priceFilterDropdown) return;
		const activeDeals = selectedDeal instanceof Set ? Array.from(selectedDeal) : [];
		if (activeDeals.length !== 1 && selectedPriceRange !== "all") selectedPriceRange = "all";
		const activeDeal = activeDeals.length === 1 ? activeDeals[0] : "";
		const config = getPriceFilterConfigForDeal(activeDeal);
		const hasActive = !!config && selectedPriceRange && selectedPriceRange !== "all";
		priceFilterDropdown.classList.toggle("has-active", hasActive);

		if (priceFilterLabel) {
			if (hasActive) {
				const range = getPriceFilterRange(selectedPriceRange, activeDeal);
				priceFilterLabel.textContent = range ? range.label : "가격";
			} else {
				priceFilterLabel.textContent = "가격";
			}
		}

		if (!priceFilterOptions || !priceFilterMessage) return;
		priceFilterOptions.innerHTML = "";

		if (activeDeals.length === 0) {
			priceFilterMessage.textContent = "거래 유형을 선택해 주세요.";
			priceFilterMessage.style.display = "block";
			return;
		}

		if (activeDeals.length > 1) {
			priceFilterMessage.textContent = "거래 유형을 하나만 선택해 주세요.";
			priceFilterMessage.style.display = "block";
			return;
		}

		if (!config) {
			priceFilterMessage.textContent = "가격 구간이 없는 거래 유형입니다.";
			priceFilterMessage.style.display = "block";
			return;
		}

		priceFilterMessage.style.display = "none";
		const rows = [
			{ value: "all", label: "전체" },
			...config.ranges
		];
		priceFilterOptions.innerHTML = `
			<div class="price-filter-title">${config.label}</div>
			${rows.map(row => `
				<label class="extra-filter-option price-filter-option">
					<input type="radio" name="priceFilter" value="${row.value}" ${selectedPriceRange === row.value || (!selectedPriceRange && row.value === "all") ? "checked" : ""} />
					<span>${row.label}</span>
				</label>
			`).join("")}
		`;
	}

	function closeExtraFilterMenu()
	{
		if (!extraFilterDropdown || !extraFilterTrigger) return;
		extraFilterDropdown.classList.remove("open");
		extraFilterTrigger.setAttribute("aria-expanded", "false");
	}

	function closeApprovalYearFilterMenu()
	{
		if (!approvalYearFilterDropdown || !approvalYearFilterTrigger) return;
		approvalYearFilterDropdown.classList.remove("open");
		approvalYearFilterTrigger.setAttribute("aria-expanded", "false");
	}

	function syncApprovalYearFilterUI()
	{
		if (!approvalYearFilterLabel) return;
		const checked = document.querySelector('input[name="approvalYear"]:checked');
		const value = checked ? checked.value : "all";
		const labelMap = {
			all: "사용승인일",
			1: "1년 이내 신축",
			5: "5년 이내",
			10: "10년 이내",
			15: "15년 이내",
			old: "15년 이상"
		};
		approvalYearFilterLabel.textContent = labelMap[value] || "사용승인일";
		if (approvalYearFilterDropdown) approvalYearFilterDropdown.classList.toggle("has-active", value !== "all");
	}

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

	function handleExtraConditionChange()
	{
		selectedParkingOnly = !!extraParkingChk?.checked;
		selectedPetOnly = !!extraPetChk?.checked;
		selectedCityGasOnly = !!extraCityGasChk?.checked;
		selectedDuplexOnly = !!extraDuplexChk?.checked;
		selectedVerandaOnly = !!extraVerandaChk?.checked;
		selectedElevatorOnly = !!extraElevatorChk?.checked;
		selectedFullOptionOnly = !!extraFullOptionChk?.checked;
		selectedImmediateMoveInOnly = !!extraImmediateMoveInChk?.checked;
		selectedOceanViewOnly = !!extraOceanViewChk?.checked;
		syncExtraFilterUI();

		closeDetailPanel();
		currentDetailItem = null;
		state.selectedMarkerId = null;
		state.selectedClusterKey = null;
		state.selectionMode = null;

		applyFilter();
		syncLeftAllButtonToMapFilters();
	}

	if (typeFilterTrigger) {
		typeFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeDealFilterMenu();
			closeDealMethodFilterMenu();
			closePriceFilterMenu();
			closeExtraFilterMenu();
			closeApprovalYearFilterMenu();
			const willOpen = !typeFilterDropdown.classList.contains("open");
			typeFilterDropdown.classList.toggle("open", willOpen);
			typeFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (typeFilterMenu) {
		typeFilterMenu.addEventListener("click", (e) => e.stopPropagation());
	}

	if (dealFilterTrigger) {
		dealFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeTypeFilterMenu();
			closeDealMethodFilterMenu();
			closePriceFilterMenu();
			closeExtraFilterMenu();
			closeApprovalYearFilterMenu();
			const willOpen = !dealFilterDropdown.classList.contains("open");
			dealFilterDropdown.classList.toggle("open", willOpen);
			dealFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (dealFilterMenu) {
		dealFilterMenu.addEventListener("click", (e) => e.stopPropagation());
	}

	if (dealMethodFilterTrigger) {
		dealMethodFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeTypeFilterMenu();
			closeDealFilterMenu();
			closePriceFilterMenu();
			closeExtraFilterMenu();
			closeApprovalYearFilterMenu();
			const willOpen = !dealMethodFilterDropdown.classList.contains("open");
			dealMethodFilterDropdown.classList.toggle("open", willOpen);
			dealMethodFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (dealMethodFilterMenu) {
		dealMethodFilterMenu.addEventListener("click", (e) => e.stopPropagation());
	}

	if (priceFilterTrigger) {
		priceFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeDealFilterMenu();
			closeTypeFilterMenu();
			closeDealMethodFilterMenu();
			closeExtraFilterMenu();
			closeApprovalYearFilterMenu();
			syncPriceFilterUI();
			const willOpen = !priceFilterDropdown.classList.contains("open");
			priceFilterDropdown.classList.toggle("open", willOpen);
			priceFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (priceFilterMenu) {
		priceFilterMenu.addEventListener("click", (e) => e.stopPropagation());
		priceFilterMenu.addEventListener("change", (e) => {
			const input = e.target && e.target.matches ? e.target.closest('input[name="priceFilter"]') : null;
			if (!input || !input.checked) return;
			selectedPriceRange = input.value || "all";
			syncPriceFilterUI();
			closePriceFilterMenu();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	}

	if (approvalYearFilterTrigger) {
		approvalYearFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeDealFilterMenu();
			closeTypeFilterMenu();
			closeDealMethodFilterMenu();
			closePriceFilterMenu();
			closeExtraFilterMenu();
			const willOpen = !approvalYearFilterDropdown.classList.contains("open");
			approvalYearFilterDropdown.classList.toggle("open", willOpen);
			approvalYearFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (approvalYearFilterMenu) {
		approvalYearFilterMenu.addEventListener("click", (e) => e.stopPropagation());
	}

	(approvalYearInputs || []).forEach(input => {
		if (!input) return;
		input.addEventListener("change", () => {
			syncApprovalYearFilterUI();
			closeApprovalYearFilterMenu();
		});
	});

	if (extraFilterTrigger) {
		extraFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeDealFilterMenu();
			closeTypeFilterMenu();
			closeDealMethodFilterMenu();
			closePriceFilterMenu();
			closeApprovalYearFilterMenu();
			const willOpen = !extraFilterDropdown.classList.contains("open");
			extraFilterDropdown.classList.toggle("open", willOpen);
			extraFilterTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
		});
	}

	if (extraFilterMenu) {
		extraFilterMenu.addEventListener("click", (e) => e.stopPropagation());
	}

	[
	extraParkingChk,
	extraPetChk,
	extraCityGasChk,
	extraDuplexChk,
	extraVerandaChk,
	extraElevatorChk,
	extraFullOptionChk,
	extraImmediateMoveInChk,
	extraOceanViewChk
	].forEach(input => {
		if (!input) return;
		input.addEventListener("change", handleExtraConditionChange);
	});

	if (extraFilterResetBtn) {
		extraFilterResetBtn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (extraParkingChk) extraParkingChk.checked = false;
			if (extraPetChk) extraPetChk.checked = false;
			if (extraCityGasChk) extraCityGasChk.checked = false;
			if (extraDuplexChk) extraDuplexChk.checked = false;
			if (extraVerandaChk) extraVerandaChk.checked = false;
			if (extraElevatorChk) extraElevatorChk.checked = false;
			if (extraFullOptionChk) extraFullOptionChk.checked = false;
			if (extraImmediateMoveInChk) extraImmediateMoveInChk.checked = false;
			if (extraOceanViewChk) extraOceanViewChk.checked = false;

			handleExtraConditionChange();
		});
	}

	syncApprovalYearFilterUI();

	document.addEventListener("click", (e) => {
		if (typeFilterDropdown && !typeFilterDropdown.contains(e.target)) {
			closeTypeFilterMenu();
		}
		if (dealFilterDropdown && !dealFilterDropdown.contains(e.target)) {
			closeDealFilterMenu();
		}
		if (dealMethodFilterDropdown && !dealMethodFilterDropdown.contains(e.target)) {
			closeDealMethodFilterMenu();
		}
		if (priceFilterDropdown && !priceFilterDropdown.contains(e.target)) {
			closePriceFilterMenu();
		}
		if (approvalYearFilterDropdown && !approvalYearFilterDropdown.contains(e.target)) {
			closeApprovalYearFilterMenu();
		}
		if (extraFilterDropdown && !extraFilterDropdown.contains(e.target)) {
			closeExtraFilterMenu();
		}
	});


	function resetFilterSelectionState()
	{
		closeDetailPanel();
		currentDetailItem = null;
		state.selectedMarkerId = null;
		state.selectedClusterKey = null;
		state.selectionMode = null;
	}

	dealMethodInputs.forEach(input => {
		input.addEventListener("change", () => {
			if (!input.checked) return;
			selectedDealMethod = input.value || "all";
			syncDealMethodFilterUI();
			state.initialRandomListActive = false;
			resetFilterSelectionState();
			scrollListToTop();
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	});

	dealButtons.forEach(input => {
		input.addEventListener("change", () => {
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

			selectedPriceRange = "all";
			syncDealFilterUI();
			syncPriceFilterUI();
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
			selectedPriceRange = "all";
			syncDealFilterUI();
			syncPriceFilterUI();
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
	syncPriceFilterUI();
	syncExtraFilterUI();

	(featureButtons || []).forEach(btn => {
		btn.addEventListener("click", () => {
			const value = btn.dataset.value;

			state.selectedFeatures.clear();

			if (value === "all") {
				selectedDeal.clear();
				selectedType.clear();
				selectedDealMethod = "all";
				selectedPriceRange = "all";
				syncDealFilterUI();
				syncTypeFilterUI();
				syncDealMethodFilterUI();
				syncPriceFilterUI();
				selectedPetOnly = false;
				selectedParkingOnly = false;
				selectedCityGasOnly = false;
				selectedDuplexOnly = false;
				selectedVerandaOnly = false;
				selectedElevatorOnly = false;
				selectedFullOptionOnly = false;
				selectedImmediateMoveInOnly = false;
				selectedOceanViewOnly = false;
				syncExtraFilterUI();
			} else {
				state.selectedFeatures.add(value);
			}

			state.initialRandomListActive = false;
			syncFeatureButtons();
			closeDetailPanel();
			currentDetailItem = null;
			state.selectedMarkerId = null;
			state.selectedClusterKey = null;
			state.selectionMode = null;
			applyFilter();
			syncLeftAllButtonToMapFilters();
		});
	});

	window.addEventListener("resize", () => {
		if (!state.map) return;
		state.map.relayout();
	});
}

function getDetailShareUrl()
{
	if (currentDetailItem && currentDetailItem.id != null) {
		return getDetailUrlById(currentDetailItem.id).href;
	}
	if (currentDetailItem && currentDetailItem.link && currentDetailItem.link !== "#") {
		try {
			return new URL(currentDetailItem.link, location.href).href;
		} catch (err) {
			return currentDetailItem.link;
		}
	}
	return location.href;
}

function getDetailShareTitle()
{
	return currentDetailItem && currentDetailItem.title
	? currentDetailItem.title
	: "제주 프리미엄 부동산";
}

function getDetailShareText()
{
	const parts = [];
	const title = getDetailShareTitle();
	const deal = currentDetailItem?.dealType || currentDetailItem?.deal || "";
	const price = currentDetailItem?.priceText || currentDetailItem?.price || "";
	const address = currentDetailItem?.address || currentDetailItem?.roadAddress || "";

	parts.push(`[REALJEJU.APP] ${title}`);
	if (deal || price) {
		parts.push([deal, price].filter(Boolean).join(" "));
	}
	if (address) {
		parts.push(address);
	}
	parts.push(getDetailShareUrl());
	return parts.filter(Boolean).join("\n");
}

function getDetailShareDescription()
{
	const deal = currentDetailItem?.dealType || currentDetailItem?.deal || "";
	const price = currentDetailItem?.priceText || currentDetailItem?.price || "";
	const address = currentDetailItem?.address || currentDetailItem?.roadAddress || "";
	return [[deal, price].filter(Boolean).join(" "), address].filter(Boolean).join(" · ") || "REALJEJU.APP 매물 정보";
}

function getDetailShareImageUrl()
{
	const image = Array.isArray(currentDetailItem?.images) && currentDetailItem.images.length
		? currentDetailItem.images[0]
		: currentDetailItem?.image;
	if (!image) return "";
	try {
		const url = new URL(image, location.href);
		return /^https?:$/i.test(url.protocol) ? url.href : "";
	} catch (err) {
		return "";
	}
}

function ensureKakaoShareReady()
{
	if (!window.Kakao) return false;
	try {
		if (typeof window.Kakao.isInitialized === "function" && !window.Kakao.isInitialized()) {
			window.Kakao.init(REALJEJU_KAKAO_JS_KEY);
		}
		return !!(window.Kakao.Share && typeof window.Kakao.Share.sendDefault === "function");
	} catch (err) {
		console.error("카카오 공유 초기화 실패:", err);
		return false;
	}
}

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

function showShareCopiedFeedback(success)
{
	if (!detailShareFeedback) return;
	detailShareFeedback.textContent = success ? "복사됨" : "실패";
	setTimeout(() => {
		detailShareFeedback.textContent = "";
	}, 1200);
}

window.shareDetailCopy = async function (event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const ok = await copyTextWithFallback(getDetailShareUrl());
	showShareCopiedFeedback(ok);
};

window.shareDetailKakao = async function (event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}

	const shareUrl = getDetailShareUrl();
	try {
		if (/^https?:\/\//i.test(shareUrl) && ensureKakaoShareReady()) {
			const title = getDetailShareTitle();
			const description = getDetailShareDescription();
			const imageUrl = getDetailShareImageUrl();
			const link = {
				mobileWebUrl: shareUrl,
				webUrl: shareUrl
			};

			window.Kakao.Share.sendDefault({
				objectType: "feed",
				content: {
					title,
					description,
					imageUrl: imageUrl || "https://realjeju.app/og-image.png",
					link
				},
				buttons: [
					{
						title: "매물 보기",
						link
					}
				]
			});
			if (typeof closeShareMenu === "function") closeShareMenu();
			return;
		}

		if (navigator.share) {
			await navigator.share({
				title: getDetailShareTitle(),
				text: getDetailShareDescription(),
				url: shareUrl
			});
			if (typeof closeShareMenu === "function") closeShareMenu();
			return;
		}
	} catch (err) {
		console.error("카카오톡 공유 실패:", err);
	}

	const ok = await copyTextWithFallback(shareUrl);
	showShareCopiedFeedback(ok);
	if (typeof closeShareMenu === "function") closeShareMenu();
};

window.shareDetailNative = async function (event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	try {
		if (navigator.share) {
			await navigator.share({
				title: getDetailShareTitle(),
				text: getDetailShareText(),
				url: getDetailShareUrl()
			});
			if (typeof closeShareMenu === "function") closeShareMenu();
			return;
		}
	} catch (err) {
		console.error("공유 실패:", err);
	}
	const ok = await copyTextWithFallback(getDetailShareText());
	showShareCopiedFeedback(ok);
	if (typeof closeShareMenu === "function") closeShareMenu();
};

window.shareDetailSms = function (event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const body = encodeURIComponent(getDetailShareText());
	const smsUrl = /iPhone|iPad|iPod/.test(navigator.userAgent) ? `sms:&body=${body}` : `sms:?body=${body}`;
	if (typeof closeShareMenu === "function") closeShareMenu();
	location.href = smsUrl;
};

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

function initCustomZoomButtons()
{
	const zoomInBtn = document.getElementById("zoomInBtn");
	const zoomOutBtn = document.getElementById("zoomOutBtn");
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

async function bootstrap()
{
	if (!window.kakao || !window.kakao.maps) {
		alert("카카오맵 SDK가 로드되지 않았습니다. appkey를 확인하세요.");
		return;
	}

	updateSidebarWidth();
	initMap();
	setMapTypeMode("roadmap");
	await applyInitialMapCenter();
	initCustomZoomButtons();
	initRoadview();
	initEvents();
	selectedDeal = selectedDeal instanceof Set ? selectedDeal : new Set();
	selectedType = selectedType instanceof Set ? selectedType : new Set();
	syncFeatureButtons();
	loadInitialMapData();

	window.addEventListener("popstate", async () => {
		const opened = await openDetailFromUrl({ replaceHistory: false });
		if (!opened) {
			closeDetailPanel();
		}
	});
}

async function loadInitialMapData()
{
	loadRecommendData();
	syncFeatureButtons();

	try {
		await loadProperties();
		syncFeatureButtons();
		await openDetailFromUrl({ replaceHistory: true });
	} catch (err) {
		console.error("초기 지도 데이터 처리 실패:", err);
		syncFeatureButtons();
	}
}

function handleBootstrapError(err)
{
	console.error("앱 초기화 실패:", err);
}

function startRealjejuApp()
{
	scheduleNonBlockingExternalAssets();

	if (!window.kakao || !window.kakao.maps) {
		alert("카카오맵 SDK가 로드되지 않았습니다. appkey를 확인하세요.");
		return;
	}

	if (typeof window.kakao.maps.load === "function") {
		window.kakao.maps.load(() => {
			bootstrap().catch(handleBootstrapError);
		});
		return;
	}

	bootstrap().catch(handleBootstrapError);
}

startRealjejuApp();

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
	const authBrokerOfficeInfoScreen = document.getElementById("authBrokerOfficeInfoScreen");
	const authBrokerOfficeScreen = document.getElementById("authBrokerOfficeScreen");
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
	const authRememberIdInput = document.getElementById("authRememberIdInput");
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
	const globalAuthTrigger = document.getElementById("detailAuthTrigger");
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

	function getRealjejuSessionUserId(user)
	{
		return String(user && user.id ? user.id : "").trim();
	}

	function isRealjejuActiveSessionUser(user)
	{
		const userId = getRealjejuSessionUserId(user);
		const activeId = getRealjejuSessionUserId(window.realjejuCurrentAuthUser || currentRealjejuAuthUser);
		return !!userId && activeId === userId;
	}

	function resetRealjejuSessionScopedState(options = {})
	{
		const closePages = options.closePages === true;
		window.realjejuCurrentProfile = null;
		window.realjejuCurrentBrokerOffice = null;
		window.realjejuCurrentIsAdmin = false;
		currentRealjejuProfileCompleted = false;
		if (typeof clearRealjejuSessionCaches === "function") clearRealjejuSessionCaches();
		if (typeof clearFavoriteListingState === "function") clearFavoriteListingState();
		if (typeof window.realjejuResetRegistrantInfo === "function") window.realjejuResetRegistrantInfo();
		mySuiteProfilePhotoFile = null;
		mySuiteProfilePhotoUrl = "";
		authProfilePhotoFile = null;
		authProfilePhotoUrl = "";
		if (authProfilePhotoInput) authProfilePhotoInput.value = "";
		if (typeof window !== "undefined") window.authProfilePhotoUrl = "";
		if (closePages) {
			if (typeof hideProfileSuitePages === "function") hideProfileSuitePages();
			if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
			if (typeof closePaymentPage === "function") closePaymentPage();
			if (typeof closeBrokerHomePage === "function") closeBrokerHomePage();
			if (typeof closeAdminPage === "function") closeAdminPage();
			document.body.classList.remove("property-register-page-open");
			const registerPage = document.getElementById("propertyRegisterPage");
			if (registerPage) registerPage.setAttribute("aria-hidden", "true");
		}
	}

	function setRealjejuActiveSession(user, profile = null, options = {})
	{
		const previousId = getRealjejuSessionUserId(window.realjejuCurrentAuthUser || currentRealjejuAuthUser);
		const nextId = getRealjejuSessionUserId(user);
		const accountChanged = !!(previousId && nextId && previousId !== nextId);
		if (accountChanged || options.forceReset === true) {
			if (previousId) clearRealjejuCachedProfile(previousId);
			resetRealjejuSessionScopedState({ closePages: accountChanged || options.closePages === true });
		}
		currentRealjejuAuthUser = user || null;
		window.realjejuCurrentAuthUser = user || null;
		window.realjejuCurrentProfile = profile || null;
		window.realjejuCurrentBrokerOffice = null;
		window.realjejuCurrentIsAdmin = isAdminUser(user, profile || null);
		currentRealjejuProfileCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
		if (user && user.id && profile && profile.name) writeRealjejuCachedProfile(user.id, profile);
	}

	function closeGlobalAccountDropdown()
	{
		if (!globalAccountDropdown) return;
		if (typeof window.realjejuReleaseGlobalAccountDropdownFocus === "function") window.realjejuReleaseGlobalAccountDropdownFocus(globalAccountDropdown);
		globalAccountDropdown.classList.remove("open");
		if (globalAuthTrigger) globalAuthTrigger.classList.remove("account-open");
		globalAccountDropdown.setAttribute("aria-hidden", "true");
		globalAccountDropdown.style.display = "none";
	}

	function toggleGlobalAccountDropdown()
	{
		if (!globalAccountDropdown) return;
		if (document.body.classList.contains("detail-page-panel-open")) {
			closeGlobalAccountDropdown();
			return;
		}
		const isOpen = globalAccountDropdown.classList.contains("open");
		if (isOpen && typeof window.realjejuReleaseGlobalAccountDropdownFocus === "function") window.realjejuReleaseGlobalAccountDropdownFocus(globalAccountDropdown);
		globalAccountDropdown.classList.toggle("open", !isOpen);
		if (globalAuthTrigger) globalAuthTrigger.classList.toggle("account-open", !isOpen);
		globalAccountDropdown.setAttribute("aria-hidden", isOpen ? "true" : "false");
		globalAccountDropdown.style.display = isOpen ? "none" : "block";
	}

	/* ===== PATCH 2.365: 계정 드롭다운 > 이용권 결제 페이지 전환 ===== */
	function closePaymentPage()
	{
		document.body.classList.remove("payment-page-open");
		document.body.classList.add("sidebar-list-collapsed");
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (sidebar) sidebar.classList.remove("expanded");
		if (typeof refreshMapLayout === "function") setTimeout(refreshMapLayout, 0);
		const paymentPage = document.getElementById("paymentPagePanel");
		if (paymentPage) paymentPage.setAttribute("aria-hidden", "true");
	}

	function closeMyInfoPage()
	{
		document.body.classList.remove("myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "profile-page-open");
		document.body.classList.add("sidebar-list-collapsed");
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (sidebar) sidebar.classList.remove("expanded");
		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) panel.setAttribute("aria-hidden", "true");
		});
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.remove("profile-page-active");
		if (typeof refreshMapLayout === "function") setTimeout(refreshMapLayout, 0);
	}

	function openPaymentPageFromAccountMenu()
	{
		closeGlobalAccountDropdown();

		if (typeof closeAuthModal === "function") closeAuthModal();

		document.body.classList.remove(
			"broker-home-page-open",
			"admin-page-open",
			"property-register-page-open",
			"myinfo-page-open",
			"profile-edit-page-open",
			"broker-office-info-page-open",
			"broker-office-edit-page-open",
			"profile-page-open",
			"notice-page-open"
		);
		document.body.classList.add("sidebar-list-collapsed");
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (sidebar) sidebar.classList.remove("expanded");
		document.body.classList.add("payment-page-open");
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.remove("profile-page-active");

		const paymentPage = document.getElementById("paymentPagePanel");
		if (paymentPage) {
			paymentPage.setAttribute("aria-hidden", "false");
			paymentPage.scrollTop = 0;
		}

		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) panel.setAttribute("aria-hidden", "true");
		});

		["brokerHomePanel", "adminPagePanel", "propertyRegisterPage", "noticePagePanel"].forEach((id) => {
			const el = document.getElementById(id);
			if (el) {
				if (id === "brokerHomePanel" && typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(el);
				el.setAttribute("aria-hidden", "true");
			}
		});

		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.remove("active");
		});

		const plansTab = document.querySelector('[data-payment-tab="plans"]');
		if (plansTab) plansTab.click();

		window.scrollTo({ top: 0, behavior: "auto" });
	}

	window.openPaymentPageFromAccountMenu = openPaymentPageFromAccountMenu;
	window.closePaymentPage = closePaymentPage;
	window.closeMyInfoPage = closeMyInfoPage;

	function bindBrokerPaymentGuideCta()
	{
		const btn = document.getElementById("brokerHomeAdCta");
		if (!btn || btn.dataset.brokerPaymentGuideBound === "true") return;
		if (btn.getAttribute("data-account-action") !== "payment") return;
		btn.dataset.brokerPaymentGuideBound = "true";
		btn.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			openPaymentPageFromAccountMenu();
		}, true);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bindBrokerPaymentGuideCta);
	} else {
		bindBrokerPaymentGuideCta();
	}

	/* PATCH 3.185: 우측 상단 계정 메뉴는 클릭으로만 열고 닫는다. */

	function applyLoggedOutAccountUI()
	{
		renderTopbarMenu(false, false, false);
		closeGlobalAccountDropdown();
		if (currentRealjejuAuthUser && currentRealjejuAuthUser.id) clearRealjejuCachedProfile(currentRealjejuAuthUser.id);
		resetRealjejuSessionScopedState({ closePages: true });
		currentRealjejuAuthUser = null;
		window.realjejuCurrentAuthUser = null;
		if (typeof window.realjejuGoHome === "function") window.realjejuGoHome();
		if (globalAuthTrigger) {
			globalAuthTrigger.dataset.authState = "logged-out";
			globalAuthTrigger.classList.remove("logged-in");
			globalAuthTrigger.innerHTML = '<span>회원가입</span><span class="auth-dot">·</span><span>로그인</span>';
		}
		if (globalAccountEmail) globalAccountEmail.textContent = "";
		if (globalAccountDropdown) globalAccountDropdown.classList.remove("profile-incomplete");
		if (typeof window.realjejuGoHome === "function") window.realjejuGoHome();
		const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");
		if (brokerMenuWrapper) brokerMenuWrapper.style.setProperty("display", "none");
		renderTopbarMenu(false, false, false);
	}

	function isBrokerRoleValue(role)
	{
		return isRealjejuBrokerRole(role);
	}

	const REALJEJU_BROKER_OFFICE_APPLY_ROLE_MESSAGE = "내 정보에서 회원유형을 중개사 또는 법인으로\n변경한 뒤 신청해 주세요.";
	const REALJEJU_BROKER_OFFICE_EDIT_ROLE_MESSAGE = "내 정보에서 회원유형을 중개사 또는 법인으로\n변경한 뒤 신청해 주세요.";

	async function requireBrokerRoleForBrokerOfficeApply(client, user, returnFocusTarget, options = {})
	{
		if (!client || !user || !user.id) return false;
		const modalTitle = options.title || "중개사무소 가입 신청";
		const roleMessage = options.message || REALJEJU_BROKER_OFFICE_APPLY_ROLE_MESSAGE;
		try {
			const { data: profile, error } = await client
				.from("profiles")
				.select("role_request")
				.eq("id", user.id)
				.maybeSingle();
			if (error) {
				console.error("중개사무소 신청 회원유형 확인 실패:", error);
				openAuthErrorModal("회원유형 확인에 실패했습니다.", modalTitle, returnFocusTarget || null);
				return false;
			}
			const role = profile && profile.role_request ? profile.role_request : "";
			if (!isBrokerRoleValue(role)) {
				openAuthErrorModal(roleMessage, modalTitle, returnFocusTarget || null);
				return false;
			}
			if (!isRealjejuActiveSessionUser(user)) return false;
			setRealjejuActiveSession(user, {
				...(window.realjejuCurrentProfile || {}),
				role_request: role
			});
			return true;
		} catch (err) {
			console.error("중개사무소 신청 회원유형 확인 오류:", err);
			openAuthErrorModal("회원유형 확인 중 오류가 발생했습니다.", modalTitle, returnFocusTarget || null);
			return false;
		}
	}

	function setTopbarAccountDisplayName(displayName)
	{
		const accountNameText = document.querySelector(".account-email-text");
		const safeName = String(displayName || "").trim();
		if (accountNameText && safeName) accountNameText.textContent = safeName;
	}

	function getBrokerOfficeRowStatus(row)
	{
		const raw = String(row && row.status ? row.status : "").trim();
		const compact = raw.replace(/\s+/g, "").toLowerCase();
		if (!compact && row && (row.id || row.user_id || row.office_name || row.office_reg_no || row.office_address || row.phone || row.email)) return "new";
		if (["active", "approved", "approve", "accepted", "승인", "승인완료", "완료"].includes(compact)) return "active";
		if (["new", "waiting", "wait", "applied", "apply", "신청", "가입신청", "신청중"].includes(compact)) return "new";
		if (["pending", "대기", "승인대기", "대기중"].includes(compact)) return "pending";
		if (["rejected", "reject", "denied", "거부", "반려", "승인거부"].includes(compact)) return "rejected";
		if (["deleted", "delete", "trash", "withdrawn", "삭제", "휴지통"].includes(compact)) return "deleted";
		return compact;
	}

	function isDeletedBrokerOfficeRow(row)
	{
		return getBrokerOfficeRowStatus(row) === "deleted" || !!(row && row.deleted_at);
	}

	function getVisibleBrokerOfficeRows(rows)
	{
		return (Array.isArray(rows) ? rows : []).filter((row) => row && !isDeletedBrokerOfficeRow(row));
	}

	function isBrokerOfficeOwnedByUser(row, user)
	{
		if (!row || !user || !user.id) return false;
		const rowUserId = String(row.user_id || "").trim();
		return !!rowUserId && rowUserId === String(user.id);
	}

	function getOwnedBrokerOfficeRows(rows, user)
	{
		return getVisibleBrokerOfficeRows(rows).filter((row) => isBrokerOfficeOwnedByUser(row, user));
	}

	function pickApprovedBrokerOffice(rows, user)
	{
		return getOwnedBrokerOfficeRows(rows, user).find((row) => getBrokerOfficeRowStatus(row) === "active") || null;
	}

	function isApprovedBrokerOffice(row)
	{
		return !!(row && !isDeletedBrokerOfficeRow(row) && getBrokerOfficeRowStatus(row) === "active");
	}

	function pickCurrentBrokerOffice(rows, user)
	{
		const visibleRows = getOwnedBrokerOfficeRows(rows, user);
		return visibleRows.find((row) => getBrokerOfficeRowStatus(row) === "active")
			|| visibleRows.find((row) => row && (row.owner_name || row.office_reg_no || row.office_address))
			|| visibleRows[0]
			|| null;
	}

	async function updateApprovedBrokerTopbarMenu(user, profile)
	{
		if (!isRealjejuActiveSessionUser(user)) return;
		renderTopbarMenu(false, isAdminUser(user));
		if (!user || !user.id) return;
		if (!isBrokerRoleValue(profile && profile.role_request)) {
			window.realjejuCurrentBrokerOffice = null;
			renderTopbarMenu(false, isAdminUser(user, profile || null));
			return;
		}

		const client = getRealjejuSupabaseClient();
		if (!client) return;

		try {
			const officeRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
			if (!isRealjejuActiveSessionUser(user)) return;

			const brokerOffice = pickApprovedBrokerOffice(officeRows, user)
				|| (isApprovedBrokerOffice(window.realjejuCurrentBrokerOffice) && isBrokerOfficeOwnedByUser(window.realjejuCurrentBrokerOffice, user) ? window.realjejuCurrentBrokerOffice : null);
			const isActiveOffice = !!brokerOffice;
			if (isActiveOffice && brokerOffice.office_name) {
				window.realjejuCurrentBrokerOffice = {
					...(window.realjejuCurrentBrokerOffice || {}),
					...brokerOffice
				};
				renderTopbarMenu(true, isAdminUser(user, profile || null));
				setTopbarAccountDisplayName(brokerOffice.office_name);
			} else {
				window.realjejuCurrentBrokerOffice = null;
				renderTopbarMenu(false, isAdminUser(user, profile || null));
			}
		} catch (err) {
			console.warn("중개사 승인 상태 확인 실패:", err);
			window.realjejuCurrentBrokerOffice = null;
			renderTopbarMenu(false, isAdminUser(user, profile || null));
		}
	}

	async function fetchMyLatestBrokerOfficeStatus(user)
	{
		if (!user || !user.id) return null;
		const client = getRealjejuSupabaseClient();
		if (!client) return null;

		try {
			const profile = window.realjejuCurrentProfile || null;
			const rows = await fetchMySuiteBrokerOfficeRows(client, user, profile);
			const row = pickCurrentBrokerOffice(rows, user);
			return row ? getBrokerOfficeRowStatus(row) : null;
		} catch (err) {
			console.warn("중개사무소 신청 상태 확인 실패:", err);
			return isApprovedBrokerOffice(window.realjejuCurrentBrokerOffice) ? "active" : null;
		}
	}

	function getBrokerOfficeStatusLabel(status)
	{
		const value = getBrokerOfficeRowStatus({ status });
		if (value === "active") return "승인 완료";
		if (value === "new") return "가입 신청 진행중";
		if (value === "pending") return "승인 대기중";
		if (value === "rejected") return "반려";
		return "미신청";
	}

	async function updateBrokerOfficeDropdownMenu(user, profile)
	{
		const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");
		const brokerMenuItem = document.getElementById("brokerOfficeMenuItem");
		const isBroker = !!isBrokerRoleValue(profile && profile.role_request);

		if (!brokerMenuWrapper || !brokerMenuItem) return;

		if (!isBroker) {
			window.realjejuCurrentBrokerOffice = null;
			brokerMenuWrapper.style.setProperty("display", "none");
			brokerMenuItem.disabled = false;
			brokerMenuItem.textContent = "중개사무소 가입 신청";
			return;
		}

		const status = await fetchMyLatestBrokerOfficeStatus(user);
		if (!isRealjejuActiveSessionUser(user)) return;
		brokerMenuWrapper.style.setProperty("display", "block");
		brokerMenuItem.disabled = false;
		brokerMenuItem.classList.remove("is-pending", "is-active", "is-rejected");

		if (status === "new" || status === "pending") {
			brokerMenuItem.textContent = status === "new" ? "가입 신청 진행중" : "승인 대기중";
			brokerMenuItem.disabled = true;
			brokerMenuItem.classList.add("is-pending");
		} else if (status === "active") {
			brokerMenuItem.textContent = "중개사무소 정보";
			brokerMenuItem.classList.add("is-active");
		} else if (status === "rejected") {
			brokerMenuItem.textContent = "다시 신청하기";
			brokerMenuItem.classList.add("is-rejected");
		} else {
			brokerMenuItem.textContent = "중개사무소 가입 신청";
		}
	}

	function getRoleLabel(role)
	{
		const value = String(role || "user");
		if (value === "agent") return "대표 공인중개사";
		if (value === "agent_sub") return "소속 공인중개사";
		if (value === "agent_staff") return "중개보조원";
		if (value === "corporation") return "법인";
		if (value === "broker") return "중개사";
		return "일반회원";
	}


	function renderTopbarMenu(isBroker, isAdmin = false, isLoggedIn = true)
	{
		const topbarMenu = document.getElementById("topbarMenu");
		if (!topbarMenu) return;
		const currentProfile = window.realjejuCurrentProfile || null;
		const canShowBrokerHome = !!isBroker && isBrokerRoleValue(currentProfile && currentProfile.role_request);
		const activeTopbarLabel = Array.from(topbarMenu.querySelectorAll(".topbar-menu-item.active"))
			.map((button) => String(button.textContent || "").trim())
			.find(Boolean) || "";
		const menus = isLoggedIn
			? [
				...(isAdmin ? ["관리자 페이지"] : []),
				...(canShowBrokerHome ? ["중개사 홈"] : []),
				"부동산 홈",
				"매물 등록",
				"관심매물",
				"공지사항"
			]
			: [
				"부동산 홈",
				"공지사항"
			];
		const defaultActiveLabel = menus.includes(activeTopbarLabel) ? activeTopbarLabel : "부동산 홈";
		const currentMenus = Array.from(topbarMenu.querySelectorAll(".topbar-menu-item")).map((button) => button.textContent.trim());
		if (currentMenus.length === menus.length && currentMenus.every((label, index) => label === menus[index])) return;

		topbarMenu.replaceChildren(...menus.map((label) => {
			if (label === "매물 등록") {
				const wrap = document.createElement("span");
				wrap.className = "topbar-menu-free-wrap";

				const button = document.createElement("button");
				button.type = "button";
				button.className = "topbar-menu-item";
				button.textContent = "매물 등록";

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
			
			if (label === defaultActiveLabel) button.classList.add("active");
			button.textContent = label;
			return button;
		}));
	}

	function setTopbarMenuActive(label)
	{
		const target = String(label || "").trim();
		if (!target) return;
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.toggle("active", String(btn.textContent || "").trim() === target);
		});
	}

	function isAdminProfileValue(profile)
	{
		const data = profile || {};
		const role = String(data.role || data.app_role || data.user_role || "").trim().toLowerCase();
		return role === "admin" || data.is_admin === true || data.admin === true;
	}

	function isAdminUser(user, profile = window.realjejuCurrentProfile)
	{
		const metadataRole = String(
			(user && user.app_metadata && user.app_metadata.role)
			|| (user && user.user_metadata && user.user_metadata.role)
			|| ""
		).trim().toLowerCase();
		return !!(isAdminProfileValue(profile) || metadataRole === "admin");
	}

	function renderAdminTopbarMenu(isBroker = false)
	{
		renderTopbarMenu(isBroker, true);
	}

	async function resolveCurrentAdminContext()
	{
		let user = window.realjejuCurrentAuthUser || currentRealjejuAuthUser || null;
		let profile = window.realjejuCurrentProfile || null;
		if (isAdminUser(user, profile)) return { allowed: true, user, profile };

		const client = getRealjejuSupabaseClient();
		if (!client) return { allowed: false, user, profile };
		try {
			const { data: userData } = await client.auth.getUser();
			user = userData && userData.user ? userData.user : user;
			if (user && user.id) {
				setRealjejuActiveSession(user, profile || null);
				try {
					const { data: profileData } = await client
						.from("profiles")
						.select("status, name, email, phone, role, role_request, profile_completed, profile_image")
						.eq("id", user.id)
						.maybeSingle();
					if (profileData) {
						profile = profileData;
						if (isRealjejuActiveSessionUser(user)) setRealjejuActiveSession(user, profileData);
					}
				} catch (profileError) {
					console.warn("관리자 권한 프로필 재확인 실패:", profileError);
				}
			}
		} catch (authError) {
			console.warn("관리자 권한 세션 재확인 실패:", authError);
		}
		return { allowed: isAdminUser(user, profile), user, profile };
	}

	/* PATCH: 권한 확인 전에는 중개사 홈을 표시하지 않음 */
	renderTopbarMenu(false, false, false);
	
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
		setRealjejuActiveSession(user, profile || null);
		const currentIsAdmin = isAdminUser(user, profile || null);
		if (!realjejuFavoriteLoaded || realjejuFavoriteUserId !== normalizeItemId(user.id)) {
			loadFavoriteListingStateFromServer();
		}
		if (typeof window.realjejuLoadRegistrantInfo === "function") setTimeout(window.realjejuLoadRegistrantInfo, 0);
			syncAuthProfileEmail(user);
		const email = user.email || "로그인 사용자";
		const displayName = profile && profile.name ? profile.name : email;
		const isCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
		currentRealjejuProfileCompleted = isCompleted;
		if (currentIsAdmin) {
			renderAdminTopbarMenu(false);
		} else {
			renderTopbarMenu(false);
			if (document.body.classList.contains("admin-page-open")) {
				closeAdminPage();
				if (typeof window.realjejuGoHome === "function") setTimeout(window.realjejuGoHome, 0);
			}
		}
		updateApprovedBrokerTopbarMenu(user, profile);
		const keepCurrentWorkspace = document.body.classList.contains("my-suite-page-open")
			|| document.body.classList.contains("myinfo-page-open")
			|| document.body.classList.contains("profile-edit-page-open")
			|| document.body.classList.contains("broker-office-info-page-open")
			|| document.body.classList.contains("broker-office-edit-page-open")
			|| document.body.classList.contains("payment-page-open")
			|| document.body.classList.contains("property-register-page-open")
			|| (currentIsAdmin && document.body.classList.contains("admin-page-open"))
			|| document.body.classList.contains("broker-home-page-open");
		if (document.body.classList.contains("my-suite-page-open")) {
			document.querySelectorAll(".topbar-menu-item").forEach((btn) => btn.classList.remove("active"));
		}
		if (!keepCurrentWorkspace && typeof window.realjejuGoHome === "function") {
			window.realjejuGoHome();
			setTimeout(window.realjejuGoHome, 50);
			setTimeout(window.realjejuGoHome, 250);
		}
		if (globalAuthTrigger) {
			const profileImage = (profile && profile.profile_image) ? profile.profile_image : (window.authProfilePhotoUrl || REALJEJU_DEFAULT_PROFILE_IMAGE);
			globalAuthTrigger.dataset.authState = "logged-in";
			globalAuthTrigger.classList.add("logged-in");
			globalAuthTrigger.innerHTML = '<img class="topbar-profile-image" src="' + escapeAuthHtml(profileImage || REALJEJU_DEFAULT_PROFILE_IMAGE) + '" alt="프로필">' + '<span class="account-email-text">' + escapeAuthHtml(displayName) + '</span>' + '<i class="fa-solid fa-chevron-down auth-arrow"></i>';
			const topbarProfileImg = globalAuthTrigger.querySelector(".topbar-profile-image");
			if (topbarProfileImg) {
				topbarProfileImg.onerror = function () { this.onerror = null; this.src = REALJEJU_AGENT_FALLBACK_IMAGE; };
				topbarProfileImg.style.display = "inline-block";
			}
		}
		if (globalAccountEmail) globalAccountEmail.textContent = email;
		if (globalAccountDropdown) globalAccountDropdown.classList.toggle("profile-incomplete", !isCompleted);
		updateBrokerOfficeDropdownMenu(user, profile);
	}

	async function openProfileSetupFromAccountMenu()
	{
		closeGlobalAccountDropdown();
		const supabaseForProfile = getRealjejuSupabaseClient();
		if (!supabaseForProfile) {
			openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "내 정보 설정", null);
			return;
		}
		try {
			const { data: userData } = await supabaseForProfile.auth.getUser();
			const user = userData && userData.user ? userData.user : null;
			if (!user) {
				openAuthModal();
				return;
			}
			setRealjejuActiveSession(user, window.realjejuCurrentProfile || null);
			const { data: profile } = await supabaseForProfile
				.from("profiles")
				.select("name, phone, role, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (!isRealjejuActiveSessionUser(user)) return;
			setRealjejuActiveSession(user, profile || null);
			fillProfileEditPage(profile, user);
			openProfileSuitePanel("profileEditPagePanel", "profile-edit-page-open");
		} catch (err) {
			console.warn("내 정보 설정 열기 실패:", err);
			openAuthErrorModal("내 정보 설정을 열지 못했습니다.", "내 정보 설정", null);
		}
	}


	async function fetchCurrentProfileAndBrokerOffice()
	{
		const client = getRealjejuSupabaseClient();
		if (!client) return { user: null, profile: null, brokerOffice: null };
		const { data: userData } = await client.auth.getUser();
		const user = userData && userData.user ? userData.user : null;
		if (!user) return { user: null, profile: null, brokerOffice: null };
		const { data: profile } = await client
			.from("profiles")
			.select("status, name, email, phone, role, role_request, profile_completed, profile_image")
			.eq("id", user.id)
			.maybeSingle();
		let brokerOffice = null;
		if (isBrokerRoleValue(profile && profile.role_request)) {
			try {
				const officeRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
				brokerOffice = pickCurrentBrokerOffice(officeRows, user);
			} catch (err) {
				brokerOffice = null;
			}
		}
		return { user, profile: profile || null, brokerOffice };
	}

	async function fetchApprovedBrokerAccess()
	{
		const client = getRealjejuSupabaseClient();
		if (!client) return { allowed: false, user: null, profile: null, brokerOffice: null };
		const { data: userData } = await client.auth.getUser();
		const user = userData && userData.user ? userData.user : null;
		if (!user) return { allowed: false, user: null, profile: null, brokerOffice: null };
		let profile = window.realjejuCurrentProfile || null;
		setRealjejuActiveSession(user, profile || null);
		try {
			const { data, error } = await client
				.from("profiles")
				.select("status, name, email, phone, role, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (error) throw error;
			if (data) profile = data;
		} catch (err) {
			console.warn("중개사 홈 프로필 확인 실패:", err);
		}
		if (!isRealjejuActiveSessionUser(user)) return { allowed: false, user: null, profile: null, brokerOffice: null };
		if (!isBrokerRoleValue(profile && profile.role_request)) {
			window.realjejuCurrentBrokerOffice = null;
			renderTopbarMenu(false, isAdminUser(user, profile || null));
			return { allowed: false, user, profile: profile || null, brokerOffice: null };
		}
		let brokerOffice = null;
			try {
				const officeRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
				if (!isRealjejuActiveSessionUser(user)) return { allowed: false, user: null, profile: null, brokerOffice: null };
				brokerOffice = pickApprovedBrokerOffice(officeRows, user);
			} catch (err) {
				console.warn("중개사 홈 승인 사무소 확인 실패:", err);
			}
			if (!brokerOffice && isApprovedBrokerOffice(window.realjejuCurrentBrokerOffice)) {
				const cachedOffice = window.realjejuCurrentBrokerOffice;
				if (isBrokerOfficeOwnedByUser(cachedOffice, user)) brokerOffice = cachedOffice;
			}
		const allowed = isApprovedBrokerOffice(brokerOffice);
		if (allowed) {
			setRealjejuActiveSession(user, profile || null);
			window.realjejuCurrentBrokerOffice = brokerOffice;
			renderTopbarMenu(true, isAdminUser(user, profile || null));
		} else {
			window.realjejuCurrentBrokerOffice = null;
			renderTopbarMenu(false, isAdminUser(user, profile || null));
		}
		return { allowed, user, profile: profile || null, brokerOffice };
	}

	async function requireApprovedBrokerForPropertyRegister()
	{
		const access = await fetchApprovedBrokerAccess();
		if (!access.user) {
			openAuthErrorModal("매물 등록은 승인 완료된 개업 공인중개사 또는\n중개법인만 가능합니다.", "매물 등록", null, typeof openAuthModal === "function" ? openAuthModal : null);
			return null;
		}
		if (!access.allowed) {
			openAuthErrorModal("매물 등록은 승인 완료된 개업 공인중개사 또는\n중개법인만 가능합니다.", "매물 등록", null);
			return null;
		}
		return access;
	}

	window.requireApprovedBrokerForPropertyRegister = requireApprovedBrokerForPropertyRegister;

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

	function getBrokerOfficeKakaoUrl(brokerOffice)
	{
		const data = brokerOffice || {};
		const values = [
			data.kakao_url,
			data.kakaoUrl,
			data.kakao,
			data.kakao_open_chat,
			data.kakao_open_chat_url,
			data.open_chat_url
		];
		const found = values.find((value) => String(value || "").trim());
		return found ? String(found).trim() : "";
	}

	function getBrokerOfficeServerKakaoUrl(brokerOffice)
	{
		return String((brokerOffice && (brokerOffice.kakao_url || brokerOffice.kakaoUrl || brokerOffice.kakao || brokerOffice.kakao_open_chat || brokerOffice.kakao_open_chat_url || brokerOffice.open_chat_url)) || "").trim();
	}

	function pickUpdatedBrokerOfficeRow(rows, agencyId)
	{
		const list = (Array.isArray(rows) ? rows : []).filter((row) => row && row.status !== "deleted" && !row.deleted_at);
		const id = String(agencyId || "").trim();
		return (id ? list.find(row => row && String(row.id || "") === id) : null)
			|| list.find(row => row && getBrokerOfficeRowStatus(row) === "active")
			|| list[0]
			|| null;
	}

	function setKakaoUrlById(id, value)
	{
		const el = document.getElementById(id);
		if (!el) return;
		const url = String(value || "").trim();
		el.textContent = "";
		if (!url) {
			el.textContent = "-";
			return;
		}
		const link = document.createElement("a");
		link.href = url;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		link.textContent = url;
		el.appendChild(link);
	}

	function getBrokerOfficeStatusText(profile, brokerOffice)
	{
		const officeStatus = getBrokerOfficeRowStatus(brokerOffice);
		if (officeStatus === "active") return brokerOffice.office_name || "승인 완료";
		if (!isBrokerRoleValue(profile && profile.role_request)) return "해당 없음";
		if (!brokerOffice) return "미신청";
		if (officeStatus === "new") return "가입 신청 진행중";
		if (officeStatus === "pending") return "승인 대기중";
		if (officeStatus === "rejected") return "반려";
		return "미신청";
	}

	function fillBrokerOfficeInfoScreen(brokerOffice)
	{
		setTextById("brokerOfficeInfoStatusValue", getBrokerOfficeStatusLabel(brokerOffice && brokerOffice.status));
		setTextById("brokerOfficeInfoNameValue", brokerOffice && brokerOffice.office_name);
		setTextById("brokerOfficeInfoOwnerValue", brokerOffice && brokerOffice.owner_name);
		setTextById("brokerOfficeInfoRegNoValue", brokerOffice && brokerOffice.office_reg_no);
		setTextById("brokerOfficeInfoAddressValue", brokerOffice && brokerOffice.office_address);
		setTextById("brokerOfficeInfoPhoneValue", formatDisplayPhone(brokerOffice && brokerOffice.phone) || "");
		setTextById("brokerOfficeInfoEmailValue", brokerOffice && brokerOffice.email);
		setKakaoUrlById("brokerOfficeInfoKakaoValue", getBrokerOfficeKakaoUrl(brokerOffice));
	}

	function setValueById(id, value)
	{
		const el = document.getElementById(id);
		if (!el || !("value" in el)) return;
		el.value = value || "";
	}

	function fillBrokerOfficeApplyForm(brokerOffice)
	{
		if (!brokerOffice) return;
		const form = document.getElementById("brokerOfficeApplyForm");
		if (form) {
			form.dataset.mode = brokerOffice.id ? "edit" : "create";
			form.dataset.agencyId = brokerOffice.id || "";
			const submitBtn = form.querySelector(".broker-apply-submit");
			if (submitBtn) submitBtn.textContent = brokerOffice.id ? "중개사무소 정보 수정" : "중개사무소 회원가입 신청";
		}
		setValueById("brokerOfficeNameInput", brokerOffice.office_name);
		setValueById("brokerOfficeSearchInput", brokerOffice.office_name);
		setValueById("brokerOwnerNameInput", brokerOffice.owner_name);
		setValueById("brokerLicenseNoInput", brokerOffice.office_reg_no);
		setValueById("brokerOfficeAddressInput", brokerOffice.office_address);
		setValueById("brokerOfficePhoneInput", formatDisplayPhone(brokerOffice.phone));
		setValueById("brokerOwnerEmailLocalInput", brokerOffice.email);
		setValueById("brokerOfficeKakaoInput", getBrokerOfficeKakaoUrl(brokerOffice));
	}

	function hideProfileSuitePages()
	{
		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) panel.setAttribute("aria-hidden", "true");
		});
		document.body.classList.remove("myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "profile-page-open");
	}

	function openProfileSuitePanel(panelId, bodyClass)
	{
		const profileBodyClasses = ["myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "profile-page-open"];
		if (document.body.classList.contains("payment-page-open") && typeof closePaymentPage === "function") closePaymentPage();
		if (authModal) {
			authModal.classList.remove("open", "profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}
		hideAllAuthScreens();
		["brokerHomePanel", "adminPagePanel", "propertyRegisterPage", "paymentPagePanel"].forEach((id) => {
			const el = document.getElementById(id);
			if (el) {
				if (id === "brokerHomePanel" && typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(el);
				el.setAttribute("aria-hidden", "true");
			}
		});
		document.body.classList.remove("broker-home-page-open", "admin-page-open", "property-register-page-open", "payment-page-open");
		document.body.classList.add("sidebar-list-collapsed", bodyClass);
		profileBodyClasses.forEach((className) => {
			if (className !== bodyClass) document.body.classList.remove(className);
		});
		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel"].forEach((id) => {
			if (id === panelId) return;
			const el = document.getElementById(id);
			if (el) el.setAttribute("aria-hidden", "true");
		});
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (sidebar) sidebar.classList.remove("expanded");
		const panel = document.getElementById(panelId);
		if (panel) {
			panel.setAttribute("aria-hidden", "false");
			panel.scrollTop = 0;
		}
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => btn.classList.remove("active"));
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.add("profile-page-active");
		document.body.style.overflow = "";
	}

	function fillProfileEditPage(profile, user)
	{
		const currentProfileImage = profile && profile.profile_image ? profile.profile_image : "";
		isRealjejuSavingProfile = false;
		const saveBtn = document.getElementById("profileEditPageSaveBtn");
		if (saveBtn) saveBtn.disabled = false;
		setValueById("profileEditPageNameInput", profile && profile.name);
		const phoneInput = document.getElementById("profileEditPagePhoneInput");
		if (phoneInput) phoneInput.value = profile && profile.phone ? formatRealjejuPhoneInputValue(profile.phone) : "";
		setValueById("profileEditPageEmailInput", (user && user.email) || (profile && profile.email) || "");
		const roleSelect = document.getElementById("profileEditPageRoleSelect");
		if (roleSelect) roleSelect.value = profile && profile.role_request ? profile.role_request : "user";
		const privacyCheck = document.getElementById("profileEditPagePrivacyCheck");
		if (privacyCheck) privacyCheck.checked = false;
		authProfilePhotoFile = null;
		authProfilePhotoUrl = currentProfileImage;
		if (typeof window !== "undefined") window.authProfilePhotoUrl = currentProfileImage;
		if (authProfilePhotoInput) authProfilePhotoInput.value = "";
		setProfileImageElement(document.getElementById("profileEditPagePhotoPreview"), currentProfileImage);
	}

	function fillBrokerOfficePageInfo(brokerOffice)
	{
		setTextById("brokerOfficePageNameValue", brokerOffice && brokerOffice.office_name);
		setTextById("brokerOfficePageAddressValue", brokerOffice && brokerOffice.office_address);
		setTextById("brokerOfficePageRegNoValue", brokerOffice && brokerOffice.office_reg_no);
		setTextById("brokerOfficePageOwnerValue", brokerOffice && brokerOffice.owner_name);
		setTextById("brokerOfficePagePhoneValue", formatDisplayPhone(brokerOffice && brokerOffice.phone) || "");
		setTextById("brokerOfficePageEmailValue", brokerOffice && brokerOffice.email);
		setKakaoUrlById("brokerOfficePageKakaoValue", getBrokerOfficeKakaoUrl(brokerOffice));
		setTextById("brokerOfficePageStatusValue", getBrokerOfficeStatusLabel(brokerOffice && brokerOffice.status));
	}

	function fillBrokerOfficeEditPage(brokerOffice)
	{
		const form = document.getElementById("brokerOfficeEditPageForm");
		if (form) form.dataset.agencyId = brokerOffice && brokerOffice.id ? brokerOffice.id : "";
		setValueById("brokerOfficeEditPageNameInput", brokerOffice && brokerOffice.office_name);
		setValueById("brokerOfficeEditPageAddressInput", brokerOffice && brokerOffice.office_address);
		setValueById("brokerOfficeEditPageRegNoInput", brokerOffice && brokerOffice.office_reg_no);
		setValueById("brokerOfficeEditPageOwnerInput", brokerOffice && brokerOffice.owner_name);
		setValueById("brokerOfficeEditPagePhoneInput", formatDisplayPhone(brokerOffice && brokerOffice.phone));
		setValueById("brokerOfficeEditPageEmailInput", brokerOffice && brokerOffice.email);
		setValueById("brokerOfficeEditPageKakaoInput", getBrokerOfficeKakaoUrl(brokerOffice));
	}

	function openBrokerOfficeInfoPageWithOffice(brokerOffice)
	{
		if (!brokerOffice) return;
		window.realjejuCurrentBrokerOffice = {
			...(window.realjejuCurrentBrokerOffice || {}),
			...brokerOffice,
			kakao_url: getBrokerOfficeKakaoUrl(brokerOffice)
		};
		fillBrokerOfficePageInfo(window.realjejuCurrentBrokerOffice);
		openProfileSuitePanel("brokerOfficeInfoPagePanel", "broker-office-info-page-open");
		document.body.style.overflow = "";
	}

	async function openBrokerOfficeInfoFromAccountMenu()
	{
		closeGlobalAccountDropdown();
		try {
			const { user, brokerOffice } = await fetchCurrentProfileAndBrokerOffice();
			if (!user) {
				openAuthModal();
				return;
			}
			if (!isApprovedBrokerOffice(brokerOffice)) {
				openAuthErrorModal("승인 완료된 중개사무소 정보가 없습니다.", "중개사무소 정보", null);
				return;
			}
			openBrokerOfficeInfoPageWithOffice(brokerOffice);
		} catch (err) {
			console.warn("중개사무소 정보 열기 실패:", err);
			openAuthErrorModal("중개사무소 정보를 열지 못했습니다.", "중개사무소 정보", null);
		}
	}

	async function openBrokerOfficeEditFromInfo()
	{
		try {
			const { user, profile, brokerOffice } = await fetchCurrentProfileAndBrokerOffice();
			if (!user) {
				openAuthModal();
				return;
			}
			if (!isBrokerRoleValue(profile && profile.role_request)) {
				openAuthErrorModal(REALJEJU_BROKER_OFFICE_EDIT_ROLE_MESSAGE, "중개사무소 수정", null);
				return;
			}
			fillBrokerOfficeEditPage(brokerOffice);
			openProfileSuitePanel("brokerOfficeEditPagePanel", "broker-office-edit-page-open");
		} catch (err) {
			console.warn("중개사무소 수정 열기 실패:", err);
			openAuthErrorModal("중개사무소 수정 화면을 열지 못했습니다.", "중개사무소 정보", null);
		}
	}

	async function openMyInfoFromAccountMenu()
	{
		closeGlobalAccountDropdown();
		try {
			const { user, profile, brokerOffice } = await fetchCurrentProfileAndBrokerOffice();
			if (!user) {
				openAuthModal();
				return;
			}
			const completed = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
			const canUseBrokerHome = isBrokerRoleValue(profile && profile.role_request) && isApprovedBrokerOffice(brokerOffice);
			if (isAdminUser(user, profile || null)) {
				renderAdminTopbarMenu(canUseBrokerHome);
			} else {
				renderTopbarMenu(canUseBrokerHome);
			}
			setTextById("myInfoPageNameValue", profile && profile.name ? profile.name : "");
			setTextById("myInfoPageEmailValue", user.email || (profile && profile.email) || "-");
			setTextById("myInfoPagePhoneValue", profile && profile.phone ? formatRealjejuPhoneInputValue(profile.phone) : "");
			setTextById("myInfoPageRoleValue", getRoleLabel(profile && profile.role_request));
			setTextById("myInfoPageProfileStatusValue", completed ? "완료" : "미완료");
			setTextById("myInfoPageBrokerOfficeValue", getBrokerOfficeStatusText(profile, brokerOffice));
			setProfileImageElement(document.getElementById("myInfoPageProfileImage"), profile && profile.profile_image ? profile.profile_image : "");
			const brokerBtn = document.getElementById("myInfoPageBrokerOfficeBtn");
			if (brokerBtn) {
				const brokerRole = isBrokerRoleValue(profile && profile.role_request);
				const officeStatus = getBrokerOfficeRowStatus(brokerOffice);
				const isPending = brokerOffice && (officeStatus === "new" || officeStatus === "pending");
				const isActive = brokerOffice && officeStatus === "active";

				brokerBtn.style.display = brokerRole ? "block" : "none";
				brokerBtn.textContent = isActive ? "중개사무소 정보" : (isPending ? "가입 신청 진행중" : "중개사무소 가입 신청");
				brokerBtn.disabled = !!isPending;
				brokerBtn.setAttribute("aria-disabled", isPending ? "true" : "false");

				brokerBtn.classList.toggle("is-pending", isPending);
				brokerBtn.classList.toggle("is-active", isActive);
				brokerBtn.classList.toggle("is-disabled", isPending);
			}
			openProfileSuitePanel("myInfoPagePanel", "myinfo-page-open");
		} catch (err) {
			console.warn("내 정보 열기 실패:", err);
			openAuthErrorModal("내 정보를 열지 못했습니다.", "내 정보", null);
		}
	}

	async function openBrokerOfficeFromAccountMenu()
	{
		closeGlobalAccountDropdown();
		try {
			const { user, profile } = await fetchCurrentProfileAndBrokerOffice();
			if (!user) {
				openAuthModal();
				return;
				}
				if (!isBrokerRoleValue(profile && profile.role_request)) {
					openAuthErrorModal(REALJEJU_BROKER_OFFICE_APPLY_ROLE_MESSAGE, "중개사무소 가입 신청", null);
					return;
				}
			const form = document.getElementById("brokerOfficeApplyForm");
			if (form && form.dataset.mode !== "edit") {
				form.dataset.mode = "create";
				form.dataset.agencyId = "";
				const submitBtn = form.querySelector(".broker-apply-submit");
				if (submitBtn) submitBtn.textContent = "중개사무소 회원가입 신청";
				prefillBrokerOfficeApplyEmail(user);
				prefillBrokerOfficeApplyPhone(profile);
			}
			openStandaloneProfilePage(authBrokerOfficeScreen, "broker-office-edit-page-open", false);
		} catch (err) {
			console.warn("중개사무소 가입 신청 열기 실패:", err);
			openAuthErrorModal("중개사무소 가입 신청 화면을 열지 못했습니다.", "중개사무소 가입 신청", null);
		}
	}

	async function handleRealjejuLogout()
	{
		function forceGoHomeAfterLogout()
		{
			// PATCH 2.316: 로그아웃 강제 홈 전환에서도 중개사 홈 패널을 함께 닫는다
			document.body.classList.remove("property-register-page-open", "admin-page-open", "broker-home-page-open");

			const propertyRegisterPage = document.getElementById("propertyRegisterPage");
			if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "true");

			const propertyRegisterBottomBar = document.getElementById("propertyRegisterBottomBar");
			if (propertyRegisterBottomBar) propertyRegisterBottomBar.classList.remove("open", "active", "is-open");

			const adminPagePanel = document.getElementById("adminPagePanel");
			if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");

			const brokerHomePanel = document.getElementById("brokerHomePanel");
			if (brokerHomePanel) {
				if (typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(brokerHomePanel);
				brokerHomePanel.setAttribute("aria-hidden", "true");
			}

			document.querySelectorAll(".topbar-menu-item").forEach((btn) => btn.classList.remove("active"));

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

	async function callRealjejuWithdrawEndpoint(client)
	{
		let lastError = null;
		let functionError = null;
		if (client && typeof client.rpc === "function") {
			const cleanupResult = await client.rpc("cleanup_current_user_before_delete");
			if (cleanupResult.error) {
				lastError = cleanupResult.error;
				const cleanupMessage = String(cleanupResult.error && (cleanupResult.error.code || cleanupResult.error.message || "") || "");
				if (!/PGRST202|not found|Could not find the function/i.test(cleanupMessage)) throw cleanupResult.error;
			}
		}
		if (client && client.functions && typeof client.functions.invoke === "function") {
			const result = await client.functions.invoke("delete-current-user", { method: "POST" });
			if (!result.error) return result.data || true;
			functionError = result.error;
			lastError = result.error;
		}
		if (client && typeof client.rpc === "function") {
			const result = await client.rpc("delete_current_user");
			if (!result.error) return result.data || true;
			lastError = result.error;
		}
		throw functionError || lastError || new Error("회원탈퇴 처리 함수가 준비되지 않았습니다.");
	}

	function clearRealjejuLocalAuthStorage()
	{
		const removeMatchingKeys = (storage) => {
			if (!storage) return;
			try {
				Object.keys(storage).forEach((key) => {
					if (/supabase|sb-|realjeju/i.test(key)) storage.removeItem(key);
				});
			} catch (err) {}
		};
		removeMatchingKeys(window.localStorage);
		removeMatchingKeys(window.sessionStorage);
	}

	function getRealjejuWithdrawErrorMessage(error)
	{
		const message = String(error && (error.message || error.name) || "").trim();
		if (!message) return "회원탈퇴 처리 중 오류가 발생했습니다.\nEdge Function 로그를 확인해 주세요.";
			if (/Function not found|not found|404/i.test(message)) {
				return "회원탈퇴 처리 함수가 준비되지 않았습니다.\nsql/admin_tools_3.212.sql 실행 또는 delete-current-user Edge Function 배포를 확인해 주세요.";
			}
		if (/non-2xx|FunctionsHttpError|500|service/i.test(message)) {
			return "delete-current-user 함수 실행 중 오류가 발생했습니다.\nSupabase Edge Functions 로그와 SERVICE_ROLE_KEY 설정을 확인해 주세요.";
		}
		return "회원탈퇴 실패: " + message;
	}

	function handleRealjejuWithdraw()
	{
		closeGlobalAccountDropdown();
		openAuthConfirmModal(
			"회원탈퇴 시 계정 정보가 삭제되며\n복구할 수 없습니다.\n정말 탈퇴하시겠습니까?",
			"회원탈퇴",
			async function () {
				const client = getRealjejuSupabaseClient();
				if (!client) {
					openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "회원탈퇴", null);
					return;
				}
				try {
					const { data: userData, error: userError } = await client.auth.getUser();
					const user = userData && userData.user ? userData.user : null;
					if (userError || !user) {
						openAuthErrorModal("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", "회원탈퇴", null);
						return;
					}
					await callRealjejuWithdrawEndpoint(client);
					clearRealjejuLocalAuthStorage();
					hideProfileSuitePages();
					applyLoggedOutAccountUI();
					openAuthErrorModal("회원탈퇴가 완료되었습니다.", "회원탈퇴", null, function () {
						const homeBtn = Array.from(document.querySelectorAll(".topbar-menu-item")).find((btn) => {
							const label = String(btn.textContent || "").trim();
							return label === "부동산 홈" || label === "홈";
						});
						if (homeBtn) homeBtn.click();
					});
				} catch (err) {
					console.error("회원탈퇴 실패:", err);
					openAuthErrorModal(getRealjejuWithdrawErrorMessage(err), "회원탈퇴", null);
				}
			},
			null
		);
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
			setRealjejuActiveSession(user, null);
			const { data: profile } = await supabaseForInit
				.from("profiles")
				.select("status, name, email, phone, role, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (!isRealjejuActiveSessionUser(user)) return;
			if (profile && profile.status && profile.status !== "active") {
				clearRealjejuCachedProfile(user.id);
				await supabaseForInit.auth.signOut();
				applyLoggedOutAccountUI();
				return;
			}
			applyLoggedInAccountUI(user, profile);
			try {
				const agencyRows = await fetchMySuiteBrokerOfficeRows(supabaseForInit, user, profile || null);
				if (!isRealjejuActiveSessionUser(user)) return;
				const rows = (Array.isArray(agencyRows) ? agencyRows : []).filter(row => row && row.status !== "deleted" && !row.deleted_at);
				window.realjejuCurrentBrokerOffice = rows.find(row => row && getBrokerOfficeRowStatus(row) === "active") || rows[0] || null;
			} catch (agencyError) {
				window.realjejuCurrentBrokerOffice = null;
			}
			if (typeof window.realjejuLoadRegistrantInfo === "function") {
				window.realjejuLoadRegistrantInfo();
				setTimeout(window.realjejuLoadRegistrantInfo, 250);
			}
			currentRealjejuProfileCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
		} catch (err) {
			console.warn("로그인 상태 확인 실패:", err);
			applyLoggedOutAccountUI();
		}
	}

	document.addEventListener("click", (e) => {
		const trigger = e.target.closest("#detailAuthTrigger");
		if (trigger && trigger.dataset.authState === "logged-in") {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (typeof toggleGlobalAccountDropdown === "function") toggleGlobalAccountDropdown();
			return;
		}

		const accountMenuItem = e.target.closest(".global-account-menu-item[data-account-action]");
		if (accountMenuItem && globalAccountDropdown && globalAccountDropdown.contains(accountMenuItem)) {
			e.preventDefault();
			e.stopImmediatePropagation();
			const action = accountMenuItem.dataset.accountAction || "";
			if (["favorites", "inquiries", "reports", "payment", "myinfo", "broker-office"].includes(action)) {
				openMySuitePage(action);
				return;
			}
			if (action === "logout") {
				handleRealjejuLogout();
				return;
			}
			if (action === "withdraw") {
				handleRealjejuWithdraw();
				return;
			}
			if (action === "payment") {
				openPaymentPageFromAccountMenu();
				return;
			}
			if (action === "myinfo") {
				openMyInfoFromAccountMenu();
				return;
			}
			if (action === "profile") {
				if (typeof window.closeMyInfoPage === "function") window.closeMyInfoPage();
				openProfileSetupFromAccountMenu();
				return;
			}
			if (action === "broker-office") {
				if (accountMenuItem.disabled || accountMenuItem.classList.contains("is-pending")) {
					openAuthErrorModal("현재 승인 대기중입니다.", "중개사무소", null);
					return;
				}
				if (accountMenuItem.classList.contains("is-active") || /중개사무소\s*정보/.test(accountMenuItem.textContent || "")) {
					openBrokerOfficeInfoFromAccountMenu();
					return;
				}
				openBrokerOfficeFromAccountMenu();
				return;
			}
			closeGlobalAccountDropdown();
			openAuthErrorModal("준비중입니다.", "이용 안내", null);
			return;
		}

		if (globalAccountDropdown && globalAccountDropdown.classList.contains("open") && !e.target.closest("#globalAccountDropdown") && !e.target.closest("#detailAuthTrigger")) {
			closeGlobalAccountDropdown();
		}
	}, true);

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeGlobalAccountDropdown();
	});

	/* PATCH 3.185: 로그인 이름 클릭 처리는 상단 document click 리스너에서만 한다. */
	if (globalAuthTrigger) {
		globalAuthTrigger.addEventListener("click", (e) => {
			if (!(globalAuthTrigger.dataset && globalAuthTrigger.dataset.authState === "logged-in")) return;
		}, true);
	}


	/* ===== PATCH: 로그인 버튼 클릭 복구 ===== */
	if (globalAuthTrigger) {
		globalAuthTrigger.addEventListener("click", (e) => {
			if (globalAuthTrigger.dataset && globalAuthTrigger.dataset.authState === "logged-in") return;
			e.preventDefault();
			e.stopPropagation();
			if (typeof openAuthModal === "function") {
				openAuthModal();
			} else if (authModal) {
				document.body.classList.add("auth-page-open", "sidebar-list-collapsed");
				authModal.classList.add("open");
				authModal.setAttribute("aria-hidden", "false");
			}
		});
	}

	/* PATCH: Supabase Auth public client only - SECRET_KEY 금지 */
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
		privacy: "https://realjeju.app/terms/privacy_policy.json",
		refund: "https://realjeju.app/terms/refund_policy.json"
	};

	const TERMS_HEADER_TITLES = {
		service: "서비스 이용약관",
		location: "위치기반 서비스 이용약관",
		privacy: "개인정보처리방침",
		refund: "환불 및 취소 정책"
	};

	function hideAllAuthScreens()
	{
		if (authLoginScreen) authLoginScreen.classList.add("auth-screen-hidden");
		if (authSignupTermsScreen) authSignupTermsScreen.classList.add("auth-screen-hidden");
		if (authSignupFormScreen) authSignupFormScreen.classList.add("auth-screen-hidden");
		if (authForgotPasswordScreen) authForgotPasswordScreen.classList.add("auth-screen-hidden");
		if (authResetPasswordScreen) authResetPasswordScreen.classList.add("auth-screen-hidden");
		if (authProfileSetupScreen) authProfileSetupScreen.classList.add("auth-screen-hidden");
		if (authMyInfoScreen) authMyInfoScreen.classList.add("auth-screen-hidden");
		if (authBrokerOfficeInfoScreen) authBrokerOfficeInfoScreen.classList.add("auth-screen-hidden");
		if (authBrokerOfficeScreen) authBrokerOfficeScreen.classList.add("auth-screen-hidden");
	}

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
		authTermChecks.forEach((check) => {
			check.checked = false;
		});
		syncAuthTermsState();
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

	function hideWorkspacePanelsForStandaloneProfile()
	{
		if (typeof closePaymentPage === "function") closePaymentPage();
		document.body.classList.remove("myinfo-page-open", "payment-page-open", "broker-home-page-open", "admin-page-open", "property-register-page-open", "profile-page-open", "broker-office-info-page-open");
		["myInfoPagePanel", "paymentPagePanel", "brokerHomePanel", "adminPagePanel", "propertyRegisterPage"].forEach((id) => {
			const el = document.getElementById(id);
			if (el) {
				if (id === "brokerHomePanel" && typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(el);
				el.setAttribute("aria-hidden", "true");
			}
		});
	}

	function closeStandaloneProfilePages()
	{
		document.body.classList.remove("profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open");
		[authProfileSetupScreen, authBrokerOfficeInfoScreen, authBrokerOfficeScreen].forEach((screen) => {
			if (screen) {
				screen.classList.add("auth-screen-hidden");
				screen.setAttribute("aria-hidden", "true");
			}
		});
		const commonFooter = document.querySelector(".auth-profile-common-footer");
		if (commonFooter) {
			commonFooter.hidden = true;
			commonFooter.classList.remove("is-visible", "is-positioned");
		}
		const brokerInfoFooter = document.querySelector(".broker-office-info-page-footer");
		if (brokerInfoFooter) {
			brokerInfoFooter.hidden = true;
			brokerInfoFooter.classList.remove("is-visible");
		}
		document.body.style.overflow = "";
	}

	function ensureBrokerOfficePageActions()
	{
		const form = document.getElementById("brokerOfficeApplyForm");
		if (!form) return;
		const page = form.closest(".broker-apply-page");
		if (page && !page.querySelector(".broker-office-edit-heading")) {
			const heading = document.createElement("div");
			heading.className = "broker-office-edit-heading";
			heading.innerHTML = '<h2>중개사무소 수정</h2><p>중개사무소 정보를 관리합니다.</p>';
			page.insertBefore(heading, form);
		}
		const submitBtn = form.querySelector(".broker-apply-submit");
		if (!submitBtn) return;
		let actionRow = form.querySelector(".broker-apply-actions");
		if (!actionRow) {
			actionRow = document.createElement("div");
			actionRow.className = "broker-apply-actions";
			submitBtn.parentElement.insertBefore(actionRow, submitBtn);
			actionRow.appendChild(submitBtn);
		} else if (submitBtn.parentElement !== actionRow) {
			actionRow.appendChild(submitBtn);
		}
		let closeBtn = actionRow.querySelector(".broker-apply-close-page-btn");
		if (!closeBtn) {
			closeBtn = document.createElement("button");
			closeBtn.type = "button";
			closeBtn.className = "broker-apply-close-page-btn";
			closeBtn.textContent = "닫기";
			closeBtn.addEventListener("click", (e) => {
				e.preventDefault();
				if (typeof closeAuthModal === "function") closeAuthModal();
			});
			actionRow.appendChild(closeBtn);
		}
	}

	function openStandaloneProfilePage(screen, pageClass, useCommonFooter)
	{
		if (!screen) return;
		hideWorkspacePanelsForStandaloneProfile();
		hideAllAuthScreens();
		updateAuthBackVisibility(false);
		closeGlobalAccountDropdown();
		if (authModal) {
			authModal.classList.remove("open", "profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}
		document.body.classList.remove("profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open");
		document.body.classList.add(pageClass);
		if (screen.parentElement !== document.body) {
			document.body.appendChild(screen);
		}
		screen.classList.remove("auth-screen-hidden");
		screen.setAttribute("aria-hidden", "false");
		if (useCommonFooter) {
			const commonFooter = document.querySelector(".auth-profile-common-footer");
			if (commonFooter) {
				screen.appendChild(commonFooter);
				commonFooter.hidden = false;
				commonFooter.classList.add("is-visible");
				commonFooter.classList.remove("is-positioned");
			}
		}
		if (screen === authBrokerOfficeInfoScreen) {
			const brokerInfoFooter = document.querySelector(".broker-office-info-page-footer");
			if (brokerInfoFooter) {
				screen.appendChild(brokerInfoFooter);
				brokerInfoFooter.hidden = false;
				brokerInfoFooter.classList.add("is-visible");
			}
		}
		if (screen === authBrokerOfficeScreen) {
			ensureBrokerOfficePageActions();
		}
		const topbarAccountTrigger = document.querySelector(".global-auth-trigger");
		if (topbarAccountTrigger) topbarAccountTrigger.classList.add("profile-page-active");
		document.body.style.overflow = "";
		screen.scrollTop = 0;
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
		openStandaloneProfilePage(authProfileSetupScreen, "profile-edit-page-open", true);
		setTimeout(() => { if (authProfileNameInput) authProfileNameInput.focus(); }, 0);
	}

	function requireProfileSetupIfNeeded(supabaseClient, user, profileData)
	{
		const profile = profileData || null;
		setRealjejuActiveSession(user || null, profile);
		const needsSetup = !profile || profile.profile_completed !== true || !profile.name || !profile.phone;
		currentRealjejuProfileCompleted = !needsSetup;
		if (needsSetup) fillAuthProfileSetupForm(profile);
		return needsSetup;
	}

	function openAuthModal()
	{
		if (!authModal) return;
		showAuthLoginScreen();
		document.body.classList.remove("payment-page-open", "myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "broker-home-page-open", "admin-page-open", "property-register-page-open");
		document.body.classList.add("auth-page-open", "sidebar-list-collapsed");
		["paymentPagePanel", "myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel", "brokerHomePanel", "adminPagePanel", "propertyRegisterPage"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) {
				if (id === "brokerHomePanel" && typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(panel);
				panel.setAttribute("aria-hidden", "true");
			}
		});
		if (typeof state !== "undefined" && state) state.isListOpen = false;
		if (sidebar) sidebar.classList.remove("expanded");
		authModal.classList.add("open");
		authModal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "";
	}

	function closeAuthModal()
	{
		if (isAuthBusy() || isAuthErrorOpen()) return;
		const isStandaloneProfileOpen = document.body.classList.contains("profile-edit-page-open") || document.body.classList.contains("broker-office-info-page-open") || document.body.classList.contains("broker-office-edit-page-open");
		const shouldReturnToMyInfo = !!(
			window.realjejuReturnToMyInfoAfterProfileClose &&
			(
				(authProfileSetupScreen && !authProfileSetupScreen.classList.contains("auth-screen-hidden")) ||
				document.body.classList.contains("profile-edit-page-open")
			)
		);
		const shouldReturnToBrokerOfficeInfo = !!(
			window.realjejuReturnToBrokerOfficeInfoAfterClose &&
			(
				(authBrokerOfficeScreen && !authBrokerOfficeScreen.classList.contains("auth-screen-hidden")) ||
				document.body.classList.contains("broker-office-edit-page-open")
			)
		);
		if (shouldReturnToMyInfo) {
			window.realjejuReturnToMyInfoAfterProfileClose = false;
			if (authModal) authModal.dataset.returnToMyInfo = "";
			openMyInfoFromAccountMenu();
			return;
		}
		if (shouldReturnToBrokerOfficeInfo) {
			window.realjejuReturnToBrokerOfficeInfoAfterClose = false;
			openBrokerOfficeInfoFromAccountMenu();
			return;
		}
		if (isStandaloneProfileOpen) {
			closeStandaloneProfilePages();
			return;
		}
		if (!authModal) return;
		if (authProfileSetupScreen && !authProfileSetupScreen.classList.contains("auth-screen-hidden")) {
			isRealjejuProfileSetupRequired = false;
			showAuthLoginScreen();
		}
		if (typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(authModal);
		authModal.classList.remove("open");
		authModal.classList.remove("profile-page-mode");
		authModal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("auth-page-open");
		syncProfilePageBodyState();
		document.body.style.overflow = "";
	}

	function openAuthErrorModal(message, title, returnFocusTarget, confirmAction)
	{
		if (!authErrorModal) return;
		/* PATCH: 내 정보 설정 전체페이지 위에서도 에러창이 반드시 보이도록 body 직속 + 최상단 레이어 고정 */
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

	function getRealjejuForgotPasswordErrorMessage(error)
	{
		const message = String(error?.message || error || "").trim();
		const lowerMessage = message.toLowerCase();
		if ((lowerMessage.includes("email address") && lowerMessage.includes("invalid")) || lowerMessage.includes("invalid email")) {
			return "이메일 주소를 정확히 입력해 주세요.";
		}
		if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many")) {
			return "요청이 너무 많습니다.\n잠시 후 다시 시도해 주세요.";
		}
		if (lowerMessage.includes("user not found") || lowerMessage.includes("not found")) {
			return "가입한 이메일을 확인해 주세요.";
		}
		return "비밀번호 재설정 메일 발송에 실패했습니다.";
	}

	function getRealjejuSignupErrorMessage(error)
	{
		const message = String(error?.message || error || "").trim();
		const lowerMessage = message.toLowerCase();
		const status = Number(error?.status || error?.statusCode || 0);
		const code = String(error?.code || error?.error_code || "").toLowerCase();
		if (lowerMessage.includes("already") || lowerMessage.includes("registered")) {
			return "이미 가입된 아이디입니다.";
		}
		if (code.includes("email") || (lowerMessage.includes("email address") && lowerMessage.includes("invalid")) || lowerMessage.includes("invalid email")) {
			return "이메일 주소를 정확히 입력해 주세요.";
		}
		if (lowerMessage.includes("password")) {
			return "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.";
		}
		if (lowerMessage.includes("signup") && lowerMessage.includes("disabled")) {
			return "현재 회원가입을 사용할 수 없습니다.\n관리자에게 문의해 주세요.";
		}
		if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many")) {
			return "요청이 너무 많습니다.\n잠시 후 다시 시도해 주세요.";
		}
		if (status === 422) {
			return "회원가입 정보를 확인해 주세요.\n이메일 주소 또는 비밀번호 조건이 맞지 않습니다.";
		}
		return "회원가입에 실패했습니다.\n입력한 정보를 다시 확인해 주세요.";
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

	function isValidRealjejuEmail(email)
	{
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
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
		openAuthErrorModal("아이디는 가입한 이메일 주소입니다.\n가입한 이메일을 확인해 주세요.", "아이디 찾기", authEmailInput);
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
			const lines = String(content).replace(/\r\n/g, "\n").split("\n");
			let paragraphLines = [];
			const flushParagraph = () => {
				if (!paragraphLines.length) return;
				html += "<p>" + paragraphLines.map((line) => escapeTermsHtml(line)).join("<br>") + "</p>";
				paragraphLines = [];
			};
			lines.forEach((line) => {
				const trimmed = line.trim();
				if (!trimmed) {
					flushParagraph();
					return;
				}
				if (/^\d+\.\s+/.test(trimmed)) {
					flushParagraph();
					html += "<p class=\"terms-inline-heading\">" + escapeTermsHtml(trimmed) + "</p>";
					return;
				}
				paragraphLines.push(line);
			});
			flushParagraph();
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
			const res = await fetch(requestUrl, {
				cache: "no-store",
				headers: { "Accept": "application/json, text/plain, */*" }
			});
			if (!res.ok) throw new Error("HTTP " + res.status);
			const rawText = await res.text();
			const cleanedText = rawText.replace(/^\uFEFF/, "").trim();
			if (!cleanedText) throw new Error("EMPTY_TERMS_RESPONSE");
			let data = null;
			try {
				data = JSON.parse(cleanedText);
			} catch (parseError) {
				data = { title: fallbackHeaderTitle, content: cleanedText };
			}
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
			const openedTermCheck = document.querySelector(`.auth-term-check[data-term="${currentTermsKey}"]`);
			if (openedTermCheck && !openedTermCheck.checked) {
				openedTermCheck.checked = true;
				openedTermCheck.dispatchEvent(new Event("change", { bubbles: true }));
			}
		}
		currentTermsKey = null;
		termsFullPage.classList.remove("open");
		termsFullPage.setAttribute("aria-hidden", "true");
		document.body.style.overflow = authModal && authModal.classList.contains("open") ? "hidden" : "";
	}

	document.querySelectorAll(".global-auth-trigger, .detail-auth-trigger").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (typeof btn.blur === "function") btn.blur();

			if (btn.classList.contains("global-auth-trigger") && btn.dataset.authState === "logged-in") {
				e.stopImmediatePropagation();
				toggleGlobalAccountDropdown();
				return;
			}

			if (btn.dataset.authState === "logged-in") {
				toggleGlobalAccountDropdown();
				return;
			}

			openAuthModal();
		});
	});

	if (authModalBack) {
		authModalBack.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (isAuthBusy() || isAuthErrorOpen()) return;
			if (authSignupFormScreen && !authSignupFormScreen.classList.contains("auth-screen-hidden")) {
				showAuthSignupTermsScreen();
				return;
			}
			showAuthLoginScreen();
		});
	}

	if (authModalClose) {
		authModalClose.addEventListener("click", (e) => {
			e.preventDefault();
			closeAuthModal();
		});
	}

	/* PATCH: 모달 바깥 클릭/마우스 이동으로 닫히지 않도록 overlay close 제거 */
	if (authModal) {
		authModal.addEventListener("click", (e) => {
			if (e.target === authModal) {
				e.preventDefault();
			}
		});
	}

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

	const AUTH_REMEMBER_ID_KEY = "rj_auth_remember_email";
	try {
		const savedEmail = localStorage.getItem(AUTH_REMEMBER_ID_KEY) || "";
		if (savedEmail && authEmailInput) authEmailInput.value = savedEmail;
		if (authRememberIdInput) authRememberIdInput.checked = !!savedEmail;
	} catch (err) {}

	if (authRememberIdInput) {
		authRememberIdInput.addEventListener("change", () => {
			try {
				if (authRememberIdInput.checked && authEmailInput && authEmailInput.value.trim()) {
					localStorage.setItem(AUTH_REMEMBER_ID_KEY, authEmailInput.value.trim());
				} else if (!authRememberIdInput.checked) {
					localStorage.removeItem(AUTH_REMEMBER_ID_KEY);
				}
			} catch (err) {}
		});
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
				try {
					if (authRememberIdInput && authRememberIdInput.checked) localStorage.setItem(AUTH_REMEMBER_ID_KEY, emailValue);
					else localStorage.removeItem(AUTH_REMEMBER_ID_KEY);
				} catch (err) {}
				const { data, error } = await supabaseForLogin.auth.signInWithPassword({
					email: emailValue,
					password: passwordValue
				});
				if (error) {
					openAuthErrorModal("아이디 또는 비밀번호가 올바르지 않습니다.", "로그인 오류", authEmailInput);
					return;
				}
				if (data && data.user) {
					setRealjejuActiveSession(data.user, null);
					const { data: profileData, error: profileError } = await supabaseForLogin
						.from("profiles")
						.select("status, name, phone, role, role_request, profile_completed, profile_image")
						.eq("id", data.user.id)
						.maybeSingle();
					if (!isRealjejuActiveSessionUser(data.user)) return;

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
			const profilePhoneValue = formatDisplayPhone(authProfilePhoneInput?.value || "");
			const profileRoleRequestValue = authProfileRoleRequestSelect ? authProfileRoleRequestSelect.value : "user";

			if (!profileNameValue) {
				openAuthErrorModal("이름을 입력하세요.", "내 정보 설정", authProfileNameInput);
				return;
			}
			if (!isValidRealjejuMobilePhone(profilePhoneValue)) {
				openAuthErrorModal("휴대폰번호를 정확히 입력하세요.", "내 정보 설정", authProfilePhoneInput);
				return;
			}
			if (!authProfilePrivacyAgreeCheck || !authProfilePrivacyAgreeCheck.checked) {
				openAuthErrorModal("개인정보 수집 및 이용에 동의해 주세요.", "내 정보 설정", authProfilePrivacyAgreeCheck);
				return;
			}

			const supabaseForProfile = getRealjejuSupabaseClient();
			if (!supabaseForProfile) {
				openAuthErrorModal("Supabase URL과 PUBLIC KEY 설정이 필요합니다.", "내 정보 설정", authProfileNameInput);
				return;
			}

			let user = currentRealjejuAuthUser;
			syncAuthProfileEmail(user);
			if (!user) {
				const { data } = await supabaseForProfile.auth.getUser();
				user = data && data.user ? data.user : null;
			}
			if (!user || !user.id) {
				openAuthErrorModal("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", "내 정보 설정", authProfileNameInput);
				return;
			}

			const profileSubmitBtn = authProfileSetupForm.querySelector(".auth-modal-submit");
			try {
				isRealjejuSavingProfile = true;
				if (profileSubmitBtn) profileSubmitBtn.disabled = true;
				const profileSavedAt = new Date().toISOString();
				const profilePayload = {
					id: user.id,
					email: user.email || "",
					name: profileNameValue,
					phone: profilePhoneValue,
					role_request: profileRoleRequestValue,
					profile_completed: true,
					privacy_agreed_at: profileSavedAt,
					updated_at: profileSavedAt
				};
				const { error } = await saveRealjejuOwnProfile(supabaseForProfile, user.id, profilePayload);

				if (error) {
					console.error("개인정보 저장 실패:", error);
					openAuthErrorModal("개인정보 저장에 실패했습니다.", "내 정보 설정", authProfileNameInput);
					return;
				}

				isRealjejuProfileSetupRequired = false;
				currentRealjejuProfileCompleted = true;
				applyLoggedInAccountUI(user, {
					name: profileNameValue,
					phone: profilePhoneValue,
					role_request: profileRoleRequestValue,
					profile_completed: true
				});
				if (typeof updateBrokerOfficeDropdownMenu === "function") {
					await updateBrokerOfficeDropdownMenu(user, {
						role_request: profileRoleRequestValue
					});
				}
				sessionStorage.removeItem(REALJEJU_PROFILE_PROMPT_SESSION_KEY);
				currentRealjejuAuthUser = user;
				window.realjejuCurrentAuthUser = user;
				closeAuthModal();
			} catch (err) {
				console.error("개인정보 저장 오류:", err);
				openAuthErrorModal("개인정보 저장 중 오류가 발생했습니다.", "내 정보 설정", authProfileNameInput);
			} finally {
				isRealjejuSavingProfile = false;
				if (profileSubmitBtn) profileSubmitBtn.disabled = false;
			}
		});
	}

	/* PATCH: 내 정보 설정 저장 버튼 클릭 시 submit 이벤트가 막혀도 필수 입력 안내가 뜨도록 보강 */
	if (authProfileSetupForm) {
		const authProfileSubmitBtn = authProfileSetupForm.querySelector(".auth-modal-submit");
		if (authProfileSubmitBtn) {
			authProfileSubmitBtn.addEventListener("click", (e) => {
				if (!authProfileSetupScreen || authProfileSetupScreen.classList.contains("auth-screen-hidden")) return;
				const profileNameValue = String(authProfileNameInput?.value || "").trim();
				const profilePhoneValue = formatDisplayPhone(authProfilePhoneInput?.value || "");
				if (!profileNameValue) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("이름을 입력하세요.", "내 정보 설정", authProfileNameInput);
					return;
				}
				if (!isValidRealjejuMobilePhone(profilePhoneValue)) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("휴대폰번호를 정확히 입력하세요.", "내 정보 설정", authProfilePhoneInput);
					return;
				}
				if (!authProfilePrivacyAgreeCheck || !authProfilePrivacyAgreeCheck.checked) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("개인정보 수집 및 이용에 동의해 주세요.", "내 정보 설정", authProfilePrivacyAgreeCheck);
				}
			}, true);
		}
	}

	if (authProfileAgentRegisterBtn) {
		authProfileAgentRegisterBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openAuthErrorModal("중개사 등록은 별도 신청 페이지에서 진행됩니다.", "중개사 등록", authProfileAgentRegisterBtn);
		});
	}

	if (authErrorConfirmBtn) {
		authErrorConfirmBtn.addEventListener("click", (e) => {
			e.preventDefault();
			closeAuthErrorModal();
		});
	}

	if (authErrorCancelBtn) {
		authErrorCancelBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (!authErrorModal || isAuthBusy()) return;
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
			if (!isValidRealjejuEmail(forgotEmailValue)) {
				openAuthErrorModal("이메일 주소를 정확히 입력해 주세요.", "비밀번호 찾기", authForgotEmailInput);
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
					openAuthErrorModal(getRealjejuForgotPasswordErrorMessage(error), "비밀번호 찾기", authForgotEmailInput);
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

			if (!isValidRealjejuEmail(signupEmailValue)) {
				openAuthErrorModal("이메일 주소를 정확히 입력해 주세요.", "회원가입 오류", authSignupEmailInput);
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
					openAuthErrorModal(getRealjejuSignupErrorMessage(error), "회원가입 오류", authSignupEmailInput);
					return;
				}
				if (data && data.user) {
					if (authSignupPasswordInput) authSignupPasswordInput.value = "";
					if (authSignupPasswordConfirmInput) authSignupPasswordConfirmInput.value = "";
					showAuthLoginScreen();
					if (authEmailInput) authEmailInput.value = signupEmailValue;
					openAuthErrorModal("회원가입이 완료되었습니다.\n이메일을 확인해 주세요.", "회원가입 완료", authEmailInput);
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
			authTermChecks.forEach((check) => {
				check.checked = true;
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

	window.realjejuInitAccountUI = initRealjejuAccountUI;
	applyLoggedOutAccountUI();
	scheduleSupabaseScriptLoad();

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
			document.body.classList.add("auth-page-open", "sidebar-list-collapsed");
			authModal.classList.add("open");
			authModal.setAttribute("aria-hidden", "false");
			document.body.style.overflow = "";
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
		setRealjejuActiveSession(user, window.realjejuCurrentProfile || null);
		try {
			const { data: profile } = await supabaseForFeature
				.from("profiles")
				.select("name, phone, role, role_request, profile_completed, profile_image")
				.eq("id", user.id)
				.maybeSingle();
			if (!isRealjejuActiveSessionUser(user)) return false;
			setRealjejuActiveSession(user, profile || null);
			currentRealjejuProfileCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
			if (currentRealjejuProfileCompleted) return true;
			fillAuthProfileSetupForm(profile);
		} catch (err) {
			console.warn("내 정보 설정 상태 확인 실패:", err);
		}
		openAuthErrorModal("개인정보 입력 후 이용 가능합니다.", featureName || "이용 안내", null, openProfileSetupModalNow);
		return false;
	}

	document.addEventListener("click", async (e) => {
		const target = e.target.closest("[data-requires-profile], .favorite-btn, .wish-btn, .inquiry-btn, .contact-btn, .register-btn, .detail-agent-cta-btn.phone, .detail-agent-cta-btn.kakao");
		if (!target || target.closest("#authModal") || target.closest("#authErrorModal")) return;
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

	const myInfoBrokerOfficeBtn = document.getElementById("myInfoBrokerOfficeBtn");
	if (myInfoBrokerOfficeBtn) {
		myInfoBrokerOfficeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (myInfoBrokerOfficeBtn.classList.contains("is-pending")) {
				openAuthErrorModal("현재 승인 대기중입니다.", "중개사무소", null);
				return;
			}
			if (myInfoBrokerOfficeBtn.classList.contains("is-active")) {
				openBrokerOfficeInfoFromAccountMenu();
				return;
			}
			openBrokerOfficeFromAccountMenu();
		});
	}

	const myInfoPageEditProfileBtn = document.getElementById("myInfoPageEditProfileBtn");
	if (myInfoPageEditProfileBtn) {
		myInfoPageEditProfileBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			await openProfileSetupFromAccountMenu();
		});
	}

	const myInfoPageBrokerOfficeBtn = document.getElementById("myInfoPageBrokerOfficeBtn");
	if (myInfoPageBrokerOfficeBtn) {
		myInfoPageBrokerOfficeBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			if (myInfoPageBrokerOfficeBtn.classList.contains("is-pending")) {
				openAuthErrorModal("현재 승인 대기중입니다.", "중개사무소", null);
				return;
			}
			if (myInfoPageBrokerOfficeBtn.classList.contains("is-active")) {
				await openBrokerOfficeInfoFromAccountMenu();
				return;
			}
			await openBrokerOfficeFromAccountMenu();
		});
	}

	const myInfoPageWithdrawBtn = document.getElementById("myInfoPageWithdrawBtn");
	if (myInfoPageWithdrawBtn) {
		myInfoPageWithdrawBtn.addEventListener("click", (e) => {
			e.preventDefault();
			handleRealjejuWithdraw();
		});
	}

	const profileEditPagePhotoBtn = document.getElementById("profileEditPagePhotoBtn");
	const profileEditPagePhotoInput = document.getElementById("profileEditPagePhotoInput");
	if (profileEditPagePhotoBtn && profileEditPagePhotoInput) {
		profileEditPagePhotoBtn.addEventListener("click", () => profileEditPagePhotoInput.click());
		profileEditPagePhotoInput.addEventListener("change", () => {
			const file = profileEditPagePhotoInput.files && profileEditPagePhotoInput.files[0] ? profileEditPagePhotoInput.files[0] : null;
			if (!file) return;
			if (!/^image\//.test(file.type || "")) {
				openAuthErrorModal("이미지 파일만 선택할 수 있습니다.", "프로필 사진", profileEditPagePhotoInput);
				profileEditPagePhotoInput.value = "";
				authProfilePhotoFile = null;
				return;
			}
			authProfilePhotoFile = file;
			const reader = new FileReader();
			reader.onload = () => setProfileImageElement(document.getElementById("profileEditPagePhotoPreview"), reader.result);
			reader.readAsDataURL(file);
		});
	}

	const profileEditPageForm = document.getElementById("profileEditPageForm");
	if (profileEditPageForm) {
		async function handleProfileEditSubmit(e) {
			if (e && typeof e.preventDefault === "function") e.preventDefault();
			if (e && typeof e.stopPropagation === "function") e.stopPropagation();
			if (isRealjejuSavingProfile) {
				openAuthErrorModal("저장 중입니다. 잠시만 기다려 주세요.", "내 정보 수정", null);
				return;
			}
			const nameInput = document.getElementById("profileEditPageNameInput");
			const phoneInput = document.getElementById("profileEditPagePhoneInput");
			const roleSelect = document.getElementById("profileEditPageRoleSelect");
			const privacyCheck = document.getElementById("profileEditPagePrivacyCheck");
			const saveBtn = document.getElementById("profileEditPageSaveBtn");
			const name = String(nameInput && nameInput.value || "").trim();
			const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
			const role = roleSelect && roleSelect.value ? roleSelect.value : "user";
			if (!name) return openAuthErrorModal("이름을 입력하세요.", "내 정보 수정", nameInput);
			if (!isValidRealjejuMobilePhone(phone)) return openAuthErrorModal("휴대폰번호를 정확히 입력하세요.", "내 정보 수정", phoneInput);
			if (!privacyCheck || !privacyCheck.checked) return openAuthErrorModal("개인정보 수집 및 이용에 동의해 주세요.", "내 정보 수정", privacyCheck);
			const client = getRealjejuSupabaseClient();
			if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "내 정보 수정", nameInput);
			const originalSaveText = saveBtn ? saveBtn.textContent : "";
			try {
				isRealjejuSavingProfile = true;
				if (saveBtn) {
					saveBtn.disabled = true;
					saveBtn.textContent = "저장 중...";
					saveBtn.classList.add("is-saving");
				}
				const { data: userData } = await client.auth.getUser();
				const user = userData && userData.user ? userData.user : null;
				if (!user || !user.id) return openAuthErrorModal("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.", "내 정보 수정", nameInput);
				if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "내 정보 수정", nameInput);
				const now = new Date().toISOString();
				const uploadedProfileImage = await uploadAuthProfilePhotoIfNeeded(client, user.id);
				if (!isRealjejuActiveSessionUser(user)) return openAuthErrorModal("로그인 계정이 변경되었습니다. 다시 시도해 주세요.", "내 정보 수정", nameInput);
				const profilePayload = {
					id: user.id,
					email: user.email || "",
					name: name,
					phone: phone,
					role_request: role,
					profile_completed: true,
					privacy_agreed_at: now,
					updated_at: now
				};
				if (uploadedProfileImage) profilePayload.profile_image = uploadedProfileImage;
				let result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
				if (result && result.error && /profile_image/i.test(String(result.error.message || ""))) {
					delete profilePayload.profile_image;
					result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
				}
				if (result && result.error) {
					console.error("내 정보 수정 실패:", result.error);
					return openAuthErrorModal("내 정보 저장에 실패했습니다.", "내 정보 수정", nameInput);
				}
				currentRealjejuProfileCompleted = true;
				applyLoggedInAccountUI(user, {
					name: name,
					phone: phone,
					role_request: role,
					profile_completed: true,
					profile_image: uploadedProfileImage || window.authProfilePhotoUrl || ""
				});
				openAuthErrorModal("내 정보가 저장되었습니다.", "내 정보 수정", null, function () {
					openMyInfoFromAccountMenu();
				});
			} catch (err) {
				console.error("내 정보 저장 오류:", err);
				openAuthErrorModal("내 정보 저장 중 오류가 발생했습니다.", "내 정보 수정", nameInput);
			} finally {
				isRealjejuSavingProfile = false;
				if (saveBtn) {
					saveBtn.disabled = false;
					saveBtn.textContent = originalSaveText || "저장";
					saveBtn.classList.remove("is-saving");
				}
			}
		}

		profileEditPageForm.addEventListener("submit", handleProfileEditSubmit);
		const profileEditPageSaveBtn = document.getElementById("profileEditPageSaveBtn");
		if (profileEditPageSaveBtn) {
			profileEditPageSaveBtn.disabled = false;
		}
	}

	const profileEditPageCloseBtn = document.getElementById("profileEditPageCloseBtn");
	if (profileEditPageCloseBtn) {
		profileEditPageCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openMyInfoFromAccountMenu();
		});
	}

	const brokerOfficePageCloseBtn = document.getElementById("brokerOfficePageCloseBtn");
	if (brokerOfficePageCloseBtn) {
		brokerOfficePageCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openMyInfoFromAccountMenu();
		});
	}

	const brokerOfficePageEditBtn = document.getElementById("brokerOfficePageEditBtn");
	if (brokerOfficePageEditBtn) {
		brokerOfficePageEditBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openBrokerOfficeEditFromInfo();
		});
	}

	const brokerOfficeEditPageCloseBtn = document.getElementById("brokerOfficeEditPageCloseBtn");
	if (brokerOfficeEditPageCloseBtn) {
		brokerOfficeEditPageCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openBrokerOfficeInfoFromAccountMenu();
		});
	}

	const brokerOfficeEditPageForm = document.getElementById("brokerOfficeEditPageForm");
	if (brokerOfficeEditPageForm) {
		brokerOfficeEditPageForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const client = getRealjejuSupabaseClient();
			if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "중개사무소 수정", null);
			const { data: userData } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : null;
			if (!user) return openAuthModal();
			const officeNameInput = document.getElementById("brokerOfficeEditPageNameInput");
			const addressInput = document.getElementById("brokerOfficeEditPageAddressInput");
			const regNoInput = document.getElementById("brokerOfficeEditPageRegNoInput");
			const ownerInput = document.getElementById("brokerOfficeEditPageOwnerInput");
			const phoneInput = document.getElementById("brokerOfficeEditPagePhoneInput");
			const emailInput = document.getElementById("brokerOfficeEditPageEmailInput");
			const kakaoInput = document.getElementById("brokerOfficeEditPageKakaoInput");
			const saveBtn = document.getElementById("brokerOfficeEditPageSaveBtn");
			const officeName = String(officeNameInput && officeNameInput.value || "").trim();
			const address = String(addressInput && addressInput.value || "").trim();
			const regNo = String(regNoInput && regNoInput.value || "").trim();
			const owner = String(ownerInput && ownerInput.value || "").trim();
			const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
			const email = String(emailInput && emailInput.value || "").trim();
			const kakaoUrl = String(kakaoInput && kakaoInput.value || "").trim();
			if (!officeName) return openAuthErrorModal("중개사무소명을 입력하세요.", "중개사무소 수정", officeNameInput);
			if (!address) return openAuthErrorModal("주소를 입력하세요.", "중개사무소 수정", addressInput);
			if (!regNo) return openAuthErrorModal("등록번호를 입력하세요.", "중개사무소 수정", regNoInput);
				if (!owner) return openAuthErrorModal("대표자명을 입력하세요.", "중개사무소 수정", ownerInput);
				if (!isValidRealjejuOfficePhone(phone)) return openAuthErrorModal("연락처를 정확히 입력하세요.", "중개사무소 수정", phoneInput);
				if (!email) return openAuthErrorModal("이메일을 입력하세요.", "중개사무소 수정", emailInput);
				if (!isValidRealjejuBrokerOfficeEmail(email)) return openAuthErrorModal("이메일 주소를 정확히 입력하세요.", "중개사무소 수정", emailInput);
				if (!isValidRealjejuKakaoOpenChatUrl(kakaoUrl)) return openAuthErrorModal("카카오 오픈 채팅방 주소는 http 또는 https로 시작해야 합니다.", "중개사무소 수정", kakaoInput);
				try {
				if (saveBtn) saveBtn.disabled = true;
				const canEditBrokerOffice = await requireBrokerRoleForBrokerOfficeApply(client, user, officeNameInput, {
					title: "중개사무소 수정",
					message: REALJEJU_BROKER_OFFICE_EDIT_ROLE_MESSAGE
				});
				if (!canEditBrokerOffice) return;
				const agencyId = brokerOfficeEditPageForm.dataset.agencyId || "";
				const agencyPayload = {
					office_name: officeName,
					owner_name: owner,
					office_reg_no: regNo,
					office_address: address,
					phone: phone,
					email: email,
					kakao_url: kakaoUrl
				};
				let updatedOffice = null;
				try {
					updatedOffice = await saveRealjejuAgencyProfile(client, agencyId, agencyPayload);
				} catch (error) {
					console.error("중개사무소 정보 수정 실패:", error);
					if (isRealjejuKakaoUrlColumnError(error) || isRealjejuMissingKakaoRpcError(error)) {
						return openAuthErrorModal("중개사 정보 저장 기능이 아직 DB에 설치되지 않았습니다.\nsql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행해 주세요.", "중개사무소 수정", kakaoInput || officeNameInput);
					}
					if (isRealjejuAgencyNotFoundError(error)) return openAuthErrorModal("수정할 중개사무소를 찾지 못했습니다. 관리자 페이지에서 해당 계정 이메일과 중개사무소 이메일 연결 상태를 확인해 주세요.", "중개사무소 수정", officeNameInput);
					return openAuthErrorModal("중개사무소 정보 수정에 실패했습니다.", "중개사무소 수정", null);
				}
				window.realjejuCurrentBrokerOffice = {
					...(window.realjejuCurrentBrokerOffice || {}),
					...(updatedOffice || {}),
					id: (updatedOffice && updatedOffice.id) || agencyId,
					user_id: (updatedOffice && updatedOffice.user_id) || user.id,
					office_name: officeName,
					owner_name: owner,
					office_reg_no: regNo,
					office_address: address,
					phone: phone,
					email: email,
					kakao_url: (updatedOffice && updatedOffice.kakao_url) || kakaoUrl,
					updated_at: updatedOffice && updatedOffice.updated_at
				};
				cacheMapListingAgency(window.realjejuCurrentBrokerOffice);
				fillBrokerOfficePageInfo(window.realjejuCurrentBrokerOffice);
				openAuthErrorModal("중개사무소 정보가 수정되었습니다.", "중개사무소 수정", null, function () {
					openBrokerOfficeInfoPageWithOffice(window.realjejuCurrentBrokerOffice);
				});
			} catch (err) {
				console.error("중개사무소 수정 오류:", err);
				openAuthErrorModal("중개사무소 정보 수정 중 오류가 발생했습니다.", "중개사무소 수정", null);
			} finally {
				if (saveBtn) saveBtn.disabled = false;
			}
		});
	}

	const brokerOfficeInfoCloseBtn = document.getElementById("brokerOfficeInfoCloseBtn");
	if (brokerOfficeInfoCloseBtn) {
		brokerOfficeInfoCloseBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (typeof window.closeAuthModal === "function") window.closeAuthModal();
		});
	}

	const brokerOfficeInfoEditBtn = document.getElementById("brokerOfficeInfoEditBtn");
	if (brokerOfficeInfoEditBtn) {
		brokerOfficeInfoEditBtn.addEventListener("click", (e) => {
			e.preventDefault();
			openBrokerOfficeEditFromInfo();
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

	const brokerOfficeSearchBtn = document.getElementById("brokerOfficeSearchBtn");
	if (brokerOfficeSearchBtn) {
		brokerOfficeSearchBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const searchInput = document.getElementById("brokerOfficeSearchInput");
			const nameInput = document.getElementById("brokerOfficeNameInput");
			const manualField = document.getElementById("brokerOfficeManualNameField");
			if (manualField) manualField.style.display = "block";
			if (nameInput && searchInput) nameInput.value = searchInput.value || "";
			openAuthErrorModal("상호 검색 API 연결 전까지 직접 입력으로 접수합니다.", "중개사무소 검색", nameInput || searchInput);
		});
	}

	async function focusBrokerOfficeAddressOnMap(address)
	{
		const query = String(address || "").trim();
		if (!query) return;
		if (!window.kakao || !kakao.maps || !kakao.maps.services) {
			openAuthErrorModal("지도 주소 검색 서비스를 불러오지 못했습니다.", "주소 검색", null);
			return;
		}

		const geocoder = new kakao.maps.services.Geocoder();
		const places = new kakao.maps.services.Places();
		const queries = query.includes("제주") ? [query] : [query, `제주 ${query}`, `제주특별자치도 ${query}`];

		for (const q of queries) {
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
			const found = await new Promise(resolve => {
				places.keywordSearch(q, (result, status) => {
					if (status === kakao.maps.services.Status.OK && Array.isArray(result) && result.length) {
						resolve(result[0]);
						return;
					}
					resolve(null);
				});
			});
			if (found) {
				if (typeof focusMapByAddress === "function") {
					focusMapByAddress(found.y, found.x, found.place_name || found.address_name || query);
				}
				return;
			}
		}

		openAuthErrorModal("지도에서 주소 위치를 찾지 못했습니다.", "주소 검색", document.getElementById("brokerOfficeAddressInput"));
	}

	const brokerOfficeAddressSearchBtn = document.getElementById("brokerOfficeAddressSearchBtn");
	if (brokerOfficeAddressSearchBtn) {
		brokerOfficeAddressSearchBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			try {
				const Postcode = await loadDaumPostcodeScript();
				new Postcode({
					oncomplete: function(data) {
						const addressInput = document.getElementById("brokerOfficeAddressInput");
						const selectedAddress = data.roadAddress || data.jibunAddress || "";
						if (addressInput) addressInput.value = selectedAddress;
						focusBrokerOfficeAddressOnMap(selectedAddress);
					}
				}).open();
				return;
			} catch (err) {
				console.error("주소 검색 스크립트 로드 실패:", err);
			}
			openAuthErrorModal("주소 검색 스크립트를 불러오지 못했습니다.", "주소 검색", null);
		});
	}

	const brokerOfficeAddressInput = document.getElementById("brokerOfficeAddressInput");
	if (brokerOfficeAddressInput) {
		brokerOfficeAddressInput.addEventListener("keydown", (e) => {
			if (e.key !== "Enter") return;
			e.preventDefault();
			focusBrokerOfficeAddressOnMap(brokerOfficeAddressInput.value);
		});
		brokerOfficeAddressInput.addEventListener("change", () => {
			focusBrokerOfficeAddressOnMap(brokerOfficeAddressInput.value);
		});
	}

	const brokerOfficeApplyForm = document.getElementById("brokerOfficeApplyForm");
	if (brokerOfficeApplyForm) {
		brokerOfficeApplyForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const client = getRealjejuSupabaseClient();
			if (!client) return openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "중개사무소 가입 신청", null);
			const { data: userData } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : null;
			if (!user) return openAuthModal();
			const officeName = (document.getElementById("brokerOfficeNameInput")?.value || document.getElementById("brokerOfficeSearchInput")?.value || "").trim();
			const ownerName = (document.getElementById("brokerOwnerNameInput")?.value || "").trim();
			const licenseNo = (document.getElementById("brokerLicenseNoInput")?.value || "").trim();
			const address = (document.getElementById("brokerOfficeAddressInput")?.value || "").trim();
			const addressDetail = (document.getElementById("brokerOfficeAddressDetailInput")?.value || "").trim();
			const phone = formatDisplayPhone(document.getElementById("brokerOfficePhoneInput")?.value || "");
			const email = (document.getElementById("brokerOwnerEmailLocalInput")?.value || "").trim();
			const kakaoUrl = (document.getElementById("brokerOfficeKakaoInput")?.value || "").trim();
			if (!officeName) return openAuthErrorModal("중개사무소명을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficeNameInput"));
			if (!address) return openAuthErrorModal("주소를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficeAddressInput"));
			if (!licenseNo) return openAuthErrorModal("등록번호를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerLicenseNoInput"));
				if (!ownerName) return openAuthErrorModal("대표자명을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOwnerNameInput"));
				if (!phone) return openAuthErrorModal("연락처를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficePhoneInput"));
				if (!email) return openAuthErrorModal("이메일을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOwnerEmailLocalInput"));
				if (!isValidRealjejuBrokerOfficeEmail(email)) return openAuthErrorModal("이메일 주소를 정확히 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOwnerEmailLocalInput"));
				if (!isValidRealjejuKakaoOpenChatUrl(kakaoUrl)) return openAuthErrorModal("카카오 오픈 채팅방 주소는 http 또는 https로 시작해야 합니다.", "중개사무소 가입 신청", document.getElementById("brokerOfficeKakaoInput"));
				try {
				const isEditMode = brokerOfficeApplyForm.dataset.mode === "edit" && brokerOfficeApplyForm.dataset.agencyId;
				if (isEditMode) {
					const canEditBrokerOffice = await requireBrokerRoleForBrokerOfficeApply(client, user, document.getElementById("brokerOfficeNameInput"), {
						title: "중개사무소 정보",
						message: REALJEJU_BROKER_OFFICE_EDIT_ROLE_MESSAGE
					});
					if (!canEditBrokerOffice) return;
				} else {
					const canApplyBrokerOffice = await requireBrokerRoleForBrokerOfficeApply(client, user, document.getElementById("brokerOfficeNameInput"));
					if (!canApplyBrokerOffice) return;
				}
				const agencyPayload = {
					office_name: officeName,
					owner_name: ownerName,
					office_reg_no: licenseNo,
					office_address: addressDetail ? address + " " + addressDetail : address,
					phone: phone,
					email: email,
					kakao_url: kakaoUrl,
					updated_at: new Date().toISOString()
				};

				if (isEditMode) {
					let updatedOffice = null;
					try {
						updatedOffice = await saveRealjejuAgencyProfile(client, brokerOfficeApplyForm.dataset.agencyId, agencyPayload);
					} catch (error) {
						console.error("중개사무소 정보 수정 실패:", error);
						if (isRealjejuKakaoUrlColumnError(error) || isRealjejuMissingKakaoRpcError(error)) {
							return openAuthErrorModal("중개사 정보 저장 기능이 아직 DB에 설치되지 않았습니다.\nsql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행해 주세요.", "중개사무소 정보", document.getElementById("brokerOfficeKakaoInput"));
						}
						if (isRealjejuAgencyNotFoundError(error)) return openAuthErrorModal("수정할 중개사무소를 찾지 못했습니다. 관리자 페이지에서 해당 계정 이메일과 중개사무소 이메일 연결 상태를 확인해 주세요.", "중개사무소 정보", document.getElementById("brokerOfficeNameInput"));
						return openAuthErrorModal("중개사무소 정보 수정에 실패했습니다.", "중개사무소 정보", null);
					}
					window.realjejuCurrentBrokerOffice = {
						...(window.realjejuCurrentBrokerOffice || {}),
						...(updatedOffice || {}),
						id: (updatedOffice && updatedOffice.id) || brokerOfficeApplyForm.dataset.agencyId,
						user_id: (updatedOffice && updatedOffice.user_id) || user.id,
						...agencyPayload,
						kakao_url: (updatedOffice && updatedOffice.kakao_url) || kakaoUrl,
						updated_at: (updatedOffice && updatedOffice.updated_at) || agencyPayload.updated_at
					};
					cacheMapListingAgency(window.realjejuCurrentBrokerOffice);

					openAuthErrorModal(
						"중개사무소 정보가 수정되었습니다.",
						"중개사무소 정보",
						null,
						function () {
							openBrokerOfficeInfoPageWithOffice(window.realjejuCurrentBrokerOffice);
						}
					);
					return;
				}

				// PATCH: 로그인 아이디당 중개사무소 가입 신청은 1회만 허용
				const { data: existingAgency, error: existingAgencyError } = await client
					.from("agencies")
					.select("id")
					.eq("user_id", user.id)
					.or("status.is.null,status.neq.deleted")
					.order("created_at", { ascending: false })
					.limit(1)
					.maybeSingle();

				if (existingAgencyError) {
					console.error("중개사무소 신청 여부 확인 실패:", existingAgencyError);
					return openAuthErrorModal("중개사무소 신청 여부 확인에 실패했습니다.", "중개사무소 가입 신청", null);
				}

				if (existingAgency) {
					return openAuthErrorModal("이미 중개사무소 가입 신청이 접수되었습니다.", "중개사무소 가입 신청", null);
				}

				const { error } = await client.from("agencies").insert({
					user_id: user.id,
					...agencyPayload,
					status: "waiting",
					created_at: new Date().toISOString(),
				});
				if (error) {
					console.error("중개사무소 신청 실패:", error);
					if (isRealjejuKakaoUrlColumnError(error)) return openAuthErrorModal(REALJEJU_KAKAO_URL_COLUMN_MESSAGE, "중개사무소 가입 신청", document.getElementById("brokerOfficeKakaoInput"));
					return openAuthErrorModal("중개사무소 신청 저장에 실패했습니다.", "중개사무소 가입 신청", null);
				}
				const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");
				const brokerMenuItem = document.getElementById("brokerOfficeMenuItem");
				if (brokerMenuWrapper) brokerMenuWrapper.style.setProperty("display", "block");
				if (brokerMenuItem) {
					brokerMenuItem.textContent = "승인 대기중";
					brokerMenuItem.disabled = true;
					brokerMenuItem.classList.add("is-pending");
				}
				openAuthErrorModal(
					"중개사무소 가입 신청이 접수되었습니다.",
					"중개사무소 가입 신청",
					null,
					function () {
					if (authModal) {
						authModal.classList.remove("open");
						authModal.classList.remove("profile-page-mode");
						authModal.setAttribute("aria-hidden", "true");
					}
					document.body.classList.remove("auth-page-open");
					syncProfilePageBodyState();
					hideAllAuthScreens();
						updateAuthBackVisibility(false);
						document.body.style.overflow = "";
					}
				);
			} catch (err) {
				console.error("중개사무소 신청 오류:", err);
				openAuthErrorModal("중개사무소 신청 중 오류가 발생했습니다.", "중개사무소 가입 신청", null);
			}
		});
	}


	function closeAdminPage()
	{
		document.body.classList.remove("admin-page-open");
		const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");
	}

	// PATCH 2.316: 중개사 홈 패널은 등록 매물 저장 완료 후 이동할 관리 화면
	function closeBrokerHomePage()
	{
		document.body.classList.remove("broker-home-page-open", "detail-page-panel-open");
		const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) {
			if (typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(brokerHomePanel);
			brokerHomePanel.setAttribute("aria-hidden", "true");
		}
		if (!document.body.classList.contains("property-register-page-open") && typeof refreshMapLayout === "function") {
			setTimeout(refreshMapLayout, 0);
		}
	}

	function closePropertyRegisterPage()
	{
		document.body.classList.remove("property-register-page-open");
		const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) {
			if (propertyRegisterPage.dataset.listingId) {
				delete propertyRegisterPage.dataset.listingId;
				delete propertyRegisterPage.dataset.pendingListingId;
				delete propertyRegisterPage.dataset.saveInFlight;
				setPropertyRegisterEditMode(false);
			}
			propertyRegisterPage.setAttribute("aria-hidden", "true");
		}
	}


	function resetPropertyRegistrantInputs()
	{
		[
			"registrantOfficeNameInput",
			"registrantRepresentativeInput",
			"registrantPhone1Input",
			"registrantManagerNameInput",
			"registrantPhone2Input"
		].forEach((id) => {
			const el = document.getElementById(id);
			if (el) el.value = "";
		});

		const chk = document.getElementById("registrantLicensedAgentChk");
		const manager = document.getElementById("registrantManagerNameInput");
		const phone2 = document.getElementById("registrantPhone2Input");
		if (chk) chk.checked = false;
		if (manager) manager.disabled = true;
		if (phone2) phone2.disabled = true;
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
			setRealjejuActiveSession(user, window.realjejuCurrentProfile || null);

			let profile = null;
			try
			{
				const { data: profileData } = await client
					.from("profiles")
					.select("name, phone, profile_image, role_request")
					.eq("id", user.id)
					.maybeSingle();
				profile = profileData || null;
				if (!isRealjejuActiveSessionUser(user)) return;
				setRealjejuActiveSession(user, profile || null);
			}
			catch (profileError)
			{
				console.warn("매물등록 등록자 정보 profiles 조회 실패:", profileError);
			}

			let agency = null;
			try
			{
				const agencyRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
				if (!isRealjejuActiveSessionUser(user)) return;
				const rows = (Array.isArray(agencyRows) ? agencyRows : []).filter(row => row && row.status !== "deleted" && !row.deleted_at);
				agency = rows.find(row => row && getBrokerOfficeRowStatus(row) === "active") || rows[0] || null;
				window.realjejuCurrentBrokerOffice = agency || null;
			}
			catch (agencyError)
			{
				console.warn("매물등록 등록자 정보 agencies 조회 실패:", agencyError);
			}

			setPropertyRegistrantValue("registrantOfficeNameInput", agency && agency.office_name ? agency.office_name : "");
			setPropertyRegistrantValue("registrantRepresentativeInput", agency && agency.owner_name ? agency.owner_name : (profile && profile.name ? profile.name : ""));
			setPropertyRegistrantValue("registrantPhone1Input", agency && agency.phone ? agency.phone : (profile && profile.phone ? profile.phone : ""));
		}
		catch (error)
		{
			console.warn("매물등록 등록자 정보 직접 조회 실패:", error);
		}
	}

	function hasPropertyRegisterDraft()
	{
		const page = document.getElementById("propertyRegisterPage");
		if (!page) return false;

		const draftFieldIds = [
			"propertyAddressInput", "propertyDongInput", "propertyHoInput",
			"exclusiveAreaM2Input", "exclusiveAreaPyInput", "supplyAreaM2Input", "supplyAreaPyInput",
			"landAreaM2Input", "landAreaPyInput", "landRoadInput",
			"priceMonthlyDepositInput", "priceMonthlyRentInput", "priceSaleInput",
			"priceJeonseDepositInput", "priceYearlyDepositInput", "priceYearlyRentInput",
			"priceShortDepositInput", "priceShortRentInput",
			"propertyApprovalDateInput", "propertyRoomCountInput", "propertyBathCountInput",
			"propertyTotalFloorInput", "propertyCurrentFloorInput", "propertyStoreCountInput", "propertyHouseholdCountInput",
			"propertyParkingTotalInput", "propertyParkingPerInput", "propertyPremiumInput",
			"propertyPremiumDescInput", "maintenanceFixedTotalInput", "maintenanceCommonInput",
			"maintenanceElectricInput", "maintenanceWaterInput", "maintenanceGasInput",
			"maintenanceHeatingInput", "maintenanceInternetInput", "maintenanceTvInput",
			"maintenanceEtcInput", "maintenanceTotalInput", "propertyMoveInDateInput",
			"propertyLocationSummaryInput", "propertyDetailDescriptionInput", "propertyAgencyMemoInput",
			"landTypeSelect", "landUseZoneSelect"
		];

		if (draftFieldIds.some((id) => {
			const el = document.getElementById(id);
			return el && String(el.value || "").trim() !== "";
		})) return true;

		const propertyType = document.getElementById("propertyTypeSelect");
		if (propertyType && propertyType.value && propertyType.value !== "apartment") return true;
		const buildingUse = document.getElementById("buildingUseSelect");
		if (buildingUse && buildingUse.value) return true;
		const direction = document.getElementById("propertyDirectionSelect");
		if (direction && direction.value) return true;

		const defaultRadioValues = {
			propertyAddressLocationMode: "rectangle",
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

	// PATCH 2.268: 매물등록 화면의 실제 스크롤 컨테이너와 첫 콘텐츠를 같은 기준으로 맨 위에 맞춤
	function scrollPropertyRegisterToTop()
	{
		const page = document.getElementById("propertyRegisterPage");
		if (page) {
			page.scrollTop = 0;
			if (typeof page.scrollTo === "function") page.scrollTo({ top: 0, left: 0, behavior: "auto" });
		}
		window.scrollTo(0, 0);
	}

	// PATCH 2.283: 확인 후에는 먼저 맨 위로 이동하고 열린 페이지에서 값만 즉시 초기화
	function resetOpenPropertyRegisterPageForNewPost()
	{
		document.body.classList.add("property-register-page-open");
		const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "false");
		scrollPropertyRegisterToTop();
		resetPropertyRegisterFormFields();
	}

	// PATCH 2.322: 매물 등록/수정 모드를 같은 폼에서 명확히 구분해 하단 버튼 문구를 전환
	function setPropertyRegisterEditMode(isEdit)
	{
		const page = document.getElementById("propertyRegisterPage");
		const submitBtn = document.getElementById("propertySubmitBtn");
		const draftBtn = document.getElementById("propertyDraftSaveBtn");
		if (page) page.classList.toggle("is-edit-mode", !!isEdit);
		if (submitBtn) submitBtn.textContent = isEdit ? "매물 수정하기" : "매물 등록하기";
		if (draftBtn) draftBtn.textContent = isEdit ? "취소" : "임시저장";
	}
	window.realjejuSetPropertyRegisterEditMode = setPropertyRegisterEditMode;

	// PATCH 2.280: 매물 등록 폼 값 초기화는 동기 처리로 분리해 확인 콜백에서 즉시 반영
	function resetPropertyRegisterFormFields()
	{
		const page = document.getElementById("propertyRegisterPage");
		if (!page) return;
		// PATCH 2.315: 새 글 시작 시 이전 저장 매물 ID를 비워 다음 저장이 새 매물이 되게 함
		delete page.dataset.listingId;
		delete page.dataset.pendingListingId;
		delete page.dataset.saveInFlight;
		window.REALJEJU_LAST_SAVED_LISTING_ID = "";
		setPropertyRegisterEditMode(false);

		page.querySelectorAll("input, textarea, select").forEach((el) => {
			if (el.closest(".property-registrant-card")) return;
			if (el.type === "checkbox" || el.type === "radio") {
				el.checked = false;
			} else {
				el.value = "";
			}
			el.dispatchEvent(new Event("input", { bubbles: true }));
			el.dispatchEvent(new Event("change", { bubbles: true }));
		});
		// PATCH 2.303: 새 글 시작 시 사진 미리보기와 선택 파일도 함께 초기화
		if (typeof window.realjejuClearPropertyPhotoPreview === "function") window.realjejuClearPropertyPhotoPreview();
		if (typeof setPropertyListingNoMode === "function") setPropertyListingNoMode("auto");

		const propertyTypeSelect = document.getElementById("propertyTypeSelect");
		if (propertyTypeSelect) propertyTypeSelect.value = "apartment";
		const addressMode = document.querySelector('input[name="propertyAddressLocationMode"][value="rectangle"]');
		if (addressMode) addressMode.checked = true;
		// PATCH 2.262: 새 글 시작 초기화에는 주소 지도/좌표/마커 상태까지 포함
		if (typeof window.realjejuResetPropertyAddressLocation === "function") window.realjejuResetPropertyAddressLocation();

		const maintenanceTab = document.querySelector('#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="fixed"]');
		if (maintenanceTab) maintenanceTab.click();
		["maintenanceElectricType", "maintenanceWaterType", "maintenanceGasType", "maintenanceHeatingType", "maintenanceInternetType", "maintenanceTvType"].forEach((name) => {
			const radio = document.querySelector(`input[name="${name}"][value="usage"]`);
			if (radio) radio.checked = true;
		});
		const maintenanceEtcNone = document.querySelector('input[name="maintenanceEtcType"][value="none"]');
		if (maintenanceEtcNone) maintenanceEtcNone.checked = true;

		if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
		if (typeof updatePropertyRegisterAreaFields === "function") updatePropertyRegisterAreaFields();
		if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
		if (typeof updatePropertyParkingDetail === "function") updatePropertyParkingDetail();
		if (typeof updatePropertyPetVisibilityByDeal === "function") updatePropertyPetVisibilityByDeal();
		if (typeof ensureDefaultCheckRadios === "function") ensureDefaultCheckRadios();
		scrollPropertyRegisterToTop();
	}
	window.resetPropertyRegisterFormFields = resetPropertyRegisterFormFields;
	window.closePropertyRegisterPage = closePropertyRegisterPage;

	// PATCH 2.228: 작성 중인 글 확인 모달에서 취소를 누르면 매물 등록 폼 전체 초기화
	async function resetPropertyRegisterForm()
	{
		resetPropertyRegisterFormFields();
		if (typeof loadPropertyRegistrantInfoDirect === "function") await loadPropertyRegistrantInfoDirect();
		scrollPropertyRegisterToTop();
	}

	async function openPropertyRegisterPage(options = {})
	{
		closeGlobalAccountDropdown();
		const requireBrokerAccess = typeof window.requireApprovedBrokerForPropertyRegister === "function"
			? window.requireApprovedBrokerForPropertyRegister
			: (typeof requireApprovedBrokerForPropertyRegister === "function" ? requireApprovedBrokerForPropertyRegister : null);
		const brokerAccess = requireBrokerAccess ? await requireBrokerAccess() : null;
		if (!brokerAccess) return;

		const shouldConfirmExistingDraft = !!options.confirmExistingDraft;
		const wasRegisterPageOpen = document.body.classList.contains("property-register-page-open");
		const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		const hasEditState = !!(propertyRegisterPage && propertyRegisterPage.dataset.listingId);
		const shouldKeepExistingDraft = !wasRegisterPageOpen && !hasEditState && hasPropertyRegisterDraft();
		document.body.classList.add("property-register-page-open");
		closeAdminPage();
		closeBrokerHomePage();

		if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "false");

		if (wasRegisterPageOpen) {
			const hasDraft = hasPropertyRegisterDraft();
			if (shouldConfirmExistingDraft && hasDraft && typeof openAuthConfirmModal === "function") {
				openAuthConfirmModal(
					"작성 중인 글이 있습니다.\n이전 글을 취소하고 새로 쓸까요?",
					"매물 등록",
					function () {
						resetOpenPropertyRegisterPageForNewPost();
					},
					function () {
						return;
					}
				);
			} else {
				scrollPropertyRegisterToTop();
			}
			return;
		}

		if (!shouldKeepExistingDraft) {
			resetPropertyRegisterFormFields();
			renderPropertyPriceFields();
		} else {
			if (typeof updatePropertyRegisterAreaFields === "function") updatePropertyRegisterAreaFields();
			if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
			if (typeof updatePropertyParkingDetail === "function") updatePropertyParkingDetail();
			if (typeof updatePropertyFloorLevelRadioState === "function") updatePropertyFloorLevelRadioState();
		}
		scrollPropertyRegisterToTop();

		await loadPropertyRegistrantInfoDirect();
		scrollPropertyRegisterToTop();
	}

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
		const templates = {
			monthly: `
				<div class="property-price-row" data-price-type="monthly">
					<div class="property-form-label">월세<span class="property-required">*</span></div>
					<div class="property-price-fields two">
						<div>
							<div class="property-price-field-title">보증금</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceMonthlyDepositInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceMonthlyDepositInput"></span>
							</div>
						</div>
						<div>
							<div class="property-price-field-title">월세</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceMonthlyRentInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceMonthlyRentInput"></span>
							</div>
						</div>
					</div>
				</div>
			`,
			sale: `
				<div class="property-price-row" data-price-type="sale">
					<div class="property-form-label">매매<span class="property-required">*</span></div>
					<div class="property-price-fields">
						<div>
							<div class="property-price-field-title">가격</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceSaleInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceSaleInput"></span>
							</div>
						</div>
					</div>
				</div>
			`,
			jeonse: `
				<div class="property-price-row" data-price-type="jeonse">
					<div class="property-form-label">전세<span class="property-required">*</span></div>
					<div class="property-price-fields">
						<div>
							<div class="property-price-field-title">보증금</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceJeonseDepositInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceJeonseDepositInput"></span>
							</div>
						</div>
					</div>
				</div>
			`,
			yearly: `
				<div class="property-price-row" data-price-type="yearly">
					<div class="property-form-label">년세<span class="property-required">*</span></div>
					<div class="property-price-fields two">
						<div>
							<div class="property-price-field-title">보증금</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceYearlyDepositInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceYearlyDepositInput"></span>
							</div>
						</div>
						<div>
							<div class="property-price-field-title">년세</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceYearlyRentInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceYearlyRentInput"></span>
							</div>
						</div>
					</div>
				</div>
			`,
			short: `
				<div class="property-price-row" data-price-type="short">
					<div class="property-form-label">단기<span class="property-required">*</span></div>
					<div class="property-price-fields two">
						<div>
							<div class="property-price-field-title">보증금</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceShortDepositInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceShortDepositInput"></span>
							</div>
						</div>
						<div>
							<div class="property-price-field-title">단기 월세</div>
							<div class="property-price-field">
								<div class="property-money-input-wrap"><input type="text" class="property-register-input" id="priceShortRentInput" placeholder="0" inputmode="numeric" /><span class="property-unit-label">만원</span></div>
								<span class="property-money-korean" data-money-korean-for="priceShortRentInput"></span>
							</div>
						</div>
					</div>
				</div>
			`
		};
		return templates[type] || "";
	}

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
		const checked = Array.from(document.querySelectorAll(".property-deal-check:checked")).map((input) => input.value);
		box.innerHTML = checked.map(getPropertyPriceFieldHtml).join("");
		bindPropertyMoneyCommaInputs(box);
		restorePropertyPriceValues(previousValues);
	}

	function updatePropertyRegisterAreaFields()
	{
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

		let firstLabel = "전용면적";
		let secondLabel = "공급면적";
		landAreaLabel.innerHTML = '대지면적<span class="property-required">*</span>';

		if (type === "officetel" || type === "office" || type === "store") {
			firstLabel = "전용면적";
			secondLabel = "계약면적";
		} else if (type === "house" || type === "multi_family_house" || type === "building" || type === "factory_warehouse") {
			if (exclusiveAreaRow.parentNode && landAreaRow.nextElementSibling !== exclusiveAreaRow) {
				exclusiveAreaRow.parentNode.insertBefore(landAreaRow, exclusiveAreaRow);
			}
			landAreaRow.style.display = "grid";
			firstLabel = "건축면적";
			secondLabel = "연면적";
		} else if (type === "land") {
			exclusiveAreaRow.style.display = "none";
			supplyAreaRow.style.display = "none";
			landAreaRow.style.display = "grid";
			landRoadRow.style.display = "grid";
		}

		/* PATCH 2.232: 면적 원문에 대지/건축/연면적이 있으면 매물유형과 관계없이 3개 면적 표시 */
		if (propertyTypeSelect.dataset.areaMode === "land_building_total") {
			if (exclusiveAreaRow.parentNode && landAreaRow.nextElementSibling !== exclusiveAreaRow) {
				exclusiveAreaRow.parentNode.insertBefore(landAreaRow, exclusiveAreaRow);
			}
			exclusiveAreaRow.style.display = "grid";
			supplyAreaRow.style.display = "grid";
			landAreaRow.style.display = "grid";
			landRoadRow.style.display = type === "land" ? "grid" : "none";
			firstLabel = "건축면적";
			secondLabel = "연면적";
			landAreaLabel.innerHTML = '대지면적<span class="property-required">*</span>';
		}

		/* PATCH 2.233: 대지/연면적만 있는 원문은 대지 면적을 먼저, 연 면적을 다음에 표시 */
		if (propertyTypeSelect.dataset.areaMode === "land_total") {
			if (supplyAreaRow.parentNode && landAreaRow.nextElementSibling !== supplyAreaRow) {
				supplyAreaRow.parentNode.insertBefore(landAreaRow, supplyAreaRow);
			}
			exclusiveAreaRow.style.display = "none";
			supplyAreaRow.style.display = "grid";
			landAreaRow.style.display = "grid";
			landRoadRow.style.display = type === "land" ? "grid" : "none";
			secondLabel = "연면적";
			landAreaLabel.innerHTML = '대지면적<span class="property-required">*</span>';
		}

		/* PATCH 2.240: 간편등록 면적 라벨은 매물유형이 아니라 원문 면적명 그대로 표시 */
		if (propertyTypeSelect.dataset.areaMode === "supply_private" || propertyTypeSelect.dataset.areaMode === "contract_private") {
			if (exclusiveAreaRow.parentNode && landAreaRow.previousElementSibling !== supplyAreaRow) {
				exclusiveAreaRow.parentNode.insertBefore(landAreaRow, supplyAreaRow.nextSibling);
			}
			exclusiveAreaRow.style.display = "grid";
			supplyAreaRow.style.display = "grid";
			landAreaRow.style.display = "none";
			landRoadRow.style.display = "none";
			firstLabel = "전용면적";
			secondLabel = propertyTypeSelect.dataset.areaMode === "contract_private" ? "계약면적" : "공급면적";
			landAreaLabel.innerHTML = '대지면적<span class="property-required">*</span>';
		}

		/* PATCH 2.240: 대지면적만 있는 원문은 대지 면적 한 칸만 표시 */
		if (propertyTypeSelect.dataset.areaMode === "land_only") {
			exclusiveAreaRow.style.display = "none";
			supplyAreaRow.style.display = "none";
			landAreaRow.style.display = "grid";
			landRoadRow.style.display = type === "land" ? "grid" : "none";
			landAreaLabel.innerHTML = '대지면적<span class="property-required">*</span>';
		}

		exclusiveAreaLabel.innerHTML = firstLabel + '<span class="property-required">*</span>';
		supplyAreaLabel.textContent = secondLabel;
	}


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
		const residentialTypes = ["apartment", "officetel", "room", "villa", "house", "multi_family_house", "hotel", "pension"];
		const commercialTypes = ["store", "office"];
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

	function updatePropertyParkingDetail()
	{
		const box = document.getElementById("propertyParkingDetail");
		const selected = document.querySelector('input[name="propertyParking"]:checked');
		if (!box) return;
		box.classList.toggle("open", !!selected && selected.value === "possible");
	}

	// PATCH 2.912: 해당없음 해제 시 체크 직전 방/욕실 값을 복원
	function updatePropertyRoomBathNotApplicable()
	{
		const checkbox = document.getElementById("propertyRoomBathNotApplicableChk");
		const roomInput = document.getElementById("propertyRoomCountInput");
		const bathInput = document.getElementById("propertyBathCountInput");
		if (!checkbox || !roomInput || !bathInput) return;
		const isDisabled = checkbox.checked;
		[roomInput, bathInput].forEach((input) => {
			if (isDisabled) {
				input.dataset.roomBathPreviousValue = input.value || input.dataset.roomBathPreviousValue || "";
				input.disabled = true;
				if (input.value) {
					input.value = "";
					input.dispatchEvent(new Event("input", { bubbles: true }));
					input.dispatchEvent(new Event("change", { bubbles: true }));
				}
				return;
			}
			input.disabled = false;
			if (!input.value && input.dataset.roomBathPreviousValue) {
				input.value = input.dataset.roomBathPreviousValue;
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
					if (!levelRadios.some((radio) => radio.checked) && levelUseCheck.dataset.previousFloorLevel) {
						const previousRadio = levelRadios.find((radio) => radio.value === levelUseCheck.dataset.previousFloorLevel);
						if (previousRadio) previousRadio.checked = true;
					}
				} else {
					const checkedRadio = levelRadios.find((radio) => radio.checked);
					if (checkedRadio) levelUseCheck.dataset.previousFloorLevel = checkedRadio.value;
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
				levelUseCheck.dataset.previousFloorLevel = radio.value;
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
	function getRegisterRadioValue(name)
	{
		return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
	}

	function setRegisterRadioValue(name, value)
	{
		const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
		if (radio) radio.checked = true;
	}

	function ensureDefaultCheckRadios()
	{
		if (!getRegisterRadioValue("propertyLoan")) setRegisterRadioValue("propertyLoan", "check");
		if (!getRegisterRadioValue("propertyPet")) setRegisterRadioValue("propertyPet", "check");
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

	function buildPropertyPhotoSaveList(uploadedPhotos)
	{
		const uploadQueue = Array.isArray(uploadedPhotos) ? [...uploadedPhotos] : [];
		const savedPhotos = [];
		propertyPhotoPreviewState.items.forEach((item) => {
			if (!item) return;
			if (item.file) {
				const uploaded = uploadQueue.shift();
				if (uploaded && String(uploaded.url || uploaded.publicUrl || "").trim()) savedPhotos.push(uploaded);
				return;
			}
			const existing = item.existingPhoto && typeof item.existingPhoto === "object"
				? { ...item.existingPhoto, url: String(item.existingPhoto.url || item.existingPhoto.publicUrl || item.url || "").trim() }
				: { url: String(item.url || "").trim(), name: item.name || "저장된 사진" };
			if (existing.url) savedPhotos.push(existing);
		});
		return savedPhotos.map((photo, index) => ({
			...photo,
			order: index + 1
		}));
	}

	window.realjejuBuildPropertyPhotoSaveList = buildPropertyPhotoSaveList;

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

	function extractPropertyListingNoFromTitle(title)
	{
		return extractPropertyListingNoCandidate(title);
	}

	function syncPropertyListingNoFromTitle()
	{
		const titleInput = document.getElementById("propertyLocationSummaryInput");
		if (!titleInput) return;
		const listingNo = extractPropertyListingNoFromTitle(titleInput.value);
		if (!listingNo) return;
		setPropertyListingNoManualValue(listingNo);
	}

	function bindPropertyListingNoAutoFill()
	{
		const titleInput = document.getElementById("propertyLocationSummaryInput");
		document.querySelectorAll('input[name="propertyListingNoMode"]').forEach((radio) => {
			if (radio.dataset.listingNoModeBound === "1") return;
			radio.dataset.listingNoModeBound = "1";
			radio.addEventListener("change", syncPropertyListingNoModeUI);
		});
		if (titleInput && titleInput.dataset.listingNoAutoFillBound !== "1") {
			titleInput.dataset.listingNoAutoFillBound = "1";
			titleInput.addEventListener("input", syncPropertyListingNoFromTitle);
			titleInput.addEventListener("change", syncPropertyListingNoFromTitle);
		}
		syncPropertyListingNoModeUI();
		syncPropertyListingNoFromTitle();
	}

	function bindPropertyRegisterPageEvents()
	{
		bindPropertyAreaAutoCalc();
		bindPropertyMoneyCommaInputs(document);
		bindPropertyPlainNumberCommaInputs(document);
		bindPropertyRoomBathNotApplicable();
		bindPropertyPhotoPreviewUpload();
		bindPropertyListingNoAutoFill();
		const propertyTypeSelect = document.getElementById("propertyTypeSelect");
		if (propertyTypeSelect && propertyTypeSelect.dataset.areaBound !== "1") {
			propertyTypeSelect.dataset.areaBound = "1";
			propertyTypeSelect.addEventListener("change", updatePropertyRegisterAreaFields);
			propertyTypeSelect.addEventListener("change", updatePropertyInfoFieldsByType);
		}
		const buildingUseSelect = document.getElementById("buildingUseSelect");
		if (buildingUseSelect && buildingUseSelect.dataset.livingAccommodationBound !== "1") {
			buildingUseSelect.dataset.livingAccommodationBound = "1";
			buildingUseSelect.addEventListener("change", updateBuildingUseLivingAccommodationBadge);
		}
		updatePropertyRegisterAreaFields();
		updatePropertyInfoFieldsByType();
		bindPropertyFloorExclusiveOptions();
		updatePropertyFloorLevelRadioState();
		document.querySelectorAll('input[name="propertyFloorLevel"], #propertyFloorLevelUseCheck, #propertyBasementCheck, #propertySemiBasementCheck, #propertyWholeBuildingCheck').forEach((input) => {
			if (input.dataset.floorStateBound === "1") return;
			input.dataset.floorStateBound = "1";
			input.addEventListener("change", updatePropertyFloorLevelRadioState);
		});
		document.querySelectorAll('input[name="propertyParking"]').forEach((input) => {
			if (input.dataset.parkingBound === "1") return;
			input.dataset.parkingBound = "1";
			input.addEventListener("change", updatePropertyParkingDetail);
		});
		updatePropertyParkingDetail();
		document.querySelectorAll(".property-deal-check").forEach((input) => {
			if (input.dataset.priceBound !== "1") {
				input.dataset.priceBound = "1";
				input.addEventListener("change", renderPropertyPriceFields);
			}
			if (input.dataset.petVisibilityBound !== "1") {
				input.dataset.petVisibilityBound = "1";
				input.addEventListener("change", () => {
					updatePropertyPetVisibilityByDeal();
					ensureDefaultCheckRadios();
				});
			}
		});
		updatePropertyPetVisibilityByDeal();
		ensureDefaultCheckRadios();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bindPropertyRegisterPageEvents);
	} else {
		bindPropertyRegisterPageEvents();
	}

	async function openAdminPage(tabKey = null)
	{
		const adminContext = await resolveCurrentAdminContext();
		const user = adminContext.user;
		if (adminContext.allowed) {
			const hasBrokerRole = isBrokerRoleValue(adminContext.profile && adminContext.profile.role_request);
			const hasApprovedBrokerOffice = isApprovedBrokerOffice(window.realjejuCurrentBrokerOffice);
			renderAdminTopbarMenu(hasBrokerRole || hasApprovedBrokerOffice);
			updateApprovedBrokerTopbarMenu(user, adminContext.profile || null);
		}
		if (!adminContext.allowed) {
			openAuthErrorModal("관리자 계정에서만 이용 가능합니다.", "관리자 페이지", null);
			return;
		}

		closeGlobalAccountDropdown();
		closeBrokerHomePage();
		if (authModal) {
			authModal.classList.remove("open");
			authModal.classList.remove("profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}
		const activeAdminTabKey = tabKey || lastAdminTabKey || "notices";
		switchAdminTab(activeAdminTabKey);
		if (activeAdminTabKey === "listings") {
			await loadAdminListings({ silent: true });
		}
		document.body.classList.remove("auth-page-open", "notice-page-open");
		document.body.classList.add("admin-page-open");
		setTopbarMenuActive("관리자 페이지");
		const noticePagePanel = document.getElementById("noticePagePanel");
		if (noticePagePanel) noticePagePanel.setAttribute("aria-hidden", "true");
		const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "false");
		if (activeAdminTabKey !== "listings") await loadAdminTabData(activeAdminTabKey);
	}

	function getAgencyStatusLabel(status)
	{
		if (status === "active") return "승인 완료";
		if (status === "pending") return "승인 대기";
		if (status === "rejected") return "승인 거부";
		if (status === "deleted") return "삭제";
		return "가입 신청";
	}

	function switchAdminTab(tabKey)
	{
		const key = String(tabKey || "notices").trim() || "notices";
		lastAdminTabKey = key;
		document.querySelectorAll(".admin-page-tab[data-admin-tab]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.adminTab === key);
		});
		document.querySelectorAll(".admin-page-tab-panel[data-admin-tab-panel]").forEach((panel) => {
			panel.classList.toggle("active", panel.dataset.adminTabPanel === key);
		});
	}

	function loadAdminTabData(tabKey)
	{
		const key = String(tabKey || "notices").trim() || "notices";
		if (key === "notices") return loadAdminNotices();
		if (key === "broker-applications") return loadAdminApplications();
		if (key === "listings") return loadAdminListings();
		if (key === "users") return loadAdminUsers();
		if (key === "inquiries") return loadAdminInquiries();
		return Promise.resolve();
	}

	function escapeAdminHtml(value)
	{
		return String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	let lastAdminTabKey = "notices";
	let adminListingView = "all";
	let adminListingRowsCache = null;
	let adminListingLoadPromise = null;
	let adminApplicationView = "new";
	let adminApplicationRowsCache = null;
let adminInquiryView = "pending";
let adminInquiryRowsCache = null;
let adminUserView = "all";
let adminUserRowsCache = null;
let adminUserLoadPromise = null;
let adminUserAgencyStatusByUserId = new Map();
let adminUserAgencyStatusByEmail = new Map();
const BROKER_LISTINGS_PER_PAGE = 30;
let brokerListingPage = 1;
const ADMIN_LISTINGS_PER_PAGE = 30;
let adminListingPage = 1;

	function getNoticeSchemaHelp()
	{
		return "notices_schema_2.986.sql을 Supabase SQL Editor에서 실행한 뒤 다시 시도하세요.";
	}

	function getAdminRpcSchemaHelp()
	{
		return "sql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행한 뒤 다시 시도하세요.";
	}

	let adminExpiredTrashPurgePromise = null;
	let adminExpiredTrashPurgedAt = 0;
	let adminExpiredTrashPurgeRpcDisabled = false;

	async function purgeAdminExpiredTrashIfNeeded(client, options = {})
	{
		if (!client || adminExpiredTrashPurgeRpcDisabled || !isAdminUser(currentRealjejuAuthUser)) return false;
		const force = options && options.force === true;
		if (!force && adminExpiredTrashPurgedAt && Date.now() - adminExpiredTrashPurgedAt < REALJEJU_TRASH_PURGE_CACHE_MS) return true;
		if (adminExpiredTrashPurgePromise) return adminExpiredTrashPurgePromise;

		adminExpiredTrashPurgePromise = (async () => {
			try {
				const { error } = await client.rpc("admin_purge_expired_trash", {
					p_retention_days: REALJEJU_TRASH_RETENTION_DAYS
				});
				if (error) throw error;
				adminExpiredTrashPurgedAt = Date.now();
				return true;
			} catch (err) {
				const message = String(err && (err.message || err.details || err.hint) || "");
				if (/admin_purge_expired_trash|PGRST202|schema cache|function/i.test(message)) {
					adminExpiredTrashPurgeRpcDisabled = true;
				}
				console.warn(`${REALJEJU_TRASH_RETENTION_DAYS}일 지난 관리자 휴지통 정리 RPC 실패:`, err);
				return false;
			}
		})().finally(() => {
			adminExpiredTrashPurgePromise = null;
		});

		return adminExpiredTrashPurgePromise;
	}

	function formatAdminInquiryDate(value)
	{
		return formatAdminNoticeDate(value);
	}

	function formatAdminInquiryListDate(value)
	{
		if (!value) return "-";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		const year = String(date.getFullYear()).slice(-2);
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}.${month}.${day}`;
	}

	function formatAdminRpcError(error)
	{
		const code = String(error && error.code || "").trim();
		const message = String(error && error.message || error || "").trim();
		if (!code && !message) return "";
		return ` (${[code, message].filter(Boolean).join(" · ")})`;
	}

	function formatAdminNoticeDate(value)
	{
		if (!value) return "-";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		return date.toLocaleString("ko-KR");
	}

	function getAdminNoticeFormValues()
	{
		const title = String(document.getElementById("adminNoticeTitleInput")?.value || "").trim();
		const content = String(document.getElementById("adminNoticeContentInput")?.value || "").trim();
		const category = String(document.getElementById("adminNoticeCategoryInput")?.value || "공지").trim();
		const id = String(document.getElementById("adminNoticeIdInput")?.value || "").trim();
		const isPinned = !!document.getElementById("adminNoticePinnedInput")?.checked;
		const isVisible = !!document.getElementById("adminNoticeVisibleInput")?.checked;
		return { id, title, content, category, isPinned, isVisible };
	}

	function resetAdminNoticeForm()
	{
		const idInput = document.getElementById("adminNoticeIdInput");
		const titleInput = document.getElementById("adminNoticeTitleInput");
		const contentInput = document.getElementById("adminNoticeContentInput");
		const categoryInput = document.getElementById("adminNoticeCategoryInput");
		const pinnedInput = document.getElementById("adminNoticePinnedInput");
		const visibleInput = document.getElementById("adminNoticeVisibleInput");
		const statusEl = document.getElementById("adminNoticeStatus");
		if (idInput) idInput.value = "";
		if (titleInput) titleInput.value = "";
		if (contentInput) contentInput.value = "";
		if (categoryInput) {
			categoryInput.value = "공지";
			categoryInput.dispatchEvent(new Event("change", { bubbles: true }));
		}
		if (pinnedInput) pinnedInput.checked = false;
		if (visibleInput) visibleInput.checked = true;
		if (statusEl) statusEl.textContent = "";
	}

	function fillAdminNoticeForm(row)
	{
		const idInput = document.getElementById("adminNoticeIdInput");
		const titleInput = document.getElementById("adminNoticeTitleInput");
		const contentInput = document.getElementById("adminNoticeContentInput");
		const categoryInput = document.getElementById("adminNoticeCategoryInput");
		const pinnedInput = document.getElementById("adminNoticePinnedInput");
		const visibleInput = document.getElementById("adminNoticeVisibleInput");
		if (idInput) idInput.value = row.id || "";
		if (titleInput) titleInput.value = row.title || "";
		if (contentInput) contentInput.value = row.content || "";
		if (categoryInput) {
			categoryInput.value = row.category || "공지";
			categoryInput.dispatchEvent(new Event("change", { bubbles: true }));
		}
		if (pinnedInput) pinnedInput.checked = !!row.is_pinned;
		if (visibleInput) visibleInput.checked = row.is_visible !== false;
		document.getElementById("adminNoticeForm")?.scrollIntoView({ block: "center", behavior: "smooth" });
	}

	function renderAdminNoticeRows(rows)
	{
		const listEl = document.getElementById("adminNoticeList");
		const countEl = document.getElementById("adminNoticeListCount");
		if (!listEl) return;
		if (countEl) countEl.textContent = `${Array.isArray(rows) ? rows.length : 0}건`;
		if (!rows.length) {
			listEl.innerHTML = '<div class="admin-empty">등록된 공지사항이 없습니다.</div>';
			return;
		}
		window.realjejuAdminNoticeRowsById = new Map(rows.map((row) => [String(row.id || ""), row]));
		listEl.innerHTML = rows.map((row) => {
			const id = escapeAdminHtml(row.id || "");
			const visible = row.is_visible !== false;
			return `
				<div class="admin-notice-row" data-notice-id="${id}">
					<div>
						<div class="admin-notice-row-title">
							${row.is_pinned ? '<span class="admin-notice-chip pinned">고정</span>' : ""}
							<span>${escapeAdminHtml(row.title || "제목 없음")}</span>
						</div>
						<div class="admin-notice-row-meta">
							<span>${escapeAdminHtml(row.category || "공지")}</span>
							<span>${escapeAdminHtml(formatAdminNoticeDate(row.created_at))}</span>
							<span class="admin-notice-chip ${visible ? "visible" : "hidden"}">${visible ? "공개" : "비공개"}</span>
						</div>
					</div>
					<div class="admin-notice-row-actions">
						<button type="button" class="admin-status-btn" data-admin-notice-edit="${id}">수정</button>
						<button type="button" class="admin-status-btn pending" data-admin-notice-toggle="${id}">${visible ? "비공개" : "공개"}</button>
						<button type="button" class="admin-status-btn reject" data-admin-notice-delete="${id}">삭제</button>
					</div>
				</div>
			`;
		}).join("");
	}

	async function loadAdminNotices()
	{
		const listEl = document.getElementById("adminNoticeList");
		const countEl = document.getElementById("adminNoticeListCount");
		if (!listEl) return;
		if (countEl) countEl.textContent = "0건";
		if (!isAdminUser(currentRealjejuAuthUser)) {
			listEl.innerHTML = '<div class="admin-empty">관리자 계정으로 로그인하세요.</div>';
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}
		listEl.innerHTML = '<div class="admin-empty">공지사항을 불러오는 중입니다.</div>';
		try {
			await purgeAdminExpiredTrashIfNeeded(client);
			const { data, error } = await client
				.from("notices")
				.select("id, title, content, category, is_pinned, is_visible, created_by, created_at, updated_at, deleted_at")
				.is("deleted_at", null)
				.order("is_pinned", { ascending: false })
				.order("created_at", { ascending: false });
			if (error) throw error;
			renderAdminNoticeRows(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("관리자 공지사항 조회 실패:", err);
			listEl.innerHTML = `<div class="admin-empty">공지사항을 불러오지 못했습니다. ${escapeAdminHtml(getNoticeSchemaHelp())}</div>`;
		}
	}

	async function saveAdminNotice()
	{
		const statusEl = document.getElementById("adminNoticeStatus");
		const values = getAdminNoticeFormValues();
		if (!values.title || !values.content) {
			if (statusEl) statusEl.textContent = "제목과 내용을 입력하세요.";
			return;
		}
		const user = currentRealjejuAuthUser;
		const client = getRealjejuSupabaseClient();
		if (!isAdminUser(user) || !client) {
			if (statusEl) statusEl.textContent = "관리자 로그인과 Supabase 연결을 확인하세요.";
			return;
		}
		if (statusEl) statusEl.textContent = "저장 중입니다.";
		try {
			const now = new Date().toISOString();
			const payload = {
				title: values.title,
				content: values.content,
				category: values.category || "공지",
				is_pinned: values.isPinned,
				is_visible: values.isVisible,
				updated_at: now
			};
			const result = values.id
				? await client.from("notices").update(payload).eq("id", values.id)
				: await client.from("notices").insert({ ...payload, created_by: user.id, created_at: now });
			if (result.error) throw result.error;
			if (statusEl) statusEl.textContent = "저장했습니다.";
			resetAdminNoticeForm();
			await loadAdminNotices();
			if (typeof window.loadPublicNotices === "function") window.loadPublicNotices();
		} catch (err) {
			console.error("공지사항 저장 실패:", err);
			if (statusEl) statusEl.textContent = `저장 실패: ${getNoticeSchemaHelp()}`;
		}
	}

	async function toggleAdminNoticeVisibility(id)
	{
		const row = window.realjejuAdminNoticeRowsById?.get(String(id || ""));
		if (!row) return;
		const client = getRealjejuSupabaseClient();
		if (!client || !isAdminUser(currentRealjejuAuthUser)) return;
		const { error } = await client
			.from("notices")
			.update({ is_visible: row.is_visible === false, updated_at: new Date().toISOString() })
			.eq("id", row.id);
		if (error) {
			openAuthErrorModal("공지 공개 상태 변경에 실패했습니다.", "공지사항 관리", null);
			return;
		}
		await loadAdminNotices();
		if (typeof window.loadPublicNotices === "function") window.loadPublicNotices();
	}

	async function deleteAdminNotice(id)
	{
		const client = getRealjejuSupabaseClient();
		if (!client || !isAdminUser(currentRealjejuAuthUser)) return;
		const { error } = await client
			.from("notices")
			.update({ deleted_at: new Date().toISOString(), is_visible: false, updated_at: new Date().toISOString() })
			.eq("id", id);
		if (error) {
			openAuthErrorModal("공지 삭제에 실패했습니다.", "공지사항 관리", null);
			return;
		}
		resetAdminNoticeForm();
		await loadAdminNotices();
		if (typeof window.loadPublicNotices === "function") window.loadPublicNotices();
	}

	async function fetchAdminInquiryRows(client)
	{
		const { data, error } = await client.rpc("get_admin_support_inquiries");
		if (error) throw error;
		return Array.isArray(data) ? data : [];
	}

	function isAdminInquiryDeleted(row)
	{
		const status = String(row && row.status || "").trim().toLowerCase();
		return ["deleted", "trash", "withdrawn", "삭제", "휴지통"].includes(status) || !!(row && row.deleted_at);
	}

	function isAdminInquiryAnswered(row)
	{
		if (isAdminInquiryDeleted(row)) return false;
		const status = String(row && row.status || "").trim().toLowerCase();
		return ["answered", "replied", "completed", "done", "답변완료", "완료"].includes(status) || !!String(row && row.admin_reply || "").trim();
	}

	function getAdminInquiryFilteredRows(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		if (adminInquiryView === "pending") return list.filter((row) => !isAdminInquiryAnswered(row) && !isAdminInquiryDeleted(row));
		if (adminInquiryView === "answered") return list.filter(isAdminInquiryAnswered);
		if (adminInquiryView === "deleted") return list.filter(isAdminInquiryDeleted);
		return list.filter((row) => !isAdminInquiryAnswered(row) && !isAdminInquiryDeleted(row));
	}

	function updateAdminInquiryFilterCounts(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = String(value);
		};
		setText("adminInquiriesPendingCount", list.filter((row) => !isAdminInquiryAnswered(row) && !isAdminInquiryDeleted(row)).length);
		setText("adminInquiriesAnsweredCount", list.filter(isAdminInquiryAnswered).length);
		setText("adminInquiriesDeletedCount", list.filter(isAdminInquiryDeleted).length);
		document.querySelectorAll("[data-admin-inquiry-view]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.adminInquiryView === adminInquiryView);
		});
	}

	function renderAdminInquiryList(inquiries)
	{
		const listEl = document.getElementById("adminInquiryList");
		if (!listEl) return;
		const rows = Array.isArray(inquiries) ? inquiries : [];
		updateAdminInquiryFilterCounts(rows);
		const filteredRows = getAdminInquiryFilteredRows(rows);
		if (!rows.length) {
			listEl.innerHTML = '<div class="admin-empty">등록된 1:1 문의가 없습니다.</div>';
			return;
		}
		if (!filteredRows.length) {
			listEl.innerHTML = '<div class="admin-empty">해당 상태의 1:1 문의가 없습니다.</div>';
			return;
		}
		listEl.innerHTML = `
			<div class="my-suite-inquiry-list admin-inquiry-table">
				${filteredRows.map((row) => {
					const id = escapeAdminHtml(row.id || "");
					const deleted = isAdminInquiryDeleted(row);
					const answered = isAdminInquiryAnswered(row);
					const status = deleted ? "휴지통" : (answered ? "답변완료" : "답변대기");
					const rawAuthorName = String(row.author_name || "").trim();
					const rawAuthorEmail = String(row.author_email || "").trim();
					const rawAuthorFallback = String(row.author_label || "").trim();
					const authorBase = rawAuthorName || rawAuthorFallback || rawAuthorEmail || "작성자 미확인";
					const authorLabel = rawAuthorEmail && authorBase !== rawAuthorEmail ? `${authorBase}(${rawAuthorEmail})` : authorBase;
					return `
						<article class="my-suite-inquiry-item admin-inquiry-item ${deleted ? "deleted" : (answered ? "answered" : "pending")}" data-admin-inquiry-id="${id}">
							<div class="my-suite-inquiry-row admin-inquiry-row">
								<button type="button" class="my-suite-inquiry-main admin-inquiry-main-button" data-admin-inquiry-toggle="${id}">
									<span class="my-suite-inquiry-date admin-inquiry-date admin-inquiry-author-cell">${escapeAdminHtml(authorLabel)}</span>
									<span class="my-suite-inquiry-title admin-inquiry-title">${escapeAdminHtml(row.title || "제목 없음")}</span>
									<span class="my-suite-inquiry-state ${deleted ? "deleted" : (answered ? "answered" : "pending")}">${status}</span>
								</button>
								${deleted ? "" : `<button type="button" class="my-suite-inquiry-delete admin-inquiry-delete" data-admin-inquiry-delete="${id}">삭제</button>`}
							</div>
							<div class="my-suite-inquiry-detail admin-inquiry-detail">
								<div class="my-suite-inquiry-detail-block">
									<strong>작성자</strong>
									<p>${escapeAdminHtml(authorLabel)}</p>
								</div>
								<div class="my-suite-inquiry-detail-block">
									<strong>문의 내용</strong>
									<p>${escapeAdminHtml(row.message || "-")}</p>
								</div>
								${answered || deleted ? `
									<div class="my-suite-inquiry-detail-block answer">
										<strong>관리자 답변</strong>
										<p>${answered ? escapeAdminHtml(row.admin_reply || "") : "등록된 답변이 없습니다."}</p>
										${row.replied_at ? `<span>답변일 ${escapeAdminHtml(formatAdminInquiryDate(row.replied_at))}</span>` : ""}
									</div>
								` : ""}
								${deleted ? "" : `
									<form class="my-suite-inquiry-reply-form" data-my-suite-inquiry-reply-form="${id}">
										<label class="my-suite-inquiry-label" for="adminInquiryReplyInput-${id}">관리자 답변</label>
										<textarea class="profile-suite-input my-suite-inquiry-reply-textarea" id="adminInquiryReplyInput-${id}" maxlength="1000" required>${escapeAdminHtml(row.admin_reply || "")}</textarea>
										<p class="my-suite-inquiry-reply-status" aria-live="polite"></p>
										<div class="my-suite-inquiry-reply-actions">
											<button type="submit" class="my-suite-inquiry-primary">${answered ? "답변 수정" : "답변 등록"}</button>
										</div>
									</form>
								`}
							</div>
						</article>
					`;
				}).join("")}
			</div>
		`;
	}

	async function deleteAdminInquiry(inquiryId)
	{
		const id = String(inquiryId || "").trim();
		if (!id) return;
		const client = getRealjejuSupabaseClient();
		if (!client || !isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 로그인과 Supabase 연결을 확인하세요.", "1:1 문의내역", null);
			return;
		}
		try {
			const { error } = await client.rpc("admin_delete_support_inquiry", { p_inquiry_id: id });
			if (error) throw error;
			await loadAdminInquiries();
		}
		catch (err) {
			console.warn("관리자 1:1 문의 삭제 실패:", err);
			openAuthErrorModal(`문의 삭제에 실패했습니다${formatAdminRpcError(err)}. ${getAdminListingToolsSchemaHelp()}`, "1:1 문의내역", null);
		}
	}

	function confirmAdminInquiryDelete(inquiryId, returnFocusTarget)
	{
		openAuthConfirmModal(
			"선택한 1:1 문의를 삭제하시겠습니까?\n삭제된 문의는 휴지통으로 이동합니다.",
			"1:1 문의 삭제",
			() => deleteAdminInquiry(inquiryId),
			returnFocusTarget || null
		);
	}

	async function loadAdminInquiries()
	{
		const listEl = document.getElementById("adminInquiryList");
		if (!listEl) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			listEl.innerHTML = '<div class="admin-empty">관리자 계정으로 로그인하세요.</div>';
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}
		listEl.innerHTML = '<div class="admin-empty">1:1 문의내역을 불러오는 중입니다.</div>';
		try {
			await purgeAdminExpiredTrashIfNeeded(client);
			const inquiries = await fetchAdminInquiryRows(client);
			adminInquiryRowsCache = inquiries;
			renderAdminInquiryList(inquiries);
		} catch (err) {
			console.warn("관리자 1:1 문의내역 로드 실패:", err);
			listEl.innerHTML = `<div class="admin-empty">1:1 문의내역을 불러오지 못했습니다${escapeAdminHtml(formatAdminRpcError(err))}. ${escapeAdminHtml(getAdminRpcSchemaHelp())}</div>`;
		}
	}

	window.loadAdminInquiries = loadAdminInquiries;

	function isAdminProfileRow(row)
	{
		const role = String(row && (row.role || row.role_request) || "").trim().toLowerCase();
		return role === "admin";
	}

	function isAdminUserIncomplete(row)
	{
		if (!row) return true;
		if (row.profile_completed === false) return true;
		return !String(row.name || "").trim() || !String(row.phone || "").trim();
	}

		function getAdminUserFilteredRows(rows)
		{
			const list = Array.isArray(rows) ? rows : [];
			if (adminUserView === "deleted") return list.filter(isAdminUserWithdrawn);
			const visibleRows = list.filter((row) => !isAdminUserWithdrawn(row));
			if (adminUserView === "broker") return visibleRows.filter(isAdminUserApprovedBroker);
			if (adminUserView === "admin") return visibleRows.filter(isAdminProfileRow);
			if (adminUserView === "incomplete") return visibleRows.filter(isAdminUserIncomplete);
			return visibleRows;
		}

	function updateAdminUserFilterCounts(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		const visibleRows = list.filter((row) => !isAdminUserWithdrawn(row));
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = String(value);
			};
			setText("adminUsersAllCount", visibleRows.length);
			setText("adminUsersBrokerCount", visibleRows.filter(isAdminUserApprovedBroker).length);
			setText("adminUsersAdminCount", visibleRows.filter(isAdminProfileRow).length);
			setText("adminUsersIncompleteCount", visibleRows.filter(isAdminUserIncomplete).length);
			setText("adminUsersDeletedCount", list.filter(isAdminUserWithdrawn).length);
		document.querySelectorAll("[data-admin-user-view]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.adminUserView === adminUserView);
		});
	}

	function formatAdminUserDate(row)
	{
		return formatBrokerListingDate(row && (row.created_at || row.privacy_agreed_at || row.updated_at));
	}

		function formatAdminUserLastLoginDate(row)
		{
			return formatBrokerListingDate(row && (row.last_sign_in_at || row.last_login_at || row.last_seen_at));
		}

		function normalizeAdminAgencyStatus(raw)
		{
			const compact = String(raw || "").trim().replace(/\s+/g, "").toLowerCase();
			if (!compact) return "";
			if (["active", "approved", "approve", "accepted", "승인", "승인완료", "완료"].includes(compact)) return "active";
			if (["pending", "waiting", "wait", "대기", "승인대기", "대기중", "new", "신청", "가입신청", "신청중"].includes(compact)) return "pending";
			if (["rejected", "reject", "denied", "거부", "반려", "승인거부"].includes(compact)) return "rejected";
			if (["deleted", "delete", "trash", "withdrawn", "삭제", "휴지통"].includes(compact)) return "deleted";
			return compact;
		}

		function getAdminUserAgencyStatus(row)
		{
			const rowStatus = normalizeAdminAgencyStatus(row && (row.approved_agency_status || row.agency_status || row.broker_office_status));
			if (rowStatus) return rowStatus;
			const userIdKey = String(row && row.id || "").trim();
			if (userIdKey && adminUserAgencyStatusByUserId.has(userIdKey)) return adminUserAgencyStatusByUserId.get(userIdKey);
			const emailKey = String(row && row.email || "").trim().toLowerCase();
			if (emailKey && adminUserAgencyStatusByEmail.has(emailKey)) return adminUserAgencyStatusByEmail.get(emailKey);
			return "";
		}

		async function hydrateAdminUserAgencyStatusMaps(client)
		{
			adminUserAgencyStatusByUserId = new Map();
			adminUserAgencyStatusByEmail = new Map();
			if (!client) return;
			try {
				const { data, error } = await client
					.from("agencies")
					.select("user_id,email,status,deleted_at,updated_at,created_at")
					.order("updated_at", { ascending: false, nullsFirst: false })
					.order("created_at", { ascending: false, nullsFirst: false });
				if (error) throw error;
				(Array.isArray(data) ? data : []).forEach((agency) => {
					const normalized = agency && agency.deleted_at
						? "deleted"
						: normalizeAdminAgencyStatus(agency && agency.status);
					if (!normalized) return;
					const uid = String(agency && agency.user_id || "").trim();
					const mail = String(agency && agency.email || "").trim().toLowerCase();
					if (uid && !adminUserAgencyStatusByUserId.has(uid)) adminUserAgencyStatusByUserId.set(uid, normalized);
					if (mail && !adminUserAgencyStatusByEmail.has(mail)) adminUserAgencyStatusByEmail.set(mail, normalized);
				});
			} catch (err) {
				console.warn("관리자 회원용 중개사무소 상태 조회 실패:", err);
			}
		}

			function getAdminUserPassLabel(row)
			{
		const label = String(row && (row.pass_label || row.subscription_label || row.plan_label || row.membership_label || row.ticket_label) || "").trim();
		if (label) return label;
		const plan = String(row && (row.plan || row.subscription_plan || row.membership || row.ticket_type) || "").trim();
		if (!plan) return "-";
		if (plan === "starter") return "STARTER";
		if (plan === "premium") return "PREMIUM";
		if (plan === "pro") return "PRO";
			return plan;
		}

		function isAdminUserApprovedBroker(row)
		{
			if (!row || isAdminProfileRow(row) || isAdminUserWithdrawn(row)) return false;
			if (!isBrokerRoleValue(row.role_request || row.role)) return false;
			return normalizeAdminAgencyStatus(getAdminUserAgencyStatus(row)) === "active";
		}

		function getAdminUserRoleLabel(row)
		{
			if (isAdminProfileRow(row)) return "관리자";
			return isAdminUserApprovedBroker(row) ? getRoleLabel(row.role_request || row.role || "user") : "일반회원";
		}

	function isAdminUserWithdrawn(row)
	{
		const status = String(row && row.status || "").trim().toLowerCase();
		return status === "deleted" || status === "withdrawn" || status === "blocked";
	}

	function getAdminUserProfileThumbHtml(row)
	{
		const url = String(row && (row.profile_image || row.profile_photo || row.avatar_url) || "").trim();
		if (url) return `<img src="${escapeAdminHtml(url)}" alt="회원 사진">`;
		const name = String(row && (row.name || row.email) || "").trim();
		const initial = name ? name.slice(0, 1).toUpperCase() : "회";
		return `<span>${escapeAdminHtml(initial)}</span>`;
	}

	function renderAdminUsers(rows)
	{
		const listEl = document.getElementById("adminUsersList");
		if (!listEl) return;
		const list = Array.isArray(rows) ? rows : [];
		updateAdminUserFilterCounts(list);
		const filteredRows = getAdminUserFilteredRows(list);

		if (!list.length) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">등록된 회원이 없습니다.</div>';
			return;
		}
		if (!filteredRows.length) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">조건에 맞는 회원이 없습니다.</div>';
			return;
		}

		listEl.classList.add("broker-listing-list");
		window.realjejuAdminUserRowsById = new Map(list.map((row) => [String(row.id || row.email || ""), row]));
		listEl.innerHTML = `
			<div class="broker-listing-head admin-user-head" aria-hidden="true">
				<div>사진</div>
				<div>가입일</div>
				<div>최근 로그인</div>
				<div>이름</div>
				<div>이메일</div>
				<div>연락처</div>
				<div>회원유형</div>
				<div>이용권</div>
				<div>상태</div>
				<div>관리</div>
			</div>
		` + filteredRows.map((row) => {
			const rowId = escapeAdminHtml(row.id || row.email || "");
				const name = String(row.name || "").trim();
				const email = String(row.email || "").trim() || "-";
				const phone = formatDisplayPhone(row.phone) || "";
				const roleLabel = getAdminUserRoleLabel(row);
			const passLabel = getAdminUserPassLabel(row);
			const withdrawn = isAdminUserWithdrawn(row);
			const profileState = isAdminProfileRow(row) ? "관리자" : (withdrawn ? "탈퇴" : (isAdminUserIncomplete(row) ? "미완료" : "완료"));
			const stateClass = isAdminProfileRow(row) ? "admin" : (withdrawn ? "deleted" : (isAdminUserIncomplete(row) ? "incomplete" : "published"));
				const canForceWithdraw = rowId && withdrawn === false;
				const canRestore = rowId && withdrawn === true && !isAdminProfileRow(row);
				const canPermanentDelete = rowId && withdrawn === true && !isAdminProfileRow(row);
			return `
				<div class="broker-listing-row admin-user-row" data-admin-user-id="${rowId}">
					<div class="broker-listing-cell broker-listing-photo-cell admin-user-thumb"><div class="broker-listing-thumb">${getAdminUserProfileThumbHtml(row)}</div></div>
					<div class="admin-user-cell broker-listing-meta">${escapeAdminHtml(formatAdminUserDate(row))}</div>
					<div class="admin-user-cell broker-listing-meta">${escapeAdminHtml(formatAdminUserLastLoginDate(row))}</div>
					<div class="admin-user-cell admin-user-name">${escapeAdminHtml(name)}</div>
					<div class="admin-user-cell admin-user-email">${escapeAdminHtml(email)}</div>
					<div class="admin-user-cell admin-user-phone">${escapeAdminHtml(phone)}</div>
					<div class="admin-user-cell">${escapeAdminHtml(roleLabel)}</div>
					<div class="admin-user-cell admin-user-pass">${escapeAdminHtml(passLabel)}</div>
					<div class="admin-user-cell"><span class="broker-listing-status admin-user-profile-state ${escapeAdminHtml(stateClass)}">${escapeAdminHtml(profileState)}</span></div>
					<div class="broker-listing-menu-cell">
						<button type="button" class="broker-listing-menu-btn" data-admin-user-menu="${rowId}" aria-label="회원 관리 메뉴">⋮</button>
						<div class="broker-listing-more-menu" data-admin-user-menu-panel="${rowId}">
							<button type="button" class="broker-listing-menu-item" data-admin-user-action="view" data-user-id="${rowId}">상세 보기</button>
							${canForceWithdraw ? `<button type="button" class="broker-listing-menu-item danger" data-admin-user-action="force_withdraw" data-user-id="${rowId}">강제탈퇴</button>` : ""}
							${canRestore ? `<button type="button" class="broker-listing-menu-item" data-admin-user-action="restore" data-user-id="${rowId}">복원</button>` : ""}
							${canPermanentDelete ? `<button type="button" class="broker-listing-menu-item danger" data-admin-user-action="permanent_delete" data-user-id="${rowId}">영구삭제</button>` : ""}
						</div>
					</div>
				</div>
			`;
		}).join("");
	}

	function openAdminUserDetail(userId, returnFocusTarget)
	{
		const row = window.realjejuAdminUserRowsById?.get(String(userId || ""));
		if (!row) return;
		const lines = [
				`이름 : ${String(row.name || "").trim()}`,
			`이메일 : ${String(row.email || "-").trim()}`,
				`연락처 : ${formatDisplayPhone(row.phone) || ""}`,
				`회원유형 : ${getAdminUserRoleLabel(row)}`,
			`이용권 : ${getAdminUserPassLabel(row)}`,
			`상태 : ${isAdminProfileRow(row) ? "관리자" : (isAdminUserWithdrawn(row) ? "탈퇴" : (isAdminUserIncomplete(row) ? "미완료" : "완료"))}`,
			`가입일 : ${formatAdminUserDate(row)}`,
			`최근 로그인 : ${formatAdminUserLastLoginDate(row)}`
		];
		openAuthErrorModal(lines.join("\n"), "회원 상세", returnFocusTarget || null);
	}

	function getAdminForceWithdrawSchemaHelp()
	{
		return "sql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행한 뒤 다시 시도하세요.";
	}

	function getAdminUserTrashSchemaHelp()
	{
		return "sql/admin_tools_3.243.sql을 Supabase SQL Editor에서 실행한 뒤 다시 시도하세요.";
	}

	function getAdminListingToolsSchemaHelp()
	{
		return "sql/admin_tools_3.188.sql을 Supabase SQL Editor에서 실행한 뒤 다시 시도하세요.";
	}

	async function forceWithdrawAdminUser(userId)
	{
		const id = String(userId || "").trim();
		if (!id) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 계정에서만 처리할 수 있습니다.", "회원 강제탈퇴", null);
			return;
		}
		if (currentRealjejuAuthUser && String(currentRealjejuAuthUser.id || "") === id) {
			openAuthErrorModal("본인 관리자 계정은 여기서 강제탈퇴할 수 없습니다.", "회원 강제탈퇴", null);
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "회원 강제탈퇴", null);
			return;
		}

		try {
			const { error } = await client.rpc("admin_force_withdraw_user", { p_user_id: id });
			if (error) throw error;
			adminUserRowsCache = null;
			await loadAdminUsers({ force: true, silent: true });
			openAuthErrorModal("강제탈퇴 처리했습니다.", "회원 강제탈퇴", null);
		}
		catch (err) {
			console.error("관리자 회원 강제탈퇴 실패:", err);
			openAuthErrorModal(`강제탈퇴 처리에 실패했습니다${formatAdminRpcError(err)}. ${getAdminForceWithdrawSchemaHelp()}`, "회원 강제탈퇴", null);
		}
	}

	async function restoreAdminUser(userId)
	{
		const id = String(userId || "").trim();
		if (!id) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 계정에서만 처리할 수 있습니다.", "회원 복원", null);
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "회원 복원", null);
			return;
		}

		try {
			const { error } = await client.rpc("admin_restore_user", { p_user_id: id });
			if (error) throw error;
			adminUserRowsCache = null;
			await loadAdminUsers({ force: true, silent: true });
			openAuthErrorModal("복원 처리했습니다.", "회원 복원", null);
		}
		catch (err) {
			console.error("관리자 회원 복원 실패:", err);
			openAuthErrorModal(`복원 처리에 실패했습니다${formatAdminRpcError(err)}. ${getAdminUserTrashSchemaHelp()}`, "회원 복원", null);
		}
	}

	async function permanentlyDeleteAdminUser(userId)
	{
		const id = String(userId || "").trim();
		if (!id) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 계정에서만 처리할 수 있습니다.", "회원 영구삭제", null);
			return;
		}
		if (currentRealjejuAuthUser && String(currentRealjejuAuthUser.id || "") === id) {
			openAuthErrorModal("본인 관리자 계정은 여기서 영구삭제할 수 없습니다.", "회원 영구삭제", null);
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "회원 영구삭제", null);
			return;
		}

		try {
			const { error } = await client.rpc("admin_permanent_delete_user", { p_user_id: id });
			if (error) throw error;
			adminUserRowsCache = null;
			await loadAdminUsers({ force: true, silent: true });
			openAuthErrorModal("영구삭제 처리했습니다.", "회원 영구삭제", null);
		}
		catch (err) {
			console.error("관리자 회원 영구삭제 실패:", err);
			openAuthErrorModal(`영구삭제 처리에 실패했습니다${formatAdminRpcError(err)}. ${getAdminUserTrashSchemaHelp()}`, "회원 영구삭제", null);
		}
	}

	function confirmAdminUserForceWithdraw(userId, returnFocusTarget)
	{
		const row = window.realjejuAdminUserRowsById?.get(String(userId || ""));
		if (row && isAdminProfileRow(row)) {
			openAuthErrorModal("관리자 계정은 강제탈퇴 처리할 수 없습니다.", "회원 강제탈퇴", returnFocusTarget || null);
			return;
		}
		const label = row ? `${String(row.name || "이름 없음").trim()} / ${String(row.email || "-").trim()}` : "선택한 회원";
		openAuthConfirmModal(
			`${label}\n이 회원을 강제탈퇴 처리하시겠습니까?\n로그인과 서비스 이용이 차단되고 등록 매물과 중개사무소도 비활성 처리됩니다.`,
			"회원 강제탈퇴",
			() => forceWithdrawAdminUser(userId),
			returnFocusTarget || null
		);
	}

	function confirmAdminUserRestore(userId, returnFocusTarget)
	{
		const row = window.realjejuAdminUserRowsById?.get(String(userId || ""));
		const label = row ? `${String(row.name || "").trim() || "이름 없음"} / ${String(row.email || "-").trim()}` : "선택한 회원";
		openAuthConfirmModal(
			`${label}\n휴지통 회원을 복원하시겠습니까?`,
			"회원 복원",
			() => restoreAdminUser(userId),
			returnFocusTarget || null
		);
	}

	function confirmAdminUserPermanentDelete(userId, returnFocusTarget)
	{
		const row = window.realjejuAdminUserRowsById?.get(String(userId || ""));
		if (row && isAdminProfileRow(row)) {
			openAuthErrorModal("관리자 계정은 영구삭제 처리할 수 없습니다.", "회원 영구삭제", returnFocusTarget || null);
			return;
		}
		const label = row ? `${String(row.name || "").trim() || "이름 없음"} / ${String(row.email || "-").trim()}` : "선택한 회원";
		openAuthConfirmModal(
			`${label}\n이 회원을 영구삭제하시겠습니까?\n영구삭제 후에는 복원할 수 없습니다.`,
			"회원 영구삭제",
			() => permanentlyDeleteAdminUser(userId),
			returnFocusTarget || null
		);
	}

	async function loadAdminUsers(options = {})
	{
		const listEl = document.getElementById("adminUsersList");
		if (!listEl) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">관리자 계정에서만 이용 가능합니다.</div>';
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}

		if (Array.isArray(adminUserRowsCache) && options.force !== true) {
			if (!adminUserAgencyStatusByUserId.size && !adminUserAgencyStatusByEmail.size) {
				await hydrateAdminUserAgencyStatusMaps(client);
			}
			renderAdminUsers(adminUserRowsCache);
			return;
		}

		if (adminUserLoadPromise) return adminUserLoadPromise;

		if (!options.silent && !listEl.querySelector(".admin-user-row")) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">회원 목록을 불러오는 중입니다.</div>';
		}

		adminUserLoadPromise = (async () => {
			await purgeAdminExpiredTrashIfNeeded(client);
			const { data, error } = await client.rpc("get_admin_users");

			if (error) {
				console.error("관리자 회원 목록 조회 실패:", error);
				adminUserAgencyStatusByUserId = new Map();
				adminUserAgencyStatusByEmail = new Map();
				listEl.innerHTML = `<div class="admin-empty">회원 목록을 불러오지 못했습니다${escapeAdminHtml(formatAdminRpcError(error))}. ${escapeAdminHtml(getAdminRpcSchemaHelp())}</div>`;
				return;
			}

			adminUserRowsCache = Array.isArray(data) ? data : [];
			await hydrateAdminUserAgencyStatusMaps(client);
			renderAdminUsers(adminUserRowsCache);
		})().catch((err) => {
			console.error("관리자 회원 목록 오류:", err);
			adminUserAgencyStatusByUserId = new Map();
			adminUserAgencyStatusByEmail = new Map();
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">회원 처리 중 오류가 발생했습니다.</div>';
		}).finally(() => {
			adminUserLoadPromise = null;
		});
		return adminUserLoadPromise;
	}

	window.loadAdminUsers = loadAdminUsers;

	function isAdminListingReported(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const status = String(row?.status || "").toLowerCase();
		return status === "reported"
			|| payload.reported === true
			|| payload.is_reported === true
			|| Number(payload.report_count || payload.reports_count || 0) > 0
			|| !!(payload.reported_at || payload.last_reported_at);
	}

	function isAdminListingDeleted(row)
	{
		return getBrokerListingEffectiveStatus(row) === "deleted";
	}

	function getAdminListingActiveRows(rows)
	{
		return (Array.isArray(rows) ? rows : []).filter((row) => !isAdminListingDeleted(row));
	}

	function getAdminListingVisibleRows(rows)
	{
		return getAdminListingActiveRows(rows).filter((row) => {
			const status = getBrokerListingEffectiveStatus(row);
			return !["closed", "hidden", "archive"].includes(status);
		});
	}

	function getAdminListingFilteredRows(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		if (adminListingView === "deleted") return list.filter(isAdminListingDeleted);
		const activeRows = getAdminListingActiveRows(list);
		if (adminListingView === "reported") return activeRows.filter(isAdminListingReported);
		if (adminListingView === "closed") return activeRows.filter((row) => getBrokerListingEffectiveStatus(row) === "closed");
		if (adminListingView === "hidden") return activeRows.filter((row) => ["hidden", "archive"].includes(getBrokerListingEffectiveStatus(row)));
		return getAdminListingVisibleRows(list);
	}

	function setAdminListingPage(value)
	{
		const next = Math.floor(Number(value));
		if (!Number.isFinite(next) || next < 1) {
			adminListingPage = 1;
			return;
		}
		adminListingPage = next;
	}

	function getAdminListingPage(totalPages)
	{
		const maxPage = Math.max(1, Number(totalPages) || 1);
		if (!Number.isFinite(adminListingPage) || adminListingPage < 1) adminListingPage = 1;
		if (adminListingPage > maxPage) adminListingPage = maxPage;
		return adminListingPage;
	}

	function renderAdminListingPagination(totalCount, totalPages, currentPage)
	{
		if (totalCount <= ADMIN_LISTINGS_PER_PAGE || totalPages <= 1) return "";
		const items = getBrokerListingPaginationItems(totalPages, currentPage);
		return `
			<nav class="broker-listing-pagination" aria-label="관리자 매물 페이지">
				${items.map((item) => {
					if (item === "ellipsis") return '<span class="broker-listing-page-ellipsis">…</span>';
					const page = Number(item);
					return `<button type="button" class="broker-listing-page-btn ${page === currentPage ? "active" : ""}" data-admin-listing-page="${page}" aria-current="${page === currentPage ? "page" : "false"}">${page}</button>`;
				}).join("")}
			</nav>
		`;
	}

	function scrollAdminListingsToTop()
	{
		const listEl = document.getElementById("adminListingsList");
		if (!listEl) return;
		const panel = document.getElementById("adminPagePanel");
		if (panel) panel.scrollTop = 0;
		const shell = listEl.closest(".broker-listing-shell") || listEl;
		if (shell && typeof shell.scrollIntoView === "function") {
			shell.scrollIntoView({ block: "start", inline: "nearest" });
		}
	}

	function updateAdminListingFilterCounts(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		const activeRows = getAdminListingActiveRows(list);
		const visibleRows = getAdminListingVisibleRows(list);
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = String(value);
		};
		setText("adminListingsAllCount", visibleRows.length);
		setText("adminListingsReportedCount", activeRows.filter(isAdminListingReported).length);
		setText("adminListingsClosedCount", activeRows.filter((row) => getBrokerListingEffectiveStatus(row) === "closed").length);
		setText("adminListingsHiddenCount", activeRows.filter((row) => ["hidden", "archive"].includes(getBrokerListingEffectiveStatus(row))).length);
		setText("adminListingsDeletedCount", list.filter(isAdminListingDeleted).length);
		document.querySelectorAll("[data-admin-listing-view]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.adminListingView === adminListingView);
		});
	}

	function renderAdminListings(rows)
	{
		const listEl = document.getElementById("adminListingsList");
		if (!listEl) return;
		const list = Array.isArray(rows) ? rows : [];
		updateAdminListingFilterCounts(list);
		const filteredRows = getAdminListingFilteredRows(list);

		if (!list.length) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">등록된 매물이 없습니다.</div>';
			return;
		}
		if (!filteredRows.length) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">조건에 맞는 매물이 없습니다.</div>';
			return;
		}

		const totalPages = Math.max(1, Math.ceil(filteredRows.length / ADMIN_LISTINGS_PER_PAGE));
		const currentPage = getAdminListingPage(totalPages);
		const startIndex = (currentPage - 1) * ADMIN_LISTINGS_PER_PAGE;
		const pageRows = filteredRows.slice(startIndex, startIndex + ADMIN_LISTINGS_PER_PAGE);

		listEl.classList.add("broker-listing-list");
		listEl.innerHTML = `
			<div class="broker-listing-head admin-listing-head" aria-hidden="true">
				<div>사진</div>
				<div>매물유형</div>
				<div>상태</div>
				<div>등록날짜</div>
				<div>매물번호</div>
				<div>제목</div>
				<div><button type="button" class="broker-listing-area-toggle" data-broker-listing-area-toggle>면적 <i class="fa-solid fa-right-left broker-listing-area-toggle-icon" aria-hidden="true"></i></button></div>
				<div>가격</div>
				<div>관리</div>
			</div>
		` + pageRows.map((row) => {
			const created = getBrokerListingDisplayDate(row);
			const listingNo = getBrokerListingNo(row);
			const areaText = getBrokerListingAreaValue(row);
			const priceInfo = getBrokerListingDealPrice(row);
			const priceHtml = priceInfo.dealLabel || priceInfo.priceLabel
				? `${priceInfo.dealLabel ? `<span class="broker-listing-price-deal">${escapeAdminHtml(priceInfo.dealLabel)}</span>` : ""}${priceInfo.priceLabel ? `<span class="broker-listing-price-amount">${escapeAdminHtml(priceInfo.priceLabel)}</span>` : ""}`
				: "-";
			const rowId = escapeAdminHtml(row.id);
			const effectiveStatus = getBrokerListingEffectiveStatus(row);
			const closedAction = effectiveStatus === "closed" ? "published" : "closed";
			const closedLabel = effectiveStatus === "closed" ? "거래중으로 변경" : "거래완료";
			const hiddenAction = ["hidden", "archive"].includes(effectiveStatus) ? "published" : "hidden";
			const hiddenLabel = ["hidden", "archive"].includes(effectiveStatus) ? "숨김해제" : "숨김";
			return `
				<div class="broker-listing-row admin-listing-row" data-admin-listing-id="${rowId}">
					<div class="broker-listing-cell broker-listing-photo-cell"><div class="broker-listing-thumb">${getBrokerListingThumbHtml(row)}</div></div>
					<div class="broker-listing-cell broker-listing-type">${escapeAdminHtml(row.property_type_label || "-")}</div>
					<div class="broker-listing-cell"><span class="broker-listing-status ${escapeAdminHtml(effectiveStatus || "draft")}">${escapeAdminHtml(getBrokerListingStatusLabel(effectiveStatus))}</span></div>
					<div class="broker-listing-cell broker-listing-meta">${escapeAdminHtml(created)}</div>
					<div class="broker-listing-cell broker-listing-no">${escapeAdminHtml(listingNo)}</div>
					<div class="broker-listing-title-cell">
						<div class="broker-listing-title">${escapeAdminHtml(row.title || "제목 없음")}</div>
						<div class="broker-listing-address">${escapeAdminHtml(row.public_address || "-")}</div>
					</div>
					<div class="broker-listing-cell broker-listing-area">${escapeAdminHtml(areaText)}</div>
					<div class="broker-listing-cell broker-listing-price">${priceHtml}</div>
					<div class="broker-listing-menu-cell">
						<button type="button" class="broker-listing-menu-btn" data-admin-listing-menu="${rowId}" aria-label="매물 관리 메뉴">⋮</button>
						<div class="broker-listing-more-menu" data-admin-listing-menu-panel="${rowId}">
							${effectiveStatus === "deleted" ? `
							<button type="button" class="broker-listing-menu-item" data-admin-listing-action="published" data-listing-id="${rowId}">복원</button>
							<button type="button" class="broker-listing-menu-item danger" data-admin-listing-action="permanent_delete" data-listing-id="${rowId}">영구삭제</button>
							` : `
							<button type="button" class="broker-listing-menu-item" data-admin-listing-action="refresh" data-listing-id="${rowId}">현재날짜로 갱신</button>
							<button type="button" class="broker-listing-menu-item" data-admin-listing-action="${closedAction}" data-listing-id="${rowId}">${closedLabel}</button>
							<button type="button" class="broker-listing-menu-item" data-admin-listing-action="${hiddenAction}" data-listing-id="${rowId}">${hiddenLabel}</button>
							<button type="button" class="broker-listing-menu-item danger" data-admin-listing-action="delete" data-listing-id="${rowId}">삭제</button>
							`}
						</div>
					</div>
				</div>
			`;
		}).join("") + renderAdminListingPagination(filteredRows.length, totalPages, currentPage);
	}

	async function fetchAdminPropertyListings(client)
	{
		return client
			.from("property_listings")
			.select("id, user_id, agency_id, listing_no, status, property_type, property_type_label, deal_types, title, public_address, created_at, updated_at, photos, payload")
			.order("updated_at", { ascending: false });
	}

	async function loadAdminListings(options = {})
	{
		const listEl = document.getElementById("adminListingsList");
		if (!listEl) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">관리자 계정에서만 이용 가능합니다.</div>';
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}

		if (Array.isArray(adminListingRowsCache) && options.force !== true) {
			renderAdminListings(adminListingRowsCache);
			return;
		}

		if (adminListingLoadPromise) return adminListingLoadPromise;

		if (!options.silent && !listEl.querySelector(".admin-listing-row")) {
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">전체 매물을 불러오는 중입니다.</div>';
		}

		adminListingLoadPromise = (async () => {
			await purgeAdminExpiredTrashIfNeeded(client);
			const { data, error } = await fetchAdminPropertyListings(client);

			if (error) {
				console.error("관리자 매물 목록 조회 실패:", error);
				listEl.innerHTML = `<div class="admin-empty">매물을 불러오지 못했습니다. ${getAdminListingToolsSchemaHelp()}</div>`;
				return;
			}

			adminListingRowsCache = Array.isArray(data) ? data : [];
			renderAdminListings(adminListingRowsCache);
		})().catch((err) => {
			console.error("관리자 매물 목록 오류:", err);
			listEl.classList.remove("broker-listing-list");
			listEl.innerHTML = '<div class="admin-empty">매물 처리 중 오류가 발생했습니다.</div>';
		}).finally(() => {
			adminListingLoadPromise = null;
		});
		return adminListingLoadPromise;
	}

	function formatBrokerManwon(value)
	{
		const num = Number(value);
		if (!Number.isFinite(num) || num <= 0) return "";
		const manwon = Math.round(num);
		const eok = Math.floor(manwon / 10000);
		const rest = manwon % 10000;
		if (eok > 0 && rest > 0) return `${eok.toLocaleString("ko-KR")}억 ${rest.toLocaleString("ko-KR")}만원`;
		if (eok > 0) return `${eok.toLocaleString("ko-KR")}억`;
		return `${manwon.toLocaleString("ko-KR")}만원`;
	}

	function getBrokerDealLabel(deal)
	{
		const labels = { sale: "매매", jeonse: "전세", monthly: "월세", yearly: "년세", short: "단기" };
		return labels[deal] || deal || "-";
	}

	function getBrokerListingPrice(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const prices = payload.prices || {};
		const deals = Array.isArray(row.deal_types) ? row.deal_types : [];
		// PATCH 2.551: 거래유형은 별도 컬럼에 표시하므로 가격 칸에는 금액만 둔다.
		if (deals.includes("sale") && prices.sale?.price) return formatBrokerManwon(prices.sale.price);
		if (deals.includes("jeonse") && prices.jeonse?.deposit) return formatBrokerManwon(prices.jeonse.deposit);
		if (deals.includes("monthly")) {
			const deposit = formatBrokerManwon(prices.monthly?.deposit);
			const rent = formatBrokerManwon(prices.monthly?.rent);
			const price = [deposit, rent].filter(Boolean).join(" / ");
			return price || "-";
		}
		if (deals.includes("yearly")) {
			const deposit = formatBrokerManwon(prices.yearly?.deposit);
			const rent = formatBrokerManwon(prices.yearly?.rent);
			const price = [deposit, rent].filter(Boolean).join(" / ");
			return price || "-";
		}
		if (deals.includes("short")) {
			const deposit = formatBrokerManwon(prices.short?.deposit);
			const rent = formatBrokerManwon(prices.short?.rent);
			const price = [deposit, rent].filter(Boolean).join(" / ");
			return price || "-";
		}
		return "-";
	}

	function getBrokerListingDealPrice(row)
	{
		const deals = Array.isArray(row?.deal_types) ? row.deal_types : [];
		const dealLabel = deals.length ? deals.map(getBrokerDealLabel).filter(Boolean).join(" · ") : "";
		const price = getBrokerListingPrice(row);
		return {
			dealLabel: dealLabel || "",
			priceLabel: price && price !== "-" ? price : ""
		};
	}

	function getBrokerListingThumbHtml(row)
	{
		const photos = Array.isArray(row.photos) ? row.photos : [];
		const first = photos.find((photo) => photo && (photo.url || photo.publicUrl));
		const url = first ? (first.url || first.publicUrl) : "";
		return url
			? `<img src="${escapeAdminHtml(url)}" alt="매물 사진">`
			: `<span>사진 없음</span>`;
	}

	// PATCH 2.324: 중개사 홈 목록용 등록일/매물번호/블로그 복사 문구를 한곳에서 만든다
	function formatBrokerListingDate(value)
	{
		if (!value) return "-";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		const yy = String(date.getFullYear()).slice(2);
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}.${mm}.${dd}`;
	}

	// PATCH 2.349: 현재날짜 갱신은 updated_at을 바꾸므로 목록 날짜도 갱신일 기준으로 표시한다
	function getBrokerListingDisplayDate(row)
	{
		return formatBrokerListingDate(row?.updated_at || row?.created_at);
	}

	// PATCH 2.353: 현재날짜 갱신 사용건수는 payload 안에 날짜별로 누적해 오늘치만 합산한다
	function getBrokerRelistUsageDateKey(value = new Date())
	{
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		const yyyy = String(date.getFullYear());
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}

	function getBrokerListingRelistUsageCount(row, dateKey = getBrokerRelistUsageDateKey())
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const counts = payload.relist_usage_by_date && typeof payload.relist_usage_by_date === "object" ? payload.relist_usage_by_date : {};
		const count = Number(counts[dateKey]);
		return Number.isFinite(count) && count > 0 ? count : 0;
	}

	const BROKER_RELIST_DAILY_LIMIT = 50;

	function getBrokerRelistDailyLimit()
	{
		return BROKER_RELIST_DAILY_LIMIT;
	}

	function getBrokerRelistUsageTotal(rows, dateKey = getBrokerRelistUsageDateKey())
	{
		return (Array.isArray(rows) ? rows : []).reduce((total, row) => total + getBrokerListingRelistUsageCount(row, dateKey), 0);
	}

	function getBrokerListingStatusLabel(status)
	{
		if (status === "published") return "등록";
		if (status === "draft") return "임시";
		if (status === "closed") return "거래완료";
		if (status === "hidden") return "숨김";
		if (status === "archive") return "보관";
		if (status === "deleted" || status === "trash") return "휴지통";
		return status || "-";
	}

	// PATCH 2.340: DB status 제약을 건드리지 않고 거래완료 상태는 payload 관리상태로 판별한다
	function getBrokerListingEffectiveStatus(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const status = String(row && row.status ? row.status : "").trim().toLowerCase();
		if (status === "deleted" || status === "trash" || payload.deleted_at) return "deleted";
		if (payload.broker_status === "closed") return "closed";
		return status;
	}

	function getBrokerListingNo(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const storedNo = normalizePropertyListingNoCandidate(row?.listing_no || payload.listing_no || "");
		if (storedNo) return storedNo;
		const source = [
			row?.title,
			payload.description,
			payload.agency_memo
		].filter(Boolean).join("\n");
		const extractedNo = extractPropertyListingNoCandidate(source);
		if (extractedNo) return extractedNo;
		return String(row?.id || "").slice(0, 8) || "-";
	}

	function getBrokerListingAreaUnit()
	{
		return window.realjejuBrokerListingAreaUnit === "py" ? "py" : "m2";
	}

	function formatBrokerListingAreaValue(value)
	{
		const num = Number(value);
		if (!Number.isFinite(num) || num <= 0) return "";
		if (getBrokerListingAreaUnit() === "py") {
			return `${(num / 3.305785).toLocaleString("ko-KR", { maximumFractionDigits: 2 })}평`;
		}
		return `${num.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}㎡`;
	}

	function getBrokerListingAreaValue(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const areas = payload.areas || {};
		const value = areas.exclusive_m2 || areas.total_m2 || areas.building_m2 || areas.land_m2 || areas.supply_m2;
		return formatBrokerListingAreaValue(value) || "-";
	}

	function syncBrokerListingAreaCells()
	{
		document.querySelectorAll(".broker-listing-row[data-listing-id]").forEach((rowEl) => {
			const listingId = rowEl.getAttribute("data-listing-id") || "";
			const row = window.realjejuBrokerListingRowsById?.get(String(listingId));
			const areaEl = rowEl.querySelector(".broker-listing-area");
			if (!row || !areaEl) return;
			areaEl.textContent = getBrokerListingAreaValue(row);
		});
	}

	function syncAdminListingAreaCells()
	{
		document.querySelectorAll(".admin-listing-row[data-admin-listing-id]").forEach((rowEl) => {
			const listingId = rowEl.getAttribute("data-admin-listing-id") || "";
			const row = Array.isArray(adminListingRowsCache)
				? adminListingRowsCache.find((item) => String(item?.id || "") === String(listingId))
				: null;
			const areaEl = rowEl.querySelector(".broker-listing-area");
			if (!row || !areaEl) return;
			areaEl.textContent = getBrokerListingAreaValue(row);
		});
	}

	function getBrokerListingBlogText(row)
	{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const deals = Array.isArray(row.deal_types) && row.deal_types.length ? row.deal_types.map(getBrokerDealLabel).join(", ") : "";
		return [
			row.title || "",
			`매물유형: ${row.property_type_label || "-"}`,
			deals ? `거래유형: ${deals}` : "",
			`가격: ${getBrokerListingPrice(row)}만원`,
			`주소: ${row.public_address || "-"}`,
			"",
			payload.description || ""
		].filter((line, index) => index === 5 || String(line || "").trim()).join("\n");
	}

	async function copyBrokerListingBlogText(listingId)
	{
		const row = window.realjejuBrokerListingRowsById?.get(String(listingId || ""));
		if (!row) return;
		const text = getBrokerListingBlogText(row);
		try {
			await navigator.clipboard.writeText(text);
			openAuthErrorModal("블로그용 문구를 복사했습니다.", "블로그복사", null);
		}
		catch (err) {
			console.warn("블로그 문구 복사 실패:", err);
			openAuthErrorModal("복사에 실패했습니다. 브라우저 권한을 확인하세요.", "블로그복사", null);
		}
	}

	// PATCH 2.343: 삭제는 즉시 DB 삭제하지 않고 휴지통으로 이동하며, 영구삭제만 실제 삭제한다
	function clearBrokerListingMenuPosition(menu)
	{
		if (!menu) return;
		menu.style.removeProperty("--rj-broker-listing-menu-top");
		menu.style.removeProperty("--rj-broker-listing-menu-left");
		menu.style.removeProperty("visibility");
	}

	function closeBrokerListingMenus(exceptId)
	{
		document.querySelectorAll("[data-broker-listing-menu-panel].open").forEach((menu) => {
			const menuId = menu.getAttribute("data-broker-listing-menu-panel");
			if (exceptId && menuId === String(exceptId)) return;
			menu.classList.remove("open");
			clearBrokerListingMenuPosition(menu);
		});
	}

	function openBrokerListingMenuAtButton(menu, button)
	{
		if (!menu || !button) return;
		const viewportGap = 8;
		const menuGap = 6;
		clearBrokerListingMenuPosition(menu);
		menu.style.visibility = "hidden";
		menu.classList.add("open");

		const buttonRect = button.getBoundingClientRect();
		const menuWidth = menu.offsetWidth || 154;
		const menuHeight = menu.offsetHeight || 0;
		const maxLeft = Math.max(viewportGap, window.innerWidth - menuWidth - viewportGap);
		let left = buttonRect.right - menuWidth;
		left = Math.max(viewportGap, Math.min(left, maxLeft));

		let top = buttonRect.bottom + menuGap;
		if (top + menuHeight > window.innerHeight - viewportGap) {
			top = buttonRect.top - menuHeight - menuGap;
		}
		top = Math.max(viewportGap, Math.min(top, window.innerHeight - menuHeight - viewportGap));

		menu.style.setProperty("--rj-broker-listing-menu-left", `${Math.round(left)}px`);
		menu.style.setProperty("--rj-broker-listing-menu-top", `${Math.round(top)}px`);
		menu.style.removeProperty("visibility");
	}

	async function updateAdminListingRowAction(listingId, action)
	{
		const id = String(listingId || "").trim();
		const nextAction = String(action || "").trim();
		if (!id || !nextAction) return;
		if (!isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 계정에서만 처리할 수 있습니다.", "매물 관리", null);
			return;
		}
		const client = getRealjejuSupabaseClient();
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "매물 관리", null);
			return;
		}

		try {
			const { error } = await client.rpc("admin_update_property_listing", {
				p_listing_id: id,
				p_action: nextAction
			});
			if (error) throw error;

			await loadAdminListings({ force: true, silent: true });
			if (typeof window.realjejuReloadMapListings === "function") window.realjejuReloadMapListings();
		}
		catch (err) {
			console.error("관리자 매물 관리 실패:", err);
			openAuthErrorModal(`매물 처리에 실패했습니다${formatAdminRpcError(err)}. ${getAdminListingToolsSchemaHelp()}`, "매물 관리", null);
		}
	}

	async function updateBrokerListingRowAction(listingId, action)
	{
		const id = String(listingId || "").trim();
		let nextAction = String(action || "").trim();
		if (!id || !nextAction) return;
		const user = currentRealjejuAuthUser;
		const client = getRealjejuSupabaseClient();
		if (!user || !user.id || !client) {
			openAuthErrorModal("로그인과 Supabase 연결 상태를 확인하세요.", "중개사 홈", null);
			return;
		}

		try {
			const nowIso = new Date().toISOString();
			if (nextAction === "permanent_delete") {
				const { error } = await client
					.from("property_listings")
					.delete()
					.eq("id", id)
					.eq("user_id", user.id);
				if (error) throw error;
			}
			else {
				const update = { updated_at: nowIso };
				const row = window.realjejuBrokerListingRowsById?.get(id);
				const payload = row && row.payload && typeof row.payload === "object" ? { ...row.payload } : {};
				const currentStatus = getBrokerListingEffectiveStatus(row);
				if (nextAction === "closed" && ["closed", "hidden", "archive"].includes(currentStatus)) {
					nextAction = "published";
				}

				if (nextAction === "refresh") {
					const todayKey = getBrokerRelistUsageDateKey();
					const currentRows = Array.from(window.realjejuBrokerListingRowsById?.values?.() || []);
					const dailyLimit = getBrokerRelistDailyLimit();
					if (getBrokerRelistUsageTotal(currentRows, todayKey) >= dailyLimit) {
						openAuthErrorModal(`하루 재등록 사용건수 ${dailyLimit}건을 모두 사용했습니다.`, "중개사 홈", null);
						return;
					}
					const relistCounts = payload.relist_usage_by_date && typeof payload.relist_usage_by_date === "object" ? { ...payload.relist_usage_by_date } : {};
					const todayCount = Number(relistCounts[todayKey]);
					relistCounts[todayKey] = (Number.isFinite(todayCount) && todayCount > 0 ? todayCount : 0) + 1;
					// PATCH 2.353: 갱신 버튼을 누른 횟수를 날짜별 사용건수로 보존한다
					update.payload = { ...payload, relist_usage_by_date: relistCounts, last_relisted_at: nowIso };
				}
				if (nextAction === "closed") {
					update.status = "published";
					update.payload = { ...payload, broker_status: "closed" };
				}
				if (nextAction === "hidden") {
					update.status = "hidden";
					if (payload.broker_status) {
						delete payload.broker_status;
						update.payload = payload;
					}
				}
				if (nextAction === "delete") {
					update.status = "deleted";
					if (payload.broker_status) delete payload.broker_status;
					update.payload = { ...payload, deleted_at: nowIso };
				}
				if (nextAction === "published") {
					update.status = "published";
					if (payload.broker_status) {
						delete payload.broker_status;
					}
					if (payload.deleted_at) delete payload.deleted_at;
					update.payload = payload;
				}
				const { error } = await client
					.from("property_listings")
					.update(update)
					.eq("id", id)
					.eq("user_id", user.id);
				if (error) throw error;
			}

				await loadBrokerListings();
				if (nextAction === "refresh" && typeof window.realjejuReloadMapListings === "function") window.realjejuReloadMapListings();
			}
			catch (err) {
				console.error("중개사 홈 매물 관리 실패:", err);
				openAuthErrorModal("매물 처리에 실패했습니다.", "중개사 홈", null);
			}
		}

		async function refreshAllBrokerListingsByDailyLimit()
		{
			if (window.realjejuBrokerBulkRefreshBusy) return;
			const user = currentRealjejuAuthUser;
			const client = getRealjejuSupabaseClient();
			if (!user || !user.id || !client) {
				openAuthErrorModal("로그인과 Supabase 연결 상태를 확인하세요.", "중개사 홈", null);
				return;
			}

			const rows = Array.from(window.realjejuBrokerListingRowsById?.values?.() || []);
			const candidates = rows
				.filter((row) => isBrokerListingInStatusFilter(row, "trading"))
				.sort((a, b) => {
					const aTime = Date.parse(a?.updated_at || a?.created_at || "") || 0;
					const bTime = Date.parse(b?.updated_at || b?.created_at || "") || 0;
					return aTime - bTime;
				});
			if (!candidates.length) {
				openAuthErrorModal("갱신할 거래중 매물이 없습니다.", "전체갱신", null);
				return;
			}

			const todayKey = getBrokerRelistUsageDateKey();
			const dailyLimit = getBrokerRelistDailyLimit();
			const usedCount = getBrokerRelistUsageTotal(rows, todayKey);
			const remainingCount = Math.max(0, dailyLimit - usedCount);
			if (remainingCount <= 0) {
				openAuthErrorModal(`하루 재등록 사용건수 ${dailyLimit}건을 모두 사용했습니다.`, "전체갱신", null);
				return;
			}

			const refreshRows = candidates.slice(0, remainingCount);
			const button = document.getElementById("brokerBulkRefreshBtn");
			window.realjejuBrokerBulkRefreshBusy = true;
			if (button) button.disabled = true;
			let successCount = 0;
			try {
				for (const row of refreshRows) {
					const rowId = String(row?.id || "").trim();
					if (!rowId) continue;
					const nowIso = new Date().toISOString();
					const payload = row && row.payload && typeof row.payload === "object" ? { ...row.payload } : {};
					const relistCounts = payload.relist_usage_by_date && typeof payload.relist_usage_by_date === "object" ? { ...payload.relist_usage_by_date } : {};
					const todayCount = Number(relistCounts[todayKey]);
					relistCounts[todayKey] = (Number.isFinite(todayCount) && todayCount > 0 ? todayCount : 0) + 1;
					const { error } = await client
						.from("property_listings")
						.update({
							updated_at: nowIso,
							payload: { ...payload, relist_usage_by_date: relistCounts, last_relisted_at: nowIso }
						})
						.eq("id", rowId)
						.eq("user_id", user.id);
					if (error) throw error;
					successCount += 1;
				}

				await loadBrokerListings();
				if (typeof window.realjejuReloadMapListings === "function") window.realjejuReloadMapListings();
				const suffix = candidates.length > refreshRows.length ? ` 하루 한도 ${dailyLimit}건 안에서 ${successCount}건만 갱신했습니다.` : "";
				openAuthErrorModal(`${successCount}건을 현재시간으로 갱신했습니다.${suffix}`, "전체갱신", null);
			}
			catch (err) {
				console.error("중개사 홈 전체갱신 실패:", err);
				openAuthErrorModal("전체갱신 처리에 실패했습니다.", "전체갱신", null);
			}
			finally {
				window.realjejuBrokerBulkRefreshBusy = false;
				if (button) button.disabled = false;
			}
		}

	function confirmBrokerListingDelete(listingId)
	{
		openAuthConfirmModal("선택한 매물을 휴지통으로 이동할까요?", "매물 삭제", () => {
			updateBrokerListingRowAction(listingId, "delete");
		}, null);
	}

	function confirmBrokerListingPermanentDelete(listingId)
	{
		openAuthConfirmModal("휴지통 매물을 영구 삭제할까요?", "영구 삭제", () => {
			updateBrokerListingRowAction(listingId, "permanent_delete");
		}, null);
	}

	// PATCH 2.342: 중개사 홈 매물유형/거래유형 필터는 체크박스 다중 선택으로 관리한다
	function getBrokerHomeFilters()
	{
		if (!window.realjejuBrokerHomeFilters) {
			window.realjejuBrokerHomeFilters = {
				status: "trading",
				property: new Set(),
				deal: new Set()
			};
		}
		if (!(window.realjejuBrokerHomeFilters.property instanceof Set)) {
			window.realjejuBrokerHomeFilters.property = new Set(window.realjejuBrokerHomeFilters.property ? [window.realjejuBrokerHomeFilters.property] : []);
		}
		if (!(window.realjejuBrokerHomeFilters.deal instanceof Set)) {
			window.realjejuBrokerHomeFilters.deal = new Set(window.realjejuBrokerHomeFilters.deal ? [window.realjejuBrokerHomeFilters.deal] : []);
		}
		return window.realjejuBrokerHomeFilters;
	}

	function closeBrokerHomeFilterMenus(exceptType)
	{
		document.querySelectorAll(".broker-home-filter-menu.open").forEach((menu) => {
			if (!exceptType || !menu.id.toLowerCase().includes(String(exceptType).toLowerCase())) {
				menu.classList.remove("open");
			}
		});
	}

	function populateBrokerHomeFilterMenus()
	{
		const propertyMenu = document.getElementById("brokerPropertyTypeFilterMenu");
		const propertySelect = document.getElementById("propertyTypeSelect");
		if (propertyMenu && propertySelect) {
			const options = Array.from(propertySelect.options)
				.filter((option) => option.value)
				.map((option) => ({ value: option.value, label: option.textContent.trim() }));
			propertyMenu.innerHTML = [
				...options.map((option) => `<label class="broker-home-filter-option"><input type="checkbox" class="broker-home-filter-check" data-broker-home-filter-option="property" data-value="${escapeAdminHtml(option.value)}" /><span>${escapeAdminHtml(option.label)}</span></label>`),
				'<div class="broker-home-filter-reset-row"><button type="button" class="broker-home-filter-reset-btn" data-broker-home-filter-reset="property"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>초기화</button></div>'
			].join("");
		}

		const dealMenu = document.getElementById("brokerDealTypeFilterMenu");
		if (dealMenu) {
			const deals = Array.from(document.querySelectorAll(".property-deal-check")).map((input) => {
				const label = input.closest("label")?.textContent?.trim() || getBrokerDealLabel(input.value);
				return { value: input.value, label };
			}).filter((item) => item.value);
			dealMenu.innerHTML = [
				...deals.map((deal) => `<label class="broker-home-filter-option"><input type="checkbox" class="broker-home-filter-check" data-broker-home-filter-option="deal" data-value="${escapeAdminHtml(deal.value)}" /><span>${escapeAdminHtml(deal.label)}</span></label>`),
				'<div class="broker-home-filter-reset-row"><button type="button" class="broker-home-filter-reset-btn" data-broker-home-filter-reset="deal"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i>초기화</button></div>'
			].join("");
		}
	}

	function syncBrokerHomeFilterUi()
	{
		const filters = getBrokerHomeFilters();
		document.querySelectorAll("[data-broker-home-status-filter]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.brokerHomeStatusFilter === filters.status);
		});

		const propertyBtn = document.getElementById("brokerPropertyTypeFilterBtn");
		const propertySelect = document.getElementById("propertyTypeSelect");
		const propertyValues = Array.from(filters.property || []);
		const propertyLabel = propertyValues.length && propertySelect
			? propertyValues.map((value) => Array.from(propertySelect.options).find((option) => option.value === value)?.textContent?.trim() || value).join(", ")
			: "매물 유형";
		if (propertyBtn) propertyBtn.innerHTML = `${escapeAdminHtml(propertyLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
		if (propertyBtn) propertyBtn.classList.toggle("active", propertyValues.length > 0);

		const dealBtn = document.getElementById("brokerDealTypeFilterBtn");
		const dealValues = Array.from(filters.deal || []);
		const dealLabel = dealValues.length ? dealValues.map(getBrokerDealLabel).join(", ") : "거래 유형";
		if (dealBtn) dealBtn.innerHTML = `${escapeAdminHtml(dealLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
		if (dealBtn) dealBtn.classList.toggle("active", dealValues.length > 0);

		document.querySelectorAll(".broker-home-filter-check[data-broker-home-filter-option]").forEach((input) => {
			const type = input.dataset.brokerHomeFilterOption;
			const values = filters[type] instanceof Set ? filters[type] : new Set();
			input.checked = values.has(input.dataset.value || "");
			const option = input.closest(".broker-home-filter-option");
			if (option) option.classList.toggle("active", input.checked);
		});
	}

	function isBrokerListingInStatusFilter(row, status)
	{
		const rowStatus = getBrokerListingEffectiveStatus(row);
		if (status === "closed") return rowStatus === "closed";
		if (status === "hidden") return rowStatus === "hidden" || rowStatus === "archive";
		if (status === "deleted") return rowStatus === "deleted";
		return !["closed", "hidden", "draft", "archive", "deleted"].includes(rowStatus);
	}

	function filterBrokerListingRows(rows)
	{
		const filters = getBrokerHomeFilters();
		return (Array.isArray(rows) ? rows : []).filter((row) => {
			if (!isBrokerListingInStatusFilter(row, filters.status)) return false;
			if (filters.property.size && !filters.property.has(row.property_type)) return false;
			if (filters.deal.size && !(Array.isArray(row.deal_types) && row.deal_types.some((deal) => filters.deal.has(deal)))) return false;
			return true;
		});
	}

	function setBrokerListingPage(value)
	{
		const next = Math.floor(Number(value));
		if (!Number.isFinite(next) || next < 1) {
			brokerListingPage = 1;
			return;
		}
		brokerListingPage = next;
	}

	function getBrokerListingPage(totalPages)
	{
		const maxPage = Math.max(1, Number(totalPages) || 1);
		if (!Number.isFinite(brokerListingPage) || brokerListingPage < 1) brokerListingPage = 1;
		if (brokerListingPage > maxPage) brokerListingPage = maxPage;
		return brokerListingPage;
	}

	function getBrokerListingPaginationItems(totalPages, currentPage)
	{
		const pages = [];
		if (totalPages <= 9) {
			for (let i = 1; i <= totalPages; i += 1) pages.push(i);
			return pages;
		}
		pages.push(1);
		const start = Math.max(2, currentPage - 2);
		const end = Math.min(totalPages - 1, currentPage + 2);
		if (start > 2) pages.push("ellipsis");
		for (let i = start; i <= end; i += 1) pages.push(i);
		if (end < totalPages - 1) pages.push("ellipsis");
		pages.push(totalPages);
		return pages;
	}

	function renderBrokerListingPagination(totalCount, totalPages, currentPage)
	{
		if (totalCount <= BROKER_LISTINGS_PER_PAGE || totalPages <= 1) return "";
		const items = getBrokerListingPaginationItems(totalPages, currentPage);
		return `
			<nav class="broker-listing-pagination" aria-label="중개사 매물 페이지">
				${items.map((item) => {
					if (item === "ellipsis") return '<span class="broker-listing-page-ellipsis">…</span>';
					const page = Number(item);
					return `<button type="button" class="broker-listing-page-btn ${page === currentPage ? "active" : ""}" data-broker-listing-page="${page}" aria-current="${page === currentPage ? "page" : "false"}">${page}</button>`;
				}).join("")}
			</nav>
		`;
	}

	// PATCH 3.130: 휴지통 이동 후 15일이 지난 매물은 중개사 홈 로딩 시 실제 삭제한다
	async function purgeExpiredDeletedBrokerListings(rows, client, userId)
	{
		if (!client || !userId || !Array.isArray(rows)) return false;
		const expiredIds = rows
			.filter((row) => getBrokerListingEffectiveStatus(row) === "deleted")
			.filter((row) => {
				const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
				return isRealjejuExpiredTrashDate(payload.deleted_at || row.updated_at || row.created_at);
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

	function setBrokerEditInput(id, value)
	{
		const el = document.getElementById(id);
		if (!el || value === undefined || value === null) return;
		if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
			el.value = String(value);
		} else {
			el.textContent = String(value);
		}
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function setBrokerEditSelect(id, value)
	{
		const select = document.getElementById(id);
		if (!select || value === undefined || value === null) return;
		let nextValue = String(value || "").trim();
		if (id === "propertyTypeSelect") nextValue = syncRealjejuPropertyTypeSelect(select, nextValue) || nextValue;
		select.value = nextValue;
		const wrap = select.closest("[data-register-dropdown]");
		let option = null;
		if (wrap) {
			const label = wrap.querySelector("[data-register-dropdown-label]");
			const options = Array.from(wrap.querySelectorAll(".property-register-dropdown-option[data-value]"));
			option = options.find((btn) => String(btn.dataset.value || "").trim() === String(select.value || "").trim()) || null;
			if (!option && id === "propertyTypeSelect") {
				option = findRealjejuPropertyTypeOption(select, nextValue);
				if (option) {
					nextValue = String(option.dataset.value || "").trim();
					select.value = nextValue;
				}
			}
			if (!option && nextValue) {
				option = options.find((btn) => String(btn.textContent || "").replace(/\s+/g, " ").trim() === nextValue) || null;
				if (option) {
					nextValue = String(option.dataset.value || "").trim();
					select.value = nextValue;
				}
			}
			select.dataset.selectedValue = select.value;
			wrap.dataset.selectedValue = select.value;
			wrap.querySelectorAll(".property-register-dropdown-option").forEach((btn) => btn.classList.toggle("active", btn === option));
			if (label) label.textContent = option ? option.textContent.trim() : (select.options[select.selectedIndex]?.textContent || "선택");
		} else {
			select.dataset.selectedValue = select.value;
		}
		select.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function setBrokerEditRadio(name, value)
	{
		const radio = document.querySelector(`input[name="${name}"][value="${CSS.escape(String(value || ""))}"]`);
		if (!radio) return;
		radio.checked = true;
		radio.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function setBrokerEditCheck(id, checked)
	{
		const el = document.getElementById(id);
		if (!el) return;
		el.checked = !!checked;
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

	// PATCH 2.322: 저장 당시 폼 상태가 있으면 수정 화면에서 빠진 항목 없이 우선 복원
	function restoreBrokerEditFormState(formState)
	{
		if (!formState || typeof formState !== "object") return;
		const propertyTypeSelect = document.getElementById("propertyTypeSelect");
		if (propertyTypeSelect && formState.areaMode !== undefined) propertyTypeSelect.dataset.areaMode = String(formState.areaMode || "");
		Object.entries(formState.selects || {}).forEach(([id, value]) => setBrokerEditSelect(id, value));
		Object.entries(formState.inputs || {}).forEach(([id, value]) => setBrokerEditInput(id, value));
		Object.entries(formState.checks || {}).forEach(([id, checked]) => setBrokerEditCheck(id, checked));
		Object.entries(formState.radios || {}).forEach(([name, value]) => setBrokerEditRadio(name, value));
		if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
	}

	function setBrokerEditMaintenanceTab(type)
	{
		const tab = document.querySelector(`#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="${CSS.escape(String(type || "fixed"))}"]`);
		if (tab) tab.click();
	}

	// PATCH 2.322: 기존 저장 데이터의 관리비 탭과 세부 체크값을 수정 화면에 다시 표시
	function restoreBrokerEditMaintenance(maintenance)
	{
		if (!maintenance || typeof maintenance !== "object") return;
		const maintenanceType = maintenance.type || "fixed";
		// PATCH 2.323: 기존 저장분에 부과기준 값이 없으면 기타 부과 기본값으로 복원
		const detailType = maintenance.detail_type || (maintenanceType === "extra" ? "common_area_usage" : "");
		setBrokerEditMaintenanceTab(maintenanceType);
		setBrokerEditCheck("maintenanceUnder100kChk", !!maintenance.under_100k_or_unprovided);
		setBrokerEditRadio("maintenanceFixedBase", maintenance.fixed_base || "");
		setBrokerEditRadio("maintenanceExtraBase", maintenance.extra_base || "");
		setBrokerEditRadio("maintenanceDetailType", detailType);
		setBrokerEditRadio("maintenanceUnknownReason", maintenance.unknown_reason || "");
		setBrokerEditInput("maintenanceNoneValue", normalizeMaintenanceNoFeeText(maintenance.no_fee_value, "관리비 없음"));
		setBrokerEditInput("maintenanceNoneReason", normalizeMaintenanceNoFeeText(maintenance.no_fee_reason, "관리비 부과내역 없음"));
		setBrokerEditInput("maintenanceFixedTotalInput", maintenance.fixed_total_won ?? "");
		setBrokerEditInput("maintenanceTotalInput", maintenance.total_won ?? "");
		setBrokerEditInput("maintenanceCommonInput", maintenance.common_manwon ?? "");
		[
			["Common", "common"],
			["Electric", "electric"],
			["Water", "water"],
			["Gas", "gas"],
			["Heating", "heating"],
			["Internet", "internet"],
			["Tv", "tv"],
			["Etc", "etc"]
		].forEach(([suffix, key]) => {
			const checked = !!maintenance[`include_${key}`];
			setBrokerEditCheck(`maintenanceFixedInclude${suffix}Chk`, checked);
			setBrokerEditCheck(`maintenanceInclude${suffix}Chk`, checked);
		});
		[
			["maintenanceElectricType", "electric_type"],
			["maintenanceWaterType", "water_type"],
			["maintenanceGasType", "gas_type"],
			["maintenanceHeatingType", "heating_type"],
			["maintenanceInternetType", "internet_type"],
			["maintenanceTvType", "tv_type"],
			["maintenanceEtcType", "etc_type"]
		].forEach(([name, key]) => setBrokerEditRadio(name, maintenance[key] || ""));
		[
			["maintenanceElectricInput", "electric_manwon"],
			["maintenanceWaterInput", "water_manwon"],
			["maintenanceGasInput", "gas_manwon"],
			["maintenanceHeatingInput", "heating_manwon"],
			["maintenanceInternetInput", "internet_manwon"],
			["maintenanceTvInput", "tv_manwon"],
			["maintenanceEtcInput", "etc_manwon"]
			].forEach(([id, key]) => setBrokerEditInput(id, maintenance[key] ?? ""));
		}

		function hasStoredAreaValue(value)
		{
			const text = String(value ?? "").replace(/,/g, "").trim();
			if (!text) return false;
			const num = Number(text);
			return Number.isFinite(num) ? num > 0 : true;
		}

		function getStoredAreaItemsForEdit(areas, payload)
		{
			const source = areas && typeof areas === "object" ? areas : {};
			const labels = getStoredAreaLabels(source, payload || {});
			const savedItems = Array.isArray(source.area_items) ? source.area_items : (Array.isArray(payload?.form_state?.areaItems) ? payload.form_state.areaItems : []);
			const normalizedItems = savedItems
				.map((item) => {
					const savedLabel = normalizeAreaLabel(item?.label);
					const key = String(item?.key || getAreaKeyFromLabel(savedLabel) || "").trim();
					if (!key) return null;
					const label = labels[key] || savedLabel;
					const m2Text = String(item?.m2_text ?? item?.m2 ?? "").trim();
					const pyText = String(item?.py_text ?? item?.py ?? "").trim();
					if (!hasStoredAreaValue(m2Text) && !hasStoredAreaValue(pyText)) return null;
					return { key, label, m2_text: m2Text, py_text: pyText };
				})
				.filter(Boolean);
			if (normalizedItems.length) return normalizedItems;

			return [
				{ key: "land", label: labels.land || "대지면적", m2_text: getStoredAreaValue(source, payload || {}, "land", "m2"), py_text: getStoredAreaValue(source, payload || {}, "land", "py") },
				{ key: "exclusive", label: labels.exclusive || "전용면적", m2_text: getStoredAreaValue(source, payload || {}, "exclusive", "m2"), py_text: getStoredAreaValue(source, payload || {}, "exclusive", "py") },
				{ key: "supply", label: labels.supply || "공급면적", m2_text: getStoredAreaValue(source, payload || {}, "supply", "m2"), py_text: getStoredAreaValue(source, payload || {}, "supply", "py") }
			].filter((item) => hasStoredAreaValue(item.m2_text) || hasStoredAreaValue(item.py_text));
		}

		function clearBrokerEditAreaInputs()
		{
			[
				"exclusiveAreaM2Input", "exclusiveAreaPyInput",
				"supplyAreaM2Input", "supplyAreaPyInput",
				"landAreaM2Input", "landAreaPyInput"
			].forEach((id) => {
				const el = document.getElementById(id);
				if (el) el.value = "";
			});
		}

		function setBrokerEditAreaPair(key, item)
		{
			if (!item) return;
			const map = {
				land: ["landAreaM2Input", "landAreaPyInput"],
				exclusive: ["exclusiveAreaM2Input", "exclusiveAreaPyInput"],
				supply: ["supplyAreaM2Input", "supplyAreaPyInput"]
			};
			const ids = map[key];
			if (!ids) return;
			const [m2Id, pyId] = ids;
			const m2Input = document.getElementById(m2Id);
			const pyInput = document.getElementById(pyId);
			if (m2Input && hasStoredAreaValue(item.m2_text)) {
				m2Input.value = String(item.m2_text).trim();
				m2Input.dispatchEvent(new Event("input", { bubbles: true }));
			}
			if (pyInput && hasStoredAreaValue(item.py_text)) {
				pyInput.value = String(item.py_text).trim();
				pyInput.dispatchEvent(new Event("input", { bubbles: true }));
			}
		}

		function restoreBrokerEditAreaFields(row, areas, payload)
		{
			const propertyTypeSelect = document.getElementById("propertyTypeSelect");
			const areaMode = getAreaModeFromStoredLabels(areas, payload, String(areas?.area_mode || payload?.form_state?.areaMode || ""));
			if (propertyTypeSelect && areaMode) propertyTypeSelect.dataset.areaMode = areaMode;
			if (typeof updatePropertyRegisterAreaFields === "function") updatePropertyRegisterAreaFields();
			clearBrokerEditAreaInputs();
			const items = getStoredAreaItemsForEdit(areas, payload);
			["land", "exclusive", "supply"].forEach((key) => {
				setBrokerEditAreaPair(key, getPropertyRegisterAreaItemByKey(items, key));
			});
		}

		function fillBrokerListingEditForm(row)
		{
		const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		const prices = payload.prices || {};
		const areas = payload.areas || {};
		const building = payload.building || {};
		const rooms = payload.rooms || {};
		const floors = payload.floors || {};
		const moveIn = payload.move_in || {};
		const registrant = payload.registrant || {};
		const address = payload.address || {};
		const page = document.getElementById("propertyRegisterPage");
		if (page) page.dataset.listingId = row.id || "";
		if (typeof window.realjejuSetPropertyRegisterEditMode === "function") window.realjejuSetPropertyRegisterEditMode(true);

		const propertyTypeSelectForArea = document.getElementById("propertyTypeSelect");
		if (propertyTypeSelectForArea && areas.area_mode) propertyTypeSelectForArea.dataset.areaMode = areas.area_mode;
		setBrokerEditSelect("propertyTypeSelect", row.property_type || "");
		const editListingNo = normalizePropertyListingNoCandidate(row.listing_no || payload.listing_no || getBrokerListingNo(row));
		if (editListingNo) setPropertyListingNoManualValue(editListingNo);
		else setPropertyListingNoMode("auto");
		setBrokerEditSelect("buildingUseSelect", payload.building_use || "");
		document.querySelectorAll(".property-deal-check").forEach((input) => {
			input.checked = Array.isArray(row.deal_types) && row.deal_types.includes(input.value);
		});
		if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
		restoreBrokerEditFormState(payload.form_state);
		const restoredListingNoInput = document.getElementById("propertyListingNoInput");
		const restoredListingNo = normalizePropertyListingNoCandidate((restoredListingNoInput && restoredListingNoInput.value) || editListingNo);
		if (restoredListingNo) setPropertyListingNoManualValue(restoredListingNo);
		else setPropertyListingNoMode("auto");
		setBrokerEditSelect("propertyTypeSelect", row.property_type || row.property_type_label || payload.property_type || payload.property_type_label || "");
		setBrokerEditInput("priceSaleInput", prices.sale?.price || "");
		setBrokerEditInput("priceJeonseDepositInput", prices.jeonse?.deposit || "");
		setBrokerEditInput("priceMonthlyDepositInput", prices.monthly?.deposit || "");
		setBrokerEditInput("priceMonthlyRentInput", prices.monthly?.rent || "");
		setBrokerEditInput("priceYearlyDepositInput", prices.yearly?.deposit || "");
		setBrokerEditInput("priceYearlyRentInput", prices.yearly?.rent || "");
		setBrokerEditInput("priceShortDepositInput", prices.short?.deposit || "");
		setBrokerEditInput("priceShortRentInput", prices.short?.rent || "");

		setBrokerEditInput("propertyLocationSummaryInput", row.title || "");
		const addressInput = document.getElementById("propertyAddressInput");
		if (addressInput) {
			addressInput.value = row.address1 || row.public_address || "";
			addressInput.dataset.address1 = row.address1 || row.public_address || "";
			addressInput.dataset.address2 = row.address2 || "";
			addressInput.dataset.publicAddress = row.public_address || row.address1 || "";
			addressInput.dataset.privateAddress = row.address2 || "";
			addressInput.dataset.hideDetailJibun = row.hide_detail_jibun ? "1" : "0";
			addressInput.dataset.roadAddress = address.addressRoad || "";
			addressInput.dataset.jibunAddress = address.addressJibun || row.address1 || "";
			addressInput.dataset.zonecode = address.zonecode || "";
			addressInput.dataset.detailAddress = row.address2 || "";
			if (row.lat || address.lat) addressInput.dataset.lat = row.lat || address.lat;
			if (row.lng || address.lng) addressInput.dataset.lng = row.lng || address.lng;
			addressInput.dispatchEvent(new Event("input", { bubbles: true }));
			addressInput.dispatchEvent(new Event("change", { bubbles: true }));
		}
		if (typeof window.realjejuRestorePropertyAddressLocation === "function") {
			window.realjejuRestorePropertyAddressLocation({
				...address,
				address1: row.address1 || row.public_address || address.address1 || address.addressDisplay || "",
				address2: row.address2 || address.address2 || address.addressDetail || "",
				publicAddress: row.public_address || address.publicAddress || address.addressDisplay || "",
				lat: row.lat ?? address.lat,
				lng: row.lng ?? address.lng,
				locationDisplayType: row.location_display_type || address.locationDisplayType
			});
		}

			setBrokerEditInput("landRoadInput", areas.land_road || "");
			setBrokerEditSelect("landTypeSelect", areas.land_type || "");
			setBrokerEditSelect("landUseZoneSelect", areas.land_use_zone || "");

		setBrokerEditInput("propertyApprovalDateInput", building.approval_date || "");
		setBrokerEditInput("propertyStoreCountInput", building.store_count || "");
		setBrokerEditInput("propertyHouseholdCountInput", building.household_count || "");
		setBrokerEditSelect("propertyDirectionSelect", building.direction || "");
		setBrokerEditRadio("propertyLoan", building.loan || "check");
		setBrokerEditRadio("propertyParking", building.parking || "");
		setBrokerEditInput("propertyParkingTotalInput", building.parking_total || "");
		setBrokerEditInput("propertyParkingPerInput", building.parking_per_household || "");
		setBrokerEditRadio("propertyHeating", building.heating || "");
		setBrokerEditSelect("propertyHeatingFuelSelect", building.heating_fuel || "");

		setBrokerEditCheck("propertyRoomBathNotApplicableChk", !!rooms.not_applicable);
		setBrokerEditInput("propertyRoomCountInput", rooms.room_count ?? "");
		setBrokerEditInput("propertyBathCountInput", rooms.bath_count ?? "");
		setBrokerEditInput("propertyTotalFloorInput", floors.total_floor || "");
		setBrokerEditInput("propertyCurrentFloorInput", floors.current_floor || "");
		setBrokerEditCheck("propertyFloorLevelUseCheck", !!floors.use_level_label);
		setBrokerEditRadio("propertyFloorLevel", floors.level_label || "");
		setBrokerEditCheck("propertyBasementCheck", !!floors.basement);
		setBrokerEditCheck("propertySemiBasementCheck", !!floors.semi_basement);
		setBrokerEditCheck("propertyWholeBuildingCheck", !!floors.whole_building);

		setBrokerEditInput("propertyMoveInDateInput", moveIn.date || "");
		setBrokerEditCheck("propertyMoveInNowChk", !!moveIn.now);
		setBrokerEditCheck("propertyMoveInNegotiableChk", !!moveIn.negotiable);
		setBrokerEditInput("propertyDetailDescriptionInput", payload.description || "");
		setBrokerEditInput("propertyYoutubeLinkInput", payload.youtube_url || "");
		setBrokerEditInput("propertyAgencyMemoInput", payload.agency_memo || "");
		setBrokerEditInput("registrantOfficeNameInput", registrant.office_name || "");
		setBrokerEditInput("registrantRepresentativeInput", registrant.representative || "");
		setBrokerEditInput("registrantPhone1Input", registrant.phone1 || "");
		setBrokerEditInput("registrantManagerNameInput", registrant.manager_name || "");
		setBrokerEditCheck("registrantLicensedAgentChk", !!registrant.is_licensed_agent);
		setBrokerEditInput("registrantPhone2Input", registrant.phone2 || "");
		restoreBrokerEditMaintenance(payload.maintenance);

			restoreBrokerEditAreaFields(row, areas, payload);
			if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
		if (typeof window.realjejuSyncPropertyCountRowsVisibility === "function") window.realjejuSyncPropertyCountRowsVisibility();
		if (typeof updatePropertyParkingDetail === "function") updatePropertyParkingDetail();
		if (typeof updatePropertyFloorLevelRadioState === "function") updatePropertyFloorLevelRadioState();
		if (typeof window.realjejuLoadPropertyPhotoPreviewFromPhotos === "function") {
			window.realjejuLoadPropertyPhotoPreviewFromPhotos(row.photos);
		}
	}

		function getAdminApplicationStatus(row)
		{
			if (row && row.deleted_at) return "deleted";
			const raw = String(row && row.status ? row.status : "").trim();
			const compact = raw.replace(/\s+/g, "").toLowerCase();
			if (["active", "approved", "approve", "accepted", "승인", "승인완료", "완료"].includes(compact)) return "active";
			if (["new", "waiting", "wait", "applied", "apply", "신청", "가입신청", "신청중"].includes(compact)) return "new";
			if (["pending", "대기", "승인대기", "대기중"].includes(compact)) return "pending";
			if (["rejected", "reject", "denied", "거부", "반려", "승인거부"].includes(compact)) return "rejected";
			if (["deleted", "delete", "trash", "withdrawn", "삭제", "휴지통"].includes(compact)) return "deleted";
			if (!compact && row && (row.id || row.user_id || row.office_name || row.office_reg_no || row.office_address || row.phone || row.email)) return "new";
			return compact;
		}

	function isNewAdminApplication(row)
	{
		return !["active", "pending", "rejected", "deleted"].includes(getAdminApplicationStatus(row));
	}

	function getAdminApplicationFilteredRows(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		if (adminApplicationView === "new") return list.filter(isNewAdminApplication);
		if (adminApplicationView === "active") return list.filter((row) => getAdminApplicationStatus(row) === "active");
		if (adminApplicationView === "pending") return list.filter((row) => getAdminApplicationStatus(row) === "pending");
		if (adminApplicationView === "rejected") return list.filter((row) => getAdminApplicationStatus(row) === "rejected");
		if (adminApplicationView === "deleted") return list.filter((row) => getAdminApplicationStatus(row) === "deleted");
		return list.filter(isNewAdminApplication);
	}

	function updateAdminApplicationFilterCounts(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		const setText = (id, value) => {
			const el = document.getElementById(id);
			if (el) el.textContent = String(value);
		};
		setText("adminApplicationsNewCount", list.filter(isNewAdminApplication).length);
		setText("adminApplicationsActiveCount", list.filter((row) => getAdminApplicationStatus(row) === "active").length);
		setText("adminApplicationsPendingCount", list.filter((row) => getAdminApplicationStatus(row) === "pending").length);
		setText("adminApplicationsRejectedCount", list.filter((row) => getAdminApplicationStatus(row) === "rejected").length);
		setText("adminApplicationsDeletedCount", list.filter((row) => getAdminApplicationStatus(row) === "deleted").length);
		document.querySelectorAll("[data-admin-application-view]").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.adminApplicationView === adminApplicationView);
		});
	}

		function renderAdminApplications(rows)
		{
			const listEl = document.getElementById("adminApplicationsList");
			if (!listEl) return;
		const list = Array.isArray(rows) ? rows : [];
		updateAdminApplicationFilterCounts(list);
		const filteredRows = getAdminApplicationFilteredRows(list);
		if (!list.length) {
			listEl.innerHTML = '<div class="admin-empty">표시할 신청이 없습니다. 신청 데이터가 있는데도 비어 있으면 Supabase agencies 조회 정책(RLS)을 확인하세요.</div>';
			return;
		}
		if (!filteredRows.length) {
			listEl.innerHTML = '<div class="admin-empty">해당 상태의 신청이 없습니다.</div>';
			return;
		}

		listEl.innerHTML = filteredRows.map(row => {
			const status = getAdminApplicationStatus(row) || "new";
			const created = row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-";
			return `
				<div class="admin-application-card" data-agency-id="${escapeAdminHtml(row.id)}">
					<div>
						<div class="admin-application-office">${escapeAdminHtml(row.office_name || "-")}</div>
						<div class="admin-application-meta">대표자 : ${escapeAdminHtml(row.owner_name || "-")} · 등록번호 : ${escapeAdminHtml(row.office_reg_no || "-")}</div>
					</div>
					<div class="admin-application-meta admin-application-contact">
						<div class="admin-application-contact-row"><span class="admin-application-contact-label">주소 :</span><span class="admin-application-contact-value">${escapeAdminHtml(row.office_address || "-")}</span></div>
						<div class="admin-application-contact-row"><span class="admin-application-contact-label">연락처 :</span><span class="admin-application-contact-value">${escapeAdminHtml(formatDisplayPhone(row.phone) || "-")}</span></div>
						<div class="admin-application-contact-row"><span class="admin-application-contact-label">이메일 :</span><span class="admin-application-contact-value">${escapeAdminHtml(row.email || "-")}</span></div>
					</div>
					<div class="admin-application-status-block">
						<span class="admin-status-badge ${escapeAdminHtml(status)}">${escapeAdminHtml(getAgencyStatusLabel(status))}</span>
						<div class="admin-application-meta" style="margin-top:6px;">${escapeAdminHtml(created)}</div>
					</div>
					<div class="admin-application-actions">
						<button type="button" class="admin-status-btn approve" data-admin-status="active" data-agency-id="${escapeAdminHtml(row.id)}">승인</button>
						<button type="button" class="admin-status-btn pending" data-admin-status="pending" data-agency-id="${escapeAdminHtml(row.id)}">대기</button>
						<button type="button" class="admin-status-btn reject" data-admin-status="rejected" data-agency-id="${escapeAdminHtml(row.id)}">거부</button>
						<button type="button" class="admin-status-btn delete" data-admin-status="deleted" data-agency-id="${escapeAdminHtml(row.id)}">삭제</button>
					</div>
				</div>
			`;
			}).join("");
		}

		async function fetchAdminApplicationsDirect(client)
		{
			if (!client) return [];
			const { data, error } = await client
				.from("agencies")
				.select("id,user_id,office_name,owner_name,office_reg_no,office_address,phone,email,status,created_at,updated_at,deleted_at")
				.order("created_at", { ascending: false })
				.order("updated_at", { ascending: false });
			if (error) {
				console.warn("관리자 신청 목록 직접 조회 실패:", error);
				return [];
			}
			return Array.isArray(data) ? data : [];
		}

		async function loadAdminApplications()
		{
			const listEl = document.getElementById("adminApplicationsList");
			if (!listEl) return;
		const user = currentRealjejuAuthUser;
		if (!isAdminUser(user)) {
			listEl.innerHTML = '<div class="admin-empty">관리자 계정으로 로그인하세요.</div>';
			return;
		}

		const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}

		listEl.innerHTML = '<div class="admin-empty">신청 목록을 불러오는 중입니다.</div>';

			try {
				await purgeAdminExpiredTrashIfNeeded(client);
				const { data, error } = await client.rpc("get_admin_agencies");

				if (error) {
					console.error("관리자 신청 목록 조회 실패:", error);
					const directRows = await fetchAdminApplicationsDirect(client);
					if (!directRows.length) {
						listEl.innerHTML = `<div class="admin-empty">신청 목록을 불러오지 못했습니다${escapeAdminHtml(formatAdminRpcError(error))}. ${escapeAdminHtml(getAdminRpcSchemaHelp())}</div>`;
						return;
					}
					adminApplicationRowsCache = directRows;
					renderAdminApplications(adminApplicationRowsCache);
					return;
				}

				adminApplicationRowsCache = Array.isArray(data) ? data : [];
				if (!adminApplicationRowsCache.length) {
					const directRows = await fetchAdminApplicationsDirect(client);
					if (directRows.length) adminApplicationRowsCache = directRows;
				}
				renderAdminApplications(adminApplicationRowsCache);
			} catch (err) {
				console.error("관리자 신청 목록 오류:", err);
			listEl.innerHTML = '<div class="admin-empty">신청 목록 처리 중 오류가 발생했습니다.</div>';
		}
	}

	// PATCH 2.316: 중개사 홈은 현재 로그인 사용자의 등록 매물만 불러온다
	async function loadBrokerListings(currentListingId)
	{
		const listEl = document.getElementById("brokerListingsList");
		if (!listEl) return;
		populateBrokerHomeFilterMenus();
		syncBrokerHomeFilterUi();
		const user = currentRealjejuAuthUser;
		if (!user || !user.id) {
			updateBrokerHomeSummary([]);
			listEl.innerHTML = '<div class="admin-empty">로그인 후 매물을 확인할 수 있습니다.</div>';
			return;
		}

		const client = getRealjejuSupabaseClient();
		if (!client) {
			updateBrokerHomeSummary([]);
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}
		const access = await fetchApprovedBrokerAccess();
		if (!access.allowed) {
			updateBrokerHomeSummary([]);
			listEl.innerHTML = '<div class="admin-empty">승인 완료된 중개사무소만 중개사 홈을 사용할 수 있습니다.</div>';
			document.body.classList.remove("broker-home-page-open");
			const brokerHomePanel = document.getElementById("brokerHomePanel");
			if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "true");
			return;
		}

		listEl.innerHTML = '<div class="admin-empty">등록 매물을 불러오는 중입니다.</div>';
		listEl.classList.remove("broker-listing-list");

		try {
			const { data, error } = await client
				.from("property_listings")
				.select("id, user_id, agency_id, listing_no, status, property_type, property_type_label, deal_types, title, public_address, created_at, updated_at, photos, payload")
				.eq("user_id", user.id)
				.order("updated_at", { ascending: false });

			if (error) {
				console.error("중개사 매물 목록 조회 실패:", error);
				updateBrokerHomeSummary([]);
				listEl.innerHTML = '<div class="admin-empty">등록 매물을 불러오지 못했습니다.</div>';
				return;
			}

			const rows = Array.isArray(data) ? data : [];
			if (await purgeExpiredDeletedBrokerListings(rows, client, user.id)) {
				await loadBrokerListings(currentListingId);
				return;
			}
			updateBrokerHomeSummary(rows);
			const filteredRows = filterBrokerListingRows(rows);
			if (!rows.length) {
				listEl.classList.remove("broker-listing-list");
				listEl.innerHTML = '<div class="admin-empty">아직 등록한 매물이 없습니다.</div>';
				return;
			}
			if (!filteredRows.length) {
				listEl.classList.remove("broker-listing-list");
				listEl.innerHTML = '<div class="admin-empty">조건에 맞는 매물이 없습니다.</div>';
				return;
			}

			const totalPages = Math.max(1, Math.ceil(filteredRows.length / BROKER_LISTINGS_PER_PAGE));
			const currentPage = getBrokerListingPage(totalPages);
			const startIndex = (currentPage - 1) * BROKER_LISTINGS_PER_PAGE;
			const pageRows = filteredRows.slice(startIndex, startIndex + BROKER_LISTINGS_PER_PAGE);

			listEl.classList.add("broker-listing-list");
			window.realjejuBrokerListingRowsById = new Map(rows.map((row) => [String(row.id || ""), row]));
			// PATCH 2.338: 체크박스를 제거하고 각 행 오른쪽에 관리 메뉴를 추가
			listEl.innerHTML = `
				<div class="broker-listing-head" aria-hidden="true">
					<div>사진</div>
					<div>매물유형</div>
					<div>상태</div>
						<div>등록날짜</div>
						<div>매물번호</div>
						<div>제목</div>
						<div><button type="button" class="broker-listing-area-toggle" data-broker-listing-area-toggle>면적 <i class="fa-solid fa-right-left broker-listing-area-toggle-icon" aria-hidden="true"></i></button></div>
						<div>가격</div>
						<div></div>
						<div></div>
					<div>관리</div>
				</div>
			` + pageRows.map((row) => {
					const created = getBrokerListingDisplayDate(row);
					const listingNo = getBrokerListingNo(row);
					const areaText = getBrokerListingAreaValue(row);
					const priceInfo = getBrokerListingDealPrice(row);
				const priceHtml = priceInfo.dealLabel || priceInfo.priceLabel
					? `${priceInfo.dealLabel ? `<span class="broker-listing-price-deal">${escapeAdminHtml(priceInfo.dealLabel)}</span>` : ""}${priceInfo.priceLabel ? `<span class="broker-listing-price-amount">${escapeAdminHtml(priceInfo.priceLabel)}</span>` : ""}`
					: "-";
				const rowId = escapeAdminHtml(row.id);
				const effectiveStatus = getBrokerListingEffectiveStatus(row);
				const isClosed = effectiveStatus === "closed";
				const isHidden = effectiveStatus === "hidden" || effectiveStatus === "archive";
				const isDeleted = effectiveStatus === "deleted";
				const closedAction = (isClosed || isHidden) ? "published" : "closed";
				// PATCH 2.341: 상태별 관리 메뉴 문구를 현재 화면 맥락에 맞춰 명확하게 표시
				const closedLabel = (isClosed || isHidden) ? "거래중으로 변경" : "거래완료";
				const hiddenAction = isHidden ? "published" : "hidden";
				const hiddenLabel = isHidden ? "숨김해제" : "숨김";
				const restoreOrClosedAction = isDeleted ? "published" : closedAction;
				const restoreOrClosedLabel = isDeleted ? "복원" : closedLabel;
				const deleteAction = isDeleted ? "permanent_delete" : "delete";
				const deleteLabel = isDeleted ? "영구삭제" : "삭제";
				return `
					<div class="broker-listing-row" data-listing-id="${rowId}">
						<div class="broker-listing-cell broker-listing-photo-cell"><div class="broker-listing-thumb">${getBrokerListingThumbHtml(row)}</div></div>
						<div class="broker-listing-cell broker-listing-type">${escapeAdminHtml(row.property_type_label || "-")}</div>
						<div class="broker-listing-cell"><span class="broker-listing-status ${escapeAdminHtml(effectiveStatus || "draft")}">${escapeAdminHtml(getBrokerListingStatusLabel(effectiveStatus))}</span></div>
						<div class="broker-listing-cell broker-listing-meta">${escapeAdminHtml(created)}</div>
						<div class="broker-listing-cell broker-listing-no">${escapeAdminHtml(listingNo)}</div>
							<div class="broker-listing-title-cell">
								<div class="broker-listing-title">${escapeAdminHtml(row.title || "제목 없음")}</div>
								<div class="broker-listing-address">${escapeAdminHtml(row.public_address || "-")}</div>
							</div>
							<div class="broker-listing-cell broker-listing-area">${escapeAdminHtml(areaText)}</div>
							<div class="broker-listing-cell broker-listing-price">${priceHtml}</div>
						<div class="broker-listing-cell"><button type="button" class="broker-listing-edit-btn" data-broker-listing-edit="${rowId}">수정</button></div>
						<div class="broker-listing-cell"><button type="button" class="broker-listing-blog-copy-btn" data-broker-listing-blog-copy="${rowId}">블로그복사</button></div>
						<div class="broker-listing-menu-cell">
							<button type="button" class="broker-listing-menu-btn" data-broker-listing-menu="${rowId}" aria-label="매물 관리 메뉴">⋮</button>
							<div class="broker-listing-more-menu" data-broker-listing-menu-panel="${rowId}">
								<button type="button" class="broker-listing-menu-item" data-broker-listing-action="refresh" data-listing-id="${rowId}">현재날짜로 갱신</button>
								<button type="button" class="broker-listing-menu-item" data-broker-listing-action="${restoreOrClosedAction}" data-listing-id="${rowId}">${restoreOrClosedLabel}</button>
								${isDeleted ? "" : `<button type="button" class="broker-listing-menu-item" data-broker-listing-action="${hiddenAction}" data-listing-id="${rowId}">${hiddenLabel}</button>`}
								<button type="button" class="broker-listing-menu-item danger" data-broker-listing-action="${deleteAction}" data-listing-id="${rowId}">${deleteLabel}</button>
							</div>
						</div>
					</div>
				`;
			}).join("") + renderBrokerListingPagination(filteredRows.length, totalPages, currentPage);
		} catch (err) {
			console.error("중개사 매물 목록 오류:", err);
			listEl.innerHTML = '<div class="admin-empty">등록 매물 처리 중 오류가 발생했습니다.</div>';
		}
	}

	// PATCH 2.337: 중개사 홈 상단 사용건수와 상태별 수량을 목록 데이터 기준으로 갱신
	function updateBrokerHomeSummary(rows)
	{
		const list = Array.isArray(rows) ? rows : [];
		const tradingCount = list.filter((row) => !["closed", "hidden", "draft", "archive", "deleted"].includes(getBrokerListingEffectiveStatus(row))).length;
		const hiddenCount = list.filter((row) => ["hidden", "archive"].includes(getBrokerListingEffectiveStatus(row))).length;
		const usageCount = Math.min(tradingCount, 100);
		const premiumCount = 0;
		// PATCH 2.353: 오늘 현재날짜 갱신 사용건수를 매물 payload에서 합산한다
		const todayKey = getBrokerRelistUsageDateKey();
		const relistCount = list.reduce((total, row) => total + getBrokerListingRelistUsageCount(row, todayKey), 0);
		const setText = (id, text) => {
			const el = document.getElementById(id);
			if (el) el.textContent = text;
		};
		const setWidth = (id, value, max) => {
			const el = document.getElementById(id);
			if (el) el.style.width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
		};
			const closedCount = list.filter((row) => getBrokerListingEffectiveStatus(row) === "closed").length;
			const deletedCount = list.filter((row) => getBrokerListingEffectiveStatus(row) === "deleted").length;
			const relistLimit = getBrokerRelistDailyLimit();
			setText("brokerTradingCount", tradingCount);
			setText("brokerClosedCount", closedCount);
			setText("brokerHiddenCount", hiddenCount);
			setText("brokerDeletedCount", deletedCount);
			setText("brokerUsageCount", usageCount);
			setText("brokerPremiumUsageCount", premiumCount);
			setText("brokerRelistUsageCount", relistCount);
			setText("brokerRelistUsageLimit", relistLimit);
			setWidth("brokerUsageFill", usageCount, 100);
			setWidth("brokerPremiumUsageFill", premiumCount, 50);
			setWidth("brokerRelistUsageFill", relistCount, relistLimit);
		}

	function showBrokerHomeDefaultAd()
	{
		const ad = document.getElementById("brokerHomeAd");
		if (!ad) return;
		ad.dataset.adMode = "default";
		const title = document.getElementById("brokerHomeAdTitle");
		const cardTitle = document.getElementById("brokerHomeAdCardTitle");
		const cardMeta = document.getElementById("brokerHomeAdCardMeta");
		const cta = document.getElementById("brokerHomeAdCta");
		if (title) title.innerHTML = "지금 매물 올리고,<br>단지 전문 중개소로 무료 등록하세요";
		if (cardTitle) cardTitle.textContent = "중개사무소 가입신청";
		if (cardMeta) cardMeta.textContent = "리얼제주 기본 광고";
		if (cta) cta.textContent = "무료로 단지 중개소 등록하기";
	}

	// PATCH 2.321: 중개사 홈의 수정 버튼은 기존 매물을 같은 등록 폼으로 불러와 수정 모드로 연다
	async function openBrokerListingEdit(listingId)
	{
		const id = String(listingId || "").trim();
		if (!id) return;
		const user = currentRealjejuAuthUser;
		const client = getRealjejuSupabaseClient();
		if (!user || !user.id || !client) {
			openAuthErrorModal("로그인과 Supabase 연결 상태를 확인하세요.", "매물 수정", null);
			return;
		}

		try {
			const { data, error } = await client
				.from("property_listings")
				.select("*")
				.eq("id", id)
				.eq("user_id", user.id)
				.maybeSingle();
			if (error || !data) {
				console.error("매물 수정 데이터 조회 실패:", error);
				openAuthErrorModal("매물 정보를 불러오지 못했습니다.", "매물 수정", null);
				return;
			}

			closeBrokerHomePage();
			closeAdminPage();
			document.body.classList.add("property-register-page-open");
			const page = document.getElementById("propertyRegisterPage");
			if (page) page.setAttribute("aria-hidden", "false");
			fillBrokerListingEditForm(data);
			if (typeof scrollPropertyRegisterToTop === "function") scrollPropertyRegisterToTop();
		}
		catch (err) {
			console.error("매물 수정 열기 오류:", err);
			openAuthErrorModal("매물 수정 화면을 열지 못했습니다.", "매물 수정", null);
		}
	}

	// PATCH 2.316: 기존 상단 [중개사 홈] 메뉴와 저장 완료 후 이동을 같은 화면으로 연결
	async function openBrokerHomePage(currentListingId)
	{
		closeGlobalAccountDropdown();
		if (typeof closePaymentPage === "function") closePaymentPage();
		if (typeof closeMyInfoPage === "function") closeMyInfoPage();
		closePropertyRegisterPage();
		if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		closeAdminPage();
		const access = await fetchApprovedBrokerAccess();
		if (!access.allowed) {
			document.body.classList.remove("broker-home-page-open");
			const brokerHomePanel = document.getElementById("brokerHomePanel");
			if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "true");
			openAuthErrorModal("중개사무소 승인 상태를 확인할 수 없습니다.\n승인 완료된 중개사무소만 중개사 홈을 사용할 수 있습니다.", "중개사 홈", null);
			return;
		}
		document.body.classList.add("broker-home-page-open");
		const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "false");
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.toggle("active", String(btn.textContent || "").trim() === "중개사 홈");
		});
		await loadBrokerListings(currentListingId || window.REALJEJU_LAST_SAVED_LISTING_ID || "");
	}

		async function updateAdminApplicationStatus(agencyId, status)
		{
			if (!agencyId || !status) return;
			const actionButtons = document.querySelectorAll(`[data-agency-id="${CSS.escape(agencyId)}"]`);
			const restoreButtons = () => actionButtons.forEach(btn => { btn.disabled = false; });
			actionButtons.forEach(btn => { btn.disabled = true; });
			if (!isAdminUser(currentRealjejuAuthUser)) {
				openAuthErrorModal("관리자 계정에서만 이용 가능합니다.", "관리자 페이지", null);
				restoreButtons();
				return;
			}

			const client = getRealjejuSupabaseClient();
			if (!client) {
				openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "관리자 페이지", null);
				restoreButtons();
				return;
			}

			let shouldRestoreButtons = true;
			try {
				const { error } = await client.rpc("admin_update_agency_status", {
					p_agency_id: agencyId,
					p_status: status
				});
				if (error) {
					console.error("중개사무소 상태 변경 실패:", error);
					openAuthErrorModal(`상태 변경에 실패했습니다${formatAdminRpcError(error)}. ${getAdminListingToolsSchemaHelp()}`, "관리자 페이지", null);
					restoreButtons();
					return;
				}

				shouldRestoreButtons = false;
				adminApplicationRowsCache = null;
				await loadAdminApplications();
			} catch (err) {
				console.error("중개사무소 상태 변경 오류:", err);
				openAuthErrorModal("상태 변경 중 오류가 발생했습니다.", "관리자 페이지", null);
			} finally {
				if (shouldRestoreButtons) restoreButtons();
			}
		}

	document.addEventListener("click", function(e) {
		const topbarBtn = e.target.closest(".topbar-menu-item");
		if (!topbarBtn) return;
		if (typeof closePaymentPage === "function") closePaymentPage();
		if (typeof closeMyInfoPage === "function") closeMyInfoPage();
		if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		document.querySelectorAll(".topbar-menu-item").forEach((btn) => {
			btn.classList.remove("active");
		});
		topbarBtn.classList.add("active");
	}, true);

	// PATCH 2.342: 중개사 홈 필터 체크박스는 메뉴를 닫지 않고 다중 선택되게 처리
	document.addEventListener("change", function(e) {
		const brokerHomeFilterCheck = e.target.closest(".broker-home-filter-check[data-broker-home-filter-option]");
		if (!brokerHomeFilterCheck) return;
		const filters = getBrokerHomeFilters();
		const type = brokerHomeFilterCheck.dataset.brokerHomeFilterOption;
		const value = brokerHomeFilterCheck.dataset.value || "";
		if (!(filters[type] instanceof Set)) filters[type] = new Set();
		if (brokerHomeFilterCheck.checked) {
			filters[type].add(value);
		}
		else {
			filters[type].delete(value);
		}
		setBrokerListingPage(1);
		loadBrokerListings();
	});

	document.addEventListener("click", function(e) {
		const adminTabBtn = e.target.closest(".admin-page-tab[data-admin-tab]");
		if (adminTabBtn) {
			e.preventDefault();
			e.stopPropagation();
			const tab = adminTabBtn.dataset.adminTab || "notices";
			switchAdminTab(tab);
			loadAdminTabData(tab);
			return;
		}

		const adminListingViewBtn = e.target.closest("[data-admin-listing-view]");
		if (adminListingViewBtn) {
			e.preventDefault();
			e.stopPropagation();
			adminListingView = adminListingViewBtn.dataset.adminListingView || "all";
			setAdminListingPage(1);
			if (Array.isArray(adminListingRowsCache)) renderAdminListings(adminListingRowsCache);
			else loadAdminListings();
			return;
		}

		const adminListingPageBtn = e.target.closest("[data-admin-listing-page]");
		if (adminListingPageBtn) {
			e.preventDefault();
			e.stopPropagation();
			setAdminListingPage(adminListingPageBtn.dataset.adminListingPage);
			document.querySelectorAll("[data-admin-listing-menu-panel].open").forEach((menu) => menu.classList.remove("open"));
			if (Array.isArray(adminListingRowsCache)) {
				renderAdminListings(adminListingRowsCache);
				scrollAdminListingsToTop();
			}
			else {
				loadAdminListings().then(() => {
					scrollAdminListingsToTop();
				});
			}
			return;
		}

		const adminApplicationViewBtn = e.target.closest("[data-admin-application-view]");
		if (adminApplicationViewBtn) {
			e.preventDefault();
			e.stopPropagation();
			adminApplicationView = adminApplicationViewBtn.dataset.adminApplicationView || "new";
			if (Array.isArray(adminApplicationRowsCache)) renderAdminApplications(adminApplicationRowsCache);
			else loadAdminApplications();
			return;
		}

		const adminUserViewBtn = e.target.closest("[data-admin-user-view]");
		if (adminUserViewBtn) {
			e.preventDefault();
			e.stopPropagation();
			adminUserView = adminUserViewBtn.dataset.adminUserView || "all";
			if (Array.isArray(adminUserRowsCache)) renderAdminUsers(adminUserRowsCache);
			else loadAdminUsers();
			return;
		}

		const adminInquiryViewBtn = e.target.closest("[data-admin-inquiry-view]");
		if (adminInquiryViewBtn) {
			e.preventDefault();
			e.stopPropagation();
			adminInquiryView = adminInquiryViewBtn.dataset.adminInquiryView || "pending";
			if (Array.isArray(adminInquiryRowsCache)) renderAdminInquiryList(adminInquiryRowsCache);
			else loadAdminInquiries();
			return;
		}

		const adminInquiryToggle = e.target.closest("[data-admin-inquiry-toggle]");
		if (adminInquiryToggle) {
			e.preventDefault();
			e.stopPropagation();
			const item = adminInquiryToggle.closest(".admin-inquiry-item");
			if (item) item.classList.toggle("open");
			return;
		}

		const adminInquiryDeleteBtn = e.target.closest("[data-admin-inquiry-delete]");
		if (adminInquiryDeleteBtn) {
			e.preventDefault();
			e.stopPropagation();
			confirmAdminInquiryDelete(adminInquiryDeleteBtn.dataset.adminInquiryDelete, adminInquiryDeleteBtn);
			return;
		}

		const adminListingMenuBtn = e.target.closest("[data-admin-listing-menu]");
		if (adminListingMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const listingId = adminListingMenuBtn.dataset.adminListingMenu;
			document.querySelectorAll("[data-admin-listing-menu-panel].open").forEach((menu) => {
				if (menu.dataset.adminListingMenuPanel !== listingId) menu.classList.remove("open");
			});
			const menu = document.querySelector(`[data-admin-listing-menu-panel="${CSS.escape(listingId)}"]`);
			if (menu) menu.classList.toggle("open");
			return;
		}

		const adminUserMenuBtn = e.target.closest("[data-admin-user-menu]");
		if (adminUserMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const userId = adminUserMenuBtn.dataset.adminUserMenu;
			document.querySelectorAll("[data-admin-user-menu-panel].open").forEach((menu) => {
				if (menu.dataset.adminUserMenuPanel !== userId) menu.classList.remove("open");
			});
			const menu = document.querySelector(`[data-admin-user-menu-panel="${CSS.escape(userId)}"]`);
			if (menu) menu.classList.toggle("open");
			return;
		}

		const adminListingActionBtn = e.target.closest("[data-admin-listing-action][data-listing-id]");
		if (adminListingActionBtn) {
			e.preventDefault();
			e.stopPropagation();
			document.querySelectorAll("[data-admin-listing-menu-panel].open").forEach((menu) => menu.classList.remove("open"));
			const action = adminListingActionBtn.dataset.adminListingAction || "";
			const listingId = adminListingActionBtn.dataset.listingId || "";
			if (action === "delete") {
				openAuthConfirmModal(
					"선택한 매물을 삭제하시겠습니까?\n삭제된 매물은 휴지통으로 이동합니다.",
					"매물 삭제",
					() => updateAdminListingRowAction(listingId, action)
				);
				return;
			}
			if (action === "permanent_delete") {
				openAuthConfirmModal(
					"휴지통 매물을 영구삭제하시겠습니까?\n삭제하면 복원할 수 없습니다.",
					"영구삭제",
					() => updateAdminListingRowAction(listingId, action)
				);
				return;
			}
			updateAdminListingRowAction(listingId, action);
			return;
		}

		const adminListingRow = e.target.closest(".admin-listing-row[data-admin-listing-id]");
		if (adminListingRow && !e.target.closest("button, .broker-listing-more-menu")) {
			e.preventDefault();
			e.stopPropagation();
			const listingId = normalizeItemId(adminListingRow.dataset.adminListingId);
			const row = Array.isArray(adminListingRowsCache)
				? adminListingRowsCache.find((item) => normalizeItemId(item && item.id) === listingId)
				: null;
			openManagedListingDetailPanel(listingId, row || { id: listingId }).catch((error) => {
				console.warn("관리자 매물 상세 열기 실패:", error);
			});
			return;
		}

			const adminUserActionBtn = e.target.closest("[data-admin-user-action][data-user-id]");
			if (adminUserActionBtn) {
				e.preventDefault();
				e.stopPropagation();
				document.querySelectorAll("[data-admin-user-menu-panel].open").forEach((menu) => menu.classList.remove("open"));
				const action = adminUserActionBtn.dataset.adminUserAction || "";
				if (action === "view") {
					openAdminUserDetail(adminUserActionBtn.dataset.userId, adminUserActionBtn);
				} else if (action === "force_withdraw") {
					confirmAdminUserForceWithdraw(adminUserActionBtn.dataset.userId, adminUserActionBtn);
				} else if (action === "restore") {
					confirmAdminUserRestore(adminUserActionBtn.dataset.userId, adminUserActionBtn);
				} else if (action === "permanent_delete") {
					confirmAdminUserPermanentDelete(adminUserActionBtn.dataset.userId, adminUserActionBtn);
				}
				return;
			}

		const statusBtn = e.target.closest("[data-admin-status][data-agency-id]");
		if (statusBtn) {
			e.preventDefault();
			e.stopPropagation();
			const nextStatus = statusBtn.dataset.adminStatus || "";
			const agencyId = statusBtn.dataset.agencyId || "";
			if (nextStatus === "deleted") {
				openAuthConfirmModal(
					"중개사무소 신청 정보를 삭제하시겠습니까?\n삭제하면 해당 중개사는 승인 상태가 초기화되고 다시 신청해야 합니다.",
					"중개사무소 삭제",
					() => updateAdminApplicationStatus(agencyId, nextStatus)
				);
				return;
			}
			updateAdminApplicationStatus(agencyId, nextStatus);
			return;
		}

		const refreshBtn = e.target.closest("#adminApplicationsRefreshBtn");
		if (refreshBtn) {
			e.preventDefault();
			e.stopPropagation();
			loadAdminApplications();
			loadAdminNotices();
			loadAdminInquiries();
			return;
		}

		const noticeCancelBtn = e.target.closest("#adminNoticeCancelBtn");
		if (noticeCancelBtn) {
			e.preventDefault();
			e.stopPropagation();
			resetAdminNoticeForm();
			return;
		}

		const noticeEditBtn = e.target.closest("[data-admin-notice-edit]");
		if (noticeEditBtn) {
			e.preventDefault();
			e.stopPropagation();
			const row = window.realjejuAdminNoticeRowsById?.get(String(noticeEditBtn.dataset.adminNoticeEdit || ""));
			if (row) fillAdminNoticeForm(row);
			return;
		}

		const noticeToggleBtn = e.target.closest("[data-admin-notice-toggle]");
		if (noticeToggleBtn) {
			e.preventDefault();
			e.stopPropagation();
			toggleAdminNoticeVisibility(noticeToggleBtn.dataset.adminNoticeToggle);
			return;
		}

		const noticeDeleteBtn = e.target.closest("[data-admin-notice-delete]");
		if (noticeDeleteBtn) {
			e.preventDefault();
			e.stopPropagation();
			const id = noticeDeleteBtn.dataset.adminNoticeDelete;
			openAuthConfirmModal("공지사항을 삭제할까요? 삭제된 공지는 사용자에게 노출되지 않습니다.", "공지사항 삭제", () => {
				deleteAdminNotice(id);
			}, noticeDeleteBtn);
			return;
		}

		const brokerListingEditBtn = e.target.closest("[data-broker-listing-edit]");
		if (brokerListingEditBtn) {
			e.preventDefault();
			e.stopPropagation();
			openBrokerListingEdit(brokerListingEditBtn.dataset.brokerListingEdit);
			return;
		}

			const brokerListingBlogCopyBtn = e.target.closest("[data-broker-listing-blog-copy]");
			if (brokerListingBlogCopyBtn) {
				e.preventDefault();
				e.stopPropagation();
				copyBrokerListingBlogText(brokerListingBlogCopyBtn.dataset.brokerListingBlogCopy);
				return;
			}

			const brokerBulkRefreshBtn = e.target.closest("#brokerBulkRefreshBtn");
			if (brokerBulkRefreshBtn) {
				e.preventDefault();
				e.stopPropagation();
				closeBrokerHomeFilterMenus();
				closeBrokerListingMenus();
				openAuthConfirmModal(
					"전체갱신 하시겠습니까?\n하루 재등록 사용건수를 사용합니다.",
					"전체갱신",
					() => {
						refreshAllBrokerListingsByDailyLimit();
					}
				);
				return;
			}

			// PATCH 2.342: 중개사 홈 상단 상태/매물유형/거래유형 필터를 목록에 적용
			const brokerStatusFilterBtn = e.target.closest("[data-broker-home-status-filter]");
		if (brokerStatusFilterBtn) {
			e.preventDefault();
			e.stopPropagation();
			const filters = getBrokerHomeFilters();
			filters.status = brokerStatusFilterBtn.dataset.brokerHomeStatusFilter || "trading";
			closeBrokerHomeFilterMenus();
			setBrokerListingPage(1);
			loadBrokerListings();
			return;
		}

		const brokerHomeFilterMenuBtn = e.target.closest("[data-broker-home-filter-menu]");
		if (brokerHomeFilterMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const type = brokerHomeFilterMenuBtn.dataset.brokerHomeFilterMenu;
			const menuId = type === "deal" ? "brokerDealTypeFilterMenu" : "brokerPropertyTypeFilterMenu";
			const menu = document.getElementById(menuId);
			const willOpen = menu && !menu.classList.contains("open");
			closeBrokerHomeFilterMenus(type);
			if (menu) menu.classList.toggle("open", !!willOpen);
			return;
		}

			const brokerHomeFilterResetBtn = e.target.closest("[data-broker-home-filter-reset]");
			if (brokerHomeFilterResetBtn) {
				e.preventDefault();
			e.stopPropagation();
			const filters = getBrokerHomeFilters();
			const type = brokerHomeFilterResetBtn.dataset.brokerHomeFilterReset;
			if (filters[type] instanceof Set) filters[type].clear();
			setBrokerListingPage(1);
				loadBrokerListings();
				return;
			}

			const brokerPageBtn = e.target.closest("[data-broker-listing-page]");
			if (brokerPageBtn) {
				e.preventDefault();
				e.stopPropagation();
				setBrokerListingPage(brokerPageBtn.dataset.brokerListingPage);
				closeBrokerListingMenus();
				closeBrokerHomeFilterMenus();
				loadBrokerListings();
				return;
			}

			const brokerListingAreaToggle = e.target.closest("[data-broker-listing-area-toggle]");
			if (brokerListingAreaToggle) {
				e.preventDefault();
				e.stopPropagation();
				if (document.body.classList.contains("admin-page-open")) {
					window.realjejuBrokerListingAreaUnit = getBrokerListingAreaUnit() === "m2" ? "py" : "m2";
					if (Array.isArray(adminListingRowsCache)) syncAdminListingAreaCells();
					return;
				}
					if (document.body.classList.contains("my-suite-page-open")) {
						setGlobalAreaUnit(globalAreaUnit === "m2" ? "py" : "m2");
						renderRealjejuMySuiteFavoritesContent();
						return;
					}
				window.realjejuBrokerListingAreaUnit = getBrokerListingAreaUnit() === "m2" ? "py" : "m2";
				syncBrokerListingAreaCells();
				return;
			}

			const brokerHomeFilterMenuArea = e.target.closest(".broker-home-filter-menu");
		if (brokerHomeFilterMenuArea) {
			e.stopPropagation();
			return;
		}

		// PATCH 2.338: 체크박스 일괄 처리 대신 행별 관리 메뉴를 토글한다
		const brokerMenuBtn = e.target.closest("[data-broker-listing-menu]");
		if (brokerMenuBtn) {
			e.preventDefault();
			e.stopPropagation();
			const listingId = brokerMenuBtn.dataset.brokerListingMenu;
			const menu = document.querySelector(`[data-broker-listing-menu-panel="${CSS.escape(listingId)}"]`);
			const willOpen = menu && !menu.classList.contains("open");
			closeBrokerListingMenus();
			if (menu && willOpen) openBrokerListingMenuAtButton(menu, brokerMenuBtn);
			return;
		}

		const brokerActionBtn = e.target.closest("[data-broker-listing-action][data-listing-id]");
		if (brokerActionBtn) {
			e.preventDefault();
			e.stopPropagation();
			const action = brokerActionBtn.dataset.brokerListingAction;
			const listingId = brokerActionBtn.dataset.listingId;
			closeBrokerListingMenus();
			if (action === "delete") {
				confirmBrokerListingDelete(listingId);
				return;
			}
			if (action === "permanent_delete") {
				confirmBrokerListingPermanentDelete(listingId);
				return;
			}
			updateBrokerListingRowAction(listingId, action);
			return;
		}

			const brokerListingRow = e.target.closest("#brokerListingsList .broker-listing-row[data-listing-id]");
			if (brokerListingRow && !e.target.closest("button, .broker-listing-more-menu")) {
				e.preventDefault();
				e.stopPropagation();
				const listingId = normalizeItemId(brokerListingRow.dataset.listingId);
				const row = window.realjejuBrokerListingRowsById?.get(String(listingId)) || { id: listingId };
				openManagedListingDetailPanel(listingId, row).catch((error) => {
					console.warn("중개사 홈 매물 상세 열기 실패:", error);
				});
				return;
			}

		const brokerAdCloseBtn = e.target.closest("#brokerHomeAdCloseBtn");
		if (brokerAdCloseBtn) {
			e.preventDefault();
			e.stopPropagation();
			showBrokerHomeDefaultAd();
			return;
		}

		const brokerHomeMenuBtn = e.target.closest(".topbar-menu-item");
		if (brokerHomeMenuBtn && brokerHomeMenuBtn.textContent.trim() === "중개사 홈") {
			e.preventDefault();
			e.stopPropagation();
			openBrokerHomePage();
			return;
		}

		const favoriteTopbarMenuBtn = e.target.closest(".topbar-menu-item");
		if (favoriteTopbarMenuBtn && favoriteTopbarMenuBtn.textContent.trim() === "관심매물") {
			e.preventDefault();
			e.stopPropagation();
			openMySuitePage("favorites");
			return;
		}

		const adminMenuBtn = e.target.closest(".topbar-menu-item");
		if (adminMenuBtn && adminMenuBtn.textContent.trim() === "관리자 페이지") {
			e.preventDefault();
			e.stopPropagation();
			closeBrokerHomePage();
			closePropertyRegisterPage();
			openAdminPage();
			return;
		}

		const propertyRegisterMenuBtn = e.target.closest(".topbar-menu-item");
		if (propertyRegisterMenuBtn && propertyRegisterMenuBtn.textContent.trim() === "매물 등록") {
			e.preventDefault();
			e.stopPropagation();
			closeBrokerHomePage();
			openPropertyRegisterPage({ confirmExistingDraft: true });
			return;
		}

		const topbarMenuBtn = e.target.closest(".topbar-menu-item");
		if (topbarMenuBtn && topbarMenuBtn.textContent.trim() !== "관리자 페이지" && topbarMenuBtn.textContent.trim() !== "매물 등록") {
			closeBrokerHomePage();
			closeAdminPage();
			closePropertyRegisterPage();
		}

		closeBrokerListingMenus();
		closeBrokerHomeFilterMenus();
	});

	const adminNoticeForm = document.getElementById("adminNoticeForm");
	if (adminNoticeForm && adminNoticeForm.dataset.noticeBound !== "1") {
		adminNoticeForm.dataset.noticeBound = "1";
		adminNoticeForm.addEventListener("submit", function(e) {
			e.preventDefault();
			saveAdminNotice();
		});
	}

	window.openAuthModal = openAuthModal;
	window.closeAuthModal = function() {
		closeAuthModal();
		if (isAdminUser(currentRealjejuAuthUser)) {
			renderAdminTopbarMenu(isApprovedBrokerOffice(window.realjejuCurrentBrokerOffice));
		}
	};
	window.openAuthErrorModal = openAuthErrorModal;
	window.openAuthConfirmModal = openAuthConfirmModal;
	window.closeAuthErrorModal = closeAuthErrorModal;
	window.openAdminPage = openAdminPage;
	window.openBrokerHomePage = openBrokerHomePage;
	window.openBrokerOfficeFromAccountMenu = openBrokerOfficeFromAccountMenu;
	window.openPropertyRegisterPage = openPropertyRegisterPage;
	window.closePropertyRegisterPage = closePropertyRegisterPage;
	window.loadAdminApplications = loadAdminApplications;
	window.requireRealjejuProfileCompletedForFeature = requireRealjejuProfileCompletedForFeature;
	window.updateBrokerOfficeDropdownMenu = updateBrokerOfficeDropdownMenu;
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

/* PATCH: 내 정보 설정 저장 버튼 강제 연결 - submit 이벤트 미동작 대비 */
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
		if (title) title.textContent = "내 정보 설정";
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
		const phone = formatDisplayPhone(phoneInput && phoneInput.value || "");
		const role = roleSelect && roleSelect.value ? roleSelect.value : "user";
		if (!name) return showProfileError("이름을 입력하세요.", nameInput);
		if (!/^010\d{8}$/.test(phone)) return showProfileError("휴대폰번호를 정확히 입력하세요.", phoneInput);
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
			let result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
			if (result && result.error && /profile_image/i.test(String(result.error.message || ""))) {
				delete profilePayload.profile_image;
				result = await saveRealjejuOwnProfile(client, user.id, profilePayload);
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
			const topbarProfileImgAfterSave = document.querySelector("#detailAuthTrigger .topbar-profile-image");
			if (topbarProfileImgAfterSave) {
				const fallbackProfileImage = (typeof REALJEJU_DEFAULT_PROFILE_IMAGE !== "undefined")
					? REALJEJU_DEFAULT_PROFILE_IMAGE
					: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%239ca3af'/%3E%3Cpath d='M32 136c6-30 25-46 48-46s42 16 48 46' fill='%239ca3af'/%3E%3C/svg%3E";
				topbarProfileImgAfterSave.src = finalProfileImage || fallbackProfileImage;
			}
			if (typeof window.clearAuthProfilePhotoFile === "function") window.clearAuthProfilePhotoFile();
			if (typeof window.setAuthProfilePhotoPreview === "function") window.setAuthProfilePhotoPreview(finalProfileImage);
			if (typeof window.setMyInfoProfileImage === "function") window.setMyInfoProfileImage(finalProfileImage);
			const brokerRoles = ["broker", "agent", "agent_sub", "agent_staff", "corporation"];
			const showBrokerOfficeMenu = brokerRoles.includes(role);
			const brokerMenuWrapper = qs("brokerOfficeMenuWrapper");
			const brokerMenuItem = qs("brokerOfficeMenuItem");
			let latestBrokerOfficeStatus = null;
			let latestBrokerOfficeName = "";
			if (showBrokerOfficeMenu) {
				try {
					const agencyRows = await fetchMySuiteBrokerOfficeRows(client, user, { email: user.email || "" });
					const activeOffice = (Array.isArray(agencyRows) ? agencyRows : []).find((row) => row && getBrokerOfficeRowStatus(row) === "active");
					const latestOffice = activeOffice || (Array.isArray(agencyRows) ? agencyRows[0] : null);
					latestBrokerOfficeStatus = latestOffice ? getBrokerOfficeRowStatus(latestOffice) : null;
					latestBrokerOfficeName = latestOffice ? String(latestOffice.office_name || "").trim() : "";
				} catch (brokerStatusError) {
					console.warn("중개사무소 신청 상태 재확인 실패:", brokerStatusError);
				}
			}
			if (latestBrokerOfficeStatus === "active" && latestBrokerOfficeName) {
				if (typeof setTopbarAccountDisplayName === "function") setTopbarAccountDisplayName(latestBrokerOfficeName);
			}
			if (brokerMenuWrapper) {
				brokerMenuWrapper.style.setProperty("display", showBrokerOfficeMenu ? "block" : "none");
			}
			if (brokerMenuItem) {
				brokerMenuItem.disabled = false;
				brokerMenuItem.classList.remove("is-pending", "is-active", "is-rejected");
				if (!showBrokerOfficeMenu) {
					brokerMenuItem.textContent = "중개사무소 가입 신청";
				} else if (latestBrokerOfficeStatus === "new" || latestBrokerOfficeStatus === "pending") {
					brokerMenuItem.textContent = latestBrokerOfficeStatus === "new" ? "가입 신청 진행중" : "승인 대기중";
					brokerMenuItem.disabled = true;
					brokerMenuItem.classList.add("is-pending");
				} else if (latestBrokerOfficeStatus === "active") {
					brokerMenuItem.textContent = "중개사무소 정보";
					brokerMenuItem.classList.add("is-active");
				} else if (latestBrokerOfficeStatus === "rejected") {
					brokerMenuItem.textContent = "다시 신청하기";
					brokerMenuItem.classList.add("is-rejected");
				} else {
					brokerMenuItem.textContent = "중개사무소 가입 신청";
				}
			}
			if (typeof window.updateBrokerOfficeDropdownMenu === "function") {
				window.updateBrokerOfficeDropdownMenu(user, {
					role_request: role
				});
			}
			const authModal = qs("authModal");
			if (authModal) { authModal.classList.add("profile-page-mode"); authModal.classList.add("open"); authModal.setAttribute("aria-hidden", "false"); document.body.style.overflow = ""; }
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
		const showBrokerOfficeMenu = ["broker", "agent", "agent_sub", "agent_staff", "corporation"].includes(role);
		const brokerMenuWrapper = qs("brokerOfficeMenuWrapper");
		if (brokerMenuWrapper) {
			brokerMenuWrapper.style.setProperty("display", showBrokerOfficeMenu ? "block" : "none");
		}
	}, true);

	document.addEventListener("click", function (e) {
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


/* ===== PATCH: 매물 등록 커스텀 드롭다운 ===== */
(function initPropertyRegisterDropdowns()
{
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
		const options = dropdown.querySelectorAll(".property-register-dropdown-option");
		if (!select || !trigger || !label || !options.length) return;

		const placeholder = select.options[0] ? select.options[0].textContent.trim() : "선택";

		const syncLabel = () =>
		{
			if (select.id === "propertyTypeSelect") syncRealjejuPropertyTypeSelect(select);
			const selectedOption = select.options[select.selectedIndex];
			const selectedText = selectedOption ? selectedOption.textContent.trim() : placeholder;
			label.textContent = select.value ? selectedText : placeholder;
			if (select.value) {
				select.dataset.selectedValue = select.value;
				dropdown.dataset.selectedValue = select.value;
			}
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
				const nextValue = option.dataset.value || "";
				select.value = nextValue;
				select.dataset.selectedValue = nextValue;
				dropdown.dataset.selectedValue = nextValue;
				if (select.id === "propertyTypeSelect") syncRealjejuPropertyTypeSelect(select, nextValue, option.textContent);
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

/* PATCH 3.096: 커스텀 드롭다운 표시값과 실제 select 값을 저장 전까지 같은 값으로 보관 */
(function bindRegisterDropdownValueCapture()
{
	function syncFromOption(option)
	{
		const dropdown = option?.closest?.("[data-register-dropdown]");
		const select = dropdown?.querySelector?.("select");
		if (!dropdown || !select) return;
		const nextValue = String(option.dataset.value || "").trim();
		if (!nextValue) return;
		select.value = nextValue;
		select.dataset.selectedValue = nextValue;
		dropdown.dataset.selectedValue = nextValue;
		const label = dropdown.querySelector("[data-register-dropdown-label]");
		if (label) label.textContent = String(option.textContent || "").trim();
		dropdown.querySelectorAll(".property-register-dropdown-option[data-value]").forEach((btn) => {
			const isActive = btn === option;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-selected", isActive ? "true" : "false");
		});
	}

	document.addEventListener("click", (event) => {
		const option = event.target.closest("[data-register-dropdown] .property-register-dropdown-option[data-value]");
		if (option) syncFromOption(option);
	}, true);
})();

(function () {
	const textInput = document.getElementById("propertyApprovalDateInput");
	const pickerInput = document.getElementById("propertyApprovalDatePicker");
	const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");

	if (!textInput || !pickerInput || !pickerBtn) return;

	function normalizeApprovalDate(value) {
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
		const value = normalizeApprovalDate(textInput.value);
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
})();

(function () {
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
	const textInput = document.getElementById("propertyApprovalDateInput");
	const pickerInput = document.getElementById("propertyApprovalDatePicker");
	const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");

	if (!textInput || !pickerInput || !pickerBtn) return;

	function onlyDateDigits(value) {
		return String(value || "").replace(/\D/g, "").slice(0, 8);
	}

	function formatApprovalDateFromDigits(digits) {
		const value = onlyDateDigits(digits);

		if (value.length < 4) return value;
		if (value.length === 4) return value + "-";
		if (value.length <= 6) return value.slice(0, 4) + "-" + value.slice(4);
		if (value.length === 6) return value.slice(0, 4) + "-" + value.slice(4, 6) + "-";

		return value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8);
	}

	function normalizeApprovalDate(value) {
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

		return formatApprovalDateFromDigits(digits);
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

		const digits = onlyDateDigits(textInput.value);
		textInput.value = formatApprovalDateFromDigits(digits);
		syncPickerValue();
	});

	textInput.addEventListener("blur", function () {
		textInput.value = normalizeApprovalDate(textInput.value);
		syncPickerValue();
	});

	textInput.addEventListener("change", function () {
		textInput.value = normalizeApprovalDate(textInput.value);
		syncPickerValue();
	});

	pickerInput.addEventListener("change", function () {
		if (!pickerInput.value) return;
		textInput.value = pickerInput.value;
		syncPickerValue();
	});

	pickerBtn.addEventListener("click", function () {
		textInput.value = normalizeApprovalDate(textInput.value);
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
})();

(function () {
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

	const visibleTypeValues = ["apartment", "officetel", "room", "villa"];

	function updateDongHoVisibility() {
		const shouldShow = visibleTypeValues.includes(propertyTypeSelect.value);
		dongHoRow.classList.toggle("is-visible", shouldShow);
	}

	propertyTypeSelect.addEventListener("change", updateDongHoVisibility);

	document.addEventListener("click", function (event) {
		const option = event.target.closest(".property-type-dropdown .property-register-dropdown-option");
		if (!option) return;
		setTimeout(updateDongHoVisibility, 0);
	});

	updateDongHoVisibility();
})();

(function () {
	const propertyTypeSelect = document.getElementById("propertyTypeSelect");
	const facilityCard = document.getElementById("propertyFacilityCard");

	if (!propertyTypeSelect || !facilityCard) return;

	const showFacilityTypes = [
		"apartment",
		"officetel",
		"room",
		"villa",
		"house",
		"multi_family_house",
		"pension",
		"hotel"
	];

	function updateFacilityVisibility() {
		const shouldShow = showFacilityTypes.includes(propertyTypeSelect.value);
		facilityCard.classList.toggle("is-hidden", !shouldShow);
	}

	propertyTypeSelect.addEventListener("change", updateFacilityVisibility);

	document.addEventListener("click", function (event) {
		const option = event.target.closest(".property-type-dropdown .property-register-dropdown-option");
		if (!option) return;
		setTimeout(updateFacilityVisibility, 0);
	});

	updateFacilityVisibility();
})();

(function () {
	const pageInner = document.querySelector(".property-register-inner");
	const bottomBar = document.getElementById("propertyRegisterBottomBar");
	const bottomInner = bottomBar ? bottomBar.querySelector(".property-register-bottom-inner") : null;

	if (!pageInner || !bottomBar || !bottomInner) return;

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
			const input = row.querySelector(".property-register-input");
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

		const isUnder100 = under100.checked;
		card.querySelectorAll(".maintenance-fixed-detail-row").forEach(function (row) {
			row.classList.toggle("is-hidden", isUnder100);
		});
		card.querySelectorAll(".maintenance-fixed-under100-row").forEach(function (row) {
			row.classList.toggle("is-hidden", !isUnder100);
		});
	}

	card.addEventListener("change", function (event) {
		if (event.target && event.target.type === "radio") syncFixedInputs();
		if (event.target && event.target.id === "maintenanceUnder100kChk") syncUnder100Mode();
	});

	syncFixedInputs();
	syncUnder100Mode();
})();

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
		window.realjejuCurrentBrokerOffice = null;

		[
			"registrantOfficeNameInput",
			"registrantRepresentativeInput",
			"registrantPhone1Input",
			"registrantManagerNameInput",
			"registrantPhone2Input"
		].forEach((id) => setValue(id, ""));

		const chk = document.getElementById("registrantLicensedAgentChk");
		const manager = document.getElementById("registrantManagerNameInput");
		const phone2 = document.getElementById("registrantPhone2Input");
		if (chk) chk.checked = false;
		if (manager) manager.disabled = true;
		if (phone2) phone2.disabled = true;
	}

	function bindLicensedAgentToggle()
	{
		const chk = document.getElementById("registrantLicensedAgentChk");
		const manager = document.getElementById("registrantManagerNameInput");
		const phone2 = document.getElementById("registrantPhone2Input");
		if (!chk || !manager || !phone2 || chk.dataset.registrantToggleBound === "1") return;
		chk.dataset.registrantToggleBound = "1";

		function sync()
		{
			const enabled = chk.checked;
			[manager, phone2].forEach((input) => {
				input.disabled = !enabled;
				if (!enabled) input.value = "";
			});
		}

		chk.addEventListener("change", sync);
		sync();
	}

	function applyMyInfoFallback()
	{
		const office = cleanInfoValue(getTextValue("myInfoBrokerOfficeValue"));
		const name = cleanInfoValue(getTextValue("myInfoNameValue"));
		const phone = cleanInfoValue(getTextValue("myInfoPhoneValue"));

		if (!getInputValue("registrantOfficeNameInput") && office) setValue("registrantOfficeNameInput", office);
		if (!getInputValue("registrantRepresentativeInput") && name) setValue("registrantRepresentativeInput", name);
		if (!getInputValue("registrantPhone1Input") && phone) setValue("registrantPhone1Input", phone);
	}

	async function loadRegistrantInfoForRegister()
	{
		resetRegistrantInfo();
		bindLicensedAgentToggle();

		const client = typeof getRealjejuSupabaseClient === "function" ? getRealjejuSupabaseClient() : null;
		let profile = null;
		let agency = null;

		if (client)
		{
			try
			{
				const { data: userData } = await client.auth.getUser();
				const user = userData && userData.user ? userData.user : null;
				if (user)
				{
					setRealjejuActiveSession(user, window.realjejuCurrentProfile || null);

					try
					{
						const { data: profileData } = await client
							.from("profiles")
							.select("name, phone, profile_image, role_request")
							.eq("id", user.id)
							.maybeSingle();
						profile = profileData || null;
						if (!isRealjejuActiveSessionUser(user)) return;
						setRealjejuActiveSession(user, profile || null);
					}
					catch (profileError)
					{
						console.warn("등록자 정보 profiles 조회 실패:", profileError);
					}

					try
					{
						const agencyRows = await fetchMySuiteBrokerOfficeRows(client, user, profile || null);
						if (!isRealjejuActiveSessionUser(user)) return;
						const rows = (Array.isArray(agencyRows) ? agencyRows : []).filter(row => row && row.status !== "deleted" && !row.deleted_at);
						agency = rows.find(row => row && getBrokerOfficeRowStatus(row) === "active") || rows[0] || null;
						window.realjejuCurrentBrokerOffice = agency || null;
					}
					catch (agencyError)
					{
						console.warn("등록자 정보 agencies 조회 실패:", agencyError);
					}
				}
			}
			catch (error)
			{
				console.warn("등록자 정보 불러오기 실패:", error);
			}
		}

		const domOffice = cleanInfoValue(getTextValue("myInfoBrokerOfficeValue"));
		const domName = cleanInfoValue(getTextValue("myInfoNameValue"));
		const domPhone = cleanInfoValue(getTextValue("myInfoPhoneValue"));

		const fallbackOffice = getInputValue("brokerOfficeNameInput") || getInputValue("brokerOfficeSearchInput") || domOffice;
		const fallbackName = getInputValue("brokerOwnerNameInput") || domName;
		const fallbackPhone = getInputValue("brokerOfficePhoneInput") || getInputValue("authProfilePhoneInput") || domPhone;

		setValue("registrantOfficeNameInput", (agency && agency.office_name) || fallbackOffice);
		setValue("registrantRepresentativeInput", (agency && agency.owner_name) || (profile && profile.name) || fallbackName);
		setValue("registrantPhone1Input", (agency && agency.phone) || (profile && profile.phone) || fallbackPhone);

		applyMyInfoFallback();

		setTimeout(applyMyInfoFallback, 100);
		setTimeout(applyMyInfoFallback, 400);

		return { profile, agency };
	}

	window.realjejuResetRegistrantInfo = resetRegistrantInfo;
	window.realjejuLoadRegistrantInfoForRegister = loadRegistrantInfoForRegister;
})();

/* ===== PATCH: 등록자 정보 소속공인중개사 토글 직접 바인딩 ===== */
(function bindRegistrantLicensedToggleDirect()
{
	function bind()
	{
		const chk = document.getElementById("registrantLicensedAgentChk");
		const manager = document.getElementById("registrantManagerNameInput");
		const phone2 = document.getElementById("registrantPhone2Input");
		if (!chk || !manager || !phone2 || chk.dataset.directRegistrantToggleBound === "1") return;
		chk.dataset.directRegistrantToggleBound = "1";

		function sync()
		{
			const enabled = chk.checked;
			[manager, phone2].forEach((input) => {
				input.disabled = !enabled;
				if (!enabled) input.value = "";
			});
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

/* ===== PATCH 2.166: 매물 등록 Supabase 저장 ===== */
(function bindPropertyListingSave()
{
	const TABLE_NAME = "property_listings";
	// PATCH 3.030: 매물 사진은 등록 전 1600px JPEG로 리사이즈한 뒤 Storage에 저장
	const PROPERTY_PHOTOS_BUCKET = "property-photos";
	const PROPERTY_PHOTO_MAX_EDGE = 1600;
	const PROPERTY_PHOTO_JPEG_QUALITY = 0.82;
	// PATCH 2.316: 저장 완료 모달 확인 전까지 중복 저장 요청을 차단
	let propertyListingSaveInFlight = false;
	let propertyListingSubmitClickLock = false;

	function $(id)
	{
		return document.getElementById(id);
	}

	function value(id)
	{
		const el = $(id);
		if (!el) return "";
		if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return String(el.value || "").trim();
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

	function checkedValues(selector)
	{
		return Array.from(document.querySelectorAll(selector))
			.filter((input) => input.checked)
			.map((input) => input.value);
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
		if (select.matches("select.property-register-native-select")) syncRegisterDropdownSelectValue(select);
		const selectedText = select.options[select.selectedIndex]?.textContent?.trim() || "";
		if (String(select.value || "").trim() && selectedText) return selectedText;
		const dropdownOption = getRegisterDropdownStateOption(select);
		return dropdownOption?.textContent?.trim() || selectedText || "";
	}

	function resolveRegisterPropertyTypeFallback(select)
	{
		if (!select) return "";
		let resolved = resolvePropertyRegisterTypeValue(select);
		if (resolved) return resolved;

		const primaryText = [
			getPropertyRegisterTypeDebugText(select),
			value("propertyLocationSummaryInput"),
			value("propertyDetailDescriptionInput")
		].join("\n");
		resolved = resolveRealjejuPropertyTypeValue(primaryText);

		const areaMode = String(select.dataset.areaMode || "").trim();
		if (!resolved && (/^land/.test(areaMode) || value("landTypeSelect") || value("landUseZoneSelect"))) {
			resolved = "land";
		}

		if (!resolved) {
			resolved = resolveRealjejuPropertyTypeValue(value("buildingUseSelect"));
		}

		if (resolved) resolvePropertyRegisterTypeValue(select, resolved);
		return resolved || "";
	}

	// PATCH 2.322: 수정 화면 복원을 위해 현재 매물등록 폼의 실제 입력 상태를 payload에 함께 저장
	function collectPropertyRegisterFormState()
	{
		const page = $("propertyRegisterPage");
		const state = { inputs: {}, checks: {}, radios: {}, selects: {}, areaMode: "" };
		if (!page) return state;
		const propertyTypeSelect = document.getElementById("propertyTypeSelect");
		state.areaItems = collectPropertyRegisterAreaItems();
		state.areaMode = getAreaModeFromStoredLabels({ area_items: state.areaItems }, { form_state: { areaItems: state.areaItems } }, getCurrentPropertyRegisterAreaMode(propertyTypeSelect ? propertyTypeSelect.value : ""));
		state.areaLabels = getCurrentPropertyRegisterAreaLabels();
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
				if (el.id) {
					if (el.id === "propertyTypeSelect") syncRegisterDropdownSelectValue(el);
					state.selects[el.id] = el.value || "";
				}
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
	function resizeListingPhotoFile(file)
	{
		return new Promise((resolve, reject) => {
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
	async function uploadListingPhotos(client, userId, listingId)
	{
		const files = Array.isArray(window.realjejuPropertyPhotoFiles) ? window.realjejuPropertyPhotoFiles : [];
		if (!files.length) return { photos: [], failedCount: 0 };
		const bucket = client.storage.from(PROPERTY_PHOTOS_BUCKET);
		const photos = [];
		let failedCount = 0;
		const uploadBatchId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

		for (let i = 0; i < files.length; i += 1) {
			const order = i + 1;
			try {
				const resized = await resizeListingPhotoFile(files[i]);
				const fileName = `photo-${String(order).padStart(3, "0")}.jpg`;
				const path = `${userId}/${listingId}/${uploadBatchId}/${fileName}`;
				const { error } = await bucket.upload(path, resized.blob, {
					cacheControl: "31536000",
					contentType: "image/jpeg",
					upsert: false
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

	function collectCheckedLabels(pairs)
	{
		return pairs
			.filter((item) => checked(item.id))
			.map((item) => item.label);
	}

		function collectFacilityPayload()
		{
		const featurePairs = [
			{ id: "facilityFullOptionChk", label: "풀옵션" },
			{ id: "facilityDuplexChk", label: "복층형" },
			{ id: "facilityElevatorChk", label: "엘리베이터" },
			{ id: "facilityOceanViewChk", label: "오션뷰" }
		];
		const coolingPairs = [
			{ id: "coolingWallChk", label: "벽걸이에어컨" },
			{ id: "coolingStandChk", label: "스탠드에어컨" },
			{ id: "coolingCeilingChk", label: "천장에어컨" }
		];
		const furniturePairs = [
			{ id: "furnitureTableChk", label: "식탁" },
			{ id: "furnitureBedChk", label: "침대" },
			{ id: "furnitureDeskChk", label: "책상" },
			{ id: "furnitureClosetChk", label: "옷장" },
			{ id: "furnitureShoesChk", label: "신발장" },
			{ id: "furnitureSofaChk", label: "소파" },
			{ id: "furnitureBuiltInChk", label: "붙박이장" }
		];
		const appliancePairs = [
			{ id: "applianceMicrowaveChk", label: "전자레인지" },
			{ id: "applianceWasherChk", label: "세탁기" },
			{ id: "applianceFridgeChk", label: "냉장고" },
			{ id: "applianceTvChk", label: "TV" },
			{ id: "applianceGasRangeChk", label: "가스레인지" },
			{ id: "applianceInductionChk", label: "인덕션레인지" },
			{ id: "applianceGasOvenChk", label: "가스오븐" },
			{ id: "applianceDryerChk", label: "건조기" }
		];
		const kitchenBathPairs = [
			{ id: "kitchenDishwasherChk", label: "식기세척기" },
			{ id: "kitchenFoodWasteDisposerChk", label: "음식물 처리기" },
			{ id: "bathShowerBoothChk", label: "샤워부스" },
			{ id: "bathBidetChk", label: "비데" },
			{ id: "bathTubChk", label: "욕조" },
			{ id: "kitchenSinkChk", label: "싱크대" }
		];
		const securityPairs = [
			{ id: "securityGuardChk", label: "자체경비원" },
			{ id: "securityPrivateChk", label: "사설경비원" },
			{ id: "securityVideoPhoneChk", label: "비디오폰" },
			{ id: "securityInterphoneChk", label: "인터폰" },
			{ id: "securityCardKeyChk", label: "카드키" },
			{ id: "securityCctvChk", label: "CCTV" },
			{ id: "securityEntranceChk", label: "현관보안" },
			{ id: "securityWindowChk", label: "방범창" }
		];
		const etcPairs = [
			{ id: "etcElevatorChk", label: "엘리베이터" },
			{ id: "etcFireAlarmChk", label: "화재경보" },
			{ id: "etcVentilationChk", label: "환기시설" },
			{ id: "etcLaundryChk", label: "세탁실" },
			{ id: "etcEntranceChk", label: "중문" },
			{ id: "etcDressingChk", label: "드레스룸" },
			{ id: "etcUtilityChk", label: "다용도실" },
			{ id: "etcVerandaChk", label: "베란다" },
			{ id: "etcTerraceChk", label: "테라스" },
			{ id: "etcParcelBoxChk", label: "무인택배함" },
			{ id: "etcYardChk", label: "마당" }
		];

		return {
			features: collectCheckedLabels(featurePairs),
			cooling: collectCheckedLabels(coolingPairs),
			furniture: collectCheckedLabels(furniturePairs),
			appliances: collectCheckedLabels(appliancePairs),
			kitchen_bath: collectCheckedLabels(kitchenBathPairs),
			security: collectCheckedLabels(securityPairs),
			etc: collectCheckedLabels(etcPairs),
			flags: {
				full_option: checked("facilityFullOptionChk"),
				duplex: checked("facilityDuplexChk"),
				elevator: checked("facilityElevatorChk") || checked("etcElevatorChk"),
				ocean_view: checked("facilityOceanViewChk"),
				furniture_built_in: checked("furnitureBuiltInChk"),
				appliance_gas_range: checked("applianceGasRangeChk"),
				veranda: checked("etcVerandaChk"),
				terrace: checked("etcTerraceChk"),
				yard: checked("etcYardChk"),
				cctv: checked("securityCctvChk")
			}
			};
		}

		function createAutoPropertyListingNo()
		{
			return "";
		}

		function ensurePropertyListingNo(title)
		{
			const listingNoInput = $("propertyListingNoInput");
			const mode = typeof getPropertyListingNoMode === "function" ? getPropertyListingNoMode() : "auto";
			const currentRaw = value("propertyListingNoInput");
			const current = normalizePropertyListingNoCandidate(currentRaw);
			if (mode !== "manual") {
				if (listingNoInput && currentRaw) {
					listingNoInput.value = "";
					listingNoInput.dispatchEvent(new Event("input", { bubbles: true }));
					listingNoInput.dispatchEvent(new Event("change", { bubbles: true }));
				}
				return createAutoPropertyListingNo();
			}
			if (listingNoInput && currentRaw && !current) {
				listingNoInput.value = "";
				listingNoInput.dispatchEvent(new Event("input", { bubbles: true }));
				listingNoInput.dispatchEvent(new Event("change", { bubbles: true }));
			}
			return current || "";
		}

		function collectListingPayload(status)
		{
		const addressInput = $("propertyAddressInput");
		const dealTypes = checkedValues(".property-deal-check");
		const propertyTypeSelect = $("propertyTypeSelect");
		let propertyTypeValue = resolveRegisterPropertyTypeFallback(propertyTypeSelect);
		const propertyTypeLabel = selectedOptionText("propertyTypeSelect");
		if (!propertyTypeValue) propertyTypeValue = resolveRealjejuPropertyTypeValue(propertyTypeLabel);
			if (!propertyTypeValue) propertyTypeValue = resolveRealjejuPropertyTypeValue(getPropertyRegisterTypeDebugText(propertyTypeSelect));
			if (propertyTypeSelect && propertyTypeValue) resolvePropertyRegisterTypeValue(propertyTypeSelect, propertyTypeValue, propertyTypeLabel);
			const title = value("propertyLocationSummaryInput") || propertyTypeLabel || "신규 매물";
			const listingNo = ensurePropertyListingNo(title);
		const rawLat = addressInput?.dataset.lat;
		const rawLng = addressInput?.dataset.lng;
		const lat = rawLat === undefined || rawLat === "" ? null : Number(rawLat);
		const lng = rawLng === undefined || rawLng === "" ? null : Number(rawLng);
		// PATCH 2.323: 기타 부과 관리비는 부과기준 라디오가 비어 있지 않게 기본값을 함께 저장
		const maintenanceType = document.querySelector("#propertyMaintenanceCard .maintenance-tab.active")?.getAttribute("data-maintenance-type") || "";
		const maintenanceDetailType = radioValue("maintenanceDetailType") || (maintenanceType === "extra" ? "common_area_usage" : "");
		const buildingName = addressInput?.dataset.buildingName || "";
		const complexName = addressInput?.dataset.complexName || buildingName;
			const currentOffice = window.realjejuCurrentBrokerOffice && typeof window.realjejuCurrentBrokerOffice === "object" ? window.realjejuCurrentBrokerOffice : {};
			const currentProfile = window.realjejuCurrentProfile && typeof window.realjejuCurrentProfile === "object" ? window.realjejuCurrentProfile : {};
			const areaItems = collectPropertyRegisterAreaItems();
			const areaMode = getAreaModeFromStoredLabels({ area_items: areaItems }, { form_state: { areaItems } }, getCurrentPropertyRegisterAreaMode(propertyTypeValue));
			const areaLabels = getCurrentPropertyRegisterAreaLabels();
			const savedAreaLabels = { ...areaLabels };
			areaItems.forEach((item) => {
				if (item && item.key && item.label) savedAreaLabels[item.key] = item.label;
			});
			const savedAddress = window.REALJEJU_PROPERTY_ADDRESS && typeof window.REALJEJU_PROPERTY_ADDRESS === "object"
				? { ...window.REALJEJU_PROPERTY_ADDRESS }
				: null;
		const locationDisplayType = addressInput?.dataset.locationDisplayType || radioValue("propertyAddressLocationMode") || "rectangle";
		const locationBounds = {
			swLat: Number(addressInput?.dataset.locationSwLat),
			swLng: Number(addressInput?.dataset.locationSwLng),
			neLat: Number(addressInput?.dataset.locationNeLat),
			neLng: Number(addressInput?.dataset.locationNeLng)
		};
		const hasLocationBounds = Object.values(locationBounds).every(Number.isFinite);
		if (savedAddress) {
			savedAddress.locationDisplayType = locationDisplayType;
			if (hasLocationBounds) savedAddress.locationBounds = locationBounds;
		}

		return {
			status,
				property_type: propertyTypeValue,
				property_type_label: propertyTypeLabel,
				deal_types: dealTypes,
				title,
				...(listingNo ? { listing_no: listingNo } : {}),
			address1: addressInput?.dataset.address1 || addressInput?.value?.trim() || "",
			address2: addressInput?.dataset.address2 || "",
			public_address: addressInput?.dataset.publicAddress || addressInput?.value?.trim() || "",
			hide_detail_jibun: addressInput?.dataset.hideDetailJibun === "1",
			location_display_type: locationDisplayType,
			lat: Number.isFinite(lat) ? lat : null,
			lng: Number.isFinite(lng) ? lng : null,
				payload: {
					version: APP_VERSION,
					...(listingNo ? { listing_no: listingNo } : {}),
					building_name: buildingName,
					complex_name: complexName,
					form_state: collectPropertyRegisterFormState(),
				building_use: value("buildingUseSelect"),
				dong: value("propertyDongInput"),
					ho: value("propertyHoInput"),
					areas: {
						area_mode: areaMode,
						labels: savedAreaLabels,
						area_labels: savedAreaLabels,
						area_items: areaItems,
						land_label: savedAreaLabels.land,
						exclusive_label: savedAreaLabels.exclusive,
						supply_label: savedAreaLabels.supply,
						exclusive_m2: getPropertyRegisterAreaItemNumber(areaItems, "exclusive", "m2"),
						exclusive_py: getPropertyRegisterAreaItemNumber(areaItems, "exclusive", "py"),
						supply_m2: getPropertyRegisterAreaItemNumber(areaItems, "supply", "m2"),
						supply_py: getPropertyRegisterAreaItemNumber(areaItems, "supply", "py"),
						land_m2: getPropertyRegisterAreaItemNumber(areaItems, "land", "m2"),
						land_py: getPropertyRegisterAreaItemNumber(areaItems, "land", "py"),
					// PATCH 2.287: 토지종류와 용도지역 드롭다운 값을 저장 payload에 포함
					land_type: value("landTypeSelect"),
					land_use_zone: value("landUseZoneSelect"),
					land_road: value("landRoadInput")
				},
				prices: collectPricePayload(),
				building: {
					approval_date: value("propertyApprovalDateInput"),
					store_count: numberValue("propertyStoreCountInput"),
					household_count: numberValue("propertyHouseholdCountInput"),
					direction: value("propertyDirectionSelect"),
					direction_base: value("propertyDirectionBaseSelect"),
					loan: radioValue("propertyLoan"),
					pet: radioValue("propertyPet"),
					parking: radioValue("propertyParking"),
					parking_total: numberValue("propertyParkingTotalInput"),
					parking_per_household: numberValue("propertyParkingPerInput"),
					heating: radioValue("propertyHeating"),
					heating_fuel: value("propertyHeatingFuelSelect")
				},
				rooms: {
					// PATCH 2.295: 방/욕실 해당없음 선택값을 저장 payload에 포함
					not_applicable: checked("propertyRoomBathNotApplicableChk"),
					room_count: checked("propertyRoomBathNotApplicableChk") ? null : numberValue("propertyRoomCountInput"),
					bath_count: checked("propertyRoomBathNotApplicableChk") ? null : numberValue("propertyBathCountInput")
				},
				floors: {
					total_floor: numberValue("propertyTotalFloorInput"),
					current_floor: numberValue("propertyCurrentFloorInput"),
					use_level_label: checked("propertyFloorLevelUseCheck"),
					level_label: radioValue("propertyFloorLevel"),
					basement: checked("propertyBasementCheck"),
					semi_basement: checked("propertySemiBasementCheck"),
					whole_building: checked("propertyWholeBuildingCheck")
				},
				maintenance: {
					type: maintenanceType,
					no_fee_value: normalizeMaintenanceNoFeeText(value("maintenanceNoneValue"), "관리비 없음"),
					no_fee_reason: normalizeMaintenanceNoFeeText(value("maintenanceNoneReason"), "관리비 부과내역 없음"),
					under_100k_or_unprovided: checked("maintenanceUnder100kChk"),
					fixed_base: radioValue("maintenanceFixedBase"),
					extra_base: radioValue("maintenanceExtraBase"),
					detail_type: maintenanceDetailType,
					unknown_reason: radioValue("maintenanceUnknownReason"),
					fixed_total_won: numberValue("maintenanceFixedTotalInput"),
					total_won: numberValue("maintenanceTotalInput"),
					common_manwon: numberValue("maintenanceCommonInput"),
					include_common: checked("maintenanceFixedIncludeCommonChk") || checked("maintenanceIncludeCommonChk"),
					include_electric: checked("maintenanceFixedIncludeElectricChk") || checked("maintenanceIncludeElectricChk"),
					include_water: checked("maintenanceFixedIncludeWaterChk") || checked("maintenanceIncludeWaterChk"),
					include_gas: checked("maintenanceFixedIncludeGasChk") || checked("maintenanceIncludeGasChk"),
					include_heating: checked("maintenanceFixedIncludeHeatingChk") || checked("maintenanceIncludeHeatingChk"),
					include_internet: checked("maintenanceFixedIncludeInternetChk") || checked("maintenanceIncludeInternetChk"),
					include_tv: checked("maintenanceFixedIncludeTvChk") || checked("maintenanceIncludeTvChk"),
					include_etc: checked("maintenanceFixedIncludeEtcChk") || checked("maintenanceIncludeEtcChk"),
					electric_type: radioValue("maintenanceElectricType"),
					water_type: radioValue("maintenanceWaterType"),
					gas_type: radioValue("maintenanceGasType"),
					heating_type: radioValue("maintenanceHeatingType"),
					internet_type: radioValue("maintenanceInternetType"),
					tv_type: radioValue("maintenanceTvType"),
					etc_type: radioValue("maintenanceEtcType"),
					electric_manwon: numberValue("maintenanceElectricInput"),
					water_manwon: numberValue("maintenanceWaterInput"),
					gas_manwon: numberValue("maintenanceGasInput"),
					heating_manwon: numberValue("maintenanceHeatingInput"),
					internet_manwon: numberValue("maintenanceInternetInput"),
					tv_manwon: numberValue("maintenanceTvInput"),
					etc_manwon: numberValue("maintenanceEtcInput")
				},
				facilities: collectFacilityPayload(),
				move_in: {
					date: value("propertyMoveInDateInput"),
					now: checked("propertyMoveInNowChk"),
					negotiable: checked("propertyMoveInNegotiableChk")
				},
				description: value("propertyDetailDescriptionInput"),
				youtube_url: value("propertyYoutubeLinkInput"),
				agency_memo: value("propertyAgencyMemoInput"),
				registrant: {
					agency_id: currentOffice.id || "",
					agency_user_id: currentOffice.user_id || "",
					office_name: value("registrantOfficeNameInput"),
					representative: value("registrantRepresentativeInput"),
					phone1: value("registrantPhone1Input"),
					manager_name: value("registrantManagerNameInput"),
					is_licensed_agent: checked("registrantLicensedAgentChk"),
					phone2: value("registrantPhone2Input"),
					office_reg_no: currentOffice.office_reg_no || "",
					office_address: currentOffice.office_address || "",
					agent_image: currentProfile.profile_image || currentProfile.avatar_url || "",
					email: currentOffice.email || "",
					kakao_url: currentOffice.kakao_url || ""
				},
				address: savedAddress
			}
		};
	}

	function enrichListingRegistrantSnapshot(payload, brokerAccess)
	{
		if (!payload || typeof payload !== "object") return payload;
		if (!payload.payload || typeof payload.payload !== "object") payload.payload = {};
		const currentOffice = window.realjejuCurrentBrokerOffice && typeof window.realjejuCurrentBrokerOffice === "object" ? window.realjejuCurrentBrokerOffice : {};
		const accessOffice = brokerAccess?.brokerOffice && typeof brokerAccess.brokerOffice === "object" ? brokerAccess.brokerOffice : {};
		const office = { ...currentOffice, ...accessOffice };
		const profile = window.realjejuCurrentProfile && typeof window.realjejuCurrentProfile === "object" ? window.realjejuCurrentProfile : {};
		const registrant = payload.payload.registrant && typeof payload.payload.registrant === "object" ? payload.payload.registrant : {};
		const firstText = (...values) => values.map((value) => String(value || "").trim()).find(Boolean) || "";
		payload.payload.registrant = {
			...registrant,
			agency_id: firstText(registrant.agency_id, office.id),
			agency_user_id: firstText(registrant.agency_user_id, office.user_id),
			office_name: firstText(registrant.office_name, office.office_name),
			representative: firstText(registrant.representative, office.owner_name, profile.name, profile.full_name),
			phone1: firstText(registrant.phone1, office.phone, profile.phone),
			office_reg_no: firstText(registrant.office_reg_no, office.office_reg_no, office.reg_no, office.registration_no, office.license_no),
			office_address: firstText(registrant.office_address, office.office_address, office.address, office.office_addr),
			agent_image: firstText(registrant.agent_image, registrant.profile_image, profile.profile_image, profile.avatar_url),
			email: firstText(registrant.email, office.email),
			kakao_url: firstText(registrant.kakao_url, registrant.kakaoUrl, office.kakao_url, office.kakaoUrl, office.kakao, office.kakao_open_chat, office.kakao_open_chat_url, office.open_chat_url)
		};
		return payload;
	}

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

	function getRequiredFieldRow(label)
	{
		return label.closest(".property-form-row, .property-info-row, .maintenance-form-row, .property-price-row, .property-detail-row, .property-agency-row, .property-registrant-form-row, .property-premium-field") || label.parentElement;
	}

	function getRequiredFieldControl(label, row)
	{
		const id = label?.getAttribute("for") || "";
		if (!id) return null;
		const control = row?.querySelector(`#${CSS.escape(id)}`) || $(id);
		if (!control || control.disabled) return null;
		return control;
	}

	function getRequiredFieldTarget(row, label)
	{
		if (!row) return null;
		const control = getRequiredFieldControl(label, row);
		if (control) {
			const dropdownTrigger = control.closest("[data-register-dropdown]")?.querySelector("button[data-register-dropdown-trigger]");
			return dropdownTrigger || control;
		}
		return row.querySelector("button[data-register-dropdown-trigger], input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled)");
	}

	function hasRequiredControlValue(control)
	{
		if (!control) return true;
		if (control.type === "radio") {
			return !!document.querySelector(`input[name="${CSS.escape(control.name)}"]:checked`);
		}
		if (control.type === "checkbox") return !!control.checked;
		if (control.matches("select.property-register-native-select")) {
			if (control.id === "propertyTypeSelect") resolveRegisterPropertyTypeFallback(control);
			else syncRegisterDropdownSelectValue(control);
			if (control.id === "propertyTypeSelect" && !String(control.value || "").trim()) {
				const debugText = getPropertyRegisterTypeDebugText(control);
				const fallback = resolveRealjejuPropertyTypeValue(debugText);
				if (fallback) resolvePropertyRegisterTypeValue(control, fallback, debugText);
			}
		}
		return String(control.value || "").trim() !== "";
	}

	function normalizeRegisterDropdownText(value)
	{
		return String(value || "").replace(/\s+/g, " ").trim();
	}

	function getRegisterDropdownStateOption(select)
	{
		if (!select) return null;
		const wrap = select.closest("[data-register-dropdown]");
		if (!wrap) return null;
		const options = Array.from(wrap.querySelectorAll(".property-register-dropdown-option[data-value]"));
		if (!options.length) return null;
		const findByValue = (rawValue) =>
		{
			const valueText = String(rawValue || "").trim();
			if (!valueText) return null;
			return options.find((option) => String(option.dataset.value || "").trim() === valueText) || null;
		};
		const currentValue = String(select.value || "").trim();
		let option = findByValue(currentValue);
		if (option) return option;
		option = findByValue(select.dataset.selectedValue) || findByValue(select.dataset.lastValue) || findByValue(wrap.dataset.selectedValue);
		if (option) return option;
		option = options.find((candidate) => candidate.classList.contains("active") && String(candidate.dataset.value || "").trim()) || null;
		if (option) return option;
		const labelText = normalizeRegisterDropdownText(wrap.querySelector("[data-register-dropdown-label]")?.textContent);
		if (select.id === "propertyTypeSelect") {
			option = findRealjejuPropertyTypeOption(
				select,
				currentValue,
				select.dataset.selectedValue,
				select.dataset.lastValue,
				wrap.dataset.selectedValue,
				labelText
			);
			if (option) return option;
		}
		if (!labelText) return null;
		return options.find((candidate) => normalizeRegisterDropdownText(candidate.textContent) === labelText) || null;
	}

	function syncRegisterDropdownSelectValue(select)
	{
		if (!select) return "";
		if (select.id === "propertyTypeSelect") return syncRealjejuPropertyTypeSelect(select);
		const wrap = select.closest("[data-register-dropdown]");
		const option = getRegisterDropdownStateOption(select);
		const value = String(option?.dataset.value || "").trim();
		if (!value) return String(select.value || "").trim();
		const prevValue = String(select.value || "").trim();
		select.value = value;
		select.dataset.selectedValue = value;
		select.dataset.lastValue = value;
		if (wrap) {
			wrap.dataset.selectedValue = value;
			const label = wrap.querySelector("[data-register-dropdown-label]");
			if (label) label.textContent = String(option.textContent || "").trim();
			wrap.querySelectorAll(".property-register-dropdown-option[data-value]").forEach((btn) => {
				const isActive = String(btn.dataset.value || "").trim() === value;
				btn.classList.toggle("active", isActive);
				btn.setAttribute("aria-selected", isActive ? "true" : "false");
			});
		}
		if (prevValue !== value) select.dispatchEvent(new Event("change", { bubbles: true }));
		return value;
	}

	function hasMultipleRequiredLabels(row)
	{
		if (!row) return false;
		return row.querySelectorAll(".property-form-label .property-required, .property-form-label.property-required, .property-inline-label .property-required, .property-inline-label.property-required").length > 1;
	}

	function hasRequiredFieldValue(row, label)
	{
		if (!row || !isVisibleRequiredElement(row)) return true;
		if (row.classList.contains("property-room-row") && checked("propertyRoomBathNotApplicableChk")) return true;
		if (row.querySelector("#propertyMoveInDateInput") && (checked("propertyMoveInNowChk") || checked("propertyMoveInNegotiableChk"))) return true;
		const control = getRequiredFieldControl(label, row);
		if (control && hasMultipleRequiredLabels(row)) return hasRequiredControlValue(control);
		const controls = Array.from(row.querySelectorAll("input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled)"))
			.filter((control) => isVisibleRequiredElement(control) || control.classList.contains("property-register-native-select"));
		controls.forEach((control) => {
			if (control.matches("select.property-register-native-select")) {
				if (control.id === "propertyTypeSelect") resolveRegisterPropertyTypeFallback(control);
				else syncRegisterDropdownSelectValue(control);
			}
		});
		if (!controls.length) return true;
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
		const page = $("propertyRegisterPage");
		if (!page) return null;
		const missing = [];
		const seenFields = new Set();
		page.querySelectorAll(".property-form-label .property-required, .property-form-label.property-required, .property-inline-label .property-required, .property-inline-label.property-required").forEach((requiredMark) => {
			const label = requiredMark.closest(".property-form-label");
			const inlineLabel = requiredMark.closest(".property-inline-label");
			const requiredLabel = label || inlineLabel;
			if (!requiredLabel || !isVisibleRequiredElement(requiredLabel)) return;
			const row = getRequiredFieldRow(requiredLabel);
			if (!row || !isVisibleRequiredElement(row)) return;
			const control = getRequiredFieldControl(requiredLabel, row);
			const target = getRequiredFieldTarget(row, requiredLabel);
			const fieldKey = control?.id ? `control:${control.id}` : (target?.id ? `target:${target.id}` : `row:${Array.from(page.querySelectorAll(".property-form-row, .property-info-row, .maintenance-form-row, .property-price-row, .property-detail-row, .property-agency-row, .property-registrant-form-row, .property-premium-field")).indexOf(row)}`);
			if (seenFields.has(fieldKey)) return;
			seenFields.add(fieldKey);
			if (hasRequiredFieldValue(row, requiredLabel)) return;
			missing.push({
				label: getRequiredLabelText(requiredLabel),
				target
			});
		});
		if (!missing.length) return null;
		return {
			message: "필수 입력 항목이 비어 있습니다.\n[항목]\n" + missing.map((item) => item.label).join("\n"),
			target: missing[0].target
		};
	}

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
		if (status === "published" && typeof getPropertyListingNoMode === "function" && getPropertyListingNoMode() === "manual" && !payload.listing_no) {
			return { message: "매물번호를 입력해주세요.", target: $("propertyListingNoInput") };
		}
		if (status === "published") {
			const missingCheckedItems = [];
			const loanRow = document.querySelector(".property-loan-row");
			const parkingRow = document.querySelector(".property-parking-row");
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

	async function saveListing(status)
	{
		const page = $("propertyRegisterPage");
		if (propertyListingSubmitClickLock || propertyListingSaveInFlight || (page && page.dataset.saveInFlight === "1")) return;
		propertyListingSubmitClickLock = true;
		propertyListingSaveInFlight = true;
		if (page) page.dataset.saveInFlight = "1";
		const submitBtn = $("propertySubmitBtn");
		const draftBtn = $("propertyDraftSaveBtn");
		const setSaveButtonsDisabled = (disabled) => {
			[submitBtn, draftBtn].forEach((btn) => { if (btn) btn.disabled = disabled; });
		};
		setSaveButtonsDisabled(true);
		let keepButtonsLockedUntilConfirm = false;

		// PATCH 2.313: 저장 스크립트는 전역 Supabase 클라이언트 팩토리를 명시적으로 사용
		const client = typeof window.getRealjejuSupabaseClient === "function" ? window.getRealjejuSupabaseClient() : null;

		try {
			if (!client) {
				openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "매물 등록", null);
				return;
			}

			const { data: userData, error: userError } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : null;
			if (userError || !user) {
				openAuthErrorModal("매물 등록은 승인 완료된 개업 공인중개사 또는\n중개법인만 가능합니다.", "매물 등록", null, typeof openAuthModal === "function" ? openAuthModal : null);
				return;
			}

				const requireBrokerAccess = typeof window.requireApprovedBrokerForPropertyRegister === "function"
					? window.requireApprovedBrokerForPropertyRegister
					: null;
				const brokerAccess = requireBrokerAccess ? await requireBrokerAccess() : null;
			if (!brokerAccess) {
				return;
			}

			const payload = collectListingPayload(status);
			enrichListingRegistrantSnapshot(payload, brokerAccess);
			const validation = validateListing(payload, status);
			if (validation) {
				openAuthErrorModal(validation.message, "매물 등록", validation.target);
				return;
			}

			const existingListingId = page?.dataset.listingId || "";
			const listingId = existingListingId || page?.dataset.pendingListingId || createListingId();
			if (!existingListingId && page) page.dataset.pendingListingId = listingId;
			const row = {
				...payload,
				id: listingId,
				user_id: user.id,
				agency_id: brokerAccess.brokerOffice?.id || window.realjejuCurrentBrokerOffice?.id || null,
				updated_at: new Date().toISOString()
			};

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
					if (error && /listing_no/i.test(String(error.message || ""))) {
						delete updateRow.listing_no;
						const retryResult = await client
							.from(TABLE_NAME)
							.update(updateRow)
							.eq("id", existingListingId)
							.eq("user_id", user.id);
						error = retryResult.error;
					}
				} else {
					const insertResult = await client
						.from(TABLE_NAME)
						.insert(row);
					error = insertResult.error;
					if (error && /listing_no/i.test(String(error.message || ""))) {
						delete row.listing_no;
						const retryResult = await client
							.from(TABLE_NAME)
							.insert(row);
						error = retryResult.error;
					}
				}

			// PATCH 3.158: 신규 저장 중 같은 ID가 이미 들어갔다면 새 매물을 만들지 않고 같은 row를 이어서 사용
			if (!existingListingId && error && (String(error.code || "") === "23505" || /duplicate key/i.test(String(error.message || "")))) {
				const lookupResult = await client
					.from(TABLE_NAME)
					.select("id")
					.eq("id", listingId)
					.eq("user_id", user.id)
					.maybeSingle();
				if (!lookupResult.error && lookupResult.data && lookupResult.data.id) {
					const updateRow = { ...row };
					delete updateRow.id;
					delete updateRow.user_id;
					const updateExistingResult = await client
						.from(TABLE_NAME)
						.update(updateRow)
						.eq("id", listingId)
						.eq("user_id", user.id);
					error = updateExistingResult.error || null;
				} else {
					row.id = createListingId();
					if (page) page.dataset.pendingListingId = row.id;
					const retryResult = await client
						.from(TABLE_NAME)
						.insert(row);
					error = retryResult.error;
				}
			}

			if (error) {
				console.error("매물 저장 실패:", error);
				openAuthErrorModal(`매물 저장에 실패했습니다.\n${error.message || "Supabase 테이블과 RLS 정책을 확인하세요."}`, "매물 등록", null);
				return;
			}

			const savedListingId = row.id;
			if (page) {
				page.dataset.listingId = savedListingId;
				delete page.dataset.pendingListingId;
			}
			const uploadResult = await uploadListingPhotos(client, user.id, savedListingId);
			const photoSaveListBuilder = typeof window.realjejuBuildPropertyPhotoSaveList === "function" ? window.realjejuBuildPropertyPhotoSaveList : null;
			const savedPhotos = photoSaveListBuilder
				? photoSaveListBuilder(uploadResult.photos)
				: [
					...(Array.isArray(window.realjejuExistingPropertyPhotos) ? window.realjejuExistingPropertyPhotos : []),
					...uploadResult.photos
				].map((photo, index) => ({ ...photo, order: index + 1 }));
			const { error: photoUpdateError } = await client
				.from(TABLE_NAME)
				.update({ photos: savedPhotos })
				.eq("id", savedListingId)
				.eq("user_id", user.id);
			if (photoUpdateError) {
				console.error("매물 사진 정보 저장 실패:", photoUpdateError);
				openAuthErrorModal("매물은 저장됐지만 사진 정보 저장에 실패했습니다.", "매물 등록", null);
				return;
			}

			let completeMessage = existingListingId ? (status === "draft" ? "임시저장 내용이 수정되었습니다." : "매물이 수정되었습니다.") : (status === "draft" ? "임시저장되었습니다." : "매물이 등록되었습니다.");
			if (uploadResult.failedCount > 0) completeMessage += `\n사진 ${uploadResult.failedCount}장은 업로드되지 않았습니다.`;
			window.REALJEJU_LAST_SAVED_LISTING_ID = savedListingId;
			keepButtonsLockedUntilConfirm = true;
				const finishSuccessfulPropertySave = () => {
					propertyListingSaveInFlight = false;
					propertyListingSubmitClickLock = false;
					if (page) {
						delete page.dataset.saveInFlight;
						delete page.dataset.pendingListingId;
				}
				setSaveButtonsDisabled(false);
				// PATCH 2.358: 등록/수정 완료 확인 후에는 폼을 완전히 초기화해 다음 등록이 기존 매물을 덮어쓰지 않게 한다.
				if (status === "published" && typeof window.resetPropertyRegisterFormFields === "function") window.resetPropertyRegisterFormFields();
				if (status === "published" && typeof window.realjejuReloadMapListings === "function") window.realjejuReloadMapListings();
				if (typeof window.openBrokerHomePage === "function") window.openBrokerHomePage(savedListingId);
			};
			// PATCH 3.199: 등록/수정 성공은 확인 모달 없이 바로 중개사 홈으로 이동한다.
			if (status === "published" && uploadResult.failedCount <= 0) {
				finishSuccessfulPropertySave();
				return;
			}
			// PATCH 2.358: 완료 후 초기화는 상태값 기준으로 처리한다.
			// PATCH 2.322: 수정 저장 완료 문구는 등록 완료와 구분해 보여줌
			openAuthErrorModal(completeMessage, existingListingId ? "매물 수정 완료" : "매물 등록 완료", null, finishSuccessfulPropertySave);
		}
		catch (err) {
			console.error("매물 저장 오류:", err);
			openAuthErrorModal("매물 저장 중 오류가 발생했습니다.", "매물 등록", null);
		}
		finally {
			if (!keepButtonsLockedUntilConfirm) {
				propertyListingSaveInFlight = false;
				propertyListingSubmitClickLock = false;
				if (page) {
					delete page.dataset.saveInFlight;
				}
				setSaveButtonsDisabled(false);
			}
		}
	}

	// PATCH 2.329: 수정 모드의 왼쪽 하단 버튼은 임시저장이 아니라 취소로 동작
	function isPropertyListingEditMode()
	{
		const page = $("propertyRegisterPage");
		return !!(page && page.dataset.listingId);
	}

	function cancelPropertyListingEdit()
	{
		if (propertyListingSaveInFlight) return;
		if (typeof window.openBrokerHomePage === "function") {
			window.openBrokerHomePage("");
			return;
		}
		if (typeof window.closePropertyRegisterPage === "function") window.closePropertyRegisterPage();
	}

	function bind()
	{
		const submitBtn = $("propertySubmitBtn");
		const draftBtn = $("propertyDraftSaveBtn");
		const lockSaveButtonsImmediately = () => {
			[submitBtn, draftBtn].forEach((btn) => { if (btn) btn.disabled = true; });
		};
		if (submitBtn && submitBtn.dataset.listingSaveBound !== "1") {
			submitBtn.dataset.listingSaveBound = "1";
			submitBtn.addEventListener("click", () => {
				const page = $("propertyRegisterPage");
				if (propertyListingSaveInFlight || (page && page.dataset.saveInFlight === "1")) return;
				// PATCH 3.201: 저장 함수가 비동기 작업에 들어가기 전에 중복 클릭부터 막는다.
				lockSaveButtonsImmediately();
				saveListing("published");
			});
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

/* ===== PATCH 2.170: 교차로 복사글 간편 매물 등록 ===== */
(function bindCrossroadPasteImport()
{
	function $(id)
	{
		return document.getElementById(id);
	}

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
		let nextValue = String(value || "").trim();
		if (id === "propertyTypeSelect") nextValue = syncRealjejuPropertyTypeSelect(select, nextValue) || nextValue;
		select.value = nextValue;
		const wrap = select.closest("[data-register-dropdown]");
		let option = null;
		if (wrap) {
			const label = wrap.querySelector("[data-register-dropdown-label]");
			const options = Array.from(wrap.querySelectorAll(".property-register-dropdown-option[data-value]"));
			option = options.find((btn) => String(btn.dataset.value || "").trim() === String(select.value || "").trim()) || null;
			if (!option && id === "propertyTypeSelect") {
				option = findRealjejuPropertyTypeOption(select, nextValue);
				if (option) {
					nextValue = String(option.dataset.value || "").trim();
					select.value = nextValue;
				}
			}
			if (!option && nextValue) {
				option = options.find((btn) => String(btn.textContent || "").replace(/\s+/g, " ").trim() === nextValue) || null;
				if (option) {
					nextValue = String(option.dataset.value || "").trim();
					select.value = nextValue;
				}
			}
			select.dataset.selectedValue = select.value;
			wrap.dataset.selectedValue = select.value;
			wrap.querySelectorAll(".property-register-dropdown-option").forEach((btn) => {
				btn.classList.toggle("active", btn === option);
			});
			if (label) label.textContent = option ? option.textContent.trim() : (select.options[select.selectedIndex]?.textContent || "");
		} else {
			select.dataset.selectedValue = select.value;
		}
		select.dispatchEvent(new Event("change", { bubbles: true }));
	}

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

	function parseCrossroadFieldMap(text)
	{
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
				if (colon) {
					label = colon[1];
					content = colon[2];
				} else {
					const arrow = row.match(/^([^>＞〉→▶]+)\s*(?:>|＞|〉|→|▶)\s*(.+)$/);
					if (!arrow) return;
					label = arrow[1];
					content = arrow[2];
				}
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

	function findPropertyTypeTextFromQuickSource(text, fields)
	{
		const fieldText = fieldValue(fields, ["매물종류", "매물 유형", "매물유형", "물건종류", "물건 유형", "물건유형", "부동산종류", "부동산 유형", "부동산유형", "종류"]);
		if (fieldText) return fieldText;
		const rows = String(text || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
		for (const row of rows.slice(0, 20)) {
			const match = row.match(/(?:매물\s*종류|매물\s*유형|물건\s*종류|물건\s*유형|부동산\s*종류|부동산\s*유형|종류)\s*(?:[:：>＞〉→▶\t ]+)\s*([^\n]+)/);
			if (match) return match[1].trim();
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
		const structuredLabels = new Set([
			"관리비", "관리비합계", "관리비포함내역", "관리비미포함내역", "부과사유", "부과기준",
			"해당동", "입주가능일", "방향", "지하층/지상층", "현관구조", "해당층/총층", "방/욕실수",
			// PATCH 2.294: 교차로 기본정보의 기전세금은 상세설명 제목 후보에서 제외
			"보증금", "월세금", "년세금", "연세금", "전세금", "기전세금", "매매가", "융자금여부", "주차가능여부",
			"건물종류", "건축물용도", "현업종", "추천업종", "총점포수", "사용전력", "용도", "방형태", "원룸종류",
			"총세대수", "사용승인일", "사용검사일", "준공일자", "일자확인불가", "위반건축물여부",
			"옵션", "총주차대수", "난방시설", "냉방시설", "가구", "가전", "주방/욕실", "건물보안", "기타시설",
			"지목", "용도지역", "대지면적", "건축면적", "연면적", "계약면적", "공급면적", "전용면적",
			"총동수", "총층수", "난방방식", "주차대수", "입주시기", "건설사", "타입", "분양세대수", "방수/욕실수", "베이"
		]);
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

	// PATCH 2.277: 교차로 추천중개업소 꼬리는 하단 10개 유효 줄 안에 있을 때만 상세설명에서 제외
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

	// PATCH 2.262: 본문 첫 줄은 제목으로 쓰고 상세설명에서는 첫 줄과 뒤 공백을 제거
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
		const fields = parseCrossroadFieldMap(value);
		const listingNo = value.split(/\r?\n/).map(extractPropertyListingNoCandidate).find(Boolean) || "";
		// PATCH 2.237: 교차로 간편등록 면적은 처음 5개 유효 줄만 기준으로 판정
		const firstLines = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5).join("\n");
		const title = getFirstMatch(value, /\[(?:전세|매매|월세|년세)\]\s*([^\n]+)/) || getFirstMatch(value, /\((?:디|D)-?\d+\)\s*([^\n]+)/i);
		const totalArea = getFirstMatch(firstLines, /연\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		// PATCH 2.240: 공급면적과 계약면적을 분리해서 원문 라벨 그대로 화면에 반영
		const supplyArea = getFirstMatch(firstLines, /공급\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const contractArea = getFirstMatch(firstLines, /계약\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const exclusiveArea = getFirstMatch(firstLines, /전용\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const buildingArea = getFirstMatch(firstLines, /건축\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const landArea = getFirstMatch(firstLines, /대지\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const approvalDate = fieldValue(fields, ["사용승인일"]) || getFirstMatch(value, /사용승인일\s*[:：]?\s*(\d{4}-\d{2}-\d{2})/);
		// PATCH 2.257: 총점포수/총세대수는 필드맵/원문 정규식에서 숫자가 잡히면 표시 대상으로 확정
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
		const basicFloorText = fieldValue(fields, ["지하층/지상층"]);
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
		const explicitPropertyTypeText = findPropertyTypeTextFromQuickSource(value, fields);
		// PATCH 2.284: 교차로 매물 유형은 처음 5줄 중 두 번째 줄을 최우선 기준으로 사용
		const firstFiveRows = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5);
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
		let parsedPropertyType = resolveRealjejuPropertyTypeValue(explicitPropertyTypeText);
		// PATCH 2.252: 오피스텔/오피스텔형은 숙박시설이어도 펜션보다 먼저 원룸/투룸으로 분류
		// PATCH 2.296: 교차로 두 번째 줄의 토지/임야는 건축물용도보다 우선해서 토지로 분류
		if (!parsedPropertyType) {
			if (/토지\s*\/\s*임야|토지|임야/.test(crossroadTypeLine)) parsedPropertyType = "land";
			else if (/오피스텔(?:형)?/.test(buildingKindText) && /숙박시설/.test(buildingUseText)) parsedPropertyType = "room";
			else if (/오피스텔(?:형)?/.test(buildingKindText) && /업무시설/.test(buildingUseText)) parsedPropertyType = "officetel";
			else if (/상가|상가점포|상가건물/.test(crossroadTypeLine)) parsedPropertyType = "store";
			else if (/사무실/.test(crossroadTypeLine)) parsedPropertyType = "office";
			// PATCH 2.292: 교차로 두 번째 줄 또는 건물종류의 공장/창고는 공장 / 창고 매물로 분류
			else if (/공장\s*\/\s*창고|공장|창고/.test(crossroadTypeLine) || /공장|창고/.test(buildingKindText) || /공장|창고시설/.test(buildingUseText)) parsedPropertyType = "factory_warehouse";
			// PATCH 2.284: 사무실 보조 판정은 건물종류가 사무실일 때만 적용
			else if (/중소형사무실|대형사무실/.test(buildingKindText)) parsedPropertyType = "office";
			else if (/상가|상가건물/.test(propertyTypeClues)) parsedPropertyType = "store";
			else if (/호텔/.test(propertyTypeClues)) parsedPropertyType = "hotel";
			else if (/펜션|콘도|모텔|숙박/.test(propertyTypeClues)) parsedPropertyType = "pension";
			else if (/토지\/임야|토지|임야/.test(propertyTypeClues) || (landTitleTypes.test(listingTypeTitle) && /토지\/임야/.test(firstLines))) parsedPropertyType = "land";
			else if (/오피스텔/.test(propertyTypeClues)) parsedPropertyType = "officetel";
			else if (/아파트|아이파크|뜨란채/.test(propertyTypeClues)) parsedPropertyType = "apartment";
			else if (/빌라|연립|다세대/.test(propertyTypeClues)) parsedPropertyType = "villa";
			else if (/다가구/.test(strongPropertyTypeClues) || (/다가구/.test(firstLines) && !/단독/.test(firstLines))) parsedPropertyType = "multi_family_house";
			else if (/단독|단독주택/.test(strongPropertyTypeClues) || /단독\/다가구/.test(firstLines)) parsedPropertyType = "house";
		}
		const basicFloor = basicFloorText.match(/(-|\d+)\s*\/\s*(\d+)/);
		const roomBath = rooms || fieldValue(fields, ["방/욕실수"]).match(/(\d+)\s*\/\s*(\d+)/);
		const dealTypes = [];
		// PATCH 2.249: 보증금만으로 월세를 체크하지 않고 첫 5줄의 거래유형과 실제 금액 항목으로만 판단
		const headlineDeal = getFirstMatch(firstLines, /^\s*\[(매매|전세|월세|년세)\]/m);
		if (headlineDeal) {
			const headlineDealMap = { "매매": "sale", "전세": "jeonse", "월세": "monthly", "년세": "yearly" };
			if (headlineDealMap[headlineDeal]) dealTypes.push(headlineDealMap[headlineDeal]);
		} else {
			if (getFirstMatch(value, /매매가\s*[:：]?\s*([^\n]+)/)) dealTypes.push("sale");
			if (fieldValue(fields, ["전세금"])) dealTypes.push("jeonse");
			if (fieldValue(fields, ["월세금"])) dealTypes.push("monthly");
			if (fieldValue(fields, ["년세금"]) || fieldValue(fields, ["연세금"])) dealTypes.push("yearly");
		}
		const direction = fieldValue(fields, ["방향"]) || getFirstMatch(value, /방향\s*[:：]?\s*([^\n]+)/);
		const directionBase = getFirstMatch(direction, /(거실|안방|현관출입문)\s*방향\s*기준/)
			|| getFirstMatch(value, /(거실|안방|현관출입문)\s*방향\s*기준/);
		const maintenanceIncludes = fieldValue(fields, ["관리비 포함 내역"]);
		const maintenanceBaseText = fieldValue(fields, ["부과기준"]);
		const maintenanceReasonText = fieldValue(fields, ["부과사유"]);
		const heatingText = fieldValue(fields, ["난방시설"]);
		const coolingText = fieldValue(fields, ["냉방시설"]);
		const furnitureText = fieldValue(fields, ["가구"]);
		const applianceText = fieldValue(fields, ["가전"]);
		const kitchenBathText = fieldValue(fields, ["주방/욕실", "주방 / 욕실"]);
		const securityText = fieldValue(fields, ["건물보안", "건물 보안"]);
		const etcFacilityText = fieldValue(fields, ["기타시설"]);
		const moveInText = fieldValue(fields, ["입주가능일"]);
		const moveInDate = parseMoveInDateText(moveInText);
		// PATCH 2.253: 간편등록에서는 대출 항목을 매물 유형과 무관하게 우선 확인 필요로 시작
		const loanStatus = "check";
		const maintenanceDetailType = /관리규약/.test(maintenanceReasonText)
			? "area_rule"
			: (/공용관리비는\s*면적|면적\/세대별/.test(maintenanceReasonText)
				? "common_area_usage"
				: (/세대별\s*사용량|사용량에\s*따라/.test(maintenanceReasonText)
					? "usage_by_household"
					: (/전체\s*사용량.*세대수/.test(maintenanceReasonText)
						? "divide_total"
						: (/미제시|미제공/.test(maintenanceReasonText) ? "broker_unprovided" : ""))));
		const address = normalizeAddress(value);
		const description = extractCrossroadDescription(value);
		const descriptionParts = splitCrossroadDescriptionTitle(description);

		return {
			propertyType: parsedPropertyType,
			buildingUse: buildingUseText,
			deal: dealTypes[0] || "",
			dealTypes,
			priceSale: parseMoneyToManwon(getFirstMatch(value, /매매가\s*[:：]?\s*([^\n]+)/)),
			priceMonthlyDeposit: parseMoneyToManwon(fieldValue(fields, ["보증금"])),
			priceMonthlyRent: parseMoneyToManwon(fieldValue(fields, ["월세금"])),
			priceYearlyRent: parseMoneyToManwon(fieldValue(fields, ["년세금"])),
			priceJeonse: parseMoneyToManwon(getFirstMatch(value, /전세금\s*[:：]?\s*([^\n]+)/)),
			listingNo,
			title: descriptionParts.title || title,
			address,
			supply: supply.replace(/,/g, ""),
			totalArea,
			exclusive: exclusive.replace(/,/g, ""),
			buildingArea,
			landArea,
			areaMode,
			landType,
			landUseZone,
			landRoad,
			approvalDate,
			storeCount,
			hasStoreCountSource,
			household,
			hasHouseholdSource,
			roomCount: roomBath ? roomBath[1] : "",
			bathCount: roomBath ? roomBath[2] : "",
			floorLevel: floors ? floors[1] : (basicFloor && basicFloor[1] !== "-" ? basicFloor[1] : ""),
			totalFloor: floors ? floors[2] : (basicFloor ? basicFloor[2] : ""),
			wholeBuildingFloor: !floors && !!(basicFloor && basicFloor[1] === "-"),
			dong: getFirstMatch(value, /해당동\s*[:：]?\s*([^\n]+)/).replace(/동$/, ""),
			direction: getFirstMatch(direction, /([가-힣]+향)/),
			directionBase,
			parkingTotal: parking ? parking[1].replace(/,/g, "") : "",
			parkingPer: parking ? parking[2] : "",
			maintenanceNone,
			maintenanceWon,
			maintenanceIncludes,
			maintenanceBase: /직전/.test(maintenanceBaseText) ? "prev_month" : (/3개월/.test(maintenanceBaseText) ? "recent_3_months" : (/1년/.test(maintenanceBaseText) ? "recent_1_year" : "")),
			maintenanceDetailType,
			loanStatus,
			parkingStatus: /주차가능/.test(fieldValue(fields, ["주차가능여부"]) || value) ? "possible" : (/주차불가/.test(fieldValue(fields, ["주차가능여부"]) || value) ? "impossible" : ""),
			heatingType: /개별난방/.test(heatingText) ? "individual" : (/중앙난방/.test(heatingText) ? "central" : (/지역난방/.test(heatingText) ? "district" : "")),
			heatingFuel: /도시가스|LNG/.test(heatingText) ? "도시가스" : (/LPG/.test(heatingText) ? "LPG" : (/기름/.test(heatingText) ? "기름" : "")),
			coolingText,
			furnitureText,
			applianceText,
			kitchenBathText,
			securityText,
			etcFacilityText,
			moveInDate,
			moveNegotiable: /협의/.test(moveInText || ""),
			moveNow: /즉시입주|즉시 입주/.test(moveInText || value),
			description: descriptionParts.title ? descriptionParts.body : description
		};
	}

	function applyParsedListing(parsed)
	{
		const propertyTypeSelect = $("propertyTypeSelect");
		if (propertyTypeSelect) {
			// PATCH 2.237: 간편등록 적용 전 면적 모드를 붙여넣은 5줄 기준으로 완전히 새로 설정
			propertyTypeSelect.dataset.areaMode = parsed.areaMode || "";
		}
		if (parsed.propertyType) {
			setSelectValue("propertyTypeSelect", parsed.propertyType);
			resolvePropertyRegisterTypeValue(propertyTypeSelect, parsed.propertyType);
		}
		if (parsed.buildingUse) setSelectValue("buildingUseSelect", parsed.buildingUse);
		if (propertyTypeSelect) {
			clearInput("exclusiveAreaM2Input");
			clearInput("exclusiveAreaPyInput");
			clearInput("supplyAreaM2Input");
			clearInput("supplyAreaPyInput");
			clearInput("landAreaM2Input");
			clearInput("landAreaPyInput");
			clearInput("landRoadInput");
			// PATCH 2.287: 간편등록을 다시 적용할 때 이전 토지종류/용도지역 선택값 제거
			setSelectValue("landTypeSelect", "");
			setSelectValue("landUseZoneSelect", "");
			if (typeof updatePropertyRegisterAreaFields === "function") updatePropertyRegisterAreaFields();
		}
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
		if (parsed.listingNo) setPropertyListingNoManualValue(parsed.listingNo);
		else setPropertyListingNoMode("auto");
		setInput("propertyAddressInput", parsed.address);
		setRadio("propertyAddressLocationMode", "rectangle");
		const addressInput = $("propertyAddressInput");
		if (addressInput && parsed.address) {
			addressInput.dataset.address1 = parsed.address;
			addressInput.dataset.publicAddress = parsed.address;
			addressInput.dataset.jibunAddress = parsed.address;
			addressInput.dataset.locationDisplayType = "rectangle";
		}
		setInput("supplyAreaM2Input", parsed.supply);
		setInput("exclusiveAreaM2Input", parsed.exclusive);
		setInput("landAreaM2Input", parsed.landArea);
		setInput("landRoadInput", parsed.landRoad);
		if (parsed.landType) setSelectValue("landTypeSelect", parsed.landType);
		if (parsed.landUseZone) setSelectValue("landUseZoneSelect", parsed.landUseZone);
		setInput("propertyApprovalDateInput", parsed.approvalDate);
		// PATCH 2.257: 새 붙여넣기마다 이전 총점포수/총세대수 값을 먼저 비우고 원문 값만 반영
		clearInput("propertyStoreCountInput");
		clearInput("propertyHouseholdCountInput");
		setInput("propertyStoreCountInput", parsed.storeCount);
		setInput("propertyHouseholdCountInput", parsed.household);
		syncQuickImportTotalCountRowsVisibility(parsed);
		if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
		syncQuickImportTotalCountRowsVisibility(parsed);
		setCheck("propertyRoomBathNotApplicableChk", false);
		// PATCH 2.299: 간편입력마다 이전 방/욕실 값을 먼저 비우고 0/0이면 해당없음으로 동기화
		clearInput("propertyRoomCountInput");
		clearInput("propertyBathCountInput");
		setInput("propertyRoomCountInput", parsed.roomCount);
		setInput("propertyBathCountInput", parsed.bathCount);
		if (typeof window.realjejuSyncPropertyRoomBathZeroState === "function") window.realjejuSyncPropertyRoomBathZeroState();
		setInput("propertyTotalFloorInput", parsed.totalFloor);
		clearInput("propertyCurrentFloorInput");
		setCheck("propertyWholeBuildingCheck", false);
		setCheck("propertyFloorLevelUseCheck", false);
		if (typeof clearPropertyFloorLevelRadios === "function") clearPropertyFloorLevelRadios();
		if (parsed.wholeBuildingFloor) {
			setInput("propertyCurrentFloorInput", "0");
			setCheck("propertyWholeBuildingCheck", true);
			if (typeof updatePropertyFloorLevelRadioState === "function") updatePropertyFloorLevelRadioState();
		}
		// PATCH 2.323: 해당층/총층이 숫자이면 해당층 입력에 넣고, 저/중/고 층급은 라디오로 처리
		else if (/^\d+$/.test(String(parsed.floorLevel || ""))) {
			setInput("propertyCurrentFloorInput", parsed.floorLevel);
		}
		else if (/^(저층|중층|고층)$/.test(String(parsed.floorLevel || ""))) {
			const floorLevelMap = { "저층": "low", "중층": "middle", "고층": "high" };
			clearInput("propertyCurrentFloorInput");
			setCheck("propertyFloorLevelUseCheck", true);
			setRadio("propertyFloorLevel", floorLevelMap[parsed.floorLevel]);
			if (typeof updatePropertyFloorLevelRadioState === "function") updatePropertyFloorLevelRadioState();
		}
		setInput("propertyDongInput", parsed.dong);
		if (parsed.direction) setSelectValue("propertyDirectionSelect", parsed.direction);
		if (parsed.directionBase) setSelectValue("propertyDirectionBaseSelect", parsed.directionBase);
		// PATCH 2.253: 간편등록 적용 시 대출/반려동물은 항상 확인 필요에서 시작
		if (parsed.loanStatus) setRadio("propertyLoan", parsed.loanStatus);
		setRadio("propertyPet", "check");
		if (typeof ensureDefaultCheckRadios === "function") ensureDefaultCheckRadios();
		if (parsed.parkingTotal || parsed.parkingStatus) {
			setRadio("propertyParking", parsed.parkingStatus || "possible");
			setInput("propertyParkingTotalInput", parsed.parkingTotal);
			setInput("propertyParkingPerInput", parsed.parkingPer);
		}
		if (parsed.maintenanceNone) {
			setMaintenanceTab("none");
		}
		else if (parsed.maintenanceWon) {
			const maintenanceWon = Number(String(parsed.maintenanceWon || "").replace(/[^0-9]/g, ""));
			const isUnder100k = Number.isFinite(maintenanceWon) && maintenanceWon > 0 && maintenanceWon < 100000;
			const includePrefix = isUnder100k ? "maintenanceFixedInclude" : "maintenanceInclude";
			[
				"maintenanceFixedIncludeElectricChk", "maintenanceFixedIncludeWaterChk", "maintenanceFixedIncludeCommonChk", "maintenanceFixedIncludeGasChk",
				"maintenanceFixedIncludeHeatingChk", "maintenanceFixedIncludeInternetChk", "maintenanceFixedIncludeTvChk", "maintenanceFixedIncludeEtcChk",
				"maintenanceIncludeElectricChk", "maintenanceIncludeWaterChk", "maintenanceIncludeCommonChk", "maintenanceIncludeGasChk",
				"maintenanceIncludeHeatingChk", "maintenanceIncludeInternetChk", "maintenanceIncludeTvChk", "maintenanceIncludeEtcChk"
			].forEach((id) => setCheck(id, false));
			clearInput("maintenanceFixedTotalInput");
			clearInput("maintenanceTotalInput");
			clearRadio("maintenanceFixedBase");
			clearRadio("maintenanceExtraBase");
			clearRadio("maintenanceDetailType");
			setMaintenanceTab(isUnder100k ? "fixed" : "extra");
			setCheck("maintenanceUnder100kChk", isUnder100k);
			setInput(isUnder100k ? "maintenanceFixedTotalInput" : "maintenanceTotalInput", parsed.maintenanceWon);
			const includes = parsed.maintenanceIncludes || "";
			// PATCH 2.274: 관리비 포함 내역이 없으면 공용관리비와 기타관리비를 기본 선택
			const hasIncludeText = !!includes.trim();
			setCheck(`${includePrefix}ElectricChk`, /전기/.test(includes));
			setCheck(`${includePrefix}WaterChk`, /수도/.test(includes));
			setCheck(`${includePrefix}CommonChk`, hasIncludeText ? /공용/.test(includes) : true);
			setCheck(`${includePrefix}GasChk`, /가스/.test(includes));
			setCheck(`${includePrefix}HeatingChk`, /난방/.test(includes));
			setCheck(`${includePrefix}InternetChk`, /인터넷/.test(includes));
			setCheck(`${includePrefix}TvChk`, /TV|티비/.test(includes));
			setCheck(`${includePrefix}EtcChk`, hasIncludeText ? /기타/.test(includes) : true);
			setRadio(isUnder100k ? "maintenanceFixedBase" : "maintenanceExtraBase", parsed.maintenanceBase || "recent_1_year");
			// PATCH 2.274: 부과기준이 비어 있으면 면적/세대별 공용관리비 + 사용량 기준을 기본 선택
			if (!isUnder100k) setRadio("maintenanceDetailType", parsed.maintenanceDetailType || "common_area_usage");
		}
		if (parsed.heatingType) setRadio("propertyHeating", parsed.heatingType);
		if (parsed.heatingFuel) setSelectValue("propertyHeatingFuelSelect", parsed.heatingFuel);
		if (parsed.moveInDate) {
			if (parsed.moveInDate === "즉시입주") {
				setCheck("propertyMoveInNowChk", true);
				setInput("propertyMoveInDateInput", "즉시입주");
			} else {
				setCheck("propertyMoveInNowChk", false);
				setInput("propertyMoveInDateInput", parsed.moveInDate);
			}
		}
		else if (parsed.moveNow) {
			setCheck("propertyMoveInNowChk", true);
			setInput("propertyMoveInDateInput", "즉시입주");
		}
		setCheck("propertyMoveInNegotiableChk", !!parsed.moveNegotiable);
		const furnitureText = parsed.furnitureText || parsed.description;
		if (/식탁/.test(furnitureText)) setCheck("furnitureTableChk", true);
		if (/침대/.test(furnitureText)) setCheck("furnitureBedChk", true);
		if (/책상/.test(furnitureText)) setCheck("furnitureDeskChk", true);
		if (/옷장/.test(furnitureText)) setCheck("furnitureClosetChk", true);
		if (/신발장/.test(furnitureText)) setCheck("furnitureShoesChk", true);
		if (/소파/.test(furnitureText)) setCheck("furnitureSofaChk", true);
		if (/붙박이장/.test(furnitureText)) setCheck("furnitureBuiltInChk", true);
		const applianceText = parsed.applianceText || parsed.description;
		if (/전자레인지/.test(applianceText)) setCheck("applianceMicrowaveChk", true);
		if (/세탁기/.test(applianceText)) setCheck("applianceWasherChk", true);
		if (/냉장고/.test(applianceText)) setCheck("applianceFridgeChk", true);
		if (/TV|티비/.test(applianceText)) setCheck("applianceTvChk", true);
		if (/가스레인지/.test(applianceText)) setCheck("applianceGasRangeChk", true);
		if (/인덕션/.test(applianceText)) setCheck("applianceInductionChk", true);
		if (/천장에어컨/.test(parsed.coolingText || parsed.description)) setCheck("coolingCeilingChk", true);
		const kitchenBathText = parsed.kitchenBathText || parsed.description;
		if (/식기세척기/.test(kitchenBathText)) setCheck("kitchenDishwasherChk", true);
		if (/음식물\s*처리기/.test(kitchenBathText)) setCheck("kitchenFoodWasteDisposerChk", true);
		if (/샤워부스/.test(kitchenBathText)) setCheck("bathShowerBoothChk", true);
		if (/비데/.test(kitchenBathText)) setCheck("bathBidetChk", true);
		if (/욕조/.test(kitchenBathText)) setCheck("bathTubChk", true);
		if (/싱크대/.test(kitchenBathText)) setCheck("kitchenSinkChk", true);
		const securityText = parsed.securityText || parsed.description;
		if (/자체경비원/.test(securityText)) setCheck("securityGuardChk", true);
		if (/사설경비원/.test(securityText)) setCheck("securityPrivateChk", true);
		if (/비디오폰/.test(securityText)) setCheck("securityVideoPhoneChk", true);
		if (/인터폰/.test(securityText)) setCheck("securityInterphoneChk", true);
		if (/카드키/.test(securityText)) setCheck("securityCardKeyChk", true);
		if (/CCTV|씨씨티비/i.test(securityText)) setCheck("securityCctvChk", true);
		if (/현관보안/.test(securityText)) setCheck("securityEntranceChk", true);
		if (/방범창/.test(securityText)) setCheck("securityWindowChk", true);
		if (/엘리베이터/.test(parsed.etcFacilityText || parsed.description)) setCheck("facilityElevatorChk", true);
		if (/엘리베이터/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcElevatorChk", true);
		if (/화재경보/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcFireAlarmChk", true);
		if (/환기시설/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcVentilationChk", true);
		if (/세탁실/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcLaundryChk", true);
		if (/중문/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcEntranceChk", true);
		if (/드레스룸/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcDressingChk", true);
		if (/다용도실/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcUtilityChk", true);
		if (/베란다/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcVerandaChk", true);
		if (/테라스/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcTerraceChk", true);
		if (/무인택배함/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcParcelBoxChk", true);
		if (/마당/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcYardChk", true);
		setInput("propertyDetailDescriptionInput", parsed.description);
		if (parsed.address && typeof window.realjejuApplyQuickAddressToLocationMap === "function") {
			window.realjejuApplyQuickAddressToLocationMap(parsed.address);
		}
	}

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
		const modal = $("quickPropertyModal");
		if (!modal) return;
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
		document.body.style.overflow = document.body.classList.contains("property-register-page-open") ? "" : document.body.style.overflow;
	}

	function setQuickPropertyPasteFeedback(label)
	{
		const button = $("quickPropertyPasteBtn");
		if (!button || !label) return;
		if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent || "텍스트 붙여넣기";
		window.clearTimeout(Number(button.dataset.feedbackTimer || 0));
		button.textContent = label;
		button.dataset.feedbackTimer = String(window.setTimeout(() => {
			button.textContent = button.dataset.defaultLabel || "텍스트 붙여넣기";
		}, 1400));
	}

	function insertQuickPropertyText(textarea, text)
	{
		const value = String(text || "");
		const start = typeof textarea.selectionStart === "number" ? textarea.selectionStart : textarea.value.length;
		const end = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : textarea.value.length;
		const before = textarea.value.slice(0, start);
		const after = textarea.value.slice(end);
		textarea.value = `${before}${value}${after}`;
		const nextPosition = start + value.length;
		textarea.selectionStart = nextPosition;
		textarea.selectionEnd = nextPosition;
		textarea.dispatchEvent(new Event("input", { bubbles: true }));
		textarea.focus();
	}

	async function pasteQuickPropertyText()
	{
		const textarea = $("quickPropertyTextarea");
		if (!textarea) return;
		textarea.focus();
		textarea.select();
		if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
			setQuickPropertyPasteFeedback("Ctrl+V로 붙여넣기");
			return;
		}
		try {
			if (navigator.permissions && typeof navigator.permissions.query === "function") {
				try {
					const permission = await navigator.permissions.query({ name: "clipboard-read" });
					if (permission?.state === "denied") {
						setQuickPropertyPasteFeedback("Ctrl+V로 붙여넣기");
						return;
					}
				}
				catch (_) {}
			}
			const text = await navigator.clipboard.readText();
			if (!text) {
				setQuickPropertyPasteFeedback("클립보드 비어 있음");
				return;
			}
			insertQuickPropertyText(textarea, text);
			setQuickPropertyPasteFeedback("붙여넣기 완료");
		}
		catch (err) {
			console.warn("간편 입력 클립보드 붙여넣기 실패:", err);
			setQuickPropertyPasteFeedback("Ctrl+V로 붙여넣기");
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
		const source = getQuickPropertySource();
		if (source !== "crossroad") {
			if (typeof openAuthErrorModal === "function") {
				openAuthErrorModal("현재 자동 입력은 교차로 기준으로 동작합니다.\n오일장, 네이버 블로그, 기타 기준은 별도 변환 규칙을 추가한 뒤 사용할 수 있어요.", "간편 매물 등록", null);
			}
			return;
		}
		applyParsedListing(parseCrossroadListing(text));
		closeQuickPropertyModal();
		if (typeof openAuthErrorModal === "function") {
			openAuthErrorModal("확인 가능한 항목을 자동 입력했습니다.\n주소와 좌표, 가격, 면적과 같은 중요 정보는 등록 전에 다시 한 번 확인해 주세요.", "간편 매물 등록", null);
		}
	}

	function bind()
	{
		const btn = $("quickPropertyRegisterBtn");
		if (!btn || btn.dataset.crossroadImportBound === "1") return;
		btn.dataset.crossroadImportBound = "1";
		bindQuickPropertySourceOptions();
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

	function goRealjejuHome(options = {})
	{
		const resetDetail = !!(options && options.resetDetail);
		const hasDetailQuery = /(?:^\?|&)id=/.test(String(window.location.search || ""));
		const shouldCollapseHome = resetDetail || !hasDetailQuery;

		if (resetDetail) {
			try {
				if (typeof closeDetailImageLightbox === "function") closeDetailImageLightbox();
			} catch (error) {}

			try {
				if (typeof closeDetailPanel === "function") closeDetailPanel();
			} catch (error) {}

			try {
				if (typeof hideRoadview === "function") Promise.resolve(hideRoadview()).catch(() => {});
			} catch (error) {}
		}

		try {
			if (typeof closeGlobalAccountDropdown === "function") closeGlobalAccountDropdown();
		} catch (error) {}

		try {
			if (typeof closePropertyRegisterPage === "function") closePropertyRegisterPage();
		} catch (error) {}

		try {
			if (typeof closeAdminPage === "function") closeAdminPage();
		} catch (error) {}

		// PATCH 2.316: 상단 홈 이동 시 기존 중개사 홈 패널도 함께 닫는다
		try {
			if (typeof closeBrokerHomePage === "function") closeBrokerHomePage();
		} catch (error) {}

		try {
			if (typeof closeMyInfoPage === "function") closeMyInfoPage();
		} catch (error) {}

		try {
			if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		} catch (error) {}

		const classesToRemove = ["auth-page-open", "property-register-page-open", "admin-page-open", "broker-home-page-open", "payment-page-open", "myinfo-page-open", "profile-edit-page-open", "broker-office-info-page-open", "broker-office-edit-page-open", "profile-page-open", "my-suite-page-open", "notice-page-open"];
		if (resetDetail) classesToRemove.push("detail-page-panel-open", "shared-detail-mode");
		document.body.classList.remove(...classesToRemove);
		if (shouldCollapseHome) {
			document.body.classList.add("sidebar-list-collapsed");
		}
		document.body.style.overflow = "";

		if (shouldCollapseHome && typeof state !== "undefined" && state) {
			state.isListOpen = false;
		}

		if (resetDetail && typeof state !== "undefined" && state) {
			state.selectedMarkerId = null;
			state.selectedMarkerIds = new Set();
			state.selectedClusterKey = null;
			state.selectionMode = null;
			state.lockedListIds = null;
		}

		if (resetDetail && typeof sidebar !== "undefined" && sidebar) {
			sidebar.classList.remove("expanded");
		}

		const mapWrap = document.querySelector(".map-wrap");
		if (mapWrap) {
			mapWrap.classList.remove("is-roadview-open");
			mapWrap.style.display = "";
		}
		const subTopbar = document.querySelector(".sub-topbar");
		if (subTopbar) subTopbar.style.display = "";

		const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) {
			propertyRegisterPage.setAttribute("aria-hidden", "true");
			propertyRegisterPage.style.display = "";
			propertyRegisterPage.classList.remove("open", "active", "is-open");
		}

		const propertyRegisterBottomBar = document.getElementById("propertyRegisterBottomBar");
		if (propertyRegisterBottomBar) {
			propertyRegisterBottomBar.style.display = "";
			propertyRegisterBottomBar.classList.remove("open", "active", "is-open");
		}

		const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) {
			adminPagePanel.setAttribute("aria-hidden", "true");
			adminPagePanel.style.display = "";
			adminPagePanel.classList.remove("open", "active", "is-open");
		}

		const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) {
			if (typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") window.realjejuReleaseFocusBeforeAriaHidden(brokerHomePanel);
			brokerHomePanel.setAttribute("aria-hidden", "true");
			brokerHomePanel.style.display = "";
			brokerHomePanel.classList.remove("open", "active", "is-open");
		}

		const authModal = document.getElementById("authModal");
		if (authModal) {
			authModal.classList.remove("open", "profile-page-mode");
			authModal.setAttribute("aria-hidden", "true");
		}

		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeEditPagePanel", "paymentPagePanel", "mySuitePanel", "noticePagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) {
				panel.setAttribute("aria-hidden", "true");
				panel.style.display = "";
				panel.classList.remove("open", "active", "is-open");
			}
		});

		if (resetDetail) {
			const sidebarDetailPanel = document.getElementById("sidebarDetailPanel");
			if (sidebarDetailPanel) {
				sidebarDetailPanel.style.display = "none";
				sidebarDetailPanel.style.opacity = "0";
				sidebarDetailPanel.style.pointerEvents = "none";
				sidebarDetailPanel.style.visibility = "hidden";
			}
		}

		const roadviewPanel = document.getElementById("roadviewPanel");
		if (resetDetail && roadviewPanel) roadviewPanel.classList.remove("open");

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

		try {
			if (shouldCollapseHome && typeof updateSidebarWidth === "function") updateSidebarWidth();
		} catch (error) {}

		try {
			if (resetDetail && typeof updateMarkerSelection === "function") updateMarkerSelection(null);
		} catch (error) {}

		try {
			if (typeof refreshClusterBadges === "function") refreshClusterBadges();
		} catch (error) {}

		try {
			if (typeof refreshMapLayout === "function") {
				refreshMapLayout();
				setTimeout(refreshMapLayout, 0);
				setTimeout(refreshMapLayout, 120);
				setTimeout(refreshMapLayout, 320);
				setTimeout(refreshMapLayout, 600);
			}
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
			// PATCH 2.551: Chrome 탭 복귀 시 TOKEN_REFRESHED/INITIAL_SESSION이 발생해도
			// 작성 중인 매물등록 화면을 닫거나 초기화하지 않는다.
			if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
			if (event === "SIGNED_OUT") {
				if (typeof applyLoggedOutAccountUI === "function") applyLoggedOutAccountUI();
				goRealjejuHome();
				return;
			}
			if (event === "SIGNED_IN") {
				if (typeof initRealjejuAccountUI === "function") initRealjejuAccountUI();
				const isWorkspaceOpen = document.body.classList.contains("property-register-page-open")
					|| document.body.classList.contains("admin-page-open")
					|| document.body.classList.contains("broker-home-page-open")
					|| document.body.classList.contains("payment-page-open")
					|| document.body.classList.contains("my-suite-page-open")
					|| document.body.classList.contains("myinfo-page-open")
					|| document.body.classList.contains("profile-edit-page-open")
					|| document.body.classList.contains("broker-office-info-page-open")
					|| document.body.classList.contains("broker-office-edit-page-open")
					|| document.body.classList.contains("profile-page-open");
				const hasOpenDetail = !!(currentDetailItem || /(?:^\?|&)id=/.test(String(window.location.search || "")));
				if (hasOpenDetail) return;
				if (!isWorkspaceOpen) goRealjejuHome();
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

/* ===== PATCH 2.152: 매물 등록 주소 입력 모달 ===== */
(function initPropertyAddressInputModal(){
	const addressInput = document.getElementById("propertyAddressInput");
	const modal = document.getElementById("propertyAddressSearchModal");
	if (!addressInput || !modal) return;

	const searchScreen = document.getElementById("propertyAddressSearchScreen");
	const detailScreen = document.getElementById("propertyAddressDetailScreen");
	const closeBtn = document.getElementById("propertyAddressSearchCloseBtn");
	const form = document.getElementById("propertyAddressSearchForm");
	const searchInput = document.getElementById("propertyAddressSearchInput");
	const guide = document.getElementById("propertyAddressSearchGuide");
	const results = document.getElementById("propertyAddressSearchResults");
	const editBtn = document.getElementById("propertyAddressEditBtn");
	const roadEl = document.getElementById("propertyAddressSelectedRoad");
	const jibunEl = document.getElementById("propertyAddressSelectedJibun");
	const detailInput = document.getElementById("propertyAddressDetailInput");
	const confirmBtn = document.getElementById("propertyAddressConfirmBtn");
	const mainDetailEl = document.getElementById("propertyAddressMainDetail");
	const addressWrap = addressInput.closest(".property-address-wrap");
	const propertyTypeSelect = document.getElementById("propertyTypeSelect");
	const detailHideRow = document.getElementById("propertyAddressHideRow");
	const detailHideCheck = document.getElementById("propertyAddressHideDetailCheck");
	const locationRow = document.getElementById("propertyAddressLocationRow");
	const locationMapEl = document.getElementById("propertyAddressLocationMap");
	const locationModeRadios = Array.from(document.querySelectorAll('input[name="propertyAddressLocationMode"]'));
	const locationHelp = document.getElementById("propertyAddressLocationHelp");
	const locationDirectSearchBtn = document.getElementById("propertyAddressLocationDirectSearchBtn");
	const locationDirectSearchBox = document.getElementById("propertyAddressLocationDirectSearchBox");
	const locationDirectSearchInput = document.getElementById("propertyAddressLocationDirectSearchInput");
	const detailHideTargetTypes = new Set(["house", "store", "office", "building", "factory_warehouse", "land"]);
	let selectedAddress = null;
	let addressLocationMap = null;
	let addressLocationMarker = null;
	let addressLocationRectangle = null;
	let addressLocationCenter = null;
	let addressLocationBounds = null;
	let isAddressRectangleDragging = false;
	let addressRectangleDragStartLatLng = null;
	const quickAddressFallbackCenter = { lat: 33.3617, lng: 126.5292 };

	// PATCH 2.262: 매물등록 새 글 시작 시 주소 지도와 좌표 상태를 완전히 비움
	function resetPropertyAddressLocationState(){
		selectedAddress = null;
		addressLocationCenter = null;
		addressLocationBounds = null;
		isAddressRectangleDragging = false;
		addressRectangleDragStartLatLng = null;
		addressLocationMarker?.setMap(null);
		addressLocationRectangle?.setMap(null);
		addressLocationMap?.setDraggable(true);
		locationRow?.classList.remove("open");
		locationRow?.removeAttribute("data-location-mode");
		locationRow?.setAttribute("aria-hidden", "true");
		locationDirectSearchBox?.classList.remove("open");
		if (locationDirectSearchInput) locationDirectSearchInput.value = "";
		if (locationHelp) locationHelp.textContent = "지도상에 표시된 사각형을 원하는 지역으로 끌어다 놓으세요.";
		detailHideRow?.classList.remove("open");
		if (detailHideCheck) detailHideCheck.checked = false;
		if (detailInput) detailInput.value = "";
		if (mainDetailEl) mainDetailEl.textContent = "";
		addressWrap?.classList.remove("has-detail-address");
		const rectangleMode = locationModeRadios.find((radio) => radio.value === "rectangle");
		if (rectangleMode) rectangleMode.checked = true;
		[
			"address1", "address2", "publicAddress", "privateAddress", "hideDetailJibun",
			"roadAddress", "jibunAddress", "zonecode", "buildingName", "complexName", "detailAddress", "lat", "lng",
			"locationDisplayType", "locationSwLat", "locationSwLng", "locationNeLat", "locationNeLng"
		].forEach((key) => {
			if (addressInput) delete addressInput.dataset[key];
		});
		window.REALJEJU_PROPERTY_ADDRESS = null;
	}

	function normalizeAddressResult(item){
		const buildingName = String(item?.road_address?.building_name || item?.building_name || item?.place_name || "").trim();
		const appendBuildingName = (value) => {
			const text = String(value || "").trim();
			if (!text || !buildingName || text.includes(buildingName)) return text;
			return `${text} ${buildingName}`;
		};
		const appendRoadBuildingName = (value) => {
			const text = String(value || "").trim();
			if (!text || !buildingName || text.includes(buildingName)) return text;
			return `${text} (${buildingName})`;
		};
		const roadAddress = appendRoadBuildingName(item?.road_address?.address_name || item?.road_address_name || "");
		const jibunAddress = appendBuildingName(item?.address?.address_name || item?.address_name || "");
		const displayAddress = roadAddress || jibunAddress || item?.place_name || "";
		const zonecode = item?.road_address?.zone_no || item?.zone_no || "";
		return {
			roadAddress: roadAddress || displayAddress,
			jibunAddress: jibunAddress || displayAddress,
			buildingName,
			complexName: buildingName,
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
		const publicAddress = address1;
		addressInput.value = address1;
		addressInput.dataset.address1 = address1;
		addressInput.dataset.address2 = "";
		addressInput.dataset.publicAddress = publicAddress;
		addressInput.dataset.privateAddress = "";
		addressInput.dataset.hideDetailJibun = "0";
		addressInput.dataset.roadAddress = addressRoad;
		addressInput.dataset.jibunAddress = addressJibun;
		addressInput.dataset.zonecode = address.zonecode || "";
		addressInput.dataset.buildingName = address.buildingName || "";
		addressInput.dataset.complexName = address.complexName || address.buildingName || "";
		addressInput.dataset.detailAddress = "";
		if (address.lat && address.lng && !address.isFallbackCenter) {
			addressInput.dataset.lat = address.lat;
			addressInput.dataset.lng = address.lng;
		} else {
			delete addressInput.dataset.lat;
			delete addressInput.dataset.lng;
		}
		if (mainDetailEl) mainDetailEl.textContent = "";
		addressWrap?.classList.remove("has-detail-address");
	}

	function markQuickAddressFallbackMap()
	{
		if (locationHelp) locationHelp.textContent = "주소 좌표를 찾지 못했습니다. 위치 직접검색으로 지도를 이동해 주세요.";
	}

	function clearQuickAddressFallbackMap(message)
	{
		if (selectedAddress?.isFallbackCenter) {
			if (hasKakaoMapCore()) {
				renderAddressLocationMap();
			}
			addressLocationBounds = null;
			if (addressInput) {
				delete addressInput.dataset.lat;
				delete addressInput.dataset.lng;
				delete addressInput.dataset.locationSwLat;
				delete addressInput.dataset.locationSwLng;
				delete addressInput.dataset.locationNeLat;
				delete addressInput.dataset.locationNeLng;
			}
		}
		if (locationHelp) locationHelp.textContent = message || "주소 좌표를 찾지 못했습니다. 위치 직접검색으로 지도를 이동해 주세요.";
	}

	function hasKakaoMapCore()
	{
		return !!(
			window.kakao
			&& window.kakao.maps
			&& typeof window.kakao.maps.Map === "function"
			&& typeof window.kakao.maps.LatLng === "function"
		);
	}

	function waitForKakaoMapServices(timeout = 3200)
	{
		return new Promise((resolve) => {
			const isReady = () => !!(
				window.kakao
				&& window.kakao.maps
				&& window.kakao.maps.services
				&& typeof window.kakao.maps.LatLng === "function"
			);
			let settled = false;
			let loadRequested = false;
			const startedAt = Date.now();
			const finish = (ready) => {
				if (settled) return;
				settled = true;
				resolve(!!ready);
			};
			const tick = () => {
				if (isReady()) {
					finish(true);
					return;
				}
				if (Date.now() - startedAt >= timeout) {
					finish(false);
					return;
				}
				if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === "function" && !loadRequested) {
					loadRequested = true;
					window.kakao.maps.load(() => {
						if (isReady()) finish(true);
						else window.setTimeout(tick, 40);
					});
					return;
				}
				window.setTimeout(tick, 40);
			};
			tick();
		});
	}

	function buildPropertyAddressSearchQueries(keyword){
		const q = String(keyword || "").trim().replace(/\s+/g, " ");
		if (!q) return [];
		// PATCH 2.318: 제주시/서귀포시 주소 모두 카카오 주소검색 후보에 안정적으로 포함
		const splitCompactAdminAddress = (value) => String(value || "")
			.replace(/([가-힣]+(?:읍|면))([가-힣]+리)(?=\s|$|\d)/g, "$1 $2")
			.replace(/\s+/g, " ")
			.trim();
		const compactRoad = splitCompactAdminAddress(q
			.replace(/^제주도\s+/, "제주특별자치도 ")
			.replace(/^제주\s+/, "제주특별자치도 ")
			.replace(/([가-힣]+로)\s*(\d)/g, "$1 $2"));
		const jejuDoAlias = compactRoad.replace(/^제주특별자치도\s+/, "제주도 ");
		const cityOnly = compactRoad.replace(/^제주(?:특별자치도|도)\s+/, "");
		const base = Array.from(new Set([
			q,
			splitCompactAdminAddress(q),
			compactRoad,
			jejuDoAlias,
			cityOnly
		].filter(Boolean)));
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

	function getAddressLocationMode(){
		return locationModeRadios.find(radio => radio.checked)?.value || "rectangle";
	}

	function setAddressLocationDataset(mode){
		if (!addressInput) return;
		addressInput.dataset.locationDisplayType = mode;
		if (selectedAddress?.isFallbackCenter) {
			delete addressInput.dataset.lat;
			delete addressInput.dataset.lng;
			delete addressInput.dataset.locationSwLat;
			delete addressInput.dataset.locationSwLng;
			delete addressInput.dataset.locationNeLat;
			delete addressInput.dataset.locationNeLng;
			return;
		}
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

	function createKakaoBounds(bounds){
		if (!bounds || !window.kakao || !kakao.maps) return null;
		return new kakao.maps.LatLngBounds(
			new kakao.maps.LatLng(bounds.swLat, bounds.swLng),
			new kakao.maps.LatLng(bounds.neLat, bounds.neLng)
		);
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

	function moveAddressRectangleByDelta(latDiff, lngDiff){
		if (!addressLocationBounds || !window.kakao || !kakao.maps) return;
		addressLocationBounds = {
			swLat: addressLocationBounds.swLat + latDiff,
			swLng: addressLocationBounds.swLng + lngDiff,
			neLat: addressLocationBounds.neLat + latDiff,
			neLng: addressLocationBounds.neLng + lngDiff
		};
		const centerLat = (addressLocationBounds.swLat + addressLocationBounds.neLat) / 2;
		const centerLng = (addressLocationBounds.swLng + addressLocationBounds.neLng) / 2;
		addressLocationCenter = new kakao.maps.LatLng(centerLat, centerLng);
		selectedAddress.lat = centerLat;
		selectedAddress.lng = centerLng;
		selectedAddress.isFallbackCenter = false;
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
		const kakaoBounds = createKakaoBounds(addressLocationBounds);
		if (!kakaoBounds) return;
		if (!addressLocationRectangle) {
			addressLocationRectangle = new kakao.maps.Rectangle({
				map: addressLocationMap,
				bounds: kakaoBounds,
				strokeWeight: 3,
				strokeColor: getComputedStyle(document.documentElement).getPropertyValue("--property-address-location-rectangle-stroke").trim() || "#3B82F6",
				strokeOpacity: 0.95,
				fillColor: getComputedStyle(document.documentElement).getPropertyValue("--property-address-location-rectangle-fill").trim() || "rgba(59, 130, 246, 0.26)",
				fillOpacity: 0.7,
				clickable: false
			});
		} else {
			addressLocationRectangle.setBounds(kakaoBounds);
		}
		addressLocationRectangle.setMap(addressLocationMap);
		setAddressLocationDataset(getAddressLocationMode());
	}

	function renderAddressLocationMap(){
		if (!selectedAddress || !locationRow || !locationMapEl || !window.kakao || !kakao.maps) return;
		const lat = Number(selectedAddress.lat);
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
				selectedAddress.isFallbackCenter = false;
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
				const latDiff = mouseEvent.latLng.getLat() - addressRectangleDragStartLatLng.getLat();
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

	function applyAddressLocationMode(){
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

	function updateDetailHideRow(){
		if (!detailHideRow || !propertyTypeSelect) return;
		const isVisible = detailHideTargetTypes.has(propertyTypeSelect.value || "");
		detailHideRow.classList.toggle("open", isVisible);
		if (!isVisible && detailHideCheck) detailHideCheck.checked = false;
	}

	function openModal(){
		updateDetailHideRow();
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		showSearchScreen();
		setTimeout(() => searchInput && searchInput.focus(), 30);
	}

	function closeModal(){
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
	}

	function showSearchScreen(){
		searchScreen?.classList.add("open");
		detailScreen?.classList.remove("open");
		updateSearchValueState();
	}

	function showDetailScreen(address){
		selectedAddress = address;
		if (roadEl) roadEl.textContent = address.roadAddress || address.jibunAddress || "";
		if (jibunEl) jibunEl.textContent = address.jibunAddress || address.roadAddress || "";
		searchScreen?.classList.remove("open");
		detailScreen?.classList.add("open");
		setTimeout(() => detailInput && detailInput.focus(), 30);
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

	function renderMessage(message, className){
		if (guide) guide.style.display = "none";
		if (!results) return;
		results.classList.add("open");
		results.innerHTML = `<div class="${className || "property-address-search-empty"}">${message}</div>`;
	}

	function renderResults(items){
		if (guide) guide.style.display = "none";
		if (!results) return;
		results.classList.add("open");
		results.innerHTML = "";
		if (!items.length) {
			renderMessage("검색 결과가 없습니다.", "property-address-search-empty");
			return;
		}
		items.forEach((item) => {
			const address = normalizeAddressResult(item);
			const row = document.createElement("div");
			row.className = "property-address-search-result";
			row.innerHTML = `
				<p class="property-address-result-zone">${address.zonecode || ""}</p>
				<p class="property-address-result-line"><span class="property-address-result-badge">도로명</span><span>${address.roadAddress || address.jibunAddress || ""}</span></p>
				<p class="property-address-result-line"><span class="property-address-result-badge">지번</span><span>${address.jibunAddress || address.roadAddress || ""}</span></p>
				<button type="button" class="property-address-result-select">선택</button>
			`;
			row.querySelector(".property-address-result-select")?.addEventListener("click", () => showDetailScreen(address));
			results.appendChild(row);
		});
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

	async function searchAddressLocationDirect(){
		const query = String(locationDirectSearchInput?.value || "").trim();
		if (!query) return;
		const ready = await waitForKakaoMapServices();
		if (!ready) {
			if (locationHelp) locationHelp.textContent = "지도 검색 서비스를 불러온 뒤 다시 시도해 주세요.";
			return;
		}
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
				const list = await searchAddressByKeyword(q);
				if (list.length) {
					found = normalizeAddressResult(list[0]);
					break;
				}
			}
		}
		if (!found || !found.lat || !found.lng || !window.kakao || !kakao.maps) return;
		const lat = Number(found.lat);
		const lng = Number(found.lng);
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
		selectedAddress = {
			...(selectedAddress || {}),
			roadAddress: selectedAddress?.roadAddress || found.roadAddress || "",
			jibunAddress: selectedAddress?.jibunAddress || found.jibunAddress || found.roadAddress || query,
			zonecode: selectedAddress?.zonecode || found.zonecode || "",
			buildingName: selectedAddress?.buildingName || found.buildingName || "",
			complexName: selectedAddress?.complexName || found.complexName || found.buildingName || "",
			lat,
			lng,
			isFallbackCenter: false
		};
		const nextCenter = new kakao.maps.LatLng(lat, lng);
		addressLocationCenter = nextCenter;
		if (addressInput) {
			addressInput.dataset.lat = String(lat);
			addressInput.dataset.lng = String(lng);
		}
		if (!addressLocationMap) {
			renderAddressLocationMap();
		}
		if (!addressLocationMap) return;
		locationRow?.classList.add("open");
		locationRow?.setAttribute("aria-hidden", "false");
		addressLocationMap.relayout();
		addressLocationMap.setCenter(nextCenter);
		addressLocationMap.setLevel(3);
		addressLocationMarker?.setPosition(nextCenter);
		const mode = getAddressLocationMode();
		applyAddressLocationMode();
		setAddressLocationDataset(mode);
		if (window.REALJEJU_PROPERTY_ADDRESS && typeof window.REALJEJU_PROPERTY_ADDRESS === "object") {
			window.REALJEJU_PROPERTY_ADDRESS = {
				...window.REALJEJU_PROPERTY_ADDRESS,
				lat,
				lng,
				locationDisplayType: mode,
				locationBounds: addressLocationBounds
			};
		}
		if (locationHelp) locationHelp.textContent = "검색한 위치로 지도를 이동했습니다.";
		setTimeout(() => {
			if (!addressLocationMap) return;
			addressLocationMap.relayout();
			addressLocationMap.setCenter(nextCenter);
			addressLocationMarker?.setPosition(nextCenter);
			applyAddressLocationMode();
		}, 40);
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
		const ready = await waitForKakaoMapServices();
		if (!ready) {
			clearQuickAddressFallbackMap("주소 검색 서비스를 불러오지 못했습니다. 카카오 개발자 콘솔에 현재 로컬 주소를 허용 도메인으로 추가해 주세요.");
			console.warn("[REALJEJU 주소검색] 카카오 주소검색 서비스 사용 불가", {
				origin: window.location.origin,
				query: value
			});
			return false;
		}
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
				const list = await searchAddressByKeyword(q);
				if (list.length) {
					found = normalizeAddressResult(list[0]);
					break;
				}
			}
		}
		if (!found || !found.lat || !found.lng) {
			clearQuickAddressFallbackMap("주소 좌표를 찾지 못했습니다. 위치 직접검색으로 지도를 이동해 주세요.");
			console.warn("[REALJEJU 주소검색] 좌표 검색 실패", {
				origin: window.location.origin,
				query: value,
				queries
			});
			return false;
		}

		selectedAddress = found;
		applyAddressInputDataset(selectedAddress);
		renderAddressLocationMap();
		const addressRoad = found.roadAddress || "";
		const addressJibun = found.jibunAddress || addressRoad || value;
		const address1 = addressJibun || addressRoad || value;
		const publicAddress = address1;
		window.REALJEJU_PROPERTY_ADDRESS = {
			address1,
			address2: "",
			addressRoad,
			addressJibun,
			addressDetail: "",
			addressDisplay: publicAddress,
			publicAddress,
			privateAddress: "",
			hideDetailJibun: false,
			zonecode: found.zonecode || "",
			buildingName: found.buildingName || "",
			complexName: found.complexName || found.buildingName || "",
			lat: found.lat || "",
			lng: found.lng || "",
			locationDisplayType: getAddressLocationMode(),
			locationBounds: addressLocationBounds
		};
		return true;
	}

	// PATCH 2.322: 중개사 홈 수정 진입 시 저장된 주소와 좌표로 지도 영역을 즉시 복원
	function restorePropertyAddressLocation(saved)
	{
		const data = saved && typeof saved === "object" ? saved : {};
		const buildingName = data.buildingName || data.building_name || data.complexName || data.complex_name || "";
		const complexName = data.complexName || data.complex_name || buildingName;
		const addressRoad = data.addressRoad || data.roadAddress || "";
		const addressJibun = data.addressJibun || data.jibunAddress || data.address1 || data.addressDisplay || data.publicAddress || data.public_address || "";
		const address1 = data.address1 || addressJibun || addressRoad || "";
		const address2 = data.address2 || data.addressDetail || "";
		const publicAddress = data.publicAddress || data.public_address || data.addressDisplay || address1;
		const rawLat = data.lat;
		const rawLng = data.lng;
		const lat = rawLat === undefined || rawLat === "" ? NaN : Number(rawLat);
		const lng = rawLng === undefined || rawLng === "" ? NaN : Number(rawLng);
		if (!address1 && (!Number.isFinite(lat) || !Number.isFinite(lng))) return false;
		selectedAddress = {
			roadAddress: addressRoad || address1,
			jibunAddress: addressJibun || address1,
			zonecode: data.zonecode || "",
			buildingName,
			complexName,
			lat: Number.isFinite(lat) ? lat : quickAddressFallbackCenter.lat,
			lng: Number.isFinite(lng) ? lng : quickAddressFallbackCenter.lng,
			isFallbackCenter: !(Number.isFinite(lat) && Number.isFinite(lng))
		};
		if (addressInput) {
			addressInput.value = address1 || publicAddress;
			addressInput.dataset.address1 = address1;
			addressInput.dataset.address2 = address2;
			addressInput.dataset.publicAddress = publicAddress;
			addressInput.dataset.privateAddress = address2;
			addressInput.dataset.hideDetailJibun = data.hideDetailJibun ? "1" : "0";
			addressInput.dataset.roadAddress = addressRoad;
			addressInput.dataset.jibunAddress = addressJibun || address1;
			addressInput.dataset.zonecode = data.zonecode || "";
			addressInput.dataset.buildingName = buildingName;
			addressInput.dataset.complexName = complexName;
			addressInput.dataset.detailAddress = address2;
			if (Number.isFinite(lat) && Number.isFinite(lng)) {
				addressInput.dataset.lat = lat;
				addressInput.dataset.lng = lng;
			}
			addressInput.dispatchEvent(new Event("input", { bubbles: true }));
			addressInput.dispatchEvent(new Event("change", { bubbles: true }));
		}
		const mode = data.locationDisplayType || data.location_display_type || "marker";
		const modeRadio = locationModeRadios.find((radio) => radio.value === mode);
		if (modeRadio) modeRadio.checked = true;
		if (mainDetailEl) mainDetailEl.textContent = address2 ? `[${address2}]` : "";
		addressWrap?.classList.toggle("has-detail-address", !!address2);
		if (window.kakao && kakao.maps) {
			renderAddressLocationMap();
			if (selectedAddress.isFallbackCenter) markQuickAddressFallbackMap();
		}
		window.REALJEJU_PROPERTY_ADDRESS = {
			address1,
			address2,
			addressRoad,
			addressJibun: addressJibun || address1,
			addressDetail: address2,
			addressDisplay: publicAddress,
			publicAddress,
			privateAddress: address2,
			hideDetailJibun: !!data.hideDetailJibun,
			zonecode: data.zonecode || "",
			buildingName,
			complexName,
			lat: Number.isFinite(lat) ? lat : "",
			lng: Number.isFinite(lng) ? lng : "",
			locationDisplayType: getAddressLocationMode(),
			locationBounds: addressLocationBounds
		};
		return true;
	}

	async function handleSearch(){
		const query = String(searchInput?.value || "").trim();
		if (!query) {
			renderGuide();
			searchInput?.focus();
			return;
		}
		const ready = await waitForKakaoMapServices();
		if (!ready) {
			renderMessage("주소 검색 서비스를 불러오지 못했습니다.", "property-address-search-empty");
			return;
		}
		renderMessage("주소를 검색하는 중입니다.", "property-address-search-loading");
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
					const key = `${normalized.roadAddress}|${normalized.jibunAddress}`;
					if (key.trim() && !seen.has(key)) {
						seen.add(key);
						merged.push(item);
					}
				});
				if (merged.length >= 8) break;
			}
		}
		if (!merged.length) {
			renderMessage("검색 결과가 없습니다. 주소 검색 연결 상태는 브라우저 콘솔에서 확인할 수 있습니다.", "property-address-search-empty");
			return;
		}
		renderResults(merged.slice(0, 8));
	}

	function confirmAddress(){
		if (!selectedAddress) return;
		const addressRoad = selectedAddress.roadAddress || "";
		const addressJibun = selectedAddress.jibunAddress || "";
		const address2 = String(detailInput?.value || "").trim();
		const address1 = addressJibun || addressRoad || "";
		const hideDetailJibun = !!(detailHideRow?.classList.contains("open") && detailHideCheck?.checked);
		const publicAddress = hideDetailJibun ? getPublicRegionAddress(address1) : address1;
		addressInput.value = address1;
		addressInput.dataset.address1 = address1;
		addressInput.dataset.address2 = address2;
		addressInput.dataset.publicAddress = publicAddress;
		addressInput.dataset.privateAddress = address2;
		addressInput.dataset.hideDetailJibun = hideDetailJibun ? "1" : "0";
		addressInput.dataset.roadAddress = addressRoad;
		addressInput.dataset.jibunAddress = addressJibun;
		addressInput.dataset.zonecode = selectedAddress.zonecode || "";
		addressInput.dataset.buildingName = selectedAddress.buildingName || "";
		addressInput.dataset.complexName = selectedAddress.complexName || selectedAddress.buildingName || "";
		addressInput.dataset.detailAddress = address2;
		addressInput.dataset.lat = selectedAddress.lat || "";
		addressInput.dataset.lng = selectedAddress.lng || "";
		setAddressLocationDataset(getAddressLocationMode());
		if (mainDetailEl) {
			mainDetailEl.textContent = address2 ? `[${address2}]` : "";
		}
		addressWrap?.classList.toggle("has-detail-address", !!address2);
		renderAddressLocationMap();
		window.REALJEJU_PROPERTY_ADDRESS = {
			address1,
			address2,
			addressRoad,
			addressJibun,
			addressDetail: address2,
			addressDisplay: publicAddress,
			publicAddress,
			privateAddress: address2,
			hideDetailJibun,
			zonecode: selectedAddress.zonecode || "",
			buildingName: selectedAddress.buildingName || "",
			complexName: selectedAddress.complexName || selectedAddress.buildingName || "",
			lat: selectedAddress.lat || "",
			lng: selectedAddress.lng || "",
			locationDisplayType: getAddressLocationMode(),
			locationBounds: addressLocationBounds
		};
		closeModal();
	}

	addressInput.addEventListener("click", openModal);
	addressInput.addEventListener("focus", openModal);
	addressInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			openModal();
		}
	});
	let propertyAddressBackdropPointerStarted = false;

	closeBtn?.addEventListener("click", closeModal);
	modal.addEventListener("pointerdown", (e) => {
		propertyAddressBackdropPointerStarted = e.target === modal;
	});
	modal.addEventListener("click", (e) => {
		if (propertyAddressBackdropPointerStarted && e.target === modal) closeModal();
		propertyAddressBackdropPointerStarted = false;
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
	});
	form?.addEventListener("submit", (e) => {
		e.preventDefault();
		handleSearch();
	});
	searchInput?.addEventListener("input", updateSearchValueState);
	propertyTypeSelect?.addEventListener("change", updateDetailHideRow);
	locationDirectSearchBtn?.addEventListener("click", () => {
		if (!locationDirectSearchBox?.classList.contains("open")) {
			locationDirectSearchBox?.classList.add("open");
			setTimeout(() => locationDirectSearchInput?.focus(), 20);
			return;
		}
		searchAddressLocationDirect();
	});
	locationDirectSearchInput?.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			searchAddressLocationDirect();
		}
	});
	locationModeRadios.forEach(radio => radio.addEventListener("change", applyAddressLocationMode));
	document.addEventListener("mouseup", () => {
		if (!isAddressRectangleDragging) return;
		isAddressRectangleDragging = false;
		addressRectangleDragStartLatLng = null;
		addressLocationMap?.setDraggable(true);
		setAddressLocationDataset(getAddressLocationMode());
	});
	updateDetailHideRow();
	window.realjejuResetPropertyAddressLocation = resetPropertyAddressLocationState;
	window.realjejuApplyQuickAddressToLocationMap = applyQuickAddressToLocationMap;
	window.realjejuRestorePropertyAddressLocation = restorePropertyAddressLocation;
	editBtn?.addEventListener("click", showSearchScreen);
	confirmBtn?.addEventListener("click", confirmAddress);
})();

/* PATCH 2.361: 매물 등록/수정 완료 확인 후 중개사 홈 이동을 확인 버튼 클릭 기준으로 강제 보장 */
(function () {
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

	function forceOpenBrokerHomeAfterPropertySave() {
		const savedListingId = window.REALJEJU_LAST_SAVED_LISTING_ID || "";
		try {
			if (typeof window.resetPropertyRegisterFormFields === "function") window.resetPropertyRegisterFormFields();
		} catch (error) {}
		try {
			if (typeof window.closePropertyRegisterPage === "function") window.closePropertyRegisterPage();
		} catch (error) {}
		try {
			if (typeof window.closeAdminPage === "function") window.closeAdminPage();
		} catch (error) {}
		try {
			if (typeof window.openBrokerHomePage === "function") {
				window.openBrokerHomePage(savedListingId);
				return;
			}
		} catch (error) {}

		// openBrokerHomePage 접근이 실패해도 화면 전환은 보장
		document.body.classList.remove("property-register-page-open", "admin-page-open");
		document.body.classList.add("broker-home-page-open");
		const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "true");
		const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");
		const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "false");
	}

	document.addEventListener("click", function (event) {
		const confirmBtn = event.target && event.target.closest ? event.target.closest("#authErrorConfirmBtn") : null;
		if (!confirmBtn) return;
		if (!isPropertySaveCompleteModal()) return;
		setTimeout(forceOpenBrokerHomeAfterPropertySave, 0);
		setTimeout(forceOpenBrokerHomeAfterPropertySave, 80);
	}, true);
})();

(function(){
  const _alert = window.alert;
  window.alert = function(msg){
    _alert(msg);
    try{
      const txt = String(msg || '');
      if(txt.includes('매물 등록이 완료') || txt.includes('매물 수정이 완료')){
        if(typeof openBrokerHomePage === 'function'){
          openBrokerHomePage();
        }
      }
    }catch(e){}
  };
})();


/* ===== PATCH 2.365: 이용권 결제 탭 / 테스트 결제 버튼 ===== */
(function bindPaymentPageEvents()
{
	function bind()
	{
		document.querySelectorAll('[data-payment-tab]').forEach((btn) => {
			if (btn.dataset.paymentBound === "true") return;
			btn.dataset.paymentBound = "true";
			btn.addEventListener("click", () => {
				const target = btn.getAttribute("data-payment-tab");
				document.querySelectorAll("[data-payment-tab]").forEach((tab) => {
					const active = tab === btn;
					tab.classList.toggle("active", active);
					tab.setAttribute("aria-selected", active ? "true" : "false");
				});
				document.querySelectorAll("[data-payment-panel]").forEach((panel) => {
					panel.classList.toggle("active", panel.getAttribute("data-payment-panel") === target);
				});
			});
		});

		document.querySelectorAll(".payment-plan-btn[data-plan], .payment-extra-item").forEach((btn) => {
			if (btn.dataset.paymentButtonBound === "true") return;
			btn.dataset.paymentButtonBound = "true";
			btn.addEventListener("click", () => {
				if (btn.classList.contains("is-current") || btn.disabled) return;
				alert("토스페이먼츠 연동 준비중입니다. 테스트 결제 연결 후 실제 결제가 가능합니다.");
			});
		});

	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

/* PATCH 2.551: 프로필 공통 푸터는 실제 활성 화면에만 표시 */
(function bindProfileCommonFooterVisibility()
{
	const footerScreenIds = [
		"authProfileSetupScreen",
		"authMyInfoScreen",
		"authBrokerOfficeInfoScreen"
	];
	const profileScreenIds = footerScreenIds.concat(["authBrokerOfficeScreen"]);

	function isScreenOpen(id)
	{
		const screen = document.getElementById(id);
		return !!(screen && !screen.classList.contains("auth-screen-hidden"));
	}

	function update()
	{
		const footer = document.querySelector(".auth-profile-common-footer");
		if (!footer) return;
		const activeScreenId = footerScreenIds.find(isScreenOpen);
		const shouldShow = !!activeScreenId;
		footer.hidden = !shouldShow;
		footer.classList.toggle("is-visible", shouldShow);
		footer.classList.remove("is-positioned");
		["position", "top", "left", "transform", "width", "z-index"].forEach(function(prop) {
			footer.style.removeProperty(prop);
		});
		const dialog = document.querySelector("#authModal .auth-modal-dialog");
		if (dialog) {
			dialog.style.removeProperty("min-height");
			dialog.style.removeProperty("padding-bottom");
		}
		if (shouldShow && activeScreenId) {
			const activeScreen = document.getElementById(activeScreenId);
			if (activeScreen && activeScreen.nextElementSibling !== footer) {
				activeScreen.insertAdjacentElement("afterend", footer);
			}
		}
	}

	function bind()
	{
		update();
		profileScreenIds.forEach(function(id) {
			const screen = document.getElementById(id);
			if (!screen) return;
			new MutationObserver(update).observe(screen, {
				attributes: true,
				attributeFilter: ["class"]
			});
		});
		const authModal = document.getElementById("authModal");
		if (authModal) {
			new MutationObserver(update).observe(authModal, {
				attributes: true,
				attributeFilter: ["class", "aria-hidden"]
			});
		}
		document.addEventListener("click", function() {
			setTimeout(update, 0);
		}, true);
		window.addEventListener("resize", function() {
			setTimeout(update, 0);
		});
		if (window.ResizeObserver) {
			profileScreenIds.forEach(function(id) {
				const screen = document.getElementById(id);
				if (screen) new ResizeObserver(update).observe(screen);
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();
