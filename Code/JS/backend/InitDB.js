const SQL = require("sqlite3");

const Database = new SQL.Database("Database/Main.db", (err) => {
    if (err) {
        console.error("Error Opening the database! (InitDB.js)");
    } else {
        console.log("Database initialized successfully! (InitDB.js)");
    }  
});

Database.serialize(() => {
    Database.run(
        `CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`
    , (err) => {
        if (err) {
            console.error("Users Table creation failed!");
        } else {
            console.log("Users Table created successfully!");
        }
    })

    Database.run(
        `CREATE TABLE ParkingLot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            occupied BOOLEAN NOT NULL DEFAULT 0
        );`
    , (err) => {
        if (err) {
            console.error("Parking Lot Table creation failed!");
        } else {
            console.log("Parking Lot Table created successfully!");
        }
    });

});

Database.close((err) => {
    if (err) {
        console.error("Error Closing the Database! (InitDB.js)");
    } else {
        console.log("Closed the Database successfully! (InitDB.js)");
    }
});
