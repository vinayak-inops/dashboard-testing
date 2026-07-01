import { AlertCircle } from 'lucide-react';
import { WorkforceEmploymentClassification } from '../lib/supabase';

interface Props { data: WorkforceEmploymentClassification[]; error?: string | null; total?: number; }

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const BG_STYLES = [
  { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' },
];
const TEXT_STYLES = [
  { color: '#1D4ED8' }, { color: '#059669' }, { color: '#B45309' }, { color: '#DC2626' },
];

export default function EmploymentClassificationChart({ data, error, total: totalProp }: Props) {
  if (error) {
    return (
      <div className="chart-container flex flex-col">
        <div className="mb-2">
          <h3 className="chart-title">Employment Classification</h3>
          <p className="chart-subtitle">Workforce segmented by skill category</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={16} style={{ color: '#DC2626' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Unable to load data</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
  const countSum = sorted.reduce((s, d) => s + d.count, 0);
  const total = totalProp ?? countSum;
  const cx = 60, cy = 60, r = 48, inner = 28, gap = 0.02;
  let cumAngle = -Math.PI / 2;

  const slices = sorted.filter(d => d.count > 0).map((d, i) => {
    const sweep = (d.count / countSum) * 2 * Math.PI - gap;
    const start = cumAngle + gap / 2, end = start + sweep;
    cumAngle += (d.count / countSum) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`,
      color: COLORS[i], item: d,
    };
  });

  return (
    <div className="chart-container flex flex-col">
      <div className="mb-2">
        <h3 className="chart-title">Employment Classification</h3>
        <p className="chart-subtitle">Workforce segmented by skill category</p>
      </div>

      {/* Donut centred */}
      <div className="flex justify-center mb-2">
        <svg width={96} height={96} viewBox="0 0 120 120">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-75 cursor-default" />
          ))}
          <circle cx={cx} cy={cy} r={inner} fill="white" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827" fontFamily="system-ui">
            {total.toLocaleString()}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="system-ui">Total</text>
        </svg>
      </div>

      {/* Legend rows */}
      <div className="flex flex-col gap-1.5 flex-1">
        {sorted.map((d, i) => (
          <div key={d.id} className="rounded-lg border px-2.5 py-1.5" style={BG_STYLES[i]}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-semibold truncate" style={{ color: '#374151' }}>{d.classification}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <span className="text-xs font-semibold tabular-nums" style={{ color: '#374151' }}>{d.count.toLocaleString()}</span>
                <span className="text-sm font-bold tabular-nums" style={TEXT_STYLES[i]}>{d.pct}%</span>
              </div>
            </div>
            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: COLORS[i] }} />
            </div>
          </div>
        ))}
      </div>

      {/* Proportional bar */}
      <div className="mt-2">
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          {sorted.map((d, i) => (
            <div key={d.id} className="transition-all duration-700 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${d.pct}%`, backgroundColor: COLORS[i] }} title={`${d.classification}: ${d.pct}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
