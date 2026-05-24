import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Footer from "../components/Footer";
import hero from "../assets/premiumHero.jpg";
import { products } from "../data/products";

function HomePage() {

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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
                quantity: item.quantity + 1,
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

    setShowCart(true);
  };

  const increaseQty = (id) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
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
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

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

      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-orange-100 shadow-[0_8px_40px_rgba(249,115,22,0.08)]">

        <div className="container flex items-center justify-between py-5 lg:py-6">

          <Link
            to="/"
            className="leading-none"
          >

            <h1 className="text-[1.1rem] sm:text-2xl lg:text-3xl font-black tracking-tight text-stone-900">
              SITA RAMA
            </h1>

            <span className="text-orange-600 text-xs sm:text-sm tracking-[0.3em] font-semibold">
              PUTHAREKULU
            </span>

          </Link>

          <nav className="flex items-center gap-3 sm:gap-6">

            <a
              href="#products"
              className="nav-link hidden sm:block"
            >
              Our Sweets
            </a>

            <Link
              to="/reviews"
              className="nav-link hidden sm:block"
            >
              Reviews
            </Link>

            <button
              onClick={() => setShowCart(true)}
              className="btn btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2 rounded-full"
            >

              <span>Cart</span>

              <span className="bg-white text-orange-700 font-black px-2 py-0.5 rounded-full text-xs">
                {totalCartCount}
              </span>

            </button>

          </nav>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden pt-10 pb-18 lg:pt-16 lg:pb-24">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_35%)]" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}

          <div className="space-y-7 text-center lg:text-left">

            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              ✨ Authentic Atreyapuram Craftsmanship
            </span>

            <div className="space-y-3">

              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight text-stone-900">

                Handmade

                <br />

                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-amber-500 to-orange-700">
                  Premium Pure
                </span>

                <br />

                Putharekulu

              </h1>

              <p className="text-lg lg:text-xl text-stone-600 leading-9 max-w-xl mx-auto lg:mx-0">
                Indulge in handcrafted Andhra delicacies made with ultra-thin rice sheets, premium dry fruits, pure ghee and timeless traditional mastery.
              </p>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">

              <a
                href="#products"
                className="px-8 py-4 w-full sm:w-auto rounded-full bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold inline-flex items-center justify-center shadow-lg"
              >
                Explore Collection
              </a>

              <Link
                to="/reviews"
                className="px-8 py-4 w-full sm:w-auto rounded-full border border-orange-200 bg-white text-orange-700 font-bold inline-flex items-center justify-center shadow-sm"
              >
                Read Reviews
              </Link>

            </div>

            {/* FEATURES */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">

              <div className="feature-box">
                🌿
                <span>Pure Ingredients</span>
              </div>

              <div className="feature-box">
                🧡
                <span>Handmade</span>
              </div>

              <div className="feature-box">
                🚚
                <span>Fresh Delivery</span>
              </div>

              <div className="feature-box">
                ⭐
                <span>Premium Quality</span>
              </div>

            </div>

          </div>

          {/* RIGHT HERO IMAGE */}

          <div className="relative flex justify-center">

            <div className="absolute top-6 left-0 lg:-left-6 bg-white/95 backdrop-blur-xl border border-orange-100 rounded-2xl px-5 py-3 shadow-[0_20px_50px_rgba(249,115,22,0.15)] z-10">

              <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-bold">
                Ghee Quality
              </p>

              <h4 className="font-black text-amber-700 text-lg">
                100% Pure Certified ⭐
              </h4>

            </div>

            <div className="hero-image w-full max-w-[650px] h-[430px] sm:h-[520px] lg:h-[620px] rounded-[36px] overflow-hidden border border-white/60 bg-[#fff8f1] shadow-[0_30px_100px_rgba(249,115,22,0.18)] p-3 hover:-translate-y-2 transition-all duration-700">

              <img
                src={hero}
                alt="Premium Putharekulu"
                className="w-full h-full object-cover rounded-[28px]"
              />

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="relative z-10 bg-white rounded-t-[60px] py-16 lg:py-20"
      >

        <div className="container">

          {/* HEADER */}

          <div className="text-center max-w-2xl mx-auto mb-14">

            <span className="text-orange-600 uppercase tracking-[0.28em] text-xs font-black">
              Freshly Prepared
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 mt-4">
              Our Signature Collection
            </h2>

            <p className="text-stone-500 mt-5 leading-8 text-sm sm:text-base">
              Authentic Atreyapuram sweets handcrafted using premium ingredients,
              pure ghee and traditional recipes.
            </p>

          </div>

          {/* PRODUCT GRID — modern card layout */}

          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <article key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-2 duration-300 flex flex-col h-full">

                <div className="relative overflow-hidden bg-[#fff8f1]">
                  <div className="h-52 md:h-56 lg:h-56 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-orange-700 border border-orange-100">PREMIUM</span>
                </div>

                <div className="p-4 flex flex-col grow space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors min-h-[3.5rem]">{product.name}</h4>
                    <p className="text-sm text-stone-500 mt-1 min-h-[2.5rem]">{product.sizes}</p>
                  </div>

                  <div className="space-y-4 pt-2 mt-auto">
                    <div className="flex items-center justify-between gap-3">
                      <div className="price-badge bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full">₹{product.price}</div>

                      <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Freshly prepared</span>

                      <div className="text-right">
                        <p className="text-xs font-bold text-green-700">● Available</p>
                        <p className="text-[11px] text-stone-400">Fast Delivery</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => addToCart(product)} className="btn btn-secondary text-xs py-2.5 px-3">Add To Cart</button>
                      <Link to={`/buy/${product.id}`} className="btn btn-primary text-xs py-2.5 px-3">Buy Instantly</Link>
                    </div>
                  </div>
                </div>

              </article>
            ))}
          </div>

        </div>

      </section>

      {/* CART DRAWER */}

      {showCart && (

        <div className="fixed inset-0 z-50 flex justify-end">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-orange-100">

            <div className="p-6 border-b border-stone-100 flex items-center justify-between">

              <h3 className="text-2xl font-black text-stone-900">
                Your Basket ({totalCartCount})
              </h3>

              <button
                onClick={() => setShowCart(false)}
                className="text-2xl text-stone-400 hover:text-stone-900"
              >
                ×
              </button>

            </div>

            <div className="grow overflow-y-auto p-6 space-y-4">

              {cart.length === 0 ? (

                <div className="h-full flex flex-col items-center justify-center text-center">

                  <span className="text-5xl">
                    🛒
                  </span>

                  <p className="text-stone-500 mt-4">
                    Your basket is empty.
                  </p>

                </div>

              ) : (

                cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 bg-stone-50 rounded-2xl p-3 border border-stone-100"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div className="grow">

                      <h4 className="font-bold text-stone-900 text-sm">
                        {item.name}
                      </h4>

                      <p className="text-orange-700 font-black mt-1">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-2 mt-3">

                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="qty-btn"
                        >
                          -
                        </button>

                        <span className="font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="qty-btn"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

            {cart.length > 0 && (

              <div className="p-6 border-t border-stone-100 bg-stone-50">

                <div className="flex justify-between items-center mb-5">

                  <span className="text-stone-500">
                    Estimated Total
                  </span>

                  <span className="text-4xl font-black text-orange-700">
                    ₹{totalAmount}
                  </span>

                </div>

                <Link
                  to={`/buy/${cart[0]?.id}`}
                  className="btn btn-primary w-full py-4 text-center"
                >
                  Proceed To Checkout
                </Link>

              </div>

            )}

          </div>

        </div>

      )}

      <Footer />

    </div>
  );
}

export default HomePage;