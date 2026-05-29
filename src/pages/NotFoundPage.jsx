import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-10 sm:px-6">
      <section className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(249,115,22,0.12)]">
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-600 shadow-sm">
            404
          </span>

          <h1 className="mt-5 text-[clamp(2.5rem,7vw,5rem)] font-black tracking-tight text-stone-950">
            Page Not Found
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            The page you were looking for does not exist or may have been moved. Use the buttons below to continue browsing the store safely.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link to="/" className="btn btn-primary w-full py-4 text-base font-bold">
              Return Home
            </Link>

            <Link to="/" className="btn btn-secondary w-full py-4 text-base font-bold">
              Continue Shopping
            </Link>

            <Link to="/track-order" className="btn btn-outline w-full py-4 text-base font-bold">
              Track Order
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-orange-100 bg-white/80 p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
              Helpful routes
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-stone-600">
              <Link to="/reviews" className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 transition hover:bg-orange-100">
                Reviews
              </Link>
              <Link to="/cart" className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 transition hover:bg-orange-100">
                Cart
              </Link>
              <Link to="/checkout" className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 transition hover:bg-orange-100">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;