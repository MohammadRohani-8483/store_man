import express from "express";
import { Customer } from "../models/customerModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const router = express.Router();

// Get customer orders by customer id
router.get("/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res
        .status(404)
        .send({ message: "چنین مشتری در لیست مشتریان موجود نیست!" });
    }

    const orders = await Order.find({});
    if (orders.length === 0) {
      return res.status(404).send({ message: "هنوز هیچ سفارشی ثبت نشده است!" });
    }

    const customerOrders = orders
      .filter((order) => order.customer.id === customerId)
      .map((order) => ({
        products: order.products,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

    if (!customerOrders.length) {
      return res
        .status(404)
        .send({ message: "محصولی برای مشتری مورد نظر یافت نشد" });
    }

    return res.status(200).send({
      count: customerOrders.length,
      products: customerOrders,
      customer: customer,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

// Create new order
router.post("/", async (req, res) => {
  try {
    if (!req.body.products.length || !req.body.customerId) {
      return res.status(400).send({
        message:
          "تمامی مقادیر مورد نیاز برای ثبت سفارش را وارد کنید: لیست محصولات، آیدی مشتری.",
      });
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      return res
        .status(404)
        .send({ message: "چنین مشتری در لیست مشتریان موجود نیست!" });
    }

    const products = req.body.products.map(async (product) => {
      const existingProduct = await Product.findByIdAndUpdate(
        product.id,
        {
          $inc: { count: -Number(product.quantity) }, // Update stock using $inc
        },
        { new: true }
      );

      return {
        id: existingProduct?.id,
        name: existingProduct?.name,
        price: existingProduct?.price,
        quantity: product.quantity,
      };
    });

    const processedProducts = await Promise.all(products);

    const order = await Order.create({
      products: processedProducts,
      customer: {
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
      },
    });

    return res.status(201).send(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).status({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    if (orders.length === 0) {
      return res
        .status(404)
        .send({ message: "هیچ محصولی در لیست محصولات موجود نیست!" });
    }
    return res.status(200).send({ count: orders.length, data: orders });
  } catch (err) {
    console.error(err.message);
    return res.status(500).status({ message: "Internal server error" });
  }
});

// Get transactions
router.get("/transaction", async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    return res.status(500).status({ message: "Internal server error" });
  }
});

export default router;
