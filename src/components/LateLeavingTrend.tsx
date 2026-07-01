import { useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const SHIFTS = ['General','Morning','Afternoon','Night'];

const HEATMAP: { late:number; early:number }[][] = [
  [{late:12,early:4},{late:8, early:3},{late:6, early:2},{late:18,early:7}],
  [{late:9, early:3},{late:5, early:2},{late:4, early:1},{late:14,early:5}],
  [{late:11,early:5},{late:7, early:3},{late:5, early:2},{late:16,early:6}],
  [{late:8, early:2},{late:4, early:1},{late:3, early:1},{late:12,early:4}],
  [{late:14,early:6},{late:9, early:4},{late:7, early:3},{late:20,early:8}],
  [{late:6, early:2},{late:3, early:1},{late:2, early:1},{late:9, early:3}],
];
const TREND_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TREND_LATE   = [48,42,55,39,51,62,44,38,57,45,68,52];
const TREND_EARLY  = [18,15,22,14,19,24,17,13,21,16,28,20];
const TOP_EMPLOYEES = [
  {name:'Suresh Babu',   dept:'Production', late:14,early:6,  shift:'Night',     contractor:'ABC Manpower' },
  {name:'Mohan Das',     dept:'Stores',     late:12,early:4,  shift:'General',   contractor:'XYZ Staffing' },
  {name:'Kavitha R.',    dept:'Maintenance',late:11,early:8,  shift:'Morning',   contractor:'PQR Services' },
  {name:'Rajesh Verma',  dept:'Quality',    late:10,early:3,  shift:'Night',     contractor:'ABC Manpower' },
  {name:'Lakshmi Nair',  dept:'Production', late:9, early:5,  shift:'Afternoon', contractor:'LMN Labour'  },
  {name:'Anand Pillai',  dept:'Warehouse',  late:9, early:2,  shift:'General',   contractor:'XYZ Staffing' },
  {name:'Sunita Rao',    dept:'Production', late:8, early:7,  shift:'Night',     contractor:'DEF Workforce'},
  {name:'Vignesh M.',    dept:'Stores',     late:8, early:3,  shift:'Morning',   contractor:'ABC Manpower' },
  {name:'Deepa Krishnan',dept:'Quality',    late:7, early:4,  shift:'General',   contractor:'PQR Services' },
  {name:'Arjun Singh',   dept:'Maintenance',late:7, early:1,  shift:'Afternoon', contractor:'LMN Labour'  },
];
const DEPT_DATA = [
  {dept:'Production', late:82,early:34},{dept:'Stores',    late:54,early:18},
  {dept:'Maintenance',late:48,early:22},{dept:'Quality',   late:37,early:14},
  {dept:'Warehouse',  late:31,early:12},{dept:'Admin',     late:18,early:7 },
];
const SHIFT_DATA = [
  {shift:'Night',     late:98,early:42,drift:true },
  {shift:'General',   late:72,early:28,drift:false},
  {shift:'Afternoon', late:45,early:19,drift:false},
  {shift:'Morning',   late:39,early:15,drift:false},
];

type Tab = 'heatmap'|'trend'|'employees'|'department'|'shift';
const TABS: {key:Tab;label:string}[] = [
  {key:'heatmap',   label:'Heatmap'},
  {key:'trend',     label:'Trend'},
  {key:'employees', label:'Top 10'},
  {key:'department',label:'By Dept'},
  {key:'shift',     label:'By Shift'},
];
const SITES       = ['All Sites','Plant A','Plant B','Plant C','Warehouse','Admin'];
const CONTRACTORS = ['All Contractors','ABC Manpower','XYZ Staffing','PQR Services'];
const DEPTS       = ['All Depts','Production','Stores','Maintenance','Quality','Warehouse','Admin'];
const SHIFT_OPTS  = ['All Shifts',...SHIFTS];
const THRESHOLDS  = [5,10,15,20,30];

function intToColor(v:number,max:number,type:'late'|'early') {
  const r=v/max;
  if(type==='late'){
    if(r>.8)return'#FCA5A5'; if(r>.6)return'#FCA5A5CC'; if(r>.4)return'#FECACA';
    if(r>.2)return'#FEE2E2'; return'#FEF2F2';
  }else{
    if(r>.8)return'#67E8F9'; if(r>.6)return'#A5F3FC'; if(r>.4)return'#CFFAFE';
    if(r>.2)return'#ECFEFF'; return'#F0FEFF';
  }
}

function Heatmap({mode}:{mode:'late'|'early'}) {
  const [hov,setHov]=useState<[number,number]|null>(null);
  const maxV=Math.max(...HEATMAP.flat().map(c=>mode==='late'?c.late:c.early));
  return (
    <div>
      <div className="flex gap-1 mb-2 ml-8">
        {SHIFTS.map(s=><div key={s} className="flex-1 text-center text-[8px] font-semibold" style={{color:'#6B7280'}}>{s}</div>)}
      </div>
      <div className="space-y-1">
        {DAYS.map((day,di)=>(
          <div key={day} className="flex items-center gap-1">
            <span className="w-7 text-[9px] font-medium text-right pr-1 flex-shrink-0" style={{color:'#374151'}}>{day}</span>
            {SHIFTS.map((_,si)=>{
              const cell=HEATMAP[di][si], val=mode==='late'?cell.late:cell.early;
              const bg=intToColor(val,maxV,mode), isH=hov?.[0]===di&&hov?.[1]===si;
              return (
                <div key={si} className="flex-1 rounded flex items-center justify-center cursor-default relative transition-all"
                  style={{height:26,backgroundColor:bg,outline:isH?`1.5px solid ${mode==='late'?'#EF4444':'#06B6D4'}`:'none'}}
                  onMouseEnter={()=>setHov([di,si])} onMouseLeave={()=>setHov(null)}>
                  <span className="text-[9px] font-bold" style={{color:val>maxV*.5?mode==='late'?'#991B1B':'#0E7490':'#374151'}}>{val}</span>
                  {isH&&(
                    <div className="absolute bottom-full mb-1 left-1/2 z-10 pointer-events-none" style={{transform:'translateX(-50%)'}}>
                      <div className="rounded px-2 py-1" style={{backgroundColor:'#1F2937',minWidth:80}}>
                        <p className="text-[9px] font-bold text-white">{day}·{SHIFTS[si]}</p>
                        <p className="text-[8px]" style={{color:mode==='late'?'#FCA5A5':'#67E8F9'}}>{val} employees</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendLine() {
  const [hov,setHov]=useState<number|null>(null);
  const W=480,H=100,PL=28,PR=8,PT=8,PB=20;
  const cW=W-PL-PR, cH=H-PT-PB, maxY=Math.max(...TREND_LATE,...TREND_EARLY)*1.15;
  const n=TREND_MONTHS.length;
  const px=(i:number)=>PL+(i/(n-1))*cW;
  const py=(v:number)=>PT+(1-v/maxY)*cH;
  const pL=TREND_LATE.map((v,i)=>`${px(i)},${py(v)}`).join(' ');
  const pE=TREND_EARLY.map((v,i)=>`${px(i)},${py(v)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{minWidth:280,height:H}} fontFamily="system-ui,sans-serif">
        {[.25,.5,.75,1].map(f=><line key={f} x1={PL} x2={W-PR} y1={PT+(1-f)*cH} y2={PT+(1-f)*cH} stroke="#F3F4F6" strokeWidth="1"/>)}
        <polyline points={pL} fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinejoin="round"/>
        <polyline points={pE} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinejoin="round"/>
        {TREND_MONTHS.map((m,i)=>(
          <g key={m}>
            <circle cx={px(i)} cy={py(TREND_LATE[i])}  r={hov===i?4:2.5} fill="#EF4444" stroke="#fff" strokeWidth="1"
              style={{cursor:'pointer'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
            <circle cx={px(i)} cy={py(TREND_EARLY[i])} r={hov===i?4:2.5} fill="#06B6D4" stroke="#fff" strokeWidth="1"
              style={{cursor:'pointer'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
            <text x={px(i)} y={H-3} textAnchor="middle" fontSize="8" fill="#9CA3AF">{m}</text>
          </g>
        ))}
        {hov!==null&&(
          <g>
            <line x1={px(hov)} x2={px(hov)} y1={PT} y2={PT+cH} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2,2"/>
            <rect x={px(hov)-38} y={PT} width="76" height="36" rx="5" fill="#1F2937"/>
            <text x={px(hov)} y={PT+12} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">{TREND_MONTHS[hov]}</text>
            <text x={px(hov)} y={PT+23} textAnchor="middle" fontSize="7" fill="#FCA5A5">Late:{TREND_LATE[hov]}</text>
            <text x={px(hov)} y={PT+33} textAnchor="middle" fontSize="7" fill="#67E8F9">Early:{TREND_EARLY[hov]}</text>
          </g>
        )}
      </svg>
      <div className="flex gap-3 mt-1">
        {[['Late Coming','#EF4444'],['Early Leaving','#06B6D4']].map(([l,c])=>(
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded inline-block" style={{backgroundColor:c as string}}/>
            <span className="text-[9px]" style={{color:'#6B7280'}}>{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeList({threshold}:{threshold:number}) {
  const [mode,setMode]=useState<'late'|'early'>('late');
  const sorted=[...TOP_EMPLOYEES].sort((a,b)=>mode==='late'?b.late-a.late:b.early-a.early);
  const col=mode==='late'?'#EF4444':'#06B6D4';
  return (
    <div>
      <div className="flex gap-1 mb-2">
        {(['late','early'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer transition-all"
            style={mode===m
              ? m==='late'?{backgroundColor:'#FEF2F2',color:'#DC2626',borderColor:'#FECACA'}:{backgroundColor:'#ECFEFF',color:'#0E7490',borderColor:'#A5F3FC'}
              : {backgroundColor:'#FFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
            {m==='late'?'Late':'Early'}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        {sorted.map((e,i)=>{
          const val=mode==='late'?e.late:e.early, flag=val>=threshold;
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
              style={{backgroundColor:flag?(mode==='late'?'#FEF2F2':'#ECFEFF'):'#F9FAFB',
                border:`1px solid ${flag?(mode==='late'?'#FECACA':'#A5F3FC'):'#F3F4F6'}`}}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{backgroundColor:i<3?col+'22':'#F3F4F6',color:i<3?col:'#9CA3AF'}}>{i+1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold truncate" style={{color:'#111827'}}>{e.name}</span>
                  {flag&&<AlertTriangle size={9} style={{color:col,flexShrink:0}}/>}
                </div>
                <span className="text-[8px]" style={{color:'#9CA3AF'}}>{e.dept}·{e.shift}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold tabular-nums" style={{color:col}}>{val}</p>
                <p className="text-[8px]" style={{color:'#9CA3AF'}}>×/mo</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeptComparison() {
  const max=Math.max(...DEPT_DATA.map(d=>d.late+d.early));
  return (
    <div className="space-y-2">
      {DEPT_DATA.map((d,i)=>{
        const t=d.late+d.early;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{d.dept}</span>
              <div className="flex gap-2">
                <span className="text-[9px] tabular-nums" style={{color:'#EF4444'}}>↑{d.late}</span>
                <span className="text-[9px] tabular-nums" style={{color:'#06B6D4'}}>↓{d.early}</span>
              </div>
            </div>
            <div className="flex h-3 rounded overflow-hidden gap-px" style={{width:`${(t/max)*100}%`}}>
              <div style={{flex:d.late, backgroundColor:'#FCA5A5'}}/>
              <div style={{flex:d.early,backgroundColor:'#67E8F9'}}/>
            </div>
          </div>
        );
      })}
      <div className="flex gap-3 mt-1">
        {[['Late','#FCA5A5'],['Early','#67E8F9']].map(([l,c])=>(
          <div key={l as string} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{backgroundColor:c as string}}/>
            <span className="text-[9px]" style={{color:'#6B7280'}}>{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShiftComparison() {
  const max=Math.max(...SHIFT_DATA.map(s=>s.late+s.early));
  return (
    <div className="space-y-2">
      {SHIFT_DATA.map((s,i)=>{
        const t=s.late+s.early;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{s.shift} Shift</span>
                {s.drift&&<span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{backgroundColor:'#FEF9C3',color:'#92400E',border:'1px solid #FDE68A'}}>Drift</span>}
              </div>
              <div className="flex gap-2">
                <span className="text-[9px] tabular-nums" style={{color:'#EF4444'}}>↑{s.late}</span>
                <span className="text-[9px] tabular-nums" style={{color:'#06B6D4'}}>↓{s.early}</span>
              </div>
            </div>
            <div className="flex h-4 rounded overflow-hidden gap-px" style={{width:`${(t/max)*100}%`}}>
              <div className="flex items-center justify-center" style={{flex:s.late, backgroundColor:'#FCA5A5'}}>
                {s.late/t>.15&&<span className="text-[8px] font-bold" style={{color:'#991B1B'}}>{s.late}</span>}
              </div>
              <div className="flex items-center justify-center" style={{flex:s.early,backgroundColor:'#67E8F9'}}>
                {s.early/t>.15&&<span className="text-[8px] font-bold" style={{color:'#0E7490'}}>{s.early}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LateLeavingTrend() {
  const [tab, setTab]     = useState<Tab>('heatmap');
  const [hmMode,setHmMode]= useState<'late'|'early'>('late');
  const [site, setSite]   = useState(SITES[0]);
  const [dept, setDept]   = useState(DEPTS[0]);
  const [shift,setShift]  = useState(SHIFT_OPTS[0]);
  const [cont, setCont]   = useState(CONTRACTORS[0]);
  const [threshold,setTh] = useState(10);

  const totalLate  = TREND_LATE.reduce((s,v)=>s+v,0);
  const totalEarly = TREND_EARLY.reduce((s,v)=>s+v,0);
  const flagged    = TOP_EMPLOYEES.filter(e=>Math.max(e.late,e.early)>=threshold).length;

  return (
    <div className="chart-container">
      {/* Header + filters */}
      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Late Coming &amp; Early Leaving Trend</h3>
          <p className="chart-subtitle">Heatmap by shift, trend line, and employee/dept ranking</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            {v:site, opts:SITES,      fn:setSite },
            {v:cont, opts:CONTRACTORS,fn:setCont },
            {v:dept, opts:DEPTS,      fn:setDept },
            {v:shift,opts:SHIFT_OPTS, fn:setShift},
          ].map((f,i)=>(
            <select key={i} value={f.v} onChange={e=>f.fn(e.target.value)}
              className="text-[10px] border rounded-md px-1.5 py-0.5 cursor-pointer outline-none"
              style={{borderColor:'#E5E7EB',backgroundColor:'#FAFAFA',color:'#374151'}}>
              {f.opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <select value={threshold} onChange={e=>setTh(Number(e.target.value))}
            className="text-[10px] border rounded-md px-1.5 py-0.5 cursor-pointer outline-none"
            style={{borderColor:'#E5E7EB',backgroundColor:'#FAFAFA',color:'#374151'}}>
            {THRESHOLDS.map(t=><option key={t} value={t}>&gt;{t}min</option>)}
          </select>
        </div>
      </div>

      {/* Compact KPI row */}
      <div className="flex gap-2 mb-3">
        {[
          {label:'Late Incidents', val:totalLate,  bg:'#FEF2F2',border:'#FECACA',col:'#DC2626'},
          {label:'Early Exits',    val:totalEarly, bg:'#ECFEFF',border:'#A5F3FC',col:'#0891B2'},
          {label:'Auto-Flagged',   val:flagged,    bg:'#FFFBEB',border:'#FDE68A',col:'#D97706'},
        ].map(k=>(
          <div key={k.label} className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{backgroundColor:k.bg,border:`1px solid ${k.border}`}}>
            <p className="text-[9px] font-medium mb-0.5" style={{color:k.col}}>{k.label}</p>
            <p className="text-sm font-bold tabular-nums leading-tight" style={{color:'#111827'}}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Flagged alert */}
      {flagged>0&&(
        <div className="rounded-lg p-2 mb-3 flex items-start gap-2"
          style={{backgroundColor:'#FFF7ED',border:'1px solid #FED7AA'}}>
          <AlertTriangle size={11} style={{color:'#EA580C',flexShrink:0,marginTop:1}}/>
          <div>
            <p className="text-[10px] font-bold" style={{color:'#9A3412'}}>{flagged} employee{flagged>1?'s':''} auto-flagged — &gt;{threshold} occurrences/month</p>
            <p className="text-[9px] mt-0.5" style={{color:'#C2410C'}}>Ties into Factories Act discipline documentation</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={tab===t.key
              ? {backgroundColor:'#FEF2F2',color:'#DC2626',borderColor:'#FECACA'}
              : {backgroundColor:'#FFFFFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
            {t.label}
          </button>
        ))}
        {tab==='heatmap'&&(
          <div className="ml-auto flex gap-1">
            {(['late','early'] as const).map(m=>(
              <button key={m} onClick={()=>setHmMode(m)}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer transition-all"
                style={hmMode===m
                  ? m==='late'?{backgroundColor:'#FEF2F2',color:'#DC2626',borderColor:'#FECACA'}:{backgroundColor:'#ECFEFF',color:'#0E7490',borderColor:'#A5F3FC'}
                  : {backgroundColor:'#FFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
                {m==='late'?'Late':'Early'}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab==='heatmap'   &&<Heatmap mode={hmMode}/>}
      {tab==='trend'     &&<TrendLine/>}
      {tab==='employees' &&<EmployeeList threshold={threshold}/>}
      {tab==='department'&&<DeptComparison/>}
      {tab==='shift'     &&<ShiftComparison/>}

      <div className="mt-3 pt-2.5 flex items-center gap-2" style={{borderTop:'1px solid #F3F4F6'}}>
        <TrendingUp size={11} style={{color:'#9CA3AF'}}/>
        <span className="text-[9px]" style={{color:'#9CA3AF'}}>Night shift highest incidence · threshold &gt;{threshold} min</span>
      </div>
    </div>
  );
}
