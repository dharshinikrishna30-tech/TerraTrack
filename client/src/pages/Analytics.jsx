import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  Building,
  Users,
  Compass,
  Download,
  Calendar,
  Layers,
  Zap,
  Info,
} from 'lucide-react';
import { resourceService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [timeFilter, setTimeFilter] = useState('12m');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await resourceService.getSummary();
        setSummary(res.data.summary);
      } catch (err) {
        toast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="stat" count={3} />
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  // Monthly breakdown for stacked bar chart
  const monthlyData = Object.values(summary?.byMonth || {}).map((m) => ({
    month: m.month,
    Electricity: Math.round(m.electricity),
    Fuel: Math.round(m.fuel),
    'Natural Gas': Math.round(m.gas),
    Water: Math.round(m.water),
    Waste: Math.round(m.waste),
    CostUSD: Math.round(m.cost),
    totalCO2e: Math.round(m.totalCO2e),
  }));

  const intensity = summary?.intensity || {};
  const perEmployee = intensity.perEmployee || 0;
  const perArea = intensity.perArea || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Carbon & Scope Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep-dive multi-resource carbon accounting, intensity ratios, and cost correlations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => reportService.downloadCSV()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/20 bg-[#0c1a15] hover:bg-[#12241d] text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics Data</span>
          </button>
        </div>
      </div>

      {/* Carbon Intensity & Benchmark Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Per Employee */}
        <div className="p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Employee Carbon Intensity
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-white">{perEmployee.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400">kg CO2e / employee</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Corporate Benchmark: ~650 kg</span>
            <span className="text-emerald-400 font-bold">Optimal</span>
          </div>
        </div>

        {/* Metric 2: Per Area */}
        <div className="p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Facility Area Intensity
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Building className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-white">{perArea.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400">
              kg CO2e / {intensity.areaUnit || 'sq m'}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/10 text-xs text-slate-400 flex items-center justify-between">
            <span>LEED Gold Target: &lt; 2.5 kg</span>
            <span className="text-emerald-400 font-bold">Efficient</span>
          </div>
        </div>

        {/* Metric 3: Carbon Cost Index */}
        <div className="p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Carbon Abatement Ratio
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-emerald-300 font-mono">
              ${summary?.totalCO2eTonnes > 0 ? Math.round((summary?.totalCost || 0) / summary.totalCO2eTonnes) : 0}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ tonne CO2e</span>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Operational Expenditure</span>
            <span className="text-slate-300 font-medium">12-Mo Cumulative</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart: Emissions By Resource Over Time */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Monthly Emissions Profile by Resource Stream
            </h2>
            <p className="text-xs text-slate-400">
              Comparative stack showing electricity, heating gas, fleet combustion, water, and solid waste
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162e24" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1a15',
                  borderColor: '#10b981',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
                formatter={(val, name) => [`${val.toLocaleString()} kg CO2e`, name]}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
              <Bar dataKey="Electricity" stackId="a" fill="#10b981" />
              <Bar dataKey="Natural Gas" stackId="a" fill="#38bdf8" />
              <Bar dataKey="Fuel" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Waste" stackId="a" fill="#ec4899" />
              <Bar dataKey="Water" stackId="a" fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost vs Carbon Correlation Dual Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-white">
            Resource Cost ($) vs Carbon Footprint (kg CO2e) Correlation
          </h2>
          <p className="text-xs text-slate-400">
            Identify seasonal divergences where cost-saving opportunities exist
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162e24" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1a15',
                  borderColor: '#10b981',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalCO2e"
                name="Carbon (kg CO2e)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="CostUSD"
                name="Utility Cost ($ USD)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
