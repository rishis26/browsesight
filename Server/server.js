import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// CORS - Allow browser extensions
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (
        origin.startsWith("chrome-extension://") ||
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS for:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use("/public", express.static("public"));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    version: "2.1.2",
    phase: "Phase 3: Google Safe Browsing + VirusTotal + Groq AI",
  });
});

/**
 * GET /
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.json({
    name: "BrowseSight API",
    version: "2.1.2",
    phase: "Phase 3: Google Safe Browsing + VirusTotal + Groq AI",
    endpoints: {
      health: "GET /health",
      root: "GET /",
      checkUrl: "POST /api/check-url",
    },
  });
});

/**
 * GET /favicon.ico
 */
app.get("/favicon.ico", (req, res) => {
  res.sendFile("public/logo.png", { root: "." });
});

/**
 * POST /api/check-url
 * Check if a URL is safe using Google Safe Browsing API
 * Body: { url: string }
 */
// In-memory cache for analysis results (1 hour expiration)
const analysisCache = new Map();
const CACHE_TTL = 3600000;

// High-Trust Domains Fast-Path
const TRUSTED_DOMAINS = [
  "google.com",
  "google.co.in",
  "gstatic.com",
  "github.com",
  "microsoft.com",
  "apple.com",
  "facebook.com",
  "linkedin.com",
  "twitter.com",
  "amazon.com",
  "amazon.in",
  "amazon.co.uk",
  "wikipedia.org",
  "youtube.com",
];

app.post("/api/check-url", async (req, res) => {
  try {
    const { url } = req.body;

    // 1. Validate input
    if (!url) return res.status(400).json({ error: "URL is required" });

    // 1.5 Smart URL Unshortening (The "Hidden Threat" Gap)
    let finalUrl = url;
    const shortenerDomains = [
      "bit.ly",
      "t.co",
      "tinyurl.com",
      "is.gd",
      "buff.ly",
      "ow.ly",
      "goo.gl",
    ];
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace("www.", "");
      if (shortenerDomains.includes(domain)) {
        console.log(`[UNSHORTEN] Detected shortener: ${domain}`);
        finalUrl = await unshortenUrl(url);
        console.log(`[UNSHORTEN] Resolved to: ${finalUrl}`);
      }
    } catch (e) {
      console.error("[UNSHORTEN ERROR]", e.message);
    }

    // Use finalUrl for all subsequent checks
    const targetUrl = finalUrl;

    // 2. Fast-Path for Trusted Domains
    try {
      const urlObj = new URL(targetUrl);
      const domain = urlObj.hostname.replace("www.", "");
      if (TRUSTED_DOMAINS.includes(domain)) {
        return res.json({
          url,
          overall: {
            safe: true,
            safetyScore: 100,
            recommendation: "Safe to proceed",
            pillars: {
              reputation: 100,
              brand: 100,
              maturity: 100,
              destination: 100,
              pressure: 100,
              dataRisk: 100,
            },
          },
          fastPath: true,
        });
      }
    } catch (e) {}

    // 3. Check Server Cache
    const cached = analysisCache.get(targetUrl);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[CACHE HIT] ${targetUrl}`);
      return res.json(cached.data);
    }

    // 4. Sequential Execution Strategy (Cost Saving)

    // STEP 0: Typosquatting Check
    const impersonationResult = checkBrandImpersonation(targetUrl);

    // 4. Parallel Execution Strategy (Max Speed)
    // Run all checks simultaneously to reduce latency.

    // Start all promises
    const pSafeBrowsing = checkGoogleSafeBrowsing(targetUrl);
    const pVirusTotal = checkVirusTotal(targetUrl).catch((err) => ({
      error: err.message,
    }));

    // 4.1 Gather Reputation Context for AI
    const reputationContext = {
      google: await pSafeBrowsing.catch(() => ({ safe: true })),
      virusTotal: await pVirusTotal.catch(() => ({ score: 100 })),
    };

    const pGroqAI = analyzeWithGroqAI(
      targetUrl,
      req.body.linkText,
      req.body.context,
      reputationContext,
    ).catch((err) => ({ error: err.message }));

    // Wait for all to finish
    const [rSB, rVT, rGroqAI] = await Promise.allSettled([
      pSafeBrowsing,
      pVirusTotal,
      pGroqAI,
    ]);

    const safeBrowsingResult =
      rSB.status === "fulfilled" ? rSB.value : { error: "Failed", safe: true };
    const virusTotalResult =
      rVT.status === "fulfilled" ? rVT.value : { error: "Failed" };
    const groqAIResult =
      rGroqAI.status === "fulfilled" ? rGroqAI.value : { error: "Failed" };

    // Additional Safety: If Google Failed, treat as safe (fail open) or error?
    // Existing logic handled errors inside the functions mostly.

    // Calculate overall safety based on 6 pillars
    const overallSafe = calculateOverallSafety(
      { status: "fulfilled", value: safeBrowsingResult },
      { status: "fulfilled", value: virusTotalResult },
      { status: "fulfilled", value: groqAIResult },
      impersonationResult,
      targetUrl,
      req.body.context, // Contains urgency and form info
    );

    // Use Groq Text API to convert ALL raw data into clean English
    let humanReadableThreats = overallSafe.warnings;
    if (overallSafe.warnings.length > 0 || !overallSafe.safe) {
      try {
        const textResult = await convertToHumanReadable(
          safeBrowsingResult,
          virusTotalResult,
          groqAIResult,
          overallSafe.warnings,
          targetUrl,
        );
        humanReadableThreats = textResult.threats || overallSafe.warnings;
      } catch (e) {
        console.error("[Text API] Failed to convert warnings:", e.message);
      }
    }

    const finalResult = {
      url,
      timestamp: new Date().toISOString(),
      safeBrowsing: safeBrowsingResult,
      virusTotal: virusTotalResult,
      groqAI: {
        ...groqAIResult,
        humanReadable: humanReadableThreats, // Add formatted version
      },
      overall: {
        ...overallSafe,
        warnings: humanReadableThreats, // Replace with human-readable version
      },
      resolvedUrl: targetUrl !== url ? targetUrl : null,
      fastPath: false,
    };

    // 5. Save to Cache
    analysisCache.set(targetUrl, { timestamp: Date.now(), data: finalResult });

    res.json(finalResult);
  } catch (error) {
    console.error("[CHECK-URL ERROR]", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      hint: error.message.includes("API key")
        ? "Check your GOOGLE_SAFE_BROWSING_API_KEY in .env.local"
        : undefined,
    });
  }
});

// ============================================
// Google Safe Browsing Integration
// ============================================

// ... (keep existing ...)

// ============================================
// VirusTotal Integration
// ============================================

// ... (keep existing ...)

// ============================================
// Brand Impersonation Detection (Typosquatting)
// ============================================

// ... (keep existing ...)

// ============================================
// Groq AI Integration
// ============================================

/**
 * Convert raw API warnings into clean, human-readable English using Groq Text API
 */
async function convertToHumanReadable(
  safeBrowsing,
  virusTotal,
  groqAI,
  rawWarnings,
  url,
) {
  const apiKey = process.env.GROQ_API_text;

  if (!apiKey) {
    console.log("[Text API] Key not configured, using raw warnings");
    return { threats: rawWarnings };
  }

  // Build comprehensive context from ALL sources
  let context = `URL: ${url}\n\n`;
  context += `=== RAW SECURITY DATA ===\n\n`;

  // 1. Google Safe Browsing
  if (safeBrowsing && !safeBrowsing.safe && safeBrowsing.threats) {
    context += `Google Safe Browsing:\n`;
    safeBrowsing.threats.forEach((t) => {
      context += `  - Threat Type: ${t.type}\n`;
      context += `  - Platform: ${t.platform}\n`;
    });
    context += `\n`;
  } else if (safeBrowsing && safeBrowsing.safe) {
    context += `Google Safe Browsing: No threats detected\n\n`;
  }

  // 2. VirusTotal
  if (virusTotal && !virusTotal.safe) {
    context += `VirusTotal Analysis:\n`;
    context += `  - Malicious detections: ${virusTotal.malicious}\n`;
    context += `  - Suspicious detections: ${virusTotal.suspicious}\n`;
    context += `  - Total engines scanned: ${virusTotal.total}\n`;
    context += `  - Safety score: ${virusTotal.score}%\n\n`;
  } else if (virusTotal && virusTotal.safe) {
    context += `VirusTotal: Clean (0 malicious detections)\n\n`;
  }

  // 3. Groq AI Analysis
  if (groqAI && groqAI.threats && groqAI.threats.length > 0) {
    context += `Groq AI Analysis:\n`;
    context += `  - Risk Level: ${groqAI.riskLevel}\n`;
    context += `  - Detected Threats:\n`;
    groqAI.threats.forEach((t) => {
      context += `    • ${t}\n`;
    });
    context += `\n`;
  } else if (groqAI && groqAI.safe) {
    context += `Groq AI: No threats detected\n\n`;
  }

  // 4. Raw warnings from overall calculation
  if (rawWarnings && rawWarnings.length > 0) {
    context += `Combined Warnings:\n`;
    rawWarnings.forEach((w) => {
      context += `  • ${w}\n`;
    });
  }

  try {
    console.log("[Text API] Converting to human-readable format...");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a security communication expert. Convert technical security data into clear, user-friendly English bullet points.

Return ONLY a JSON object:
{
  "threats": ["Clear threat 1", "Clear threat 2", "Clear threat 3"]
}

Guidelines:
- Combine all data sources into 3-5 clear bullet points
- Use simple, direct language that non-technical users understand
- Focus on user impact (what could happen to them)
- Be specific about the threat type
- Examples of good output:
  • "Phishing Risk - This site may steal your passwords and personal data"
  • "Malware Detected - 5 security engines flagged this site as dangerous"
  • "Fake Login Page - Impersonating Google to harvest credentials"
  • "Data Theft Risk - Suspicious payment forms detected"
  • "Brand Impersonation - Domain mimics a trusted company"
  
If all sources say safe, return empty array.`,
          },
          {
            role: "user",
            content: context,
          },
        ],
        temperature: 0.2,
        max_tokens: 250,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiText = response.data.choices[0].message.content.trim();

    // Parse JSON response
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiText);

      console.log("[Text API] Successfully converted to human-readable format");

      return {
        threats:
          parsed.threats && parsed.threats.length > 0
            ? parsed.threats
            : rawWarnings,
      };
    } catch (e) {
      console.error("[Text API] JSON parse error:", e.message);
      return { threats: rawWarnings };
    }
  } catch (error) {
    console.error("[Text API] Request failed:", error.message);
    return { threats: rawWarnings };
  }
}

/**
 * Analyze URL with Groq AI for threat detection (with failover)
 */
async function analyzeWithGroqAI(
  url,
  linkText = "",
  context = {},
  reputation = {},
) {
  const apiKeys = [
    { key: process.env.GROQ_API_KEY, name: "Primary" },
    { key: process.env.GROQ_API_KEY_BACKUP, name: "Backup" },
  ].filter((k) => k.key);

  if (apiKeys.length === 0) throw new Error("No Groq API keys configured");

  let lastError = null;

  for (const { key: apiKey, name: keyName } of apiKeys) {
    try {
      console.log(`[Groq AI] Attempting with ${keyName} key...`);

      const sbStatus = reputation.google?.safe ? "Clean" : "Flagged";
      const vtScore = reputation.virusTotal?.score ?? 100;
      const urgency = context.urgencyDetected ? "Detected" : "None";
      const form = context.sensitiveForm
        ? `Sensitive Form (${context.formType})`
        : "No sensitive forms";

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a cybersecurity expert. Analyze the URL and context based on 6 pillars.
              
              Return ONLY a JSON object:
              {
                "safe": true/false,
                "pillars": {
                  "maturity": 0-100,
                  "brand": 0-100,
                  "reputation": 0-100,
                  "destination": 0-100,
                  "pressure": 0-100,
                  "dataRisk": 0-100
                },
                "threats": ["Reason 1", "Reason 2"]
              }

              Scoring Rules (0=Dangerous, 100=Safe):
              1. maturity: Domain age/history.
              2. brand: Lookalike/impersonation detection.
              3. reputation: Threat intel (Google: ${sbStatus}, VT: ${vtScore}%).
              4. destination: Redirects/Protocol security.
              5. pressure: Urgency tactics (Status: ${urgency}).
              6. dataRisk: Sensitive data requests (Context: ${form}).`,
            },
            {
              role: "user",
              content: `URL: ${url}\nLink Text: ${linkText}`,
            },
          ],
          temperature: 0.1,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const aiText = response.data.choices[0].message.content.trim();
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiText);

      console.log(`[Groq AI] Success with ${keyName} key`);

      return {
        safe: parsed.safe,
        pillars: parsed.pillars,
        threats: parsed.threats || [],
        source: `Groq AI (${keyName})`,
      };
    } catch (error) {
      lastError = error;
      console.error(`[Groq AI] ${keyName} key failed:`, error.message);

      // Continue to next key if available
      continue;
    }
  }

  // Fallback if all keys failed
  console.error("Groq AI Error - All keys failed:", lastError?.message);
  const isSuspicious =
    /(free|win|prize|hack|crack|mod|movie|download|phishing)/i.test(url);
  const fallbackScore = isSuspicious ? 40 : 80;

  return {
    safe: !isSuspicious,
    pillars: {
      maturity: fallbackScore,
      brand: fallbackScore,
      reputation: fallbackScore,
      destination: fallbackScore,
      pressure: fallbackScore,
      dataRisk: fallbackScore,
    },
    threats: isSuspicious
      ? ["Suspicious Keywords Detected", "API Fallback Mode"]
      : [],
    source: "Groq AI (Fallback)",
  };
}

// ============================================
// Google Safe Browsing Integration
// ============================================

/**
 * Check URL with Google Safe Browsing API
 */
async function checkGoogleSafeBrowsing(url) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Google Safe Browsing API key not configured. Add GOOGLE_SAFE_BROWSING_API_KEY to .env.local",
    );
  }

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: {
          clientId: "browsesight",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      },
    );

    const isThreat = response.data.matches && response.data.matches.length > 0;
    const threats = response.data.matches || [];

    return {
      safe: !isThreat,
      threatCount: threats.length,
      threats: threats.map((t) => ({
        type: t.threatType,
        platform: t.platformType,
      })),
      source: "Google Safe Browsing API",
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Google Safe Browsing API error: ${error.response.data.error?.message || error.response.statusText}`,
      );
    }
    throw error;
  }
}

// ============================================
// VirusTotal Integration
// ============================================

/**
 * Check URL with VirusTotal API
 */
async function checkVirusTotal(url) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    throw new Error("VirusTotal API key not configured");
  }

  try {
    // Submit URL for analysis
    const submitResponse = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const analysisId = submitResponse.data.data.id;

    // Get results immediately (VT often has these cached)
    const analysisResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { "x-apikey": apiKey },
      },
    );

    const stats = analysisResponse.data.data.attributes.stats;
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;

    return {
      safe: malicious === 0 && suspicious === 0,
      malicious,
      suspicious,
      harmless,
      undetected,
      total,
      score:
        total > 0 ? Math.round(((harmless + undetected) / total) * 100) : 100,
      source: "VirusTotal",
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `VirusTotal API error: ${error.response.data.error?.message || error.response.statusText}`,
      );
    }
    throw error;
  }
}

// ============================================
// Brand Impersonation Detection (Typosquatting)
// ============================================

const PROTECTED_BRANDS = [
  "google",
  "amazon",
  "facebook",
  "microsoft",
  "apple",
  "netflix",
  "paypal",
  "twitter",
  "instagram",
  "linkedin",
  "github",
  "dropbox",
  "adobe",
  "salesforce",
  "chase",
  "wellsfargo",
  "bankofamerica",
  "coinbase",
  "binance",
  "wallet",
  "ledger",
  "trezor",
];

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if a domain looks like a top brand but isn't one.
 */
function checkBrandImpersonation(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const cleanName = domain.split(".")[0]; // simplistic main name check

    // Exact trusted match -> Not impersonation
    if (TRUSTED_DOMAINS.some((d) => domain === d || domain.endsWith("." + d))) {
      return { isImpersonation: false };
    }

    // Check Levenshtein distance against protected brands
    for (const brand of PROTECTED_BRANDS) {
      if (domain.includes(brand)) continue; // legitimate subdomains usually fine

      // Distance check on the main part vs brand
      const dist = levenshteinDistance(cleanName, brand);

      // If distance is exceedingly small (1 char diff) and length is similar
      if (dist === 1 && cleanName.length > 3) {
        return {
          isImpersonation: true,
          impersonatedBrand: brand,
          details: `Domain '${domain}' is deceptively similar to '${brand}'`,
        };
      }

      // Catch "goog1e" style homoglyphs (simple regex version)
      if (cleanName.replace(/0/g, "o").replace(/1/g, "l") === brand) {
        return {
          isImpersonation: true,
          impersonatedBrand: brand,
          details: `Domain '${domain}' uses visual trickery to mimic '${brand}'`,
        };
      }
    }

    return { isImpersonation: false };
  } catch (e) {
    return { isImpersonation: false };
  }
}

// ============================================
// PhishTank Integration
// ============================================

/**
 * Check URL with PhishTank API
 */
async function checkPhishTank(url) {
  const apiKey = process.env.PHISHTANK_API_KEY;

  if (!apiKey) {
    throw new Error("PhishTank API key not configured");
  }

  try {
    // PhishTank uses POST with form data
    const response = await axios.post(
      "https://checkurl.phishtank.com/checkurl/",
      `url=${encodeURIComponent(url)}&format=json&app_key=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const data = response.data.results;
    const isPhishing = data.in_database && data.valid;

    return {
      safe: !isPhishing,
      inDatabase: data.in_database,
      verified: data.verified,
      phishId: data.phish_id || null,
      source: "PhishTank",
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`PhishTank API error: ${error.response.statusText}`);
    }
    throw error;
  }
}

// ============================================
// Overall Safety Calculation
// ============================================

function calculateOverallSafety(
  safeBrowsing,
  virusTotal,
  groqAI,
  impersonation,
  url,
  context,
) {
  const warnings = [];
  const pillars = {
    reputation: 100, // Google + VirusTotal
    brand: 100, // Impersonation Logic
    maturity: 100, // AI insight on age
    destination: 100, // Redirect / AI insight
    pressure: 100, // Browser context (urgency)
    dataRisk: 100, // Browser context (sensitive forms)
  };

  // 1. Initial Rule-Based Assessment (Base Scores)

  // Reputation
  const sbSafe = safeBrowsing.status === "fulfilled" && safeBrowsing.value.safe;
  const vtScore =
    virusTotal.status === "fulfilled" ? virusTotal.value.score || 0 : 100;
  if (!sbSafe) warnings.push("Flagged by Google Safe Browsing");
  if (vtScore < 50)
    warnings.push(`Low reputation score on VirusTotal (${vtScore}%)`);
  pillars.reputation = sbSafe ? vtScore : Math.min(vtScore, 30);

  // Brand
  if (impersonation && impersonation.isImpersonation) {
    pillars.brand = 0;
    warnings.push(
      `Brand Impersonation: Mimics ${impersonation.impersonatedBrand}`,
    );
  }

  // Pressure/Urgency
  if (context && context.urgencyDetected) {
    pillars.pressure = 40;
    warnings.push("High-pressure sales tactics detected on page");
  }

  // Data Risk
  if (context && context.sensitiveForm) {
    pillars.dataRisk = 50;
    warnings.push(`Sensitive form (${context.formType}) detected`);
  }

  // Destination (HTTP/SSL)
  if (!url.startsWith("https://")) {
    pillars.destination = 40;
    warnings.push("Insecure connection (HTTP)");
  }

  // 2. AI Override / Refinement
  // If AI provided pillar scores, we integrate them.
  // We use the MINIMUM of rule-based and AI-based to be "conservative" (Paranoid Mode).
  if (groqAI && groqAI.status === "fulfilled" && groqAI.value.pillars) {
    const ai = groqAI.value.pillars;

    pillars.maturity = ai.maturity ?? pillars.maturity; // Maturity is purely AI-driven
    pillars.destination = Math.min(pillars.destination, ai.destination ?? 100);
    pillars.brand = Math.min(pillars.brand, ai.brand ?? 100);
    pillars.reputation = Math.min(pillars.reputation, ai.reputation ?? 100);
    pillars.pressure = Math.min(pillars.pressure, ai.pressure ?? 100);
    pillars.dataRisk = Math.min(pillars.dataRisk, ai.dataRisk ?? 100);

    if (groqAI.value.threats) warnings.push(...groqAI.value.threats);
  }

  // Final Weighted Calculation
  // Weights: Reputation (25%), Brand (20%), Maturity (15%), Destination (15%), Pressure (10%), DataRisk (15%)
  const finalScore = Math.round(
    pillars.reputation * 0.25 +
      pillars.brand * 0.2 +
      pillars.maturity * 0.15 +
      pillars.destination * 0.15 +
      pillars.pressure * 0.1 +
      pillars.dataRisk * 0.15,
  );

  return {
    safe:
      finalScore >= 85 && sbSafe && pillars.brand > 20 && pillars.maturity > 20,
    safetyScore: finalScore,
    pillars,
    warnings: [...new Set(warnings)],
    recommendation:
      finalScore >= 85 ? "Safe" : finalScore >= 50 ? "Caution" : "Dangerous",
  };
}

// ============================================
// 404 Handler
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    availableEndpoints: ["GET /", "GET /health", "POST /api/check-url"],
  });
});

// ============================================
// Start Server
// ============================================

/**
 * Unshorten a URL by following redirects
 */
async function unshortenUrl(url) {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    return response.request.res.responseUrl || url;
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      return error.response.headers.location || url;
    }
    return url;
  }
}

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🛡️  BrowseSight Server v2.1.2 - Phase 3");
  console.log("=".repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Check URL: POST http://localhost:${PORT}/api/check-url`);
  console.log("=".repeat(50));
  console.log(
    "✅ Google Safe Browsing API: " +
      (process.env.GOOGLE_SAFE_BROWSING_API_KEY
        ? "Configured"
        : "❌ NOT CONFIGURED"),
  );
  console.log(
    "✅ VirusTotal API: " +
      (process.env.VIRUSTOTAL_API_KEY ? "Configured" : "❌ NOT CONFIGURED"),
  );
  console.log("=".repeat(50) + "\n");
});
