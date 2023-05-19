/* eslint-disable prettier/prettier */
import { InjectQueue } from "@nestjs/bull";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression, Interval, SchedulerRegistry } from '@nestjs/schedule';
import axios from "axios";
import { Queue } from "bull";
import { randomUUID } from 'crypto';
import { OrdersRepository } from "../repository/orders.repository";
import { CreateOrderServise } from "@app/shared/ikko/orderServies/createOrder.servise";
import { OrderDTO } from "@app/shared/ikko/dto/subcriberBodyOrder.dto";
import { IsubscriberBodyBody } from "@app/shared/@types";

/* eslint-disable prettier/prettier */
@Injectable()
export class OrdersServise{
	
	constructor(
		@InjectQueue('order') private orderQueue: Queue,
		private schedulerRegistry: SchedulerRegistry,
		@Inject(OrdersRepository) private readonly Repository,
		private readonly createOrderServise: CreateOrderServise
	) {

	}
	
	

	//создание заказа
	async createOrder(bodyOrder:IsubscriberBodyBody){
		
		try {
			const result = await this.createOrderServise.createOrder()
			await this.Repository.orderUpdateBYhash(bodyOrder.orderbody.hash,{
				orderId:result.id,
				orderStatus:result.creationStatus
			})
			
			
			return result
		} catch (errors) {
			if(errors.response.data){
				const errorData = errors.response.data
				if(errorData){
					const result = await this.Repository.orderError({orderHash:bodyOrder.orderbody.hash},errorData)
					console.log(result);
				
				}
		
			}
			
		}
	}

	//запуск очереди с счечиком
	async orderQueueHandler(order:any,counter:any){
		const jobId = `order:${randomUUID()}`;



		//отправка джобы
		const job = await this.orderQueue.add('submit_order',
			{
				"organizationId": order.organizationId,
				"orderIds": [
					order.id
				]
			},
			{			
				jobId
			}
		);
		
		//проверка количества тиков счечиком и оставновка при ошибке
		if (counter >= 2){
			const interval = this.schedulerRegistry.getInterval(order.id);
			//await job.queue.off()
			clearInterval(interval); 
			await this.Repository.orderError({orderId:order.id},{error:"Привышено время ожидания"})
		}	

		console.log(counter);
		console.log('отправка джобы'); 
	}

	//счечик
	async addInterval(order:any) {
		const milliseconds = 5000
		if(order){
			let counter = 0			
		  const interval = setInterval(async () => {
				await this.orderQueueHandler(order,counter)
				counter++
			}, milliseconds); 
		  this.schedulerRegistry.addInterval(order.id, interval);
		}
			
		
	} 


	
}