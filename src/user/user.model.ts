import mongoose from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  HOMIES = 'HOMIES',
  NOBODY = 'NOBODY',
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
}

export const UserSchema = new mongoose.Schema(
  {
    tgUsername: { type: String, require: true, unique: true },
    tgId: { type: Number, require: false },
    isActive: Boolean,
    expireDate: Number,
    role: { type: String, default: UserRole.NOBODY },
    equalityMode: { type: Boolean, default: false },
    sendAlgPhoto: { type: Boolean, default: true },
  },
  { strict: false },
);

export interface IUser {
  id: string;
  tgUsername: string;
  isActive: boolean;
  tgId?: number;
  expireDate: number;
  role: UserRole;
  equalityMode?: boolean;
  sendAlgPhoto?: boolean;
}
