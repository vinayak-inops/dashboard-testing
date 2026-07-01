import { WorkforceAgeGroup } from '../lib/supabase';

interface AgeGroupChartProps { data: WorkforceAgeGroup[]; }

const BAR_COLORS = ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];

export default function AgeGroupChart({ data }: AgeGroupChartProps) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
  const maxCount = Math.max(...sorted.map(d => d.count));

  return (
    <div className="chart-container">
      <div className="mb-3">
        <h3 className="chart-title">Workforce by Age Group</h3>
        <p className="chart-subtitle">Headcount across age bands</p>
      </div>

      <div className="space-y-2">
        {sorted.map((d, i) => (
          <div key={d.id}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] w-16 flex-shrink-0" style={{ color: '#374151' }}>{d.age_group}</span>
              <div className="flex-1 mx-2 h-5 rounded overflow-hidden relative" style={{ backgroundColor: '#F3F4F6' }}>
                <div
                  className="h-full rounded-md transition-all duration-700 flex items-center"
                  style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: BAR_COLORS[i] ?? '#3B82F6' }}
                />
                <span
                  className="absolute inset-y-0 flex items-center text-[10px] font-semibold pl-2 pointer-events-none"
                  style={{ left: 0, opacity: (d.count / maxCount) > 0.25 ? 1 : 0, color: i >= 3 ? '#fff' : '#1D4ED8' }}
                >
                  {d.count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 w-14 justify-end flex-shrink-0">
                {(d.count / maxCount) <= 0.25 && (
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: '#374151' }}>{d.count.toLocaleString()}</span>
                )}
                <span className="text-[10px] tabular-nums" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #F3F4F6' }}>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: '#111827' }}>
            {sorted.filter(d => d.age_group === '25–34' || d.age_group === '35–44').reduce((s, d) => s + d.count, 0).toLocaleString()}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Peak (25–44)</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: '#111827' }}>
            {sorted.find(d => d.age_group === 'Under 25')?.count.toLocaleString() ?? 0}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Gen Z (&lt;25)</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: '#111827' }}>
            {sorted.filter(d => d.age_group === '55–64' || d.age_group === '65+').reduce((s, d) => s + d.count, 0).toLocaleString()}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>Senior (55+)</p>
        </div>
      </div>
    </div>
  );
}
