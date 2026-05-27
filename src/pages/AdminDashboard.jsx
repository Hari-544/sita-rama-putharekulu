import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

import { auth, googleProvider } from "../firebase";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import { setSeoMeta } from "../utils/seo";

const ADMIN_EMAIL = "patnalaharikrishna9544@gmail.com";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
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
    () => Boolean(user && user.email === ADMIN_EMAIL),
    [user]
  );

  const handleLogin = async () => {
    try {
      setAuthenticating(true);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (email !== ADMIN_EMAIL) {
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
      setActiveTab("products");
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] text-2xl font-black text-orange-700">
        Loading Admin Portal...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] p-4 sm:p-6">
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

  return (
    <div className="min-h-screen bg-[#fffaf5] text-stone-900 safe-bottom-lg">
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
              Manage products and orders from one secure workspace.
            </p>
          </div>

          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`w-full rounded-2xl px-4 py-3 text-center text-sm font-black transition lg:text-left ${activeTab === "products" ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full rounded-2xl px-4 py-3 text-center text-sm font-black transition lg:text-left ${activeTab === "orders" ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-stone-800 lg:text-left"
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
                  {activeTab === "products" ? "Products Management" : "Orders Management"}
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-bold text-stone-600 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Admin authenticated
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${activeTab === "products" ? "bg-orange-600 text-white" : "bg-white text-orange-700 shadow-sm"}`}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${activeTab === "orders" ? "bg-orange-600 text-white" : "bg-white text-orange-700 shadow-sm"}`}
              >
                Orders
              </button>
            </div>
          </header>

          <section className="p-4 sm:p-6 lg:p-8">
            <div className="rounded-[2rem] border border-orange-100 bg-white/85 p-4 shadow-[0_24px_70px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
              <div className="mb-6 hidden flex-wrap gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition ${activeTab === "products" ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
                >
                  Products
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition ${activeTab === "orders" ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
                >
                  Orders
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-1">
                {activeTab === "products" ? <AdminProducts embedded /> : null}
                {activeTab === "orders" ? <AdminOrders embedded /> : null}
              </div>
            </div>
          </section>
        </main>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 z-40 rounded-full border border-orange-100 bg-white/95 px-3 py-2 shadow-[0_18px_50px_rgba(249,115,22,0.18)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-stone-600">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`rounded-full px-2 py-2 transition ${activeTab === "products" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-full px-2 py-2 transition ${activeTab === "orders" ? "bg-orange-50 text-orange-700" : "hover:bg-orange-50 hover:text-orange-700"}`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full px-2 py-2 transition hover:bg-stone-100"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default AdminDashboard;
