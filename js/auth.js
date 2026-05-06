import { postData, getVal } from "./utils.js";

async function handleSignup() {
    const email = getVal("email");
    const password = getVal("newPassword");

    if (!isPasswordStrong(password)){
        return alert("Password not strong enough!");
    }
    if (!isValidEmail(email)){
        return alert("Invalid email!");
    }
    const result = await postData("/signup", { email, password });
    alert(result.message);
    if (result.success) window.location.href = "login2.html";
}

async function handleLogin() {
    const email = getVal("email");
    const password = getVal("password");

    try {
        const result = await postData("/login", { email, password });
        alert(result.message);

        if (result.success) {
            const token = result.token;
            localStorage.setItem("token", token);
            localStorage.setItem("userEmail", email);

            window.location.href = `${result.redirect}?token=${result.token}`;
        }
    } catch (err) {
        alert("Can't connect to backend server");
    }
}

export function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*\d).{8,}$/;
    return regex.test(password);
}

const passwordInput = document.getElementById("newPassword");
if (passwordInput){
    passwordInput.oninput = (e) => {
        const msg = document.getElementById("pass-msg");
        if (!msg) return;
        if (isPasswordStrong(e.target.value)) {
            msg.innerText = "Valid Password";
            msg.style.color = "green";
        } else {
            msg.innerText = "Not strong enough password, need at least 8 characters, contains at least 1 lowercase, 1 uppercase character, 1 special character and 1 number";
            msg.style.color = "red";
        }
    }
}

const emailInput = document.getElementById("email");
if (emailInput){
    emailInput.oninput = (e) => {
        const msg = document.getElementById("email-msg");
        if (!msg) return;
        if (isValidEmail(e.target.value)){
            msg.innerText = "Valid email";
            msg.style.color = "green";
        }
        else {
            msg.innerText = "Invalid email format, please enter a true email";
            msg.style.color = "red";
        }
    }
}

export function isValidEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


if (document.getElementById("btnSignup")) {
    document.getElementById("btnSignup").onclick = handleSignup;
}
if (document.getElementById("btnLogin")) {
    document.getElementById("btnLogin").onclick = handleLogin;
}