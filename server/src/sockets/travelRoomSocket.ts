import { Server, Socket } from 'socket.io';

export const registerTravelRoomSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Explorer connected via Socket.IO: ${socket.id}`);

    // Join Room
    socket.on('room:join', ({ roomCode, user }: { roomCode: string; user: any }) => {
      socket.join(roomCode);
      console.log(`User ${user?.name || socket.id} joined room ${roomCode}`);
      io.to(roomCode).emit('room:userJoined', {
        user,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    // Leave Room
    socket.on('room:leave', ({ roomCode, user }: { roomCode: string; user: any }) => {
      socket.leave(roomCode);
      io.to(roomCode).emit('room:userLeft', {
        user,
        timestamp: new Date().toISOString()
      });
    });

    // Journey State Sync
    socket.on('journey:update', ({ roomCode, stage, landmarkId }: any) => {
      io.to(roomCode).emit('journey:updated', {
        stage,
        landmarkId,
        updatedBy: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    // Activity Start
    socket.on('activity:start', ({ roomCode, activityName }: any) => {
      io.to(roomCode).emit('activity:started', {
        activityName,
        timestamp: new Date().toISOString()
      });
    });

    // Activity Complete
    socket.on('activity:complete', ({ roomCode, activityName, xp }: any) => {
      io.to(roomCode).emit('activity:completed', {
        activityName,
        xp,
        completedBy: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    // Memory Created in Co-op Room
    socket.on('memory:created', ({ roomCode, memory }: any) => {
      io.to(roomCode).emit('memory:shared', {
        memory,
        timestamp: new Date().toISOString()
      });
    });

    // Companion Live Chat Message
    socket.on('chat:message', ({ roomCode, message }: { roomCode: string; message: { sender: string; text: string; time?: string } }) => {
      io.to(roomCode).emit('chat:message', {
        ...message,
        time: message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        socketId: socket.id
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Explorer disconnected: ${socket.id}`);
    });
  });
};
