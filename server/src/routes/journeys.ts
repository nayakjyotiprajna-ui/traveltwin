import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { Journey } from '../models/Journey.js';
import { User } from '../models/User.js';

const router = Router();

// GET /api/journeys — user's journey history
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const journeys = await Journey.find({ user: req.user!._id }).sort({ startedAt: -1 }).lean();
    res.json({ success: true, journeys });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/journeys — start a new journey
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, mode } = req.body;
    if (!destination || !mode) {
      res.status(400).json({ success: false, message: 'destination and mode are required.' });
      return;
    }

    const journey = await Journey.create({
      user: req.user!._id,
      destination,
      mode,
      status: 'started',
      progress: 0
    });

    res.status(201).json({ success: true, journey });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/journeys/:id — update journey progress
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { progress, status, activities } = req.body;
    const update: Record<string, any> = {};
    if (progress !== undefined) update.progress = progress;
    if (status) update.status = status;
    if (activities) update.activities = activities;
    if (status === 'completed') {
      update.completedAt = new Date();

      // Award XP on completion
      const xpGain = 150;
      await User.findByIdAndUpdate(req.user!._id, {
        $inc: { xp: xpGain }
      });
    }

    const journey = await Journey.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      update,
      { new: true }
    );

    if (!journey) {
      res.status(404).json({ success: false, message: 'Journey not found.' });
      return;
    }

    res.json({ success: true, journey });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
