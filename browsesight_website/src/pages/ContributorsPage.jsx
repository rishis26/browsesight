import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const ContributorsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contributors = [
    {
      name: "Rishi Shah",
      role: "Lead Developer",
      github: "https://github.com/rishis26",
      description:
        "Full-stack developer and security enthusiast. Built the core extension logic and backend API.",
    },
    {
      name: "Ananya Srivastava",
      role: "Co-Developer",
      github: "https://github.com/Ananya-020",
      description:
        "Frontend specialist and UX designer. Created the user interface and security visualization components.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow pt-12 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12">
            <Link
              to="/"
              className="text-primary font-bold hover:underline mb-8 inline-block uppercase tracking-widest text-xs"
            >
              ← BACK TO HOME
            </Link>
            <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter border-b-4 border-primary pb-4">
              Contributors
            </h1>
            <p className="text-text-secondary mt-4">
              The team behind BrowseSight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contributors.map((contributor, idx) => (
              <div
                key={idx}
                className="bg-white border-3 border-border p-8 shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight mb-2">
                    {contributor.name}
                  </h2>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">
                    {contributor.role}
                  </p>
                </div>

                <p className="text-text-secondary leading-relaxed mb-6">
                  {contributor.description}
                </p>

                <a
                  href={contributor.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-text-primary font-bold text-sm border-2 border-border px-4 py-2 hover:bg-primary hover:text-white transition-colors uppercase tracking-wide"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContributorsPage;
