/* eslint-disable prettier/prettier */
import { buildSchema, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'orders' } })
export class OrderModel {
		@prop()
		user!: any;

    @prop({ type: () => String })
	  public organization: string


		@prop({ type: () => String })
		public orderId:string

		@prop()
		public orderNumber:number

		@prop({ type: () => String })
		public orderHash:string

		@prop({ type: () => String })
		public orderStatus:string

		@prop({ type: () => Number })
		public orderAmount:number

		@prop({ type: () => Object })
		public orderItems:any

		@prop({ type: () => Object })
		public orderParams:any

		@prop({default: null })
		public orderError:any
}

