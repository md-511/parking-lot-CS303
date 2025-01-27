import { GetInput } from "../backend/Utils.js";

const eUsername = document.getElementById("username");
const eEmail = document.getElementById("email");
const ePassword = document.getElementById("password");
const eButton = document.getElementById("submit");

eButton.addEventListener("click", async (event) => {
    // Prevent form submission which will now be handled by JS
    event.preventDefault();

    const username = GetInput(eUsername);
    const email = GetInput(eEmail);
    const password = GetInput(ePassword);

    if (!username || !email || !password) {
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (result.success) {
            // TODO
            window.location.href = result.redirectTo;
            alert(result.message);
        } else {
            // TODO
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Failed to connect to the backend:", error);
    }
});