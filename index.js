import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import { authenticateToken } from './middleware/auth.js';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Mount API routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = http.createServer(app);

// Simple WebSocket server that authenticates via token query param
const wss = new WebSocketServer({ noServer: true });
// Map userId => Set of ws connections
const clients = new Map();

function broadcastToUser(userId, message) {
  const set = clients.get(userId);
  if (!set) return;
  const str = JSON.stringify(message);
  for (const ws of set) {
    if (ws.readyState === ws.OPEN) ws.send(str);
  }
}

server.on('upgrade', (request, socket, head) => {
  // Example: ws://host/?token=...
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');
  if (!token) {
    socket.destroy();
    return;
  }
  // Verify token using the same logic as middleware
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'glassmorphic-super-secret-key-123!';
    const payload = jwt.verify(token, JWT_SECRET);
    // attach payload to request for the ws connection
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.user = payload; // { userId }
      // store connection
      const id = payload.userId;
      if (!clients.has(id)) clients.set(id, new Set());
      clients.get(id).add(ws);
      ws.on('close', () => {
        clients.get(id).delete(ws);
        if (clients.get(id).size === 0) clients.delete(id);
      });
      ws.on('message', () => {});
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.destroy();
  }
});

// Provide broadcast helper to routes via middleware
app.use((req, res, next) => {
  req.broadcast = (msg) => {
    if (msg && msg.userId) broadcastToUser(msg.userId, msg);
  };
  next();
});

// Top-level error handlers to aid debugging and keep process alive for development
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (server):', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

// Log when routes are mounted
console.log('Mounting routes: /api/auth, /api/tasks');
app._router && console.log('Registered routes:', app._router.stack.filter(r => r.route).map(r => Object.keys(r.route.methods).join(',') + ' ' + r.route.path));

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log('WebSocket endpoint available at ws://localhost:' + port + '/ (token required as query param)');
});

export default server;
