import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  name: string;
  destination: string;
  category: 'landmark' | 'culture' | 'viewpoint' | 'sensory';
  xpValue: number;
  description: string;
}

const ActivitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    category: { type: String, enum: ['landmark', 'culture', 'viewpoint', 'sensory'], default: 'landmark' },
    xpValue: { type: Number, default: 120 },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
