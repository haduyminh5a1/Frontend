import { postData, getVal } from "./utils.js";

async function handleSignup() {
    const email = getVal("email");
    const password = getVal("newPassword");

    if (!isPasswordStrong(password)){
        return alert("Password not strong enough")    
    }

    const result = await postData("/signup", { email, password });
    alert(result.message);
    if (result.success) window.location.href = "/pages/login2.html";
}

async function handleLogin() {
    const email = getVal("email");
    const password = getVal("password");

    const result = await postData("/login", { email, password });
    alert(result.message);
    if (result.success) {
        localStorage.setItem("userEmail", email);
        window.location.href = "/pages/login2.html";
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

if (document.getElementById("btnSignup")) {
    document.getElementById("btnSignup").onclick = handleSignup;
}
if (document.getElementById("btnLogin")) {
    document.getElementById("btnLogin").onclick = handleLogin;
}