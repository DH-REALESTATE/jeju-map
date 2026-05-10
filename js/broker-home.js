// REALJEJU broker-home.js - split from realjeju_2.361(3).html

/* ===== PATCH: 중개사무소 메모 글자수 ===== */
(function bindPropertyAgencyMemoCounter()
{

const textarea = document.getElementById("propertyAgencyMemoInput");

const counter = document.getElementById("propertyAgencyMemoCount");
	if (!textarea || !counter) return;

/* ===== PATCH: 소속공인중개사 체크 시 담당자명 활성화 ===== */
(function bindRegistrantLicensedAgentToggle()
{

const mapAgentOffice = document.getElementById("mapAgentOffice");

const detailAgentOffice = document.getElementById("detailAgentOffice");

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
		agentName: "",
		agentTitle: "",
		agentOffice: "",
		agentAddress: "",
		agentRegNo: "",
		agentImage: "",
		phone1: "",
		phone2: "",
		date: item.date ?? "",
		dateLabel: item.dateLabel ?? "",
		desc_folder: item.desc_folder ?? "",
		image_folder: item.image_folder ?? ""
	};
}

const agent = await loadAgent(toRemotePath(item.agent_folder));

			return {
				...item,
				agentName: agent?.agentName ?? "",
				agentTitle: agent?.agentTitle ?? "",
				agentOffice: agent?.agentOffice ?? "",
				agentAddress: agent?.agentAddress ?? "",
				agentRegNo: agent?.agentRegNo ?? "",
				agentImage: agent?.agentImage ?? "",
				phone1: agent?.phone1 ?? "",
				phone2: agent?.phone2 ?? "",
				linkCrossroad: agent?.Link_crossroad ?? "",
				linkKakaotalk: agent?.Link_kakaotalk ?? ""
			};
		})
		);

		state.all = [...enriched].sort((a, b) => getSortDateValue(b) - getSortDateValue(a));
		syncSortLabelUI();
		applyFilter();
		updateMapEmptyState();
		setGlobalAreaUnit("m2");
		applyGlobalAreaUnit();
		updateMapTypeButtons();
	} catch (err) {
		console.error("매물 데이터 불러오기 실패:", err);
		propertyList.innerHTML = `
		<div class="card" style="padding:18px; cursor:default; border-bottom:0;">
		<div class="card-body" style="padding:0;">
		<h3 style="margin-bottom:6px;">매물 데이터를 불러오지 못했습니다</h3>
		<div>properties.json 또는 properties_oneroom.json 파일 경로와 형식을 확인해 주세요.</div>
		</div>
		</div>
		`;
		setResultInfo("총 0건");
		setListInfo("총 0개 매물");
	}
}

const mergedImages = imageList.length
	? imageList
	: (mainImage ? [mainImage] : normalizeImageArray(item).map(v => toRemotePath(String(v || "").trim())).filter(Boolean));

	return {
		...item,
		desc: info.desc ?? item.desc ?? "",
		sections: Array.isArray(info.sections) ? info.sections : [],
		infoRows: Array.isArray(info.infoRows) ? info.infoRows : [],
		propertyType: info.propertyType ?? "",
		image: mainImage,
		images: mergedImages,
		agentName: agent?.agentName ?? item.agentName ?? "",
		agentTitle: agent?.agentTitle ?? item.agentTitle ?? "",
		agentOffice: agent?.agentOffice ?? item.agentOffice ?? "",
		agentAddress: agent?.agentAddress ?? item.agentAddress ?? "",
		agentRegNo: agent?.agentRegNo ?? item.agentRegNo ?? "",
		agentImage: agent?.agentImage ?? item.agentImage ?? "",
		phone1: agent?.phone1 ?? item.phone1 ?? "",
		phone2: agent?.phone2 ?? item.phone2 ?? "",
		linkCrossroad: agent?.Link_crossroad ?? item.linkCrossroad ?? "",
		linkKakaotalk: agent?.Link_kakaotalk ?? item.linkKakaotalk ?? ""
	};
}

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
		detailSummaryPrice.textContent = detailItem.price || "";
	}
	if (detailSummaryAddress) {
		detailSummaryAddress.textContent = detailItem.address || "";
	}
	detailDesc.textContent = detailItem.desc || "";
	detailInfoList.innerHTML = "";

	renderDetailInfoRows(detailItem);
	if (detailScroll) detailScroll.scrollTop = 0;

	if (detailItem.agentName || detailItem.agentOffice || detailItem.phone1 || detailItem.phone2 || detailItem.agentImage) {
		detailAgentName.textContent = detailItem.agentName || "";
		detailAgentTitle.textContent = detailItem.agentTitle || "";
		detailAgentOffice.textContent = detailItem.agentOffice || "";
		detailAgentAddress.textContent = detailItem.agentAddress || "";
		detailAgentRegNo.textContent = detailItem.agentRegNo || "";

const phoneText = [detailItem.phone1, detailItem.phone2].filter(Boolean).join(" / ");
		detailAgentPhoneInline.textContent = phoneText || "";

		if (detailItem.agentImage) {
			detailAgentAvatar.innerHTML = `<img src="${escapeHtml(detailItem.agentImage)}" alt="agent">`;
		} else {
			detailAgentAvatar.textContent = makeAgentInitial(detailItem.agentName || "담당");
		}
	} else {
		detailAgentName.textContent = "";
		detailAgentTitle.textContent = "";
		detailAgentOffice.textContent = "";
		detailAgentAddress.textContent = "";
		detailAgentRegNo.textContent = "";
		detailAgentPhoneInline.textContent = "";
		detailAgentAvatar.textContent = "담당";
	}


	detailHeroFeatures.innerHTML = "";
	detailFeatures.innerHTML = "";

	if (detailSummaryTop) {

const officeName = escapeHtml(item.agentOffice || "");

const cardAreaHtml = isDetachedHouse
		? `<span class="area-display" data-area-raw="${escapeHtml(item.area || "-")}" data-area-unit="${globalAreaUnit}" data-area-type="${escapeHtml(rawTypeText || "")}">${formatCardAreaByUnit(item.area || "-", globalAreaUnit, rawTypeText || "")}</span>`
		: `<span class="area-display" data-area-raw="${escapeHtml(item.area || "-")}" data-area-unit="${globalAreaUnit}" data-area-type="${escapeHtml(rawTypeText || "")}">${formatCardAreaByUnit(item.area || "-", globalAreaUnit, rawTypeText || "")}</span>`;

		return `
		<article class="card" data-id="${item.id}">
		<div class="card-inner-row">
		<div class="thumb" style="background-image:url('${thumb}')"></div>

		<div class="card-body">
		<div class="card-top-line">
		<div class="card-badge-row">
		<span class="card-badge" data-type="${typeText}">${typeText}</span>
		<span class="card-badge deal" data-type="${dealLabel}">${dealLabel}</span>
		</div>
		<span class="card-date" data-view-key="${escapeHtml(viewKey)}">${escapeHtml(viewText)}</span>
		</div>

		<div class="card-price-line">
		<span class="card-price">${priceText}</span>
		</div>

		<div class="card-title">${titleText}</div>

		<div class="card-address">${addressText}</div>

		<div class="card-spec">
		${cardAreaHtml}
		</div>

		<div class="card-agent-row">
		<div class="card-agent-left">
		<div class="card-agent-avatar">
		${item.agentImage ? `<img src="${escapeHtml(item.agentImage)}" alt="agent">` : agentInitial}
		</div>
		<div class="card-agent-text">
		<span class="card-agent-name">${agentName}</span>
		<span class="card-agent-title">${agentTitle}</span>
		<span class="card-agent-office">${officeName}</span>
		</div>
		</div>
		</div>
		</div>
		</div>
		</article>
		`;
	}).join("");

	refreshCardViewCounts(data);

	document.querySelectorAll(".card").forEach(card => {
		card.addEventListener("click", async function (e) {
			if (e.target.closest("a, button")) return;

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

const authBrokerOfficeInfoScreen = document.getElementById("authBrokerOfficeInfoScreen");

const authBrokerOfficeScreen = document.getElementById("authBrokerOfficeScreen");

const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");
		if (brokerMenuWrapper) brokerMenuWrapper.style.setProperty("display", "none", "important");
		renderTopbarMenu(false);
	}

function isBrokerRoleValue(role)
	{
		return ["broker", "agent", "agent_sub", "agent_staff", "corporation"].includes(String(role || ""));
	}

async function updateApprovedBrokerTopbarMenu(user, profile)
	{
		renderTopbarMenu(false);
		if (!user || !isBrokerRoleValue(profile && profile.role_request)) return;

const client = getRealjejuSupabaseClient();
		if (!client) return;

		try {
			const { data: brokerOffice } = await client
				.from("agencies")
				.select("status")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			renderTopbarMenu(!!(brokerOffice && brokerOffice.status === "active"));
		} catch (err) {
			console.warn("중개사 승인 상태 확인 실패:", err);
			renderTopbarMenu(false);
		}
	}

async function fetchMyLatestBrokerOfficeStatus(user)
	{
		if (!user || !user.id) return null;

const client = getRealjejuSupabaseClient();
		if (!client) return null;

		try {
			const { data } = await client
				.from("agencies")
				.select("status")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			return data && data.status ? data.status : null;
		} catch (err) {
			console.warn("중개사무소 신청 상태 확인 실패:", err);
			return null;
		}
	}

function getBrokerOfficeStatusLabel(status)
	{
		if (status === "active") return "승인 완료";
		if (status === "pending") return "승인 대기중";
		if (status === "rejected") return "반려";
		return "미신청";
	}

async function updateBrokerOfficeDropdownMenu(user, profile)
	{

const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");

const brokerMenuItem = document.getElementById("brokerOfficeMenuItem");

const isBroker = !!isBrokerRoleValue(profile && profile.role_request);

		if (!brokerMenuWrapper || !brokerMenuItem) return;

		if (!isBroker) {
			brokerMenuWrapper.style.setProperty("display", "none", "important");
			brokerMenuItem.disabled = false;
			brokerMenuItem.textContent = "중개사무소 가입 신청";
			return;
		}

const status = await fetchMyLatestBrokerOfficeStatus(user);
		brokerMenuWrapper.style.setProperty("display", "block", "important");
		brokerMenuItem.disabled = false;
		brokerMenuItem.classList.remove("is-pending", "is-active", "is-rejected");

		if (status === "pending") {
			brokerMenuItem.textContent = "승인 대기중";
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

const value = String(role || "user");
		if (value === "agent") return "대표 공인중개사";
		if (value === "agent_sub") return "소속 공인중개사";
		if (value === "agent_staff") return "중개보조원";
		if (value === "corporation") return "법인";
		if (value === "broker") return "중개사";
		return "일반회원";
	}

function renderTopbarMenu(isBroker)
	{

const menus = isBroker
			? ["중개사 홈", "부동산 홈", "분양 정보", "매물 등록", "관심매물", "공지사항"]
			: ["부동산 홈", "분양 정보", "매물 등록", "관심매물", "공지사항"];

const button = document.createElement("button");
			button.type = "button";
			button.className = "topbar-menu-item";
			
			if (label === "부동산 홈") button.classList.add("active");
			button.textContent = label;
			return button;
		}));
	}

	/* PATCH: 권한 확인 전에는 중개사 홈을 표시하지 않음 */
	renderTopbarMenu(false);

window.realjejuCurrentBrokerOffice = null;
		if (typeof window.realjejuLoadRegistrantInfo === "function") setTimeout(window.realjejuLoadRegistrantInfo, 0);
			syncAuthProfileEmail(currentRealjejuAuthUser);
		if (profile && profile.name) if (typeof writeRealjejuCachedProfile === "function") writeRealjejuCachedProfile(user.id, profile);

const isCompleted = !!(profile && profile.profile_completed === true && profile.name && profile.phone);
		currentRealjejuProfileCompleted = isCompleted;
		if (isAdminUser(user)) {
			renderAdminTopbarMenu();
		} else {
			renderTopbarMenu(false);
			updateApprovedBrokerTopbarMenu(user, profile);
		}
		if (typeof window.realjejuGoHome === "function") {
			window.realjejuGoHome();
			setTimeout(window.realjejuGoHome, 50);
			setTimeout(window.realjejuGoHome, 250);
		}
		if (globalAuthTrigger) {

const topbarProfileImg = globalAuthTrigger.querySelector(".topbar-profile-image");
			if (topbarProfileImg) {
				topbarProfileImg.onerror = function () { this.onerror = null; this.src = REALJEJU_DEFAULT_PROFILE_IMAGE; };
				topbarProfileImg.style.display = "inline-block";
			}
		}
		if (globalAccountEmail) globalAccountEmail.textContent = email;
		if (globalAccountDropdown) globalAccountDropdown.classList.toggle("profile-incomplete", !isCompleted);
		updateBrokerOfficeDropdownMenu(user, profile);
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
			.select("status, name, email, phone, role_request, profile_completed, profile_image")
			.eq("id", user.id)
			.maybeSingle();

let brokerOffice = null;
		try {
			const { data: officeData } = await client
				.from("agencies")
				.select("id, office_name, owner_name, office_reg_no, office_address, phone, email, status, created_at")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();
			brokerOffice = officeData || null;
		} catch (err) {
			brokerOffice = null;
		}
		return { user, profile: profile || null, brokerOffice };
	}

function getBrokerOfficeStatusText(profile, brokerOffice)
	{
		if (!isBrokerRoleValue(profile && profile.role_request)) return "해당 없음";
		if (!brokerOffice) return "미신청";
		if (brokerOffice.status === "pending") return "승인 대기중";
		if (brokerOffice.status === "active") return brokerOffice.office_name || "승인 완료";
		if (brokerOffice.status === "rejected") return "반려";
		return "미신청";
	}

function fillBrokerOfficeInfoScreen(brokerOffice)
	{
		setTextById("brokerOfficeInfoStatusValue", getBrokerOfficeStatusLabel(brokerOffice && brokerOffice.status));
		setTextById("brokerOfficeInfoNameValue", brokerOffice && brokerOffice.office_name);
		setTextById("brokerOfficeInfoOwnerValue", brokerOffice && brokerOffice.owner_name);
		setTextById("brokerOfficeInfoRegNoValue", brokerOffice && brokerOffice.office_reg_no);
		setTextById("brokerOfficeInfoAddressValue", brokerOffice && brokerOffice.office_address);
		setTextById("brokerOfficeInfoPhoneValue", brokerOffice && brokerOffice.phone);
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
		setValueById("brokerOfficePhoneInput", brokerOffice.phone);
		setValueById("brokerOwnerEmailLocalInput", brokerOffice.email);
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
			if (!brokerOffice || brokerOffice.status !== "active") {
				openAuthErrorModal("승인 완료된 중개사무소 정보가 없습니다.", "중개사무소 정보", null);
				return;
			}
			fillBrokerOfficeInfoScreen(brokerOffice);
			if (authModal) authModal.classList.add("profile-page-mode", "open");
			hideAllAuthScreens();
			updateAuthBackVisibility(false);

const screen = document.getElementById("authBrokerOfficeInfoScreen");
			if (screen) screen.classList.remove("auth-screen-hidden");
			document.body.style.overflow = "hidden";
		} catch (err) {
			console.warn("중개사무소 정보 열기 실패:", err);
			openAuthErrorModal("중개사무소 정보를 열지 못했습니다.", "중개사무소 정보", null);
		}
	}

async function openBrokerOfficeEditFromInfo()
	{
		try {
			const { user, brokerOffice } = await fetchCurrentProfileAndBrokerOffice();
			if (!user) {
				openAuthModal();
				return;
			}
			await openBrokerOfficeFromAccountMenu();
			if (brokerOffice) setTimeout(() => fillBrokerOfficeApplyForm(brokerOffice), 0);
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
			if (isAdminUser(user)) {
				renderAdminTopbarMenu();
			} else {
				renderTopbarMenu(!!(isBrokerRoleValue(profile && profile.role_request) && brokerOffice && brokerOffice.status === "active"));
			}
			setTextById("myInfoNameValue", profile && profile.name ? profile.name : "-");
			setTextById("myInfoEmailValue", user.email || (profile && profile.email) || "-");
			setTextById("myInfoPhoneValue", profile && profile.phone ? formatRealjejuPhoneInputValue(profile.phone) : "-");
			setTextById("myInfoRoleValue", getRoleLabel(profile && profile.role_request));
			setTextById("myInfoProfileStatusValue", completed ? "완료" : "미완료");
			setTextById("myInfoBrokerOfficeValue", getBrokerOfficeStatusText(profile, brokerOffice));
			setMyInfoProfileImage(profile && profile.profile_image ? profile.profile_image : "");

const brokerBtn = document.getElementById("myInfoBrokerOfficeBtn");
			if (brokerBtn) {

const brokerRole = isBrokerRoleValue(profile && profile.role_request);

const isPending = brokerOffice && brokerOffice.status === "pending";

const isActive = brokerOffice && brokerOffice.status === "active";

				brokerBtn.style.display = brokerRole ? "block" : "none";
				brokerBtn.textContent = isActive ? "중개사무소 정보" : (isPending ? "가입 신청 진행중" : "중개사무소 가입 신청");
				brokerBtn.disabled = !!isPending;
				brokerBtn.setAttribute("aria-disabled", isPending ? "true" : "false");

				brokerBtn.classList.toggle("is-pending", isPending);
				brokerBtn.classList.toggle("is-active", isActive);
				brokerBtn.classList.toggle("is-disabled", isPending);
			}
			if (authModal) authModal.classList.add("profile-page-mode", "open");
			hideAllAuthScreens();
			updateAuthBackVisibility(false);
			if (authMyInfoScreen) authMyInfoScreen.classList.remove("auth-screen-hidden");
			document.body.style.overflow = "hidden";
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
				openAuthErrorModal("중개사 회원유형에서 이용 가능합니다.", "중개사무소 가입 신청", null);
				return;
			}

const form = document.getElementById("brokerOfficeApplyForm");
			if (form && form.dataset.mode !== "edit") {
				form.dataset.mode = "create";
				form.dataset.agencyId = "";

const submitBtn = form.querySelector(".broker-apply-submit");
				if (submitBtn) submitBtn.textContent = "중개사무소 회원가입 신청";
			}
			if (authModal) authModal.classList.add("profile-page-mode", "open");
			hideAllAuthScreens();
			updateAuthBackVisibility(false);
			if (authBrokerOfficeScreen) authBrokerOfficeScreen.classList.remove("auth-screen-hidden");
			document.body.style.overflow = "hidden";
		} catch (err) {
			console.warn("중개사무소 가입 신청 열기 실패:", err);
			openAuthErrorModal("중개사무소 가입 신청 화면을 열지 못했습니다.", "중개사무소 가입 신청", null);
		}
	}

function forceGoHomeAfterLogout()
		{
			// PATCH 2.316: 로그아웃 강제 홈 전환에서도 중개사 홈 패널을 함께 닫는다
			document.body.classList.remove("property-register-page-open", "admin-page-open", "broker-home-page-open");

const brokerHomePanel = document.getElementById("brokerHomePanel");
			if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "true");

			document.querySelectorAll(".topbar-menu-item").forEach((btn) => btn.classList.remove("active"));

window.realjejuCurrentProfile = profile || null;
			try {
				const { data: agencyRows } = await supabaseForInit
					.from("agencies")
					.select("office_name, owner_name, phone, status, created_at")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false })
					.limit(5);

const rows = Array.isArray(agencyRows) ? agencyRows : [];

window.realjejuCurrentBrokerOffice = rows.find(row => row && row.status === "active") || rows[0] || null;
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

const action = accountMenuItem.dataset.accountAction || "";
			if (action === "logout") {
				handleRealjejuLogout();
				return;
			}
			if (action === "myinfo") {
				openMyInfoFromAccountMenu();
				return;
			}
			if (action === "profile") {
				openProfileSetupFromAccountMenu();
				return;
			}
			if (action === "broker-office") {
				if (accountMenuItem.disabled || accountMenuItem.classList.contains("is-pending")) {
					openAuthErrorModal("현재 승인 대기중입니다.", "중개사무소", null);
					return;
				}
				if (accountMenuItem.classList.contains("is-active")) {
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

	/* PATCH: account button click block - 로그인 이름 클릭 시 메뉴 닫힘/토글 방지 */
	if (globalAuthTrigger) {
		globalAuthTrigger.addEventListener("click", (e) => {
			if (!(globalAuthTrigger.dataset && globalAuthTrigger.dataset.authState === "logged-in")) return;
			e.preventDefault();
			e.stopImmediatePropagation();
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
				authModal.classList.add("open");
			}
		});
	}

	/* PATCH: Supabase Auth public client only - SECRET_KEY 금지 */

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

const profileSavedAt = new Date().toISOString();
				const { error } = await supabaseForProfile
					.from("profiles")
					.upsert({
						id: user.id,
						email: user.email || "",
						name: profileNameValue,
						phone: profilePhoneValue,
						role_request: profileRoleRequestValue,
						profile_completed: true,
						privacy_agreed_at: profileSavedAt,
						updated_at: profileSavedAt
					}, { onConflict: "id" });

				if (error) {
					console.error("개인정보 저장 실패:", error);
					openAuthErrorModal("개인정보 저장에 실패했습니다.", "개인정보 설정", authProfileNameInput);
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
				currentRealjejuAuthUser = null;
				closeAuthModal();
			} catch (err) {
				console.error("개인정보 저장 오류:", err);
				openAuthErrorModal("개인정보 저장 중 오류가 발생했습니다.", "개인정보 설정", authProfileNameInput);
			} finally {
				isRealjejuSavingProfile = false;
				if (profileSubmitBtn) profileSubmitBtn.disabled = false;
			}
		});
	}

	/* PATCH: 개인정보 설정 저장 버튼 클릭 시 submit 이벤트가 막혀도 필수 입력 안내가 뜨도록 보강 */
	if (authProfileSetupForm) {

const profilePhoneValue = normalizeRealjejuPhone(authProfilePhoneInput?.value || "");
				if (!profileNameValue) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("이름을 입력하세요.", "개인정보 설정", authProfileNameInput);
					return;
				}
				if (!profilePhoneValue || profilePhoneValue.length < 10) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("휴대폰번호를 입력하세요.", "개인정보 설정", authProfilePhoneInput);
					return;
				}
				if (!authProfilePrivacyAgreeCheck || !authProfilePrivacyAgreeCheck.checked) {
					e.preventDefault();
					e.stopImmediatePropagation();
					openAuthErrorModal("개인정보 수집 및 이용에 동의해 주세요.", "개인정보 설정", authProfilePrivacyAgreeCheck);
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
		brokerOfficeAddressSearchBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (window.daum && window.daum.Postcode) {
				new window.daum.Postcode({
					oncomplete: function(data) {

const addressInput = document.getElementById("brokerOfficeAddressInput");

const selectedAddress = data.roadAddress || data.jibunAddress || "";
						if (addressInput) addressInput.value = selectedAddress;
						focusBrokerOfficeAddressOnMap(selectedAddress);
					}
				}).open();
				return;
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

const officeName = (document.getElementById("brokerOfficeNameInput")?.value || document.getElementById("brokerOfficeSearchInput")?.value || "").trim();

const ownerName = (document.getElementById("brokerOwnerNameInput")?.value || "").trim();

const licenseNo = (document.getElementById("brokerLicenseNoInput")?.value || "").trim();

const address = (document.getElementById("brokerOfficeAddressInput")?.value || "").trim();

const addressDetail = (document.getElementById("brokerOfficeAddressDetailInput")?.value || "").trim();

const phone = (document.getElementById("brokerOfficePhoneInput")?.value || "").trim();

const email = (document.getElementById("brokerOwnerEmailLocalInput")?.value || "").trim();
			if (!officeName) return openAuthErrorModal("중개사무소명을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficeNameInput"));
			if (!address) return openAuthErrorModal("주소를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficeAddressInput"));
			if (!licenseNo) return openAuthErrorModal("등록번호를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerLicenseNoInput"));
			if (!ownerName) return openAuthErrorModal("대표자명을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOwnerNameInput"));
			if (!phone) return openAuthErrorModal("연락처를 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOfficePhoneInput"));
			if (!email) return openAuthErrorModal("이메일을 입력하세요.", "중개사무소 가입 신청", document.getElementById("brokerOwnerEmailLocalInput"));
			try {

const isEditMode = brokerOfficeApplyForm.dataset.mode === "edit" && brokerOfficeApplyForm.dataset.agencyId;

const agencyPayload = {
					office_name: officeName,
					owner_name: ownerName,
					office_reg_no: licenseNo,
					office_address: addressDetail ? address + " " + addressDetail : address,
					phone: phone,
					email: email,
					updated_at: new Date().toISOString()
				};

				if (isEditMode) {
					const { error } = await client
						.from("agencies")
						.update(agencyPayload)
						.eq("id", brokerOfficeApplyForm.dataset.agencyId)
						.eq("user_id", user.id);

					if (error) {
						console.error("중개사무소 정보 수정 실패:", error);
						return openAuthErrorModal("중개사무소 정보 수정에 실패했습니다.", "중개사무소 정보", null);
					}

					openAuthErrorModal(
						"중개사무소 정보가 수정되었습니다.",
						"중개사무소 정보",
						null,
						function () {
							if (typeof openBrokerOfficeInfoFromAccountMenu === "function") openBrokerOfficeInfoFromAccountMenu();
						}
					);
					return;
				}

				// PATCH: 로그인 아이디당 중개사무소 가입 신청은 1회만 허용
				const { data: existingAgency, error: existingAgencyError } = await client
					.from("agencies")
					.select("id")
					.eq("user_id", user.id)
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
					status: "pending",
					created_at: new Date().toISOString(),
				});
				if (error) {
					console.error("중개사무소 신청 실패:", error);
					return openAuthErrorModal("중개사무소 신청 저장에 실패했습니다.", "중개사무소 가입 신청", null);
				}

const brokerMenuWrapper = document.getElementById("brokerOfficeMenuWrapper");

const brokerMenuItem = document.getElementById("brokerOfficeMenuItem");
				if (brokerMenuWrapper) brokerMenuWrapper.style.setProperty("display", "block", "important");
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

// PATCH 2.316: 중개사 홈 패널은 등록 매물 저장 완료 후 이동할 관리 화면

function closeBrokerHomePage()
	{
		document.body.classList.remove("broker-home-page-open");

const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) brokerHomePanel.setAttribute("aria-hidden", "true");
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

let agency = null;
			try
			{
				const { data: agencyRows } = await client
					.from("agencies")
					.select("office_name, status, created_at")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false })
					.limit(5);

const rows = Array.isArray(agencyRows) ? agencyRows : [];
				agency = rows.find(row => row && row.status === "active") || rows[0] || null;

window.realjejuCurrentBrokerOffice = agency || null;
			}
			catch (agencyError)
			{
				console.warn("매물등록 등록자 정보 agencies 조회 실패:", agencyError);
			}

			setPropertyRegistrantValue("registrantOfficeNameInput", agency && agency.office_name ? agency.office_name : "");
			setPropertyRegistrantValue("registrantRepresentativeInput", profile && profile.name ? profile.name : "");
			setPropertyRegistrantValue("registrantPhone1Input", profile && profile.phone ? profile.phone : "");
		}
		catch (error)
		{
			console.warn("매물등록 등록자 정보 직접 조회 실패:", error);
		}
	}

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

async function openPropertyRegisterPage()
	{
		closeGlobalAccountDropdown();
		closeAdminPage();
		closeBrokerHomePage();

		if (document.body.classList.contains("property-register-page-open")) {

let secondLabel = "공급 면적";
		landAreaLabel.innerHTML = '대지 면적<span class="property-required">*</span>';

		if (type === "officetel" || type === "office" || type === "store") {
			firstLabel = "전용 면적";
			secondLabel = "계약 면적";
		} else if (type === "house" || type === "multi_family_house" || type === "building" || type === "factory_warehouse") {
			if (exclusiveAreaRow.parentNode && landAreaRow.nextElementSibling !== exclusiveAreaRow) {
				exclusiveAreaRow.parentNode.insertBefore(landAreaRow, exclusiveAreaRow);
			}
			landAreaRow.style.display = "grid";
			firstLabel = "건축 면적";
			secondLabel = "연 면적";
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
			firstLabel = "건축 면적";
			secondLabel = "연 면적";
			landAreaLabel.innerHTML = '대지 면적<span class="property-required">*</span>';
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
			secondLabel = "연 면적";
			landAreaLabel.innerHTML = '대지 면적<span class="property-required">*</span>';
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
			firstLabel = "전용 면적";
			secondLabel = propertyTypeSelect.dataset.areaMode === "contract_private" ? "계약 면적" : "공급 면적";
			landAreaLabel.innerHTML = '대지 면적<span class="property-required">*</span>';
		}

		/* PATCH 2.240: 대지면적만 있는 원문은 대지 면적 한 칸만 표시 */
		if (propertyTypeSelect.dataset.areaMode === "land_only") {
			exclusiveAreaRow.style.display = "none";
			supplyAreaRow.style.display = "none";
			landAreaRow.style.display = "grid";
			landRoadRow.style.display = type === "land" ? "grid" : "none";
			landAreaLabel.innerHTML = '대지 면적<span class="property-required">*</span>';
		}

		exclusiveAreaLabel.innerHTML = firstLabel + '<span class="property-required">*</span>';
		supplyAreaLabel.textContent = secondLabel;
	}

const residentialTypes = ["apartment", "officetel", "room", "villa", "house", "multi_family_house", "hotel", "pension"];

const commercialTypes = ["store", "office"];

const user = currentRealjejuAuthUser;
		if (isAdminUser(user)) renderAdminTopbarMenu();
		if (!isAdminUser(user)) {
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
		document.body.classList.add("admin-page-open");

function getAgencyStatusLabel(status)
	{
		if (status === "active") return "승인";
		if (status === "rejected") return "거부";
		return "승인대기";
	}

function formatBrokerManwon(value)
	{

function getBrokerDealLabel(deal)
	{

function getBrokerListingPrice(row)
	{

const deals = Array.isArray(row.deal_types) ? row.deal_types : [];
		// PATCH 2.327: 중개사 홈 가격 앞에 대표 거래유형을 함께 표시
		if (deals.includes("sale") && prices.sale?.price) return `매매 ${formatBrokerManwon(prices.sale.price)}`;
		if (deals.includes("jeonse") && prices.jeonse?.deposit) return `전세 ${formatBrokerManwon(prices.jeonse.deposit)}`;
		if (deals.includes("monthly")) {

const deposit = formatBrokerManwon(prices.monthly?.deposit);

const rent = formatBrokerManwon(prices.monthly?.rent);

const deposit = formatBrokerManwon(prices.yearly?.deposit);

const rent = formatBrokerManwon(prices.yearly?.rent);

const deposit = formatBrokerManwon(prices.short?.deposit);

const rent = formatBrokerManwon(prices.short?.rent);

function getBrokerListingThumbHtml(row)
	{

// PATCH 2.324: 중개사 홈 목록용 등록일/매물번호/블로그 복사 문구를 한곳에서 만든다

function formatBrokerListingDate(value)
	{
		if (!value) return "-";

function getBrokerListingDisplayDate(row)
	{
		return formatBrokerListingDate(row?.updated_at || row?.created_at);
	}

function getBrokerRelistUsageDateKey(value = new Date())
	{

function getBrokerListingRelistUsageCount(row, dateKey = getBrokerRelistUsageDateKey())
	{

function getBrokerListingStatusLabel(status)
	{
		if (status === "published") return "등록";
		if (status === "draft") return "임시";
		if (status === "closed") return "거래완료";
		if (status === "hidden") return "숨김";
		if (status === "archive") return "보관";
		if (status === "deleted") return "휴지통";
		return status || "-";
	}

function getBrokerListingEffectiveStatus(row)
	{

const payload = row && row.payload && typeof row.payload === "object" ? row.payload : {};
		if (payload.broker_status === "closed") return "closed";
		return row && row.status ? row.status : "";
	}

function getBrokerListingNo(row)
	{

const source = [
			row?.title,
			payload.description,
			payload.agency_memo
		].filter(Boolean).join("\n");

function getBrokerListingBlogText(row)
	{

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

function closeBrokerListingMenus(exceptId)
	{
		document.querySelectorAll(".broker-listing-more-menu.open").forEach((menu) => {

const menuId = menu.getAttribute("data-broker-listing-menu-panel");
			if (!exceptId || menuId !== String(exceptId)) menu.classList.remove("open");
		});
	}

async function updateBrokerListingRowAction(listingId, action)
	{

const client = getRealjejuSupabaseClient();
		if (!user || !user.id || !client) {
			openAuthErrorModal("로그인과 Supabase 연결 상태를 확인하세요.", "중개사 홈", null);
			return;
		}

		try {

const row = window.realjejuBrokerListingRowsById?.get(id);

const todayKey = getBrokerRelistUsageDateKey();

const todayCount = Number(relistCounts[todayKey]);
					relistCounts[todayKey] = (Number.isFinite(todayCount) && todayCount > 0 ? todayCount : 0) + 1;
					// PATCH 2.353: 갱신 버튼을 누른 횟수를 날짜별 사용건수로 보존한다
					update.payload = { ...payload, relist_usage_by_date: relistCounts, last_relisted_at: nowIso };
				}
				if (action === "closed") {
					update.status = "published";
					update.payload = { ...payload, broker_status: "closed" };
				}
				if (action === "hidden") {
					update.status = "hidden";
					if (payload.broker_status) {
						delete payload.broker_status;
						update.payload = payload;
					}
				}
				if (action === "delete") {
					update.status = "deleted";
					if (payload.broker_status) delete payload.broker_status;
					update.payload = { ...payload, deleted_at: nowIso };
				}
				if (action === "published") {
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
		}
		catch (err) {
			console.error("중개사 홈 매물 관리 실패:", err);
			openAuthErrorModal("매물 처리에 실패했습니다.", "중개사 홈", null);
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

const dealBtn = document.getElementById("brokerDealTypeFilterBtn");

const dealLabel = dealValues.length ? dealValues.map(getBrokerDealLabel).join(", ") : "거래 유형";
		if (dealBtn) dealBtn.innerHTML = `${escapeAdminHtml(dealLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
		if (dealBtn) dealBtn.classList.toggle("active", dealValues.length > 0);

		document.querySelectorAll(".broker-home-filter-check[data-broker-home-filter-option]").forEach((input) => {

const type = input.dataset.brokerHomeFilterOption;

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

// PATCH 2.343: 휴지통 이동 후 7일이 지난 매물은 중개사 홈 로딩 시 실제 삭제한다

async function purgeExpiredDeletedBrokerListings(rows, client, userId)
	{
		if (!client || !userId || !Array.isArray(rows)) return false;

const expiredIds = rows
			.filter((row) => getBrokerListingEffectiveStatus(row) === "deleted")
			.filter((row) => {

function setBrokerEditInput(id, value)
	{

function setBrokerEditSelect(id, value)
	{

function setBrokerEditRadio(name, value)
	{

function setBrokerEditCheck(id, checked)
	{

function restoreBrokerEditFormState(formState)
	{
		if (!formState || typeof formState !== "object") return;
		Object.entries(formState.selects || {}).forEach(([id, value]) => setBrokerEditSelect(id, value));
		Object.entries(formState.inputs || {}).forEach(([id, value]) => setBrokerEditInput(id, value));
		Object.entries(formState.checks || {}).forEach(([id, checked]) => setBrokerEditCheck(id, checked));
		Object.entries(formState.radios || {}).forEach(([name, value]) => setBrokerEditRadio(name, value));
		if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
	}

function setBrokerEditMaintenanceTab(type)
	{

function restoreBrokerEditMaintenance(maintenance)
	{
		if (!maintenance || typeof maintenance !== "object") return;

const detailType = maintenance.detail_type || (maintenanceType === "extra" ? "common_area_usage" : "");
		setBrokerEditMaintenanceTab(maintenanceType);
		setBrokerEditCheck("maintenanceUnder100kChk", !!maintenance.under_100k_or_unprovided);
		setBrokerEditRadio("maintenanceFixedBase", maintenance.fixed_base || "");
		setBrokerEditRadio("maintenanceExtraBase", maintenance.extra_base || "");
		setBrokerEditRadio("maintenanceDetailType", detailType);
		setBrokerEditRadio("maintenanceUnknownReason", maintenance.unknown_reason || "");
		setBrokerEditInput("maintenanceNoneValue", maintenance.no_fee_value || "");
		setBrokerEditInput("maintenanceNoneReason", maintenance.no_fee_reason || "");
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

function fillBrokerListingEditForm(row)
	{

const page = document.getElementById("propertyRegisterPage");
		if (page) page.dataset.listingId = row.id || "";
		if (typeof window.realjejuSetPropertyRegisterEditMode === "function") window.realjejuSetPropertyRegisterEditMode(true);

		setBrokerEditSelect("propertyTypeSelect", row.property_type || "");
		setBrokerEditSelect("buildingUseSelect", payload.building_use || "");
		document.querySelectorAll(".property-deal-check").forEach((input) => {
			input.checked = Array.isArray(row.deal_types) && row.deal_types.includes(input.value);
		});
		if (typeof renderPropertyPriceFields === "function") renderPropertyPriceFields();
		restoreBrokerEditFormState(payload.form_state);
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

		setBrokerEditInput("exclusiveAreaM2Input", areas.exclusive_m2 || "");
		setBrokerEditInput("exclusiveAreaPyInput", areas.exclusive_py || "");
		setBrokerEditInput("supplyAreaM2Input", areas.supply_m2 || "");
		setBrokerEditInput("supplyAreaPyInput", areas.supply_py || "");
		setBrokerEditInput("landAreaM2Input", areas.land_m2 || "");
		setBrokerEditInput("landAreaPyInput", areas.land_py || "");
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

		if (typeof updatePropertyRegisterAreaFields === "function") updatePropertyRegisterAreaFields();
		if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
		if (typeof window.realjejuSyncPropertyCountRowsVisibility === "function") window.realjejuSyncPropertyCountRowsVisibility();
		if (typeof updatePropertyParkingDetail === "function") updatePropertyParkingDetail();
		if (typeof updatePropertyFloorLevelRadioState === "function") updatePropertyFloorLevelRadioState();
		if (typeof window.realjejuLoadPropertyPhotoPreviewFromPhotos === "function") {
			window.realjejuLoadPropertyPhotoPreviewFromPhotos(row.photos);
		}
	}

const client = getRealjejuSupabaseClient();
		if (!client) {
			listEl.innerHTML = '<div class="admin-empty">Supabase 연결 설정을 확인하세요.</div>';
			return;
		}

		listEl.innerHTML = '<div class="admin-empty">신청 목록을 불러오는 중입니다.</div>';

		try {
			const { data, error } = await client
				.from("agencies")
				.select("id, user_id, office_name, owner_name, office_reg_no, office_address, phone, email, status, created_at, updated_at")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("관리자 신청 목록 조회 실패:", error);
				listEl.innerHTML = '<div class="admin-empty">신청 목록을 불러오지 못했습니다.</div>';
				return;
			}

const rows = Array.isArray(data) ? data : [];
			if (!rows.length) {
				listEl.innerHTML = '<div class="admin-empty">표시할 신청이 없습니다. 신청 데이터가 있는데도 비어 있으면 Supabase agencies 조회 정책(RLS)을 확인하세요.</div>';
				return;
			}

			listEl.innerHTML = rows.map(row => {

const created = row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-";
				return `
					<div class="admin-application-card" data-agency-id="${escapeAdminHtml(row.id)}">
						<div>
							<div class="admin-application-office">${escapeAdminHtml(row.office_name || "-")}</div>
							<div class="admin-application-meta">대표자: ${escapeAdminHtml(row.owner_name || "-")} · 등록번호: ${escapeAdminHtml(row.office_reg_no || "-")}</div>
						</div>
						<div class="admin-application-meta">
							<div>주소: ${escapeAdminHtml(row.office_address || "-")}</div>
							<div>연락처: ${escapeAdminHtml(row.phone || "-")} · ${escapeAdminHtml(row.email || "-")}</div>
						</div>
						<div>
							<span class="admin-status-badge ${escapeAdminHtml(status)}">${escapeAdminHtml(getAgencyStatusLabel(status))}</span>
							<div class="admin-application-meta" style="margin-top:6px;">${escapeAdminHtml(created)}</div>
						</div>
						<div class="admin-application-actions">
							<button type="button" class="admin-status-btn approve" data-admin-status="active" data-agency-id="${escapeAdminHtml(row.id)}">승인</button>
							<button type="button" class="admin-status-btn pending" data-admin-status="pending" data-agency-id="${escapeAdminHtml(row.id)}">대기</button>
							<button type="button" class="admin-status-btn reject" data-admin-status="rejected" data-agency-id="${escapeAdminHtml(row.id)}">거부</button>
						</div>
					</div>
				`;
			}).join("");
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

		listEl.innerHTML = '<div class="admin-empty">등록 매물을 불러오는 중입니다.</div>';
		listEl.classList.remove("broker-listing-list");

		try {
			const { data, error } = await client
				.from("property_listings")
				.select("id, status, property_type, property_type_label, deal_types, title, public_address, created_at, updated_at, photos, payload")
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
					<div>가격</div>
					<div>수정</div>
					<div>블로그복사</div>
					<div>관리</div>
				</div>
			` + filteredRows.map((row) => {

const deals = Array.isArray(row.deal_types) && row.deal_types.length ? row.deal_types.map(getBrokerDealLabel).join(", ") : "-";

const created = getBrokerListingDisplayDate(row);

const listingNo = getBrokerListingNo(row);

const price = getBrokerListingPrice(row);

const effectiveStatus = getBrokerListingEffectiveStatus(row);

const deleteLabel = isDeleted ? "영구삭제" : "삭제";
				return `
					<div class="broker-listing-row" data-listing-id="${rowId}">
						<div class="broker-listing-thumb">${getBrokerListingThumbHtml(row)}</div>
						<div class="broker-listing-type">[${escapeAdminHtml(row.property_type_label || "-")}] ${escapeAdminHtml(deals)}</div>
						<div><span class="broker-listing-status ${escapeAdminHtml(effectiveStatus || "draft")}">${escapeAdminHtml(getBrokerListingStatusLabel(effectiveStatus))}</span></div>
						<div class="broker-listing-meta">${escapeAdminHtml(created)}</div>
						<div class="broker-listing-no">${escapeAdminHtml(listingNo)}</div>
						<div class="broker-listing-title-cell">
							<div class="broker-listing-title">${escapeAdminHtml(row.title || "제목 없음")}</div>
							<div class="broker-listing-address">${escapeAdminHtml(row.public_address || "-")}</div>
						</div>
						<div class="broker-listing-price">${escapeAdminHtml(price)}</div>
						<div class="broker-listing-actions">
							<button type="button" class="broker-listing-edit-btn" data-broker-listing-edit="${rowId}">수정</button>
							<button type="button" class="broker-listing-blog-copy-btn" data-broker-listing-blog-copy="${rowId}">블로그복사</button>
						</div>
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
			}).join("");
		} catch (err) {
			console.error("중개사 매물 목록 오류:", err);
			listEl.innerHTML = '<div class="admin-empty">등록 매물 처리 중 오류가 발생했습니다.</div>';
		}
	}

// PATCH 2.337: 중개사 홈 상단 사용건수와 상태별 수량을 목록 데이터 기준으로 갱신

function updateBrokerHomeSummary(rows)
	{

const tradingCount = list.filter((row) => !["closed", "hidden", "draft", "archive", "deleted"].includes(getBrokerListingEffectiveStatus(row))).length;

const hiddenCount = list.filter((row) => ["hidden", "archive"].includes(getBrokerListingEffectiveStatus(row))).length;

const todayKey = getBrokerRelistUsageDateKey();

const relistCount = list.reduce((total, row) => total + getBrokerListingRelistUsageCount(row, todayKey), 0);

const closedCount = list.filter((row) => getBrokerListingEffectiveStatus(row) === "closed").length;

const deletedCount = list.filter((row) => getBrokerListingEffectiveStatus(row) === "deleted").length;
		setText("brokerTradingCount", tradingCount);
		setText("brokerClosedCount", closedCount);
		setText("brokerHiddenCount", hiddenCount);
		setText("brokerDeletedCount", deletedCount);
		setText("brokerUsageCount", usageCount);
		setText("brokerPremiumUsageCount", premiumCount);
		setText("brokerRelistUsageCount", relistCount);
		setWidth("brokerUsageFill", usageCount, 100);
		setWidth("brokerPremiumUsageFill", premiumCount, 50);
		setWidth("brokerRelistUsageFill", relistCount, 50);
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
		closePropertyRegisterPage();
		closeAdminPage();
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
		actionButtons.forEach(btn => { btn.disabled = true; });
		if (!isAdminUser(currentRealjejuAuthUser)) {
			openAuthErrorModal("관리자 계정에서만 이용 가능합니다.", "관리자 페이지", null);
			return;
		}

const client = getRealjejuSupabaseClient();
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "관리자 페이지", null);
			return;
		}

		try {
			const { error } = await client
				.from("agencies")
				.update({ status, updated_at: new Date().toISOString() })
				.eq("id", agencyId);

			if (error) {
				console.error("중개사무소 상태 변경 실패:", error);
				openAuthErrorModal("상태 변경에 실패했습니다.", "관리자 페이지", null);
				return;
			}

			await loadAdminApplications();
		} catch (err) {
			console.error("중개사무소 상태 변경 오류:", err);
			openAuthErrorModal("상태 변경 중 오류가 발생했습니다.", "관리자 페이지", null);
		}
	}

	document.addEventListener("click", function(e) {

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
		loadBrokerListings();
	});

	document.addEventListener("click", function(e) {

const statusBtn = e.target.closest("[data-admin-status][data-agency-id]");
		if (statusBtn) {
			e.preventDefault();
			e.stopPropagation();
			updateAdminApplicationStatus(statusBtn.dataset.agencyId, statusBtn.dataset.adminStatus);
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

		// PATCH 2.342: 중개사 홈 상단 상태/매물유형/거래유형 필터를 목록에 적용

const brokerStatusFilterBtn = e.target.closest("[data-broker-home-status-filter]");
		if (brokerStatusFilterBtn) {
			e.preventDefault();
			e.stopPropagation();

const filters = getBrokerHomeFilters();
			filters.status = brokerStatusFilterBtn.dataset.brokerHomeStatusFilter || "trading";
			closeBrokerHomeFilterMenus();
			loadBrokerListings();
			return;
		}

const brokerHomeFilterMenuBtn = e.target.closest("[data-broker-home-filter-menu]");
		if (brokerHomeFilterMenuBtn) {
			e.preventDefault();
			e.stopPropagation();

const type = brokerHomeFilterMenuBtn.dataset.brokerHomeFilterMenu;

const menuId = type === "deal" ? "brokerDealTypeFilterMenu" : "brokerPropertyTypeFilterMenu";

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
			loadBrokerListings();
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
			closeBrokerListingMenus(listingId);
			if (menu) {
				menu.classList.toggle("open", !!willOpen);
			}
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
			openPropertyRegisterPage();
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

window.openBrokerHomePage = openBrokerHomePage;

window.updateBrokerOfficeDropdownMenu = updateBrokerOfficeDropdownMenu;

const brokerRoles = ["broker", "agent", "agent_sub", "agent_staff", "corporation"];

const showBrokerOfficeMenu = brokerRoles.includes(role);

const brokerMenuWrapper = qs("brokerOfficeMenuWrapper");

const brokerMenuItem = qs("brokerOfficeMenuItem");

let latestBrokerOfficeStatus = null;
			if (showBrokerOfficeMenu) {
				try {
					const { data: agencyRows } = await client
						.from("agencies")
						.select("status, office_name, created_at")
						.eq("user_id", user.id)
						.order("created_at", { ascending: false })
						.limit(1);
					latestBrokerOfficeStatus = Array.isArray(agencyRows) && agencyRows[0] ? agencyRows[0].status : null;
				} catch (brokerStatusError) {
					console.warn("중개사무소 신청 상태 재확인 실패:", brokerStatusError);
				}
			}
			if (brokerMenuWrapper) {
				brokerMenuWrapper.style.setProperty("display", showBrokerOfficeMenu ? "block" : "none", "important");
			}
			if (brokerMenuItem) {
				brokerMenuItem.disabled = false;
				brokerMenuItem.classList.remove("is-pending", "is-active", "is-rejected");
				if (!showBrokerOfficeMenu) {
					brokerMenuItem.textContent = "중개사무소 가입 신청";
				} else if (latestBrokerOfficeStatus === "pending") {
					brokerMenuItem.textContent = "승인 대기중";
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

const showBrokerOfficeMenu = ["broker", "agent", "agent_sub", "agent_staff", "corporation"].includes(role);

const brokerMenuWrapper = qs("brokerOfficeMenuWrapper");
		if (brokerMenuWrapper) {
			brokerMenuWrapper.style.setProperty("display", showBrokerOfficeMenu ? "block" : "none", "important");
		}
	}, true);

	document.addEventListener("click", function (e) {

const visibleTypeValues = ["apartment", "officetel", "room", "villa"];

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

window.realjejuCurrentBrokerOffice = null;

		[
			"registrantOfficeNameInput",
			"registrantRepresentativeInput",
			"registrantPhone1Input",
			"registrantManagerNameInput",
			"registrantPhone2Input"
		].forEach((id) => setValue(id, ""));

const office = cleanInfoValue(getTextValue("myInfoBrokerOfficeValue"));

const phone = cleanInfoValue(getTextValue("myInfoPhoneValue"));

		if (!getInputValue("registrantOfficeNameInput") && office) setValue("registrantOfficeNameInput", office);
		if (!getInputValue("registrantRepresentativeInput") && name) setValue("registrantRepresentativeInput", name);
		if (!getInputValue("registrantPhone1Input") && phone) setValue("registrantPhone1Input", phone);
	}

let agency = null;

		if (client)
		{
			try
			{
				const { data: userData } = await client.auth.getUser();

window.realjejuCurrentProfile = profile;
					}
					catch (profileError)
					{
						console.warn("등록자 정보 profiles 조회 실패:", profileError);
					}

					try
					{
						const { data: agencyRows } = await client
							.from("agencies")
							.select("id, office_name, owner_name, phone, status, created_at")
							.eq("user_id", user.id)
							.order("created_at", { ascending: false })
							.limit(5);

const rows = Array.isArray(agencyRows) ? agencyRows : [];
						agency = rows.find(row => row && row.status === "active") || rows[0] || null;

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

/* ===== PATCH: 등록자 정보 소속공인중개사 토글 직접 바인딩 ===== */
(function bindRegistrantLicensedToggleDirect()
{

const maintenanceDetailType = radioValue("maintenanceDetailType") || (maintenanceType === "extra" ? "common_area_usage" : "");

		return {
			status,
			property_type: value("propertyTypeSelect"),
			property_type_label: selectedOptionText("propertyTypeSelect"),
			deal_types: dealTypes,
			title,
			address1: addressInput?.dataset.address1 || addressInput?.value?.trim() || "",
			address2: addressInput?.dataset.address2 || "",
			public_address: addressInput?.dataset.publicAddress || addressInput?.value?.trim() || "",
			hide_detail_jibun: addressInput?.dataset.hideDetailJibun === "1",
			location_display_type: addressInput?.dataset.locationDisplayType || radioValue("propertyAddressLocationMode") || "marker",
			lat: Number.isFinite(lat) ? lat : null,
			lng: Number.isFinite(lng) ? lng : null,
			payload: {
				version: APP_VERSION,
				form_state: collectPropertyRegisterFormState(),
				building_use: value("buildingUseSelect"),
				dong: value("propertyDongInput"),
				ho: value("propertyHoInput"),
				areas: {
					exclusive_m2: numberValue("exclusiveAreaM2Input"),
					exclusive_py: numberValue("exclusiveAreaPyInput"),
					supply_m2: numberValue("supplyAreaM2Input"),
					supply_py: numberValue("supplyAreaPyInput"),
					land_m2: numberValue("landAreaM2Input"),
					land_py: numberValue("landAreaPyInput"),
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
					loan: radioValue("propertyLoan"),
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
					no_fee_value: value("maintenanceNoneValue"),
					no_fee_reason: value("maintenanceNoneReason"),
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
				facilities: {
					furniture_built_in: checked("furnitureBuiltInChk"),
					appliance_gas_range: checked("applianceGasRangeChk"),
					veranda: checked("etcVerandaChk")
				},
				move_in: {
					date: value("propertyMoveInDateInput"),
					now: checked("propertyMoveInNowChk"),
					negotiable: checked("propertyMoveInNegotiableChk")
				},
				description: value("propertyDetailDescriptionInput"),
				youtube_url: value("propertyYoutubeLinkInput"),
				agency_memo: value("propertyAgencyMemoInput"),
				registrant: {
					office_name: value("registrantOfficeNameInput"),
					representative: value("registrantRepresentativeInput"),
					phone1: value("registrantPhone1Input"),
					manager_name: value("registrantManagerNameInput"),
					is_licensed_agent: checked("registrantLicensedAgentChk"),
					phone2: value("registrantPhone2Input")
				},
				address: window.REALJEJU_PROPERTY_ADDRESS || null
			}
		};
	}

function getRequiredFieldRow(label)
	{
		return label.closest(".property-form-row, .property-info-row, .maintenance-form-row, .property-price-row, .property-detail-row, .property-agency-row, .property-registrant-form-row, .property-premium-field") || label.parentElement;
	}

const row = {
				...payload,
				id: listingId,
				user_id: user.id,
				agency_id: window.realjejuCurrentBrokerOffice?.id || null,
				updated_at: new Date().toISOString()
			};

window.REALJEJU_LAST_SAVED_LISTING_ID = savedListingId;
			if (page) page.dataset.listingId = savedListingId;
			keepButtonsLockedUntilConfirm = true;
			// PATCH 2.358: 완료 후 초기화는 상태값 기준으로 처리한다.
			// PATCH 2.322: 수정 저장 완료 문구는 등록 완료와 구분해 보여줌
			openAuthErrorModal(completeMessage, existingListingId ? "매물 수정 완료" : "매물 등록 완료", null, () => {
				propertyListingSaveInFlight = false;
				setSaveButtonsDisabled(false);
				// PATCH 2.358: 등록/수정 완료 확인 후에는 폼을 완전히 초기화해 다음 등록이 기존 매물을 덮어쓰지 않게 한다.
				if (status === "published") resetPropertyRegisterFormFields();
				if (typeof window.openBrokerHomePage === "function") window.openBrokerHomePage(savedListingId);
			});
		}
		catch (err) {
			console.error("매물 저장 오류:", err);
			openAuthErrorModal("매물 저장 중 오류가 발생했습니다.", "매물 등록", null);
		}
		finally {
			if (!keepButtonsLockedUntilConfirm) {
				propertyListingSaveInFlight = false;
				setSaveButtonsDisabled(false);
			}
		}
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

let parsedPropertyType = "";
		// PATCH 2.252: 오피스텔/오피스텔형은 숙박시설이어도 펜션보다 먼저 원룸/투룸으로 분류
		// PATCH 2.296: 교차로 두 번째 줄의 토지/임야는 건축물용도보다 우선해서 토지로 분류
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

const maintenanceDetailType = /관리규약/.test(maintenanceReasonText)
			? "area_rule"
			: (/공용관리비는\s*면적|면적\/세대별/.test(maintenanceReasonText)
				? "common_area_usage"
				: (/세대별\s*사용량|사용량에\s*따라/.test(maintenanceReasonText)
					? "usage_by_household"
					: (/전체\s*사용량.*세대수/.test(maintenanceReasonText)
						? "divide_total"
						: (/미제시|미제공/.test(maintenanceReasonText) ? "broker_unprovided" : ""))));

function goRealjejuHome()
	{
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

		document.body.classList.remove("property-register-page-open", "admin-page-open", "broker-home-page-open");

const brokerHomePanel = document.getElementById("brokerHomePanel");
		if (brokerHomePanel) {
			brokerHomePanel.setAttribute("aria-hidden", "true");
			brokerHomePanel.style.display = "";
			brokerHomePanel.classList.remove("open", "active", "is-open");
		}

const detailHideTargetTypes = new Set(["house", "store", "office", "building", "factory_warehouse", "land"]);

// PATCH 2.322: 중개사 홈 수정 진입 시 저장된 주소와 좌표로 지도 영역을 즉시 복원

/* PATCH 2.361: 매물 등록/수정 완료 확인 후 중개사 홈 이동을 확인 버튼 클릭 기준으로 강제 보장 */
(function () {

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

const txt = String(msg || '');
      if(txt.includes('매물 등록이 완료') || txt.includes('매물 수정이 완료')){
        if(typeof openBrokerHomePage === 'function'){
          openBrokerHomePage();
        }
      }
    }catch(e){}
  };
})();
