/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { IBotService, ICustomer } from "./bot.abstract";
import { BotAxios } from "./bot.axios";
import { BotReverveTableDTO } from "./bot.DTO";
import { IorderSendBot } from "./interfaces";
import { IOrderBody, IOrderEntiti } from "../@types";
import { OrderServise } from "../ikko/orderServies/order.servise";

@Injectable()
export class BotService{
		private botRequest
		private orderServise:OrderServise
    constructor() {
				this.botRequest = new BotAxios()
				this.orderServise = new OrderServise()
    }

    public async sendDuplicate(
        orderBody:IOrderEntiti
    ) {
				const {name:orderTypeName} = await this.orderServise.getOrderTypesId(orderBody.orderParams.orderType,orderBody.organization)

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
							customermoneu:orderBody.orderParams.money
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
