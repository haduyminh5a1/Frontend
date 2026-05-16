import { isPasswordStrong } from "./auth.js";
import { postData, getVal } from "./utils.js";

let resendTimer;
let otpExpiryTimer;

function startResendCountdown(duration) {
    let timeLeft = duration;
    const btnResend = document.getElementById("btnResend");
    if (!btnResend) return;

    btnResend.classList.add("disable");
    clearInterval(resendTimer);

    resendTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(resendTimer);
            btnResend.classList.remove("disable");
            btnResend.innerText = "Resend code";
        } else {
            btnResend.innerText = `Resend after (${timeLeft}s)`;
            timeLeft--;
        }
    }, 1000);
}

function startOTPExpiryCountdown(duration) {
    let timeLeft = duration;
    const countdownDisplay = document.getElementById("countdown");
    if (!countdownDisplay) return;

    clearInterval(otpExpiryTimer);
    otpExpiryTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(otpExpiryTimer);
            countdownDisplay.innerText = "OTP expired!";
            countdownDisplay.style.color = "#ff4b4b";
        } else {
            countdownDisplay.innerText = `OTP valid time left: ${timeLeft}s`;
            timeLeft--;
        }
    }, 1000);
}

function initOTPSystem() {
    startResendCountdown(30);
    startOTPExpiryCountdown(60);
}

if (document.getElementById("otp")) {
    initOTPSystem();
}

const btnResend = document.getElementById("btnResend");
if (btnResend) {
    btnResend.onclick = (e) => {
        e.preventDefault();
        resendOTP();
    };
}

async function handleForgotPassword() {
    const email = getVal("email");
    if (!email) return alert("Please enter your email");

    const result = await postData("/forgot-password", { email });
    const msg = result.message || result.msg || (result.success ? "OTP sent!" : "Failed to send OTP.");
    alert(msg);

    if (result.success) {
        localStorage.setItem("resetEmail", email);
        window.location.href = "reset-password.html";
    }
}

async function handleResetAllInOne() {
    const email = localStorage.getItem("resetEmail");
    const otp = getVal("otp");
    const newPassword = getVal("newPassword");
    const confirmPassword = getVal("confirmPassword");

    if (!email) {
        alert("Session expired. Please request OTP again.");
        return window.location.href = "forgot-password1.html";
    }
    if (!otp) {
        return alert("Please enter OTP");
    }
    if (!isPasswordStrong(newPassword)) {
        return alert("This password is not strong enough");
    }
    if (newPassword !== confirmPassword) {
        return alert("Passwords do not match!");
    }

    const result = await postData("/reset-password", { email, otp, newPassword });
    const msg = result.message || result.msg || (result.success ? "Password reset!" : "Reset failed.");
    alert(msg);

    if (result.success) {
        localStorage.removeItem("resetEmail");
        window.location.href = "login2.html";
    }
}

async function resendOTP() {
    const email = localStorage.getItem("resetEmail");

    if (!email) {
        alert("Session expired. Please enter your email again.");
        window.location.href = "forgot-password1.html";
        return;
    }

    const result = await postData("/resend-otp", { email });
    const msg = result.message || result.msg || (result.success ? "OTP resent!" : "Failed to resend OTP.");
    alert(msg);

    if (result.success) {
        initOTPSystem();
    }
}

const btnForgot = document.getElementById("btnForgot");
const btnResetAll = document.getElementById("btnResetAll");

if (btnForgot) btnForgot.onclick = handleForgotPassword;
if (btnResetAll) btnResetAll.onclick = handleResetAllInOne;