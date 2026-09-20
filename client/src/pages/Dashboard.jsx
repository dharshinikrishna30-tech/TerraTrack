import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Zap,
  Fuel,
  Flame,
  Droplets,
  Trash2,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Target,
  AlertCircle,
  Plus,
  RefreshCw,
  Users,
  Building2,
  Calendar,
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { resourceService, goalService, advisorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SCOPE_COLORS = {
  'Scope 1': '#f59e0b', // Amber
  'Scope 2': '#10b981', // Emerald
  'Scope 3': '#06b6d4', // Cyan
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { refreshTrigger, onOpenQuickLog } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [topRecommendation, setTopRecommendation] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, logsRes, goalsRes, advisorRes] = await Promise.all([
        resourceService.getSummary(),
        resourceService.getLogs({ limit: 5 }),
        goalService.getGoals(),
        advisorService.getRecommendations(),
      ]);

      setSummary(summaryRes.data.summary);
      setRecentLogs(logsRes.data.logs || []);
      setGoals(goalsRes.data.goals || []);
      const recs = advisorRes.data.data?.recommendations || [];
      setTopRecommendation(recs[0] || null);
    } catch (err) {
      toast('Failed to update dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="stat" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="chart" className="lg:col-span-2" />
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  // Prepare 12-Month Area Chart Data
  const monthlyData = Object.values(summary?.byMonth || {}).map((m) => ({
    month: m.month,
    totalCO2e: Math.round(m.totalCO2e),
    scope1: Math.round(m.scope1),
    scope2: Math.round(m.scope2),
    scope3: Math.round(m.scope3),
  }));

  // Prepare Scope Donut Data
  const scopeData = [
    { name: 'Scope 1 (Direct)', value: summary?.scope1Kg || 0, color: SCOPE_COLORS['Scope 1'] },
    { name: 'Scope 2 (Electricity)', value: summary?.scope2Kg || 0, color: SCOPE_COLORS['Scope 2'] },
    { name: 'Scope 3 (Supply/Waste)', value: summary?.scope3Kg || 0, color: SCOPE_COLORS['Scope 3'] },
  ].filter((item) => item.value > 0);

  // Top emitting resource calculation
  const byResource = summary?.byResource || {};
  const totalKg = summary?.totalCO2eKg || 1;
  const resourceEntries = Object.entries(byResource).map(([key, val]) => ({
    key,
    name: key.replace('_', ' ').toUpperCase(),
    co2eKg: Math.round(val.co2eKg),
    percentage: Math.round((val.co2eKg / totalKg) * 100),
  })).sort((a, b) => b.co2eKg - a.co2eKg);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Executive Sustainability Dashboard
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Audited
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time carbon accounting and Scope 1-3 decarbonization intelligence for {user?.organization || 'Enterprise'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-800 bg-[#0f1e18] hover:bg-[#152921] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Consumption</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Carbon Footprint"
          value={summary?.totalCO2eTonnes || 0}
          decimals={1}
          unit="t CO2e"
          icon={Zap}
          trend={summary?.momChangePercent || 0}
          trendLabel="vs prior month"
          subtext={`≈ ${Math.round(summary?.totalCO2eKg || 0).toLocaleString()} kg CO2e`}
          isReductionGood={true}
        />

        <StatCard
          title="Scope 2 Electricity Share"
          value={totalKg > 0 ? Math.round(((summary?.scope2Kg || 0) / totalKg) * 100) : 0}
          decimals={0}
          unit="%"
          icon={Zap}
          subtext={`${Math.round((summary?.scope2Kg || 0) / 1000)} tonnes purchased`}
          iconColor="text-emerald-400"
          gradient="from-emerald-500/20 to-teal-500/5"
        />

        <StatCard
          title="Carbon Intensity"
          value={summary?.intensity?.perEmployee || 0}
          decimals={1}
          unit="kg / employee"
          icon={Users}
          subtext={`${user?.headcount || 50} employees registered`}
          iconColor="text-teal-400"
          gradient="from-teal-500/20 to-cyan-500/5"
        />

        <StatCard
          title="Active ESG Goals"
          value={goals.length}
          decimals={0}
          unit="targets"
          icon={Target}
          subtext={`${goals.filter((g) => g.status === 'achieved').length} goals achieved`}
          iconColor="text-amber-400"
          gradient="from-amber-500/20 to-emerald-500/5"
        />
      </div>

      {/* Main Charts: 12-Month Area Chart + Scope Breakdown Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12-Month Carbon Trend Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Historical Carbon Emission Trajectory
              </h2>
              <p className="text-xs text-slate-400">
                Monthly GHG footprint broken down by Scope 1, Scope 2, and Scope 3 (kg CO2e)
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Scope 1
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Scope 2
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Scope 3
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scope1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scope3Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#183126" vertical={false} />
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
                <Area
                  type="monotone"
                  dataKey="scope2"
                  name="Scope 2 (Electricity)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scope2Grad)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="scope1"
                  name="Scope 1 (Direct Fuel/Gas)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scope1Grad)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="scope3"
                  name="Scope 3 (Water/Waste)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scope3Grad)"
                  stackId="1"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scope Donut Distribution Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">GHG Scope Distribution</h2>
            <p className="text-xs text-slate-400">Total emission proportion by reporting scope</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scopeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scopeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1a15',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${Math.round(val).toLocaleString()} kg CO2e`, 'Emissions']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white">
                {summary?.totalCO2eTonnes || 0}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Tonnes</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-emerald-500/10 text-xs">
            {scopeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">
                  {Math.round((item.value / totalKg) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Advisor Insight Callout Banner */}
      {topRecommendation && (
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0d2a1f] via-[#103326] to-[#0c221a] border border-emerald-500/30 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    AI Advisor Priority Action
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {topRecommendation.priority} Priority
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {topRecommendation.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {topRecommendation.observation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-emerald-300">
                  Save ~{topRecommendation.estimatedCO2eSavedKg?.toLocaleString()} kg CO2e
                </p>
                <p className="text-[11px] text-slate-400">
                  Est. ${topRecommendation.estimatedCostSavedUSD?.toLocaleString()} / yr
                </p>
              </div>
              <Link
                to="/app/ai-advisor"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>View Action Steps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Resource Breakdown Progress + Recent Activity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Consumption Drivers */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
          <h2 className="text-base font-bold text-white mb-1">Top Emission Drivers</h2>
          <p className="text-xs text-slate-400 mb-5">Ranked by carbon footprint contribution</p>

          <div className="space-y-4">
            {resourceEntries.map((res) => (
              <div key={res.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{res.name}</span>
                  <span className="text-slate-400 font-mono">
                    {res.co2eKg.toLocaleString()} kg ({res.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[#152e24] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${res.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/app/resources"
            className="mt-6 block text-center py-2.5 rounded-xl border border-emerald-500/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          >
            Explore Detailed Resource Ledger →
          </Link>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Recent Resource Logs</h2>
                <p className="text-xs text-slate-400">Latest measured consumption entries</p>
              </div>
              <Link
                to="/app/resources"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                View All Logs
              </Link>
            </div>

            <div className="divide-y divide-emerald-500/10">
              {recentLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No logs recorded yet. Click "Log Consumption" to record your first resource entry!
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                        {log.resourceType === 'electricity' ? (
                          <Zap className="w-4 h-4" />
                        ) : log.resourceType.startsWith('fuel') ? (
                          <Fuel className="w-4 h-4" />
                        ) : log.resourceType === 'natural_gas' ? (
                          <Flame className="w-4 h-4" />
                        ) : log.resourceType === 'water' ? (
                          <Droplets className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200 capitalize">
                          {log.resourceType.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(log.periodStart).toLocaleDateString()} • {log.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-300 font-mono">
                        +{log.estimatedCO2e?.toLocaleString()} kg CO2e
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {log.quantity.toLocaleString()} {log.unit} • {log.scope}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs text-slate-400">
            <span>Audit trail active</span>
            <span className="text-emerald-400 font-medium">All formulas verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
