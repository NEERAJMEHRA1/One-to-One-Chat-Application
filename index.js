const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
    // socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg); // broadcast to all including sender
    // });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
