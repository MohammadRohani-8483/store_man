import express from "express";
import { Customer } from "../models/customerModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({});

    if (customers.length === 0) {
      return res.status(404).send("هنوز هیچ مشتری ثبت نشده است!");
    }
    return res.status(200).send({ count: customers.length, data: customers });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.phoneNumber || !req.body.name) {
      return res
        .status(400)
        .send({ message: "تمامی مقادیر مورد نیاز برای ثبت مشتری را وارد کنید: نام، شماره همراه." });
    }

    if (!/^09\d{9}$/.test(req.body.phoneNumber)) {
      return res.status(400).send({
        message: "شماره صحیح وارد کنید",
      });
    }

    const customers = await Customer.find({});
    const newCustomer = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    };
    const productIndex = customers.findIndex(
      (customer) => customer.phoneNumber === newCustomer.phoneNumber
    );

    if (productIndex !== -1) {
      return res.status(400).send({
        message: `مشتری با شماره تلفن ${newCustomer.phoneNumber} در لیست مشتری ها موجود است!`,
      });
    }

    const customer = await Customer.create(newCustomer);
    return res.status(201).send(customer);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

export default router;
