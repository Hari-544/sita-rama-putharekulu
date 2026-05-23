import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";

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

    setProcessing(true);

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          pincode: customer.pincode,
          order_details: `${product.name} - ₹${product.price}`,
          total_amount: product.price,
        }),
      });

      setTimeout(() => {
        window.open(product.paymentLink, "_blank");
        setTimeout(() => {
          window.location.href = "/success";
        }, 500);
      }, 200);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[22px] border border-orange-100 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-extrabold text-orange-950">
            Product not found
          </h1>
          <p className="mt-3 text-gray-600">
            The item you are looking for is not available.
          </p>
          <Link to="/" className="btn btn-primary px-7 py-3 mt-6">
            Back To Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-700 font-semibold hover:text-orange-950 transition"
        >
          ← Back To Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          <section className="product-card rounded-[22px] overflow-hidden">
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[300px] md:h-[500px] object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-orange">Handmade</span>
                <span className="badge badge-yellow">Fresh</span>
                <span className="badge badge-green">Premium</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-orange-950 leading-tight">
                {product.name}
              </h1>

              <p className="mt-5 text-gray-600 text-lg leading-8">
                {product.sizes}
              </p>

              <div className="mt-8">
                <p className="text-sm text-gray-500">Starting Price</p>
                <p className="text-4xl font-extrabold text-green-700">
                  ₹{product.price}
                </p>
              </div>
            </div>
          </section>

          <section className="checkout-panel bg-white rounded-[22px] border border-orange-100 p-6 md:p-10 h-fit lg:sticky lg:top-28">
            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-950">
              Delivery Details
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Please enter your shipping details carefully for smooth delivery.
            </p>

            <div className="space-y-5 mt-8">
              <input
                type="text"
                placeholder="Full Name"
                value={customer.name}
                onChange={(e) => updateCustomer("name", e.target.value)}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) => updateCustomer("phone", e.target.value)}
              />

              <textarea
                placeholder="Delivery Address"
                rows="5"
                value={customer.address}
                onChange={(e) => updateCustomer("address", e.target.value)}
              />

              <input
                type="text"
                placeholder="Pincode"
                value={customer.pincode}
                onChange={(e) => updateCustomer("pincode", e.target.value)}
              />

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn btn-primary w-full py-4 text-lg"
              >
                {processing ? "Processing Order..." : "Proceed To Payment"}
              </button>

              <p className="text-sm text-gray-500 text-center leading-6">
                Secure payment powered by Razorpay.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default BuyNowPage;
