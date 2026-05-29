import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { db } from "../firebase";

const STATUS_OPTIONS = ["Preparing", "Packed", "Shipped", "Delivered"];

const STATUS_META = {
  Preparing: "bg-amber-100 text-amber-800 border-amber-200",
  Packed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-violet-100 text-violet-800 border-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const PAYMENT_META = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-100 text-rose-700 border-rose-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

function AdminOrders({ embedded = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const pageShellClass = embedded
    ? "w-full"
    : "min-h-screen bg-[#fffaf5] p-4 sm:p-6";

  const pageInnerClass = embedded ? "w-full" : "mx-auto w-full max-w-7xl";
  const pageTitleClass = embedded ? "hidden" : "mb-8 text-[clamp(2rem,4vw,3.5rem)] font-black text-orange-700";

  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://sita-rama-backend.onrender.com");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));

        if (!isMounted) return;

        const ordersData = snapshot.docs
          .map((orderDoc) => ({ id: orderDoc.id, ...orderDoc.data() }))
          .sort((left, right) => {
            const leftTime = left.createdAt?.seconds || 0;
            const rightTime = right.createdAt?.seconds || 0;
            return rightTime - leftTime;
          });

        setOrders(ordersData);
      } catch (err) {
        console.error("Orders fetch error:", err);
        if (!isMounted) return;
        setOrders([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (order, status) => {
    try {
      await updateDoc(doc(db, "orders", order.id), { status });

      setOrders((previousOrders) =>
        previousOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? {
                ...currentOrder,
                status,
              }
            : currentOrder
        )
      );

      try {
        const statusMailPayload = {
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orderId: order.razorpayOrderId || order.orderId || order.id,
          status,
        };

        const statusMailResponse = await fetch(
          `${API_BASE}/api/order/status-mail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(statusMailPayload),
          }
        );

        const statusMailData = await statusMailResponse.json().catch(() => ({}));

        if (!statusMailResponse.ok || !statusMailData.success) {
          throw new Error(
            statusMailData.error?.response ||
              statusMailData.error?.message ||
              statusMailData.message ||
              "Status email request failed"
          );
        }
      } catch (mailError) {
        console.error("MAIL ERROR:", mailError);
        alert(`Status Updated, but email failed: ${mailError.message}`);
        return;
      }

      alert("Status Updated ✅");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed To Update");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const name = order.customerName?.toLowerCase() || "";
    const phone = order.phone || "";
    const email = order.customerEmail?.toLowerCase() || "";
    const orderId = order.razorpayOrderId?.toLowerCase() || order.id?.toLowerCase() || "";
    return name.includes(query) || phone.includes(search) || email.includes(query) || orderId.includes(query);
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((acc, item) => acc + (item.finalTotal ?? item.totalAmount ?? 0), 0);

  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID").length;
  const failedOrders = orders.filter((o) => o.paymentStatus === "FAILED").length;

  return (
    <div className={pageShellClass}>
      <div className={pageInnerClass}>
        <h1 className={pageTitleClass}>Admin Orders Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Orders", value: orders.length, accent: "text-stone-950" },
            { label: "Paid Orders", value: paidOrders, accent: "text-emerald-600" },
            { label: "Failed Orders", value: failedOrders, accent: "text-rose-600" },
            { label: "Revenue", value: `₹${formatCurrency(totalRevenue)}`, accent: "text-orange-700" },
          ].map((stat) => (
            <div key={stat.label} className="panel-shell p-6">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-stone-500">
                {stat.label}
              </p>
              <p className={`mt-3 text-4xl font-black ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 max-w-2xl">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-stone-500">
            Search Orders
          </label>
          <input
            type="text"
            placeholder="Search by customer name, phone, email, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-2xl font-bold text-stone-700">Loading Orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="panel-shell p-8 text-center text-xl font-bold text-stone-700">
            No Orders Found
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredOrders.map((order) => {
              const currentStatus = order.status || "Preparing";
              const paymentStatus = order.paymentStatus || "PENDING";

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(249,115,22,0.08)]"
                >
                  <div className="border-b border-orange-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                          Order Summary
                        </p>
                        <h2 className="text-2xl font-black text-stone-950">
                          {order.customerName || "Unnamed Customer"}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em]">
                          <span className={`rounded-full border px-3 py-2 ${PAYMENT_META[paymentStatus] || PAYMENT_META.PENDING}`}>
                            {paymentStatus}
                          </span>
                          <span className={`rounded-full border px-3 py-2 ${STATUS_META[currentStatus] || STATUS_META.Preparing}`}>
                            {currentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-stone-500">
                          Final Amount
                        </p>
                        <p className="mt-2 text-3xl font-black text-orange-700">
                          ₹{formatCurrency(order.finalTotal ?? order.totalAmount)}
                        </p>
                        {order.createdAt?.toDate ? (
                          <p className="mt-2 text-sm text-stone-500">
                            {order.createdAt.toDate().toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                    <section className="rounded-[1.5rem] bg-orange-50/60 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                        Customer Info
                      </p>
                      <div className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                        <p className="font-black text-stone-950">{order.customerName || "—"}</p>
                        <p>Phone: {order.phone || "—"}</p>
                        <p>Email: {order.customerEmail || "—"}</p>
                        <p>Address: {order.address || "—"}</p>
                        <p>Pincode: {order.pincode || "—"}</p>
                      </div>
                    </section>

                    <section className="rounded-[1.5rem] bg-stone-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-stone-500">
                        Payment Info
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-stone-700">
                        <p>Subtotal: ₹{formatCurrency(order.subtotal)}</p>
                        <p>Handling Fee: ₹{formatCurrency(order.handlingFee)}</p>
                        <p className="font-black text-stone-950">Final Total: ₹{formatCurrency(order.finalTotal ?? order.totalAmount)}</p>
                        <p className="break-all">Payment ID: {order.razorpayPaymentId || "—"}</p>
                        <p className="break-all">Order ID: {order.razorpayOrderId || order.id}</p>
                      </div>
                    </section>
                  </div>

                  <div className="border-t border-orange-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                          Products
                        </p>
                        <h3 className="mt-1 text-lg font-black text-stone-950">
                          Item breakdown
                        </h3>
                      </div>
                      <p className="text-sm font-bold text-stone-500">
                        {order.products?.length || 0} items
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {order.products?.map((product, index) => (
                        <div
                          key={`${order.id}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white px-4 py-4"
                        >
                          <div>
                            <p className="font-black text-stone-950">{product.name}</p>
                            <p className="mt-1 text-sm text-stone-500">Qty: {product.quantity}</p>
                          </div>
                          <p className="text-base font-black text-orange-700">
                            ₹{formatCurrency(product.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-orange-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                            Delivery Status
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            Current status: <span className="font-black text-stone-900">{currentStatus}</span>
                          </p>
                        </div>

                        <p className="text-sm text-stone-500">
                          {order.createdAt?.toDate?.()?.toLocaleString() || "—"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {STATUS_OPTIONS.map((status) => {
                          const isActive = currentStatus === status;

                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateStatus(order, status)}
                              className={`rounded-2xl border px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${isActive ? STATUS_META[status] : "border-orange-100 bg-white text-stone-600 hover:border-orange-200 hover:bg-orange-50"}`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
