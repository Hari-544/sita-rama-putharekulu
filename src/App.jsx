import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import BuyNowPage from "./pages/BuyNowPage";
import SuccessPage from "./pages/SuccessPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsPage from "./pages/TermsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import TrackOrder from "./pages/TrackOrder";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
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
        element={<AdminLogin />}
      />

      <Route
        path="/admin-orders"
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track-order"
        element={<TrackOrder />}
      />
      

    </Routes>

  );
}

export default App;