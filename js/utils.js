const BASE_URL = "https://destruct-abruptly-applied.ngrok-free.dev";

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${BASE_URL}/api${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
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