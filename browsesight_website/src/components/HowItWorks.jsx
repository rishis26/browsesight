import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      title: "01. Observe",
      desc: "BrowseSight scans visible signals from the page DOM, URL symbols, and script requests in real-time.",
    },
    {
      title: "02. Analyze",
      desc: "Each signal is weighted against known threat patterns to assess behavior intent, not just blocklists.",
    },
    {
      title: "03. Calculate",
      desc: "A final risk score is generated instantly using localized logic — ensuring no data latency.",
    },
    {
      title: "04. Explain",
      desc: "The result is presented with clear, human-readable logic so you know exactly why a warning was triggered.",
    },
  ];

  return (
    <section className="py-24 bg-surface-secondary border-b-2 border-border">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary uppercase tracking-tighter mb-4">
            System Logic
          </h2>
          <div className="w-24 h-2 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border-3 border-border p-8 shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5 transition-all h-full"
            >
              <h3 className="text-4xl font-black text-primary mb-6 italic">
                {step.title.split(".")[0]}
              </h3>
              <h4 className="text-xl font-bold text-text-primary mb-4 uppercase tracking-tight">
                {step.title.split(" ")[1]}
              </h4>
              <p className="text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
