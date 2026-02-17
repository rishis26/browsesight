import React from "react";

const Comparison = () => {
  const rows = [
    ["Blocklists only", "Behavior-based analysis"],
    ["Silent decisions", "Clear explanations"],
    ["Forced blocking", "User-controlled actions"],
    ["Closed logic", "Transparent signals"],
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-text-primary mb-12 uppercase tracking-tighter text-center">
          Compare Methodology
        </h2>

        <div className="border-3 border-border overflow-hidden shadow-brutal">
          <div className="grid grid-cols-2 border-b-3 border-border bg-surface-primary font-bold uppercase tracking-widest text-xs">
            <div className="p-6 border-r-3 border-border text-text-secondary">
              Traditional Tools
            </div>
            <div className="p-6 text-primary">BrowseSight</div>
          </div>
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-2 ${idx !== rows.length - 1 ? "border-b-2 border-border" : ""}`}
            >
              <div className="p-6 border-r-2 border-border text-text-secondary border-dashed">
                {row[0]}
              </div>
              <div className="p-6 text-text-primary font-bold">{row[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Comparison;
