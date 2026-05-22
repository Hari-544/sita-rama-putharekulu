import { Link } from "react-router-dom";

function SuccessPage() {

  return (

    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center px-6">

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">

        {/* Success Icon */}
        <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto">

          <span className="text-6xl">
            🎉
          </span>

        </div>

        {/* Heading */}
        <h1 className="mt-8 text-5xl font-extrabold text-orange-900">

          Order Placed Successfully!

        </h1>

        {/* Message */}
        <p className="mt-6 text-lg text-gray-700 leading-8">

          Thank you for ordering from
          <span className="font-bold text-orange-800">
            {" "}SITA RAMA PUTHAREKULU
          </span>

          <br /><br />

          Your order will be freshly prepared and dispatched soon.

        </p>

        {/* Delivery Info */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-orange-800">

            Delivery Information

          </h2>

          <p className="mt-4 text-gray-700 leading-7">

            🚚 Delivery available across Andhra Pradesh & Telangana.
            <br />
            📦 Orders are freshly prepared after confirmation.
            <br />
            ⏳ Estimated delivery: 2–5 working days.

          </p>

        </div>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919652999544"
          target="_blank"
          rel="noreferrer"
          className="block mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-bold transition"
        >

          Send Payment Screenshot On WhatsApp

        </a>

        {/* Back Button */}
        <Link
          to="/"
          className="block mt-5 bg-orange-700 hover:bg-orange-800 text-white py-4 rounded-2xl text-lg font-bold transition"
        >

          Continue Shopping

        </Link>

      </div>

    </div>

  );
}

export default SuccessPage;