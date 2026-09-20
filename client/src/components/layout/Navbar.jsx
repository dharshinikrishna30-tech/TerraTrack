import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/api';
import {
  Bell,
  Plus,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseRing } from '../animations/PulseRing';

export const Navbar = ({ onOpenQuickLog, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const alertsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await alertService.getAlerts();
        setUnreadCount(res.data.unreadCount || 0);
        setUnreadAlerts(res.data.alerts?.slice(0, 4) || []);
      } catch (err) {
        // silent fail on background polling
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setShowAlertsDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-emerald-500/15 bg-[#0a1410]/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile burger & Breadcrumb/Facility status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <PulseRing size="sm" color="emerald" />
            Live Monitoring
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 truncate max-w-xs">{user?.organization || 'Enterprise Campus'}</span>
        </div>
      </div>

      {/* Right side: Quick Log + Notification Bell + User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Log Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenQuickLog}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline">Log Resource</span>
        </motion.button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative p-2 rounded-xl border border-slate-800 bg-[#12201b] hover:bg-[#182b24] text-slate-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showAlertsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e1b17] border border-emerald-500/20 shadow-2xl p-4 z-50 text-slate-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Sustainability Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <Link
                    to="/app/alerts"
                    onClick={() => setShowAlertsDropdown(false)}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    View All
                  </Link>
                </div>

                <div className="py-2 divide-y divide-emerald-500/5 max-h-72 overflow-y-auto">
                  {unreadAlerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
                      All resource trends nominal. No active anomalies.
                    </div>
                  ) : (
                    unreadAlerts.map((alert) => (
                      <div key={alert._id} className="py-2.5 flex items-start gap-3">
                        {alert.severity === 'critical' || alert.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        )}
                        <div className="text-xs flex-1">
                          <p className="font-medium text-slate-100">{alert.title}</p>
                          <p className="text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-emerald-500/10 text-center">
                  <Link
                    to="/app/alerts"
                    onClick={() => setShowAlertsDropdown(false)}
                    className="block py-1.5 text-xs text-center text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Manage Anomaly Detection Rules →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-emerald-500/15 bg-[#12201b] hover:bg-[#182b24] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                {user?.name || 'Account'}
              </p>
              <p className="text-[10px] text-emerald-400 capitalize leading-tight">
                {user?.role?.replace('_', ' ') || 'Member'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e1b17] border border-emerald-500/20 shadow-2xl p-2 z-50 text-slate-200"
              >
                <div className="px-3 py-2 border-b border-emerald-500/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/app/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-emerald-500/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-emerald-400" />
                  Settings & Factors
                </Link>

                <Link
                  to="/app/reports"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-emerald-500/10 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ESG Certification
                </Link>

                <div className="my-1 border-t border-emerald-500/10" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
