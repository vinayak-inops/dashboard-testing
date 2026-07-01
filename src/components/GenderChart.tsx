import { WorkforceGender } from '../lib/supabase';

interface GenderChartProps { data: WorkforceGender[]; total?: number; }

const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981'];
const BG_STYLES = [
  { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' },
  { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
];
const TEXT_STYLES = [
  { color: '#1D4ED8' }, { color: '#BE185D' }, { color: '#B45309' }, { color: '#059669' },
];

export default function GenderChart({ data, total: totalProp }: GenderChartProps) {
  if (!data.length) return null;

  const countSum = data.reduce((s, d) => s + d.count, 0);
  const total = totalProp ?? countSum;
  const cx = 44, cy = 44, r = 36, inner = 22, gap = 0.018;

  let cumAngle = -Math.PI / 2;
  const slices = data
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => d.count > 0)
    .map(({ d, i }) => {
      const angle = (d.count / countSum) * 2 * Math.PI - gap;
      const start = cumAngle + gap / 2;
      const end = start + angle;
      cumAngle += (d.count / countSum) * 2 * Math.PI;
      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
      return {
        path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`,
        color: COLORS[i],
      };
    });

  return (
    <div className="chart-container">
      <div className="mb-2">
        <h3 className="chart-title">Workforce by Gender</h3>
        <p className="chart-subtitle">Total active workforce distribution</p>
      </div>

      {/* Donut centred */}
      <div className="flex justify-center mb-2">
        <svg width={88} height={88} viewBox="0 0 88 88">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-75" />
          ))}
          <circle cx={cx} cy={cy} r={inner} fill="white" />
          <text x={cx} y={cy - 3} textAnchor="middle" fontSize="12" fontWeight="700" fill="#111827" fontFamily="system-ui">
            {total.toLocaleString()}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="system-ui">Total</text>
        </svg>
      </div>

      {/* Legend rows */}
      <div className="flex flex-col gap-1">
        {data.map((d, i) => (
          <div key={d.id} className="rounded-lg border px-2.5 py-1" style={BG_STYLES[i]}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-semibold" style={{ color: '#374151' }}>{d.gender}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <span className="text-xs font-bold tabular-nums" style={TEXT_STYLES[i]}>{d.pct}%</span>
                <span className="text-[10px] tabular-nums" style={{ color: '#9CA3AF' }}>{d.count.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: COLORS[i] }} />
            </div>
          </div>
        ))}
      </div>

      {/* Proportional bar */}
      <div className="mt-2">
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
          {data.map((d, i) => (
            <div key={d.id} className="transition-all duration-700 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${d.pct}%`, backgroundColor: COLORS[i] }} title={`${d.gender}: ${d.pct}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
