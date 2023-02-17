import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {IOn} from "./on.model";
import {ObjectId} from "mongodb";

@Injectable()
export class OnService {
    constructor(@InjectModel ('On') private onModel: Model<IOn>) {
    }

    async getAll(){
        return this.onModel.find({}, null, { sort: { name: 1 } })
    }

    async getOnById(_id: Types.ObjectId){
        const on = await this.onModel.aggregate([
            {
                $match: {
                    _id: new ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: 'practices',
                    localField: '_id',
                    foreignField: 'algorithm_id',
                    as: 'practices'
                }
            }
        ])
        if (!on?.length) {
            return new Error('User not found')
        }
        return on[0]
    }

    async updateMedia(_id: Types.ObjectId, media: string[]){
        const on = await this.onModel.findOne({_id}, null, { strict: false})
        if (!on) {
            return new Error('Can`t find On')
        }
        on.media = media
        return on.save()
    }
}
