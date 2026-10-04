import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/db.js';
import { registerTravelRoomSocket } from './sockets/travelRoomSocket.js';

// Routes
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import aiRoutes from './routes/ai.js';
import journeyRoutes from './routes/journeys.js';
import roomRoutes from './routes/rooms.js';
import memoryRoutes from './routes/memories.js';
import userRoutes from './routes/users.js';

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';

// ── Socket.IO ────────────────────────────────────────────────────────────────
const io = new SocketIOServer(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:5173'],
    credentials: true
  }
});

registerTravelRoomSocket(io);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173'],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ── Health Check ─────────────────────────────────────────────────────────────
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    service: 'TravelTwin API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/users', userRoutes);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Error Handler ────────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err?.message || 'Internal server error.' });
});

// ── Boot ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT || 3001);

import { seedDestinations } from './utils/seed.js';

const boot = async () => {
  await connectDB();
  await seedDestinations();
  server.listen(PORT, () => {
    console.log(`\n🚀 TravelTwin API running at http://localhost:${PORT}`);
    console.log(`📡 Socket.IO ready`);
    console.log(`🌍 Client origin: ${CLIENT_URL}\n`);
  });
};

boot().catch(err => {
  console.error('Boot error:', err);
  process.exit(1);
});
