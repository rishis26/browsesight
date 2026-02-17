// BrowseSight v1.0.3 - Popup Intelligence
document.addEventListener("DOMContentLoaded", async () => {
  const displayDomain = document.getElementById("display-domain");
  const trustLevel = document.getElementById("trust-level");
  const statsScanned = document.getElementById("stats-scanned");
  const statsThreats = document.getElementById("stats-threats");
  const toggleMaster = document.getElementById("toggle-master");
  const toggleUrgency = document.getElementById("toggle-urgency");
  const toggleForms = document.getElementById("toggle-forms");

  // 1. Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    try {
      const url = new URL(tab.url);
      displayDomain.textContent = url.hostname;

      // Request trust score for current site
      chrome.runtime.sendMessage(
        { action: "checkUrl", url: tab.url },
        (response) => {
          if (response && response.overall) {
            updateSiteTrust(response);
          }
        },
      );
    } catch (e) {
      displayDomain.textContent = "System Page";
    }
  }

  // 2. Load Stats (Mocked for now, will connect to storage later)
  statsScanned.textContent = Math.floor(Math.random() * 50) + 10;
  statsThreats.textContent = Math.floor(Math.random() * 5);

  // 2.5 Load Toggle States
  chrome.storage.sync.get(
    ["masterEnabled", "urgencyEnabled", "formsEnabled"],
    (data) => {
      const masterOn = data.masterEnabled !== false; // Default true
      toggleMaster.checked = masterOn;
      toggleUrgency.checked = data.urgencyEnabled !== false;
      toggleForms.checked = data.formsEnabled !== false;

      updateControlsState(masterOn);
    },
  );

  // 3. UI Handlers
  toggleMaster.addEventListener("change", (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.sync.set({ masterEnabled: isEnabled });
    updateControlsState(isEnabled);

    // Update visual status header
    const statusBadge = document.getElementById("protection-status");
    if (isEnabled) {
      statusBadge.innerHTML = '<span class="pulse"></span> Active';
      statusBadge.style.color = "var(--cyber-cyan)";
      statusBadge.style.borderColor = "rgba(59, 116, 222, 0.2)";
    } else {
      statusBadge.innerHTML = "<span>❌</span> Inactive";
      statusBadge.style.color = "#555";
      statusBadge.style.borderColor = "#333";
    }
  });

  function updateControlsState(enabled) {
    const opacity = enabled ? "1" : "0.5";
    const pointerEvents = enabled ? "auto" : "none";

    [toggleUrgency, toggleForms].forEach((t) => {
      t.closest(".toggle-item").style.opacity = opacity;
      t.disabled = !enabled;
    });
    document.getElementById("re-scan").style.opacity = opacity;
    document.getElementById("re-scan").style.pointerEvents = pointerEvents;
  }

  // 3. UI Handlers
  toggleUrgency.addEventListener("change", (e) => {
    chrome.storage.sync.set({ urgencyEnabled: e.target.checked });
  });

  toggleForms.addEventListener("change", (e) => {
    chrome.storage.sync.set({ formsEnabled: e.target.checked });
  });
  document.getElementById("re-scan").addEventListener("click", () => {
    chrome.tabs.sendMessage(tab.id, { action: "triggerScan" });
    window.close();
  });
});

/**
 * Update UI based on trust score
 */
function updateSiteTrust(data) {
  const trustIndicator = document.getElementById("trust-level");
  const siteCard = document.getElementById("current-site-info");
  const status = data.overall.recommendation;
  const score = data.overall.safetyScore;

  trustIndicator.textContent = `Safety Score: ${score}%`;

  if (status === "Not recommended") {
    siteCard.style.borderLeftColor = "#FF003C";
    trustIndicator.style.color = "#FF003C";
  } else if (status === "Proceed with caution") {
    siteCard.style.borderLeftColor = "#FFD700";
    trustIndicator.style.color = "#FFD700";
  } else {
    siteCard.style.borderLeftColor = "#3B74DE";
    trustIndicator.style.color = "#3B74DE";
  }

  // Inject Pillar Breakdown
  const pillarContainer = document.getElementById("pillar-breakdown-container");
  if (pillarContainer && data.overall.pillars) {
    pillarContainer.innerHTML = getPillarBreakdownHTML(data.overall.pillars);
  }
}

/**
 * Helper to generate the 6-Pillar Security Breakdown HTML
 */
function getPillarBreakdownHTML(pillars) {
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
      color: "#FFD700",
      w: 0.15,
    },
    {
      label: "Stability",
      val: pillars.destination || 0,
      color: "#AB47BC",
      w: 0.15,
    },
    { label: "Pressure", val: pillars.pressure || 0, color: "#FFA726", w: 0.1 },
    {
      label: "Data Risk",
      val: pillars.dataRisk || 0,
      color: "#FF3232",
      w: 0.15,
    },
  ];

  const equation = pillarDots.map((p) => (p.val * p.w).toFixed(1)).join(" + ");
  const total = pillarDots.reduce((sum, p) => sum + p.val * p.w, 0).toFixed(0);

  return `
    <div class="bs-pillar-breakdown">
      ${pillarDots
        .map(
          (p) => `
        <div class="bs-pillar-item">
          <span class="bs-pillar-label">${p.label} <small style="opacity:0.5; font-size:9px;">(${p.w * 100}%)</small></span>
          <div class="bs-pillar-bar-bg">
            <div class="bs-pillar-bar-fill" style="width: ${p.val}%; background: ${p.color}"></div>
          </div>
          <span class="bs-pillar-val">${p.val}%</span>
        </div>
      `,
        )
        .join("")}

      <div class="bs-calculation-derive" style="margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05); font-family: monospace; font-size:9px; color:#888; text-align:left;">
        <div style="margin-bottom:4px; color:#aaa; font-weight:bold;">DERIVATION:</div>
        <div style="line-height:1.4;">
          ${equation} = <span style="color:#00FF88; font-weight:bold;">${total}%</span>
        </div>
      </div>
    </div>
  `;
}
