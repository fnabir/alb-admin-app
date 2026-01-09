type PieSlice = {
  value: number;
  color: string;
};

export function PieChart({
  data,
  size = 200,
  strokeWidth = 15,
  gap = 15,
  className = '',
}: {
  data: PieSlice[];
  size?: number;
  strokeWidth?: number;
  gap?: number;
  className?: string;
}) {
  const filtered = data.filter((s) => s.value > 0);

  const total = filtered.reduce((sum, slice) => sum + slice.value, 0);
  const count = filtered.length;
  const effectiveGap = count > 1 ? gap : 0;

  const radius = size / 2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  const slices = [];
  let accumulatedAngle = 0;

  for (const slice of filtered) {
    const angle = (slice.value / total) * 360;
    const angleWithGap = Math.max(angle - effectiveGap, 0);

    const length = (angleWithGap / 360) * circumference;
    const dashOffset = (accumulatedAngle / 360) * circumference;

    slices.push({
      ...slice,
      length,
      dashOffset,
    });

    accumulatedAngle += angle;
  }

  if (total > 0)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute text-2xl font-bold pointer-events-none select-none text-primary">
          {total}
        </div>
        <svg width={size} height={size}>
          {slices.map((slice, index) => {
            return (
              <circle
                key={index}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${slice.length} ${circumference}`}
                strokeDashoffset={-slice.dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            );
          })}
        </svg>
      </div>
    );
  else null;
}

export default PieChart;
