import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Calendar,
  Sparkles,
  X,
  TrendingDown,
  Award,
} from 'lucide-react';
import { goalService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const Goals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Goal Form State
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState('electricity');
  const [baselineValue, setBaselineValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('energy_efficiency');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      const res = await goalService.getGoals();
      setGoals(res.data.goals || []);
    } catch (err) {
      toast('Failed to load sustainability goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#06b6d4'],
    });
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title || !baselineValue || !targetValue || !targetDate) {
      toast('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const baseNum = parseFloat(baselineValue);
      const targetNum = parseFloat(targetValue);
      const reductionPercent = Math.round(((baseNum - targetNum) / baseNum) * 100);

      const res = await goalService.createGoal({
        title,
        resourceType,
        baselineValue: baseNum,
        targetValue: targetNum,
        targetReductionPercent: reductionPercent,
        targetDate,
        category,
        notes,
      });

      toast('Target goal established successfully!', 'success');
      setGoals((prev) => [...prev, res.data.goal]);
      setShowAddModal(false);
      setTitle('');
      setBaselineValue('');
      setTargetValue('');
      setNotes('');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create goal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to remove this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      toast('Goal removed', 'success');
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      toast('Failed to delete goal', 'error');
    }
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === 'all') return true;
    return g.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Sustainability Goals & Science-Based Targets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Establish baseline emissions, track reduction pacing, and celebrate net-zero milestones
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Establish New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
        {['all', 'in_progress', 'achieved', 'at_risk'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === status
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-emerald-500/10'
            }`}
          >
            {status.replace('_', ' ')} (
            {goals.filter((g) => (status === 'all' ? true : g.status === status)).length}
            )
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : filteredGoals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c1914] border border-emerald-500/15 text-slate-400 text-xs">
          <Target className="w-10 h-10 mx-auto text-emerald-500/30 mb-3" />
          <p className="font-bold text-slate-200">No goals found under this filter.</p>
          <p className="text-slate-500 mt-1">
            Create a science-based target to begin tracking milestone progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const baseline = goal.baselineValue || 1;
            const target = goal.targetValue || 0;
            const current = goal.currentValue !== undefined ? goal.currentValue : baseline;

            const totalReductionNeeded = Math.max(baseline - target, 1);
            const actualReduction = Math.max(baseline - current, 0);
            const progressPercent = Math.min(
              Math.max(Math.round((actualReduction / totalReductionNeeded) * 100), 0),
              100
            );

            const daysLeft = Math.max(
              Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
              0
            );

            const isAchieved = goal.status === 'achieved' || progressPercent >= 100;
            const isAtRisk = goal.status === 'at_risk';

            return (
              <motion.div
                key={goal._id}
                whileHover={{ y: -3 }}
                className={`p-6 rounded-3xl bg-[#0c1914] border shadow-xl flex flex-col justify-between transition-all ${
                  isAchieved
                    ? 'border-emerald-400/50 bg-gradient-to-b from-[#0e271c] to-[#0a1813]'
                    : isAtRisk
                    ? 'border-amber-500/30'
                    : 'border-emerald-500/15'
                }`}
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {goal.category?.replace('_', ' ')}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isAchieved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isAtRisk
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isAchieved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Achieved
                        </>
                      ) : isAtRisk ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> At Risk
                        </>
                      ) : (
                        'In Progress'
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {goal.title}
                  </h3>

                  {goal.notes && (
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {goal.notes}
                    </p>
                  )}

                  {/* Progress Bar & Percentage */}
                  <div className="space-y-1.5 my-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Trajectory Progress</span>
                      <span className="font-extrabold text-emerald-300 font-mono">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#152e24] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          isAchieved
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                            : isAtRisk
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Baseline vs Current vs Target Pills */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#091510] border border-emerald-500/10 text-center text-[11px] mb-4">
                    <div>
                      <p className="text-slate-500">Baseline</p>
                      <p className="font-bold text-slate-300 font-mono mt-0.5">
                        {Math.round(baseline)} kg
                      </p>
                    </div>
                    <div className="border-x border-emerald-500/10 px-1">
                      <p className="text-slate-500">Current</p>
                      <p className="font-bold text-emerald-400 font-mono mt-0.5">
                        {Math.round(current)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Target</p>
                      <p className="font-bold text-white font-mono mt-0.5">
                        {Math.round(target)} kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Dates & Actions */}
                <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Target date reached'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAchieved && (
                      <button
                        onClick={triggerCelebration}
                        className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        title="Celebrate Achievement"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete goal"
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

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/25 shadow-2xl z-10 text-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
                <div className="flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Establish Decarbonization Target</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Goal Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cut Grid Electricity by 20% by Q4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Target Resource</label>
                    <select
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
                    >
                      <option value="electricity">Electricity</option>
                      <option value="natural_gas">Natural Gas</option>
                      <option value="fuel_diesel">Diesel Fuel</option>
                      <option value="fuel_petrol">Petrol Fuel</option>
                      <option value="waste_landfill">Landfill Waste</option>
                      <option value="all">Total Carbon (All Resources)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Target Date *</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Baseline Emissions (kg CO2e) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 1500"
                      value={baselineValue}
                      onChange={(e) => setBaselineValue(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Target Emissions (kg CO2e) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 1200"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Strategy Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Key operational interventions or retrofit details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/15">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Saving Goal...' : 'Establish Target'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
