import { Link } from "react-router-dom";

function TermsPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white px-6 py-16">
      <article className="checkout-panel max-w-5xl mx-auto bg-white rounded-[22px] p-8 md:p-12">
        <Link
          to="/"
          className="inline-flex text-orange-700 font-semibold hover:text-orange-950 transition mb-8"
        >
          ← Back To Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-orange-950 mb-8">
          Terms & Conditions
        </h1>

        <p className="text-lg leading-9 text-gray-700">
          By placing an order on our website, customers agree to provide
          accurate delivery information and valid payment details. Delivery
          timelines may vary based on courier availability and location.
        </p>
      </article>
    </main>
  );
}

export default TermsPage;
