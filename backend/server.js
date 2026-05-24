import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

/* RAZORPAY */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

/* CREATE ORDER */

app.post(
  "/api/payment/create-order",
  async (req, res) => {

    try {

      const { amount } = req.body;

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt:
          "receipt_" + Date.now(),
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.json(order);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Order creation failed",
      });

    }

  }
);

/* VERIFY PAYMENT */

app.post(
  "/api/payment/verify",
  async (req, res) => {

    try {

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const generated_signature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(
            razorpay_order_id +
              "|" +
              razorpay_payment_id
          )
          .digest("hex");

      if (
        generated_signature ===
        razorpay_signature
      ) {

        return res.json({
          success: true,
        });

      } else {

        return res.status(400).json({
          success: false,
        });

      }

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);

/* SERVER */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});