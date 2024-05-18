import express from "express";
import { Customer } from "../models/customerModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const router = express.Router();

// Get customer orders by customer id
// By default get all orders
router.get("/", async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (customer_id) {
      const customer = await Customer.findById(customer_id);
      if (!customer) {
        return res
          .status(404)
          .send({ message: "چنین مشتری در لیست مشتریان موجود نیست!" });
      }

      const orders = await Order.find({});
      if (orders.length === 0) {
        return res
          .status(404)
          .send({ message: "هنوز هیچ سفارشی ثبت نشده است!" });
      }

      const customerOrders = orders
        .filter((order) => order.customer.id === customer_id)
        .map((order) => ({
          products: order.products,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          totalPrice: order.totalPrice,
        }));

      if (!customerOrders.length) {
        return res
          .status(404)
          .send({ message: "محصولی برای مشتری مورد نظر یافت نشد" });
      }

      return res.status(200).send({
        count: customerOrders.length,
        orders: customerOrders,
        customer: customer,
      });
    } else {
      const orders = await Order.find({});
      if (orders.length === 0) {
        return res
          .status(404)
          .send({ message: "هیچ محصولی در لیست محصولات موجود نیست!" });
      }
      return res.status(200).send({ count: orders.length, orders: orders });
    }
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
      const existProduct = await Product.findById(product.id);
      if (existProduct.count >= product.quantity) {
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
      } else {
        return res.status(400).send({
          message: `موجودی محصول: ${existProduct.name} کمتر از تعدا درخواست است!`,
        });
      }
    });

    const processedProducts = await Promise.all(products);

    const totalPrice = processedProducts.reduce((prev, curr) => {
      prev + curr.price;
    }, 0);

    const order = await Order.create({
      products: processedProducts,
      totalPrice,
      customer: {
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
      },
    });

    return res.status(201).send(order);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err);
  }
});

// Get transactions
router.get("/transaction", async (req, res) => {
  try {
    const { from, to, customer_number } = req.query;

    const toDay = new Date();
    const date1 = new Date(from || toDay - 2592000000); // By default get transaction for this month
    const date2 = new Date(to || toDay);
    const orders = await Order.find({});

    let betweenDateOrders = [];

    if (customer_number) {
      const customer = await Customer.find({ phoneNumber: customer_number });
      if (!customer) {
        return res
          .status(404)
          .send({ message: "چنین مشتری در لیست مشتریان موجود نیست!" });
      }
      betweenDateOrders = orders
        .filter(
          (order) =>
            date2 - order.updatedAt > 0 &&
            order.updatedAt - date1 > 0 &&
            order.customer.phoneNumber === customer_number
        )
        .map((order) => ({
          products: order.products,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));
      return res.status(200).send({
        count: betweenDateOrders.length,
        orders: betweenDateOrders,
        customer: customer,
      });
    }

    betweenDateOrders = orders.filter(
      (order) => date2 - order.updatedAt > 0 && order.updatedAt - date1 > 0
    );
    return res.status(200).send({
      count: betweenDateOrders.length,
      orders: betweenDateOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).status({ message: err });
  }
});

export default router;
