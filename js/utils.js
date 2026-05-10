const BASE_URL = "https://saas-backend-0ynu.onrender.com";

async function postData(endpoint, data) {
    try {
        const token = localStorage.setItem("token");
        const response = await fetch(`${BASE_URL}/api${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && {"Authorization" : `Bearer ${token}`})
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return { success: false, message: "Can't connect to server" };
    }
}

const getVal = (id) => document.getElementById(id).value;

export { postData, getVal };