import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  Target,
  Sparkles,
  AlertTriangle,
  FileText,
  Settings,
  Leaf,
  X,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Resource Logs', path: '/app/resources', icon: Layers },
  { name: 'Analytics & Scope', path: '/app/analytics', icon: BarChart3 },
  { name: 'Goals & Targets', path: '/app/goals', icon: Target },
  {
    name: 'AI Advisor',
    path: '/app/ai-advisor',
    icon: Sparkles,
    badge: 'AI Engine',
  },
  { name: 'Alerts & Spikes', path: '/app/alerts', icon: AlertTriangle },
  { name: 'Reports & Audits', path: '/app/reports', icon: FileText },
  { name: 'Settings & Factors', path: '/app/settings', icon: Settings },
];

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a1410] border-r border-emerald-500/15 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-emerald-500/10">
        <Link to="/app/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">Eco</span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Pulse
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium tracking-wider uppercase block -mt-0.5">
              Track. Measure. Reduce.
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-emerald-500/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border-l-4 border-emerald-400"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-emerald-400'
                      : 'text-slate-400 group-hover:text-emerald-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="relative z-10 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Benchmark Card */}
      <div className="p-4 border-t border-emerald-500/10">
        <div className="p-3 rounded-xl bg-[#0f231c] border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GHG Scope 1-3
            </span>
            <span className="text-[10px] text-slate-400">Certified</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Calculations standard compliant with EPA & DEFRA standards.
          </p>
          <Link
            to="/"
            target="_blank"
            className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            Public Landing Page
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
