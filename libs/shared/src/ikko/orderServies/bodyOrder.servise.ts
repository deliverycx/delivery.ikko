/* eslint-disable prettier/prettier */
import { OrderPaymentTypes, OrderTypesEnum } from "@app/shared/common/constants/order.const";
import { IIkoAxios } from "../request/ikko.request";
import { OrderServise } from "./order.servise";
import { IOrderBody } from "@app/shared/@types";

/* eslint-disable prettier/prettier */
export class BodyOrderServise extends OrderServise {
	protected bodyState: any


	orderBodyStates(val: any, metod?: 'order') {
		if (metod) {
			this.bodyState = {
				...this.bodyState,
				[metod]:{
					...this.bodyState[metod],
					...val
				}
			}
		} else {
			this.bodyState = { ...this.bodyState, ...val }
		}

	}

	public async bilderBody() {
		const typeOrder = await this.getOrderTypesId()
		const terminal = await this.teminalOrganization()

		this.commonBodyBrick(terminal)
		
		this.adressDeliveryBrick(this.getsubscriberBodyOrder.orderType)
		/*
		switch(this.getsubscriberBodyOrder.orderType){
			case OrderTypesEnum.COURIER:
				this.adressDeliveryBrick()
				break
			case OrderTypesEnum.ONSPOT:
				this.OnspotBrick()
				break
		}
		*/

		if(this.getsubscriberBodyOrder.orderType === OrderTypesEnum.ONSPOT){
			this.OnspotBrick()
		}

		this.orderBrick(typeOrder)
		this.paymentsBrick()

		console.log('body state',this.bodyState);
		return this.bodyState
	}

	private commonBodyBrick(terminal: string) {
		const res = {
			organizationId: this.getsubscriberBodyOrder.organization,
			terminalGroupId: terminal,
			createOrderSettings: {
				mode: "Async"
			},
		}
		this.orderBodyStates(res)
	}

	private orderBrick(orderTypeId: any) {
		
		const res = {
			phone: this.getsubscriberBodyOrder.phone,
			//completeBefore: orderInfo.date,
			customer: {
				name: this.getsubscriberBodyOrder.name,
				comment: this.getsubscriberBodyOrder.phone
			},
			guests: {
				count: 1,
				splitBetweenPersons: false
			},
			items: this.getsubscriberCartOrder,
			comment: this.getsubscriberBodyOrder.comment,
			orderTypeId: orderTypeId.id,
		}
		//console.log('ress',res);
		this.orderBodyStates(res, 'order')
	}

	private adressDeliveryBrick(orderType:string) {
		console.log('ordertype - ',orderType);
		const res = {
			deliveryPoint: orderType === OrderTypesEnum.COURIER ? {
				address: {
					street: {
						classifierId: this.getsubscriberBodyOrder.address.kladrid, //orderInfo.address.street
						city: this.getsubscriberBodyOrder.address.city
					},
					house: this.getsubscriberBodyOrder.address.home,
					floor: this.getsubscriberBodyOrder.address.floor,
					flat: this.getsubscriberBodyOrder.address.flat,
					entrance: this.getsubscriberBodyOrder.address.entrance,
					doorphone: this.getsubscriberBodyOrder.address.intercom
				},
				comment: `${this.getsubscriberBodyOrder.address.street},${this.getsubscriberBodyOrder.address.home}`
			}
			: null
		}
		
		this.orderBodyStates(res, 'order')
	}

	private OnspotBrick() {
		const res = {
			tableIds: [
				this.getsubscriberBodyOrder.orderTable.id
			],
		}
		this.orderBodyStates(res, 'order')
	}

	private paymentsBrick() {
		const res = {
			payments:this.getsubscriberBodyOrder.paymentMethod === OrderPaymentTypes.BYCARD
				? [
					{
						"paymentTypeKind": "Card",
						"sum": this.getsubscriberBodyOrder.paymentsum || 10,
						"paymentTypeId": "dfeb1b1e-36bb-4861-baf8-03be367e169a",

					}
				] :
				this.getsubscriberBodyOrder.paymentMethod === OrderPaymentTypes.CARD
					? [
						{
							"paymentTypeKind": "Card",
							"sum": this.getsubscriberBodyOrder.paymentsum,
							"paymentTypeId": "f2cc4be8-e7cb-405c-a4d8-c2712b5dc740",
							"isProcessedExternally": true
						}
					]
					: null
		}
		this.orderBodyStates(res, 'order')
		
	}




		body() {
		const res = this.bilderBody()
		
		return res
		/*
		return {
			"organizationId": "1b0eb12f-970d-44b6-8167-044c097f174b",
			"terminalGroupId": "387dc60c-eac9-42a0-8265-b7b1818a3fb1",
			"createOrderSettings": {
				"mode": "Async"
			},
			"order": {
				"phone": "+971123456789",
				"orderTypeId": "76067ea3-356f-eb93-9d14-1fa00d082c4e",
				"customer": {
					"name": "Test test",
					"surname": "",
					"email": "a@a.com"
				},
				"deliveryPoint": {
					"address": {
						"street": {
							"classifierId": "9100000700011760001",
							"city": "Симферополь"
						},
						"house": "10",
						"floor": "",
						"flat": "",
						"entrance": "",
						"doorphone": ""
					},
					"comment": ""
				},
				"comment": "test\n нужен скриншот",
				"guests": {
					"count": 1,
					"splitBetweenPersons": false
				},
				"items": [
					{
						"type": "Product",
						"productId": "b6445bb7-53b6-47e8-9a45-967c1c048e94",
						"amount": 5,
						"modifiers": []
					}
				]
			}
			
		}
		*/
	}
}