import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AlgorithmModule } from './algorithm/algorithm.module';
import { OnModule } from './on/on.module';
import { PracticeModule } from './practice/practice.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AlgorithmModule,
    OnModule,
    PracticeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
