import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Button from "./ui/Button";
import { apiUrl } from "../utils/api";

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

      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const res = await fetch(apiUrl("/api/auth/google"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 my-1">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-400 font-medium">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      <Button onClick={handleGoogleClick} loading={loading} variant="google">
        <FaGoogle className="h-4 w-4 text-red-500" />
        <span>Continue with Google</span>
      </Button>

      {error && (
        <p className="text-sm text-rose-500 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
