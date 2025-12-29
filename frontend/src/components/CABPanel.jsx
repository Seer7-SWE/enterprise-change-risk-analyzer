import { useState } from "react";
import { submitCABDecision } from "../api";

export default function CABPanel({ cab }) {
  const [decision, setDecision] = useState(null);

  if (!cab) return null;

  async function handleDecision(type) {
    const res = await submitCABDecision({
      cabId: cab.cabId,
      decision: type,
      role: "Operations"
    });
    setDecision(res);
  }

  return (
    <div className="card">
      <h2>Change Advisory Board (CAB)</h2>

      <p><strong>CAB ID:</strong> {cab.cabId}</p>
      <p><strong>Status:</strong> {decision?.status || cab.status}</p>

      <h4>Required Approvals</h4>
      <ul>
        {cab.requiredApprovals.map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      {!decision && (
        <div className="actions">
          <button className="approve" onClick={() => handleDecision("APPROVED")}>
            Approve Change
          </button>
          <button className="reject" onClick={() => handleDecision("REJECTED")}>
            Reject Change
          </button>
        </div>
      )}

      {decision && (
        <p className="note">
          Decision recorded by {decision.decidedBy} at {decision.decidedAt}
        </p>
      )}
    </div>
  );
}
