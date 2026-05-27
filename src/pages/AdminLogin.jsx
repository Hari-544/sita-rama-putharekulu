import { signInWithPopup } from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";


function AdminLogin() {

  const handleLogin = async () => {

  try {

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    const email =
      result.user.email;

    /* YOUR ADMIN EMAIL */

    if (
      email !==
      "patnalaharikrishna9544@gmail.com"
    ) {

      alert(
        "Access Denied ❌"
      );

      return;

    }

    localStorage.setItem(
      "adminLoggedIn",
      "true"
    );

    window.location.href =
      "/admin-orders";

  } catch (error) {

    console.error("Admin login failed:", error);

    alert(error.message);

  }

};

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] p-4 sm:p-6">

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-orange-100 w-full max-w-md text-center">

        <h1 className="fluid-heading font-black text-orange-700 mb-4">
          Admin Login
        </h1>

        <p className="text-stone-500 mb-8">
          Secure Admin Access
        </p>

        <button
          onClick={handleLogin}
          className="btn btn-primary w-full text-lg"
        >
          Continue With Google
        </button>

      </div>

    </div>

  );

}

export default AdminLogin;
