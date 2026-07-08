import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  Activity,
  Building2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  LayoutDashboard,
  PieChart,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  GitBranch,
  CalendarCheck,
} from 'lucide-react';
import { supabase, WorkforceMetrics, WorkforceTrend, WorkforceGender, WorkforceAgeGroup, WorkforceExperienceBand, WorkforceOrgDistribution, WorkforceEmploymentClassification, EmployeeFilter } from './lib/supabase';
import { apiPost } from './lib/api';
import KPICard from './components/KPICard';
import CombinedKPIRow from './components/CombinedKPIRow';
import EmployeeDrawer from './components/EmployeeDrawer';
import TrendChart from './components/TrendChart';
import MTDSummary from './components/MTDSummary';
import GenderChart from './components/GenderChart';
import AgeGroupChart from './components/AgeGroupChart';
import ExperienceBandChart from './components/ExperienceBandChart';
import OrgDistributionChart, { ContractorRow } from './components/OrgDistributionChart';
import EmploymentClassificationChart from './components/EmploymentClassificationChart';
import AttendanceSummary from './components/AttendanceSummary';
import VendorPerformance from './components/VendorPerformance';
import ComplianceGovernance from './components/ComplianceGovernance';
import SafetyWelfare from './components/SafetyWelfare';
import RisksAlerts from './components/RisksAlerts';
import OnboardingOffboarding from './components/OnboardingOffboarding';
import LeaveApprovalTrend from './components/LeaveApprovalTrend';




export default function App() {
  const [activePage, setActivePage] = useState<'workforce' | 'attendance' | 'vendor' | 'demographics' | 'safety' | 'risks' | 'onboarding'>('workforce');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workforceTab, setWorkforceTab] = useState<'trend' | 'demographics' | 'org' | 'leave'>('trend');
  const [metrics, setMetrics] = useState<WorkforceMetrics | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [demographicsError, setDemographicsError] = useState<string | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [employmentError, setEmploymentError] = useState<string | null>(null);
  const [trendError, setTrendError] = useState<string | null>(null);
  const [trend, setTrend] = useState<WorkforceTrend[]>([]);
  const [genderData, setGenderData] = useState<WorkforceGender[]>([]);
  const [ageData, setAgeData] = useState<WorkforceAgeGroup[]>([]);
  const [expData, setExpData] = useState<WorkforceExperienceBand[]>([]);
  const [orgData, setOrgData] = useState<WorkforceOrgDistribution[]>([]);
  const [contractorData, setContractorData] = useState<ContractorRow[]>([]);
  const [employmentData, setEmploymentData] = useState<WorkforceEmploymentClassification[]>([]);
  const [apiTotal, setApiTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [drawerFilter, setDrawerFilter] = useState<EmployeeFilter | null>(null);

  async function fetchData() {
    setLoading(true);
    setMetricsError(null);
    setDemographicsError(null);
    setOrgError(null);
    setEmploymentError(null);
    setTrendError(null);

    const [cardsRes, trendRes, demoRes, orgRes, supabaseTrend] = await Promise.all([
      apiPost<{ data: Record<string, unknown> }>({ type: 'workforce_composition', subtype: 'workforce cards' })
        .catch((err) => ({ __error: err?.message ?? 'Network error', data: null as unknown as Record<string, unknown> })),
      apiPost<{ data: Record<string, unknown> }>({ type: 'workforce_composition', subtype: 'workforce Trend' })
        .catch(() => ({ data: null as unknown as Record<string, unknown> })),
      apiPost<{ data: Record<string, unknown> }>({ type: 'workforce_composition', subtype: 'workforce GenAgeExpSkill' })
        .catch((err) => ({ __error: err?.message ?? 'Network error', data: null as unknown as Record<string, unknown> })),
      apiPost<{ data: Record<string, unknown> }>({ type: 'workforce_composition', subtype: 'workforce Org Distribution' })
        .catch((err) => ({ __error: err?.message ?? 'Network error', data: null as unknown as Record<string, unknown> })),
      supabase.from('workforce_trend').select('*').order('created_at', { ascending: true }),
    ]);

    if ((cardsRes as { __error?: string })?.__error) {
      setMetricsError(`Failed to load KPI data: ${(cardsRes as { __error: string }).__error}`);
      setMetrics(null);
    } else if (cardsRes?.data) {
      const d = cardsRes.data;
      setMetrics({
        id: 'api',
        snapshot_date: d.snapshotDate ?? new Date().toISOString().split('T')[0],
        department: 'All',
        region: 'All',
        created_at: new Date().toISOString(),
        total_workforce: d.totalWorkforce,
        active_workforce: d.activeWorkforce,
        inactive_workforce: d.inactiveWorkforce,
        present_today: d.presentToday,
        total_contract_workers: d.totalContractWorkers,
        total_vendors_contractors: d.totalVendorsContractors,
        new_workers_mtd: d.newWorkersMTD,
        exited_workers_mtd: d.exitedWorkersMTD,
        new_workers_qtd: d.newWorkersQTD,
        exited_workers_qtd: d.exitedWorkersQTD,
        new_workers_ytd: d.newWorkersYTD,
        exited_workers_ytd: d.exitedWorkersYTD,
        workforce_growth_pct: d.workforceGrowthPct,
        workforce_utilization_pct: d.workforceUtilizationPct,
      });
    } else {
      setMetricsError('No KPI data returned from the API.');
      setMetrics(null);
    }

    let trendFromApi = false;

    if ((demoRes as { __error?: string })?.__error) {
      setDemographicsError(`Failed to load demographics: ${(demoRes as { __error: string }).__error}`);
      setEmploymentError(`Failed to load employment classification: ${(demoRes as { __error: string }).__error}`);
    } else if (demoRes?.data) {
      const c = demoRes.data;
      if (c.genderDistribution?.length) {
        const totalEmployees = Number(c.genderDistribution[0]?.totalEmployees ?? 0);
        if (totalEmployees > 0) setApiTotal(totalEmployees);
        setGenderData(c.genderDistribution
          .map((d: { gender: string; count: number; pct: number }, i: number) => ({
            id: String(i), snapshot_date: '', created_at: '', gender: d.gender, count: d.count, pct: d.pct,
          })));
      }
      if (c.ageDistribution?.length)
        setAgeData(c.ageDistribution
          .filter((d: { count: number }) => d.count > 0)
          .map((d: { ageGroup: string; count: number; pct: number; sortOrder: number }, i: number) => ({
            id: String(i), snapshot_date: '', created_at: '', age_group: d.ageGroup, count: d.count, pct: d.pct, sort_order: d.sortOrder,
          })));
      if (c.experienceDistribution?.length)
        setExpData(c.experienceDistribution
          .filter((d: { count: number }) => d.count > 0)
          .map((d: { band: string; count: number; pct: number; sortOrder: number }, i: number) => ({
            id: String(i), snapshot_date: '', created_at: '', band: d.band, count: d.count, pct: d.pct, sort_order: d.sortOrder,
          })));
      const empClassSrc = c.skillLevelDistribution ?? c.employmentClassification;
      if (empClassSrc?.length) {
        // API fields are: workforceCount=title, percentage=count, totalWorkforce=pct, skillTitle=totalWorkforce
        const isScrambled = typeof empClassSrc[0]?.workforceCount === 'string';
        setEmploymentData(empClassSrc
          .filter((d: Record<string, unknown>) => isScrambled ? Number(d.percentage) > 0 : Number(d.workforceCount) > 0)
          .map((d: Record<string, unknown>, i: number) => ({
            id: String(i), snapshot_date: '', created_at: '', sort_order: i + 1,
            classification: isScrambled ? String(d.workforceCount) : (String(d.skillTitle ?? 'Unclassified')),
            count:           isScrambled ? Number(d.percentage)    : Number(d.workforceCount),
            pct:             isScrambled ? Number(d.totalWorkforce) : Number(d.percentage),
          })));
      } else
        setEmploymentError('No employment classification data returned from the API.');
    } else {
      setDemographicsError('No demographics data returned from the API.');
      setEmploymentError('No employment classification data returned from the API.');
    }

    // Org Distribution — from dedicated subtype
    if ((orgRes as { __error?: string })?.__error) {
      setOrgError(`Failed to load organizational distribution: ${(orgRes as { __error: string }).__error}`);
    } else if (orgRes?.data) {
      const od = orgRes.data;
      const ORG_DIMENSION_KEYS: Array<{ apiKey: string; dimension: string; labelField: string }> = [
        { apiKey: 'subsidiaryDistribution',    dimension: 'subsidiary',     labelField: 'subsidiaryName'    },
        { apiKey: 'regionDistribution',        dimension: 'region',         labelField: 'regionName'        },
        { apiKey: 'stateDistribution',         dimension: 'state',          labelField: 'stateName'         },
        { apiKey: 'locationDistribution',      dimension: 'location',       labelField: 'locationName'      },
        { apiKey: 'departmentDistribution',    dimension: 'department',     labelField: 'departmentName'    },
        { apiKey: 'subDepartmentDistribution', dimension: 'sub_department', labelField: 'subDepartmentName' },
      ];
      const orgRows: WorkforceOrgDistribution[] = [];
      let orgIdx = 0;
      for (const { apiKey, dimension, labelField } of ORG_DIMENSION_KEYS) {
        const arr = od[apiKey];
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach((row: Record<string, unknown>, i: number) => {
            const label = String(row[labelField] ?? row['name'] ?? row['label'] ?? '');
            const count = Number(row['count'] ?? row['workforceCount'] ?? 0);
            const pct   = Number(row['pct']   ?? row['percentage']   ?? 0);
            orgRows.push({ id: String(orgIdx++), snapshot_date: '', created_at: '', dimension, label, count, pct, sort_order: i + 1 });
          });
        }
      }
      if (orgRows.length > 0) setOrgData(orgRows);
      else setOrgError('No organizational distribution data returned from the API.');

      const contractorArr = od.contractorDistribution ?? od.contractorDetails ?? od.contractors ?? [];
      if (Array.isArray(contractorArr) && contractorArr.length > 0) {
        setContractorData(contractorArr.map((r: Record<string, unknown>, i: number) => ({
          id: String(i),
          name:     String(r['contractorName'] ?? r['vendorName'] ?? r['name'] ?? ''),
          category: String(r['category'] ?? r['type'] ?? ''),
          count:    Number(r['workforceCount'] ?? r['count'] ?? 0),
          status:   (r['status'] === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
          endDate:  r['contractEndDate'] != null ? String(r['contractEndDate']) : (r['endDate'] != null ? String(r['endDate']) : null),
        })));
      }
    } else {
      setOrgError('No organizational distribution data returned from the API.');
    }

    // Workforce Trend — from dedicated subtype, fallback to Supabase
    const trendApiData = trendRes?.data;
    const trendArr = trendApiData ? (
      (trendApiData as Record<string, unknown>).workforceGrowthTrend ??
      (trendApiData as Record<string, unknown>).workforceTrend ?? []
    ) : [];
    if (Array.isArray(trendArr) && trendArr.length > 0) {
      setTrend((trendArr as { month?: string; monthYear?: string; total?: number; totalWorkforce?: number; active?: number; activeWorkforce?: number; joined?: number; newJoiners?: number; exited?: number; exits?: number }[]).map((d, i) => ({
        id: String(i),
        month_year:       d.month          ?? d.monthYear       ?? '',
        total_workforce:  d.total          ?? d.totalWorkforce  ?? 0,
        active_workforce: d.active         ?? d.activeWorkforce ?? 0,
        new_joiners:      d.joined         ?? d.newJoiners      ?? 0,
        exits:            d.exited         ?? d.exits           ?? 0,
        utilization_pct:  0,
        created_at: '',
      })));
      setTrendError(null);
    } else {
      if (supabaseTrend.error) {
        setTrendError(`Failed to load trend data: ${supabaseTrend.error.message}`);
      } else if (supabaseTrend.data && supabaseTrend.data.length > 0) {
        setTrend(supabaseTrend.data);
      } else {
        setTrendError('No workforce trend data available.');
      }
    }
    setLastRefreshed(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const attendancePct = metrics
    ? Math.round((metrics.present_today / metrics.active_workforce) * 100)
    : 0;

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark flex-shrink-0">
            <LayoutDashboard size={18} strokeWidth={1.75} />
          </div>
          <div className="logo-text flex-1 min-w-0">
            <p className="logo-title">CLMS</p>
            <p className="logo-sub">CXO Dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Overview</p>
          {[
            { page: 'workforce',   icon: LayoutDashboard, label: 'Workforce Summary'    },
            { page: 'attendance',  icon: Users,            label: 'Attendance Summary'   },
            { page: 'vendor',      icon: Activity,         label: 'Vendor Performance'   },
            { page: 'demographics',icon: PieChart,         label: 'Compliance Governance'},
            { page: 'safety',      icon: ShieldCheck,      label: 'Safety & Welfare'     },
            { page: 'risks',       icon: UserX,            label: 'Risks & Alerts'       },
            { page: 'onboarding',  icon: UserCheck,        label: 'Onboarding & Exit'    },
          ].map(({ page, icon: Icon, label }) => (
            <a
              key={page}
              href="#"
              title={sidebarCollapsed ? label : undefined}
              className={`nav-item${activePage === page ? ' active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActivePage(page as typeof activePage); }}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            className="w-full flex items-center justify-center mb-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!sidebarCollapsed && <span className="ml-1.5 text-[11px] font-medium">Collapse</span>}
          </button>
          <div className="user-pill">
            <div className="user-avatar">CX</div>
            <div className="user-info flex-1 min-w-0">
              <p className="user-name">CXO Admin</p>
              <p className="user-role">Executive</p>
            </div>
            <Settings size={13} className="user-settings flex-shrink-0" style={{ color: '#9CA3AF' }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{activePage === 'attendance' ? 'Attendance Summary' : activePage === 'vendor' ? 'Vendor Performance' : activePage === 'demographics' ? 'Compliance Governance' : activePage === 'safety' ? 'Safety & Welfare' : activePage === 'risks' ? 'Risks & Alerts' : activePage === 'onboarding' ? 'Onboarding & Offboarding' : 'Workforce Dashboard'}</h1>
            {metrics && (
              <p className="page-subtitle">
                As of{' '}
                {new Date(metrics.snapshot_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
          <div className="topbar-right">
            <button
              onClick={fetchData}
              disabled={loading}
              className="refresh-btn"
              title="Refresh data"
            >
              <RefreshCw
                size={14}
                className={loading ? 'animate-spin' : ''}
                style={{ color: '#5E706A' }}
              />
            </button>
            <button className="notif-btn">
              <Bell size={15} style={{ color: '#5E706A' }} />
              <span className="notif-dot" />
            </button>
          </div>
        </header>

        <main className="dashboard-body">
          {activePage === 'attendance' ? (
            <AttendanceSummary />
          ) : activePage === 'vendor' ? (
            <VendorPerformance />
          ) : activePage === 'demographics' ? (
            <ComplianceGovernance />
          ) : activePage === 'safety' ? (
            <SafetyWelfare />
          ) : activePage === 'risks' ? (
            <RisksAlerts />
          ) : activePage === 'onboarding' ? (
            <OnboardingOffboarding />
          ) : (
            <>
          {/* Last refreshed */}
          <div className="flex items-center justify-between mb-3">
            <div className="status-bar">
              <span className="status-dot" />
              <span>
                Live data &mdash; last refreshed{' '}
                {lastRefreshed.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {metrics && (
              <span className="snapshot-badge">
                Snapshot: {metrics.snapshot_date}
              </span>
            )}
          </div>

          {/* KPI Cards */}
          {metricsError ? (
            <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
              <UserX size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Unable to load KPI data</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#B91C1C' }}>{metricsError}</p>
              </div>
            </div>
          ) : metrics ? (
            <>
              {/* Row 1: 3 individual KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <KPICard
                  title="Total Workforce"
                  value={metrics.total_workforce}
                  icon={Users}
                  variant="default"
                  subtitle="All employment types"
                  onAction={() => setDrawerFilter('total')}
                />
                <KPICard
                  title="Present Today"
                  value={metrics.present_today}
                  icon={ClipboardList}
                  variant="info"
                  subtitle={`${attendancePct}% attendance rate`}
                  onAction={() => setDrawerFilter('present')}
                />
                <KPICard
                  title="Vendors / Contractors"
                  value={metrics.total_vendors_contractors}
                  icon={Building2}
                  variant="default"
                  subtitle="External partners"
                  onAction={() => setDrawerFilter('vendor')}
                />
              </div>

              {/* Row 2: 3 combined KPI cards */}
              <CombinedKPIRow metrics={metrics} onAction={setDrawerFilter} />
            </>
          ) : loading ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {[0,1,2].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {[0,1,2].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />)}
              </div>
            </>
          ) : (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
              <UserX size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>No KPI data available.</p>
            </div>
          )}

          {/* ── Section Tabs ── */}
          <div className="mt-4 mb-3 flex items-center gap-1 flex-wrap p-1 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
            {([
              { key: 'trend',       label: 'Growth Trend',       icon: TrendingUp     },
              { key: 'demographics',label: 'Demographics',        icon: BarChart2      },
              { key: 'org',         label: 'Org Distribution',    icon: GitBranch      },
              { key: 'leave',       label: 'Leave Analytics',     icon: CalendarCheck  },
            ] as { key: typeof workforceTab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: TabIcon }) => (
              <button
                key={key}
                onClick={() => setWorkforceTab(key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 cursor-pointer flex-1 justify-center"
                style={workforceTab === key
                  ? { backgroundColor: '#FFFFFF', color: '#2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                  : { backgroundColor: 'transparent', color: '#6B7280' }}
              >
                <TabIcon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab Panels ── */}
          {workforceTab === 'trend' && (
            loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div className="lg:col-span-3 h-52 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="lg:col-span-2 h-52 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div className="lg:col-span-3">
                  <TrendChart data={trend} error={trendError} />
                </div>
                <div className="lg:col-span-2">
                  {metrics && <MTDSummary metrics={metrics} />}
                </div>
              </div>
            )
          )}

          {workforceTab === 'demographics' && (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[0,1,2].map(i => <div key={i} className="h-60 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />)}
              </div>
            ) : demographicsError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
                <UserX size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>Unable to load demographics data</p>
                  <p className="text-xs mt-0.5" style={{ color: '#B91C1C' }}>{demographicsError}</p>
                </div>
              </div>
            ) : (genderData.length || ageData.length || expData.length) ? (
              <div className="demographics-row">
                <GenderChart data={genderData} total={apiTotal || undefined} />
                <AgeGroupChart data={ageData} />
                <ExperienceBandChart data={expData} />
              </div>
            ) : (
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB' }}>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>No demographics data returned.</p>
              </div>
            )
          )}

          {workforceTab === 'org' && (
            loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 h-72 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="h-72 rounded-xl animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />
              </div>
            ) : (
              <div className="org-classification-row">
                <div className="org-col-wide">
                  <OrgDistributionChart data={orgData} contractors={contractorData} error={orgError} />
                </div>
                <div className="org-col-narrow">
                  <EmploymentClassificationChart data={employmentData} error={employmentError} total={apiTotal || undefined} />
                </div>
              </div>
            )
          )}

          {workforceTab === 'leave' && (
            <LeaveApprovalTrend />
          )}

            </>
          )}
        </main>
      </div>

      {/* Employee Drawer */}
      {drawerFilter && (
        <EmployeeDrawer
          filter={drawerFilter}
          onClose={() => setDrawerFilter(null)}
        />
      )}
    </div>
  );
}
