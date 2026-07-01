import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { WorkforceOrgDistribution } from '../lib/supabase';

interface OrgDistributionChartProps { data: WorkforceOrgDistribution[]; contractors: ContractorRow[]; error?: string | null; }

type Dimension = 'subsidiary' | 'region' | 'state' | 'location' | 'department' | 'sub_department' | 'contractor';

const TABS: { key: Dimension; label: string }[] = [
  { key: 'subsidiary',    label: 'Subsidiary' },
  { key: 'region',        label: 'Region' },
  { key: 'state',         label: 'State' },
  { key: 'location',      label: 'Location' },
  { key: 'department',    label: 'Department' },
  { key: 'sub_department',label: 'Sub-Dept' },
  { key: 'contractor',    label: 'Contractor' },
];

const COLOR_SETS: string[][] = [
  ['#DBEAFE','#BFDBFE','#93C5FD','#60A5FA','#3B82F6','#2563EB','#1D4ED8'],
  ['#D1FAE5','#A7F3D0','#6EE7B7','#34D399','#10B981','#059669','#047857'],
  ['#FEF9C3','#FDE68A','#FCD34D','#FBBF24','#F59E0B','#D97706','#B45309'],
  ['#FFE4E6','#FECDD3','#FCA5A5','#F87171','#EF4444','#DC2626','#B91C1C'],
  ['#CFFAFE','#A5F3FC','#67E8F9','#22D3EE','#06B6D4','#0891B2','#0E7490'],
  ['#E0E7FF','#C7D2FE','#A5B4FC','#818CF8','#6366F1','#4F46E5','#4338CA'],
  ['#FEF3C7','#FDE68A','#FCD34D','#FBBF24','#F59E0B','#D97706','#92400E'],
];

export interface ContractorRow {
  id: string;
  name: string;
  category: string;
  count: number;
  status: 'Active' | 'Inactive';
  endDate: string | null;
}

const STATUS_STYLE = {
  Active:   { dot: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  Inactive: { dot: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280' },
};

const CAT_COLORS = [
  '#3B82F6','#10B981','#F59E0B','#EF4444','#06B6D4',
  '#6366F1','#EC4899','#84CC16','#F97316','#8B5CF6',
];

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function ContractorPanel({ contractors }: { contractors: ContractorRow[] }) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  if (contractors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
          <AlertCircle size={16} style={{ color: '#DC2626' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>No contractor data available</p>
        <p className="text-[10px]" style={{ color: '#9CA3AF' }}>No contractor distribution returned from the API.</p>
      </div>
    );
  }

  const rows = contractors.filter(c => statusFilter === 'all' || c.status === statusFilter);
  const maxCount = Math.max(...contractors.map(c => c.count), 1);
  const totalActive   = contractors.filter(c => c.status === 'Active').reduce((s, c) => s + c.count, 0);
  const totalInactive = contractors.filter(c => c.status === 'Inactive').reduce((s, c) => s + c.count, 0);
  const grandTotal    = totalActive + totalInactive;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'all',      label: 'All',      count: grandTotal,    dotColor: '#6B7280' },
          { key: 'Active',   label: 'Active',   count: totalActive,   dotColor: '#22C55E' },
          { key: 'Inactive', label: 'Inactive', count: totalInactive, dotColor: '#9CA3AF' },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer"
            style={statusFilter === f.key
              ? { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.dotColor }} />
            {f.label}
            <span className="text-[10px] tabular-nums ml-0.5">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Contractor rows */}
      <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
        {rows.map((c, i) => {
          const s      = STATUS_STYLE[c.status];
          const days   = daysUntil(c.endDate);
          const expiring = days !== null && days <= 90 && days > 0;
          const expired  = days !== null && days <= 0;
          const barPct = (c.count / maxCount) * 100;

          return (
            <div key={c.id} className="rounded-xl border p-2.5" style={{ backgroundColor: '#F9FAFB', borderColor: '#F3F4F6' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: CAT_COLORS[i % CAT_COLORS.length] + '22', color: CAT_COLORS[i % CAT_COLORS.length] }}>
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold truncate" style={{ color: '#111827' }}>{c.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {expiring && <AlertCircle size={12} style={{ color: '#F59E0B' }} title={`Expires in ${days} days`} />}
                  {expired  && <AlertCircle size={12} style={{ color: '#EF4444' }} title="Contract expired" />}
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#111827' }}>{c.count}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: '#E5E7EB' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${barPct}%`, backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{c.category}</span>
                {c.endDate && (
                  <>
                    <span className="text-[10px]" style={{ color: '#E5E7EB' }}>·</span>
                    <span
                      className="text-[10px]"
                      style={expired
                        ? { color: '#EF4444', fontWeight: 600 }
                        : expiring
                          ? { color: '#D97706', fontWeight: 600 }
                          : { color: '#9CA3AF' }}
                    >
                      {expired ? 'Expired' : 'Ends'}{' '}
                      {new Date(c.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {expiring && ` (${days}d)`}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
        <p className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>Status Split</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-px">
          <div style={{ width: `${(totalActive / grandTotal) * 100}%`, backgroundColor: '#22C55E' }} title={`Active: ${totalActive}`} />
          <div style={{ width: `${(totalInactive / grandTotal) * 100}%`, backgroundColor: '#D1D5DB' }} title={`Inactive: ${totalInactive}`} />
        </div>
        <div className="flex gap-4 mt-1.5">
          {([['Active', '#22C55E', totalActive], ['Inactive', '#D1D5DB', totalInactive]] as const).map(([label, color, cnt]) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px]" style={{ color: '#6B7280' }}>{label} ({cnt})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrgDistributionChart({ data, contractors, error }: OrgDistributionChartProps) {
  const [active, setActive] = useState<Dimension>('department');

  if (error) {
    return (
      <div className="chart-container flex flex-col">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-1">
          <div>
            <h3 className="chart-title">Organizational Distribution</h3>
            <p className="chart-subtitle">Workforce concentration by dimension</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-4 py-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={16} style={{ color: '#DC2626' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Unable to load data</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filtered = data.filter(d => d.dimension === active).sort((a, b) => a.sort_order - b.sort_order);
  const maxCount = Math.max(...filtered.map(d => d.count), 1);
  const total = filtered.reduce((s, d) => s + d.count, 0);
  const colorSet = COLOR_SETS[TABS.findIndex(t => t.key === active) % COLOR_SETS.length];

  return (
    <div className="chart-container flex flex-col">
      <div className="flex items-start justify-between mb-2 flex-wrap gap-1">
        <div>
          <h3 className="chart-title">Organizational Distribution</h3>
          <p className="chart-subtitle">
            {active === 'contractor'
              ? 'Contractor headcount, status & contract end dates'
              : `Workforce concentration by ${TABS.find(t => t.key === active)?.label}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActive(tab.key)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={active === tab.key
              ? { backgroundColor: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }
              : { backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'contractor' ? (
        <ContractorPanel contractors={contractors} />
      ) : (
        <>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-64 pr-1">
            {filtered.map((d, i) => {
              const barPct = (d.count / maxCount) * 100;
              const color = colorSet[Math.min(i + 2, colorSet.length - 1)];
              return (
                <div key={d.id}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] truncate max-w-[160px]" style={{ color: '#374151' }} title={d.label}>{d.label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: '#111827' }}>{d.count.toLocaleString()}</span>
                      <span className="text-[10px] tabular-nums w-9 text-right" style={{ color: '#9CA3AF' }}>{d.pct}%</span>
                    </div>
                  </div>
                  <div className="h-4 rounded overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="h-full rounded transition-all duration-500" style={{ width: `${barPct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
            <p className="text-[10px] mb-2 uppercase tracking-wide font-semibold" style={{ color: '#9CA3AF' }}>Distribution</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-px">
              {filtered.map((d, i) => (
                <div key={d.id} className="transition-all duration-500"
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
