import {
  Navigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

import {
  auth,
} from "../firebase";

function AdminRoute({
  children,
}) {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    user,
    setUser,
  ] = useState(null);

  /* MULTIPLE ADMINS */

  const ADMIN_EMAILS = [

    "patnalaharikrishna9544@gmail.com",

    "atreyapuramsweetpapers@gmail.com",

  ];

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        (currentUser) => {

          setUser(
            currentUser
          );

          setLoading(
            false
          );

        }

      );

    return () =>
      unsubscribe();

  }, []);

  /* LOADING */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-black">

        Checking Access...

      </div>

    );

  }

  /* NOT LOGGED IN */

  if (!user) {

    return (
      <Navigate to="/" />
    );

  }

  /* CHECK ADMIN ACCESS */

  const isAdmin =
    ADMIN_EMAILS.includes(
      user.email
    );

  /* NOT ADMIN */

  if (!isAdmin) {

    return (
      <Navigate to="/" />
    );

  }

  /* ADMIN ACCESS */

  return children;

}

export default AdminRoute;