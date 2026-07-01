import { useState } from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';

// ── Light-shade palette ───────────────────────────────────────────────────────
const APPROVED_COLOR = '#86EFAC'; // light green
const REJECTED_COLOR = '#FCA5A5'; // light red
const PENDING_COLOR  = '#FDE68A'; // light amber
const APPROVED_DARK  = '#16A34A';
const REJECTED_DARK  = '#DC2626';
const PENDING_DARK   = '#D97706';

const MONTHS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const MONTHLY_DATA = [
  { month:'Jul', approved:142,rejected:28,pending:12 },
  { month:'Aug', approved:158,rejected:31,pending:8  },
  { month:'Sep', approved:134,rejected:42,pending:15 },
  { month:'Oct', approved:167,rejected:24,pending:10 },
  { month:'Nov', approved:145,rejected:38,pending:18 },
  { month:'Dec', approved:112,rejected:55,pending:22 },
  { month:'Jan', approved:138,rejected:47,pending:14 },
  { month:'Feb', approved:153,rejected:33,pending:9  },
  { month:'Mar', approved:171,rejected:29,pending:11 },
  { month:'Apr', approved:148,rejected:36,pending:16 },
  { month:'May', approved:162,rejected:27,pending:7  },
  { month:'Jun', approved:155,rejected:31,pending:13 },
];
const REJECTION_REASONS = [
  { label:'No substitute worker',    value:38, color:'#FCA5A5', dark:'#DC2626' },
  { label:'Peak production period',  value:29, color:'#FDE68A', dark:'#D97706' },
  { label:'Documentation missing',   value:18, color:'#FED7AA', dark:'#EA580C' },
  { label:'Short notice',            value:10, color:'#E9D5FF', dark:'#7C3AED' },
  { label:'Other',                   value:5,  color:'#E5E7EB', dark:'#6B7280' },
];
const SITE_DATA = [
  { site:'Plant A',  approved:312,rejected:68,pending:24,rejRate:17.4 },
  { site:'Plant B',  approved:278,rejected:82,pending:31,rejRate:22.8 },
  { site:'Plant C',  approved:198,rejected:41,pending:18,rejRate:17.1 },
  { site:'Warehouse',approved:146,rejected:37,pending:12,rejRate:20.2 },
  { site:'Admin',    approved:94, rejected:14,pending:7, rejRate:12.3 },
];
const CONTRACTOR_DATA = [
  { name:'ABC Manpower',  approved:198,rejected:54,rejRate:21.4 },
  { name:'XYZ Staffing',  approved:164,rejected:38,rejRate:18.8 },
  { name:'PQR Services',  approved:142,rejected:62,rejRate:30.4 },
  { name:'LMN Labour',    approved:89, rejected:19,rejRate:17.6 },
  { name:'DEF Workforce', approved:76, rejected:24,rejRate:24.0 },
];
const LEAVE_TYPE_DATA = [
  { type:'Sick Leave',      approved:284,rejected:48,pending:22,rejRate:14.1 },
  { type:'Casual Leave',    approved:312,rejected:71,pending:28,rejRate:18.5 },
  { type:'Emergency Leave', approved:128,rejected:42,pending:14,rejRate:24.7 },
  { type:'Earned Leave',    approved:187,rejected:31,pending:19,rejRate:14.2 },
  { type:'Compensatory',    approved:97, rejected:18,pending:9, rejRate:15.7 },
];
const SUPERVISOR_ALERTS = [
  { name:'Ramesh Kumar', rejRate:34.2, avgDelay:4.8, dept:'Production'  },
  { name:'Anita Sharma', rejRate:29.1, avgDelay:3.2, dept:'Maintenance' },
  { name:'Vijay Patil',  rejRate:27.8, avgDelay:5.1, dept:'Stores'      },
];

type Tab = 'monthly' | 'site' | 'contractor' | 'leavetype';
const TABS: { key: Tab; label: string }[] = [
  { key:'monthly',    label:'Monthly' },
  { key:'site',       label:'By Site' },
  { key:'contractor', label:'By Contractor' },
  { key:'leavetype',  label:'By Leave Type' },
];

// ── Compact donut ─────────────────────────────────────────────────────────────
function MiniDonut() {
  const [hov, setHov] = useState<number|null>(null);
  const total = REJECTION_REASONS.reduce((s,r) => s + r.value, 0);
  const R=32, CX=40, CY=40, SW=14, circ=2*Math.PI*R;
  let off=0;
  const segs = REJECTION_REASONS.map(r => {
    const dash=(r.value/total)*circ;
    const s={...r,dash,off}; off+=dash; return s;
  });
  const h = hov!==null ? REJECTION_REASONS[hov] : null;
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0" style={{width:80,height:80}}>
        <svg width={80} height={80} viewBox="0 0 80 80">
          {segs.map((sg,i)=>(
            <circle key={i} cx={CX} cy={CY} r={R} fill="none"
              stroke={sg.color} strokeWidth={SW}
              strokeDasharray={`${sg.dash} ${circ-sg.dash}`}
              strokeDashoffset={-sg.off+circ/4}
              style={{opacity:hov===null||hov===i?1:0.3,transition:'opacity .15s',cursor:'pointer'}}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {h ? (
            <span className="text-[10px] font-bold tabular-nums" style={{color:h.dark}}>{h.value}%</span>
          ) : (
            <span className="text-[11px] font-bold" style={{color:'#111827'}}>Why?</span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {REJECTION_REASONS.map((r,i)=>(
          <div key={i} className="flex items-center gap-1.5 cursor-default"
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{backgroundColor:r.color}}/>
            <span className="text-[9px] leading-tight" style={{color:'#374151',maxWidth:120}}>{r.label}</span>
            <span className="text-[9px] font-bold tabular-nums ml-auto pl-1" style={{color:r.dark}}>{r.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly stacked bar ───────────────────────────────────────────────────────
function MonthlyBar({ range }: { range: 6|12 }) {
  const [hov, setHov] = useState<number|null>(null);
  const data = MONTHLY_DATA.slice(-range);
  const maxT = Math.max(...data.map(d=>d.approved+d.rejected+d.pending));
  return (
    <div>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {[['Approved',APPROVED_COLOR,APPROVED_DARK],['Rejected',REJECTED_COLOR,REJECTED_DARK],['Pending',PENDING_COLOR,PENDING_DARK]].map(([l,c,d])=>(
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{backgroundColor:c as string}}/>
            <span className="text-[9px]" style={{color:'#6B7280'}}>{l as string}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1" style={{height:90}}>
        {data.map((d,i)=>{
          const t=d.approved+d.rejected+d.pending;
          const maxH=74, h=(t/maxT)*maxH;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5 cursor-default"
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <div className="relative flex flex-col justify-end w-full" style={{height:maxH}}>
                {hov===i&&(
                  <div className="absolute bottom-full mb-1 left-1/2 z-10 pointer-events-none"
                    style={{transform:'translateX(-50%)',minWidth:80}}>
                    <div className="rounded-lg px-2 py-1.5" style={{backgroundColor:'#1F2937'}}>
                      <p className="text-[9px] font-bold text-white mb-0.5">{d.month}</p>
                      <p className="text-[8px]" style={{color:'#86EFAC'}}>✓ {d.approved}</p>
                      <p className="text-[8px]" style={{color:'#FCA5A5'}}>✗ {d.rejected}</p>
                      <p className="text-[8px]" style={{color:'#FDE68A'}}>~ {d.pending}</p>
                    </div>
                  </div>
                )}
                <div className="w-full rounded-sm overflow-hidden flex flex-col-reverse" style={{height:h}}>
                  <div style={{flex:d.approved,backgroundColor:APPROVED_COLOR}}/>
                  <div style={{flex:d.rejected,backgroundColor:REJECTED_COLOR}}/>
                  <div style={{flex:d.pending, backgroundColor:PENDING_COLOR}}/>
                </div>
              </div>
              <span className="text-[8px]" style={{color:'#9CA3AF'}}>{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Site breakdown ────────────────────────────────────────────────────────────
function SiteBreakdown() {
  const max=Math.max(...SITE_DATA.map(s=>s.approved+s.rejected+s.pending));
  return (
    <div className="space-y-2">
      {SITE_DATA.map((s,i)=>{
        const t=s.approved+s.rejected+s.pending, flag=s.rejRate>20;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{s.site}</span>
                {flag&&<span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{backgroundColor:'#FEF2F2',color:'#DC2626'}}>High</span>}
              </div>
              <span className="text-[10px] font-bold tabular-nums" style={{color:flag?'#DC2626':'#6B7280'}}>{s.rejRate}%</span>
            </div>
            <div className="flex h-3 rounded overflow-hidden gap-px" style={{width:`${(t/max)*100}%`}}>
              <div style={{flex:s.approved,backgroundColor:APPROVED_COLOR}}/>
              <div style={{flex:s.rejected,backgroundColor:REJECTED_COLOR}}/>
              <div style={{flex:s.pending, backgroundColor:PENDING_COLOR}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Contractor breakdown ──────────────────────────────────────────────────────
function ContractorBreakdown() {
  return (
    <div className="space-y-1.5">
      {CONTRACTOR_DATA.map((c,i)=>{
        const flag=c.rejRate>25;
        return (
          <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-2"
            style={{backgroundColor:flag?'#FEF2F2':'#F9FAFB',border:`1px solid ${flag?'#FECACA':'#F3F4F6'}`}}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] font-semibold truncate" style={{color:'#111827'}}>{c.name}</span>
                {flag&&<AlertTriangle size={10} style={{color:'#DC2626',flexShrink:0}}/>}
              </div>
              <div className="flex h-2 rounded overflow-hidden">
                <div style={{flex:c.approved,backgroundColor:APPROVED_COLOR}}/>
                <div style={{flex:c.rejected,backgroundColor:REJECTED_COLOR}}/>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] font-bold tabular-nums" style={{color:flag?'#DC2626':'#374151'}}>{c.rejRate}%</p>
              <p className="text-[8px]" style={{color:'#9CA3AF'}}>{c.approved+c.rejected}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Leave type breakdown ──────────────────────────────────────────────────────
function LeaveTypeBreakdown() {
  const COLORS=['#BFDBFE','#DDD6FE','#FDE68A','#BBF7D0','#A5F3FC'];
  return (
    <div className="space-y-2">
      {LEAVE_TYPE_DATA.map((l,i)=>{
        const flag=l.rejRate>20;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{backgroundColor:COLORS[i]}}/>
                <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{l.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {flag&&<span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{backgroundColor:'#FEF2F2',color:'#DC2626'}}>Flag</span>}
                <span className="text-[10px] tabular-nums" style={{color:'#6B7280'}}>{l.rejRate}%</span>
              </div>
            </div>
            <div className="flex h-2.5 rounded overflow-hidden gap-px">
              <div style={{flex:l.approved,backgroundColor:APPROVED_COLOR}}/>
              <div style={{flex:l.rejected,backgroundColor:REJECTED_COLOR}}/>
              <div style={{flex:l.pending, backgroundColor:PENDING_COLOR}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const SITES=['All Sites','Plant A','Plant B','Plant C','Warehouse','Admin'];
const CONTRACTORS=['All Contractors','ABC Manpower','XYZ Staffing','PQR Services','LMN Labour','DEF Workforce'];
const SUPERVISORS=['All Supervisors','Ramesh Kumar','Anita Sharma','Vijay Patil','Priya Menon'];

export default function LeaveApprovalTrend() {
  const [tab, setTab]     = useState<Tab>('monthly');
  const [range, setRange] = useState<6|12>(12);
  const [site, setSite]   = useState(SITES[0]);
  const [cont, setCont]   = useState(CONTRACTORS[0]);
  const [sup, setSup]     = useState(SUPERVISORS[0]);

  const totAp=MONTHLY_DATA.reduce((s,d)=>s+d.approved,0);
  const totRj=MONTHLY_DATA.reduce((s,d)=>s+d.rejected,0);
  const totPd=MONTHLY_DATA.reduce((s,d)=>s+d.pending,0);
  const grand=totAp+totRj+totPd;
  const rejPct=((totRj/grand)*100).toFixed(1);

  return (
    <div className="chart-container">
      {/* Header + filters */}
      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Leave Approval vs Rejection Trend</h3>
          <p className="chart-subtitle">12-month breakdown with rejection reason analysis</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            {v:site,    opts:SITES,       fn:setSite},
            {v:cont,    opts:CONTRACTORS, fn:setCont},
            {v:sup,     opts:SUPERVISORS, fn:setSup },
          ].map((f,i)=>(
            <select key={i} value={f.v} onChange={e=>f.fn(e.target.value)}
              className="text-[10px] border rounded-md px-1.5 py-0.5 cursor-pointer outline-none"
              style={{borderColor:'#E5E7EB',backgroundColor:'#FAFAFA',color:'#374151'}}>
              {f.opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Compact KPI row */}
      <div className="flex gap-2 mb-3">
        {[
          {label:'Approved',val:totAp, bg:'#F0FDF4',border:'#BBF7D0',col:APPROVED_DARK},
          {label:'Rejected', val:totRj, bg:'#FEF2F2',border:'#FECACA',col:REJECTED_DARK},
          {label:'Pending',  val:totPd, bg:'#FFFBEB',border:'#FDE68A',col:PENDING_DARK },
        ].map(k=>(
          <div key={k.label} className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{backgroundColor:k.bg,border:`1px solid ${k.border}`}}>
            <p className="text-[9px] font-medium mb-0.5" style={{color:k.col}}>{k.label}</p>
            <p className="text-sm font-bold tabular-nums leading-tight" style={{color:'#111827'}}>{k.val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Supervisor alert */}
      <div className="rounded-lg p-2 mb-3" style={{backgroundColor:'#FFFBEB',border:'1px solid #FDE68A'}}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertTriangle size={11} style={{color:'#D97706'}}/>
          <span className="text-[10px] font-bold" style={{color:'#92400E'}}>Supervisors flagged — high rejection rate or delay &gt; SLA</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUPERVISOR_ALERTS.map((s,i)=>(
            <div key={i} className="flex items-center gap-1.5 rounded px-2 py-1"
              style={{backgroundColor:'#FEFCE8',border:'1px solid #FCD34D'}}>
              <TrendingDown size={9} style={{color:'#DC2626'}}/>
              <span className="text-[9px] font-semibold" style={{color:'#111827'}}>{s.name}</span>
              <span className="text-[8px]" style={{color:'#9CA3AF'}}>{s.dept}</span>
              <span className="text-[9px] font-bold" style={{color:'#DC2626'}}>{s.rejRate}%</span>
              <span className="text-[9px]" style={{color:'#D97706'}}>+{s.avgDelay}d</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={tab===t.key
              ? {backgroundColor:'#EFF6FF',color:'#1D4ED8',borderColor:'#BFDBFE'}
              : {backgroundColor:'#FFFFFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
            {t.label}
          </button>
        ))}
        {tab==='monthly'&&(
          <div className="ml-auto flex gap-1">
            {([6,12] as const).map(r=>(
              <button key={r} onClick={()=>setRange(r)}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
                style={range===r
                  ? {backgroundColor:'#F0FDF4',color:'#15803D',borderColor:'#BBF7D0'}
                  : {backgroundColor:'#FFFFFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
                {r}M
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {tab==='monthly'&&(
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1"><MonthlyBar range={range}/></div>
          <div className="lg:w-48 flex-shrink-0">
            <p className="text-[9px] uppercase tracking-wide font-semibold mb-2" style={{color:'#9CA3AF'}}>Rejection Reasons</p>
            <MiniDonut/>
          </div>
        </div>
      )}
      {tab==='site'&&<SiteBreakdown/>}
      {tab==='contractor'&&<ContractorBreakdown/>}
      {tab==='leavetype'&&<LeaveTypeBreakdown/>}

      {/* Footer */}
      <div className="mt-3 pt-2.5 flex items-center gap-3" style={{borderTop:'1px solid #F3F4F6'}}>
        <div className="flex h-2 rounded-full overflow-hidden flex-1 gap-px">
          <div style={{flex:totAp,backgroundColor:APPROVED_COLOR}}/>
          <div style={{flex:totRj,backgroundColor:REJECTED_COLOR}}/>
          <div style={{flex:totPd,backgroundColor:PENDING_COLOR}}/>
        </div>
        <span className="text-[9px] tabular-nums flex-shrink-0" style={{color:'#6B7280'}}>
          Rej rate: <strong style={{color:parseFloat(rejPct)>20?'#DC2626':'#374151'}}>{rejPct}%</strong>
        </span>
      </div>
    </div>
  );
}
