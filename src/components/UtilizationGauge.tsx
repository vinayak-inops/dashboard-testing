interface UtilizationGaugeProps {
  value: number;
  label: string;
  color?: string;
}

export default function UtilizationGauge({ value, label, color = '#3B82F6' }: UtilizationGaugeProps) {
  const radius = 54, stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const halfCircumference = circumference / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: radius * 2, height: radius + stroke }}>
        <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-180deg)', transformOrigin: 'center' }}>
          <circle stroke="#F3F4F6" fill="transparent" strokeWidth={stroke}
            r={normalizedRadius} cx={radius} cy={radius}
            strokeDasharray={`${halfCircumference} ${circumference}`}
          />
          <circle stroke={color} fill="transparent" strokeWidth={stroke}
            strokeDasharray={`${(value / 100) * halfCircumference} ${circumference}`}
            strokeDashoffset={0} strokeLinecap="round"
            r={normalizedRadius} cx={radius} cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-xl font-bold" style={{ color: '#111827' }}>{value}%</span>
        </div>
      </div>
      <p className="text-xs mt-1 font-medium" style={{ color: '#6B7280' }}>{label}</p>
    </div>
  );
}
