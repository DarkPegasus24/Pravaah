import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const errors = {
    email: touched.email || formSubmitted ? validateEmail(formData.email) : '',
    password: touched.password || formSubmitted ? validatePassword(formData.password) : '',
  };

  const isFormValid =
    formData.email.trim() !== '' &&
    formData.password !== '' &&
    !validateEmail(formData.email) &&
    !validatePassword(formData.password);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white relative overflow-hidden">
      {/* Top Simple Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-neutral-100">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-lg text-black tracking-tight">
            PRAVAAH
          </span>
        </Link>

        <div className="text-xs text-neutral-600">
          New to Pravaah?{' '}
          <Link
            to="/signup"
            className="text-black hover:underline font-semibold transition-colors ml-1"
          >
            Create an account
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center">
        <Card variant="default" className="border-neutral-200 shadow-lg p-6 sm:p-8 bg-white">
          <div className="text-center mb-8">
            <Badge variant="secondary" dot pulse size="sm" className="mb-3">
              Secure Sign In
            </Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Enter your credentials to access your autonomous revenue dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            {/* Email Field */}
            <Input
              label="Work Email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              startIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-500 hover:text-black focus:outline-none transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              autoComplete="current-password"
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600 hover:text-black">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-neutral-300 accent-black"
                />
                <span>Remember me</span>
              </label>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-neutral-600 hover:text-black transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={!isFormValid}
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Alternate Signup Prompt */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-600">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="text-black hover:underline font-semibold transition-colors"
            >
              Start 14-day free trial
            </Link>
          </div>
        </Card>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-600 text-center">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>256-bit SSL encrypted & GDPR compliant</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-100">
        © {new Date().getFullYear()} PRAVAAH Technologies, Inc. All rights reserved.
      </footer>
    </div>
  );
}
