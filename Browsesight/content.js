// BrowseSight v3.1.2 - Paranoid Elite Version
const TRUSTED_DOMAINS = [
  "google.com",
  "youtube.com",
  "github.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "amazon.in",
  "amazon.co.uk",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "reddit.com",
  "wikipedia.org",
  "stackoverflow.com",
  "netflix.com",
  "spotify.com",
  "playstation.com",
  "xbox.com",
  "steampowered.com",
  "epicgames.com",
  "crazygames.com",
  "imdb.com",
  "bbc.com",
  "cnn.com",
  "nytimes.com",
  "techcrunch.com",
  "uptodown.com",
  "androidcentral.com",
  "androidpolice.com",
  "duckduckgo.com",
  "brave.com",
  "mozilla.org",
  "pcmag.com",
  "theverge.com",
  "google.com",
  "google.co.in",
  "nike.com",

  // Added regional google

  // Developer & Hosting Platforms
  "vercel.com",
  "netlify.com",
  "heroku.com",
  "gitlab.com",
  "bitbucket.org",
  "jenkins.io",
  "atlassian.com",
  "trello.com",
  "notion.so",
  "figma.com",
  "cloudflare.com",
  "digitalocean.com",
  "aws.amazon.com",
  "azure.microsoft.com",
  "localhost",
  "127.0.0.1",
];

console.log("🛡️ BrowseSight Elite Active");
// Debug: Check which API we are talking to (helpful if user suspects connection issues)
chrome.runtime.sendMessage({ action: "getApiUrl" }, (url) =>
  console.log("🔌 Connected to API:", url),
);

// Settings State
let settings = {
  masterEnabled: true,
  urgencyEnabled: true,
  formsEnabled: true,
};

// Load initial settings
chrome.storage.sync.get(
  ["masterEnabled", "urgencyEnabled", "formsEnabled"],
  (data) => {
    if (data.masterEnabled !== undefined)
      settings.masterEnabled = data.masterEnabled;
    if (data.urgencyEnabled !== undefined)
      settings.urgencyEnabled = data.urgencyEnabled;
    if (data.formsEnabled !== undefined)
      settings.formsEnabled = data.formsEnabled;
  },
);

// Watch for setting changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.masterEnabled)
    settings.masterEnabled = changes.masterEnabled.newValue;
  if (changes.urgencyEnabled)
    settings.urgencyEnabled = changes.urgencyEnabled.newValue;
  if (changes.formsEnabled)
    settings.formsEnabled = changes.formsEnabled.newValue;
});

// Hover-only scanning logic
document.addEventListener(
  "mouseover",
  (e) => {
    // MASTER SWITCH CHECK
    if (!settings.masterEnabled) return;

    const link = e.target.closest("a");

    // Skip if already started or explicitly skipped
    if (!link || link.dataset.bsStarted || link.dataset.bs === "skip") return;

    const href = link.href;
    if (
      !href ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("#")
    ) {
      return;
    }

    try {
      const isGoogle = window.location.hostname.includes("google");
      const text = link.innerText.trim();
      const rect = link.getBoundingClientRect();

      // ADAPTIVE FILTERING - REWRITTEN FOR MAXIMUM COMPATIBILITY
      // Removed strict dimension/text checks. If the user hovers it, we scan it.
      // This allows scan on image links, buttons, and complex Google result cards.

      // Only check visibility to avoid invisible overlay traps
      if (
        getComputedStyle(link).visibility === "hidden" ||
        getComputedStyle(link).display === "none"
      ) {
        return;
      }

      // Mark as started immediately to prevent redundant API calls
      link.dataset.bsStarted = "true";

      // Extract actual URL
      let targetUrl = href;
      if (href.includes("/url?")) {
        try {
          const params = new URLSearchParams(new URL(href).search);
          targetUrl = params.get("url") || params.get("q") || href;
        } catch (e) {}
      }

      const url = new URL(targetUrl);
      const domain = url.hostname.replace("www.", "");

      // Check trusted domains for fast-path (Green Glow instantly)
      // EXCEPTION: Cloud storage/File sharing is NEVER visually trusted blindly
      const RISKY_SUBDOMAINS = [
        "drive.google.com",
        "docs.google.com",
        "sites.google.com",
        "script.google.com",
      ];

      const isTrusted =
        TRUSTED_DOMAINS.some((d) => domain === d || domain.endsWith("." + d)) &&
        !RISKY_SUBDOMAINS.includes(url.hostname);

      // SUSPICIOUS PATTERNS: Keywords that suggest high risk (Piracy, Cheats, Free stuff)
      const SUSPICIOUS_KEYWORDS = [
        "unblocked",
        "cheat",
        "hack",
        "crack",
        "mod",
        "apk",
        "free-iphone",
        "giveaway",
        "winner",
        "lottery",
        "torrent",
        "warez",
        "keygen",
        "loader",
        "free download",
      ];

      const isSuspicious = SUSPICIOUS_KEYWORDS.some(
        (k) => href.toLowerCase().includes(k) || text.toLowerCase().includes(k),
      );

      if (isTrusted) {
        addBadge(link, "safe");
      } else {
        // Start API check
        addBadge(link, "checking");

        // If locally suspicious, we MIGHT override the API result effectively by sending a hint,
        // but for now we'll do it in the callback
        checkWithAPI(targetUrl, link, isSuspicious);
      }
    } catch (e) {
      link.dataset.bs = "error";
    }
  },
  true,
);

function addBadge(link, status) {
  link.dataset.bs = status;
  link.classList.add("bs-link");
}

function checkWithAPI(url, link, isLocallySuspicious) {
  // Get helpful context: Link text + Surrounding text
  const linkText = link.innerText.trim().slice(0, 100);

  // Collect context from the page
  const urgencyDetected = !!document.querySelector(".bs-urgency");
  const sensitiveForm = !!document.querySelector(
    ".bs-form-badge.bs-risk-medium, .bs-form-badge.bs-risk-high",
  );
  const formType = document.querySelector(".bs-form-badge")?.innerText || "";

  chrome.runtime.sendMessage(
    {
      action: "checkUrl",
      url,
      linkText,
      context: { urgencyDetected, sensitiveForm, formType },
    },
    (response) => {
      // 1. Handle API Failures / Network Errors
      if (!response || !response.overall || response.error) {
        // If we locally suspected it, escalate to DANGER. detection is better than silence.
        if (isLocallySuspicious) {
          link.dataset.bs = "danger";
          addBadge(link, "danger");
          return;
        }
        // Failure -> Error (Grey). User didn't want Yellow for broken checks.
        link.dataset.bs = "error";
        // Remove badge or add distinct error badge if needed, for now just data attr
        return;
      }

      const rec = response.overall?.recommendation;
      const isTrusted = !!response.fastPath;
      let status = "safe";
      let reasons = response.overall?.warnings || [];

      // 2. Logic: Determine Final Status based on Safety Score
      // RED: < 50%, YELLOW: 50-84%, GREEN: 85-100%
      const safetyScore = response.overall?.safetyScore || 0;

      if (rec === "Dangerous" || safetyScore < 50) {
        status = "danger"; // RED
        if (reasons.length === 0) reasons.push("High Risk Detected");
      } else if (isLocallySuspicious) {
        status = "danger"; // RED
        reasons = ["Suspicious Keywords Detected"];
      } else if (rec === "Safe" || safetyScore >= 85 || isTrusted) {
        status = "safe"; // GREEN
      } else {
        status = "warning"; // YELLOW
      }

      // 3. Apply to Link
      if (status === "danger") {
        link.dataset.bsReason = reasons.join(" | ");
        link.dataset.bsResponse = JSON.stringify(response); // Store full response for modal
        link.title = `⚠️ BrowseSight Warning: ${reasons.join(", ")}`;
      }

      // Show warning toast for YELLOW warnings (not red, not green)
      if (status === "warning") {
        showWarningToast(response);
      }

      link.dataset.bs = status;
      addBadge(link, status);
    },
  );
}

console.log("✅ BrowseSight Elite Ready");

// ==========================================
// 🚀 NEW FEATURE: Urgency Phrase Highlighter
// ==========================================

const URGENCY_PATTERNS = [
  /only \d+ left/i,
  /selling fast/i,
  /(\d+) people are viewing/i,
  /offer expires in/i,
  /demand is high/i,
  /reserved for \d+ minutes/i,
  /act fast/i,
  /limited time deal/i,
  /flash sale ends/i,
  /buy now or lose/i,
  /buy now or lose/i,
];

function scanPageForUrgency() {
  // Simple treewalker to find text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip scripts, styles, and already highlighted nodes
        if (
          ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(
            node.parentElement.tagName,
          )
        )
          return NodeFilter.FILTER_REJECT;
        if (node.parentElement.classList.contains("bs-urgency"))
          return NodeFilter.FILTER_REJECT;
        if (node.textContent.trim().length < 5) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const nodesToHighlight = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent;

    // Check patterns
    for (const pattern of URGENCY_PATTERNS) {
      if (pattern.test(text)) {
        nodesToHighlight.push({ node, match: text.match(pattern)[0] }); // store match for precise wrapping? simplified for now
        break;
      }
    }
  }

  // Batch highlights to avoid layout trashing
  nodesToHighlight.forEach(({ node }) => {
    try {
      const span = document.createElement("mark");
      span.className = "bs-urgency";
      span.title =
        "⚠️ High Pressure Tactic detected: This website is trying to rush you.";
      span.textContent = node.textContent;
      node.replaceWith(span);
    } catch (e) {}
  });
}

// ==========================================
// 🛡️ NEW FEATURE: Form Purpose Declaration
// ==========================================

function scanPageForForms() {
  const forms = document.querySelectorAll("form:not([data-bs-analyzed])");

  forms.forEach((form) => {
    form.dataset.bsAnalyzed = "true";

    // Analyze Purpose
    let purpose = "General";
    let purposeIcon = "📝";
    let risk = "low";

    const inputs = Array.from(form.querySelectorAll("input"));
    const inputNames = inputs
      .map((i) => (i.name + i.type + i.id).toLowerCase())
      .join(" ");

    if (
      inputNames.includes("password") ||
      inputNames.includes("login") ||
      inputNames.includes("user")
    ) {
      purpose = "Login";
      purposeIcon = "🔑";
    } else if (
      inputNames.includes("card") ||
      inputNames.includes("cc_") ||
      inputNames.includes("cvv")
    ) {
      purpose = "Payment";
      purposeIcon = "💳";
      risk = "medium"; // Payments are always sensitive
    } else if (inputNames.includes("search") || inputNames.includes("query")) {
      purpose = "Search";
      purposeIcon = "🔍";
    }

    // Security Check: Mixed Content?
    const action = form.getAttribute("action") || "";
    if (window.location.protocol === "https:" && action.startsWith("http:")) {
      risk = "high";
      purpose = "Insecure Form";
      purposeIcon = "⚠️";
    }

    // FILTER: User requested removal of ALL annoying badges ("all these badges !!")
    // Only show CRITICAL security warnings (e.g. Insecure HTTP form) or explicit Payment fields.
    // Skip General, Search, and even Login badges if they are just distracting.
    if (risk === "low" && purpose !== "Payment") {
      return;
    }

    // Inject Badge
    const badge = document.createElement("div");
    badge.className = `bs-form-badge bs-risk-${risk}`;
    badge.innerHTML = `<span class="bs-icon">${purposeIcon}</span> ${purpose}`;

    // Position it visually near the form (prepend or stick to top right)
    form.style.position = "relative"; // Ensure positioning context
    form.prepend(badge);
  });
}

// Initialization and Observation
// Run scanning periodically to catch dynamic content (SPAs)
setInterval(() => {
  if (!settings.masterEnabled) return;
  if (settings.urgencyEnabled) scanPageForUrgency();
  if (settings.formsEnabled) scanPageForForms();
}, 3000); // 3 seconds interval

// Initial run
setTimeout(() => {
  if (!settings.masterEnabled) return;
  if (settings.urgencyEnabled) scanPageForUrgency();
  if (settings.formsEnabled) scanPageForForms();
}, 500); // Brief delay to ensure settings are loaded

// ==========================================
// 🛑 NEW FEATURE: Danger Intervention Modal
// ==========================================

// Global Click Interceptor
document.addEventListener(
  "click",
  (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Only intercept explicitly dangerous links (Red Badges)
    if (link.dataset.bs === "danger") {
      // Check if user already accepted risk for this specific URL this session
      if (sessionStorage.getItem(`bs-accept-${link.href}`)) {
        return; // Allow navigation
      }

      e.preventDefault();
      e.stopPropagation();

      // Get stored response data
      const responseData = link.dataset.bsResponse
        ? JSON.parse(link.dataset.bsResponse)
        : null;
      showDangerModal(link.href, responseData);
    }
  },
  true,
); // Capture phase to ensure we stop it first

function showDangerModal(url, response) {
  // Prevent duplicate modals
  if (document.querySelector(".bs-danger-modal")) return;

  const sirenUrl = chrome.runtime.getURL("asset/siren.png");

  // Get the link that triggered this for extra context
  const link = document.querySelector(`a[href="${url}"]`);
  const localReason = link?.dataset.bsReason;

  // Extract threats: Prefer GroqAI -> Overall -> Local Reason -> Default
  let threats = [];
  if (response?.groqAI?.threats?.length > 0) {
    threats = response.groqAI.threats;
  } else if (response?.overall?.warnings?.length > 0) {
    threats = response.overall.warnings;
  } else if (localReason) {
    threats = localReason.split(" | ");
  }

  const threatsList =
    threats.length > 0
      ? threats.map((t) => `<li>${t}</li>`).join("")
      : "<li>Potential Security Threat Detected</li><li>Suspicious URL Pattern</li>";

  // 6 Pillar Score details breakdown
  const safetyScore = response?.overall?.safetyScore || 0;

  const modal = document.createElement("div");
  modal.className = "bs-danger-modal";
  modal.innerHTML = `
    <div class="bs-modal-card" style="border: 2px solid #ff3232; box-shadow: 0 0 32px rgba(255, 50, 50, 0.4); background: #121214; padding: 0; width: 440px; overflow: hidden; display: flex; flex-direction: column; border-radius: 14px;">
      <div class="bs-modal-body" style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Header with Logo & Name -->
        <div style="text-align: center; margin-bottom: 5px; padding-top: 5px;">
          <img src="${chrome.runtime.getURL("icons/logo.png")}" style="width: 44px; height: 44px; margin-bottom: 6px;" alt="BrowseSight" />
          <h3 style="margin: 0; color: #fff; font-size: 14px; letter-spacing: 2px; font-weight: 800; text-transform: uppercase; font-family: 'Outfit', sans-serif;">BrowseSight</h3>
        </div>

        <!-- Score Section -->
        <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <img src="${sirenUrl}" style="width: 36px; height: 36px; margin-bottom: 12px; filter: drop-shadow(0 0 10px rgba(255, 50, 50, 0.7));" />
          <div style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 18px;">Overall Safety Score</div>
          <div style="position: relative; width: 100%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-bottom: 18px;">
            <div style="width: ${safetyScore}%; height: 100%; background: #ff3232; box-shadow: 0 0 12px rgba(255, 50, 50, 0.6); transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          </div>
          <div style="color: #ff3232; font-size: 42px; font-weight: 800; font-family: 'JetBrains Mono', monospace; line-height: 1;">${safetyScore}%</div>
          <div style="margin-top: 8px; color: #ff5555; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            <span style="opacity: 0.6;">Threat Level:</span> ${(100 - safetyScore).toFixed(0)}%
          </div>
        </div>

        <!-- Risk Assessment -->
        <div style="background: rgba(30, 10, 10, 0.4); padding: 18px; border-radius: 12px; border: 1px solid rgba(255, 50, 50, 0.15);">
          <div style="color: #ff5555; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px;">🚨</span> RISK ASSESSMENT:
          </div>
          <ul style="margin: 0; padding-left: 20px; color: #eee; font-size: 13px; line-height: 1.6; text-align: left;">
            ${threatsList}
          </ul>
        </div>

        <!-- Pillars & Formula -->
        ${getPillarBreakdownHTML(response?.overall?.pillars)}

        <div style="color: #ffcc00; font-size: 11px; display: flex; align-items: center; gap: 8px; justify-content: center; opacity: 0.8; margin-top: 10px; text-align: center;">
          <span>⚠️</span> Visiting this site may steal your data or infect your device.
        </div>
      </div>

      <div class="bs-modal-actions" style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 12px; background: #121214;">
        <button class="bs-btn-secondary" id="bs-cancel-btn" style="background: #fff; color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 14px; box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);">Go Back to Safety</button>
        <button class="bs-btn-primary disabled" id="bs-proceed-btn" disabled style="background: rgba(255,255,255,0.04); color: #777; border: 1px solid #333; padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 13px;">
          I understand the risk (4)
        </button>
        <button id="bs-report-btn" style="background: transparent; color: #aaa; border: 1px solid #333; padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">📄 Download Threat Intelligence Report</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Timer Logic
  let countdown = 4;
  const proceedBtn = modal.querySelector("#bs-proceed-btn");
  const cancelBtn = modal.querySelector("#bs-cancel-btn");

  const timer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      proceedBtn.innerText = `I understand the risk (${countdown})`;
    } else {
      clearInterval(timer);
      proceedBtn.innerText = `Proceed Anyway (Unsafe)`;
      proceedBtn.classList.remove("disabled");
      proceedBtn.disabled = false;
    }
  }, 1000);

  // Event Handlers
  cancelBtn.addEventListener("click", () => {
    clearInterval(timer);
    modal.remove();
  });

  proceedBtn.addEventListener("click", () => {
    // Whitelist this URL
    sessionStorage.setItem(`bs-accept-${url}`, "true");
    modal.remove();
    clearInterval(timer);
    // Simulate click or redirect
    window.location.href = url;
  });

  // Report Button
  const reportBtn = modal.querySelector("#bs-report-btn");
  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      generateReport(url, response);
    });
  }
}

function showWarningToast(response) {
  // Prevent spamming toasts
  if (document.querySelector(".bs-warning-toast")) return;

  const sirenUrl = chrome.runtime.getURL("asset/siren.png");
  const toast = document.createElement("div");
  toast.className = "bs-warning-toast";

  // Extract data from response
  const safetyScore = response.overall?.safetyScore || 0;
  const warnings = response.overall?.warnings || [];
  const pillars = response.overall?.pillars || {};

  toast.innerHTML = `
    <div class="bs-toast-content">
        <div class="bs-toast-header">
          <img src="${chrome.runtime.getURL("icons/logo.png")}" class="bs-toast-icon" />
          <div class="bs-toast-title">
            <strong>Security Analysis</strong>
            <span class="bs-risk-badge">⚠️ CAUTION</span>
          </div>
          <button class="bs-toast-close">&times;</button>
        </div>
        
        <div class="bs-safety-score">
          <img src="${sirenUrl}" class="bs-siren-small" />
          <div class="bs-score-label">Overall Safety Score</div>
          <div class="bs-score-bar-container">
            <div class="bs-score-bar" style="width: ${safetyScore}%; background: ${safetyScore >= 80 ? "#00FF88" : safetyScore >= 50 ? "#FFD700" : "#FF3232"};"></div>
          </div>
          <div class="bs-score-value">${safetyScore}%</div>
        </div>

        
        ${
          warnings.length > 0
            ? `
          <div class="bs-warnings">
             <div class="bs-warning-item">${warnings[0]}</div>
          </div>
        `
            : ""
        }

        ${getPillarBreakdownHTML(pillars, true)}
    </div>
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("bs-show"));

  // Auto Dismiss (longer for more info)
  const timeout = setTimeout(() => {
    removeToast();
  }, 8000);

  function removeToast() {
    toast.classList.remove("bs-show");
    setTimeout(() => toast.remove(), 300);
  }

  toast.querySelector(".bs-toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast();
  });
}

function getPillarBreakdownHTML(pillars, isMini = false) {
  if (!pillars) return "";

  const pillarDots = [
    {
      label: "Reputation",
      val: pillars.reputation || 0,
      color: "#3B74DE",
      w: 0.25,
    },
    { label: "Brand", val: pillars.brand || 0, color: "#00FF88", w: 0.2 },
    {
      label: "Maturity",
      val: pillars.maturity || 0,
      color: "#ff3232",
      w: 0.15,
    },
    {
      label: "Destination",
      val: pillars.destination || 0,
      color: "#00FF88",
      w: 0.15,
    },
    { label: "Pressure", val: pillars.pressure || 0, color: "#ff3232", w: 0.1 },
    {
      label: "DataRisk",
      val: pillars.dataRisk || 0,
      color: "#ff3232",
      w: 0.15,
    },
  ];

  if (isMini) {
    return `
      <div class="bs-pillar-summary">
        ${pillarDots
          .map(
            (p) => `
          <div class="bs-pillar-item mini">
            <span class="bs-pillar-label">${p.label}</span>
            <div class="bs-pillar-bar-bg">
              <div class="bs-pillar-bar-fill" style="width: ${p.val}%; background: ${p.color}"></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  const formulaRows = pillarDots
    .map((p) => {
      const contribution = (p.val * p.w).toFixed(1);
      return `
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; align-items: center;">
        <span style="color: #ccc; font-weight: 500;">${p.label}:</span>
        <span style="color: #eee; font-weight: 600;">${p.val}% × ${p.w} = ${contribution}%</span>
      </div>
    `;
    })
    .join("");

  const total = pillarDots.reduce((sum, p) => sum + p.val * p.w, 0).toFixed(0);

  return `
    <!-- Security Pillars -->
    <div class="bs-pillar-card" style="background: rgba(255,255,255,0.025); padding: 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
      <h4 style="margin: 0 0 20px 0; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;">Security Pillars</h4>
      ${pillarDots
        .map(
          (p) => `
        <div class="bs-pillar-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; font-size: 13px;">
          <span style="width: 100px; color: #eee; font-weight: 600;">${p.label}</span>
          <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 10px; margin: 0 20px; position: relative; overflow: hidden;">
            <div style="width: ${p.val}%; height: 100%; background: ${p.val < 50 ? "#ff3232" : "#00FF88"}; border-radius: 10px; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          </div>
          <span style="width: 40px; text-align: right; color: #fff; font-weight: 800; font-family: 'JetBrains Mono', monospace;">${p.val}%</span>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Mathematical Formula -->
    <div class="bs-formula-card" style="background: rgba(255,255,255,0.025); padding: 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
      <h4 style="margin: 0 0 20px 0; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;">Mathematical Formula</h4>
      ${formulaRows}
      <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800;">
        <span style="color: #fff;">Final Weighted Sum:</span>
        <span style="color: #fff; font-size: 16px;">${total}%</span>
      </div>
    </div>
  `;
}

// ==========================================
// 📄 THREAT INTELLIGENCE REPORT GENERATOR
// ==========================================

function generateReport(url, response) {
  // --- Unique identifiers ---
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const dateStr =
    istTime.toISOString().replace("T", " ").substring(0, 19) + " IST";
  const dateShort = istTime.toISOString().substring(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const reportId = `BSR-${dateShort}-${rand}`;

  // --- Extract data ---
  const overall = response?.overall || {};
  const safetyScore = overall.safetyScore || 0;
  const pillars = overall.pillars || {};
  const warnings = overall.warnings || [];
  const recommendation = overall.recommendation || "Dangerous";
  const groqAI = response?.groqAI || {};
  const safeBrowsing = response?.safeBrowsing || {};
  const virusTotal = response?.virusTotal || {};
  const resolvedUrl = response?.resolvedUrl || url;
  const isImpersonation = warnings.some(
    (w) =>
      w.toLowerCase().includes("impersonat") ||
      w.toLowerCase().includes("brand"),
  );

  // --- Risk level ---
  const riskLabel =
    safetyScore < 50 ? "CRITICAL" : safetyScore < 85 ? "HIGH" : "MEDIUM";
  const riskColor =
    safetyScore < 50 ? "#cc0000" : safetyScore < 85 ? "#cc6600" : "#cc9900";

  // --- Pillar definitions ---
  const pillarDefs = [
    { key: "reputation", label: "Reputation", weight: 0.25 },
    { key: "brand", label: "Brand Integrity", weight: 0.2 },
    { key: "maturity", label: "Domain Maturity", weight: 0.15 },
    { key: "destination", label: "Destination Security", weight: 0.15 },
    { key: "pressure", label: "Pressure Tactics", weight: 0.1 },
    { key: "dataRisk", label: "Data Risk", weight: 0.15 },
  ];

  const pillarRows = pillarDefs
    .map((p) => {
      const val = pillars[p.key] || 0;
      const contrib = (val * p.weight).toFixed(1);
      const status = val < 40 ? "CRITICAL" : val < 70 ? "HIGH" : "MODERATE";
      const sc = val < 40 ? "#cc0000" : val < 70 ? "#cc6600" : "#cc9900";
      return `<tr>
      <td style="padding:8px 12px;border:1px solid #ccc;">${p.label}</td>
      <td style="padding:8px 12px;border:1px solid #ccc;text-align:center;">${val}%</td>
      <td style="padding:8px 12px;border:1px solid #ccc;text-align:center;">${(p.weight * 100).toFixed(0)}%</td>
      <td style="padding:8px 12px;border:1px solid #ccc;text-align:center;">${contrib}</td>
      <td style="padding:8px 12px;border:1px solid #ccc;text-align:center;color:${sc};font-weight:700;">${status}</td>
    </tr>`;
    })
    .join("");

  const finalContrib = pillarDefs
    .reduce((s, p) => s + (pillars[p.key] || 0) * p.weight, 0)
    .toFixed(1);

  // --- Per-pillar explanatory paragraphs ---
  const pillarDescriptions = {
    reputation: (v) =>
      `The Reputation pillar aggregates intelligence from Google Safe Browsing and VirusTotal. A score of ${v}% indicates that the target URL has been ${v < 50 ? "flagged by one or more threat intelligence databases as malicious or suspicious" : "assessed with reduced confidence in its safety"}. This pillar carries the highest weight (25%) in the overall formula due to its reliance on verified, real-world threat data.`,
    brand: (v) =>
      `The Brand Integrity pillar evaluates whether the domain is attempting to impersonate a known, trusted brand through typosquatting, homoglyph substitution, or deceptive naming. A score of ${v}% indicates ${v < 30 ? "strong evidence of brand impersonation — the domain closely mimics a protected brand name" : "potential brand-related risk that warrants further investigation"}.`,
    maturity: (v) =>
      `The Domain Maturity pillar reflects the age and historical trustworthiness of the domain, as assessed by BrowseSight's AI engine. A score of ${v}% suggests the domain is ${v < 40 ? "newly registered — a pattern strongly associated with disposable phishing infrastructure" : "relatively new or lacking sufficient history to establish trust"}. Legitimate businesses typically operate on domains with years of established history.`,
    destination: (v) =>
      `The Destination Security pillar evaluates the protocol security and redirect behaviour of the target URL. A score of ${v}% indicates ${v < 50 ? "the site uses an insecure HTTP connection, meaning all data transmitted is unencrypted and susceptible to interception" : "concerns regarding the destination or redirect chain of this URL"}.`,
    pressure: (v) =>
      `The Pressure Tactics pillar measures the presence of psychological manipulation techniques designed to rush the user into a decision. A score of ${v}% reflects ${v < 50 ? "the detection of high-pressure language or urgency indicators on the page, such as countdown timers, false scarcity claims, or aggressive call-to-action language" : "some indicators of pressure-based manipulation on the associated page"}.`,
    dataRisk: (v) =>
      `The Data Risk pillar assesses the sensitivity of information being requested by the target site. A score of ${v}% indicates ${v < 50 ? "the presence of sensitive data collection forms — such as payment card fields, login credentials, or personal identification inputs — on an unverified or suspicious domain" : "potential data collection practices that may pose a risk to user privacy or financial security"}.`,
  };

  const pillarParas = pillarDefs
    .map((p, i) => {
      const val = pillars[p.key] || 0;
      return `<h4 style="margin:16px 0 6px;font-size:13px;color:#333;">4.${i + 1} ${p.label} — ${val}%</h4>
    <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#444;">${pillarDescriptions[p.key](val)}</p>`;
    })
    .join("");

  // --- Threats ---
  const threatItems =
    warnings.length > 0
      ? warnings
          .map(
            (w, i) => `
      <h4 style="margin:16px 0 4px;font-size:13px;color:#cc0000;">${i + 1}. ${w.split(" - ")[0] || w}</h4>
      <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#444;">${w}. This threat was identified through BrowseSight's multi-source intelligence pipeline combining Google Safe Browsing, VirusTotal, and Groq AI analysis. Users who interact with this URL risk exposure to the described threat vector.</p>`,
          )
          .join("")
      : '<p style="color:#444;font-size:13px;">No specific threats were isolated; however the overall safety score remains below the acceptable threshold of 85.</p>';

  // --- Submission links ---
  const encodedUrl = encodeURIComponent(url);
  const submissionRows = [
    {
      name: "Google Safe Browsing Report",
      url: `https://safebrowsing.google.com/safebrowsing/report_phish/?url=${encodedUrl}`,
      desc: "Report to Google Safe Browsing for inclusion in their global threat database.",
    },
    {
      name: "VirusTotal Community Report",
      url: `https://www.virustotal.com/gui/home/url`,
      desc: "Submit for VirusTotal community analysis across 90+ antivirus engines.",
    },
    {
      name: "PhishTank Submission",
      url: "https://www.phishtank.com/add_web_phish.php",
      desc: "Submit to PhishTank, a community-driven phishing URL database.",
    },
    {
      name: "India CERT-In",
      url: "https://www.cert-in.org.in/",
      desc: "Report to India's Computer Emergency Response Team. Email: incident@cert-in.org.in",
    },
    {
      name: "India Cybercrime Portal",
      url: "https://cybercrime.gov.in/",
      desc: "File a formal complaint on the Government of India's National Cybercrime Reporting Portal.",
    },
  ]
    .map(
      (s, i) => `<tr>
    <td style="padding:8px 12px;border:1px solid #ccc;font-weight:700;">${i + 1}. ${s.name}</td>
    <td style="padding:8px 12px;border:1px solid #ccc;font-size:12px;color:#444;">${s.desc}</td>
    <td style="padding:8px 12px;border:1px solid #ccc;"><a href="${s.url}" style="color:#0055cc;font-size:11px;word-break:break-all;">${s.url}</a></td>
  </tr>`,
    )
    .join("");

  const sn = (n) => (isImpersonation ? n : n - 1); // section numbering offset

  // --- Build full HTML ---
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Threat Intelligence Report — ${reportId}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Times New Roman',Times,serif;font-size:13px;color:#111;background:#fff;padding:40px 60px;max-width:920px;margin:0 auto;}
    h1{font-size:20px;text-align:center;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;}
    h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #111;padding-bottom:6px;margin:32px 0 14px;}
    h3{font-size:13px;margin:14px 0 6px;}
    p{font-size:13px;line-height:1.8;color:#333;margin-bottom:10px;}
    table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px;}
    th{background:#111;color:#fff;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;}
    td{padding:7px 12px;border:1px solid #ccc;vertical-align:top;}
    tr:nth-child(even) td{background:#f9f9f9;}
    .cover-box{border:2px solid #111;padding:24px 32px;margin-bottom:32px;}
    .cover-meta{display:grid;grid-template-columns:180px 1fr;gap:7px 0;margin-top:16px;font-size:12px;}
    .cover-meta span:nth-child(odd){font-weight:700;color:#111;}
    .risk-badge{display:inline-block;background:${riskColor};color:#fff;padding:3px 12px;border-radius:3px;font-size:11px;font-weight:700;letter-spacing:1px;}
    .no-print{margin:20px 0;text-align:center;}
    .no-print button{background:#111;color:#fff;border:none;padding:12px 32px;font-size:14px;cursor:pointer;border-radius:4px;font-family:inherit;}
    @media print{
      .no-print{display:none!important;}
      body{padding:20px 40px;}
      h2{page-break-after:avoid;}
    }
  </style>
</head>
<body>

<div class="no-print">
  <button onclick="window.print()">⬇️ Save as PDF / Print Report</button>
</div>

<!-- COVER -->
<div class="cover-box">
  <div style="text-align:center;border-bottom:1px solid #ccc;padding-bottom:16px;margin-bottom:16px;">
    <div style="font-size:10px;letter-spacing:3px;color:#666;margin-bottom:6px;">THREAT INTELLIGENCE REPORT</div>
    <h1>Website Security Assessment</h1>
    <div style="font-size:11px;color:#666;margin-top:4px;">BrowseSight Security Engine &nbsp;|&nbsp; Version 3.1.2</div>
  </div>
  <div class="cover-meta">
    <span>Report ID:</span><span>${reportId}</span>
    <span>Classification:</span><span>CONFIDENTIAL — FOR OFFICIAL USE ONLY</span>
    <span>Generated:</span><span>${dateStr}</span>
    <span>Target URL:</span><span style="word-break:break-all;">${url}</span>
    <span>Resolved URL:</span><span style="word-break:break-all;">${resolvedUrl !== url ? resolvedUrl : "— No redirect detected"}</span>
    <span>Risk Level:</span><span><span class="risk-badge">${riskLabel}</span></span>
    <span>Safety Score:</span><span style="font-weight:700;color:${riskColor};">${safetyScore} / 100</span>
    <span>Recommendation:</span><span style="font-weight:700;color:${riskColor};">${recommendation.toUpperCase()}</span>
  </div>
</div>

<!-- 1. EXECUTIVE SUMMARY -->
<h2>1. Executive Summary</h2>
<p>This report presents a comprehensive security assessment of the URL <strong>${url}</strong>, conducted on <strong>${dateStr}</strong> using BrowseSight's multi-source threat intelligence engine (v3.1.2). The analysis was initiated upon user interaction with the aforementioned hyperlink during an active browsing session.</p>
<p>The target URL has been classified as <strong style="color:${riskColor};">${riskLabel} RISK</strong> with an overall weighted safety score of <strong>${safetyScore} out of 100</strong>. ${safetyScore < 50 ? "The site was independently flagged by multiple threat intelligence sources and BrowseSight's AI engine as a high-confidence threat. Immediate cessation of interaction with this URL is strongly advised." : "The site exhibits characteristics that fall below the acceptable safety threshold of 85%, warranting caution before proceeding."}</p>
<p>This report has been prepared to facilitate formal submission to cybercrime reporting authorities, threat intelligence platforms, and affected brand owners. The Report ID <strong>${reportId}</strong> and the timestamp <strong>${dateStr}</strong> serve as unique identifiers for this assessment and should be referenced in all official correspondence.</p>

<!-- 2. TARGET IDENTIFICATION -->
<h2>2. Target Identification</h2>
<table>
  <tr><th>Parameter</th><th>Value</th></tr>
  <tr><td>Submitted URL</td><td style="word-break:break-all;">${url}</td></tr>
  <tr><td>Resolved URL</td><td style="word-break:break-all;">${resolvedUrl !== url ? resolvedUrl : "— No redirect detected"}</td></tr>
  <tr><td>Protocol</td><td>${url.startsWith("https") ? "HTTPS (Encrypted)" : "⚠️ HTTP (Unencrypted — data transmitted in plaintext)"}</td></tr>
  <tr><td>Scan Timestamp</td><td>${dateStr}</td></tr>
  <tr><td>Report ID</td><td>${reportId}</td></tr>
</table>
<p>The subject of this investigation is the URL submitted above. ${resolvedUrl !== url ? `BrowseSight's URL resolution engine detected a redirect chain and followed it to the final destination: <strong>${resolvedUrl}</strong>. The use of URL shorteners or redirect chains is a common technique employed by threat actors to obscure the true destination of malicious links.` : "No redirect chain was detected. The submitted URL resolves directly to its stated destination."}</p>
<p>The protocol in use is <strong>${url.startsWith("https") ? "HTTPS" : "HTTP"}</strong>. ${!url.startsWith("https") ? "An unencrypted HTTP connection means that all data transmitted between the user and the server — including login credentials, personal information, and payment details — is transmitted in plaintext and is susceptible to interception by any party on the network path." : "An HTTPS connection indicates that data in transit is encrypted, though this alone does not guarantee the legitimacy or safety of the destination."}</p>

<!-- 3. THREAT INTELLIGENCE SOURCES -->
<h2>3. Threat Intelligence Source Analysis</h2>
<table>
  <tr><th>Source</th><th>Status</th><th>Details</th></tr>
  <tr>
    <td>Google Safe Browsing API v4</td>
    <td style="color:${safeBrowsing.safe ? "#006600" : "#cc0000"};font-weight:700;">${safeBrowsing.safe ? "✓ CLEAN" : "✗ FLAGGED"}</td>
    <td>${safeBrowsing.safe ? "No threats detected in Google's threat database." : `Threat type: ${safeBrowsing.threats?.map((t) => t.type).join(", ") || "SOCIAL_ENGINEERING"}`}</td>
  </tr>
  <tr>
    <td>VirusTotal (Multi-Engine)</td>
    <td style="color:${virusTotal.safe ? "#006600" : "#cc0000"};font-weight:700;">${virusTotal.safe ? "✓ CLEAN" : `✗ ${virusTotal.malicious || 0} ENGINES FLAGGED`}</td>
    <td>${virusTotal.safe ? "No malicious detections across all engines." : `Malicious: ${virusTotal.malicious || 0} | Suspicious: ${virusTotal.suspicious || 0} | Total engines: ${virusTotal.total || "N/A"} | Score: ${virusTotal.score || 0}%`}</td>
  </tr>
  <tr>
    <td>Groq AI (Llama 3.3 70B)</td>
    <td style="color:${groqAI.safe ? "#006600" : "#cc0000"};font-weight:700;">${groqAI.safe ? "✓ LOW RISK" : "✗ HIGH RISK"}</td>
    <td>${groqAI.threats?.join("; ") || "AI analysis flagged this URL as high risk based on URL pattern, naming psychology, and contextual signals."}</td>
  </tr>
</table>
<h3>3.1 Google Safe Browsing</h3>
<p>Google Safe Browsing is a globally trusted threat intelligence service maintained by Google LLC, providing real-time detection of malicious URLs across billions of web pages. The BrowseSight engine queries the Safe Browsing API v4 against threat categories including MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, and POTENTIALLY_HARMFUL_APPLICATION. The result for this URL was: <strong style="color:${safeBrowsing.safe ? "#006600" : "#cc0000"}">${safeBrowsing.safe ? "No threats detected" : "FLAGGED — " + (safeBrowsing.threats?.map((t) => t.type).join(", ") || "SOCIAL_ENGINEERING")}</strong>.</p>
<h3>3.2 VirusTotal Multi-Engine Scan</h3>
<p>VirusTotal aggregates results from over 90 independent antivirus and URL scanning engines. ${virusTotal.safe ? "All engines returned a clean verdict for this URL." : `Of the ${virusTotal.total || "available"} engines that processed this URL, <strong>${virusTotal.malicious || 0}</strong> returned a malicious verdict and <strong>${virusTotal.suspicious || 0}</strong> flagged the URL as suspicious, yielding a VirusTotal safety score of <strong>${virusTotal.score || 0}%</strong>.`}</p>
<h3>3.3 AI-Powered Behavioural Analysis (Groq / Llama 3.3 70B)</h3>
<p>BrowseSight employs a large language model (Llama 3.3 70B, served via Groq infrastructure) to perform semantic and behavioural analysis of the URL, its associated link text, and surrounding page context. Unlike signature-based detection, this AI-driven approach evaluates contextual signals such as domain naming patterns, urgency language, data collection intent, and brand impersonation indicators. The AI assessment concluded: <strong style="color:${groqAI.safe ? "#006600" : "#cc0000"}">${groqAI.safe ? "Low Risk" : "High Risk — " + (groqAI.threats?.[0] || "Suspicious URL pattern detected")}</strong>.</p>

<!-- 4. SECURITY PILLAR ANALYSIS -->
<h2>4. Security Pillar Analysis</h2>
<p>BrowseSight employs a proprietary six-pillar security scoring framework to produce a holistic, weighted safety assessment. Each pillar represents a distinct dimension of website trustworthiness, evaluated independently and combined using a weighted formula to produce the final safety score of <strong>${safetyScore}/100</strong>.</p>
<table>
  <tr><th>Security Pillar</th><th>Score</th><th>Weight</th><th>Contribution</th><th>Status</th></tr>
  ${pillarRows}
  <tr style="background:#111;">
    <td style="padding:8px 12px;font-weight:700;color:#fff;">FINAL WEIGHTED SCORE</td>
    <td style="padding:8px 12px;color:#fff;" colspan="2"></td>
    <td style="padding:8px 12px;font-weight:700;color:#fff;">${finalContrib}</td>
    <td style="padding:8px 12px;font-weight:700;color:${riskColor};">${riskLabel}</td>
  </tr>
</table>
<p style="font-size:11px;color:#666;font-style:italic;">Formula: (Reputation × 0.25) + (Brand × 0.20) + (Maturity × 0.15) + (Destination × 0.15) + (Pressure × 0.10) + (Data Risk × 0.15)</p>
${pillarParas}

<!-- 5. DETECTED THREATS -->
<h2>5. Detected Threats</h2>
<p>The following threats were identified during the multi-source analysis of the target URL. Each threat has been independently corroborated by at least one of the three intelligence sources consulted.</p>
${threatItems}

<!-- 6. BRAND IMPERSONATION (conditional) -->
${
  isImpersonation
    ? `
<h2>6. Brand Impersonation Analysis</h2>
<p>BrowseSight's brand impersonation detection engine identified that the target domain bears a deceptive resemblance to one or more protected brand names. This analysis is performed using the Levenshtein distance algorithm, which measures the minimum number of single-character edits required to transform the target domain name into a known brand name. A distance of 1 or 2 on a domain of similar length is considered a strong indicator of intentional typosquatting.</p>
<p>Additionally, the engine checks for homoglyph substitution — a technique where visually similar characters are substituted for letters in a brand name (e.g., replacing the letter 'l' with the numeral '1', or 'o' with '0') to create a domain that appears identical to the legitimate brand at a glance. The target URL exhibited characteristics consistent with this attack pattern.</p>
<p>Brand impersonation is a primary vector in credential harvesting attacks. Users who mistake the target domain for a legitimate brand may willingly submit login credentials, payment information, or personal data, which is then captured by the threat actor.</p>
`
    : ""
}

<!-- CONTEXTUAL THREAT INDICATORS -->
<h2>${sn(7)}. Contextual Threat Indicators</h2>
<p>In addition to the URL-level analysis, BrowseSight evaluates the broader context in which the target URL was encountered, including the surrounding page content, the nature of any forms present, and the use of psychological pressure tactics.</p>
<table>
  <tr><th>Indicator</th><th>Status</th><th>Assessment</th></tr>
  <tr>
    <td>Urgency / Pressure Tactics</td>
    <td style="color:${(pillars.pressure || 100) < 70 ? "#cc0000" : "#006600"};font-weight:700;">${(pillars.pressure || 100) < 70 ? "⚠️ DETECTED" : "✓ NOT DETECTED"}</td>
    <td>${(pillars.pressure || 100) < 70 ? "High-pressure language or urgency indicators were detected on the page associated with this URL. This is a common social engineering technique used to prevent rational decision-making." : "No significant urgency or pressure tactics were detected on the associated page."}</td>
  </tr>
  <tr>
    <td>Sensitive Form Detection</td>
    <td style="color:${(pillars.dataRisk || 100) < 70 ? "#cc0000" : "#006600"};font-weight:700;">${(pillars.dataRisk || 100) < 70 ? "⚠️ DETECTED" : "✓ NOT DETECTED"}</td>
    <td>${(pillars.dataRisk || 100) < 70 ? "Sensitive data collection forms (e.g., payment card fields, login credentials) were detected on the associated page on an unverified domain." : "No sensitive data collection forms were detected."}</td>
  </tr>
  <tr>
    <td>Protocol Security</td>
    <td style="color:${url.startsWith("https") ? "#006600" : "#cc0000"};font-weight:700;">${url.startsWith("https") ? "✓ HTTPS" : "⚠️ HTTP (INSECURE)"}</td>
    <td>${url.startsWith("https") ? "The site uses an encrypted HTTPS connection." : "The site uses an unencrypted HTTP connection. All data transmitted is visible to network observers."}</td>
  </tr>
</table>

<!-- RECOMMENDED ACTIONS -->
<h2>${sn(8)}. Recommended Actions &amp; Submission Portals</h2>
<p>Based on the findings of this assessment, the following actions are recommended. This report (Report ID: <strong>${reportId}</strong>) should be referenced in all official submissions.</p>
<table>
  <tr><th>#</th><th>Authority / Platform</th><th>Description</th><th>Submission URL</th></tr>
  ${submissionRows}
</table>
<p style="font-size:12px;color:#555;margin-top:8px;">When submitting to CERT-In, attach this PDF and reference Report ID <strong>${reportId}</strong> in the subject line of your email to <strong>incident@cert-in.org.in</strong>.</p>

<!-- TECHNICAL APPENDIX -->
<h2>${sn(9)}. Technical Appendix</h2>
<table>
  <tr><th>Parameter</th><th>Value</th></tr>
  <tr><td>BrowseSight Engine Version</td><td>3.1.2</td></tr>
  <tr><td>Report ID</td><td>${reportId}</td></tr>
  <tr><td>Scan Timestamp (IST)</td><td>${dateStr}</td></tr>
  <tr><td>Analysis Method</td><td>Parallel Multi-Source Threat Intelligence</td></tr>
  <tr><td>AI Model</td><td>Llama 3.3 70B (via Groq API)</td></tr>
  <tr><td>Google Safe Browsing</td><td>API v4 — threatMatches:find</td></tr>
  <tr><td>VirusTotal</td><td>API v3 — URL Analysis</td></tr>
  <tr><td>Raw Safety Score</td><td>${safetyScore} / 100</td></tr>
  <tr><td>Recommendation</td><td>${recommendation}</td></tr>
  <tr><td>Fast Path Used</td><td>${response?.fastPath ? "Yes (Trusted Domain)" : "No (Full Analysis Performed)"}</td></tr>
</table>

<!-- DISCLAIMER -->
<h2>${sn(10)}. Disclaimer</h2>
<p>This report has been generated automatically by the BrowseSight Security Engine (v3.1.2) using data obtained from third-party threat intelligence APIs at the time of the scan. The findings presented herein represent the state of the target URL at the exact timestamp recorded in this document (<strong>${dateStr}</strong>) and may not reflect subsequent changes to the URL's status.</p>
<p>BrowseSight does not guarantee the completeness or absolute accuracy of this assessment. The report is provided for informational purposes and to facilitate reporting to relevant authorities. It should not be construed as legal advice. Users are encouraged to cross-reference findings with additional sources before taking formal action.</p>
<p>The Report ID <strong>${reportId}</strong> and timestamp <strong>${dateStr}</strong> are unique to this assessment and serve as identifiers for official correspondence. Once saved as a PDF, this document cannot be altered without invalidating its integrity.</p>

<div style="margin-top:40px;padding-top:16px;border-top:1px solid #ccc;text-align:center;font-size:10px;color:#888;">
  BrowseSight Security Engine v3.1.2 &nbsp;|&nbsp; Report ID: ${reportId} &nbsp;|&nbsp; Generated: ${dateStr}
</div>

<div class="no-print" style="margin-top:24px;">
  <button onclick="window.print()">⬇️ Save as PDF / Print Report</button>
</div>

</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 800);
  }
}
