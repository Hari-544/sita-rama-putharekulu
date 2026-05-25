import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ratings = [
  { visual: "★★★★★ (5/5)", value: "★★★★★" },
  { visual: "★★★★☆ (4/5)", value: "★★★★" },
  { visual: "★★★☆☆ (3/5)", value: "★★★" },
  { visual: "★★☆☆☆ (2/5)", value: "★★" },
  { visual: "★☆☆☆☆ (1/5)", value: "★" },
];

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: "★★★★★",
    review: "",
  });

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    let unsubscribeFallback = null;
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
      },
      (error) => {
        console.error("Reviews snapshot error:", error);
        // Fallback: listen without ordering if the ordered query fails (missing field/index)
        unsubscribeFallback = onSnapshot(collection(db, "reviews"), (snap) => {
          const reviewsData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setReviews(reviewsData);
        });
      }
    );

    return () => {
      unsubscribe();
      if (unsubscribeFallback) unsubscribeFallback();
    };
  }, []);

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.review.trim()) {
      alert("Please provide both your name and review text.");
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        name: formData.name.trim(),
        rating: formData.rating,
        review: formData.review.trim(),
          createdAt: serverTimestamp(),
      });

      setFormData({
        name: "",
        rating: "★★★★★",
        review: "",
      });

      alert("Thank you! Your culinary feedback has been published.");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Could not post review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] py-14 px-6">
      <div className="container">
        
        {/* Navigation Header */}
        <Link to="/" className="inline-flex items-center gap-2 text-orange-700 font-medium hover:text-orange-950 transition-colors duration-200 mb-10 group">
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> Back To Storefront
        </Link>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form Section */}
          <section className="col-span-5 panel-shell p-8 sticky top-24">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 block mb-2">Guestbook</span>
            <h1 className="page-title text-4xl font-black tracking-tight">Share Your Experience</h1>
            <p className="muted-copy text-sm mt-2 mb-6 leading-relaxed">
              Tell others how much you enjoyed our authentic Atreyapuram recipes. Your real experience helps our traditional kitchen grow.
            </p>

            <form onSubmit={submitReview} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g., Srinivas Rao"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Rating Experience</label>
                <select
                  value={formData.rating}
                  onChange={(e) => updateForm("rating", e.target.value)}
                >
                  {ratings.map((rate) => (
                    <option key={rate.value} value={rate.value}>
                      {rate.visual}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Detailed Feedback</label>
                <textarea
                  placeholder="How was the texture, sweet balance, and delivery experience?"
                  rows="4"
                  value={formData.review}
                  onChange={(e) => updateForm("review", e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-primary w-full py-4 text-base font-bold"
              >
                {submitting ? "Publishing Review..." : "Submit Verified Review"}
              </button>
            </form>
          </section>

          {/* Right Column: Display Live Feed Section */}
          <section className="col-span-7 space-y-6">
            <div className="flex items-baseline justify-between border-b border-orange-100 pb-4">
              <h2 className="text-2xl font-bold text-stone-900">Community Reviews</h2>
              <span className="text-sm font-medium text-stone-500">{reviews.length} Stories Shared</span>
            </div>

            {reviews.length === 0 ? (
              <div className="panel-shell p-12 text-center">
                <span className="text-3xl block mb-2">✨</span>
                <p className="text-stone-500 font-medium">Be the first to share an authentic review!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {reviews.map((item) => (
                  <article key={item.id} className="review-card rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-base font-bold text-stone-900 truncate">
                          {item.name}
                        </h3>
                        <span className="text-amber-500 text-sm font-medium tracking-tight shrink-0 select-none">
                          {item.rating}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed wrap-break-word whitespace-pre-line">
                        "{item.review}"
                      </p>
                    </div>
                    {item.createdAt && (
                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-4 pt-3 border-t border-stone-50">
                        Verified Order
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

export default ReviewsPage;