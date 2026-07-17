import { useState } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { WorkforceTrend } from '../lib/supabase';

interface TrendChartProps { data: WorkforceTrend[]; error?: string | null; }

const W = 600, H = 220, PAD = { top: 20, right: 24, bottom: 32, left: 56 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

export default function TrendChart({ data, error }: TrendChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (error) {
    return (
      <div className="chart-container flex flex-col">
        <div className="mb-3">
          <h3 className="chart-title">Workforce Growth Trend</h3>
          <p className="chart-subtitle">Monthly headcount progression</p>
        </div>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
              <AlertCircle size={16} style={{ color: '#DC2626' }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Unable to load trend data</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) return null;

  const values = data.map(d => d.active_workforce);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = (rawMax - rawMin) * 0.15 || 100;
  const yMin = Math.floor((rawMin - padding) / 100) * 100;
  const yMax = Math.ceil((rawMax + padding) / 100) * 100;
  const yRange = yMax - yMin;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * INNER_W;
  const toY = (v: number) => PAD.top + INNER_H - ((v - yMin) / yRange) * INNER_H;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.active_workforce)}`).join(' ');
  const areaPath = linePath + ` L ${toX(data.length - 1)} ${PAD.top + INNER_H} L ${PAD.left} ${PAD.top + INNER_H} Z`;

  const ticks = [0, 1, 2, 3, 4].map(i => yMin + (yRange / 4) * i);

  const hi = hovered !== null ? data[hovered] : data[data.length - 1];
  const hiX = hovered !== null ? toX(hovered) : toX(data.length - 1);
  const hiIdx = hovered !== null ? hovered : data.length - 1;

  const firstActive = data[0].active_workforce;
  const lastActive = data[data.length - 1].active_workforce;
  const growth = lastActive - firstActive;
  const growthPct = firstActive ? ((growth / firstActive) * 100).toFixed(1) : '0';

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="chart-title">Workforce Growth Trend</h3>
          <p className="chart-subtitle">{data.length}-month active headcount progression</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1.5 text-sm font-bold tabular-nums" style={{ color: growth >= 0 ? '#059669' : '#DC2626' }}>
            {growth >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
            {growth >= 0 ? '+' : ''}{growth.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>
            {growthPct}% over {data.length} months
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-2">
        <span className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
          <span className="inline-block w-5 h-2.5 rounded-sm" style={{ backgroundColor: '#10B981' }} />
          Active Workforce
        </span>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
          <defs>
            <linearGradient id="tg-active" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gridlines + Y labels */}
          {ticks.map((v, i) => {
            const y = toY(v);
            return (
              <g key={i}>
                <line x1={PAD.left} x2={PAD.left + INNER_W} y1={y} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="#9CA3AF" fontFamily="system-ui">
                  {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                </text>
              </g>
            );
          })}

          {/* Hover crosshair */}
          {hovered !== null && (
            <line x1={hiX} x2={hiX} y1={PAD.top} y2={PAD.top + INNER_H} stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4,3" />
          )}

          {/* Area fill */}
          <path d={areaPath} fill="url(#tg-active)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover dot */}
          {hovered !== null && (
            <circle cx={hiX} cy={toY(hi.active_workforce)} r="5" fill="#10B981" stroke="white" strokeWidth="2.5" />
          )}

          {/* X-axis labels — show every other for clarity */}
          {data.map((d, i) => (
            (data.length <= 8 || i % 2 === 0 || i === data.length - 1) && (
              <text key={i} x={toX(i)} y={H - 6} textAnchor="middle"
                fontSize="10" fill={hovered === i ? '#374151' : '#9CA3AF'}
                fontWeight={hovered === i ? '600' : '400'} fontFamily="system-ui">
                {d.month_year.replace(' ', '\u00A0')}
              </text>
            )
          ))}

          {/* Invisible hover targets */}
          {data.map((_, i) => {
            const x = toX(i);
            const colW = INNER_W / (data.length - 1);
            return (
              <rect key={i} x={x - colW / 2} y={PAD.top} width={colW} height={INNER_H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }} />
            );
          })}
        </svg>

        {/* Tooltip */}
        <div
          className="absolute pointer-events-none transition-all duration-100"
          style={{
            top: 8,
            left: `${(hiX / W) * 100}%`,
            transform: hiIdx > data.length * 0.6 ? 'translateX(-112%)' : 'translateX(12px)',
          }}
        >
          <div className="rounded-lg px-3 py-2.5 shadow-lg"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 150 }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#111827' }}>{hi.month_year}</p>
            <div className="flex items-center justify-between gap-5 mb-2">
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#6B7280' }}>
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#10B981' }} />
                Active
              </span>
              <span className="text-xs font-bold tabular-nums" style={{ color: '#111827' }}>
                {hi.active_workforce.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
              <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>+{hi.new_joiners} joined</span>
              <span className="text-[10px] font-semibold" style={{ color: '#EF4444' }}>-{hi.exits} exited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple summary footer */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>Started at</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: '#374151' }}>
            {firstActive.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>Current</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: '#10B981' }}>
            {lastActive.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
