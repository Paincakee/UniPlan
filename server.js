const express = require('express');
const app = express();
const db = require('./utils/Database.js');
const nodemailer = require('nodemailer');
const session = require('express-session');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);

dotenv.config();
db.connect();

app.use(session({
  secret: 'J4v7c#$37Zs6p6e',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/csv', require('./routes/csv.js'));
app.use('/account', require('./routes/account'));
app.use('/project', require('./routes/project.js'));


app.get('/api/db', (req, res) => {
  res.json({ db });
});

let transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'pixeltrading@outlook.com',
    pass: 'r2R439Sm&R8ALHf'
  }
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (data) => {
    socket.join(data.roomId); // Join the specific room
    users[socket.id] = data.fullName;
    io.to(data.roomId).emit('user-connected', {fullName: data.fullName, user: data.user, roomId: data.roomId });
    console.log(`user: ${data.user}(${data.fullName}), room: ${data.roomId}`);
  });
  
  socket.on('send-chat-message', (data) => {
    socket.to(data.roomId).emit('chat-message', { message: data.message, user: users[socket.id] });
  });
});


const port = 3000;
server.listen(port);

global.db = db;
global.sender = transporter;
