function UsageCard({ number, title, description }) {
  return (
    <div className="usage-card">
      <div className="usage-number">{number}</div>
      <h3 className="usage-title">{title}</h3>
      <p className="usage-description">{description}</p>
      <div className="usage-arrow">→</div>
    </div>
  );
}

export default UsageCard;