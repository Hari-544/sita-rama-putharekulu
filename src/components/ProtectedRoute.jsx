import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  Navigate,
} from "react-router-dom";

import {
  auth,
} from "../firebase";

function ProtectedRoute({
  children,
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          setLoading(false);

        }
      );

    return () =>
      unsubscribe();

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );

  }

  if (!user) {

    return (
      <Navigate
        to="/sr-admin-portal-2026"
      />
    );

  }

  return children;

}

export default ProtectedRoute;