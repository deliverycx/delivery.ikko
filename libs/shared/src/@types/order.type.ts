/* eslint-disable prettier/prettier */

import { OrderDTO } from '../ikko/dto/subcriberBodyOrder.dto';

interface INestedAddressBody {
	address:{
		street:{
			classifierId: string, //orderInfo.address.street
			city:string
		},
		house:string,
		floor:string,
		flat:string,
		entrance:string,
		doorphone:string
	},
	comment:`${string},${string}`
}
interface INestedItemsBody {
	id: string;
	name: string;
	amount: number;
	price?: number;
}
interface INestedOrderBody {
	phone: string,
	customer: {
		name: string,
		comment: string
	},
	deliveryPoint:INestedAddressBody
	guests: {
		count: 1,
		splitBetweenPersons: false
	},
	items:INestedItemsBody[]
	comment: string,
	orderTypeId:string,
	payments:any
}

export interface IOrderBody {
	organizationId: string,
	terminalGroupId: string,
	createOrderSettings: {
		mode: "Async"
	},
	order: INestedOrderBody;
}

export interface ICart {
	"id": string,
	"productName": string,
	"productImage": string,
	"productId": string,
	"amount": number,
	"price": number,
	"oneprice": number,
	"productTags": string[],
	"productobj": string
}

export type IsubscriberBodyBody = {
	orderbody: OrderDTO,
	cart: ICart[]
}