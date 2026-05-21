import { useState } from "react";
import "./App.css";

import jaggery from "./assets/images/jaggery.jpg";
import sugar from "./assets/images/sugar.jpg";
import dryfruit from "./assets/images/Dryfruits.jpg";
import dryfruitSugar from "./assets/images/dryfruitsugar.jpg";
import kova from "./assets/images/kova.jpg";
import karam from "./assets/images/karam.jpg";
import samosaJaggery from "./assets/images/samosajaggery.jpg";
import samosaSugar from "./assets/images/samosasugar.jpg";
import chocolate from "./assets/images/chocolate.jpg";
import hero from "./assets/hero.jpg";

function SitaRamaPutharekulu() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const paymentLink = "https://razorpay.me/@sitaramaputharekulu";

  const products = [
    {
      id: 1,
      name: "Plain Jaggery Putharekulu",
      sizes: "Small & Big Size",
      price: 150,
      image: jaggery,
    },
    {
      id: 2,
      name: "Plain Sugar Putharekulu",
      sizes: "Small & Big Size",
      price: 150,
      image: sugar,
    },
    {
      id: 3,
      name: "Dry Fruits Jaggery Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: dryfruit,
    },
    {
      id: 4,
      name: "Dry Fruits Sugar Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: dryfruitSugar,
    },
    {
      id: 5,
      name: "Plain Kova Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: kova,
    },
    {
      id: 6,
      name: "Karam Putharekulu",
      sizes: "Small - ₹120 | Big - ₹180",
      price: 120,
      image: karam,
    },
    {
      id: 7,
      name: "Samosa Shaped Jaggery Putharekulu",
      sizes: "Special Shape",
      price: 180,
      image: samosaJaggery,
    },
    {
      id: 8,
      name: "Samosa Shaped Sugar Putharekulu",
      sizes: "Special Shape",
      price: 180,
      image: samosaSugar,
    },
    {
      id: 9,
      name: "Chocolate Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: chocolate,
    },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const proceedToPayment = async () => {
  if (
    !customer.name ||
    !customer.phone ||
    !customer.address ||
    !customer.pincode
  ) {
    alert("Please fill all delivery details");
    return;
  }

  const orderDetails = cart
    .map(
      (item) =>
        `${item.name} x ${item.quantity} = ₹${
          item.price * item.quantity
        }`
    )
    .join("\n");

  const formData = {
    access_key: "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    pincode: customer.pincode,

    order_details: orderDetails,

    total_amount: totalAmount,
  };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (result.success) {
    alert("Order placed successfully!");

    window.location.href = paymentLink;
  } else {
    alert("Something went wrong!");
  }
};

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-orange-800">
          SITA RAMA PUTHAREKULU
        </h1>

        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-xl transition"
        >
          Cart ({cart.length})
        </button>

      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-yellow-50 py-10 px-6 text-center">

        <img
          src={hero}
          alt="Hero"
          className="mx-auto rounded-3xl shadow-2xl max-w-6xl w-full"
        />

        <h1 className="text-5xl font-extrabold text-orange-900 mt-10 mb-4">
          Authentic Andhra Putharekulu
        </h1>

        <p className="text-xl max-w-3xl mx-auto text-gray-700 leading-8">
          Handmade Traditional Sweets Prepared Fresh With Premium Ingredients.
        </p>

      </section>

      {/* Products */}
      <section className="py-16 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-orange-800 mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-orange-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="text-2xl font-bold text-orange-900">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {product.sizes}
                  </p>

                  <p className="mt-4 text-2xl font-bold text-green-700">
                    ₹{product.price}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-6 bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-2xl font-semibold transition"
                  >
                    Add To Cart
                  </button>

                </div>
              </div>

            ))}

          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      {showCart && (

        <div className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white shadow-2xl z-50 overflow-y-auto p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold text-orange-800">
              Your Cart
            </h2>

            <button
              onClick={() => setShowCart(false)}
              className="text-red-600 text-2xl"
            >
              ✕
            </button>

          </div>

          {cart.length === 0 ? (

            <p>Your cart is empty.</p>

          ) : (

            <>
              {cart.map((item) => (

                <div
                  key={item.id}
                  className="border-b py-4 flex gap-4 items-center"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <h3 className="font-bold">
                      {item.name}
                    </h3>

                    <p>
                      ₹{item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-2">

                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-red-500 text-white px-3 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="bg-green-600 text-white px-3 rounded"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              ))}

              <div className="mt-6">

                <h3 className="text-2xl font-bold text-green-700 mb-4">
                  Total: ₹{totalAmount}
                </h3>

                <div className="space-y-4">

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        name: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-xl"
                  />

                  <textarea
                    placeholder="Full Delivery Address"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-xl"
                    rows="4"
                  />

                  <input
                    type="text"
                    placeholder="Pincode"
                    value={customer.pincode}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        pincode: e.target.value,
                      })
                    }
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

                <button
                  onClick={proceedToPayment}
                  className="w-full mt-6 bg-orange-700 hover:bg-orange-800 text-white py-4 rounded-2xl text-lg font-bold transition"
                >
                  Proceed To Payment
                </button>

                <p className="text-sm text-gray-500 mt-3 text-center">
                  After payment, please send payment screenshot on WhatsApp.
                </p>

              </div>
            </>

          )}

        </div>

      )}

      {/* Contact */}
      <section className="py-16 px-6 bg-orange-900 text-white text-center">

        <h2 className="text-4xl font-bold mb-6">
          Contact Us
        </h2>

        <p className="text-xl mb-4">
          WhatsApp: +91 9652999544
        </p>

        <a
          href="https://wa.me/919652999544"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg"
        >
          Chat on WhatsApp
        </a>

      </section>

    </div>
  );
}

export default SitaRamaPutharekulu;