const express = require('express')
const db = require('./utils/Database.js')
const nodemailer = require("nodemailer");
const app = express()
const session = require('express-session')
const dotenv = require("dotenv")
dotenv.config()
db.connect()

app.use(session({
    secret: 'J4v7c#$37Zs6p6e',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/csv", require("./routes/csv.js"))
app.use("/account", require("./routes/account"))
app.use("/project", require("./routes/project.js"))


let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "pixeltrading@outlook.com",
      pass: "YEWeyBn3PttehFD"
    },
});

app.listen(3000)


global.db = db
global.sender = transporter