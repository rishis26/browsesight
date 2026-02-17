// BrowseSight v2.1.2 - Background Service Worker
const API_URL = "https://browsesight-api.vercel.app";

// In-memory cache for the current session
const analysisCache = new Map();

/**
 * Handle messages from Content Script or Popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkUrl") {
    handleUrlCheck(request.url, request.linkText, sendResponse);
    return true; // Keep channel open for async response
  }
});

/**
 * Perform URL analysis with caching
 */
async function handleUrlCheck(url, linkText, sendResponse) {
  // 1. Check Cache
  if (analysisCache.has(url)) {
    console.log("[CACHE HIT]", url);
    sendResponse(analysisCache.get(url));
    return;
  }

  // 2. Call API
  try {
    const response = await fetch(`${API_URL}/api/check-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, linkText }),
    });

    const data = await response.json();

    // Cache the result
    analysisCache.set(url, data);

    sendResponse(data);
  } catch (error) {
    console.error("[API ERROR]", error);
    sendResponse({
      error: "Failed to connect to BrowseSight security server",
      safe: true,
    });
  }
}

console.log("🛡️ BrowseSight Background Guard Active");
