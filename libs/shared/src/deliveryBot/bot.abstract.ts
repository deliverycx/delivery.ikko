/* eslint-disable prettier/prettier */
import { BotReverveTableDTO } from "./bot.DTO";

export interface ICustomer {
    name: string;
    phone: string;
}

export abstract class IBotService {
    abstract sendDuplicate(
        address: string,
        customer: ICustomer,
        comment: string,
        organization: string,
        cart: Array<any>,
        orderTypeName: string,
				orderType:string,
				ONSPOTTable:number
  ): void;
  abstract PaymentOrder(organizationId,data:any)
	abstract ReturnPaymentOrder(organizationId,data:any)
	abstract canselPaymentOrder(organizationId,data?:any)
  abstract sendReserveTable(data:BotReverveTableDTO)
}
