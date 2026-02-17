import React from "react";

const Hero = ({ onDownloadClick }) => {
  return (
    <section className="pt-20 pb-24 bg-white border-b-2 border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            {/* Logo and Branding */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/logo.png"
                alt="BrowseSight Logo"
                className="w-16 h-16 border-3 border-border"
              />

              <span className="font-sans font-bold text-2xl text-text-primary uppercase tracking-tight">
                BrowseSight
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight tracking-tight">
              Real security. <br />
              <span className="text-primary underline decoration-4 underline-offset-8">
                No guesswork.
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-xl">
              BrowseSight detects phishing, fake logins, and malicious links by
              analyzing how a page behaves — not just where it's hosted.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <button
                onClick={onDownloadClick}
                className="bg-primary hover:bg-white hover:text-primary text-white text-lg font-bold py-4 px-10 border-2 border-border transition-all shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wide cursor-pointer"
              >
                Download for Web Browser
              </button>
              <a
                href="#download"
                className="bg-white hover:bg-surface-primary text-text-primary text-lg font-bold py-4 px-10 border-2 border-border transition-all shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wide cursor-pointer text-center"
              >
                Installation Guide
              </a>
            </div>
            <br />
            <div className="flex flex-col justify-center h-full pt-4">
              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest leading-relaxed">
                • No ads
                <br />
                • No tracking
                <br />
                • No forced blocking
                <br />
                • Open source
                <br />
                • Privacy-first design
                <br />• Real-time analysis
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="max-w-sm w-full">
              <img
                src="/extention.png"
                alt="BrowseSight Extension Interface"
                className="w-full border-3 border-border shadow-brutal"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
