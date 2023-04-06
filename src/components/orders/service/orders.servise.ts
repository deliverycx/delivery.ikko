/* eslint-disable prettier/prettier */
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression, Interval, SchedulerRegistry } from '@nestjs/schedule';
import axios from "axios";
import { Queue } from "bull";
import { randomUUID } from 'crypto';

/* eslint-disable prettier/prettier */
@Injectable()
export class OrdersServise{
	constructor(
		@InjectQueue('order') private orderQueue: Queue,
		private schedulerRegistry: SchedulerRegistry
	) {}
	
	body(){
		return {
				"organizationId": "c3fa20d3-3d8e-4049-9a65-37b5820add65",
				"terminalGroupId": "46f3c7ad-f4ce-d5fd-0182-209aee080063",
				"createOrderSettings": {
						"mode": "Async"
				},
				"order": {
						"phone": "+971123456789",
						"orderTypeId": "76067ea3-356f-eb93-9d14-1fa00d082c4e",
						"customer": {
								"name": "Test test",
								"surname": "",
								"email": "a@a.com"
						},
						"deliveryPoint": {
								"address": {
										"street": {
												"classifierId": "9100000700011760001",
												"city": "Великий Новгород"
										},
										"house": "10",
										"floor": "",
										"flat": "",
										"entrance": "",
										"doorphone": ""
								},
								"comment": ""
						},
						"comment": "test\n нужен скриншот",
						"guests": {
								"count": 1,
								"splitBetweenPersons": false
						},
						"items": [
								{
										"type": "Product",
										"productId": "0fa191c9-48b6-2d63-0182-223a0a5e79af",
										"amount": 5,
										"modifiers": []
								}
						]
				}
		}
	}

	async orderQueueHandler(order:any,counter:any){
		const jobId = `order:${randomUUID()}`;



		const job = await this.orderQueue.add('submit_order',
			{
				"organizationId": order.organizationId,
				"orderIds": [
					order.id
				]
			},
			{
				
				backoff:1000,
				attempts:5,
				removeOnFail:5,
				jobId
			}
		);
		
		if (counter >= 15){
			const interval = this.schedulerRegistry.getInterval('qq');
			clearInterval(interval); 
		}	

		console.log(counter);
		console.log('отправка джобы');
	}

	
	async addInterval(name: string, milliseconds: number) {
	  
				const resposetoken = await axios.post<{token:string}>(
					`https://api-ru.iiko.services/api/1/access_token`,
					{
						apiLogin: "8991a0c8-0af"
					}
			);
			


				const token = resposetoken.data.token
				const { data } = await axios.post(
					`https://api-ru.iiko.services/api/1/deliveries/create`,
					this.body(),
					{
						headers: { Authorization: `Bearer ${token}` } 
					}
				);
				//console.log(data.orderInfo);
		let counter = 0			
	  const interval = setInterval(async () => {
			await this.orderQueueHandler(data.orderInfo,counter)
			counter++
		}, milliseconds); 
	  this.schedulerRegistry.addInterval(name, interval);
	} 


	
}