import { Shield, AlertTriangle, TrendingDown, FileWarning, CheckCircle, DollarSign, ClipboardCheck, Zap, Clock, TrendingUp, BarChart2, Users, Award } from 'lucide-react';

// ── Shared primitives ─────────────────────────────────────────────────────────

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: bg, color }}>
      {label}
    </span>
  );
}

function HBar({ pct, color, height = 6 }: { pct: number; color: string; height?: number }) {
  return (
    <div className="rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6', height }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

function MetricRow({ label, value, valueColor = '#111827', sub }: { label: string; value: string | number; valueColor?: string; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5" style={{ borderBottom: '1px solid #F9FAFB' }}>
      <span className="text-xs flex-1 leading-tight" style={{ color: '#6B7280' }}>{label}</span>
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold tabular-nums" style={{ color: valueColor }}>{value}</span>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, iconColor, iconBg }: { icon: React.ElementType; title: string; subtitle: string; iconColor: string; iconBg: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div>
        <h3 className="text-sm font-bold" style={{ color: '#111827' }}>{title}</h3>
        <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentColor: string;
  bgColor: string;
  iconColor: string;
  children: React.ReactNode;
  badge?: { label: string; color: string; bg: string };
}

function ComplianceKpiCard({ title, subtitle, icon: Icon, accentColor, bgColor, iconColor, children, badge }: KpiCardProps) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold leading-tight" style={{ color: '#111827' }}>{title}</h3>
            {badge && <Pill label={badge.label} color={badge.color} bg={badge.bg} />}
          </div>
          <p className="text-[11px] mt-0.5 leading-tight" style={{ color: '#9CA3AF' }}>{subtitle}</p>
        </div>
      </div>
      <div className="h-px" style={{ backgroundColor: '#F3F4F6' }} />
      <div className="flex-1 flex flex-col gap-0.5">{children}</div>
      <div className="h-1 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
    </div>
  );
}

function BigScore({ value, unit, color }: { value: string | number; unit?: string; color: string }) {
  return (
    <div className="flex items-end gap-1 mb-1">
      <span className="text-3xl font-extrabold tabular-nums leading-none" style={{ color }}>{value}</span>
      {unit && <span className="text-sm font-semibold mb-0.5" style={{ color: '#9CA3AF' }}>{unit}</span>}
    </div>
  );
}

function AlertRow({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) {
  return (
    <div className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #F9FAFB' }}>
      <span className="text-xs" style={{ color: '#6B7280' }}>{label}</span>
      <span className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>{count}</span>
    </div>
  );
}

// ── Chart 1: License Expiry Dashboard ────────────────────────────────────────

const LICENSE_DATA = [
  { label: '≤ 30 Days', count: 8,  color: '#DC2626', bg: '#FEE2E2', pct: 100 },
  { label: '31–60 Days', count: 14, color: '#D97706', bg: '#FEF3C7', pct: 70 },
  { label: '61–90 Days', count: 21, color: '#2563EB', bg: '#DBEAFE', pct: 50 },
];

function LicenseExpiryChart() {
  const maxCount = Math.max(...LICENSE_DATA.map(d => d.count));
  return (
    <ChartCard>
      <SectionHeader icon={Clock} title="License Expiry Dashboard" subtitle="Contractors by license expiry window" iconColor="#B91C1C" iconBg="#FEF2F2" />
      <div className="space-y-4">
        {LICENSE_DATA.map(d => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-medium" style={{ color: '#374151' }}>{d.label}</span>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: d.color }}>{d.count} contractors</span>
            </div>
            <div className="h-7 rounded-lg overflow-hidden relative" style={{ backgroundColor: '#F9FAFB' }}>
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center"
                style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: d.bg }}
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <span className="text-[11px] font-semibold" style={{ color: d.color }}>
                  {Math.round((d.count / 142) * 100)}% of total contractors
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #F3F4F6' }}>
        <span className="text-[11px]" style={{ color: '#6B7280' }}>Total tracked: <strong style={{ color: '#111827' }}>43</strong> contractors</span>
        <Pill label="8 require immediate action" color="#B91C1C" bg="#FEE2E2" />
      </div>
    </ChartCard>
  );
}

// ── Chart 2: Statutory Compliance Status ─────────────────────────────────────

const STATUTORY_DATA = [
  { label: 'Labor Law Compliance', pct: 86.4, color: '#2563EB' },
  { label: 'CLRA Compliance',      pct: 89.2, color: '#0891B2' },
  { label: 'PF Compliance',        pct: 91.4, color: '#059669' },
  { label: 'ESI Compliance',       pct: 88.7, color: '#10B981' },
  { label: 'Bonus Compliance',     pct: 94.1, color: '#047857' },
  { label: 'Gratuity Compliance',  pct: 92.8, color: '#065F46' },
  { label: 'Minimum Wage Compliance', pct: 97.8, color: '#1D4ED8' },
];

function statusColor(pct: number) {
  if (pct >= 95) return { color: '#047857', bg: '#D1FAE5', label: 'Good' };
  if (pct >= 85) return { color: '#B45309', bg: '#FEF3C7', label: 'Monitor' };
  return { color: '#B91C1C', bg: '#FEE2E2', label: 'At Risk' };
}

function StatutoryComplianceChart() {
  return (
    <ChartCard>
      <SectionHeader icon={CheckCircle} title="Statutory Compliance Status" subtitle="Labor law compliance across all categories" iconColor="#047857" iconBg="#ECFDF5" />
      <div className="space-y-3">
        {STATUTORY_DATA.map(d => {
          const s = statusColor(d.pct);
          return (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#374151' }}>{d.label}</span>
                <div className="flex items-center gap-2">
                  <Pill label={s.label} color={s.color} bg={s.bg} />
                  <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: '#111827' }}>{d.pct}%</span>
                </div>
              </div>
              <HBar pct={d.pct} color={d.color} height={6} />
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// ── Chart 3: Workforce Documentation Compliance ───────────────────────────────

const DOC_METRICS = [
  { label: 'Aadhaar Verified',      pct: 94.2, color: '#2563EB' },
  { label: 'PAN Verified',          pct: 91.8, color: '#7C3AED' },
  { label: 'Bank Verified',         pct: 88.3, color: '#0891B2' },
  { label: 'Medical Fitness',       pct: 79.6, color: '#D97706' },
  { label: 'Police Verification',   pct: 72.1, color: '#DC2626' },
  { label: 'Training Compliance',   pct: 85.4, color: '#059669' },
  { label: 'PPE Compliance',        pct: 83.9, color: '#10B981' },
];

function DocumentationComplianceChart() {
  return (
    <ChartCard>
      <SectionHeader icon={FileWarning} title="Workforce Documentation Compliance" subtitle="Workers with complete verified records" iconColor="#7C3AED" iconBg="#F5F3FF" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {DOC_METRICS.map(d => {
          const s = statusColor(d.pct);
          return (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px]" style={{ color: '#6B7280' }}>{d.label}</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: s.color }}>{d.pct}%</span>
              </div>
              <HBar pct={d.pct} color={d.color} height={5} />
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 grid grid-cols-3 gap-2 text-center" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[
          { label: 'Fully Compliant', val: '68.4%', color: '#047857' },
          { label: 'Partial Records', val: '24.2%', color: '#B45309' },
          { label: 'Non-Compliant',   val: '7.4%',  color: '#B91C1C' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.val}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ── Chart 4: High-Risk Compliance Alerts ─────────────────────────────────────

const HIGH_RISK_ALERTS = [
  { label: 'Expired Contractor License', count: 8,  severity: 'critical' as const },
  { label: 'Missing PF Submission',      count: 14, severity: 'critical' as const },
  { label: 'Missing ESI Submission',     count: 11, severity: 'major' as const },
  { label: 'Unverified Workers',         count: 37, severity: 'major' as const },
  { label: 'No Medical Fitness',         count: 52, severity: 'major' as const },
  { label: 'No Police Verification',     count: 89, severity: 'minor' as const },
  { label: 'PPE Non-Compliance',         count: 63, severity: 'minor' as const },
];

const SEV = {
  critical: { color: '#B91C1C', bg: '#FEE2E2', dot: '#DC2626' },
  major:    { color: '#B45309', bg: '#FEF3C7', dot: '#D97706' },
  minor:    { color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
};

function HighRiskAlertsChart() {
  const total = HIGH_RISK_ALERTS.reduce((s, d) => s + d.count, 0);
  return (
    <ChartCard>
      <SectionHeader icon={AlertTriangle} title="High-Risk Compliance Alerts" subtitle="Critical violations requiring management attention" iconColor="#B91C1C" iconBg="#FEF2F2" />
      <div className="space-y-1">
        {HIGH_RISK_ALERTS.map(d => {
          const s = SEV[d.severity];
          return (
            <div key={d.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F9FAFB' }}>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
                <span className="text-xs" style={{ color: '#374151' }}>{d.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                  {d.severity}
                </span>
                <span className="text-sm font-bold tabular-nums w-8 text-right" style={{ color: s.color }}>{d.count}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #F3F4F6' }}>
        <span className="text-[11px]" style={{ color: '#6B7280' }}>Total open alerts: <strong style={{ color: '#111827' }}>{total}</strong></span>
        <div className="flex gap-2">
          {(['critical', 'major', 'minor'] as const).map(k => (
            <span key={k} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: SEV[k].bg, color: SEV[k].color }}>
              {HIGH_RISK_ALERTS.filter(d => d.severity === k).reduce((s, d) => s + d.count, 0)} {k}
            </span>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ── Chart 5: Compliance Trend ─────────────────────────────────────────────────

const TREND_DATA = [
  { month: 'Jan', pct: 78 },
  { month: 'Feb', pct: 81 },
  { month: 'Mar', pct: 79 },
  { month: 'Apr', pct: 83 },
  { month: 'May', pct: 86 },
  { month: 'Jun', pct: 85 },
  { month: 'Jul', pct: 88 },
  { month: 'Aug', pct: 87 },
  { month: 'Sep', pct: 90 },
  { month: 'Oct', pct: 91 },
  { month: 'Nov', pct: 92 },
  { month: 'Dec', pct: 85 },
];

function ComplianceTrendChart() {
  const W = 560, H = 160, pad = { top: 16, right: 16, bottom: 28, left: 36 };
  const minV = 70, maxV = 100;
  const xs = TREND_DATA.map((_, i) => pad.left + (i / (TREND_DATA.length - 1)) * (W - pad.left - pad.right));
  const ys = TREND_DATA.map(d => pad.top + (1 - (d.pct - minV) / (maxV - minV)) * (H - pad.top - pad.bottom));
  const area = `M${xs[0]},${H - pad.bottom} ` + xs.map((x, i) => `L${x},${ys[i]}`).join(' ') + ` L${xs[xs.length - 1]},${H - pad.bottom} Z`;
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');

  const last = TREND_DATA[TREND_DATA.length - 1];
  const prev = TREND_DATA[TREND_DATA.length - 2];
  const delta = last.pct - prev.pct;

  return (
    <ChartCard>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <SectionHeader icon={TrendingUp} title="Compliance Trend" subtitle="Month-over-month compliance rate" iconColor="#1D4ED8" iconBg="#EFF6FF" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tabular-nums" style={{ color: '#111827' }}>{last.pct}%</span>
          <Pill
            label={`${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}% MoM`}
            color={delta >= 0 ? '#047857' : '#B91C1C'}
            bg={delta >= 0 ? '#D1FAE5' : '#FEE2E2'}
          />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block', maxHeight: 160 }}>
        <defs>
          <linearGradient id="cg_trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[75, 80, 85, 90, 95].map(v => {
          const y = pad.top + (1 - (v - minV) / (maxV - minV)) * (H - pad.top - pad.bottom);
          return (
            <g key={v}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#F3F4F6" strokeWidth="1" />
              <text x={pad.left - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#D1D5DB">{v}%</text>
            </g>
          );
        })}
        {/* Area + line */}
        <path d={area} fill="url(#cg_trend)" />
        <path d={line} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
        {/* Dots + labels */}
        {TREND_DATA.map((d, i) => (
          <g key={d.month}>
            <circle cx={xs[i]} cy={ys[i]} r="3.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
            <text x={xs[i]} y={H - pad.bottom + 12} textAnchor="middle" fontSize="8" fill="#9CA3AF">{d.month}</text>
          </g>
        ))}
      </svg>
    </ChartCard>
  );
}

// ── Chart 6: Audit Findings ───────────────────────────────────────────────────

const AUDIT_DATA = [
  { label: 'Critical Findings', count: 3,  color: '#DC2626', bg: '#FEE2E2', pct: 100 },
  { label: 'Major Findings',    count: 12, color: '#D97706', bg: '#FEF3C7', pct: 70 },
  { label: 'Minor Findings',    count: 26, color: '#2563EB', bg: '#DBEAFE', pct: 45 },
];

function AuditFindingsChart() {
  const total = AUDIT_DATA.reduce((s, d) => s + d.count, 0);
  const W = 120, cx = 60, cy = 60, r = 48, inner = 28;
  let cumAngle = -Math.PI / 2;

  const slices = AUDIT_DATA.map(d => {
    const frac = d.count / total;
    const angle = frac * 2 * Math.PI - 0.03;
    const start = cumAngle + 0.015;
    const end = start + angle;
    cumAngle += frac * 2 * Math.PI;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`, color: d.color, d };
  });

  return (
    <ChartCard>
      <SectionHeader icon={BarChart2} title="Audit Findings" subtitle="Open audit observations by severity" iconColor="#B45309" iconBg="#FFFBEB" />
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`}>
            {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-80" />)}
            <circle cx={cx} cy={cy} r={inner} fill="white" />
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#111827">{total}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#9CA3AF">Total Open</text>
          </svg>
        </div>
        <div className="flex-1 space-y-3">
          {AUDIT_DATA.map(d => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs" style={{ color: '#374151' }}>{d.label}</span>
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: d.color }}>{d.count}</span>
              </div>
              <HBar pct={(d.count / total) * 100} color={d.color} height={5} />
            </div>
          ))}
          <p className="text-[10px] mt-2" style={{ color: '#9CA3AF' }}>
            Closure rate: <strong style={{ color: '#047857' }}>72.4%</strong> &nbsp;|&nbsp; Target: 85%
          </p>
        </div>
      </div>
    </ChartCard>
  );
}

// ── Chart 7: Contractor Governance Score ─────────────────────────────────────

const CONTRACTOR_SCORES = [
  { name: 'ABC Contractors',    score: 96, compliance: 98, stability: 94, attendance: 97, audit: 95, license: 100 },
  { name: 'XYZ Workforce',      score: 88, compliance: 91, stability: 86, attendance: 89, audit: 84, license: 90 },
  { name: 'DEF Solutions',      score: 72, compliance: 74, stability: 71, attendance: 76, audit: 66, license: 73 },
  { name: 'PQR Services',       score: 81, compliance: 83, stability: 80, attendance: 84, audit: 78, license: 80 },
  { name: 'LMN Enterprises',    score: 64, compliance: 62, stability: 68, attendance: 65, audit: 58, license: 67 },
];

function scoreColor(s: number) {
  if (s >= 90) return { color: '#047857', bg: '#D1FAE5', label: 'Excellent' };
  if (s >= 75) return { color: '#1D4ED8', bg: '#DBEAFE', label: 'Good' };
  if (s >= 60) return { color: '#B45309', bg: '#FEF3C7', label: 'Monitor' };
  return { color: '#B91C1C', bg: '#FEE2E2', label: 'At Risk' };
}

const SCORE_COLS = [
  { key: 'compliance' as const,  label: 'Compliance' },
  { key: 'stability'  as const,  label: 'Stability'  },
  { key: 'attendance' as const,  label: 'Attendance' },
  { key: 'audit'      as const,  label: 'Audit'      },
  { key: 'license'    as const,  label: 'License'    },
];

function ContractorGovernanceChart() {
  return (
    <ChartCard>
      <SectionHeader icon={Award} title="Contractor Governance Score" subtitle="Composite score: compliance, stability, attendance, audit & license" iconColor="#1D4ED8" iconBg="#EFF6FF" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 500 }}>
          <thead>
            <tr>
              <th className="text-left pb-3 pr-4 text-[11px] font-semibold" style={{ color: '#6B7280' }}>Contractor</th>
              {SCORE_COLS.map(c => (
                <th key={c.key} className="text-center pb-3 px-2 text-[11px] font-semibold" style={{ color: '#6B7280' }}>{c.label}</th>
              ))}
              <th className="text-center pb-3 pl-4 text-[11px] font-semibold" style={{ color: '#6B7280' }}>Score</th>
              <th className="text-center pb-3 pl-3 text-[11px] font-semibold" style={{ color: '#6B7280' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {CONTRACTOR_SCORES.map((c, i) => {
              const sc = scoreColor(c.score);
              return (
                <tr key={c.name} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                  <td className="py-2.5 pr-4 text-xs font-medium" style={{ color: '#111827' }}>{c.name}</td>
                  {SCORE_COLS.map(col => {
                    const v = c[col.key];
                    const fc = scoreColor(v);
                    return (
                      <td key={col.key} className="py-2.5 px-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold tabular-nums" style={{ color: fc.color }}>{v}</span>
                          <div className="w-12 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                            <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: fc.color }} />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-2.5 pl-4 text-center">
                    <span className="text-base font-extrabold tabular-nums" style={{ color: sc.color }}>{c.score}</span>
                  </td>
                  <td className="py-2.5 pl-3 text-center">
                    <Pill label={sc.label} color={sc.color} bg={sc.bg} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ComplianceGovernance() {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#111827' }}>Compliance Governance</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Statutory, wage, audit, and risk compliance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill label="As of today" color="#1D4ED8" bg="#DBEAFE" />
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{today}</span>
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

        <ComplianceKpiCard title="Compliance Health Score" subtitle="Overall compliance score %" icon={Shield} accentColor="#2563EB" bgColor="#EFF6FF" iconColor="#1D4ED8" badge={{ label: 'Good', color: '#15803D', bg: '#DCFCE7' }}>
          <BigScore value={84.6} unit="%" color="#1D4ED8" />
          <HBar pct={84.6} color="#2563EB" height={6} />
          <p className="text-[10px] mt-2" style={{ color: '#9CA3AF' }}>Target &ge;90% &nbsp;&bull;&nbsp; Gap: 5.4 pts</p>
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Non-Compliant Contractors" subtitle="Total non-compliant + % of total" icon={AlertTriangle} accentColor="#D97706" bgColor="#FFFBEB" iconColor="#B45309" badge={{ label: 'Action Required', color: '#B45309', bg: '#FEF3C7' }}>
          <BigScore value={23} color="#B45309" />
          <HBar pct={(23 / 142) * 100} color="#D97706" height={6} />
          <MetricRow label="Total contractors" value={142} />
          <MetricRow label="Non-compliant %" value="16.2%" valueColor="#B45309" />
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Compliance Risk Index" subtitle="Risk score + critical risk level" icon={TrendingDown} accentColor="#DC2626" bgColor="#FEF2F2" iconColor="#B91C1C" badge={{ label: 'Medium Risk', color: '#B45309', bg: '#FEF3C7' }}>
          <BigScore value={62} color="#DC2626" />
          <HBar pct={62} color="#DC2626" height={6} />
          <MetricRow label="Risk level" value="Medium" valueColor="#B45309" />
          <MetricRow label="Critical risk areas" value={4} valueColor="#DC2626" />
        </ComplianceKpiCard>

        <ComplianceKpiCard title="License & Document Expiry" subtitle="Expiry alerts across documents" icon={FileWarning} accentColor="#7C3AED" bgColor="#F5F3FF" iconColor="#6D28D9">
          <AlertRow label="License Expiry"   count={8}  color="#B91C1C" bg="#FEE2E2" />
          <AlertRow label="Insurance Expiry" count={5}  color="#B45309" bg="#FEF3C7" />
          <AlertRow label="Agreement Expiry" count={11} color="#6D28D9" bg="#EDE9FE" />
          <p className="text-[10px] mt-2" style={{ color: '#9CA3AF' }}>24 total alerts &nbsp;&bull;&nbsp; 8 expiring within 30 days</p>
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Statutory Compliance" subtitle="PF compliance % + ESI compliance %" icon={CheckCircle} accentColor="#059669" bgColor="#ECFDF5" iconColor="#047857" badge={{ label: 'On Track', color: '#047857', bg: '#D1FAE5' }}>
          <MetricRow label="PF Compliance"  value="91.4%" valueColor="#047857" />
          <HBar pct={91.4} color="#059669" height={6} />
          <MetricRow label="ESI Compliance" value="88.7%" valueColor="#047857" />
          <HBar pct={88.7} color="#10B981" height={6} />
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Wage & Labor Compliance" subtitle="Wage, min wage & payment compliance" icon={DollarSign} accentColor="#0891B2" bgColor="#ECFEFF" iconColor="#0E7490" badge={{ label: 'Monitor', color: '#0E7490', bg: '#CFFAFE' }}>
          <MetricRow label="Wage Compliance %"   value="93.2%" valueColor="#0E7490" />
          <MetricRow label="Min Wage Compliance" value="97.8%" valueColor="#047857" />
          <MetricRow label="Payment Compliance"  value="89.1%" valueColor="#B45309" />
          <HBar pct={89.1} color="#0891B2" height={6} />
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Audit Governance Status" subtitle="Open findings + audit closure rate" icon={ClipboardCheck} accentColor="#D97706" bgColor="#FFFBEB" iconColor="#B45309">
          <BigScore value={18} color="#B45309" />
          <p className="text-[11px] mb-1" style={{ color: '#9CA3AF' }}>Open audit findings</p>
          <MetricRow label="Audit Closure Rate" value="72.4%" valueColor="#047857" />
          <HBar pct={72.4} color="#D97706" height={6} />
          <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>Target closure rate: 85%</p>
        </ComplianceKpiCard>

        <ComplianceKpiCard title="Critical Violations" subtitle="Violations, legal breaches & escalations" icon={Zap} accentColor="#DC2626" bgColor="#FEF2F2" iconColor="#B91C1C" badge={{ label: 'Escalated', color: '#B91C1C', bg: '#FEE2E2' }}>
          <AlertRow label="Critical Violations" count={6} color="#B91C1C" bg="#FEE2E2" />
          <AlertRow label="Legal Breaches"       count={2} color="#7C2D12" bg="#FFEDD5" />
          <AlertRow label="Major Escalations"    count={4} color="#B45309" bg="#FEF3C7" />
          <p className="text-[10px] mt-2" style={{ color: '#9CA3AF' }}>12 total &nbsp;&bull;&nbsp; 2 require immediate action</p>
        </ComplianceKpiCard>

      </div>

      {/* Charts — Row 1: License + Statutory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LicenseExpiryChart />
        <StatutoryComplianceChart />
      </div>

      {/* Charts — Row 2: Documentation + High-Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <DocumentationComplianceChart />
        <HighRiskAlertsChart />
      </div>

      {/* Charts — Row 3: Trend + Audit Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ComplianceTrendChart />
        <AuditFindingsChart />
      </div>

      {/* Charts — Row 4: Contractor Governance full width */}
      <ContractorGovernanceChart />
    </div>
  );
}
