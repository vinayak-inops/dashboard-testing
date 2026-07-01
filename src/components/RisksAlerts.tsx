import {
  AlertTriangle, AlertCircle, CheckCircle, Users, Clock, Shield,
  DollarSign, Briefcase, FileWarning, UserX, TrendingUp, Activity,
  Scale, Ban, Building2, FileText, Zap,
} from 'lucide-react';

// ── Types & severity config ───────────────────────────────────────────────────

type Severity = 'critical' | 'amber' | 'green';

const SEV = {
  critical: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444', label: 'Critical', badge: '#FEE2E2' },
  amber:    { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#F59E0B', label: 'Amber',    badge: '#FEF9C3' },
  green:    { bg: '#F0FDF4', border: '#DCFCE7', text: '#15803D', dot: '#22C55E', label: 'Normal',   badge: '#DCFCE7' },
};

// ── Fallback data ─────────────────────────────────────────────────────────────

const ACTIVE_ALERTS: {
  id: number; severity: Severity; category: string; message: string; affected: string; time: string;
}[] = [
  { id:  1, severity: 'critical', category: 'Blacklist',             message: '3 blacklisted workers found active on site',                             affected: '3 employees',       time: 'Today 07:12'  },
  { id:  2, severity: 'critical', category: 'Labour Law',            message: '12 contractors operating with expired CLRA licenses',                    affected: '12 contractors',    time: 'Today 07:30'  },
  { id:  3, severity: 'critical', category: 'Workforce Availability',message: 'Site A workforce availability at 72% — 42 workers short of plan',        affected: 'Site A',            time: 'Today 08:14'  },
  { id:  4, severity: 'critical', category: 'PF / ESIC',             message: 'PF non-compliance detected for 125 active workers',                      affected: '125 workers',       time: 'Yesterday'    },
  { id:  5, severity: 'critical', category: 'Financial',             message: 'Contractor dues exceed ₹2 Crore — 3 contractors overdue >60 days',       affected: '₹2.14 Cr pending',  time: '2 days ago'   },
  { id:  6, severity: 'amber',   category: 'Overtime',              message: 'OT hours increased 35% vs last month — 120 employees exceed legal limits',affected: '6 contractors',     time: 'Today 08:00'  },
  { id:  7, severity: 'amber',   category: 'Work Order',            message: '15 work orders expiring within next 15 days — deployment at risk',        affected: '15 work orders',    time: 'Today'        },
  { id:  8, severity: 'amber',   category: 'Documentation',         message: '342 active workers missing mandatory statutory documents',                 affected: '342 workers',       time: 'Today'        },
  { id:  9, severity: 'amber',   category: 'Attendance',            message: 'Gram Vikas attendance below 75% for 3 consecutive days — dropped 18%',    affected: 'Gram Vikas',        time: 'Today'        },
  { id: 10, severity: 'amber',   category: 'Safety',               message: '225 workers entered site without valid safety certification',              affected: '225 workers',       time: 'Today'        },
  { id: 11, severity: 'amber',   category: 'Attrition',            message: 'Maa Gayatri attrition increased 28% — early attrition crossed 15%',       affected: 'Maa Gayatri',       time: 'This week'    },
  { id: 12, severity: 'amber',   category: 'Offboarding',          message: '85 exits pending full-and-final settlement clearance',                     affected: '85 employees',      time: 'This week'    },
  { id: 13, severity: 'amber',   category: 'Contractor Dependency', message: '42% of total workforce concentrated in a single contractor (BVOC)',       affected: 'BVOC',              time: 'This week'    },
  { id: 14, severity: 'amber',   category: 'Legal',                message: '18 unresolved labour grievances — 5 critical audit observations pending',  affected: '18 cases',          time: 'This week'    },
  { id: 15, severity: 'amber',   category: 'Labour Law',           message: '7 contractor licenses expire within 30 days',                              affected: '7 contractors',     time: 'This week'    },
];

const RISK_TILES: {
  title: string; severity: Severity; score: number; metric: string; alerts: number; icon: typeof AlertTriangle;
}[] = [
  { title: 'Workforce Availability', severity: 'critical', score: 48, metric: '72% present vs plan',     alerts: 2, icon: Users          },
  { title: 'Overtime Risk',          severity: 'amber',    score: 65, metric: '120 exceed OT limit',     alerts: 2, icon: Clock          },
  { title: 'Labour Law (CLRA)',      severity: 'critical', score: 38, metric: '12 expired licenses',     alerts: 2, icon: FileWarning    },
  { title: 'Documentation Risk',    severity: 'amber',    score: 68, metric: '342 docs missing',        alerts: 1, icon: FileText       },
  { title: 'PF & ESIC Risk',        severity: 'critical', score: 52, metric: '125 non-compliant',       alerts: 2, icon: Shield         },
  { title: 'Contractor Compliance', severity: 'amber',    score: 63, metric: '5 high-risk contractors', alerts: 1, icon: Building2      },
  { title: 'Attendance Risk',        severity: 'amber',    score: 72, metric: '3 days below 75%',        alerts: 2, icon: Activity       },
  { title: 'Safety Risk',            severity: 'amber',    score: 70, metric: '225 no valid cert',       alerts: 2, icon: Shield         },
  { title: 'Contractor Dependency', severity: 'amber',    score: 58, metric: '42% single contractor',   alerts: 1, icon: Zap            },
  { title: 'Financial Risk',         severity: 'critical', score: 44, metric: '₹2.14 Cr overdue',        alerts: 2, icon: DollarSign     },
  { title: 'Work Order Risk',        severity: 'amber',    score: 69, metric: '15 expiring ≤15 days',    alerts: 2, icon: Briefcase      },
  { title: 'Legal Exposure',         severity: 'amber',    score: 66, metric: '18 grievances open',      alerts: 2, icon: Scale          },
  { title: 'Offboarding Risk',       severity: 'amber',    score: 73, metric: '85 pending F&F',          alerts: 1, icon: UserX          },
  { title: 'Attrition Risk',         severity: 'amber',    score: 62, metric: '+28% attrition rise',     alerts: 2, icon: TrendingUp     },
  { title: 'Blacklist / Identity',   severity: 'critical', score: 20, metric: '3 active blacklisted',    alerts: 2, icon: Ban            },
];

// Workforce availability per site
const SITE_AVAILABILITY = [
  { site: 'Site A — Bangalore', required: 580, present: 418, pct: 72 },
  { site: 'Site B — Chennai',   required: 320, present: 275, pct: 86 },
  { site: 'Site C — Hyderabad', required: 210, present: 185, pct: 88 },
  { site: 'Site D — Pune',      required: 180, present: 174, pct: 97 },
  { site: 'Site E — Mumbai',    required: 140, present: 126, pct: 90 },
];

// OT by contractor
const OT_DATA = [
  { name: 'BVOC',        hours: 4850, prevHours: 3580, employees: 42 },
  { name: 'Gram Vikas',  hours: 2890, prevHours: 2140, employees: 28 },
  { name: 'BSA Corp',    hours: 1890, prevHours: 1420, employees: 15 },
  { name: 'SRI Cauvery', hours: 2100, prevHours: 1560, employees: 18 },
  { name: 'Techno Res.', hours: 2350, prevHours: 1740, employees: 12 },
  { name: 'Maa Gayatri', hours: 1224, prevHours:  910, employees:  5 },
];

// Document gaps
const DOC_GAPS = [
  { doc: 'Aadhaar',            missing:  28, risk: 'Legal',      color: '#3B82F6' },
  { doc: 'PAN',                missing:  45, risk: 'Tax',        color: '#8B5CF6' },
  { doc: 'Bank Account',       missing:  62, risk: 'Wage',       color: '#F59E0B' },
  { doc: 'PF Number',          missing:  88, risk: 'Statutory',  color: '#EF4444' },
  { doc: 'ESIC Number',        missing:  72, risk: 'Statutory',  color: '#EC4899' },
  { doc: 'Medical Certificate',missing:  31, risk: 'Safety',     color: '#06B6D4' },
  { doc: 'Training Certificate',missing: 16, risk: 'Compliance', color: '#84CC16' },
];

// Contractor risk composite scores
const CONTRACTOR_SCORES = [
  { name: 'BVOC',         license: 85, avail: 90, att: 92, pf: 88, esic: 90, safety: 88, score: 89 },
  { name: 'Techno Res.',  license: 90, avail: 88, att: 91, pf: 85, esic: 88, safety: 92, score: 89 },
  { name: 'SRI Cauvery',  license: 75, avail: 78, att: 82, pf: 70, esic: 72, safety: 80, score: 76 },
  { name: 'Gram Vikas',   license: 70, avail: 68, att: 62, pf: 65, esic: 70, safety: 72, score: 67 },
  { name: 'BSA Corp',     license: 65, avail: 70, att: 75, pf: 55, esic: 60, safety: 70, score: 66 },
  { name: 'Maa Gayatri',  license: 45, avail: 58, att: 72, pf: 40, esic: 45, safety: 60, score: 54 },
  { name: 'MERAQUI',      license: 35, avail: 40, att: 55, pf: 30, esic: 35, safety: 45, score: 40 },
];

// Financial outstanding
const FINANCIAL_ITEMS = [
  { label: 'Outstanding Contractor Bills', amount: '₹2.14 Cr', overdue: true  },
  { label: 'Pending Wage Payments',        amount: '₹48.2 L',  overdue: true  },
  { label: 'Pending PF Payments',          amount: '₹12.8 L',  overdue: false },
  { label: 'Pending ESIC Payments',        amount: '₹6.4 L',   overdue: false },
  { label: 'OT Cost (MoM increase)',       amount: '+₹9.2 L',  overdue: true  },
];

// ── Helper components ─────────────────────────────────────────────────────────

function SevBadge({ sev }: { sev: Severity }) {
  const s = SEV[sev];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
      style={{ backgroundColor: s.badge, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: s.dot, boxShadow: sev === 'critical' ? `0 0 0 2px ${s.dot}40` : 'none' }} />
      {s.label.toUpperCase()}
    </span>
  );
}

function RiskSectionHeader({
  title, sub, icon: Icon, sev, alertCount,
}: { title: string; sub: string; icon: typeof AlertTriangle; sev: Severity; alertCount: number }) {
  const s = SEV[sev];
  return (
    <div className="flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: s.dot + '20', color: s.dot }}>
        <Icon size={14} strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold leading-none" style={{ color: '#111827' }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>
      </div>
      {alertCount > 0 && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: s.dot, color: '#FFFFFF' }}>
          {alertCount} alert{alertCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

function MetricPair({ label, value, color = '#374151' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{label}</p>
    </div>
  );
}

// Score ring SVG
function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const sev: Severity = score >= 81 ? 'green' : score >= 61 ? 'amber' : 'critical';
  const color = SEV[sev].dot;
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{score}</text>
    </svg>
  );
}

// ── Alert Center ──────────────────────────────────────────────────────────────

function AlertCenter() {
  const criticals = ACTIVE_ALERTS.filter(a => a.severity === 'critical');
  const ambers    = ACTIVE_ALERTS.filter(a => a.severity === 'amber');

  return (
    <div>
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Critical Alerts',     value: criticals.length, color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', Icon: AlertCircle   },
          { label: 'Amber Alerts',         value: ambers.length,    color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', Icon: AlertTriangle  },
          { label: 'Total Active Alerts',  value: ACTIVE_ALERTS.length, color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', Icon: Activity },
          { label: 'Risk Categories',      value: RISK_TILES.filter(r => r.severity !== 'green').length, color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', Icon: Shield },
        ].map(k => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className="rounded-xl p-3 flex items-start gap-3"
              style={{ backgroundColor: k.bg, border: `1px solid ${k.border}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: k.color + '20', color: k.color }}>
                <Icon size={14} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums leading-none" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#6B7280' }}>{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active alert feed */}
      <div className="chart-container">
        <h3 className="chart-title mb-3">Active Alert Feed</h3>
        <div className="flex flex-col gap-1.5">
          {/* Critical first */}
          {criticals.map(a => (
            <AlertRow key={a.id} a={a} />
          ))}
          {/* Divider */}
          {ambers.length > 0 && (
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px" style={{ backgroundColor: '#F3F4F6' }} />
              <span className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#FEF9C3', color: '#D97706' }}>Amber Alerts</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#F3F4F6' }} />
            </div>
          )}
          {ambers.map(a => (
            <AlertRow key={a.id} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertRow({ a }: { a: typeof ACTIVE_ALERTS[0] }) {
  const s = SEV[a.severity];
  return (
    <div className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
        style={{ backgroundColor: s.dot, boxShadow: a.severity === 'critical' ? `0 0 0 3px ${s.dot}25` : 'none' }} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium leading-snug" style={{ color: '#111827' }}>{a.message}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] font-semibold px-1 py-0.5 rounded"
            style={{ backgroundColor: s.dot + '18', color: s.text }}>{a.category}</span>
          <span className="text-[9px]" style={{ color: '#9CA3AF' }}>{a.affected}</span>
        </div>
      </div>
      <span className="text-[9px] flex-shrink-0 mt-0.5" style={{ color: '#9CA3AF' }}>{a.time}</span>
    </div>
  );
}

// ── Risk Overview Grid ────────────────────────────────────────────────────────

function RiskOverview() {
  return (
    <div className="chart-container">
      <h3 className="chart-title mb-1">Risk Categories Overview</h3>
      <p className="chart-subtitle mb-3">Composite risk score per category — hover for details</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {RISK_TILES.map(r => {
          const Icon = r.icon;
          const s = SEV[r.severity];
          return (
            <div key={r.title} className="p-2.5 rounded-xl flex flex-col gap-1.5 cursor-default transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between">
                <Icon size={12} style={{ color: s.dot }} />
                {r.alerts > 0 && (
                  <span className="text-[8px] font-bold px-1 rounded-full"
                    style={{ backgroundColor: s.dot, color: '#FFF' }}>{r.alerts}</span>
                )}
              </div>
              <p className="text-[9px] font-semibold leading-tight" style={{ color: '#374151' }}>{r.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-[8px]" style={{ color: '#9CA3AF' }}>{r.metric}</p>
                <ScoreRing score={r.score} size={32} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 flex-wrap">
        {(['critical','amber','green'] as Severity[]).map(sev => (
          <div key={sev} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEV[sev].dot }} />
            <span className="text-[9px]" style={{ color: '#6B7280' }}>
              {SEV[sev].label}: score {sev === 'critical' ? '0–60' : sev === 'amber' ? '61–80' : '81–100'}
            </span>
          </div>
        ))}
        <span className="ml-auto text-[9px]" style={{ color: '#9CA3AF' }}>Score ring = composite risk (100 = fully compliant)</span>
      </div>
    </div>
  );
}

// ── Workforce Availability Risk ───────────────────────────────────────────────

function WorkforceAvailabilityRisk() {
  const maxReq = Math.max(...SITE_AVAILABILITY.map(s => s.required));
  return (
    <div>
      <RiskSectionHeader
        title="1. Workforce Availability Risk"
        sub="Can operations be impacted due to insufficient contract workforce?"
        icon={Users} sev="critical" alertCount={2}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        {/* Site availability bars */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Site-wise Deployment vs Plan</h3>
          <div className="flex flex-col gap-3">
            {SITE_AVAILABILITY.map(s => {
              const sev: Severity = s.pct < 85 ? 'critical' : s.pct < 92 ? 'amber' : 'green';
              const color = SEV[sev].dot;
              return (
                <div key={s.site}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] truncate" style={{ color: '#6B7280' }}>{s.site}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[9px]" style={{ color: '#9CA3AF' }}>{s.present}/{s.required}</span>
                      <span className="text-[10px] font-bold" style={{ color }}>{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden relative" style={{ backgroundColor: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${(s.present / maxReq) * 100}%`, backgroundColor: color, opacity: 0.85 }} />
                    {/* Plan line */}
                    <div className="absolute top-0 bottom-0 w-0.5" style={{ left: `${(s.required / maxReq) * 100}%`, backgroundColor: '#94A3B8' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] mt-2" style={{ color: '#9CA3AF' }}>Gray line = planned headcount. Formula: Gap % = (Required − Present) / Required × 100</p>
        </div>

        {/* Summary metrics */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Workforce Gap Metrics</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Required Today',    value: '1,430',  color: '#374151' },
              { label: 'Available Today',   value: '1,178',  color: '#3B82F6' },
              { label: 'Workforce Gap',     value: '252',    color: '#EF4444' },
              { label: 'Gap %',             value: '17.6%',  color: '#EF4444' },
              { label: 'Critical Sites',    value: '1',      color: '#EF4444' },
              { label: 'Low Deployment',    value: '2 contractors', color: '#F59E0B' },
            ].map(m => (
              <div key={m.label} className="p-2.5 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-[10px] font-semibold" style={{ color: '#DC2626' }}>
              🚨 Site A at 72% — CRITICAL. Operations risk if not addressed within today's shift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overtime Risk ─────────────────────────────────────────────────────────────

function OvertimeRisk() {
  const maxHrs = Math.max(...OT_DATA.map(d => d.hours));
  return (
    <div>
      <RiskSectionHeader
        title="2. Overtime Risk"
        sub="Are we compensating workforce shortage through excessive OT? High OT = understaffing + compliance risk."
        icon={Clock} sev="amber" alertCount={2}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        <div className="chart-container">
          <h3 className="chart-title mb-3">Contractor-wise OT Hours (vs Last Month)</h3>
          <div className="flex flex-col gap-2.5">
            {OT_DATA.map(d => {
              const change = Math.round(((d.hours - d.prevHours) / d.prevHours) * 100);
              return (
                <div key={d.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold" style={{ color: change > 20 ? '#EF4444' : '#F59E0B' }}>+{change}%</span>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: '#374151' }}>{d.hours.toLocaleString()} hrs</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.hours / maxHrs) * 100}%`, backgroundColor: change > 20 ? '#EF4444' : '#F59E0B', opacity: 0.8 }} />
                  </div>
                  <div className="h-1 rounded-full overflow-hidden mt-0.5" style={{ backgroundColor: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.prevHours / maxHrs) * 100}%`, backgroundColor: '#D1D5DB', opacity: 0.6 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] mt-2" style={{ color: '#9CA3AF' }}>Blue bar = current month. Gray bar = previous month.</p>
        </div>
        <div className="chart-container">
          <h3 className="chart-title mb-3">OT Risk Metrics</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Total OT Hours (MTD)',   value: '15,313', color: '#D97706' },
              { label: 'MoM OT Increase',         value: '+35%',   color: '#EF4444' },
              { label: 'Exceeding OT Limit',      value: '120',    color: '#EF4444' },
              { label: 'Est. OT Cost Impact',     value: '₹9.2L',  color: '#D97706' },
            ].map(m => (
              <div key={m.label} className="p-2.5 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="p-2 rounded-lg mb-2" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-[10px] font-semibold" style={{ color: '#D97706' }}>
              🚨 120 employees exceeded legal OT limits — immediate corrective action required.
            </p>
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-[10px]" style={{ color: '#D97706' }}>
              High OT indicates: Understaffing · Poor contractor planning · Statutory compliance risk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Labour Law + Documentation + PF/ESIC Risk ─────────────────────────────────

function ComplianceRisk() {
  const total = DOC_GAPS.reduce((s, d) => s + d.missing, 0);
  return (
    <div>
      <RiskSectionHeader
        title="3–5. Labour Law · Documentation · PF &amp; ESIC Risk"
        sub="CLRA license compliance, statutory document gaps, and PF/ESIC mapping failures"
        icon={FileWarning} sev="critical" alertCount={5}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
        {/* Labour Law */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Labour Law (CLRA)</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Expired Licenses',       value: '12', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
              { label: 'Expiring ≤ 30 days',     value: '7',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
              { label: 'Missing Work Orders',    value: '4',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
              { label: 'No Security Deposit',    value: '3',  color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center p-2 rounded-lg"
                style={{ backgroundColor: m.bg, border: `1px solid ${m.border}` }}>
                <span className="text-[10px]" style={{ color: '#374151' }}>{m.label}</span>
                <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-[10px]" style={{ color: '#DC2626' }}>🚨 12 contractors operating with expired licenses</p>
          </div>
        </div>

        {/* Documentation gaps */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Document Gaps — {total} total missing</h3>
          <div className="flex flex-col gap-1.5">
            {DOC_GAPS.map(d => (
              <div key={d.doc} className="flex items-center gap-2">
                <span className="text-[10px] w-28 truncate flex-shrink-0" style={{ color: '#6B7280' }}>{d.doc}</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.missing / 100) * 100}%`, backgroundColor: d.color }} />
                </div>
                <span className="text-[10px] font-bold tabular-nums w-5 text-right flex-shrink-0" style={{ color: '#374151' }}>{d.missing}</span>
                <span className="text-[9px] w-14 flex-shrink-0 px-1 py-0.5 rounded text-center"
                  style={{ backgroundColor: d.color + '18', color: d.color }}>{d.risk}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-[10px]" style={{ color: '#D97706' }}>🚨 342 active workers missing mandatory documents</p>
          </div>
        </div>

        {/* PF & ESIC */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">PF &amp; ESIC Compliance</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Not Mapped to PF',        value: '125', pct: 3.8, color: '#EF4444' },
              { label: 'Not Mapped to ESIC',       value: '85',  pct: 2.6, color: '#EF4444' },
              { label: 'PF Contribution Mismatch', value: '42',  pct: 1.3, color: '#F59E0B' },
              { label: 'ESIC Contribution Mismatch',value: '28', pct: 0.9, color: '#F59E0B' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px]" style={{ color: '#6B7280' }}>{m.label}</span>
                  <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value} ({m.pct}%)</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.pct * 8}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[10px]" style={{ color: '#DC2626' }}>🚨 PF non-compliance: 125 workers</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[10px]" style={{ color: '#DC2626' }}>🚨 ESIC missing: 85 eligible workers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contractor Risk Scorecard ─────────────────────────────────────────────────

function ContractorScorecard() {
  const WEIGHTS = [
    { key: 'license' as const, label: 'License',      w: 20 },
    { key: 'avail'   as const, label: 'Availability', w: 20 },
    { key: 'att'     as const, label: 'Attendance',   w: 20 },
    { key: 'pf'      as const, label: 'PF',           w: 15 },
    { key: 'esic'    as const, label: 'ESIC',         w: 15 },
    { key: 'safety'  as const, label: 'Safety',       w: 10 },
  ];

  return (
    <div>
      <RiskSectionHeader
        title="6. Contractor Compliance Risk Score"
        sub="Composite risk score — 0–60 High Risk · 61–80 Medium Risk · 81–100 Low Risk"
        icon={Building2} sev="amber" alertCount={1}
      />
      <div className="chart-container mb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" style={{ minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                <th className="py-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Contractor</th>
                {WEIGHTS.map(w => (
                  <th key={w.key} className="py-2 px-1.5 text-center text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                    {w.label}<br /><span style={{ color: '#D1D5DB', fontSize: 9 }}>{w.w}%</span>
                  </th>
                ))}
                <th className="py-2 pl-3 text-center text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Score</th>
                <th className="py-2 pl-2 text-center text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTOR_SCORES.map((c, i) => {
                const risk: Severity = c.score >= 81 ? 'green' : c.score >= 61 ? 'amber' : 'critical';
                return (
                  <tr key={c.name} style={{ borderBottom: i < CONTRACTOR_SCORES.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="py-2 pr-3 font-medium text-[11px]" style={{ color: '#374151' }}>{c.name}</td>
                    {WEIGHTS.map(w => {
                      const v = c[w.key];
                      const col = v >= 80 ? '#22C55E' : v >= 60 ? '#F59E0B' : '#EF4444';
                      return (
                        <td key={w.key} className="py-2 px-1.5 text-center">
                          <span className="text-[10px] font-bold" style={{ color: col }}>{v}</span>
                        </td>
                      );
                    })}
                    <td className="py-2 pl-3 text-center">
                      <ScoreRing score={c.score} size={36} />
                    </td>
                    <td className="py-2 pl-2 text-center">
                      <SevBadge sev={risk} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <p className="text-[10px]" style={{ color: '#DC2626' }}>
            🚨 5 contractors categorized as High Risk (score &lt; 60) — MERAQUI (40), Maa Gayatri (54), BSA Corp (66 Medium)
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Attendance + Safety Risk ──────────────────────────────────────────────────

function AttendanceSafetyRisk() {
  return (
    <div>
      <RiskSectionHeader
        title="7–8. Attendance Risk &amp; Safety Risk"
        sub="Consecutive absenteeism patterns and safety certification / PPE compliance failures"
        icon={Shield} sev="amber" alertCount={4}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
        {/* Attendance risk */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Attendance Risk Metrics</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Daily Attendance',         value: '89.3%', color: '#F59E0B' },
              { label: 'Below-75% Contractors',    value: '1',     color: '#EF4444' },
              { label: 'Consecutive Low Days',     value: '3',     color: '#EF4444' },
              { label: 'Attendance Drop (Gram V)', value: '-18%',  color: '#EF4444' },
            ].map(m => (
              <div key={m.label} className="p-2.5 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[10px]" style={{ color: '#DC2626' }}>🚨 Attendance below 75% for 3 consecutive days (Gram Vikas)</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[10px]" style={{ color: '#D97706' }}>🚨 Contractor Gram Vikas attendance dropped by 18%</p>
            </div>
          </div>
        </div>
        {/* Safety risk */}
        <div className="chart-container">
          <h3 className="chart-title mb-3">Safety Risk Metrics</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'No Safety Training',      value: '225', color: '#EF4444' },
              { label: 'Expired Certifications',  value: '84',  color: '#F59E0B' },
              { label: 'Missing PPE Records',     value: '35',  color: '#F59E0B' },
              { label: 'Safety Violations MTD',   value: '12',  color: '#EF4444' },
            ].map(m => (
              <div key={m.label} className="p-2.5 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[10px]" style={{ color: '#DC2626' }}>🚨 225 workers entered site without valid safety certification</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[10px]" style={{ color: '#D97706' }}>🚨 35 workers missing PPE compliance records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dependency · Financial · Work Order · Legal Risk ─────────────────────────

function OperationalRisk() {
  return (
    <div>
      <RiskSectionHeader
        title="9–12. Dependency · Financial · Work Order · Legal Risk"
        sub="Concentration risk, outstanding bills, expiring work orders, and open legal cases"
        icon={DollarSign} sev="critical" alertCount={6}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
        {/* Contractor Dependency */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Contractor Dependency</h3>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Workforce concentration risk</p>
          {[
            { name: 'BVOC', share: 42, color: '#EF4444' },
            { name: 'Gram Vikas', share: 24, color: '#F59E0B' },
            { name: 'BSA Corp', share: 16, color: '#3B82F6' },
            { name: 'Others', share: 18, color: '#D1D5DB' },
          ].map(d => (
            <div key={d.name}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{d.name}</span>
                <span className="text-[9px] font-bold" style={{ color: d.color }}>{d.share}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                <div className="h-full rounded-full" style={{ width: `${d.share}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
          <div className="p-1.5 rounded-lg mt-1" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 42% on single contractor</p>
          </div>
        </div>

        {/* Financial Risk */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Financial Risk</h3>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Outstanding payments & dues</p>
          <div className="flex flex-col gap-1.5">
            {FINANCIAL_ITEMS.map(f => (
              <div key={f.label} className="flex justify-between items-center p-1.5 rounded-lg"
                style={{ backgroundColor: f.overdue ? '#FEF2F2' : '#F8FAFC', border: `1px solid ${f.overdue ? '#FECACA' : '#E2E8F0'}` }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{f.label}</span>
                <span className="text-[10px] font-bold" style={{ color: f.overdue ? '#DC2626' : '#374151' }}>{f.amount}</span>
              </div>
            ))}
          </div>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 Wage payments pending for 450 workers</p>
          </div>
        </div>

        {/* Work Order Risk */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Work Order Risk</h3>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Expiry & deployment over-limit</p>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Expired WOs',         value: '4',   color: '#EF4444' },
              { label: 'Expiring ≤ 15 days',  value: '15',  color: '#D97706' },
              { label: 'Expiring ≤ 30 days',  value: '28',  color: '#F59E0B' },
              { label: 'Over WO Limit',        value: '2',   color: '#EF4444' },
              { label: 'Excess Workers',       value: '+70', color: '#EF4444' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-2 py-1 rounded-lg"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{m.label}</span>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-[9px]" style={{ color: '#D97706' }}>🚨 15 WOs expiring in 15 days</p>
          </div>
        </div>

        {/* Legal Exposure */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Legal Exposure</h3>
          <p className="text-[9px]" style={{ color: '#9CA3AF' }}>Active cases & audit findings</p>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Active Labour Cases',   value: '6',  color: '#EF4444' },
              { label: 'Employee Grievances',   value: '18', color: '#D97706' },
              { label: 'Contractor Disputes',   value: '4',  color: '#D97706' },
              { label: 'Critical Audit Obs.',   value: '5',  color: '#EF4444' },
              { label: 'Audit Closure Pending', value: '12', color: '#F59E0B' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-2 py-1 rounded-lg"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{m.label}</span>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-[9px]" style={{ color: '#D97706' }}>🚨 18 unresolved labour grievances</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Offboarding · Attrition · Blacklist Risk ──────────────────────────────────

function AttritionBlacklistRisk() {
  return (
    <div>
      <RiskSectionHeader
        title="13–15. Offboarding · Attrition · Blacklist Risk"
        sub="F&F settlement backlog, rising attrition, early exits, and blacklisted worker detection"
        icon={UserX} sev="amber" alertCount={5}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
        {/* Offboarding Risk */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Offboarding Risk</h3>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Pending F&F Settlements', value: '85',  color: '#EF4444' },
              { label: 'Unreturned Assets',        value: '23',  color: '#D97706' },
              { label: 'Exit Clearance Pending',   value: '41',  color: '#D97706' },
              { label: 'PF Transfer Pending',      value: '68',  color: '#F59E0B' },
              { label: 'ESIC Closure Pending',     value: '52',  color: '#F59E0B' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{m.label}</span>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 85 exits pending full-and-final settlement</p>
          </div>
        </div>

        {/* Attrition Risk */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Attrition Risk</h3>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Monthly Attrition Rate',   value: '2.4%',  color: '#F59E0B' },
              { label: 'Contractor Attrition (Max)',value: '+28%',  color: '#EF4444' },
              { label: 'Early Attrition (0–90d)',   value: '15.2%', color: '#EF4444' },
              { label: 'Early Exits (≤7 days)',     value: '8',     color: '#DC2626' },
              { label: 'Early Exits (≤30 days)',    value: '22',    color: '#D97706' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{m.label}</span>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[9px]" style={{ color: '#D97706' }}>🚨 Maa Gayatri attrition increased by 28%</p>
            </div>
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 Early attrition crossed 15% threshold</p>
            </div>
          </div>
        </div>

        {/* Blacklist Risk */}
        <div className="chart-container flex flex-col gap-2">
          <h3 className="chart-title">Blacklist &amp; Identity Risk</h3>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Blacklisted Workers Active',  value: '3',   color: '#EF4444' },
              { label: 'Blacklisted Contractors',     value: '1',   color: '#EF4444' },
              { label: 'Duplicate Aadhaar Detected',  value: '7',   color: '#EF4444' },
              { label: 'Identity Mismatch Flagged',   value: '4',   color: '#D97706' },
              { label: 'Pending Verification',        value: '12',  color: '#F59E0B' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span className="text-[9px]" style={{ color: '#6B7280' }}>{m.label}</span>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 3 blacklisted workers found active on site</p>
            </div>
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-[9px]" style={{ color: '#DC2626' }}>🚨 Duplicate Aadhaar detected across contractors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RisksAlerts() {
  const criticalCount = ACTIVE_ALERTS.filter(a => a.severity === 'critical').length;

  return (
    <div>
      {/* Page banner */}
      <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
        style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#EF4444', boxShadow: '0 0 0 4px #FCA5A540' }}>
          <AlertCircle size={18} strokeWidth={2} style={{ color: '#FFFFFF' }} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: '#111827' }}>Risks &amp; Alerts Dashboard</h2>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
            Real-time risk monitoring across 15 categories — workforce, compliance, financial, safety &amp; legal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-xs font-bold" style={{ color: '#DC2626' }}>
            {criticalCount} Critical Alerts Active
          </span>
        </div>
      </div>

      {/* Alert Center + Summary */}
      <AlertCenter />

      {/* Risk Overview Grid */}
      <div className="mt-6">
        <RiskOverview />
      </div>

      {/* Detailed risk sections */}
      <div className="mt-6">
        <WorkforceAvailabilityRisk />
      </div>
      <div className="mt-4">
        <OvertimeRisk />
      </div>
      <div className="mt-4">
        <ComplianceRisk />
      </div>
      <div className="mt-4">
        <ContractorScorecard />
      </div>
      <div className="mt-4">
        <AttendanceSafetyRisk />
      </div>
      <div className="mt-4">
        <OperationalRisk />
      </div>
      <div className="mt-4">
        <AttritionBlacklistRisk />
      </div>
    </div>
  );
}
