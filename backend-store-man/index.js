import express from "express";
import mongoose from "mongoose";
import { mongoDbUrl, PORT } from "./config.js";
import { Product } from "./models/productModel.js";

const app = express();

// Middleware for parsing request bode
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("wellcome");
});

// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  if (products.length === 0) {
    return res.status(404).send("Products not founded!");
  }

  return res.status(200).send({ count: products.length, data: products });
});

// Create new products
app.post("/products", async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.count) {
      return res
        .status(400)
        .send({ message: "Send all reqired fields: name, price, count" });
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

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => console.log(`App listening to port: ${PORT}`));
  })
  .catch((err) => console.log(err));
