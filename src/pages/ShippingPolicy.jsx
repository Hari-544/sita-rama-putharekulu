import { Link } from "react-router-dom";

function ShippingPolicy() {
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
          Shipping Policy
        </h1>

        <p className="text-lg leading-9 text-gray-700">
          Orders are freshly prepared after confirmation. Delivery usually takes
          2-5 working days depending on the location. We currently deliver
          across Andhra Pradesh and Telangana.
        </p>
      </article>
    </main>
  );
}

export default ShippingPolicy;
