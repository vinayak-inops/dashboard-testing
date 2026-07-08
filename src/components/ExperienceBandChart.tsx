import { WorkforceExperienceBand } from '../lib/supabase';

interface ExperienceBandChartProps { data: WorkforceExperienceBand[]; }

const PALETTE = ['#D1FAE5', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857'];

export default function ExperienceBandChart({ data }: ExperienceBandChartProps) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
  const maxPct = Math.max(...sorted.map(d => d.pct));

  return (
    <div className="chart-container">
      <div className="mb-3">
        <h3 className="chart-title">Workforce by Experience</h3>
        <p className="chart-subtitle">Distribution across tenure bands</p>
      </div>

      <div className="flex h-3 rounded-lg overflow-hidden gap-0.5 mb-3">
        {sorted.map((d, i) => (
          <div
            key={d.id}
            className="transition-all duration-700 first:rounded-l-lg last:rounded-r-lg"
            style={{ width: `${d.pct}%`, backgroundColor: PALETTE[i] }}
            title={`${d.band}: ${d.count.toLocaleString()} (${d.pct}%)`}
          />
        ))}
      </div>

      <div className="space-y-1.5 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
        {sorted.map((d, i) => (
          <div key={d.id} className="flex items-center gap-2">
            <span className="text-[10px] w-16 flex-shrink-0 text-right leading-tight" style={{ color: '#6B7280' }}>
              {d.band}
            </span>
            <div className="flex-1 relative h-1.5 rounded-full overflow-visible" style={{ backgroundColor: '#F3F4F6' }}>
              <div
                className="absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${(d.pct / maxPct) * 100}%`, backgroundColor: PALETTE[i] }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-700"
                style={{ left: `calc(${(d.pct / maxPct) * 100}% - 6px)`, backgroundColor: PALETTE[i] }}
              />
            </div>
            <div className="flex items-center gap-1.5 w-20 justify-end flex-shrink-0">
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#111827' }}>{d.count.toLocaleString()}</span>
              <span className="text-[10px] tabular-nums" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 grid grid-cols-3 gap-2" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[
          { label: 'Early (<3 Yrs)', orders: [1, 2] },
          { label: 'Mid (3–10 Yrs)', orders: [3, 4] },
          { label: 'Senior (10+)', orders: [5, 6] },
        ].map(g => (
          <div key={g.label} className="text-center">
            <p className="text-sm font-bold" style={{ color: '#111827' }}>
              {sorted.filter(d => g.orders.includes(d.sort_order)).reduce((s, d) => s + d.count, 0).toLocaleString()}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{g.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
