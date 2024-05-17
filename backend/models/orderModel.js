import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    products: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    customer: {
      id: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
