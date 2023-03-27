/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/shared';

async function bootstrap() {
	/*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
    },
  );
	*/
	/*
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
	  transport: Transport.RMQ,
	  options: {
	    urls: ['amqp://localhost:5672'],
	    queue: 'cats_queue',
			noAck: false,
	    queueOptions: {
	      durable: false
	    },
	  },
	});

  await app.listen();
	*/
	const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('cats_queue'));
  await app.startAllMicroservices();
	await app.listen(5001);
}
bootstrap();
