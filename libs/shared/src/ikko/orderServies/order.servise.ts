/* eslint-disable prettier/prettier */
import { IsubscriberBodyBody } from "@app/shared/@types";
import { OrderTypesEnum } from "@app/shared/common/constants/order.const";
import { IIkoAxios } from "../request/ikko.request";

/* eslint-disable prettier/prettier */
export class OrderServise{

	public ikkoRequest
	private subscriberBodyOrder:IsubscriberBodyBody

	constructor(redis:any){
		this.ikkoRequest = new IIkoAxios(redis)
	}
	
	public set setSubscriberBodyOrder(body:IsubscriberBodyBody){
		this.subscriberBodyOrder = body
	}

	public get getsubscriberBodyOrder(){
		return this.subscriberBodyOrder.orderbody
	}

	public get getsubscriberCartOrder(){
		const requestOrderItems = [
			...this.subscriberBodyOrder.cart.map((cartEl:any) => {
					return {
							type: "Product",
							productId: cartEl.productId,
							modifiers: [],
							amount: cartEl.amount
					};
			}),
			//deliveryProductObject
		].filter(Boolean);
		return requestOrderItems
	}


	public async teminalOrganization(){
		const terminal = await this.ikkoRequest.termiralGroops(this.getsubscriberBodyOrder.organization)
		return terminal
	}

	public async getOrderTypesId(orderType?:string,organization?:string):Promise<any> {
		switch (orderType || this.getsubscriberBodyOrder.orderType) {
			case OrderTypesEnum.PICKUP:
				return { name: "Самовывоз", id: '5b1508f9-fe5b-d6af-cb8d-043af587d5c2' }
			case OrderTypesEnum.COURIER:
				return { name: 'Доставка "Хинкалыч"', id: '9ee06fcc-8233-46fa-b74d-ff6f50128afb' }
			case OrderTypesEnum.ONSPOT:
				return { name: "За столом", id: 'bbbef4dc-5a02-7ea3-81d3-826f4e8bb3e0' }
		}
		
		/*
		//console.log(this.getsubscriberBodyOrder);
		const ikkoOrderTypes = await this.ikkoRequest.orderTypes(organization || this.getsubscriberBodyOrder.organization);
		const result = ikkoOrderTypes.orderTypes[0].items.find((orderTypeEl) => {

			switch (orderType || this.getsubscriberBodyOrder.orderType) {
				case OrderTypesEnum.PICKUP:
					return '5b1508f9-fe5b-d6af-cb8d-043af587d5c2'
				case OrderTypesEnum.COURIER:
					return '9ee06fcc-8233-46fa-b74d-ff6f50128afb'
				case OrderTypesEnum.ONSPOT:
					return 'bbbef4dc-5a02-7ea3-81d3-826f4e8bb3e0'
			}
		});

		//console.log(result);
		return { name: result?.name, id: result?.id };
		*/
	}
}