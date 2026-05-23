import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const ratings = ["★★★★★", "★★★★", "★★★", "★★", "★"];

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rating: "★★★★★",
    review: "",
  });

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, []);

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

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
        rating: "★★★★★",
        review: "",
      });

      alert("Review submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-orange-50 via-yellow-50 to-white">
      <section className="review-hero text-white py-20 px-6 text-center">
        <p className="eyebrow text-yellow-200">Customer Feedback</p>
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Customer Reviews
        </h1>
        <p className="mt-5 text-orange-100 text-lg max-w-2xl mx-auto leading-8">
          Real reviews from customers who enjoyed our authentic handmade
          Putharekulu.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="flex flex-wrap justify-between items-center gap-5 mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-orange-950">
            Sweet Experiences
          </h2>

          <Link to="/" className="btn btn-primary px-7 py-3">
            Back To Home
          </Link>
        </div>

        <section className="checkout-panel bg-white rounded-[22px] border border-orange-100 p-6 md:p-10 mb-16">
          <h2 className="text-3xl font-extrabold text-orange-950 mb-3">
            Write A Review
          </h2>

          <p className="text-gray-500 mb-8">
            Share your experience with our sweets.
          </p>

          <form onSubmit={submitReview} className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />

            <select
              value={formData.rating}
              onChange={(e) => updateForm("rating", e.target.value)}
              className="w-full border border-orange-200 p-4 rounded-2xl bg-white"
            >
              {ratings.map((rating) => (
                <option key={rating}>{rating}</option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              rows="5"
              value={formData.review}
              onChange={(e) => updateForm("review", e.target.value)}
            />

            <button type="submit" className="btn btn-primary px-8 py-4">
              Submit Review
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h3 className="text-2xl font-bold text-orange-950">
                  {review.name}
                </h3>
                <span className="text-yellow-600 shrink-0">{review.rating}</span>
              </div>

              <p className="text-gray-600 leading-8">{review.review}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default ReviewsPage;
