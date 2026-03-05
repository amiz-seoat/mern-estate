import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import OAuth from '../components/OAuth';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiUrl } from '../utils/api';

export default function SignUp() {
  useDocumentTitle('Create Account');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setError('All fields are required');
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      if (data.requiresVerification) {
        setSignupSuccess(true);
      } else {
        navigate('/sign-in');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  if (signupSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="One more step to get started"
      >
        <div className="text-center py-4 animate-fade-in">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 dark:border-emerald-800">
            <FaCheckCircle className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Account created!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            We&apos;ve sent a verification link to{' '}
            <strong className="text-slate-700 dark:text-slate-300">{formData.email}</strong>.
            Please check your inbox and click the link to verify your account.
          </p>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of happy homeowners and find your perfect property."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="username"
          type="text"
          label="Username"
          placeholder="Enter your username"
          icon={FaUser}
          onChange={handleChange}
        />
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          icon={FaEnvelope}
          onChange={handleChange}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          icon={FaLock}
          onChange={handleChange}
        />

        {error && (
          <div
            className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 flex items-start gap-3"
            role="alert"
          >
            <span className="text-rose-500 text-sm mt-0.5" aria-hidden="true">
              ●
            </span>
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="mt-2">
          Create Account
        </Button>

        <OAuth />
      </form>

      <p className="text-center text-slate-500 dark:text-slate-400 mt-8 text-sm">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="text-estate-700 dark:text-estate-400 font-semibold hover:text-estate-600 dark:hover:text-estate-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
