import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Footer from "../components/Footer";
import hero from "../assets/hero.jpg";
import { products } from "../data/products";

function HomePage() {
  const [cart, setCart] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }

    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const proceedToPayment = async () => {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.pincode
    ) {
      alert("Please fill all delivery details");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const order = await response.json();

      const options = {
        key: "rzp_test_SqRtF41rL6Tybl",
        amount: order.amount,
        currency: order.currency,
        name: "SITA RAMA PUTHAREKULU",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const orderDetails = cart
            .map((item) => `${item.name} x ${item.quantity}`)
            .join("\n");

          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              access_key: "89f7cf9c-6157-425e-b2b2-6de9be3b3e0e",
              name: customer.name,
              phone: customer.phone,
              address: customer.address,
              pincode: customer.pincode,
              order_details: orderDetails,
              total_amount: totalAmount,
              payment_id: response.razorpay_payment_id,
            }),
          });

          window.location.href = "/success";
        },
        prefill: {
          name: customer.name,
          contact: customer.phone,
        },
        theme: { color: "#c2410c" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      setProcessing(false);
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-800">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-orange-100">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="brand-mark text-lg md:text-2xl font-extrabold">
            SITA RAMA <span>PUTHAREKULU</span>
          </Link>

          <nav className="flex items-center gap-2 md:gap-5">
            <a
              href="#products"
              className="text-sm md:text-base font-medium hover:text-orange-700 transition"
            >
              Products
            </a>

            <Link
              to="/reviews"
              className="text-sm md:text-base font-medium hover:text-orange-700 transition"
            >
              Reviews
            </Link>

            <button
              onClick={() => setShowCart(true)}
              className="btn btn-primary px-4 md:px-5 py-2 text-sm md:text-base"
            >
              Cart ({cart.reduce((count, item) => count + item.quantity, 0)})
            </button>
          </nav>
        </div>
      </header>

      <section className="hero-section relative py-14 md:py-24 overflow-hidden">
        <div className="hero-glow" />

        <div className="container grid grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <p className="eyebrow">Fresh from Andhra Pradesh</p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-950 leading-tight">
              Handmade, Thin & Crispy
              <br />
              <span className="text-yellow-700">Traditional Putharekulu</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-600 leading-8 max-w-2xl">
              Crafted with authentic Atreyapuram methods, delicate rice paper,
              premium ghee, and rich fillings prepared fresh for every order.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#products" className="btn btn-primary px-8 py-4">
                Shop Now
              </a>

              <Link to="/reviews" className="btn btn-secondary px-8 py-4">
                Customer Reviews
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full">
            <div className="hero-image relative w-full max-w-[720px] h-[260px] md:h-[420px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-orange-100">
              <img
                src={hero}
                alt="Fresh handmade Putharekulu sweets"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 px-4 md:px-6">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Our Menu</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-orange-950">
              Signature Putharekulu
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            {products.map((product) => (
              <article key={product.id} className="product-card rounded-[22px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 md:h-64 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-orange-950">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-gray-600">{product.sizes}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="badge badge-orange">Handmade</span>
                    <span className="badge badge-yellow">Fresh</span>
                    <span className="badge badge-green">Premium</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-2xl font-extrabold text-green-700">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-primary px-5 py-2"
                    >
                      Add
                    </button>
                  </div>

                  <Link
                    to={`/buy/${product.id}`}
                    className="btn btn-secondary w-full mt-5 py-3"
                  >
                    Buy Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowCart(false)}
          />

          <aside className="cart-drawer fixed top-0 right-0 w-full md:w-[450px] h-screen z-50 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-orange-900">Your Cart</h2>

              <button
                onClick={() => setShowCart(false)}
                className="cart-close"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-state">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-orange-100 py-4 flex gap-4 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-orange-950">{item.name}</h3>
                      <p className="text-green-700 font-semibold">
                        ₹{item.price}
                      </p>

                      <div className="qty-control mt-3">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-8">
                  <h3 className="text-3xl font-bold text-green-700 mb-6">
                    Total: ₹{totalAmount}
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customer.name}
                      onChange={(e) => updateCustomer("name", e.target.value)}
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customer.phone}
                      onChange={(e) => updateCustomer("phone", e.target.value)}
                    />

                    <textarea
                      rows="4"
                      placeholder="Delivery Address"
                      value={customer.address}
                      onChange={(e) =>
                        updateCustomer("address", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Pincode"
                      value={customer.pincode}
                      onChange={(e) =>
                        updateCustomer("pincode", e.target.value)
                      }
                    />
                  </div>

                  <button
                    onClick={proceedToPayment}
                    disabled={processing}
                    className="btn btn-primary w-full py-4 mt-6 text-lg"
                  >
                    {processing ? "Processing..." : "Proceed To Payment"}
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      <section className="contact-band py-20 px-6 text-white text-center">
        <p className="eyebrow text-yellow-200">Need help ordering?</p>

        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>

        <p className="text-xl mb-6">WhatsApp: +91 9652999544</p>

        <a
          href="https://wa.me/919652999544"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary px-8 py-4"
        >
          Chat On WhatsApp
        </a>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
