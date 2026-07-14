
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const app = require("./src/app")
const connectdb = require("./src/db/db")

dotenv.config()

connectdb();

const PORT = process.env.PORT 




app.use(express.json());
app.use(cors());

app.listen(PORT, ()=>{
    console.log(`Server running on port:,${PORT}`)
})