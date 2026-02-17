import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="BrowseSight Logo"
                className="w-6 h-6 shadow-brutal border-2 border-border"
              />
              <span className="font-black text-xl text-text-primary uppercase tracking-tighter">
                BrowseSight
              </span>
            </div>
            <p className="text-xs font-mono text-text-secondary uppercase tracking-widest max-w-xs">
              Direct security. zero bloat. <br /> built for the modern web.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-xs font-bold uppercase tracking-widest">
            <Link
              to="/terms"
              className="text-text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/contributors"
              className="text-text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4"
            >
              Contributors
            </Link>
            <Link
              to="/documentation-extension"
              className="text-text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4"
            >
              Extension Docs
            </Link>
            <Link
              to="/documentation-api"
              className="text-text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4"
            >
              API Docs
            </Link>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono text-text-secondary uppercase">
              © 2026 BrowseSight
            </p>
            <p className="text-[10px] font-bold text-success uppercase tracking-tighter mt-1">
              Status: Operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
