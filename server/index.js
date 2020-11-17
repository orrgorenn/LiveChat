const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 2058;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New connection.');

    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        socket.emit('message', { user: 'מערכת', text: `ברוכים הבאים, ${user.name}!` });
        socket.broadcast.to(user.room).emit('message', { user: 'מערכת', text: `גם ${user.name} פה!` })

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendImage', (image, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: image });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

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

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});