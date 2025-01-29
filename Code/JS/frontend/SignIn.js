import { GetInput } from "../backend/Utils.js";

const eEmail = document.getElementById("email");
const ePassword = document.getElementById("password");
const eButton = document.getElementById("submit");

// console.log(eButton);
// console.log(eEmail);
// console.log(ePassword);

eButton.addEventListener("click", async (event) => {
    // Prevent form submission which will now be handled by JS
    event.preventDefault();

    const email = GetInput(eEmail);
    const password = GetInput(ePassword);

    try {
        const response = await fetch("http://localhost:8080/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = result.redirectTo;
            alert(result.message);
        } else {
            alert(result.message);
        }
    } catch (error) {
        // console.error("Failed to connect to the backend:", error);
        alert("Failed to connect to the backend:", error);
    }

});
