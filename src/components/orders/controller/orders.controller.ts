/* eslint-disable prettier/prettier */
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrdersServise } from '../service/orders.servise';
import { Controller, Logger } from '@nestjs/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersServise: OrdersServise) {}

	
	@EventPattern('order_created')
	async handleOrderCreate(@Payload() subscriberBody: any,@Ctx() context: RmqContext){
		try {
			console.log('micro');
			//await this.ordersServise.orderQueueHandler()
			this.ordersServise.addInterval('qq',5000)
			//await this.ordersServise.handk()

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
