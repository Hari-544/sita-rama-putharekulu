import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  useState,
} from "react";

import {
  db,
} from "../firebase";

function TrackOrder() {

  const [phone, setPhone] =
    useState("");

  const [orderId, setOrderId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [order, setOrder] =
    useState(null);

  const [error, setError] =
    useState("");

  const searchOrder =
    async () => {

      try {

        setLoading(true);

        setError("");

        setOrder(null);

        const snapshot =
          await getDocs(
            collection(
              db,
              "orders"
            )
          );

        const orders =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        const foundOrder =
          orders.find(
            (item) =>
              item.phone ===
                phone &&
              item.razorpayOrderId ===
                orderId
          );

        if (foundOrder) {

          setOrder(
            foundOrder
          );

        } else {

          setError(
            "Order not found"
          );

        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        setError(
          "Something went wrong"
        );

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-[#fffaf5] py-10 px-4">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-black text-orange-700 text-center mb-10">
          Track Your Order
        </h1>

        {/* SEARCH */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
            />

            <input
              type="text"
              placeholder="Razorpay Order ID"
              value={orderId}
              onChange={(e) =>
                setOrderId(
                  e.target.value
                )
              }
              className="w-full border border-orange-100 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
            />

            <button
              onClick={
                searchOrder
              }
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-lg"
            >

              {loading
                ? "Searching..."
                : "Track Order"}

            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div className="bg-red-100 text-red-700 p-5 rounded-2xl mt-6 font-bold">
            {error}
          </div>

        )}

        {/* ORDER */}

        {order && (

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 mt-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

              <div>

                <h2 className="text-3xl font-black text-stone-900">
                  {
                    order.customerName
                  }
                </h2>

                <p className="text-stone-500 mt-2">
                  📞 {order.phone}
                </p>

                <p className="text-stone-500">
                  📍 {order.address}
                </p>

              </div>

              <div className="text-left lg:text-right">

                <p className="text-4xl font-black text-orange-700">
                  ₹
                  {
                    order.totalAmount
                  }
                </p>

                <p className="font-bold text-green-600 mt-2">
                  {
                    order.paymentStatus
                  }
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="bg-orange-50 rounded-3xl p-6 mb-8">

              <h3 className="text-xl font-black mb-5">
                Delivery Status
              </h3>

              <div className="flex flex-wrap gap-4">

                <div
                  className={`px-5 py-3 rounded-full font-bold text-white ${
                    (
                      order.status ||
                      "Preparing"
                    ) === "Preparing"
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                >
                  Preparing
                </div>

                <div
                  className={`px-5 py-3 rounded-full font-bold text-white ${
                    order.status ===
                    "Packed"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                >
                  Packed
                </div>

                <div
                  className={`px-5 py-3 rounded-full font-bold text-white ${
                    order.status ===
                    "Shipped"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  Shipped
                </div>

                <div
                  className={`px-5 py-3 rounded-full font-bold text-white ${
                    order.status ===
                    "Delivered"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  Delivered
                </div>

              </div>

            </div>

            {/* PRODUCTS */}

            <div>

              <h3 className="text-2xl font-black mb-5">
                Ordered Products
              </h3>

              <div className="space-y-4">

                {order.products?.map(
                  (
                    product,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex items-center justify-between bg-orange-50 rounded-2xl p-4"
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="w-20 h-20 rounded-2xl object-cover"
                        />

                        <div>

                          <h4 className="font-bold text-lg">
                            {
                              product.name
                            }
                          </h4>

                          <p className="text-stone-500">
                            Qty:
                            {" "}
                            {
                              product.quantity
                            }
                          </p>

                        </div>

                      </div>

                      <p className="text-2xl font-black text-orange-700">
                        ₹
                        {
                          product.price
                        }
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default TrackOrder;