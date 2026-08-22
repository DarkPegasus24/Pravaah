import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui';
import { PravaahLogo } from '../components/common/PravaahLogo';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    agreedToTerms: true,
  });

  const [touched, setTouched] = useState({
    businessName: false,
    ownerName: false,
    email: false,
    phone: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validation functions
  const validateBusinessName = (val) => {
    if (!val.trim()) return 'Business name is required';
    if (val.trim().length < 2) return 'Business name must be at least 2 characters';
    return '';
  };

  const validateOwnerName = (val) => {
    if (!val.trim()) return 'Your full name is required';
    if (val.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (val) => {
    if (!val.trim()) return 'Phone number is required';
    const phoneClean = val.replace(/[\s+\-()]/g, '');
    if (phoneClean.length < 8) return 'Please enter a valid phone number';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const errors = {
    businessName:
      touched.businessName || formSubmitted ? validateBusinessName(formData.businessName) : '',
    ownerName: touched.ownerName || formSubmitted ? validateOwnerName(formData.ownerName) : '',
    email: touched.email || formSubmitted ? validateEmail(formData.email) : '',
    phone: touched.phone || formSubmitted ? validatePhone(formData.phone) : '',
    password: touched.password || formSubmitted ? validatePassword(formData.password) : '',
  };

  const isFormValid =
    formData.businessName.trim() !== '' &&
    formData.ownerName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.password !== '' &&
    formData.agreedToTerms &&
    !validateBusinessName(formData.businessName) &&
    !validateOwnerName(formData.ownerName) &&
    !validateEmail(formData.email) &&
    !validatePhone(formData.phone) &&
    !validatePassword(formData.password);

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { score: 0, text: '', color: '' };
    if (p.length < 8) return { score: 1, text: 'Too short', color: 'bg-[#76777d]' };
    const hasNumber = /\d/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const hasUpper = /[A-Z]/.test(p);

    const bonus = [hasNumber, hasSpecial, hasUpper].filter(Boolean).length;
    if (bonus >= 2 && p.length >= 10) {
      return { score: 3, text: 'Strong', color: 'bg-[#0c9488]' };
    }
    if (bonus >= 1) {
      return { score: 2, text: 'Good', color: 'bg-[#0058be]' };
    }
    return { score: 1, text: 'Weak', color: 'bg-[#76777d]' };
  };

  const strength = getPasswordStrength();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouched({
      businessName: true,
      ownerName: true,
      email: true,
      phone: true,
      password: true,
    });

    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-[#0058be] selection:text-white relative overflow-hidden font-sans">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-[#e5eeff]">
        <Link to="/" className="flex items-center group">
          <PravaahLogo size="sm" showTagline={false} />
        </Link>

        <div className="text-xs text-[#45464d]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#0058be] hover:underline font-semibold transition-colors ml-1"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col justify-center">
        <Card variant="default" className="border-[#e5eeff] shadow-[0_4px_12px_rgba(11,28,48,0.06)] p-6 sm:p-8 bg-white">
          <div className="text-center mb-6">
            <Badge variant="secondary" dot pulse size="sm" className="mb-3 border-[#d8e2ff]">
              14-Day Full Access Trial
            </Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Create your PRAVAAH workspace
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Automate your customer inquiries, qualify leads, and book meetings 24/7.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Grid row: Business Name & Owner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business / Company Name"
                type="text"
                placeholder="e.g. Apex Health Clinic"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                onBlur={() => handleBlur('businessName')}
                error={errors.businessName}
                startIcon={<Building2 className="w-4 h-4 text-[#0058be]" />}
                required
              />

              <Input
                label="Owner / Contact Name"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                onBlur={() => handleBlur('ownerName')}
                error={errors.ownerName}
                startIcon={<User className="w-4 h-4 text-[#0058be]" />}
                required
              />
            </div>

            {/* Grid row: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Email"
                type="email"
                placeholder="sarah@apexhealth.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                startIcon={<Mail className="w-4 h-4 text-[#0058be]" />}
                autoComplete="email"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                startIcon={<Phone className="w-4 h-4 text-[#0058be]" />}
                autoComplete="tel"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <Input
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={errors.password}
                startIcon={<Lock className="w-4 h-4 text-[#0058be]" />}
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
                autoComplete="new-password"
                required
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <div className="flex-1 h-1.5 bg-[#eff4ff] rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 1 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 1 ? 'w-1/3' : 'w-0'}`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 2 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 2 ? 'w-1/3' : 'w-0'}`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 3 ? strength.color : 'bg-transparent'
                      } ${strength.score >= 3 ? 'w-1/3' : 'w-0'}`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#45464d]">
                    {strength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#45464d]">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#dce9ff] text-[#0058be] focus:ring-[#0058be]"
                />
                <span className="leading-snug">
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0058be] hover:underline font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0058be] hover:underline font-medium">
                    Privacy Policy
                  </a>
                  . No credit card required.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-3">
              <Button
                type="submit"
                variant="accent"
                size="md"
                fullWidth
                disabled={!isFormValid}
                isLoading={isLoading}
                className="font-bold shadow-[0_4px_14px_rgba(0,88,190,0.25)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Free Workspace
              </Button>
            </div>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-6 pt-5 border-t border-[#e5eeff] grid grid-cols-3 gap-2 text-center text-[11px] text-[#45464d]">
            <span className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488] shrink-0" />
              14-day trial
            </span>
            <span className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488] shrink-0" />
              Zero setup fees
            </span>
            <span className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488] shrink-0" />
              Cancel anytime
            </span>
          </div>
        </Card>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#76777d] text-center">
          <ShieldCheck className="w-4 h-4 text-[#0058be]" />
          <span>SOC-2 certified security & encrypted data handling</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#76777d] border-t border-[#e5eeff]">
        © {new Date().getFullYear()} Pravaah Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
