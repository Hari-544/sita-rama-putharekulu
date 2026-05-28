/* global process */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import sendOrderMail from "./utils/sendMail.js";
import sendStatusMail from "./utils/sendStatusMail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

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
      const payableAmount = Number(amount);

      if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid order amount",
        });
      }

      const options = {
        amount: payableAmount * 100,
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

      console.error("[CREATE ORDER] Order creation failed:", error);

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

        customerName,
        email,
        subtotal,
        handlingFee,
        finalTotal,
        totalAmount,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        console.error("[VERIFY] Missing Razorpay verification fields");

        return res.status(400).json({
          success: false,
          message:
            "Missing Razorpay verification fields",
        });
      }

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(body.toString())
          .digest("hex");

      const isAuthentic =
        expectedSignature ===
        razorpay_signature;

      if (isAuthentic) {

        let emailSent = false;
        let emailError = null;

        if (email) {

          try {
            const mailInfo = await sendOrderMail({

              customerName:
                customerName ||
                "Customer",

              customerEmail:
                email,

              orderId:
                razorpay_order_id,

              amount:
                finalTotal ?? totalAmount,

            });

            emailSent = Boolean(mailInfo);
            if (!emailSent) {
              emailError = {
                message:
                  "Email notification skipped because Gmail SMTP authentication failed.",
              };
            }
          } catch (mailError) {
            emailError = {
              message: mailError.message,
              code: mailError.code,
              command: mailError.command,
              response: mailError.response,
              responseCode: mailError.responseCode,
            };

            console.error("[VERIFY] Customer email failed:", emailError);
          }

        } else {

          console.error("[VERIFY] Customer email missing in request body");

        }

        return res.json({
          success: true,
          emailSent,
          emailError,
          orderId:
            razorpay_order_id,
        });

      } else {

        console.error("[VERIFY] Invalid Razorpay signature");

        return res.status(400).json({
          success: false,
          message:
            "Invalid Signature",
        });

      }

    } catch (error) {

      console.error(
        "[VERIFY] Payment verification error:",
        error
      );

      res.status(500).json({
        success: false,
        error: error.message,
      });

    }

  }
);



/* UPDATE ORDER STATUS */

app.post(
  "/api/order/status-mail",
  async (req, res) => {

    try {

      const {
        customerName,
        customerEmail,
        orderId,
        status,
      } = req.body;

      if (!customerEmail || !status) {
        console.error("[STATUS ROUTE] Missing required status email fields");

        return res.status(400).json({
          success: false,
          message:
            "Missing customerEmail or status",
        });
      }

      const mailInfo = await sendStatusMail({

        customerName,
        customerEmail,
        orderId,
        status,
      });

      res.json({
        success: true,
        messageId:
          mailInfo.messageId,
      });

    } catch (error) {

      console.error("[STATUS ROUTE] Mail failure:", {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });

      res.status(500).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          command: error.command,
          response: error.response,
          responseCode: error.responseCode,
        },
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
