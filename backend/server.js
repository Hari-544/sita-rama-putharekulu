import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: globalThis.process?.env?.RAZORPAY_KEY_ID,
  key_secret: globalThis.process?.env?.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {

  res.send("Backend Running Successfully");

});

app.post("/create-order", async (req, res) => {

  try {

    const options = {

      amount: req.body.amount * 100,

      currency: "INR",

      receipt: "receipt_order",

    };

    const order =
      await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {

    res.status(500).send(error);

  }
});

const PORT = globalThis.process?.env?.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});