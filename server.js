const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Define allowed origins (add localhost for development if needed)
const allowedOrigins = [
  'https://code-editor-five-alpha.vercel.app',
  // 'http://localhost:3000' 
];

// Enable CORS for both Express and Socket.IO
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: false, // Change to true only if you're using cookies/sessions
}));

const server = http.createServer(app);

// Setup socket.io with same CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

// Routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/room', roomRoutes);

// Socket logic
require('./sockets/codeSocket')(io);

// Basic health check
app.get('/', (req, res) => {
  res.send('CodeShare backend running...');
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Server is live on port ${PORT}`);
});
