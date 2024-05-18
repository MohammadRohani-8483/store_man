import express from "express";
import mongoose from "mongoose";
import { mongoDbUrl, PORT } from "./config.js";
import customerRouter from "./routes/customerRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productsRouter from "./routes/productsRouter.js";
import cors from "cors";
const app = express();

// Middleware for parsing request mode
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(234).send("wellcome");
});

app.use("/products", productsRouter);

app.use("/orders", orderRouter);

app.use("/customers", customerRouter);

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => console.log(`App listening to port: ${PORT}`));
  })
  .catch((err) => console.log(err));
