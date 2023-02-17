import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto, UpdateUserDto} from "./dto/createUser.dto";
import {Types} from "mongoose";

@Controller('user')
export class UserController {
    constructor(private  userService: UserService) {
    }

    @Get('list')
    getUser(){
        return this.userService.getUsers()
    }

    @Post('create')
    createUser(@Body() dto: CreateUserDto){
        return this.userService.createUser(dto)
    }

    @Get('by_id/:id')
    getUserById(@Param('id') id: Types.ObjectId){
        return this.userService.getUserById(id)
    }

    @Put('update')
    updateUser(@Body() dto: UpdateUserDto){
        return this.userService.updateUser(dto)
    }

    @Put('status/:id')
    changeUserStatus(@Param('id') id: Types.ObjectId, @Body() body: {status: boolean}){
        return this.userService.changeStatus(id, body.status)
    }

    @Delete('delete/:id')
    deleteUser(@Param('id') id: Types.ObjectId){
        return this.userService.deleteUser(id)
    }

    @Get('status/:id')
    getStatus(@Param('id') id: string){
        return this.userService.getStatus(id)
    }
}
