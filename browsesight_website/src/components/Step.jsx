function Step({ number, title, description }) {
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <span className="timeline-number">{number}</span>
        <div className="timeline-pulse"></div>
      </div>
      <div className="timeline-content">
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-description">{description}</p>
      </div>
    </div>
  );
}

export default Step;