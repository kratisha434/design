lucide.createIcons();
const emailTab = document.getElementById("email-tab");
const phoneTab = document.getElementById("phone-tab");
const emailGroup = document.getElementById("email-group");
const phoneGroup = document.getElementById("phone-group");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const stepText = document.getElementById("step-text");
const buttonText = document.getElementById("button-text");
const loginForm = document.getElementById("login-form");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const formStatus = document.getElementById("form-status");
const loginCard = document.querySelector(".login-card");
const otpScreen = document.getElementById("otp-screen");
let currentMode = "email";
let loginMethod = "email";
let enteredContact = "";
let resendInterval;
const otpDestination = document.getElementById("otp-destination");
const otpDescription = document.getElementById("otp-description");
const otpMethodIcon = document.getElementById("otp-method-icon");
const otpInput = document.getElementById("otp-input");
const otpError = document.getElementById("otp-error");
const otpStatus = document.getElementById("otp-status");
const resendButton = document.getElementById("resend-otp");
const resendTimer = document.getElementById("resend-timer");
const otpAlternativeButton = document.getElementById("otp-alternative-button");
// SWITCH LOGIN METHOD
function switchMode(mode) {
    currentMode = mode;
    formStatus.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    emailTab.classList.toggle("active", mode === "email");
    phoneTab.classList.toggle("active", mode === "phone");
    emailTab.setAttribute("aria-pressed", String(mode === "email"));
    phoneTab.setAttribute("aria-pressed", String(mode === "phone"));
    emailGroup.classList.toggle("hidden", mode !== "email");
    phoneGroup.classList.toggle("hidden", mode !== "phone");
    if (mode === "email") {
        stepText.textContent = "STEP 1 OF 2 • EMAIL SIGN-IN";
        buttonText.textContent = "Continue with email";
    } else {
        stepText.textContent = "STEP 1 OF 2 • PHONE SIGN-IN";
        buttonText.textContent = "Continue with phone";
    }
}
// TOGGLE BUTTONS
emailTab.addEventListener("click", () => switchMode("email"));
phoneTab.addEventListener("click", () => switchMode("phone"));
// PHONE INPUT - NUMBERS ONLY
phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
});
// SHOW SECOND SCREEN
function showOtpScreen(method, contact) {
    loginMethod = method;
    enteredContact = contact;
    loginCard.classList.add("hidden");
    otpScreen.classList.remove("hidden");
    if (method === "email") {
        otpMethodIcon.setAttribute("data-lucide", "mail");
        otpDescription.textContent =
            "We've sent a 6-digit verification code to your email address.";
        otpAlternativeButton.textContent = "Try using your phone number";
    } else {
        otpMethodIcon.setAttribute("data-lucide", "smartphone");
        otpDescription.textContent =
            "We've sent a 6-digit verification code to your phone number.";
        otpAlternativeButton.textContent = "Try using your email";
    }
    otpDestination.textContent = contact;
    otpInput.value = "";
    otpError.textContent = "";
    otpStatus.textContent = "";
    startResendTimer();
    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
}
// FORM SUBMISSION
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    emailError.textContent = "";
    phoneError.textContent = "";
    formStatus.textContent = "";
    if (currentMode === "email") {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = "Please enter your email address.";
            return;
        }
        if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            return;
        }
        showOtpScreen("email", email);
    } else {
        const phone = phoneInput.value.trim();
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phone) {
            phoneError.textContent = "Please enter your phone number.";
            return;
        }
        if (!phonePattern.test(phone)) {
            phoneError.textContent = "Please enter a valid 10-digit phone number.";
            return;
        }
        showOtpScreen("phone", "+91 " + phone);
    }
});
// RESEND OTP TIMER
function startResendTimer() {
    clearInterval(resendInterval);
    let seconds = 30;
    resendButton.disabled = true;
    resendTimer.textContent = "(30s)";
    resendInterval = setInterval(() => {
        seconds--;
        resendTimer.textContent = `(${seconds}s)`;
        if (seconds <= 0) {
            clearInterval(resendInterval);
            resendButton.disabled = false;
            resendTimer.textContent = "";
        }
    }, 1000);
}
// OTP INPUT - NUMBERS ONLY
otpInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 6);
});
// RESEND OTP
resendButton.addEventListener("click", () => {
    if (resendButton.disabled) return;
    otpStatus.textContent = "Frontend preview only.";
    startResendTimer();
});
// CHANGE EMAIL / PHONE
function returnToLogin() {
    clearInterval(resendInterval);
    otpScreen.classList.add("hidden");
    loginCard.classList.remove("hidden");
    otpStatus.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}
document.getElementById("change-contact").addEventListener("click", returnToLogin);
document.getElementById("back-to-login").addEventListener("click", returnToLogin);
// ALTERNATIVE LOGIN HELP - NOW ON OTP SCREEN
otpAlternativeButton.addEventListener("click", () => {
    const nextMode = loginMethod === "email" ? "phone" : "email";
    returnToLogin();
    switchMode(nextMode);
});
// OTP FORM SUBMISSION
document.getElementById("otp-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const otp = otpInput.value.trim();
    otpError.textContent = "";
    otpStatus.textContent = "";
    if (!/^\d{6}$/.test(otp)) {
        otpError.textContent = "Please enter a valid 6-digit OTP.";
        return;
    }
    otpStatus.textContent = "Frontend preview only.";
});