const rooms = {};
const roomCodes = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    app.get('/room-exists/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const room = activeRooms[roomId]; // Or however you store rooms

    if (room) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});

    socket.on('check-room', (roomId, callback) => {
      const exists = !!rooms[roomId];
      callback({ exists });
    });

    socket.on('join-room', ({ roomId, username }) => {

      if (!roomId || !username || typeof roomId !== 'string' || roomId.length !== 12) {
        socket.emit('join-error', { message: 'Invalid or malformed room ID' });
        console.log(`Join failed: Invalid room ID (${roomId}) or username`);
        return;
      }

      socket.join(roomId);
      socket.username = username;

      if (!rooms[roomId]) rooms[roomId] = [];

      const isFirstUser = rooms[roomId].length === 0;

      if (!rooms[roomId].some(u => u.id === socket.id)) {
        rooms[roomId].push({ id: socket.id, username });
      }

      io.to(roomId).emit('user-list', rooms[roomId]);

      socket.emit('init-user-status', {
        isFirstUser,
        currentCode: roomCodes[roomId] || '',
      });

      console.log(`${username} (${socket.id}) joined room ${roomId}`);
    });

    socket.on('code-change', ({ roomId, data }) => {
      roomCodes[roomId] = data;
      socket.to(roomId).emit('code-update', data);
    });

    socket.on('cursor-position-change', ({ roomId, lineNumber, column }) => {
      socket.to(roomId).emit('cursor-position-update', {
        senderId: socket.id,
        username: socket.username,
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
        const index = rooms[roomId].findIndex(u => u.id === socket.id);
        if (index !== -1) {
          rooms[roomId].splice(index, 1);
          io.to(roomId).emit('user-list', rooms[roomId]);
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
            delete roomCodes[roomId];
          }
        }
      }
    });
  });
};
