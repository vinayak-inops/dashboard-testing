import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { WorkforceTrend } from '../lib/supabase';

interface TrendChartProps { data: WorkforceTrend[]; error?: string | null; }

const W = 600, H = 200, PAD = { top: 16, right: 20, bottom: 28, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

function smooth(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.45;
    const cp1y = pts[i].y;
    const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * 0.45;
    const cp2y = pts[i + 1].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

export default function TrendChart({ data, error }: TrendChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (error) {
    return (
      <div className="chart-container flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="chart-title">Workforce Growth Trend</h3>
            <p className="chart-subtitle">Monthly headcount progression</p>
          </div>
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

  const allValues = [...data.map(d => d.total_workforce), ...data.map(d => d.active_workforce)];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = (rawMax - rawMin) * 0.2 || 100;
  const yMin = Math.floor((rawMin - padding) / 100) * 100;
  const yMax = Math.ceil((rawMax + padding) / 100) * 100;
  const yRange = yMax - yMin;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * INNER_W;
  const toY = (v: number) => PAD.top + INNER_H - ((v - yMin) / yRange) * INNER_H;

  const totalPts  = data.map((d, i) => ({ x: toX(i), y: toY(d.total_workforce) }));
  const activePts = data.map((d, i) => ({ x: toX(i), y: toY(d.active_workforce) }));

  const totalPath  = smooth(totalPts);
  const activePath = smooth(activePts);

  const totalArea  = totalPath  + ` L ${totalPts[totalPts.length - 1].x} ${PAD.top + INNER_H} L ${PAD.left} ${PAD.top + INNER_H} Z`;
  const activeArea = activePath + ` L ${activePts[activePts.length - 1].x} ${PAD.top + INNER_H} L ${PAD.left} ${PAD.top + INNER_H} Z`;

  // Y-axis tick values — 4 evenly spaced
  const ticks = [0, 1, 2, 3].map(i => yMin + (yRange / 3) * i);

  const hi = hovered !== null ? data[hovered] : data[data.length - 1];
  const hiX = hovered !== null ? toX(hovered) : toX(data.length - 1);

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="chart-title">Workforce Growth Trend</h3>
          <p className="chart-subtitle">{data.length}-month headcount progression</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
            <span className="inline-block w-6 h-0.5 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
            Total
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
            <span className="inline-block w-6 rounded-full" style={{ height: 2, backgroundColor: '#10B981' }} />
            Active
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
          <defs>
            <linearGradient id="tg-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="tg-active" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10B981" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
            </linearGradient>
            <clipPath id="tg-clip">
              <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
            </clipPath>
          </defs>

          {/* Gridlines + Y labels */}
          {ticks.map((v, i) => {
            const y = toY(v);
            return (
              <g key={i}>
                <line
                  x1={PAD.left} x2={PAD.left + INNER_W} y1={y} y2={y}
                  stroke="#F3F4F6" strokeWidth="1"
                />
                <text x={PAD.left - 6} y={y + 3.5} textAnchor="end"
                  fontSize="9" fill="#9CA3AF" fontFamily="system-ui">
                  {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                </text>
              </g>
            );
          })}

          {/* Hover crosshair */}
          {hovered !== null && (
            <line
              x1={hiX} x2={hiX} y1={PAD.top} y2={PAD.top + INNER_H}
              stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4,3"
            />
          )}

          {/* Area fills */}
          <g clipPath="url(#tg-clip)">
            <path d={activeArea} fill="url(#tg-active)" />
            <path d={totalArea}  fill="url(#tg-total)"  />
          </g>

          {/* Lines */}
          <g clipPath="url(#tg-clip)">
            <path d={activePath} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={totalPath}  fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Dots */}
          {totalPts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 5 : 3.5}
              fill="#3B82F6" stroke="white" strokeWidth="2"
              style={{ transition: 'r 0.15s' }}
            />
          ))}
          {activePts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 4 : 2.5}
              fill="#10B981" stroke="white" strokeWidth="1.5"
              style={{ transition: 'r 0.15s' }}
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text key={i} x={toX(i)} y={H - 4} textAnchor="middle"
              fontSize="9" fill={hovered === i ? '#374151' : '#9CA3AF'}
              fontWeight={hovered === i ? '600' : '400'}
              fontFamily="system-ui">
              {d.month_year.replace(' ', '\u00A0')}
            </text>
          ))}

          {/* Invisible hover targets */}
          {data.map((_, i) => {
            const x = toX(i);
            const colW = INNER_W / (data.length - 1);
            return (
              <rect
                key={i}
                x={x - colW / 2} y={PAD.top}
                width={colW} height={INNER_H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        <div
          className="absolute top-2 pointer-events-none transition-all duration-150"
          style={{
            left: `${(hiX / W) * 100}%`,
            transform: hiX > W * 0.65 ? 'translateX(-110%)' : 'translateX(8px)',
          }}
        >
          <div className="rounded-lg px-3 py-2.5 shadow-lg text-left"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 140 }}>
            <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#111827' }}>
              {hi.month_year}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: '#6B7280' }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#3B82F6' }} />
                  Total
                </span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: '#111827' }}>
                  {hi.total_workforce.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: '#6B7280' }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#10B981' }} />
                  Active
                </span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: '#111827' }}>
                  {hi.active_workforce.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1" style={{ borderTop: '1px solid #F3F4F6' }}>
                <span className="text-[10px] font-medium" style={{ color: '#059669' }}>+{hi.new_joiners} joined</span>
                <span className="text-[10px] font-medium" style={{ color: '#EF4444' }}>{hi.exits} exited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
        {data.slice(-4).map((d, i) => {
          const prev = data[data.length - 4 + i - 1];
          const delta = prev ? d.total_workforce - prev.total_workforce : null;
          return (
            <div key={d.id} className="text-center">
              <p className="text-xs font-bold tabular-nums" style={{ color: '#111827' }}>
                {d.total_workforce.toLocaleString()}
              </p>
              {delta !== null && (
                <p className="text-[9px] font-medium tabular-nums mt-0.5"
                  style={{ color: delta >= 0 ? '#10B981' : '#EF4444' }}>
                  {delta >= 0 ? '+' : ''}{delta}
                </p>
              )}
              <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>
                {d.month_year}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
