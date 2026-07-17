import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, AlertCircle } from 'lucide-react';

interface MinuteRow { minute: number; lateCount: number; earlyCount: number; }
interface ApiData { distribution: MinuteRow[]; }

// ── Minute distribution chart ─────────────────────────────────────────────────

function MinuteDistributionChart({ data }: { data: MinuteRow[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const [mode, setMode] = useState<'late' | 'early'>('late');
  if (data.length === 0) {
    return <p className="text-[10px] text-center py-8" style={{ color: '#9CA3AF' }}>No data available</p>;
  }
  const allZero = data.every(d => (mode === 'late' ? d.lateCount : d.earlyCount) === 0);
  const W = 480, H = 120, PL = 36, PR = 8, PT = 10, PB = 22;
  const cW = W - PL - PR, cH = H - PT - PB;
  const vals = data.map(d => mode === 'late' ? d.lateCount : d.earlyCount);
  const maxY = Math.max(...vals, 1) * 1.15;
  const n = data.length;
  const barW = cW / n * 0.7;
  const px = (i: number) => PL + (i / (n - 1)) * cW;
  const py = (v: number) => PT + (1 - v / maxY) * cH;
  const col = mode === 'late' ? '#EF4444' : '#06B6D4';
  const colBg = mode === 'late' ? '#FCA5A5' : '#67E8F9';

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {(['late', 'early'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer transition-all"
            style={mode === m
              ? m === 'late' ? { backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' } : { backgroundColor: '#ECFEFF', color: '#0E7490', borderColor: '#A5F3FC' }
              : { backgroundColor: '#FFF', color: '#6B7280', borderColor: '#E5E7EB' }}>
            {m === 'late' ? 'Late Coming' : 'Early Leaving'}
          </button>
        ))}
      </div>
      {allZero && (
        <div className="flex flex-col items-center justify-center py-8 gap-1.5" style={{ background: '#F9FAFB', borderRadius: 8, border: '1px dashed #E5E7EB' }}>
          <span className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>No {mode === 'late' ? 'late coming' : 'early leaving'} data available</span>
          <span className="text-[10px]" style={{ color: '#D1D5DB' }}>All counts are zero for this period</span>
        </div>
      )}
      {!allZero && <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 280, height: H }} fontFamily="system-ui,sans-serif">
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PL} x2={W - PR} y1={PT + (1 - f) * cH} y2={PT + (1 - f) * cH} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        {[0.5, 1].map(f => (
          <text key={f} x={PL - 4} y={PT + (1 - f) * cH + 3} textAnchor="end" fontSize="8" fill="#9CA3AF">
            {Math.round(maxY * f / 1.15) >= 1000 ? `${(Math.round(maxY * f / 1.15) / 1000).toFixed(1)}k` : Math.round(maxY * f / 1.15)}
          </text>
        ))}
        {data.map((d, i) => {
          const val = mode === 'late' ? d.lateCount : d.earlyCount;
          const x = px(i) - barW / 2;
          const barH = Math.max((val / maxY) * cH, 1);
          const y = PT + cH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH}
                fill={hov === i ? col : colBg} rx="2"
                style={{ cursor: 'pointer', transition: 'fill 0.1s' }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
              <text x={px(i)} y={H - 4} textAnchor="middle" fontSize="8" fill={hov === i ? '#374151' : '#9CA3AF'}>{d.minute}m</text>
            </g>
          );
        })}
        <polyline
          points={data.map((d, i) => `${px(i)},${py(mode === 'late' ? d.lateCount : d.earlyCount)}`).join(' ')}
          fill="none" stroke={col} strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3,2" />
        {hov !== null && !allZero && (() => {
          const d = data[hov];
          const val = mode === 'late' ? d.lateCount : d.earlyCount;
          const tx = Math.min(Math.max(px(hov) - 36, PL), W - PR - 72);
          return (
            <g>
              <rect x={tx} y={PT} width="72" height="36" rx="4" fill="#1F2937" />
              <text x={tx + 36} y={PT + 12} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">≤{d.minute} min</text>
              <text x={tx + 36} y={PT + 24} textAnchor="middle" fontSize="8" fill={mode === 'late' ? '#FCA5A5' : '#67E8F9'}>{val.toLocaleString()} employees</text>
              <text x={tx + 36} y={PT + 34} textAnchor="middle" fontSize="7" fill="#9CA3AF">{mode === 'late' ? 'late by' : 'left early by'} ≤{d.minute}m</text>
            </g>
          );
        })()}
      </svg>}
      {!allZero && <p className="text-[9px] mt-1" style={{ color: '#9CA3AF' }}>
        Employees {mode === 'late' ? 'arriving late' : 'leaving early'} by up to N minutes (cumulative threshold)
      </p>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LateLeavingTrend() {
  const [distribution, setDistribution] = useState<MinuteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'attendance', subtype: 'Attendance Late and Early', tenantCode: 'AAL' }),
    })
      .then(r => r.json())
      .then((res: { data: ApiData }) => {
        if (!cancelled) setDistribution(res.data?.distribution ?? []);
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'Network error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="chart-container">
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Late Coming &amp; Early Leaving</h3>
          <p className="chart-subtitle">Minute-wise distribution (&le;5, &le;10, ..., &le;60)</p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5">
            <Loader2 size={13} className="animate-spin" style={{ color: '#9CA3AF' }} />
            <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Loading…</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg p-3 mb-3 flex items-start gap-2" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={13} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[10px]" style={{ color: '#DC2626' }}>Failed to load data: {error}</p>
        </div>
      )}

      {!loading && !error && <MinuteDistributionChart data={distribution} />}

      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin" style={{ color: '#D1D5DB' }} />
        </div>
      )}

      <div className="mt-3 pt-2.5 flex items-center gap-2" style={{ borderTop: '1px solid #F3F4F6' }}>
        <TrendingUp size={11} style={{ color: '#9CA3AF' }} />
        <span className="text-[9px]" style={{ color: '#9CA3AF' }}>
          {distribution.length ? `${distribution.length} minute thresholds loaded` : 'Fetching punctuality data…'}
        </span>
      </div>
    </div>
  );
}
