import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Journey } from '../models/Journey.js';
import { Memory } from '../models/Memory.js';

const router = Router();

// GET /api/users/stats — dashboard stats for current user
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [journeyCount, memoryCount, completedJourneys, user] = await Promise.all([
      Journey.countDocuments({ user: userId }),
      Memory.countDocuments({ user: userId }),
      Journey.countDocuments({ user: userId, status: 'completed' }),
      User.findById(userId).select('-passwordHash').lean()
    ]);

    // Compute level from XP: every 500 XP = 1 level
    const xp = user?.xp || 0;
    const level = Math.floor(xp / 500) + 1;

    res.json({
      success: true,
      stats: {
        xp,
        level,
        journeyCount,
        completedJourneys,
        memoryCount,
        nextLevelXp: level * 500
      },
      user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/xp — add XP to current user
router.put('/xp', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number') {
      res.status(400).json({ success: false, message: 'amount (number) is required.' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $inc: { xp: amount } },
      { new: true }
    ).select('-passwordHash');

    res.json({ success: true, xp: user?.xp, level: Math.floor((user?.xp || 0) / 500) + 1 });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
