const express = require('express')
const db = require('./utils/Database.js')
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




app.use("/account", require("./routes/account"))
app.use("/project", require("./routes/project.js"))

app.listen(3000)


global.db = db