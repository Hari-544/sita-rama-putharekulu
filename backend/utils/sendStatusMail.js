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

const sendStatusMail = async ({
  customerName,
  customerEmail,
  orderId,
  status,
}) => {
  if (!customerEmail) {
    throw new Error("Customer email is missing. Cannot send status email.");
  }

  if (!status) {
    throw new Error("Order status is missing. Cannot send status email.");
  }

  try {
    const { emailUser } = getEmailConfig();
    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Sita Rama Putharekulu" <${emailUser}>`,
      to: customerEmail,
      subject: `Order Status Updated - ${status}`,
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>Order Status Updated</h2>
          <p>Hello ${customerName || "Customer"},</p>
          <p>Your order status has been updated.</p>
          <h3>Order ID: ${orderId || "Not available"}</h3>
          <h3>New Status: ${status}</h3>
          <br/>
          <p>Thank you for shopping with Sita Rama Putharekulu.</p>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("[STATUS MAIL] Full mail error:", formatMailError(error));
    throw error;
  }
};

export default sendStatusMail;
