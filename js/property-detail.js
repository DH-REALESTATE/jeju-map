// REALJEJU property-detail.js - split from realjeju_2.361(3).html

const textarea = document.getElementById("propertyDetailDescriptionInput");

const counter = document.getElementById("propertyDetailDescriptionCount");
	if (!textarea || !counter) return;

const DETAIL_QUERY_KEY = "id";

function getDetailUrlById(id)
{

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

let currentDetailItem = null;

let detailAreaMode = "total";

let allowDetailOpenFromListClick = false;

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

const detailInfoList = document.getElementById("detailInfoList");

const detailFeatures = document.getElementById("detailFeatures");

const detailPhone = document.getElementById("detailPhone");

const detailMapBtn = document.getElementById("detailMapBtn");

const detailRoadviewBtn = document.getElementById("detailRoadviewBtn");

const detailCallBtn = document.getElementById("detailCallBtn");

const detailShareBtn = document.getElementById("detailShareBtn");

const detailShareMenu = document.getElementById("detailShareMenu");

const detailAuthTrigger = document.getElementById("detailAuthTrigger");

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

const detailAgentAddress = document.getElementById("detailAgentAddress");

const detailAgentRegNo = document.getElementById("detailAgentRegNo");

const detailAgentPhoneInline = document.getElementById("detailAgentPhoneInline");

const detailImageLightbox = document.getElementById("detailImageLightbox");

const detailImageLightboxImg = document.getElementById("detailImageLightboxImg");

const detailImageLightboxClose = document.getElementById("detailImageLightboxClose");

const detailImageLightboxPrev = document.getElementById("detailImageLightboxPrev");

const detailImageLightboxNext = document.getElementById("detailImageLightboxNext");

const detailSummaryTop = document.querySelector(".detail-summary-top");

function syncSummaryBadgeRow()
{
	if (!detailSummaryTop || !detailSummaryDealBadge || !detailSummaryTypeBadge) return;
	if (detailSummaryDealBadge.parentElement !== detailSummaryTop) {
		detailSummaryTop.appendChild(detailSummaryDealBadge);
	}
}

const detailScroll = document.querySelector(".detail-scroll");

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

		if (detailSummaryUnitPrice) {

const unitPriceText = formatUnitPriceLine(currentDetailItem);
			detailSummaryUnitPrice.textContent = unitPriceText;
			detailSummaryUnitPrice.style.display = unitPriceText ? "block" : "none";
		}
	}
}

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

const text = String(typeText || "").trim();
	if (["전", "대", "답", "과수원", "목장용지", "임야", "토지", "토지ㆍ임야"].includes(text)) return getLandTypeDetailLabel(text);
	if (["다가구", "다가구주택"].includes(text)) return "다가구주택";
	if (["단독", "단독주택"].includes(text)) return "단독주택";
	if (text === "연립") return "빌라";
	if (isHotelType(text)) return "호텔";
	if (isPensionType(text)) return "펜션";
	return text || "-";
}

function formatUnitPriceLine(detailItem)
{

const totalWon = parsePriceTextToWon(detailItem?.price || "");

const areaM2 = getPrimaryAreaForUnitPrice(detailItem?.area || "", detailItem?.type || "");

	if (!Number.isFinite(totalWon) || !Number.isFinite(areaM2) || areaM2 <= 0) return "";

function getLandTypeDetailLabel(typeText)
{

function setDetailAreaValueHTML(valueText)
{
	if (!detailAreaValue) return;

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

		detailAreaLabel.textContent = showSupply ? "면적(계약)" : "면적(전용)";
		setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

		if (detailAreaTypeToggleBtn) {
			detailAreaTypeToggleBtn.style.display = "inline-flex";
		}
		return;
	}

	if (isCommercialType(typeText)) {

const raw = String(detailItem.area || "-").trim();

		if (/계약|전용/.test(raw)) {

const showSupply = detailAreaMode === "supply";

const targetValue = showSupply ? parsed.supply : parsed.private;

			detailAreaLabel.textContent = showSupply ? "면적(계약)" : "면적(전용)";
			setDetailAreaValueHTML(Number.isFinite(targetValue) ? formatSingleAreaValue(targetValue, unit) : "-");

			if (detailAreaTypeToggleBtn) {
				detailAreaTypeToggleBtn.style.display = "inline-flex";
			}
			return;
		}

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

		detailAreaLabel.textContent = showSupply ? "면적(계약)" : "면적(전용)";
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

		detailAreaLabel.textContent = showSupply ? "면적(공급)" : "면적(전용)";
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

async function resolveDetailData(item)
{
	const [info, imageData, agent] = await Promise.all([
	loadPropertyInfo(item),
	loadPropertyImages(item),
	loadAgent(item.agent_folder)
	]);

function renderDetailInfoRows(info)
{

const sections = Array.isArray(info.sections) ? info.sections : [];

	if (sections.length) {
		detailInfoList.innerHTML = `
		<div class="detail-info-sections">
		${sections.map(section => {

const rows = Array.isArray(section.rows)
			? section.rows.filter(row => String(row?.value || "").trim() !== "")
			: [];

			if (!rows.length) return "";

			return `
			<div class="detail-info-section">
			<div class="detail-info-section-title">${escapeHtml(section.title || "")}</div>
			<div class="detail-info-list">
			${rows.map(row => `
			<div class="detail-info-row">
			<div class="detail-info-label">${escapeHtml(row.label || "")}</div>
			<div class="detail-info-value">${escapeHtml(row.value || "")}</div>
			</div>
			`).join("")}
			</div>
			</div>
			`;
		}).join("")}
		</div>
		`;
		return;
	}

const rows = Array.isArray(info.infoRows)
	? info.infoRows.filter(row => String(row?.value || "").trim() !== "")
	: [];

	if (!rows.length) {
		detailInfoList.innerHTML = "";
		return;
	}

	detailInfoList.innerHTML = `
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
}

function renderHeroSlider(images)
{
	currentHeroImages = images;
	currentHeroIndex = 0;

	detailHeroSlides.innerHTML = images.map((src, index) => `
	<div class="detail-hero-slide ${index === 0 ? 'active' : ''}" style="background-image:url('${escapeHtml(src)}')"></div>
	`).join("");

	detailHeroDots.innerHTML = images.map((_, index) => `
	<button type="button" class="detail-hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
	`).join("");

	detailHeroPrevBtn.style.display = images.length > 1 ? "flex" : "none";
	detailHeroNextBtn.style.display = images.length > 1 ? "flex" : "none";
	detailHeroDots.style.display = images.length > 1 ? "flex" : "none";

	detailHero.style.backgroundImage = images.length ? `url('${escapeHtml(images[0])}')` : "";
}

const slides = detailHeroSlides.querySelectorAll(".detail-hero-slide");

const dots = detailHeroDots.querySelectorAll(".detail-hero-dot");

	slides.forEach((slide, i) => {
		slide.classList.toggle("active", i === currentHeroIndex);
	});

	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i === currentHeroIndex);
	});

	detailHero.style.backgroundImage = `url('${escapeHtml(currentHeroImages[currentHeroIndex])}')`;
}

function openDetailImageLightbox()
{
	if (!currentHeroImages.length) return;
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
}

async function openDetailPanel(item, options = {})
{
	const { syncUrl = true, replaceUrl = false } = options || {};
	if (syncUrl && item && item.id != null) {
		syncDetailUrl(item.id, { replace: replaceUrl });
	}
	if (!allowDetailOpenFromListClick) return;
	if (shouldUseSharedDetailMode()) {
		setSharedDetailMode(true);
	} else {
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
	updateSidebarWidth();
	refreshMapLayout();

const detailItem = await resolveDetailData(item);
	currentDetailItem = detailItem;

const heroImages = getHeroImages(detailItem);
	renderHeroSlider(heroImages);

const listingNoText = String(detailItem.id || detailItem.listingNo || "").replace(/매물번호\s*/g, "").trim();
	if (detailTopbarId) {
		detailTopbarId.textContent = listingNoText ? `매물번호 : ${listingNoText}` : "";
	}
	if (detailListingNo) {
		detailListingNo.textContent = listingNoText ? `매물번호 : ${listingNoText}` : "";
	}
	detailTitle.textContent = detailItem.title || "";
	detailPrice.textContent = `${detailItem.dealType || ""} ${detailItem.price || ""}`.trim();
	detailAddress.textContent = `${detailItem.address || ""}`.trim();

	if (detailHeroBadge) detailHeroBadge.style.display = "none";
	detailHeroBadge.textContent = detailItem.type || "";
	detailHeroBadge.style.display = detailItem.type ? "inline-flex" : "none";

	detailHeroDeal.textContent = detailItem.dealType || "";
	detailHeroPrice.textContent = detailItem.price || "";
	detailHeroAddress.textContent = `${detailItem.address || ""}`.trim();

	detailHeroFeatures.innerHTML = "";

	detailAreaMode = /콘도/.test(detailItem.type || "")
	? "build"
	: ((isApartmentType(detailItem.type || "") || /원룸|투룸/.test(detailItem.type || "") || isHotelPensionType(detailItem.type || "")) ? "private" : "total");
	detailAreaValue.dataset.areaRaw = detailItem.area || "-";
	detailAreaValue.dataset.areaUnit = globalAreaUnit;
	detailAreaValue.dataset.areaType = detailItem.type || "";
	if (detailAreaToggleBtn) {
		detailAreaToggleBtn.style.display = (isApartmentType(detailItem.type || "") || /오피스텔|원룸|투룸/.test(detailItem.type || "") || isHotelPensionType(detailItem.type || "")) ? "inline-flex" : "none";
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
	detailRoadviewBtn.style.display = detailItem.linkKakaotalk ? "inline-flex" : "none";

	detailMapBtn.onclick = () => {
		if (!detailItem.linkCrossroad) return;
		window.open(detailItem.linkCrossroad, "_blank");
	};

	detailRoadviewBtn.onclick = () => {
		if (!detailItem.linkKakaotalk) return;
		window.open(detailItem.linkKakaotalk, "_blank");
	};
}

function hardCloseDetailPanel()
{

const panel = document.getElementById('sidebarDetailPanel');
	if (panel) {
		panel.style.display = 'none';
		panel.style.opacity = '0';
		panel.style.pointerEvents = 'none';
		panel.style.visibility = 'hidden';
	}
	sidebar.classList.remove("expanded");
}

function closeDetailPanel()
{

const panel = document.getElementById('sidebarDetailPanel');
	if (panel) {
		panel.style.display = 'none';
		panel.style.opacity = '0';
		panel.style.pointerEvents = 'none';
		panel.style.visibility = 'hidden';
	}

	sidebar.classList.remove("expanded");
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

async function handleClusterSelection(cluster)
{
	await hideRoadview();
	hardCloseDetailPanel();
	currentDetailItem = null;
	state.selectedMarkerId = null;
	state.selectedMarkerIds = new Set();
	state.selectedClusterKey = null;
	state.selectionMode = null;

const sortedClusterItems = sortItems(clusterItems);
	lockListToItems(sortedClusterItems);

	setTimeout(() => {
		hardCloseDetailPanel();
		openSidebarList();
		renderList(sortedClusterItems);

		if (sortedClusterItems.length === 1) {

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
				renderList([item]);
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

const hasExplicitDetailQuery = /(?:^\?|&)id=/.test(rawSearch);

const targetId = hasExplicitDetailQuery ? normalizeItemId(params.get(DETAIL_QUERY_KEY)) : "";

	if (!hasExplicitDetailQuery || !targetId) {
		setSharedDetailMode(false);
		return false;
	}

	setSharedDetailMode(false);

const item = (state.all || []).find(v => normalizeItemId(v.id) === targetId);
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
}

const listItems = shouldHideInitialList ? [] : viewportItems;
	scrollListToTop();
	if (shouldHideInitialList) {
		propertyList.innerHTML = "";
	} else {
		renderList(listItems);
	}
	scrollListToTop();
	preventMapViewportChange = true;
	renderMarkers(state.filtered, { preserveViewport: true });
	preventMapViewportChange = false;
	updateMapEmptyState(listItems);

	setResultInfo(`총 ${shouldHideInitialList ? state.filtered.length : listItems.length}건`);
	setListInfo(`총 ${shouldHideInitialList ? state.filtered.length : listItems.length}개 매물`);
	syncLeftAllButtonToMapFilters();

	if (!shouldHideInitialList && !listItems.length) {
		closeDetailPanel();
		return;
	}
}

function initEvents()
{
	if (keywordInput) keywordInput.addEventListener("input", () => {
		state.initialRandomListActive = false;
		applyFilter();
	});

	if (subAddressSearchForm) subAddressSearchForm.addEventListener("submit", (e) => {
		e.preventDefault();
		handleSubAddressSearch();
	});

	if (subAddressSearchInput) subAddressSearchInput.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			subAddressSearchInput.value = "";
			setAddressSearchStatus("");
		}
	});

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

function openShareMenu()
	{
		if (!detailShareMenu || !detailShareBtn) return;
		detailShareMenu.style.display = "flex";
		detailShareMenu.classList.add("open");
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
	}

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

	if (detailCopyLinkBtn) {
		detailCopyLinkBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!currentDetailItem) return;

const url = currentDetailItem.link && currentDetailItem.link !== "#" ? currentDetailItem.link : location.href;

			try {
				await navigator.clipboard.writeText(url);
				detailShareBtn.innerHTML = "복사";
				closeShareMenu();
				setTimeout(() => {
					detailShareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
				}, 1000);
			} catch (err) {
				console.error(err);
			}
		});
	}

	if (detailShareKakaoBtn) {
		detailShareKakaoBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!currentDetailItem) return;

const url = currentDetailItem.link && currentDetailItem.link !== "#" ? currentDetailItem.link : location.href;

const shareTitle = currentDetailItem.title || "제주 프리미엄 부동산";

			try {
				if (navigator.share) {
					await navigator.share({
						title: shareTitle,
						text: shareTitle,
						url
					});
					closeShareMenu();
					return;
				}

				await navigator.clipboard.writeText(url);
				detailShareBtn.innerHTML = "복사";
				closeShareMenu();
				setTimeout(() => {
					detailShareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
				}, 1000);
			} catch (err) {
				console.error(err);
			}
		});
	}

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

const value = btn.dataset.value;

			state.selectedFeatures.clear();

			if (value === "all") {
				selectedDeal.clear();
				selectedType.clear();
				selectedDealMethod = "all";
				syncDealFilterUI();
				syncTypeFilterUI();
				syncDealMethodFilterUI();
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

function showShareCopiedFeedback(success)
{
	if (!detailShareBtn) return;
	detailShareBtn.innerHTML = success ? "복사됨" : "실패";
	setTimeout(() => {
		detailShareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
	}, 1200);
}

window.shareDetailCopy = async function (event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}

const ok = await copyTextWithFallback(getDetailShareText());
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
	await loadRecommendData();
	await loadProperties();
	syncFeatureButtons();
	await openDetailFromUrl({ replaceHistory: true });

	window.addEventListener("popstate", async () => {

const opened = await openDetailFromUrl({ replaceHistory: false });
		if (!opened) {
			closeDetailPanel();
		}
	});
}

bootstrap();

const globalAuthTrigger = document.getElementById("detailAuthTrigger");

const trigger = e.target.closest("#detailAuthTrigger");
		if (trigger && trigger.dataset.authState === "logged-in") {
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}

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

			if (btn.classList.contains("global-auth-trigger") && btn.dataset.authState === "logged-in") {
				e.stopImmediatePropagation();
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

const target = e.target.closest("[data-requires-profile], .favorite-btn, .wish-btn, .inquiry-btn, .contact-btn, .register-btn, .detail-agent-cta-btn.phone, .detail-agent-cta-btn.kakao");
		if (!target || target.closest("#authModal") || target.closest("#authErrorModal")) return;

function updatePropertyParkingDetail()
	{

const box = document.getElementById("propertyParkingDetail");

const topbarProfileImgAfterSave = document.querySelector("#detailAuthTrigger .topbar-profile-image");
			if (topbarProfileImgAfterSave) {

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

// PATCH 2.277: 교차로 추천중개업소 꼬리는 하단 10개 유효 줄 안에 있을 때만 상세설명에서 제외

// PATCH 2.262: 본문 첫 줄은 제목으로 쓰고 상세설명에서는 첫 줄과 뒤 공백을 제거

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

const applianceText = parsed.applianceText || parsed.description;
		if (/전자레인지/.test(applianceText)) setCheck("applianceMicrowaveChk", true);
		if (/세탁기/.test(applianceText)) setCheck("applianceWasherChk", true);
		if (/냉장고/.test(applianceText)) setCheck("applianceFridgeChk", true);
		if (/TV|티비/.test(applianceText)) setCheck("applianceTvChk", true);
		if (/가스레인지/.test(applianceText)) setCheck("applianceGasRangeChk", true);
		if (/인덕션/.test(applianceText)) setCheck("applianceInductionChk", true);
		if (/천장에어컨/.test(parsed.coolingText || parsed.description)) setCheck("coolingCeilingChk", true);
		if (/엘리베이터/.test(parsed.etcFacilityText || parsed.description)) setCheck("facilityElevatorChk", true);
		if (/베란다/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcVerandaChk", true);
		if (/테라스/.test(parsed.etcFacilityText || parsed.description)) setCheck("etcTerraceChk", true);
		setInput("propertyDetailDescriptionInput", parsed.description);
		if (parsed.address && typeof window.realjejuApplyQuickAddressToLocationMap === "function") {
			window.realjejuApplyQuickAddressToLocationMap(parsed.address);
		}
	}

const detailScreen = document.getElementById("propertyAddressDetailScreen");

const detailInput = document.getElementById("propertyAddressDetailInput");

const mainDetailEl = document.getElementById("propertyAddressMainDetail");

const detailHideRow = document.getElementById("propertyAddressHideRow");

const detailHideCheck = document.getElementById("propertyAddressHideDetailCheck");

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
		if (locationHelp) locationHelp.textContent = "지도상에 표시된 포인트를 원하는 위치로 끌어다 놓으세요.";
		detailHideRow?.classList.remove("open");
		if (detailHideCheck) detailHideCheck.checked = false;
		if (detailInput) detailInput.value = "";
		if (mainDetailEl) mainDetailEl.textContent = "";
		addressWrap?.classList.remove("has-detail-address");

const markerMode = locationModeRadios.find((radio) => radio.value === "marker");
		if (markerMode) markerMode.checked = true;
		[
			"address1", "address2", "publicAddress", "privateAddress", "hideDetailJibun",
			"roadAddress", "jibunAddress", "zonecode", "detailAddress", "lat", "lng",
			"locationDisplayType", "locationSwLat", "locationSwLng", "locationNeLat", "locationNeLng"
		].forEach((key) => {
			if (addressInput) delete addressInput.dataset[key];
		});

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
			lat: found.lat || "",
			lng: found.lng || "",
			locationDisplayType: getAddressLocationMode(),
			locationBounds: addressLocationBounds
		};
		return true;
	}

const address2 = data.address2 || data.addressDetail || "";

const lng = rawLng === undefined || rawLng === "" ? NaN : Number(rawLng);
		if (!address1 && (!Number.isFinite(lat) || !Number.isFinite(lng))) return false;
		selectedAddress = {
			roadAddress: addressRoad || address1,
			jibunAddress: addressJibun || address1,
			zonecode: data.zonecode || "",
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
			addressInput.dataset.detailAddress = address2;
			if (Number.isFinite(lat) && Number.isFinite(lng)) {
				addressInput.dataset.lat = lat;
				addressInput.dataset.lng = lng;
			}
			addressInput.dispatchEvent(new Event("input", { bubbles: true }));
			addressInput.dispatchEvent(new Event("change", { bubbles: true }));
		}

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
			lat: Number.isFinite(lat) ? lat : "",
			lng: Number.isFinite(lng) ? lng : "",
			locationDisplayType: getAddressLocationMode(),
			locationBounds: addressLocationBounds
		};
		return true;
	}

const address2 = String(detailInput?.value || "").trim();

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
