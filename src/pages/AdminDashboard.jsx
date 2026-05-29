import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

import { auth, googleProvider } from "../firebase";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminReviews from "./AdminReviews";
import { setSeoMeta } from "../utils/seo";

const ADMIN_EMAIL = [
  "patnalaharikrishna9544@gmail.com",
  "atreyapuramsweetpapers@gmail.com",
];

const TAB_META = {
  overview: {
    title: "Dashboard Overview",
    description:
      "A clean starting point for daily store work, with quick access to orders, products, and reviews.",
  },
  orders: {
    title: "Orders Management",
    description:
      "Review customer details, payment status, and delivery state without extra clutter.",
  },
  products: {
    title: "Products Management",
    description:
      "Keep the catalog tidy with a simpler form, clearer cards, and faster edit actions.",
  },
  reviews: {
    title: "Reviews Moderation",
    description:
      "Scan feedback quickly in a dedicated moderation view.",
  },
};

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    setSeoMeta({
      title: "Admin Portal | Sita Rama Putharekulu",
      description:
        "Secure admin access for managing products, orders, and customer operations.",
      path: "/sr-admin-portal-2026",
      image: "/og-image.svg",
      noindex: true,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(
    () => Boolean(user && ADMIN_EMAIL.includes(user.email)),
    [user]
  );

  const handleLogin = async () => {
    try {
      setAuthenticating(true);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (!ADMIN_EMAIL.includes(email)) {
        await signOut(auth);
        alert("Access Denied ❌");
        return;
      }

      localStorage.setItem("adminLoggedIn", "true");
    } catch (error) {
      console.error("Admin login failed:", error);
      alert(error.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminLoggedIn");
      await signOut(auth);
      setActiveTab("overview");
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] text-2xl font-black text-orange-700">
        Loading Admin Portal...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-6 text-center shadow-sm sm:p-10">
          <h1 className="fluid-heading mb-4 font-black text-orange-700">
            Admin Login
          </h1>
          <p className="mb-8 text-stone-500">Secure Admin Access</p>
          <button
            onClick={handleLogin}
            disabled={authenticating}
            className="w-full rounded-2xl bg-orange-600 py-4 text-lg font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {authenticating ? "Signing In..." : "Continue With Google"}
          </button>
        </div>
      </div>
    );
  }

  const sidebarButtonClass = (key) =>
    `w-full rounded-2xl px-4 py-3 text-left transition ${activeTab === key ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`;

  const mobileButtonClass = (key) =>
    `rounded-full px-3 py-2 text-[11px] font-black transition ${activeTab === key ? "bg-orange-600 text-white" : "bg-white text-orange-700 shadow-sm"}`;

  return (
    <div className="safe-bottom-lg min-h-screen bg-[#fffaf5] text-stone-900">
      <div className="responsive-shell mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-orange-100 bg-white/95 p-4 shadow-sm backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
              SR Admin Portal
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-orange-700">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Manage the store from one secure workspace.
            </p>
          </div>

          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <button type="button" onClick={() => setActiveTab("overview")} className={sidebarButtonClass("overview")}>
              <span className="block text-sm font-black">Overview</span>
              <span className="mt-1 block text-[11px] font-semibold text-inherit/70">Portal snapshot</span>
            </button>
            <button type="button" onClick={() => setActiveTab("orders")} className={sidebarButtonClass("orders")}>
              <span className="block text-sm font-black">Orders</span>
              <span className="mt-1 block text-[11px] font-semibold text-inherit/70">Delivery workflow</span>
            </button>
            <button type="button" onClick={() => setActiveTab("products")} className={sidebarButtonClass("products")}>
              <span className="block text-sm font-black">Products</span>
              <span className="mt-1 block text-[11px] font-semibold text-inherit/70">Catalog control</span>
            </button>
            <button type="button" onClick={() => setActiveTab("reviews")} className={sidebarButtonClass("reviews")}>
              <span className="block text-sm font-black">Reviews</span>
              <span className="mt-1 block text-[11px] font-semibold text-inherit/70">Moderate feedback</span>
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-3 text-left text-sm font-black text-orange-300"
            >
              <span className="block text-sm font-black">Settings</span>
              <span className="mt-1 block text-[11px] font-semibold text-orange-300">Coming soon</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-left text-sm font-black text-white transition hover:bg-stone-800"
            >
              Logout
            </button>
          </nav>

          <div className="mt-6 hidden rounded-3xl border border-orange-100 bg-orange-50 p-4 lg:block">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-600">
              Active Admin
            </p>
            <p className="mt-2 break-all text-sm font-bold text-stone-900">
              {user.email}
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-orange-100/80 bg-[#fffaf5]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                  Secure admin workspace
                </p>
                <h2 className="text-2xl font-black text-stone-900 sm:text-3xl">
                  {TAB_META[activeTab]?.title || TAB_META.overview.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                  {TAB_META[activeTab]?.description || TAB_META.overview.description}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-bold text-stone-600 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Admin authenticated
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden">
              <button type="button" onClick={() => setActiveTab("overview")} className={mobileButtonClass("overview")}>
                Overview
              </button>
              <button type="button" onClick={() => setActiveTab("orders")} className={mobileButtonClass("orders")}>
                Orders
              </button>
              <button type="button" onClick={() => setActiveTab("products")} className={mobileButtonClass("products")}>
                Products
              </button>
              <button type="button" onClick={() => setActiveTab("reviews")} className={mobileButtonClass("reviews")}>
                Reviews
              </button>
            </div>
          </header>

          <section className="p-4 sm:p-6 lg:p-8">
            <div className="rounded-[2rem] border border-orange-100 bg-white/85 p-4 shadow-[0_24px_70px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
              {activeTab === "overview" ? (
                <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-amber-50/60 p-5 sm:p-6 lg:p-8">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-600 shadow-sm">
                      Dashboard Overview
                    </span>

                    <h3 className="mt-4 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
                      Run the store from one clean workspace.
                    </h3>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                      Start with orders, then move to products or reviews when you need to update the catalog or moderate feedback. The navigation stays compact on desktop and mobile so daily work takes fewer taps.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setActiveTab("orders")} className="btn btn-primary w-full justify-start py-4 text-left">
                        Open Orders
                      </button>
                      <button type="button" onClick={() => setActiveTab("products")} className="btn btn-secondary w-full justify-start py-4 text-left">
                        Manage Products
                      </button>
                      <button type="button" onClick={() => setActiveTab("reviews")} className="btn btn-secondary w-full justify-start py-4 text-left">
                        Moderate Reviews
                      </button>
                      <button type="button" disabled className="btn btn-outline w-full justify-start py-4 text-left opacity-70">
                        Settings Coming Soon
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    {[
                      {
                        title: "Orders First",
                        text: "Focus on new orders, delivery updates, and payment review from the same place.",
                      },
                      {
                        title: "Products Second",
                        text: "Keep catalog updates fast with a simpler form, cleaner cards, and clearer actions.",
                      },
                      {
                        title: "Reviews Third",
                        text: "Scan customer feedback in a dedicated moderation view without leaving the portal.",
                      },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
                          Workflow
                        </p>
                        <h4 className="mt-2 text-xl font-black text-stone-950">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-stone-600">
                          {item.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-1">
                  {activeTab === "products" ? <AdminProducts embedded /> : null}
                  {activeTab === "orders" ? <AdminOrders embedded /> : null}
                  {activeTab === "reviews" ? <AdminReviews embedded /> : null}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 z-40 rounded-full border border-orange-100 bg-white/95 px-3 py-2 shadow-[0_18px_50px_rgba(249,115,22,0.18)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-stone-600">
          <button type="button" onClick={() => setActiveTab("overview")} className={`rounded-full px-2 py-2 transition ${activeTab === "overview" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}>
            Overview
          </button>
          <button type="button" onClick={() => setActiveTab("orders")} className={`rounded-full px-2 py-2 transition ${activeTab === "orders" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}>
            Orders
          </button>
          <button type="button" onClick={() => setActiveTab("products")} className={`rounded-full px-2 py-2 transition ${activeTab === "products" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}>
            Products
          </button>
          <button type="button" onClick={() => setActiveTab("reviews")} className={`rounded-full px-2 py-2 transition ${activeTab === "reviews" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}>
            Reviews
          </button>
        </div>
      </nav>
    </div>
  );
}

export default AdminDashboard;
