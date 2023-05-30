const express = require('express')
const app = express()
const db = require('./utils/Database.js')
const nodemailer = require("nodemailer")
const session = require('express-session')
const dotenv = require("dotenv")
const http = require('http')
const socketIO = require('socket.io')

const server = http.createServer(app)
const io = socketIO(server)

dotenv.config()
db.connect()

app.use(session({
    secret: 'J4v7c#$37Zs6p6e',
    resave: false,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')

app.use(express.static(__dirname))
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use("/csv", require("./routes/csv.js"))
app.use("/account", require("./routes/account"))
app.use("/project", require("./routes/project.js"))
app.use("/chat", require("./routes/chat.js"))

app.get('/api/db', (req, res) => {
  res.json({ db })
})

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "pixeltrading@outlook.com",
      pass: "YEWeyBn3PttehFD"
    },
})

const users = {}

io.on('connection', (socket) => {

  // socket.emit('chat-message', 'bozo')
  socket.on('new-user', user => {
    users[socket.id] = user
    console.log(`user: ${user}`)
  })
  socket.on('chat-time', time => {
    // console.log(`time: ${time}`)
  })
  socket.on('send-chat-message', message => {

    socket.broadcast.emit('chat-message', {message: message, user: users[socket.id]})
  })

  

})

const port = 3000
server.listen(port)


global.db = db
global.sender = transporter