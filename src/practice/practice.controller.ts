import { Controller, Get, Param } from '@nestjs/common';
import { PracticeService } from './practice.service';

@Controller('practice')
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Get('statistic/:id')
  getStatistic(@Param(':id') id: number) {
    return this.practiceService.getAllbyTgId(id);
  }
}
