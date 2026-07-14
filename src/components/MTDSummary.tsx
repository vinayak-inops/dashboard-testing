import { useState } from 'react';
import { UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import { WorkforceMetrics } from '../lib/supabase';
import FormulaTooltip from './FormulaTooltip';

interface MTDSummaryProps { metrics: WorkforceMetrics; }
type Period = 'MTD' | 'QTD' | 'YTD';

const PERIOD_LABELS: Record<Period, string> = {
  MTD: 'Month to Date', QTD: 'Quarter to Date', YTD: 'Year to Date',
};

export default function MTDSummary({ metrics }: MTDSummaryProps) {
  const [period, setPeriod] = useState<Period>('MTD');

  const newWorkers = period === 'MTD' ? metrics.new_workers_mtd : period === 'QTD' ? metrics.new_workers_qtd : metrics.new_workers_ytd;
  const exitedWorkers = period === 'MTD' ? metrics.exited_workers_mtd : period === 'QTD' ? metrics.exited_workers_qtd : metrics.exited_workers_ytd;
  const netChange = newWorkers - exitedWorkers;

  return (
    <div className="chart-container">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="chart-title">Workforce Movement</h3>
          <p className="chart-subtitle">{PERIOD_LABELS[period]}</p>
        </div>
        <div className="period-tabs">
          {(['MTD', 'QTD', 'YTD'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`period-tab ${period === p ? 'period-tab-active' : ''}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {/* New Joiners */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
              <UserPlus size={13} style={{ color: '#15803D' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#374151' }}>New Joiners</p>
              <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{PERIOD_LABELS[period]}</p>
            </div>
          </div>
          <span className="text-lg font-bold" style={{ color: '#15803D' }}>+{newWorkers}</span>
        </div>

        {/* Exits */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
              <UserMinus size={13} style={{ color: '#DC2626' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#374151' }}>Exits</p>
              <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{PERIOD_LABELS[period]}</p>
            </div>
          </div>
          <span className="text-lg font-bold" style={{ color: '#DC2626' }}>-{exitedWorkers}</span>
        </div>

        {/* Net Change */}
        <div
          className="flex items-center justify-between p-2.5 rounded-lg border"
          style={netChange >= 0
            ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }
            : { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center"
              style={netChange >= 0 ? { backgroundColor: '#DBEAFE' } : { backgroundColor: '#FEF9C3' }}>
              <TrendingUp size={13} style={netChange >= 0 ? { color: '#1D4ED8' } : { color: '#A16207' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#374151' }}>Net Change</p>
              <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{period} net headcount</p>
            </div>
          </div>
          <span className="text-lg font-bold" style={netChange >= 0 ? { color: '#1D4ED8' } : { color: '#A16207' }}>
            {netChange >= 0 ? '+' : ''}{netChange}
          </span>
        </div>

        {/* Attrition bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <FormulaTooltip formula={`Attrition % = (Exits ÷ Total Workforce) × 100  →  (${exitedWorkers} ÷ ${metrics.total_workforce}) × 100 = ${((exitedWorkers / metrics.total_workforce) * 100).toFixed(2)}%`}>
              <span className="underline decoration-dotted decoration-gray-300 underline-offset-2" style={{ color: '#6B7280' }}>{period} Attrition Rate</span>
            </FormulaTooltip>
            <span className="font-semibold" style={{ color: '#374151' }}>
              {((exitedWorkers / metrics.total_workforce) * 100).toFixed(2)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                backgroundColor: '#EF4444',
                width: `${Math.min((exitedWorkers / metrics.total_workforce) * 100 * 10, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
