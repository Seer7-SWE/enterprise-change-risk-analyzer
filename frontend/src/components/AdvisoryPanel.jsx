export default function AdvisoryPanel({ advisories }) {
  if (!advisories) return null;

  return (
    <div className="card">
      <h2>Automated Advisory Actions</h2>

      {/* ServiceNow */}
      <div className="advisory-box">
        <h3>ServiceNow Change Advisory</h3>
        <p><strong>Change ID:</strong> {advisories.serviceNow.changeId}</p>
        <p><strong>Type:</strong> {advisories.serviceNow.type}</p>
        <p><strong>Priority:</strong> {advisories.serviceNow.priority}</p>
        <p><strong>Status:</strong> {advisories.serviceNow.state}</p>
        <p className="note">
          This change requires CAB approval due to high operational risk.
        </p>
      </div>
      <br></br>
      {/* Jira */}
      <div className="advisory-box">
        <h3>Jira Risk Mitigation Task</h3>
        <p><strong>Issue:</strong> {advisories.jira.issueKey}</p>
        <p><strong>Project:</strong> {advisories.jira.project}</p>
        <p><strong>Severity:</strong> {advisories.jira.severity}</p>
        <p><strong>Status:</strong> {advisories.jira.status}</p>
        <p className="note">
          Engineering team must prepare rollback & monitoring.
        </p>
      </div>
    </div>
  );
}
