/* global process */
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const getEmailConfig = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS. Check backend/.env and deployment environment variables."
    );
  }

  return {
    emailUser,
    emailPass,
  };
};

const createTransporter = () => {
  const { emailUser, emailPass } = getEmailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const formatMailError = (error) => ({
  message: error.message,
  code: error.code,
  command: error.command,
  response: error.response,
  responseCode: error.responseCode,
});

const sendOrderMail = async ({
  customerName,
  customerEmail,
  orderId,
  amount,
}) => {
  if (!customerEmail) {
    throw new Error("Customer email is missing. Cannot send order email.");
  }

  try {
    const { emailUser } = getEmailConfig();
    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Sita Rama Putharekulu" <${emailUser}>`,
      to: customerEmail,
      subject: "Order Confirmed - Sita Rama Putharekulu",
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>Thank you for shopping with Sita Rama Putharekulu</h2>
          <p>Hello ${customerName || "Customer"},</p>
          <p>Your order has been confirmed successfully.</p>
          <h3>Order ID: ${orderId}</h3>
          <h3>Amount: INR ${amount}</h3>
          <p>Use this Order ID in the Track Order page.</p>
          <p>Click here<a href="https://sita-rama-putharekulu.vercel.app/#track-order" target="_blank"> to Track Your Order</a></p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br/>
          <p>- Sita Rama Putharekulu</p>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("[MAIL] Exact mail error:", formatMailError(error));
    throw error;
  }
};

export default sendOrderMail;
