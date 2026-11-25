lucide.createIcons();
let selectedProfile = "";
let selectedGender = "";
let registerMethod = "email";
// REGISTRATION STEPS
const steps = [
    document.getElementById("register-step-1"),
    document.getElementById("register-step-2"),
    document.getElementById("register-step-3")
];
function showRegisterStep(stepNumber) {
    steps.forEach((step, index) => {
        const isActive = index === stepNumber - 1;
        step.classList.toggle("hidden", !isActive);
        step.classList.toggle("active", isActive);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    lucide.createIcons();
}
// PROFILE SELECTION
document.querySelectorAll(".profile-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".profile-option").forEach(option => {
            option.classList.remove("selected");
        });
        button.classList.add("selected");
        selectedProfile = button.dataset.profile;
        document.getElementById("profile-error").textContent = "";
        const knownGenderProfiles = {
            Brother: "Male",
            Son: "Male",
            Sister: "Female",
            Daughter: "Female"
        };
        if (knownGenderProfiles[selectedProfile]) {
            selectedGender = knownGenderProfiles[selectedProfile];
            showRegisterStep(3);
        } else {
            selectedGender = "";
            showRegisterStep(2);
        }
    });
});
// GENDER SELECTION
document.querySelectorAll(".gender-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".gender-option").forEach(option => {
            option.classList.remove("selected");
        });
        button.classList.add("selected");
        selectedGender = button.dataset.gender;
        document.getElementById("gender-error").textContent = "";
        showRegisterStep(3);
    });
});
// BACK BUTTONS
document.getElementById("step-2-back").addEventListener("click", () => {
    showRegisterStep(1);
});
document.getElementById("step-3-back").addEventListener("click", () => {
    if (selectedProfile === "Myself" || selectedProfile === "Relative") {
        showRegisterStep(2);
    } else {
        showRegisterStep(1);
    }
});
// DATE OF BIRTH - INPUT + CUSTOM CALENDAR
const dayInput = document.getElementById("dob-day");
const monthInput = document.getElementById("dob-month");
const yearInput = document.getElementById("dob-year");
const calendarInput = document.getElementById("dob-calendar-input");
const calendarButton = document.getElementById("dob-calendar-button");
const dobError = document.getElementById("dob-error");
const today = new Date();
const maxDOB = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
);
const minDOB = new Date(
    today.getFullYear() - 60,
    today.getMonth(),
    today.getDate()
);
maxDOB.setHours(0, 0, 0, 0);
minDOB.setHours(0, 0, 0, 0);
function fillDOBFields(date) {
    dayInput.value = String(date.getDate()).padStart(2, "0");
    monthInput.value = String(date.getMonth() + 1).padStart(2, "0");
    yearInput.value = date.getFullYear();
    dobError.textContent = "";
}
// CUSTOM SELECTORS
let dobBackdrop = null;
let monthPanel = null;
let yearPanel = null;
let monthButton = null;
let yearButton = null;
let monthList = null;
let yearList = null;
const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];
function isMonthAllowed(year, monthIndex) {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);
    return monthEnd >= minDOB && monthStart <= maxDOB;
}
function closePickerPanels() {
    monthPanel?.classList.remove("visible");
    yearPanel?.classList.remove("visible");
}
function updatePickerLabels(instance) {
    if (!monthButton || !yearButton) return;
    monthButton.textContent = monthNames[instance.currentMonth];
    yearButton.textContent = instance.currentYear;
    updateMonthOptions(instance);
}
function createPickerPanel(title) {
    const panel = document.createElement("div");
    panel.className = "mv-picker-panel";
    const heading = document.createElement("div");
    heading.className = "mv-picker-panel-heading";
    const headingText = document.createElement("span");
    headingText.textContent = title;
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mv-picker-close";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close selector");
    closeButton.addEventListener("click", () => {
        panel.classList.remove("visible");
    });
    heading.append(headingText, closeButton);
    panel.appendChild(heading);
    return panel;
}
function updateMonthOptions(instance) {
    if (!monthList) return;
    monthList.querySelectorAll(".mv-picker-option").forEach((option, index) => {
        const allowed = isMonthAllowed(instance.currentYear, index);
        option.disabled = !allowed;
        option.classList.toggle(
            "selected",
            index === instance.currentMonth
        );
    });
}
// FLATPICKR INIT
const dobPicker = flatpickr(calendarInput, {
    dateFormat: "Y-m-d",
    minDate: minDOB,
    maxDate: maxDOB,
    defaultDate: null,
    allowInput: false,
    disableMobile: true,
    clickOpens: false,
    monthSelectorType: "static",
    position: "below",
    onReady: function (selectedDates, dateString, instance) {
        const calendar = instance.calendarContainer;
        const originalMonthHeader =
            calendar.querySelector(".flatpickr-current-month");
        if (originalMonthHeader) {
            originalMonthHeader.style.display = "none";
        }
        // Custom toolbar
        const toolbar = document.createElement("div");
        toolbar.className = "mv-picker-toolbar";
        monthButton = document.createElement("button");
        monthButton.type = "button";
        monthButton.className = "mv-picker-select";
        yearButton = document.createElement("button");
        yearButton.type = "button";
        yearButton.className = "mv-picker-select";
        toolbar.append(monthButton, yearButton);
        // MONTH SELECTOR
        monthPanel = createPickerPanel("Select month");
        monthList = document.createElement("div");
        monthList.className = "mv-month-list";
        monthNames.forEach((month, index) => {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "mv-picker-option";
            option.textContent = month;
            option.addEventListener("click", () => {
                if (!isMonthAllowed(instance.currentYear, index)) {
                    return;
                }
                instance.changeMonth(
                    index - instance.currentMonth,
                    true
                );
                closePickerPanels();
                updatePickerLabels(instance);
            });
            monthList.appendChild(option);
        });
        monthPanel.appendChild(monthList);
        // YEAR SELECTOR
        yearPanel = createPickerPanel("Select year");
        yearList = document.createElement("div");
        yearList.className = "mv-year-list";
        for (
            let year = maxDOB.getFullYear();
            year >= minDOB.getFullYear();
            year--
        ) {
            const option = document.createElement("button");
            option.type = "button";
            option.className = "mv-picker-option";
            option.textContent = year;
            option.dataset.year = year;
            option.addEventListener("click", () => {
                instance.changeYear(year);
                closePickerPanels();
                updatePickerLabels(instance);
            });
            yearList.appendChild(option);
        }
        yearPanel.appendChild(yearList);
        // CUSTOM ELEMENTS
        const innerContainer =
            calendar.querySelector(".flatpickr-innerContainer");
        calendar.insertBefore(toolbar, innerContainer);
        calendar.insertBefore(monthPanel, innerContainer);
        calendar.insertBefore(yearPanel, innerContainer);
        monthButton.addEventListener("click", () => {
            const isOpen = monthPanel.classList.contains("visible");
            closePickerPanels();
            if (!isOpen) {
                monthPanel.classList.add("visible");
                updateMonthOptions(instance);
            }
        });
        // YEAR BUTTON CLICK
        yearButton.addEventListener("click", () => {
            const isOpen = yearPanel.classList.contains("visible");
            closePickerPanels();
            if (!isOpen) {
                yearPanel.classList.add("visible");
                const selectedYear = yearList.querySelector(
                    `[data-year="${instance.currentYear}"]`
                );
                if (selectedYear) {
                    selectedYear.scrollIntoView({
                        block: "center",
                        behavior: "auto"
                    });
                }
            }
        });
        updatePickerLabels(instance);
    },
    onMonthChange: function (selectedDates, dateString, instance) {
        updatePickerLabels(instance);
    },
    onYearChange: function (selectedDates, dateString, instance) {
        updatePickerLabels(instance);
    },
    // CALENDAR OPEN
    onOpen: function (selectedDates, dateString, instance) {
        closePickerPanels();
        if (!dobBackdrop) {
            dobBackdrop = document.createElement("div");
            dobBackdrop.className = "dob-calendar-backdrop";
            document.body.appendChild(dobBackdrop);
            dobBackdrop.addEventListener("click", () => {
                dobPicker.close();
            });
        }
        document.body.classList.add("dob-calendar-active");
        const day = Number(dayInput.value);
        const month = Number(monthInput.value);
        const year = Number(yearInput.value);
        const enteredDate = new Date(year, month - 1, day);
        const isValidExistingDate =
            dayInput.value &&
            monthInput.value &&
            yearInput.value.length === 4 &&
            enteredDate.getDate() === day &&
            enteredDate.getMonth() === month - 1 &&
            enteredDate.getFullYear() === year &&
            enteredDate >= minDOB &&
            enteredDate <= maxDOB;
        if (isValidExistingDate) {
            instance.setDate(enteredDate, false);
        } else {
            instance.clear(false);
            instance.jumpToDate(maxDOB, false);
        }
        updatePickerLabels(instance);
    },
    // DATE SELECTION
    onChange: function (selectedDates) {
        if (selectedDates.length > 0) {
            fillDOBFields(selectedDates[0]);
        }
    },
    // CALENDAR CLOSE
    onClose: function () {
        document.body.classList.remove("dob-calendar-active");
        closePickerPanels();
        if (dobBackdrop) {
            dobBackdrop.remove();
            dobBackdrop = null;
        }
    }
});
calendarButton.addEventListener("click", () => {
    dobPicker.open();
});
[dayInput, monthInput, yearInput].forEach(input => {
    input.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        const maxLength = this.id === "dob-year" ? 4 : 2;
        this.value = this.value.slice(0, maxLength);
        dobError.textContent = "";
    });
});
// DOB VALIDATION
function validateDateOfBirth() {
    const dayValue = dayInput.value.trim();
    const monthValue = monthInput.value.trim();
    const yearValue = yearInput.value.trim();
    if (!dayValue || !monthValue || !yearValue) {
        dobError.textContent =
            "Please enter your complete date of birth.";
        return false;
    }
    if (
        !/^\d{1,2}$/.test(dayValue) ||
        !/^\d{1,2}$/.test(monthValue) ||
        !/^\d{4}$/.test(yearValue)
    ) {
        dobError.textContent =
            "Please enter a valid date of birth.";
        return false;
    }
    const day = Number(dayValue);
    const month = Number(monthValue);
    const year = Number(yearValue);
    if (
        month < 1 || month > 12 ||
        day < 1 || day > 31 ||
        year < 1900
    ) {
        dobError.textContent =
            "Please enter a valid date.";
        return false;
    }
    const birthDate = new Date(year, month - 1, day);
    if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
    ) {
        dobError.textContent =
            "This date does not exist. Please check again.";
        return false;
    }
    if (birthDate < minDOB || birthDate > maxDOB) {
        dobError.textContent =
            "Age must be between 18 and 60 years.";
        return false;
    }
    dobError.textContent = "";
    return true;
}
//REGISTRATION TOGGLE
const registerEmailTab =
    document.getElementById("register-email-tab");
const registerPhoneTab =
    document.getElementById("register-phone-tab");
function switchRegisterMethod(method) {
    registerMethod = method;
    registerEmailTab.classList.toggle("active", method === "email");
    registerPhoneTab.classList.toggle("active", method === "phone");
    registerEmailTab.setAttribute(
        "aria-pressed",
        String(method === "email")
    );
    registerPhoneTab.setAttribute(
        "aria-pressed",
        String(method === "phone")
    );
    document.getElementById("register-email-group")
        .classList.toggle("hidden", method !== "email");
    document.getElementById("register-phone-group")
        .classList.toggle("hidden", method !== "phone");
    lucide.createIcons();
}
registerEmailTab.addEventListener("click", () => {
    switchRegisterMethod("email");
});
registerPhoneTab.addEventListener("click", () => {
    switchRegisterMethod("phone");
});
const registerPhone = document.getElementById("register-phone");
const registerPhoneError =
    document.getElementById("register-phone-error");
registerPhone.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    registerPhoneError.textContent = "";
});
// REGISTRATION FORM VALIDATION
document.getElementById("register-form").addEventListener("submit", event => {
    event.preventDefault();
    const firstName =
        document.getElementById("first-name").value.trim();
    const lastName =
        document.getElementById("last-name").value.trim();
    const email =
        document.getElementById("register-email").value.trim();
    const phone = registerPhone.value.trim();
    const firstNameError =
        document.getElementById("first-name-error");
    const emailError =
        document.getElementById("register-email-error");
    const status =
        document.getElementById("register-status");
    firstNameError.textContent = "";
    emailError.textContent = "";
    registerPhoneError.textContent = "";
    dobError.textContent = "";
    status.textContent = "";
    let isValid = true;
    if (!firstName) {
        firstNameError.textContent =
            "Please enter your first name.";
        isValid = false;
    }
    if (!validateDateOfBirth()) {
        isValid = false;
    }
    if (registerMethod === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent =
                "Please enter your email address.";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent =
                "Please enter a valid email address.";
            isValid = false;
        }
    }
    else {
        if (!phone) {
            registerPhoneError.textContent =
                "Please enter your phone number.";
            isValid = false;
        } else if (/^[0-5]/.test(phone)) {
            registerPhoneError.textContent =
                "Phone number must start with a digit between 6 and 9.";
            isValid = false;
        } else if (phone.length < 10) {
            registerPhoneError.textContent =
                "Please enter all 10 digits of your phone number.";
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
            registerPhoneError.textContent =
                "Please enter a valid 10-digit phone number.";
            isValid = false;
        }
    }
    if (!isValid) return;
    status.textContent = "Frontend preview only.";
    console.log({
        profileFor: selectedProfile,
        gender: selectedGender,
        firstName,
        lastName,
        dateOfBirth:
            `${yearInput.value}-${monthInput.value.padStart(2, "0")}-${dayInput.value.padStart(2, "0")}`,
        registerWith: registerMethod,
        contact: registerMethod === "email" ? email : phone
    });
});