import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSeoMeta } from "../utils/seo";

function TermsPage() {
  useEffect(() => {
    setSeoMeta({
      title: "Terms & Conditions | Sita Rama Putharekulu",
      description:
        "Review the terms and conditions for using Sita Rama Putharekulu and placing online orders.",
      path: "/terms-and-conditions",
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
          Terms & Conditions
        </h1>

        <p className="fluid-body text-gray-700">
          By placing an order on our website, customers agree to provide
          accurate delivery information and valid payment details. Delivery
          timelines may vary based on courier availability and location.
        </p>
      </article>
    </main>
  );
}

export default TermsPage;
