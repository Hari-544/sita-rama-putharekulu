import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function ReviewsPage() {
  const reviews = [
    {
      name: "Anitha",
      text: "Very tasty and fresh putharekulu. Loved the dry fruit flavor!",
    },
    {
      name: "Sravani",
      text: "Authentic Atreyapuram taste. Packaging was also very neat.",
    },
    {
      name: "Karthik",
      text: "Fast response and excellent quality sweets.",
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50 p-6">

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-800">What Customers Say</h1>
        <p className="mt-2 text-gray-600">Real reviews from happy customers — freshly packed and timely delivered.</p>
        <div className="mt-4">
          <Link to="/" className="inline-block bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-2xl">Back To Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold">{review.name.charAt(0)}</div>
              <div>
                <div className="font-bold text-orange-800">{review.name}</div>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>

            <p className="text-gray-700 leading-7">{review.text}</p>

            <div className="mt-auto text-sm text-gray-500">Verified buyer</div>
          </div>
        ))}
      </div>

      <Footer />

    </div>
  );
}

export default ReviewsPage;