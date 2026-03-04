import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ResetPassword() {
  useDocumentTitle("Reset Password");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This reset link is not valid">
        <div className="text-center py-6">
          <div className="bg-rose-50 dark:bg-rose-950/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100 dark:border-rose-800">
            <FaExclamationCircle className="h-7 w-7 text-rose-500" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-estate-700 hover:text-estate-600 transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="New Password" subtitle="Create a new password for your account">
      {success ? (
        <div className="text-center py-6 animate-fade-in">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 dark:border-emerald-800">
            <FaCheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Password updated!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your password has been successfully reset.
          </p>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="password"
            type="password"
            label="New password"
            placeholder="At least 6 characters"
            icon={FaLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Re-enter your password"
            icon={FaLock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading}>
            Reset Password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
