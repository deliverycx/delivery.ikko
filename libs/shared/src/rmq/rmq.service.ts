/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport, RmqContext } from "@nestjs/microservices";

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
		const USER = this.configService.get('RABBITMQ_USER');
    const PASSWORD = this.configService.get('RABBITMQ_PASS');
    const HOST = process.env.RABBITMQ_HOST //this.configService.get('RABBITMQ_HOST');


    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${HOST}`], //urls: [`amqp://${USER}:${PASSWORD}@${HOST}`]
        queue: 'cats_queue', //this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        queueOptions: {
		      durable: false
		    },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}