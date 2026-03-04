import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaEnvelope } from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function VerifyEmail() {
  useDocumentTitle("Verify Email");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (data.success === false) {
          setStatus("error");
          setMessage(data.message);
        } else {
          setStatus("success");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    try {
      setResending(true);
      setResendMsg("");
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setResendMsg(data.message || "Verification email sent.");
    } catch {
      setResendMsg("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-estate-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-500 dark:text-slate-400">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 dark:border-emerald-800">
              <FaCheckCircle className="h-9 w-9 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Email Verified!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-estate-800/20"
            >
              Sign In to Your Account
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="bg-rose-50 dark:bg-rose-950/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-800">
              <FaExclamationCircle className="h-9 w-9 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Verification Failed</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-left">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Need a new verification link?
              </p>
              <form onSubmit={handleResend} className="flex gap-2">
                <div className="relative flex-1">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-estate-500 transition-colors bg-white dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending}
                  className="px-4 py-2.5 bg-estate-800 hover:bg-estate-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {resending ? "Sending..." : "Resend"}
                </button>
              </form>
              {resendMsg && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{resendMsg}</p>
              )}
            </div>
          </>
        )}

        {status === "no-token" && (
          <>
            <div className="bg-amber-50 dark:bg-amber-950/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-800">
              <FaEnvelope className="h-9 w-9 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Token Provided</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Please use the verification link from your email.
            </p>
            <Link
              to="/sign-in"
              className="text-sm font-semibold text-estate-700 hover:text-estate-600 transition-colors"
            >
              Go to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
