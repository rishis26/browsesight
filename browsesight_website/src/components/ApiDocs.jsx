import React from "react";
import { Link } from "react-router-dom";

const ApiDocs = () => {
  const endpoints = [
    {
      title: "Health Check",
      image: "/api-health-route.png",
      description: "Verify API status",
    },
    {
      title: "Home Route",
      image: "/api-home-route.png",
      description: "API documentation",
    },
    {
      title: "Check URL",
      image: "/api-check-url-route.png",
      description: "Analyze URLs for threats",
    },
  ];

  return (
    <section className="py-24 bg-white border-b-2 border-border">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary uppercase tracking-tighter mb-4">
            API Documentation
          </h2>
          <div className="w-24 h-2 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {endpoints.map((endpoint, idx) => (
            <div
              key={idx}
              className="bg-surface-primary border-2 border-border shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <div className="p-4 border-b-2 border-border bg-white">
                <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">
                  {endpoint.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {endpoint.description}
                </p>
              </div>
              <div className="p-3">
                <img
                  src={endpoint.image}
                  alt={endpoint.title}
                  className="w-full border border-border"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://browsesight-api.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white hover:bg-white hover:text-black text-xl font-bold py-3 px-10 border-3 border-border shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest cursor-pointer mb-6"
          >
            Open API Playground ↗
          </a>
          <br />
          <Link
            to="/documentation-api"
            className="inline-block bg-primary hover:bg-white hover:text-primary text-white text-xl font-bold py-3 px-10 border-3 border-border shadow-brutal hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none tracking-widest cursor-pointer"
          >
            View API Documentation →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ApiDocs;
