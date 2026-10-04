import { Router, Request, Response } from 'express';
import { Destination } from '../models/Destination.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/destinations
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, country, search, limit = '20', page = '1' } = req.query as Record<string, string>;

    const filter: Record<string, any> = {};
    if (category) filter.categories = { $in: [category] };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [destinations, total] = await Promise.all([
      Destination.find(filter).skip(skip).limit(Number(limit)).lean(),
      Destination.countDocuments(filter)
    ]);

    res.json({
      success: true,
      destinations,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const destination = await Destination.findOne({ id: req.params.id }).lean();
    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found.' });
      return;
    }
    res.json({ success: true, destination });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/destinations (admin)
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, destination });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
