const eContainer = document.querySelector(".container");

window.onload = async () => {
    await FetchParkingData();
    // await checkIfLoggedIn();
    UpdateStyles();
};

async function checkIfLoggedIn() {
    
}

async function FetchParkingData() {
    try {
        const response = await fetch("http://localhost:8080/api/parkingSlots");
        const result = await response.json();
    
        if (result.success) {
            populateParkingList(result.message);
        } else {
            alert("No Parking Slots Avaiable!");
        }
    } catch (error) {
        alert(`Error Occurred ${error}`);
    }
}

function UpdateStyles() {
    let slots = document.getElementsByClassName("slot");
    for (let slot of slots) {
        if (slot.dataset.status != -1) {
            // occupied
            slot.style.backgroundColor = "#D32F2F";
        } else {
            // vacant
            slot.style.backgroundColor = "#388E3C";
        }
    }
}

async function ValidateSession() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // console.log("User is not logged in");
        alert("You Must LogIn or SignUp!");
        return false;
    }

    try {
        const response = await fetch("http://localhost:8080/api/protected", {
            method: "GET",
            headers: {
                "Authorization": token,
            },
        });

        const result = await response.json();
        if (result.success) {
            console.log("User is logged in:", result.user);
            return true;
        } else {
            console.log("Invalid token:", result.message);
            return false;
        }
    } catch (error) {
        console.error("Error checking login state:", error);
        return false;
    }
}

async function BookSlot(parkingId, userId) {
    // let session = await ValidateSession();
    // if (!session) {
    //     return;
    // }
    try {
        const response = await fetch("http://localhost:8080/api/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ parkingId, userId })
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
        } else {
            alert(result.error);
            // alert("Selected Parking is already Booked!");
        }
    } catch (error) {
        alert(`Error occurred ${error}`);
    }

    UpdateStyles();
}

function populateParkingList(slots) {
    const numSlots = slots.length;
    eContainer.innerHTML = "";

    for (let i = 0; i < numSlots; ++i) {
        const slot = slots[i];
        const eSlot = document.createElement("div");
        eSlot.classList.add("slot");
        eSlot.dataset.id = slot.id;
        eSlot.dataset.status = slot.occupant;
        eSlot.textContent = `Slot: ${slot.id}`;

        eSlot.addEventListener("click", async () => {
            let session = await ValidateSession();
            if (!session) {
                return;
            }
            BookSlot(eSlot.dataset.id, localStorage.getItem("userId"));
        });

        eContainer.appendChild(eSlot);
    }
}
