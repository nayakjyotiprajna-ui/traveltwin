import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = Router();

// POST /api/ai/travel-director
// Generates a mood-based destination recommendation
router.post('/travel-director', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, travelStyle, budgetPreference, accessibilityNeeds, preferredEnvironment } = req.body;

    if (!mood) {
      res.status(400).json({ success: false, message: 'Mood is required.' });
      return;
    }

    const result = await AIService.generateTravelDirectorAdvice({
      mood,
      travelStyle: travelStyle || req.user?.travelStyle,
      budgetPreference: budgetPreference || req.user?.budgetPreference,
      accessibilityNeeds: accessibilityNeeds || req.user?.accessibilityPreferences,
      preferredEnvironment: preferredEnvironment || req.user?.preferredEnvironment
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/destination-guide
// Answers a natural language question about a destination
router.post('/destination-guide', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destinationName, question, context } = req.body;

    if (!destinationName || !question) {
      res.status(400).json({ success: false, message: 'destinationName and question are required.' });
      return;
    }

    const answer = await AIService.answerDestinationQuestion({ destinationName, question, context });
    res.json({ success: true, answer });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/itinerary
// Generates a multi-day itinerary for a destination
router.post('/itinerary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, days = 4 } = req.body;

    if (!destination) {
      res.status(400).json({ success: false, message: 'destination is required.' });
      return;
    }

    const itinerary = await AIService.generateItinerary(destination, Number(days));
    res.json({ success: true, itinerary });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/simulate
// Analyzes a travel simulation
router.post('/simulate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const params = req.body;

    if (!params.destinationId) {
      res.status(400).json({ success: false, message: 'destinationId is required.' });
      return;
    }

    const analysis = await AIService.analyzeSimulation(params);
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
