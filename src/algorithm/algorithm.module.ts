import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmController } from './algorithm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlgorithmSchema } from './algorithm.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Algorithm', schema: AlgorithmSchema }]),
  ],
  providers: [AlgorithmService],
  controllers: [AlgorithmController],
})
export class AlgorithmModule {}
