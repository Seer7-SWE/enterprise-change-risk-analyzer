export default function BlastRadiusList({ services }) {
  return (
    <div className="card">
      <h3>Blast Radius</h3>
      <ul className="blast-list">
        {services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="hint">
        Services likely affected if this change fails.
      </p>
    </div>
  );
}
