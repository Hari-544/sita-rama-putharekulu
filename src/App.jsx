import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import BuyNowPage from "./pages/BuyNowPage";
import SuccessPage from "./pages/SuccessPage";

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

      <Route
        path="/success"
        element={<SuccessPage />}
      />

    </Routes>

  );
}

export default App;