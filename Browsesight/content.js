// BrowseSight v2.1.2 - Paranoid Elite Version
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
  "nike.com", // Added regional google
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
