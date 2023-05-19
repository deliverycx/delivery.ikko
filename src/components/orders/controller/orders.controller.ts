/* eslint-disable prettier/prettier */
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrdersServise } from '../service/orders.servise';
import { Controller, Logger } from '@nestjs/common';
import { CreateOrderServise } from '@app/shared/ikko/orderServies/createOrder.servise';
import { IsubscriberBodyBody } from '@app/shared/@types';

@Controller()
export class OrdersController {
  constructor(
		private readonly ordersServise: OrdersServise,
		private readonly createOrderServise: CreateOrderServise
	) {}

	
	@EventPattern('order_created')
	async handleOrderCreate(@Payload() subscriberBody: IsubscriberBodyBody,@Ctx() context: RmqContext){
		try {
			this.createOrderServise.setSubscriberBodyOrder = subscriberBody
			
			const order = await this.ordersServise.createOrder(subscriberBody)
			console.log('создал оредер',order);
			if(order){
				this.createOrderServise.setSubscriberBodyOrder = subscriberBody
				await this.ordersServise.addInterval(order)
			}
			
			
			
			
			const channel = context.getChannelRef();
			const originalMsg = context.getMessage();
			channel.ack(originalMsg);
		} catch (error) {
			Logger.warn(
        `An error occured while preparing the burger for ${context.getPattern()}.`
      );
      context.getChannelRef().reject(context.getMessage(), true)
		}
	}
}
