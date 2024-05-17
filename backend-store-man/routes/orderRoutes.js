import express from "express";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.products.length) {
      return res
        .status(400)
        .send({ message: "Send all required fields: name, price, count" });
    }

    // Asynchronous product updates and information gathering
    const newOrder = req.body.products.map(async (product) => {
      const existingProduct = await Product.findByIdAndUpdate(
        product.id,
        {
          $inc: { count: -Number(product.quantity) }, // Update stock using $inc
        },
        { new: true }
      ); // Return updated document

      return {
        id: existingProduct?.id,
        name: existingProduct?.name,
        price: existingProduct?.price,
        quantity: product.quantity,
      };
    });

    // Wait for all product updates to finish (using Promise.all)
    const processedProducts = await Promise.all(newOrder);

    // Create the order with processed products
    const order = await Order.create({ products: processedProducts });

    // Send successful response
    return res.status(201).send(order);
  } catch (err) {
    console.error(err.message); // Use console.error for logging errors
    return res.status(500).status({ message: "Internal server error" }); // Generic error message for security
  }
});

export default router;
