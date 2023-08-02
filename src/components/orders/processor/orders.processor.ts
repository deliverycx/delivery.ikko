/* eslint-disable prettier/prettier */
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Job } from 'bull';
import axios from 'axios';
import { CreateOrderServise } from '@app/shared/ikko/orderServies/createOrder.servise';
import { Inject } from '@nestjs/common';
import { OrdersRepository } from '../repository/orders.repository';
import { BotService } from '@app/shared/deliveryBot/bot.service';


@Processor('order')
export class OrdersConsumer {
	
	constructor(
		@Inject(OrdersRepository) private readonly orderRepository,
		private schedulerRegistry: SchedulerRegistry,
		private readonly createOrderServise: CreateOrderServise,
		private readonly botService: BotService
	) {}



  @Process('submit_order')
  async transcode(job: Job<any>) {

		const order = await this.createOrderServise.statusOrder(job.data)
		console.log('старус оредера',order);

		

		if(order && order.creationStatus === 'Error'){
			const interval = this.schedulerRegistry.getInterval(order.id);
			clearInterval(interval); 
			await this.orderRepository.orderUpdateBYID(order.id,{
				orderStatus:"ERROR",
				orderNumber:order.number,
				orderError:order.errorInfo
			})
			if(!order){
				const interval = this.schedulerRegistry.getInterval(order.id);
				clearInterval(interval);
				console.log('статуса нету');
			}
			console.log('ошибка в статусе');
		} 
		return order
  }

	@OnQueueActive()
  async onActive(job: Job) { 
		console.log('джоба');  
	
		
  }


	@OnQueueCompleted() 
	async complite(job: Job){
		if(job.returnvalue && job.returnvalue.creationStatus === 'Success'){
			const order = job.returnvalue
			const interval = this.schedulerRegistry.getInterval(order.id);
			clearInterval(interval); 
			const resultOrder = await this.orderRepository.orderUpdateBYID(order.id,{
				orderStatus:order.creationStatus,
				orderNumber:order.order.number,
				"orderParams.orderAmount":order.order.sum
			})
			await this.botService.sendDuplicate(resultOrder)
			
		} 
		
		console.log('OnQueueCompleted закончилась');
	}

	@OnQueueStalled()
	stalled(job: Job){
		const order = job.returnvalue
		const interval = this.schedulerRegistry.getInterval(order.id);
		clearInterval(interval);
	}

	 @OnQueueFailed()
	 async falis(job: Job,err:Error){
			const order = job.returnvalue
			const interval = this.schedulerRegistry.getInterval(order.id);
			clearInterval(interval); 
			await this.orderRepository.orderUpdateBYID(order.id,{
				orderStatus:order.creationStatus,
				orderError:err.message
			})
		console.log('сломалось ',err.message);
	}

	

	@OnQueueError()
	error(job: Job){
		const order = job.returnvalue
		const interval = this.schedulerRegistry.getInterval(order.id);
		clearInterval(interval);
	}
}