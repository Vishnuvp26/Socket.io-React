const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

// CORS setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Ensure this matches your frontend port
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a room
    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        io.in(data.room).emit('receive_message', data);  // Broadcast to all users in the room
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000...');
});