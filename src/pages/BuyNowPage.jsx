import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { loadRazorpay } from "../utils/loadRazorpay";
import {
  cloudinarySrcSet,
  optimizeCloudinaryImage,
} from "../utils/image";
import { setSeoMeta } from "../utils/seo";

function BuyNowPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const [processing, setProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const subtotal = product?.price ?? 0;
  const handlingFee =
    subtotal > 0 && subtotal < 500
      ? 15
      : subtotal >= 500
        ? 25
        : 0;
  const finalTotal = subtotal + handlingFee;

  useEffect(() => {
    if (!product) {
      setSeoMeta({
        title: "Product Not Found | Sita Rama Putharekulu",
        description:
          "Explore authentic Atreyapuram Putharekulu and handmade sweets from Sita Rama Putharekulu.",
        path: `/buy/${id}`,
        image: "/og-image.svg",
        noindex: true,
      });
      return;
    }

    setSeoMeta({
      title: `${product.name} | Buy Atreyapuram Putharekulu Online`,
      description: `${product.name} from Sita Rama Putharekulu. Handmade Atreyapuram Putharekulu with premium ingredients and online delivery.`,
      path: `/buy/${id}`,
      image: "/og-image.svg",
    });
  }, [id, product]);

const handlePayment = async () => {

  if (
    !customer.name ||
    !customer.phone ||
    !customer.address ||
    !customer.pincode
  ) {
    alert("Please enter all details.");
    return;
  }

  setProcessing(true);

  try {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      alert("Payment configuration is unavailable. Please contact support.");
      setProcessing(false);
      return;
    }

    await loadRazorpay();

    /* SEND ORDER DATA */

    await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          access_key: "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_address: customer.address,
          customer_pincode: customer.pincode,

          product_name: product.name,

          amount: finalTotal,
        }),
      }
    );

    /* RAZORPAY */

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: finalTotal * 100,

      currency: "INR",

      name: "SITA RAMA PUTHAREKULU",

      description: product.name,

      image: "/favicon.svg",

      handler: function () {
        setProcessing(false);
        window.location.href = "/success";
      },

      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },

      prefill: {
        name: customer.name,
        contact: customer.phone,
      },

      notes: {
        address: customer.address,
        pincode: customer.pincode,
      },

      theme: {
        color: "#ea580c",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("PAYMENT FAILED:", response);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    });

    razorpay.open();

  } catch (error) {

    console.error(error);

    alert(error?.message || "Payment failed.");

    setProcessing(false);

  }

};

  if (!product) {
    return (
          <main className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-4 sm:px-6">
            <div className="panel-shell mx-auto w-full max-w-md p-6 text-center sm:p-8">
              <h1 className="fluid-heading font-bold text-stone-900">Product Not Found</h1>
          <p className="mt-2 text-stone-500">The sweet item selected is temporarily unavailable.</p>
          <Link to="/" className="btn btn-primary mt-6 inline-flex">Return To Storefront</Link>
        </div>
      </main>
    );
  }

  return (
      <main className="min-h-screen bg-[#fffaf5] py-8 px-4 sm:py-14 sm:px-6">
        <div className="container">
        
        {/* Navigation Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-orange-700 font-medium hover:text-orange-950 transition-colors duration-200 mb-8 group">
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> Back To Storefront
        </Link>

        {/* Checkout Container Split Grid */}
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          
          {/* Left Column: Product Context Preview Panel */}
          <section className="panel-shell p-5 sm:p-6">
            <h2 className="text-xs uppercase tracking-widest text-orange-600 font-extrabold mb-4">Your Order</h2>
            <div className="mb-4 overflow-hidden rounded-2xl bg-orange-50">
              <div className="fluid-image-frame overflow-hidden rounded-2xl bg-orange-50">
                <img
                  src={optimizeCloudinaryImage(
                    product.image,
                    760
                  )}
                  srcSet={cloudinarySrcSet(
                    product.image,
                    [360, 560, 760]
                  )}
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  width="760"
                  height="570"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h3 className="fluid-heading font-bold text-stone-900">{product.name}</h3>
            <p className="text-sm text-stone-500 mt-1">{product.sizes}</p>
            
            <div className="border-t border-dashed border-orange-100 mt-6 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Fresh Preparation Base</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Secure Courier Packaging</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-900">Subtotal</span>
                <span className="text-2xl font-black text-orange-700">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Handling Fee</span>
                <span>₹{handlingFee}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-900">Final Total Due</span>
                <span className="text-2xl font-black text-orange-700">₹{finalTotal}</span>
              </div>
            </div>
          </section>

          {/* Right Column: High-End Delivery Form */}
          <section className="panel-shell p-5 sm:p-8">
            <h2 className="fluid-heading font-bold text-stone-900">Shipping & Verification Details</h2>
            <p className="text-sm text-stone-500 mt-2 mb-6">
              Orders are freshly curated upon real-time confirmation. Please ensure your WhatsApp phone number is precise.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Recipient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Hari Prasad"
                  value={customer.name}
                  onChange={(e) => updateCustomer("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">WhatsApp Contact Number</label>
                <input
                  type="tel"
                  placeholder="e.g., 9652999544"
                  value={customer.phone}
                  onChange={(e) => updateCustomer("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Complete Delivery Address</label>
                <textarea
                  placeholder="Door Number, Street Name, Landmark, City/Village Name"
                  rows="4"
                  value={customer.address}
                  onChange={(e) => updateCustomer("address", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">6-Digit Pincode</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="e.g., 533201"
                  value={customer.pincode}
                  onChange={(e) => updateCustomer("pincode", e.target.value)}
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn btn-primary w-full py-4 mt-4 text-base font-bold"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Secure Order...
                  </span>
                ) : (
                  `Proceed To Payment • ₹${finalTotal}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-stone-400">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 10.03 10.03 0 01-1.11 5.513c-.927 1.733-2.317 3.197-4.015 4.25a11.973 11.973 0 01-5.418 1.637A11.973 11.973 0 013.7 14.762c-1.698-1.053-3.088-2.517-4.015-4.25a10.03 10.03 0 01-1.11-5.513zm10.708 3.707a1 1 0 00-1.414-1.414L8 10.586 6.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure dynamic routing layer powered by Razorpay API gateway.
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

export default BuyNowPage;
