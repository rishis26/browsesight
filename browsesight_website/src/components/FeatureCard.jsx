import SpotlightCard from "./SpotlightCard";

function FeatureCard({ icon, title, description }) {
  return (
    <SpotlightCard className="feature-card">
      <div className="feature-content">
        <img src={icon} alt={title} className="feature-icon" />
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    </SpotlightCard>
  );
}

export default FeatureCard;
