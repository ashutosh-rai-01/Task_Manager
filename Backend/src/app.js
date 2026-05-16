const express = require('express');
const cors = require("cors")
const dns = require('dns')
const app = express()
const TaskRouter = require('./Routes/TaskRouter.js')
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use('/api/task',TaskRouter)
app.get('/',(req,res)=>{
    res.send("Hello form teh backend")
})
module.exports = app;