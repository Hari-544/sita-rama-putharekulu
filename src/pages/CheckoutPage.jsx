import { useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

function CheckoutPage() {

  const [cart, setCart] = useState(() => {

    try {

      const saved =
        localStorage.getItem("cart");

      return saved
        ? JSON.parse(saved)
        : [];

    } catch {

      return [];

    }

  });

  const [processing, setProcessing] =
    useState(false);

  const [customer, setCustomer] =
    useState({
      name: "",
      phone: "",
      address: "",
      pincode: "",
    });

  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    "https://sita-rama-backend.onrender.com";

  /* TOTAL */

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  /* SAVE ORDER TO FIREBASE */

  const saveOrderToFirebase =
    async (
      paymentStatus,
      response = {}
    ) => {

      try {

        console.log(
          "SAVING TO FIREBASE..."
        );

        const docRef =
          await addDoc(
            collection(
              db,
              "orders"
            ),
            {
              customerName:
                customer.name,

              phone:
                customer.phone,

              address:
                customer.address,

              pincode:
                customer.pincode,

              products:
                cart,

              totalAmount,

              paymentStatus,

              status: "Pending",

              razorpayPaymentId:
                response.razorpay_payment_id ||
                "",

              razorpayOrderId:
                response.razorpay_order_id ||
                "",

              createdAt:
                serverTimestamp(),
            }
          );

        console.log(
          "ORDER SAVED:",
          docRef.id
        );

        return true;

      } catch (firebaseError) {

        console.error(
          "FIREBASE ERROR:",
          firebaseError
        );
                          <div className="fluid-image-frame overflow-hidden rounded-2xl bg-orange-50">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
        return false;

      }

    };

  /* PAYMENT */

  const handlePayment = async () => {

    try {

      if (
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.pincode
      ) {

        alert(
          "Please fill all delivery details"
        );

        return;

      }

      if (cart.length === 0) {

        alert(
          "Your cart is empty"
        );

        return;

      }

      setProcessing(true);

      /* CREATE ORDER */

      const orderResponse =
        await fetch(
          `${API_BASE}/api/payment/create-order`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount:
                totalAmount,
            }),
          }
        );

      const order =
        await orderResponse.json();

      console.log(
        "ORDER:",
        order
      );

      /* RAZORPAY */

      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY,

        amount:
          order.amount,

        currency:
          "INR",

        name:
          "Sita Rama Putharekulu",

        description:
          "Authentic Atreyapuram Sweets",

        image:
          "/favicon.svg",

        order_id:
          order.id,

        handler:
          async function (
            response
          ) {

            try {

              console.log(
                "PAYMENT RESPONSE:",
                response
              );

              /* VERIFY PAYMENT */

              const verifyResponse =
                await fetch(
                  `${API_BASE}/api/payment/verify`,
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        razorpay_order_id:
                          response.razorpay_order_id,

                        razorpay_payment_id:
                          response.razorpay_payment_id,

                        razorpay_signature:
                          response.razorpay_signature,
                      }),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              console.log(
                "VERIFY:",
                verifyData
              );

              /* SUCCESS */

              if (
                verifyData.success
              ) {

                /* SAVE TO FIREBASE */

                const firebaseSaved =
                  await saveOrderToFirebase(
                    "PAID",
                    response
                  );

                console.log(
                  "FIREBASE SAVED:",
                  firebaseSaved
                );

                /* WEB3FORMS */

                try {

                  const formData =
                    new FormData();

                  formData.append(
                    "access_key",
                    "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e"
                  );

                  formData.append(
                    "subject",
                    "🛒 New Sweet Order"
                  );

                  formData.append(
                    "from_name",
                    "Sita Rama Putharekulu"
                  );

                  formData.append(
                    "Customer Name",
                    customer.name
                  );

                  formData.append(
                    "Phone",
                    customer.phone
                  );

                  formData.append(
                    "Address",
                    customer.address
                  );

                  formData.append(
                    "Pincode",
                    customer.pincode
                  );

                  formData.append(
                    "Total Amount",
                    `₹${totalAmount}`
                  );

                  formData.append(
                    "Products",
                    cart
                      .map(
                        (
                          item
                        ) =>
                          `${item.name} × ${item.quantity}`
                      )
                      .join(", ")
                  );

                  formData.append(
                    "Payment Status",
                    "PAID ✅"
                  );

                  formData.append(
                    "Razorpay Payment ID",
                    response.razorpay_payment_id
                  );

                  formData.append(
                    "Razorpay Order ID",
                    response.razorpay_order_id
                  );

                  await fetch(
                    "https://api.web3forms.com/submit",
                    {
                      method:
                        "POST",

                      body:
                        formData,
                    }
                  );

                  console.log(
                    "WEB3FORM SENT"
                  );

                } catch (web3Error) {

                  console.log(
                    "WEB3FORM ERROR:",
                    web3Error
                  );

                }

                alert(
                  "Payment Successful ✅"
                );

                /* CLEAR CART */

                localStorage.removeItem(
                  "cart"
                );

                setCart([]);

                setCustomer({
                  name: "",
                  phone: "",
                  address: "",
                  pincode: "",
                });

                setProcessing(
                  false
                );

                /* WAIT BEFORE REDIRECT */

                setTimeout(() => {

                  window.location.href =
                    "/";

                }, 5000);

                return;

              } else {

                await saveOrderToFirebase(
                  "FAILED"
                );

                alert(
                  "Payment Verification Failed ❌"
                );

                setProcessing(
                  false
                );

              }

            } catch (error) {

              console.log(
                "VERIFY ERROR:",
                error
              );

              await saveOrderToFirebase(
                "FAILED"
              );

              alert(
                "Verification Error ❌"
              );

              setProcessing(
                false
              );

            }

          },

        prefill: {
          name:
            customer.name,

          contact:
            customer.phone,
        },

        theme: {
          color:
            "#ea580c",
        },

      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        async function (
          response
        ) {

          console.log(
            "PAYMENT FAILED:",
            response
          );

          await saveOrderToFirebase(
            "FAILED"
          );

          alert(
            "Payment Failed ❌"
          );

          setProcessing(
            false
          );

        }
      );

      razorpay.open();

    } catch (error) {

      console.log(
        "MAIN ERROR:",
        error
      );

      alert(
        "Something went wrong"
      );

      setProcessing(false);

    }

  };

  return (

    <div className="adaptive-section safe-bottom min-h-screen bg-[#fffaf5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      <div className="responsive-shell mx-auto">

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/"
            className="text-orange-700 font-bold hover:text-orange-900"
          >
            ← Back To Store
          </Link>

          <h1 className="fluid-heading font-black text-stone-900">
            Checkout
          </h1>

        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-8">

          {/* LEFT */}

          {/* LEFT */}
          <div className="panel-shell adaptive-card p-5 sm:p-6 lg:p-8">
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
                    className="grid gap-4 border border-orange-100 rounded-2xl p-4 bg-orange-50/70 backdrop-blur-md sm:grid-cols-[auto,minmax(0,1fr)] sm:items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full max-w-[6.5rem] rounded-2xl object-cover shadow-sm sm:max-w-[7.5rem]"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-stone-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {item.sizes}
                      </p>
                      <p className="text-xl font-black text-orange-700 mt-2">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
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
          <div className="panel-shell adaptive-card p-5 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-black text-stone-900 mb-6">
              Delivery Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Hari Prasad"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., 0123456789"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Complete Delivery Address</label>
                <textarea
                  rows="4"
                  placeholder="Door Number, Street Name, Landmark, City/Village"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">6-Digit Pincode</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="e.g., 111111"
                  value={customer.pincode}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      pincode: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn btn-primary w-full py-4 mt-6 text-base font-bold"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-stone-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Secure Order...
                  </span>
                ) : (
                  `Pay ₹${totalAmount}`
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}

export default CheckoutPage;