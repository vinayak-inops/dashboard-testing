import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { WorkforceGender, WorkforceAgeGroup, WorkforceExperienceBand } from '../lib/supabase';

interface ApiGender  { gender: string;    count: number; pct: number; }
interface ApiAge     { ageGroup: string;  count: number; pct: number; sortOrder: number; }
interface ApiExpBand { band: string;       count: number; pct: number; sortOrder: number; }

interface CompositionData {
  genderDistribution:     ApiGender[];
  ageDistribution:        ApiAge[];
  experienceDistribution: ApiExpBand[];
}

function toGender(d: ApiGender, i: number): WorkforceGender {
  return { id: String(i), snapshot_date: '', gender: d.gender, count: d.count, pct: d.pct, created_at: '' };
}
function toAge(d: ApiAge, i: number): WorkforceAgeGroup {
  return { id: String(i), snapshot_date: '', age_group: d.ageGroup, count: d.count, pct: d.pct, sort_order: d.sortOrder, created_at: '' };
}
function toExp(d: ApiExpBand, i: number): WorkforceExperienceBand {
  return { id: String(i), snapshot_date: '', band: d.band, count: d.count, pct: d.pct, sort_order: d.sortOrder, created_at: '' };
}

// ── Gender donut ──────────────────────────────────────────────────────────────
const GENDER_COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981'];

function GenderSection({ items }: { items: WorkforceGender[] }) {
  const total = items.reduce((s, d) => s + d.count, 0);
  if (!total) return null;

  const cx = 72, cy = 72, r = 58, gap = 0.018;
  let cumAngle = -Math.PI / 2;

  const slices = items
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => d.count > 0)
    .map(({ d, i }) => {
      const frac  = d.count / total;
      const angle = frac * 2 * Math.PI - gap;
      const start = cumAngle + gap / 2;
      const end   = start + angle;
      cumAngle   += frac * 2 * Math.PI;
      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
      return {
        path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`,
        color: GENDER_COLORS[i],
        item: d,
      };
    });

  return (
    <div className="chart-container">
      <div className="mb-4">
        <h3 className="chart-title">Workforce by Gender</h3>
        <p className="chart-subtitle">Total active workforce distribution</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width={144} height={144} viewBox="0 0 144 144">
            {slices.map((s, i) => (
              <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-80" />
            ))}
            <circle cx={cx} cy={cy} r={36} fill="white" />
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="#111827" fontFamily="system-ui">
              {total.toLocaleString()}
            </text>
            <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="system-ui">Total</text>
          </svg>
        </div>
        <div className="flex-1 space-y-2.5">
          {items.map((d, i) => (
            <div key={d.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GENDER_COLORS[i] }} />
                  <span className="text-xs leading-tight" style={{ color: '#374151' }}>{d.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tabular-nums" style={{ color: '#111827' }}>{d.count.toLocaleString()}</span>
                  <span className="text-[10px] w-8 text-right tabular-nums" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
                </div>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: GENDER_COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Age group bars ────────────────────────────────────────────────────────────
const AGE_COLORS = ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];

function AgeSection({ items }: { items: WorkforceAgeGroup[] }) {
  const sorted   = [...items].sort((a, b) => a.sort_order - b.sort_order);
  const maxCount = Math.max(...sorted.map(d => d.count));

  return (
    <div className="chart-container">
      <div className="mb-5">
        <h3 className="chart-title">Workforce by Age Group</h3>
        <p className="chart-subtitle">Headcount across age bands</p>
      </div>
      <div className="space-y-3">
        {sorted.map((d, i) => (
          <div key={d.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs w-20 flex-shrink-0" style={{ color: '#374151' }}>{d.age_group}</span>
              <div className="flex-1 mx-2 h-6 rounded-md overflow-hidden relative" style={{ backgroundColor: '#F3F4F6' }}>
                <div
                  className="h-full rounded-md transition-all duration-700"
                  style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: AGE_COLORS[i] ?? '#3B82F6' }}
                />
                {(d.count / maxCount) > 0.25 && (
                  <span className="absolute inset-y-0 left-2 flex items-center text-[10px] font-semibold pointer-events-none"
                    style={{ color: i >= 3 ? '#fff' : '#1D4ED8' }}>
                    {d.count.toLocaleString()}
                  </span>
                )}
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
      <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[
          { label: 'Gen Z (<25)', val: sorted.find(d => d.age_group === 'Under 25')?.count ?? 0 },
          { label: 'Peak (25–44)', val: sorted.filter(d => d.age_group === '25–34' || d.age_group === '35–44').reduce((s, d) => s + d.count, 0) },
          { label: 'Senior (55+)', val: sorted.filter(d => d.age_group === '55–64' || d.age_group === '65+').reduce((s, d) => s + d.count, 0) },
        ].map(g => (
          <div key={g.label} className="text-center">
            <p className="text-sm font-bold" style={{ color: '#111827' }}>{g.val.toLocaleString()}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{g.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Experience bands ──────────────────────────────────────────────────────────
const EXP_COLORS = ['#D1FAE5', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857'];

function ExperienceSection({ items }: { items: WorkforceExperienceBand[] }) {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
  const maxPct = Math.max(...sorted.map(d => d.pct));

  return (
    <div className="chart-container">
      <div className="mb-5">
        <h3 className="chart-title">Workforce by Experience</h3>
        <p className="chart-subtitle">Distribution across tenure bands</p>
      </div>
      <div className="flex h-4 rounded-lg overflow-hidden gap-0.5 mb-5">
        {sorted.map((d, i) => (
          <div
            key={d.id}
            className="transition-all duration-700 first:rounded-l-lg last:rounded-r-lg"
            style={{ width: `${d.pct}%`, backgroundColor: EXP_COLORS[i] }}
            title={`${d.band}: ${d.count.toLocaleString()} (${d.pct}%)`}
          />
        ))}
      </div>
      <div className="space-y-2.5">
        {sorted.map((d, i) => (
          <div key={d.id} className="flex items-center gap-2">
            <span className="text-[10px] w-16 flex-shrink-0 text-right leading-tight" style={{ color: '#6B7280' }}>{d.band}</span>
            <div className="flex-1 relative h-1.5 rounded-full overflow-visible" style={{ backgroundColor: '#F3F4F6' }}>
              <div
                className="absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${(d.pct / maxPct) * 100}%`, backgroundColor: EXP_COLORS[i] }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-700"
                style={{ left: `calc(${(d.pct / maxPct) * 100}% - 6px)`, backgroundColor: EXP_COLORS[i] }}
              />
            </div>
            <div className="flex items-center gap-1.5 w-20 justify-end flex-shrink-0">
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#111827' }}>{d.count.toLocaleString()}</span>
              <span className="text-[10px] tabular-nums" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 grid grid-cols-3 gap-2" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[
          { label: 'Early (<3 Yrs)', orders: [1, 2] },
          { label: 'Mid (3–10 Yrs)', orders: [3, 4] },
          { label: 'Senior (10+)',   orders: [5, 6] },
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

// ── Main ─────────────────────────────────────────────────────────────────────

export default function WorkforceDemographics() {
  const [data, setData] = useState<CompositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'workforce_composition', tenantCode: 'AAL' }),
    })
      .then(r => r.json())
      .then(res => {
        if (res?.data) {
          setData(res.data as CompositionData);
        } else {
          setError('No data returned from the API.');
        }
      })
      .catch(err => setError(String(err?.message ?? err ?? 'Network error')))
      .finally(() => setLoading(false));
  }, []);

  const activeGender = (data?.genderDistribution     ?? []).map(toGender);
  const activeAge    = (data?.ageDistribution         ?? []).filter(d => d.count > 0).map(toAge);
  const activeExp    = (data?.experienceDistribution  ?? []).filter(d => d.count > 0).map(toExp);
  const total        = activeGender.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#111827' }}>Workforce Demographics</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
            Composition by gender, age, and experience
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#DBEAFE' }}>
              <Users size={12} style={{ color: '#1D4ED8' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#1D4ED8' }}>
                {total.toLocaleString()} Total
              </span>
            </div>
          )}
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#BFDBFE', borderTopColor: '#3B82F6' }} />
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Loading demographics...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GenderSection     items={activeGender} />
          <AgeSection        items={activeAge}    />
          <ExperienceSection items={activeExp}    />
        </div>
      )}
    </div>
  );
}
