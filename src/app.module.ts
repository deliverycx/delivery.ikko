/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { RmqModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import * as path from "path";
import { OrderModule } from './components/orders/module/orders.module';

@Module({
  imports: [
		ConfigModule.forRoot({
      envFilePath: path.resolve(
          __dirname,
          `../../.${process.env.NODE_ENV}.env`
      )
    }),
	
		OrderModule
	],

})
export class AppModule {}
