import { Link } from "react-router-dom";

function SuccessPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white flex items-center justify-center px-6 py-12">
      <section className="checkout-panel max-w-2xl w-full bg-white rounded-[22px] p-8 md:p-10 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl text-green-700">✓</span>
        </div>

        <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-orange-950">
          Order Placed Successfully!
        </h1>

        <p className="mt-6 text-lg text-gray-700 leading-8">
          Thank you for ordering from{" "}
          <span className="font-bold text-orange-800">
            SITA RAMA PUTHAREKULU
          </span>
          .
          <br />
          Your order will be freshly prepared and dispatched soon.
        </p>

        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-orange-900">
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
          className="btn btn-primary w-full py-4 mt-8 text-lg"
        >
          Send Payment Screenshot On WhatsApp
        </a>

        <Link to="/" className="btn btn-secondary w-full py-4 mt-5 text-lg">
          Continue Shopping
        </Link>
      </section>
    </main>
  );
}

export default SuccessPage;
