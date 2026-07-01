import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Search, User, MapPin, Calendar } from 'lucide-react';
import { supabase, Employee, EmployeeFilter, EMPLOYEE_FILTER_LABELS } from '../lib/supabase';

interface Props {
  filter: EmployeeFilter | null;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Present:  { bg: '#DCFCE7', text: '#15803D' },
  Active:   { bg: '#DBEAFE', text: '#1D4ED8' },
  Absent:   { bg: '#FEE2E2', text: '#DC2626' },
  Inactive: { bg: '#FEF9C3', text: '#A16207' },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Active:   { bg: '#DBEAFE', text: '#1D4ED8' },
  Inactive: { bg: '#F3F4F6', text: '#6B7280' },
  Contract: { bg: '#FEF3C7', text: '#D97706' },
  Vendor:   { bg: '#F3E8FF', text: '#7C3AED' },
};

function buildQuery(filter: EmployeeFilter) {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

  switch (filter) {
    case 'total':
      return supabase.from('employees').select('*', { count: 'exact' });
    case 'active':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('employment_type', 'Active').is('exit_date', null);
    case 'inactive':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('employment_type', 'Inactive');
    case 'present':
    case 'att_total_present':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Present');
    case 'att_half_day':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Half-Day');
    case 'att_total_absent':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Absent');
    case 'att_weekly_off':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Weekly-Off');
    case 'att_leave':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Leave');
    case 'att_holiday':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Holiday');
    case 'att_on_duty':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'On-Duty');
    case 'att_missed_punch':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Missed-Punch');
    case 'shift_general':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('shift', 'General');
    case 'shift_morning':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('shift', 'Morning');
    case 'shift_evening':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('shift', 'Evening');
    case 'shift_night':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('shift', 'Night');
    case 'shift_rotational':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('shift', 'Rotational');
    case 'inside_premises':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Present');
    case 'inside_male':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Present').eq('gender', 'Male');
    case 'inside_female':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('status', 'Present').eq('gender', 'Female');
    case 'contract':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('employment_type', 'Contract');
    case 'vendor':
      return supabase.from('employees').select('*', { count: 'exact' }).eq('employment_type', 'Vendor');
    case 'new_mtd':
      return supabase.from('employees').select('*', { count: 'exact' }).gte('join_date', firstOfMonth);
    case 'exited_mtd':
      return supabase.from('employees').select('*', { count: 'exact' }).gte('exit_date', firstOfMonth);
    default:
      return supabase.from('employees').select('*', { count: 'exact' });
  }
}

export default function EmployeeDrawer({ filter, onClose }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPage = useCallback(async (p: number, searchTerm: string) => {
    if (!filter) return;
    setLoading(true);
    const from = (p - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let q = buildQuery(filter).order('emp_id').range(from, to);
    if (searchTerm) {
      q = q.or(`name.ilike.%${searchTerm}%,emp_id.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`);
    }

    const { data, count } = await q;
    setEmployees(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (filter) {
      setPage(1);
      setSearch('');
      setSearchInput('');
      fetchPage(1, '');
    }
  }, [filter, fetchPage]);

  useEffect(() => {
    fetchPage(page, search);
  }, [page, search, fetchPage]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  if (!filter) return null;

  const label = EMPLOYEE_FILTER_LABELS[filter];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="relative ml-auto flex flex-col bg-white shadow-2xl"
        style={{ width: 'min(860px, 92vw)', height: '100vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{label}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {total} employee{total !== 1 ? 's' : ''} &middot; page {page} of {totalPages}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, ID or department..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <User size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No employees found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-20">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Department</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Designation</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Location</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => {
                  const statusColor = STATUS_COLORS[emp.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
                  const typeColor = TYPE_COLORS[emp.employment_type] ?? { bg: '#F3F4F6', text: '#6B7280' };
                  return (
                    <tr
                      key={emp.id}
                      className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}
                    >
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">{emp.emp_id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: emp.gender === 'Female' ? '#EC4899' : '#3B82F6' }}
                          >
                            {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <span className="font-medium text-gray-900 text-xs leading-tight">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{emp.department}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} className="flex-shrink-0" />
                          {emp.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                        >
                          {emp.employment_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={10} className="flex-shrink-0" />
                          {new Date(emp.join_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors border"
                  style={
                    pageNum === page
                      ? { backgroundColor: '#3B82F6', color: '#fff', borderColor: '#3B82F6' }
                      : { backgroundColor: '#fff', color: '#374151', borderColor: '#E5E7EB' }
                  }
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
