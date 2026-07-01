import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  Activity,
  Building2,
  RefreshCw,
  ChevronDown,
  Bell,
  Settings,
  LayoutDashboard,
  PieChart,
  ShieldCheck,
} from 'lucide-react';
import { supabase, WorkforceMetrics, WorkforceTrend, WorkforceGender, WorkforceAgeGroup, WorkforceExperienceBand, WorkforceOrgDistribution, WorkforceEmploymentClassification, EmployeeFilter } from './lib/supabase';
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

    const [apiRes, compRes, trendRes] = await Promise.all([
      fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cards', tenantCode: 'AAL' }),
      }).then(r => r.json()).catch((err) => ({ __error: err?.message ?? 'Network error' })),
      fetch('https://devai.clms.in/webhook/clms-dashboard-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'workforce_composition', tenantCode: 'AAL' }),
      }).then(r => r.json()).catch((err) => ({ __error: err?.message ?? 'Network error' })),
      supabase.from('workforce_trend').select('*').order('created_at', { ascending: true }),
    ]);

    if (apiRes?.__error) {
      setMetricsError(`Failed to load KPI data: ${apiRes.__error}`);
      setMetrics(null);
    } else if (apiRes?.data) {
      const d = apiRes.data;
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

    if (compRes?.__error) {
      setDemographicsError(`Failed to load demographics: ${compRes.__error}`);
      setOrgError(`Failed to load organizational distribution: ${compRes.__error}`);
      setEmploymentError(`Failed to load employment classification: ${compRes.__error}`);
    } else if (compRes?.data) {
      const c = compRes.data;
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

      // Org distribution — flatten all dimension arrays from the API
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
        const arr = c[apiKey];
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

      // Workforce trend
      const trendArr = c.workforceTrend ?? [];
      if (trendArr.length > 0) {
        setTrend(trendArr.map((d: { monthYear: string; totalWorkforce: number; activeWorkforce: number; newJoiners: number; exits: number; utilizationPct: number }, i: number) => ({
          id: String(i),
          month_year: d.monthYear,
          total_workforce: d.totalWorkforce,
          active_workforce: d.activeWorkforce,
          new_joiners: d.newJoiners,
          exits: d.exits,
          utilization_pct: d.utilizationPct,
          created_at: '',
        })));
        setTrendError(null);
        trendFromApi = true;
      }

      // Contractor panel data
      const contractorArr = c.contractorDistribution ?? c.contractorDetails ?? c.contractors ?? [];
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
      setDemographicsError('No demographics data returned from the API.');
      setOrgError('No organizational distribution data returned from the API.');
      setEmploymentError('No employment classification data returned from the API.');
    }

    // Fall back to Supabase for trend data only if API didn't return it
    if (!trendFromApi) {
      if (trendRes.error) {
        setTrendError(`Failed to load trend data: ${trendRes.error.message}`);
      } else if (trendRes.data && trendRes.data.length > 0) {
        setTrend(trendRes.data);
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
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <LayoutDashboard size={18} strokeWidth={1.75} />
          </div>
          <div>
            <p className="logo-title">CLMS</p>
            <p className="logo-sub">CXO Dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Overview</p>
          <a href="#" className={`nav-item${activePage === 'workforce' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('workforce'); }}>
            <LayoutDashboard size={15} />
            Workforce Summary
          </a>
          <a href="#" className={`nav-item${activePage === 'attendance' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('attendance'); }}>
            <Users size={15} />
            Attendance Summary
          </a>
          <a href="#" className={`nav-item${activePage === 'vendor' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('vendor'); }}>
            <Activity size={15} />
            Vendor Performance
          </a>
          <a href="#" className={`nav-item${activePage === 'demographics' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('demographics'); }}>
            <PieChart size={15} />
            Compliance Governance
          </a>
          <a href="#" className={`nav-item${activePage === 'safety' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('safety'); }}>
            <ShieldCheck size={15} />
            Safety &amp; Welfare
          </a>
          <a href="#" className={`nav-item${activePage === 'risks' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('risks'); }}>
            <UserX size={15} />
            Risks &amp; Alerts
          </a>
          <a href="#" className={`nav-item${activePage === 'onboarding' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('onboarding'); }}>
            <UserCheck size={15} />
            Onboarding &amp; Exit
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">CX</div>
            <div className="flex-1 min-w-0">
              <p className="user-name">CXO Admin</p>
              <p className="user-role">Executive</p>
            </div>
            <Settings size={13} className="flex-shrink-0" style={{ color: '#9CA3AF' }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
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
          ) : loading ? null : (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
              <UserX size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>No KPI data available.</p>
            </div>
          )}

          {/* Bottom Charts Row */}
          <div className="charts-row">
            <div className="chart-col-wide">
              <TrendChart data={trend} error={trendError} />
            </div>
            {metrics && (
              <div className="chart-col-narrow lg:col-span-2">
                <MTDSummary metrics={metrics} />
              </div>
            )}
          </div>

          {/* Demographics Row */}
          <div className="section-header">
            <h2 className="section-title">Workforce Demographics</h2>
            <p className="section-subtitle">Composition by gender, age, and experience</p>
          </div>
          {demographicsError ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
              <UserX size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>Unable to load demographics data</p>
                <p className="text-xs mt-0.5" style={{ color: '#B91C1C' }}>{demographicsError}</p>
              </div>
            </div>
          ) : (
            <div className="demographics-row">
              <GenderChart data={genderData} total={apiTotal || undefined} />
              <AgeGroupChart data={ageData} />
              <ExperienceBandChart data={expData} />
            </div>
          )}

          {/* Org Distribution + Employment Classification */}
          <div className="section-header">
            <h2 className="section-title">Organizational Distribution &amp; Employment Classification</h2>
            <p className="section-subtitle">Concentration by structure and skill category</p>
          </div>
          <div className="org-classification-row">
            <div className="org-col-wide">
              <OrgDistributionChart data={orgData} contractors={contractorData} error={orgError} />
            </div>
            <div className="org-col-narrow">
              <EmploymentClassificationChart data={employmentData} error={employmentError} total={apiTotal || undefined} />
            </div>
          </div>

          {/* Leave Analytics */}
          <div className="section-header">
            <h2 className="section-title">Leave Analytics</h2>
            <p className="section-subtitle">Approval trends, rejection reasons and supervisor SLA compliance</p>
          </div>
          <LeaveApprovalTrend />

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
