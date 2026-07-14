import {
  UserPlus, UserMinus, TrendingUp, TrendingDown, Users, Clock,
  DollarSign, Briefcase, CheckCircle, AlertCircle, ArrowRight,
  Target, Activity, Shield, AlertTriangle,
} from 'lucide-react';
import FormulaTooltip from './FormulaTooltip';

// ── Fallback data ─────────────────────────────────────────────────────────────

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MONTHLY_ON  = [185, 210, 198, 225, 240, 220, 235, 260, 215, 248, 270, 250];
const MONTHLY_OFF = [ 55,  62,  48,  71,  58,  65,  52,  68,  45,  59,  72,  60];
const MONTHLY_NET = MONTHLY_ON.map((v, i) => v - MONTHLY_OFF[i]);

const BY_CONTRACTOR_ON = [
  { name: 'BVOC', count: 120 },
  { name: 'Gram Vikas', count: 85 },
  { name: 'BSA Corp', count: 62 },
  { name: 'SRI Cauvery', count: 58 },
  { name: 'Techno Res.', count: 48 },
  { name: 'Maa Gayatri', count: 35 },
];
const BY_LOCATION_ON = [
  { name: 'Bangalore', count: 150 },
  { name: 'Chennai', count: 95 },
  { name: 'Hyderabad', count: 72 },
  { name: 'Pune', count: 61 },
  { name: 'Mumbai', count: 30 },
];
const BY_DEPT_ON = [
  { name: 'Production', count: 145 },
  { name: 'Quality', count: 62 },
  { name: 'Logistics', count: 52 },
  { name: 'Maintenance', count: 48 },
  { name: 'Administration', count: 101 },
];
const BY_SKILL_ON = [
  { name: 'Highly Skilled', count: 124 },
  { name: 'Semi-Skilled', count: 118 },
  { name: 'Skilled', count: 92 },
  { name: 'Unskilled', count: 74 },
];
const BY_GENDER_ON = [
  { name: 'Male', count: 214, color: '#3B82F6' },
  { name: 'Female', count: 72, color: '#EC4899' },
  { name: 'Others', count: 4, color: '#9CA3AF' },
];

const ONBOARD_COMPLIANCE = [
  { label: 'Aadhaar Submitted',   pct: 98, color: '#22C55E' },
  { label: 'PAN Submitted',       pct: 94, color: '#3B82F6' },
  { label: 'Bank A/C Verified',   pct: 89, color: '#8B5CF6' },
  { label: 'PF Enrollment',       pct: 96, color: '#F59E0B' },
  { label: 'ESIC Enrollment',     pct: 91, color: '#EC4899' },
  { label: 'Medical Checkup',     pct: 87, color: '#06B6D4' },
  { label: 'Training Completed',  pct: 82, color: '#84CC16' },
];

const JOINING_FUNNEL = { offered: 520, accepted: 438, joined: 408, noShow: 30 };

const WORKFORCE_READINESS = [
  { label: 'Active within 7 Days',     value: 342, icon: CheckCircle, color: '#22C55E' },
  { label: 'Induction Completed',      value: 318, icon: Shield,      color: '#3B82F6' },
  { label: 'Assigned to Projects',     value: 296, icon: Target,      color: '#8B5CF6' },
  { label: 'Pending Deployment',       value:  46, icon: Clock,       color: '#F59E0B' },
];

const BY_CONTRACTOR_OFF = [
  { name: 'BVOC', count: 35 },
  { name: 'Gram Vikas', count: 22 },
  { name: 'BSA Corp', count: 18 },
  { name: 'SRI Cauvery', count: 12 },
  { name: 'Techno Res.', count: 8 },
  { name: 'Maa Gayatri', count: 7 },
];
const BY_LOCATION_OFF = [
  { name: 'Bangalore', count: 32 },
  { name: 'Chennai', count: 18 },
  { name: 'Hyderabad', count: 14 },
  { name: 'Pune', count: 10 },
  { name: 'Mumbai', count: 8 },
];
const BY_DEPT_OFF = [
  { name: 'Production', count: 38 },
  { name: 'Administration', count: 14 },
  { name: 'Quality', count: 12 },
  { name: 'Maintenance', count: 10 },
  { name: 'Logistics', count: 8 },
];
const DEPT_ATTRITION = [
  { name: 'Administration', pct: 4.1 },
  { name: 'Production',     pct: 3.2 },
  { name: 'Quality',        pct: 2.8 },
  { name: 'Maintenance',    pct: 2.1 },
  { name: 'Logistics',      pct: 1.8 },
];
const EXIT_REASONS = [
  { label: 'Resignation',     count: 45, color: '#3B82F6' },
  { label: 'Contract End',    count: 22, color: '#10B981' },
  { label: 'Health/Personal', count: 10, color: '#F59E0B' },
  { label: 'Absconding',      count: 12, color: '#EF4444' },
  { label: 'Termination',     count:  8, color: '#8B5CF6' },
  { label: 'Retirement',      count:  5, color: '#EC4899' },
];
const MONTHLY_ATTRITION = [2.8, 3.1, 2.4, 3.4, 2.6, 3.0, 2.2, 3.2, 2.0, 2.7, 3.1, 2.4];

const OFFBOARD_COMPLIANCE = [
  { label: 'F&F Settlement',  pct: 88, color: '#22C55E' },
  { label: 'Asset Recovery',  pct: 94, color: '#3B82F6' },
  { label: 'ID Card Returned',pct: 97, color: '#8B5CF6' },
  { label: 'Exit Interview',  pct: 76, color: '#F59E0B' },
  { label: 'PF Transfer',     pct: 82, color: '#EC4899' },
  { label: 'ESIC Closure',    pct: 79, color: '#06B6D4' },
];

const SCORECARD = [
  { metric: 'Onboarded',       current: '250', previous: '220', delta: '+30',  trend: 'up'   as const },
  { metric: 'Offboarded',      current: '60',  previous: '75',  delta: '-15',  trend: 'down' as const },
  { metric: 'Net Growth',      current: '+190',previous: '+145', delta: '+45', trend: 'up'   as const },
  { metric: 'Attrition Rate',  current: '2.4%',previous: '3.1%', delta: '-0.7%', trend: 'down' as const },
  { metric: 'Compliance %',    current: '96%', previous: '94%', delta: '+2%',  trend: 'up'   as const },
  { metric: 'Avg Onboard Days',current: '3.2', previous: '4.1', delta: '-0.9', trend: 'down' as const },
];

// ── Helper components ─────────────────────────────────────────────────────────

type KPI = { title: string; value: string | number; sub?: string; color: string; icon: typeof UserPlus; trend?: number; formula?: string };

function MiniKPI({ k }: { k: KPI }) {
  const Icon = k.icon;
  const isUp   = k.trend !== undefined && k.trend > 0;
  const isDown = k.trend !== undefined && k.trend < 0;
  return (
    <div className="kpi-card">
      <div className="kpi-accent" style={{ backgroundColor: k.color }} />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="kpi-icon" style={{ backgroundColor: k.color + '1A', color: k.color }}>
            <Icon size={14} strokeWidth={1.75} />
          </div>
          {k.trend !== undefined && (
            <div className={`trend-badge ${isUp ? 'trend-up' : isDown ? 'trend-down' : 'trend-neutral'}`}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{Math.abs(k.trend)}%</span>
            </div>
          )}
        </div>
        <p className="kpi-value">{typeof k.value === 'number' ? k.value.toLocaleString() : k.value}</p>
        {k.formula ? (
          <FormulaTooltip formula={k.formula}>
            <p className="kpi-title underline decoration-dotted decoration-gray-300 underline-offset-2">{k.title}</p>
          </FormulaTooltip>
        ) : (
          <p className="kpi-title">{k.title}</p>
        )}
        {k.sub && <p className="kpi-subtitle">{k.sub}</p>}
      </div>
    </div>
  );
}

function HBar({ items, colorFn }: { items: { name: string; count: number }[]; colorFn?: (i: number) => string }) {
  const max = Math.max(...items.map(d => d.count), 1);
  const defaultColors = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4'];
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-[10px] w-20 truncate flex-shrink-0" style={{ color: '#6B7280' }}>{d.name}</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: colorFn ? colorFn(i) : defaultColors[i % defaultColors.length] }} />
          </div>
          <span className="text-[10px] font-bold tabular-nums w-8 text-right flex-shrink-0" style={{ color: '#374151' }}>
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function ComplianceBar({ items }: { items: { label: string; pct: number; color: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(d => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="text-[10px] flex-shrink-0 w-32 truncate" style={{ color: '#6B7280' }}>{d.label}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
          </div>
          <span className="text-[10px] font-bold tabular-nums w-8 text-right flex-shrink-0"
            style={{ color: d.pct >= 90 ? '#15803D' : d.pct >= 80 ? '#A16207' : '#DC2626' }}>
            {d.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

// SVG line chart helper
function TrendLine({
  data, W = 560, H = 150, color = '#3B82F6', fillColor,
  labels, secondLine, secondColor = '#EF4444',
}: {
  data: number[]; W?: number; H?: number; color?: string;
  fillColor?: string; labels?: string[];
  secondLine?: number[]; secondColor?: string;
}) {
  const PAD = { t: 14, r: 12, b: 32, l: 30 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;
  const combined = secondLine ? [...data, ...secondLine] : data;
  const maxV = Math.max(...combined.map(Math.abs), 1);
  const minV = Math.min(...combined, 0);
  const range = maxV - minV || 1;

  function px(i: number) { return PAD.l + (i / (data.length - 1)) * cW; }
  function py(v: number) { return PAD.t + cH - ((v - minV) / range) * cH; }

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const areaPath = fillColor
    ? linePath + ` L${px(data.length - 1).toFixed(1)},${(PAD.t + cH).toFixed(1)} L${PAD.l},${(PAD.t + cH).toFixed(1)} Z`
    : '';
  const line2Path = secondLine
    ? secondLine.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
    : '';

  const zero = minV < 0 ? py(0) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* Zero line if data goes negative */}
      {zero !== null && (
        <line x1={PAD.l} x2={W - PAD.r} y1={zero} y2={zero} stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 2" />
      )}
      {/* Grid */}
      {[0, 0.5, 1].map(f => (
        <line key={f} x1={PAD.l} x2={W - PAD.r}
          y1={PAD.t + f * cH} y2={PAD.t + f * cH}
          stroke="#F1F5F9" strokeWidth={1} />
      ))}
      {/* Y-axis labels */}
      {[0, 0.5, 1].map(f => (
        <text key={f} x={PAD.l - 4} y={PAD.t + (1 - f) * cH + 3}
          textAnchor="end" fontSize={8} fill="#D1D5DB">
          {Math.round(minV + range * f)}
        </text>
      ))}
      {/* Area fill */}
      {areaPath && <path d={areaPath} fill={fillColor} opacity={0.12} />}
      {/* Second line */}
      {line2Path && <path d={line2Path} fill="none" stroke={secondColor} strokeWidth={1.5} strokeDasharray="4 2" />}
      {/* Main line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.75} />
      {/* Dots */}
      {data.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={2} fill={color} stroke="white" strokeWidth={1} />
      ))}
      {/* X labels */}
      {labels && labels.map((l, i) => {
        if (labels.length > 8 && i % 2 !== 0 && i !== labels.length - 1) return null;
        return (
          <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize={7.5} fill="#CBD5E1">{l}</text>
        );
      })}
      {/* Baseline */}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + cH} y2={PAD.t + cH} stroke="#E2E8F0" strokeWidth={1} />
    </svg>
  );
}

// SVG donut chart
function DonutChart({ items, size = 140 }: { items: { label: string; count: number; color: string }[]; size?: number }) {
  const total = items.reduce((s, d) => s + d.count, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, innerR = r - 22;
  let cumAngle = -90;

  function arc(start: number, end: number, outerR: number, innerR: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1o = cx + outerR * Math.cos(toRad(start));
    const y1o = cy + outerR * Math.sin(toRad(start));
    const x2o = cx + outerR * Math.cos(toRad(end));
    const y2o = cy + outerR * Math.sin(toRad(end));
    const x1i = cx + innerR * Math.cos(toRad(end));
    const y1i = cy + innerR * Math.sin(toRad(end));
    const x2i = cx + innerR * Math.cos(toRad(start));
    const y2i = cy + innerR * Math.sin(toRad(start));
    const large = end - start > 180 ? 1 : 0;
    return `M${x1o},${y1o} A${outerR},${outerR} 0 ${large} 1 ${x2o},${y2o} L${x1i},${y1i} A${innerR},${innerR} 0 ${large} 0 ${x2i},${y2i} Z`;
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
      {items.map((d, i) => {
        const slice = (d.count / total) * 360;
        const startA = cumAngle;
        const endA = cumAngle + slice - 1;
        cumAngle += slice;
        return <path key={i} d={arc(startA, endA, r, innerR)} fill={d.color} opacity={0.88} />;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111827">{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize={8} fill="#9CA3AF">Total Exits</text>
    </svg>
  );
}

// ── Onboarding Tab ────────────────────────────────────────────────────────────

function OnboardingTab() {
  const convRate = ((JOINING_FUNNEL.joined / JOINING_FUNNEL.offered) * 100).toFixed(1);
  const fillRate = ((408 / 532) * 100).toFixed(1);

  const kpis: KPI[] = [
    { title: 'Total Onboarded (YTD)', value: 2756,   sub: 'Year to date', color: '#3B82F6', icon: UserPlus,  trend: 14  },
    { title: 'New Joiners MTD',       value: 250,    sub: 'This month',   color: '#10B981', icon: Users,     trend: 14  },
    { title: 'New Joiners QTD',       value: 712,    sub: 'This quarter', color: '#8B5CF6', icon: Users,     trend: 8   },
    { title: 'Offer-to-Join Rate',    value: `${convRate}%`, sub: 'Conversion',  color: '#F59E0B', icon: Target,
      formula: `Offer-to-Join % = (Offers Accepted ÷ Offers Extended) × 100  →  (${convRate})%` },
    { title: 'Avg Time to Onboard',   value: '3.2d', sub: 'Days to activate', color: '#06B6D4', icon: Clock,    trend: -22 },
    { title: 'Cost per Hire',         value: '₹12,450', sub: 'Avg hiring cost',color: '#EC4899', icon: DollarSign           },
    { title: 'Open Positions',        value: 124,    sub: 'Unfilled roles',   color: '#EF4444', icon: Briefcase             },
    { title: 'Filled Positions',      value: 408,    sub: `${fillRate}% fill rate`, color: '#22C55E', icon: CheckCircle, trend: 6,
      formula: `Fill Rate % = (Filled Positions ÷ (Open + Filled Positions)) × 100  →  = ${fillRate}%` },
  ];

  return (
    <div>
      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {kpis.map(k => <MiniKPI key={k.title} k={k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Distribution */}
        <div className="chart-container">
          <h3 className="chart-title mb-4">Onboarding Distribution</h3>

          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Contractor</p>
          <HBar items={BY_CONTRACTOR_ON} />

          <div className="my-3 h-px" style={{ backgroundColor: '#F1F5F9' }} />

          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Location</p>
          <HBar items={BY_LOCATION_ON} colorFn={() => '#10B981'} />
        </div>

        {/* Joining Trend */}
        <div className="chart-container">
          <h3 className="chart-title">Monthly Joining Trend</h3>
          <p className="chart-subtitle mb-3">New joiners per month (current year)</p>
          <TrendLine data={MONTHLY_ON} color="#3B82F6" fillColor="#3B82F6" labels={MONTHS_SHORT} H={160} />
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: '#3B82F6' }}>Avg:</span>
              <span className="text-xs tabular-nums" style={{ color: '#374151' }}>
                {Math.round(MONTHLY_ON.reduce((a, b) => a + b, 0) / MONTHLY_ON.length)} / month
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: '#22C55E' }}>Peak:</span>
              <span className="text-xs tabular-nums" style={{ color: '#374151' }}>
                {Math.max(...MONTHLY_ON)} ({MONTHS_SHORT[MONTHLY_ON.indexOf(Math.max(...MONTHLY_ON))]})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Dept + Skill + Gender */}
        <div className="chart-container">
          <h3 className="chart-title mb-4">Breakdown by Dept, Skill &amp; Gender</h3>

          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Department</p>
          <HBar items={BY_DEPT_ON} colorFn={() => '#8B5CF6'} />

          <div className="my-3 h-px" style={{ backgroundColor: '#F1F5F9' }} />

          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Skill Level</p>
          <HBar items={BY_SKILL_ON} colorFn={() => '#F59E0B'} />

          <div className="my-3 h-px" style={{ backgroundColor: '#F1F5F9' }} />

          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>By Gender</p>
          <div className="flex items-center gap-3">
            {(() => {
              const total = BY_GENDER_ON.reduce((s, d) => s + d.count, 0);
              return (
                <>
                  <div className="flex-1 h-4 rounded-full overflow-hidden flex">
                    {BY_GENDER_ON.map(d => (
                      <div key={d.name} className="h-full" style={{ width: `${(d.count / total) * 100}%`, backgroundColor: d.color }} />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {BY_GENDER_ON.map(d => (
                      <div key={d.name} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.name}: <strong>{d.count}</strong></span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Compliance */}
        <div className="chart-container">
          <h3 className="chart-title">Onboarding Compliance</h3>
          <p className="chart-subtitle mb-3">Document &amp; process completion rates</p>
          <ComplianceBar items={ONBOARD_COMPLIANCE} />
          <div className="mt-3 flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
            <CheckCircle size={12} style={{ color: '#15803D' }} />
            <span className="text-[10px]" style={{ color: '#15803D' }}>
              Overall compliance:{' '}
              <strong>{(ONBOARD_COMPLIANCE.reduce((s, d) => s + d.pct, 0) / ONBOARD_COMPLIANCE.length).toFixed(0)}%</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Joining effectiveness funnel */}
        <div className="chart-container">
          <h3 className="chart-title">Joining Effectiveness Funnel</h3>
          <p className="chart-subtitle mb-4">From offer released to active employee</p>
          {[
            { label: 'Offers Released',   value: JOINING_FUNNEL.offered,  color: '#3B82F6', pct: 100 },
            { label: 'Offers Accepted',   value: JOINING_FUNNEL.accepted, color: '#8B5CF6', pct: Math.round(JOINING_FUNNEL.accepted / JOINING_FUNNEL.offered * 100) },
            { label: 'Candidates Joined', value: JOINING_FUNNEL.joined,   color: '#22C55E', pct: Math.round(JOINING_FUNNEL.joined   / JOINING_FUNNEL.offered * 100) },
            { label: 'No-Shows',          value: JOINING_FUNNEL.noShow,   color: '#EF4444', pct: Math.round(JOINING_FUNNEL.noShow   / JOINING_FUNNEL.offered * 100) },
          ].map((s, i) => (
            <div key={s.label} className="mb-2.5">
              <div className="flex justify-between mb-1">
                <span className="text-[10px]" style={{ color: '#6B7280' }}>{s.label}</span>
                <span className="text-[10px] font-bold tabular-nums" style={{ color: s.color }}>{s.value} <span style={{ color: '#9CA3AF' }}>({s.pct}%)</span></span>
              </div>
              <div className="h-6 rounded-md overflow-hidden flex items-center" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="h-full rounded-md transition-all flex items-center justify-end pr-2"
                  style={{ width: `${s.pct}%`, backgroundColor: s.color, opacity: i === 3 ? 0.6 : 0.85, minWidth: s.value > 0 ? 4 : 0 }}>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <p className="text-xs font-bold" style={{ color: '#1D4ED8' }}>{convRate}%</p>
              <FormulaTooltip formula={`Offer-to-Join % = (Candidates Joined ÷ Offers Extended) × 100  →  (${JOINING_FUNNEL.joined} ÷ ${JOINING_FUNNEL.offered}) × 100 = ${convRate}%`}>
                <p className="text-[9px] underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color: '#6B7280' }}>Offer-to-Join Rate</p>
              </FormulaTooltip>
            </div>
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-xs font-bold" style={{ color: '#DC2626' }}>
                {((JOINING_FUNNEL.noShow / JOINING_FUNNEL.offered) * 100).toFixed(1)}%
              </p>
              <FormulaTooltip formula={`No-Show % = (No-Shows ÷ Offers Extended) × 100  →  (${JOINING_FUNNEL.noShow} ÷ ${JOINING_FUNNEL.offered}) × 100 = ${((JOINING_FUNNEL.noShow / JOINING_FUNNEL.offered) * 100).toFixed(1)}%`}>
                <p className="text-[9px] underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color: '#6B7280' }}>No-Show Rate</p>
              </FormulaTooltip>
            </div>
          </div>
        </div>

        {/* Workforce readiness */}
        <div className="chart-container">
          <h3 className="chart-title">Workforce Readiness</h3>
          <p className="chart-subtitle mb-4">Post-onboarding deployment status</p>
          <div className="grid grid-cols-2 gap-3">
            {WORKFORCE_READINESS.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="p-3 rounded-xl flex flex-col items-center text-center gap-1.5"
                  style={{ backgroundColor: r.color + '10', border: `1px solid ${r.color}30` }}>
                  <Icon size={18} style={{ color: r.color }} />
                  <p className="text-lg font-bold tabular-nums" style={{ color: r.color }}>{r.value}</p>
                  <p className="text-[9px] leading-tight" style={{ color: '#6B7280' }}>{r.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
            <p className="text-[10px]" style={{ color: '#15803D' }}>
              <strong>{Math.round((WORKFORCE_READINESS[2].value / WORKFORCE_READINESS[0].value) * 100)}%</strong> of active employees are already assigned to projects within 7 days of joining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Offboarding Tab ───────────────────────────────────────────────────────────

function OffboardingTab() {
  const totalExits = EXIT_REASONS.reduce((s, d) => s + d.count, 0);
  const voluntaryPct = (((45 + 5 + 10) / totalExits) * 100).toFixed(1);
  const involuntaryPct = (((12 + 8) / totalExits) * 100).toFixed(1);
  const earlyAttPct = ((22 / totalExits) * 100).toFixed(1);

  const kpis: KPI[] = [
    { title: 'Total Exits (YTD)',   value: 702,    sub: 'Year to date',     color: '#EF4444', icon: UserMinus, trend: -12 },
    { title: 'Exits MTD',           value: 60,     sub: 'This month',       color: '#F97316', icon: UserMinus, trend: -20 },
    { title: 'Exits QTD',           value: 178,    sub: 'This quarter',     color: '#F59E0B', icon: UserMinus, trend: -9  },
    { title: 'Attrition Rate',      value: '2.4%', sub: 'Monthly rate',     color: '#DC2626', icon: Activity,  trend: -23,
      formula: `Attrition % = (Exits in Period ÷ Avg Headcount) × 100  →  (60 ÷ 2,500) × 100 = 2.4%` },
    { title: 'Active Workforce',    value: '3,285',sub: 'Total headcount',  color: '#22C55E', icon: Users,     trend: 5   },
    { title: 'Voluntary Attrition', value: `${voluntaryPct}%`, sub: 'Self-initiated', color: '#8B5CF6', icon: ArrowRight,
      formula: `Voluntary Attrition % = (Voluntary Exits ÷ Total Exits) × 100  →  = ${voluntaryPct}%` },
    { title: 'Involuntary Attrition', value: `${involuntaryPct}%`, sub: 'Company-initiated', color: '#EF4444', icon: AlertCircle,
      formula: `Involuntary Attrition % = (Involuntary Exits ÷ Total Exits) × 100  →  = ${involuntaryPct}%` },
    { title: 'Early Attrition %',   value: `${earlyAttPct}%`, sub: '≤30 days', color: '#F59E0B', icon: AlertTriangle,
      formula: `Early Attrition % = (Exits ≤30 Days ÷ Total Onboarded) × 100  →  = ${earlyAttPct}%` },
  ];

  return (
    <div>
      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {kpis.map(k => <MiniKPI key={k.title} k={k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Exit reasons donut + distribution */}
        <div className="chart-container">
          <h3 className="chart-title">Exit Reasons Analysis</h3>
          <p className="chart-subtitle mb-3">Breakdown by reason — {totalExits} total exits this month</p>
          <div className="flex items-start gap-4">
            <DonutChart items={EXIT_REASONS} size={130} />
            <div className="flex-1 flex flex-col gap-1.5 mt-1">
              {EXIT_REASONS.map(d => (
                <div key={d.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${(d.count / totalExits) * 100}%`, backgroundColor: d.color }} />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums w-6 text-right" style={{ color: '#374151' }}>{d.count}</span>
                    <span className="text-[9px] w-8 text-right" style={{ color: '#9CA3AF' }}>
                      {((d.count / totalExits) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="chart-container">
          <h3 className="chart-title mb-4">Offboarding Distribution</h3>
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Contractor</p>
          <HBar items={BY_CONTRACTOR_OFF} colorFn={() => '#EF4444'} />
          <div className="my-3 h-px" style={{ backgroundColor: '#F1F5F9' }} />
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Location</p>
          <HBar items={BY_LOCATION_OFF} colorFn={() => '#F97316'} />
          <div className="my-3 h-px" style={{ backgroundColor: '#F1F5F9' }} />
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>By Department</p>
          <HBar items={BY_DEPT_OFF} colorFn={() => '#F59E0B'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Monthly attrition trend */}
        <div className="chart-container">
          <h3 className="chart-title">Monthly Attrition Rate Trend</h3>
          <p className="chart-subtitle mb-3">Attrition % per month — target &lt;2.5%</p>
          <TrendLine data={MONTHLY_ATTRITION} color="#EF4444" fillColor="#EF4444" labels={MONTHS_SHORT} H={150} />
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-0.5 rounded" style={{ backgroundColor: '#DCFCE7' }} />
            <span className="text-[9px]" style={{ color: '#9CA3AF' }}>Target: 2.5%</span>
            <div className="flex-1 h-0.5 rounded" style={{ backgroundColor: '#DCFCE7' }} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { label: 'Current', value: '2.4%', good: true },
              { label: 'YTD Avg', value: '2.7%', good: true },
              { label: 'Peak', value: '3.4%', good: false },
            ].map(s => (
              <div key={s.label} className="text-center p-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                <p className="text-xs font-bold" style={{ color: s.good ? '#15803D' : '#DC2626' }}>{s.value}</p>
                <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dept-wise attrition */}
        <div className="chart-container">
          <h3 className="chart-title">Department-wise Attrition %</h3>
          <p className="chart-subtitle mb-3">Attrition rate per department this month</p>
          <div className="flex flex-col gap-2.5">
            {DEPT_ATTRITION.map(d => {
              const bad = d.pct >= 3.5;
              const warn = d.pct >= 2.5;
              const color = bad ? '#EF4444' : warn ? '#F59E0B' : '#22C55E';
              return (
                <div key={d.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.name}</span>
                    <FormulaTooltip formula={`Dept Attrition % = (Dept Exits ÷ Dept Headcount) × 100  →  = ${d.pct}%`}>
                      <span className="text-[10px] font-bold underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color }}>{d.pct}%</span>
                    </FormulaTooltip>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.pct / 5) * 100}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[9px]" style={{ color: '#9CA3AF' }}>
            {[['#22C55E','< 2.5% — Good'],['#F59E0B','2.5–3.5% — Watch'],['#EF4444','> 3.5% — Alert']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c as string }} />{l}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Early attrition */}
        <div className="chart-container">
          <h3 className="chart-title">Early Attrition Analysis</h3>
          <p className="chart-subtitle mb-3">Exits within first 7 / 30 / 90 days — key onboarding quality metric</p>
          {[
            { label: 'Exits within 7 days',  value: 8,  pct: 7.8,  color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
            { label: 'Exits within 30 days', value: 22, pct: 21.6, color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
            { label: 'Exits within 90 days', value: 38, pct: 37.3, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between p-2.5 rounded-lg mb-2"
              style={{ backgroundColor: r.bg, border: `1px solid ${r.border}` }}>
              <div>
                <p className="text-[10px] font-semibold" style={{ color: '#374151' }}>{r.label}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>of total exits</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold tabular-nums" style={{ color: r.color }}>{r.value}</p>
                <p className="text-[9px]" style={{ color: r.color }}>{r.pct}%</p>
              </div>
            </div>
          ))}
          <div className="p-2 rounded-lg mt-1" style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A' }}>
            <p className="text-[10px]" style={{ color: '#92400E' }}>
              <strong>{earlyAttPct}%</strong> of all exits happen within the first 30 days — review onboarding quality for these roles.
            </p>
          </div>
        </div>

        {/* Offboarding compliance */}
        <div className="chart-container">
          <h3 className="chart-title">Offboarding Compliance</h3>
          <p className="chart-subtitle mb-3">Settlement, asset recovery &amp; documentation rates</p>
          <ComplianceBar items={OFFBOARD_COMPLIANCE} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
              <p className="text-xs font-bold" style={{ color: '#15803D' }}>
                {(OFFBOARD_COMPLIANCE.reduce((s, d) => s + d.pct, 0) / OFFBOARD_COMPLIANCE.length).toFixed(0)}%
              </p>
              <p className="text-[9px]" style={{ color: '#6B7280' }}>Overall compliance</p>
            </div>
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <p className="text-xs font-bold" style={{ color: '#C2410C' }}>
                {OFFBOARD_COMPLIANCE.filter(d => d.pct < 85).length} items
              </p>
              <p className="text-[9px]" style={{ color: '#6B7280' }}>Need attention (&lt;85%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workforce impact */}
      <div className="chart-container">
        <h3 className="chart-title mb-4">Workforce Impact of Exits</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Vacancies Created',          value: 82,       color: '#EF4444', sub: 'From exits',           icon: Briefcase    },
            { label: 'Replacements In Progress',   value: 54,       color: '#F59E0B', sub: '66% coverage',         icon: Activity     },
            { label: 'Critical Positions Vacant',  value: 12,       color: '#DC2626', sub: 'Needs urgent action',  icon: AlertTriangle },
            { label: 'Productivity Impact',        value: 'Medium', color: '#8B5CF6', sub: 'Estimated risk level', icon: Target        },
          ].map(r => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="p-3 rounded-xl" style={{ backgroundColor: r.color + '0D', border: `1px solid ${r.color}25` }}>
                <Icon size={14} style={{ color: r.color, marginBottom: 6 }} />
                <p className="text-base font-bold" style={{ color: r.color }}>{r.value}</p>
                <p className="text-[10px] font-medium leading-tight mt-0.5" style={{ color: '#374151' }}>{r.label}</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>{r.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Strategic Overview Tab ────────────────────────────────────────────────────

function StrategicTab() {
  return (
    <div>
      {/* Scorecard */}
      <div className="chart-container mb-4">
        <h3 className="chart-title">Workforce Movement Scorecard</h3>
        <p className="chart-subtitle mb-3">Current month vs previous month — key strategic metrics</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" style={{ minWidth: 400 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                {['Metric','Current Month','Previous Month','Change','Trend'].map(h => (
                  <th key={h} className="pb-2 pt-1 text-left text-[10px] font-semibold uppercase tracking-wide pr-4 last:pr-0"
                    style={{ color: '#9CA3AF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCORECARD.map((r, i) => {
                const isGoodDown = r.metric === 'Offboarded' || r.metric === 'Attrition Rate' || r.metric === 'Avg Onboard Days';
                const good = isGoodDown ? r.trend === 'down' : r.trend === 'up';
                return (
                  <tr key={r.metric} style={{ borderBottom: i < SCORECARD.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="py-2 pr-4 font-medium" style={{ color: '#374151' }}>{r.metric}</td>
                    <td className="py-2 pr-4 font-bold tabular-nums" style={{ color: '#111827' }}>{r.current}</td>
                    <td className="py-2 pr-4 tabular-nums" style={{ color: '#9CA3AF' }}>{r.previous}</td>
                    <td className="py-2 pr-4 font-bold tabular-nums" style={{ color: good ? '#15803D' : '#DC2626' }}>{r.delta}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${good ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {r.trend === 'up' ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                        {r.trend === 'up' ? 'Rising' : 'Falling'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Joining vs Exit comparison */}
        <div className="chart-container">
          <h3 className="chart-title">Joining vs Exit Comparison</h3>
          <p className="chart-subtitle mb-3">Monthly — onboarding (blue) vs offboarding (red)</p>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: '#3B82F6', opacity: 0.82 }} /><span className="text-[10px]" style={{ color: '#6B7280' }}>Joined</span></div>
            <div className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: '#EF4444', opacity: 0.82 }} /><span className="text-[10px]" style={{ color: '#6B7280' }}>Exited</span></div>
          </div>
          {/* grouped bar SVG */}
          {(() => {
            const W = 560, H = 160;
            const PAD = { t: 14, r: 12, b: 28, l: 30 };
            const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
            const n = 12, gW = cW / n;
            const bW = Math.min(gW * 0.32, 18);
            const maxV = Math.max(...MONTHLY_ON, ...MONTHLY_OFF, 1);
            return (
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
                {[0.25,0.5,0.75,1].map(f => <line key={f} x1={PAD.l} x2={W-PAD.r} y1={PAD.t+f*cH} y2={PAD.t+f*cH} stroke="#F1F5F9" strokeWidth={1} />)}
                {[0,0.5,1].map(f => <text key={f} x={PAD.l-4} y={PAD.t+(1-f)*cH+3} textAnchor="end" fontSize={8} fill="#D1D5DB">{Math.round(maxV*f)}</text>)}
                <line x1={PAD.l} x2={W-PAD.r} y1={PAD.t+cH} y2={PAD.t+cH} stroke="#E2E8F0" strokeWidth={1} />
                {MONTHLY_ON.map((v, i) => {
                  const cx = PAD.l + i * gW + gW / 2;
                  const bH1 = (v / maxV) * cH;
                  const bH2 = (MONTHLY_OFF[i] / maxV) * cH;
                  return (
                    <g key={i}>
                      <rect x={cx - bW - 1} y={PAD.t + cH - bH1} width={bW} height={bH1} rx={2} fill="#3B82F6" opacity={0.8} />
                      <rect x={cx + 1}      y={PAD.t + cH - bH2} width={bW} height={bH2} rx={2} fill="#EF4444" opacity={0.75} />
                      <text x={cx} y={PAD.t+cH+12} textAnchor="middle" fontSize={7.5} fill="#CBD5E1">{MONTHS_SHORT[i]}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}
        </div>

        {/* Net workforce growth area chart */}
        <div className="chart-container">
          <h3 className="chart-title">Net Workforce Growth</h3>
          <p className="chart-subtitle mb-3">Joined minus exited — monthly net change</p>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <svg width={18} height={6}><rect x={0} y={1} width={18} height={4} fill="#22C55E" opacity={0.2} /><line x1={0} y1={3} x2={18} y2={3} stroke="#22C55E" strokeWidth={1.5} /></svg>
              <span className="text-[10px]" style={{ color: '#6B7280' }}>Net Growth</span>
            </div>
          </div>
          <TrendLine data={MONTHLY_NET} color="#22C55E" fillColor="#22C55E" labels={MONTHS_SHORT} H={155} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Total Net', value: `+${MONTHLY_NET.reduce((a,b)=>a+b,0)}`, color: '#15803D' },
              { label: 'Avg/Month', value: `+${Math.round(MONTHLY_NET.reduce((a,b)=>a+b,0)/12)}`, color: '#3B82F6' },
              { label: 'Best Month', value: `+${Math.max(...MONTHLY_NET)}`, color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} className="text-center p-1.5 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                <p className="text-xs font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px]" style={{ color: '#9CA3AF' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contractor-wise attrition */}
      <div className="chart-container">
        <h3 className="chart-title">Contractor &amp; Location-wise Attrition %</h3>
        <p className="chart-subtitle mb-3">Attrition rate broken down by contractor and location</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>By Contractor</p>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Maa Gayatri',   pct: 4.2 },
                { name: 'BSA Corp',      pct: 3.8 },
                { name: 'BVOC',          pct: 3.1 },
                { name: 'Gram Vikas',    pct: 2.4 },
                { name: 'SRI Cauvery',   pct: 1.9 },
                { name: 'Techno Res.',   pct: 1.5 },
              ].map(d => {
                const color = d.pct >= 3.5 ? '#EF4444' : d.pct >= 2.5 ? '#F59E0B' : '#22C55E';
                return (
                  <div key={d.name}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.name}</span>
                      <FormulaTooltip formula={`Contractor Attrition % = (Contractor Exits ÷ Contractor Headcount) × 100  →  = ${d.pct}%`}>
                        <span className="text-[10px] font-bold underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color }}>{d.pct}%</span>
                      </FormulaTooltip>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${(d.pct / 5) * 100}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>By Location</p>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Hyderabad', pct: 3.9 },
                { name: 'Mumbai',    pct: 3.2 },
                { name: 'Chennai',   pct: 2.7 },
                { name: 'Bangalore', pct: 2.1 },
                { name: 'Pune',      pct: 1.8 },
              ].map(d => {
                const color = d.pct >= 3.5 ? '#EF4444' : d.pct >= 2.5 ? '#F59E0B' : '#22C55E';
                return (
                  <div key={d.name}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>{d.name}</span>
                      <FormulaTooltip formula={`Location Attrition % = (Location Exits ÷ Location Headcount) × 100  →  = ${d.pct}%`}>
                        <span className="text-[10px] font-bold underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color }}>{d.pct}%</span>
                      </FormulaTooltip>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${(d.pct / 5) * 100}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionHeader({
  label, sub, color, bg, border, badge,
}: {
  label: string; sub: string; color: string; bg: string; border: string; badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-1 px-4 py-3 rounded-xl"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
      <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <h2 className="text-sm font-bold leading-tight" style={{ color: '#111827' }}>{label}</h2>
        <p className="text-[10px] mt-0.5 leading-none" style={{ color: '#9CA3AF' }}>{sub}</p>
      </div>
      {badge && (
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: color + '18', color }}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingOffboarding() {
  return (
    <div>
      {/* ── ONBOARDING ─────────────────────────────────────── */}
      <SectionHeader
        label="Onboarding Dashboard"
        sub="New joiners, compliance, joining effectiveness & workforce readiness"
        color="#3B82F6"
        bg="#EFF6FF"
        border="#BFDBFE"
        badge="250 joined this month"
      />
      <OnboardingTab />

      {/* ── OFFBOARDING ────────────────────────────────────── */}
      <div className="mt-8">
        <SectionHeader
          label="Offboarding Dashboard"
          sub="Exits, attrition trends, early attrition analysis & offboarding compliance"
          color="#EF4444"
          bg="#FEF2F2"
          border="#FECACA"
          badge="60 exits this month"
        />
        <OffboardingTab />
      </div>

      {/* ── STRATEGIC OVERVIEW ─────────────────────────────── */}
      <div className="mt-8">
        <SectionHeader
          label="Strategic Overview"
          sub="Workforce movement scorecard, net growth & attrition benchmarks"
          color="#8B5CF6"
          bg="#F5F3FF"
          border="#DDD6FE"
          badge="Net +190 this month"
        />
        <StrategicTab />
      </div>
    </div>
  );
}
