import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer text-white py-16 px-6">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <h2 className="text-3xl font-extrabold text-yellow-300">
            SITA RAMA PUTHAREKULU
          </h2>

          <p className="mt-5 text-orange-100 leading-8">
            Authentic handmade Atreyapuram Putharekulu prepared with traditional
            recipes and premium ingredients.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-5">Quick Links</h3>

          <div className="flex flex-col gap-3">
            <Link to="/reviews" className="footer-link">
              Reviews
            </Link>

            <Link to="/privacy-policy" className="footer-link">
              Privacy Policy
            </Link>

            <Link to="/refund-policy" className="footer-link">
              Refund Policy
            </Link>

            <Link to="/shipping-policy" className="footer-link">
              Shipping Policy
            </Link>

            <Link to="/terms-and-conditions" className="footer-link">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-5">Contact Us</h3>

          <p className="text-orange-100 mb-3">Andhra Pradesh, India</p>
          <p className="text-orange-100 mb-3">+91 9652999544</p>

          <a
            href="https://wa.me/919652999544"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary px-7 py-3 mt-3"
          >
            Chat On WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-orange-800 mt-10 pt-6 text-center text-orange-200">
        © 2026 SITA RAMA PUTHAREKULU. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
