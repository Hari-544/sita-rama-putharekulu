import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../firebase";

function AdminReviews({ embedded = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const pageShellClass = embedded
    ? "w-full"
    : "min-h-screen bg-[#fffaf5] p-4 sm:p-6";

  const pageInnerClass = embedded ? "w-full" : "mx-auto w-full max-w-7xl";
  const pageTitleClass = embedded ? "hidden" : "mb-8 text-[clamp(2rem,4vw,3.5rem)] font-black text-orange-700";

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const snapshot = await getDocs(collection(db, "reviews"));

        if (!isMounted) return;

        const reviewsData = snapshot.docs
          .map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() }))
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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return reviews;

    return reviews.filter((review) => {
      const name = review.name?.toLowerCase() || "";
      const text = review.review?.toLowerCase() || "";
      return name.includes(query) || text.includes(query);
    });
  }, [reviews, search]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => sum + (review.rating?.length || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const removeReview = async (reviewId) => {
    const confirmed = window.confirm("Remove this review from Firestore?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews((current) => current.filter((item) => item.id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to remove review");
    }
  };

  return (
    <div className={pageShellClass}>
      <div className={pageInnerClass}>
        <h1 className={pageTitleClass}>Review Moderation</h1>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            { label: "Total Reviews", value: reviews.length },
            { label: "Visible Now", value: filteredReviews.length },
            { label: "Average Rating", value: reviews.length ? averageRating.toFixed(1) : "0.0" },
            { label: "Latest Queue", value: reviews[0] ? "Live" : "Empty" },
          ].map((stat) => (
            <div key={stat.label} className="panel-shell p-6">
              <h2 className="text-sm font-semibold text-stone-500">{stat.label}</h2>
              <p className="mt-2 text-4xl font-black text-stone-950">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 max-w-2xl">
          <input
            type="text"
            placeholder="Search reviews by customer name or feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-2xl font-bold text-stone-700">Loading Reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="panel-shell p-8 text-center text-xl font-bold text-stone-700">
            No reviews found
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredReviews.map((review) => (
              <article key={review.id} className="panel-shell p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">Customer Review</p>
                    <h2 className="mt-2 text-2xl font-black text-stone-950">{review.name || "Anonymous"}</h2>
                    <p className="mt-2 text-sm font-bold text-amber-600">{review.rating || "★★★★★"}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeReview(review.id)}
                    className="btn btn-danger w-full sm:w-auto"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid gap-4 rounded-[1.5rem] bg-orange-50/60 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-stone-500">Feedback</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">
                      {review.review}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-stone-500">Status</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em]">
                      <span className="rounded-full bg-green-100 px-3 py-2 text-green-700">Published</span>
                      {review.createdAt ? (
                        <span className="rounded-full bg-white px-3 py-2 text-stone-500">
                          {review.createdAt.toDate?.()?.toLocaleString?.() || "Saved"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;