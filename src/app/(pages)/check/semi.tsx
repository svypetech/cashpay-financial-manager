import React from 'react';

const SemiCircleGauge = () => {
  const width = 200;
  const height = 150;
  const cx = width / 2;
  const cy = 95; // Adjusted to fit within SVG
  const r = 80;
  const strokeWidth = 10;
  const percentage = 70;
  const lineLength = 10;

  // Calculate the angle for the filled portion
  const totalAngle = 180;
  const filledAngle = (percentage / 100) * totalAngle;
  const endAngle = 180 - filledAngle;

  // Calculate the end point of the filled arc
  const endAngleRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(endAngleRad);
  const y1 = cy - r * Math.sin(endAngleRad);

  // Calculate the indicator line end point
  const dx = (x1 - cx) / r;
  const dy = (y1 - cy) / r;
  const x2 = x1 + lineLength * dx;
  const y2 = y1 + lineLength * dy;

  return (
    <svg width={width} height={height}>
      {/* Filled portion */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
        stroke="#3B82F6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Unfilled portion */}
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Indicator line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#3B82F6"
        strokeWidth={2}
      />
      {/* Text */}
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        fill="#1F2937"
      >
        {percentage}
      </text>
    </svg>
  );
};

export default SemiCircleGauge;