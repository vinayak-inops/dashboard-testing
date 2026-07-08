import { useState } from 'react';
import { AlertTriangle, Filter, TrendingUp, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const DEPT_OT = [
  {dept:'Production',  hours:842,cost:421000,employees:38,anomalies:4},
  {dept:'Maintenance', hours:612,cost:306000,employees:27,anomalies:2},
  {dept:'Stores',      hours:384,cost:192000,employees:21,anomalies:1},
  {dept:'Quality',     hours:298,cost:149000,employees:18,anomalies:3},
  {dept:'Warehouse',   hours:247,cost:123500,employees:15,anomalies:0},
  {dept:'Utility',     hours:198,cost: 99000,employees:12,anomalies:1},
  {dept:'Engineering', hours:156,cost: 78000,employees:9, anomalies:0},
  {dept:'Admin',       hours: 87,cost: 43500,employees:6, anomalies:0},
];
const CONTRACTOR_OT = [
  {name:'ABC Manpower', hours:1124,cost:562000,share:34.2},
  {name:'XYZ Staffing', hours: 876,cost:438000,share:26.6},
  {name:'PQR Services', hours: 612,cost:306000,share:18.6},
  {name:'LMN Labour',   hours: 398,cost:199000,share:12.1},
  {name:'DEF Workforce',hours: 278,cost:139000,share: 8.5},
];
const EMPLOYEE_OT = [
  {id:'E001',name:'Suresh Babu',    dept:'Production',  skill:'Welder',      hours:64,cost:32000,contractor:'ABC Manpower', anomaly:true },
  {id:'E002',name:'Mohan Das',      dept:'Maintenance', skill:'Electrician', hours:58,cost:29000,contractor:'XYZ Staffing', anomaly:false},
  {id:'E003',name:'Rajesh Verma',   dept:'Production',  skill:'Operator',    hours:52,cost:26000,contractor:'PQR Services', anomaly:true },
  {id:'E004',name:'Kavitha R.',     dept:'Quality',     skill:'Inspector',   hours:48,cost:24000,contractor:'ABC Manpower', anomaly:true },
  {id:'E005',name:'Anand Pillai',   dept:'Stores',      skill:'Supervisor',  hours:44,cost:22000,contractor:'LMN Labour',   anomaly:false},
  {id:'E006',name:'Lakshmi Nair',   dept:'Production',  skill:'Operator',    hours:42,cost:21000,contractor:'DEF Workforce',anomaly:false},
  {id:'E007',name:'Vignesh M.',     dept:'Maintenance', skill:'Fitter',      hours:39,cost:19500,contractor:'ABC Manpower', anomaly:false},
  {id:'E008',name:'Deepa Krishnan', dept:'Quality',     skill:'Analyst',     hours:36,cost:18000,contractor:'XYZ Staffing', anomaly:true },
  {id:'E009',name:'Arjun Singh',    dept:'Warehouse',   skill:'Forklift Op.',hours:34,cost:17000,contractor:'LMN Labour',   anomaly:false},
  {id:'E010',name:'Priya Menon',    dept:'Engineering', skill:'Technician',  hours:31,cost:15500,contractor:'PQR Services', anomaly:false},
];
const DRILL: Record<string,{date:string;inT:string;outT:string;otH:number}[]> = {
  E001:[
    {date:'Jun 2',  inT:'08:00',outT:'22:30',otH:6.5},
    {date:'Jun 5',  inT:'07:55',outT:'21:45',otH:5.75},
    {date:'Jun 9',  inT:'08:05',outT:'23:00',otH:7.0},
    {date:'Jun 12', inT:'08:00',outT:'22:00',otH:6.0},
    {date:'Jun 16', inT:'07:50',outT:'21:30',otH:5.5},
    {date:'Jun 19', inT:'08:10',outT:'22:45',otH:6.75},
  ],
};
const SKILL_OT = [
  {skill:'Welder',      hours:486,cost:243000},
  {skill:'Operator',    hours:412,cost:206000},
  {skill:'Electrician', hours:298,cost:149000},
  {skill:'Fitter',      hours:243,cost:121500},
  {skill:'Supervisor',  hours:187,cost: 93500},
  {skill:'Inspector',   hours:154,cost: 77000},
];

type Tab='dept'|'employee'|'contractor'|'skill';
type SortKey='hours'|'cost'|'employees'|'anomalies';
const TABS:[Tab,string][]=[['dept','By Dept'],['employee','Employees'],['contractor','By Contractor'],['skill','By Skill']];
const SORT_OPTS:[SortKey,string][]=[['hours','Hours'],['cost','Cost'],['employees','Headcount'],['anomalies','Anomalies']];
const DEPARTMENTS=['All Departments',...DEPT_OT.map(d=>d.dept)];
const CONTRACTORS=['All Contractors',...CONTRACTOR_OT.map(c=>c.name)];
const PAY_PERIODS=['Jun 2026','May 2026','Apr 2026','Mar 2026'];
const SITES=['All Sites','Plant A','Plant B','Plant C'];
const SKILL_COLORS=['#6366F1','#8B5CF6','#A78BFA','#C4B5FD','#DDD6FE','#EDE9FE'];

function fmt(n:number){return n>=100000?`₹${(n/100000).toFixed(1)}L`:`₹${(n/1000).toFixed(0)}K`;}

function DeptBar({sortKey}:{sortKey:SortKey}){
  const [hov,setHov]=useState<number|null>(null);
  const sorted=[...DEPT_OT].sort((a,b)=>b[sortKey]-a[sortKey]);
  const maxV=Math.max(...sorted.map(d=>d[sortKey]));
  const color=sortKey==='cost'?'#6EE7B7':sortKey==='anomalies'?'#FCA5A5':'#93C5FD';
  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 240 }}>
      {sorted.map((d,i)=>{
        const val=d[sortKey], pct=(val/maxV)*100;
        return (
          <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} className="cursor-default">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{d.dept}</span>
                {d.anomalies>0&&<span className="text-[8px] font-bold px-1 py-0.5 rounded-full" style={{backgroundColor:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA'}}>{d.anomalies}⚠</span>}
              </div>
              <span className="text-[10px] font-bold tabular-nums" style={{color:'#374151'}}>
                {sortKey==='cost'?fmt(val):sortKey==='hours'?`${val}h`:val}
              </span>
            </div>
            <div className="h-3.5 rounded overflow-hidden" style={{backgroundColor:'#F3F4F6'}}>
              <div className="h-full rounded transition-all duration-500"
                style={{width:`${pct}%`,backgroundColor:color,opacity:hov===i?1:0.75}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmployeeTable({deptF,contF}:{deptF:string;contF:string}){
  const [sk,setSk]=useState<'hours'|'cost'>('hours');
  const [sd,setSd]=useState<'asc'|'desc'>('desc');
  const [exp,setExp]=useState<string|null>(null);
  const rows=EMPLOYEE_OT
    .filter(e=>(deptF==='All Departments'||e.dept===deptF)&&(contF==='All Contractors'||e.contractor===contF))
    .sort((a,b)=>sd==='desc'?b[sk]-a[sk]:a[sk]-b[sk]);
  function toggle(k:'hours'|'cost'){if(sk===k)setSd(d=>d==='desc'?'asc':'desc');else{setSk(k);setSd('desc');}}
  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{border:'1px solid #E5E7EB'}}>
        <div className="grid px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide"
          style={{backgroundColor:'#F9FAFB',color:'#6B7280',gridTemplateColumns:'20px 1fr 56px 56px 80px 20px'}}>
          <span>#</span><span>Employee</span>
          <button className="flex items-center gap-0.5 cursor-pointer" onClick={()=>toggle('hours')}>
            Hours {sk==='hours'&&(sd==='desc'?<ChevronDown size={8}/>:<ChevronUp size={8}/>)}
          </button>
          <button className="flex items-center gap-0.5 cursor-pointer" onClick={()=>toggle('cost')}>
            Cost {sk==='cost'&&(sd==='desc'?<ChevronDown size={8}/>:<ChevronUp size={8}/>)}
          </button>
          <span>Contractor</span><span></span>
        </div>
        <div className="divide-y overflow-y-auto" style={{ borderColor: '#F3F4F6', maxHeight: 280 }}>
          {rows.map((e,i)=>(
            <div key={e.id}>
              <div className="grid px-2.5 py-2 cursor-pointer transition-colors hover:bg-gray-50"
                style={{gridTemplateColumns:'20px 1fr 56px 56px 80px 20px'}}
                onClick={()=>setExp(exp===e.id?null:e.id)}>
                <span className="text-[9px] tabular-nums self-center" style={{color:'#9CA3AF'}}>{i+1}</span>
                <div className="min-w-0 self-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold truncate" style={{color:'#111827'}}>{e.name}</span>
                    {e.anomaly&&<AlertTriangle size={9} style={{color:'#DC2626',flexShrink:0}}/>}
                  </div>
                  <span className="text-[8px]" style={{color:'#9CA3AF'}}>{e.dept}·{e.skill}</span>
                </div>
                <span className="text-[10px] font-bold tabular-nums self-center" style={{color:e.anomaly?'#DC2626':'#111827'}}>{e.hours}h</span>
                <span className="text-[10px] font-bold tabular-nums self-center" style={{color:'#059669'}}>{fmt(e.cost)}</span>
                <span className="text-[9px] truncate self-center" style={{color:'#9CA3AF'}}>{e.contractor}</span>
                <span className="self-center">{DRILL[e.id]&&<ExternalLink size={9} style={{color:exp===e.id?'#1D4ED8':'#D1D5DB'}}/>}</span>
              </div>
              {exp===e.id&&DRILL[e.id]&&(
                <div className="px-3 pb-2 pt-1" style={{backgroundColor:'#F8FAFC',borderTop:'1px solid #EFF6FF'}}>
                  <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5" style={{color:'#1D4ED8'}}>Daily Punch — {e.name}</p>
                  <div className="grid gap-1" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
                    {DRILL[e.id].map((r,ri)=>(
                      <div key={ri} className="rounded px-2 py-1" style={{backgroundColor:'#EFF6FF',border:'1px solid #DBEAFE'}}>
                        <p className="text-[9px] font-bold" style={{color:'#1D4ED8'}}>{r.date}</p>
                        <p className="text-[8px]" style={{color:'#6B7280'}}>{r.inT} → {r.outT}</p>
                        <p className="text-[9px] font-bold" style={{color:r.otH>6?'#DC2626':'#059669'}}>{r.otH}h OT</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContractorOT(){
  const max=Math.max(...CONTRACTOR_OT.map(c=>c.hours));
  const COLORS=['#93C5FD','#C4B5FD','#FDE68A','#6EE7B7','#FCA5A5'];
  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
      {CONTRACTOR_OT.map((c,i)=>(
        <div key={i}>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{c.name}</span>
            <div className="flex gap-2">
              <span className="text-[10px] tabular-nums font-bold" style={{color:'#374151'}}>{c.hours}h</span>
              <span className="text-[10px] tabular-nums font-bold" style={{color:'#059669'}}>{fmt(c.cost)}</span>
              <span className="text-[9px] tabular-nums" style={{color:'#9CA3AF'}}>{c.share}%</span>
            </div>
          </div>
          <div className="h-3 rounded overflow-hidden" style={{backgroundColor:'#F3F4F6'}}>
            <div className="h-full rounded transition-all duration-500"
              style={{width:`${(c.hours/max)*100}%`,backgroundColor:COLORS[i]}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillOT(){
  const max=Math.max(...SKILL_OT.map(s=>s.hours));
  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
      {SKILL_OT.map((s,i)=>(
        <div key={i}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{backgroundColor:SKILL_COLORS[i]}}/>
              <span className="text-[11px] font-semibold" style={{color:'#111827'}}>{s.skill}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] tabular-nums" style={{color:'#374151'}}>{s.hours}h</span>
              <span className="text-[9px] tabular-nums font-bold" style={{color:'#059669'}}>{fmt(s.cost)}</span>
            </div>
          </div>
          <div className="h-2.5 rounded overflow-hidden" style={{backgroundColor:'#F3F4F6'}}>
            <div className="h-full rounded transition-all duration-500"
              style={{width:`${(s.hours/max)*100}%`,backgroundColor:SKILL_COLORS[i]}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OvertimeAnalysis(){
  const [tab,setTab]     =useState<Tab>('dept');
  const [sk,setSk]       =useState<SortKey>('hours');
  const [dept,setDept]   =useState(DEPARTMENTS[0]);
  const [cont,setCont]   =useState(CONTRACTORS[0]);
  const [pp,setPP]       =useState(PAY_PERIODS[0]);
  const [site,setSite]   =useState(SITES[0]);

  const totalH=DEPT_OT.reduce((s,d)=>s+d.hours,0);
  const totalC=DEPT_OT.reduce((s,d)=>s+d.cost,0);
  const totalA=DEPT_OT.reduce((s,d)=>s+d.anomalies,0);

  return (
    <div className="chart-container">
      {/* Header + filters */}
      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
        <div>
          <h3 className="chart-title">Employee &amp; Department-wise OT Analysis</h3>
          <p className="chart-subtitle">OT hours, cost ranking, drill-down punch data and anomaly flagging</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={10} style={{color:'#9CA3AF'}}/>
          {[
            {v:site,opts:SITES,       fn:setSite},
            {v:dept,opts:DEPARTMENTS, fn:setDept},
            {v:cont,opts:CONTRACTORS, fn:setCont},
            {v:pp,  opts:PAY_PERIODS, fn:setPP  },
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
          {label:'Total OT Hours',  val:`${totalH.toLocaleString()}h`, bg:'#EFF6FF',border:'#BFDBFE',col:'#2563EB'},
          {label:'Total OT Cost',   val:fmt(totalC),                    bg:'#F0FDF4',border:'#BBF7D0',col:'#059669'},
          {label:'Ghost OT Alerts', val:String(totalA),                 bg:'#FEF2F2',border:'#FECACA',col:'#DC2626'},
        ].map(k=>(
          <div key={k.label} className="flex-1 rounded-lg px-2.5 py-1.5"
            style={{backgroundColor:k.bg,border:`1px solid ${k.border}`}}>
            <p className="text-[9px] font-medium mb-0.5" style={{color:k.col}}>{k.label}</p>
            <p className="text-sm font-bold tabular-nums leading-tight" style={{color:'#111827'}}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Anomaly alert */}
      {totalA>0&&(
        <div className="rounded-lg p-2 mb-3 flex items-start gap-2"
          style={{backgroundColor:'#FEF2F2',border:'1px solid #FECACA'}}>
          <AlertTriangle size={11} style={{color:'#DC2626',flexShrink:0,marginTop:1}}/>
          <div>
            <p className="text-[10px] font-bold" style={{color:'#991B1B'}}>{totalA} ghost OT / headcount gap anomalies detected</p>
            <p className="text-[9px] mt-0.5" style={{color:'#B91C1C'}}>Drill into Employee table for daily punch review</p>
          </div>
        </div>
      )}

      {/* Tabs + sort */}
      <div className="flex flex-wrap items-center gap-1 mb-3">
        {TABS.map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-150 cursor-pointer"
            style={tab===k
              ? {backgroundColor:'#EFF6FF',color:'#1D4ED8',borderColor:'#BFDBFE'}
              : {backgroundColor:'#FFFFFF',color:'#6B7280',borderColor:'#E5E7EB'}}>
            {l}
          </button>
        ))}
        {tab==='dept'&&(
          <div className="ml-auto flex gap-1">
            {SORT_OPTS.map(([k,l])=>(
              <button key={k} onClick={()=>setSk(k)}
                className="text-[9px] font-semibold px-2 py-1 rounded-lg border cursor-pointer transition-all"
                style={sk===k?{backgroundColor:'#F0FDF4',color:'#15803D',borderColor:'#BBF7D0'}:{backgroundColor:'#FFF',color:'#9CA3AF',borderColor:'#E5E7EB'}}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab==='dept'      &&<DeptBar sortKey={sk}/>}
      {tab==='employee'  &&<EmployeeTable deptF={dept} contF={cont}/>}
      {tab==='contractor'&&<ContractorOT/>}
      {tab==='skill'     &&<SkillOT/>}

      <div className="mt-3 pt-2.5 flex items-center gap-2" style={{borderTop:'1px solid #F3F4F6'}}>
        <TrendingUp size={11} style={{color:'#9CA3AF'}}/>
        <span className="text-[9px]" style={{color:'#9CA3AF'}}>
          Pay period: <strong style={{color:'#374151'}}>{pp}</strong> · OT cost billed per contractor PO terms
        </span>
        <span className="text-[9px] ml-auto" style={{color:'#DC2626'}}>Anomaly engine active</span>
      </div>
    </div>
  );
}
