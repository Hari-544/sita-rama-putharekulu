import { useState } from "react";
import { Link } from "react-router-dom";

import "../App.css";
import Footer from "../components/Footer";

import hero from "../assets/hero.jpg";

import { products } from "../data/products";

function HomePage() {

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] =
    useState(false);

  const addToCart = (product) => {

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {

      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ]);
  };

  const increaseQty = (id) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {

    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  return (

    <div className="min-h-screen overflow-hidden">

      {/* NAVBAR */}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100">

        <div className="container flex items-center justify-between py-5">

          <div>

            <h1 className="brand-mark text-3xl md:text-4xl font-bold">

              SITA RAMA
              <span>
                {" "}PUTHAREKULU
              </span>

            </h1>

          </div>

          <nav className="hidden md:flex items-center gap-6">

            <a
              href="#products"
              className="nav-link"
            >
              Products
            </a>

            <Link
              to="/reviews"
              className="nav-link"
            >
              Reviews
            </Link>

            <button
              onClick={() =>
                setShowCart(true)
              }
              className="btn btn-primary px-5 py-3"
            >

              Cart (
              {cart.reduce(
                (count, item) =>
                  count +
                  item.quantity,
                0
              )}
              )

            </button>

          </nav>

        </div>

      </header>

      {/* HERO */}

      <section className="hero-section relative pt-10 md:pt-20 pb-20">

        <div className="hero-glow" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}

          <div>

            <p className="eyebrow">
              AUTHENTIC ATREYAPURAM SWEETS
            </p>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#2A1D14]">

              Handmade
              <br />

              Premium
              <br />

              Putharekulu

            </h1>

            <p className="mt-8 text-lg text-[#7A5C48] leading-8 max-w-xl">

              Traditional Andhra sweets handcrafted
              with rich dry fruits, premium ingredients,
              and authentic Atreyapuram taste.

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <a
                href="#products"
                className="btn btn-primary px-7 py-4"
              >
                Shop Collection
              </a>

              <Link
                to="/reviews"
                className="btn btn-secondary px-7 py-4"
              >
                Customer Reviews
              </Link>

            </div>

            {/* FEATURES */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14">

              <div className="text-center">

                <div className="w-16 h-16 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-3xl">

                  🌿

                </div>

                <p className="mt-3 text-sm font-semibold">
                  Pure Ingredients
                </p>

              </div>

              <div className="text-center">

                <div className="w-16 h-16 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-3xl">

                  ❤️

                </div>

                <p className="mt-3 text-sm font-semibold">
                  Handmade
                </p>

              </div>

              <div className="text-center">

                <div className="w-16 h-16 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-3xl">

                  🚚

                </div>

                <p className="mt-3 text-sm font-semibold">
                  Fast Delivery
                </p>

              </div>

              <div className="text-center">

                <div className="w-16 h-16 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-3xl">

                  ⭐

                </div>

                <p className="mt-3 text-sm font-semibold">
                  Premium Quality
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="hero-image relative rounded-[40px] overflow-hidden shadow-2xl">

              <img
                src={hero}
                alt="Putharekulu"
                className="h-[400px] md:h-[650px] object-cover"
              />

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="pb-24"
      >

        <div className="container">

          <div className="section-heading mb-14">

            <p className="eyebrow">
              OUR COLLECTION
            </p>

            <h2 className="text-4xl md:text-5xl font-bold">

              Crafted Sweet Experiences

            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (

              <div
                key={product.id}
                className="product-card rounded-[28px]"
              >

                <div className="relative overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[320px] object-cover"
                  />

                  <div className="absolute top-5 left-5">

                    <span className="badge badge-orange">

                      Bestseller

                    </span>

                  </div>

                </div>

                <div className="p-7">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-2xl font-bold text-[#2A1D14]">

                        {product.name}

                      </h3>

                      <p className="mt-2 text-[#7A5C48]">

                        {product.sizes}

                      </p>

                    </div>

                    <div className="price-badge">

                      ₹{product.price}

                    </div>

                  </div>

                  <div className="flex items-center gap-1 mt-5 text-yellow-500 text-lg">

                    ★★★★★

                  </div>

                  <div className="actions grid grid-cols-2 gap-4 mt-8">

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      className="btn btn-secondary py-4"
                    >
                      Add Cart
                    </button>

                    <Link
                      to={`/buy/${product.id}`}
                      className="btn btn-primary py-4"
                    >
                      Buy Now
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CART */}

      {showCart && (

        <div className="cart-drawer fixed top-0 right-0 h-screen w-full sm:w-[440px] z-50 p-6 overflow-y-auto">

          <div className="flex items-center justify-between mb-8">

            <div>

              <p className="eyebrow">
                YOUR ORDER
              </p>

              <h2 className="text-3xl font-bold">

                Shopping Cart

              </h2>

            </div>

            <button
              onClick={() =>
                setShowCart(false)
              }
              className="cart-close"
            >
              ×
            </button>

          </div>

          {cart.length === 0 ? (

            <div className="empty-state">

              Your cart is empty.

            </div>

          ) : (

            <>

              <div className="space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl"
                    />

                    <div className="flex-1">

                      <h3 className="font-bold text-lg">

                        {item.name}

                      </h3>

                      <p className="text-[#7A5C48] mt-1">

                        ₹{item.price}

                      </p>

                      <div className="qty-control mt-4">

                        <button
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.id)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              <div className="checkout-panel rounded-[28px] p-6 mt-8">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-semibold">

                    Total

                  </span>

                  <span className="text-3xl font-bold text-[#166534]">

                    ₹{totalAmount}

                  </span>

                </div>

                <button className="btn btn-primary w-full py-4 mt-8">

                  Proceed To Checkout

                </button>

              </div>

            </>

          )}

        </div>

      )}

      {/* CONTACT */}

      <section className="contact-band py-20 text-white">

        <div className="container text-center">

          <p className="eyebrow text-orange-200">

            CONTACT US

          </p>

          <h2 className="text-5xl font-bold">

            Order Fresh Putharekulu

          </h2>

          <p className="mt-6 text-orange-100 text-lg">

            WhatsApp us directly for bulk and custom orders.

          </p>

          <a
            href="https://wa.me/919652999544"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary px-8 py-5 mt-10"
          >

            Chat On WhatsApp

          </a>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default HomePage;