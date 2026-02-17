import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Big Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-black text-text-primary border-8 border-border bg-white inline-block px-12 py-6 shadow-brutal">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="bg-white border-3 border-border p-8 shadow-brutal mb-8">
            <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tighter mb-4">
              Page Not Found
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or the URL might be incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-block bg-primary hover:bg-white hover:text-primary text-white font-bold py-3 px-8 border-2 border-border transition-all shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wide"
              >
                ← Back to Home
              </Link>
              <Link
                to="/documentation-extension"
                className="inline-block bg-white hover:bg-primary hover:text-white text-text-primary font-bold py-3 px-8 border-2 border-border transition-all shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wide"
              >
                View Documentation
              </Link>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="bg-surface-primary border-2 border-border p-6">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">
              Helpful Links
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/terms"
                className="text-primary hover:underline font-bold"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/contributors"
                className="text-primary hover:underline font-bold"
              >
                Contributors
              </Link>
              <Link
                to="/documentation-api"
                className="text-primary hover:underline font-bold"
              >
                API Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
