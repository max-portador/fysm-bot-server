import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AggregatedPractice, Practice } from './practice.model';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel('Practice') private readonly practiceModel: Model<Practice>,
  ) {}

  async getAllbyTgId(telegram_id: number) {
    const filter = { tgId: { $eq: telegram_id }, type: { $eq: 'algorithm' } };
    const list = await this.practiceModel.aggregate([
      { $match: filter },
      {
        $addFields: {
          volume: {
            $multiply: ['$breaths', '$rounds'],
          },
        },
      },
      {
        $group: {
          _id: '$algorithm_id',
          volume: {
            $sum: '$volume',
          },

          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'algorithms',
          localField: '_id',
          foreignField: '_id',
          as: 'joinedData',
        },
      },
      {
        $project: {
          volume: '$volume',
          count: '$count',
          algorithm_obj: { $arrayElemAt: ['$joinedData', 0] },
        },
      },
      {
        $project: {
          volume: '$volume',
          count: '$count',
          algorithm_name: '$algorithm_obj.name',
        },
      },
      {
        $sort: {
          volume: -1,
        },
      },
    ]);
    return list as AggregatedPractice[];
  }
}
