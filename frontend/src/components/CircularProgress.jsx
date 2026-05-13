const CircularProgress = ({
  value,
  size = 36,
  strokeWidth = 3,
  trackColor = "#e5e7eb",
  progressColor,
  textColor,
  bgColor
}) => {

  const safeValue = Math.min(100, Math.max(0, value || 0));

  const safeProgressColor = progressColor || "#0284C7";
  const safeTextColor = textColor || "#111827";
  const safeBgColor = bgColor || "transparent";

  const radius = (size - strokeWidth) / 2;

  const innerRadius = Math.max(0, radius - strokeWidth);

  const circumference = 2 * Math.PI * radius;

  const progressLength = (safeValue / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={innerRadius}
        fill={safeBgColor}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={safeProgressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${progressLength} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".30em"
        fontSize="16px"
        fontWeight="400"
        fill={safeTextColor}
      >
        {safeValue}
      </text>
    </svg>
  );
};

export default CircularProgress;