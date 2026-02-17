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
}
