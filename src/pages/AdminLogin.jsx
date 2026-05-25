import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const provider =
        new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      /* ALLOW ONLY YOUR EMAIL */

      if (
        user.email ===
        "YOUR_GMAIL@gmail.com"
      ) {

        localStorage.setItem(
          "adminAuth",
          "true"
        );

        navigate("/admin-orders");

      } else {

        alert(
          "Unauthorized Access ❌"
        );

      }

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] p-6">

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-orange-100 w-full max-w-md text-center">

        <h1 className="text-4xl font-black text-orange-700 mb-4">
          Admin Login
        </h1>

        <p className="text-stone-500 mb-8">
          Secure Admin Access
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-lg"
        >
          Continue With Google
        </button>

      </div>

    </div>

  );

}

export default AdminLogin;