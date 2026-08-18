import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { loadRazorpay } from "../utils/loadRazorpay";
import {
  cloudinarySrcSet,
  optimizeCloudinaryImage,
} from "../utils/image";
import { setSeoMeta } from "../utils/seo";

function CheckoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setSeoMeta({
      title: "Checkout | Sita Rama Putharekulu",
      description:
        "Secure checkout for authentic Atreyapuram Putharekulu. Complete your handmade sweets order and payment safely.",
      path: "/checkout",
      image: "/og-image.svg",
      noindex: true,
    });
  }, []);

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
      email: "",
      phone: "",
      address: "",
      pincode: "",
    });

  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://sita-rama-backend.onrender.com");

  const parseResponseJson = async (response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  /* TOTAL */

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const handlingFee =
    subtotal > 0 && subtotal < 500
      ? 15
      : subtotal >= 500
        ? 25
        : 0;

  const finalTotal =
    subtotal + handlingFee;

  /* SAVE ORDER TO FIREBASE */

  const saveOrderToFirebase =
    async (
      paymentStatus,
      response = {}
    ) => {

      try {

        await addDoc(
          collection(
            db,
            "orders"
          ),
          {
              customerName:
                customer.name,

              customerEmail:
                customer.email,

              phone:
                customer.phone,

              address:
                customer.address,

              pincode:
                customer.pincode,

              products:
                cart,

              subtotal,

              handlingFee,

              finalTotal,

              totalAmount: finalTotal,

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

        return true;

      } catch (firebaseError) {

        console.error(
          "FIREBASE ERROR:",
          firebaseError
        );

        return false;

      }

    };

  /* PAYMENT */

  const handlePayment = async () => {

    try {

      if (
        !customer.name ||
        !customer.email ||
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

      if (!import.meta.env.VITE_RAZORPAY_KEY && !import.meta.env.VITE_RAZORPAY_KEY_ID) {
        alert("Payment configuration is unavailable. Please contact support.");
        setProcessing(false);
        return;
      }

      await loadRazorpay();

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
                finalTotal,
            }),
          }
        );

      const order =
        await parseResponseJson(orderResponse);

      if (!orderResponse.ok || !order?.id || !order?.amount) {
        throw new Error(
          order?.message ||
          order?.error ||
          "Unable to create Razorpay order"
        );
      }

      /* RAZORPAY */

      const options = {

        key:
          import.meta.env
            .VITE_RAZORPAY_KEY ||
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

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

              /* VERIFY PAYMENT */

              const verifyPayload = {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                customerName:
                  customer.name.trim(),

                email:
                  customer.email.trim(),

                subtotal,

                handlingFee,

                finalTotal,

                totalAmount:
                  finalTotal,
              };

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
                      JSON.stringify(
                        verifyPayload
                      ),
                  }
                );
                const verifyData =
                  await parseResponseJson(verifyResponse);

                if (!verifyResponse.ok || !verifyData?.success) {
                  throw new Error(
                    verifyData?.message ||
                    verifyData?.error ||
                    "Payment verification failed"
                  );
                }
              const emailErrorMessage =
                verifyData.emailError?.response ||
                verifyData.emailError?.message ||
                "Check backend logs for SMTP details.";

              /* SUCCESS */

              if (
                verifyData.success
              ) {

                /* SAVE TO FIREBASE */

                const savedToFirebase = await saveOrderToFirebase(
                    "PAID",
                    response
                  );

                if (!savedToFirebase) {
                  alert("Payment completed, but order sync to Firebase failed. Please contact support if this persists.");
                }

                /* WEB3FORMS */

                try {

                  const formData =
                    new FormData();

                  formData.append(
                    "access_key",
                    "723218c9-686f-484f-a5fc-1542b62b559a"
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
                    "Email",
                    customer.email
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
                    `₹${finalTotal}`
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

                } catch (web3Error) {

                  console.error(
                    "WEB3FORM ERROR:",
                    web3Error
                  );

                }

                /* CLEAR CART */

                localStorage.removeItem(
                  "cart"
                );

                setCart([]);

                setCustomer({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  pincode: "",
                });

                setProcessing(
                  false
                );

                navigate(
                  "/success",
                  {
                    replace: true,
                    state: {
                      orderId: response.razorpay_order_id,
                      amount: finalTotal,
                      subtotal,
                      handlingFee,
                      finalTotal,
                      customerName: customer.name.trim(),
                      customerEmail: customer.email.trim(),
                      emailSent: Boolean(verifyData.emailSent),
                      emailError: verifyData.emailSent
                        ? ""
                        : emailErrorMessage,
                    },
                  }
                );

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

              console.error(
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

          email:
            customer.email,

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

          console.error(
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

      console.error(
        "MAIN ERROR:",
        error
      );

      alert(
          error?.message || "Something went wrong"
      );

      setProcessing(false);

    }

  };

  return (

    <div className="checkout-page min-h-screen bg-[#fffaf5] px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 xl:py-10">

      <div className="checkout-shell mx-auto w-full max-w-[1500px]">

        <div className="checkout-header mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/"
            className="checkout-back-link order-2 text-sm font-bold text-orange-700 hover:text-orange-900 sm:order-1 sm:text-base"
          >
            ← Back To Store
          </Link>

          <h1 className="checkout-title order-1 text-3xl font-black tracking-tight text-stone-900 sm:order-2 sm:text-4xl lg:text-5xl">
            Checkout
          </h1>

        </div>

        <div className="checkout-grid grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start xl:gap-8 2xl:gap-10">

          {/* LEFT */}

          <div className="panel-shell adaptive-card checkout-card p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8">

            <h2 className="mb-4 text-xl font-black text-stone-900 sm:mb-5 sm:text-2xl lg:mb-6">
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
                    className="checkout-product-card grid grid-cols-[72px,minmax(0,1fr)] items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-3 sm:grid-cols-[88px,minmax(0,1fr)] sm:gap-4 sm:p-4"
                  >

                    <img
                      src={optimizeCloudinaryImage(
                        item.image,
                        240
                      )}
                      srcSet={cloudinarySrcSet(
                        item.image,
                        [160, 240, 360]
                      )}
                      sizes="(min-width: 640px) 7.5rem, 6.5rem"
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      width="120"
                      height="120"
                      className="aspect-square w-full max-w-[72px] rounded-xl object-cover shadow-sm sm:max-w-[88px] sm:rounded-2xl"
                    />

                    <div className="min-w-0">

                      <h3 className="font-bold text-stone-900">
                        {item.name}
                      </h3>

                      <p className="text-sm text-stone-500 mt-1">
                        Qty: {item.quantity}
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

              <>

              <div className="border-t border-orange-100 mt-8 pt-6 flex items-center justify-between">

                <span className="text-lg font-semibold text-stone-600">
                  Subtotal
                </span>

                <span className="text-2xl font-black text-orange-700 sm:text-3xl lg:text-4xl">
                  ₹{subtotal}
                </span>

              </div>

              <div className="flex items-center justify-between border-t border-orange-100 pt-4">

                <span className="text-lg font-semibold text-stone-600">
                  Handling Fee
                </span>

                <span className="text-xl font-black text-orange-700 sm:text-2xl">
                  ₹{handlingFee}
                </span>

              </div>

              <div className="flex items-center justify-between border-t border-orange-100 pt-4">

                <span className="text-lg font-semibold text-stone-600">
                  Final Total
                </span>

                <span className="text-2xl font-black text-orange-700 sm:text-3xl lg:text-4xl">
                  ₹{finalTotal}
                </span>

              </div>

              </>

            )}

          </div>

          {/* RIGHT */}

          <div className="panel-shell adaptive-card checkout-card p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8">

            <h2 className="mb-4 text-xl font-black text-stone-900 sm:mb-5 sm:text-2xl lg:mb-6">
              Delivery Details
            </h2>

            <div className="space-y-5">

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="e.g., Hari Krishna"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name: e.target.value,
                    })
                  }
                  className="min-h-[50px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
                />

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="e.g., example@gmail.com"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email: e.target.value,
                    })
                  }
                  className="min-h-[50px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
                />

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone: e.target.value,
                    })
                  }
                  className="min-h-[50px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
                />

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Complete Delivery Address
                </label>

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
                  className="min-h-[50px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
                />

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  6-Digit Pincode
                </label>

                <input
                  type="text"
                  maxLength="6"
                  placeholder="e.g., 533214"
                  value={customer.pincode}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      pincode: e.target.value,
                    })
                  }
                  className="min-h-[50px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
                />

              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn btn-primary mt-5 min-h-[56px] w-full rounded-2xl py-4 text-base font-extrabold shadow-lg sm:mt-6 sm:min-h-[60px] sm:text-lg"
              >

                {processing ? (

                  <span className="flex items-center justify-center gap-2">

                    <svg
                      className="animate-spin h-5 w-5 text-stone-950"
                      fill="none"
                      viewBox="0 0 24 24"
                    >

                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />

                    </svg>

                    Processing Secure Order...

                  </span>

                ) : (

                  `Pay ₹${finalTotal}`

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