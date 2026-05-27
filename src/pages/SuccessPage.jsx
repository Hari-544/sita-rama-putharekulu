import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSeoMeta } from "../utils/seo";

function SuccessPage() {
  useEffect(() => {
    setSeoMeta({
      title: "Order Confirmed | Sita Rama Putharekulu",
      description:
        "Your Atreyapuram Putharekulu order has been placed successfully. Thank you for shopping with Sita Rama Putharekulu.",
      path: "/success",
      image: "/og-image.svg",
      noindex: true,
    });
  }, []);

  return (
    <main className="responsive-shell adaptive-section safe-bottom min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white flex items-center justify-center">
      <section className="panel-shell adaptive-card mx-auto w-full max-w-2xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-inner sm:h-24 sm:w-24">
          <span className="text-5xl text-green-700">✓</span>
        </div>

        <h1 className="mt-8 fluid-heading font-extrabold text-orange-950">
          Order Placed Successfully!
        </h1>

        <p className="fluid-body mt-6 text-gray-700">
          Thank you for ordering from{" "}
          <span className="font-bold text-orange-800">
            SITA RAMA PUTHAREKULU
          </span>
          .
          <br />
          Your order will be freshly prepared and dispatched soon.
        </p>

        <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
          <h2 className="fluid-heading font-bold text-orange-900">
            Delivery Information
          </h2>

          <p className="mt-4 text-gray-700 leading-7">
            Delivery available across Andhra Pradesh & Telangana.
            <br />
            Orders are freshly prepared after confirmation.
            <br />
            Estimated delivery: 2-5 working days.
          </p>
        </div>

        <a
          href="https://wa.me/919652999544"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary w-full py-4 mt-8 text-base sm:text-lg"
        >
          Send Payment Screenshot On WhatsApp
        </a>

        <Link to="/" className="btn btn-secondary w-full py-4 mt-5 text-base sm:text-lg">
          Continue Shopping
        </Link>
      </section>
    </main>
  );
}

export default SuccessPage;
