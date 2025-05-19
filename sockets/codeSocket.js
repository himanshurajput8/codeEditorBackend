const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on('code-change', ({ data }) => {
      // Broadcast to others in the same room
      // socket.to(roomId).emit('code-change', { data });

      socket.broadcast.emit('code-update', data)
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
