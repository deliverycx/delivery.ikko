/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { AudioConsumer } from './processor.controller';
import { RmqModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import * as path from "path";

@Module({
  imports: [
		ConfigModule.forRoot({
      envFilePath: path.resolve(
          __dirname,
          `../../.${process.env.NODE_ENV}.env`
      )
    }),
		BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
		BullModule.registerQueue({
			name: 'audio',
		}),
		RmqModule
	],
  controllers: [AppController],
  providers: [AppService,AudioConsumer],
})
export class AppModule {}
