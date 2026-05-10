// REALJEJU property-register.js - split from realjeju_2.361(3).html

/* ===== PATCH: 매물 등록 - 상세 정보 글자수 ===== */
(function bindPropertyDetailDescriptionCounter()
{

const currentMenus = Array.from(topbarMenu.querySelectorAll(".topbar-menu-item")).map((button) => button.textContent.trim());
		if (currentMenus.length === menus.length && currentMenus.every((label, index) => label === menus[index])) return;

		topbarMenu.replaceChildren(...menus.map((label) => {
			if (label === "매물 등록") {

const button = document.createElement("button");
				button.type = "button";
				button.className = "topbar-menu-item";
				button.textContent = "매물 등록";

const currentMenus = Array.from(topbarMenu.querySelectorAll(".topbar-menu-item")).map((button) => button.textContent.trim());
		if (currentMenus.length === menus.length && currentMenus.every((label, index) => label === menus[index])) return;

		topbarMenu.replaceChildren(...menus.map((label) => {
			if (label === "매물 등록") {

const button = document.createElement("button");
				button.type = "button";
				button.className = "topbar-menu-item";
				button.textContent = "매물 등록";

const propertyRegisterPage = document.getElementById("propertyRegisterPage");
			if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "true");

const propertyRegisterBottomBar = document.getElementById("propertyRegisterBottomBar");
			if (propertyRegisterBottomBar) propertyRegisterBottomBar.classList.remove("open", "active", "is-open");

function closePropertyRegisterPage()
	{
		document.body.classList.remove("property-register-page-open");

const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "true");
	}

function hasPropertyRegisterDraft()
	{

const page = document.getElementById("propertyRegisterPage");
		if (!page) return false;

function scrollPropertyRegisterToTop()
	{

const page = document.getElementById("propertyRegisterPage");
		if (page) {
			page.scrollTop = 0;
			if (typeof page.scrollTo === "function") page.scrollTo({ top: 0, left: 0, behavior: "auto" });

const inner = page.querySelector(".property-register-inner");
			if (inner && typeof inner.scrollIntoView === "function") {
				inner.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
			}
		}
		window.scrollTo(0, 0);
	}

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

// PATCH 2.228: 작성 중인 글 확인 모달에서 취소를 누르면 매물 등록 폼 전체 초기화

async function resetPropertyRegisterForm()
	{
		resetPropertyRegisterFormFields();
		if (typeof loadPropertyRegistrantInfoDirect === "function") await loadPropertyRegistrantInfoDirect();
		scrollPropertyRegisterToTop();
	}

const propertyRegisterPage = document.getElementById("propertyRegisterPage");
			if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "false");
			// PATCH 2.283: 작성 중이면 취소 시 위치/내용을 유지하기 위해 확인 전에는 스크롤하지 않음

const hasDraft = hasPropertyRegisterDraft();
			if (hasDraft && typeof openAuthConfirmModal === "function") {
				// PATCH 2.242: 새 글 작성 확인 문구에 맞춰 확인은 초기화, 취소는 기존 글 유지로 동작
				openAuthConfirmModal(
					"작성 중인 글이 있습니다. 이전 글을 취소하고 새로 쓸까요?",
					"매물 등록",
					// PATCH 2.280: 확인 후에는 열린 매물등록 페이지 안에서 바로 초기화하고 맨 위로 이동
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

		document.body.classList.add("property-register-page-open");

const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) {
			propertyRegisterPage.setAttribute("aria-hidden", "false");
		}
		// PATCH 2.358: 상단 매물 등록[무료]로 새 등록을 열 때는 이전 수정 ID/입력값/사진을 전부 비운다.
		resetPropertyRegisterFormFields();
		renderPropertyPriceFields();
		scrollPropertyRegisterToTop();

		await loadPropertyRegistrantInfoDirect();
		scrollPropertyRegisterToTop();
	}

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

function updatePropertyRegisterAreaFields()
	{

function bindPropertyRegisterPageEvents()
	{
		bindPropertyAreaAutoCalc();
		bindPropertyMoneyCommaInputs(document);
		bindPropertyPlainNumberCommaInputs(document);
		bindPropertyRoomBathNotApplicable();
		bindPropertyPhotoPreviewUpload();

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

const option = wrap.querySelector(`.property-register-dropdown-option[data-value="${CSS.escape(select.value)}"]`);
			wrap.querySelectorAll(".property-register-dropdown-option").forEach((btn) => btn.classList.toggle("active", btn === option));
			if (label) label.textContent = option ? option.textContent.trim() : (select.options[select.selectedIndex]?.textContent || "선택");
		}
		select.dispatchEvent(new Event("change", { bubbles: true }));
	}

window.openPropertyRegisterPage = openPropertyRegisterPage;

window.closePropertyRegisterPage = closePropertyRegisterPage;

/* ===== PATCH: 매물 등록 커스텀 드롭다운 ===== */
(function initPropertyRegisterDropdowns()
{

const options = dropdown.querySelectorAll(".property-register-dropdown-option");
		if (!select || !trigger || !label || !options.length) return;

const option = event.target.closest(".property-type-dropdown .property-register-dropdown-option");
		if (!option) return;
		setTimeout(updateDongHoVisibility, 0);
	});

	updateDongHoVisibility();
})();

(function () {

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

const input = row.querySelector(".property-register-input");

/* ===== PATCH 2.166: 매물 등록 Supabase 저장 ===== */
(function bindPropertyListingSave()
{

function collectPropertyRegisterFormState()
	{

const page = $("propertyRegisterPage");

function resizeListingPhotoFile(file)
	{
		return new Promise((resolve, reject) => {

async function uploadListingPhotos(client, userId, listingId)
	{

const resized = await resizeListingPhotoFile(files[i]);

const controls = Array.from(row.querySelectorAll("input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled)"))
			.filter((control) => isVisibleRequiredElement(control) || control.classList.contains("property-register-native-select"));
		if (!controls.length) return true;

const page = $("propertyRegisterPage");
		if (!page) return null;

const client = typeof window.getRealjejuSupabaseClient === "function" ? window.getRealjejuSupabaseClient() : null;
		if (!client) {
			openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "매물 등록", null);
			return;
		}

		const { data: userData, error: userError } = await client.auth.getUser();

const user = userData && userData.user ? userData.user : null;
		if (userError || !user) {
			openAuthErrorModal("로그인 후 매물을 등록할 수 있습니다.", "매물 등록", null, typeof openAuthModal === "function" ? openAuthModal : null);
			return;
		}

const validation = validateListing(payload, status);
		if (validation) {
			openAuthErrorModal(validation.message, "매물 등록", validation.target);
			return;
		}

const page = $("propertyRegisterPage");

const retryResult = await client
					.from(TABLE_NAME)
					.insert(row);
				error = retryResult.error;
			}

			if (error) {
				console.error("매물 저장 실패:", error);
				openAuthErrorModal(`매물 저장에 실패했습니다.\n${error.message || "Supabase 테이블과 RLS 정책을 확인하세요."}`, "매물 등록", null);
				return;
			}

const uploadResult = await uploadListingPhotos(client, user.id, savedListingId);

const mergedSavedPhotos = [...existingPreviewPhotos, ...uploadResult.photos].map((photo, index) => ({
				...photo,
				order: index + 1
			}));
			if (mergedSavedPhotos.length || (!existingListingId && !hasSelectedPhotoFiles)) {
				const { error: photoUpdateError } = await client
					.from(TABLE_NAME)
					.update({ photos: mergedSavedPhotos })
					.eq("id", savedListingId)
					.eq("user_id", user.id);
				if (photoUpdateError) {
					console.error("매물 사진 정보 저장 실패:", photoUpdateError);
					openAuthErrorModal("매물은 저장됐지만 사진 정보 저장에 실패했습니다.", "매물 등록", null);
					return;
				}
			}

const page = $("propertyRegisterPage");
		return !!(page && page.dataset.listingId);
	}

/* ===== PATCH 2.170: 교차로 복사글 간편 매물 등록 ===== */
(function bindCrossroadPasteImport()
{
	function $(id)
	{
		return document.getElementById(id);
	}

const option = wrap.querySelector(`.property-register-dropdown-option[data-value="${CSS.escape(value)}"]`);
			wrap.querySelectorAll(".property-register-dropdown-option").forEach((btn) => {
				btn.classList.toggle("active", btn === option);
			});
			if (label) label.textContent = option ? option.textContent.trim() : (select.options[select.selectedIndex]?.textContent || "");
		}
		select.dispatchEvent(new Event("change", { bubbles: true }));
	}

const propertyTypeSelect = $("propertyTypeSelect");
		if (propertyTypeSelect) {
			// PATCH 2.237: 간편등록 적용 전 면적 모드를 붙여넣은 5줄 기준으로 완전히 새로 설정
			propertyTypeSelect.dataset.areaMode = parsed.areaMode || "";
		}
		if (parsed.propertyType) setSelectValue("propertyTypeSelect", parsed.propertyType);
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

const modal = $("quickPropertyModal");
		if (!modal) return;
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
		document.body.style.overflow = document.body.classList.contains("property-register-page-open") ? "" : document.body.style.overflow;
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

const btn = $("quickPropertyRegisterBtn");
		if (!btn || btn.dataset.crossroadImportBound === "1") return;
		btn.dataset.crossroadImportBound = "1";
		bindQuickPropertySourceOptions();

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

/* ===== PATCH 2.152: 매물 등록 주소 입력 모달 ===== */
(function initPropertyAddressInputModal(){

const addressWrap = addressInput.closest(".property-address-wrap");

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

const query = String(searchInput?.value || "").trim();
		if (!query) {
			renderGuide();
			searchInput?.focus();
			return;
		}
		if (!window.kakao || !kakao.maps || !kakao.maps.services) {
			renderMessage("주소 검색 서비스를 불러오지 못했습니다.", "property-address-search-empty");
			return;
		}
		renderMessage("주소를 검색하는 중입니다.", "property-address-search-loading");

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

const propertyRegisterPage = document.getElementById("propertyRegisterPage");
		if (propertyRegisterPage) propertyRegisterPage.setAttribute("aria-hidden", "true");
