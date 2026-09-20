import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Zap,
  Fuel,
  Flame,
  Droplets,
  Trash2,
  Recycle,
  Plus,
  Search,
  Calendar,
  Filter,
  Download,
  Trash,
  HelpCircle,
  X,
  CheckCircle2,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react';
import { resourceService, reportService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const TABS = [
  { id: 'all', label: 'All Resources', icon: Layers },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'fuel_diesel', label: 'Diesel Fuel', icon: Fuel },
  { id: 'fuel_petrol', label: 'Petrol Fuel', icon: Fuel },
  { id: 'natural_gas', label: 'Natural Gas', icon: Flame },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'waste_landfill', label: 'Landfill Waste', icon: Trash2 },
  { id: 'waste_recycled', label: 'Recycled Waste', icon: Recycle },
];

export const Resources = () => {
  const { toast } = useToast();
  const { refreshTrigger, onOpenQuickLog } = useOutletContext();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFactorModal, setShowFactorModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLogs = async () => {
    try {
      const params = {};
      if (activeTab !== 'all') params.resourceType = activeTab;
      if (searchQuery) params.search = searchQuery;

      const res = await resourceService.getLogs(params);
      setLogs(res.data.logs || []);
    } catch (err) {
      toast('Failed to load resource ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab, searchQuery, refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource log?')) return;
    setDeletingId(id);
    try {
      await resourceService.deleteLog(id);
      toast('Resource log deleted', 'success');
      setLogs((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast('Failed to delete resource log', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast('Generating audit CSV export...', 'info');
      await reportService.downloadCSV();
      toast('CSV export downloaded successfully!', 'success');
    } catch (err) {
      toast('Failed to export CSV', 'error');
    }
  };

  // Calculate filtered totals
  const totalCO2e = logs.reduce((acc, l) => acc + (l.estimatedCO2e || 0), 0);
  const totalCost = logs.reduce((acc, l) => acc + (l.cost || 0), 0);
  const totalEntries = logs.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Resource Consumption Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Auditable activity logs across Electricity, Fuel, Natural Gas, Water, and Waste
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFactorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/20 bg-[#0f211a] hover:bg-[#152e24] text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Emission Factors</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-[#0e1c17] hover:bg-[#142821] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-emerald-500/10 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-500/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Selected Ledger Carbon
          </p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">
            {Math.round(totalCO2e).toLocaleString()}{' '}
            <span className="text-xs font-semibold text-emerald-400">kg CO2e</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            ({Math.round((totalCO2e / 1000) * 100) / 100} metric tonnes)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recorded Expenditure
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">
            ${Math.round(totalCost).toLocaleString()}{' '}
            <span className="text-xs font-semibold text-slate-400">USD</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct utility costs</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Activity Log Count
          </p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">
            {totalEntries}{' '}
            <span className="text-xs font-semibold text-slate-400">records</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Under selected filters</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0c1914] border border-emerald-500/15">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          placeholder="Filter logs by location, notes, or invoice number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-slate-600 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white mr-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" />
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Layers className="w-10 h-10 mx-auto text-emerald-500/30 mb-3" />
            <p className="font-semibold text-slate-200">No consumption logs match this filter.</p>
            <p className="text-slate-500 mt-1">
              Click "Add Entry" to record consumption for this category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0f221a] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-emerald-500/15">
                <tr>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Scope</th>
                  <th className="py-3.5 px-4">Calculated CO2e</th>
                  <th className="py-3.5 px-4">Cost</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                          {log.resourceType === 'electricity' ? (
                            <Zap className="w-3.5 h-3.5" />
                          ) : log.resourceType.startsWith('fuel') ? (
                            <Fuel className="w-3.5 h-3.5" />
                          ) : log.resourceType === 'natural_gas' ? (
                            <Flame className="w-3.5 h-3.5" />
                          ) : log.resourceType === 'water' ? (
                            <Droplets className="w-3.5 h-3.5" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white capitalize">
                            {log.resourceType.replace('_', ' ')}
                          </p>
                          {log.notes && (
                            <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
                              {log.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-200">
                      {log.quantity.toLocaleString()} {log.unit}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          log.scope === 'Scope 1'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : log.scope === 'Scope 2'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {log.scope}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-extrabold text-emerald-300 font-mono">
                        {log.estimatedCO2e?.toLocaleString()} kg
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {Math.round((log.estimatedCO2e / 1000) * 1000) / 1000} t CO2e
                      </p>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      ${(log.cost || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.periodStart).toLocaleDateString()} –{' '}
                      {new Date(log.periodEnd).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-slate-300">{log.location}</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(log._id)}
                        disabled={deletingId === log._id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete log"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emission Factors Reference Modal */}
      <AnimatePresence>
        {showFactorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setShowFactorModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl p-6 rounded-3xl bg-[#0c1914] border border-emerald-500/25 shadow-2xl z-10 text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white">GHG Standard Emission Factors</h3>
                </div>
                <button
                  onClick={() => setShowFactorModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-emerald-300">Electricity (Grid Average)</span>
                  <p className="text-slate-400 mt-0.5">0.385 kg CO2e per kWh (Scope 2)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-amber-300">Diesel Fuel</span>
                  <p className="text-slate-400 mt-0.5">2.68 kg CO2e per Liter (Scope 1 direct mobile combustion)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-amber-300">Motor Gasoline / Petrol</span>
                  <p className="text-slate-400 mt-0.5">2.31 kg CO2e per Liter (Scope 1 mobile combustion)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-amber-300">Natural Gas</span>
                  <p className="text-slate-400 mt-0.5">2.03 kg CO2e per m³ (Scope 1 stationary combustion)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-cyan-300">Water Supply</span>
                  <p className="text-slate-400 mt-0.5">0.344 kg CO2e per m³ (Scope 3 upstream treatment & pumping)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#11241d] border border-emerald-500/20">
                  <span className="font-bold text-cyan-300">Municipal Waste (Landfill)</span>
                  <p className="text-slate-400 mt-0.5">0.58 kg CO2e per kg (Scope 3 end-of-life anaerobic decomposition)</p>
                </div>
              </div>

              <div className="mt-5 text-right">
                <button
                  onClick={() => setShowFactorModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
