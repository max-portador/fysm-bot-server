import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from './user.model';
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async getUsers() {
    const users = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'practices',
          localField: '_id',
          foreignField: 'user_id',
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
                  input: '$practices',
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
          volume: -1,
        },
      },
    ]);
    return users;
  }

  async createUser(dto: CreateUserDto) {
    const { tgUsername, tgId, isActive, expirationMonths, role } = dto;

    let expireDate = undefined;

    if (isActive && expirationMonths) {
      const date = new Date();
      date.setMonth(date.getMonth() + expirationMonths);
      expireDate = date.getTime();
    }

    const user = await this.userModel.create({
      tgUsername,
      tgId,
      isActive,
      expireDate,
      role,
    });
    return user;
  }

  async updateUser(dto: UpdateUserDto) {
    const { _id, tgUsername, tgId, isActive, expirationMonths, role } = dto;
    const user = await this.userModel.findOne({ _id }, null, { strict: false });

    if (!user) {
      return new Error('cant find User');
    }

    if (isActive && expirationMonths) {
      const date = user.expireDate ? new Date(user.expireDate) : new Date();
      date.setMonth(date.getMonth() + expirationMonths);
      user.expireDate = date.getTime();
    }

    user.tgUsername = tgUsername;
    if (tgId) user.tgId = tgId;
    user.isActive = isActive;
    user.role = role;
    await user.save();
    return user;
  }

  async getUserByTgUsername(tgUsername: string) {
    const candidate = await this.userModel.find({ tgUsername });
    if (!candidate) {
      return new Error('User not found');
    }
    return candidate;
  }

  async getUserByTgId(tgId: number) {
    const candidate = await this.userModel.find({ tgId });
    if (!candidate) {
      return new Error('User not found');
    }
    return candidate;
  }

  async getUserById(_id: Types.ObjectId) {
    const candidate = await this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: 'practices',
          localField: '_id',
          foreignField: 'user_id',
          as: 'practices',
        },
      },
      {
        $unwind: {
          path: '$practices',
        },
      },
      {
        $lookup: {
          from: 'algorithms',
          localField: 'practices.algorithm_id',
          foreignField: '_id',
          as: 'algorithms',
        },
      },
      {
        $lookup: {
          from: 'ons',
          localField: 'practices.algorithm_id',
          foreignField: '_id',
          as: 'ons',
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          isActive: 1,
          lastRequest: 1,
          equalityMode: 1,
          sendAlgPhoto: 1,
          tgUsername: 1,
          tgId: 1,
          role: 1,
          practices: {
            $arrayElemAt: [
              {
                $map: {
                  input: {
                    $cond: {
                      if: { $eq: [{ $size: '$algorithms' }, 0] },
                      then: '$ons',
                      else: '$algorithms',
                    },
                  },
                  as: 'algorithm',
                  in: {
                    $mergeObjects: ['$practices', '$$algorithm'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          first_name: { $first: '$first_name' },
          last_name: { $first: '$last_name' },
          tgUsername: { $first: '$tgUsername' },
          tgId: { $first: '$tgId' },
          isActive: { $first: '$isActive' },
          role: { $first: '$role' },
          lastRequest: { $first: '$lastRequest' },
          equalityMode: { $first: '$equalityMode' },
          sendAlgPhoto: { $first: '$sendAlgPhoto' },
          practices: { $push: '$practices' },
        },
      },
    ]);
    if (!candidate?.length) {
      const user = await this.userModel.findOne({ _id });
      return user || new Error('User not found');
    }

    return candidate[0];
  }

  async changeStatus(_id: Types.ObjectId, status: boolean) {
    const candidate = await this.userModel.findOne({ _id });
    if (!candidate) {
      return new Error('User not found');
    }
    candidate.isActive = status;
    return await candidate.save();
  }

  async deleteUser(_id: Types.ObjectId) {
    return this.userModel.findByIdAndDelete({ _id });
  }

  async getStatus(id: string) {
    let candidate = await this.userModel.findOne({ tgUsername: id });
    if (!candidate && Number.isInteger(+id)) {
      candidate = await this.userModel.findOne({ tgId: Number(id) });
    }
    if (!candidate) {
      return false;
    }
    return candidate.isActive;
  }
}
