import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import "../App.css";

import Footer from "../components/Footer";
import hero from "../assets/premiumHero.jpg";
import { products } from "../data/products";
import { db } from "../firebase";

function HomePage() {

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [trackPhone, setTrackPhone] = useState("");
  const [trackOrderId, setTrackOrderId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState("");

  /* SAVE CART */

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);


  /* ADD TO CART */

  const addToCart = (product) => {

    setCart((currentCart) => {

      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];

    });

    // open cart page instead of drawer (CartPage reads localStorage)

  };

  /* INCREASE */
  // Not used in this page; quantity changes happen via addToCart/decreaseQty

  /* DECREASE */

  const decreaseQty = (id) => {

    setCart((currentCart) => {

      const itemExists = currentCart.find(
        (item) => item.id === id
      );

      if (!itemExists) {
        return currentCart;
      }

      return currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0);

    });

  };

  /* TOTALS */
  // totalAmount not used on this page; computed where needed in other pages

  const totalCartCount = cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  );

  const deliverySteps = [
    "Preparing",
    "Packed",
    "Shipped",
    "Delivered",
  ];

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = value?.toDate
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getCurrentStepIndex = (status) => {
    const currentStatus = status || "Preparing";
    const index = deliverySteps.indexOf(currentStatus);
    return index === -1 ? 0 : index;
  };

  const paymentBadgeClass = trackedOrder?.paymentStatus === "PAID"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : trackedOrder?.paymentStatus === "FAILED"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  const searchTrackedOrder = async () => {
    try {
      setTracking(true);
      setTrackError("");
      setTrackedOrder(null);

      const snapshot = await getDocs(collection(db, "orders"));
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const foundOrder = orders.find(
        (item) =>
          item.phone === trackPhone &&
          item.razorpayOrderId === trackOrderId
      );

      if (foundOrder) {
        setTrackedOrder(foundOrder);
      } else {
        setTrackError("Order not found");
      }
    } catch (error) {
      console.log(error);
      setTrackError("Something went wrong");
    } finally {
      setTracking(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#fffaf5] overflow-x-hidden">

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100 shadow-sm">

        <div className="container mx-auto px-4 flex items-center justify-between py-5">

          <Link to="/" className="leading-none">

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900">
              SITA RAMA
            </h1>

            <span className="text-orange-600 text-xs tracking-[0.3em] font-semibold">
              PUTHAREKULU
            </span>

          </Link>

          <nav className="flex items-center gap-3">

            <a
              href="#products"
              className="hidden sm:block text-sm font-semibold text-stone-700 hover:text-orange-600"
            >
              Our Sweets
            </a>

            <Link
              to="/reviews"
              className="hidden sm:block text-sm font-semibold text-stone-700 hover:text-orange-600"
            >
              Reviews
            </Link>

            <Link
              to="/cart"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full flex items-center gap-2 font-bold transition"
            >
              Cart
              <span className="bg-white text-orange-700 rounded-full px-2 py-0.5 text-xs">
                {totalCartCount}
              </span>
            </Link>

            <a
              href="#track-order"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700 transition hover:border-orange-400 hover:bg-orange-50"
            >
              📦 Track Order
            </a>

          </nav>

        </div>

      </header>

      {/* HERO */}

      <section className="py-10 lg:py-20">

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 text-center lg:text-left">

            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-5 py-2 rounded-full text-xs font-bold uppercase">
              ✨ Authentic Atreyapuram Craftsmanship
            </span>

            <h1 className="fluid-title font-black leading-none text-stone-900">

              Handmade

              <br />

              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                Premium Pure
              </span>

              <br />

              Putharekulu

            </h1>

            <p className="fluid-body text-stone-600 max-w-xl mx-auto lg:mx-0">
              Authentic Andhra sweets handcrafted with pure ghee, premium dry fruits and traditional methods.
            </p>

          </div>

          <div className="relative">

            <div className="rounded-[32px] overflow-hidden shadow-2xl border border-orange-100">

              <img
                src={hero}
                alt="Premium Putharekulu"
                className="responsive-image aspect-[16/10] sm:aspect-[4/3] lg:aspect-[5/4]"
              />

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="bg-white rounded-t-[50px] py-16"
      >

        <div className="container mx-auto px-4">

          <div className="text-center mb-14">

            <span className="text-orange-600 text-xs uppercase tracking-[0.3em] font-black">
              Freshly Prepared
            </span>

            <h2 className="fluid-heading font-black text-stone-900 mt-4">
              Our Signature Collection
            </h2>

          </div>

              {/* GRID */}

            {/* PRODUCT GRID */}

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6 xl:gap-7">

  {products.map((product) => {

    const cartItem = cart.find(
      (item) => item.id === product.id
    );

    const quantity = cartItem?.quantity || 0;

    return (

      <article
        key={product.id}
        className="group relative overflow-hidden rounded-[30px] border border-orange-100 bg-white shadow-[0_10px_35px_rgba(249,115,22,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(249,115,22,0.18)]"
      >

        {/* PREMIUM BADGE */}

        <div className="absolute left-4 top-4 z-20">

          <span className="rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg">
            Premium
          </span>

        </div>

        {/* HEART BUTTON */}

        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-orange-500 shadow-lg backdrop-blur-md transition hover:scale-110"
        >
          ❤
        </button>

        {/* IMAGE SECTION */}

        <div className="relative overflow-hidden bg-linear-to-b from-orange-50 to-white p-4">

          <div className="overflow-hidden rounded-[24px] bg-white">

            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

          </div>

        </div>

        {/* CONTENT */}

        <div className="space-y-5 p-5">

          {/* TITLE */}

          <div>

            <h3 className="text-[1.25rem] font-black leading-tight text-stone-900 transition-colors duration-300 group-hover:text-orange-600">
              {product.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              {product.sizes}
            </p>

          </div>

          {/* INFO PILLS */}

          <div className="flex flex-wrap gap-2">

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-100">
              🥇 Handmade
            </span>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-100">
              🌿 Pure Ghee
            </span>

          </div>

          {/* PRICE + STOCK */}

          <div className="flex items-center justify-between">

            <div>

              <p className="text-3xl font-black text-orange-700">
                ₹{product.price}
              </p>

              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-400">
                Freshly Prepared
              </p>

            </div>

            <div className="rounded-2xl bg-green-50 px-3 py-2 text-right border border-green-100">

              <p className="text-xs font-black text-green-700">
                ● In Stock
              </p>

              <p className="text-[10px] text-green-600">
                Fast Delivery
              </p>

            </div>

          </div>

          {/* QUANTITY */}

          <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">

            <span className="text-sm font-bold text-stone-700">
              Quantity
            </span>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => decreaseQty(product.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-black text-orange-700 shadow-sm transition hover:bg-orange-100"
              >
                −
              </button>

              <span className="w-6 text-center text-lg font-black text-stone-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => addToCart(product)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white shadow-md transition hover:bg-orange-700"
              >
                +
              </button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-2xl border border-orange-200 bg-white py-3.5 text-sm font-black text-orange-700 transition-all duration-300 hover:border-orange-500 hover:bg-orange-50"
            >
              Add To Cart
            </button>

            <Link
              to="/checkout"
              className="rounded-2xl bg-linear-to-r from-orange-600 to-amber-500 py-3.5 text-center text-sm font-black text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              ⚡ Buy Now
            </Link>

          </div>

        </div>

      </article>

    );

  })}

    </div>

      </div>

      </section>

      {/* TRACK ORDER */}

      <section
        id="track-order"
        className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-50 py-16 sm:py-24"
      >

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

        <div className="container mx-auto px-4">

          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              Live Tracking
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
              Track Your Order
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              Check your order status, payment details, and product list right from the homepage.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.45fr]">

            <aside className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_20px_60px_rgba(249,115,22,0.08)] sm:p-8">

              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                    Track Order
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-stone-900">
                    Find your parcel
                  </h3>
                </div>

                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
                    Secure lookup
                  </p>
                  <p className="mt-1 text-sm font-black text-orange-700">
                    Mobile friendly
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone number used at checkout"
                    value={trackPhone}
                    onChange={(e) => setTrackPhone(e.target.value)}
                    className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Razorpay Order ID
                  </label>
                  <input
                    type="text"
                    placeholder="Order ID from payment"
                    value={trackOrderId}
                    onChange={(e) => setTrackOrderId(e.target.value)}
                    className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <button
                  onClick={searchTrackedOrder}
                  disabled={tracking}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-orange-200 transition duration-200 hover:-translate-y-0.5 hover:from-orange-500 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {tracking ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Searching...
                    </>
                  ) : (
                    "📦 Track Order"
                  )}
                </button>

                <p className="text-xs leading-6 text-stone-500">
                  Enter the same phone number and Razorpay order ID used during checkout.
                </p>
              </div>

              {trackError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {trackError}
                </div>
              )}

              {tracking && (
                <div className="mt-6 space-y-3 rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-4">
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-orange-200" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-orange-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded-full bg-orange-100" />
                  <div className="h-32 rounded-[1.25rem] bg-white/80" />
                </div>
              )}

              {!tracking && !trackedOrder && !trackError && (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50/60 p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                    🧡
                  </div>
                  <h4 className="mt-4 text-lg font-black text-stone-900">
                    Ready to track
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Your order timeline will appear here once a valid order is found.
                  </p>
                </div>
              )}

            </aside>

            <article className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_20px_60px_rgba(249,115,22,0.08)] sm:p-6 lg:p-8">

              {!trackedOrder ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-orange-200 bg-gradient-to-b from-orange-50 to-white p-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
                    📍
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-stone-900">
                    No Order Found
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-stone-500">
                    Search with your phone number and Razorpay order ID to see the live delivery progress, order details, and products.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                            Order Overview
                          </p>
                          <h3 className="mt-2 text-3xl font-black tracking-tight text-stone-900">
                            {trackedOrder.customerName}
                          </h3>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                              Phone Number
                            </p>
                            <p className="mt-1 text-sm font-semibold text-stone-900">
                              {trackedOrder.phone || "Not available"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                              Created Date
                            </p>
                            <p className="mt-1 text-sm font-semibold text-stone-900">
                              {formatDate(trackedOrder.createdAt)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100 sm:col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                              Delivery Address
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-6 text-stone-900">
                              {trackedOrder.address || "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[260px] xl:grid-cols-1">
                        <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-sm ring-1 ring-orange-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                            Order ID
                          </p>
                          <p className="mt-1 break-all text-sm font-black text-stone-900">
                            {trackedOrder.razorpayOrderId || trackedOrder.id}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-sm ring-1 ring-orange-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                            Order Amount
                          </p>
                          <p className="mt-1 text-3xl font-black tracking-tight text-orange-700">
                            ₹{trackedOrder.totalAmount}
                          </p>
                        </div>

                        <div className={`rounded-2xl border px-4 py-4 shadow-sm ${paymentBadgeClass}`}>
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-70">
                            Payment Status
                          </p>
                          <p className="mt-1 text-sm font-black">
                            {trackedOrder.paymentStatus || "PENDING"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                          Delivery Progress
                        </p>
                        <h4 className="mt-2 text-2xl font-black text-stone-900">
                          Live Status
                        </h4>
                      </div>
                      <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                        Current: {trackedOrder.status || "Preparing"}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 right-4 top-4 hidden h-0.5 bg-stone-200 sm:block" />

                      <div className="grid gap-4 sm:grid-cols-4 sm:gap-2">
                        {deliverySteps.map((step, index) => {
                          const currentStep = getCurrentStepIndex(trackedOrder.status);
                          const isCompleted = index < currentStep;
                          const isActive = index === currentStep;
                          const isFuture = index > currentStep;

                          return (
                            <div key={step} className="relative z-10 flex flex-col items-start gap-3 sm:items-center sm:text-center">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black transition ${
                                  isCompleted
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                    : isActive
                                      ? "border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-200"
                                      : "border-stone-300 bg-white text-stone-400"
                                }`}
                              >
                                {isCompleted ? "✓" : index + 1}
                              </div>

                              <div className="space-y-1 sm:max-w-[110px]">
                                <p className={`text-sm font-black ${isActive ? "text-stone-900" : isCompleted ? "text-emerald-700" : "text-stone-500"}`}>
                                  {step}
                                </p>
                                <p className={`text-xs leading-5 ${isFuture ? "text-stone-400" : "text-stone-500"}`}>
                                  {isCompleted
                                    ? "Completed"
                                    : isActive
                                      ? "In progress"
                                      : "Pending"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                          Products
                        </p>
                        <h4 className="mt-2 text-2xl font-black text-stone-900">
                          Ordered Items
                        </h4>
                      </div>

                      <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                        {trackedOrder.products?.length || 0} item(s)
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                      {trackedOrder.products?.map((product, index) => (
                        <article
                          key={`${product.name}-${index}`}
                          className="group overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(249,115,22,0.12)]"
                        >
                          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                            <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-orange-100 sm:h-24 sm:w-24 sm:flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            </div>

                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <h5 className="text-lg font-black text-stone-900">
                                    {product.name}
                                  </h5>
                                  <p className="mt-1 text-sm text-stone-500">
                                    Quantity and item price
                                  </p>
                                </div>

                                <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                                  Qty {product.quantity}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 border-t border-dashed border-orange-100 pt-3">
                                <p className="text-sm font-semibold text-stone-500">
                                  Unit Price
                                </p>
                                <p className="text-xl font-black text-orange-700">
                                  ₹{product.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </article>

          </div>
        </div>

      </section>

      {/* Mobile quick navigation */}

      <nav className="sm:hidden fixed bottom-4 left-4 right-4 z-50 rounded-full border border-orange-100 bg-white/95 px-3 py-2 shadow-[0_18px_50px_rgba(249,115,22,0.18)] backdrop-blur">
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-stone-600">
          <Link to="/" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">🏠</span>
            Home
          </Link>
          <a href="#products" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">🛍️</span>
            Shop
          </a>
          <a href="#track-order" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">📦</span>
            Track
          </a>
          <Link to="/cart" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">🛒</span>
            Cart
          </Link>
        </div>
      </nav>

      {/* Cart is now a separate page at /cart */}

      <button
        type="button"
        onClick={() =>
          document.getElementById("track-order")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-3 text-sm font-black text-white shadow-[0_18px_35px_rgba(249,115,22,0.35)] transition duration-200 hover:-translate-y-1 hover:from-orange-500 hover:to-amber-400 sm:bottom-6 sm:right-6"
      >
        📦 Track Order
      </button>

      <Footer />

    </div>

  );
}

export default HomePage;