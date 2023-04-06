/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
	constructor(@InjectQueue('order') private ordersQueue: Queue) {}
	
  getHello(): string {
    return 'Hello World!';
  }
	async cityMicro(){
		const job = await this.ordersQueue.add('masage',{
		  foo: 'bar',
		});
		console.log('отправка джобы');
	}
}
