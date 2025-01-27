const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { CreateUser, CheckUser } = require("./DatabaseUtils.js");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const message = await CreateUser(username, email, password);
        // TODO: Make redirection better
        res.status(200).json({ success: true, message: message, redirectTo: "http://127.0.0.1:5500/Code/Html/Index.html" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const message = await CheckUser(email, password);
        res.status(200).json({ success: true, message: message, redirectTo: "http://127.0.0.1:5500/Code/Html/Index.html" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
