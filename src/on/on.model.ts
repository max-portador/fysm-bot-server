import mongoose, { Document } from 'mongoose';

export const OnSchema = new mongoose.Schema({
  name: { type: String, unique: true, require: true },
  media: [{ type: String }],
});

export interface IOn {
  name: string;
  media?: string[];
}

export interface OnFromDb extends Document, IOn {}

export type OnDto = IOn;
