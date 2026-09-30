import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@campusconnect.edu');
    setPassword('Admin@CampusConnect2026');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast('Admin authentication successful! Welcome to the control panel.', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative bg-ivory">
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-3">
          <img
            src="/abes-logo.png"
            alt="ABES Engineering College"
            className="h-14 w-auto object-contain mx-auto"
          />
          <div>
            <h1 className="font-display text-3xl text-ink tracking-tight">
              Administrator Access
            </h1>
            <p className="text-xs text-ink-light max-w-xs mx-auto leading-relaxed mt-1">
              Secure administrative gateway for ABES club coordinators and event directors.
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="p-8 rounded-2xl bg-white border border-border shadow-card space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campusconnect.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-ivory border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Staff Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick Button */}
          <div className="pt-4 border-t border-border-light text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-ink-faint hover:text-ink-light transition-colors cursor-pointer"
            >
              Fill default admin credentials
            </button>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-ink-light hover:text-ink font-medium transition-colors"
          >
            ← Return to CampusConnect Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
