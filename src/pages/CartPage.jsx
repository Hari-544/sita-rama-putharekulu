import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CartPage() {

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* SAVE CART */

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  /* INCREASE */

  const increaseQty = (id) => {

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };

  /* DECREASE */

  const decreaseQty = (id) => {

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };

  /* REMOVE */

  const removeItem = (id) => {

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );

  };

  /* CLEAR */

  const clearCart = () => {
    setCart([]);
  };

  /* TOTAL */

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (

    <div className="min-h-screen bg-[#fffaf5] py-8 px-4 sm:py-10">

      <div className="container mx-auto max-w-6xl">

        {/* HEADER */}

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
              Shopping Cart
            </p>

            <h1 className="mt-2 fluid-heading font-black text-stone-900">
              Your Basket
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
            >
              ← Continue Shopping
            </Link>

            {cart.length > 0 && (

              <button
                onClick={clearCart}
                className="rounded-full bg-stone-100 px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-200"
              >
                Clear Cart
              </button>

            )}

          </div>

        </div>

        {/* EMPTY */}

        {cart.length === 0 ? (

          <div className="rounded-[36px] border border-orange-100 bg-white p-8 text-center shadow-sm sm:p-16">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-5xl sm:h-28 sm:w-28 sm:text-6xl">
              🛒
            </div>

            <h2 className="mt-8 fluid-heading font-black text-stone-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-stone-500">
              Add delicious sweets to continue shopping.
            </p>

            <Link
              to="/"
              className="mt-8 inline-block rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-8 py-4 font-black text-white shadow-lg transition hover:scale-[1.02]"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">

            {/* CART ITEMS */}

            <div className="space-y-6">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-[32px] border border-orange-100 bg-white p-4 shadow-[0_10px_35px_rgba(249,115,22,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.12)] sm:flex-row sm:p-5"
                >

                  {/* IMAGE */}

                 <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white p-3 sm:p-4">
                  <div className="overflow-hidden rounded-[24px] bg-white">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-[4/3] lg:aspect-square"
                    />
                  </div>
                </div>

                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col justify-between">

                    {/* TOP */}

                    <div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-2xl font-black text-stone-900">
                            {item.name}
                          </h3>

                          <p className="mt-2 text-sm text-stone-500">
                            {item.sizes}
                          </p>

                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-fit rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100"
                        >
                          Remove
                        </button>

                      </div>

                      {/* TAGS */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                          Handmade
                        </span>

                        <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          Fresh Stock
                        </span>

                        <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                          Premium Quality
                        </span>

                      </div>

                    </div>

                    {/* BOTTOM */}

                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      {/* PRICE */}

                      <div>

                        <p className="text-4xl font-black text-orange-700">
                          ₹{item.price * item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-stone-400">
                          ₹{item.price} each
                        </p>

                      </div>

                      {/* QTY */}

                      <div className="flex items-center gap-4 rounded-full border border-orange-100 bg-orange-50 px-4 py-3">

                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-black text-orange-700 shadow-sm transition hover:bg-orange-100"
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-xl font-black text-stone-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-2xl font-black text-white shadow-md transition hover:bg-orange-700"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* SUMMARY */}

            <div className="h-fit rounded-[32px] border border-orange-100 bg-white p-7 shadow-[0_10px_35px_rgba(249,115,22,0.06)]">

              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                Order Summary
              </p>

              <h2 className="mt-2 text-3xl font-black text-stone-900">
                Payment Details
              </h2>

              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between">

                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span className="font-black text-stone-900">
                    ₹{totalAmount}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-stone-500">
                    Delivery
                  </span>

                  <span className="font-black text-green-600">
                    FREE
                  </span>

                </div>

                <div className="border-t border-dashed border-orange-100 pt-5">

                  <div className="flex items-center justify-between">

                    <span className="text-lg font-bold text-stone-900">
                      Total Amount
                    </span>

                    <span className="text-4xl font-black text-orange-700">
                      ₹{totalAmount}
                    </span>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-8 space-y-4">

                <Link
                  to="/checkout"
                  className="block rounded-full bg-linear-to-r from-orange-600 to-amber-500 py-4 text-center text-lg font-black text-white shadow-lg transition hover:scale-[1.02]"
                >
                  Proceed To Checkout
                </Link>

                <Link
                  to="/"
                  className="block rounded-full border border-orange-200 bg-white py-4 text-center font-bold text-orange-700 transition hover:bg-orange-50"
                >
                  Continue Shopping
                </Link>

              </div>

              {/* FEATURES */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">

                  <p className="text-2xl">
                    🔒
                  </p>

                  <p className="mt-2 text-xs font-bold text-stone-700">
                    Secure Payment
                  </p>

                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">

                  <p className="text-2xl">
                    🚚
                  </p>

                  <p className="mt-2 text-xs font-bold text-stone-700">
                    Fast Delivery
                  </p>

                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">

                  <p className="text-2xl">
                    ⭐
                  </p>

                  <p className="mt-2 text-xs font-bold text-stone-700">
                    Premium Quality
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default CartPage;