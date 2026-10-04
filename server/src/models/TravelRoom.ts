import mongoose, { Schema, Document } from 'mongoose';

export interface ITravelRoom extends Document {
  roomCode: string;
  host: mongoose.Types.ObjectId;
  destination: string;
  destinationId?: string;
  participants: Array<{
    user?: mongoose.Types.ObjectId;
    name: string;
    avatar: string;
    status: string;
  }>;
  currentStage: string;
  status: 'active' | 'completed';
  createdAt: Date;
}

const TravelRoomSchema = new Schema<ITravelRoom>(
  {
    roomCode: { type: String, required: true, unique: true },
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    destinationId: { type: String, default: '' },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
        avatar: String,
        status: { type: String, default: 'exploring' }
      }
    ],
    currentStage: { type: String, default: 'Lobby' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
  },
  { timestamps: true }
);

export const TravelRoom = mongoose.model<ITravelRoom>('TravelRoom', TravelRoomSchema);
