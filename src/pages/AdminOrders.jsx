import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../firebase";

function AdminOrders({ embedded = false }) {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const pageShellClass = embedded
    ? "w-full"
    : "min-h-screen bg-[#fffaf5] p-4 sm:p-6";

  const pageInnerClass = embedded
    ? "w-full"
    : "max-w-7xl mx-auto";

  const pageTitleClass = embedded
    ? "hidden"
    : "fluid-heading font-black text-orange-700 mb-8";

  /* FETCH ORDERS */

  useEffect(() => {

    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    try {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
          setLoading(false);
        },
        (err) => {
          console.error("Orders snapshot error:", err);
          // If permissions are denied, surface an empty list and stop loading
          setOrders([]);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to initialize orders listener:", err);
      setOrders([]);
      setLoading(false);
      return () => {};
    }

  }, []);

  /* UPDATE STATUS */

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await updateDoc(
        doc(db, "orders", id),
        {
          status: status,
        }
      );

      alert("Status Updated ✅");

    } catch (error) {

      console.log(error);

      alert("Failed To Update");

    }

  };

  /* FILTER */

  const filteredOrders =
    orders.filter((order) => {

      const name =
        order.customerName
          ?.toLowerCase() || "";

      const phone =
        order.phone || "";

      return (
        name.includes(
          search.toLowerCase()
        ) ||
        phone.includes(search)
      );

    });

  /* STATS */

  const totalRevenue =
    orders
      .filter(
        (o) =>
          o.paymentStatus === "PAID"
      )
      .reduce(
        (acc, item) =>
          acc + item.totalAmount,
        0
      );

  const paidOrders =
    orders.filter(
      (o) =>
        o.paymentStatus === "PAID"
    ).length;

  const failedOrders =
    orders.filter(
      (o) =>
        o.paymentStatus === "FAILED"
    ).length;

  return (

    <div className={pageShellClass}>

      <div className={pageInnerClass}>

        <h1 className={pageTitleClass}>
          Admin Orders Dashboard
        </h1>

        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">

          <div className="panel-shell p-6">
            <h2 className="text-stone-500 font-semibold">
              Total Orders
            </h2>

            <p className="text-4xl font-black mt-2 text-stone-950">
              {orders.length}
            </p>
          </div>

          <div className="panel-shell p-6">
            <h2 className="text-stone-500 font-semibold">
              Paid Orders
            </h2>

            <p className="text-4xl font-black text-green-600 mt-2">
              {paidOrders}
            </p>
          </div>

          <div className="panel-shell p-6">
            <h2 className="text-stone-500 font-semibold">
              Failed Orders
            </h2>

            <p className="text-4xl font-black text-red-600 mt-2">
              {failedOrders}
            </p>
          </div>

          <div className="panel-shell p-6">
            <h2 className="text-stone-500 font-semibold">
              Revenue
            </h2>

            <p className="text-4xl font-black text-orange-700 mt-2">
              ₹{totalRevenue}
            </p>
          </div>

        </div>

        {/* SEARCH */}

        <div className="mb-8 max-w-2xl">

          <input
            type="text"
            placeholder="Search customer or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* ORDERS */}

        {loading ? (

          <div className="text-center text-2xl font-bold">
            Loading Orders...
          </div>

        ) : filteredOrders.length === 0 ? (

          <div className="text-center text-2xl font-bold">
            No Orders Found
          </div>

        ) : (

          <div className="grid gap-6 2xl:grid-cols-2">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100"
                >

                  {/* TOP */}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-5">

                    <div>

                      <h2 className="text-2xl font-black text-stone-900">
                        {
                          order.customerName
                        }
                      </h2>

                      <p className="text-stone-500 mt-1">
                        📞 {order.phone}
                      </p>

                      <p className="text-stone-500">
                        📍 {order.address}
                      </p>

                      <p className="text-stone-500">
                        Pincode:{" "}
                        {
                          order.pincode
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-3xl font-black text-orange-700">
                        ₹
                        {
                          order.totalAmount
                        }
                      </p>

                      <p
                        className={`font-bold mt-2 ${
                          order.paymentStatus ===
                          "PAID"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >

                        {
                          order.paymentStatus
                        }

                      </p>

                    </div>

                  </div>

                  {/* PRODUCTS */}

                  <div className="border-t border-orange-100 pt-5">

                    <h3 className="font-black text-lg mb-4">
                      Products
                    </h3>

                    <div className="space-y-3">

                      {order.products?.map(
                        (
                          product,
                          index
                        ) => (

                          <div
                            key={index}
                            className="flex items-center justify-between bg-orange-50 rounded-2xl p-4"
                          >

                            <div>

                              <p className="font-bold">
                                {
                                  product.name
                                }
                              </p>

                              <p className="text-sm text-stone-500">
                                Qty:{" "}
                                {
                                  product.quantity
                                }
                              </p>

                            </div>

                            <p className="font-black text-orange-700">
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

                  {/* PAYMENT IDS */}

                  <div className="mt-5 border-t border-orange-100 pt-5">

                    <p className="text-sm text-stone-500 break-all">
                      Payment ID:{" "}
                      {
                        order.razorpayPaymentId
                      }
                    </p>

                    <p className="text-sm text-stone-500 break-all mt-1">
                      Order ID:{" "}
                      {
                        order.razorpayOrderId
                      }
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="mt-5 border-t border-orange-100 pt-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                    <div>

                      <p className="font-bold mb-2">
                        Delivery Status
                      </p>

                      <select
                        value={
                          order.status ||
                          "Preparing"
                        }
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="!w-fit !py-2 !px-4 mt-2"
                      >

                        <option>
                          Preparing
                        </option>

                        <option>
                          Packed
                        </option>

                        <option>
                          Shipped
                        </option>

                        <option>
                          Delivered
                        </option>

                      </select>

                    </div>

                    <div className="text-stone-500 text-sm">

                      {order.createdAt
                        ?.toDate()
                        ?.toLocaleString()}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}

export default AdminOrders;