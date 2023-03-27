/* eslint-disable prettier/prettier */
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {
  @Process('masage')
  async transcode(job: Job<unknown>) {
		const j = 'joba'
    const q = await job.progress(j);
		
		return j
  }

	@OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,job.data
    );
  }
}