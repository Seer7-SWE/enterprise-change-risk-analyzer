import { runPostChangeAnalysis } from "../api";

export default function CABPanel({ cab, onDecision }) {
  async function handleDecision(type) {
   const res = await submitCABDecision({
    cabId: cab.cabId,
    decision: type,
    role: "Operations"
  });

  onDecision(res);
}


  return (
    <div className="card">
      <h2>Post-Change Failure Correlation</h2>

      <p>
        Determines whether observed incidents are likely caused by the deployed
        change.
      </p>

      <button onClick={handleDecision}>
        Run Correlation Analysis
      </button>
    </div>
  );
}
