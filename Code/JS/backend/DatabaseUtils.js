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
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("User Created Successfully!");
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
                    reject(new Error("Users lookup failed!"));
                } else if (!row) {
                    reject(new Error("No User with provided credentials found!"));
                } else {
                    if (row.password == password) {
                        resolve("Logged In Successfully!");
                    } else {
                        reject(new Error("Incorrect Password!"));
                    }
                }
            }
        );
    });
}

function BookParking(id) {
    // TODO
}

module.exports = {CreateUser, CheckUser, BookParking};
