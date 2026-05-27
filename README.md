# 🍬 Sita Rama Putharekulu Ecommerce Website

A modern full-stack ecommerce platform for selling authentic handmade Atreyapuram Putharekulu and traditional sweets online across India.

Built with React, Firebase, Razorpay, Node.js, and modern responsive UI architecture.

---

# 🌐 Live Website

Frontend:
https://sita-rama-putharekulu.vercel.app/

Backend:
https://sita-rama-backend.onrender.com

---

# 📌 Project Overview

Sita Rama Putharekulu is a professional ecommerce website designed to provide customers with a seamless online ordering experience for authentic traditional sweets from Atreyapuram.

The platform supports:
- realtime product management
- secure online payments
- customer order tracking
- admin order management
- automatic email notifications
- responsive mobile-first UI

The website is optimized for both desktop and mobile devices with premium ecommerce styling and dynamic responsive layouts.

---

# 🚀 Features

## 🛒 Ecommerce Features

- Product listing system
- Category-based product sections
- Add to Cart functionality
- Dynamic cart management
- Checkout page
- Realtime order tracking
- Admin order management
- Product image uploads

---

## 💳 Payment Features

- Razorpay payment integration
- Secure payment verification
- Payment success/failure handling
- Order ID generation
- Razorpay order tracking support

---

## 📦 Order Management

- Firebase realtime order storage
- Admin dashboard
- Delivery status management
- Order filtering/search
- Revenue statistics
- Paid/failed order monitoring

---

## 📧 Email Notification System

### Customer Emails
- Order confirmation emails
- Razorpay Order ID emails
- Order status update emails

### Admin Notifications
- New order notifications via Web3Forms

---

## 🖼️ Image Management

- Cloudinary image uploads
- Dynamic product image rendering
- Optimized ecommerce image display

---

## 📱 Responsive UI

- Mobile-first responsive design
- Adaptive layouts
- Premium ecommerce styling
- Dynamic responsive product grids
- Smooth user experience across devices

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM

---

## Backend

- Node.js
- Express.js

---

## Database

- Firebase Firestore

---

## Authentication & Security

- Firebase Firestore Rules
- Admin email-based authorization

---

## Payments

- Razorpay

---

## Email Services

- Nodemailer SMTP
- Gmail App Password
- Web3Forms

---

## Image Hosting

- Cloudinary

---

# 📂 Project Structure

```bash
sita-rama-putharekulu/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── pages/
│   ├── components/
│   └── firebase.js
│
├── backend/
│   ├── utils/
│   │   ├── sendMail.js
│   │   └── sendStatusMail.js
│   │
│   ├── server.js
│   └── .env
│
└── README.md


---

⚙️ Installation Setup
1️⃣ Clone Repository

git clone <https://github.com/Hari-544/sita-rama-putharekulu>

2️⃣ Install Frontend Dependencies

cd frontend
npm install

3️⃣ Install Backend Dependencies

cd backend
npm install

4️⃣ Start Frontend

npm run dev

5️⃣ Start Backend

node server.js

---

🔑 Environment Variables

Create .env inside backend:

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

EMAIL_USER=your_email
EMAIL_PASS=your_app_password

Create .env inside frontend:

VITE_RAZORPAY_KEY=your_key
VITE_API_BASE=your_backend_url

---

🔥 Firebase Setup
Firestore Collections
products

Stores:

product name
image
category
price
description
orders

Stores:

customer details
products
payment status
delivery status
Razorpay IDs
reviews

Stores:

customer reviews
ratings

---

🔐 Firebase Security Rules

The project uses:

admin-only write access
protected products collection
protected order updates
public order tracking support

---

💳 Payment Workflow
Customer adds products to cart
Razorpay order created
Payment processed
Payment verified on backend
Order stored in Firebase
Customer receives confirmation email
Admin receives order notification
Customer tracks order using Razorpay Order ID

---

📧 Email Workflow
Customer

Receives:

order confirmation
order ID
status updates
Admin

Receives:

new order notifications

---

📦 Order Tracking System

Customers can track orders using:

Razorpay Order ID

Supported statuses:

Preparing
Packed
Shipped
Delivered

---

📊 Admin Dashboard Features
Total orders
Paid orders
Failed orders
Revenue statistics
Order status management
Customer details
Product details

---

🎨 UI Features
Premium ecommerce design
Orange-themed branding
Dynamic responsive layouts
Product category grids
Adaptive mobile scaling
Responsive typography

---

📱 Mobile Optimization
Fully responsive design
Mobile-friendly checkout
Adaptive navbar
Responsive product cards
Optimized touch interactions

---

☁️ Deployment
Frontend Deployment
Vercel
Backend Deployment
Render

---

🔮 Future Improvements
WhatsApp notifications
Invoice generation
Delivery partner integration
Coupon system
Customer authentication
Wishlist functionality

---

📸 Screenshots

Add screenshots here:

Homepage
Checkout Page
Admin Dashboard
Track Order Page
Mobile Responsive UI

---

👨‍💻 Developer

Hari Krishna

B.Tech AI & ML Student

---

📄 License

This project is built for educational and business purposes.

---

❤️ Special Note

This project represents a modern ecommerce solution for promoting authentic traditional sweets from Atreyapuram using modern full-stack web technologies.
