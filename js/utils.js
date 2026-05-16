const BASE_URL = "https://saas-backend-0ynu.onrender.com";

async function postData(endpoint, data) {
    try {
        // Fix: dùng đúng key "userToken" nhất quán
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${BASE_URL}/api${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Fetch error:", error);
        return { success: false, message: "Can't connect to server" };
    }
}

// Fix: safe getVal - không throw nếu element không tồn tại
const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
};

export { postData, getVal };