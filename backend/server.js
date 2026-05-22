require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

app.use(cors());

app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET,
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

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});