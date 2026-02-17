import React from "react";

const Permissions = () => {
  const items = [
    "No blanket website access",
    "No page content modification",
    "No background data collection",
    "Stateless requests only",
    "Source code transparent",
  ];

  return (
    <section className="py-24 bg-surface-secondary border-b-2 border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-text-primary mb-6 uppercase tracking-tighter">
              Trust & <br />
              <span className="text-primary italic">Transparency</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed border-l-4 border-border pl-6">
              We designed BrowseSight to be a security tool, not a data
              harvester. We verify signals without compromising your identity.
            </p>
          </div>

          <div className="md:w-1/2 w-full space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-border p-5 flex items-center gap-4 hover:border-primary group transition-colors shadow-brutal hover:shadow-brutal-hover translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0"
              >
                <div className="w-6 h-6 border-2 border-border flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary">
                  <svg
                    className="w-3 h-3 text-primary group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-bold text-sm text-text-primary uppercase tracking-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Permissions;
