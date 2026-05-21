import { Link } from "react-router-dom";

function CartPage() {
  return (
    <div className="min-h-screen bg-orange-50 p-6">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold text-orange-800">
          Your Cart
        </h1>

        <Link
          to="/"
          className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-3 rounded-xl"
        >
          Back To Home
        </Link>

      </div>

      <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

        <h2 className="text-2xl font-bold text-gray-700">
          Cart functionality page ready.
        </h2>

        <p className="mt-4 text-gray-500">
          We will connect full cart functionality next.
        </p>

      </div>

    </div>
  );
}

export default CartPage;