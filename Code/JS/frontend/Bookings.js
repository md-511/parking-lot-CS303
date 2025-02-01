const eContainer = document.querySelector(".container");

window.onload = async () => {
    const bookings = await LoadBookings(localStorage.getItem("userId"));
    RenderBookings(bookings);
};

async function LoadBookings(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/fetchBookings?userId=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();
        if (result.success) {
            return result.message;
        }
    } catch (error) {
        alert("Error: ", error);
    }
}

function RenderBookings(bookings) {
    if (!bookings) {
        return;
    }

    const nBook = bookings.length;
    if (nBook == 0) {
        alert("You Dont Have Any Booked Slots!");
        return;
    }

    eContainer.innerHTML = "";

    for (let i = 0; i < nBook; ++i) {
        const slot = bookings[i];
        const eSlot = document.createElement("div");
        eSlot.classList.add("slot");
        eSlot.dataset.id = slot.id;
        eSlot.dataset.status = slot.occupant;
        eSlot.textContent = `Slot: ${slot.id}`;

        // eSlot.addEventListener("click", async () => {
        //     let session = await ValidateSession();
        //     if (!session) {
        //         return;
        //     }
        //     BookSlot(eSlot.dataset.id, localStorage.getItem("userId"));
        // });

        eContainer.appendChild(eSlot);
    }
}