import mongoose, { Document } from 'mongoose';

export enum AlgType {
  TOP = 'Вверх',
  CENTER = 'Центр',
  BOTTOM = 'Низ',
}

export const AlgorithmSchema = new mongoose.Schema({
  name: { type: String, unique: true, require: true },
  type: { type: String, require: true },
  media: [{ type: String }],
});

export interface IAlg {
  name: string;
  type: AlgType;
  media?: string[];
}

export interface AlgFromDb extends IAlg, Document {}
