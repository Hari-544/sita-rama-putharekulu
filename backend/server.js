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

console.log("[ENV] backend/.env loaded");
console.log("[ENV] RAZORPAY_KEY_ID loaded:", Boolean(process.env.RAZORPAY_KEY_ID));
console.log("[ENV] RAZORPAY_KEY_SECRET loaded:", Boolean(process.env.RAZORPAY_KEY_SECRET));
console.log("[ENV] EMAIL_USER loaded:", Boolean(process.env.EMAIL_USER));
console.log("[ENV] EMAIL_PASS loaded:", Boolean(process.env.EMAIL_PASS));

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

    console.log("[VERIFY] /api/payment/verify route started");
    console.log("[VERIFY] Request body:", req.body);

    try {

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,

        customerName,
        email,
        totalAmount,
      } = req.body;

      console.log("[VERIFY] Received fields:", {
        razorpay_order_id,
        razorpay_payment_id,
        hasSignature: Boolean(razorpay_signature),
        customerName,
        email,
        totalAmount,
      });

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

      console.log("[VERIFY] Expected signature:", expectedSignature);
      console.log("[VERIFY] Received signature:", razorpay_signature);

      const isAuthentic =
        expectedSignature ===
        razorpay_signature;

      if (isAuthentic) {

        console.log("[VERIFY] Payment verified successfully");

        let emailSent = false;
        let emailError = null;

        if (email) {

          console.log("[VERIFY] Calling sendOrderMail...");

          try {
            await sendOrderMail({

              customerName:
                customerName ||
                "Customer",

              customerEmail:
                email,

              orderId:
                razorpay_order_id,

              amount:
                totalAmount,

            });

            emailSent = true;
            console.log("[VERIFY] Customer email sent successfully");
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

      console.log(
        "VERIFY ERROR:",
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

    console.log("STATUS ROUTE HIT");
    console.log("[STATUS ROUTE] Request body:", req.body);

    try {

      const {
        customerName,
        customerEmail,
        orderId,
        status,
      } = req.body;

      console.log("[STATUS ROUTE] Received fields:", {
        customerName,
        customerEmail,
        orderId,
        status,
      });

      if (!customerEmail || !status) {
        console.error("[STATUS ROUTE] Missing required status email fields");

        return res.status(400).json({
          success: false,
          message:
            "Missing customerEmail or status",
        });
      }

      console.log("[STATUS ROUTE] sendStatusMail called");

      const mailInfo = await sendStatusMail({

        customerName,
        customerEmail,
        orderId,
        status,
      });

      console.log("[STATUS ROUTE] Email sent successfully");

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
