import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Sliders,
  Database,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { authService, settingsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [role, setRole] = useState(user?.role || 'sustainability_lead');
  const [unitSystem, setUnitSystem] = useState(user?.unitSystem || 'metric');
  const [facilityArea, setFacilityArea] = useState(user?.facilityArea || 15000);
  const [headcount, setHeadcount] = useState(user?.headcount || 50);

  const [factors, setFactors] = useState([]);
  const [customFactorInputs, setCustomFactorInputs] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingFactors, setSavingFactors] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactors = async () => {
      try {
        const res = await settingsService.getFactors();
        setFactors(res.data.factors || []);
        const initial = {};
        res.data.factors.forEach((f) => {
          initial[f.key] = f.activeFactor;
        });
        setCustomFactorInputs(initial);
      } catch (err) {
        toast('Failed to load emission factors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFactors();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile({
        name,
        organization,
        role,
        unitSystem,
        facilityArea: parseFloat(facilityArea),
        headcount: parseInt(headcount),
      });
      updateUser(res.data.user);
      toast('Organization settings updated successfully!', 'success');
    } catch (err) {
      toast('Failed to update organization profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveFactors = async (e) => {
    e.preventDefault();
    setSavingFactors(true);
    try {
      const numFactors = {};
      Object.entries(customFactorInputs).forEach(([k, v]) => {
        const parsed = parseFloat(v);
        if (!isNaN(parsed) && parsed >= 0) {
          numFactors[k] = parsed;
        }
      });

      await settingsService.updateFactors(numFactors);
      toast('Custom emission factors saved and active in calculations!', 'success');
    } catch (err) {
      toast('Failed to update emission factors', 'error');
    } finally {
      setSavingFactors(false);
    }
  };

  const handleSeedDemo = async () => {
    if (!window.confirm('This will seed 12 months of realistic multi-resource historical data, goals, and alerts. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const res = await settingsService.seedDemoData();
      toast(res.data.message || '12-Month sustainability baseline loaded!', 'success');
    } catch (err) {
      toast('Failed to seed demo data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Facility Settings & Carbon Factors
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure organizational parameters, custom regional grid emission factors, and demo datasets
        </p>
      </div>

      {/* Profile & Organization Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Facility & Organizational Profile
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">User Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organization / Campus Name</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 focus:border-emerald-400 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Unit Measurement System</label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              >
                <option value="metric">Metric (kWh, Liters, m³, kg)</option>
                <option value="imperial">Imperial (kWh, Gallons, therms, lb)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Facility Area ({unitSystem === 'imperial' ? 'sq ft' : 'sq m'})
              </label>
              <input
                type="number"
                value={facilityArea}
                onChange={(e) => setFacilityArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Facility Headcount</label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12241d] border border-emerald-500/20 text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Organization Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Emission Factor Customization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1914] border border-emerald-500/15 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Custom Regional Emission Factors
            </h2>
            <p className="text-xs text-slate-400">
              Override EPA standard coefficients to reflect your local regional grid or custom utility green tariffs
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveFactors} className="space-y-4">
          <div className="divide-y divide-emerald-500/10 border border-emerald-500/15 rounded-2xl overflow-hidden bg-[#091510]">
            {factors.map((f) => (
              <div key={f.key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{f.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-800 text-slate-300">
                      {f.scope}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{f.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-[11px]">kg CO2e per {f.unit}:</span>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={customFactorInputs[f.key] !== undefined ? customFactorInputs[f.key] : f.activeFactor}
                    onChange={(e) =>
                      setCustomFactorInputs({
                        ...customFactorInputs,
                        [f.key]: e.target.value,
                      })
                    }
                    className="w-24 px-2.5 py-1.5 rounded-lg bg-[#12241d] border border-emerald-500/20 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                const defaults = {};
                factors.forEach((f) => {
                  defaults[f.key] = f.defaultFactor;
                });
                setCustomFactorInputs(defaults);
                toast('Reset fields to standard EPA / GHG Protocol factors', 'info');
              }}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
            >
              Reset to EPA Defaults
            </button>

            <button
              type="submit"
              disabled={savingFactors}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {savingFactors ? 'Updating Factors...' : 'Apply Factor Overrides'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12241d] to-[#0a1712] border border-emerald-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Replenish Demo Dataset</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Instantly regenerates 12 months of realistic multi-resource consumption data (Electricity, Natural Gas, Diesel, Petrol, Water, Landfill, and Diverted Waste), plus target reduction goals and anomaly alerts.
            </p>
          </div>

          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding 12-Month History...' : 'Seed / Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
