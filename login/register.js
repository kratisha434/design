lucide.createIcons();
let selectedProfile = "";
let selectedGender = "";
let registerMethod = "email";
const steps = [
    document.getElementById("register-step-1"),
    document.getElementById("register-step-2"),
    document.getElementById("register-step-3")
];
// REGISTRATION STEP
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
// DOB DROPDOWNS
const daySelect = document.getElementById("dob-day");
const monthSelect = document.getElementById("dob-month");
const yearSelect = document.getElementById("dob-year");
for (let day = 1; day <= 31; day++) {
    daySelect.add(new Option(day, day));
}
const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];
months.forEach((month, index) => {
    monthSelect.add(new Option(month, index + 1));
});
const currentYear = new Date().getFullYear();
for (let year = currentYear - 18; year >= currentYear - 60; year--) {
    yearSelect.add(new Option(year, year));
}
//TOGGLE
const registerEmailTab = document.getElementById("register-email-tab");
const registerPhoneTab = document.getElementById("register-phone-tab");
function switchRegisterMethod(method) {
    registerMethod = method;
    registerEmailTab.classList.toggle("active", method === "email");
    registerPhoneTab.classList.toggle("active", method === "phone");
    registerEmailTab.setAttribute("aria-pressed", String(method === "email"));
    registerPhoneTab.setAttribute("aria-pressed", String(method === "phone"));
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
// PHONE INPUT - NUMBERS ONLY
document.getElementById("register-phone").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});
// REGISTRATION FORM VALIDATION
document.getElementById("register-form").addEventListener("submit", event => {
    event.preventDefault();
    const firstName = document.getElementById("first-name").value.trim();
    const dobDay = daySelect.value;
    const dobMonth = monthSelect.value;
    const dobYear = yearSelect.value;
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const firstNameError = document.getElementById("first-name-error");
    const dobError = document.getElementById("dob-error");
    const emailError = document.getElementById("register-email-error");
    const phoneError = document.getElementById("register-phone-error");
    const status = document.getElementById("register-status");
    firstNameError.textContent = "";
    dobError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    status.textContent = "";
    let isValid = true;
    if (!firstName) {
        firstNameError.textContent = "Please enter your first name.";
        isValid = false;
    }
    if (!dobDay || !dobMonth || !dobYear) {
        dobError.textContent = "Please select your complete date of birth.";
        isValid = false;
    } else {
        const birthDate = new Date(dobYear, dobMonth - 1, dobDay);
        const validDate =
            birthDate.getFullYear() === Number(dobYear) &&
            birthDate.getMonth() === Number(dobMonth) - 1 &&
            birthDate.getDate() === Number(dobDay);
        if (!validDate) {
            dobError.textContent = "Please enter a valid date.";
            isValid = false;
        } else {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const hasBirthdayPassed =
                today.getMonth() > birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() &&
                 today.getDate() >= birthDate.getDate());
            if (!hasBirthdayPassed) age--;
            if (age < 18 || age > 60) {
                dobError.textContent = "Age must be between 18 and 60 years.";
                isValid = false;
            }
        }
    }
    if (registerMethod === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = "Please enter your email address.";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }
    } else {
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phone) {
            phoneError.textContent = "Please enter your phone number.";
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            phoneError.textContent = "Please enter a valid 10-digit number.";
            isValid = false;
        }
    }
    if (!isValid) return;
    status.textContent = "Frontend preview only.";
    console.log({
        profileFor: selectedProfile,
        gender: selectedGender,
        firstName,
        lastName: document.getElementById("last-name").value.trim(),
        dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
        registerWith: registerMethod,
        contact: registerMethod === "email" ? email : phone
    });
});