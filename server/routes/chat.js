var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Chat = require('../models/Chat.js');

server.listen(4000);

// socket io
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => console.log('User disconnected'));
  socket.on('new-message', data => io.emit('new-message', data));
  socket.on('user-joined', data => io.emit('user-joined', data));
  socket.on('user-left', data => io.emit('user-left', data));
});

// Get all chats
router.get('/:room', (req, res, next) => {
  Chat.find({ room: req.params.room }, (err, chats) => {
    if (err) return next(err);
    res.json(chats);
  });
});

// Save chat
router.post('/', (req, res, next) => {
  Chat.create(req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;