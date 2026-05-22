import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="bg-linear-to-t from-orange-900 to-orange-950 text-white py-12 sm:py-16 px-4 sm:px-6">

      <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 items-start">

        {/* Brand */}
        <div className="mb-6 sm:mb-0 px-2 sm:px-0">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
            SITA RAMA PUTHAREKULU
          </h2>

          <p className="mt-4 text-orange-100 leading-7 text-sm sm:text-base">
            Authentic handmade Atreyapuram Putharekulu prepared with
            traditional recipes and premium ingredients.
          </p>

        </div>

        {/* Quick Links */}
        <nav aria-label="Quick links" className="mb-6 sm:mb-0 px-2 sm:px-0">

          {/* Mobile accordion using details/summary (visible on small screens) */}
          <details className="block sm:hidden bg-transparent">
            <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold py-2">
              Quick Links
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>

            <div className="mt-2 flex flex-col gap-2">
              <Link to="/reviews" className="footer-link hover:text-yellow-400 transition text-base" aria-label="Reviews">Reviews</Link>
              <Link to="/privacy-policy" className="footer-link hover:text-yellow-400 transition text-base" aria-label="Privacy Policy">Privacy Policy</Link>
              <Link to="/refund-policy" className="footer-link hover:text-yellow-400 transition text-base" aria-label="Refund Policy">Refund Policy</Link>
              <Link to="/shipping-policy" className="footer-link hover:text-yellow-400 transition text-base" aria-label="Shipping Policy">Shipping Policy</Link>
              <Link to="/terms-and-conditions" className="footer-link hover:text-yellow-400 transition text-base" aria-label="Terms and Conditions">Terms & Conditions</Link>
            </div>
          </details>

          {/* Desktop / tablet links */}
          <div className="hidden sm:block">
            <h3 className="text-xl sm:text-2xl font-bold mb-5">Quick Links</h3>

            <div className="flex flex-col gap-2">
              <Link to="/reviews" className="footer-link hover:text-yellow-400 transition py-2 text-base sm:text-sm" aria-label="Reviews">Reviews</Link>
              <Link to="/privacy-policy" className="footer-link hover:text-yellow-400 transition py-2 text-base sm:text-sm" aria-label="Privacy Policy">Privacy Policy</Link>
              <Link to="/refund-policy" className="footer-link hover:text-yellow-400 transition py-2 text-base sm:text-sm" aria-label="Refund Policy">Refund Policy</Link>
              <Link to="/shipping-policy" className="footer-link hover:text-yellow-400 transition py-2 text-base sm:text-sm" aria-label="Shipping Policy">Shipping Policy</Link>
              <Link to="/terms-and-conditions" className="footer-link hover:text-yellow-400 transition py-2 text-base sm:text-sm" aria-label="Terms and Conditions">Terms & Conditions</Link>
            </div>
          </div>

        </nav>

        {/* Contact */}
        <div className="px-2 sm:px-0">

          <h3 className="text-xl sm:text-2xl font-bold mb-5">Contact Us</h3>

          <p className="text-orange-100 mb-2 text-sm sm:text-base">📍 Andhra Pradesh, India</p>

          <p className="text-orange-100 mb-3 text-sm sm:text-base">📞 +91 9652999544</p>

          <a
            href="https://wa.me/919652999544"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="btn btn-primary mt-3 w-full sm:w-auto text-center footer-cta"
          >
            Chat On WhatsApp
          </a>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-orange-800 mt-10 pt-6 text-center text-orange-200 text-sm sm:text-base">
        © 2026 SITA RAMA PUTHAREKULU. All Rights Reserved.
      </div>

    </footer>

  );
}

export default Footer;