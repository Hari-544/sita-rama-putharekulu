import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

function ReviewsPage() {

  const [reviews, setReviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    rating: "⭐⭐⭐⭐⭐",
    review: "",
  });

  useEffect(() => {

    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(reviewsData);

    });

    return () => unsubscribe();

  }, []);

  const submitReview = async (e) => {

    e.preventDefault();

    if (!formData.name || !formData.review) {
      alert("Please fill all fields");
      return;
    }

    try {

      await addDoc(collection(db, "reviews"), {
        ...formData,
        createdAt: new Date(),
      });

      setFormData({
        name: "",
        rating: "⭐⭐⭐⭐⭐",
        review: "",
      });

      alert("Review submitted successfully!");

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Header */}
      <div className="bg-orange-900 text-white py-10 px-6 text-center">

        <h1 className="text-5xl font-extrabold">
          Customer Reviews
        </h1>

        <p className="mt-4 text-orange-200 text-lg">
          Share your sweet experience 🍯
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

        {/* Form */}
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

          {reviews.map((review) => (

            <div
              key={review.id}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-2xl font-bold text-orange-800">
                  {review.name}
                </h3>

                <span className="text-sm text-gray-500">
                  {review.rating}
                </span>

              </div>

              <p className="text-gray-700 leading-8">
                {review.review}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default ReviewsPage;