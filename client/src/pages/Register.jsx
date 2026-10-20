import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Lock, Mail, User, Building2, ArrowRight, Sparkles, Ruler } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FloatingElements } from '../components/animations/FloatingElements';

export const Register = () => {
  const navigate = useNavigate();
  const { register, demoLogin } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric');
  const [facilityArea, setFacilityArea] = useState('15000');
  const [headcount, setHeadcount] = useState('45');

  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast('Please provide name, email, and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        organization: organization || `${name}'s Organization`,
        unitSystem,
        facilityArea: parseFloat(facilityArea) || 10000,
        headcount: parseInt(headcount) || 25,
      });
      toast('Account created and starter sustainability data seeded!', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      toast('Welcome to the pre-loaded TerraTrack demo account!', 'success');
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
        className="w-full max-w-lg p-8 rounded-3xl bg-[#0c1a15]/90 border border-emerald-500/20 shadow-2xl backdrop-blur-2xl relative z-10 text-slate-100 my-8"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
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

          <h1 className="text-2xl font-bold text-white tracking-tight">Register Your Facility</h1>
          <p className="text-xs text-slate-400 mt-1">
            Establish your organizational baseline and carbon accounting profile
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="text-xs text-emerald-300">
            <span className="font-bold">Want to preview first?</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{demoLoading ? 'Loading...' : 'Launch Demo Account'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Dr. Jordan Green"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs transition-colors placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Organization Name
              </label>
              <input
                type="text"
                placeholder="Apex CleanTech Inc."
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              Corporate Email *
            </label>
            <input
              type="email"
              placeholder="sustainability@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs transition-colors placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Unit System, Area, Headcount */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Unit System
              </label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full px-2 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              >
                <option value="metric">Metric (kg, m³)</option>
                <option value="imperial">Imperial (lb, gal)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Facility Area
              </label>
              <input
                type="number"
                value={facilityArea}
                onChange={(e) => setFacilityArea(e.target.value)}
                placeholder="15000"
                className="w-full px-2 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Headcount
              </label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                placeholder="50"
                className="w-full px-2 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Setting Up Baseline...' : 'Create Account & Seed Baseline'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
