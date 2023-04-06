/* eslint-disable prettier/prettier */
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Job } from 'bull';
import axios from 'axios';


@Processor('order')
export class OrdersConsumer {
	
	constructor(private schedulerRegistry: SchedulerRegistry) {}

	async token() {
		const { data } = await axios.post<{token:string}>(
				`https://api-ru.iiko.services/api/1/access_token`,
				{
					apiLogin: "8991a0c8-0af"
				}
		);
		
		return data.token;
	}

  @Process('submit_order')
  async transcode(job: Job<unknown>) {
		const token = await this.token()
		const { data } = await axios.post(
			`https://api-ru.iiko.services/api/1/deliveries/by_id`,
			job.data,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		const interval = this.schedulerRegistry.getInterval('qq');
		

		const order = data.orders[0]
		if(order.creationStatus === 'Error'){
			
			
			clearInterval(interval); 
		}else{
			
		} 
		

	

		return order
  }




	@OnQueueActive()
  async onActive(job: Job) { 
		console.log('джоба');  
	
		
  }


	@OnQueueCompleted() 
	async complite(job: Job){
		
		console.log('OnQueueCompleted закончилась',job.returnvalue);
	}

	@OnQueueStalled()
	stalled(job: Job){
		console.log('остановилось');
	}

	@OnQueueFailed()
	falis(job: Job,err:Error){
		console.log('сломалось ',err.message);
	}

	

	@OnQueueError()
	error(){
		console.log('ошибка ');
	}
}