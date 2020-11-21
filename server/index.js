const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 2058;

const router = require('./router');

const config = require("./config/key");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
  
const { Chat } = require("./models/Chat");

io.on('connection', (socket) => {
    console.log('New connection.');

    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        // Load Old Messages
        Chat.find().where("room", user.room).exec(function (err, messages) {
            messages.forEach(message => {
                socket.emit('message', { user: message.sender, text: message.message, image: message.image });
            });
        });
        
        socket.broadcast.to(user.room).emit('message', { user: 'מערכת', text: `גם ${user.name} פה!` })

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        connect.then(db => {
            try {
                let chat = new Chat({ room: user.room, message: message, sender: user.name, image: '' });

                chat.save((err, doc) => {
                    if (err) console.log(err.message);

                    io.to(user.room).emit('message', { user: user.name, text: message });
                    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
                });
            } catch (err) {
                console.log(err.message);
            }
        });

        callback();
    });

    socket.on('sendImage', (image, callback) => {
        const user = getUser(socket.id);

        connect.then(db => {
            try {
                let chat = new Chat({ room: user.room, message: '', sender: user.name, image: image });

                chat.save((err, doc) => {
                    if (err) console.log(err.message);

                    io.to(user.room).emit('message', { user: user.name, image: image, text: ''});
                    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
                });
            } catch (err) {
                console.log(err.message);
            }
        });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'מערכת', text: `${user.name} עזב את החדר.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    });
});

app.use(router);
app.use('/images', express.static('images'));

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});