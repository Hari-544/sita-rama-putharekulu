import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="site-footer relative overflow-hidden bg-[#2a1208] text-white py-20 px-6">

      <div className="container grid grid-cols-3 gap-10">

        <div>

          <h2 className="text-3xl font-black text-yellow-300">
            SITA RAMA PUTHAREKULU
          </h2>

          <p className="mt-5 text-orange-100 leading-8 max-w-sm">
            Authentic handmade Atreyapuram Putharekulu prepared with traditional recipes and premium ingredients.
          </p>

        </div>

        <div>

          <h3 className="text-2xl font-bold mb-5">
            Quick Links
          </h3>

          <div className="flex flex-col gap-4 text-orange-100">

            <Link to="/reviews" className="hover:text-yellow-300 transition">
              Reviews
            </Link>

            <Link to="/privacy-policy" className="hover:text-yellow-300 transition">
              Privacy Policy
            </Link>

            <Link to="/refund-policy" className="hover:text-yellow-300 transition">
              Refund Policy
            </Link>

            <Link to="/shipping-policy" className="hover:text-yellow-300 transition">
              Shipping Policy
            </Link>

            <Link to="/terms-and-conditions" className="hover:text-yellow-300 transition">
              Terms & Conditions
            </Link>

          </div>

        </div>

        <div>

          <h3 className="text-2xl font-bold mb-5">
            Contact Us
          </h3>

          <p className="text-orange-100 mb-3">
            Andhra Pradesh, India
          </p>

          <p className="text-orange-100 mb-3">
            +91 9652999544
          </p>

          <a
            href="https://wa.me/919652999544"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary inline-block mt-5 px-8 py-4"
          >
            Chat On WhatsApp
          </a>

        </div>

      </div>

      <div className="border-t border-orange-900 mt-12 pt-6 text-center text-orange-200">
        © 2026 SITA RAMA PUTHAREKULU. All Rights Reserved.
      </div>

    </footer>

  );
}

export default Footer;