// The "Readiness Dial" — the app's signature visual.
// Renders any 0-100 score (readiness_score from the backend) as an arc,
// colored by the same three bands the API already computes:
// 0-40 Needs Improvement (rust), 40-70 Average (brass), 70-100 Placement Ready (moss).

function bandColor(score) {
  if (score <= 40) return "var(--rust)";
  if (score <= 70) return "var(--brass)";
  return "var(--moss)";
}

function bandLabel(score) {
  if (score <= 40) return "Needs Improvement";
  if (score <= 70) return "Average";
  return "Placement Ready";
}

export default function Gauge({ score = 0, size = 64, label, showBand = true }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const stroke = size * 0.12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = bandColor(clamped);

  return (
    <div className="gauge-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--slate-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.26}
          fontWeight="600"
          fill="var(--ink)"
        >
          {Math.round(clamped)}
        </text>
      </svg>
      <div>
        {label && <div className="gauge-label">{label}</div>}
        {showBand && (
          <div className="gauge-score" style={{ color }}>
            {bandLabel(clamped)}
          </div>
        )}
      </div>
    </div>
  );
}

export { bandColor, bandLabel };
