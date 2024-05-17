import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      // matches: /^09\d{9}$/,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
