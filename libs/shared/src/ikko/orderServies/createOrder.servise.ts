/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { IIkoAxios } from "../request/ikko.request";
import { BodyOrderServise } from "./bodyOrder.servise";

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
		console.log('bpdyy',body);
		const result = await this.ikkoRequest.orderCreateDelivery(body)
		return result

	}

	async statusOrder(body:any){
		const result = await this.ikkoRequest.orderCheckStatusOrderDelivery(body)
		return result
	}
}