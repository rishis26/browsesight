import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TermSection from "../components/TermSection";

const TermsPage = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-text-secondary mt-4 text-sm">
              Last updated: January 26, 2026
            </p>
          </div>

          <div className="space-y-8">
            <TermSection title="[01] ACCEPTANCE OF TERMS">
              By downloading, installing, or using BrowseSight, you agree to be
              bound by these Terms and Conditions. If you do not agree to these
              terms, do not use this extension. These terms constitute a legally
              binding agreement between you and BrowseSight.
            </TermSection>

            <TermSection title="[02] SERVICE DESCRIPTION">
              BrowseSight is a browser security extension designed to detect
              phishing attempts, malicious links, and suspicious web behavior.
              The extension analyzes page signals in real-time and provides
              security assessments. BrowseSight is provided "as-is" without
              warranties of any kind.
            </TermSection>

            <TermSection title="[03] USER RESPONSIBILITIES">
              You acknowledge that BrowseSight is a security assistance tool,
              not a guarantee of absolute protection. You remain solely
              responsible for your browsing decisions and online safety. No
              security tool can provide 100% protection against all threats. You
              agree to use BrowseSight as one component of a comprehensive
              security strategy.
            </TermSection>

            <TermSection title="[04] LIMITATION OF LIABILITY">
              BrowseSight and its developers shall not be liable for any direct,
              indirect, incidental, special, consequential, or exemplary damages
              resulting from your use or inability to use the extension. This
              includes, but is not limited to, damages for loss of data,
              business interruption, or security breaches that occur despite
              using BrowseSight.
            </TermSection>

            <TermSection title="[05] NO WARRANTY">
              BrowseSight is provided without warranty of any kind, either
              express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement. We do not guarantee that the extension will be
              error-free, uninterrupted, or free from harmful components.
            </TermSection>

            <TermSection title="[06] MODIFICATIONS TO SERVICE">
              We reserve the right to modify, suspend, or discontinue
              BrowseSight at any time without prior notice. We may also update
              these Terms and Conditions periodically. Continued use of the
              extension after changes constitutes acceptance of the modified
              terms.
            </TermSection>

            <TermSection title="[07] INTELLECTUAL PROPERTY">
              BrowseSight and all associated intellectual property rights remain
              the property of its developers. The extension is distributed as
              open-source software for transparency purposes. You may inspect
              the code but may not redistribute modified versions under the
              BrowseSight name without permission.
            </TermSection>

            <TermSection title="[08] GOVERNING LAW">
              These Terms shall be governed by and construed in accordance with
              applicable laws. Any disputes arising from these terms or your use
              of BrowseSight shall be resolved through binding arbitration.
            </TermSection>

            <TermSection title="[09] CONTACT">
              For questions regarding these Terms and Conditions, please contact
              us through our GitHub repository at github.com/rishis26.
            </TermSection>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
