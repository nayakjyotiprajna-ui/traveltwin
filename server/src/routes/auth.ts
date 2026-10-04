import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'traveltwin_super_secret_jwt_key_2026_modern_secure_token';
const JWT_EXPIRES = '7d';

const makeToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const sanitize = (u: any) => {
  const obj = u.toObject ? u.toObject() : { ...u };
  delete obj.passwordHash;
  obj.id = obj._id?.toString() || obj.id;
  return obj;
};

// POST /api/auth/register
router.post('/register', async (req, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    const token = makeToken(user._id.toString());

    res.status(201).json({ success: true, token, user: sanitize(user) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const token = makeToken(user._id.toString());
    res.json({ success: true, token, user: sanitize(user) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: sanitize(req.user!) });
});

// PUT /api/auth/preferences
router.put('/preferences', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      travelPreferences,
      accessibilityPreferences,
      travelStyle,
      budgetPreference,
      preferredEnvironment,
      avatar,
      name
    } = req.body;

    const update: Record<string, any> = {};
    if (travelPreferences) update.travelPreferences = travelPreferences;
    if (accessibilityPreferences) update.accessibilityPreferences = accessibilityPreferences;
    if (travelStyle) update.travelStyle = travelStyle;
    if (budgetPreference) update.budgetPreference = budgetPreference;
    if (preferredEnvironment) update.preferredEnvironment = preferredEnvironment;
    if (avatar) update.avatar = avatar;
    if (name) update.name = name;

    const user = await User.findByIdAndUpdate(req.user!._id, update, { new: true }).select('-passwordHash');
    res.json({ success: true, user: sanitize(user!) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
