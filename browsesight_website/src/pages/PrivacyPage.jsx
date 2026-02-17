import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TermSection from "../components/TermSection";

const PrivacyPage = () => {
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
              Privacy Policy
            </h1>
            <p className="text-text-secondary mt-4 text-sm">
              Last updated: January 26, 2026
            </p>
          </div>

          <div className="space-y-8">
            <TermSection title="[01] INTRODUCTION">
              BrowseSight is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, and safeguard your
              information when you use our browser extension. We operate on a
              privacy-first principle and collect only the minimum data
              necessary for security analysis.
            </TermSection>

            <TermSection title="[02] DATA COLLECTION">
              <div className="space-y-3">
                <p className="font-bold text-text-primary">What We Collect:</p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>
                    <strong>URLs:</strong> Web addresses of pages you visit are
                    analyzed for security threats
                  </li>
                  <li>
                    <strong>Page Metadata:</strong> DOM structure, form
                    elements, and visible page signals
                  </li>
                  <li>
                    <strong>Security Signals:</strong> SSL certificate status,
                    domain age, and behavioral patterns
                  </li>
                </ul>
                <p className="font-bold text-text-primary mt-4">
                  What We DO NOT Collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Personal information (name, email, address)</li>
                  <li>Browsing history or session data</li>
                  <li>Form inputs or passwords</li>
                  <li>Cookies or tracking identifiers</li>
                  <li>Location data</li>
                </ul>
              </div>
            </TermSection>

            <TermSection title="[03] HOW WE USE DATA">
              Data collected by BrowseSight is used exclusively for real-time
              security analysis. URLs are checked against threat databases
              (Google Safe Browsing, VirusTotal) and analyzed using AI models to
              detect phishing and malicious behavior. All analysis is
              stateless—we do not store your browsing history or build user
              profiles.
            </TermSection>

            <TermSection title="[04] DATA SHARING">
              <div className="space-y-3">
                <p>
                  We share minimal data with trusted third-party security
                  services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary mt-2">
                  <li>
                    <strong>Google Safe Browsing API:</strong> URLs are checked
                    against Google's threat database
                  </li>
                  <li>
                    <strong>VirusTotal API:</strong> URLs may be submitted for
                    malware scanning
                  </li>
                  <li>
                    <strong>Groq Cloud:</strong> Page signals are analyzed using
                    AI models for threat detection
                  </li>
                </ul>
                <p className="mt-4 font-bold text-text-primary">We DO NOT:</p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary mt-2">
                  <li>Sell your data to advertisers or third parties</li>
                  <li>Share data with marketing companies</li>
                  <li>Use your data for advertising purposes</li>
                  <li>Track you across websites</li>
                </ul>
              </div>
            </TermSection>

            <TermSection title="[05] DATA STORAGE">
              BrowseSight operates on a stateless architecture. Security checks
              are performed in real-time, and no persistent browsing data is
              stored on our servers. Temporary data used for analysis is
              discarded immediately after processing. We do not maintain logs of
              individual user activity.
            </TermSection>

            <TermSection title="[06] USER RIGHTS">
              You have the right to:
              <ul className="list-disc list-inside space-y-2 text-text-secondary mt-2">
                <li>Disable or uninstall BrowseSight at any time</li>
                <li>
                  Inspect the extension's source code (distributed as unpacked)
                </li>
                <li>Request information about our data practices</li>
                <li>
                  Opt out of specific security checks through extension settings
                </li>
              </ul>
            </TermSection>

            <TermSection title="[07] SECURITY MEASURES">
              We implement industry-standard security measures to protect data
              during transmission and processing. All API communications use
              encrypted HTTPS connections. Our infrastructure is designed to
              minimize data exposure and prevent unauthorized access.
            </TermSection>

            <TermSection title="[08] CHILDREN'S PRIVACY">
              BrowseSight is not directed at children under 13 years of age. We
              do not knowingly collect personal information from children. If
              you believe a child has provided data to BrowseSight, please
              contact us immediately.
            </TermSection>

            <TermSection title="[09] CHANGES TO PRIVACY POLICY">
              We may update this Privacy Policy periodically to reflect changes
              in our practices or legal requirements. Significant changes will
              be communicated through the extension or our website. Continued
              use after changes constitutes acceptance of the updated policy.
            </TermSection>

            <TermSection title="[10] CONTACT INFORMATION">
              For privacy-related questions or concerns, please contact us
              through our GitHub repository at github.com/rishis26. We are
              committed to addressing privacy inquiries promptly and
              transparently.
            </TermSection>

            <div className="mt-12 p-6 bg-surface-primary border-2 border-border shadow-brutal">
              <h3 className="font-bold text-text-primary mb-3 uppercase tracking-wide">
                TRANSPARENCY COMMITMENT
              </h3>
              <p className="text-text-secondary leading-relaxed">
                BrowseSight is distributed as an unpacked extension, allowing
                you to inspect every line of code. We believe in radical
                transparency—you should never have to trust a security tool
                blindly. Our open architecture ensures you can verify our
                privacy claims yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
