import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { Memory } from '../models/Memory.js';
import { User } from '../models/User.js';

const router = Router();

// GET /api/memories
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const memories = await Memory.find({ user: req.user!._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, memories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/memories
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, caption, image, date, tags } = req.body;
    if (!destination || !caption || !image || !date) {
      res.status(400).json({ success: false, message: 'destination, caption, image, and date are required.' });
      return;
    }

    const memory = await Memory.create({
      user: req.user!._id,
      destination,
      caption,
      image,
      date,
      tags: tags || []
    });

    // Award XP for creating a memory
    await User.findByIdAndUpdate(req.user!._id, { $inc: { xp: 25 } });

    res.status(201).json({ success: true, memory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/memories/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const memory = await Memory.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
    if (!memory) {
      res.status(404).json({ success: false, message: 'Memory not found.' });
      return;
    }
    res.json({ success: true, message: 'Memory deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
