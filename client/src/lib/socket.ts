import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.IO] Connection error:', err.message);
    });
  }

  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};

// ── Room helpers ──────────────────────────────────────────────────────────────

export const joinRoom = (roomCode: string, user: { name: string; avatar?: string }) => {
  const s = connectSocket();
  s.emit('room:join', { roomCode, user });
};

export const leaveRoom = (roomCode: string, user: { name: string }) => {
  socket?.emit('room:leave', { roomCode, user });
};

export const syncJourneyUpdate = (roomCode: string, stage: string, landmarkId?: string) => {
  socket?.emit('journey:update', { roomCode, stage, landmarkId });
};

export const startActivity = (roomCode: string, activityName: string) => {
  socket?.emit('activity:start', { roomCode, activityName });
};

export const completeActivity = (roomCode: string, activityName: string, xp: number) => {
  socket?.emit('activity:complete', { roomCode, activityName, xp });
};

export const shareMemory = (roomCode: string, memory: any) => {
  socket?.emit('memory:created', { roomCode, memory });
};

export const sendChatMessage = (roomCode: string, message: { sender: string; text: string; time?: string }) => {
  const s = connectSocket();
  s.emit('chat:message', { roomCode, message });
};
