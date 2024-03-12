import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RedisModule } from 'src/redis.module';

@Module({
	imports:[RedisModule],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
