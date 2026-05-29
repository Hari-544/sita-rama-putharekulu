import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const BuyNowPage = lazy(() => import("./pages/BuyNowPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#fffaf5]" />
  );
}

function App() {

  return (

    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/track-order"
            element={<HomePage />}
          />

          <Route
            path="/reviews"
            element={<ReviewsPage />}
          />

          <Route
            path="/buy/:id"
            element={<BuyNowPage />}
          />

          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/success"
            element={<SuccessPage />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/refund-policy"
            element={<RefundPolicy />}
          />

          <Route
            path="/shipping-policy"
            element={<ShippingPolicy />}
          />

          <Route
            path="/terms-and-conditions"
            element={<TermsPage />}
          />

          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/sr-admin-portal-2026"
            element={<AdminDashboard />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>

  );
}

export default App;
