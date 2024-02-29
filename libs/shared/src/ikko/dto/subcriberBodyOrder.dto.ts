/* eslint-disable prettier/prettier */
import { OrderTypesEnum,OrderPaymentTypes } from "@app/shared/common/constants/order.const";
import { BadRequestException } from "@nestjs/common";


export class OrderDTO {

    organization: string;


    name: string;


    date:string
    

    address: {
        city: string;
        street: string;
        home: number;
        flat: number;
        intercom: number;
        entrance: number;
        floor: number;
				kladrid:{
					classifierId:string
				}
				cordAdress?:number[]
    };


    orderType: OrderTypesEnum;

		orderTable:{
			section: string
			id: string
			numb: number
		}

    phone: string;
		terminal:string

    comment: string;
		localhost:string


    paymentMethod:any;

		orderAmount:number

		timedelivery:string
		hash:string

    email?: string;
		paymentsum:number
		organizationid:string
		
}
