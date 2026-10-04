import mongoose, { Schema, Document } from 'mongoose';

export interface IJourney extends Document {
  user: mongoose.Types.ObjectId;
  destination: string;
  mode: 'virtual' | 'simulation';
  status: 'started' | 'in-progress' | 'completed';
  progress: number;
  activities: string[];
  startedAt: Date;
  completedAt?: Date;
}

const JourneySchema = new Schema<IJourney>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    mode: { type: String, enum: ['virtual', 'simulation'], required: true },
    status: { type: String, enum: ['started', 'in-progress', 'completed'], default: 'started' },
    progress: { type: Number, default: 0 },
    activities: { type: [String], default: [] },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Journey = mongoose.model<IJourney>('Journey', JourneySchema);
