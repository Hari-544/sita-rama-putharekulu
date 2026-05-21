import "./App.css";

import jaggery from "./assets/images/jaggery.jpg";
import sugar from "./assets/images/sugar.jpg";
import dryfruit from "./assets/images/Dryfruits.jpg";
import dryfruitSugar from "./assets/images/dryfruitsugar.jpg";
import kova from "./assets/images/kova.jpg";
import karam from "./assets/images/karam.jpg";
import samosaJaggery from "./assets/images/samosajaggery.jpg";
import samosaSugar from "./assets/images/samosasugar.jpg";
import chocolate from "./assets/images/chocolate.jpg";
import hero from "./assets/hero.jpg";

function SitaRamaPutharekulu() {

  const products = [
    {
      name: "Plain Jaggery Putharekulu",
      sizes: "Small & Big Size",
      price: "₹150",
      image: jaggery,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Plain Sugar Putharekulu",
      sizes: "Small & Big Size",
      price: "₹150",
      image: sugar,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Dry Fruits Jaggery Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: "Starting from ₹200",
      image: dryfruit,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Dry Fruits Sugar Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: "Starting from ₹200",
      image: dryfruitSugar,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Plain Kova Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: "Starting from ₹200",
      image: kova,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Karam Putharekulu",
      sizes: "Small - ₹120 | Big - ₹180",
      price: "Starting from ₹120",
      image: karam,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Samosa Shaped Jaggery Putharekulu",
      sizes: "Special Shape",
      price: "₹180",
      image: samosaJaggery,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Samosa Shaped Sugar Putharekulu",
      sizes: "Special Shape",
      price: "₹180",
      image: samosaSugar,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
    {
      name: "Chocolate Putharekulu",
      sizes: "Small - ₹200 | Big - ₹250",
      price: "Starting from ₹200",
      image: chocolate,
      paymentLink: "https://razorpay.me/@sitaramaputharekulu",
    },
  ];

  const whatsappLink = (product) =>
    `https://wa.me/919652999544?text=Hello%20SITA%20RAMA%20PUTHAREKULU,%20I%20want%20to%20order%20${encodeURIComponent(
      product
    )}`;

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-yellow-50 py-10 px-6 text-center">

        <img
          src={hero}
          alt="SITA RAMA PUTHAREKULU"
          className="mx-auto rounded-3xl shadow-2xl max-w-6xl w-full"
        />

        <h1 className="text-5xl font-extrabold text-orange-900 mt-10 mb-4">
          SITA RAMA PUTHAREKULU
        </h1>

        <p className="text-xl max-w-3xl mx-auto text-gray-700 leading-8">
          Authentic Atreyapuram Style Putharekulu Handmade with Traditional
          Taste, Premium Ingredients and Fresh Preparation.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <a
            href="#products"
            className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-2xl text-lg shadow-lg transition"
          >
            View Products
          </a>

          <a
            href="https://wa.me/919652999544"
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-lg shadow-lg transition"
          >
            Order on WhatsApp
          </a>

        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold text-orange-800 mb-6">
          Traditional Andhra Sweet
        </h2>

        <p className="text-lg leading-8 text-gray-700">
          We prepare authentic handmade Putharekulu using traditional methods,
          premium ingredients, and fresh preparation techniques. Every sweet is
          carefully packed to maintain freshness and taste.
        </p>

      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-orange-800 mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product, index) => (

              <div
                key={index}
                className="bg-orange-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="text-2xl font-bold text-orange-900">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {product.sizes}
                  </p>

                  <p className="mt-4 text-2xl font-bold text-green-700">
                    {product.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    After payment, send screenshot on WhatsApp.
                  </p>

                  <div className="flex gap-3 mt-6">

                    <a
                      href={product.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 bg-orange-700 hover:bg-orange-800 text-white text-center py-3 rounded-2xl font-semibold transition"
                    >
                      Buy Now
                    </a>

                    <a
                      href={whatsappLink(product.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-2xl font-semibold transition"
                    >
                      WhatsApp
                    </a>

                  </div>

                </div>
              </div>

            ))}

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-yellow-50">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-bold text-orange-800 mb-10">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-3xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-orange-800">
                Authentic Taste
              </h3>

              <p className="text-gray-700">
                Traditional Atreyapuram style preparation with premium quality ingredients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-orange-800">
                Fresh Preparation
              </h3>

              <p className="text-gray-700">
                Every order is freshly prepared and carefully packed for maximum freshness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-orange-800">
                Easy Ordering
              </h3>

              <p className="text-gray-700">
                Direct WhatsApp ordering with fast customer support and smooth communication.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-orange-900 text-white text-center">

        <h2 className="text-4xl font-bold mb-6">
          Contact Us
        </h2>

        <p className="text-xl mb-4">
          WhatsApp: +91 9652999544
        </p>

        <a
          href="https://wa.me/919652999544"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
        >
          Chat on WhatsApp
        </a>

        <p className="mt-10 text-orange-200">
          © 2026 SITA RAMA PUTHAREKULU. All Rights Reserved.
        </p>

      </section>

    </div>
  );
}

export default SitaRamaPutharekulu;