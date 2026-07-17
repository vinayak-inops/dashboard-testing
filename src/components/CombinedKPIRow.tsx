import { UserCheck, UserX, UserPlus, LogOut, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { WorkforceMetrics, EmployeeFilter } from '../lib/supabase';
import FormulaTooltip from './FormulaTooltip';

interface Props {
  metrics: WorkforceMetrics;
  onAction?: (filter: EmployeeFilter) => void;
}

interface HalfCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: number;
  title: string;
  subtitle: string;
  format?: 'number' | 'percent';
  formula?: string;
  filter?: EmployeeFilter;
  onAction?: (filter: EmployeeFilter) => void;
  noBorder?: boolean;
}

function HalfCard({ icon, iconBg, iconColor, value, title, subtitle, format = 'number', formula, filter, onAction, noBorder }: HalfCardProps) {
  const display = format === 'percent' ? `${value}%` : value.toLocaleString();
  return (
    <div
      className="flex-1 p-3"
      style={noBorder ? undefined : { borderRight: '1px solid #F1F5F9' }}
    >
      <div
        className="kpi-icon mb-1"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <p className="kpi-value">{display}</p>
      {formula ? (
        <FormulaTooltip formula={formula}>
          <p className="kpi-title underline decoration-dotted decoration-gray-300 underline-offset-2">{title}</p>
        </FormulaTooltip>
      ) : (
        <p className="kpi-title">{title}</p>
      )}
      <p className="kpi-subtitle">{subtitle}</p>
      {onAction && filter && (
        <button
          onClick={() => onAction(filter)}
          className="mt-2 flex items-center gap-1 text-[10px] font-semibold transition-colors"
          style={{ color: '#3B82F6' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1D4ED8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3B82F6')}
        >
          View employees
          <ArrowRight size={10} />
        </button>
      )}
    </div>
  );
}

export default function CombinedKPIRow({ metrics, onAction }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
      {/* Active + Inactive */}
      <div
        className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#22C55E' }} />
        <div className="flex pt-1">
          <HalfCard
            icon={<UserCheck size={14} strokeWidth={1.75} />}
            iconBg="#DCFCE7" iconColor="#15803D"
            value={metrics.active_workforce}
            title="Active Workforce"
            subtitle="Currently active"
            filter="active"
            onAction={onAction}
          />
          <HalfCard
            icon={<UserX size={14} strokeWidth={1.75} />}
            iconBg="#FEF9C3" iconColor="#A16207"
            value={metrics.inactive_workforce}
            title="Inactive Workforce"
            subtitle="On leave / inactive"
            filter="inactive"
            onAction={onAction}
            noBorder
          />
        </div>
      </div>

      {/* New + Exited MTD */}
      <div
        className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#3B82F6' }} />
        <div className="flex pt-1">
          <HalfCard
            icon={<UserPlus size={14} strokeWidth={1.75} />}
            iconBg="#DCFCE7" iconColor="#15803D"
            value={metrics.new_workers_mtd}
            title="New Workers (MTD)"
            subtitle="Added this month"
            filter="new_mtd"
            onAction={onAction}
          />
          <HalfCard
            icon={<LogOut size={14} strokeWidth={1.75} />}
            iconBg="#FEE2E2" iconColor="#DC2626"
            value={metrics.exited_workers_mtd}
            title="Exited Workers (MTD)"
            subtitle="Left this month"
            filter="exited_mtd"
            onAction={onAction}
            noBorder
          />
        </div>
      </div>

      {/* Workforce Growth + Utilization */}
      <div
        className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#06B6D4' }} />
        <div className="flex pt-1">
          <HalfCard
            icon={<TrendingUp size={14} strokeWidth={1.75} />}
            iconBg="#DCFCE7" iconColor="#15803D"
            value={metrics.workforce_growth_pct}
            title="Workforce Growth"
            subtitle="Month-over-month"
            format="percent"
            formula={`Growth % = ((Active Workforce − Previous Active) ÷ Previous Active) × 100  →  = ${metrics.workforce_growth_pct}%`}
          />
          <HalfCard
            icon={<Activity size={14} strokeWidth={1.75} />}
            iconBg="#CFFAFE" iconColor="#0E7490"
            value={metrics.workforce_utilization_pct}
            title="Utilization Rate"
            subtitle="Capacity utilization"
            format="percent"
            formula={`Utilization % = (Present Today ÷ Active Workforce) × 100  →  (${metrics.present_today} ÷ ${metrics.active_workforce}) × 100 = ${metrics.workforce_utilization_pct}%`}
            noBorder
          />
        </div>
      </div>
    </div>
  );
}
