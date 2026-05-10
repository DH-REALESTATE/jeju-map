// REALJEJU admin.js - split from realjeju_2.361(3).html

const res = await fetch("/api/view", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ listingNo: key })
		});

const approvalYearInputs = document.querySelectorAll('input[name="approvalYear"]');

const approvalYearFilterDropdown = document.getElementById("approvalYearFilterDropdown");

const approvalYearFilterTrigger = document.getElementById("approvalYearFilterTrigger");

const approvalYearFilterMenu = document.getElementById("approvalYearFilterMenu");

const approvalYearFilterLabel = document.getElementById("approvalYearFilterLabel");

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

	if (approvalYearFilterTrigger) {
		approvalYearFilterTrigger.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeDealFilterMenu();
			closeTypeFilterMenu();
			closeDealMethodFilterMenu();
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
		if (approvalYearFilterDropdown && !approvalYearFilterDropdown.contains(e.target)) {
			closeApprovalYearFilterMenu();
		}
		if (extraFilterDropdown && !extraFilterDropdown.contains(e.target)) {
			closeExtraFilterMenu();
		}
	});

function isAdminUser(user)
	{
		return !!(user && String(user.email || "").toLowerCase() === "test01@naver.com");
	}

function renderAdminTopbarMenu()
	{

const menus = ["관리자 페이지", "부동산 홈", "분양 정보", "매물 등록", "관심매물", "공지사항"];

const adminPagePanel = document.getElementById("adminPagePanel");
			if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");

const res = await fetch(requestUrl, {
				cache: "no-store",
				headers: { "Accept": "application/json, text/plain, */*" }
			});
			if (!res.ok) throw new Error("HTTP " + res.status);

function closeAdminPage()
	{
		document.body.classList.remove("admin-page-open");

const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");
	}

async function openAdminPage()
	{

const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "false");
		await loadAdminApplications();
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

const url = first ? (first.url || first.publicUrl) : "";
		return url
			? `<img src="${escapeAdminHtml(url)}" alt="매물 사진">`
			: `<span>사진 없음</span>`;
	}

const propertyLabel = propertyValues.length && propertySelect
			? propertyValues.map((value) => Array.from(propertySelect.options).find((option) => option.value === value)?.textContent?.trim() || value).join(", ")
			: "매물 유형";
		if (propertyBtn) propertyBtn.innerHTML = `${escapeAdminHtml(propertyLabel)} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
		if (propertyBtn) propertyBtn.classList.toggle("active", propertyValues.length > 0);

async function loadAdminApplications()
	{

const listEl = document.getElementById("adminApplicationsList");
		if (!listEl) return;

const user = currentRealjejuAuthUser;
		if (!isAdminUser(user)) {
			listEl.innerHTML = '<div class="admin-empty">관리자 계정으로 로그인하세요.</div>';
			return;
		}

const rowId = escapeAdminHtml(row.id);

const refreshBtn = e.target.closest("#adminApplicationsRefreshBtn");
		if (refreshBtn) {
			e.preventDefault();
			e.stopPropagation();
			loadAdminApplications();
			return;
		}

window.closeAuthModal = function() {
		closeAuthModal();
		if (isAdminUser(currentRealjejuAuthUser)) {
			renderAdminTopbarMenu();
		}
	};

window.openAdminPage = openAdminPage;

window.loadAdminApplications = loadAdminApplications;

const textInput = document.getElementById("propertyApprovalDateInput");

const pickerInput = document.getElementById("propertyApprovalDatePicker");

const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");

	if (!textInput || !pickerInput || !pickerBtn) return;

function normalizeApprovalDate(value) {

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

const textInput = document.getElementById("propertyApprovalDateInput");

const pickerInput = document.getElementById("propertyApprovalDatePicker");

const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");

	if (!textInput || !pickerInput || !pickerBtn) return;

function formatApprovalDateFromDigits(digits) {

function normalizeApprovalDate(value) {

const digits = onlyDateDigits(raw);
		if (digits.length === 8) {
			return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
		}

		return formatApprovalDateFromDigits(digits);
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

const approvalDate = fieldValue(fields, ["사용승인일"]) || getFirstMatch(value, /사용승인일\s*[:：]?\s*(\d{4}-\d{2}-\d{2})/);
		// PATCH 2.257: 총점포수/총세대수는 필드맵/원문 정규식에서 숫자가 잡히면 표시 대상으로 확정

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
			floorLevel: floors ? floors[1] : "",
			totalFloor: floors ? floors[2] : (basicFloor ? basicFloor[2] : ""),
			dong: getFirstMatch(value, /해당동\s*[:：]?\s*([^\n]+)/).replace(/동$/, ""),
			direction: getFirstMatch(direction, /([가-힣]+향)/),
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
			etcFacilityText,
			moveInDate,
			moveNegotiable: /협의/.test(moveInText || ""),
			moveNow: /즉시입주|즉시 입주/.test(moveInText || value),
			description: descriptionParts.title ? descriptionParts.body : description
		};
	}

const addressInput = $("propertyAddressInput");
		if (addressInput && parsed.address) {
			addressInput.dataset.address1 = parsed.address;
			addressInput.dataset.publicAddress = parsed.address;
			addressInput.dataset.jibunAddress = parsed.address;
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
		// PATCH 2.243: 해당층/총층이 숫자이면 해당층 입력에 넣고, 문자 층급만 라디오로 처리
		if (/^\d+$/.test(String(parsed.floorLevel || ""))) {
			setInput("propertyCurrentFloorInput", parsed.floorLevel);
		}
		else if (parsed.floorLevel === "중층") {
			setCheck("propertyFloorLevelUseCheck", true);
			setRadio("propertyFloorLevel", "middle");
		}
		setInput("propertyDongInput", parsed.dong);
		if (parsed.direction) setSelectValue("propertyDirectionSelect", parsed.direction);
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

const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) {
			adminPagePanel.setAttribute("aria-hidden", "true");
			adminPagePanel.style.display = "";
			adminPagePanel.classList.remove("open", "active", "is-open");
		}

const adminPagePanel = document.getElementById("adminPagePanel");
		if (adminPagePanel) adminPagePanel.setAttribute("aria-hidden", "true");
