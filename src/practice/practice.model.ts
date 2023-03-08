import mongoose, { Types } from 'mongoose';

export interface Practice {
  user_id: Types.ObjectId;
  type: 'on' | 'algorithm';
  algorithm_id: Types.ObjectId;
  rounds: number;
  breaths: number;
  created_at: number;
  finished_at: number;
}

export interface AggregatedPractice {
  count: number;
  volume: number;
  algorithm_name: string;
}

export interface PracticeFromDB extends Document, Practice {}

export const PracticeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['on', 'algorithm'],
    require: true,
  },
  user_id: { type: Types.ObjectId, ref: 'User', require: true },
  algorithm_id: { type: Types.ObjectId, ref: 'Algorithm', require: true },
  rounds: { type: Number, require: true },
  breaths: { type: Number, require: true },
  created_at: { type: Number, require: true },
  finished_at: { type: Number, require: true },
});
