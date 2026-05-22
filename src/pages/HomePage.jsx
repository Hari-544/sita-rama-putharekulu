import { useState } from "react";
import "../App.css";
import Footer from "../components/Footer";

import jaggery from "../assets/images/jaggery.jpg";
import sugar from "../assets/images/sugar.jpg";
import dryfruit from "../assets/images/Dryfruits.jpg";
import dryfruitSugar from "../assets/images/dryfruitsugar.jpg";
import kova from "../assets/images/kova.jpg";
import karam from "../assets/images/karam.jpg";
import samosaJaggery from "../assets/images/samosajaggery.jpg";
import samosaSugar from "../assets/images/samosasugar.jpg";
import chocolate from "../assets/images/chocolate.jpg";
import hero from "../assets/hero.jpg";

function HomePage() {

  const [cart, setCart] = useState([]);

  const [processing, setProcessing] = useState(false);

  const [showCart, setShowCart] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const products = [
    {
      id: 1,
      name: "Plain Jaggery Putharekulu",
      sizes: "Small & Big Size",
      price: 150,
      image: jaggery,
      paymentLink: "https://rzp.io/rzp/S7EMv5Se",
    },

    {
      id: 2,
      name: "Plain Sugar Putharekulu",
      sizes: "Small & Big Size",
      price: 150,
      image: sugar,
      paymentLink: "https://rzp.io/rzp/YqVnJmPC",
    },

    {
      id: 3,
      name: "Dry Fruits Jaggery Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: dryfruit,
      paymentLink: "https://rzp.io/rzp/7Pg1Mwa",
    },

    {
      id: 4,
      name: "Dry Fruits Sugar Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: dryfruitSugar,
      paymentLink: "https://rzp.io/rzp/7Pg1Mwa",
    },

    {
      id: 5,
      name: "Plain Kova Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: kova,
      paymentLink: "https://rzp.io/rzp/AZykm5U",
    },

    {
      id: 6,
      name: "Karam Putharekulu",
      sizes: "Small - ₹120 | Big - ₹180",
      price: 120,
      image: karam,
      paymentLink: "https://rzp.io/rzp/iIdB8raG",
    },

    {
      id: 7,
      name: "Samosa Shaped Jaggery Putharekulu",
      sizes: "Special Shape",
      price: 180,
      image: samosaJaggery,
      paymentLink: "https://rzp.io/rzp/T2Pf7R12",
    },

    {
      id: 8,
      name: "Samosa Shaped Sugar Putharekulu",
      sizes: "Special Shape",
      price: 180,
      image: samosaSugar,
      paymentLink: "https://rzp.io/rzp/T2Pf7R12",
    },

    {
      id: 9,
      name: "Chocolate Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: 200,
      image: chocolate,
      paymentLink: "https://rzp.io/rzp/CWGzDO2l",
    },
  ];

  const addToCart = (product) => {

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {

      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

    }
  };

  const increaseQty = (id) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {

    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
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

  setProcessing(true);

  try {

    // Create Razorpay Order
    const response = await fetch(
      "http://localhost:5000/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: totalAmount,
        }),
      }
    );

    const order = await response.json();

    // Razorpay Checkout
    const options = {

      key: "rzp_test_SqRtF41rL6Tybl",

      amount: order.amount,

      currency: order.currency,

      name: "SITA RAMA PUTHAREKULU",

      description: "Order Payment",

      order_id: order.id,

      handler: async function (response) {

        // Save Order Details To Web3Forms

        const orderDetails = cart
          .map(
            (item) =>
              `${item.name} x ${item.quantity}`
          )
          .join("\n");

        const formData = {

          access_key:
            "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

          name: customer.name,

          phone: customer.phone,

          address: customer.address,

          pincode: customer.pincode,

          order_details: orderDetails,

          total_amount: totalAmount,

          payment_id:
            response.razorpay_payment_id,
        };

        await fetch(
          "https://api.web3forms.com/submit",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept: "application/json",
            },

            body: JSON.stringify(formData),
          }
        );

        window.location.href = "/success";
      },

      prefill: {

        name: customer.name,

        contact: customer.phone,
      },

      theme: {
        color: "#c2410c",
      },
    };

    const razor = new window.Razorpay(
      options
    );

    razor.open();

    setProcessing(false);

  } catch (error) {

    console.log(error);

    alert("Payment Failed");

    setProcessing(false);

  }
};

  const handleBuyNow = async (product) => {

    const name = prompt("Enter Your Name");

    const phone = prompt(
      "Enter Your Phone Number"
    );

    const address = prompt(
      "Enter Your Delivery Address"
    );

    const pincode = prompt(
      "Enter Your Pincode"
    );

    if (
      !name ||
      !phone ||
      !address ||
      !pincode
    ) {
      alert("Please fill all details");
      return;
    }

    const formData = {

      access_key:
        "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

      name,
      phone,
      address,
      pincode,

      order_details:
        `${product.name} - ₹${product.price}`,

      total_amount: product.price,
    };

    try {

      await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      window.location.href =
        product.paymentLink;

    } catch (error) {

      alert("Something went wrong!");

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 text-gray-800">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md shadow-md px-6 py-4">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <h1 className="text-2xl font-extrabold text-orange-900 tracking-tight">
            SITA RAMA
            <span className="text-yellow-600">
              {" "}PUTHAREKULU
            </span>
          </h1>

          <nav className="flex items-center gap-4">

            <a
              href="#products"
              className="text-gray-700 hover:text-orange-800 font-medium"
            >
              Products
            </a>

            <a
              href="/reviews"
              className="text-gray-700 hover:text-orange-800 font-medium"
            >
              Reviews
            </a>

            <button
              onClick={() =>
                setShowCart(!showCart)
              }
              className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-2xl font-semibold shadow"
            >
              Cart ({cart.length})
            </button>

          </nav>

        </div>

      </header>

      {/* Hero */}
      <section className="relative py-16">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <div>

            <h2 className="text-5xl font-extrabold text-orange-900 leading-tight">
              Handmade, Thin & Crispy
              <br />

              <span className="text-yellow-600">
                Traditional Putharekulu
              </span>

            </h2>

            <p className="mt-6 text-lg text-gray-700 max-w-2xl">
              Crafted using time-honored recipes and premium ingredients.
            </p>

          </div>

          <div className="mx-auto">

            <div className="relative w-[420px] h-[300px] md:w-[520px] md:h-[360px] rounded-3xl overflow-hidden shadow-2xl">

              <img
                src={hero}
                alt="Hero"
                className="object-cover w-full h-full"
              />

            </div>

          </div>

        </div>

      </section>

      {/* Products */}
      <section
        id="products"
        className="py-16 px-6"
      >

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-orange-800 mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (

              <div
                key={product.id}
                className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
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

                  <p className="mt-2 text-gray-600">
                    {product.sizes}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <p className="text-2xl font-extrabold text-green-700">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-2xl font-semibold"
                    >
                      Add
                    </button>

                  </div>

                  <a
                    href={`/buy/${product.id}`}
                    className="block w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold text-center"
                  >
                    Buy Now
                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Cart */}
      {showCart && (

        <div className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white shadow-2xl z-50 overflow-y-auto p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold text-orange-800">
              Your Cart
            </h2>

            <button
              onClick={() =>
                setShowCart(false)
              }
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
                        onClick={() =>
                          decreaseQty(item.id)
                        }
                        className="bg-red-500 text-white px-3 rounded"
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.id)
                        }
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
                    placeholder="Delivery Address"
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
                  disabled={processing}
                  className="w-full mt-6 bg-orange-700 hover:bg-orange-800 text-white py-4 rounded-2xl text-lg font-bold"
                >
                  {processing
                    ? "Processing Order..."
                    : "Proceed To Payment"}
                </button>

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

      </section>

      <Footer />

    </div>
  );
}

export default HomePage;