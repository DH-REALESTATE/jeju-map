/* REALJEJU 5.436 ordered runtime tail. */
/* [ARCHIVE] PATCH ARCHIVE (3.921) =====
 * [ARCHIVE] PATCH 2.365: 계정 드롭다운 > 이용권 결제 페이지 전환.
 * [ARCHIVE] PATCH 3.185: 우측 상단 계정 메뉴는 클릭으로만 열고 닫는다.
 * [ARCHIVE] PATCH 3.862: 최근 조회 상세 패널 열림 시, 상세패널 기준으로 필터바 시작점 보정.
 */

/* [ARCHIVE] PATCH: auth modal dialog 내부 클릭은 overlay로 전파하지 않음 */
document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".auth-modal-dialog").forEach(function (dialog) {
		dialog.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	});
});

/* [ARCHIVE] PATCH: 내 정보 설정 저장 버튼 강제 연결 - submit 이벤트 미동작 대비 */
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
			const finalProfileImage = uploadedProfileImage || window.authProfilePhotoUrl || "";
			window.authProfilePhotoUrl = finalProfileImage;
			const updatedProfile = { ...(window.realjejuCurrentProfile || {}), name: name, phone: phone, role_request: role, profile_completed: true, profile_image: finalProfileImage || (window.realjejuCurrentProfile && window.realjejuCurrentProfile.profile_image) || "" };
			if (typeof writeRealjejuCachedProfile === "function") writeRealjejuCachedProfile(user.id, updatedProfile);
			window.realjejuCurrentProfile = updatedProfile;
			if (typeof window.realjejuSyncSideNavAccount === "function") window.realjejuSyncSideNavAccount();
			if (typeof window.clearAuthProfilePhotoFile === "function") window.clearAuthProfilePhotoFile();
			if (typeof window.setAuthProfilePhotoPreview === "function") window.setAuthProfilePhotoPreview(finalProfileImage);
			if (typeof window.setMyInfoProfileImage === "function") window.setMyInfoProfileImage(finalProfileImage);
			const brokerRoles = ["broker", "agent", "agent_sub", "corporation"];
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
		const showBrokerOfficeMenu = ["broker", "agent", "agent_sub", "corporation"].includes(role);
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


/* [ARCHIVE] PATCH: 매물 등록 커스텀 드롭다운 ===== */
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
				if (select.id === "propertyTypeSelect") select.dataset.areaMode = "";
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

/* [ARCHIVE] PATCH 3.096: 커스텀 드롭다운 표시값과 실제 select 값을 저장 전까지 같은 값으로 보관 */
(function bindRegisterDropdownValueCapture()
{
	function syncFromOption(option)
	{
		const dropdown = option?.closest?.("[data-register-dropdown]");
		const select = dropdown?.querySelector?.("select");
		if (!dropdown || !select) return;
		const nextValue = String(option.dataset.value || "").trim();
		if (!nextValue) return;
		if (select.id === "propertyTypeSelect") select.dataset.areaMode = "";
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

	function toPickerApprovalDate(value) {
		const normalized = normalizeApprovalDate(value);
		return isValidNativeDateValue(normalized) ? normalized : "";
	}

	function isValidNativeDateValue(value) {
		const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!match) return false;
		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);
		if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
		if (month < 1 || month > 12 || day < 1 || day > 31) return false;
		const date = new Date(year, month - 1, day);
		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
	}

	function syncTextToPicker() {
		const value = normalizeApprovalDate(textInput.value);
		textInput.value = value;

		pickerInput.value = toPickerApprovalDate(value);
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

	function toPickerApprovalDate(value) {
		const normalized = normalizeApprovalDate(value);
		return isValidNativeDateValue(normalized) ? normalized : "";
	}

	function isValidNativeDateValue(value) {
		const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!match) return false;
		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);
		if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
		if (month < 1 || month > 12 || day < 1 || day > 31) return false;
		const date = new Date(year, month - 1, day);
		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
	}

	function syncPickerValue() {
		pickerInput.value = toPickerApprovalDate(textInput.value);
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
		if (isValidMoveInNativeDateValue(value)) {
			pickerInput.value = value;
		} else {
			pickerInput.value = "";
		}
	}

	function isValidMoveInNativeDateValue(value) {
		const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!match) return false;
		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);
		if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
		if (month < 1 || month > 12 || day < 1 || day > 31) return false;
		const date = new Date(year, month - 1, day);
		return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
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

	const visibleTypeValues = ["apartment", "officetel", "room", "living_accommodation", "villa"];

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
		"living_accommodation",
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
		const barRect = bottomBar.getBoundingClientRect();
		const offsetLeft = Math.max(0, rect.left - barRect.left);

		bottomBar.style.justifyContent = "flex-start";
		bottomBar.style.paddingLeft = "0";
		bottomBar.style.paddingRight = "0";

		bottomInner.style.width = rect.width + "px";
		bottomInner.style.marginLeft = offsetLeft + "px";
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

/* [ARCHIVE] PATCH: 매물등록 진입 시 등록자 정보 최신 조회 ===== */
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

/* [ARCHIVE] PATCH: 등록자 정보 소속공인중개사 토글 직접 바인딩 ===== */
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

/* [ARCHIVE] PATCH 2.166: 매물 등록 Supabase 저장 ===== */
// =====================================================
// 12. 매물 등록 / 수정 / 사진 업로드
// =====================================================

(function bindPropertyListingSave()
{
	const TABLE_NAME = "property_listings";
	// [ARCHIVE] PATCH 3.030: 매물 사진은 등록 전 1600px JPEG로 리사이즈한 뒤 Storage에 저장
	const PROPERTY_PHOTOS_BUCKET = "property-photos";
	const PROPERTY_PHOTO_MAX_EDGE = 1280;
	const PROPERTY_PHOTO_JPEG_QUALITY = 0.80;
	// 4.963: 목록ㆍ갤러리 하단에 필요한 신규 작은 썸네일은 긴 변 300px만 만듭니다.
	// 기존 360px 썸네일은 다시 변환하거나 삭제하지 않고 그대로 호환합니다.
	const PROPERTY_THUMB_MAX_EDGE = 300;
	const PROPERTY_THUMB_JPEG_QUALITY = 0.80;
	// 오른쪽 상세 상단 전용 파생본은 현재 대표사진 한 장에만 생성합니다.
	const PROPERTY_DETAIL_MAX_EDGE = 600;
	const PROPERTY_DETAIL_JPEG_QUALITY = 0.80;
	// [ARCHIVE] PATCH 2.316: 저장 완료 모달 확인 전까지 중복 저장 요청을 차단
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

	function setPropertyApprovalDateFieldLabel(labelText = "사용승인일")
	{
		const normalizedLabel = String(labelText || "사용승인일").trim() || "사용승인일";
		const label = document.querySelector('label[for="propertyApprovalDateInput"]');
		if (label) label.innerHTML = `${normalizedLabel}<span class="property-required">*</span>`;
		const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");
		if (pickerBtn) pickerBtn.setAttribute("aria-label", `${normalizedLabel} 달력 열기`);
	}

	function getPropertyApprovalDateFieldLabel()
	{
		const label = document.querySelector('label[for="propertyApprovalDateInput"]');
		const text = String(label?.textContent || "").replace(/\*/g, "").trim();
		return text === "사용검사일" ? "사용검사일" : "사용승인일";
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

	// [ARCHIVE] PATCH 2.322: 수정 화면 복원을 위해 현재 매물등록 폼의 실제 입력 상태를 payload에 함께 저장
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

	// [ARCHIVE] PATCH 2.312: DB에서 ID를 받지 않고 프론트에서 매물 UUID를 먼저 확정
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

	// [ARCHIVE] PATCH 2.312: 사진 파일을 canvas에서 긴 변 1280px 기준 JPEG로 변환
	function resizeListingPhotoFile(file, options = {})
	{
		const maxEdge = Number(options.maxEdge) || PROPERTY_PHOTO_MAX_EDGE;
		const quality = Number.isFinite(Number(options.quality)) ? Number(options.quality) : PROPERTY_PHOTO_JPEG_QUALITY;
		return new Promise((resolve, reject) => {
			const img = new Image();
			const objectUrl = URL.createObjectURL(file);
			img.onload = () => {
				try {
					const sourceWidth = img.naturalWidth || img.width;
					const sourceHeight = img.naturalHeight || img.height;
					if (!sourceWidth || !sourceHeight) throw new Error("이미지 크기를 확인할 수 없습니다.");
					const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
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
					}, "image/jpeg", quality);
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

	// [ARCHIVE] PATCH 2.312: DB 저장 성공 후 user_id/listing_id 폴더에 사진 업로드
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
				const resized = await resizeListingPhotoFile(files[i], {
					maxEdge: PROPERTY_PHOTO_MAX_EDGE,
					quality: PROPERTY_PHOTO_JPEG_QUALITY
				});
				const thumbnail = await resizeListingPhotoFile(files[i], {
					maxEdge: PROPERTY_THUMB_MAX_EDGE,
					quality: PROPERTY_THUMB_JPEG_QUALITY
				});
				const fileName = `photo-${String(order).padStart(3, "0")}.jpg`;
				const thumbFileName = `thumb-${String(order).padStart(3, "0")}.jpg`;
				const path = `${userId}/${listingId}/${uploadBatchId}/${fileName}`;
				const thumbPath = `${userId}/${listingId}/${uploadBatchId}/${thumbFileName}`;
				const { error } = await bucket.upload(path, resized.blob, {
					cacheControl: "31536000",
					contentType: "image/jpeg",
					upsert: false
				});
				if (error) throw error;
				const publicData = bucket.getPublicUrl(path);
				let thumbnailUrl = "";
				let uploadedThumbPath = "";
				try {
					const thumbUpload = await bucket.upload(thumbPath, thumbnail.blob, {
						cacheControl: "31536000",
						contentType: "image/jpeg",
						upsert: false
					});
					if (thumbUpload.error) throw thumbUpload.error;
					const thumbPublicData = bucket.getPublicUrl(thumbPath);
					thumbnailUrl = thumbPublicData?.data?.publicUrl || "";
					uploadedThumbPath = thumbPath;
				} catch (thumbErr) {
					console.warn("매물 썸네일 업로드 실패:", thumbErr);
				}
				photos.push({
					path,
					url: publicData?.data?.publicUrl || "",
					thumbnail_path: uploadedThumbPath,
					thumbnail_url: thumbnailUrl || publicData?.data?.publicUrl || "",
					name: fileName,
					thumbnail_name: uploadedThumbPath ? thumbFileName : "",
					order,
					width: resized.width,
					height: resized.height,
					thumbnail_width: thumbnail.width,
					thumbnail_height: thumbnail.height,
					size: resized.blob.size,
					thumbnail_size: uploadedThumbPath ? thumbnail.blob.size : 0,
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

	function getStoredPhotoOriginalUrl(photo)
	{
		if (!photo || typeof photo !== "object") return "";
		return String(photo.url || photo.publicUrl || photo.public_url || photo.src || "").trim();
	}

	function getStoredPhotoDetailUrl(photo)
	{
		if (!photo || typeof photo !== "object") return "";
		return String(photo.detail_url || photo.detailUrl || photo.detail_image_url || photo.detailImageUrl || "").trim();
	}

	function buildRepresentativeDetailPath(photo, userId, listingId)
	{
		const originalPath = String(photo?.path || photo?.storage_path || "").trim().replace(/^\/+/, "");
		if (originalPath) {
			const parts = originalPath.split("/");
			const fileName = parts.pop() || "photo-001.jpg";
			return [...parts, `detail-${fileName.replace(/^detail-/, "")}`].join("/");
		}
		return `${userId}/${listingId}/derived/detail-${Date.now()}.jpg`;
	}

	async function ensureRepresentativeDetailPhoto(client, userId, listingId, photos)
	{
		// 대표사진이 바뀌어도 해당 사진에 이미 600px 파생본이 있으면 그대로 재사용합니다.
		// 원본과 기존 썸네일은 어떤 경우에도 삭제ㆍ이동ㆍ덮어쓰지 않습니다.
		const savedPhotos = Array.isArray(photos) ? photos.filter(Boolean).map(photo => ({ ...photo })) : [];
		if (!savedPhotos.length) return savedPhotos;
		const representative = savedPhotos[0];
		if (getStoredPhotoDetailUrl(representative)) return savedPhotos;

		const originalUrl = getStoredPhotoOriginalUrl(representative);
		if (!originalUrl) return savedPhotos;
		try {
			const response = await fetch(originalUrl, { cache: "force-cache", credentials: "omit" });
			if (!response.ok) throw new Error(`대표사진 원본 요청 실패 (${response.status})`);
			const originalBlob = await response.blob();
			const detail = await resizeListingPhotoFile(originalBlob, {
				maxEdge: PROPERTY_DETAIL_MAX_EDGE,
				quality: PROPERTY_DETAIL_JPEG_QUALITY
			});
			const detailPath = buildRepresentativeDetailPath(representative, userId, listingId);
			const bucket = client.storage.from(PROPERTY_PHOTOS_BUCKET);
			const uploadResult = await bucket.upload(detailPath, detail.blob, {
				cacheControl: "31536000",
				contentType: "image/jpeg",
				upsert: false
			});
			const uploadErrorText = String([
				uploadResult.error?.message,
				uploadResult.error?.error,
				uploadResult.error?.statusCode
			].filter(Boolean).join(" "));
			if (uploadResult.error && !/already exists|duplicate|409|resource exists/i.test(uploadErrorText)) {
				throw uploadResult.error;
			}
			const publicData = bucket.getPublicUrl(detailPath);
			const detailUrl = publicData?.data?.publicUrl || "";
			if (!detailUrl) throw new Error("대표사진 상세용 URL을 만들 수 없습니다.");
			savedPhotos[0] = {
				...representative,
				detail_path: detailPath,
				detail_url: detailUrl,
				detail_width: detail.width,
				detail_height: detail.height,
				detail_size: detail.blob.size
			};
		}
		catch (error) {
			// 파생본 실패가 매물ㆍ원본 사진 저장을 막지 않게 하고 기존 표시 경로로 복구합니다.
			console.warn("대표사진 600px 파생본 생성 실패:", error);
		}
		return savedPhotos;
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

	function getLandConditionPairs()
	{
		return [
			{ id: "landNationalUseChk", key: "national_land_use", label: "국토이용" },
			{ id: "landUrbanPlanningChk", key: "urban_planning", label: "도시계획" },
			{ id: "landBuildingPermitChk", key: "building_permit", label: "건축허가" },
			{ id: "landTransactionPermitChk", key: "land_transaction_permit", label: "토지거래허가" }
		];
	}

	function collectLandConditionPayload()
	{
		const pairs = getLandConditionPairs();
		const flags = {};
		const labels = [];
		pairs.forEach((item) => {
			const active = checked(item.id);
			flags[item.key] = active;
			if (active) labels.push(item.label);
		});
		return { ...flags, labels };
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
				return "";
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
		// [ARCHIVE] PATCH 2.323: 기타 부과 관리비는 부과기준 라디오가 비어 있지 않게 기본값을 함께 저장
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
				if (item && item.key && item.label && !savedAreaLabels[item.key]) savedAreaLabels[item.key] = item.label;
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
		const address1Value = addressInput?.dataset.address1 || addressInput?.value?.trim() || "";
		const addressHideDetailCheck = document.getElementById("propertyAddressHideDetailCheck");
		const hideDetailJibun = addressHideDetailCheck
			? !!addressHideDetailCheck.checked
			: addressInput?.dataset.hideDetailJibun === "1";
		if (addressInput) addressInput.dataset.hideDetailJibun = hideDetailJibun ? "1" : "0";
		const publicAddressValue = hideDetailJibun
			? formatPublicRegionAddress(address1Value)
			: (addressInput?.dataset.publicAddress || address1Value);
		if (savedAddress) {
			savedAddress.address1 = address1Value || savedAddress.address1 || "";
			savedAddress.publicAddress = publicAddressValue || savedAddress.publicAddress || "";
			savedAddress.addressDisplay = publicAddressValue || savedAddress.addressDisplay || "";
			savedAddress.hideDetailJibun = hideDetailJibun;
			savedAddress.locationDisplayType = locationDisplayType;
			if (hasLocationBounds) savedAddress.locationBounds = locationBounds;
		}
		const brokerListingFlags = {
			exclusive: checked("propertyExclusiveListingCheck"),
			co_broker: checked("propertyCoBrokerCheck")
		};
		const brokerListingTypes = [
			brokerListingFlags.exclusive ? "exclusive" : "",
			brokerListingFlags.co_broker ? "co_broker" : ""
		].filter(Boolean);

		return {
			status,
				property_type: propertyTypeValue,
				property_type_label: propertyTypeLabel,
				deal_types: dealTypes,
				title,
				...(listingNo ? { listing_no: listingNo } : {}),
			address1: address1Value,
			address2: addressInput?.dataset.address2 || "",
			public_address: publicAddressValue,
			hide_detail_jibun: hideDetailJibun,
			location_display_type: locationDisplayType,
			lat: Number.isFinite(lat) ? lat : null,
			lng: Number.isFinite(lng) ? lng : null,
				payload: {
					version: APP_VERSION,
					...(listingNo ? { listing_no: listingNo } : {}),
					broker_listing_flags: brokerListingFlags,
					broker_listing_types: brokerListingTypes,
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
					// [ARCHIVE] PATCH 2.287: 토지종류와 용도지역 드롭다운 값을 저장 payload에 포함
					land_type: value("landTypeSelect"),
					land_use_zone: value("landUseZoneSelect"),
					land_road: String(value("landRoadInput") || "").replace(/^\s*접\s*[:：]\s*/, "").trim(),
					land_conditions: collectLandConditionPayload()
				},
				prices: collectPricePayload(),
					building: {
						approval_date: value("propertyApprovalDateInput"),
						approval_date_label: getPropertyApprovalDateFieldLabel(),
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
					// [ARCHIVE] PATCH 2.295: 방/욕실 해당없음 선택값을 저장 payload에 포함
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
				watermark_enabled: radioValue("propertyWatermarkEnabled") !== "no",
				youtube_url: value("propertyYoutubeLinkInput"),
				agency_memo: value("propertyAgencyMemoInput").slice(0, 500),
				registrant: {
					agency_id: currentOffice.id || "",
					agency_user_id: currentOffice.user_id || "",
					office_name: value("registrantOfficeNameInput"),
					representative: value("registrantRepresentativeInput"),
					phone1: value("registrantPhone1Input"),
					manager_name: value("registrantManagerNameInput"),
					is_licensed_agent: checked("registrantLicensedAgentChk"),
					phone2: value("registrantPhone2Input"),
					office_reg_no: normalizeBrokerOfficeRegNo(currentOffice.office_reg_no),
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
			office_reg_no: normalizeBrokerOfficeRegNo(firstText(registrant.office_reg_no, office.office_reg_no, office.reg_no, office.registration_no, office.license_no)),
			office_address: firstText(registrant.office_address, office.office_address, office.address, office.office_addr),
			agent_image: firstText(registrant.agent_image, registrant.profile_image, profile.profile_image, profile.avatar_url),
			email: firstText(registrant.email, office.email),
			kakao_url: firstText(registrant.kakao_url, registrant.kakaoUrl, office.kakao_url, office.kakaoUrl, office.kakao, office.kakao_open_chat, office.kakao_open_chat_url, office.open_chat_url)
		};
		return payload;
	}

	// [ARCHIVE] PATCH 2.314: 화면에 보이는 빨간 * 라벨은 저장 전 필수 입력으로 공통 검증
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
			// 4.996: 사진 미리보기 모듈의 내부 상태를 바깥 저장 모듈에서 직접 참조하지 않는다.
			// 미리보기 모듈이 공개한 신규/기존 사진 목록과 실제 미리보기 DOM을 함께 확인한다.
			const newPhotoFiles = Array.isArray(window.realjejuPropertyPhotoFiles)
				? window.realjejuPropertyPhotoFiles.filter(Boolean)
				: [];
			const existingPhotos = Array.isArray(window.realjejuExistingPropertyPhotos)
				? window.realjejuExistingPropertyPhotos.filter((photo) =>
					!!String(photo && (photo.url || photo.publicUrl) || "").trim()
				)
				: [];
			const hasPreviewPhoto = !!document.querySelector("#propertyPhotoPreviewGrid .property-photo-preview-item img[src]");
			const hasListingPhoto = newPhotoFiles.length > 0 || existingPhotos.length > 0 || hasPreviewPhoto;
			if (!hasListingPhoto) {
				return {
					message: "매물 사진은 1장 이상 등록해야 합니다.",
					target: $("propertyPhotoUploadInput") || $("propertyPhotoUploadBox")
				};
			}
			const requiredValidation = validateVisibleRequiredFields();
			if (requiredValidation) return requiredValidation;
		}
		if (!payload.property_type) return { message: "매물 유형을 선택하세요.", target: $("propertyTypeSelect") };
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

	function acquirePropertyListingSaveLock()
	{
		const page = $("propertyRegisterPage");
		if (propertyListingSubmitClickLock || propertyListingSaveInFlight || (page && page.dataset.saveInFlight === "1")) return false;
		// 첫 클릭 이벤트 안에서 잠금을 선점해 인증ㆍ권한ㆍ검증ㆍDBㆍ사진 요청 전체의 재진입을 막는다.
		propertyListingSubmitClickLock = true;
		propertyListingSaveInFlight = true;
		if (page) page.dataset.saveInFlight = "1";
		[$("propertySubmitBtn"), $("propertyDraftSaveBtn")].forEach((btn) => {
			if (!btn) return;
			btn.disabled = true;
			btn.setAttribute("aria-busy", "true");
		});
		return true;
	}

	function releasePropertyListingSaveLock()
	{
		const page = $("propertyRegisterPage");
		propertyListingSubmitClickLock = false;
		propertyListingSaveInFlight = false;
		if (page) delete page.dataset.saveInFlight;
		[$("propertySubmitBtn"), $("propertyDraftSaveBtn")].forEach((btn) => {
			if (!btn) return;
			btn.disabled = false;
			btn.removeAttribute("aria-busy");
		});
	}
	window.realjejuResetPropertyListingSaveLock = releasePropertyListingSaveLock;

	async function saveListing(status, options = {})
	{
		const page = $("propertyRegisterPage");
		if (!options.lockAcquired && !acquirePropertyListingSaveLock()) return;
		const submitBtn = $("propertySubmitBtn");
		const draftBtn = $("propertyDraftSaveBtn");
		const setSaveButtonsDisabled = (disabled) => {
			[submitBtn, draftBtn].forEach((btn) => {
				if (!btn) return;
				btn.disabled = disabled;
				if (disabled) btn.setAttribute("aria-busy", "true");
				else btn.removeAttribute("aria-busy");
			});
		};
		setSaveButtonsDisabled(true);
		let keepButtonsLockedUntilConfirm = false;

		// [ARCHIVE] PATCH 2.313: 저장 스크립트는 전역 Supabase 클라이언트 팩토리를 명시적으로 사용
		const client = typeof window.getRealjejuSupabaseClient === "function" ? window.getRealjejuSupabaseClient() : null;

		try {
			if (!client) {
				openAuthErrorModal("Supabase 연결 설정을 확인하세요.", "매물 등록", null);
				return;
			}

			const { data: userData, error: userError } = await client.auth.getUser();
			const user = userData && userData.user ? userData.user : null;
			if (userError || !user) {
				openAuthErrorModal("매물 등록은 대표 공인중개사 또는\n법인 회원만 가능합니다.", "매물 등록", null, typeof openAuthModal === "function" ? openAuthModal : null);
				return;
			}

				const requireBrokerAccess = typeof window.requireApprovedBrokerForPropertyRegister === "function"
					? window.requireApprovedBrokerForPropertyRegister
					: null;
				const brokerAccess = requireBrokerAccess ? await requireBrokerAccess() : null;
				if (!brokerAccess) {
					return;
				}
					const guardPaymentPlan = getRealjejuPaymentPlanGuard();
					if (status === "published" && guardPaymentPlan && !guardPaymentPlan("매물 등록")) {
						return;
					}

				const payload = collectListingPayload(status);
			enrichListingRegistrantSnapshot(payload, brokerAccess);
			const validation = validateListing(payload, status);
			if (validation) {
				openAuthErrorModal(validation.message, "매물 등록", validation.target);
				return;
			}

			const existingListingId = normalizeItemId(page?.dataset.listingId || page?.dataset.editListingId || "");
			const listingId = existingListingId || page?.dataset.pendingListingId || createListingId();
			if (!existingListingId && page) page.dataset.pendingListingId = listingId;
			const row = {
				...payload,
				id: listingId,
				user_id: user.id,
				agency_id: brokerAccess.brokerOffice?.id || window.realjejuCurrentBrokerOffice?.id || null
			};
			delete row.listing_no;
			if (!existingListingId) row.updated_at = new Date().toISOString();

				let error = null;
				// [ARCHIVE] PATCH 2.315: 이미 저장된 작성 화면은 새 매물을 만들지 않고 같은 row를 수정
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

			// [ARCHIVE] PATCH 3.158: 신규 저장 중 같은 ID가 이미 들어갔다면 새 매물을 만들지 않고 같은 row를 이어서 사용
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
				page.dataset.editListingId = savedListingId;
				delete page.dataset.pendingListingId;
			}
			const uploadResult = await uploadListingPhotos(client, user.id, savedListingId);
			const photoSaveListBuilder = typeof window.realjejuBuildPropertyPhotoSaveList === "function" ? window.realjejuBuildPropertyPhotoSaveList : null;
			let savedPhotos = photoSaveListBuilder
				? photoSaveListBuilder(uploadResult.photos)
				: [
					...(Array.isArray(window.realjejuExistingPropertyPhotos) ? window.realjejuExistingPropertyPhotos : []),
					...uploadResult.photos
				].map((photo, index) => ({ ...photo, order: index + 1 }));
			// 순서 변경 뒤 실제 첫 번째 사진 한 장에만 상세 상단용 600px 파생본을 보장합니다.
			savedPhotos = await ensureRepresentativeDetailPhoto(client, user.id, savedListingId, savedPhotos);
			// 4.090: 새 등록/수정 저장마다 첫 번째 사진의 썸네일 URL을 대표 이미지로 저장한다.
			// 4.112: 상세 첫 화면은 photos 전체 조회 없이 photo_count 숫자로 1/N 배지를 표시한다.
			// 목록/마커/관리 화면은 이 payload.thumbnail_url만 읽고 photos 전체는 읽지 않는다.
			const representativeThumbnailUrl = getListingSummaryThumbnailUrl({ photos: savedPhotos }, payload.payload, savedPhotos);
			const representativeDetailPhoto = Array.isArray(savedPhotos) && savedPhotos.length ? savedPhotos[0] : null;
			const representativeDetailUrl = getStoredPhotoDetailUrl(representativeDetailPhoto);
			const representativeDetailPath = String(representativeDetailPhoto?.detail_path || representativeDetailPhoto?.detailPath || "").trim();
			const representativePhotoCount = Array.isArray(savedPhotos) ? savedPhotos.filter(Boolean).length : 0;
			const payloadWithThumbnail = {
				...(payload.payload && typeof payload.payload === "object" ? payload.payload : {}),
				thumbnail_url: representativeThumbnailUrl,
				detail_image_url: representativeDetailUrl,
				detail_image_path: representativeDetailPath,
				photo_count: representativePhotoCount,
				photoCount: representativePhotoCount,
				thumbnail: {
					...((payload.payload && payload.payload.thumbnail && typeof payload.payload.thumbnail === "object") ? payload.payload.thumbnail : {}),
					url: representativeThumbnailUrl,
					detail_url: representativeDetailUrl,
					photo_count: representativePhotoCount
				}
			};
			const { error: photoUpdateError } = await client
				.from(TABLE_NAME)
				.update({ photos: savedPhotos, payload: payloadWithThumbnail })
				.eq("id", savedListingId)
				.eq("user_id", user.id);
			if (photoUpdateError) {
				console.error("매물 사진 정보 저장 실패:", photoUpdateError);
				openAuthErrorModal("매물은 저장됐지만 사진 정보 저장에 실패했습니다.", "매물 등록", null);
				return;
			}
			// 4.119: 저장된 매물은 이전 상세 캐시를 버리고, 복귀 화면에서 해당 한 건만 새 데이터로 갱신한다.
			deleteLeftListDetailItemCache(savedListingId);

			let completeMessage = existingListingId ? (status === "draft" ? "임시저장 내용이 수정되었습니다." : "매물이 수정되었습니다.") : (status === "draft" ? "임시저장되었습니다." : "매물이 등록되었습니다.");
			if (uploadResult.failedCount > 0) completeMessage += `\n사진 ${uploadResult.failedCount}장은 업로드되지 않았습니다.`;
			window.REALJEJU_LAST_SAVED_LISTING_ID = savedListingId;
			propertyRegisterUserDirty = false;
			keepButtonsLockedUntilConfirm = true;
						const finishSuccessfulPropertySave = () => {
							const shouldReturnAdminListings = page && page.dataset.returnToAdminListings === "1";
							const shouldReturnMapHome = !shouldReturnAdminListings && page && page.dataset.returnToMapHome === "1";
							const shouldReturnMySuiteFavorites = !shouldReturnAdminListings && !shouldReturnMapHome && page && page.dataset.returnToMySuiteFavorites === "1";
							const shouldReturnBrokerHome = !shouldReturnAdminListings && !shouldReturnMapHome && !shouldReturnMySuiteFavorites && page && page.dataset.returnToBrokerHome === "1";
					if (page) {
						delete page.dataset.pendingListingId;
						delete page.dataset.editListingId;
				}
				// [ARCHIVE] PATCH 2.358: 등록/수정 완료 확인 후에는 폼을 완전히 초기화해 다음 등록이 기존 매물을 덮어쓰지 않게 한다.
				if (status === "published" && typeof window.resetPropertyRegisterFormFields === "function") window.resetPropertyRegisterFormFields();
					const returnContext = shouldReturnAdminListings ? "admin-listings" : (shouldReturnMapHome ? "map-home" : (shouldReturnMySuiteFavorites ? "my-suite-favorites" : "broker-home"));
					const refreshSavedListingPromise = status === "published" && !shouldReturnMapHome && typeof window.realjejuRefreshSavedListingInMemory === "function"
						? window.realjejuRefreshSavedListingInMemory(savedListingId, {
							context: returnContext,
							repaintMap: shouldReturnMapHome,
						renderLeftList: false
					})
					: Promise.resolve(null);
				const continueAfterSavedListingRefresh = () => {
					try {
						if (shouldReturnAdminListings && typeof window.realjejuReturnToAdminListingsFromPropertyRegister === "function") {
							window.realjejuReturnToAdminListingsFromPropertyRegister({ listingId: savedListingId, source: "save" });
						} else if (shouldReturnMySuiteFavorites && typeof window.realjejuReturnToMySuiteFavoritesFromPropertyRegister === "function") {
							window.realjejuReturnToMySuiteFavoritesFromPropertyRegister({ listingId: savedListingId, source: "save" });
						} else if (shouldReturnMapHome && typeof window.realjejuReturnToMapHomeFromPropertyRegister === "function") {
							window.realjejuReturnToMapHomeFromPropertyRegister({ listingId: savedListingId, source: "save" });
						} else if (shouldReturnBrokerHome && typeof window.openBrokerHomePage === "function") {
					window.openBrokerHomePage(savedListingId);
				} else if (typeof window.openBrokerHomePage === "function") {
					window.openBrokerHomePage(savedListingId);
				}
					} finally {
						// 등록 성공 뒤 초기화된 빈 폼에 연속 클릭이 재진입하지 않도록 화면 전환 호출까지 잠금을 유지한다.
						releasePropertyListingSaveLock();
					}
				};
				Promise.resolve(refreshSavedListingPromise)
					.catch((refreshError) => {
						console.warn("저장 매물 단일 갱신 실패:", refreshError);
					})
					.finally(continueAfterSavedListingRefresh);
			};
			// [ARCHIVE] PATCH 3.199: 등록/수정 성공은 확인 모달 없이 바로 중개사 홈으로 이동한다.
			if (status === "published" && uploadResult.failedCount <= 0) {
				finishSuccessfulPropertySave();
				return;
			}
			// [ARCHIVE] PATCH 2.358: 완료 후 초기화는 상태값 기준으로 처리한다.
			// [ARCHIVE] PATCH 2.322: 수정 저장 완료 문구는 등록 완료와 구분해 보여줌
			openAuthErrorModal(completeMessage, existingListingId ? "매물 수정 완료" : "매물 등록 완료", null, finishSuccessfulPropertySave);
		}
		catch (err) {
			console.error("매물 저장 오류:", err);
			openAuthErrorModal("매물 저장 중 오류가 발생했습니다.", "매물 등록", null);
		}
		finally {
			if (!keepButtonsLockedUntilConfirm) {
				releasePropertyListingSaveLock();
			}
		}
	}

	// [ARCHIVE] PATCH 2.329: 수정 모드의 왼쪽 하단 버튼은 임시저장이 아니라 취소로 동작
	function isPropertyListingEditMode()
	{
		const page = $("propertyRegisterPage");
		return !!(page && page.dataset.listingId);
	}

		function cancelPropertyListingEdit()
		{
			if (propertyListingSaveInFlight) return;
			if (typeof window.realjejuReturnToAdminListingsFromPropertyRegister === "function"
				&& window.realjejuReturnToAdminListingsFromPropertyRegister({ source: "cancel" })) {
				return;
			}
			if (typeof window.realjejuReturnToMySuiteFavoritesFromPropertyRegister === "function"
				&& window.realjejuReturnToMySuiteFavoritesFromPropertyRegister({ source: "cancel" })) {
				return;
			}
			if (typeof window.realjejuReturnToMapHomeFromPropertyRegister === "function"
				&& window.realjejuReturnToMapHomeFromPropertyRegister({ source: "cancel" })) {
			return;
		}
		if (typeof window.realjejuReturnToBrokerHomeFromPropertyRegister === "function"
			&& window.realjejuReturnToBrokerHomeFromPropertyRegister({ source: "cancel" })) {
			return;
		}
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
		if (submitBtn && submitBtn.dataset.listingSaveBound !== "1") {
			submitBtn.dataset.listingSaveBound = "1";
			submitBtn.addEventListener("click", () => {
				if (!acquirePropertyListingSaveLock()) return;
				saveListing("published", { lockAcquired: true });
			});
		}
		if (draftBtn && draftBtn.dataset.listingSaveBound !== "1") {
			draftBtn.dataset.listingSaveBound = "1";
			draftBtn.addEventListener("click", () => {
				if (isPropertyListingEditMode()) {
					cancelPropertyListingEdit();
					return;
				}
				if (!acquirePropertyListingSaveLock()) return;
				saveListing("draft", { lockAcquired: true });
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

/* [ARCHIVE] PATCH 2.170: 교차로 복사글 간편 매물 등록 ===== */
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

	// [ARCHIVE] PATCH 2.259: 간편등록은 공통 표시 함수에 총점포수/총세대수 표시 여부만 전달
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

	function getParsedAreaItemByLabels(parsed, labels)
	{
		const list = Array.isArray(parsed?.areaItems) ? parsed.areaItems : [];
		const normalizedLabels = labels.map((label) => normalizeAreaLabel(label));
		return list.find((item) => normalizedLabels.includes(normalizeAreaLabel(item?.label))) || null;
	}

	function getParsedAreaItemText(item)
	{
		return String(item?.m2_text ?? item?.m2 ?? "").trim();
	}

	function clearPropertyRegisterExtraAreaRows()
	{
		document.querySelectorAll(".property-extra-area-row").forEach((row) => row.remove());
	}

	function createPropertyRegisterExtraAreaRow(item, index)
	{
		const landRoadRow = $("landRoadRow");
		const parent = landRoadRow && landRoadRow.parentNode;
		if (!parent) return null;
		const labelText = normalizeAreaLabel(item?.label);
		if (!labelText) return null;
		const m2Id = `extraAreaM2Input${index}`;
		const pyId = `extraAreaPyInput${index}`;
		const row = document.createElement("div");
		row.className = "property-form-row property-extra-area-row";
		row.dataset.areaLabel = labelText;
		row.dataset.areaKey = item?.key || getAreaKeyFromLabel(labelText);
		row.innerHTML = `
			<label class="property-form-label" for="${m2Id}">${labelText}</label>
			<div class="property-form-control property-area-pair">
				<div class="property-unit-input">
					<input type="text" class="property-register-input property-area-m2" id="${m2Id}" data-py-target="${pyId}" placeholder="0" inputmode="decimal" />
					<span class="property-unit-label">m²</span>
				</div>
				<div class="property-area-eq">=</div>
				<div class="property-unit-input">
					<input type="text" class="property-register-input property-area-py" id="${pyId}" data-m2-target="${m2Id}" placeholder="0" inputmode="decimal" />
					<span class="property-unit-label">평</span>
				</div>
			</div>
		`;
		parent.insertBefore(row, landRoadRow);
		const m2Input = row.querySelector(".property-area-m2");
		if (m2Input) m2Input.value = getParsedAreaItemText(item);
			if (m2Input && String(m2Input.value || "").trim()
				&& typeof window.realjejuSyncPropertyAreaAutoCalcInput === "function") {
				window.realjejuSyncPropertyAreaAutoCalcInput(m2Input);
			}
		return row;
	}

	function renderPropertyRegisterExtraAreaRows(areaItems, usedLabels)
	{
		clearPropertyRegisterExtraAreaRows();
		const seenLabels = new Set(Array.from(usedLabels || []).map(normalizeAreaLabel).filter(Boolean));
		const extras = [];
		(Array.isArray(areaItems) ? areaItems : []).forEach((item) => {
			const label = normalizeAreaLabel(item?.label);
			if (!label || seenLabels.has(label)) return;
			extras.push(item);
			seenLabels.add(label);
		});
		extras.forEach((item, index) => createPropertyRegisterExtraAreaRow(item, index));
		if (extras.length && typeof window.realjejuBindPropertyAreaAutoCalc === "function") {
			window.realjejuBindPropertyAreaAutoCalc();
		}
		if (typeof window.realjejuSyncPropertyAreaAutoCalcRows === "function") {
			window.realjejuSyncPropertyAreaAutoCalcRows(document.getElementById("propertyRegisterPage"));
		}
	}

	function applyOiljangOriginalAreaDisplay(parsed)
	{
		if (!["oiljang", "daangn", "crossroad"].includes(parsed?.parserSource)) return;
		const areaItems = Array.isArray(parsed.areaItems) ? parsed.areaItems : [];
		if (!areaItems.length) return;
		const exclusiveRow = $("exclusiveAreaRow");
		const supplyRow = $("supplyAreaRow");
		const landRow = $("landAreaRow");
		const landRoadRow = $("landRoadRow");
		if (exclusiveRow) exclusiveRow.style.display = "none";
		if (supplyRow) supplyRow.style.display = "none";
		if (landRow) landRow.style.display = "none";
		if (landRoadRow) landRoadRow.style.display = parsed.propertyType === "land" ? "grid" : "none";
		renderPropertyRegisterExtraAreaRows(areaItems, new Set());
	}

		function setMaintenanceTab(type)
		{
			const tab = document.querySelector(`#propertyMaintenanceCard .maintenance-tab[data-maintenance-type="${CSS.escape(type)}"]`);
			if (tab) tab.click();
		}

		function setPropertyApprovalDateFieldLabel(labelText = "사용승인일")
		{
			const normalizedLabel = String(labelText || "사용승인일").trim() || "사용승인일";
			const label = document.querySelector('label[for="propertyApprovalDateInput"]');
			if (label) label.innerHTML = `${normalizedLabel}<span class="property-required">*</span>`;
			const pickerBtn = document.getElementById("propertyApprovalDatePickerBtn");
			if (pickerBtn) pickerBtn.setAttribute("aria-label", `${normalizedLabel} 달력 열기`);
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
		if (!match) return "";
		const captures = match.slice(1);
		const firstValue = captures.find((value) => value !== undefined && value !== null);
		if (firstValue !== undefined) return String(firstValue).trim();
		return captures.length ? "" : String(match[0] || "").trim();
	}

	function normalizeQuickListingTitle(value)
	{
		return String(value || "")
			.replace(/^\s*매물명\s*/, "")
			.replace(/^(매매|전세|월세|년세|연세)\s*】/, "【$1】")
			.trim();
	}

	// [ARCHIVE] PATCH 2.225: 입주가능일 날짜형 값을 YYYY-MM-DD로 추출
	function parseMoveInDateText(text)
	{
		const raw = String(text || "").trim();
		if (!raw) return "";
		if (/즉시입주|즉시\s*입주/.test(raw)) return "즉시입주";
		const separated = raw.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
		if (separated) return `${separated[1]}-${separated[2].padStart(2, "0")}-${separated[3].padStart(2, "0")}`;
		const monthDay = raw.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
		if (monthDay) {
			const year = String(new Date().getFullYear());
			return `${year}-${monthDay[1].padStart(2, "0")}-${monthDay[2].padStart(2, "0")}`;
		}
		const compact = raw.match(/(\d{8})/);
		if (compact) return `${compact[1].slice(0, 4)}-${compact[1].slice(4, 6)}-${compact[1].slice(6, 8)}`;
		return "";
	}

	function normalizeCrossroadLabel(label)
	{
		return String(label || "").replace(/\s+/g, "").trim();
	}

	// [ARCHIVE] PATCH 2.291: 용도지역은 "1종전용주거지역"처럼 제/공백이 빠진 교차로 표기도 드롭다운 값과 맞춤
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

	function propertyTypeRequiresMaintenanceCard(type)
	{
		const value = String(type || "").trim();
		if (!value) return false;
		return !["land", "hotel", "pension", "building", "factory_warehouse"].includes(value);
	}

	function hasQuickMaintenanceField(source)
	{
		return String(source || "").split(/\r?\n/).some((line) => {
			const row = line.trim();
			if (!row) return false;
			return /^(?:월\s*관리비|월관리비|원관리비)(?:$|[\s\t:：])/.test(row)
				|| /^관리비(?:$|[\s\t:：])/.test(row);
		});
	}

	function isQuickMaintenanceNoFee(text, wonText = "")
	{
		const compact = String(text || "").replace(/\s+/g, "");
		if (/^(?:없음|정보없음|확인불가|미제공|미기재|해당없음)$/.test(compact)) return true;
		if (/관리비(?:없음|정보없음|확인불가|미제공|미기재|해당없음)|관리비부과내역없음/.test(compact)) return true;
		const digits = String(wonText || text || "").replace(/[^0-9]/g, "");
		return digits !== "" && Number(digits) === 0;
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

	function normalizeOiljangJejuAddress(text)
	{
		const raw = String(text || "").replace(/\s+/g, " ").trim();
		if (!raw) return "";
		const normalizeJejuPrefix = (value) => String(value || "")
			.replace(/^제주도\s*/, "제주특별자치도 ")
			.replace(/^제주\s+/, "제주특별자치도 ")
			.replace(/\s+/g, " ")
			.trim();
		const splitCompactEupMyeonRi = (value) => String(value || "")
			.replace(/([가-힣]+(?:읍|면))([가-힣]+리)(?=\s|$|\d)/g, "$1 $2")
			.replace(/\s+/g, " ")
			.trim();
		const normalized = splitCompactEupMyeonRi(normalizeJejuPrefix(raw));
		if (/^제주특별자치도\s+/.test(normalized)) return normalized;
		if (/^(?:제주시|서귀포시)\s+/.test(normalized)) return `제주특별자치도 ${normalized}`;
		const adminMatch = normalized.match(/([가-힣]+(?:동|읍|면))(?:\s|$|\d)/);
		const adminName = adminMatch ? adminMatch[1] : "";
		const matchedCities = Object.entries(JEJU_REGION_OPTIONS || {})
			.filter(([, names]) => Array.isArray(names) && names.includes(adminName))
			.map(([city]) => city);
		if (matchedCities.length === 1) return `제주특별자치도 ${matchedCities[0]} ${normalized}`;
		return `제주특별자치도 ${normalized}`;
	}

	// [ARCHIVE] PATCH 2.271: 관리비 항목이 있는 매물만 처음 10개 유효 줄을 본문 후보에서 제외
	function extractCrossroadDescription(text)
	{
		const value = String(text || "");
		const hasMaintenanceSection = /(^|\n)\s*(\[관리비\]|월\s*관리비|월관리비|관리비\s*합계|관리비\s*\t)/.test(value);
		const minimumMetaLineCount = hasMaintenanceSection ? 10 : 5;
		const structuredLabels = new Set([
			"관리비", "관리비합계", "관리비포함내역", "관리비미포함내역", "부과사유", "부과기준",
			"해당동", "입주가능일", "방향", "지하층/지상층", "현관구조", "해당층/총층", "방/욕실수",
			// [ARCHIVE] PATCH 2.294: 교차로 기본정보의 기전세금은 상세설명 제목 후보에서 제외
			"보증금", "월세금", "년세금", "연세금", "전세금", "기전세금", "매매가", "융자금여부", "주차가능여부",
			"건물종류", "건축물용도", "현업종", "추천업종", "총점포수", "사용전력", "용도", "방형태", "원룸종류",
			"총세대수", "사용승인일", "사용검사일", "준공일자", "일자확인불가", "위반건축물여부",
			"옵션", "총주차대수", "난방시설", "냉방시설", "가구", "가전", "주방/욕실", "건물보안", "기타시설",
			"지목", "용도지역", "대지면적", "건축면적", "연면적", "계약면적", "공급면적", "전용면적",
			"국토이용", "도시계획", "건축허가", "토지거래허가", "진입도로",
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

	// [ARCHIVE] PATCH 2.277: 교차로 추천중개업소 꼬리는 하단 10개 유효 줄 안에 있을 때만 상세설명에서 제외
	function trimCrossroadDescriptionTail(description)
	{
		const value = String(description || "");
		const lines = value.split(/\r?\n/);
		const complexInfoIndex = lines.findIndex((line) => /단지정보\s*바로가기|실거래가\s*확인/.test(line.trim()));
		let baseLines = lines;
		if (complexInfoIndex >= 0) {
			let cutIndex = complexInfoIndex;
			for (let i = complexInfoIndex - 1; i >= 0; i--) {
				if (!lines[i].trim()) continue;
				cutIndex = i;
				break;
			}
			baseLines = lines.slice(0, cutIndex);
		}
		const nonEmptyIndexes = [];
		baseLines.forEach((line, index) => {
			if (line.trim()) nonEmptyIndexes.push(index);
		});
		const tailStartIndex = nonEmptyIndexes[Math.max(0, nonEmptyIndexes.length - 10)] ?? 0;
		const crossroadTailIndex = baseLines.findIndex((line, index) => {
			return index >= tailStartIndex && /제주교차로\s+부동산\s+추천중개업소/.test(line.trim());
		});
		const withoutCrossroadTail = crossroadTailIndex >= 0 ? baseLines.slice(0, crossroadTailIndex).join("\n") : baseLines.join("\n");
		return withoutCrossroadTail.replace(/\n(?:[ \t]*\n){9,}[\s\S]*$/, "").trimEnd();
	}

	// [ARCHIVE] PATCH 2.262: 본문 첫 줄은 제목으로 쓰고 상세설명에서는 첫 줄과 뒤 공백을 제거
	function splitCrossroadDescriptionTitle(description)
	{
		const lines = trimCrossroadDescriptionTail(description).split(/\r?\n/);
		const isMetaTitleLine = (line) => {
			const row = String(line || "").trim();
			return /^(국토이용|도시계획|건축허가|토지거래허가|진입도로)\s*(?:[:：]|\t|\s{2,})?\s*(해당|있음|없음|해당없음)?\s*$/.test(row);
		};
		const firstIndex = lines.findIndex((line) => line.trim() && !isMetaTitleLine(line));
		if (firstIndex < 0) return { title: "", body: "" };
		return {
			title: lines[firstIndex].trim(),
			body: lines.slice(firstIndex + 1).join("\n").replace(/^\s*\n+/, "").trimStart()
		};
	}

	function cleanCrossroadRoadConditionText(text)
	{
		let normalized = String(text || "")
			.replace(/^[\s※ㆍ•\-–—▪◆◇▶✔️✅🔹\u2605\u2730]+\s*/g, "")
			.replace(/^(?:진입도로|도로조건|도로현황|도로)\s*(?:조건|현황)?\s*(?:[:：]|[\t\s]+)?\s*/g, "")
			.replace(/^접\s*[:：]\s*/g, "")
			.replace(/^(?:예)\s*[:：]?\s*/g, "")
			.replace(/접\s+해/g, "접해")
			.replace(/\s{2,}/g, " ")
			.trim();
		if (!normalized) return "";
		normalized = normalized.replace(/^폭\s*/, "폭 ");
		if (/\b접함\b/.test(normalized) && !/도로/.test(normalized)) {
			normalized = normalized.replace(/\b접함\b/, "도로에 접함");
		}
		return normalized;
	}

	function isReliableRoadConditionText(text, rawText = "")
	{
		const row = cleanCrossroadRoadConditionText(text);
		const raw = String(rawText || text || "").trim();
		if (!row || /^(있음|없음|해당|해당없음)$/.test(row)) return false;
		const hasMeter = /[0-9][\d.,]*\s*(?:m|미터)/i.test(row);
		const hasRoadWord = /(?:도로|접함|접해|접|폭|길이|차선|현황|양면도로|대로변)/.test(row);
		if (hasMeter && hasRoadWord) return true;
		if (/도로현황\s*[:：]/.test(raw) && /[0-9]/.test(row) && hasRoadWord) return true;
		if (/도로\s*[:：]/.test(raw) && hasMeter) return true;
		if (/(?:왕복\s*)?[0-9]+\s*차선/.test(row) && /(?:도로|접함|접해|접)/.test(row)) return true;
		return false;
	}

	function findCrossroadDetailedRoadCondition(text)
	{
		const lines = String(text || "").split(/\r?\n/);
		for (const line of lines) {
			const raw = String(line || "").trim();
			const row = cleanCrossroadRoadConditionText(line);
			if (!isReliableRoadConditionText(row, raw)) continue;
			if (/^도로현황\s*[:：]/.test(raw)) return row;
			if (/^(?:[※ㆍ•\-–—▪◆◇▶✔️✅🔹\u2605\u2730]+\s*)?도로\s*[:：]/.test(raw)) return row;
			if (/폭/.test(row) && /[0-9][\d.,]*\s*(?:m|미터)/i.test(row)) return row;
			if (/(?:왕복\s*)?[0-9]+\s*차선/.test(row) && /(?:도로|접함|접해|접)/.test(row)) return row;
		}
		return "";
	}

	function parseCrossroadListing(text)
	{
		const value = String(text || "");
		const fields = parseCrossroadFieldMap(value);
		const listingNo = value.split(/\r?\n/).map(extractPropertyListingNoCandidate).find(Boolean) || "";
		// [ARCHIVE] PATCH 2.237: 교차로 간편등록 면적은 처음 5개 유효 줄만 기준으로 판정
		const firstLines = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5).join("\n");
		const title = getFirstMatch(value, /\[(?:전세|매매|월세|년세)\]\s*([^\n]+)/) || getFirstMatch(value, /\((?:디|D)-?\d+\)\s*([^\n]+)/i);
		const totalArea = getFirstMatch(firstLines, /연\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		// [ARCHIVE] PATCH 2.240: 공급면적과 계약면적을 분리해서 원문 라벨 그대로 화면에 반영
		const supplyArea = getFirstMatch(firstLines, /공급\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const contractArea = getFirstMatch(firstLines, /계약\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const exclusiveArea = getFirstMatch(firstLines, /전용\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const buildingArea = getFirstMatch(firstLines, /건축\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const landArea = getFirstMatch(firstLines, /대지\s*면적\s*[:：]?\s*([\d,.]+)\s*㎡/).replace(/,/g, "");
		const approvalDateRaw = fieldValue(fields, ["사용승인일"]) || getFirstMatch(value, /사용승인일\s*[:：]?\s*(\d{4}-\d{2}-\d{2})/);
		const inspectionDateRaw = fieldValue(fields, ["사용검사일"]) || getFirstMatch(value, /사용검사일\s*[:：]?\s*(\d{4}-\d{2}-\d{2})/);
		const approvalDate = approvalDateRaw || inspectionDateRaw;
		const approvalDateLabel = !approvalDateRaw && inspectionDateRaw ? "사용검사일" : "사용승인일";
		// [ARCHIVE] PATCH 2.257: 총점포수/총세대수는 필드맵/원문 정규식에서 숫자가 잡히면 표시 대상으로 확정
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
		// [ARCHIVE] PATCH 2.293: "총 주차대수: 2대"처럼 세대당/점포당 괄호가 없어도 총 주차대수를 반영
		const parking = value.match(/총\s*주차\s*대수\s*[:：]?\s*([\d,]+)\s*대(?:\s*\((?:세대당|점포당)\s*([\d.]+)\s*대\))?/);
		const hasMaintenanceField = hasQuickMaintenanceField(value);
		const maintenanceRawText = hasMaintenanceField ? fieldValue(fields, ["관리비", "월관리비", "원관리비"]) : "";
		const normalizedMaintenanceRawText = String(maintenanceRawText || "").replace(/\s+/g, "");
		const maintenanceNoFeeReasonRaw = hasMaintenanceField ? (fieldValue(fields, ["관리비 부과내역", "관리비부과내역"]) || getFirstMatch(value, /관리비\s*부과내역\s*없음/)) : "";
		// [ARCHIVE] PATCH 2.273: 교차로 관리비가 "관리비 150,000원"으로 들어오는 경우도 총 관리비로 처리
		let maintenanceWon = hasMaintenanceField ? (
			fieldValue(fields, ["관리비 합계"])
			|| (/원/.test(maintenanceRawText) ? maintenanceRawText : "")
			|| getFirstMatch(value, /관리비\s*합계\s*([\d,]+)\s*원/)
			|| getFirstMatch(value, /^관리비\s*[\t ]+([\d,]+)\s*원/m)
		).replace(/[^0-9]/g, "") : "";
		const maintenanceNone = hasMaintenanceField && (isQuickMaintenanceNoFee(`${maintenanceRawText} ${maintenanceNoFeeReasonRaw}`, maintenanceWon) || /관리비없음|관리비부과내역없음/.test(normalizedMaintenanceRawText));
		const maintenanceNoFeeValueSource = maintenanceNone ? "관리비 없음" : "";
		const maintenanceNoFeeReasonSource = maintenanceNoFeeReasonRaw || (maintenanceNone ? "관리비 부과내역 없음" : "");
		if (maintenanceNone) maintenanceWon = "";
		const rawLandRoad = (fieldValue(fields, ["진입도로"]) || getFirstMatch(value, /진입도로\s*(?:[:：]|\t|\s{2,})?\s*([^\n]+)/) || getFirstMatch(value, /도로\s*[:：]\s*([^\n]+)/)).trim();
		const detailedLandRoad = findCrossroadDetailedRoadCondition(value);
		const cleanedRawLandRoad = cleanCrossroadRoadConditionText(rawLandRoad);
		const landRoad = detailedLandRoad || (isReliableRoadConditionText(cleanedRawLandRoad, rawLandRoad) ? cleanedRawLandRoad : "");
		const isLandConditionApplicable = (label) => /해당/.test(fieldValue(fields, [label]) || getFirstMatch(value, new RegExp(`${label}\\s*(?:[:：]|\\t|\\s{2,})?\\s*([^\\n]+)`)));
		const landConditions = {
			nationalLandUse: isLandConditionApplicable("국토이용"),
			urbanPlanning: isLandConditionApplicable("도시계획"),
			buildingPermit: isLandConditionApplicable("건축허가"),
			landTransactionPermit: isLandConditionApplicable("토지거래허가")
		};
		const landType = fieldValue(fields, ["지목"]) || getFirstMatch(value, /지목\s*[:：]?\s*([가-힣]+)/) || (/^\s*\[매매\]\s*([가-힣]+)\s*$/m.exec(firstLines)?.[1] || "");
		// [ARCHIVE] PATCH 2.291: 교차로 용도지역 텍스트를 토지 용도지역 드롭다운 값으로 정규화
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
		// [ARCHIVE] PATCH 2.284: 교차로 매물 유형은 처음 5줄 중 두 번째 줄을 최우선 기준으로 사용
		const firstFiveRows = value.split(/\n/).map((line) => line.trim()).filter(Boolean).slice(0, 5);
		const crossroadTypeLine = firstFiveRows[1] || "";
		const listingTypeTitle = getFirstMatch(firstLines, /^\s*\[(?:매매|전세|월세|년세)\]\s*([^\n]+)/m);
		const propertyTypeClues = [firstLines, buildingKindText, buildingUseText].join("\n");
		const strongPropertyTypeClues = [listingTypeTitle, buildingKindText, buildingUseText].join("\n");
		const landTitleTypes = /^(전|답|대|임야|과수원|공장용지|주차장|잡종지|창고용지|목장용지|도로|하천)$/;
		// [ARCHIVE] PATCH 2.240: 처음 5줄에 적힌 면적명 조합만으로 표시 모드와 입력 대상을 고정
		const areaMode = landArea && buildingArea && totalArea
			? "land_building_total"
			: (contractArea && exclusiveArea
				? "contract_private"
				: (supplyArea && exclusiveArea
				? "supply_private"
				: (landArea && totalArea ? "land_total" : (landArea ? "land_only" : ""))));
		const originalAreaItems = getCrossroadOriginalAreaItems(firstLines, fields);
		const quickAreaMode = originalAreaItems.length ? "oiljang_original" : areaMode;
		const supply = areaMode === "land_building_total" || areaMode === "land_total" ? totalArea : (contractArea || supplyArea);
		const exclusive = areaMode === "land_building_total" ? buildingArea : exclusiveArea;
		let parsedPropertyType = resolveRealjejuPropertyTypeValue(explicitPropertyTypeText);
		// [ARCHIVE] PATCH 2.252: 오피스텔/오피스텔형은 숙박시설이어도 펜션보다 먼저 원룸/투룸으로 분류
		// [ARCHIVE] PATCH 2.296: 교차로 두 번째 줄의 토지/임야는 건축물용도보다 우선해서 토지로 분류
		if (!parsedPropertyType) {
			if (/토지\s*\/\s*임야|토지|임야/.test(crossroadTypeLine)) parsedPropertyType = "land";
			else if (/오피스텔(?:형)?/.test(buildingKindText) && /숙박시설/.test(buildingUseText)) parsedPropertyType = "room";
			else if (/오피스텔(?:형)?/.test(buildingKindText) && /업무시설/.test(buildingUseText)) parsedPropertyType = "officetel";
			else if (/상가|상가점포|상가건물/.test(crossroadTypeLine)) parsedPropertyType = "store";
			else if (/사무실/.test(crossroadTypeLine)) parsedPropertyType = "office";
			// [ARCHIVE] PATCH 2.292: 교차로 두 번째 줄 또는 건물종류의 공장/창고는 공장 / 창고 매물로 분류
			else if (/공장\s*\/\s*창고|공장|창고/.test(crossroadTypeLine) || /공장|창고/.test(buildingKindText) || /공장|창고시설/.test(buildingUseText)) parsedPropertyType = "factory_warehouse";
			// [ARCHIVE] PATCH 2.284: 사무실 보조 판정은 건물종류가 사무실일 때만 적용
			else if (/중소형사무실|대형사무실/.test(buildingKindText)) parsedPropertyType = "office";
			else if (/상가|상가건물/.test(propertyTypeClues)) parsedPropertyType = "store";
			else if (/생활형숙박시설|생활숙박시설|생활형숙박|레지던스/.test(propertyTypeClues)) parsedPropertyType = "living_accommodation";
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
		// [ARCHIVE] PATCH 2.249: 보증금만으로 월세를 체크하지 않고 첫 5줄의 거래유형과 실제 금액 항목으로만 판단
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
		// [ARCHIVE] PATCH 2.253: 간편등록에서는 대출 항목을 매물 유형과 무관하게 우선 확인 필요로 시작
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
			parserSource: "crossroad",
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
			title: normalizeQuickListingTitle(descriptionParts.title || title),
			address,
			supply: supply.replace(/,/g, ""),
			totalArea,
			exclusive: exclusive.replace(/,/g, ""),
			buildingArea,
			landArea,
			areaItems: originalAreaItems,
			areaMode: quickAreaMode,
			landType,
			landUseZone,
			landRoad,
			landConditions,
			approvalDate,
			approvalDateLabel,
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
			hasMaintenanceField,
			maintenanceNone,
			maintenanceNoFeeValue: maintenanceNoFeeValueSource,
			maintenanceNoFeeReason: normalizeMaintenanceNoFeeText(maintenanceNoFeeReasonSource, "관리비 부과내역 없음"),
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

	function getOiljangTextLines(text)
	{
		return String(text || "").split(/\r?\n/).map(line => line.replace(/\s+$/g, ""));
	}

	function getOiljangSectionText(text, startLabels, endLabels)
	{
		const lines = getOiljangTextLines(text);
		const startIndex = lines.findIndex(line => startLabels.some(label => line.trim() === label || line.trim().startsWith(label)));
		if (startIndex < 0) return "";
		const endIndex = lines.findIndex((line, index) => index > startIndex && endLabels.some(label => line.trim() === label || line.trim().startsWith(label)));
		return lines.slice(startIndex + 1, endIndex >= 0 ? endIndex : lines.length).join("\n");
	}

	function parseOiljangFieldMap(text)
	{
		const fieldText = getOiljangSectionText(text, ["매물 정보 수정", "매물 정보"], ["상세정보보기"]);
		const labels = [
			"방수 / 욕실수", "방수/욕실수", "입주가능일", "사용승인일", "사용검사일", "총주차대수", "매매가격",
			"월관리비", "원관리비", "관리비", "매물종류", "건물종류", "건물형태", "건축물용도", "계약면적", "공급면적",
			"전용면적", "토지면적", "대지면적", "건축면적", "연면적", "지목", "용도지역", "총세대수", "총 층수", "매물번호", "연락처", "매물명", "소재지", "보증금",
			"년세", "연세", "월세", "전세금", "융자금", "방향", "해당층", "메모"
		];
		const labelSet = new Set(labels.map(normalizeCrossroadLabel));
		const fields = {};
		const addField = (label, value) => {
			const key = normalizeCrossroadLabel(label);
			const textValue = String(value || "").trim();
			if (!key || !textValue || fields[key]) return;
			fields[key] = textValue;
		};
		const escapedLabels = [...labels]
			.sort((a, b) => b.length - a.length)
			.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
		const parseInline = (line) => {
			const source = String(line || "").trim();
			if (!source) return;
			const regex = new RegExp("(" + escapedLabels.join("|") + ")(?=\\s|$)", "g");
			const matches = [];
			let match;
			while ((match = regex.exec(source))) matches.push({ label: match[1], index: match.index, end: regex.lastIndex });
			if (!matches.length) return;
			matches.forEach((entry, index) => {
				const next = matches[index + 1];
				addField(entry.label, source.slice(entry.end, next ? next.index : source.length));
			});
		};
		const parseCompactInline = (line) => {
			const source = String(line || "").trim();
			const titleLabelIndex = source.indexOf("매물명");
			if (titleLabelIndex < 0) return;

			let propertyTypeLabelIndex = -1;
			let searchIndex = titleLabelIndex + "매물명".length;
			while (searchIndex < source.length) {
				const candidateIndex = source.indexOf("매물종류", searchIndex);
				if (candidateIndex < 0) break;
				const addressLabelIndex = source.indexOf("소재지", candidateIndex + "매물종류".length);
				if (addressLabelIndex > candidateIndex) {
					const propertyTypeText = source.slice(candidateIndex + "매물종류".length, addressLabelIndex).trim();
					if (propertyTypeText.length <= 40
						&& !propertyTypeText.includes("매물종류")
						&& normalizeOiljangPropertyType(propertyTypeText)) {
						propertyTypeLabelIndex = candidateIndex;
						break;
					}
				}
				searchIndex = candidateIndex + "매물종류".length;
			}
			if (propertyTypeLabelIndex < 0) return;

			addField("매물명", source.slice(titleLabelIndex + "매물명".length, propertyTypeLabelIndex));
			const compactSource = source.slice(propertyTypeLabelIndex);
			const regex = new RegExp("(" + escapedLabels.join("|") + ")", "g");
			const matches = [];
			let match;
			while ((match = regex.exec(compactSource))) {
				matches.push({ label: match[1], index: match.index, end: regex.lastIndex });
			}
			matches.forEach((entry, index) => {
				const next = matches[index + 1];
				addField(entry.label, compactSource.slice(entry.end, next ? next.index : compactSource.length));
			});
		};
		fieldText.split(/\r?\n/).forEach((line) => {
			const parts = String(line || "").split(/\t+/).map(part => part.trim()).filter(Boolean);
			if (parts.length > 1) {
				for (let i = 0; i < parts.length; i++) {
					if (!labelSet.has(normalizeCrossroadLabel(parts[i]))) continue;
					const valueParts = [];
					let j = i + 1;
					while (j < parts.length && !labelSet.has(normalizeCrossroadLabel(parts[j]))) {
						valueParts.push(parts[j]);
						j += 1;
					}
					addField(parts[i], valueParts.join(" "));
					i = j - 1;
				}
				return;
			}
			parseInline(line);
			parseCompactInline(line);
		});
		return fields;
	}

	function extractOiljangDescriptionParts(text)
	{
		const lines = getOiljangTextLines(text);
		const detailIndex = lines.findIndex(line => line.trim() === "상세정보보기");
		if (detailIndex < 0) return { title: "", body: "" };
		const bodyStartIndex = detailIndex + 1;
		const endIndex = lines.findIndex((line, index) => index > detailIndex && line.trim() === "등록자 정보");
		const bodyLines = lines.slice(bodyStartIndex, endIndex >= 0 ? endIndex : lines.length);
		return {
			body: bodyLines.join("\n").replace(/^\s*\n+/, "").trimEnd()
		};
	}

	function normalizeOiljangPropertyType(value)
	{
		const text = String(value || "");
		const resolved = resolveRealjejuPropertyTypeValue(text);
		if (resolved) return resolved;
		if (/오피스텔|도시형/.test(text)) return "officetel";
		if (/빌라|연립|다세대/.test(text)) return "villa";
		if (/원룸|투룸|쓰리룸/.test(text)) return "room";
		if (/아파트/.test(text)) return "apartment";
		if (/상가|점포/.test(text)) return "store";
		if (/토지|임야/.test(text)) return "land";
		if (/사무실/.test(text)) return "office";
		if (/공장|창고/.test(text)) return "factory_warehouse";
		if (/단독|다가구|주택/.test(text)) return "house";
		return "";
	}

	function normalizeOiljangDateText(value)
	{
		const raw = String(value || "").trim();
		if (!raw) return "";
		const separated = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\.?$/);
		if (separated) return `${separated[1]}-${separated[2].padStart(2, "0")}-${separated[3].padStart(2, "0")}`;
		const digits = raw.replace(/\D/g, "").slice(0, 8);
		if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
		return raw;
	}

	function normalizeQuickDirectionText(value)
	{
		const raw = String(value || "").replace(/\s+/g, " ").trim();
		if (!raw) return "";
		const match = raw.match(/(남동|남서|북동|북서|동|서|남|북)\s*향?/);
		return match ? `${match[1]}향` : raw;
	}

	function parseOiljangAreaValue(value)
	{
		const raw = String(value || "").replace(/,/g, "");
		const match = raw.match(/([\d.]+)\s*㎡/);
		const numericText = match ? match[1] : (raw.match(/[\d.]+/)?.[0] || "");
		if (!numericText) return "";
		const number = Number(numericText);
		if (!Number.isFinite(number) || number <= 0) return "";
		return String(number);
	}

	function getOiljangFirstPositiveArea(fields, labels)
	{
		for (const label of labels) {
			const value = parseOiljangAreaValue(fieldValue(fields, [label]));
			const number = Number(String(value || "").replace(/,/g, ""));
			if (value && Number.isFinite(number) && number > 0) return value;
		}
		return "";
	}

	function makeOiljangAreaItem(key, label, value)
	{
		const text = String(value ?? "").trim();
		if (text === "") return null;
		const number = Number(text.replace(/,/g, ""));
		if (!Number.isFinite(number) || number <= 0) return null;
		return {
			key,
			label,
			m2_text: text,
			py_text: "",
			m2: Number.isFinite(number) ? number : null,
			py: null
		};
	}

	function getQuickOriginalAreaItemDefs()
	{
		return [
			{ key: "supply", label: "공급면적" },
			{ key: "supply", label: "계약면적" },
			{ key: "exclusive", label: "전용면적" },
			{ key: "land", label: "토지면적" },
			{ key: "land", label: "대지면적" },
			{ key: "exclusive", label: "건축면적" },
			{ key: "supply", label: "연면적" }
		];
	}

	function getQuickOriginalAreaItemsFromSource(source, fields)
	{
		const defs = getQuickOriginalAreaItemDefs();
		const value = String(source || "");
		const escapedLabels = defs
			.map((def) => def.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
			.join("|");
		const regex = new RegExp("(" + escapedLabels + ")", "g");
		const matches = [];
		let match;
		while ((match = regex.exec(value))) {
			matches.push({ label: match[1], index: match.index, end: regex.lastIndex });
		}
		const items = [];
		matches.forEach((entry, index) => {
			const next = matches[index + 1];
			const rawValue = value.slice(entry.end, next ? next.index : value.length);
			const def = defs.find((item) => item.label === entry.label);
			const areaValue = parseOiljangAreaValue(rawValue);
			const areaItem = def ? makeOiljangAreaItem(def.key, def.label, areaValue) : null;
			if (areaItem && !items.some((item) => normalizeAreaLabel(item.label) === normalizeAreaLabel(areaItem.label))) {
				items.push(areaItem);
			}
		});
		if (items.length) return items;
		return defs
			.map((def) => makeOiljangAreaItem(def.key, def.label, getOiljangFirstPositiveArea(fields || {}, [def.label])))
			.filter(Boolean);
	}

	function getOiljangOriginalAreaItems(text, fields)
	{
		const fieldText = getOiljangSectionText(text, ["매물 정보 수정", "매물 정보"], ["상세정보보기"]);
		return getQuickOriginalAreaItemsFromSource(fieldText, fields);
	}

	function getCrossroadOriginalAreaItems(text, fields)
	{
		return getQuickOriginalAreaItemsFromSource(text, fields);
	}

	function parseOiljangListing(text)
	{
		const value = String(text || "");
		const fields = parseOiljangFieldMap(value);
		const oiljangInfoText = getOiljangSectionText(value, ["매물 정보 수정", "매물 정보"], ["상세정보보기"]);
		const detail = extractOiljangDescriptionParts(value);
		const propertyTypeText = fieldValue(fields, ["매물종류"]);
		const approvalDateRaw = fieldValue(fields, ["사용승인일"]);
		const inspectionDateRaw = fieldValue(fields, ["사용검사일"]);
		const approvalDateLabel = !approvalDateRaw && inspectionDateRaw ? "사용검사일" : "사용승인일";
		const dealTypes = [];
		if (fieldValue(fields, ["매매가격"])) dealTypes.push("sale");
		if (fieldValue(fields, ["전세금"])) dealTypes.push("jeonse");
		if (fieldValue(fields, ["보증금"]) && fieldValue(fields, ["월세"])) dealTypes.push("monthly");
		if (fieldValue(fields, ["보증금"]) && (fieldValue(fields, ["년세"]) || fieldValue(fields, ["연세"]))) dealTypes.push("yearly");
		const floorText = fieldValue(fields, ["해당층"]) || fieldValue(fields, ["총 층수"]);
		const floorMatch = floorText.match(/([가-힣]+|\d+)\s*\/\s*(\d+)/);
		const roomBath = fieldValue(fields, ["방수 / 욕실수", "방수/욕실수"]).match(/(\d+)\s*\/\s*(\d+)/);
		const parkingText = fieldValue(fields, ["총주차대수"]);
		const parkingMatch = parkingText.match(/([\d,]+)(?:\s*\(([\d.]+)\))?/);
		const hasMaintenanceField = hasQuickMaintenanceField(oiljangInfoText)
			|| !!fieldValue(fields, ["월관리비", "원관리비", "관리비"]);
		const maintenanceText = hasMaintenanceField ? fieldValue(fields, ["월관리비", "원관리비", "관리비"]) : "";
		const includeMatch = maintenanceText.match(/포함내역\s*[:：]\s*([^)]+)/);
		let maintenanceWon = hasMaintenanceField ? maintenanceText.replace(/[^0-9]/g, "") : "";
		const maintenanceNone = hasMaintenanceField && isQuickMaintenanceNoFee(maintenanceText, maintenanceWon);
		if (maintenanceNone) maintenanceWon = "";
		const moveInText = fieldValue(fields, ["입주가능일"]);
		const normalizedPropertyType = normalizeOiljangPropertyType(propertyTypeText);
		const landArea = getOiljangFirstPositiveArea(fields, ["토지면적", "대지면적"]);
		const buildingArea = getOiljangFirstPositiveArea(fields, ["건축면적"]);
		const totalArea = getOiljangFirstPositiveArea(fields, ["연면적"]);
		const contractArea = getOiljangFirstPositiveArea(fields, ["계약면적"]);
		const supplyArea = getOiljangFirstPositiveArea(fields, ["공급면적"]);
		const exclusiveArea = getOiljangFirstPositiveArea(fields, ["전용면적"]);
		const hasPositiveSupplyArea = String(supplyArea || "").trim() !== "" && Number(String(supplyArea).replace(/,/g, "")) > 0;
		const typeAreaMode = getRegisterAreaModeByType(normalizedPropertyType);
		const supplyAreaForInput = (contractArea || (hasPositiveSupplyArea ? supplyArea : (totalArea || "")));
		const landType = fieldValue(fields, ["지목"]);
		const landUseZoneOptions = [
			"제1종 전용주거지역", "제2종 전용주거지역", "제1종 일반주거지역", "제2종 일반주거지역", "제3종 일반주거지역", "준주거지역",
			"중심상업지역", "일반상업지역", "근린상업지역", "유통상업지역",
			"전용공업지역", "일반공업지역", "준공업지역",
			"보전녹지지역", "생산녹지지역", "자연녹지지역",
			"보전관리지역", "생산관리지역", "계획관리지역",
			"농림지역", "자연환경보전지역"
		];
		const landUseZoneRaw = fieldValue(fields, ["용도지역"]);
		const landUseZone = landUseZoneOptions.find(option => normalizeLandUseZoneLabel(option) === normalizeLandUseZoneLabel(landUseZoneRaw)) || "";
		const originalAreaItems = getOiljangOriginalAreaItems(value, fields);
		const areaItems = originalAreaItems;
		const fallbackAreaMode = landArea && buildingArea && totalArea
			? "land_building_total"
			: (landArea && (supplyArea || exclusiveArea)
				? "land_supply_private"
				: (landArea && totalArea
					? "land_total"
					: (contractArea && exclusiveArea
						? "contract_private"
						: (supplyArea && exclusiveArea ? "supply_private" : typeAreaMode))));
		const areaMode = areaItems.length ? "oiljang_original" : fallbackAreaMode;
		return {
			parserSource: "oiljang",
			propertyType: normalizedPropertyType,
			buildingUse: fieldValue(fields, ["건축물용도", "건물형태"]),
			deal: dealTypes[0] || "",
			dealTypes,
			priceSale: parseMoneyToManwon(fieldValue(fields, ["매매가격"])),
			priceJeonse: parseMoneyToManwon(fieldValue(fields, ["전세금"])),
			priceMonthlyDeposit: parseMoneyToManwon(fieldValue(fields, ["보증금"])),
			priceMonthlyRent: parseMoneyToManwon(fieldValue(fields, ["월세"])),
			priceYearlyRent: parseMoneyToManwon(fieldValue(fields, ["년세", "연세"])),
			listingNo: fieldValue(fields, ["매물번호"]) || extractPropertyListingNoCandidate(value),
			title: normalizeQuickListingTitle(fieldValue(fields, ["매물명"])),
			address: normalizeOiljangJejuAddress(fieldValue(fields, ["소재지"])),
			supply: contractArea || supplyArea || totalArea,
			exclusive: exclusiveArea || buildingArea,
			landArea,
			totalArea,
			buildingArea,
			contractArea,
			supplyArea,
			landType,
			landUseZone,
			areaItems,
			areaMode,
			approvalDate: normalizeOiljangDateText(approvalDateRaw || inspectionDateRaw),
			approvalDateLabel,
			household: fieldValue(fields, ["총세대수"]).replace(/[^0-9]/g, ""),
			hasHouseholdSource: !!fieldValue(fields, ["총세대수"]).replace(/[^0-9]/g, ""),
			roomCount: roomBath ? roomBath[1] : "",
			bathCount: roomBath ? roomBath[2] : "",
			floorLevel: floorMatch ? floorMatch[1] : "",
			totalFloor: floorMatch ? floorMatch[2] : "",
			direction: fieldValue(fields, ["방향"]),
			parkingTotal: parkingMatch ? parkingMatch[1].replace(/,/g, "") : "",
			parkingPer: parkingMatch ? parkingMatch[2] : "",
			hasMaintenanceField,
			maintenanceNone,
			maintenanceNoFeeValue: maintenanceNone ? "관리비 없음" : "",
			maintenanceNoFeeReason: maintenanceNone ? "관리비 부과내역 없음" : "",
			maintenanceWon,
			maintenanceIncludes: includeMatch ? includeMatch[1].trim() : "",
			loanStatus: "check",
			heatingFuel: /도시가스/.test(detail.body) ? "도시가스" : "",
			moveInDate: parseMoveInDateText(moveInText),
			moveNegotiable: /협의/.test(moveInText || ""),
			moveNow: /즉시/.test(moveInText || ""),
			etcFacilityText: detail.body,
			applianceText: detail.body,
			coolingText: detail.body,
			agencyMemo: fieldValue(fields, ["메모"]),
			description: detail.body
		};
	}

	function getDaangnLines(text)
	{
		return String(text || "").split(/\r?\n/).map(line => line.trim());
	}

	function getDaangnNextLine(lines, label)
	{
		const normalizedLabel = String(label || "").trim();
		const index = lines.findIndex(line => line === normalizedLabel);
		if (index < 0) return "";
		for (let i = index + 1; i < lines.length; i++) {
			if (lines[i]) return lines[i];
		}
		return "";
	}

	function getDaangnSection(lines, startLabel, endLabels)
	{
		const startIndex = lines.findIndex(line => line === startLabel);
		if (startIndex < 0) return "";
		const endIndex = lines.findIndex((line, index) => index > startIndex && endLabels.includes(line));
		return lines.slice(startIndex + 1, endIndex >= 0 ? endIndex : lines.length).join("\n").trim();
	}

	function normalizeDaangnPropertyType(value)
	{
		const text = String(value || "");
		const resolved = resolveRealjejuPropertyTypeValue(text);
		if (resolved) return resolved;
		if (/토지|임야/.test(text)) return "land";
		if (/공장|창고/.test(text)) return "factory_warehouse";
		if (/상가|점포/.test(text)) return "store";
		if (/사무실/.test(text)) return "office";
		if (/오피스텔/.test(text)) return "officetel";
		if (/아파트/.test(text)) return "apartment";
		if (/빌라|연립|다세대/.test(text)) return "villa";
		if (/원룸|투룸|쓰리룸/.test(text)) return "room";
		if (/단독|전원주택|다가구|주택/.test(text)) return "house";
		return "";
	}

	function parseDaangnAreaValue(value)
	{
		const match = String(value || "").replace(/,/g, "").match(/([\d.]+)\s*(?:m²|㎡|평)/i);
		return match ? match[1] : "";
	}

	function parseDaangnManwon(value)
	{
		const text = String(value || "").trim();
		const parsed = parseMoneyToManwon(text);
		if (parsed !== "") return parsed;
		const number = text.replace(/,/g, "").match(/[\d.]+/);
		return number ? Math.round(Number(number[0])) : "";
	}

	function parseDaangnWon(value)
	{
		const text = String(value || "").replace(/,/g, "").trim();
		const man = text.match(/(\d+(?:\.\d+)?)\s*만/);
		if (man) return String(Math.round(Number(man[1]) * 10000));
		const won = text.match(/(\d+)\s*원/);
		return won ? won[1] : "";
	}

	function parseDaangnApprovalDate(value)
	{
		const text = String(value || "").trim();
		const korean = text.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
		if (korean) return `${korean[1]}-${korean[2].padStart(2, "0")}-${korean[3].padStart(2, "0")}`;
		return normalizeOiljangDateText(text);
	}

	function findDaangnLandUseZone(value)
	{
		const text = String(value || "");
		const options = [
			"제1종 전용주거지역", "제2종 전용주거지역", "제1종 일반주거지역", "제2종 일반주거지역", "제3종 일반주거지역", "준주거지역",
			"중심상업지역", "일반상업지역", "근린상업지역", "유통상업지역",
			"전용공업지역", "일반공업지역", "준공업지역",
			"보전녹지지역", "생산녹지지역", "자연녹지지역",
			"보전관리지역", "생산관리지역", "계획관리지역",
			"농림지역", "자연환경보전지역"
		];
		return options.find(option => text.includes(option.replace(/\s+/g, "")) || text.includes(option)) || "";
	}

	function parseDaangnListing(text)
	{
		const value = String(text || "");
		const lines = getDaangnLines(value);
		const nonEmptyLines = lines.filter(Boolean);
		const statusIndex = nonEmptyLines.findIndex(line => line === "판매중" || line === "거래완료");
		const statusNextText = statusIndex >= 0 ? (nonEmptyLines[statusIndex + 1] || "") : "";
		const detailText = getDaangnSection(lines, "상세정보", ["profile", "전화번호 보기", "비슷한 조건의 매물 더보기"]);
		const typeText = [
			statusNextText,
			getDaangnNextLine(lines, "매물"),
			getDaangnNextLine(lines, "아파트명"),
			value.match(/(?:제주특별자치도\s+)?[^\n]+?\s+(아파트|토지|단독\/전원주택|원룸투룸|빌라|상가점포|상가건물|사무실|공장\/창고)\s+사진/)?.[1] || "",
			detailText
		].join("\n");
		const propertyType = normalizeDaangnPropertyType(typeText);
		const descriptionRaw = getDaangnSection(lines, "매물 설명", ["시설 정보", "위치", "상세정보", "profile", "전화번호 보기", "비슷한 조건의 매물 더보기"]);
		const descriptionLines = descriptionRaw.split(/\r?\n/).map(line => line.trim());
		const firstDescriptionLine = descriptionLines.find(line => line && !/^\[[^\]]+\]$/.test(line)) || "";
		const titleFromNo = nonEmptyLines.find(line => /^\([가-힣A-Za-z]+-?\d+\)/.test(line)) || "";
		const brokerTitleLine = (() => {
			const noLineIndex = descriptionLines.findIndex(line => /^#\s*매물번호\s*[:：]/.test(line));
			if (noLineIndex < 0) return "";
			for (let i = noLineIndex + 1; i < descriptionLines.length; i++) {
				const line = descriptionLines[i].replace(/^#\s*/, "").trim();
				if (line) return line;
			}
			return "";
		})();
		const title = titleFromNo || brokerTitleLine || getDaangnNextLine(lines, "아파트명") || (propertyType === "apartment" ? statusNextText : "") || firstDescriptionLine || "";
		const titleListingNo = getFirstMatch(title, /^\(([가-힣A-Za-z]+-?\d+)\)/);
		const internalListingNo = titleListingNo || getFirstMatch(value, /매물번호\s*[:：]?\s*([가-힣A-Za-z]+-?\d+)/);
		const platformListingNo = getDaangnNextLine(lines, "매물번호");
		const salePriceText = getFirstMatch(value, /(?:^|\n)\s*매매\s+([^\n]+)/);
		const jeonsePriceText = getFirstMatch(value, /(?:^|\n)\s*전세\s+([^\n]+)/);
		const monthlyPriceText = getFirstMatch(value, /(?:^|\n)\s*월세\s+([^\n]+)/);
		const yearlyPriceText = getFirstMatch(value, /(?:^|\n)\s*년세\s+([^\n]+)/);
		const monthlyPair = monthlyPriceText.match(/([\d,]+)\s*\/\s*([\d,]+)/);
		const yearlyPair = yearlyPriceText.match(/([\d,]+)\s*\/\s*([\d,]+)/);
		const dealTypes = [];
		if (salePriceText) dealTypes.push("sale");
		if (jeonsePriceText) dealTypes.push("jeonse");
		if (monthlyPriceText) dealTypes.push("monthly");
		if (yearlyPriceText) dealTypes.push("yearly");
		const landArea = parseDaangnAreaValue(getDaangnNextLine(lines, "토지면적") || getDaangnNextLine(lines, "대지면적") || getFirstMatch(value, /대지\s*([\d,.]+)\s*(?:m²|㎡)/i));
		const totalArea = parseDaangnAreaValue(getDaangnNextLine(lines, "연면적") || getFirstMatch(value, /연면적\s*([\d,.]+)\s*(?:m²|㎡)/i));
		const buildingArea = parseDaangnAreaValue(getDaangnNextLine(lines, "건축면적") || getFirstMatch(value, /건축면적\s*[:：]?\s*([\d,.]+)\s*(?:m²|㎡)/i));
		const exclusiveArea = parseDaangnAreaValue(getDaangnNextLine(lines, "전용면적"));
		const supplyArea = parseDaangnAreaValue(getDaangnNextLine(lines, "공급면적"));
		let areaItems = [];
		if (propertyType === "land") {
			if (landArea) areaItems.push(makeOiljangAreaItem("land", "대지면적", landArea));
		} else {
			if (landArea) areaItems.push(makeOiljangAreaItem("land", "대지면적", landArea));
			if (buildingArea) areaItems.push(makeOiljangAreaItem("exclusive", "건축면적", buildingArea));
			if (totalArea) areaItems.push(makeOiljangAreaItem("supply", "연면적", totalArea));
			if (!buildingArea && exclusiveArea) areaItems.push(makeOiljangAreaItem("exclusive", "전용면적", exclusiveArea));
			if (!totalArea && supplyArea) areaItems.push(makeOiljangAreaItem("supply", "공급면적", supplyArea));
		}
		areaItems = areaItems.filter(Boolean);
		const roomBathText = getDaangnNextLine(lines, "방/욕실 수") || getFirstMatch(value, /방\s*\d+개\s*\/\s*욕실\s*\d+개/);
		const roomBath = roomBathText.match(/방\s*(\d+)개\s*\/\s*욕실\s*(\d+)개/) || roomBathText.match(/(\d+)\s*\/\s*(\d+)/);
		const floorText = getDaangnNextLine(lines, "층");
		const parkingText = getDaangnNextLine(lines, "총 주차 대수") || getFirstMatch(value, /총\s*주차\s*대수\s*([^\n]+)/);
		const parkingMatch = parkingText.match(/([\d,]+)\s*대/);
		const maintenanceInlineText = getFirstMatch(value, /(?:^|\n)\s*관리비\s+([^\n]+)/);
		const maintenanceText = getDaangnNextLine(lines, "관리비") || maintenanceInlineText;
		const hasMaintenanceField = lines.some(line => {
			const row = line.trim();
			return row === "관리비" || /^관리비\s+/.test(row);
		});
		const daangnMaintenanceWon = hasMaintenanceField ? parseDaangnWon(maintenanceText) : "";
		const maintenanceNone = hasMaintenanceField && isQuickMaintenanceNoFee(maintenanceText, daangnMaintenanceWon);
		const address = getDaangnNextLine(lines, "위치") || normalizeAddress(value);
		const directionText = getDaangnNextLine(lines, "방향");
		const approvalText = getDaangnNextLine(lines, "사용승인일 (연식)") || getDaangnNextLine(lines, "사용승인일");
		const moveInText = getDaangnNextLine(lines, "입주 가능일");
		const descriptionBody = title && descriptionLines[0] === title
			? descriptionLines.slice(1).join("\n").trimStart()
			: descriptionRaw;
		const facilitiesText = getDaangnSection(lines, "시설 정보", ["위치", "상세정보", "profile", "전화번호 보기"]);
		const facilityText = `${facilitiesText}\n${descriptionBody}`.replace(/전자렌지/g, "전자레인지");
		const directionBase = /거실/.test(directionText) ? "거실" : (/안방|주실/.test(directionText) ? "안방" : (/현관/.test(directionText) ? "현관출입문" : ""));
		const rawLandType = getDaangnNextLine(lines, "지목") || getFirstMatch(value, /지목\s*[:：]\s*([^\n]+)/);
		const landType = String(rawLandType || "").split(/[\/,\s]+/).find(Boolean) || "";
		const landUseZone = findDaangnLandUseZone(descriptionRaw) || findDaangnLandUseZone(detailText);
		const rawLandRoad = getFirstMatch(value, /도로\s*[:：]\s*([^\n]+)/);
		const cleanedRawLandRoad = cleanCrossroadRoadConditionText(rawLandRoad);
		const landRoad = isReliableRoadConditionText(cleanedRawLandRoad, rawLandRoad) ? cleanedRawLandRoad : "";
		return {
			parserSource: "daangn",
			propertyType,
			buildingUse: getDaangnNextLine(lines, "건축물 용도") || getDaangnNextLine(lines, "건축물용도"),
			deal: dealTypes[0] || "",
			dealTypes,
			priceSale: parseMoneyToManwon(salePriceText),
			priceJeonse: parseMoneyToManwon(jeonsePriceText),
			priceMonthlyDeposit: monthlyPair ? parseDaangnManwon(monthlyPair[1]) : "",
			priceMonthlyRent: monthlyPair ? parseDaangnManwon(monthlyPair[2]) : "",
			priceYearlyRent: yearlyPair ? parseDaangnManwon(yearlyPair[2]) : parseMoneyToManwon(yearlyPriceText),
			listingNo: internalListingNo || platformListingNo,
			title: normalizeQuickListingTitle(title.replace(/^\([^)]+\)\s*/, "")),
			address,
			supply: totalArea || supplyArea,
			exclusive: buildingArea || exclusiveArea,
			landArea,
			totalArea,
			buildingArea,
			supplyArea,
			areaItems,
			areaMode: areaItems.length ? "oiljang_original" : getRegisterAreaModeByType(propertyType),
			landType,
			landUseZone,
			landRoad,
			approvalDate: parseDaangnApprovalDate(approvalText),
			roomCount: roomBath ? roomBath[1] : "",
			bathCount: roomBath ? roomBath[2] : "",
			totalFloor: "",
			wholeBuildingFloor: /건물\s*전체/.test(floorText || value),
			direction: getFirstMatch(directionText, /([가-힣]+향)/),
			directionBase,
			parkingTotal: parkingMatch ? parkingMatch[1].replace(/,/g, "") : "",
			parkingStatus: /주차\s*가능|가능/.test(parkingText || value) ? "possible" : "",
			hasMaintenanceField,
			maintenanceNone,
			maintenanceNoFeeValue: maintenanceNone ? "관리비 없음" : "",
			maintenanceNoFeeReason: maintenanceNone ? "관리비 부과내역 없음" : "",
			maintenanceWon: maintenanceNone ? "" : daangnMaintenanceWon,
			loanStatus: /대출가능여부\s*\n\s*가능/.test(value) ? "possible" : "check",
			moveInDate: parseMoveInDateText(moveInText),
			moveNow: /즉시/.test(moveInText || ""),
			moveNegotiable: /협의/.test(moveInText || ""),
			applianceText: facilityText,
			furnitureText: facilityText,
			coolingText: facilityText,
			etcFacilityText: facilityText,
			description: descriptionBody
		};
	}

	function detectQuickPropertyParser(text)
	{
		const value = String(text || "").trim();
		if (/당근부동산/.test(value) && /(매물\s*설명|상세정보|끌올.*채팅.*관심.*조회)/s.test(value)) return "daangn";
		const hasOiljangBrand = /오일장신문/.test(value);
		if (!hasOiljangBrand) return "crossroad";
		if (/^오일장신문(?:\s|$)|^오일장신문\s*홈\s*바로가기/.test(value)) return "oiljang";
		if (/상세정보보기/.test(value) && /(매물명|매물종류|소재지|매물번호|보증금|매매가격)/.test(value)) return "oiljang";
		return "crossroad";
	}

	function applyParsedListing(parsed)
	{
		const propertyTypeSelect = $("propertyTypeSelect");
			if (parsed.propertyType) {
				setSelectValue("propertyTypeSelect", parsed.propertyType);
				resolvePropertyRegisterTypeValue(propertyTypeSelect, parsed.propertyType);
			}
			if (propertyTypeSelect) {
				// PATCH 3.939: 매물유형 선택 과정에서 areaMode가 초기화되므로 선택 후 원문 면적 정보를 다시 고정한다.
				propertyTypeSelect.dataset.areaMode = parsed.areaMode || "";
				if (Array.isArray(parsed.areaItems) && parsed.areaItems.length) {
					propertyTypeSelect.dataset.quickAreaItems = JSON.stringify(parsed.areaItems);
				} else {
					delete propertyTypeSelect.dataset.quickAreaItems;
				}
			}
			if (typeof updatePropertyRegisterAreaFields === "function") {
				updatePropertyRegisterAreaFields();
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
			["landNationalUseChk", "landUrbanPlanningChk", "landBuildingPermitChk", "landTransactionPermitChk"].forEach((id) => setCheck(id, false));
			// [ARCHIVE] PATCH 2.287: 간편등록을 다시 적용할 때 이전 토지종류/용도지역 선택값 제거
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
		// PATCH 3.942: 교차로/오일장/당근 원문 매물번호는 가져오지 않고 리얼제주 자동번호를 사용한다.
		setPropertyListingNoMode("auto");
		setInput("propertyAddressInput", parsed.address);
		setRadio("propertyAddressLocationMode", "rectangle");
		const addressInput = $("propertyAddressInput");
		if (addressInput && parsed.address) {
			addressInput.dataset.address1 = parsed.address;
			addressInput.dataset.publicAddress = parsed.address;
			addressInput.dataset.jibunAddress = parsed.address;
			addressInput.dataset.locationDisplayType = "rectangle";
		}
		setInput("supplyAreaM2Input", parsed.supplyAreaForInput || parsed.supply);
		setInput("exclusiveAreaM2Input", parsed.exclusive);
		setInput("landAreaM2Input", parsed.landArea);
		setInput("landRoadInput", parsed.landRoad);
		if (parsed.landConditions && typeof parsed.landConditions === "object") {
			setCheck("landNationalUseChk", !!parsed.landConditions.nationalLandUse);
			setCheck("landUrbanPlanningChk", !!parsed.landConditions.urbanPlanning);
			setCheck("landBuildingPermitChk", !!parsed.landConditions.buildingPermit);
			setCheck("landTransactionPermitChk", !!parsed.landConditions.landTransactionPermit);
		}
		if (parsed.landType) setSelectValue("landTypeSelect", parsed.landType);
		if (parsed.landUseZone) setSelectValue("landUseZoneSelect", parsed.landUseZone);
		setPropertyApprovalDateFieldLabel(parsed.approvalDateLabel || "사용승인일");
		setInput("propertyApprovalDateInput", parsed.approvalDate);
		// [ARCHIVE] PATCH 2.257: 새 붙여넣기마다 이전 총점포수/총세대수 값을 먼저 비우고 원문 값만 반영
		clearInput("propertyStoreCountInput");
		clearInput("propertyHouseholdCountInput");
		setInput("propertyStoreCountInput", parsed.storeCount);
		setInput("propertyHouseholdCountInput", parsed.household);
		syncQuickImportTotalCountRowsVisibility(parsed);
		if (typeof updatePropertyInfoFieldsByType === "function") updatePropertyInfoFieldsByType();
		syncQuickImportTotalCountRowsVisibility(parsed);
		setCheck("propertyRoomBathNotApplicableChk", false);
		// [ARCHIVE] PATCH 2.299: 간편입력마다 이전 방/욕실 값을 먼저 비우고 0/0이면 해당없음으로 동기화
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
		// [ARCHIVE] PATCH 2.323: 해당층/총층이 숫자이면 해당층 입력에 넣고, 저/중/고 층급은 라디오로 처리
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
		const normalizedDirection = normalizeQuickDirectionText(parsed.direction);
		if (normalizedDirection) setSelectValue("propertyDirectionSelect", normalizedDirection);
		if (parsed.directionBase) setSelectValue("propertyDirectionBaseSelect", parsed.directionBase);
		// [ARCHIVE] PATCH 2.253: 간편등록 적용 시 대출/반려동물은 항상 확인 필요에서 시작
		if (parsed.loanStatus) setRadio("propertyLoan", parsed.loanStatus);
		setRadio("propertyPet", "check");
		if (typeof ensureDefaultCheckRadios === "function") ensureDefaultCheckRadios();
		if (parsed.parkingTotal || parsed.parkingStatus) {
			setRadio("propertyParking", parsed.parkingStatus || "possible");
			setInput("propertyParkingTotalInput", parsed.parkingTotal);
			setInput("propertyParkingPerInput", parsed.parkingPer);
		}
		const resetParsedMaintenanceCard = () => {
			const maintenanceCard = $("propertyMaintenanceCard");
			if (maintenanceCard) maintenanceCard.classList.add("is-hidden");
			[
				"maintenanceFixedTotalInput", "maintenanceTotalInput", "maintenanceCommonInput",
				"maintenanceElectricInput", "maintenanceWaterInput", "maintenanceGasInput", "maintenanceHeatingInput",
				"maintenanceInternetInput", "maintenanceTvInput", "maintenanceEtcInput",
				"maintenanceNoneValue", "maintenanceNoneReason"
			].forEach((id) => clearInput(id));
			[
				"maintenanceFixedIncludeElectricChk", "maintenanceFixedIncludeWaterChk", "maintenanceFixedIncludeCommonChk", "maintenanceFixedIncludeGasChk",
				"maintenanceFixedIncludeHeatingChk", "maintenanceFixedIncludeInternetChk", "maintenanceFixedIncludeTvChk", "maintenanceFixedIncludeEtcChk",
				"maintenanceIncludeElectricChk", "maintenanceIncludeWaterChk", "maintenanceIncludeCommonChk", "maintenanceIncludeGasChk",
				"maintenanceIncludeHeatingChk", "maintenanceIncludeInternetChk", "maintenanceIncludeTvChk", "maintenanceIncludeEtcChk",
				"maintenanceUnder100kChk"
			].forEach((id) => setCheck(id, false));
			clearRadio("maintenanceFixedBase");
			clearRadio("maintenanceExtraBase");
			clearRadio("maintenanceDetailType");
			clearRadio("maintenanceUnknownReason");
		};
		const requiresMaintenanceCard = propertyTypeRequiresMaintenanceCard(parsed.propertyType || (propertyTypeSelect ? propertyTypeSelect.value : ""));
		const hasParsedMaintenanceField = parsed.hasMaintenanceField !== false && (!!parsed.maintenanceNone || !!parsed.maintenanceWon);
		const shouldApplyMaintenanceNone = !!parsed.maintenanceNone || (!hasParsedMaintenanceField && requiresMaintenanceCard);
		if (!hasParsedMaintenanceField && !shouldApplyMaintenanceNone) {
			resetParsedMaintenanceCard();
		}
		else if (shouldApplyMaintenanceNone) {
			const maintenanceCard = $("propertyMaintenanceCard");
			if (maintenanceCard) maintenanceCard.classList.remove("is-hidden");
			[
				"maintenanceFixedTotalInput", "maintenanceTotalInput", "maintenanceCommonInput",
				"maintenanceElectricInput", "maintenanceWaterInput", "maintenanceGasInput", "maintenanceHeatingInput",
				"maintenanceInternetInput", "maintenanceTvInput", "maintenanceEtcInput"
			].forEach((id) => clearInput(id));
			[
				"maintenanceFixedIncludeElectricChk", "maintenanceFixedIncludeWaterChk", "maintenanceFixedIncludeCommonChk", "maintenanceFixedIncludeGasChk",
				"maintenanceFixedIncludeHeatingChk", "maintenanceFixedIncludeInternetChk", "maintenanceFixedIncludeTvChk", "maintenanceFixedIncludeEtcChk",
				"maintenanceIncludeElectricChk", "maintenanceIncludeWaterChk", "maintenanceIncludeCommonChk", "maintenanceIncludeGasChk",
				"maintenanceIncludeHeatingChk", "maintenanceIncludeInternetChk", "maintenanceIncludeTvChk", "maintenanceIncludeEtcChk"
			].forEach((id) => setCheck(id, false));
			clearRadio("maintenanceFixedBase");
			clearRadio("maintenanceExtraBase");
			clearRadio("maintenanceDetailType");
			clearRadio("maintenanceUnder100kChk");
			setMaintenanceTab("none");
			setInput("maintenanceNoneValue", normalizeMaintenanceNoFeeText(parsed.maintenanceNoFeeValue || "관리비 없음", "관리비 없음"));
			setInput("maintenanceNoneReason", normalizeMaintenanceNoFeeText(parsed.maintenanceNoFeeReason || "관리비 부과내역 없음", "관리비 부과내역 없음"));
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
			// [ARCHIVE] PATCH 2.274: 관리비 포함 내역이 없으면 공용관리비와 기타관리비를 기본 선택
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
			// [ARCHIVE] PATCH 2.274: 부과기준이 비어 있으면 면적/세대별 공용관리비 + 사용량 기준을 기본 선택
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
		setInput("propertyAgencyMemoInput", parsed.agencyMemo);
		setInput("propertyDetailDescriptionInput", parsed.description);
		applyOiljangOriginalAreaDisplay(parsed);
		const syncImportedAreaValues = () => {
			const page = document.getElementById("propertyRegisterPage");
			if (typeof window.realjejuBindPropertyAreaAutoCalc === "function") {
				window.realjejuBindPropertyAreaAutoCalc();
			}
			if (page && typeof window.realjejuSyncPropertyAreaAutoCalcRows === "function") {
				window.realjejuSyncPropertyAreaAutoCalcRows(page);
			}
		};
		syncImportedAreaValues();
		if (typeof requestAnimationFrame === "function") requestAnimationFrame(syncImportedAreaValues);
		if (parsed.address && typeof window.realjejuApplyQuickAddressToLocationMap === "function") {
			window.realjejuApplyQuickAddressToLocationMap(parsed.address);
		}
	}

	// [ARCHIVE] PATCH 2.263: 간편매물등록 모달은 열 때마다 이전 붙여넣기 내용을 비움
	function resetQuickPropertyModal()
	{
		const editor = $("quickPropertyTextarea");
		if (editor) editor.textContent = "";
		const autoDetect = $("quickPropertyAutoDetect");
		if (autoDetect) autoDetect.checked = true;
	}

	function openQuickPropertyModal()
	{
		const modal = $("quickPropertyModal");
		if (!modal) return;
		resetQuickPropertyModal();
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		// PATCH 4.057: 확장 프로그램 content_script가 textarea 자동 포커스에서 터지지 않게 강제 포커스를 피한다.
	}

	function closeQuickPropertyModal()
	{
		const modal = $("quickPropertyModal");
		if (!modal) return;
		if (modal.contains(document.activeElement)) {
			try {
				document.activeElement.blur();
			} catch (error) {}
		}
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

	function insertQuickPropertyText(editor, text)
	{
		const value = String(text || "");
		const selection = window.getSelection();
		if (selection && selection.rangeCount && editor.contains(selection.anchorNode)) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			const textNode = document.createTextNode(value);
			range.insertNode(textNode);
			range.setStartAfter(textNode);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
		} else {
			editor.textContent = `${editor.textContent || ""}${value}`;
		}
		editor.dispatchEvent(new Event("input", { bubbles: true }));
	}

	// 5.186: contenteditable의 기본 붙여넣기가 HTMLㆍ이미지를 삽입하지 않도록
	// 전용 버튼과 같은 순수 텍스트 삽입 경로만 사용한다.
	function pasteQuickPropertyPlainText(event)
	{
		const editor = event.currentTarget;
		const clipboard = event.clipboardData || window.clipboardData;
		const text = String(clipboard?.getData("text/plain") || "");
		event.preventDefault();
		event.stopPropagation();
		if (!text) {
			setQuickPropertyPasteFeedback("붙여넣을 텍스트 없음");
			return;
		}
		insertQuickPropertyText(editor, text);
		setQuickPropertyPasteFeedback("붙여넣기 완료");
	}

	async function pasteQuickPropertyText()
	{
		const editor = $("quickPropertyTextarea");
		if (!editor) return;
		if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
			setQuickPropertyPasteFeedback("입력란 클릭 후 Ctrl+V");
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
			insertQuickPropertyText(editor, text);
			setQuickPropertyPasteFeedback("붙여넣기 완료");
		}
		catch (err) {
			console.warn("간편 입력 클립보드 붙여넣기 실패:", err);
			setQuickPropertyPasteFeedback("Ctrl+V로 붙여넣기");
		}
	}

	function applyQuickPropertyText()
	{
		const editor = $("quickPropertyTextarea");
		const text = String(editor?.textContent || "").trim();
		if (!text) {
			setQuickPropertyPasteFeedback("붙여넣을 내용 없음");
			return;
		}
		// [ARCHIVE] PATCH 3.931: 간편입력 적용 전 폼 상태를 완전 초기화해 이전 매물 유입값 잔상을 제거
		if (typeof window.resetPropertyRegisterFormFields === "function") {
			window.resetPropertyRegisterFormFields();
		}
		const parser = detectQuickPropertyParser(text);
		applyParsedListing(parser === "oiljang" ? parseOiljangListing(text) : (parser === "daangn" ? parseDaangnListing(text) : parseCrossroadListing(text)));
		if (typeof window.realjejuSetPropertyRegisterDraftDirty === "function") {
			window.realjejuSetPropertyRegisterDraftDirty("quick-import");
		} else {
			const page = document.getElementById("propertyRegisterPage");
			if (page) {
				page.dataset.hasDraft = "1";
				page.dataset.draftSource = "quick-import";
			}
		}
		closeQuickPropertyModal();
	}

	function bind()
	{
		const btn = $("quickPropertyRegisterBtn");
		if (!btn || btn.dataset.crossroadImportBound === "1") return;
		btn.dataset.crossroadImportBound = "1";
		let quickPropertyBackdropPointerStarted = false;
		btn.addEventListener("click", (event) => {
			event.preventDefault();
			openQuickPropertyModal();
		});

		$("quickPropertyPasteBtn")?.addEventListener("click", (event) => {
			event.preventDefault();
			pasteQuickPropertyText();
		});
		$("quickPropertyTextarea")?.addEventListener("paste", pasteQuickPropertyPlainText);
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

/* PATCH 4.377: 메인 랜딩 화면 라우팅 ===== */
(function bindMainLandingPage()
{
	function hasBrokerEditDeepLink()
	{
		try {
			const params = new URLSearchParams(window.location.search || "");
			return !!String(params.get("brokerEdit") || "").trim()
				|| params.get("agentList") === "1"
				|| !!String(params.get("agency") || "").trim();
		} catch (error) {
			return false;
		}
	}

	function setMainLandingPageHidden(page, hidden)
	{
		if (!page) return;
		if (hidden) {
			const activeElement = document.activeElement;
			if (activeElement && page.contains(activeElement) && typeof activeElement.blur === "function") {
				activeElement.blur();
			}
			page.setAttribute("inert", "");
			page.setAttribute("aria-hidden", "true");
			return;
		}
		page.removeAttribute("inert");
		page.setAttribute("aria-hidden", "false");
	}

	function closeMainLandingPage(options = {})
	{
		if (!document.body) return;
		const page = document.getElementById("mainLandingPage");
		setMainLandingPageHidden(page, true);
		document.body.classList.remove("main-landing-page-open");
		try {
			if (typeof refreshMapLayout === "function") {
				refreshMapLayout();
				setTimeout(refreshMapLayout, 0);
				setTimeout(refreshMapLayout, 120);
			}
		} catch (error) {}
		if (options && options.focusMap) {
			setTimeout(() => {
				try {
					document.getElementById("map")?.focus?.({ preventScroll: true });
				} catch (error) {}
			}, 0);
		}
	}

	async function openMainRealestateMap()
	{
		const router = window.realjejuRouter;
		if (router && typeof router.navigate === "function") {
			await router.navigate("/properties");
			try {
				document.getElementById("map")?.focus?.({ preventScroll: true });
			} catch (error) {}
			return;
		}
		closeMainLandingPage({ focusMap: true });
		if (typeof window.realjejuGoHome === "function") {
			window.realjejuGoHome({ resetDetail: true, category: "realestate" });
		} else {
			document.body?.classList?.remove("main-landing-page-open");
		}
	}

	async function openMainRealestateList()
	{
		await openMainRealestateMap();
		try {
			if (typeof state !== "undefined" && state) state.isListOpen = true;
		} catch (error) {}
		document.body?.classList?.remove("sidebar-list-collapsed");
		const sidebarEl = document.getElementById("sidebar");
		if (sidebarEl) sidebarEl.classList.remove("expanded");
		try {
			if (typeof updateSidebarWidth === "function") updateSidebarWidth();
			if (typeof refreshMapLayout === "function") setTimeout(refreshMapLayout, 80);
		} catch (error) {}
	}

	function runMainLandingAddressSearch(query, attempt = 0)
	{
		const value = String(query || "").trim();
		if (!value) return;
		const addressInput = document.getElementById("subAddressSearchInput");
		const canSearch = addressInput
			&& typeof handleSubAddressSearch === "function"
			&& window.kakao
			&& kakao.maps
			&& kakao.maps.services
			&& typeof state !== "undefined"
			&& state
			&& state.map;
		if (!canSearch) {
			if (attempt < 8) {
				setTimeout(() => runMainLandingAddressSearch(value, attempt + 1), 120);
			}
			return;
		}
		addressInput.value = value;
		try {
			sessionStorage.removeItem("realjeju.mainLandingSearchQuery");
		} catch (error) {}
		handleSubAddressSearch();
	}

	async function openMainCategory(category)
	{
		const key = String(category || "realestate").trim() || "realestate";
		const routePathByCategory = {
			realestate: "/properties",
      parcel: "/parcels",
      "ev-charger": "/ev-chargers",
			"local-business": "/companies",
			"part-time": "/jobs",
			"used-market": "/used",
			car: "/cars",
			meetup: "/meetups"
		};
		const router = window.realjejuRouter;
		if (router && typeof router.navigate === "function") {
			await router.navigate(routePathByCategory[key] || "/properties");
			return;
		}
		closeMainLandingPage();
		const categoryButton = document.querySelector(`.global-category-item[data-global-category="${CSS.escape(key)}"]`);
		if (categoryButton) {
			categoryButton.click();
			return;
		}
		if (typeof window.realjejuGoHome === "function") window.realjejuGoHome({ resetDetail: true, category: key });
	}

	async function openMainNotice()
	{
		const router = window.realjejuRouter;
		if (router && typeof router.navigate === "function") {
			await router.navigate("/notices");
			return;
		}
		closeMainLandingPage();
		const noticeButton = document.querySelector('[data-side-nav-action="notice"]');
		if (noticeButton) {
			noticeButton.click();
			return;
		}
		document.body?.classList?.add("notice-page-open", "sidebar-list-collapsed");
		const noticePanel = document.getElementById("noticePagePanel");
		if (noticePanel) noticePanel.setAttribute("aria-hidden", "false");
	}

	async function handleMainLandingSearch(event)
	{
		if (event) event.preventDefault();
		const input = document.getElementById("mainLandingSearchInput");
		const query = String(input && input.value || "").trim();
		if (query) {
			try {
				sessionStorage.setItem("realjeju.mainLandingSearchQuery", query);
			} catch (error) {}
		}
		await openMainRealestateMap();
		if (query) {
			runMainLandingAddressSearch(query);
		}
	}

	function handleMainLandingClick(event)
	{
		const actionButton = event.target && event.target.closest ? event.target.closest("[data-main-landing-action]") : null;
		if (actionButton) {
			event.preventDefault();
			const action = actionButton.dataset.mainLandingAction || "map";
			if (action === "list") openMainRealestateList();
			else if (action === "notice") openMainNotice();
			else openMainRealestateMap();
			return;
		}
		const categoryButton = event.target && event.target.closest ? event.target.closest("[data-main-landing-category]") : null;
		if (categoryButton) {
			event.preventDefault();
			openMainCategory(categoryButton.dataset.mainLandingCategory || "realestate");
		}
	}

	function bind()
	{
		const page = document.getElementById("mainLandingPage");
		if (!page || page.dataset.bound === "1") return;
		page.dataset.bound = "1";
		if (hasBrokerEditDeepLink()) closeMainLandingPage();
		setMainLandingPageHidden(page, !document.body?.classList?.contains("main-landing-page-open"));
		page.addEventListener("click", handleMainLandingClick);
		document.getElementById("mainLandingSearchForm")?.addEventListener("submit", handleMainLandingSearch);
		document.addEventListener("click", (event) => {
			if (!document.body?.classList?.contains("main-landing-page-open")) return;
			const target = event.target && event.target.closest ? event.target.closest(".global-category-item[data-global-category], [data-side-nav-action], .global-topbar-my-suite-link, .global-auth-trigger") : null;
			if (target) closeMainLandingPage();
		}, true);
			window.realjejuOpenMainLandingPage = function () {
				if (hasBrokerEditDeepLink()) {
					closeMainLandingPage();
					return;
			}
				if (typeof window.realjejuResetWorkspaceForStandalonePage === "function") {
					window.realjejuResetWorkspaceForStandalonePage();
				} else {
					document.body?.classList?.remove("my-suite-page-open", "my-suite-favorites-tab-open");
					const mySuitePanel = document.getElementById("mySuitePanel");
					if (mySuitePanel) {
						mySuitePanel.setAttribute("aria-hidden", "true");
						mySuitePanel.style.display = "";
					}
				}
				document.body?.classList?.add("main-landing-page-open", "sidebar-list-collapsed");
				setMainLandingPageHidden(page, false);
				if (typeof scheduleLandingPropertyViewportPrefetch === "function") {
					scheduleLandingPropertyViewportPrefetch();
				}
				if (typeof window.loadLandingNoticePreview === "function") {
					window.loadLandingNoticePreview();
				}
				if (typeof clearGlobalCategoryActive === "function") clearGlobalCategoryActive();
				try {
					if (typeof state !== "undefined" && state) state.isListOpen = false;
				} catch (error) {}
		};
		window.realjejuOpenMainRealestateMap = openMainRealestateMap;
		window.realjejuCloseMainLandingPage = closeMainLandingPage;
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
	else bind();
})();

/* [ARCHIVE] PATCH: 로그인/로그아웃/세션 복구 시 부동산 홈 전환 ===== */
(function bindAuthStateGoHome()
{
	let authHomeBound = false;

	function shouldPreserveCleanRouteOnAuthChange()
	{
		const pathname = String(window.location.pathname || "/").replace(/\/+$/, "") || "/";
		return /^\/(?:properties(?:\/[^/]+)?|parcels|companies|ev-chargers|jobs|used|cars|meetups|notices|mypage\/(?:profile|office|payments|inquiries)|admin(?:\/(?:notices|inquiries|coupons|users|broker-applications|properties))?)$/i.test(pathname);
	}

	function reapplyCleanRouteAfterAuthChange()
	{
		if (!shouldPreserveCleanRouteOnAuthChange()) return false;
		if (window.realjejuRouter && typeof window.realjejuRouter.onAuthChange === "function") {
			window.realjejuRouter.onAuthChange();
			return true;
		}
		if (typeof window.realjejuApplyCurrentRoute === "function") {
			setTimeout(() => {
				Promise.resolve(window.realjejuApplyCurrentRoute()).catch(() => {});
			}, 0);
		}
		return true;
	}

	function clearPropertyRegisterReturnDataset()
	{
		const page = document.getElementById("propertyRegisterPage");
		if (!page) return;
		[
			"returnToBrokerHome",
			"returnBrokerListingId",
			"returnToMapHome",
			"returnMapListingId",
			"returnToAdminListings",
			"returnAdminListingId",
			"returnToMySuiteFavorites",
			"returnMySuiteFavoriteListingId",
			"returnHistoryPushed"
		].forEach((key) => {
			delete page.dataset[key];
		});
	}

	function goRealjejuHome(options = {})
	{
		if (isRealjejuPasswordRecoveryLocked()) {
			keepRealjejuPasswordRecoveryScreen();
			return;
		}
			let categoryModePromise = Promise.resolve(true);
			if (typeof closeRealjejuTermsFullPageForNavigation === "function") closeRealjejuTermsFullPageForNavigation();
			if (typeof closeRealjejuCompanyFullPageForNavigation === "function") closeRealjejuCompanyFullPageForNavigation();
			const resetDetail = !!(options && options.resetDetail);
			const usePresaleMode = !!(options && options.presale);
			const requestedCategory = String(options && options.category || "").trim();
			const wasPresaleMode = document.body.classList.contains("presale-page-open");
			const hasDetailQuery = !!getDetailIdFromLocation();
			const shouldCollapseHome = resetDetail || !hasDetailQuery;

		try {
			if (typeof closeGlobalCategorySidePanel === "function") closeGlobalCategorySidePanel();
			if (!usePresaleMode && typeof syncGlobalCategoryActive === "function") {
				categoryModePromise = Promise.resolve(syncGlobalCategoryActive(requestedCategory || "realestate"));
			}
		} catch (error) {}

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
			clearPropertyRegisterReturnDataset();
			if (typeof closePropertyRegisterPage === "function") {
				closePropertyRegisterPage({
					suppressBrokerHomeReturn: true,
					suppressMapHomeReturn: true,
					suppressAdminListingsReturn: true,
					suppressMySuiteFavoritesReturn: true
				});
			}
		} catch (error) {}

		try {
			if (typeof closeAdminPage === "function") closeAdminPage();
		} catch (error) {}

		// [ARCHIVE] PATCH 2.316: 상단 홈 이동 시 기존 중개사 홈 패널도 함께 닫는다
		try {
			if (typeof closeBrokerHomePage === "function") closeBrokerHomePage();
		} catch (error) {}

		try {
			if (typeof closeMyInfoPage === "function") closeMyInfoPage();
		} catch (error) {}

		try {
			if (typeof window.closeMySuitePage === "function") window.closeMySuitePage();
		} catch (error) {}

			const classesToRemove = [
				"auth-page-open", "property-register-page-open", "part-time-page-open",
				"part-time-register-page-open", "admin-page-open", "operator-page-open",
				"broker-home-page-open", "payment-page-open", "myinfo-page-open",
				"profile-edit-page-open", "broker-office-info-page-open",
				"broker-office-apply-page-open", "broker-office-edit-page-open", "profile-page-open", "my-suite-page-open",
				"account-inquiries-page-open", "realjeju-account-page-open",
				"realjeju-document-page-open", "notice-page-open"
			];
			if (resetDetail) classesToRemove.push("detail-page-panel-open", "shared-detail-mode", "list-shared-detail-mode");
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
		if (typeof hideRoadviewPositionMarker === "function") hideRoadviewPositionMarker();
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

		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeApplyPagePanel", "brokerOfficeEditPagePanel", "paymentPagePanel", "mySuitePanel", "noticePagePanel"].forEach((id) => {
			const panel = document.getElementById(id);
			if (panel) {
				panel.setAttribute("aria-hidden", "true");
				panel.style.display = "";
				panel.classList.remove("open", "active", "is-open");
			}
		});
		const partTimePagePanel = document.getElementById("partTimePagePanel");
		if (partTimePagePanel) partTimePagePanel.setAttribute("aria-hidden", "true");

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
			return text === "부동산 홈" || text === "동네업체 홈" || text === "홈";
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

			try {
				if (usePresaleMode && typeof window.realjejuOpenPresaleMapMode === "function") {
					window.realjejuOpenPresaleMapMode();
				} else if (wasPresaleMode && typeof window.realjejuClosePresaleMapMode === "function") {
					window.realjejuClosePresaleMapMode();
				}
			} catch (error) {}
			return categoryModePromise;
		}

	function bind()
	{
		if (authHomeBound) return;
		const client = typeof getRealjejuSupabaseClient === "function" ? getRealjejuSupabaseClient() : null;
		if (!client || !client.auth || typeof client.auth.onAuthStateChange !== "function") return;

		authHomeBound = true;

		client.auth.onAuthStateChange(function (event)
		{
			// [ARCHIVE] PATCH 2.551: Chrome 탭 복귀 시 TOKEN_REFRESHED/INITIAL_SESSION이 발생해도
			// 작성 중인 매물등록 화면을 닫거나 초기화하지 않는다.
			if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
			if (event === "PASSWORD_RECOVERY") {
				if (typeof window.openRealjejuPasswordRecoveryScreen === "function") window.openRealjejuPasswordRecoveryScreen();
				return;
			}
			if (window.realjejuPasswordRecoveryRequired) return;
			if (event === "SIGNED_OUT") {
				if (typeof applyLoggedOutAccountUI === "function") applyLoggedOutAccountUI();
				if (window.realjejuRouter && typeof window.realjejuRouter.onAuthChange === "function") {
					window.realjejuRouter.onAuthChange(event);
					return;
				}
				reapplyCleanRouteAfterAuthChange();
				return;
			}
			if (event === "SIGNED_IN") {
				if (typeof initRealjejuAccountUI === "function") initRealjejuAccountUI();
				if (window.realjejuRouter && typeof window.realjejuRouter.onAuthChange === "function") {
					window.realjejuRouter.onAuthChange(event);
					return;
				}
				reapplyCleanRouteAfterAuthChange();
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

/* [ARCHIVE] PATCH: 모든 휴대폰 입력 010-0000-0000 자동 포맷 ===== */
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

/* [ARCHIVE] PATCH: 전화번호 입력 백스페이스/커서 개선 ===== */
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

/* [ARCHIVE] PATCH 2.152: 매물 등록 주소 입력 모달 ===== */
(function initPropertyAddressInputModal(){
	const addressInput = document.getElementById("propertyAddressInput");
	const modal = document.getElementById("propertyAddressSearchModal");
	if (!addressInput || !modal) return;
	const brokerOfficeAddressInput = document.getElementById("brokerOfficeAddressInput");
	const brokerOfficeAddressDetailInput = document.getElementById("brokerOfficeAddressDetailInput");
	const brokerOfficeAddressMainDetail = document.getElementById("brokerOfficeAddressMainDetail");
	const brokerOfficeAddressWrap = brokerOfficeAddressInput?.closest(".property-address-wrap");
	const brokerOfficeEditPageAddressInput = document.getElementById("brokerOfficeEditPageAddressInput");
	const brokerOfficeEditPageAddressMainDetail = document.getElementById("brokerOfficeEditPageAddressMainDetail");
	const brokerOfficeEditPageAddressWrap = brokerOfficeEditPageAddressInput?.closest(".property-address-wrap");
	const partTimeLocationInput = document.getElementById("partTimeLocationInput");
	const partTimeAddressDetailInput = document.getElementById("partTimeAddressInput");
	const partTimeAddressMainDetail = document.getElementById("partTimeAddressMainDetail");
	const partTimeAddressWrap = partTimeLocationInput?.closest(".property-address-wrap");
	let addressSearchTarget = "property";

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

	function setAddressModalTitle(title){
		document.querySelectorAll("#propertyAddressSearchModal .property-address-search-title").forEach((el) => {
			el.textContent = title;
		});
	}

	function updateAddressDetailCopyForTarget(){
		const isBrokerAddress = addressSearchTarget === "brokerOffice"
			|| addressSearchTarget === "brokerOfficeEdit"
			|| addressSearchTarget === "mySuiteBrokerApply";
		const isPartTimeAddress = addressSearchTarget === "partTime";
		const isSimpleAddress = isBrokerAddress || isPartTimeAddress;
		const sectionTitle = document.querySelector("#propertyAddressSearchModal .property-address-detail-section-title");
		const detailHelp = document.querySelector("#propertyAddressSearchModal .property-address-detail-help");
		if (sectionTitle) {
			sectionTitle.innerHTML = isSimpleAddress ? "상세주소" : "상세 주소 <span>(선택)</span>";
		}
		if (detailHelp) {
			detailHelp.hidden = isSimpleAddress;
			detailHelp.style.display = isSimpleAddress ? "none" : "";
		}
	}

	window.realjejuClearPartTimeAddressSearchState = function(){
		selectedAddress = null;
		if (addressSearchTarget !== "partTime") return;
		if (searchInput) searchInput.value = "";
		if (detailInput) detailInput.value = "";
		if (roadEl) roadEl.textContent = "";
		if (jibunEl) jibunEl.textContent = "";
		renderGuide();
		updateSearchValueState();
		searchScreen?.classList.add("open");
		detailScreen?.classList.remove("open");
	};

	function applyPartTimeAddress(address, detailText){
		if (!address || !partTimeLocationInput) return;
		const addressRoad = address.roadAddress || "";
		const addressJibun = address.jibunAddress || "";
		const address1 = addressJibun || addressRoad || "";
		const address2 = String(detailText || "").trim();
		partTimeLocationInput.value = address1;
		partTimeLocationInput.dataset.address1 = address1;
		partTimeLocationInput.dataset.address2 = address2;
		partTimeLocationInput.dataset.roadAddress = addressRoad;
		partTimeLocationInput.dataset.jibunAddress = addressJibun;
		partTimeLocationInput.dataset.zonecode = address.zonecode || "";
		partTimeLocationInput.dataset.buildingName = address.buildingName || "";
		partTimeLocationInput.dataset.complexName = address.complexName || address.buildingName || "";
		partTimeLocationInput.dataset.detailAddress = address2;
		partTimeLocationInput.dataset.lat = address.lat || "";
		partTimeLocationInput.dataset.lng = address.lng || "";
		if (partTimeAddressDetailInput) partTimeAddressDetailInput.value = address2;
		if (partTimeAddressMainDetail) partTimeAddressMainDetail.textContent = address2 ? `[${address2}]` : "";
		partTimeAddressWrap?.classList.toggle("has-detail-address", !!address2);
		partTimeLocationInput.dispatchEvent(new Event("input", { bubbles: true }));
		partTimeLocationInput.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function applyBrokerOfficeAddress(address, detailText){
		if (!address) return;
		const addressRoad = address.roadAddress || "";
		const addressJibun = address.jibunAddress || "";
		const address1 = addressJibun || addressRoad || "";
		const address2 = String(detailText || "").trim();
		const fullAddress = address2 ? `${address1} ${address2}` : address1;
		if (addressSearchTarget === "brokerOfficeEdit") {
			if (!brokerOfficeEditPageAddressInput) return;
			brokerOfficeEditPageAddressInput.value = fullAddress;
			brokerOfficeEditPageAddressInput.dataset.address1 = address1;
			brokerOfficeEditPageAddressInput.dataset.address2 = address2;
			brokerOfficeEditPageAddressInput.dataset.roadAddress = addressRoad;
			brokerOfficeEditPageAddressInput.dataset.jibunAddress = addressJibun;
			brokerOfficeEditPageAddressInput.dataset.zonecode = address.zonecode || "";
			brokerOfficeEditPageAddressInput.dataset.buildingName = address.buildingName || "";
			brokerOfficeEditPageAddressInput.dataset.complexName = address.complexName || address.buildingName || "";
			brokerOfficeEditPageAddressInput.dataset.detailAddress = address2;
			if (brokerOfficeEditPageAddressMainDetail) brokerOfficeEditPageAddressMainDetail.textContent = "";
			brokerOfficeEditPageAddressWrap?.classList.remove("has-detail-address");
			brokerOfficeEditPageAddressInput.dispatchEvent(new Event("input", { bubbles: true }));
			brokerOfficeEditPageAddressInput.dispatchEvent(new Event("change", { bubbles: true }));
			return;
		}
		if (addressSearchTarget === "mySuiteBrokerApply") {
			const input = document.getElementById("mySuiteBrokerApplyAddressInput");
			const detailEl = document.getElementById("mySuiteBrokerApplyAddressMainDetail");
			const wrap = input?.closest(".property-address-wrap");
			if (!input) return;
			input.value = fullAddress;
			input.dataset.address1 = address1;
			input.dataset.address2 = address2;
			input.dataset.roadAddress = addressRoad;
			input.dataset.jibunAddress = addressJibun;
			input.dataset.zonecode = address.zonecode || "";
			input.dataset.buildingName = address.buildingName || "";
			input.dataset.complexName = address.complexName || address.buildingName || "";
			input.dataset.detailAddress = address2;
			if (detailEl) detailEl.textContent = "";
			wrap?.classList.remove("has-detail-address");
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));
			return;
		}
		if (!brokerOfficeAddressInput) return;
		brokerOfficeAddressInput.value = address1;
		brokerOfficeAddressInput.dataset.address1 = address1;
		brokerOfficeAddressInput.dataset.address2 = address2;
		brokerOfficeAddressInput.dataset.roadAddress = addressRoad;
		brokerOfficeAddressInput.dataset.jibunAddress = addressJibun;
		brokerOfficeAddressInput.dataset.zonecode = address.zonecode || "";
		brokerOfficeAddressInput.dataset.buildingName = address.buildingName || "";
		brokerOfficeAddressInput.dataset.complexName = address.complexName || address.buildingName || "";
		brokerOfficeAddressInput.dataset.detailAddress = address2;
		if (brokerOfficeAddressDetailInput) brokerOfficeAddressDetailInput.value = address2;
		if (brokerOfficeAddressMainDetail) brokerOfficeAddressMainDetail.textContent = address2 ? `[${address2}]` : "";
		brokerOfficeAddressWrap?.classList.toggle("has-detail-address", !!address2);
		brokerOfficeAddressInput.dispatchEvent(new Event("input", { bubbles: true }));
		brokerOfficeAddressInput.dispatchEvent(new Event("change", { bubbles: true }));
	}

	// [ARCHIVE] PATCH 2.262: 매물등록 새 글 시작 시 주소 지도와 좌표 상태를 완전히 비움
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

	// [ARCHIVE] PATCH 2.318: 간편입력 주소 검색 실패 시에도 주소값과 지도 영역은 먼저 열어 둔다
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
		// [ARCHIVE] PATCH 2.318: 제주시/서귀포시 주소 모두 카카오 주소검색 후보에 안정적으로 포함
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
		return formatPublicRegionAddress(address);
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
				strokeColor: getComputedStyle(document.documentElement).getPropertyValue("--property-address-location-rectangle-stroke").trim() || "#2563EB",
				strokeOpacity: 0.95,
				fillColor: getComputedStyle(document.documentElement).getPropertyValue("--property-address-location-rectangle-fill").trim() || "rgba(37, 99, 235, 0.26)",
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

	function resetAddressSearchSession(){
		selectedAddress = null;
		if (searchInput) searchInput.value = "";
		if (detailInput) detailInput.value = "";
		if (roadEl) roadEl.textContent = "";
		if (jibunEl) jibunEl.textContent = "";
		renderGuide();
		updateSearchValueState();
		searchScreen?.classList.add("open");
		detailScreen?.classList.remove("open");
	}

	function openModal(target = "property"){
		addressSearchTarget = target === "brokerOffice" || target === "brokerOfficeEdit" || target === "mySuiteBrokerApply" || target === "partTime" ? target : "property";
		setAddressModalTitle(addressSearchTarget === "property" ? "매물 주소" : (addressSearchTarget === "partTime" ? "주소지 검색" : "중개사무소 주소"));
		updateAddressDetailCopyForTarget();
		updateDetailHideRow();
		if (addressSearchTarget === "property") {
			// 검색창ㆍ검색 결과만 매번 초기화하고 실제 폼의 저장 주소와 수정/임시저장 값은 보존합니다.
			resetAddressSearchSession();
		}
		if (addressSearchTarget === "partTime" && typeof window.realjejuClearPartTimeAddressSearchState === "function") {
			window.realjejuClearPartTimeAddressSearchState();
		}
		if (addressSearchTarget === "brokerOffice" || addressSearchTarget === "brokerOfficeEdit" || addressSearchTarget === "mySuiteBrokerApply" || addressSearchTarget === "partTime") {
			detailHideRow?.classList.remove("open");
			if (detailHideCheck) detailHideCheck.checked = false;
			locationRow?.classList.remove("open");
			locationRow?.setAttribute("aria-hidden", "true");
		}
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		showSearchScreen();
		setTimeout(() => searchInput && searchInput.focus(), 30);
	}

	function getAddressModalReturnFocusTarget(){
		if (addressSearchTarget === "partTime") return partTimeLocationInput;
		if (addressSearchTarget === "brokerOffice") return brokerOfficeAddressInput;
		if (addressSearchTarget === "brokerOfficeEdit") return brokerOfficeEditPageAddressInput;
		if (addressSearchTarget === "mySuiteBrokerApply") return document.getElementById("mySuiteBrokerApplyAddressInput");
		return addressInput;
	}

	function releaseAddressModalFocus(){
		if (!modal.contains(document.activeElement)) return;
		const target = getAddressModalReturnFocusTarget();
		if (target && typeof target.focus === "function") {
			try {
				target.focus({ preventScroll: true });
				return;
			} catch (error) {
				try {
					target.focus();
					return;
				} catch (focusError) {}
			}
		}
		try {
			document.activeElement?.blur?.();
		} catch (error) {}
	}

	function closeModal(){
		releaseAddressModalFocus();
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
	}

	function showSearchScreen(){
		updateAddressDetailCopyForTarget();
		searchScreen?.classList.add("open");
		detailScreen?.classList.remove("open");
		updateSearchValueState();
	}

	function showDetailScreen(address){
		updateAddressDetailCopyForTarget();
		selectedAddress = address;
		if (roadEl) roadEl.textContent = address.roadAddress || address.jibunAddress || "";
		if (jibunEl) jibunEl.textContent = address.jibunAddress || address.roadAddress || "";
		if (detailInput && addressSearchTarget === "brokerOffice") {
			detailInput.value = brokerOfficeAddressDetailInput?.value || "";
		} else if (detailInput && addressSearchTarget === "partTime") {
			detailInput.value = partTimeAddressDetailInput?.value || "";
		} else if (detailInput && (addressSearchTarget === "brokerOfficeEdit" || addressSearchTarget === "mySuiteBrokerApply")) {
			detailInput.value = "";
		}
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

	// [ARCHIVE] PATCH 2.322: 중개사 홈 수정 진입 시 저장된 주소와 좌표로 지도 영역을 즉시 복원
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
		if (addressSearchTarget === "partTime") {
			applyPartTimeAddress(selectedAddress, address2);
			closeModal();
			return;
		}
		if (addressSearchTarget === "brokerOffice" || addressSearchTarget === "brokerOfficeEdit" || addressSearchTarget === "mySuiteBrokerApply") {
			applyBrokerOfficeAddress(selectedAddress, address2);
			closeModal();
			return;
		}
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

	addressInput.addEventListener("click", () => openModal("property"));
	addressInput.addEventListener("focus", () => openModal("property"));
	addressInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			openModal("property");
		}
	});
	brokerOfficeAddressInput?.addEventListener("click", () => openModal("brokerOffice"));
	brokerOfficeAddressInput?.addEventListener("focus", () => openModal("brokerOffice"));
	brokerOfficeAddressInput?.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			openModal("brokerOffice");
		}
	});
	brokerOfficeEditPageAddressInput?.addEventListener("click", () => openModal("brokerOfficeEdit"));
	brokerOfficeEditPageAddressInput?.addEventListener("focus", () => openModal("brokerOfficeEdit"));
	brokerOfficeEditPageAddressInput?.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			openModal("brokerOfficeEdit");
		}
	});
	partTimeLocationInput?.addEventListener("click", () => openModal("partTime"));
	partTimeLocationInput?.addEventListener("focus", () => openModal("partTime"));
	partTimeLocationInput?.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			openModal("partTime");
		}
	});
	document.addEventListener("click", (e) => {
		if (!e.target?.closest?.("#mySuiteBrokerApplyAddressInput")) return;
		openModal("mySuiteBrokerApply");
	});
	document.addEventListener("focusin", (e) => {
		if (!e.target?.closest?.("#mySuiteBrokerApplyAddressInput")) return;
		openModal("mySuiteBrokerApply");
	});
	document.addEventListener("keydown", (e) => {
		if (!e.target?.closest?.("#mySuiteBrokerApplyAddressInput") || e.key !== "Enter") return;
		e.preventDefault();
		openModal("mySuiteBrokerApply");
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
	document.addEventListener("pointerdown", (e) => {
		if (!modal.classList.contains("open")) return;
		const dialog = e.target?.closest?.(".property-address-search-dialog");
		if (dialog && modal.contains(dialog)) return;
		// 상단ㆍ왼쪽 메뉴 클릭을 막지 않고 주소 모달만 먼저 닫습니다.
		closeModal();
	}, true);
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

/* [ARCHIVE] PATCH 2.361: 매물 등록/수정 완료 확인 후 중개사 홈 이동을 확인 버튼 클릭 기준으로 강제 보장 */
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


/* [ARCHIVE] PATCH 2.365: 이용권 결제 탭 / 테스트 결제 버튼 ===== */
(function bindPaymentPageEvents()
{
	function bind()
	{
		if (typeof window.realjejuRenderPaymentAddonShops === "function") {
			window.realjejuRenderPaymentAddonShops(document);
		}
		if (typeof window.realjejuApplyPaymentPlanState === "function") {
			window.realjejuApplyPaymentPlanState(document);
		}
		if (typeof window.realjejuRefreshPaymentPlanState === "function") {
			void window.realjejuRefreshPaymentPlanState();
		}
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
				if (target === "history" && typeof window.realjejuLoadPaymentHistory === "function") {
					void window.realjejuLoadPaymentHistory(document);
				}
			});
		});

		document.querySelectorAll(".payment-plan-btn[data-plan], .payment-extra-item, [data-addon-purchase-button]").forEach((btn) => {
			if (btn.dataset.paymentButtonBound === "true") return;
			btn.dataset.paymentButtonBound = "true";
			btn.addEventListener("click", () => {
				if (btn.disabled) return;
				alert("토스페이먼츠 연동 준비중입니다. 테스트 결제 연결 후 실제 결제가 가능합니다.");
			});
		});

		document.querySelectorAll(".payment-coupon-use-btn").forEach((btn) => {
			if (typeof window.realjejuSyncPaymentCouponCountBadge === "function") {
				window.realjejuSyncPaymentCouponCountBadge(btn);
			}
			if (btn.dataset.paymentCouponButtonBound === "true") return;
			btn.dataset.paymentCouponButtonBound = "true";
			btn.addEventListener("click", async () => {
				if (typeof window.realjejuUseBrokerCoupon === "function") {
					await window.realjejuUseBrokerCoupon(btn);
				}
			});
		});
		document.querySelectorAll(".payment-history-refresh").forEach((button) => {
			if (button.dataset.paymentHistoryBound === "true") return;
			button.dataset.paymentHistoryBound = "true";
			button.addEventListener("click", () => {
				if (typeof window.realjejuLoadPaymentHistory === "function") {
					void window.realjejuLoadPaymentHistory(document);
				}
			});
		});

	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bind);
	} else {
		bind();
	}
})();

/* [ARCHIVE] PATCH 2.551: 프로필 공통 푸터는 실제 활성 화면에만 표시 */
(function bindProfileCommonFooterVisibility()
{
	const footerScreenIds = [
		"authProfileSetupScreen",
		"authMyInfoScreen",
		"authBrokerOfficeInfoScreen"
	];
	const profileScreenIds = footerScreenIds.slice();

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


/* [ARCHIVE] PATCH 3.770: position the top filter bar from the actual visible left panel edge. */
(function () {
	let filterSafeLeftRaf = 0;
	const FILTER_PANEL_GAP_WITH_TOGGLE = 42;
	const FILTER_PANEL_GAP_WITH_OVERLAY = 18;

	function isVisiblePanel(el) {
		if (!el) return false;
		const style = window.getComputedStyle(el);
		if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
		const rect = el.getBoundingClientRect();
		return rect.width > 8 && rect.height > 8 && rect.right > rect.left;
	}

	function getVisibleLeftOverlayRight() {
		const listPanel = document.querySelector(".sidebar-list-panel");
		const listHeader = document.querySelector(".sidebar-list-header");
		const propertyList = document.querySelector(".property-list");
		const detailPanel = document.querySelector(".sidebar-detail-panel");
		const educationDetailPanel = document.querySelector(".education-facility-detail-panel.open");
		const localBusinessCard = document.querySelector(".local-business-recent-card-layer.open");
		const isRecentSharedDetail = document.body
			&& (document.body.classList.contains("recent-shared-detail-mode")
				|| document.body.classList.contains("list-shared-detail-mode"));

		if (isVisiblePanel(localBusinessCard)) {
			return Math.max(0, Math.round(localBusinessCard.getBoundingClientRect().right));
		}

		if (document.body && document.body.classList.contains("education-facility-detail-open") && isVisiblePanel(educationDetailPanel)) {
			return Math.max(0, Math.round(educationDetailPanel.getBoundingClientRect().right));
		}

		// [ARCHIVE] PATCH 3.862: 최근 조회 상세 패널이 열릴 때는 상세패널 좌측 영역 기준으로 필터바 시작점을 보정합니다.
		if (isRecentSharedDetail && isVisiblePanel(detailPanel)) {
			return Math.max(0, Math.round(detailPanel.getBoundingClientRect().right));
		}

		const listOpen = document.body
			&& !document.body.classList.contains("sidebar-list-collapsed")
			&& !document.body.classList.contains("map-panels-collapsed");
		if (listOpen) {
			const candidates = [listHeader, propertyList, listPanel].filter(isVisiblePanel);
			if (candidates.length) {
				return Math.max(0, Math.round(Math.min.apply(null, candidates.map((el) => el.getBoundingClientRect().right))));
			}
		}
		return 0;
	}

	function getVisibleLeftPanelRight() {
		const overlayRight = getVisibleLeftOverlayRight();
		if (overlayRight > 0) return overlayRight;
		if (document.body) {
			const targetSideNavWidth = parseFloat(
				window.getComputedStyle(document.body).getPropertyValue("--realjeju-side-nav-width")
			);
			if (Number.isFinite(targetSideNavWidth)) return Math.max(0, Math.round(targetSideNavWidth));
		}
		const sideNav = document.querySelector(".realjeju-side-nav");
		if (isVisiblePanel(sideNav)) {
			return Math.max(0, Math.round(sideNav.getBoundingClientRect().right));
		}
		return 0;
	}


	function applyTopbarFilterSafeLeft() {
		filterSafeLeftRaf = 0;
		if (!document.body) return;
		const overlayRight = getVisibleLeftOverlayRight();
		const visibleLeftPanelRight = getVisibleLeftPanelRight();
		const sideNavToggle = document.getElementById("realjejuSideNavToggle");
		if (sideNavToggle) {
			if (overlayRight > 0) sideNavToggle.style.setProperty("display", "none", "important");
			else sideNavToggle.style.removeProperty("display");
		}
		const menu = document.querySelector("#topbarMenu.global-topbar-menu.has-map-filters");
		if (!menu || !document.body.classList.contains("realjeju-filters-in-topbar")) return;
		const filterGap = overlayRight > 0 ? FILTER_PANEL_GAP_WITH_OVERLAY : FILTER_PANEL_GAP_WITH_TOGGLE;
		const left = visibleLeftPanelRight + filterGap;
		menu.style.setProperty("left", `${left}px`, "important");
		menu.style.setProperty("width", "auto", "important");
		menu.style.setProperty("max-width", "none", "important");
		const track = menu.querySelector(".map-filter-scroll-track");
		const shell = menu.querySelector(".map-filter-scroll-shell");
		if (track && shell && !shell.classList.contains("has-left-scroll") && track.scrollLeft > 0) {
			track.scrollLeft = 0;
		}
	}

	function scheduleTopbarFilterSafeLeft() {
		if (filterSafeLeftRaf) cancelAnimationFrame(filterSafeLeftRaf);
		filterSafeLeftRaf = requestAnimationFrame(applyTopbarFilterSafeLeft);
		setTimeout(applyTopbarFilterSafeLeft, 80);
		setTimeout(applyTopbarFilterSafeLeft, 260);
	}

	window.realjejuSyncTopbarFilterSafeLeft = scheduleTopbarFilterSafeLeft;
	window.addEventListener("resize", scheduleTopbarFilterSafeLeft, { passive: true });
	document.addEventListener("DOMContentLoaded", scheduleTopbarFilterSafeLeft);
	if (document.body) {
		new MutationObserver(scheduleTopbarFilterSafeLeft).observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
	}
	scheduleTopbarFilterSafeLeft();
})();

/* [ARCHIVE] PATCH 3.928: 상단 페이지 탭 시작점을 페이지 타이틀 레이블 기준으로 통일한다. */
(function () {
	const TOPBAR_TITLE_TAB_GAP = 45;
	let syncRaf = 0;

	function isVisibleNode(node)
	{
		if (!node) return false;
		const style = window.getComputedStyle(node);
		if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0) return false;
		const rect = node.getBoundingClientRect();
		return rect.width >= 1 && rect.height >= 1;
	}

	function getTopbarTitleAnchor()
	{
		const body = document.body;
		if (!body) return null;
		if (body.classList.contains("admin-page-open")) {
			return document.querySelector(".global-topbar-page-title-admin");
		}
		if (body.classList.contains("operator-page-open")) {
			return document.querySelector(".global-topbar-page-title-operator");
		}
		if (body.classList.contains("my-suite-page-open")) {
			return document.querySelector(".global-topbar-my-suite-arrow") || document.querySelector(".global-topbar-my-suite-link");
		}
		return null;
	}

	function getTopbarTabNavByMode()
	{
		const body = document.body;
		if (!body) return null;
		if (body.classList.contains("admin-page-open")) {
			return document.querySelector(".global-topbar-admin-tabs");
		}
		if (body.classList.contains("operator-page-open")) {
			return document.querySelector(".global-topbar-operator-tabs");
		}
		if (body.classList.contains("my-suite-page-open")) {
			return document.querySelector(".global-topbar-my-suite-tabs");
		}
		return null;
	}

	function syncTopbarPageTabsOffset()
	{
		syncRaf = 0;
		const body = document.body;
		if (!body || !body.classList.contains("realjeju-side-nav-enabled")) return;

		const topbar = document.querySelector(".global-topbar");
		const anchor = getTopbarTitleAnchor();
		const tabs = getTopbarTabNavByMode();
		if (!topbar || !tabs || !isVisibleNode(anchor)) return;

		const topbarRect = topbar.getBoundingClientRect();
		const anchorRect = anchor.getBoundingClientRect();
		const startLeft = Math.round((anchorRect.right - topbarRect.left) + TOPBAR_TITLE_TAB_GAP);
		if (Number.isFinite(startLeft)) {
			tabs.style.setProperty("left", `${startLeft}px`, "important");
			tabs.style.setProperty("right", "150px", "important");
			tabs.style.setProperty("transform", "translateY(-50%)", "important");
		}
	}

	function scheduleTopbarPageTabsOffset()
	{
		if (syncRaf) cancelAnimationFrame(syncRaf);
		syncRaf = requestAnimationFrame(() => {
			syncRaf = 0;
			syncTopbarPageTabsOffset();
		});
	}

	window.realjejuSyncTopbarPageTabsOffset = syncTopbarPageTabsOffset;
	window.addEventListener("resize", scheduleTopbarPageTabsOffset, { passive: true });
	document.addEventListener("DOMContentLoaded", () => {
		scheduleTopbarPageTabsOffset();
	});
	if (document.body) {
		new MutationObserver(scheduleTopbarPageTabsOffset).observe(document.body, { attributes: true, attributeFilter: ["class"] });
	}

	scheduleTopbarPageTabsOffset();
	setTimeout(() => scheduleTopbarPageTabsOffset(), 120);
	setTimeout(() => scheduleTopbarPageTabsOffset(), 320);
})();

/* PATCH 4.861: account pages use the My Info footer as the common footer source. */
(function syncAccountPageCommonFooters()
{
	function replaceFooters()
	{
		const source = document.querySelector("#myInfoPagePanel > footer.myinfo-company-info-full, #myInfoPagePanel > footer.account-page-common-footer, #mainLandingPage .main-landing-footer");
		if (!source) return;
		["myInfoPagePanel", "profileEditPagePanel", "brokerOfficeInfoPagePanel", "brokerOfficeApplyPagePanel", "brokerOfficeEditPagePanel", "paymentPagePanel", "mySuitePanel"].forEach((panelId) => {
			const panel = document.getElementById(panelId);
			const currentFooter = panel ? panel.querySelector(":scope > footer, :scope > .payment-page-inner > footer, :scope > .my-suite-inner > footer") : null;
			if (panelId === "myInfoPagePanel" && currentFooter) {
				currentFooter.classList.add("account-page-common-footer");
				return;
			}
			if (!currentFooter
				|| currentFooter.classList.contains("account-page-common-footer")
				|| currentFooter.classList.contains("realjeju-management-mini-footer")) return;
			const commonFooter = source.cloneNode(true);
			commonFooter.classList.add("account-page-common-footer");
			commonFooter.querySelector(".main-landing-footer-line")?.remove();
			currentFooter.replaceWith(commonFooter);
			if (commonFooter.parentElement !== panel) panel.appendChild(commonFooter);
		});
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", replaceFooters);
	else replaceFooters();
})();

/* 5.114: login, signup terms/form, and forgot-password share the My Page footer. */
(function syncAuthAccountCommonFooter()
{
	const authScreenIds = [
		"authLoginScreen",
		"authSignupTermsScreen",
		"authSignupFormScreen",
		"authForgotPasswordScreen"
	];
	let lastVisibleScreenId = "";

	function ensureFooter()
	{
		const authModal = document.getElementById("authModal");
		if (!authModal) return null;
		const existing = authModal.querySelector(":scope > .auth-account-common-footer");
		if (existing) return existing;
		const source = document.querySelector("#myInfoPagePanel > footer.account-page-common-footer");
		if (!source) return null;
		const footer = source.cloneNode(true);
		footer.classList.add("auth-account-common-footer", "account-page-common-footer");
		footer.querySelector(".main-landing-footer-line")?.remove();
		footer.hidden = true;
		authModal.appendChild(footer);
		return footer;
	}

	function getVisibleScreenId()
	{
		return authScreenIds.find((id) => {
			const screen = document.getElementById(id);
			return !!(screen && !screen.classList.contains("auth-screen-hidden"));
		}) || "";
	}

	function update()
	{
		const authModal = document.getElementById("authModal");
		const footer = ensureFooter();
		if (!authModal || !footer) return;
		const visibleScreenId = getVisibleScreenId();
		const shouldShow = !!(
			visibleScreenId
			&& authModal.classList.contains("open")
			&& !authModal.classList.contains("profile-page-mode")
			&& document.body.classList.contains("auth-page-open")
		);
		footer.hidden = !shouldShow;
		footer.classList.toggle("is-visible", shouldShow);
		authModal.classList.toggle("auth-account-footer-visible", shouldShow);
		if (shouldShow && visibleScreenId !== lastVisibleScreenId) {
			authModal.scrollTop = 0;
		}
		lastVisibleScreenId = shouldShow ? visibleScreenId : "";
	}

	function bind()
	{
		ensureFooter();
		authScreenIds.forEach((id) => {
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
		if (document.body) {
			new MutationObserver(update).observe(document.body, {
				attributes: true,
				attributeFilter: ["class"]
			});
		}
		update();
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
	else bind();
})();

/* Clean URL route controller: one owner for history, refresh restoration, and page lifecycle. */
(function bindRealjejuRouteController()
{
	const CATEGORY_PATHS = {
		realestate: "/properties",
      parcel: "/parcels",
      "ev-charger": "/ev-chargers",
		"local-business": "/companies",
		"part-time": "/jobs",
		"used-market": "/used",
		car: "/cars",
		meetup: "/meetups"
	};
	const PROPERTY_PAGE_PATHS = {
		favorites: "/properties/favorites",
		presales: "/properties/presales",
		broker: "/properties/broker",
		register: "/properties/register"
	};
	const PROPERTY_PAGES_BY_PATH = Object.fromEntries(
		Object.entries(PROPERTY_PAGE_PATHS).map(([key, path]) => [path, key])
	);
	const ADMIN_PATHS = {
		notices: "/admin/notices",
		inquiries: "/admin/inquiries",
		coupons: "/admin/coupons",
		operations: "/admin/operations",
		users: "/admin/users",
		"broker-applications": "/admin/broker-applications",
		listings: "/admin/properties"
	};
	const ADMIN_TABS_BY_PATH = Object.fromEntries(
		Object.entries(ADMIN_PATHS).map(([key, path]) => [path, key])
	);
	const ROUTE_CATEGORIES_BY_PATH = Object.fromEntries(
		Object.entries(CATEGORY_PATHS).map(([key, path]) => [path, key])
	);
	const PROTECTED_ROUTE_TYPES = new Set([
		"favorites", "broker", "register", "mypage", "admin"
	]);
	const PROPERTY_ROUTE_TYPES = new Set([
		"property-detail", "favorites", "presales", "broker", "register"
	]);
	const MAP_DATA_ROUTE_TYPES = new Set(["property-detail", "presales"]);
	let routeApplyQueue = Promise.resolve(false);
	let latestRouteRequest = 0;
	let applyingRoute = false;
	let initialRouteGuardReleaseFrame = 0;
	let authRefreshTimer = 0;
	let pendingAuthRefresh = false;
	let appReady = window.realjejuAppShellReady === true;
	let mapDataReady = window.realjejuMapDataReady === true;
	let bound = false;
	let routeApplyStarted = false;
	let landingRestoreFrame = 0;

	function isCurrentRouteRequest(requestId)
	{
		return requestId === latestRouteRequest;
	}

	function supersededRouteResult()
	{
		return { handled: false, deferGuardRelease: true, superseded: true };
	}

	function normalizeRoutePath(pathname)
	{
		const source = String(pathname || "/").replace(/\/{2,}/g, "/");
		if (source === "/") return "/";
		const normalized = source.replace(/\/+$/, "") || "/";
		const routePath = normalized.replace(
			/^\/menu_routes(?=\/(?:properties|parcels|companies|ev-chargers|jobs|used|cars|meetups|notices|mypage|admin)(?:\/|$))/i,
			""
		);
		return routePath.replace(
			/^\/((?:properties|parcels|companies|ev-chargers|jobs|used|cars|meetups|notices|mypage|admin)(?:\/[^/]+)*)\/index\.html$/i,
			"/$1"
		);
	}

	function canWriteCleanRoute()
	{
		return /^(?:https?):$/.test(String(window.location.protocol || ""));
	}

	function releaseInitialRouteGuard()
	{
		if (typeof window.realjejuReleaseInitialRouteGuard !== "function") return;
		const releaseRequestId = latestRouteRequest;
		if (initialRouteGuardReleaseFrame) {
			window.cancelAnimationFrame(initialRouteGuardReleaseFrame);
		}
		initialRouteGuardReleaseFrame = window.requestAnimationFrame(() => {
			initialRouteGuardReleaseFrame = window.requestAnimationFrame(() => {
				initialRouteGuardReleaseFrame = 0;
				if (releaseRequestId !== latestRouteRequest || applyingRoute) return;
				const release = window.realjejuReleaseInitialRouteGuard;
				if (typeof release !== "function") return;
				window.realjejuReleaseInitialRouteGuard = null;
				release();
			});
		});
	}

	function syncRouteScrollbarVisibility(route)
	{
		const shouldHide = !!route && (
			(route.type === "category" && route.category === "part-time")
			|| route.type === "mypage"
		);
		document.documentElement.classList.toggle("realjeju-hide-page-scrollbar", shouldHide);
	}

	function getRouteFromLocation()
	{
		const pathname = normalizeRoutePath(window.location.pathname);
		const lowerPath = pathname.toLowerCase();
		const routeParams = new URLSearchParams(window.location.search || "");
		const detailId = typeof getDetailIdFromLocation === "function"
			? getDetailIdFromLocation()
			: "";
		if (detailId) {
			return {
				type: "property-detail",
				path: `/properties?${DETAIL_QUERY_KEY}=${encodeURIComponent(detailId)}`,
				detailId,
				key: `property-detail:${detailId}`
			};
		}
		const isLandingDocumentPath = lowerPath === "/"
			|| lowerPath === "/index.html"
			|| /^\/realjeju_\d+\.\d+\.html$/i.test(lowerPath);
		if (isLandingDocumentPath && routeParams.get("landing") === "1") {
			return { type: "landing", path: "/", key: "landing" };
		}
		if (isLandingDocumentPath) {
			return {
				type: "category",
				path: "/properties",
				category: "realestate",
				key: "category:realestate",
				canonicalize: true
			};
		}
		const category = ROUTE_CATEGORIES_BY_PATH[lowerPath];
		if (category) {
			const route = { type: "category", path: CATEGORY_PATHS[category], category, key: `category:${category}` };
			if (category === "realestate") {
				const params = new URLSearchParams(window.location.search || "");
				const agencyPublicId = String(params.get("agency") || "").trim().toLowerCase();
				if (agencyPublicId) {
					route.agencyPublicId = agencyPublicId;
					route.key = `category:realestate:agency:${agencyPublicId}`;
				}
			}
			return route;
		}
		const propertyPage = PROPERTY_PAGES_BY_PATH[lowerPath];
		if (propertyPage) {
			const route = {
				type: propertyPage,
				path: PROPERTY_PAGE_PATHS[propertyPage],
				key: `property:${propertyPage}`
			};
			if (propertyPage === "register") {
				const params = new URLSearchParams(window.location.search || "");
				const editId = String(params.get("brokerEdit") || "").trim();
				const returnTo = String(params.get("returnTo") || "broker-home").trim();
				route.editId = editId;
				route.returnTo = ["map-home", "admin-listings", "my-suite-favorites", "broker-home"].includes(returnTo)
					? returnTo
					: "broker-home";
				route.key = editId ? `property:register:${editId}:${route.returnTo}` : route.key;
			}
			return route;
		}
		if (lowerPath === "/notices") {
			return { type: "notices", path: "/notices", key: "notices" };
		}
		const mypageMatch = lowerPath.match(/^\/mypage\/(profile|office|payments|inquiries)$/);
		if (mypageMatch) {
			return {
				type: "mypage",
				page: mypageMatch[1],
				path: `/mypage/${mypageMatch[1]}`,
				key: `mypage:${mypageMatch[1]}`
			};
		}
		if (lowerPath === "/mypage") {
			return { type: "mypage", page: "profile", path: "/mypage/profile", key: "mypage:profile", canonicalize: true };
		}
		const adminTab = lowerPath === "/admin" ? "notices" : ADMIN_TABS_BY_PATH[lowerPath];
		if (adminTab) {
			return {
				type: "admin",
				tab: adminTab,
				path: ADMIN_PATHS[adminTab] || "/admin",
				key: `admin:${adminTab}`
			};
		}
		return { type: "unknown", path: pathname, key: `unknown:${lowerPath}` };
	}

	function shouldUseStandalonePageTransitionCover(route)
	{
		if (!route) return false;
		if (route.type === "mypage" || route.type === "admin") return true;
		return route.type === "favorites" || route.type === "broker" || route.type === "register";
	}

	function closeLandingForRoute()
	{
		document.body?.classList?.remove("main-landing-page-open");
		const landing = document.getElementById("mainLandingPage");
		if (landing) {
			if (typeof window.realjejuReleaseFocusBeforeAriaHidden === "function") {
				window.realjejuReleaseFocusBeforeAriaHidden(landing, document.body);
			}
			landing.setAttribute("inert", "");
			landing.setAttribute("aria-hidden", "true");
		}
	}

	function waitForInitialPropertyMapPaint(requestId)
	{
		if (!document.documentElement.classList.contains("realjeju-route-booting")) return Promise.resolve();
		const resolveAfterPaint = () => new Promise((resolve) => {
			window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
		});
		let map = null;
		try {
			map = typeof state !== "undefined" && state ? state.map : null;
		} catch (error) {}
		if (!map || !window.kakao || !kakao.maps || !kakao.maps.event) {
			return resolveAfterPaint();
		}
		if (state.initialMapTilesLoaded) return resolveAfterPaint();
		return new Promise((resolve) => {
			let finished = false;
			let timeoutId = 0;
			const finish = () => {
				if (finished) return;
				finished = true;
				if (timeoutId) window.clearTimeout(timeoutId);
				try {
					kakao.maps.event.removeListener(map, "tilesloaded", finish);
				} catch (error) {}
				window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
			};
			try {
				kakao.maps.event.addListener(map, "tilesloaded", finish);
				map.relayout();
			} catch (error) {
				finish();
				return;
			}
			timeoutId = window.setTimeout(finish, 1200);
			if (!isCurrentRouteRequest(requestId)) finish();
		});
	}

	async function openCategoryRoute(category, requestId)
	{
		const key = CATEGORY_PATHS[category] ? category : "realestate";
		if (!isCurrentRouteRequest(requestId)) return false;
		closeLandingForRoute();
		if (key === "realestate"
			&& typeof loadProperties === "function"
			&& typeof state !== "undefined"
			&& state
			&& !mapListingsInitialDataApplied) {
			await loadProperties();
			if (!isCurrentRouteRequest(requestId)) return false;
		}
		if (key === "part-time") {
			if (typeof setGlobalCategoryButtonState === "function") setGlobalCategoryButtonState(key);
			const pagePromise = typeof window.openRealjejuPartTimePage === "function"
				? Promise.resolve(window.openRealjejuPartTimePage())
				: Promise.resolve(false);
			try {
				if (typeof syncGlobalCategoryActive === "function") {
					await Promise.resolve(syncGlobalCategoryActive(key));
				}
			} catch (error) {
				console.warn("알바 경로 초기화 중 지도 상태 정리 실패:", error);
			}
			await pagePromise;
			return isCurrentRouteRequest(requestId);
		}
		if (typeof window.realjejuGoHome === "function") {
			await Promise.resolve(window.realjejuGoHome({ resetDetail: true, category: key }));
		} else if (typeof syncGlobalCategoryActive === "function") {
			await Promise.resolve(syncGlobalCategoryActive(key));
		}
		if (key === "realestate") await waitForInitialPropertyMapPaint(requestId);
		return isCurrentRouteRequest(requestId);
	}

	async function waitForRouteAccountBootstrap(requestId)
	{
		if (!isCurrentRouteRequest(requestId)) return null;
		const client = typeof getRealjejuSupabaseClient === "function" ? getRealjejuSupabaseClient() : null;
		if (!client || !client.auth || typeof client.auth.getSession !== "function") return null;
		let sessionUser = null;
		try {
			const { data } = await client.auth.getSession();
			sessionUser = data && data.session ? data.session.user || null : null;
		} catch (error) {
			return null;
		}
		if (!sessionUser || !sessionUser.id) return null;
		const deadline = Date.now() + 3000;
		while (Date.now() < deadline) {
			if (!isCurrentRouteRequest(requestId)) return null;
			const activeUser = window.realjejuCurrentAuthUser || null;
			if (activeUser && String(activeUser.id || "") === String(sessionUser.id) && window.realjejuCurrentProfile) break;
			await new Promise((resolve) => setTimeout(resolve, 80));
		}
		return isCurrentRouteRequest(requestId) ? sessionUser : null;
	}

	async function openPropertyDetailShell(requestId)
	{
		if (!isCurrentRouteRequest(requestId)) return false;
		closeLandingForRoute();
		if (typeof window.realjejuGoHome === "function") {
			await Promise.resolve(window.realjejuGoHome({ resetDetail: false, category: "realestate" }));
		} else if (typeof syncGlobalCategoryActive === "function") {
			await Promise.resolve(syncGlobalCategoryActive("realestate"));
		}
		return isCurrentRouteRequest(requestId);
	}

	function getCurrentDetailId()
	{
		try {
			return typeof currentDetailItem !== "undefined" && currentDetailItem
				? normalizeItemId(currentDetailItem.id)
				: "";
		} catch (error) {
			return "";
		}
	}

	function isCurrentDetailOpen(detailId)
	{
		if (!detailId || getCurrentDetailId() !== detailId) return false;
		return document.body?.classList?.contains("detail-page-panel-open")
			|| document.body?.classList?.contains("shared-detail-mode")
			|| document.body?.classList?.contains("list-shared-detail-mode")
			|| document.body?.classList?.contains("direct-detail-list-mode");
	}

	function closeGlobalRouteMenus()
	{
		if (typeof window.realjejuCloseGlobalTopbarTransientUi === "function") {
			window.realjejuCloseGlobalTopbarTransientUi();
			return;
		}
		try {
			if (typeof closeGlobalAccountDropdown === "function") closeGlobalAccountDropdown();
		} catch (error) {}
		try {
			if (typeof closeGlobalTopbarMoreMenu === "function") closeGlobalTopbarMoreMenu();
		} catch (error) {}
	}

	function shouldDeferRouteUntilAppReady(route)
	{
		if (!route || route.type === "landing" || route.type === "unknown") return false;
		if (!appReady) return true;
		if (mapDataReady) return false;
		if (MAP_DATA_ROUTE_TYPES.has(route.type)) return true;
		return route.type === "category" && (route.category === "realestate" || route.category === "local-business");
	}

	function primeDeferredRoute(route)
	{
		closeLandingForRoute();
		if (typeof setGlobalCategoryButtonState !== "function") return;
		if (route.type === "category") {
			setGlobalCategoryButtonState(route.category);
			if (route.category !== "part-time") {
				if (typeof applyGlobalCategoryEmptyMapMode === "function") {
					applyGlobalCategoryEmptyMapMode(route.category);
				}
				if (typeof applyGlobalCategorySideNavMode === "function") {
					applyGlobalCategorySideNavMode(route.category);
				}
				if (typeof renderGlobalCategoryTopFilters === "function") {
					renderGlobalCategoryTopFilters(route.category);
				}
			}
			return;
		}
		setGlobalCategoryButtonState(PROPERTY_ROUTE_TYPES.has(route.type) ? "realestate" : "");
	}

	async function applyRoute(route, requestId)
	{
		if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
		const activeElement = document.activeElement;
		if (activeElement
			&& activeElement !== document.body
			&& typeof activeElement.blur === "function") {
			activeElement.blur();
		}
		closeGlobalRouteMenus();
		if (route.canonicalize) writeRoute(route.path, { replace: true, preserveSearch: false });
		if (shouldDeferRouteUntilAppReady(route)) {
			primeDeferredRoute(route);
			return { handled: true, deferGuardRelease: true };
		}
		if (route.type === "property-detail") {
			await openPropertyDetailShell(requestId);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			if (!isCurrentDetailOpen(route.detailId) && typeof openDetailFromUrl === "function") {
				await openDetailFromUrl({ replaceHistory: false });
			}
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true, deferGuardRelease: false };
		}
		if (route.type === "landing") {
			if (typeof window.realjejuOpenMainLandingPage === "function") {
				await Promise.resolve(window.realjejuOpenMainLandingPage());
			} else if (document.body) {
				document.body.classList.add("main-landing-page-open", "sidebar-list-collapsed");
				const landingPage = document.getElementById("mainLandingPage");
				if (landingPage) {
					landingPage.hidden = false;
					landingPage.inert = false;
					landingPage.setAttribute("aria-hidden", "false");
				}
			}
			return { handled: true };
		}
		if (route.type === "category") {
			await openCategoryRoute(route.category, requestId);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			if (route.category === "realestate"
				&& route.agencyPublicId
				&& typeof window.realjejuOpenSidebarAgentListFromDeepLink === "function") {
				await Promise.resolve(window.realjejuOpenSidebarAgentListFromDeepLink(0, route.agencyPublicId));
				if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			}
			return { handled: true };
		}
		if (route.type === "favorites" || route.type === "broker" || route.type === "register") {
			closeLandingForRoute();
			await waitForRouteAccountBootstrap(requestId);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			if (route.type === "favorites") {
				if (typeof window.openMySuitePage === "function") await Promise.resolve(window.openMySuitePage("favorites"));
			} else if (route.type === "broker") {
				const selectedListingId = String(window.realjejuPendingBrokerHomeListingId || "").trim();
				delete window.realjejuPendingBrokerHomeListingId;
				if (typeof window.openBrokerHomePage === "function") await window.openBrokerHomePage(selectedListingId || undefined);
			} else if (route.editId && typeof window.realjejuOpenBrokerListingEdit === "function") {
				await window.realjejuOpenBrokerListingEdit(route.editId, {
					returnTo: route.returnTo,
					fromRoute: true
				});
			} else {
				if (typeof window.openPropertyRegisterPage === "function") {
					await window.openPropertyRegisterPage({ confirmExistingDraft: false });
				}
			}
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true };
		}
		if (route.type === "presales") {
			closeLandingForRoute();
			if (typeof window.realjejuGoHome === "function") {
				await Promise.resolve(window.realjejuGoHome({ resetDetail: true, category: "realestate", presale: true }));
			}
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true };
		}
		if (route.type === "notices") {
			closeLandingForRoute();
			if (typeof window.openNoticePage === "function") await Promise.resolve(window.openNoticePage());
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true };
		}
		if (route.type === "mypage") {
			closeLandingForRoute();
			await waitForRouteAccountBootstrap(requestId);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			if (route.page === "profile" && typeof window.realjejuOpenDedicatedMyInfo === "function") {
				await window.realjejuOpenDedicatedMyInfo();
			} else if (route.page === "office" && typeof window.realjejuOpenBrokerOfficeInfoFromAccountMenu === "function") {
				await Promise.resolve(window.realjejuOpenBrokerOfficeInfoFromAccountMenu());
			} else if (route.page === "payments" && typeof window.openPaymentPageFromAccountMenu === "function") {
				await Promise.resolve(window.openPaymentPageFromAccountMenu());
			} else if (route.page === "inquiries" && typeof window.openMySuitePage === "function") {
				await Promise.resolve(window.openMySuitePage("inquiries"));
			}
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true };
		}
		if (route.type === "admin") {
			closeLandingForRoute();
			await waitForRouteAccountBootstrap(requestId);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			if (typeof window.openAdminPage === "function") await window.openAdminPage(route.tab);
			if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
			return { handled: true };
		}
		writeRoute("/properties", { replace: true, preserveSearch: false });
		closeLandingForRoute();
		if (typeof window.realjejuGoHome === "function") {
			await Promise.resolve(window.realjejuGoHome({ resetDetail: true, category: "realestate" }));
		}
		if (!isCurrentRouteRequest(requestId)) return supersededRouteResult();
		return { handled: true };
	}

	function writeRoute(path, { replace = false, preserveSearch = true } = {})
	{
		if (!canWriteCleanRoute() || !path) return;
		const current = new URL(window.location.href);
		const url = new URL(String(path), current.origin);
		const normalizedPath = normalizeRoutePath(url.pathname);
		url.pathname = normalizedPath;
		if (!url.search && preserveSearch && normalizedPath === normalizeRoutePath(current.pathname)) {
			url.search = current.search;
		}
		if (typeof DETAIL_QUERY_KEY !== "undefined") {
			const keepsPropertyDetailQuery = normalizedPath === "/properties" && url.searchParams.has(DETAIL_QUERY_KEY);
			if (!keepsPropertyDetailQuery) url.searchParams.delete(DETAIL_QUERY_KEY);
		}
		url.hash = "";
		const nextUrl = `${url.pathname}${url.search}${url.hash}`;
		const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
		if (nextUrl === currentUrl) return;
		window.history[replace ? "replaceState" : "pushState"]({}, "", nextUrl);
		if (typeof applyAppVersion === "function") applyAppVersion(normalizedPath);
	}

	async function performRouteApply(requestId, reason)
	{
		if (requestId !== latestRouteRequest) return false;
		applyingRoute = true;
		window.realjejuRouteApplying = true;
		let deferGuardRelease = false;
		let usedStandaloneTransitionCover = false;
		try {
			const route = getRouteFromLocation();
			if (typeof applyAppVersion === "function") applyAppVersion(route.path);
			if (shouldUseStandalonePageTransitionCover(route)
				&& typeof window.realjejuShowStandalonePageTransitionCover === "function") {
				window.realjejuShowStandalonePageTransitionCover();
				usedStandaloneTransitionCover = true;
			}
			syncRouteScrollbarVisibility(route);
			if (document.body) {
				document.body.dataset.realjejuRoute = route.path;
				document.body.dataset.realjejuRouteType = route.type;
				document.body.classList.toggle(
					"realjeju-property-home-route",
					route.type === "property-detail"
						|| (route.type === "category" && route.category === "realestate")
				);
			}
			const result = await applyRoute(route, requestId);
			deferGuardRelease = !!(result && result.deferGuardRelease);
			if (!isCurrentRouteRequest(requestId)) {
				deferGuardRelease = true;
				return false;
			}
			return !!(result && result.handled);
		} finally {
			if (!deferGuardRelease) releaseInitialRouteGuard();
			if (usedStandaloneTransitionCover && typeof window.realjejuReleaseStandalonePageTransitionCover === "function") {
				window.realjejuReleaseStandalonePageTransitionCover();
			}
			applyingRoute = false;
			window.realjejuRouteApplying = false;
			if (pendingAuthRefresh) {
				pendingAuthRefresh = false;
				onAuthChange("pending");
			}
		}
	}

	function applyCurrentLocation({ reason = "external" } = {})
	{
		routeApplyStarted = true;
		const requestId = ++latestRouteRequest;
		routeApplyQueue = routeApplyQueue
			.catch(() => false)
			.then(() => performRouteApply(requestId, reason));
		return routeApplyQueue;
	}

	function navigate(path, { replace = false } = {})
	{
		writeRoute(path, { replace, preserveSearch: false });
		return applyCurrentLocation({ reason: replace ? "replace" : "navigate" });
	}

	function onAuthChange(event = "")
	{
		const route = getRouteFromLocation();
		if (!PROTECTED_ROUTE_TYPES.has(route.type)) return false;
		if (applyingRoute) {
			pendingAuthRefresh = true;
			return true;
		}
		window.clearTimeout(authRefreshTimer);
		authRefreshTimer = window.setTimeout(() => {
			applyCurrentLocation({ reason: `auth:${event || "change"}` });
		}, 100);
		return true;
	}

	async function onMapDataReady()
	{
		mapDataReady = true;
		if (!appReady) return true;
		const route = getRouteFromLocation();
		if (route.type === "landing"
			|| MAP_DATA_ROUTE_TYPES.has(route.type)
			|| (route.type === "category" && route.category !== "part-time")) {
			return applyCurrentLocation({ reason: "map-data-ready" });
		}
		if (route.type === "category"
			&& route.category === "part-time"
			&& !document.body?.classList?.contains("part-time-page-open")) {
			return applyCurrentLocation({ reason: "jobs-route-restore" });
		}
		releaseInitialRouteGuard();
		return true;
	}

	async function onAppReady()
	{
		appReady = true;
		return applyCurrentLocation({ reason: "app-ready" });
	}

	function scheduleLandingStateRestore()
	{
		if (landingRestoreFrame || !document.body) return;
		landingRestoreFrame = window.requestAnimationFrame(() => {
			landingRestoreFrame = 0;
			if (!document.body || document.body.classList.contains("main-landing-page-open")) return;
			if (getRouteFromLocation().type !== "landing") return;
			if (applyingRoute) {
				scheduleLandingStateRestore();
				return;
			}
			applyCurrentLocation({ reason: "landing-state-restore" });
		});
	}

	async function bind()
	{
		if (bound) return;
		bound = true;
		window.addEventListener("popstate", () => {
			applyCurrentLocation({ reason: "popstate" });
		});
		if (document.body) {
			new MutationObserver(scheduleLandingStateRestore).observe(document.body, {
				attributes: true,
				attributeFilter: ["class"]
			});
		}
		if (!routeApplyStarted) await applyCurrentLocation({ reason: "initial" });
	}

	window.realjejuRouter = {
		apply: applyCurrentLocation,
		navigate,
		onAuthChange,
		onAppReady,
		onMapDataReady,
		getRoute: getRouteFromLocation
	};
	window.realjejuApplyCurrentRoute = applyCurrentLocation;
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
	else bind();
})();
// PATCH 5.111: 중개사 홈ㆍ관심 부동산ㆍ관리자 매물관리의 선택 표시와 목록 밖 클릭 해제를 공통 처리한다.
(function bindManagedListingSelectionState()
{
	const boundKey = "realjejuManagedListingSelectionBound";
	if (document.documentElement.dataset[boundKey] === "true") return;
	document.documentElement.dataset[boundKey] = "true";

	const selectedRowSelector = [
		"#brokerListingsList .broker-listing-row.is-broker-detail-selected",
		".my-suite-favorite-row.is-broker-detail-selected",
		".admin-listing-row.is-broker-detail-selected"
	].join(", ");

	const clearManagedListingSelection = () => {
		document.querySelectorAll(selectedRowSelector).forEach((row) => {
			row.classList.remove("is-broker-detail-selected");
			row.removeAttribute("aria-selected");
		});
	};
	window.realjejuClearManagedListingSelection = clearManagedListingSelection;

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		let listingRow = null;
		let listingRowControlSelector = "";
		let setPersistentSelection = null;
		let clearPersistentSelection = null;

		if (document.body.classList.contains("broker-home-page-open")) {
			listingRow = target.closest("#brokerListingsList .broker-listing-row");
			listingRowControlSelector = "button, .broker-listing-more-menu";
			setPersistentSelection = window.realjejuSetBrokerHomeSelectedId;
			clearPersistentSelection = window.realjejuClearBrokerHomeSelectedId;
		} else if (document.body.classList.contains("my-suite-page-open")
			&& document.body.classList.contains("my-suite-favorites-tab-open")) {
			listingRow = target.closest(".my-suite-favorite-row[data-favorite-listing-id]");
			listingRowControlSelector = "button";
			setPersistentSelection = window.realjejuSetMySuiteFavoriteSelectedId;
			clearPersistentSelection = window.realjejuClearMySuiteFavoriteSelectedId;
		} else if (document.body.classList.contains("admin-page-open")
			&& document.body.classList.contains("admin-listings-tab-open")) {
			listingRow = target.closest(".admin-listing-row[data-admin-listing-id]");
			listingRowControlSelector = "button, .broker-listing-more-menu";
			setPersistentSelection = window.realjejuSetAdminListingSelectedId;
			clearPersistentSelection = window.realjejuClearAdminListingSelectedId;
		}

		if (listingRow) {
			if (listingRowControlSelector && target.closest(listingRowControlSelector)) return;
			clearManagedListingSelection();
			listingRow.classList.add("is-broker-detail-selected");
			listingRow.setAttribute("aria-selected", "true");
			const listingId = listingRow.dataset.listingId
				|| listingRow.dataset.favoriteListingId
				|| listingRow.dataset.adminListingId
				|| "";
			if (typeof setPersistentSelection === "function") setPersistentSelection(listingId);
			return;
		}
		if (!clearPersistentSelection || target.closest("#sidebarDetailPanel")) return;
		clearManagedListingSelection();
		clearPersistentSelection();
	}, true);
})();
// PATCH 5.081: 요금제와 분리한 추가상품 카드의 수량 선택을 공통 처리한다.
(function bindPaymentAddonShop()
{
	if (document.documentElement.dataset.paymentAddonShopBound === "true") return;
	document.documentElement.dataset.paymentAddonShopBound = "true";

	const formatWon = (value) => `${Math.max(0, Number(value) || 0).toLocaleString("ko-KR")}원`;
	const selectOption = (option) => {
		const card = option?.closest("[data-addon-purchase-card]");
		if (!card) return;
		card.querySelectorAll("[data-addon-purchase-option]").forEach((candidate) => {
			const selected = candidate === option;
			candidate.classList.toggle("is-selected", selected);
			candidate.setAttribute("aria-checked", selected ? "true" : "false");
		});
		const label = option.dataset.addonLabel || "";
		const price = Math.max(0, Number(option.dataset.addonPrice) || 0);
		const summary = card.querySelector("[data-addon-purchase-summary]");
		const buyButton = card.querySelector("[data-addon-purchase-button]");
		if (summary) summary.textContent = `${label} · ${formatWon(price)}`;
		if (buyButton) {
			buyButton.dataset.addonId = option.dataset.addonId || "";
			buyButton.dataset.addonLabel = label;
			buyButton.dataset.addonPrice = String(price);
		}
		card.dataset.selectedAddonId = option.dataset.addonId || "";
	};

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const option = target.closest("[data-addon-purchase-option]");
		if (!option) return;
		event.preventDefault();
		selectOption(option);
	});

	document.addEventListener("keydown", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const option = target.closest("[data-addon-purchase-option]");
		if (!option || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
		const options = Array.from(option.closest("[data-addon-purchase-card]")?.querySelectorAll("[data-addon-purchase-option]") || []);
		if (!options.length) return;
		event.preventDefault();
		const currentIndex = Math.max(0, options.indexOf(option));
		let nextIndex = currentIndex;
		if (event.key === "Home") nextIndex = 0;
		else if (event.key === "End") nextIndex = options.length - 1;
		else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length;
		else nextIndex = (currentIndex + 1) % options.length;
		selectOption(options[nextIndex]);
		options[nextIndex].focus();
	});
})();


// REALJEJU 5.995: 필지·실거래·건축물 상세 기능은 property-info 모듈로 분리했습니다.

// Let the route controller at the end of this bundle register before map boot can
// announce readiness. This keeps a refreshed deep route authoritative from the
// first application transition instead of briefly opening the default home.
if (typeof queueMicrotask === "function") queueMicrotask(startRealjejuApp);
else setTimeout(startRealjejuApp, 0);
