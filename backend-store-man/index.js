import express from "express";
import mongoose from "mongoose";
import { mongoDbUrl, PORT } from "./config.js";
import orderRouter from "./routes/orderRoutes.js";
import productsRouter from "./routes/productsRouter.js";

const app = express();

// Middleware for parsing request bode
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("wellcome");
});

app.use("/products", productsRouter);

app.use("/orders", orderRouter);

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => console.log(`App listening to port: ${PORT}`));
  })
  .catch((err) => console.log(err));
