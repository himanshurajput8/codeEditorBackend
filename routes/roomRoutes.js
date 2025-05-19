const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();


router.post('/create', (req, res) => {
  const roomId = uuidv4();

  // Optional: Store room info in memory or database
  // e.g., in-memory store: rooms[roomId] = { createdAt: Date.now() };

  res.status(201).json({ roomId });
});

module.exports = router;
