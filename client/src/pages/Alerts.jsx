import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  BellOff,
  Clock,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { alertService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const Alerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAlerts = async () => {
    try {
      const res = await alertService.getAlerts();
      setAlerts(res.data.alerts || []);
    } catch (err) {
      toast('Failed to load anomaly alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await alertService.markRead(id);
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, isRead: true } : a)));
    } catch (err) {
      // silent
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id);
      toast('Alert resolved and verified', 'success');
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isResolved: true, isRead: true } : a))
      );
    } catch (err) {
      toast('Failed to resolve alert', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await alertService.deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      toast('Alert dismissed', 'info');
    } catch (err) {
      toast('Failed to dismiss alert', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all environmental alerts?')) return;
    try {
      await alertService.clearAll();
      setAlerts([]);
      toast('All alerts cleared', 'success');
    } catch (err) {
      toast('Failed to clear alerts', 'error');
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !a.isRead;
    return a.severity === filter;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Environmental Anomaly & Spike Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated consumption surge detection, goal drift monitoring, and billing deviation alerts
          </p>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-[#0e1c17] hover:bg-[#152a22] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            <BellOff className="w-4 h-4" />
            <span>Dismiss All</span>
          </button>
        )}
      </div>

      {/* KPI Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Unread Alerts
          </p>
          <p className="text-2xl font-black text-amber-400 mt-1">{unreadCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Requiring attention</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Critical Deviations
          </p>
          <p className="text-2xl font-black text-rose-400 mt-1">{criticalCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">&gt;50% spike over baseline</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Anomaly Algorithm
          </p>
          <p className="text-base font-bold text-emerald-300 mt-1">Rolling 3-Month Baseline</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active anomaly scanner</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
        {['all', 'unread', 'critical', 'warning', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === f
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-emerald-500/10'
            }`}
          >
            {f} (
            {
              alerts.filter((a) => {
                if (f === 'all') return true;
                if (f === 'unread') return !a.isRead;
                return a.severity === f;
              }).length
            }
            )
          </button>
        ))}
      </div>

      {/* Alert Feed */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filteredAlerts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c1914] border border-emerald-500/15 text-slate-400 text-xs">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400/40 mb-3" />
          <p className="font-bold text-slate-200">No alerts match your filter.</p>
          <p className="text-slate-500 mt-1">All resource streams are within nominal boundaries.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isWarn = alert.severity === 'warning';

            return (
              <motion.div
                key={alert._id}
                whileHover={{ y: -1 }}
                className={`p-5 rounded-2xl border transition-all ${
                  alert.isResolved
                    ? 'bg-[#08120e] border-slate-800/60 opacity-65'
                    : isCrit
                    ? 'bg-[#1a0f11] border-rose-500/30'
                    : isWarn
                    ? 'bg-[#18150d] border-amber-500/30'
                    : 'bg-[#0c1914] border-emerald-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isCrit
                          ? 'bg-rose-500/15 text-rose-400'
                          : isWarn
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      {isCrit ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{alert.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                            isCrit
                              ? 'bg-rose-500/20 text-rose-300'
                              : isWarn
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-sky-500/20 text-sky-300'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        {alert.isResolved && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-300">
                            Resolved
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>Detected {new Date(alert.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">
                          Resource: {alert.resourceType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!alert.isResolved && (
                      <button
                        onClick={() => handleResolve(alert._id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(alert._id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
