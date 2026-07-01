import {
  ShieldCheck, AlertTriangle, AlertCircle, HardHat, HeartPulse,
  GraduationCap, Star, MessageSquare, Users, Zap, Building2,
  CheckCircle, Activity, Flame, Droplets, Coffee, Truck, UserCheck,
} from 'lucide-react';

// ── Fallback data ─────────────────────────────────────────────────────────────

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHLY_TRAINING  = [420, 485, 512, 498, 545, 580, 522, 610, 498, 562, 598, 635];
const MONTHLY_INCIDENTS = [8,   12,  7,   15,  10,  9,   11,  14,  8,   13,  12,  11];
const MONTHLY_NEARMISS  = [35,  42,  28,  55,  38,  45,  32,  62,  28,  48,  52,  44];

const PPE_TYPES = [
  { type: 'Helmet',              pct: 98, missing:  66, color: '#3B82F6' },
  { type: 'Safety Shoes',        pct: 96, missing: 132, color: '#10B981' },
  { type: 'Reflective Jacket',   pct: 94, missing: 198, color: '#8B5CF6' },
  { type: 'Gloves',              pct: 92, missing: 264, color: '#F59E0B' },
  { type: 'Eye Protection',      pct: 89, missing: 363, color: '#EF4444' },
  { type: 'Respiratory',         pct: 85, missing: 495, color: '#EC4899' },
  { type: 'Ear Protection',      pct: 91, missing: 297, color: '#06B6D4' },
];

const CONTRACTOR_SAFETY = [
  { name: 'BVOC',        training: 95, ppe: 96, incident: 94, nearmiss: 88, cert: 94, score: 93 },
  { name: 'Techno Res.', training: 88, ppe: 90, incident: 86, nearmiss: 82, cert: 88, score: 87 },
  { name: 'SRI Cauvery', training: 80, ppe: 84, incident: 78, nearmiss: 76, cert: 82, score: 80 },
  { name: 'Gram Vikas',  training: 72, ppe: 76, incident: 70, nearmiss: 68, cert: 74, score: 72 },
  { name: 'BSA Corp',    training: 65, ppe: 68, incident: 62, nearmiss: 58, cert: 66, score: 64 },
  { name: 'Maa Gayatri', training: 55, ppe: 58, incident: 52, nearmiss: 48, cert: 54, score: 54 },
];

type RiskLevel = 'High' | 'Medium' | 'Low';
const SITE_RISK: { site: string; incidents: number; violations: number; nearmiss: number; ppe: number; risk: RiskLevel }[] = [
  { site: 'Bangalore Plant', incidents: 18, violations: 14, nearmiss: 25, ppe: 82, risk: 'High'   },
  { site: 'Chennai Plant',   incidents:  8, violations:  6, nearmiss: 12, ppe: 91, risk: 'Medium' },
  { site: 'Hyderabad Plant', incidents:  4, violations:  3, nearmiss:  8, ppe: 94, risk: 'Medium' },
  { site: 'Pune Plant',      incidents:  1, violations:  1, nearmiss:  4, ppe: 98, risk: 'Low'    },
  { site: 'Mumbai Plant',    incidents:  3, violations:  4, nearmiss:  6, ppe: 96, risk: 'Low'    },
];

const WELFARE_FACILITIES = [
  { facility: 'Drinking Water',     sites: 18, total: 20, pct: 90, color: '#3B82F6', icon: Droplets  },
  { facility: 'Sanitation/Toilets', sites: 17, total: 20, pct: 85, color: '#10B981', icon: ShieldCheck },
  { facility: 'Rest Rooms',         sites: 16, total: 20, pct: 80, color: '#8B5CF6', icon: Users     },
  { facility: 'Canteen Facilities', sites: 15, total: 20, pct: 75, color: '#F59E0B', icon: Coffee    },
  { facility: 'Washing Facilities', sites: 17, total: 20, pct: 85, color: '#06B6D4', icon: Droplets  },
  { facility: 'First Aid Rooms',    sites: 19, total: 20, pct: 95, color: '#22C55E', icon: HeartPulse },
];

const GRIEVANCE_CATS = [
  { cat: 'Wage Issues',       count: 28, color: '#EF4444' },
  { cat: 'Welfare Issues',    count: 22, color: '#F59E0B' },
  { cat: 'Harassment',        count:  8, color: '#DC2626' },
  { cat: 'Accommodation',     count: 15, color: '#8B5CF6' },
  { cat: 'Safety Complaints', count: 18, color: '#F97316' },
];

const COMPOSITE_COMPONENTS = [
  { label: 'Safety Training',     weight: 15, score: 85, color: '#8B5CF6' },
  { label: 'PPE Compliance',      weight: 15, score: 92, color: '#3B82F6' },
  { label: 'Incident Performance',weight: 20, score: 78, color: '#EF4444' },
  { label: 'Audit Compliance',    weight: 15, score: 82, color: '#F59E0B' },
  { label: 'Medical Compliance',  weight: 10, score: 80, color: '#06B6D4' },
  { label: 'Welfare Facilities',  weight: 15, score: 86, color: '#22C55E' },
  { label: 'Grievance Resolution',weight: 10, score: 74, color: '#EC4899' },
];
const COMPOSITE_SCORE = Math.round(
  COMPOSITE_COMPONENTS.reduce((s, c) => s + (c.score * c.weight) / 100, 0)
);

// ── Shared helpers ────────────────────────────────────────────────────────────

function SectionHeader({ title, sub, color, bg, border }: {
  title: string; sub: string; color: string; bg: string; border: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-3 px-4 py-2.5 rounded-xl mt-6"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
      <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div>
        <p className="text-sm font-bold leading-none" style={{ color: '#111827' }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>
      </div>
    </div>
  );
}

function HBar({ pct, color, h = 6 }: { pct: number; color: string; h?: number }) {
  return (
    <div className="rounded-full overflow-hidden flex-1" style={{ backgroundColor: '#F3F4F6', height: h }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

function AlertBanner({ msg, sev }: { msg: string; sev: 'critical' | 'amber' }) {
  const s = sev === 'critical'
    ? { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' }
    : { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#F59E0B' };
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg mb-1.5"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: s.dot }} />
      <p className="text-[10px] font-medium" style={{ color: s.text }}>{msg}</p>
    </div>
  );
}

// SVG semi-arc gauge
function Gauge({ score, color, size = 110 }: { score: number; color: string; size?: number }) {
  const r = 38, cx = size / 2, cy = size * 0.58, sw = 9;
  const arcLen = Math.PI * r;
  const filled = (score / 100) * arcLen;
  return (
    <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`} style={{ display: 'block' }}>
      <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`}
        fill="none" stroke="#F3F4F6" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`}
        fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${filled} ${arcLen}`} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={16} fontWeight={800} fill={color}>{score}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill="#9CA3AF">/ 100</text>
    </svg>
  );
}

// Mini SVG line chart
function SparkLine({ data, color, H = 50 }: { data: number[]; color: string; H?: number }) {
  const W = 240;
  const PAD = { t: 6, r: 4, b: 18, l: 22 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const px = (i: number) => PAD.l + (i / (data.length - 1)) * cW;
  const py = (v: number) => PAD.t + cH - ((v - min) / range) * cH;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = path + ` L${px(data.length - 1).toFixed(1)},${(PAD.t + cH).toFixed(1)} L${PAD.l},${(PAD.t + cH).toFixed(1)} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map(f => (
        <line key={f} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + (1 - f) * cH} y2={PAD.t + (1 - f) * cH} stroke="#F1F5F9" strokeWidth={1} />
      ))}
      {[0, 0.5, 1].map(f => (
        <text key={f} x={PAD.l - 3} y={PAD.t + (1 - f) * cH + 3} textAnchor="end" fontSize={7} fill="#D1D5DB">
          {Math.round(min + range * f)}
        </text>
      ))}
      <path d={area} fill={color} opacity={0.1} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.75} />
      {data.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={2} fill={color} stroke="white" strokeWidth={1} />
      ))}
      {data.map((v, i) => {
        if (data.length > 8 && i % 2 !== 0 && i !== data.length - 1) return null;
        return <text key={i} x={px(i)} y={H - 2} textAnchor="middle" fontSize={7} fill="#CBD5E1">{MONTHS_SHORT[i]}</text>;
      })}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + cH} y2={PAD.t + cH} stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  );
}

// ── 1. Executive Safety & Welfare Scorecard ────────────────────────────────────

function ExecutiveScorecard() {
  const kpis = [
    { label: 'Active Contract Workers', value: '3,285',  color: '#3B82F6', icon: Users,         sub: 'Total headcount'       },
    { label: 'Safety Compliance Score', value: '87%',    color: '#10B981', icon: ShieldCheck,   sub: 'Target ≥ 90%'          },
    { label: 'Welfare Compliance Score',value: '82%',    color: '#22C55E', icon: Star,           sub: 'Target ≥ 85%'          },
    { label: 'LTIFR',                   value: '1.42',   color: '#F59E0B', icon: Activity,      sub: 'Per million hrs worked' },
    { label: 'Total Safety Incidents',  value: '86',     color: '#EF4444', icon: AlertTriangle, sub: 'YTD'                   },
    { label: 'Fatalities',              value: '1',      color: '#DC2626', icon: AlertCircle,   sub: 'Last 7 days — CRITICAL' },
    { label: 'Near Miss Cases',         value: '462',    color: '#F97316', icon: Zap,            sub: 'YTD reported'           },
    { label: 'Medical Cases Reported',  value: '128',    color: '#8B5CF6', icon: HeartPulse,    sub: 'YTD'                   },
    { label: 'Open Safety Violations',  value: '35',     color: '#EF4444', icon: AlertTriangle, sub: 'Pending closure'        },
    { label: 'Welfare Grievances',      value: '91',     color: '#F59E0B', icon: MessageSquare, sub: '45 overdue >30 days'   },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-2">
      {kpis.map(k => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="kpi-card">
            <div className="kpi-accent" style={{ backgroundColor: k.color }} />
            <div className="p-3">
              <div className="kpi-icon mb-2" style={{ backgroundColor: k.color + '18', color: k.color }}>
                <Icon size={13} strokeWidth={1.75} />
              </div>
              <p className="kpi-value">{k.value}</p>
              <p className="kpi-title">{k.label}</p>
              <p className="kpi-subtitle">{k.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 2. Safety Compliance Overview ─────────────────────────────────────────────

function SafetyComplianceOverview() {
  const statuses = [
    { label: 'Compliant',            count: 8500, color: '#22C55E', pct: 82 },
    { label: 'Training Pending',     count:  450, color: '#F59E0B', pct:  4 },
    { label: 'Certification Expired',count:  120, color: '#EF4444', pct:  1 },
    { label: 'Induction Pending',    count:   75, color: '#DC2626', pct:  1 },
  ];
  const total = statuses.reduce((s, d) => s + d.count, 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="chart-container">
        <h3 className="chart-title">Safety Compliance Status</h3>
        <p className="chart-subtitle mb-3">Worker-level compliance breakdown — {total.toLocaleString()} total workers</p>
        <div className="flex flex-col gap-2.5">
          {statuses.map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px]" style={{ color: '#6B7280' }}>{s.label}</span>
                <span className="text-[10px] font-bold tabular-nums" style={{ color: s.color }}>
                  {s.count.toLocaleString()} ({s.pct}%)
                </span>
              </div>
              <HBar pct={s.pct} color={s.color} h={8} />
            </div>
          ))}
        </div>
        <AlertBanner msg="🚨 645 workers non-compliant with mandatory safety requirements" sev="critical" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { label: 'Valid Safety Training',  value: '8,950', color: '#22C55E' },
            { label: 'Without Training',       value: '450',   color: '#EF4444' },
            { label: 'Valid Certifications',   value: '9,220', color: '#3B82F6' },
            { label: 'Expired Certifications', value: '120',   color: '#EF4444' },
          ].map(m => (
            <div key={m.label} className="p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Training Analytics */}
      <div className="chart-container">
        <h3 className="chart-title">Safety Training Analytics</h3>
        <p className="chart-subtitle mb-2">Monthly trainings conducted — completion & expiry trends</p>
        <SparkLine data={MONTHLY_TRAINING} color="#8B5CF6" H={100} />
        <div className="mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>Contractor Training Leaderboard</p>
          <div className="flex flex-col gap-1">
            {[
              { name: 'BVOC',        pct: 96 },
              { name: 'Techno Res.', pct: 91 },
              { name: 'SRI Cauvery', pct: 84 },
              { name: 'Gram Vikas',  pct: 76 },
              { name: 'BSA Corp',    pct: 68 },
              { name: 'Maa Gayatri', pct: 58 },
            ].map(c => {
              const color = c.pct >= 85 ? '#22C55E' : c.pct >= 70 ? '#F59E0B' : '#EF4444';
              return (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-[9px] w-18 flex-shrink-0 truncate" style={{ color: '#6B7280', width: 72 }}>{c.name}</span>
                  <HBar pct={c.pct} color={color} h={5} />
                  <span className="text-[9px] font-bold w-6 text-right flex-shrink-0" style={{ color }}>{c.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Completion %', value: '85.4%', color: '#8B5CF6' },
            { label: 'Overdue',      value: '189',   color: '#EF4444' },
            { label: 'Due 60 days',  value: '234',   color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="text-center p-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 3. Incident Management + LTI + Near Miss ──────────────────────────────────

function IncidentSection() {
  const incidents = [
    { type: 'Fatality',       count: 1,  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    { type: 'Major Injury',   count: 8,  color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
    { type: 'Minor Injury',   count: 15, color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
    { type: 'Near Miss',      count: 62, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
    { type: 'First Aid',      count: 42, color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
    { type: 'Property Damage',count: 6,  color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
  ];
  const maxCount = Math.max(...incidents.map(d => d.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Incident summary */}
      <div className="chart-container">
        <h3 className="chart-title">Incident Summary (MTD)</h3>
        <p className="chart-subtitle mb-3">By severity — LTIFR: <strong style={{ color: '#F59E0B' }}>1.42</strong></p>
        <div className="flex flex-col gap-2">
          {incidents.map(d => (
            <div key={d.type} className="flex items-center gap-2.5 p-2 rounded-lg"
              style={{ backgroundColor: d.bg, border: `1px solid ${d.border}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px]" style={{ color: '#374151' }}>{d.type}</span>
                  <span className="text-[10px] font-bold" style={{ color: d.color }}>{d.count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#FFFFFF40' }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <AlertBanner msg="🚨 Fatality reported — immediate board escalation required" sev="critical" />
      </div>

      {/* Monthly incident + near miss trends */}
      <div className="chart-container">
        <h3 className="chart-title">Monthly Incident Trend</h3>
        <p className="chart-subtitle mb-1">Incidents (red) vs Near Misses (amber) — 12 months</p>
        <SparkLine data={MONTHLY_INCIDENTS} color="#EF4444" H={90} />
        <p className="text-[9px] mb-1 mt-1" style={{ color: '#9CA3AF' }}>Near Miss Trend</p>
        <SparkLine data={MONTHLY_NEARMISS} color="#F59E0B" H={80} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { label: 'Lost Time Injuries', value: '12',    color: '#EF4444' },
            { label: 'Lost Work Days',     value: '84',    color: '#DC2626' },
            { label: 'Severity Rate',      value: '7.0',   color: '#F97316' },
            { label: 'LTIFR',              value: '1.42',  color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="p-1.5 rounded-lg text-center" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Near Miss Monitoring */}
      <div className="chart-container">
        <h3 className="chart-title">Near Miss Monitoring</h3>
        <p className="chart-subtitle mb-3">Strong predictors of future accidents</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Total Near Miss Reports',    value: '462', color: '#F59E0B' },
            { label: 'Unresolved Cases',           value: '38',  color: '#EF4444' },
            { label: 'Repeated Near Miss Locations',value: '4',  color: '#DC2626' },
            { label: 'MoM Increase',               value: '+40%',color: '#EF4444' },
            { label: 'Highest-Risk Contractor',    value: 'Maa Gayatri', color: '#F97316' },
          ].map(m => (
            <div key={m.label} className="flex justify-between items-center p-2 rounded-lg"
              style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px]" style={{ color: '#6B7280' }}>{m.label}</span>
              <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
        <AlertBanner msg="🚨 Plant 2 reported 15 near misses in last 30 days — repeated location" sev="amber" />
        <AlertBanner msg="🚨 Near misses increased 40% month-over-month" sev="amber" />
        <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>
            LTIFR = (Lost Time Injuries × 1,000,000) ÷ Total Hours Worked
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 4. PPE Compliance ─────────────────────────────────────────────────────────

function PPESection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="chart-container">
        <h3 className="chart-title">PPE Compliance by Type</h3>
        <p className="chart-subtitle mb-3">Personal protective equipment adherence — 3,285 workers</p>
        <div className="flex flex-col gap-2">
          {PPE_TYPES.map(p => (
            <div key={p.type} className="flex items-center gap-2">
              <span className="text-[10px] flex-shrink-0" style={{ color: '#6B7280', width: 104 }}>{p.type}</span>
              <HBar pct={p.pct} color={p.pct >= 95 ? '#22C55E' : p.pct >= 88 ? '#F59E0B' : '#EF4444'} h={8} />
              <span className="text-[10px] font-bold tabular-nums flex-shrink-0 w-8 text-right"
                style={{ color: p.pct >= 95 ? '#15803D' : p.pct >= 88 ? '#D97706' : '#DC2626' }}>{p.pct}%</span>
              <span className="text-[9px] tabular-nums flex-shrink-0 w-10 text-right" style={{ color: '#9CA3AF' }}>
                -{p.missing}
              </span>
            </div>
          ))}
        </div>
        <AlertBanner msg="🚨 240 workers entered sites without complete PPE" sev="critical" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: 'Overall PPE %', value: '92%',  color: '#3B82F6' },
            { label: 'Without PPE',   value: '240',  color: '#EF4444' },
            { label: 'PPE Violations',value: '68',   color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="text-center p-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contractor Safety Ranking */}
      <div className="chart-container">
        <h3 className="chart-title">Contractor Safety Ranking</h3>
        <p className="chart-subtitle mb-3">Composite safety score — 90–100 Excellent · 75–89 Good · 60–74 Moderate · &lt;60 High Risk</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 380 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                {['Contractor','Train','PPE','Incident','Cert','Score','Band'].map(h => (
                  <th key={h} className="py-1.5 pr-2 text-left text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRACTOR_SAFETY.map((c, i) => {
                const band = c.score >= 90 ? { l: 'Excellent', c: '#15803D', bg: '#DCFCE7' }
                  : c.score >= 75 ? { l: 'Good',     c: '#3B82F6', bg: '#DBEAFE' }
                  : c.score >= 60 ? { l: 'Moderate', c: '#D97706', bg: '#FEF9C3' }
                  : { l: 'High Risk', c: '#DC2626', bg: '#FEE2E2' };
                return (
                  <tr key={c.name} style={{ borderBottom: i < CONTRACTOR_SAFETY.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="py-1.5 pr-2 font-medium text-[10px]" style={{ color: '#374151' }}>{c.name}</td>
                    {[c.training, c.ppe, c.incident, c.cert].map((v, vi) => (
                      <td key={vi} className="py-1.5 pr-2 text-[10px] font-bold"
                        style={{ color: v >= 85 ? '#22C55E' : v >= 70 ? '#F59E0B' : '#EF4444' }}>{v}</td>
                    ))}
                    <td className="py-1.5 pr-2">
                      <span className="text-sm font-extrabold" style={{ color: band.c }}>{c.score}</span>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: band.bg, color: band.c }}>{band.l}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AlertBanner msg="🚨 Maa Gayatri scored 54 — High Risk — safety action plan required" sev="critical" />
      </div>
    </div>
  );
}

// ── 5. Site Risk Heatmap + Audit ──────────────────────────────────────────────

function SiteAuditSection() {
  const RISK_COLOR: Record<RiskLevel, { color: string; bg: string; border: string }> = {
    High:   { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    Medium: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    Low:    { color: '#15803D', bg: '#F0FDF4', border: '#DCFCE7' },
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Site Risk Heatmap */}
      <div className="chart-container">
        <h3 className="chart-title">Site Safety Risk Heatmap</h3>
        <p className="chart-subtitle mb-3">Incidents, violations, near misses & PPE compliance by site</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 360 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                {['Site','Incidents','Violations','Near Miss','PPE %','Risk'].map(h => (
                  <th key={h} className="py-1.5 pr-2 text-left text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SITE_RISK.map((s, i) => {
                const r = RISK_COLOR[s.risk];
                return (
                  <tr key={s.site} style={{ borderBottom: i < SITE_RISK.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="py-1.5 pr-2 font-medium text-[10px]" style={{ color: '#374151' }}>{s.site}</td>
                    <td className="py-1.5 pr-2 text-[10px] font-bold" style={{ color: s.incidents > 10 ? '#DC2626' : '#374151' }}>{s.incidents}</td>
                    <td className="py-1.5 pr-2 text-[10px] font-bold" style={{ color: s.violations > 8 ? '#DC2626' : '#374151' }}>{s.violations}</td>
                    <td className="py-1.5 pr-2 text-[10px] font-bold" style={{ color: s.nearmiss > 20 ? '#F59E0B' : '#374151' }}>{s.nearmiss}</td>
                    <td className="py-1.5 pr-2 text-[10px] font-bold" style={{ color: s.ppe >= 95 ? '#22C55E' : s.ppe >= 88 ? '#F59E0B' : '#EF4444' }}>{s.ppe}%</td>
                    <td className="py-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: r.bg, color: r.color, border: `1px solid ${r.border}` }}>{s.risk}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AlertBanner msg="🚨 Bangalore Plant — HIGH RISK — 18 incidents, 14 violations in period" sev="critical" />
      </div>

      {/* Safety Audit Compliance */}
      <div className="chart-container">
        <h3 className="chart-title">Safety Audit Compliance</h3>
        <p className="chart-subtitle mb-3">Audit findings status &amp; resolution tracking</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Audits Conducted',  value: '195', color: '#3B82F6' },
            { label: 'Open Findings',     value: '35',  color: '#EF4444' },
            { label: 'Critical Open',     value: '8',   color: '#DC2626' },
            { label: 'Closed Findings',   value: '180', color: '#22C55E' },
            { label: 'Repeat Findings',   value: '12',  color: '#F59E0B' },
            { label: 'Closure Rate',      value: '84%', color: '#10B981' },
          ].map(m => (
            <div key={m.label} className="p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
        {/* Audit progress bar */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: '#6B7280' }}>Open vs Closed Findings</span>
            <span className="text-[10px] font-bold" style={{ color: '#374151' }}>215 total</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden flex" style={{ backgroundColor: '#F1F5F9' }}>
            <div style={{ width: '84%', backgroundColor: '#22C55E', height: '100%' }} />
            <div style={{ width: '16%', backgroundColor: '#EF4444', height: '100%' }} />
          </div>
          <div className="flex gap-3 mt-1">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} /><span className="text-[9px]" style={{ color: '#6B7280' }}>Closed 84%</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} /><span className="text-[9px]" style={{ color: '#6B7280' }}>Open 16%</span></div>
          </div>
        </div>
        <AlertBanner msg="🚨 8 critical audit observations pending closure" sev="critical" />
        <AlertBanner msg="🚨 12 repeat findings — systemic root cause not addressed" sev="amber" />
      </div>
    </div>
  );
}

// ── 6. Emergency Preparedness + Occupational Health ──────────────────────────

function EmergencyHealthSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Emergency Preparedness */}
      <div className="chart-container">
        <h3 className="chart-title">Emergency Preparedness</h3>
        <p className="chart-subtitle mb-3">Fire drills, mock drills, evacuation &amp; response readiness</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Fire Drills Conducted',       value: '15',  color: '#EF4444', icon: Flame       },
            { label: 'Mock Drills Completed',        value: '8',   color: '#F97316', icon: AlertTriangle},
            { label: 'Emergency Response Training',  value: '320', color: '#3B82F6', icon: GraduationCap},
            { label: 'Evacuation Compliance',        value: '92%', color: '#22C55E', icon: CheckCircle  },
            { label: 'Mock Drill Success Rate',      value: '88%', color: '#10B981', icon: ShieldCheck  },
            { label: 'First Responders Certified',   value: '48',  color: '#8B5CF6', icon: UserCheck    },
          ].map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-2 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Icon size={12} style={{ color: m.color, marginTop: 1, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[9px] leading-tight" style={{ color: '#9CA3AF' }}>{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
          <p className="text-[10px]" style={{ color: '#15803D' }}>
            <strong>92%</strong> evacuation compliance — target 95%. Schedule 3 additional drills this quarter.
          </p>
        </div>
      </div>

      {/* Occupational Health */}
      <div className="chart-container">
        <h3 className="chart-title">Occupational Health Monitoring</h3>
        <p className="chart-subtitle mb-3">Medical fitness, periodic exams &amp; occupational illness tracking</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Medically Fit Workers',       value: '2,960', color: '#22C55E' },
            { label: 'Medical Fitness Expired',      value: '325',   color: '#EF4444' },
            { label: 'Periodic Exams Completed',     value: '2,200', color: '#3B82F6' },
            { label: 'Health Risk Cases',            value: '88',    color: '#F59E0B' },
          ].map(m => (
            <div key={m.label} className="p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>Occupational Illness Categories</p>
        <div className="flex flex-col gap-1.5">
          {[
            { cat: 'Respiratory',      count: 22, color: '#3B82F6' },
            { cat: 'Hearing',          count: 15, color: '#8B5CF6' },
            { cat: 'Musculoskeletal',  count: 31, color: '#F59E0B' },
            { cat: 'Chemical Exposure',count: 12, color: '#EF4444' },
            { cat: 'Vision',           count: 8,  color: '#06B6D4' },
          ].map(d => (
            <div key={d.cat} className="flex items-center gap-2">
              <span className="text-[9px] flex-shrink-0" style={{ color: '#6B7280', width: 96 }}>{d.cat}</span>
              <HBar pct={d.count} color={d.color} h={5} />
              <span className="text-[9px] font-bold flex-shrink-0 w-4 text-right" style={{ color: d.color }}>{d.count}</span>
            </div>
          ))}
        </div>
        <AlertBanner msg="🚨 325 workers require periodic medical examination renewal" sev="amber" />
      </div>
    </div>
  );
}

// ── 7. Welfare Section ────────────────────────────────────────────────────────

function WelfareSection() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Welfare Compliance Overview */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Welfare Compliance Overview</h3>
          <div className="flex justify-center my-1">
            <Gauge score={82} color="#22C55E" size={120} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Welfare Compliance',  value: '82%', color: '#22C55E' },
              { label: 'Facilities Available',value: '85%', color: '#3B82F6' },
              { label: 'Facilities Missing',  value: '15%', color: '#EF4444' },
              { label: 'Welfare Audit Score', value: '79/100', color: '#F59E0B' },
            ].map(m => (
              <div key={m.label} className="p-1.5 rounded-lg text-center" style={{ backgroundColor: '#F8FAFC' }}>
                <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <AlertBanner msg="🚨 Welfare audit score below 80% — review action plan" sev="amber" />
        </div>

        {/* Welfare Facilities */}
        <div className="chart-container">
          <h3 className="chart-title">Welfare Facilities Compliance</h3>
          <p className="chart-subtitle mb-2">Mandatory facilities — 20 sites</p>
          <div className="flex flex-col gap-2">
            {WELFARE_FACILITIES.map(f => {
              const Icon = f.icon;
              const color = f.pct >= 90 ? '#22C55E' : f.pct >= 80 ? '#F59E0B' : '#EF4444';
              return (
                <div key={f.facility} className="flex items-center gap-2">
                  <Icon size={10} style={{ color, flexShrink: 0 }} />
                  <span className="text-[9px] flex-shrink-0" style={{ color: '#6B7280', width: 100 }}>{f.facility}</span>
                  <HBar pct={f.pct} color={color} h={5} />
                  <span className="text-[9px] font-bold flex-shrink-0 w-8 text-right" style={{ color }}>
                    {f.sites}/{f.total}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[9px] leading-relaxed p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC', color: '#6B7280' }}>
            Canteen avg daily usage: 1,840 | Toilet ratio: 1:22 | Rest room utilization: 76%
          </div>
        </div>

        {/* Worker Welfare Programs */}
        <div className="chart-container">
          <h3 className="chart-title">Worker Welfare Programs</h3>
          <p className="chart-subtitle mb-2">Coverage across workforce</p>
          <div className="flex flex-col gap-2.5">
            {[
              { prog: 'Health Camps',       pct: 75, covered: 2464, color: '#22C55E' },
              { prog: 'Insurance Coverage', pct: 100,covered: 3285, color: '#3B82F6' },
              { prog: 'Skill Development',  pct: 60, covered: 1971, color: '#8B5CF6' },
              { prog: 'Financial Literacy', pct: 45, covered: 1478, color: '#F59E0B' },
              { prog: 'Mental Wellness',    pct: 38, covered: 1248, color: '#EC4899' },
            ].map(p => (
              <div key={p.prog}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[9px]" style={{ color: '#6B7280' }}>{p.prog}</span>
                  <span className="text-[9px] font-bold" style={{ color: p.color }}>{p.pct}% ({p.covered.toLocaleString()})</span>
                </div>
                <HBar pct={p.pct} color={p.color} h={5} />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1">
            <div className="p-1.5 rounded-lg text-center" style={{ backgroundColor: '#F0FDF4' }}>
              <p className="text-xs font-bold" style={{ color: '#15803D' }}>100%</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Insurance coverage</p>
            </div>
            <div className="p-1.5 rounded-lg text-center" style={{ backgroundColor: '#FFFBEB' }}>
              <p className="text-xs font-bold" style={{ color: '#D97706' }}>38%</p>
              <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Mental wellness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 8. Grievance + Accommodation + Female Worker ──────────────────────────────

function GrievanceWelfareSection() {
  const totalGrievances = GRIEVANCE_CATS.reduce((s, d) => s + d.count, 0);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Grievance Management */}
      <div className="chart-container">
        <h3 className="chart-title">Grievance Management</h3>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {[
            { label: 'Total Grievances',     value: '91',  color: '#374151' },
            { label: 'Open',                 value: '45',  color: '#EF4444' },
            { label: 'Escalated',            value: '8',   color: '#DC2626' },
            { label: 'Resolved',             value: '46',  color: '#22C55E' },
            { label: 'Avg Resolution (days)',value: '12d', color: '#F59E0B' },
            { label: 'SLA Breached',         value: '45',  color: '#EF4444' },
          ].map(m => (
            <div key={m.label} className="p-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px] leading-tight" style={{ color: '#9CA3AF' }}>{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>By Category — {totalGrievances} total</p>
        {GRIEVANCE_CATS.map(g => (
          <div key={g.cat} className="flex items-center gap-2 mb-1">
            <span className="text-[9px] flex-shrink-0" style={{ color: '#6B7280', width: 80 }}>{g.cat}</span>
            <HBar pct={(g.count / totalGrievances) * 100} color={g.color} h={5} />
            <span className="text-[9px] font-bold flex-shrink-0 w-4 text-right" style={{ color: g.color }}>{g.count}</span>
          </div>
        ))}
        <AlertBanner msg="🚨 45 unresolved grievances older than 30 days" sev="critical" />
      </div>

      {/* Accommodation & Transport */}
      <div className="chart-container">
        <h3 className="chart-title">Accommodation &amp; Transport</h3>
        <p className="chart-subtitle mb-2">Migrant labour welfare facilities</p>
        {[
          { label: 'Workers Using Accommodation', value: '1,240', color: '#3B82F6' },
          { label: 'Accommodation Compliance',    value: '94%',   color: '#22C55E' },
          { label: 'Workers Using Transport',     value: '2,180', color: '#8B5CF6' },
          { label: 'Transport Safety Incidents',  value: '2',     color: '#F59E0B' },
          { label: 'Transport Compliance',        value: '96%',   color: '#22C55E' },
        ].map(m => (
          <div key={m.label} className="flex justify-between items-center py-1.5"
            style={{ borderBottom: '1px solid #F9FAFB' }}>
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{m.label}</span>
            <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {[
            { facility: 'Accommodation', pct: 94, color: '#22C55E', icon: Building2 },
            { facility: 'Transport',     pct: 96, color: '#3B82F6', icon: Truck     },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.facility} className="flex flex-col items-center p-2 rounded-lg"
                style={{ backgroundColor: f.color + '10', border: `1px solid ${f.color}30` }}>
                <Icon size={14} style={{ color: f.color }} />
                <p className="text-sm font-bold mt-1" style={{ color: f.color }}>{f.pct}%</p>
                <p className="text-[9px]" style={{ color: '#6B7280' }}>{f.facility}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Female Worker Welfare */}
      <div className="chart-container">
        <h3 className="chart-title">Female Worker Welfare</h3>
        <p className="chart-subtitle mb-2">Gender-specific welfare &amp; safety compliance</p>
        {[
          { label: 'Female Workforce',            value: '285 (8.7%)', color: '#EC4899' },
          { label: 'Separate Restrooms Available',value: '18 / 20 sites', color: '#22C55E' },
          { label: 'Creche Facility Compliance',  value: '75%', color: '#F59E0B' },
          { label: 'Female Safety Complaints',    value: '6',   color: '#EF4444' },
          { label: 'Night Shift Safety Compliance',value: '92%', color: '#3B82F6' },
          { label: 'Non-Compliant Sites (POSH)',  value: '2',   color: '#EF4444' },
        ].map(m => (
          <div key={m.label} className="flex justify-between items-center py-1.5"
            style={{ borderBottom: '1px solid #F9FAFB' }}>
            <span className="text-[10px]" style={{ color: '#6B7280' }}>{m.label}</span>
            <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
        <AlertBanner msg="🚨 2 sites non-compliant with female welfare requirements (POSH)" sev="amber" />
        <AlertBanner msg="🚨 Creche facility below 80% — statutory requirement at risk" sev="amber" />
      </div>
    </div>
  );
}

// ── 9. Safety & Welfare Risk Alerts ──────────────────────────────────────────

function RiskAlertsSummary() {
  const alerts: { msg: string; sev: 'critical' | 'amber' }[] = [
    { msg: '🚨 Fatality reported in last 7 days — board escalation mandatory',              sev: 'critical' },
    { msg: '🚨 PPE compliance for Respiratory at 85% — below 88% threshold',                sev: 'critical' },
    { msg: '🚨 Medical certificates expired for 325+ workers',                              sev: 'critical' },
    { msg: '🚨 8 critical audit findings pending closure beyond SLA',                       sev: 'critical' },
    { msg: '🚨 Welfare audit score 79/100 — below 80% target',                             sev: 'amber'    },
    { msg: '🚨 Safety training overdue for 189 workers',                                   sev: 'amber'    },
    { msg: '🚨 Near misses increased 40% month-over-month',                                sev: 'amber'    },
    { msg: '🚨 Grievance resolution backlog — 45 cases exceeding 30-day SLA',              sev: 'amber'    },
    { msg: '🚨 2 sites non-compliant with female welfare requirements',                    sev: 'amber'    },
    { msg: '🚨 Maa Gayatri contractor — safety score 54 (High Risk)',                      sev: 'amber'    },
  ];
  const critical = alerts.filter(a => a.sev === 'critical');
  const amber    = alerts.filter(a => a.sev === 'amber');
  return (
    <div className="chart-container">
      <h3 className="chart-title mb-3">Safety &amp; Welfare Risk Alerts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#DC2626' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            Critical ({critical.length})
          </p>
          {critical.map((a, i) => <AlertBanner key={i} msg={a.msg} sev="critical" />)}
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#D97706' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#F59E0B' }} />
            Amber ({amber.length})
          </p>
          {amber.map((a, i) => <AlertBanner key={i} msg={a.msg} sev="amber" />)}
        </div>
      </div>
    </div>
  );
}

// ── 10. CXO Composite Safety & Welfare Index ──────────────────────────────────

function CompositeIndex() {
  const status = COMPOSITE_SCORE >= 90 ? { label: 'Excellent', color: '#15803D', bg: '#DCFCE7' }
    : COMPOSITE_SCORE >= 75 ? { label: 'Good',          color: '#3B82F6', bg: '#DBEAFE' }
    : COMPOSITE_SCORE >= 60 ? { label: 'Moderate Risk', color: '#D97706', bg: '#FEF9C3' }
    : { label: 'Critical Risk', color: '#DC2626', bg: '#FEE2E2' };

  return (
    <div className="chart-container">
      <h3 className="chart-title">CXO Composite Safety &amp; Welfare Index</h3>
      <p className="chart-subtitle mb-4">Weighted composite score across 7 performance pillars</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Score display */}
        <div className="flex flex-col items-center justify-center gap-2 py-2">
          <Gauge score={COMPOSITE_SCORE} color={status.color} size={140} />
          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: status.bg, color: status.color }}>
            {status.label}
          </span>
          <p className="text-[10px] text-center" style={{ color: '#9CA3AF' }}>
            90–100 Excellent · 75–89 Good<br />60–74 Moderate · &lt;60 Critical
          </p>
        </div>
        {/* Component breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {COMPOSITE_COMPONENTS.map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="text-[10px] flex-shrink-0" style={{ color: '#6B7280', width: 140 }}>{c.label}</span>
              <span className="text-[9px] flex-shrink-0 w-8" style={{ color: '#9CA3AF' }}>{c.weight}%</span>
              <HBar pct={c.score} color={c.color} h={6} />
              <span className="text-[10px] font-bold flex-shrink-0 w-6 text-right" style={{ color: c.color }}>{c.score}</span>
              <span className="text-[9px] flex-shrink-0 w-8 text-right" style={{ color: '#9CA3AF' }}>
                ×{(c.weight / 100).toFixed(2)}
              </span>
              <span className="text-[9px] font-bold flex-shrink-0 w-8 text-right tabular-nums" style={{ color: c.color }}>
                {((c.score * c.weight) / 100).toFixed(1)}
              </span>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
            <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Composite Score:</span>
            <span className="text-sm font-extrabold" style={{ color: status.color }}>{COMPOSITE_SCORE} / 100</span>
          </div>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>
            Columns: Label · Weight% · Score bar · Score · Weight factor · Weighted contribution
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export default function SafetyWelfare() {
  return (
    <div>
      {/* Exec Scorecard — 10 KPIs */}
      <div className="mb-4">
        <ExecutiveScorecard />
      </div>

      {/* Safety Dashboard */}
      <SectionHeader
        title="Safety Compliance & Training"
        sub="Worker-level safety status, mandatory training completion, and contractor leaderboard"
        color="#3B82F6" bg="#EFF6FF" border="#BFDBFE"
      />
      <SafetyComplianceOverview />

      {/* Incidents, LTI, Near Miss */}
      <SectionHeader
        title="Incident Management · LTI Analytics · Near Miss Monitoring"
        sub="Incident severity breakdown, LTIFR calculation, and near-miss early-warning tracking"
        color="#EF4444" bg="#FEF2F2" border="#FECACA"
      />
      <IncidentSection />

      {/* PPE & Contractor Safety Ranking */}
      <SectionHeader
        title="PPE Compliance & Contractor Safety Ranking"
        sub="7 PPE type compliance rates and composite safety score per contractor"
        color="#F59E0B" bg="#FFFBEB" border="#FDE68A"
      />
      <PPESection />

      {/* Site Risk + Audit */}
      <SectionHeader
        title="Site Risk Heatmap & Safety Audit Compliance"
        sub="Location-wise risk rating and audit finding resolution status"
        color="#8B5CF6" bg="#F5F3FF" border="#DDD6FE"
      />
      <SiteAuditSection />

      {/* Emergency + Occupational Health */}
      <SectionHeader
        title="Emergency Preparedness & Occupational Health"
        sub="Drill compliance, evacuation readiness, medical fitness, and occupational illness monitoring"
        color="#06B6D4" bg="#ECFEFF" border="#A5F3FC"
      />
      <EmergencyHealthSection />

      {/* Welfare */}
      <SectionHeader
        title="Welfare Compliance, Facilities & Programs"
        sub="Mandatory welfare facilities availability, welfare audit score, and worker program coverage"
        color="#22C55E" bg="#F0FDF4" border="#DCFCE7"
      />
      <WelfareSection />

      {/* Grievance + Accommodation + Female */}
      <SectionHeader
        title="Grievance Management · Accommodation & Transport · Female Worker Welfare"
        sub="Grievance resolution SLA, accommodation compliance, POSH & female-specific welfare requirements"
        color="#EC4899" bg="#FDF2F8" border="#FBCFE8"
      />
      <GrievanceWelfareSection />

      {/* Risk Alerts */}
      <SectionHeader
        title="Safety & Welfare Risk Alerts"
        sub="All active critical and amber alerts requiring management action"
        color="#DC2626" bg="#FEF2F2" border="#FECACA"
      />
      <RiskAlertsSummary />

      {/* CXO Composite Index */}
      <SectionHeader
        title="CXO Composite Safety & Welfare Index"
        sub="Single executive score — weighted average across all 7 performance pillars"
        color="#374151" bg="#F9FAFB" border="#E5E7EB"
      />
      <CompositeIndex />
    </div>
  );
}
