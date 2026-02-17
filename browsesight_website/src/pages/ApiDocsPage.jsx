import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TermSection from "../components/TermSection";

const ApiDocsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              API Documentation
            </h1>
            <p className="text-text-secondary mt-4">
              Technical reference for the BrowseSight security API
            </p>
          </div>

          <div className="space-y-6">
            <TermSection title="Base URL">
              <code className="block bg-surface-primary p-4 border-2 border-border font-mono text-sm">
                https://browsesight-api.vercel.app/
              </code>
            </TermSection>

            <TermSection title="Authentication">
              <p className="mb-4">
                The BrowseSight API is currently open and does not require
                authentication. All endpoints are stateless and privacy-focused.
              </p>
              <p className="text-sm text-text-secondary">
                Note: Rate limiting may apply to prevent abuse.
              </p>
            </TermSection>

            <TermSection title="Endpoints">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-text-primary mb-2 uppercase tracking-wide text-sm">
                    GET /health
                  </h3>
                  <a href="https://browsesight-api.vercel.app/health"
                  className="text-primary font-bold hover:underline"
                  >
                    /health
                  </a>
                  <p className="mb-3">Check API status and uptime</p>
                  <div className="bg-surface-primary p-4 border-2 border-border">
                    <p className="font-mono text-xs mb-2">Response:</p>
                    <pre className="font-mono text-xs overflow-x-auto">{`{
  "status": "healthy",
  "uptime": "99.9%",
  "version": "1.0.0"
}`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-text-primary mb-2 uppercase tracking-wide text-sm">
                    POST /check-url
                  </h3>
                  <a href="https://browsesight-api.vercel.app/check-url"
                  className="text-primary font-bold hover:underline"
                  >
                    /check-url
                  </a>
                  <p className="mb-3">Analyze a URL for security threats</p>
                  <div className="bg-surface-primary p-4 border-2 border-border mb-3">
                    <p className="font-mono text-xs mb-2">Request Body:</p>
                    <pre className="font-mono text-xs overflow-x-auto">{`{
  "url": "https://example.com",
  "context": {
    "referrer": "https://google.com",
    "userAgent": "Mozilla/5.0..."
  }
}`}</pre>
                  </div>
                  <div className="bg-surface-primary p-4 border-2 border-border">
                    <p className="font-mono text-xs mb-2">Response:</p>
                    <pre className="font-mono text-xs overflow-x-auto">{`{
  "trustScore": 85,
  "threats": [],
  "signals": {
    "domainAge": 24,
    "tlsVersion": "1.3",
    "behaviorScore": 92
  },
  "recommendation": "safe"
}`}</pre>
                  </div>
                </div>
              </div>
            </TermSection>

            <TermSection title="Response Codes">
              <ul className="space-y-2 font-mono text-sm">
                <li>
                  <strong>200:</strong> Success
                </li>
                <li>
                  <strong>400:</strong> Bad Request - Invalid parameters
                </li>
                <li>
                  <strong>429:</strong> Too Many Requests - Rate limit exceeded
                </li>
                <li>
                  <strong>500:</strong> Internal Server Error
                </li>
              </ul>
            </TermSection>

            <TermSection title="Privacy & Security">
              <ul className="space-y-2">
                <li>All API requests are encrypted via HTTPS</li>
                <li>No user data is stored or logged</li>
                <li>URLs are analyzed in real-time and not retained</li>
                <li>Stateless architecture ensures privacy</li>
              </ul>
            </TermSection>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApiDocsPage;
