import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TermSection from "../components/TermSection";

const ExtensionDocsPage = () => {
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
              Extension Documentation
            </h1>
            <p className="text-text-secondary mt-4">
              Complete guide to using the BrowseSight browser extension
            </p>
          </div>

          <div className="space-y-6">
            <TermSection title="Installation">
              <p className="mb-4">
                BrowseSight is distributed as an unpacked Chrome extension for
                maximum transparency:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Download the ZIP file from our website</li>
                <li>Extract the contents to a folder on your computer</li>
                <li>
                  Open Chrome and navigate to{" "}
                  <code className="bg-surface-primary px-2 py-1 border border-border">
                    chrome://extensions
                  </code>
                </li>
                <li>Enable "Developer mode" in the top right corner</li>
                <li>Click "Load unpacked" and select the extracted folder</li>
              </ol>
            </TermSection>

            <TermSection title="Features">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Hover-to-Scan
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Instantly scans any link before you click it, keeping you
                    safe from hidden threats.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    AI Security Analysis
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Uses advanced AI to explain why a site is dangerous in plain
                    English, not technical jargon.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Dangerous Site Blocker
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Automatically intercepts malicious links and stops you from
                    visiting sites that steal data.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Scam & Urgency Detection
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Highlights high-pressure selling tactics and fake 'limited
                    time' offers that try to rush you into a mistake.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Secure Form Guard
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Identifies if a login or payment form is insecure before you
                    enter your private information.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Lookalike Domain Protection
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Detects fake websites trying to impersonate brands like
                    Google or Amazon.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Intelligent Warnings
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Provides helpful security alerts for suspicious sites
                    without getting in the way of your browsing.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    URL Unshortening
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Exposes the real destination of hidden links (like bit.ly)
                    to detect threats before you're redirected.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Custom Security Toggles
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Choose which security layers you want active (like Scam
                    Detection or Form Guardian) directly from the popup.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Instant Privacy Protection
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Ensures your scanning data is handled privately and provides
                    instant verification for trusted sites like GitHub.
                  </p>
                </div>
              </div>
            </TermSection>

            <TermSection title="How It Works">
              <p className="mb-4">
                BrowseSight uses a multi-layer security approach:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Observe:</strong> Monitors page behavior, forms, and
                  network requests
                </li>
                <li>
                  <strong>Analyze:</strong> Compares patterns against known
                  phishing techniques
                </li>
                <li>
                  <strong>Calculate:</strong> Generates a trust score based on
                  multiple signals
                </li>
                <li>
                  <strong>Explain:</strong> Shows you exactly why a page is
                  flagged
                </li>
              </ol>
            </TermSection>

            <TermSection title="Extension Settings">
              <p className="mb-4">
                Access settings by clicking the BrowseSight icon in your
                toolbar:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>BrowseSight Shield:</strong> Toggle the entire
                  extension on/off
                </li>
                <li>
                  <strong>Urgency Detection:</strong> Highlights fake "urgent"
                  messages
                </li>
                <li>
                  <strong>Form Guardian:</strong> Flags suspicious login forms
                </li>
                <li>
                  <strong>Force Re-scan:</strong> Manually trigger a new
                  analysis
                </li>
              </ul>
            </TermSection>

            <TermSection title="Permissions">
              <p className="mb-4">
                BrowseSight requires the following permissions:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>activeTab:</strong> To analyze the current page you're
                  viewing
                </li>
                <li>
                  <strong>storage:</strong> To save your preferences locally
                </li>
                <li>
                  <strong>webRequest:</strong> To monitor network requests for
                  suspicious patterns
                </li>
              </ul>
              <p className="mt-4 text-sm">
                All permissions are used exclusively for security analysis. No
                data is sent to third parties.
              </p>
            </TermSection>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExtensionDocsPage;
