import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Zap,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Layers,
  ArrowRight,
  CheckCircle2,
  TreePine,
  DollarSign,
  Fuel,
  Flame,
  Globe,
  Award,
  ChevronRight,
  Play,
} from 'lucide-react';
import { FloatingElements } from '../components/animations/FloatingElements';
import { AnimatedCounter } from '../components/animations/AnimatedCounter';
import { MagneticButton } from '../components/animations/MagneticButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const { toast } = useToast();
  const [demoLoading, setDemoLoading] = useState(false);

  // Carbon Estimator State
  const [elecKwh, setElecKwh] = useState(4500);
  const [fuelLiters, setFuelLiters] = useState(350);
  const [gasM3, setGasM3] = useState(250);

  // Calculator estimations
  const annualElecCO2 = (elecKwh * 12 * 0.385);
  const annualFuelCO2 = (fuelLiters * 12 * 2.68);
  const annualGasCO2 = (gasM3 * 12 * 2.03);
  const totalAnnualCO2eKg = annualElecCO2 + annualFuelCO2 + annualGasCO2;
  const totalAnnualTonnes = Math.round((totalAnnualCO2eKg / 1000) * 10) / 10;
  const treesNeeded = Math.round(totalAnnualCO2eKg / 21);
  const potentialSavingsUSD = Math.round(totalAnnualTonnes * 65); // ~$65 per ton efficiency saving

  // Pricing Toggle
  const [annualBilling, setAnnualBilling] = useState(true);

  // Active showcase tab
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDemoClick = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      toast('Welcome to the EcoPulse interactive demo!', 'success');
      navigate('/app/dashboard');
    } catch (err) {
      toast('Could not enter demo session, please try again.', 'error');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e0b] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Background Floating Eco Particles */}
      <FloatingElements />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/15 bg-[#060e0b]/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-white">Eco</span>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Pulse
                </span>
              </div>
              <span className="text-[10px] text-emerald-400/80 font-semibold tracking-wider uppercase block -mt-0.5">
                Track. Measure. Reduce.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Platform</a>
            <a href="#estimator" className="hover:text-emerald-400 transition-colors">Calculator</a>
            <a href="#advisor" className="hover:text-emerald-400 transition-colors">AI Advisor</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>

            <button
              onClick={handleDemoClick}
              disabled={demoLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{demoLoading ? 'Launching Demo...' : 'Explore Demo'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-6 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Next-Generation Corporate ESG & Carbon Accounting Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
        >
          Track Every Joule. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Reduce Every Ton of Carbon.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          The all-in-one environmental intelligence SaaS. Automatically calculate GHG Scope 1, 2, and 3 emissions, uncover hidden energy waste with our AI Sustainability Advisor, and achieve auditable net-zero milestones.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleDemoClick}
            disabled={demoLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{demoLoading ? 'Starting Environment...' : 'Launch Live Interactive Demo'}</span>
          </button>

          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#12241d] hover:bg-[#183127] border border-emerald-500/30 text-emerald-300 font-bold text-base transition-all hover:border-emerald-400/50"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Live Metrics Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-3xl bg-[#0b1713]/80 border border-emerald-500/20 backdrop-blur-xl shadow-2xl"
        >
          <div className="p-4 text-center border-r border-emerald-500/10 last:border-r-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              <AnimatedCounter value={5200000} duration={1.5} suffix=" kg" />
            </p>
            <p className="text-xs text-emerald-400/90 font-medium mt-1">CO2e Tracked</p>
          </div>
          <div className="p-4 text-center border-r border-emerald-500/10 last:border-r-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              <AnimatedCounter value={28.4} duration={1.5} decimals={1} suffix="%" />
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Avg. Carbon Reduction</p>
          </div>
          <div className="p-4 text-center border-r border-emerald-500/10 last:border-r-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              <AnimatedCounter value={840} duration={1.5} suffix="+" />
            </p>
            <p className="text-xs text-emerald-400/90 font-medium mt-1">Monitored Facilities</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              <AnimatedCounter value={99.8} duration={1.5} decimals={1} suffix="%" />
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">GHG Protocol Compliance</p>
          </div>
        </motion.div>
      </section>

      {/* Interactive Carbon Estimator Section */}
      <section id="estimator" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Estimate Your Annual Facility Carbon Footprint
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
            Adjust the sliders below to see your immediate Scope 1 & 2 carbon footprint and the potential savings unlocked by EcoPulse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sliders Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/20 shadow-2xl flex flex-col justify-between space-y-6">
            {/* Slider 1: Electricity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Monthly Electricity (kWh)
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {elecKwh.toLocaleString()} kWh / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={elecKwh}
                onChange={(e) => setElecKwh(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#152e24] accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Small Office (1,000 kWh)</span>
                <span>Industrial / HQ (25,000 kWh)</span>
              </div>
            </div>

            {/* Slider 2: Fuel */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-rose-400" />
                  Monthly Fleet Fuel (Liters)
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {fuelLiters.toLocaleString()} L / mo
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={fuelLiters}
                onChange={(e) => setFuelLiters(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#152e24] accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Light Delivery (100 L)</span>
                <span>Commercial Fleet (3,000 L)</span>
              </div>
            </div>

            {/* Slider 3: Natural Gas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-sky-400" />
                  Monthly Natural Gas (m³)
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {gasM3.toLocaleString()} m³ / mo
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="2000"
                step="20"
                value={gasM3}
                onChange={(e) => setGasM3(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#152e24] accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Moderate Heating (100 m³)</span>
                <span>Intensive Process (2,000 m³)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              Calculations auto-calibrated using official EPA eGRID and GHG Protocol corporate emission standards.
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#102b20] to-[#0a1712] border border-emerald-500/30 shadow-2xl flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-300 mb-2">
                Estimated Annual Footprint
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  {totalAnnualTonnes}
                </span>
                <span className="text-lg font-bold text-emerald-400">tonnes CO2e</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ≈ {Math.round(totalAnnualCO2eKg).toLocaleString()} kilograms of carbon emissions per year
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-emerald-500/15">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-emerald-500/15">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <TreePine className="w-4 h-4 text-emerald-400" />
                    Trees needed to sequester
                  </div>
                  <span className="font-extrabold text-white text-sm">
                    ~{treesNeeded.toLocaleString()} mature trees
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-emerald-500/15">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Est. Annual Savings Potential
                  </div>
                  <span className="font-extrabold text-emerald-300 text-sm">
                    ${potentialSavingsUSD.toLocaleString()} / yr
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDemoClick}
              className="mt-6 w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Explore Detailed Action Plan in App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Modern Sustainability Teams
          </h2>
          <p className="text-base text-slate-400 mt-3 max-w-2xl mx-auto">
            Everything you need to move from manual spreadsheets to an automated, auditable, AI-accelerated sustainability operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Resource Ingestion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track electricity, natural gas, diesel, petrol, water throughput, and waste diversion with real-time GHG unit normalization.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Scope 1, 2, and 3 Disaggregation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instantly view carbon breakdown across direct combustion (Scope 1), purchased grid electricity (Scope 2), and supply chain waste (Scope 3).
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Sustainability Advisor</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Proprietary AI diagnostic engine scans your consumption patterns and delivers prioritized energy efficiency measures with ROI timelines.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Anomaly & Leak Detection</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated rolling baseline algorithms detect sudden consumption spikes and billing anomalies before they drain budgets.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Target & Milestone Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Set science-based reduction targets (e.g. 20% Scope 2 reduction by 2027) with real-time trajectory pacing and celebration triggers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-3xl bg-[#0d1c16] border border-emerald-500/15 hover:border-emerald-500/35 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Auditable ESG CSV & PDF Reports</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Export standard-compliant sustainability reports ready for board presentations, investors, CDP filings, and compliance audits.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Transparent, Impact-Driven Pricing
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            No hidden fees. Every tier includes automated GHG Scope calculations and AI recommendations.
          </p>

          {/* Billing switch */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#10201a] border border-emerald-500/20">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !annualBilling ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                annualBilling ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-300">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Starter */}
          <div className="p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">Single site sustainability tracking</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  ${annualBilling ? '79' : '99'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 3 resource streams
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Scope 1 & 2 GHG calculations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Basic AI Advisor recommendations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standard CSV export
                </li>
              </ul>
            </div>
            <button
              onClick={handleDemoClick}
              className="mt-8 w-full py-3 rounded-xl border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/10 transition-colors"
            >
              Try Starter Demo
            </button>
          </div>

          {/* Tier 2: Professional (Featured) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#122c22] to-[#0c1a14] border-2 border-emerald-400/50 shadow-2xl relative flex flex-col justify-between scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Professional</h3>
              <p className="text-xs text-emerald-300/80 mt-1">Complete corporate decarbonization</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  ${annualBilling ? '199' : '249'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited resource monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Scope 1, 2, & 3 coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Advanced AI Advisor & step-by-step action plans
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Anomaly & Spike Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Executive PDF & Auditable CSV export
                </li>
              </ul>
            </div>
            <button
              onClick={handleDemoClick}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:from-emerald-300 hover:to-teal-300 transition-all cursor-pointer"
            >
              Get Started with Professional
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise</h3>
              <p className="text-xs text-slate-400 mt-1">Multi-site multi-entity enterprises</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  ${annualBilling ? '499' : '599'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited facilities & users
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom regional emission factor overrides
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated ESG compliance specialist
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 99.9% SLA & custom API integrations
                </li>
              </ul>
            </div>
            <button
              onClick={handleDemoClick}
              className="mt-8 w-full py-3 rounded-xl border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/10 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center relative z-10">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#0d2a1f] via-[#103829] to-[#0d2a1f] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Cut Carbon & Operating Costs?
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/80 mt-4 max-w-xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking facilities actively decarbonizing with EcoPulse. Instant setup, zero hardware required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemoClick}
              disabled={demoLoading}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
            >
              {demoLoading ? 'Starting Environment...' : '⚡ Explore Live Demo Account'}
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-black/30 hover:bg-black/50 border border-emerald-500/30 text-white font-bold text-sm transition-all"
            >
              Register Facility
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/15 bg-[#050c09] py-12 px-4 sm:px-8 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">EcoPulse</span>
            <span className="text-slate-600">|</span>
            <span>Track. Measure. Reduce.</span>
          </div>

          <p className="text-slate-500">
            © {new Date().getFullYear()} EcoPulse Environmental Technologies Inc. Compliant with GHG Protocol & ISO 14064.
          </p>

          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
            <a href="#estimator" className="hover:text-emerald-400 transition-colors">Carbon Calculator</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
