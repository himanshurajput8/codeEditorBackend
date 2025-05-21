const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
app.use(cors({
  origin: 'https://code-editor-five-alpha.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));
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
