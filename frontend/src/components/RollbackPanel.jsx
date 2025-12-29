export default function RollbackPanel({ rollback }) {
  if (!rollback) return null;

  const isRecommended =
    rollback.recommendation === "ROLLBACK_RECOMMENDED";

  const reasoning = Array.isArray(rollback.reasoning)
    ? rollback.reasoning
    : [];

  const confidence =
    typeof rollback.confidence === "number"
      ? rollback.confidence
      : 0;

  return (
    <div className="card">
      <h2>Auto-Rollback Recommendation</h2>

      <p className={isRecommended ? "danger" : "safe"}>
        {isRecommended
          ? "Rollback is strongly recommended"
          : "Rollback is not required at this time"}
      </p>

      <p>
        Confidence Score: <strong>{confidence}%</strong>
      </p>

      {reasoning.length > 0 && (
        <ul>
          {reasoning.map(reason => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}

      <p className="note">
        This is an advisory recommendation. Final decision remains with CAB.
      </p>
    </div>
  );
}
