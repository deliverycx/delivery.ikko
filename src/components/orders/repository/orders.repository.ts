/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { OrderModel } from "src/database/order.model";

/* eslint-disable prettier/prettier */
@Injectable()
export class OrdersRepository{
	constructor(
    @InjectModel(OrderModel) private readonly Model: ReturnModelType<typeof OrderModel>,
  ) {
		
	 }

	 async findOneOrder(hash:string){
			return await this.Model.findOne({orderHash:hash}).select('-__v')
	 }

	 async orderError(find:any,bodyError:any){
		const reuslt = await this.Model.findOneAndUpdate(
			find,
			{
				$set:{
					orderError:bodyError,
					orderStatus:"ERROR"
				}
			},
			{ upsert: true,new: true  }
		)
		return reuslt
 	}

	 async orderUpdateBYhash(hash:string,body:any){
			const reuslt = await this.Model.findOneAndUpdate(
				{orderHash:hash},
				{
					$set:body
				},
				{ upsert: true,new: true  }
			)
			return reuslt
	 	}

		 async orderUpdateBYID(id:string,body:any){
			const reuslt = await this.Model.findOneAndUpdate(
				{orderId:id},
				{
					$set:body,

				},
				{ upsert: true,new: true  }
				
			)
			return reuslt
	 	}
}