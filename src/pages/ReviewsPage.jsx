import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ReviewsPage() {

  const [reviews, setReviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    rating: "⭐⭐⭐⭐⭐",
    review: "",
  });

  useEffect(() => {
    const savedReviews =
      JSON.parse(localStorage.getItem("reviews")) || [];

    setReviews(savedReviews);
  }, []);

  const submitReview = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.review) {
      alert("Please fill all fields");
      return;
    }

    const newReview = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);

    localStorage.setItem(
      "reviews",
      JSON.stringify(updatedReviews)
    );

    setFormData({
      name: "",
      rating: "⭐⭐⭐⭐⭐",
      review: "",
    });
  };

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Header */}
      <div className="bg-orange-900 text-white py-10 px-6 text-center">

        <h1 className="text-5xl font-extrabold">
          Customer Reviews
        </h1>

        <p className="mt-4 text-orange-200 text-lg">
          Share your sweet experience with us 🍯
        </p>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-12">

          <h2 className="text-4xl font-bold text-orange-800">
            Reviews ⭐
          </h2>

          <Link
            to="/"
            className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-2xl font-semibold"
          >
            Back To Home
          </Link>

        </div>

        {/* Review Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">

          <h2 className="text-3xl font-bold text-orange-800 mb-6">
            Write A Review
          </h2>

          <form
            onSubmit={submitReview}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            >
              <option>⭐⭐⭐⭐⭐</option>
              <option>⭐⭐⭐⭐</option>
              <option>⭐⭐⭐</option>
              <option>⭐⭐</option>
              <option>⭐</option>
            </select>

            <textarea
              placeholder="Write your review..."
              rows="5"
              value={formData.review}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  review: e.target.value,
                })
              }
              className="w-full border p-4 rounded-2xl"
            />

            <button
              type="submit"
              className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              Submit Review
            </button>

          </form>

        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {reviews.length === 0 ? (

            <div className="col-span-full text-center text-gray-500 text-xl">
              No reviews yet.
            </div>

          ) : (

            reviews.map((review, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-2xl font-bold text-orange-800">
                    {review.name}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {review.date}
                  </span>

                </div>

                <p className="text-xl mb-4">
                  {review.rating}
                </p>

                <p className="text-gray-700 leading-8">
                  {review.review}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default ReviewsPage;