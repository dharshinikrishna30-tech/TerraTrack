import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Fuel,
  Flame,
  Droplets,
  Trash2,
  Recycle,
  Calculator,
  ArrowRight,
  Info,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { resourceService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RESOURCE_TYPES = [
  { id: 'electricity', label: 'Electricity', icon: Zap, defaultUnit: 'kWh', units: ['kWh', 'MWh'], factor: 0.385, scope: 'Scope 2' },
  { id: 'fuel_diesel', label: 'Diesel Fuel', icon: Fuel, defaultUnit: 'L', units: ['L', 'gal'], factor: 2.68, scope: 'Scope 1' },
  { id: 'fuel_petrol', label: 'Gasoline / Petrol', icon: Fuel, defaultUnit: 'L', units: ['L', 'gal'], factor: 2.31, scope: 'Scope 1' },
  { id: 'natural_gas', label: 'Natural Gas', icon: Flame, defaultUnit: 'm3', units: ['m3', 'therm'], factor: 2.03, scope: 'Scope 1' },
  { id: 'water', label: 'Water Supply', icon: Droplets, defaultUnit: 'm3', units: ['m3', 'gal'], factor: 0.344, scope: 'Scope 3' },
  { id: 'waste_landfill', label: 'Landfill Waste', icon: Trash2, defaultUnit: 'kg', units: ['kg', 'ton', 'lb'], factor: 0.58, scope: 'Scope 3' },
  { id: 'waste_recycled', label: 'Recycled Waste', icon: Recycle, defaultUnit: 'kg', units: ['kg', 'ton', 'lb'], factor: 0.05, scope: 'Scope 3' },
];

export const QuickLogModal = ({ isOpen, onClose, onLogCreated, initialResourceType }) => {
  const { toast } = useToast();
  const [resourceType, setResourceType] = useState(initialResourceType || 'electricity');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('Main Facility');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default dates to current month start and today
  const [periodStart, setPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [periodEnd, setPeriodEnd] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const selectedDef = RESOURCE_TYPES.find((r) => r.id === resourceType) || RESOURCE_TYPES[0];

  useEffect(() => {
    if (initialResourceType) {
      setResourceType(initialResourceType);
      const def = RESOURCE_TYPES.find((r) => r.id === initialResourceType);
      if (def) setUnit(def.defaultUnit);
    }
  }, [initialResourceType]);

  const handleTypeChange = (newType) => {
    setResourceType(newType);
    const def = RESOURCE_TYPES.find((r) => r.id === newType);
    if (def) setUnit(def.defaultUnit);
  };

  // Real-time calculation preview
  const numQty = parseFloat(quantity) || 0;
  let normalizedQty = numQty;
  if (unit === 'MWh') normalizedQty = numQty * 1000;
  if (unit === 'gal') normalizedQty = numQty * 3.78541;
  if (unit === 'therm') normalizedQty = numQty * 2.83168;
  if (unit === 'lb') normalizedQty = numQty * 0.453592;
  if (unit === 'ton') normalizedQty = numQty * 1000;

  const estimatedCO2e = Math.round(normalizedQty * selectedDef.factor * 100) / 100;
  const estimatedTonnes = Math.round((estimatedCO2e / 1000) * 1000) / 1000;
  const equivalentTrees = Math.round(estimatedCO2e / 21); // ~21 kg CO2 absorbed per tree/year

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || numQty <= 0) {
      toast('Please enter a valid quantity greater than 0', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        resourceType,
        quantity: numQty,
        unit,
        cost: cost ? parseFloat(cost) : 0,
        periodStart,
        periodEnd,
        location,
        notes,
      };

      const res = await resourceService.createLog(payload);
      toast(`Logged ${numQty} ${unit} (${estimatedCO2e} kg CO2e) successfully!`, 'success');
      if (onLogCreated) onLogCreated(res.data.log);
      onClose();
      // Reset form
      setQuantity('');
      setCost('');
      setNotes('');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save resource log', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0c1814] border border-emerald-500/25 shadow-2xl p-6 sm:p-8 z-10 text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Log Resource Consumption</h3>
                <p className="text-xs text-slate-400">
                  Automatic GHG Scope 1-3 carbon footprint calculation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Resource Type Selector Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Resource
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RESOURCE_TYPES.map((res) => {
                  const Icon = res.icon;
                  const isSelected = resourceType === res.id;
                  return (
                    <button
                      type="button"
                      key={res.id}
                      onClick={() => handleTypeChange(res.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-md shadow-emerald-900/30'
                          : 'border-slate-800 bg-[#12221b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{res.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Unit Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Consumption Quantity *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 1500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white font-medium text-sm transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  {selectedDef.units.map((u) => (
                    <option key={u} value={u} className="bg-[#0c1814] text-white">
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Interactive GHG Calculation Card */}
            <motion.div
              layout
              className="p-4 rounded-2xl bg-gradient-to-br from-[#102a20] to-[#0c1e17] border border-emerald-500/30 shadow-inner"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Calculation
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    {selectedDef.scope}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Factor: {selectedDef.factor} kg CO2e / {selectedDef.defaultUnit}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {estimatedCO2e.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-emerald-400">kg CO2e</span>
                <span className="text-xs text-slate-400">
                  ({estimatedTonnes} metric tonnes)
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  Formula: {normalizedQty.toLocaleString()} {selectedDef.defaultUnit} × {selectedDef.factor}
                </div>
                {numQty > 0 && (
                  <div className="text-emerald-300 font-medium">
                    🌲 Absorbed by ~{equivalentTrees} trees / yr
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cost, Date, Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Billing Period Start
                </label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Billing Period End
                </label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Resource Cost (USD)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 245.50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Facility / Substation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Building B - Server Room"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notes & Invoice Reference
              </label>
              <textarea
                rows={2}
                placeholder="Optional utility invoice ID, meter serial, or operational notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#12221b] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs placeholder:text-slate-600 resize-none"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/15">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Recording Log...' : 'Confirm & Record Log'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
