import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { apiUrl } from '../utils/api';

export default function SignIn() {
  useDocumentTitle('Sign In');
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Email and password are required'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch(apiUrl('/api/auth/signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue your property search."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          icon={FaEnvelope}
          onChange={handleChange}
        />
        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon={FaLock}
            onChange={handleChange}
          />
          <div className="text-right mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-estate-700 dark:hover:text-estate-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
          Sign In
        </Button>

        <OAuth />
      </form>

      <p className="text-center text-slate-500 dark:text-slate-400 mt-8 text-sm">
        Don&apos;t have an account?{' '}
        <Link
          to="/sign-up"
          className="text-estate-700 dark:text-estate-400 font-semibold hover:text-estate-600 dark:hover:text-estate-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
