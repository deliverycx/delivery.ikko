/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
	constructor(@InjectQueue('audio') private audioQueue: Queue) {}
	
  getHello(): string {
    return 'Hello World!';
  }
	async cityMicro(){
		const job = await this.audioQueue.add('masage',{
		  foo: 'bar',
		});
		console.log('отправка джобы');
	}
}
