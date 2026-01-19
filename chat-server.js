const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Store connected users and their rooms
const connectedUsers = new Map();
const userRooms = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a chat
  socket.on('join-chat', ({ currentUserId, otherUserId }) => {
    const roomId = [currentUserId, otherUserId].sort().join('-');
    
    // Store user info
    connectedUsers.set(socket.id, {
      userId: currentUserId,
      roomId: roomId
    });
    
    // Join the room
    socket.join(roomId);
    userRooms.set(currentUserId, roomId);
    
    console.log(`User ${currentUserId} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on('message', (message) => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      // Broadcast message to the room
      io.to(userInfo.roomId).emit('message', {
        ...message,
        timestamp: new Date()
      });
      
      console.log(`Message sent in room ${userInfo.roomId}:`, message.text);
    }
  });

  // Handle typing indicators
  socket.on('typing', ({ userId, otherUserId, isTyping }) => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      // Emit typing status to other users in the room
      socket.to(userInfo.roomId).emit('user-typing', {
        userId: userId,
        isTyping: isTyping
      });
    }
  });

  // Handle getting previous messages
  socket.on('get-messages', ({ currentUserId, otherUserId }) => {
    // In a real app, you would fetch from a database
    // For now, we'll just send an empty array
    const previousMessages = [];
    socket.emit('previous-messages', previousMessages);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      console.log(`User ${userInfo.userId} disconnected`);
      connectedUsers.delete(socket.id);
      userRooms.delete(userInfo.userId);
    }
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', connectedUsers: connectedUsers.size });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, server, io };
