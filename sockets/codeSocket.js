const rooms = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', ({ roomId, username }) => {
      socket.join(roomId);
      socket.username = username;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      rooms[roomId].push({ id: socket.id, username });

      io.to(roomId).emit('user-list', rooms[roomId]);

      console.log(`${username} (${socket.id}) joined room: ${roomId}`);
    });

    socket.on('code-change', ({ roomId, data }) => {
      socket.to(roomId).emit('code-update', data);
    });

    socket.on('cursor-position-change', ({ roomId, lineNumber, column }) => {
      socket.to(roomId).emit('cursor-position-update', {
        senderId: socket.id,
        username:socket.username,
        lineNumber,
        column,
      });
    });

    socket.on('selection-change', ({ roomId, selection }) => {
      socket.to(roomId).emit('selection-update', {
        senderId: socket.id,
        selection,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const index = room.findIndex(user => user.id === socket.id);
        if (index !== -1) {
          room.splice(index, 1);
          io.to(roomId).emit('user-list', room);
          break;
        }
      }
    });
  });
};