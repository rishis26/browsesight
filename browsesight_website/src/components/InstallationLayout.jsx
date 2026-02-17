import React from "react";
import { Link } from "react-router-dom";

const InstallationLayout = ({ onImageClick, onDownloadClick }) => {
  const steps = [
    {
      num: "1",
      title: "Download & Unzip",
      desc: "Download the ZIP file from our website and extract it to a folder on your computer.",
      img: "/steps/1.png",
      bgColor: "bg-black",
    },
    {
      num: "2",
      title: "Open Extensions Page",
      desc: "Navigate to chrome://extensions in your Chrome browser.",
      img: "/steps/2.png",
      bgColor: "bg-white",
    },
    {
      num: "3",
      title: "Select Unzipped Folder",
      desc: "Click 'Load unpacked' and select the extracted BrowseSight folder.",
      img: "/steps/3.png",
      bgColor: "bg-white",
    },
    {
      num: "4",
      title: "Extension Loaded",
      desc: "Chrome will show a confirmation popup that the extension has been loaded successfully.",
      img: "/steps/4.png",
      bgColor: "bg-white",
    },
    {
      num: "5",
      title: "Listed in Extensions",
      desc: "BrowseSight now appears in your extensions list and is ready to protect you.",
      img: "/steps/5.png",
      bgColor: "bg-white",
    },
  ];

  return (
    <section
      className="py-24 bg-surface-secondary border-t-2 border-border"
      id="download"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-text-primary mb-6 uppercase tracking-tighter text-center">
            Installation Guide
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-center">
            Follow these steps to install BrowseSight as an unpacked extension.
            Full transparency, zero hidden code.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white border-3 border-border shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <div className="p-4 border-b-2 border-border flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-border bg-primary flex items-center justify-center font-bold text-white text-xl">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-text-primary uppercase tracking-tight text-sm">
                    {step.title}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    {step.desc}
                  </p>
                  <div
                    className={`${step.bgColor} border-2 border-border p-2 cursor-pointer hover:border-primary transition-colors`}
                    onClick={() => onImageClick(step.img, step.title)}
                  >
                    <img src={step.img} alt={step.title} className="w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={onDownloadClick}
              className="inline-block bg-primary hover:bg-white hover:text-primary text-white text-xl font-bold py-5 px-14 border-3 border-border transition-all shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest cursor-pointer"
            >
              Download BrowseSight v2.0
            </button>
            <div className="mt-6">
              <br />
              <Link
                to="/documentation-extension"
                className="inline-block bg-primary hover:bg-white hover:text-primary text-white text-xl font-bold py-1 px-10 border-3 border-border shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none tracking-widest cursor-pointer"
              >
                View Extension Documentation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallationLayout;
