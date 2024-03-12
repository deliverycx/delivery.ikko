/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { IBotService, ICustomer } from "./bot.abstract";
import { BotAxios } from "./bot.axios";
import { BotReverveTableDTO } from "./bot.DTO";
import { IorderSendBot } from "./interfaces";
import { IOrderBody, IOrderEntiti } from "../@types";
import { OrderServise } from "../ikko/orderServies/order.servise";
import { OrderTypesEnum } from "../common/constants/order.const";

@Injectable()
export class BotService{
		private botRequest
		private orderServise:OrderServise
    constructor() {
				this.botRequest = new BotAxios()
				//this.orderServise = new OrderServise()
    }


		public async getOrderTypesId(orderType:string) {
			switch (orderType) {
				case OrderTypesEnum.PICKUP:
					return { name: "Самовывоз", id: '5b1508f9-fe5b-d6af-cb8d-043af587d5c2' }
				case OrderTypesEnum.COURIER:
					return { name: 'Доставка "Хинкалыч"', id: '9ee06fcc-8233-46fa-b74d-ff6f50128afb' }
				case OrderTypesEnum.ONSPOT:
					return { name: "За столом", id: 'bbbef4dc-5a02-7ea3-81d3-826f4e8bb3e0' }
			}
		}	
    public async sendDuplicate(
        orderBody:IOrderEntiti
    ) {
				//const {name:orderTypeName} = await this.orderServise.getOrderTypesId(orderBody.orderParams.orderType,orderBody.organization)
				const orderTypeName = this.getOrderTypesId(orderBody.orderParams.orderType)
        await this.botRequest.sendDuplicate(orderBody.organization, {
						orderid:orderBody.orderId,
						ordernumber:orderBody.orderNumber,
						orderdata:orderBody.orderParams.date,
						orderamount:orderBody.orderParams.orderAmount,
            address: orderBody.orderParams.address ? `${orderBody.orderParams.address.city},${orderBody.orderParams.address.street},${orderBody.orderParams.address.home}` : "",
            name: orderBody.orderParams.name,
            comment:orderBody.orderParams.comment,
            phone: orderBody.orderParams.phone,
            items: orderBody.orderItems.map((el) => {
                return {
                    amount: el.amount,
                    name: el.productName
                };
            }),
						orderTypeName:orderBody.orderParams.orderType,
            orderType:orderTypeName,
						ONSPOTTable:orderBody.orderParams.orderTable ? orderBody.orderParams.orderTable.numb : 0,
						deliveryParam:{
							timedelivery:orderBody.orderParams.timedelivery,
							customermoneu:orderBody.orderParams.money,
							devises:orderBody.orderParams.devises
						}
        });
    }
		public PaymentOrder(organizationId,data:any){
			this.botRequest.PaymentOrder(organizationId,data)
		}

		public ReturnPaymentOrder(organizationId,data:any){
			this.botRequest.ReturntPayment(organizationId,data)
		}

		public canselPaymentOrder(organizationId,data:any){
			this.botRequest.calseledPayment(organizationId,data)
		}

    public sendReserveTable(data:BotReverveTableDTO) {
			this.botRequest.reserveTable(data.organizationId,data)
    }
}
