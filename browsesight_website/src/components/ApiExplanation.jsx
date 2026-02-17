import React from "react";

const ApiExplanation = () => {
  return (
    <section className="py-24 bg-white" id="api">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="relative bg-surface rounded-panel border border-border shadow-inner p-8">
              {/* Diagram */}
              <div className="flex items-center justify-between text-center relative z-10">
                <div className="p-4 bg-white rounded-lg shadow-panel border border-border">
                  <div className="w-10 h-10 mx-auto mb-2 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-text-main text-sm">You</p>
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-32 flex items-center justify-center relative">
                  <div className="w-full h-0.5 bg-border absolute top-1/2 -translate-y-1/2 z-0"></div>
                  <div className="relative z-10 bg-surface px-2">
                    <div className="px-3 py-1 rounded-full bg-white border border-border text-xs font-mono text-text-secondary shadow-sm">
                      Analyzed Signals
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-panel border border-border">
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-text-main text-sm">
                    BrowseSight API
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-dashed border-border/60">
                <h4 className="font-bold text-text-main mb-4 text-sm uppercase tracking-wide">
                  Analysis Engine
                </h4>
                <div className="space-y-3">
                  <ProcessingStep text="1. Receive page signals (URL, DOM structure, forms)" />
                  <ProcessingStep text="2. Cross-reference threat intel (Google Safe Browsing, VirusTotal)" />
                  <ProcessingStep text="3. Analyze heuristics with AI (Context & Intent)" />
                  <ProcessingStep text="4. Return safety score & human-readable explanation" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <span className="text-primary font-bold tracking-wider text-xs uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Backend Logic
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-4 mb-6">
              A control center for
              <br />
              web safety.
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              The BrowseSight API acts as a secure analysis engine. It processes
              risk signals in real-time without storing your personal browsing
              history.
            </p>
            <ul className="space-y-4">
              <PrincipleItem
                title="Minimal Data Exchange"
                desc="We only send what's necessary to verify safety."
              />
              <PrincipleItem
                title="Stateless Analysis"
                desc="Your request is processed and forgotten. We don't build user profiles."
              />
              <PrincipleItem
                title="Explainable AI"
                desc="Our logic converts complex threat data into simple English."
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessingStep = ({ text }) => (
  <div className="flex items-center gap-3 text-sm text-text-secondary">
    <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
    {text}
  </div>
);

const PrincipleItem = ({ title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
      <svg
        className="w-3 h-3 text-primary"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div>
      <h4 className="font-bold text-text-main text-sm">{title}</h4>
      <p className="text-sm text-text-secondary">{desc}</p>
    </div>
  </div>
);

export default ApiExplanation;
