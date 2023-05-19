/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { OrdersController } from "../controller/orders.controller";
import { OrdersRepository } from "../repository/orders.repository";
import { OrdersServise } from "../service/orders.servise";
import { RmqModule } from "@app/shared";
import { BullModule } from "@nestjs/bull";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { OrdersConsumer } from "../processor/orders.processor";
import { OrdersStatusConsumer } from "../processor/orderstatus.processor";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ADMIN_DB } from "src/database/config.mongodb";
import { OrderModel } from "src/database/order.model";
import { TypegooseModule } from "nestjs-typegoose";
import { CreateOrderServise } from "@app/shared/ikko/orderServies/createOrder.servise";
import { BotService } from "@app/shared/deliveryBot/bot.service";

@Module({
	imports: [
		ConfigModule.forRoot({
      envFilePath: path.resolve(
          __dirname,
          `../../.${process.env.NODE_ENV}.env`
      )
    }),
		TypegooseModule.forFeature([OrderModel], ADMIN_DB),
		BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
		BullModule.registerQueue({
			name: 'order',
		}),
		RmqModule
	],
  controllers: [OrdersController],
  providers: [
		OrdersServise,
		OrdersRepository,
		OrdersConsumer,
		SchedulerRegistry,
		CreateOrderServise,
		BotService
	],
})
export class OrderModule{

}