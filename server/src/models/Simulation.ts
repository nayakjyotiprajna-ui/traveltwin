import mongoose, { Schema, Document } from 'mongoose';

export interface ISimulation extends Document {
  user: mongoose.Types.ObjectId;
  destination: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  travellers: number;
  budget: string;
  accommodation: string;
  transportation: string;
  activities: string[];
  accessibility: string[];
  results: {
    estimatedDuration: string;
    estimatedBudget: number;
    currency: string;
    accommodationDetail: string;
    transportationDetail: string;
    crowdLevel: string;
    crowdInsight: string;
    weatherConditions: {
      temp: string;
      condition: string;
      clothingAdvice: string;
    };
    accessibilityAnalysis: {
      score: number;
      rating: string;
      notes: string[];
    };
    potentialChallenges: string[];
    aiRecommendations: string[];
  };
  createdAt: Date;
}

const SimulationSchema = new Schema<ISimulation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    dates: {
      startDate: { type: String, required: true },
      endDate: { type: String, required: true }
    },
    travellers: { type: Number, default: 1 },
    budget: { type: String, required: true },
    accommodation: { type: String, required: true },
    transportation: { type: String, required: true },
    activities: { type: [String], default: [] },
    accessibility: { type: [String], default: [] },
    results: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

export const Simulation = mongoose.model<ISimulation>('Simulation', SimulationSchema);
