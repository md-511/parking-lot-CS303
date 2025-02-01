const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { CreateUser, CheckUser, BookParking, AddReview, FetchParkingSlots, FetchBookings } = require("./DatabaseUtils.js");
const { ValidateToken } = require("./AuthUtils.js");

const homePageURL = "http://localhost:5500/Code/Html/Index.html";
const app = express();
const PORT = 8080;

// ! Need to hide it (probably as an Environment Variable)
const KEY = "THIS_IS_A_TEST_KEY";

app.use(cors());
app.use(bodyParser.json());

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const message = await CreateUser(username, email, password);
        // TODO: Make redirection better
        const token = jwt.sign({ email: email }, KEY, { expiresIn: "1h" });
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL, token: token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const message = await CheckUser(email, password);
        const token = jwt.sign({ email: email }, KEY, { expiresIn: "1h" });
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL, token: token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/review", async (req, res) => {
    const { userId, review } = req.body;
    try {
        const message = await AddReview(userId, review);
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/parkingSlots", async (req, res) => {
    try {
        const message = await FetchParkingSlots();
        if (!message || message.length == 0) {
            res.status(404).json({ success: false, message: "No, Parking Slots Available!" });
        }
        res.status(200).json({ success: true, message: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/booking", async (req, res) => {
    const { parkingId, userId } = req.body;
    try {
        const message = await BookParking(parkingId, userId);
        // if (message == "Booked") {
        res.status(200).json({ success: true, message: message });
        // } else {
        //     res.status(400).json({ success: false, message: "Selected Parking is already Booked!" });
        // }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/fetchBookings", async (req, res) => {
    const userId = req.query.userId;
    try {
        const message = await FetchBookings(userId);
        res.status(200).json({ success: true, message: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/protected", ValidateToken, (req, res) => {
    res.status(200).json({ success: true, message: "You are authenticated!", user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log(`Website Hosted on ${homePageURL}`);
});
