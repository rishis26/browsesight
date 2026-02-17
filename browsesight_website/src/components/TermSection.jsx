import React from "react";

const TermSection = ({ title, children }) => {
  return (
    <div className="bg-white border-2 border-border p-6 shadow-brutal">
      <h2 className="text-lg font-bold text-text-primary mb-4 uppercase tracking-wide">
        {title}
      </h2>
      <div className="text-text-secondary leading-relaxed">{children}</div>
    </div>
  );
};

export default TermSection;
