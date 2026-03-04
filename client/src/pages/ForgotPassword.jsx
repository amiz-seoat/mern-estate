import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ForgotPassword() {
  useDocumentTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="We'll send you a link to reset your password">
      {sent ? (
        <div className="text-center py-6 animate-fade-in">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 dark:border-emerald-800">
            <FaCheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Check your email</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            If an account exists with <strong className="text-slate-700 dark:text-slate-300">{email}</strong>,
            you&apos;ll receive a password reset link shortly.
          </p>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-semibold text-estate-700 hover:text-estate-600 transition-colors"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            icon={FaEnvelope}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading}>
            Send Reset Link
          </Button>

          <Link
            to="/sign-in"
            className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-estate-700 dark:hover:text-estate-400 transition-colors"
          >
            <FaArrowLeft className="inline h-3 w-3 mr-1" />
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
