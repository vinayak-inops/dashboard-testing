import { useState, useEffect } from 'react';
import {
  Building2, Users, ShieldCheck, ShieldAlert, AlertTriangle, Clock,
  AlertCircle, ChevronUp, ChevronDown, BarChart2, Layers,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

interface VendorRow {
  name: string;
  workforce: number;
  attendance: number;
  compliance: number;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
}

interface SummaryData {
  totalVendors: number;
  vendorWorkforce: number;
  vendorCompliancePct: number;
  nonCompliantVendors: number;
  licenseExpiryAlerts: number;
  vendorAttendancePct: number;
}

interface WorkOrder {
  workOrderNumber: string;
  workOrderDate: string;
  vendorName?: string;
  NumberOfEmployee: number;
  contractPeriodFrom: string;
  contractPeriodTo: string;
  workOrderType: string;
  serviceLineItems: string;
  serviceCode: string;
}

// ── KPI card components ───────────────────────────────────────────────────────

interface HalfPanelProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  title: string;
  subtitle: string;
  noBorder?: boolean;
}

function HalfPanel({ icon: Icon, iconBg, iconColor, value, title, subtitle, noBorder }: HalfPanelProps) {
  return (
    <div className="flex-1 p-3" style={noBorder ? undefined : { borderRight: '1px solid #F1F5F9' }}>
      <div className="kpi-icon mb-1" style={{ backgroundColor: iconBg, color: iconColor }}>
        <Icon size={14} strokeWidth={1.75} />
      </div>
      <p className="kpi-value">{value}</p>
      <p className="kpi-title">{title}</p>
      <p className="kpi-subtitle">{subtitle}</p>
    </div>
  );
}

function DualKpiCard({ accentColor, left, right }: {
  accentColor: string;
  left: Omit<HalfPanelProps, 'noBorder'>;
  right: Omit<HalfPanelProps, 'noBorder'>;
}) {
  return (
    <div className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: accentColor }} />
      <div className="flex pt-1">
        <HalfPanel {...left} />
        <HalfPanel {...right} noBorder />
      </div>
    </div>
  );
}

function SingleKpiCard({ accentColor, icon: Icon, iconBg, iconColor, value, title, subtitle }: {
  accentColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: accentColor }} />
      <div className="p-3 pt-4">
        <div className="kpi-icon mb-1" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={14} strokeWidth={1.75} />
        </div>
        <p className="kpi-value">{value}</p>
        <p className="kpi-title">{title}</p>
        <p className="kpi-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 85) return '#15803D';
  if (s >= 70) return '#A16207';
  return '#DC2626';
}

function riskColor(r: VendorRow['risk']) {
  if (r === 'Low')    return { color: '#15803D', bg: '#DCFCE7' };
  if (r === 'Medium') return { color: '#A16207', bg: '#FEF9C3' };
  return { color: '#DC2626', bg: '#FEE2E2' };
}

function attColor(pct: number) {
  if (pct >= 88) return { color: '#15803D', bg: '#DCFCE7' };
  if (pct >= 50) return { color: '#A16207', bg: '#FEF9C3' };
  return { color: '#DC2626', bg: '#FEE2E2' };
}

function fmtDate(d: string) {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children, className = '' }: { title: string; subtitle: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`chart-container ${className}`}>
      <div className="mb-5">
        <h3 className="chart-title">{title}</h3>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
        <AlertCircle size={15} style={{ color: '#9CA3AF' }} />
      </div>
      <p className="text-xs" style={{ color: '#9CA3AF' }}>{message}</p>
    </div>
  );
}

// ── Compliance KPI card (compact with breakdown) ─────────────────────────────

function ComplianceKpiCard({ summary }: { summary: SummaryData | null }) {
  const nonCompliant = summary?.nonCompliantVendors ?? 0;
  const compliant    = (summary?.totalVendors ?? 0) - nonCompliant;
  const rate         = summary?.vendorCompliancePct ?? 0;
  const expiry       = summary?.licenseExpiryAlerts ?? 0;

  return (
    <div className="relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#EF4444' }} />
      <div className="p-3 pt-4">
        <div className="kpi-icon mb-1" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
          <ShieldAlert size={14} strokeWidth={1.75} />
        </div>
        <p className="kpi-value" style={{ color: '#DC2626' }}>{nonCompliant}</p>
        <p className="kpi-title">Non-Compliant Vendors</p>
        <p className="kpi-subtitle">Require immediate action</p>
        <div className="grid grid-cols-3 gap-1 mt-3 pt-2" style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="text-center">
            <p className="text-xs font-bold tabular-nums" style={{ color: '#15803D' }}>{compliant}</p>
            <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Compliant</p>
          </div>
          <div className="text-center" style={{ borderLeft: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9' }}>
            <p className="text-xs font-bold tabular-nums" style={{ color: '#374151' }}>{rate}%</p>
            <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold tabular-nums" style={{ color: expiry > 0 ? '#DC2626' : '#15803D' }}>{expiry}</p>
            <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Expiry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Vendor performance table ──────────────────────────────────────────────────

type SortKey = 'name' | 'workforce' | 'attendance' | 'compliance' | 'score' | 'risk';

function CombinedVendorTable({ vendors }: { vendors: VendorRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(false); }
  }

  const sorted = [...vendors].sort((a, b) => {
    const aVal = sortKey === 'risk' ? ({ High: 2, Medium: 1, Low: 0 }[a.risk] ?? 0) : a[sortKey as Exclude<SortKey, 'risk'>];
    const bVal = sortKey === 'risk' ? ({ High: 2, Medium: 1, Low: 0 }[b.risk] ?? 0) : b[sortKey as Exclude<SortKey, 'risk'>];
    if (typeof aVal === 'string' && typeof bVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const maxScore = Math.max(...vendors.map(v => v.score), 1);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={10} style={{ color: '#D1D5DB' }} />;
    return sortAsc ? <ChevronUp size={10} style={{ color: '#3B82F6' }} /> : <ChevronDown size={10} style={{ color: '#3B82F6' }} />;
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: 'name',       label: 'Vendor'     },
    { key: 'workforce',  label: 'Workforce'  },
    { key: 'attendance', label: 'Attendance' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'score',      label: 'Score'      },
    { key: 'risk',       label: 'Risk'       },
  ];

  return (
    <SectionCard title="Vendor Performance Overview" subtitle="Score, attendance & compliance — click column headers to sort">
      {vendors.length === 0 ? <EmptyState message="No vendor data available." /> : (
        <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
          <table className="w-full border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '30%' }} /><col style={{ width: '10%' }} /><col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} /><col style={{ width: '20%' }} /><col style={{ width: '14%' }} />
            </colgroup>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
              <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                {cols.map(c => (
                  <th key={c.key} className="pb-2 pt-1 text-left font-semibold text-[10px] uppercase tracking-wide pr-2 cursor-pointer select-none"
                    style={{ color: sortKey === c.key ? '#3B82F6' : '#9CA3AF' }} onClick={() => handleSort(c.key)}>
                    <span className="flex items-center gap-0.5">{c.label}<SortIcon col={c.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((v, i) => {
                const { color: rc, bg: rb } = riskColor(v.risk);
                const { color: ac }         = attColor(v.attendance);
                return (
                  <tr key={v.name} className="transition-colors"
                    style={{ borderBottom: i < sorted.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="py-2 pr-2 font-medium" style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.name}>{v.name}</td>
                    <td className="py-2 pr-2 tabular-nums font-semibold" style={{ color: '#111827' }}>{v.workforce.toLocaleString()}</td>
                    <td className="py-2 pr-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums" style={{ backgroundColor: attColor(v.attendance).bg, color: ac }}>{v.attendance}%</span>
                    </td>
                    <td className="py-2 pr-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                        style={{ backgroundColor: v.compliance >= 70 ? '#DCFCE7' : '#FEE2E2', color: v.compliance >= 70 ? '#15803D' : '#DC2626' }}>{v.compliance}%</span>
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(v.score / maxScore) * 100}%`, backgroundColor: scoreColor(v.score) }} />
                        </div>
                        <span className="text-[10px] font-bold w-5 text-right flex-shrink-0" style={{ color: scoreColor(v.score) }}>{v.score}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: rb, color: rc }}>{v.risk}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-4 mt-3 pt-3 text-[10px] flex-wrap" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[{ label: 'Score ≥85 Excellent', color: '#15803D' }, { label: 'Score 70–84 Average', color: '#A16207' }, { label: 'Score <70 Poor', color: '#DC2626' }].map(l => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
            <span style={{ color: '#6B7280' }}>{l.label}</span>
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Work Order helpers ────────────────────────────────────────────────────────

function contractProgress(from: string, to: string): number {
  const start = new Date(from).getTime();
  const end   = new Date(to).getTime();
  const now   = Date.now();
  if (!start || !end || end <= start) return 0;
  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
}

function woStatus(from: string, to: string): { label: string; color: string; bg: string } {
  const pct = contractProgress(from, to);
  if (pct >= 100) return { label: 'Expired',  color: '#DC2626', bg: '#FEE2E2' };
  if (pct > 0)    return { label: 'Active',   color: '#15803D', bg: '#DCFCE7' };
  return             { label: 'Upcoming', color: '#A16207', bg: '#FEF9C3' };
}

function groupByVendor(orders: WorkOrder[]): { vendor: string; orders: WorkOrder[] }[] {
  const map = new Map<string, WorkOrder[]>();
  for (const wo of orders) {
    const v = wo.vendorName || 'Unknown';
    if (!map.has(v)) map.set(v, []);
    map.get(v)!.push(wo);
  }
  return Array.from(map.entries())
    .map(([vendor, orders]) => ({ vendor, orders }))
    .sort((a, b) =>
      b.orders.reduce((s, w) => s + w.NumberOfEmployee, 0) -
      a.orders.reduce((s, w) => s + w.NumberOfEmployee, 0)
    );
}

// ── Vendor-grouped Gantt chart ────────────────────────────────────────────────

const BAR_PALETTE = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];

function VendorGanttChart({ workOrders }: { workOrders: WorkOrder[] }) {
  const VENDOR_H = 30;
  const WO_H     = 38;
  const LABEL_W  = 160;   // wider label column to avoid name/value overlap
  const PAD_Y    = 32;
  const PAD_R    = 70;    // right padding to show emp count outside bar
  const W        = 860;

  const groups   = groupByVendor(workOrders);
  const allDates = workOrders.flatMap(w => [new Date(w.contractPeriodFrom), new Date(w.contractPeriodTo)]);
  const minT     = Math.min(...allDates.map(d => d.getTime()));
  const maxT     = Math.max(...allDates.map(d => d.getTime()));
  const rangeT   = maxT - minT || 1;
  const chartW   = W - LABEL_W - PAD_R;
  const nowX     = LABEL_W + ((Date.now() - minT) / rangeT) * chartW;

  function xOf(ds: string) { return LABEL_W + ((new Date(ds).getTime() - minT) / rangeT) * chartW; }

  type Row =
    | { type: 'vendor'; label: string; totalEmp: number }
    | { type: 'order'; wo: WorkOrder; colorIdx: number };

  const rows: Row[] = [];
  for (const g of groups) {
    rows.push({ type: 'vendor', label: g.vendor, totalEmp: g.orders.reduce((s, w) => s + w.NumberOfEmployee, 0) });
    g.orders.forEach((wo, idx) => rows.push({ type: 'order', wo, colorIdx: idx }));
  }

  const yPos: number[] = [];
  let y = PAD_Y;
  for (const r of rows) { yPos.push(y); y += r.type === 'vendor' ? VENDOR_H : WO_H; }
  const H = y + 4;

  const startYear = new Date(minT).getFullYear();
  const endYear   = new Date(maxT).getFullYear() + 1;
  const ticks: number[] = [];
  for (let yr = startYear; yr <= endYear; yr++) ticks.push(new Date(yr, 0, 1).getTime());

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 520, border: '1px solid #F1F5F9', borderRadius: 8 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} fontFamily="system-ui, sans-serif">
        {/* Year grid */}
        {ticks.map(t => {
          const x = LABEL_W + ((t - minT) / rangeT) * chartW;
          if (x < LABEL_W || x > LABEL_W + chartW) return null;
          return (
            <g key={t}>
              <line x1={x} y1={PAD_Y - 8} x2={x} y2={H - 4} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="3 3" />
              <text x={x + 3} y={PAD_Y - 14} fontSize={9} fill="#9CA3AF">{new Date(t).getFullYear()}</text>
            </g>
          );
        })}

        {/* Today line */}
        {nowX >= LABEL_W && nowX <= LABEL_W + chartW && (
          <g>
            <line x1={nowX} y1={PAD_Y - 8} x2={nowX} y2={H - 4} stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 3" />
            <rect x={nowX - 14} y={0} width={28} height={16} rx={3} fill="#EF4444" />
            <text x={nowX} y={11} textAnchor="middle" fontSize={8} fill="white" fontWeight={700}>Today</text>
          </g>
        )}

        {/* Rows */}
        {rows.map((row, idx) => {
          const ry = yPos[idx];

          if (row.type === 'vendor') {
            return (
              <g key={`v-${row.label}`}>
                <rect x={0} y={ry} width={W} height={VENDOR_H} fill="#EFF6FF" />
                <line x1={0} y1={ry} x2={W} y2={ry} stroke="#BFDBFE" strokeWidth={1} />
                {/* Vendor name — strictly in label column, truncated visually via clipPath */}
                <text x={10} y={ry + VENDOR_H / 2 + 4} fontSize={10} fill="#1E3A5F" fontWeight={700}>
                  {row.label}
                </text>
                {/* Total emp — placed in right PAD_R area, clearly separated */}
                <text x={W - 6} y={ry + VENDOR_H / 2 + 4} textAnchor="end" fontSize={9} fill="#1D4ED8" fontWeight={700}>
                  {row.totalEmp.toLocaleString()} emp
                </text>
              </g>
            );
          }

          const { wo, colorIdx } = row;
          const barColor  = BAR_PALETTE[colorIdx % BAR_PALETTE.length];
          const { color: statusColor, bg: statusBg } = woStatus(wo.contractPeriodFrom, wo.contractPeriodTo);
          const x1    = xOf(wo.contractPeriodFrom);
          const x2    = xOf(wo.contractPeriodTo);
          const barW  = Math.max(x2 - x1, 4);
          const pct   = contractProgress(wo.contractPeriodFrom, wo.contractPeriodTo);

          // Emp count shown to the RIGHT of the bar in the PAD_R zone
          const empX  = Math.min(x2 + 8, W - 4);

          return (
            <g key={wo.workOrderNumber}>
              {/* WO number label — right-aligned in label column */}
              <text x={LABEL_W - 8} y={ry + WO_H / 2 + 4} textAnchor="end" fontSize={8.5} fill="#64748B">{wo.workOrderNumber}</text>
              {/* bar track (full contract period) */}
              <rect x={x1} y={ry + 9} width={barW} height={WO_H - 20} rx={4} fill={statusBg} />
              {/* progress fill */}
              <rect x={x1} y={ry + 9} width={barW * (pct / 100)} height={WO_H - 20} rx={4} fill={barColor} opacity={0.88} />
              {/* Status dot at bar end */}
              <circle cx={x2} cy={ry + WO_H / 2} r={4} fill={statusColor} />
              {/* Emp count OUTSIDE bar in PAD_R zone — always visible */}
              <text x={empX} y={ry + WO_H / 2 + 4} textAnchor="start" fontSize={8.5} fill="#374151" fontWeight={600}>
                {wo.NumberOfEmployee}
              </text>
              {/* Row separator */}
              <line x1={LABEL_W} y1={ry + WO_H - 1} x2={LABEL_W + chartW} y2={ry + WO_H - 1} stroke="#F1F5F9" strokeWidth={0.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Vendor-grouped Employees chart ───────────────────────────────────────────

function VendorEmpChart({ workOrders }: { workOrders: WorkOrder[] }) {
  const groups = groupByVendor(workOrders);
  const maxEmp = Math.max(...workOrders.map(w => w.NumberOfEmployee), 1);

  return (
    <div className="overflow-y-auto space-y-4 pr-1" style={{ maxHeight: 480 }}>
      {groups.map(g => {
        const totalEmp = g.orders.reduce((s, w) => s + w.NumberOfEmployee, 0);
        return (
          <div key={g.vendor} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            {/* Vendor header */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: '#EFF6FF' }}>
              <span className="text-xs font-bold" style={{ color: '#1E3A5F' }}>{g.vendor}</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span style={{ color: '#6B7280' }}>{g.orders.length} order{g.orders.length > 1 ? 's' : ''}</span>
                <span className="font-bold tabular-nums" style={{ color: '#1D4ED8' }}>{totalEmp.toLocaleString()} total</span>
              </div>
            </div>

            {/* Work order rows */}
            {g.orders.map((wo, i) => {
              const barColor = BAR_PALETTE[i % BAR_PALETTE.length];
              const { label: statusLabel, color: statusColor, bg: statusBg } = woStatus(wo.contractPeriodFrom, wo.contractPeriodTo);
              const pct = contractProgress(wo.contractPeriodFrom, wo.contractPeriodTo);
              return (
                <div key={wo.workOrderNumber} className="px-4 py-3"
                  style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: barColor }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#374151' }}>{wo.workOrderNumber}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusBg, color: statusColor }}>{statusLabel}</span>
                      <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{wo.workOrderType}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: '#6B7280' }}>
                      {fmtDate(wo.contractPeriodFrom)} — {fmtDate(wo.contractPeriodTo)}
                    </span>
                  </div>

                  {/* Employee bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>Employees</span>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: '#374151' }}>{wo.NumberOfEmployee}</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(wo.NumberOfEmployee / maxEmp) * 100}%`, backgroundColor: barColor }} />
                    </div>
                  </div>

                  {/* Contract progress */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>Contract progress</span>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: statusColor }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: statusColor }} />
                    </div>
                  </div>

                  {/* Meta chips — no WC/Emp */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
                    {[
                      { k: 'Code',    v: wo.serviceCode },
                      { k: 'Service', v: wo.serviceLineItems },
                    ].map(m => (
                      <span key={m.k} className="px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                        <strong style={{ color: '#374151' }}>{m.k}: </strong>{m.v}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Work Orders full section ──────────────────────────────────────────────────

function WorkOrdersSection({ workOrders, loading }: { workOrders: WorkOrder[]; loading: boolean }) {
  const [tab, setTab] = useState<'gantt' | 'vendors'>('gantt');
  const data    = workOrders;
  const groups  = groupByVendor(data);
  const active  = data.filter(w => { const p = contractProgress(w.contractPeriodFrom, w.contractPeriodTo); return p > 0 && p < 100; }).length;
  const expired = data.filter(w => contractProgress(w.contractPeriodFrom, w.contractPeriodTo) >= 100).length;
  const upcoming = data.length - active - expired;
  const totalEmp = data.reduce((s, w) => s + w.NumberOfEmployee, 0);

  return (
    <div className="chart-container">
      <div className="mb-4">
        <h3 className="chart-title">Work Order Details</h3>
        <p className="chart-subtitle">Vendor-wise contract timelines and employee allocation</p>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-5 gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
        {[
          { label: 'Vendors',      value: groups.length, color: '#1D4ED8', bg: '#DBEAFE' },
          { label: 'Total Orders', value: data.length,   color: '#374151', bg: '#F3F4F6' },
          { label: 'Active',       value: active,        color: '#15803D', bg: '#DCFCE7' },
          { label: 'Upcoming',     value: upcoming,      color: '#A16207', bg: '#FEF9C3' },
          { label: 'Expired',      value: expired,       color: '#DC2626', bg: '#FEE2E2' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: k.bg }}>
            <p className="text-base font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6B7280' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Total employees strip */}
      <div className="flex items-center justify-between mb-4 rounded-xl px-4 py-2.5" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
        <span className="text-xs" style={{ color: '#1D4ED8' }}>Total employees across all work orders</span>
        <span className="text-sm font-bold" style={{ color: '#1D4ED8' }}>{totalEmp.toLocaleString()}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
        {([['gantt', 'Contract Timeline'], ['vendors', 'Vendor-wise Orders']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 text-xs font-semibold py-1.5 rounded-md transition-all"
            style={{
              backgroundColor: tab === key ? '#FFFFFF' : 'transparent',
              color: tab === key ? '#111827' : '#6B7280',
              boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="animate-pulse rounded-xl h-14" style={{ backgroundColor: '#F3F4F6' }} />)}
        </div>
      ) : tab === 'gantt' ? (
        <>
          <VendorGanttChart workOrders={data} />
          <div className="flex items-center gap-5 mt-3 pt-3 text-[10px]" style={{ borderTop: '1px solid #F3F4F6' }}>
            {[{ label: 'Active', color: '#15803D' }, { label: 'Upcoming', color: '#A16207' }, { label: 'Expired', color: '#DC2626' }].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: l.color, opacity: 0.8 }} />
                <span style={{ color: '#6B7280' }}>{l.label}</span>
              </span>
            ))}
            <span className="flex items-center gap-1 ml-auto">
              <span className="w-5 border-t-2 border-dashed flex-shrink-0" style={{ borderColor: '#EF4444' }} />
              <span style={{ color: '#6B7280' }}>Today</span>
            </span>
          </div>
        </>
      ) : (
        <VendorEmpChart workOrders={data} />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const API_URL = 'https://devai.clms.in/webhook/clms-dashboard-new';

function postApi(type: string) {
  return fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ type, tenantCode: 'AAL' }),
  }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}

export default function VendorPerformance() {
  const [vendors,    setVendors]    = useState<VendorRow[]>([]);
  const [summary,    setSummary]    = useState<SummaryData | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [woLoading,  setWoLoading]  = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function loadWorkOrdersFromSupabase() {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('vendor_name');
    if (!error && data && data.length > 0) {
      setWorkOrders(data.map(r => ({
        workOrderNumber:   r.work_order_number,
        workOrderDate:     r.work_order_date ?? '',
        vendorName:        r.vendor_name ?? undefined,
        NumberOfEmployee:  r.number_of_employee,
        contractPeriodFrom:r.contract_period_from,
        contractPeriodTo:  r.contract_period_to,
        workOrderType:     r.work_order_type,
        serviceLineItems:  r.service_line_items,
        serviceCode:       r.service_code,
      })));
    }
    setWoLoading(false);
  }

  useEffect(() => {
    postApi('vendor_performance')
      .then(json => {
        if (json?.summary) setSummary(json.summary);
        if (Array.isArray(json?.topVendors)) setVendors(json.topVendors as VendorRow[]);

        if (Array.isArray(json?.workOrders) && json.workOrders.length > 0) {
          setWorkOrders(json.workOrders.map((w: Record<string, unknown>) => ({
            workOrderNumber:    String(w.workOrderNumber   ?? ''),
            workOrderDate:      String(w.workOrderDate     ?? ''),
            vendorName:         w.vendorName != null ? String(w.vendorName) : undefined,
            NumberOfEmployee:   Number(w.numberOfEmployee  ?? 0),
            contractPeriodFrom: String(w.contractPeriodFrom ?? ''),
            contractPeriodTo:   String(w.contractPeriodTo   ?? ''),
            workOrderType:      String(w.workOrderType      ?? ''),
            serviceLineItems:   String(w.serviceLineItems   ?? ''),
            serviceCode:        String(w.serviceCode        ?? ''),
          })));
          setWoLoading(false);
        } else {
          loadWorkOrdersFromSupabase();
        }
      })
      .catch((err: Error) => {
        setFetchError(err.message);
        loadWorkOrdersFromSupabase();
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#111827' }}>Vendor Performance</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Real-time overview of all vendor metrics and compliance status</p>
        </div>
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
          {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {fetchError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Failed to load vendor data</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{fetchError}</p>
          </div>
        </div>
      )}

      {/* KPI Cards — 4 compact cards in a row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative bg-white rounded-xl border animate-pulse"
              style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: 110 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#F3F4F6' }} />
              <div className="p-3 pt-4 space-y-2">
                <div className="w-7 h-7 rounded-lg" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="h-5 w-12 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="h-2.5 w-24 rounded" style={{ backgroundColor: '#F3F4F6' }} />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Card 1: Total Vendors + Vendor Workforce */}
            <DualKpiCard
              accentColor="#3B82F6"
              left={{
                icon: Building2,
                iconBg: '#DBEAFE', iconColor: '#1D4ED8',
                value: String(summary?.totalVendors ?? 0),
                title: 'Total Vendors',
                subtitle: 'Active accounts',
              }}
              right={{
                icon: Users,
                iconBg: '#F3F4F6', iconColor: '#6B7280',
                value: (summary?.vendorWorkforce ?? 0).toLocaleString(),
                title: 'Vendor Workforce',
                subtitle: 'Employees under vendors',
              }}
            />

            {/* Card 2: Non-Compliant with breakdown */}
            <ComplianceKpiCard summary={summary} />

            {/* Card 3: Compliance % + Attendance % */}
            <DualKpiCard
              accentColor="#22C55E"
              left={{
                icon: ShieldCheck,
                iconBg: '#DCFCE7', iconColor: '#15803D',
                value: `${summary?.vendorCompliancePct ?? 0}%`,
                title: 'Compliance',
                subtitle: 'Rate across vendors',
              }}
              right={{
                icon: Clock,
                iconBg: '#DCFCE7', iconColor: '#15803D',
                value: `${summary?.vendorAttendancePct ?? 0}%`,
                title: 'Attendance',
                subtitle: 'Average rate',
              }}
            />

            {/* Card 4: License Expiry Alerts */}
            <SingleKpiCard
              accentColor="#F59E0B"
              icon={AlertTriangle}
              iconBg="#FEF9C3" iconColor="#A16207"
              value={String(summary?.licenseExpiryAlerts ?? 0)}
              title="Expiry Alerts"
              subtitle="Licenses expiring in 30 days"
            />
          </>
        )}
      </div>

      {/* Section Tabs */}
      {(() => {
        const TABS: { key: 'overview' | 'workorders'; label: string; icon: React.ElementType }[] = [
          { key: 'overview',   label: 'Vendor Overview', icon: BarChart2 },
          { key: 'workorders', label: 'Work Orders',      icon: Layers    },
        ];
        return <VendorSectionTabs vendors={vendors} workOrders={workOrders} woLoading={woLoading} />;
      })()}
    </div>
  );
}

type VendorSectionTab = 'overview' | 'workorders';

function VendorSectionTabs({ vendors, workOrders, woLoading }: { vendors: VendorRow[]; workOrders: WorkOrder[]; woLoading: boolean }) {
  const [tab, setTab] = useState<VendorSectionTab>('overview');

  const TABS: { key: VendorSectionTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview',   label: 'Vendor Overview', icon: BarChart2 },
    { key: 'workorders', label: 'Work Orders',      icon: Layers    },
  ];

  return (
    <div className="mt-4">
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

      {tab === 'overview'   && <CombinedVendorTable vendors={vendors} />}
      {tab === 'workorders' && <WorkOrdersSection workOrders={workOrders} loading={woLoading} />}
    </div>
  );
}
