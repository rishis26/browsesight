import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContributorsPage from "./pages/ContributorsPage";
import ExtensionDocsPage from "./pages/ExtensionDocsPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <div className="bg-background min-h-screen text-text-primary font-sans selection:bg-primary selection:text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contributors" element={<ContributorsPage />} />
          <Route
            path="/documentation-extension"
            element={<ExtensionDocsPage />}
          />
          <Route path="/documentation-api" element={<ApiDocsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
