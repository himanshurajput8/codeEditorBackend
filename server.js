const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
app.use(cors());
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    // origin: '*', 
    origin: 'https://code-editor-five-alpha.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

const roomRoutes = require('./routes/roomRoutes');
// ye rooms related rules bula raha hai roomRoutes.js file se
app.use('/api/room', roomRoutes);


// Real-time socket logic
require('./sockets/codeSocket')(io);

app.get('/', (req, res) => {
  res.send('CodeShare backend running...');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log('running');
    
    console.log(`Server is live on port ${PORT}`);

});
//
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    socket.on('code-change', ({ roomId, data }) => {
      // Broadcast to everyone except sender in that room
      socket.to(roomId).emit('code-update', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

        
  });
};
