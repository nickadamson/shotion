const path = "db/shotion.sqlite3";

async function main() {
    console.log("Creating new SQLITE3 Database...");

    const db = require("better-sqlite3")(path, { verbose: console.log });

    console.log(`Connected to Database '${db.name}' (read-only: ${db.readonly})`);

    db.close();
    console.log("DB Disconnected");
}

main();
