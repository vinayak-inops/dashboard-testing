import React, { useState, useEffect, useRef } from 'react';
import { Users, AlertTriangle, AlertCircle, Clock, Building2, TrendingUp, ChevronRight, BarChart2, Activity, Timer, GitMerge } from 'lucide-react';
import { EmployeeFilter } from '../lib/supabase';
import { apiPost } from '../lib/api';
import EmployeeDrawer from './EmployeeDrawer';
import LateLeavingTrend from './LateLeavingTrend';
import OvertimeAnalysis from './OvertimeAnalysis';

// ── Attendance cards ──────────────────────────────────────────────────────────

interface AttendanceCardProps {
  title: string;
  metrics: string[];
  icon: React.ElementType;
  accentColor: string;
  bgColor: string;
  iconColor: string;
  values: { label: string; value: string | number; male?: string | number; female?: string | number; filter?: EmployeeFilter }[];
  onViewList: (filter: EmployeeFilter) => void;
}

function AttendanceCard({ title, metrics, icon: Icon, accentColor, bgColor, iconColor, values, onViewList }: AttendanceCardProps) {
  const hasGender = values.some(v => v.male !== undefined || v.female !== undefined);
  const fmt = (v: string | number | undefined) =>
    v === undefined ? '—' : typeof v === 'number' ? v.toLocaleString() : v;

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 transition-shadow duration-200 hover:shadow-md h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold leading-tight" style={{ color: '#111827' }}>{title}</h3>
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {metrics.map((m) => (
              <span key={m} className="text-[9px] font-medium px-1 py-px rounded" style={{ backgroundColor: bgColor, color: iconColor }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: '#F3F4F6' }} />

      <div className="flex-1">
        <table className="w-full border-collapse">
          {hasGender && (
            <thead>
              <tr>
                <th className="text-left pb-1" style={{ width: '100%' }} />
                <th className="text-right pb-1 pr-1.5" style={{ whiteSpace: 'nowrap' }}>
                  <span className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: '#2563EB' }}>M</span>
                </th>
                <th className="text-right pb-1 pr-1.5" style={{ whiteSpace: 'nowrap' }}>
                  <span className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: '#DB2777' }}>F</span>
                </th>
                <th className="text-right pb-1" style={{ whiteSpace: 'nowrap' }}>
                  <span className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Total</span>
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {values.map(({ label, value, male, female, filter }) => (
              <tr
                key={label}
                className="group relative"
                style={{ cursor: filter ? 'pointer' : 'default' }}
                onClick={() => filter && onViewList(filter)}
              >
                <td className="py-0.5 pr-2 text-[11px]" style={{ color: '#6B7280' }}>
                  <span className="group-hover:text-gray-900 transition-colors duration-150">{label}</span>
                  {filter && (
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-all duration-150 inline-flex items-center gap-0.5 text-[8px] font-semibold px-1 py-px rounded-full ml-1 align-middle"
                      style={{ backgroundColor: bgColor, color: iconColor }}
                    >
                      View <ChevronRight size={7} />
                    </span>
                  )}
                </td>
                {hasGender && (
                  <>
                    <td className="py-0.5 pr-1.5 text-right text-[10px] font-semibold tabular-nums" style={{ color: '#2563EB', whiteSpace: 'nowrap' }}>
                      {fmt(male)}
                    </td>
                    <td className="py-0.5 pr-1.5 text-right text-[10px] font-semibold tabular-nums" style={{ color: '#DB2777', whiteSpace: 'nowrap' }}>
                      {fmt(female)}
                    </td>
                  </>
                )}
                <td className="py-0.5 text-right text-xs font-bold tabular-nums" style={{ color: '#111827', whiteSpace: 'nowrap' }}>
                  {fmt(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-0.5 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.35 }} />
    </div>
  );
}

// ── Employees Inside Premises card ───────────────────────────────────────────

interface LiveOccupancy {
  inside: number;
  male: number;
  female: number;
  timestamp?: string;
}

function InsidePremisesCard({
  onViewList,
  liveOccupancy,
  totalEmployees,
  lastUpdated,
}: {
  onViewList: (f: EmployeeFilter) => void;
  liveOccupancy: LiveOccupancy;
  totalEmployees: number;
  lastUpdated: Date;
}) {
  const { inside: CURRENT_INSIDE, male: CURRENT_MALE, female: CURRENT_FEMALE } = liveOccupancy;
  const BASE_TOTAL = totalEmployees || 2549;
  const pct     = CURRENT_INSIDE > 0 ? Math.round((CURRENT_INSIDE / BASE_TOTAL) * 100) : 0;
  const malePct = CURRENT_INSIDE > 0 ? Math.round((CURRENT_MALE / CURRENT_INSIDE) * 100) : 0;
  const femalePct = CURRENT_INSIDE > 0 ? 100 - malePct : 0;

  const r  = 34;
  const circ = 2 * Math.PI * r;
  const totalDash  = circ * (pct / 100);
  const maleDash   = totalDash * (CURRENT_MALE / (CURRENT_INSIDE || 1));
  const femaleDash = totalDash * (CURRENT_FEMALE / (CURRENT_INSIDE || 1));

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 transition-shadow duration-200 hover:shadow-md h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
          <Building2 size={14} style={{ color: '#15803D' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold leading-tight" style={{ color: '#111827' }}>Inside Premises</h3>
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            <span className="text-[9px] font-medium px-1 py-px rounded" style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>
              Live Count
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: '#16A34A' }} />
          <span className="text-[9px] font-medium" style={{ color: '#16A34A' }}>
            {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: '#F3F4F6' }} />

      <div className="flex-1 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <svg width={88} height={88} viewBox="0 0 88 88">
            <circle cx={44} cy={44} r={34} fill="none" stroke="#F3F4F6" strokeWidth={9} />
            <circle cx={44} cy={44} r={34} fill="none"
              stroke="#DB2777"
              strokeWidth={9}
              strokeDasharray={`${femaleDash} ${2 * Math.PI * 34}`}
              strokeDashoffset={-(maleDash)}
              strokeLinecap="butt"
              transform="rotate(-90 44 44)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <circle cx={44} cy={44} r={34} fill="none"
              stroke="#2563EB"
              strokeWidth={9}
              strokeDasharray={`${maleDash} ${2 * Math.PI * 34}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              transform="rotate(-90 44 44)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <text x={44} y={41} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111827">{CURRENT_INSIDE.toLocaleString()}</text>
            <text x={44} y={53} textAnchor="middle" fontSize={8} fill="#6B7280">of {BASE_TOTAL.toLocaleString()}</text>
            <text x={44} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill="#15803D">{pct}%</text>
            <circle cx={44} cy={44} r={28} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => onViewList('inside_premises')} />
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          <div className="group cursor-pointer rounded-md p-1 -m-1 hover:bg-blue-50 transition-colors duration-150" onClick={() => onViewList('inside_male')}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold" style={{ color: '#2563EB' }}>Male</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold tabular-nums" style={{ color: '#2563EB' }}>{CURRENT_MALE.toLocaleString()}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[8px] font-semibold px-1 py-px rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
                  View <ChevronRight size={6} className="inline" />
                </span>
              </span>
            </div>
            <div className="h-1 rounded-full" style={{ backgroundColor: '#DBEAFE' }}>
              <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${malePct}%`, backgroundColor: '#2563EB' }} />
            </div>
            <span className="text-[8px]" style={{ color: '#93C5FD' }}>{malePct}% of present</span>
          </div>
          <div className="group cursor-pointer rounded-md p-1 -m-1 hover:bg-pink-50 transition-colors duration-150" onClick={() => onViewList('inside_female')}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold" style={{ color: '#DB2777' }}>Female</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold tabular-nums" style={{ color: '#DB2777' }}>{CURRENT_FEMALE.toLocaleString()}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[8px] font-semibold px-1 py-px rounded-full" style={{ backgroundColor: '#FCE7F3', color: '#BE185D' }}>
                  View <ChevronRight size={6} className="inline" />
                </span>
              </span>
            </div>
            <div className="h-1 rounded-full" style={{ backgroundColor: '#FCE7F3' }}>
              <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${femalePct}%`, backgroundColor: '#DB2777' }} />
            </div>
            <span className="text-[8px]" style={{ color: '#F9A8D4' }}>{femalePct}% of present</span>
          </div>
        </div>
      </div>

      <div className="h-0.5 rounded-full" style={{ backgroundColor: '#15803D', opacity: 0.35 }} />
    </div>
  );
}

// ── Org Attendance Distribution chart ────────────────────────────────────────

type Dimension = 'subsidiary' | 'region' | 'state' | 'location' | 'department' | 'subdept' | 'contractor';
type Metric = 'attendance' | 'absentism' | 'latein' | 'earlyout' | 'overtime' | 'shift';

const METRIC_TABS: { key: Metric; label: string; color: string; activeStyle: { backgroundColor: string; color: string; borderColor: string } }[] = [
  { key: 'attendance', label: 'Attendance',  color: '#2563EB', activeStyle: { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' } },
  { key: 'absentism',  label: 'Absentism',   color: '#DC2626', activeStyle: { backgroundColor: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' } },
  { key: 'latein',     label: 'Late In',     color: '#D97706', activeStyle: { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' } },
  { key: 'earlyout',   label: 'Early Out',   color: '#0891B2', activeStyle: { backgroundColor: '#ECFEFF', color: '#0E7490', borderColor: '#A5F3FC' } },
  { key: 'overtime',   label: 'Overtime',    color: '#059669', activeStyle: { backgroundColor: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' } },
  { key: 'shift',      label: 'Shift',       color: '#DB2777', activeStyle: { backgroundColor: '#FDF2F8', color: '#BE185D', borderColor: '#FBCFE8' } },
];

const SUB_TABS: { key: Dimension; label: string }[] = [
  { key: 'subsidiary', label: 'Subsidiary' },
  { key: 'region',     label: 'Region' },
  { key: 'state',      label: 'State' },
  { key: 'location',   label: 'Location' },
  { key: 'department', label: 'Department' },
  { key: 'subdept',    label: 'Sub-Dept' },
  { key: 'contractor', label: 'Contractor' },
];

const BLUE  = ['#DBEAFE','#BFDBFE','#93C5FD','#60A5FA','#3B82F6','#2563EB','#1D4ED8'];
const RED   = ['#FEE2E2','#FECACA','#FCA5A5','#F87171','#EF4444','#DC2626','#B91C1C'];
const AMBER = ['#FEF9C3','#FDE68A','#FCD34D','#FBBF24','#F59E0B','#D97706','#B45309'];
const CYAN  = ['#CFFAFE','#A5F3FC','#67E8F9','#22D3EE','#06B6D4','#0891B2','#0E7490'];
const GREEN = ['#D1FAE5','#A7F3D0','#6EE7B7','#34D399','#10B981','#059669','#047857'];
const PINK  = ['#FCE7F3','#FBCFE8','#F9A8D4','#F472B6','#EC4899','#DB2777','#BE185D'];

const allDimColors = (palette: string[]): Record<Dimension, string[]> => ({
  subsidiary: palette, region: palette, state: palette, location: palette,
  department: palette, subdept: palette, contractor: palette,
});

const COLOR_SETS: Record<Metric, Record<Dimension, string[]>> = {
  attendance: allDimColors(BLUE),
  absentism:  allDimColors(RED),
  latein:     allDimColors(AMBER),
  earlyout:   allDimColors(CYAN),
  overtime:   allDimColors(GREEN),
  shift:      allDimColors(PINK),
};

interface OrgRow { id: string; dimension: Dimension; label: string; count: number; pct: number }

const METRIC_LABEL: Record<Metric, string> = {
  attendance: 'Attendance',
  absentism:  'Absentism',
  latein:     'Late In',
  earlyout:   'Early Out',
  overtime:   'Overtime',
  shift:      'Shift',
};

// ── Shift Distribution Chart (quarterly-style horizontal bars) ────────────────

const SHIFT_COLORS = ['#DB2777','#EC4899','#F472B6','#BE185D','#9D174D','#831843','#FBCFE8'];

function ShiftBarChart({ rows }: { rows: OrgRow[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const maxCount = Math.max(...rows.map(r => r.count), 1);
  const total    = rows.reduce((s, r) => s + r.count, 0);

  if (!rows.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No shift data available.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: SHIFT_COLORS[i % SHIFT_COLORS.length] }} />
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{r.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => {
          const color  = SHIFT_COLORS[i % SHIFT_COLORS.length];
          const widPct = (r.count / maxCount) * 100;
          return (
            <div key={r.id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <div className="flex items-center mb-1">
                <span className="text-[10px] font-semibold flex-shrink-0 truncate w-24" style={{ color: '#374151' }} title={r.label}>
                  {r.label}
                </span>
                <div className="flex-1 mx-3">
                  <div className="flex h-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                    <div
                      className="transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${widPct}%`, backgroundColor: color, opacity: hover === i ? 1 : 0.85 }}
                      title={`${r.label}: ${r.count.toLocaleString()}`}
                    >
                      {widPct > 7 && (
                        <span className="text-[9px] font-bold text-white tabular-nums">{r.pct}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold tabular-nums w-12 text-right flex-shrink-0" style={{ color: '#111827' }}>
                  {r.count.toLocaleString()}
                </span>
              </div>
              {hover === i && (
                <div className="flex flex-wrap gap-3 ml-24 mt-0.5 mb-1 pl-3">
                  <span className="text-[10px] tabular-nums" style={{ color }}>
                    {r.label}: {r.count.toLocaleString()} &nbsp;·&nbsp; {r.pct}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
        <p className="text-[10px] mb-2 uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Shift Distribution</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-px">
          {rows.map((r, i) => (
            <div
              key={r.id}
              className="transition-all duration-500"
              style={{ width: `${total > 0 ? (r.count / total) * 100 : 0}%`, backgroundColor: SHIFT_COLORS[i % SHIFT_COLORS.length] }}
              title={`${r.label}: ${r.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {rows.slice(0, 6).map((r, i) => (
            <div key={r.id} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: SHIFT_COLORS[i % SHIFT_COLORS.length] }} />
              <span className="text-[10px] truncate max-w-[90px]" style={{ color: '#6B7280' }}>{r.label}</span>
            </div>
          ))}
          {rows.length > 6 && <span className="text-[10px]" style={{ color: '#9CA3AF' }}>+{rows.length - 6} more</span>}
        </div>
      </div>
    </div>
  );
}

function OrgAttendanceChart() {
  const [activeMetric, setActiveMetric] = useState<Metric>('attendance');
  const [activeDim, setActiveDim]       = useState<Dimension>('subsidiary');
  const [rows, setRows]                 = useState<OrgRow[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const cache                           = useRef<Map<string, OrgRow[]>>(new Map());

  useEffect(() => {
    const key    = `${activeMetric}:${activeDim}`;
    const cached = cache.current.get(key);
    if (cached) {
      setRows(cached);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setRows([]);
    setLoading(true);
    setError(null);
    fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type: 'attendance', subtype: 'Attendance Org Distribution', metric: activeMetric, dimension: activeDim, tenantCode: 'AAL' }),
      signal:  controller.signal,
    })
      .then(r => r.json())
      .then(json => {
        // For shift metric the API may return data under shiftDistribution or organizationalDistribution
        const bd = activeMetric === 'shift'
          ? (json?.data?.shiftDistribution ?? json?.data?.organizationalDistribution)
          : json?.data?.organizationalDistribution;
        if (bd?.values?.length) {
          const mapped: OrgRow[] = (bd.values as { name: string; count: number; pct: number }[]).map((v, i) => ({
            id: String(i), dimension: activeDim, label: v.name, count: v.count, pct: v.pct,
          }));
          cache.current.set(key, mapped);
          setRows(mapped);
          setError(null);
        } else if (activeMetric === 'shift') {
          // ShiftBarChart renders its own "no data" state — don't show error panel
          setRows([]);
          setError(null);
        } else {
          setRows([]);
          setError('No data available for this selection.');
        }
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setRows([]);
        setError(`Failed to load data: ${err.message}`);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [activeMetric, activeDim]);

  const filtered  = [...rows].sort((a, b) => b.count - a.count);
  const maxCount  = Math.max(...filtered.map(d => d.count), 1);
  const total     = filtered.reduce((s, d) => s + d.count, 0);
  const colorSet  = COLOR_SETS[activeMetric][activeDim];
  const metricInfo = METRIC_TABS.find(m => m.key === activeMetric)!;

  return (
    <div className="chart-container flex flex-col">
      <div className="mb-4">
        <h3 className="chart-title">Organizational Distribution</h3>
        <p className="chart-subtitle">
          {activeMetric === 'shift'
            ? `Shift distribution by ${SUB_TABS.find(t => t.key === activeDim)?.label}`
            : `${METRIC_LABEL[activeMetric]} concentration by ${SUB_TABS.find(t => t.key === activeDim)?.label}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {METRIC_TABS.map(m => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer"
            style={activeMetric === m.key
              ? m.activeStyle
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-5 pl-0.5">
        {SUB_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDim(tab.key)}
            className="text-[10px] font-medium px-2.5 py-1 rounded-md border transition-all duration-150 cursor-pointer"
            style={activeDim === tab.key
              ? { backgroundColor: metricInfo.color + '18', color: metricInfo.color, borderColor: metricInfo.color + '44' }
              : { backgroundColor: '#F9FAFB', color: '#9CA3AF', borderColor: '#E5E7EB' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: metricInfo.color + '30', borderTopColor: metricInfo.color }} />
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Loading data…</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={16} style={{ color: '#DC2626' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Unable to load data</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{error}</p>
          </div>
        </div>
      ) : activeMetric === 'shift' ? (
        <ShiftBarChart rows={filtered} />
      ) : (
        <>
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
            {filtered.map((d, i) => {
              const barPct = (d.count / maxCount) * 100;
              const color  = colorSet[Math.min(i + 2, colorSet.length - 1)];
              return (
                <div key={d.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs truncate max-w-[160px]" style={{ color: '#374151' }} title={d.label}>{d.label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs font-semibold tabular-nums" style={{ color: '#111827' }}>{d.count.toLocaleString()}</span>
                      <span className="text-[10px] tabular-nums w-10 text-right" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
                    </div>
                  </div>
                  <div className="h-5 rounded-md overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="h-full rounded-md transition-all duration-500" style={{ width: `${barPct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
            <p className="text-[10px] mb-2 uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Distribution</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-px">
              {filtered.map((d, i) => (
                <div
                  key={d.id}
                  className="transition-all duration-500"
                  style={{ width: `${(d.count / total) * 100}%`, backgroundColor: colorSet[Math.min(i + 2, colorSet.length - 1)] }}
                  title={`${d.label}: ${d.pct}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {filtered.slice(0, 5).map((d, i) => (
                <div key={d.id} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: colorSet[Math.min(i + 2, colorSet.length - 1)] }} />
                  <span className="text-[10px] truncate max-w-[80px]" style={{ color: '#6B7280' }}>{d.label}</span>
                </div>
              ))}
              {filtered.length > 5 && (
                <span className="text-[10px]" style={{ color: '#9CA3AF' }}>+{filtered.length - 5} more</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Attendance Trend Charts ───────────────────────────────────────────────────

type TrendPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

const TREND_TABS: { key: TrendPeriod; label: string }[] = [
  { key: 'daily',     label: 'Daily' },
  { key: 'weekly',    label: 'Weekly' },
  { key: 'monthly',   label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'yearly',    label: 'Yearly' },
];

// ── Trend data types ──────────────────────────────────────────────────────────

type DailyPoint     = { day: string; present: number; absent: number };
type WeeklyPoint    = { week: string; present: number; absent: number; late: number };
type MonthlyPoint   = { month: string; pct: number; present: number };
type QuarterlyPoint = { quarter: string; present: number; absent: number; late: number; early: number };
type YearlyPoint    = { month: string; pct: number; count: number };

export interface TrendsData {
  daily?:     DailyPoint[];
  weekly?:    WeeklyPoint[];
  monthly?:   MonthlyPoint[];
  quarterly?: QuarterlyPoint[];
  yearly?:    YearlyPoint[];
}

// ── Daily: area sparkline ────────────────────────────────────────────────────

function DailyChart({ data }: { data: DailyPoint[] }) {
  const W = 560; const H = 160; const PAD = { t: 12, r: 16, b: 30, l: 42 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No daily data available.</p>;

  const maxVal = Math.max(...data.map(d => d.present + d.absent), 1);
  const xs = data.map((_, i) => PAD.l + (data.length > 1 ? (i / (data.length - 1)) : 0.5) * chartW);
  const yP = data.map(d => PAD.t + (1 - d.present / maxVal) * chartH);
  const yA = data.map(d => PAD.t + (1 - d.absent  / maxVal) * chartH);
  const linePath = (pts: number[], ys: number[]) =>
    pts.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const areaPath = (pts: number[], ys: number[]) =>
    `${linePath(pts, ys)} L${pts[pts.length-1]},${PAD.t + chartH} L${pts[0]},${PAD.t + chartH} Z`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded-full inline-block" style={{ backgroundColor: '#2563EB' }} /><span className="text-[10px]" style={{ color: '#6B7280' }}>Present</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded-full inline-block" style={{ backgroundColor: '#EF4444' }} /><span className="text-[10px]" style={{ color: '#6B7280' }}>Absent</span></div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', maxHeight: 200 }}>
        <defs>
          <linearGradient id="gpA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="gpB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PAD.l} x2={W - PAD.r}
            y1={PAD.t + f * chartH} y2={PAD.t + f * chartH}
            stroke="#F3F4F6" strokeWidth="1" />
        ))}
        {[0, 0.5, 1].map(f => (
          <text key={f} x={PAD.l - 4} y={PAD.t + f * chartH + 4}
            textAnchor="end" fontSize="10" fill="#D1D5DB">
            {Math.round(maxVal * (1 - f)).toLocaleString()}
          </text>
        ))}
        <path d={areaPath(xs, yP)} fill="url(#gpA)" />
        <path d={areaPath(xs, yA)} fill="url(#gpB)" />
        <path d={linePath(xs, yP)} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
        <path d={linePath(xs, yA)} fill="none" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" strokeDasharray="5 3" />
        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle cx={xs[i]} cy={yP[i]} r={hover === i ? 5 : 3} fill="#2563EB" stroke="#fff" strokeWidth="1.5" />
            <circle cx={xs[i]} cy={yA[i]} r={hover === i ? 5 : 3} fill="#EF4444" stroke="#fff" strokeWidth="1.5" />
            <text x={xs[i]} y={PAD.t + chartH + 18} textAnchor="middle" fontSize="10" fill="#9CA3AF">{d.day}</text>
            {hover === i && (
              <g>
                <rect x={xs[i] + 7} y={yP[i] - 26} width="76" height="42" rx="4" fill="#1F2937" opacity="0.93" />
                <text x={xs[i] + 45} y={yP[i] - 13} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{d.day}</text>
                <text x={xs[i] + 45} y={yP[i]     } textAnchor="middle" fontSize="10" fill="#93C5FD">P: {d.present.toLocaleString()}</text>
                <text x={xs[i] + 45} y={yP[i] + 13} textAnchor="middle" fontSize="10" fill="#FCA5A5">A: {d.absent.toLocaleString()}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Weekly: grouped bar chart ────────────────────────────────────────────────

function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  const W = 560; const H = 160; const PAD = { t: 12, r: 16, b: 30, l: 42 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const [hover, setHover] = useState<number | null>(null);
  const COLS = ['#2563EB', '#EF4444', '#F59E0B'];
  const KEYS = ['present', 'absent', 'late'] as const;
  const LABELS = ['Present', 'Absent', 'Late In'];

  if (!data.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No weekly data available.</p>;

  const maxVal = Math.max(...data.map(d => d.present), 1);
  const groupW = chartW / data.length;
  const barW = groupW * 0.22;
  const gap = groupW * 0.04;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
        {LABELS.map((l, i) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: COLS[i] }} />
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{l}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', maxHeight: 200 }}>
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + f * chartH} y2={PAD.t + f * chartH} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        {[0, 0.5, 1].map(f => (
          <text key={f} x={PAD.l - 4} y={PAD.t + f * chartH + 4} textAnchor="end" fontSize="10" fill="#D1D5DB">
            {Math.round(maxVal * (1 - f)).toLocaleString()}
          </text>
        ))}
        {data.map((d, i) => {
          const cx = PAD.l + i * groupW + groupW / 2;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {KEYS.map((k, ki) => {
                const bH = (d[k] / maxVal) * chartH;
                const bX = cx - (1.5 - ki) * (barW + gap) - barW / 2;
                return (
                  <rect key={k} x={bX} y={PAD.t + chartH - bH} width={barW} height={bH}
                    rx="2" fill={COLS[ki]} opacity={hover === i ? 1 : 0.82}
                  />
                );
              })}
              <text x={cx} y={PAD.t + chartH + 18} textAnchor="middle" fontSize="10" fill="#9CA3AF">{d.week}</text>
              {hover === i && (
                <g>
                  <rect x={cx - 38} y={PAD.t} width="76" height="52" rx="4" fill="#1F2937" opacity="0.93" />
                  <text x={cx} y={PAD.t + 13} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{d.week}</text>
                  {KEYS.map((k, ki) => (
                    <text key={k} x={cx} y={PAD.t + 25 + ki * 12} textAnchor="middle" fontSize="10" fill={COLS[ki]}>
                      {LABELS[ki]}: {d[k].toLocaleString()}
                    </text>
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Monthly: radial ring chart ───────────────────────────────────────────────

function RadialRing({ pct, color, size = 64, stroke = 7 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#111827">{pct}</text>
    </svg>
  );
}

function MonthlyChart({ data }: { data: MonthlyPoint[] }) {
  const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#06B6D4','#2563EB','#8B5CF6','#EC4899','#14B8A6','#F97316','#84CC16','#0EA5E9'];
  const nonZero = data.filter(d => d.pct > 0 || d.present > 0);
  const display = nonZero.length > 0 ? nonZero : data;

  if (!display.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No monthly data available.</p>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {display.map((d, i) => (
        <div key={`${d.month}-${i}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl"
          style={{ backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}>
          <RadialRing pct={d.pct} color={colors[i % colors.length]} size={64} stroke={7} />
          <span className="text-[11px] font-semibold" style={{ color: '#374151' }}>{d.month}</span>
          <span className="text-[10px] tabular-nums" style={{ color: '#9CA3AF' }}>{d.present.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Quarterly: stacked horizontal bar ────────────────────────────────────────

function QuarterlyChart({ data }: { data: QuarterlyPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const SEG = [
    { key: 'present', label: 'Present', color: '#2563EB' },
    { key: 'absent',  label: 'Absent',  color: '#EF4444' },
    { key: 'late',    label: 'Late In', color: '#F59E0B' },
    { key: 'early',   label: 'Early Out', color: '#06B6D4' },
  ] as const;

  if (!data.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No quarterly data available.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {SEG.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {data.map((d, i) => {
          const total = SEG.reduce((s, seg) => s + d[seg.key], 0);
          return (
            <div key={d.quarter} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold w-14 flex-shrink-0" style={{ color: '#374151' }}>{d.quarter}</span>
                <div className="flex-1 mx-3">
                  <div className="flex h-6 rounded-lg overflow-hidden gap-px">
                    {SEG.map(seg => (
                      <div key={seg.key}
                        className="transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${total > 0 ? (d[seg.key] / total) * 100 : 0}%`, backgroundColor: seg.color, opacity: hover === i ? 1 : 0.85 }}
                        title={`${seg.label}: ${d[seg.key].toLocaleString()}`}
                      >
                        {total > 0 && (d[seg.key] / total) > 0.07 && (
                          <span className="text-[9px] font-bold text-white tabular-nums">{((d[seg.key] / total) * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-bold tabular-nums w-12 text-right flex-shrink-0" style={{ color: '#111827' }}>
                  {total.toLocaleString()}
                </span>
              </div>
              {hover === i && (
                <div className="flex flex-wrap gap-3 ml-14 mt-1 mb-1 pl-3">
                  {SEG.map(seg => (
                    <span key={seg.key} className="text-[10px] tabular-nums" style={{ color: seg.color }}>
                      {seg.label}: {d[seg.key].toLocaleString()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Yearly: calendar heatmap ──────────────────────────────────────────────────

function pctToColor(pct: number): string {
  if (pct >= 89) return '#1D4ED8';
  if (pct >= 87) return '#2563EB';
  if (pct >= 85) return '#3B82F6';
  if (pct >= 83) return '#60A5FA';
  if (pct > 0)   return '#93C5FD';
  return '#E5E7EB';
}

function YearlyChart({ data }: { data: YearlyPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  if (!data.length) return <p className="text-xs text-center py-8" style={{ color: '#9CA3AF' }}>No yearly data available.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {[['0%','#E5E7EB'],['< 83%','#93C5FD'],['83–85%','#60A5FA'],['85–87%','#3B82F6'],['87–89%','#2563EB'],['≥ 89%','#1D4ED8']].map(([l,c]) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c }} />
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {data.map((d, i) => {
          const color = pctToColor(d.pct);
          const barH = Math.round((d.count / maxCount) * 36);
          return (
            <div key={`${d.month}-${i}`} className="relative flex flex-col items-center gap-1 cursor-default"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <div className="w-full rounded-lg overflow-hidden flex flex-col justify-end"
                style={{ height: 52, backgroundColor: color + '22', border: `1px solid ${color}44` }}>
                <div className="w-full rounded-b-lg transition-all duration-500"
                  style={{ height: barH, backgroundColor: color }} />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: '#374151' }}>{d.month}</span>
              <span className="text-[10px] font-bold" style={{ color: d.pct > 0 ? color : '#9CA3AF' }}>
                {d.pct > 0 ? `${d.pct}%` : '—'}
              </span>

              {hover === i && (
                <div className="absolute bottom-full mb-2 left-1/2 z-10 pointer-events-none"
                  style={{ transform: 'translateX(-50%)' }}>
                  <div className="rounded-lg px-2.5 py-2 text-center whitespace-nowrap"
                    style={{ backgroundColor: '#1F2937', minWidth: 90 }}>
                    <p className="text-[10px] font-bold text-white mb-0.5">{d.month}</p>
                    <p className="text-[10px]" style={{ color: '#93C5FD' }}>{d.count.toLocaleString()} present</p>
                    <p className="text-[10px]" style={{ color: '#6EE7B7' }}>{d.pct > 0 ? `${d.pct}% rate` : 'No data'}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Attendance Trend Container ────────────────────────────────────────────────

function AttendanceTrendSection({ trends }: { trends?: TrendsData }) {
  const [period, setPeriod] = useState<TrendPeriod>('daily');

  const PERIOD_META: Record<TrendPeriod, { subtitle: string }> = {
    daily:     { subtitle: 'Present vs. absent for each working day this week' },
    weekly:    { subtitle: 'Week-over-week grouped attendance for last 5 weeks' },
    monthly:   { subtitle: 'Attendance rate rings across rolling 6 months' },
    quarterly: { subtitle: 'Stacked quarterly breakdown — present, absent, late, early out' },
    yearly:    { subtitle: 'Monthly heatmap across the full fiscal year' },
  };

  return (
    <div className="chart-container mt-6">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFF6FF' }}>
            <TrendingUp size={15} style={{ color: '#1D4ED8' }} />
          </div>
          <div>
            <h3 className="chart-title">Attendance Trend</h3>
            <p className="chart-subtitle">{PERIOD_META[period].subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-5">
        {TREND_TABS.map(tab => (
          <button key={tab.key} onClick={() => setPeriod(tab.key)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer"
            style={period === tab.key
              ? { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 260 }}>
        {period === 'daily'     && <DailyChart     data={trends?.daily     ?? []} />}
        {period === 'weekly'    && <WeeklyChart    data={trends?.weekly    ?? []} />}
        {period === 'monthly'   && <MonthlyChart   data={trends?.monthly   ?? []} />}
        {period === 'quarterly' && <QuarterlyChart data={trends?.quarterly ?? []} />}
        {period === 'yearly'    && <YearlyChart    data={trends?.yearly    ?? []} />}
      </div>
    </div>
  );
}

// ── Attendance Shortfall & OT Compensation ───────────────────────────────────

interface WOAnalytics { workOrderNumber: string; totalEmployees: number; otHours: number; presentEmployees: number; }
interface ContractorAnalytics { name: string; workOrders: WOAnalytics[]; }


// ── Attendance Shortfall vs OT Compensation Chart ────────────────────────────

type ShortfallRow = {
  workOrderNumber: string;
  assigned: number;
  present: number;
  shortfall: number;
  attPct: number;
  otHours: number;
  otPerShortfall: number;
};

function ContractorDropdown({
  selected,
  onChange,
  contractors,
}: {
  selected: string;
  onChange: (v: string) => void;
  contractors: ContractorAnalytics[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: '#6B7280' }}>
        Contractor:
      </span>
      <div className="relative" style={{ minWidth: 220 }}>
        <select
          value={selected}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none text-[11px] rounded-md border pl-2.5 pr-7 py-1.5 outline-none transition-all cursor-pointer"
          style={{
            borderColor:     selected ? '#3B82F6' : '#E5E7EB',
            backgroundColor: '#FFFFFF',
            color:           selected ? '#111827' : '#9CA3AF',
            boxShadow:       selected ? '0 0 0 2px rgba(59,130,246,0.12)' : 'none',
          }}
        >
          <option value="">— Select a contractor —</option>
          {contractors.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width={8} height={5} viewBox="0 0 8 5" fill="none">
            <path d="M1 1l3 3 3-3" stroke={selected ? '#3B82F6' : '#9CA3AF'} strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function AttendanceOTCorrelationChart({ contractors }: { contractors: ContractorAnalytics[] }) {
  const [selected, setSelected] = useState('');
  const [hover, setHover]       = useState<number | null>(null);

  const contractor = contractors.find(c => c.name === selected);
  const rows: ShortfallRow[] = (contractor?.workOrders ?? []).map(w => {
    const shortfall = w.totalEmployees - w.presentEmployees;
    return {
      workOrderNumber: w.workOrderNumber,
      assigned:        w.totalEmployees,
      present:         w.presentEmployees,
      shortfall,
      attPct:          w.totalEmployees > 0 ? Math.round((w.presentEmployees / w.totalEmployees) * 100) : 0,
      otHours:         w.otHours,
      otPerShortfall:  shortfall > 0 ? Math.round(w.otHours / shortfall) : 0,
    };
  });

  const totalAssigned  = rows.reduce((s, r) => s + r.assigned,   0);
  const totalPresent   = rows.reduce((s, r) => s + r.present,    0);
  const totalShortfall = rows.reduce((s, r) => s + r.shortfall,  0);
  const totalOT        = rows.reduce((s, r) => s + r.otHours,    0);
  const overallOtPer   = totalShortfall > 0 ? Math.round(totalOT / totalShortfall) : 0;
  const overallAtt     = totalAssigned  > 0 ? Math.round((totalPresent / totalAssigned) * 100) : 0;

  // SVG layout
  const W   = 640; const H = 210;
  const PAD = { t: 18, r: 58, b: 50, l: 44 };
  const cW  = W - PAD.l - PAD.r;
  const cH  = H - PAD.t - PAD.b;
  const n   = rows.length || 1;
  const gW  = cW / n;
  const bW  = Math.min(gW * 0.5, 48);

  const maxAssigned = Math.max(...rows.map(r => r.assigned), 1);
  const maxOT       = Math.max(...rows.map(r => r.otHours),  1);

  // OT line points (right-axis scale)
  const otPts = rows.map((r, i) => ({
    x: PAD.l + i * gW + gW / 2,
    y: PAD.t + cH - (r.otHours / maxOT) * cH,
  }));
  const otLinePath = otPts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  // Y-axis tick values (left axis — employees)
  const leftTicks = [0, 0.5, 1];
  // Y-axis tick values (right axis — OT hrs)
  const rightTicks = [0, 0.5, 1];

  return (
    <div className="chart-container mt-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Attendance Shortfall &amp; OT Compensation</h3>
          <p className="chart-subtitle">
            Per work order: how many employees are assigned vs present, and overtime logged to compensate
          </p>
        </div>
      </div>

      {/* Contractor selector */}
      <div className="mb-3">
        <ContractorDropdown selected={selected} onChange={setSelected} contractors={contractors} />
      </div>

      {/* Empty states */}
      {!selected ? (
        <div className="flex items-center justify-center gap-2 py-8 rounded-lg"
          style={{ backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB' }}>
          <Building2 size={13} style={{ color: '#D1D5DB' }} />
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Select a contractor to view shortfall &amp; OT breakdown
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-8 rounded-lg"
          style={{ backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB' }}>
          <AlertCircle size={13} style={{ color: '#D97706' }} />
          <p className="text-xs" style={{ color: '#9CA3AF' }}>No Data Available for {selected}</p>
        </div>
      ) : (
        <>
          {/* Contractor-level insight strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 px-3 py-2 rounded-lg"
            style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
            <div className="flex items-center gap-1.5">
              <Users size={11} style={{ color: '#C2410C' }} />
              <span className="text-[10px]" style={{ color: '#7C2D12' }}>
                Assigned: <strong>{totalAssigned.toLocaleString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[10px]" style={{ color: '#7C2D12' }}>
                Present: <strong style={{ color: '#15803D' }}>{totalPresent.toLocaleString()}</strong>
                <span className="ml-1" style={{ color: '#9CA3AF' }}>({overallAtt}%)</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-[10px]" style={{ color: '#7C2D12' }}>
                Shortfall: <strong style={{ color: '#DC2626' }}>{totalShortfall.toLocaleString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={10} style={{ color: '#D97706' }} />
              <span className="text-[10px]" style={{ color: '#7C2D12' }}>
                Total OT: <strong style={{ color: '#D97706' }}>{totalOT.toLocaleString()} hrs</strong>
              </span>
            </div>
            {overallOtPer > 0 && (
              <span className="ml-auto text-[10px] font-bold" style={{ color: '#C2410C' }}>
                ≈ {overallOtPer} OT hrs per absent person
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#BFDBFE' }} />
              <span className="text-[10px]" style={{ color: '#6B7280' }}>Assigned</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#22C55E', opacity: 0.85 }} />
              <span className="text-[10px]" style={{ color: '#6B7280' }}>Present</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#FCA5A5' }} />
              <span className="text-[10px]" style={{ color: '#6B7280' }}>Shortfall (absent)</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width={18} height={6}>
                <line x1={0} y1={3} x2={18} y2={3} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 2" />
                <circle cx={9} cy={3} r={2} fill="#F59E0B" />
              </svg>
              <span className="text-[10px]" style={{ color: '#6B7280' }}>OT Hours (right axis)</span>
            </div>
          </div>

          {/* Chart */}
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 300, display: 'block' }}>

              {/* Grid */}
              {[0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={PAD.l} x2={W - PAD.r}
                  y1={PAD.t + f * cH} y2={PAD.t + f * cH}
                  stroke="#F1F5F9" strokeWidth={1} />
              ))}

              {/* Left Y-axis — employee count */}
              {leftTicks.map(f => (
                <text key={f} x={PAD.l - 4} y={PAD.t + (1 - f) * cH + 3}
                  textAnchor="end" fontSize={8} fill="#D1D5DB">
                  {Math.round(maxAssigned * f)}
                </text>
              ))}

              {/* Right Y-axis — OT hours */}
              {rightTicks.map(f => (
                <text key={f} x={W - PAD.r + 4} y={PAD.t + (1 - f) * cH + 3}
                  textAnchor="start" fontSize={8} fill="#FDE68A">
                  {Math.round(maxOT * f / 500) * 500}
                </text>
              ))}
              <text x={W - 7} y={PAD.t + cH / 2} textAnchor="middle" fontSize={8} fill="#F59E0B"
                transform={`rotate(90 ${W - 7} ${PAD.t + cH / 2})`}>OT hrs</text>

              {/* Baseline */}
              <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + cH} y2={PAD.t + cH}
                stroke="#E2E8F0" strokeWidth={1} />

              {/* Bars per work order */}
              {rows.map((r, i) => {
                const cx         = PAD.l + i * gW + gW / 2;
                const bX         = cx - bW / 2;
                const assignedH  = (r.assigned / maxAssigned) * cH;
                const presentH   = (r.present  / maxAssigned) * cH;
                const shortfallH = assignedH - presentH;
                const isHv       = hover === i;
                const tipX       = Math.min(Math.max(cx - 52, PAD.l), W - PAD.r - 104);
                const tipYbase   = PAD.t + cH - assignedH - 62;
                const tipY       = Math.max(tipYbase, PAD.t + 2);

                return (
                  <g key={r.workOrderNumber} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}>

                    {/* Background: assigned bar (light blue) */}
                    <rect x={bX} y={PAD.t + cH - assignedH} width={bW} height={assignedH}
                      rx={3} fill="#BFDBFE"
                      opacity={hover !== null && !isHv ? 0.4 : 0.7} />

                    {/* Present bar (green, bottom portion) */}
                    {presentH > 0 && (
                      <rect x={bX} y={PAD.t + cH - presentH} width={bW} height={presentH}
                        rx={3} fill="#22C55E"
                        opacity={hover !== null && !isHv ? 0.4 : 0.85} />
                    )}

                    {/* Shortfall bar (red, top portion) */}
                    {shortfallH > 0 && (
                      <rect x={bX} y={PAD.t + cH - assignedH} width={bW} height={shortfallH}
                        rx={0} fill="#FCA5A5"
                        opacity={hover !== null && !isHv ? 0.4 : 0.82} />
                    )}

                    {/* Attendance % inside green bar */}
                    {presentH > 18 && (
                      <text x={cx} y={PAD.t + cH - presentH / 2 + 3}
                        textAnchor="middle" fontSize={7.5} fill="white" fontWeight={700}>
                        {r.attPct}%
                      </text>
                    )}

                    {/* Shortfall count on top of red bar */}
                    {shortfallH > 8 && (
                      <text x={cx} y={PAD.t + cH - assignedH - 3}
                        textAnchor="middle" fontSize={7} fill="#EF4444" fontWeight={700}>
                        -{r.shortfall}
                      </text>
                    )}

                    {/* X-axis label */}
                    <text x={cx} y={PAD.t + cH + 12}
                      textAnchor="middle" fontSize={7.5} fill="#64748B" fontWeight={500}>
                      {r.workOrderNumber.slice(-8)}
                    </text>

                    {/* Hover tooltip */}
                    {isHv && (
                      <g>
                        <rect x={tipX} y={tipY} width={104} height={56} rx={4} fill="#1E293B" />
                        <polygon
                          points={`${cx - 4},${PAD.t + cH - assignedH - 2} ${cx + 4},${PAD.t + cH - assignedH - 2} ${cx},${PAD.t + cH - assignedH + 4}`}
                          fill="#1E293B" />
                        <text x={tipX + 52} y={tipY + 12} textAnchor="middle" fontSize={8.5} fill="#F1F5F9" fontWeight={700}>{r.workOrderNumber}</text>
                        <text x={tipX + 52} y={tipY + 24} textAnchor="middle" fontSize={7.5} fill="#93C5FD">Assigned: {r.assigned}</text>
                        <text x={tipX + 52} y={tipY + 35} textAnchor="middle" fontSize={7.5} fill="#86EFAC">Present: {r.present} ({r.attPct}%)</text>
                        <text x={tipX + 52} y={tipY + 46} textAnchor="middle" fontSize={7.5} fill="#FCA5A5">Shortfall: {r.shortfall} → OT: {r.otHours.toLocaleString()} hrs</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* OT dashed line */}
              {rows.length > 1 && (
                <path d={otLinePath} fill="none" stroke="#F59E0B"
                  strokeWidth={1.5} strokeDasharray="5 2.5" />
              )}

              {/* OT dots */}
              {otPts.map((p, i) => (
                <g key={i} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}>
                  <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3}
                    fill="#F59E0B" stroke="white" strokeWidth={1.5}
                    style={{ transition: 'r 0.1s' }} />
                  {/* OT value label near dot */}
                  <text x={p.x} y={p.y - 6}
                    textAnchor="middle" fontSize={7} fill="#F59E0B" fontWeight={700}>
                    {(rows[i].otHours / 1000).toFixed(1)}k
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Per-WO summary cards */}
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
            {rows.map(r => {
              const attColor = r.attPct >= 90 ? '#15803D' : r.attPct >= 80 ? '#A16207' : '#DC2626';
              return (
                <div key={r.workOrderNumber} className="rounded-lg p-2.5 flex flex-col gap-1"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-[10px] font-bold truncate" style={{ color: '#374151' }}>
                    {r.workOrderNumber}
                  </p>
                  <div className="h-px" style={{ backgroundColor: '#E2E8F0' }} />
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>Assigned</span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: '#3B82F6' }}>{r.assigned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>Present</span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: attColor }}>
                      {r.present} <span className="text-[8px] font-normal">({r.attPct}%)</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>Shortfall</span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: '#EF4444' }}>
                      {r.shortfall > 0 ? `-${r.shortfall}` : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px]" style={{ color: '#9CA3AF' }}>OT Hours</span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: '#D97706' }}>
                      {r.otHours.toLocaleString()}
                    </span>
                  </div>
                  {r.otPerShortfall > 0 && (
                    <div className="mt-0.5 px-1.5 py-0.5 rounded text-center"
                      style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                      <span className="text-[9px] font-semibold" style={{ color: '#92400E' }}>
                        {r.otPerShortfall} OT hrs / absent person
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Data types ────────────────────────────────────────────────────────────────

type CardRow = { label: string; value: number | string; male?: number; female?: number; filter?: string };

interface DashboardData {
  attendanceSummary:      { values: CardRow[] };
  attendanceOtherMetrics: { values: CardRow[] };
  shiftDistribution:      { values: CardRow[] };
  liveOccupancy:          LiveOccupancy;
  totalEmployees:         number;
  trends?:                TrendsData;
  contractors:            ContractorAnalytics[];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AttendanceSummary() {
  const [drawerFilter, setDrawerFilter] = useState<EmployeeFilter | null>(null);
  const [data, setData]                 = useState<DashboardData | null>(null);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [lastUpdated, setLastUpdated]   = useState<Date>(new Date());
  const [loading, setLoading]           = useState(true);
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      setFetchError(null);

      const [cardsJson, trendJson, otJson] = await Promise.all([
        apiPost<{ data: Record<string, unknown> }>({ type: 'attendance', subtype: 'Attendance cards' }),
        apiPost<{ data: Record<string, unknown> }>({ type: 'attendance', subtype: 'Attendance Trend' }),
        apiPost<{ data: Record<string, unknown> }>({ type: 'attendance', subtype: 'Attendance OT Compensation' }),
      ]);

      const raw  = cardsJson?.data;
      const trRaw = trendJson?.data;
      const otRaw = otJson?.data;

      if (!raw) { setFetchError('API returned no data.'); return; }

      const ov  = raw.attendanceOverview      ?? {};
      const st  = raw.attendanceStatus        ?? {};
      const shifts: { shiftCode?: string; shiftName: string; totalEmployees: number; male: number; female: number }[] =
        raw.shiftWiseAttendance ?? [];
      const live = raw.employeesInsidePremises ?? {};

      // Trends come from the dedicated Attendance Trend subtype
      const tr = (trRaw?.attendanceTrends ?? trRaw?.trends ?? raw.attendanceTrends) ?? {};

      // Contractor OT data from dedicated OT Compensation subtype
      const otSource = otRaw ?? raw;
      const rawContractors: { contractor: string; workOrder: string; totalEmployees: number; presentEmployees: number; overtimeHours: number }[] =
        otSource.contractorAttendance ?? [];
      const contractorMap = new Map<string, WOAnalytics[]>();
      for (const c of rawContractors) {
        if (!contractorMap.has(c.contractor)) contractorMap.set(c.contractor, []);
        contractorMap.get(c.contractor)!.push({
          workOrderNumber: c.workOrder,
          totalEmployees:  c.totalEmployees,
          presentEmployees: c.presentEmployees,
          otHours:         c.overtimeHours,
        });
      }
      const contractors: ContractorAnalytics[] = Array.from(contractorMap.entries())
        .map(([name, workOrders]) => ({ name, workOrders }))
        .filter(c => c.workOrders.some(w => w.totalEmployees > 0));

      setData({
        totalEmployees: ov.totalEmployees ?? 0,
        attendanceSummary: {
          values: [
            { label: 'Total Employees',  value: ov.totalEmployees  ?? 0, male: ov.maleEmployees  ?? 0, female: ov.femaleEmployees  ?? 0 },
            { label: 'Total Present',    value: ov.presentEmployees ?? 0, male: ov.presentMale    ?? 0, female: ov.presentFemale    ?? 0, filter: 'att_total_present' },
            { label: 'Half-Day Present', value: ov.halfDayPresent   ?? 0, male: ov.halfDayMale    ?? 0, female: ov.halfDayFemale    ?? 0, filter: 'att_half_day' },
            { label: 'Total Absent',     value: ov.absentEmployees  ?? 0, male: ov.absentMale     ?? 0, female: ov.absentFemale     ?? 0, filter: 'att_total_absent' },
            { label: 'Attendance %',     value: `${ov.attendancePercentage ?? 0}%` },
          ],
        },
        attendanceOtherMetrics: {
          values: [
            { label: 'Weekly Off',   value: st.weeklyOff?.total   ?? 0, male: st.weeklyOff?.male   ?? 0, female: st.weeklyOff?.female   ?? 0, filter: 'att_weekly_off' },
            { label: 'Leave',        value: st.leave?.total        ?? 0, male: st.leave?.male        ?? 0, female: st.leave?.female        ?? 0, filter: 'att_leave' },
            { label: 'Holiday',      value: st.holiday?.total      ?? 0, male: st.holiday?.male      ?? 0, female: st.holiday?.female      ?? 0, filter: 'att_holiday' },
            { label: 'On Duty',      value: st.onDuty?.total       ?? 0, male: st.onDuty?.male       ?? 0, female: st.onDuty?.female       ?? 0, filter: 'att_on_duty' },
            { label: 'Missed Punch', value: st.missedPunch?.total  ?? 0, male: st.missedPunch?.male  ?? 0, female: st.missedPunch?.female  ?? 0, filter: 'att_missed_punch' },
          ],
        },
        shiftDistribution: {
          values: shifts.map(sh => ({
            label:  sh.shiftName,
            value:  sh.totalEmployees,
            male:   sh.male,
            female: sh.female,
            filter: sh.shiftCode === 'G' ? 'shift_general'  :
                    sh.shiftCode === 'A' ? 'shift_morning'   :
                    sh.shiftCode === 'B' ? 'shift_evening'   :
                    sh.shiftCode === 'C' ? 'shift_night'     : undefined,
          })),
        },
        liveOccupancy: {
          inside: live.total  ?? 0,
          male:   live.male   ?? 0,
          female: live.female ?? 0,
        },
        trends: {
          daily:     (tr.last7Days   ?? []) as DailyPoint[],
          weekly:    (tr.last5Weeks  ?? []) as WeeklyPoint[],
          monthly:   (tr.last6Months ?? []).map((m: { month: string; attendancePercentage: number; present: number }) =>
            ({ month: m.month, pct: m.attendancePercentage, present: m.present })) as MonthlyPoint[],
          quarterly: (tr.quarterly   ?? []) as QuarterlyPoint[],
          yearly:    (tr.last12Months ?? []).map((m: { month: string; attendancePercentage: number; present: number }) =>
            ({ month: m.month, pct: m.attendancePercentage, count: m.present })) as YearlyPoint[],
        },
        contractors,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Network error — check CORS or connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 60_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const buildValues = (rows: CardRow[] | undefined): AttendanceCardProps['values'] =>
    (rows ?? []).map(r => ({
      label:  r.label,
      value:  r.value,
      male:   typeof r.male === 'number' ? r.male : undefined,
      female: typeof r.female === 'number' ? r.female : undefined,
      filter: r.filter as EmployeeFilter | undefined,
    }));

  const cards: AttendanceCardProps[] = [
    {
      title: 'Attendance Overview',
      metrics: ['Total Employees', 'Total Present', 'Half-Day Present', 'Total Absent', 'Attendance %'],
      icon: Users,
      accentColor: '#2563EB',
      bgColor: '#EFF6FF',
      iconColor: '#1D4ED8',
      onViewList: setDrawerFilter,
      values: data
        ? buildValues(data.attendanceSummary?.values)
        : [
            { label: 'Total Employees',  value: '—' },
            { label: 'Total Present',    value: '—' },
            { label: 'Half-Day Present', value: '—' },
            { label: 'Total Absent',     value: '—' },
            { label: 'Attendance %',     value: '—' },
          ],
    },
    {
      title: 'Attendance Exceptions',
      metrics: ['Weekly Off', 'Leave', 'Holiday', 'On-Duty', 'Missed Punch'],
      icon: AlertTriangle,
      accentColor: '#D97706',
      bgColor: '#FFFBEB',
      iconColor: '#B45309',
      onViewList: setDrawerFilter,
      values: data
        ? buildValues(data.attendanceOtherMetrics?.values)
        : [
            { label: 'Weekly Off',   value: '—' },
            { label: 'Leave',        value: '—' },
            { label: 'Holiday',      value: '—' },
            { label: 'On Duty',      value: '—' },
            { label: 'Missed Punch', value: '—' },
          ],
    },
    {
      title: 'Shift Operations',
      metrics: ['Shift-wise Attendance'],
      icon: Clock,
      accentColor: '#0891B2',
      bgColor: '#ECFEFF',
      iconColor: '#0E7490',
      onViewList: setDrawerFilter,
      values: data
        ? buildValues(data.shiftDistribution?.values)
        : [
            { label: 'General Shift',   value: '—' },
            { label: 'Morning Shift',   value: '—' },
            { label: 'Afternoon Shift', value: '—' },
            { label: 'Night Shift',     value: '—' },
          ],
    },
  ];

  return (
    <div>
      {fetchError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Failed to load attendance data</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{fetchError}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 items-stretch">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl p-3 h-40 animate-pulse" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} />
            ))
          : (
            <>
              {cards.map((card) => (
                <AttendanceCard key={card.title} {...card} />
              ))}
              <InsidePremisesCard
                onViewList={setDrawerFilter}
                liveOccupancy={data?.liveOccupancy ?? { inside: 0, male: 0, female: 0 }}
                totalEmployees={data?.totalEmployees ?? 0}
                lastUpdated={lastUpdated}
              />
            </>
          )
        }
      </div>

      {/* ── Section Tabs ── */}
      <AttendanceSectionTabs data={data} />

      <EmployeeDrawer filter={drawerFilter} onClose={() => setDrawerFilter(null)} />
    </div>
  );
}

// ── Section Tabs component ────────────────────────────────────────────────────

type AttendanceTab = 'org' | 'trend' | 'late' | 'overtime' | 'shortfall';

function AttendanceSectionTabs({ data }: { data: DashboardData | null }) {
  const [tab, setTab] = useState<AttendanceTab>('org');

  const TABS: { key: AttendanceTab; label: string; icon: React.ElementType }[] = [
    { key: 'org',       label: 'Org Distribution',  icon: BarChart2  },
    { key: 'trend',     label: 'Attendance Trend',   icon: TrendingUp },
    { key: 'late',      label: 'Late / Early Out',   icon: Timer      },
    { key: 'overtime',  label: 'Overtime',           icon: Activity   },
    { key: 'shortfall', label: 'Shortfall & OT',     icon: GitMerge   },
  ];

  return (
    <div className="mt-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 flex-wrap p-1 rounded-xl mb-1" style={{ backgroundColor: '#F3F4F6' }}>
        {TABS.map(({ key, label, icon: TabIcon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 cursor-pointer flex-1 justify-center"
            style={tab === key
              ? { backgroundColor: '#FFFFFF', color: '#2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : { backgroundColor: 'transparent', color: '#6B7280' }}
          >
            <TabIcon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === 'org'       && <OrgAttendanceChart />}
      {tab === 'trend'     && <AttendanceTrendSection trends={data?.trends} />}
      {tab === 'late'      && <LateLeavingTrend />}
      {tab === 'overtime'  && <OvertimeAnalysis />}
      {tab === 'shortfall' && <AttendanceOTCorrelationChart contractors={data?.contractors ?? []} />}
    </div>
  );
}
