import mongoose, { Schema, Document } from 'mongoose';

export interface IPassportEntry extends Document {
  user: mongoose.Types.ObjectId;
  destination: string;
  stamp: string;
  xpEarned: number;
  completedAt: Date;
}

const PassportEntrySchema = new Schema<IPassportEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    stamp: { type: String, required: true },
    xpEarned: { type: Number, default: 300 },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const PassportEntry = mongoose.model<IPassportEntry>('PassportEntry', PassportEntrySchema);
