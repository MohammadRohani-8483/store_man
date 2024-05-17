import express from "express";
import { Product } from "../models/productModel.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const products = await Product.find({});
    const filteredProducts = products?.filter((product) =>
      product?.name?.includes(search || "")
    );

    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "هیچ محصولی در لیست محصولات موجود نیست!" });
    }
    if (search?.length > 0) {
      if (filteredProducts.length) {
        return res
          .status(200)
          .send({ count: filteredProducts.length, data: filteredProducts });
      } else {
        return res.status(404).send({ message: "محصول مورد نظر یافت نشد!" });
      }
    } else {
      return res.status(200).send({ count: products.length, data: products });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

// Create new products
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.count) {
      return res
        .status(400)
        .send({
          message:
            "مقادیر مورد نیاز برای ثبت محصول را وارد کنید: نام، قیمت، تعداد موجودی.",
        });
    }

    const products = await Product.find({});
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      count: req.body.count,
    };
    const productIndex = products.findIndex(
      (product) => product.name === newProduct.name
    );

    if (productIndex !== -1) {
      return res.status(400).send({
        message: `محصولی با نام ${newProduct.name} در لیست محصولات موجود است!`,
      });
    }

    const product = await Product.create(newProduct);
    return res.status(201).send(product);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

export default router;
