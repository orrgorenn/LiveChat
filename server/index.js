const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 2058;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New connection.');

    socket.on('disconnect', () => {
        console.log('Closed connection.');
    });
});

app.use(router);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});