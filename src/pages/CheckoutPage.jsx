import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CheckoutPage() {

  const [cart, setCart] = useState([]);

  const [processing, setProcessing] =
    useState(false);

  const [customer, setCustomer] =
    useState({
      name: "",
      phone: "",
      address: "",
      pincode: "",
    });

  /* LOAD CART */

  useEffect(() => {

    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

  }, []);

  /* QUANTITY INCREASE */

  const increaseQty = (id) => {

    const updatedCart = cart.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* QUANTITY DECREASE */

  const decreaseQty = (id) => {

    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* TOTAL */

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* PAYMENT */

  const handlePayment = async () => {

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {

      /* SAVE ORDER */

      await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept: "application/json",
          },

          body: JSON.stringify({
            access_key:
              "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

            customer_name:
              customer.name,

            customer_phone:
              customer.phone,

            customer_address:
              customer.address,

            customer_pincode:
              customer.pincode,

            order_items: cart
              .map(
                (item) =>
                  `${item.name} x ${item.quantity}`
              )
              .join(", "),

            total_amount:
              totalAmount,
          }),
        }
      );

      /* RAZORPAY */

      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          totalAmount * 100,

        currency: "INR",

        name:
          "SITA RAMA PUTHAREKULU",

        description:
          "Premium Sweet Order",

        image: "/favicon.svg",

        handler: function (
          response
        ) {

          console.log(response);

          localStorage.removeItem(
            "cart"
          );

          window.location.href =
            "/success";
        },

        prefill: {
          name: customer.name,
          contact: customer.phone,
        },

        notes: {
          address:
            customer.address,
        },

        theme: {
          color: "#ea580c",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

      setProcessing(false);

    } catch (error) {

      console.error(error);

      alert(
        "Payment failed. Please try again."
      );

      setProcessing(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#fffaf5] py-10 px-4">

      <div className="container mx-auto max-w-7xl">

        {/* TOP */}

        <div className="flex items-center justify-between mb-10">

          <Link
            to="/"
            className="text-orange-700 font-bold hover:text-orange-900"
          >
            ← Back To Store
          </Link>

          <h1 className="text-3xl lg:text-4xl font-black text-stone-900">
            Checkout
          </h1>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">

            <h2 className="text-2xl font-black text-stone-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">

              {cart.length === 0 ? (

                <div className="text-center py-16">

                  <span className="text-6xl">
                    🛒
                  </span>

                  <p className="mt-4 text-stone-500">
                    Your cart is empty
                  </p>

                </div>

              ) : (

                cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 border border-orange-100 rounded-2xl p-4 bg-orange-50"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />

                    <div className="grow">

                      <h3 className="font-bold text-stone-900">
                        {item.name}
                      </h3>

                      <p className="text-sm text-stone-500 mt-1">
                        {item.sizes}
                      </p>

                      <p className="text-xl font-black text-orange-700 mt-2">
                        ₹{item.price}
                      </p>

                      {/* QUANTITY */}

                      <div className="flex items-center gap-3 mt-4">

                        <button
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                          className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-700 font-black"
                        >
                          -
                        </button>

                        <span className="font-black text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.id)
                          }
                          className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-700 font-black"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

            {/* TOTAL */}

            {cart.length > 0 && (

              <div className="border-t border-orange-100 mt-8 pt-6 flex items-center justify-between">

                <span className="text-lg font-semibold text-stone-600">
                  Total Amount
                </span>

                <span className="text-4xl font-black text-orange-700">
                  ₹{totalAmount}
                </span>

              </div>

            )}

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">

            <h2 className="text-2xl font-black text-stone-900 mb-6">
              Delivery Details
            </h2>

            <div className="space-y-5">

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
                className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <textarea
                rows="5"
                placeholder="Complete Delivery Address"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address: e.target.value,
                  })
                }
                className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                maxLength="6"
                placeholder="Pincode"
                value={customer.pincode}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    pincode: e.target.value,
                  })
                }
                className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-lg transition"
              >

                {processing
                  ? "Processing Payment..."
                  : `Pay ₹${totalAmount}`}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CheckoutPage;