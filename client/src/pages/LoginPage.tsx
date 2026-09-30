import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.js';
import { getStoredStudent } from '../data/mockData.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addToast('Welcome back, Devansh! Logged in successfully.', 'success');
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    const student = getStoredStudent();
    setEmail(student.email);
    setPassword('student123456');
    addToast('Demo student credentials populated!', 'info');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory text-ink">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with ABES Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="h-14 w-14 rounded-2xl bg-ink flex items-center justify-center overflow-hidden mx-auto">
              <img
                src="/abes-logo.png"
                alt="ABES Engineering College"
                className="h-12 w-auto object-contain object-left"
              />
            </div>
          </Link>
          <h2 className="font-display text-3xl text-ink tracking-tight">
            Student Portal Sign In
          </h2>
          <p className="text-xs text-ink-light">
            Access your verified event admission passes and joined technical societies.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-white border border-border shadow-card space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-[11px] text-ink-faint hover:text-ink-light transition-colors"
            >
              Use demo credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-light mb-1">
                Collegiate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name.roll@abes.ac.in"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-ivory border border-border text-xs sm:text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-ink-light">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('For password resets, contact your department IT coordinator.', 'info');
                  }}
                  className="text-[11px] text-green hover:opacity-80"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-ivory border border-border text-xs sm:text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-pill bg-green hover:bg-green-hover text-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Student ID...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-border-light text-center text-xs text-ink-light">
            <span>New to CampusConnect? </span>
            <Link to="/signup" className="text-green font-semibold hover:opacity-80">
              Create student account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
