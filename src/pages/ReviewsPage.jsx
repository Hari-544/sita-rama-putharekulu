import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { setSeoMeta } from "../utils/seo";

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
    let isMounted = true;

    setSeoMeta({
      title: "Customer Reviews | Sita Rama Putharekulu",
      description:
        "Read genuine customer reviews for authentic Atreyapuram Putharekulu and handmade sweets from Sita Rama Putharekulu.",
      path: "/reviews",
      image: "/og-image.svg",
    });

    const loadReviews = async () => {
      try {
        const snapshot = await getDocs(collection(db, "reviews"));

        if (!isMounted) return;

        const reviewsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((left, right) => {
            const leftTime = left.createdAt?.seconds || 0;
            const rightTime = right.createdAt?.seconds || 0;
            return rightTime - leftTime;
          });

        setReviews(reviewsData);
      } catch (error) {
        console.error("Reviews fetch error:", error);
        if (!isMounted) return;
        setReviews([]);
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
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
    <main className="adaptive-section safe-bottom min-h-screen bg-[#fffaf5] px-4 py-8 sm:px-6 sm:py-14">
      <div className="responsive-shell">
        
        {/* Navigation Header */}
        <Link to="/" className="inline-flex items-center gap-2 text-orange-700 font-medium hover:text-orange-950 transition-colors duration-200 mb-10 group">
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> Back To Storefront
        </Link>

        {/* Split Grid Layout */}
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          
          {/* Left Column: Form Section */}
          <section className="panel-shell adaptive-card p-5 sm:p-8 xl:sticky xl:top-24">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 block mb-2">Guestbook</span>
            <h1 className="page-title fluid-heading font-black tracking-tight">Share Your Experience</h1>
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
          <section className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-orange-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="fluid-heading font-bold text-stone-900">Community Reviews</h2>
              <span className="text-sm font-medium text-stone-500">{reviews.length} Stories Shared</span>
            </div>

            {reviews.length === 0 ? (
              <div className="panel-shell adaptive-card p-8 text-center sm:p-12">
                <span className="text-3xl block mb-2">✨</span>
                <p className="text-stone-500 font-medium">Be the first to share an authentic review!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {reviews.map((item) => (
                  <article key={item.id} className="review-card flex flex-col justify-between rounded-2xl p-5 sm:p-6">
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