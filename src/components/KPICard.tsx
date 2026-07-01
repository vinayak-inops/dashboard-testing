import { LucideIcon, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  format?: 'number' | 'percent' | 'raw';
  onAction?: () => void;
}

const variantStyles = {
  default: {
    iconStyle: { backgroundColor: '#F3F4F6', color: '#6B7280' },
    accentStyle: { backgroundColor: '#D1D5DB' },
  },
  success: {
    iconStyle: { backgroundColor: '#DCFCE7', color: '#15803D' },
    accentStyle: { backgroundColor: '#22C55E' },
  },
  warning: {
    iconStyle: { backgroundColor: '#FEF9C3', color: '#A16207' },
    accentStyle: { backgroundColor: '#F59E0B' },
  },
  danger: {
    iconStyle: { backgroundColor: '#FEE2E2', color: '#DC2626' },
    accentStyle: { backgroundColor: '#EF4444' },
  },
  info: {
    iconStyle: { backgroundColor: '#DBEAFE', color: '#1D4ED8' },
    accentStyle: { backgroundColor: '#3B82F6' },
  },
};

function formatValue(value: string | number, format: string): string {
  if (format === 'percent') return `${value}%`;
  if (format === 'number' && typeof value === 'number') return value.toLocaleString();
  return String(value);
}

export default function KPICard({
  title, value, subtitle, icon: Icon,
  trend, trendLabel, variant = 'default', format = 'number', onAction,
}: KPICardProps) {
  const styles = variantStyles[variant];
  const isPositiveTrend = trend !== undefined && trend > 0;
  const isNegativeTrend = trend !== undefined && trend < 0;

  return (
    <div className="kpi-card group">
      <div className="kpi-accent" style={styles.accentStyle} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="kpi-icon" style={styles.iconStyle}>
            <Icon size={14} strokeWidth={1.75} />
          </div>
          {trend !== undefined && (
            <div className={`trend-badge ${isPositiveTrend ? 'trend-up' : isNegativeTrend ? 'trend-down' : 'trend-neutral'}`}>
              {isPositiveTrend ? <TrendingUp size={11} /> : isNegativeTrend ? <TrendingDown size={11} /> : <Minus size={11} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="mt-1">
          <p className="kpi-value">{formatValue(value, format)}</p>
          <p className="kpi-title">{title}</p>
          {(subtitle || trendLabel) && (
            <p className="kpi-subtitle">{subtitle || trendLabel}</p>
          )}
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="mt-2 flex items-center gap-1 text-[10px] font-semibold transition-colors"
            style={{ color: '#3B82F6' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1D4ED8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3B82F6')}
          >
            View employees
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
