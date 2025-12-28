export default function StatCard({ title, value, description }) {
  return (
    <div className="card stat-card">
      <h4>{title}</h4>
      <div className="stat-value">{value}</div>
      <p>{description}</p>
    </div>
  );
}
