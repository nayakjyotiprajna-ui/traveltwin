import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { TravelRoom } from '../models/TravelRoom.js';
import { User } from '../models/User.js';

const router = Router();

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const resolveUser = async (req: AuthRequest) => {
  if (req.user) return req.user;
  let guest = await User.findOne({ email: 'guest@traveltwin.app' });
  if (!guest) {
    guest = await User.create({
      name: 'Guest Explorer',
      email: 'guest@traveltwin.app',
      passwordHash: 'guest-not-for-login',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      travelStyle: 'Peaceful'
    });
  }
  return guest;
};

// POST /api/rooms/create
router.post('/create', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, destinationId } = req.body;
    if (!destination) {
      res.status(400).json({ success: false, message: 'destination is required.' });
      return;
    }

    const currentUser = await resolveUser(req);

    let roomCode = generateCode();
    // Ensure uniqueness
    while (await TravelRoom.findOne({ roomCode })) {
      roomCode = generateCode();
    }

    const room = await TravelRoom.create({
      roomCode,
      host: currentUser._id,
      destination,
      destinationId: destinationId || destination.toLowerCase().split(' ')[0] || 'kashmir',
      participants: [
        {
          user: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          status: 'exploring'
        }
      ]
    });

    res.status(201).json({ success: true, room });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rooms/:code
router.get('/:code', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const code = String(req.params.code).toUpperCase();
    const room = await TravelRoom.findOne({ roomCode: code }).lean();
    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }
    res.json({ success: true, room });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rooms/:code/join
router.post('/:code/join', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const code = String(req.params.code).toUpperCase();
    const room = await TravelRoom.findOne({ roomCode: code });
    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found. Check the code.' });
      return;
    }
    if (room.status !== 'active') {
      res.status(400).json({ success: false, message: 'This room has ended.' });
      return;
    }

    const currentUser = await resolveUser(req);
    const currentUserIdStr = currentUser._id.toString();

    const alreadyJoined = room.participants.some(
      (p) => p.user && p.user.toString() === currentUserIdStr
    );

    if (!alreadyJoined) {
      room.participants.push({
        user: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        status: 'exploring'
      });
      await room.save();
    }

    res.json({ success: true, room });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rooms/:code/stage
router.put('/:code/stage', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { stage } = req.body;
    const code = String(req.params.code).toUpperCase();
    const room = await TravelRoom.findOneAndUpdate(
      { roomCode: code },
      { currentStage: stage },
      { new: true }
    );
    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }
    res.json({ success: true, room });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
