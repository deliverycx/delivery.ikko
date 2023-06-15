/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { IIkoAxios } from "../request/ikko.request";
import { BodyOrderServise } from "./bodyOrder.servise";
import { OrderTypesEnum } from "@app/shared/common/constants/order.const";

@Injectable()
export class CreateOrderServise extends BodyOrderServise{
	//private readonly ikkoRequest = new IIkoAxios()
	//private bodyOrder:BodyOrderServise

	constructor(){
		super()
		//this.bodyOrder = new BodyOrderServise()
	}

	async createOrder(){
		const body = await this.bilderBody()
		
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