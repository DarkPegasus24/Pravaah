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
import { PravaahLogo } from '../components/common/PravaahLogo';

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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-[#0058be] selection:text-white relative overflow-hidden font-sans">
      {/* Top Simple Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-[#e5eeff]">
        <Link to="/" className="flex items-center group">
          <PravaahLogo size="sm" showTagline={false} />
        </Link>

        <div className="text-xs text-[#45464d]">
          New to Pravaah?{' '}
          <Link
            to="/signup"
            className="text-[#0058be] hover:underline font-semibold transition-colors ml-1"
          >
            Create an account
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center">
        <Card variant="default" className="border-[#e5eeff] shadow-[0_4px_12px_rgba(11,28,48,0.06)] p-6 sm:p-8 bg-white">
          <div className="text-center mb-8">
            <Badge variant="secondary" dot pulse size="sm" className="mb-3 border-[#d8e2ff]">
              Secure Sign In
            </Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
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
                  className="text-[#76777d] hover:text-[#0b1c30] focus:outline-none transition-colors p-1"
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
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#45464d] hover:text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="rounded border-[#dce9ff] text-[#0058be] focus:ring-[#0058be] h-4 w-4"
                />
                <span>Remember this browser</span>
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Demo reset instructions sent to your email.');
                }}
                className="text-[#0058be] hover:underline transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              fullWidth
              size="md"
              isLoading={isLoading}
              className="mt-2 text-sm font-bold shadow-[0_4px_14px_rgba(0,88,190,0.25)]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in to Workspace
            </Button>
          </form>

          {/* Single Sign-On Demo Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5eeff]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#76777d] font-mono text-[10px]">
                Demo Quick Access
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="sm"
            onClick={() => {
              handleChange('email', 'admin@pravah.ai');
              handleChange('password', 'Pravaah2026!');
            }}
            className="text-xs text-[#0058be] font-medium border-[#d8e2ff] bg-[#eff4ff] hover:bg-[#d8e2ff]"
          >
            Auto-Fill Demo Admin Account
          </Button>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between text-xs text-[#76777d] gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0058be]" />
          <span>256-bit SSL Encrypted & SOC-2 Verified</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} Pravaah Technologies Inc.</span>
        </div>
      </footer>
    </div>
  );
}
