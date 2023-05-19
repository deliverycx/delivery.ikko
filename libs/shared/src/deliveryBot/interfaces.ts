/* eslint-disable prettier/prettier */

import { ICustomer } from "./bot.abstract";

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Bot {
	export interface IRequestBody {
		items: Array<{
			name: string;
			amount: number;
		}>;
		comment: string;
		name: string;
		phone: string;
		address: string;
		orderTypeName: string;
		orderType: string;
		ONSPOTTable: number;
	}
	export interface IRequestBodyReserve {
		organizationId: string
		fullname: string
		date: string
		preson: number
		time: string
	}
}

export type IorderSendBot = {
	address: string,
	customer: ICustomer,
	comment: string,
	organization: string,
	cart: Array<any>,
	orderType: string,
	orderTypeName: string,
	ONSPOTTable: number
}	