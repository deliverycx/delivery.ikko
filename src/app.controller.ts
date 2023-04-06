/* eslint-disable prettier/prettier */
import { Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, Res} from '@nestjs/common';
import { Response } from "express";
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
	

	@EventPattern('order_created')
  async handleUserCreated(@Payload() subscriber: any,@Ctx() context: RmqContext,) {
		try {


			
			console.log('клнекь',subscriber);
			await this.appService.cityMicro()
			
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
	/**/

	/*
	@MessagePattern({ cmd: 'get_analytics' })
  async accumulate(data: number[]) {
		
		const q = new Promise((res:any)=>{
			setTimeout(()=>{
				//(data || []).reduce((a, b) => res(a + b))
				throw Error('qq')
			},5000)
		})
		console.log(q);
		return q
  }
	*/

	/*
	@MessagePattern({ cmd: 'get_analytics' })
	async addSubscriber(
		@Payload() subscriber: any,
		@Ctx() context: RmqContext,
		
	) {
		try {


			const {data} = await axios.get('https://моб.тест.хинкалыч.рф/api/city/all')
			console.log('клнекь');
			
			const channel = context.getChannelRef();
		  const originalMsg = context.getMessage();
		  channel.ack(originalMsg);
 
			return data
			
		} catch (error) {
			Logger.warn(
        `An error occured while preparing the burger for ${context.getPattern()}.`
      );

      context.getChannelRef().reject(context.getMessage(), false)
			
		} 
		
	   
	}
	*/
}
