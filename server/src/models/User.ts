import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: 'user' | 'admin';
  travelPreferences: string[];
  accessibilityPreferences: string[];
  travelStyle: string;
  budgetPreference: string;
  preferredEnvironment: string;
  xp: number;
  level: number;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    travelPreferences: { type: [String], default: ['Mountains', 'Peaceful'] },
    accessibilityPreferences: { type: [String], default: ['Low Motion', 'Text Guide'] },
    travelStyle: { type: String, default: 'Peaceful' },
    budgetPreference: { type: String, default: 'Moderate' },
    preferredEnvironment: { type: String, default: 'Alpine & Lakeside' },
    xp: { type: Number, default: 100 },
    level: { type: Number, default: 1 }
  },
  { timestamps: true }
);

// Method to verify password
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
