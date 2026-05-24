import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

import Footer from "../components/Footer";
import hero from "../assets/premiumHero.jpg";
import { products } from "../data/products";

function HomePage() {

  const [cart, setCart] = useState([]);

  /* LOAD CART */

  useEffect(() => {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

  }, []);

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

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalCartCount = cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  );

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

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none text-stone-900">

              Handmade

              <br />

              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                Premium Pure
              </span>

              <br />

              Putharekulu

            </h1>

            <p className="text-stone-600 text-lg leading-8 max-w-xl mx-auto lg:mx-0">
              Authentic Andhra sweets handcrafted with pure ghee, premium dry fruits and traditional methods.
            </p>

          </div>

          <div className="relative">

            <div className="rounded-[32px] overflow-hidden shadow-2xl border border-orange-100">

              <img
                src={hero}
                alt="Premium Putharekulu"
                className="w-full h-full object-cover"
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

            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 mt-4">
              Our Signature Collection
            </h2>

          </div>

              {/* GRID */}

            {/* PRODUCT GRID */}

    <div className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-7">

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
              className="h-[260px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

      {/* Cart is now a separate page at /cart */}

      <Footer />

    </div>

  );
}

export default HomePage;