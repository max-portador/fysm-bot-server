import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AlgFromDb, IAlg } from './algorithm.model';
import { AlgorithmDto } from './dto/AlgorithmDto';

@Injectable()
export class AlgorithmService {
  constructor(
    @InjectModel('Algorithm') private readonly algModel: Model<IAlg>,
  ) {}

  async addAlgorithm({ name, type, media }: AlgorithmDto) {
    const alg = await this.algModel.create({ name, type, media });
    if (!alg) {
      return new Error('Failure adding new algorithm');
    }
    return alg;
  }

  async updateAlgorithm({ _id, name, type, media }: AlgFromDb) {
    const alg = await this.algModel.findOne({ _id });
    console.log(media);
    if (!alg) {
      return new Error('Failure updating algorithm');
    }

    alg.name = name;
    alg.type = type;
    alg.media = media;
    console.log(alg.media);
    return await alg.save();
  }

  async getFullList() {
    const list = await this.algModel.aggregate([
      {
        $lookup: {
          from: 'practices',
          localField: '_id',
          foreignField: 'algorithm_id',
          as: 'practices',
        },
      },
      {
        $addFields: {
          practice_count: {
            $size: '$practices',
          },
          volume: {
            $reduce: {
              input: {
                $map: {
                  input: {
                    $filter: {
                      input: '$practices',
                      as: 'elem',
                      cond: { $eq: ['$$elem.type', 'algorithm'] },
                    },
                  },
                  as: 'el',
                  in: {
                    volume: {
                      $multiply: ['$$el.breaths', '$$el.rounds'],
                    },
                  },
                },
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this.volume'] },
            },
          },
        },
      },
      {
        $sort: {
          practice_count: -1,
        },
      },
    ]);
    if (!list) {
      return new Error('Failure getting algorithms');
    }
    return list;
  }

  async getAll() {
    const list = await this.algModel.find({});
    if (!list) {
      return new Error('Failure getting algorithms');
    }
    return list;
  }

  async getByName(name: string) {
    const alg = await this.algModel.findOne({ name });
    if (!alg) {
      return new Error('Failure finding algorithm ' + name);
    }
    return alg;
  }

  async getById(_id: ObjectId) {
    const alg = await this.algModel.findOne({ _id });
    if (!alg) {
      return new Error('Failure finding algorithm');
    }
    return alg;
  }

  async deleteById(_id: ObjectId) {
    const alg = await this.algModel.findOneAndDelete({ _id });
    if (!alg) {
      return new Error('Failure removing algorithm');
    }
    return alg;
  }
}
