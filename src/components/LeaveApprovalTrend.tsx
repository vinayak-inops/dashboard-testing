import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const APPROVED_COLOR = '#86EFAC';
const REJECTED_COLOR = '#FCA5A5';
const PENDING_COLOR  = '#FDE68A';
const APPROVED_DARK  = '#16A34A';
const REJECTED_DARK  = '#DC2626';
const PENDING_DARK   = '#D97706';

// ── API types ─────────────────────────────────────────────────────────────────

interface MonthlyPoint    { month: string; approved: number; rejected: number; pending: number }
interface RejReason       { label: string; value: number; color?: string; dark?: string }
interface LocationPoint   { location: string; approved: number; rejected: number; pending: number; rejRate: number }
interface ContractorPoint { name: string; approved: number; rejected: number; pending: number; rejRate: number }
interface LeaveTypePoint  { type: string; approved: number; rejected: number; pending: number; rejRate: number }

interface LeaveData {
  monthly:          MonthlyPoint[];
  rejectionReasons: RejReason[];
  byLocation:       LocationPoint[];
  byContractor:     ContractorPoint[];
  byLeaveType:      LeaveTypePoint[];
  totalApproved:    number;
  totalRejected:    number;
  totalPending:     number;
}

const REASON_PALETTE = [
  { color: '#FCA5A5', dark: '#DC2626' },
  { color: '#FDE68A', dark: '#D97706' },
  { color: '#FED7AA', dark: '#EA580C' },
  { color: '#E9D5FF', dark: '#7C3AED' },
  { color: '#E5E7EB', dark: '#6B7280' },
];

type Tab = 'monthly' | 'location' | 'contractor' | 'leavetype';
const TABS: { key: Tab; label: string }[] = [
  { key: 'monthly',     label: 'Monthly'         },
  { key: 'location',    label: 'By Location'     },
  { key: 'contractor',  label: 'By Contractor'   },
  { key: 'leavetype',   label: 'By Leave Type'   },
];

// ── Compact donut ─────────────────────────────────────────────────────────────

function MiniDonut({ reasons }: { reasons: RejReason[] }) {
  const [hov, setHov] = useState<number | null>(null);
  if (!reasons.length) return null;
  const total = reasons.reduce((s, r) => s + r.value, 0) || 1;
  const R = 32, CX = 40, CY = 40, SW = 14, circ = 2 * Math.PI * R;
  let off = 0;
  const segs = reasons.map((r, i) => {
    const palette = REASON_PALETTE[i % REASON_PALETTE.length];
    const dash = (r.value / total) * circ;
    const s = { ...r, color: r.color ?? palette.color, dark: r.dark ?? palette.dark, dash, off };
    off += dash;
    return s;
  });
  const h = hov !== null ? segs[hov] : null;
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
        <svg width={80} height={80} viewBox="0 0 80 80">
          {segs.map((sg, i) => (
            <circle key={i} cx={CX} cy={CY} r={R} fill="none"
              stroke={sg.color} strokeWidth={SW}
              strokeDasharray={`${sg.dash} ${circ - sg.dash}`}
              strokeDashoffset={-sg.off + circ / 4}
              style={{ opacity: hov === null || hov === i ? 1 : 0.3, transition: 'opacity .15s', cursor: 'pointer' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {h ? (
            <span className="text-[10px] font-bold tabular-nums" style={{ color: h.dark }}>{h.value}%</span>
          ) : (
            <span className="text-[11px] font-bold" style={{ color: '#111827' }}>Why?</span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {segs.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5 cursor-default"
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: r.color }} />
            <span className="text-[9px] leading-tight" style={{ color: '#374151', maxWidth: 120 }}>{r.label}</span>
            <span className="text-[9px] font-bold tabular-nums ml-auto pl-1" style={{ color: r.dark }}>{r.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly stacked bar ───────────────────────────────────────────────────────

function MonthlyBar({ data, range }: { data: MonthlyPoint[]; range: 6 | 12 }) {
  const [hov, setHov] = useState<number | null>(null);
  const slice = data.slice(-range);
  if (!slice.length) return <p className="text-xs text-center py-6" style={{ color: '#9CA3AF' }}>No monthly data available.</p>;
  const maxT = Math.max(...slice.map(d => d.approved + d.rejected + d.pending), 1);
  return (
    <div>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {([['Approved', APPROVED_COLOR, APPROVED_DARK], ['Rejected', REJECTED_COLOR, REJECTED_DARK], ['Pending', PENDING_COLOR, PENDING_DARK]] as const).map(([l, c, d]) => (
          <div key={l} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
            <span className="text-[9px]" style={{ color: '#6B7280' }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1">
        {slice.map((d, i) => {
          const t = d.approved + d.rejected + d.pending;
          const maxH = 60;
          const h = maxT === 0 ? 2 : Math.max((t / maxT) * maxH, t > 0 ? 2 : 0);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 cursor-default"
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div className="relative flex flex-col justify-end w-full" style={{ height: 60 }}>
                {hov === i && (
                  <div className="absolute bottom-full mb-1 left-1/2 z-10 pointer-events-none"
                    style={{ transform: 'translateX(-50%)', minWidth: 80 }}>
                    <div className="rounded-lg px-2 py-1.5" style={{ backgroundColor: '#1F2937' }}>
                      <p className="text-[9px] font-bold text-white mb-0.5">{d.month}</p>
                      <p className="text-[8px]" style={{ color: '#86EFAC' }}>✓ {d.approved}</p>
                      <p className="text-[8px]" style={{ color: '#FCA5A5' }}>✗ {d.rejected}</p>
                      <p className="text-[8px]" style={{ color: '#FDE68A' }}>~ {d.pending}</p>
                    </div>
                  </div>
                )}
                <div className="w-full rounded-sm overflow-hidden flex flex-col-reverse" style={{ height: h }}>
                  <div style={{ flex: d.approved, backgroundColor: APPROVED_COLOR }} />
                  <div style={{ flex: d.rejected, backgroundColor: REJECTED_COLOR }} />
                  <div style={{ flex: d.pending,  backgroundColor: PENDING_COLOR  }} />
                </div>
              </div>
              <span className="text-[8px]" style={{ color: '#9CA3AF' }}>{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Site breakdown ────────────────────────────────────────────────────────────

function LocationBreakdown({ data }: { data: LocationPoint[] }) {
  if (!data.length) return <p className="text-xs text-center py-6" style={{ color: '#9CA3AF' }}>No location data available.</p>;
  const max = Math.max(...data.map(s => s.approved + s.rejected + s.pending), 1);
  return (
    <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 380 }}>
      {data.map((s, i) => {
        const t = s.approved + s.rejected + s.pending;
        const flag = s.rejRate > 20;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{ color: '#111827' }}>{s.location}</span>
                {flag && <span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>High</span>}
              </div>
              <span className="text-[10px] font-bold tabular-nums" style={{ color: flag ? '#DC2626' : '#6B7280' }}>{s.rejRate}%</span>
            </div>
            <div className="flex h-3 rounded overflow-hidden gap-px" style={{ width: `${(t / max) * 100}%` }}>
              <div style={{ flex: s.approved, backgroundColor: APPROVED_COLOR }} />
              <div style={{ flex: s.rejected, backgroundColor: REJECTED_COLOR }} />
              <div style={{ flex: s.pending,  backgroundColor: PENDING_COLOR  }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Contractor breakdown ──────────────────────────────────────────────────────

function ContractorBreakdown({ data }: { data: ContractorPoint[] }) {
  if (!data.length) return <p className="text-xs text-center py-6" style={{ color: '#9CA3AF' }}>No contractor data available.</p>;
  return (
    <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 380 }}>
      {data.map((c, i) => {
        const flag = c.rejRate > 25;
        const total = c.approved + c.rejected + c.pending;
        return (
          <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-2"
            style={{ backgroundColor: flag ? '#FEF2F2' : '#F9FAFB', border: `1px solid ${flag ? '#FECACA' : '#F3F4F6'}` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] font-semibold truncate" style={{ color: '#111827' }}>{c.name}</span>
              </div>
              <div className="flex h-2 rounded overflow-hidden">
                <div style={{ flex: c.approved, backgroundColor: APPROVED_COLOR }} />
                <div style={{ flex: c.rejected, backgroundColor: REJECTED_COLOR }} />
                <div style={{ flex: c.pending,  backgroundColor: PENDING_COLOR  }} />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] font-bold tabular-nums" style={{ color: flag ? '#DC2626' : '#374151' }}>{c.rejRate}%</p>
              <p className="text-[8px]" style={{ color: '#9CA3AF' }}>{total}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Leave type breakdown ──────────────────────────────────────────────────────

function LeaveTypeBreakdown({ data }: { data: LeaveTypePoint[] }) {
  const COLORS = ['#BFDBFE', '#DDD6FE', '#FDE68A', '#BBF7D0', '#A5F3FC'];
  if (!data.length) return <p className="text-xs text-center py-6" style={{ color: '#9CA3AF' }}>No leave type data available.</p>;
  return (
    <div className="space-y-2">
      {data.map((l, i) => {
        const flag = l.rejRate > 20;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[11px] font-semibold" style={{ color: '#111827' }}>{l.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {flag && <span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>Flag</span>}
                <span className="text-[10px] tabular-nums" style={{ color: '#6B7280' }}>{l.rejRate}%</span>
              </div>
            </div>
            <div className="flex h-2.5 rounded overflow-hidden gap-px">
              <div style={{ flex: l.approved, backgroundColor: APPROVED_COLOR }} />
              <div style={{ flex: l.rejected, backgroundColor: REJECTED_COLOR }} />
              <div style={{ flex: l.pending,  backgroundColor: PENDING_COLOR  }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Normalise API response ────────────────────────────────────────────────────

function normalise(json: Record<string, unknown>): LeaveData {
  const d = (json?.data ?? json) as Record<string, unknown>;

  const monthly: MonthlyPoint[] = (
    (d?.monthlyTrend ?? d?.leaveTrend ?? []) as Record<string, unknown>[]
  ).map(r => ({
    month:    String(r.month    ?? ''),
    approved: Number(r.approved ?? 0),
    rejected: Number(r.rejected ?? 0),
    pending:  Number(r.pending  ?? 0),
  }));

  const rejectionReasons: RejReason[] = (
    (d?.rejectionReasons ?? []) as Record<string, unknown>[]
  )
    .filter(r => String(r.reason ?? '').trim() !== '')
    .map(r => ({
      label: String(r.reason ?? ''),
      value: Number(r.percentage ?? r.total ?? 0),
    }));

  const byLocation: LocationPoint[] = (
    (d?.locationSummary ?? d?.locationDistribution ?? []) as Record<string, unknown>[]
  ).map(r => ({
    location: String(r.location ?? 'Unknown'),
    approved: Number(r.approved ?? 0),
    rejected: Number(r.rejected ?? 0),
    pending:  Number(r.pending  ?? 0),
    rejRate:  Number(r.rejectionRate ?? 0),
  }));

  const byContractor: ContractorPoint[] = (
    (d?.contractorSummary ?? d?.contractorDistribution ?? []) as Record<string, unknown>[]
  ).map(r => ({
    name:     String(r.contractor ?? r.name ?? 'Unknown'),
    approved: Number(r.approved   ?? 0),
    rejected: Number(r.rejected   ?? 0),
    pending:  Number(r.pending    ?? 0),
    rejRate:  Number(r.rejectionRate ?? 0),
  }));

  const byLeaveType: LeaveTypePoint[] = (
    (d?.leaveTypeSummary ?? d?.leaveTypeDistribution ?? []) as Record<string, unknown>[]
  ).map(r => ({
    type:     String(r.leaveType ?? r.type ?? r.name ?? 'Unknown'),
    approved: Number(r.approved ?? 0),
    rejected: Number(r.rejected ?? 0),
    pending:  Number(r.pending  ?? 0),
    rejRate:  Number(r.rejectionRate ?? r.rejRate ?? 0),
  }));

  const summary = (d?.leaveSummary ?? {}) as Record<string, unknown>;
  const totalApproved = Number(summary?.approved ?? monthly.reduce((s, m) => s + m.approved, 0));
  const totalRejected = Number(summary?.rejected ?? monthly.reduce((s, m) => s + m.rejected, 0));
  const totalPending  = Number(summary?.pending  ?? monthly.reduce((s, m) => s + m.pending,  0));

  return { monthly, rejectionReasons, byLocation, byContractor, byLeaveType, totalApproved, totalRejected, totalPending };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LeaveApprovalTrend() {
  const [tab,     setTab]     = useState<Tab>('monthly');
  const [range,   setRange]   = useState<6 | 12>(12);
  const [data,    setData]    = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type: 'workforce_composition', subtype: 'LeaveApprovalRejection', tenantCode: 'AAL' }),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => setData(normalise(json as Record<string, unknown>)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totAp  = data?.totalApproved ?? 0;
  const totRj  = data?.totalRejected ?? 0;
  const totPd  = data?.totalPending  ?? 0;
  const grand  = totAp + totRj + totPd || 1;
  const rejPct = ((totRj / grand) * 100).toFixed(1);

  return (
    <div className="chart-container !h-auto">
      <div className="mb-2">
        <h3 className="chart-title">Leave Approval vs Rejection Trend</h3>
        <p className="chart-subtitle">Breakdown with rejection reason analysis</p>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 flex items-start gap-2">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <p className="text-[11px]" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {/* Compact KPI row */}
      <div className="flex gap-2 mb-3">
        {[
          { label: 'Approved', val: totAp, bg: '#F0FDF4', border: '#BBF7D0', col: APPROVED_DARK },
          { label: 'Rejected', val: totRj, bg: '#FEF2F2', border: '#FECACA', col: REJECTED_DARK },
          { label: 'Pending',  val: totPd, bg: '#FFFBEB', border: '#FDE68A', col: PENDING_DARK  },
        ].map(k => (
          <div key={k.label} className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: k.bg, border: `1px solid ${k.border}` }}>
            <p className="text-[9px] font-medium mb-0.5" style={{ color: k.col }}>{k.label}</p>
            {loading
              ? <div className="h-4 w-10 rounded animate-pulse" style={{ backgroundColor: k.border }} />
              : <p className="text-sm font-bold tabular-nums leading-tight" style={{ color: '#111827' }}>{k.val.toLocaleString()}</p>
            }
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={tab === t.key
              ? { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}>
            {t.label}
          </button>
        ))}
        {tab === 'monthly' && (
          <div className="ml-auto flex gap-1">
            {([6, 12] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
                style={range === r
                  ? { backgroundColor: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' }
                  : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}>
                {r}M
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: '#BFDBFE', borderTopColor: '#2563EB' }} />
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Loading data…</p>
          </div>
        </div>
      ) : (
        <>
          {tab === 'monthly' && (
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0"><MonthlyBar data={data?.monthly ?? []} range={range} /></div>
              {(data?.rejectionReasons?.length ?? 0) > 0 && (
                <div className="w-44 flex-shrink-0">
                  <p className="text-[9px] uppercase tracking-wide font-semibold mb-2" style={{ color: '#9CA3AF' }}>Rejection Reasons</p>
                  <MiniDonut reasons={data!.rejectionReasons} />
                </div>
              )}
            </div>
          )}
          {tab === 'location'    && <LocationBreakdown    data={data?.byLocation    ?? []} />}
          {tab === 'contractor' && <ContractorBreakdown  data={data?.byContractor  ?? []} />}
          {tab === 'leavetype'  && <LeaveTypeBreakdown   data={data?.byLeaveType   ?? []} />}
        </>
      )}

      {/* Footer */}
      {!loading && (
        <div className="mt-3 pt-2.5 flex items-center gap-3" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div className="flex h-2 rounded-full overflow-hidden flex-1 gap-px">
            <div style={{ flex: totAp, backgroundColor: APPROVED_COLOR }} />
            <div style={{ flex: totRj, backgroundColor: REJECTED_COLOR }} />
            <div style={{ flex: totPd, backgroundColor: PENDING_COLOR  }} />
          </div>
          <span className="text-[9px] tabular-nums flex-shrink-0" style={{ color: '#6B7280' }}>
            Rej rate: <strong style={{ color: parseFloat(rejPct) > 20 ? '#DC2626' : '#374151' }}>{rejPct}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}
