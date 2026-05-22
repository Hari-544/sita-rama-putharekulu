import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import BuyNowPage from "./pages/BuyNowPage";
import SuccessPage from "./pages/SuccessPage";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsPage from "./pages/TermsPage";

function App() {

  return (

    <Routes>

      {/* Home Page */}
      <Route
        path="/"
        element={<HomePage />}
      />

      {/* Reviews */}
      <Route
        path="/reviews"
        element={<ReviewsPage />}
      />

      {/* Buy Now Page */}
      <Route
        path="/buy/:id"
        element={<BuyNowPage />}
      />

      {/* Success Page */}
      <Route
        path="/success"
        element={<SuccessPage />}
      />

      {/* Policy Pages */}
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

    </Routes>

  );
}

export default App;