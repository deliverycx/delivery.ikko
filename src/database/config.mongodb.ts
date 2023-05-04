/* eslint-disable prettier/prettier */
const ADMIN_DB = 'deliverycx_admin'
const DELIVERY_DB = 'deliverycx'

import { connect } from "mongoose";

export function connection(base:string) {
    console.log(base);
    return connect(base as string);
}



export {
  ADMIN_DB,
  DELIVERY_DB
}