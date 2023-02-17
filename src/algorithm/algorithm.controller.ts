import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {AlgorithmService} from "./algorithm.service";
import {AlgorithmDto} from "./dto/AlgorithmDto";
import {ObjectId} from "mongoose";
import {AlgFromDb} from "./algorithm.model";

@Controller('algorithm')
export class AlgorithmController {
    constructor(private algorithmService: AlgorithmService) {
    }

    @Get('list')
    getList() {
        return this.algorithmService.getAll()
    }

    @Get(':id')
    getById(@Param('id') id: ObjectId) {
        return this.algorithmService.getById(id)
    }

    @Get(':name')
    getByName(@Param('name') name: string) {
        return this.algorithmService.getByName(name)
    }

    @Post('add')
    addAlgorithm(@Body() dto: AlgorithmDto) {
        return this.algorithmService.addAlgorithm(dto)
    }

    @Put('update')
    updateAlgorithm(@Body() dto: AlgFromDb) {
        console.log(dto)
        return this.algorithmService.updateAlgorithm(dto)
    }

    @Delete('delete/:id')
    deleteAlgorimth(@Param('id') id: ObjectId) {
        return this.algorithmService.deleteById(id)
    }
}
