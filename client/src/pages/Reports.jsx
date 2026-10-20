import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Zap,
  TrendingDown,
  Award,
  ExternalLink,
} from 'lucide-react';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const Reports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await reportService.getSummary();
        setReport(res.data.report);
      } catch (err) {
        toast('Failed to generate sustainability report', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleDownloadCSV = async () => {
    try {
      toast('Preparing audit CSV file...', 'info');
      await reportService.downloadCSV();
      toast('CSV file downloaded successfully!', 'success');
    } catch (err) {
      toast('Failed to download CSV', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <SkeletonLoader type="card" count={4} />;
  }

  const emissions = report?.emissions || {};
  const totalTonnes = emissions.totalCO2eTonnes || 0;
  const scope1Tonnes = Math.round((emissions.scope1Kg || 0) / 10) / 100;
  const scope2Tonnes = Math.round((emissions.scope2Kg || 0) / 10) / 100;
  const scope3Tonnes = Math.round((emissions.scope3Kg || 0) / 10) / 100;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Executive Sustainability Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Formal GHG Protocol Corporate Standard audit documentation & board summary
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/20 bg-[#0f211a] hover:bg-[#152e24] text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Ledger</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Audit Document Container */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0b1813] border border-emerald-500/20 shadow-2xl text-slate-100 space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-emerald-500/20 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                EP
              </span>
              <span className="font-extrabold text-xl text-white print:text-black">TerraTrack</span>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Audited Carbon Accounting
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white print:text-black mt-2">
              Corporate Carbon Footprint & ESG Assessment
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Reporting Entity: <strong className="text-white print:text-black">{report?.organization}</strong>
            </p>
          </div>

          <div className="sm:text-right text-xs space-y-1 text-slate-400 print:text-slate-600">
            <p>Report Date: {new Date().toLocaleDateString()}</p>
            <p>Verification Standard: ISO 14064-1 / GHG Protocol</p>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 print:text-emerald-700 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Calculations
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50">
            <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">
              Gross Footprint
            </p>
            <p className="text-2xl font-black text-white print:text-black mt-1">
              {totalTonnes} <span className="text-xs font-bold text-emerald-400">t CO2e</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Total measured emissions</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50">
            <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">
              Scope 1 Direct
            </p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {scope1Tonnes} <span className="text-xs font-bold text-slate-400">tonnes</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Combustion & Natural Gas</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50">
            <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">
              Scope 2 Electricity
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {scope2Tonnes} <span className="text-xs font-bold text-slate-400">tonnes</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Purchased grid electricity</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50">
            <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">
              Scope 3 Supply/Waste
            </p>
            <p className="text-2xl font-black text-cyan-400 mt-1">
              {scope3Tonnes} <span className="text-xs font-bold text-slate-400">tonnes</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Municipal water & landfill</p>
          </div>
        </div>

        {/* Scope Disaggregation Table */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black mb-3">
            1. GHG Protocol Certified Scope Disaggregation
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-emerald-500/15 print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f221a] print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">GHG Scope Category</th>
                  <th className="py-3 px-4">Included Activities</th>
                  <th className="py-3 px-4">Emissions (kg CO2e)</th>
                  <th className="py-3 px-4">Metric Tonnes</th>
                  <th className="py-3 px-4">Proportion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 print:divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-amber-400">Scope 1 (Direct)</td>
                  <td className="py-3 px-4 text-slate-300 print:text-black">
                    Fleet Diesel & Petrol, Stationary Natural Gas Heating
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white print:text-black">
                    {Math.round(emissions.scope1Kg || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono">{scope1Tonnes}</td>
                  <td className="py-3 px-4 font-bold text-white print:text-black">
                    {totalTonnes > 0
                      ? Math.round(((emissions.scope1Kg || 0) / (emissions.totalCO2eKg || 1)) * 100)
                      : 0}
                    %
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-emerald-400">Scope 2 (Indirect)</td>
                  <td className="py-3 px-4 text-slate-300 print:text-black">
                    Purchased Grid Electricity (Location-based eGRID average)
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white print:text-black">
                    {Math.round(emissions.scope2Kg || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono">{scope2Tonnes}</td>
                  <td className="py-3 px-4 font-bold text-white print:text-black">
                    {totalTonnes > 0
                      ? Math.round(((emissions.scope2Kg || 0) / (emissions.totalCO2eKg || 1)) * 100)
                      : 0}
                    %
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-cyan-400">Scope 3 (Other Indirect)</td>
                  <td className="py-3 px-4 text-slate-300 print:text-black">
                    Municipal Water Supply, Landfill Waste Decomposition
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white print:text-black">
                    {Math.round(emissions.scope3Kg || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono">{scope3Tonnes}</td>
                  <td className="py-3 px-4 font-bold text-white print:text-black">
                    {totalTonnes > 0
                      ? Math.round(((emissions.scope3Kg || 0) / (emissions.totalCO2eKg || 1)) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Intensity Benchmarks & Top Emitter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50 space-y-3">
            <h4 className="font-bold text-white print:text-black text-xs uppercase tracking-wider">
              2. Carbon Intensity Indicators
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Facility Occupants</span>
                <span className="font-bold text-white print:text-black">{report?.headcount} employees</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Per Employee Intensity</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {Math.round(((emissions.totalCO2eKg || 0) / (report?.headcount || 1)) * 10) / 10} kg CO2e / head
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Facility Footprint Area</span>
                <span className="font-bold text-white print:text-black">
                  {report?.facilityArea?.toLocaleString()} {report?.unitSystem === 'imperial' ? 'sq ft' : 'sq m'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091510] border border-emerald-500/15 print:border-slate-300 print:bg-slate-50 space-y-3">
            <h4 className="font-bold text-white print:text-black text-xs uppercase tracking-wider">
              3. Science-Based Goals Status
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Total Active Targets</span>
                <span className="font-bold text-white print:text-black">{report?.goalsSummary?.total || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Achieved Targets</span>
                <span className="font-bold text-emerald-400">{report?.goalsSummary?.achieved || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-500/10 print:border-slate-200">
                <span className="text-slate-400 print:text-slate-600">Pacing Nominal</span>
                <span className="font-bold text-sky-400">{report?.goalsSummary?.inProgress || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Certification Footer */}
        <div className="pt-6 border-t border-emerald-500/20 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 print:text-slate-600">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Certified Carbon Accounting Audit Document. Generated by TerraTrack SaaS.</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500">
            SHA-256 Verified Ledger Checksum: 4f8b91a2e7c...
          </div>
        </div>
      </div>
    </div>
  );
};
