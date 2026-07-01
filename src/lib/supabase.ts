import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WorkforceMetrics {
  id: string;
  snapshot_date: string;
  total_workforce: number;
  active_workforce: number;
  inactive_workforce: number;
  present_today: number;
  total_contract_workers: number;
  total_vendors_contractors: number;
  new_workers_mtd: number;
  exited_workers_mtd: number;
  new_workers_qtd: number;
  exited_workers_qtd: number;
  new_workers_ytd: number;
  exited_workers_ytd: number;
  workforce_growth_pct: number;
  workforce_utilization_pct: number;
  department: string;
  region: string;
  created_at: string;
}

export interface WorkforceGender {
  id: string;
  snapshot_date: string;
  gender: string;
  count: number;
  pct: number;
  created_at: string;
}

export interface WorkforceAgeGroup {
  id: string;
  snapshot_date: string;
  age_group: string;
  count: number;
  pct: number;
  sort_order: number;
  created_at: string;
}

export interface WorkforceExperienceBand {
  id: string;
  snapshot_date: string;
  band: string;
  count: number;
  pct: number;
  sort_order: number;
  created_at: string;
}

export interface VendorWorkforce {
  id: string;
  snapshot_date: string;
  vendor_name: string;
  category: string;
  engagement_type: string;
  status: string;
  count: number;
  pct_of_total: number;
  contract_end_date: string | null;
  sort_order: number;
  created_at: string;
}

export interface WorkforceEmploymentClassification {
  id: string;
  snapshot_date: string;
  classification: string;
  count: number;
  pct: number;
  sort_order: number;
  created_at: string;
}

export interface WorkforceOrgDistribution {
  id: string;
  snapshot_date: string;
  dimension: string;
  label: string;
  count: number;
  pct: number;
  sort_order: number;
  created_at: string;
}

export interface WorkforceTrend {
  id: string;
  month_year: string;
  total_workforce: number;
  active_workforce: number;
  new_joiners: number;
  exits: number;
  utilization_pct: number;
  created_at: string;
}

export interface Employee {
  id: string;
  emp_id: string;
  name: string;
  department: string;
  designation: string;
  employment_type: string;
  status: string;
  gender: string;
  location: string;
  join_date: string;
  exit_date: string | null;
  vendor_name: string | null;
  contract_type: string | null;
  created_at: string;
}

export type EmployeeFilter =
  | 'total'
  | 'active'
  | 'inactive'
  | 'present'
  | 'contract'
  | 'vendor'
  | 'new_mtd'
  | 'exited_mtd'
  // Attendance overview
  | 'att_total_present'
  | 'att_half_day'
  | 'att_total_absent'
  // Attendance exceptions
  | 'att_weekly_off'
  | 'att_leave'
  | 'att_holiday'
  | 'att_on_duty'
  | 'att_missed_punch'
  // Shift operations
  | 'shift_general'
  | 'shift_morning'
  | 'shift_evening'
  | 'shift_night'
  | 'shift_rotational'
  // Inside premises
  | 'inside_premises'
  | 'inside_male'
  | 'inside_female';

export const EMPLOYEE_FILTER_LABELS: Record<EmployeeFilter, string> = {
  total: 'All Employees',
  active: 'Active Workforce',
  inactive: 'Inactive Workforce',
  present: 'Present Today',
  contract: 'Contract Workers',
  vendor: 'Vendors / Contractors',
  new_mtd: 'New Workers (MTD)',
  exited_mtd: 'Exited Workers (MTD)',
  att_total_present: 'Total Present',
  att_half_day: 'Half-Day Present',
  att_total_absent: 'Total Absent',
  att_weekly_off: 'Weekly Off',
  att_leave: 'On Leave',
  att_holiday: 'On Holiday',
  att_on_duty: 'On Duty',
  att_missed_punch: 'Missed Punch',
  shift_general: 'General Shift',
  shift_morning: 'Morning Shift',
  shift_evening: 'Evening Shift',
  shift_night: 'Night Shift',
  shift_rotational: 'Rotational Shift',
  inside_premises: 'Inside Premises',
  inside_male: 'Inside Premises — Male',
  inside_female: 'Inside Premises — Female',
};
