import React from "react";
import { Link } from "react-router-dom";

const TermsModal = ({ onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-border shadow-brutal w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-border bg-white flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tighter">
            Terms & Conditions
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-primary">
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p className="font-bold text-text-primary">
              By downloading BrowseSight, you agree to the following:
            </p>

            <div>
              <p className="font-bold text-text-primary mb-1">
                1. Service Description
              </p>
              <p>
                BrowseSight is a security assistance tool provided "as-is"
                without warranties. It analyzes page signals to detect threats
                but cannot guarantee 100% protection.
              </p>
            </div>

            <div>
              <p className="font-bold text-text-primary mb-1">
                2. User Responsibility
              </p>
              <p>
                You remain solely responsible for your browsing decisions and
                online safety. BrowseSight is one component of a comprehensive
                security strategy.
              </p>
            </div>

            <div>
              <p className="font-bold text-text-primary mb-1">
                3. Limitation of Liability
              </p>
              <p>
                BrowseSight and its developers shall not be liable for any
                damages resulting from your use of the extension, including data
                loss or security breaches.
              </p>
            </div>

            <div>
              <p className="font-bold text-text-primary mb-1">4. Privacy</p>
              <p>
                We collect minimal data (URLs, page metadata) for security
                analysis only. We do not store browsing history or build user
                profiles. All analysis is stateless.
              </p>
            </div>

            <div>
              <p className="font-bold text-text-primary mb-1">5. Open Source</p>
              <p>
                BrowseSight is distributed as an unpacked extension for full
                transparency. You may inspect the code but may not redistribute
                modified versions under the BrowseSight name.
              </p>
            </div>

            <p className="text-xs mt-4 pt-4 border-t border-border">
              For full terms, visit{" "}
              <Link to="/terms" className="text-primary underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t-2 border-border bg-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-border bg-white text-text-primary font-bold uppercase tracking-wide hover:bg-surface-primary transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 bg-primary text-white font-bold uppercase tracking-wide border-2 border-border shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm md:text-base"
            >
              I Understand and Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
