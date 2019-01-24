//app.js
const express = require('express');
const app = express();
const server = require('http').Server(app);

//Socket.io
const io = require('socket.io')(server);
io.on("connection", (socket) => {
  console.log("🔌 New user connected! 🔌");
  // This file will be read on new socket connections 
  require('./sockets/chat.js')(io, socket);
})

const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'pug');
//Establish your public folder
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index');
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})