export default function RiskBreakdown({ factors }) {
  return (
    <div className="card">
      <h3>Risk Explanation</h3>

      <ul className="risk-list">
        {factors.map((f, i) => (
          <li key={i}>
            <div className="risk-row">
              <span className="risk-title">{f.title}</span>
              <span className="risk-impact">{f.impact}</span>
            </div>
            <p className="risk-reason">{f.reason}</p>
          </li>
        ))}
      </ul>

      <p className="hint">
        These factors explain how the overall risk score was calculated.
      </p>
    </div>
  );
}
