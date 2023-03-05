import { Module } from '@nestjs/common';
import { OnController } from './on.controller';
import { OnService } from './on.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OnSchema } from './on.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'On', schema: OnSchema }])],
  controllers: [OnController],
  providers: [OnService],
})
export class OnModule {}
