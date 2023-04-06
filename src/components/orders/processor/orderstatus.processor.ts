/* eslint-disable prettier/prettier */
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('order')
export class OrdersStatusConsumer {
  @Process('status_order')
  async transcode(job: Job<unknown>) {
		const j = 'statuss joba111111'
		console.log('statussss',job);
    const q = await job.progress(j);
		//throw new Error()
		return j
  }

	

	@OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing statusss job ${job.id} of type ${job.name} with data ${job.data}...`,job.data
    );
		return 'processs jobaaa'
  }

	@OnQueueCompleted()
	async complite(job: Job){
		console.log('джоба коплит status',job.id);

		
	}
	
}