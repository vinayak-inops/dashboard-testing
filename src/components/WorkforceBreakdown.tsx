import { WorkforceMetrics } from '../lib/supabase';

interface WorkforceBreakdownProps { metrics: WorkforceMetrics; }

export default function WorkforceBreakdown({ metrics }: WorkforceBreakdownProps) {
  const segments = [
    { label: 'Active Employees',     value: metrics.active_workforce,          hex: '#3B82F6', pct: Math.round((metrics.active_workforce / metrics.total_workforce) * 100) },
    { label: 'Inactive',             value: metrics.inactive_workforce,         hex: '#E5E7EB', pct: Math.round((metrics.inactive_workforce / metrics.total_workforce) * 100) },
    { label: 'Contract Workers',     value: metrics.total_contract_workers,     hex: '#F59E0B', pct: Math.round((metrics.total_contract_workers / metrics.total_workforce) * 100) },
    { label: 'Vendors / Contractors',value: metrics.total_vendors_contractors,  hex: '#10B981', pct: Math.round((metrics.total_vendors_contractors / metrics.total_workforce) * 100) },
  ];

  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className="chart-container">
      <div className="mb-5">
        <h3 className="chart-title">Workforce Composition</h3>
        <p className="chart-subtitle">Distribution across employment types</p>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
        {segments.map(s => (
          <div key={s.label}
            className="transition-all duration-700 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.hex }}
            title={`${s.label}: ${s.pct}%`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {segments.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.hex }} />
              <span className="text-sm" style={{ color: '#374151' }}>{s.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: '#111827' }}>{s.value.toLocaleString()}</span>
              <span className="text-xs w-9 text-right" style={{ color: '#9CA3AF' }}>{s.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
