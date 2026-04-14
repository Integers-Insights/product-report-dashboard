// const CircularProgress = ({ percent, size = 36, strokeWidth = 3, gapAngle = 90, trackColor = "#e5e7eb" }) => {

//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const visibleLength = ((360 - gapAngle) / 360) * circumference;
//   const gapLength = circumference - visibleLength;
//   const progressLength = (percent / 100) * visibleLength;
//   const rotation = 90 + gapAngle / 2;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px" }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>


//         <g transform={`rotate(${rotation} ${size / 2} ${size / 2})`}>
//           {/* Background Track */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="transparent"
//             stroke={trackColor}
//             strokeWidth={strokeWidth}
//             strokeDasharray={`${visibleLength} ${gapLength}`}
//             strokeLinecap="butt"
//           />

//           {/* Progress Arc */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             fill="transparent"
//             stroke={`url(#gradient-${percent})`}
//             strokeWidth={strokeWidth}
//             strokeDasharray={`${progressLength} ${circumference}`}
//             strokeLinecap="butt"
//             style={{ transition: "stroke-dasharray 0.5s ease" }}
//           />
//         </g>

//         {/* Center Percentage */}
//         <text
//           x="50%"
//           y="50%"
//           textAnchor="middle"
//           dominantBaseline="middle"
//           fontSize="16px"
//           fontWeight="400"
//           fill="#111"

//         >
//           {percent}
//         </text>
//       </svg>

//       {/* Bottom Label
//       <div style={{ fontSize: "11px", fontWeight: 400, textAlign: "center", marginTop: "-10px", color: "#3C4D4D" }}>
//         {label}
//       </div> */}
//     </div>
//   );
// }

// export default CircularProgress;



// const CircularProgress = ({
//   value,
//   size = 36,
//   strokeWidth = 3,
//   trackColor = "#e5e7eb",
//   progressColor,
//   textColor,
//   bgColor
// }) => {

//   const radius = (size - strokeWidth) / 2;
//   const innerRadius = radius - strokeWidth;
//   const circumference = 2 * Math.PI * radius;
//   const progressLength = (value / 100) * circumference;

//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={innerRadius}
//         fill={bgColor}
//       />
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={radius}
//         fill="transparent"
//         stroke={trackColor}
//         strokeWidth={strokeWidth}
//       />
//       <circle
//         cx={size / 2}
//         cy={size / 2}
//         r={radius}
//         fill="transparent"
//         stroke={progressColor}
//         strokeWidth={strokeWidth}
//         strokeDasharray={`${progressLength} ${circumference}`}
//         strokeLinecap="round"
//         transform={`rotate(-90 ${size / 2} ${size / 2})`}
//         style={{ transition: "stroke-dasharray 0.5s ease" }}
//       />
//       <text
//         x="50%"
//         y="50%"
//         textAnchor="middle"
//         dy=".30em"
//         fontSize="16px"
//         fontWeight="400"
//         fill={textColor}
//       >
//         {value}
//       </text>
//     </svg>
//   );
// };

// export default CircularProgress;







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