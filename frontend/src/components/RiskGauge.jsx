export default function RiskGauge({ score }) {
  const angle = (score / 100) * 180 - 90;

  return (
    <div className="gauge-card">
      <h3>Overall Change Risk</h3>

      <div className="gauge">
        <div
          className="needle"
          style={{ transform: `rotate(${angle}deg)` }}
        />
      </div>

      <div className="gauge-score">{score}</div>
      <div className="gauge-label">
        {score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk"}
      </div>
    </div>
  );
}
