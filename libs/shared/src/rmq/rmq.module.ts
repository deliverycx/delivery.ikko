/* eslint-disable prettier/prettier */
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';
import * as path from "path";

interface RmqModuleOptions {
  name: string;
}

@Module({
	imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
				__dirname,
				`../.${process.env.NODE_ENV}.env`
		)
    }),
  ],
  providers: [RmqService,ConfigService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls:[`amqp://${process.env.RABBITMQ_HOST}`], //[`amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}`],
                queue: 'cats_queue', //configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}