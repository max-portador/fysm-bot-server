import {Body, Controller, Get, Param, Put} from '@nestjs/common';
import {OnService} from "./on.service";
import {Types} from "mongoose";
import {UpdateUserDto} from "../user/dto/createUser.dto";

@Controller('on')
export class OnController {
    constructor(private onService: OnService) {
    }

    @Get('list')
    getlist(){
        return this.onService.getAll()
    }

    @Get('by_id/:id')
    getUserById(@Param('id') id: Types.ObjectId){
        return this.onService.getOnById(id)
    }

    @Put('media/:id')
    changeUserStatus(@Param('id') id: Types.ObjectId, @Body() body: {media: string[]}){
        return this.onService.updateMedia(id, body.media)
    }
}
