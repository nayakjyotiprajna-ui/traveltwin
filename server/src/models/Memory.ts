import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  user: mongoose.Types.ObjectId;
  destination: string;
  caption: string;
  image: string;
  date: string;
  tags: string[];
  createdAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Memory = mongoose.model<IMemory>('Memory', MemorySchema);
