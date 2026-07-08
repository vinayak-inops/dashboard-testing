import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, AlertCircle } from 'lucide-react';

// ── API types ─────────────────────────────────────────────────────────────────

interface PunctualitySummary { totalLateIncidents: number; totalEarlyExits: number; }
interface YearlyRow          { month: string; late: number; early: number; }
interface DeptRow            { department: string; late: number; early: number; }
interface LocationRow        { location: string; late: number; early: number; }
interface ContractorRow      { contractor: string; late: number; early: number; }
interface ShiftRow           { shift: string; late: number; early?: number; }
interface MinuteRow          { minute: number; lateCount: number; earlyCount: number; }

interface ApiData {
  punctualitySummary: PunctualitySummary;
  yearlyTrend:        YearlyRow[];
  departmentWise:     DeptRow[];
  locationWise:       LocationRow[];
  contractorWise:     ContractorRow[];
  shiftWise:          ShiftRow[];
  minuteDistribution: MinuteRow[];
}

const SHIFT_NAMES: Record<string, string> = {
  A_Shift: 'Morning', B_Shift: 'Afternoon', C_Shift: 'Night', G_Shift: 'General',
  ASHIFT: 'Morning',  BSHIFT: 'Afternoon',  CSHIFT: 'Night',  GSHIFT: 'General',
};

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'trend' | 'dept' | 'location' | 'contractor' | 'shift' | 'minutes';
const TABS: { key: Tab; label: string }[] = [
  { key: 'trend',      label: 'Trend' },
  { key: 'dept',       label: 'By Dept' },
  { key: 'location',   label: 'By Location' },
  { key: 'contractor', label: 'By Contractor' },
  { key: 'shift',      label: 'By Shift' },
  { key: 'minutes',    label: 'Minute Distribution' },
];

// ── Reusable bar comparison ───────────────────────────────────────────────────

function BarComparison({ rows }: { rows: { label: string; late: number; early: number }[] }) {
  const active = rows.filter(r => r.late > 0 || r.early > 0);
  const display = active.length > 0 ? active : rows.slice(0, 10);
  const max = Math.max(...display.map(r => r.late + r.early), 1);
  if (display.length === 0) {
    return <p className="text-[10px] text-center py-8" style={{ color: '#9CA3AF' }}>No data available</p>;
  }
  return (
    <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 320 }}>
      {display.map((r, i) => {
        const t = r.late + r.early;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold truncate pr-2" style={{ color: '#111827', maxWidth: '65%' }}>{r.label}</span>
              <div className="flex gap-2 flex-shrink-0">
                <span className="text-[9px] tabular-nums" style={{ color: '#EF4444' }}>↑{r.late}</span>
                <span className="text-[9px] tabular-nums" style={{ color: '#06B6D4' }}>↓{r.early}</span>
              </div>
            </div>
            <div className="flex h-3 rounded overflow-hidden gap-px" style={{ width: `${Math.max((t / max) * 100, 3)}%` }}>
              <div style={{ flex: Math.max(r.late, 0.5), backgroundColor: '#FCA5A5' }} />
              <div style={{ flex: Math.max(r.early, 0.5), backgroundColor: '#67E8F9' }} />
            </div>
          </div>
        );
      })}
      <div className="flex gap-3 pt-1">
        {[['Late', '#FCA5A5'], ['Early', '#67E8F9']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: c }} />
            <span className="text-[9px]" style={{ color: '#6B7280' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Yearly trend line ─────────────────────────────────────────────────────────

function TrendLine({ data }: { data: YearlyRow[] }) {
  const [hov, setHov] = useState<number | null>(null);
  if (data.length === 0) {
    return <p className="text-[10px] text-center py-8" style={{ color: '#9CA3AF' }}>No trend data</p>;
  }
  const W = 480, H = 110, PL = 32, PR = 8, PT = 8, PB = 22;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxY = Math.max(...data.map(d => d.late), ...data.map(d => d.early), 1) * 1.2;
  const n = data.length;
  const px = (i: number) => PL + (i / Math.max(n - 1, 1)) * cW;
  const py = (v: number) => PT + (1 - v / maxY) * cH;
  const pL = data.map((d, i) => `${px(i)},${py(d.late)}`).join(' ');
  const pE = data.map((d, i) => `${px(i)},${py(d.early)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 280, height: H }} fontFamily="system-ui,sans-serif">
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PL} x2={W - PR} y1={PT + (1 - f) * cH} y2={PT + (1 - f) * cH} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        <polyline points={pL} fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinejoin="round" />
        <polyline points={pE} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={px(i)} cy={py(d.late)} r={hov === i ? 4 : 2.5} fill="#EF4444" stroke="#fff" strokeWidth="1"
              style={{ cursor: 'pointer' }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
            <circle cx={px(i)} cy={py(d.early)} r={hov === i ? 4 : 2.5} fill="#06B6D4" stroke="#fff" strokeWidth="1"
              style={{ cursor: 'pointer' }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
            <text x={px(i)} y={H - 4} textAnchor="middle" fontSize="8" fill={hov === i ? '#374151' : '#9CA3AF'}>{d.month}</text>
          </g>
        ))}
        {hov !== null && (
          <g>
            <line x1={px(hov)} x2={px(hov)} y1={PT} y2={PT + cH} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2,2" />
            <rect x={Math.min(px(hov) - 36, W - PR - 76)} y={PT} width="72" height="36" rx="4" fill="#1F2937" />
            <text x={Math.min(px(hov), W - PR - 4) - 0} y={PT + 12} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">{data[hov].month}</text>
            <text x={Math.min(px(hov), W - PR - 4) - 0} y={PT + 23} textAnchor="middle" fontSize="7" fill="#FCA5A5">Late: {data[hov].late}</text>
            <text x={Math.min(px(hov), W - PR - 4) - 0} y={PT + 33} textAnchor="middle" fontSize="7" fill="#67E8F9">Early: {data[hov].early}</text>
          </g>
        )}
      </svg>
      <div className="flex gap-4 mt-1">
        {[['Late Coming', '#EF4444'], ['Early Leaving', '#06B6D4']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1">
            <span className="w-4 h-0.5 rounded inline-block" style={{ backgroundColor: c }} />
            <span className="text-[9px]" style={{ color: '#6B7280' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Minute distribution chart ─────────────────────────────────────────────────

function MinuteDistributionChart({ data }: { data: MinuteRow[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const [mode, setMode] = useState<'late' | 'early'>('late');
  if (data.length === 0) {
    return <p className="text-[10px] text-center py-8" style={{ color: '#9CA3AF' }}>No data available</p>;
  }
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
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 280, height: H }} fontFamily="system-ui,sans-serif">
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PL} x2={W - PR} y1={PT + (1 - f) * cH} y2={PT + (1 - f) * cH} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        {/* Y axis labels */}
        {[0.5, 1].map(f => (
          <text key={f} x={PL - 4} y={PT + (1 - f) * cH + 3} textAnchor="end" fontSize="8" fill="#9CA3AF">
            {Math.round(maxY * f / 1.15) >= 1000 ? `${(Math.round(maxY * f / 1.15) / 1000).toFixed(1)}k` : Math.round(maxY * f / 1.15)}
          </text>
        ))}
        {/* Bars */}
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
        {/* Trend line */}
        <polyline
          points={data.map((d, i) => `${px(i)},${py(mode === 'late' ? d.lateCount : d.earlyCount)}`).join(' ')}
          fill="none" stroke={col} strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3,2" />
        {/* Tooltip */}
        {hov !== null && (() => {
          const d = data[hov];
          const val = mode === 'late' ? d.lateCount : d.earlyCount;
          const tx = Math.min(Math.max(px(hov) - 36, PL), W - PR - 72);
          return (
            <g>
              <rect x={tx} y={PT} width="72" height="36" rx="4" fill="#1F2937" />
              <text x={tx + 36} y={PT + 12} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">&gt;{d.minute} min</text>
              <text x={tx + 36} y={PT + 24} textAnchor="middle" fontSize="8" fill={mode === 'late' ? '#FCA5A5' : '#67E8F9'}>{val.toLocaleString()} employees</text>
              <text x={tx + 36} y={PT + 34} textAnchor="middle" fontSize="7" fill="#9CA3AF">{mode === 'late' ? 'late by' : 'left early by'} ≥{d.minute}m</text>
            </g>
          );
        })()}
      </svg>
      <p className="text-[9px] mt-1" style={{ color: '#9CA3AF' }}>
        Employees {mode === 'late' ? 'arriving late' : 'leaving early'} by at least N minutes (cumulative threshold)
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LateLeavingTrend() {
  const [tab, setTab]     = useState<Tab>('trend');
  const [data, setData]   = useState<ApiData | null>(null);
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
        if (!cancelled) setData(res.data);
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'Network error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const totalLate  = data?.punctualitySummary?.totalLateIncidents ?? 0;
  const totalEarly = data?.punctualitySummary?.totalEarlyExits    ?? 0;

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Late Coming &amp; Early Leaving Trend</h3>
          <p className="chart-subtitle">Monthly trend, shift &amp; department breakdown</p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5">
            <Loader2 size={13} className="animate-spin" style={{ color: '#9CA3AF' }} />
            <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Loading…</span>
          </div>
        )}
      </div>

      {/* KPI row — Late Incidents + Early Exits */}
      <div className="flex gap-2 mb-3">
        {[
          { label: 'Late Incidents', val: totalLate,  bg: '#FEF2F2', border: '#FECACA', col: '#DC2626' },
          { label: 'Early Exits',    val: totalEarly, bg: '#ECFEFF', border: '#A5F3FC', col: '#0891B2' },
        ].map(k => (
          <div key={k.label} className="flex-1 rounded-lg px-3 py-2"
            style={{ backgroundColor: k.bg, border: `1px solid ${k.border}` }}>
            <p className="text-[9px] font-medium mb-0.5" style={{ color: k.col }}>{k.label}</p>
            <p className="text-base font-bold tabular-nums leading-tight" style={{ color: '#111827' }}>
              {loading ? '—' : k.val.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg p-3 mb-3 flex items-start gap-2" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={13} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[10px]" style={{ color: '#DC2626' }}>Failed to load data: {error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={tab === t.key
              ? { backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {!loading && data && (
        <>
          {tab === 'trend'      && <TrendLine data={data.yearlyTrend} />}
          {tab === 'dept'       && <BarComparison rows={(data.departmentWise ?? []).map(r => ({ label: r.department, late: r.late, early: r.early }))} />}
          {tab === 'location'   && <BarComparison rows={(data.locationWise   ?? []).map(r => ({ label: r.location,   late: r.late, early: r.early }))} />}
          {tab === 'contractor' && <BarComparison rows={(data.contractorWise  ?? []).map(r => ({ label: r.contractor, late: r.late, early: r.early }))} />}
          {tab === 'shift'      && <BarComparison rows={(data.shiftWise ?? []).filter(r => r.shift !== 'Unknown').map(r => ({ label: SHIFT_NAMES[r.shift] ?? r.shift, late: r.late, early: r.early ?? 0 }))} />}
          {tab === 'minutes'    && <MinuteDistributionChart data={data.minuteDistribution ?? []} />}
        </>
      )}
      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin" style={{ color: '#D1D5DB' }} />
        </div>
      )}

      <div className="mt-3 pt-2.5 flex items-center gap-2" style={{ borderTop: '1px solid #F3F4F6' }}>
        <TrendingUp size={11} style={{ color: '#9CA3AF' }} />
        <span className="text-[9px]" style={{ color: '#9CA3AF' }}>
          {data ? `${totalLate.toLocaleString()} late · ${totalEarly.toLocaleString()} early exits this period` : 'Fetching punctuality data…'}
        </span>
      </div>
    </div>
  );
}
