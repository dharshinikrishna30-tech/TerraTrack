import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { AnimatedCounter } from '../animations/AnimatedCounter';

export const StatCard = ({
  title,
  value,
  decimals = 0,
  unit = '',
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  subtext,
  gradient = 'from-emerald-500/20 to-teal-500/5',
  borderColor = 'border-emerald-500/20',
  iconColor = 'text-emerald-400',
  isReductionGood = true,
}) => {
  const isPositive = trend > 0;
  const isZero = trend === 0 || trend === undefined || trend === null;
  const isGood = isReductionGood ? !isPositive : isPositive;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative p-5 rounded-2xl bg-[#0d1c17] border ${borderColor} shadow-lg shadow-black/20 overflow-hidden transition-all duration-300 hover:border-emerald-500/40`}
    >
      {/* Background ambient glow */}
      <div
        className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter value={value} decimals={decimals} />
            </span>
            {unit && <span className="text-xs sm:text-sm font-semibold text-emerald-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>

      {/* Trend or Subtext */}
      <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs">
        {trend !== undefined && trend !== null ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                isZero
                  ? 'bg-slate-800 text-slate-400'
                  : isGood
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isZero ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositive ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-slate-400 text-[11px]">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">{subtext || 'Monitored standard'}</span>
        )}

        {subtext && trend !== undefined && (
          <span className="text-slate-500 text-[10px] truncate max-w-[130px]">{subtext}</span>
        )}
      </div>
    </motion.div>
  );
};
