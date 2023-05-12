const express = require('express')
const db = require('./utils/Database.js')
const app = express()
const dotenv = require("dotenv")
dotenv.config()
db.connect()

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


const account = require("./routes/account")

app.use("/account", account)

app.listen(3000)


global.db = db