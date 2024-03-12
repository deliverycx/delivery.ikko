/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { IIkoAxios } from "../request/ikko.request";
import { BodyOrderServise } from "./bodyOrder.servise";
import { OrderTypesEnum } from "@app/shared/common/constants/order.const";
import { RedisClient } from "redis";
import { REDIS } from "src/redis.module";

@Injectable()
export class CreateOrderServise extends BodyOrderServise{
	//private readonly ikkoRequest = new IIkoAxios()
	//private bodyOrder:BodyOrderServise

	constructor(@Inject(REDIS) private readonly redis: RedisClient,){
		super()
		//this.bodyOrder = new BodyOrderServise()
	}

	async createOrder(bodyOrder){
		const redisToken = new Promise((resolve, reject) => {
			this.redis.get("token", (err, token) => {
				if (!err) {
					resolve(token)
				} else {
					reject(err)
				}
			});
		})

		const tokeninRedis = await redisToken
		console.log('token',tokeninRedis);
		const body = await this.bilderBody(bodyOrder)
		
		if(this.getsubscriberBodyOrder.orderType === OrderTypesEnum.ONSPOT){
			return await this.ikkoRequest.orderCreate(body)
		}else{
			return await this.ikkoRequest.orderCreateDelivery(body)
		}

	}

	async statusOrder(body:any){
		if(this.getsubscriberBodyOrder.orderType === OrderTypesEnum.ONSPOT){
			return await this.ikkoRequest.orderCheckStatusOrder(body)
		}else{
			return await this.ikkoRequest.orderCheckStatusOrderDelivery(body)
		}
	}
}