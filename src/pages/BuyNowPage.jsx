import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import { products } from "../data/products";

function BuyNowPage() {

  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [processing, setProcessing] =
    useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

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

    const formData = {
      access_key:
        "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",

      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      pincode: customer.pincode,

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
            "Content-Type":
              "application/json",

            Accept: "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      setTimeout(() => {

        window.open(product.paymentLink, "_blank");
        setTimeout(() => {
          window.location.href = "/success";
        }, 500);
    }, 200);

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
      setProcessing(false);
    }
  };

  return (

    <div className="min-h-screen bg-orange-50 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        <Link
          to="/"
          className="text-orange-700 font-semibold"
        >
          ← Back To Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

          {/* Product */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />

            <div className="p-6">

              <h1 className="text-4xl font-bold text-orange-900">
                {product.name}
              </h1>

              <p className="mt-4 text-gray-600">
                {product.sizes}
              </p>

              <p className="mt-6 text-3xl font-extrabold text-green-700">
                ₹{product.price}
              </p>

            </div>

          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold text-orange-800 mb-8">
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
                className="w-full border p-4 rounded-2xl"
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
                className="w-full border p-4 rounded-2xl"
              />

              <textarea
                placeholder="Delivery Address"
                rows="5"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address: e.target.value,
                  })
                }
                className="w-full border p-4 rounded-2xl"
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
                className="w-full border p-4 rounded-2xl"
              />

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-orange-700 hover:bg-orange-800 text-white py-4 rounded-2xl text-lg font-bold"
              >
                {processing
                  ? "Processing Order..."
                  : "Proceed To Payment"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BuyNowPage;