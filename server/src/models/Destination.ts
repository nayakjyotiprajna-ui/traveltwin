import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  culture: string;
  food: string[];
  attractions: string[];
  activities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    audioGuidesAvailable: boolean;
    lowPhysicalDemand: boolean;
    restAreasScore: number;
    highlights: string[];
  };
  budget: {
    estimatedPerDay: number;
    currency: string;
    level: string;
  };
  bestTime: string;
  estimatedDuration: string;
  image: string;
  panorama?: string;
  threeDType: string;
  threeDModel?: string;
  categories: string[];
  hotspots: Array<{
    id: string;
    title: string;
    description: string;
    audioNarration?: string;
    position: [number, number, number];
    category: string;
  }>;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    culture: { type: String, required: true },
    food: { type: [String], default: [] },
    attractions: { type: [String], default: [] },
    activities: { type: [String], default: [] },
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      audioGuidesAvailable: { type: Boolean, default: true },
      lowPhysicalDemand: { type: Boolean, default: true },
      restAreasScore: { type: Number, default: 8 },
      highlights: { type: [String], default: [] }
    },
    budget: {
      estimatedPerDay: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      level: { type: String, default: 'Moderate' }
    },
    bestTime: { type: String, required: true },
    estimatedDuration: { type: String, required: true },
    image: { type: String, required: true },
    panorama: { type: String },
    threeDType: { type: String, required: true },
    threeDModel: { type: String },
    categories: { type: [String], default: [] },
    hotspots: [
      {
        id: String,
        title: String,
        description: String,
        audioNarration: String,
        position: [Number],
        category: String
      }
    ],
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

export const Destination = mongoose.model<IDestination>('Destination', DestinationSchema);
