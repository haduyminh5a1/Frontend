import { postData, getVal } from "./utils.js";

async function handleSignup() {
    const name = getVal("name");
    const email = getVal("email");
    const password = getVal("newPassword");

    if (!isValidEmail(email)) {
        return alert("Invalid email!");
    }
    if (!isPasswordStrong(password)) {
        return alert("Password not strong enough!");
    }

    const result = await postData("/signup", { name, email, password });
    const msg = result.message || result.msg || (result.success ? "Sign up successful!" : "Sign up failed.");
    alert(msg);

    if (result.success) window.location.href = "login2.html";
}

async function handleLogin() {
    const email = getVal("email");
    const password = getVal("password");

    if (!email || !password) {
        return alert("Please enter email and password.");
    }

    // Render free tier co the bi sleep, hien thi loading de user biet dang cho
    const btn = document.getElementById("btnLogin");
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Connecting... (may take ~30s)";

    try {
        const result = await postData("/login", { email, password });

        const msg = result.message || result.msg || (result.success ? "Login successful!" : "Login failed.");
        alert(msg);

        if (result.success) {
            const token = result.token || result.accessToken || result.data?.token;

            if (!token) {
                return alert("Login succeeded but no token received. Please contact support.");
            }

            localStorage.setItem("userToken", token);
            localStorage.setItem("userEmail", email);

            const redirectUrl = result.redirect || "https://caiductien-dotcom.github.io/WEB-BASED-BATTLESHIP-GAME/";
            window.location.href = `${redirectUrl}?token=${token}`;
        }
    } catch (err) {
        alert("Server is unavailable. Please wait 30 seconds and try again.");
    } finally {
        // Tra lai nut binh thuong neu khong redirect
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

export function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*\d).{8,}$/;
    return regex.test(password);
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const passwordInput = document.getElementById("newPassword");
if (passwordInput) {
    passwordInput.oninput = (e) => {
        const msg = document.getElementById("pass-msg");
        if (!msg) return;
        if (isPasswordStrong(e.target.value)) {
            msg.innerText = " Strong password";
            msg.style.color = "green";
        } else {
            msg.innerText = " Need 8+ chars, uppercase, lowercase, number & special char";
            msg.style.color = "red";
        }
    };
}

const emailInput = document.getElementById("email");
if (emailInput) {
    emailInput.oninput = (e) => {
        const msg = document.getElementById("email-msg");
        if (!msg) return;
        if (isValidEmail(e.target.value)) {
            msg.innerText = " Valid email";
            msg.style.color = "green";
        } else {
            msg.innerText = " Invalid email format";
            msg.style.color = "red";
        }
    };
}

if (document.getElementById("btnSignup")) {
    document.getElementById("btnSignup").onclick = handleSignup;
}
if (document.getElementById("btnLogin")) {
    document.getElementById("btnLogin").onclick = handleLogin;
}