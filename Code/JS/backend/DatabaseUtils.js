// TODO: Password Hashing
const SQL = require("sqlite3");

const Database = new SQL.Database("Database/Main.db", (err) => {
    if (err) {
        console.error("Error Opening the database! (DatabseUtils.js)");
    } else {
        console.log("Database initialized successfully! (DatabseUtils.js)");
    }
});

function CreateUser(username, email, password) {
    return new Promise((resolve, reject) => {
        Database.run(
            `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, password],
            // Use regular function because => doesnt have access to "this"
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ text: "User Created Successfully!", userId: this.lastID });
                }
            }
        );
    });
}

function CheckUser(email, password) {
    return new Promise((resolve, reject) => {
        Database.get(
            `SELECT * FROM Users WHERE email = ?`,
            [email],
            (err, row) => {
                if (err) {
                    reject(new Error("Users lookup failed! (DatabaseUtils.js)"));
                } else if (!row) {
                    reject(new Error("No User with provided credentials found! (DatabaseUtils.js)"));
                } else {
                    if (row.password == password) {
                        resolve({ text: "Logged In Successfully!", userId: row.id });
                    } else {
                        reject(new Error("Incorrect Password! (DatabaseUtils.js)"));
                    }
                }
            }
        );
    });
}

function BookParking(parkingId, userId) {
    // console.log(parkingId, userId);
    return new Promise((resolve, reject) => {
        Database.get(
            `SELECT * FROM ParkingLot WHERE id = ?`,
            [parkingId],
            (err, row) => {
                if (err) {
                    reject(new Error("Error, Booking (DatabaseUtils.js)"));
                } else if (!row) {
                    reject(new Error("Error, ParkingID is invalid! (DatabaseUtils.js)"));
                } else {
                    if (row.occupant == -1) {
                        Database.run(
                            `UPDATE ParkingLot SET occupant = ? WHERE id = ?`,
                            [userId, parkingId],
                            (err) => {
                                if (err) {
                                    reject(new Error("Error updating parking slot occupant (DatabaseUtils.js)"));
                                } else if (this.changes == 0) {
                                    reject(new Error("Error, Parking slot was not updated (DatabaseUtils.js)"));
                                } else {
                                    resolve("Parking slot booked successfully.");
                                }
                            }
                        );
                    } else {
                        reject(new Error("Error, Parking already Booked (DatabaseUtils.js)"));
                    }
                }
        });
    });
}

// ! SUS
function AddReview(userId, review) {
    return new Promise((resolve, reject) => {
        Database.run(
            `INSERT INTO Reviews (user_id, review) VALUES (?, ?)`, 
            [userId, review],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("Review Added Successfully!");
                }
            }
        );
    });
}

function FetchParkingSlots() {
    return new Promise((resolve, reject) => {
        Database.all(
            `SELECT * FROM ParkingLot`,
            [],
            (err, rows) => {
                if (err) {
                    reject(new Error("Error, Fetching ParkingLot (DatabaseUtils.js)"));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

module.exports = { CreateUser, CheckUser, BookParking, AddReview, FetchParkingSlots };
