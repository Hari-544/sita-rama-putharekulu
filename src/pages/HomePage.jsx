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
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }
    setCart([...cart, { ...product, quantity: 1 }]);
    setShowCart(true); // Smooth UX: Reveal drawer when item is selected
  };

  const increaseQty = (id) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fffaf5] text-stone-900 selection:bg-orange-200">
      
      {/* 1. STICKY GLASSMORPHIC NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/88 backdrop-blur-xl border-b border-orange-100/70 shadow-[0_8px_30px_rgba(124,45,18,0.05)]">
        <div className="container flex items-center justify-between py-5">
          <h1 className="text-3xl font-black tracking-tight text-stone-900">
            SITA RAMA <span className="text-orange-600 font-light">PUTHAREKULU</span>
          </h1>

          <nav className="flex items-center gap-6">
            <a href="#products" className="nav-link">
              Our Sweets
            </a>
            <Link to="/reviews" className="nav-link">
              Reviews
            </Link>
            <button
              onClick={() => setShowCart(true)}
              className="relative btn btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2"
            >
              <span>Cart</span>
              <span className="bg-white text-orange-700 font-black px-2 py-0.5 rounded-full text-xs">
                {totalCartCount}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* 2. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden py-18 bg-gradient-to-b from-orange-50/60 via-transparent to-transparent">
        <div className="container grid grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          
          {/* Left Hero Context */}
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 bg-orange-100/80 px-4 py-1.5 rounded-full text-orange-800 font-bold text-xs uppercase tracking-wider">
              ✨ Authentic Atreyapuram Craftsmanship
            </span>
            <h1 className="page-title text-6xl font-black leading-[1.08]">
              Handmade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Premium Pure
              </span><br />
              Putharekulu
            </h1>
            <p className="muted-copy text-lg max-w-xl">
              Indulge in traditional Andhra luxury. Prepared with ultra-fine ghee, choice dry fruits, and generations of uncompromised culinary mastery.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#products" className="btn btn-primary shadow-lg px-8 py-3.5">
                Explore Sweet Collection
              </a>
              <Link to="/reviews" className="btn btn-secondary px-8 py-3.5">
                Read Reviews
              </Link>
            </div>
          </div>

          {/* Right Hero Frame Artwork */}
          <div className="relative flex justify-center">
            <div className="absolute top-5 left-5 bg-white/92 backdrop-blur-md shadow-xl border border-orange-100 rounded-2xl px-5 py-3 z-10">
              <p className="text-xs font-semibold text-stone-400 uppercase">Ghee Quality</p>
              <h4 className="font-extrabold text-amber-700">100% Pure Certified ⭐</h4>
            </div>
            <div className="hero-image w-full max-w-[560px] h-[600px] rounded-[32px] overflow-hidden border-4 border-white shadow-2xl shadow-orange-900/10 bg-gradient-to-b from-orange-50 to-white p-4">
              <img src={hero} alt="Premium Delicacy Display" className="w-full h-full object-contain object-center hover:scale-[1.02] transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SYSTEMATIC PRODUCT GRID */}
      <section id="products" className="container py-16 scroll-mt-12">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Fresh Stock</h2>
          <h3 className="text-4xl font-black text-stone-900">Order Authentic Delicacies</h3>
          <p className="text-stone-500 text-sm">Freshly rolled after order placement. Delivered directly across AP & Telangana.</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {products.map((product) => (
            <article key={product.id} className="product-card flex flex-col h-full">
              <div className="product-frame w-full overflow-hidden relative group">
                <img src={product.image} alt={product.name} className="group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm font-black text-xs text-orange-800 px-3 py-1 rounded-full shadow-sm">
                  ₹{product.price} Base
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors min-h-[3.5rem]">{product.name}</h4>
                  <p className="text-sm text-stone-500 mt-1 min-h-[2.5rem]">{product.sizes}</p>
                </div>

                <div className="space-y-4 pt-2 mt-auto">
                  <div className="flex items-center justify-between gap-3">
                    <div className="price-badge">₹{product.price}</div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                      Freshly prepared
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => addToCart(product)} className="btn btn-secondary text-xs py-2.5 px-3">
                      Add To Cart
                    </button>
                    <Link to={`/buy/${product.id}`} className="btn btn-primary text-xs py-2.5 px-3">
                      Buy Instantly
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. AJAX SIDE DRAWER CART OVERLAY */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Layer */}
          <div className="absolute inset-0 cart-drawer-backdrop transition-opacity" onClick={() => setShowCart(false)} />
          
          {/* Drawer Container Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-orange-100">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Your Basket ({totalCartCount})</h3>
              <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-900 text-xl font-bold p-1">×</button>
            </div>

            {/* Cart Items Loop Wrapper */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <span className="text-4xl block">🥣</span>
                  <p className="text-sm font-medium text-stone-500">Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white" />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-xs text-orange-700 font-extrabold mt-0.5">₹{item.price}</p>
                    </div>
                    {/* Stepper Input Counter */}
                      <div className="flex items-center gap-2.5 bg-white border border-stone-200 rounded-full px-2 py-1 shrink-0">
                      <button onClick={() => decreaseQty(item.id)} className="w-6 h-6 text-xs font-bold rounded-full bg-stone-50 hover:bg-stone-200 transition-colors">-</button>
                      <span className="text-xs font-bold text-stone-800 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} className="w-6 h-6 text-xs font-bold rounded-full bg-stone-50 hover:bg-stone-200 transition-colors">+</button>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Checkout Pricing Panel */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-stone-500">Estimated Total:</span>
                  <span className="text-3xl font-black text-orange-700">₹{totalAmount}</span>
                </div>
                {/* Dynamically checks out first available product configuration variant for demo consistency */}
                <Link to={`/buy/${cart[0]?.id}`} className="btn btn-primary w-full py-3.5 text-center block font-bold shadow-md">
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