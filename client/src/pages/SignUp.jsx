import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import OAuth from '../components/OAuth';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

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
            className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-3"
            role="alert"
          >
            <span className="text-rose-500 text-sm mt-0.5" aria-hidden="true">
              ●
            </span>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="mt-2">
          Create Account
        </Button>

        <OAuth />
      </form>

      <p className="text-center text-slate-500 mt-8 text-sm">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="text-estate-700 font-semibold hover:text-estate-600 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
