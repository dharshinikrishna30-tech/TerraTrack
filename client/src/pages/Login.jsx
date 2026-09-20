import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FloatingElements } from '../components/animations/FloatingElements';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, demoLogin } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please provide both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast('Logged in successfully', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      toast('Welcome to the pre-loaded EcoPulse demo account!', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast('Failed to load demo account. Please try again.', 'error');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e0b] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0c1a15]/90 border border-emerald-500/20 shadow-2xl backdrop-blur-2xl relative z-10 text-slate-100"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-white">Eco</span>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Pulse
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block -mt-0.5">
                Track. Measure. Reduce.
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to EcoPulse</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your facility dashboard and sustainability intelligence
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Evaluation
            </span>
            <span className="text-[10px] text-emerald-400/80">No credentials needed</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{demoLoading ? 'Logging into Demo...' : '⚡ Explore 1-Click Demo Account'}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-emerald-500/15 w-full" />
          <span className="bg-[#0c1a15] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
            or sign in with email
          </span>
          <div className="border-t border-emerald-500/15 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-sm transition-colors placeholder:text-slate-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset link sent to demo registered email.', 'info'); }} className="text-[11px] text-emerald-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-sm transition-colors placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full mt-2 py-3 rounded-xl bg-[#18362b] hover:bg-[#1e4537] border border-emerald-500/40 text-emerald-200 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
            Register Facility
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
