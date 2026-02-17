import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="BrowseSight Logo"
            className="w-8 h-8 border-2 border-border"
          />
          <span className="font-sans font-bold text-lg text-text-primary uppercase tracking-tight">
            BrowseSight
          </span>
        </Link>
        <div>
          <a
            href="/Browsesight.zip"
            download
            className="text-sm font-bold text-primary hover:text-white hover:bg-primary transition-colors border-2 border-primary px-4 py-2 uppercase tracking-widest"
          >
            Download v2.1.2
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
