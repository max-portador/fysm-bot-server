import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticeSchema } from './practice.model';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Practice', schema: PracticeSchema }]),
  ],
  providers: [PracticeService],
  controllers: [PracticeController],
})
export class PracticeModule {}
