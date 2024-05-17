import mongoose from "mongoose";
import { Order } from "./orderModel";

const customerSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    matches: /^09\d{9}$/,
  },
  name: {
    type: String,
    required: true,
  },
  order:[Order]
});

export const Customer = mongoose.model("Customer", customerSchema);
