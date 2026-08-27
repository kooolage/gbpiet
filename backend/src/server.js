require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, { cors: { origin: allowedOrigin, methods: ['GET', 'POST'] } });

app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'gbpiet-api' }));

io.on('connection', (socket) => {
  socket.on('chat:join', (roomId) => socket.join(roomId));
  socket.on('chat:message', ({ roomId, message }) => {
    if (typeof roomId === 'string' && typeof message === 'string' && message.trim()) {
      io.to(roomId).emit('chat:message', { message: message.trim(), sentAt: new Date().toISOString() });
    }
  });
});

const port = Number(process.env.PORT || 5000);
server.listen(port, () => console.log(`GBPiet API listening on http://localhost:${port}`));
