import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSeoMeta } from "../utils/seo";

function ShippingPolicy() {
  useEffect(() => {
    setSeoMeta({
      title: "Shipping Policy | Sita Rama Putharekulu",
      description:
        "Learn about delivery timelines and shipping coverage for Sita Rama Putharekulu orders.",
      path: "/shipping-policy",
      image: "/og-image.svg",
    });
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white px-4 py-10 sm:px-6 sm:py-16">
      <article className="panel-shell mx-auto max-w-5xl p-6 sm:p-10">
        <Link
          to="/"
          className="inline-flex text-orange-700 font-semibold hover:text-orange-950 transition mb-8"
        >
          ← Back To Home
        </Link>

        <h1 className="page-title fluid-heading font-bold mb-8">
          Shipping Policy
        </h1>

        <p className="fluid-body text-gray-700">
          Orders are freshly prepared after confirmation. Delivery usually takes
          2-5 working days depending on the location. We currently deliver
          across Andhra Pradesh and Telangana.
        </p>
      </article>
    </main>
  );
}

export default ShippingPolicy;
