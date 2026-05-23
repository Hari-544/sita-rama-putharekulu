import { Link } from "react-router-dom";

function RefundPolicy() {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white px-6 py-16">
      <article className="panel-shell max-w-5xl mx-auto p-10">
        <Link
          to="/"
          className="inline-flex text-orange-700 font-semibold hover:text-orange-950 transition mb-8"
        >
          ← Back To Home
        </Link>

        <h1 className="page-title text-5xl font-bold mb-8">
          Refund Policy
        </h1>

        <p className="text-lg leading-9 text-gray-700">
          Since our products are freshly prepared food items, refunds are not
          available after order confirmation. Refunds may be provided only in
          case of damaged or incorrect orders.
        </p>
      </article>
    </main>
  );
}

export default RefundPolicy;
