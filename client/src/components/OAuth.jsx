import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Force account picker every time
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // sends/stores the httpOnly cookie
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Google sign-in failed.");
        setLoading(false);
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Could not sign in with Google. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGoogleClick}
        disabled={loading}
        type="button"
        className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}
