const BASE_URL = "https://saas-backend-0ynu.onrender.com";

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
            window.location.href = `https://caiductien-dotcom.github.io/WEB-BASED-BATTLESHIP-GAME/?token=${token}`;
        }
    } catch (err) {
        alert("Can't connect to server");
    }
}

const getVal = (id) => document.getElementById(id).value;

export { postData, getVal };