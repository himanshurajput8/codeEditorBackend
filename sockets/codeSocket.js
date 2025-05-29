// sockets/codeSocket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    socket.on('code-change', ({ roomId, data }) => {
      socket.to(roomId).emit('code-update', data);
    });

    socket.on('cursor-position-change', ({ roomId, lineNumber, column }) => {
socket.to(roomId).emit('cursor-position-update', { lineNumber, column ,senderId: socket.id});
    });

    socket.on('selection-change', ({ roomId, selection }) => {
      console.log('Selected');
      socket.to(roomId).emit('selection-update', {
        senderId: socket.id,
        selection,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};