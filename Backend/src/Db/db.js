const mongoose = require("mongoose");

async function connectdb() {
    const DB_URL = process.env.db_url;
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
}

module.exports = connectdb;