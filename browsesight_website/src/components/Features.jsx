import React from "react";
// motion removed as it was unused
import SpotlightCard from "./SpotlightCard";

const Features = () => {
  const features = [
    {
      title: "AI Threat Intelligence",
      description:
        "Powered by Llama 3.3 and Groq, we analyze context and intent, not just blocklists.",
      icon: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Anti-Phishing",
      description:
        "Detects fake login forms and credential harvesters instantly.",
      icon: (
        <svg
          className="w-8 h-8 text-danger"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      title: "Typosquatting Detection",
      description:
        "Identifies lookalike domains (e.g., g0ogle.com instead of google.com).",
      icon: (
        <svg
          className="w-8 h-8 text-warning"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
    },
    {
      title: "URL Unshortening",
      description:
        "Automatically expands bit.ly and t.co links to reveal their true destination.",
      icon: (
        <svg
          className="w-8 h-8 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-background relative z-10" id="features">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Military-grade <span className="text-primary">Protection.</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg">
            We don't just check a list. We analyze behavior, code integrity, and
            domain reputation in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <SpotlightCard
              key={idx}
              className="bg-surface border border-glass-border rounded-xl p-8 hover:border-primary/50 transition-colors h-full flex flex-col"
            >
              <div className="mb-6 p-4 bg-surface-highlight w-fit rounded-lg border border-glass-border">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-display text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
