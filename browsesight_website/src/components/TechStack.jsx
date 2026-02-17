import React from "react";

const TechStack = () => {
  const stack = [
    { name: "React", category: "Frontend", color: "#61DAFB" },
    { name: "TailwindCSS", category: "Styling", color: "#38B2AC" },
    { name: "Framer Motion", category: "Animation", color: "#E10098" },
    { name: "Express", category: "Server", color: "#000000" },
    { name: "Groq Cloud", category: "AI Inference", color: "#F55036" },
    { name: "Llama 3.3", category: "LLM", color: "#004166" },
    { name: "Google Safe Browsing", category: "API", color: "#4285F4" },
    { name: "VirusTotal", category: "API", color: "#394EFF" },
  ];

  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-primary font-bold tracking-wider text-xs uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 block w-fit mb-3">
              Under the Hood
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-main">
              Built with Modern Tech
            </h2>
          </div>
          <p className="text-text-secondary max-w-md text-sm md:text-right leading-relaxed">
            We use a cutting-edge stack to ensure millisecond-latency detection
            without compromising privacy.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stack.map((tech, idx) => (
            <div
              key={idx}
              className="p-5 rounded-panel bg-white border border-border shadow-panel hover:shadow-panel-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="text-xs font-mono text-text-secondary uppercase">
                  {tech.category}
                </span>
              </div>

              <h3 className="font-bold text-lg text-text-main mt-auto">
                {tech.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
