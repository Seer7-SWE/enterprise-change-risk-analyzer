export default function DeployPanel({ onDeploy }) {
  return (
    <div className="card">
      <h2>Change Deployment</h2>
      <p>CAB approval received. Ready to deploy change.</p>

      <button onClick={onDeploy}>
        Deploy Change
      </button>
    </div>
  );
}
