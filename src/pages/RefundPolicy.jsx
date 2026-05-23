import { Link } from "react-router-dom";

function RefundPolicy() {
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
