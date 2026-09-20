import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingDown,
  DollarSign,
  Zap,
  Leaf,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  Building,
} from 'lucide-react';
import { advisorService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const AIAdvisor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [provider, setProvider] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePlan, setActivePlan] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});

  const fetchRecommendations = async () => {
    try {
      const res = await advisorService.getRecommendations();
      setRecommendations(res.data.data?.recommendations || []);
      setSummary(res.data.data?.summary || {});
      setProvider(res.data.data?.provider || 'GHG Protocol Engine');
    } catch (err) {
      toast('Failed to generate AI recommendations', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
    toast('Scanning resource trends and recalibrating AI recommendations...', 'info');
  };

  const toggleStep = (recId, stepIndex) => {
    const key = `${recId}-${stepIndex}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const categories = [
    'all',
    ...new Set(recommendations.map((r) => r.category).filter(Boolean)),
  ];

  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  // Calculate cumulative potential impact
  const totalCarbonSavings = recommendations.reduce(
    (acc, r) => acc + (r.estimatedCO2eSavedKg || 0),
    0
  );
  const totalDollarSavings = recommendations.reduce(
    (acc, r) => acc + (r.estimatedCostSavedUSD || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {provider}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Sustainability Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-backed engineering and operational decarbonization measures tailored to your consumption
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Analyzing Footprint...' : 'Regenerate Insights'}</span>
        </button>
      </div>

      {/* Cumulative Potential Impact Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e271c] to-[#0a1813] border border-emerald-500/25 shadow-xl">
          <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Potential Carbon Abatement
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            {Math.round(totalCarbonSavings).toLocaleString()}{' '}
            <span className="text-xs font-bold text-emerald-400">kg CO2e / yr</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            ≈ {Math.round((totalCarbonSavings / 1000) * 10) / 10} metric tonnes per year
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e271c] to-[#0a1813] border border-emerald-500/25 shadow-xl">
          <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            Estimated Annual Cost Savings
          </p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
            ${Math.round(totalDollarSavings).toLocaleString()}{' '}
            <span className="text-xs font-bold text-slate-400">USD / yr</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Direct utility reduction</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e271c] to-[#0a1813] border border-emerald-500/25 shadow-xl">
          <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
            High Priority Actions
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            {recommendations.filter((r) => r.priority === 'High').length}{' '}
            <span className="text-xs font-bold text-amber-400">Immediate</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">High ROI & fast implementation</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-500/10 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-emerald-500/10'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filteredRecs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c1914] border border-emerald-500/15 text-slate-400 text-xs">
          <Sparkles className="w-10 h-10 mx-auto text-emerald-500/30 mb-3" />
          <p className="font-bold text-slate-200">No recommendations under this category.</p>
          <p className="text-slate-500 mt-1">Select "All" to view full portfolio insights.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRecs.map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ y: -2 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#0c1914] border border-emerald-500/20 shadow-xl transition-all hover:border-emerald-500/40"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {rec.category}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        rec.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : rec.priority === 'Medium'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>

                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Difficulty: {rec.difficulty}
                    </span>

                    {rec.paybackPeriod && (
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 ml-auto lg:ml-0">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        Payback: {rec.paybackPeriod}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{rec.title}</h3>

                  {/* Observation */}
                  <div className="p-3.5 rounded-2xl bg-[#091510] border border-emerald-500/10 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-400">Diagnostic Finding: </span>
                    {rec.observation}
                  </div>

                  {/* Recommendation */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Recommended Measure: </span>
                    {rec.recommendation}
                  </p>
                </div>

                {/* Savings & Action Button */}
                <div className="lg:w-64 p-5 rounded-2xl bg-[#091510] border border-emerald-500/15 flex flex-col justify-between shrink-0 space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Projected Impact
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white font-mono">
                        ~{rec.estimatedCO2eSavedKg?.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">kg CO2e / yr</span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-lg font-black text-emerald-300 font-mono">
                        ${rec.estimatedCostSavedUSD?.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400">annual savings</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePlan(rec)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Execute Action Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Plan Drawer Modal */}
      <AnimatePresence>
        {activePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setActivePlan(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/25 shadow-2xl z-10 text-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
                    Implementation Checklist
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1">{activePlan.title}</h3>
                </div>
                <button
                  onClick={() => setActivePlan(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">{activePlan.recommendation}</p>

                <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-[11px]">Carbon Abatement</p>
                    <p className="text-sm font-bold text-emerald-300">
                      ~{activePlan.estimatedCO2eSavedKg?.toLocaleString()} kg CO2e
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Cost Savings</p>
                    <p className="text-sm font-bold text-white">
                      ${activePlan.estimatedCostSavedUSD?.toLocaleString()} / yr
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Payback Period</p>
                    <p className="text-sm font-bold text-slate-300">{activePlan.paybackPeriod}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                    Step-by-Step Execution Sequence
                  </h4>
                  <div className="space-y-2.5">
                    {(activePlan.actionSteps || [
                      'Assess preliminary facility baseline',
                      'Engage mechanical equipment contractor',
                      'Verify post-implementation utility reduction',
                    ]).map((step, idx) => {
                      const isDone = completedSteps[`${activePlan.id}-${idx}`];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(activePlan.id, idx)}
                          className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300 line-through'
                              : 'bg-[#12241d] border-emerald-500/15 text-white hover:border-emerald-500/30'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Tracked under {activePlan.category}
                </span>
                <button
                  onClick={() => {
                    toast('Action plan progress saved to organizational log', 'success');
                    setActivePlan(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Progress & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
