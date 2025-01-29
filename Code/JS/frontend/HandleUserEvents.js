const eContainer = document.querySelector(".container");

window.onload = async () => {
    await FetchParkingData();
    UpdateStyles();
};

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

function ValidateSession() {
    // TODO
    return true;
}

async function BookSlot(parkingId, userId) {
    if (!ValidateSession) {
        return;
    }
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

        eSlot.addEventListener("click", () => {
            BookSlot(eSlot.dataset.id, 1);
        });

        eContainer.appendChild(eSlot);
    }
}
