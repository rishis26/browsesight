# 🛡️ BrowseSight

> **Real-time scam detection for the modern web. Browse with confidence.**

BrowseSight is a privacy-first browser extension that helps users identify scams, phishing attempts, and security risks across Google Search, Gmail, and websites - without blocking access or forcing decisions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
- [Deployment](#deployment)
- [API Integrations](#api-integrations)
- [Security & Privacy](#security--privacy)
- [Roadmap](#roadmap)
- [License](#license)

---

## 🎯 Overview

**BrowseSight** addresses a critical gap in online security: most scams succeed because users are pressured into quick decisions, and existing security warnings are either too technical or appear too late.

BrowseSight acts as a **real-time trust intelligence layer** that provides:

- ✅ Visual risk indicators at the moment of interaction
- ✅ Simple, explainable warnings without technical jargon
- ✅ Contextual guidance that respects user autonomy
- ✅ Privacy-first architecture with no data collection

### What Makes BrowseSight Different?

| Traditional Security Tools    | BrowseSight                                       |
| ----------------------------- | ------------------------------------------------- |
| ❌ Blocks websites outright   | ✅ Recommends, never forces                       |
| ❌ Technical, scary warnings  | ✅ Clear, human-readable explanations             |
| ❌ One-size-fits-all approach | ✅ Adaptive warning tone based on context         |
| ❌ Privacy concerns           | ✅ Privacy-first, local processing where possible |

---

## 🧭 Core Philosophy

### **"Recommend, Not Force"**

BrowseSight is built on the principle of **user empowerment**, not restriction:

- 🚫 **No blocking websites** - Users always have the final say
- 🚫 **No forcing user actions** - Guidance, not mandates
- 🚫 **No disabling browser security** - Works alongside existing protections
- ✅ **User choice respected** - Every decision is yours to make
- 🔒 **Privacy first** - Minimal data collection, transparent processing

---

## 📁 Project Structure

```
browsesight/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── context.json                   # Project context & feature definitions
├── feature.json                   # Feature list
├── README.md                      # This file
│
├── Browsesight/                   # 🔌 Browser Extension (Chrome/Edge/Brave)
│   ├── manifest.json              # Extension manifest (v3)
│   ├── background.js              # Background service worker
│   ├── content.js                 # Unified content script
│   ├── content.css                # Styles for injection (Toast, Modal, Badges)
│   ├── popup.html                 # Extension popup UI
│   ├── popup.js                   # Popup logic
│   ├── popup.css                  # Popup styles
│   ├── asset/                     # Images (siren.png)
│   └── icons/                     # Icons
│
├── Server/                        # 🖥️ Backend API Server
│   ├── server.js                  # Monolithic Express server (API & Logic)
│   ├── .env.example               # Environment variables template
│   ├── PHASES.md                  # Development phases documentation
│   └── public/                    # Static assets
│
└── browsesight_website/           # 🌐 Landing Page Website (React)
    ├── public/                    # Static assets
    ├── src/                       # React source code
    ├── content.json               # Content data
    ├── package.json               # Dependencies
    ├── tailwind.config.js         # Tailwind configuration
    └── README.md                  # Frontend-specific docs
```

---

## ✨ Features

BrowseSight includes **60+ security features** organized across multiple categories:

### 🔍 Search Protection (Google Search)

- Scam type labels on search results
- Duplicate domain lookalike alerts
- Brand impersonation detection
- Multi-source trust scores
- Color-coded risk indicators
- Link hover risk previews
- Redirect transparency indicators
- Urgency phrase highlighting
- Safe alternative suggestions
- Visual character difference highlighting
- Intent vs. page mismatch detection
- Domain naming psychology analysis
- Search result trust gap indicators

### ✉️ Email Security (Gmail)

- Sender confidence badges
- Gmail sender verification
- Email scam type classification
- Mail purpose prediction
- Conversation hijack alerts
- Sender identity drift detection
- Hidden deadline detection
- Urgency language highlighting
- Email link destination previews
- SPF/DKIM/DMARC authentication checks
- Attachment risk indicators
- Reply consequence previews
- Email chain risk accumulation
- Mail authenticity timelines
- Cross-link correlation
- Cross-language consistency checks
- One-line AI risk explanations

### 🌐 Website Safety

- Real-time page analysis
- Form purpose declarations
- Data density alerts
- Human vs. bot page signals
- Trust history memory
- Privacy leak alerts
- Context switch alerts
- Link aging warnings
- Soft repeat warnings
- Passive risk indicator mode
- Warning toast notification

### 👤 User Interaction & Behavior

- User choice confirmation with countdown
- "Go back" recommendations
- "Proceed anyway" option after delay
- Adaptive warning tone
- Safe exit buttons
- Manual verify buttons
- Session risk tracking
- Decision delay measurement
- Session-end safety summaries
- Post-decision feedback loops

### 📊 Reporting & Evidence

- Export scam summaries (FIR-ready format)
- Screenshot evidence capture
- Quick evidence bundle generation
- Incident timeline generation

---

## 🛠️ Technology Stack

### Browser Extension

- **Manifest Version**: V3
- **Languages**: JavaScript (ES6+), HTML5, CSS3
- **Browser APIs**: Chrome Extension APIs, Web APIs
- **Supported Browsers**: Chrome, Edge, Brave, Opera

### Backend Server

- **Runtime**: Node.js
- **Framework**: Express.js
- **APIs**: RESTful architecture
- **Authentication**: API key-based
- **Hosting**: TBD (Vercel, Railway, or similar)

### Frontend Website

- **Framework**: React 19.2.3
- **Build Tool**: Create React App
- **Styling**: Tailwind CSS, Framer Motion
- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Hosting**: Vercel
- **Theme**: Dark-first cybersecurity aesthetic

---

## 🏗️ Architecture

### High-Level Flow

```
User Browser
    ↓
Browser Extension (Content Scripts)
    ↓
Background Service Worker
    ↓
Backend API Server
    ↓
External APIs (Groq, VirusTotal, etc.)
    ↓
Response → UI Overlay → User Decision
```

### Component Interactions

1. **Content Scripts** inject into Gmail, Google Search, and websites
2. **Background Worker** handles API calls and data processing
3. **Backend Server** aggregates threat intelligence from multiple sources
4. **AI Analysis** (Groq) provides human-readable risk explanations
5. **UI Overlays** display warnings and recommendations in context

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm/bun
- Git
- API keys for:
  - Groq API
  - VirusTotal API
  - Google Safe Browsing API
  - OpenAI API (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/rishis26/browsesight.git
cd browsesight
```

### 2. Backend Server Setup

```bash
cd Server
npm install
# Create .env file with API keys
npm start
```

### 3. Frontend Website Setup

```bash
cd browsesight_website
npm install
npm start  # Development server
npm run build  # Production build
```

### 4. Browser Extension Setup

```bash
cd Browsesight
# No build step required for development
```

**Load Extension in Browser:**

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `Browsesight/` folder

---

## 🌐 Deployment

### Frontend (Vercel)

- Connected to GitHub repository
- Auto-deploys on push to `main` branch
- Environment: Production
- Domain: TBD

### Backend (TBD)

- Options: Vercel Serverless, Railway, Render
- Requires environment variables for API keys
- CORS configured for extension origin

### Extension Distribution

- **Private Repo**: Full source code (this repository)
- **Public Repo**: Separate repository with only:
  - `BrowseSight.zip` (packaged extension)
  - `README.md` (installation guide)

---

## 🔌 API Integrations

### Groq API

- **Purpose**: AI inference for scam classification, intent detection, language analysis
- **Models**: Llama 3, Mixtral
- **Use Cases**: Adaptive warning tone, behavioral understanding

### VirusTotal API

- **Purpose**: Domain and URL reputation intelligence
- **Engines**: 70+ security vendors
- **Rate Limits**: Managed via backend caching

### Google Safe Browsing API

- **Purpose**: Baseline malicious URL verification
- **Coverage**: Phishing, malware, unwanted software

### OpenAI ChatGPT API

- **Purpose**: Human-readable explanations, FIR-ready summaries
- **Models**: GPT-4 or GPT-3.5-turbo
- **Use Cases**: Incident timelines, scam reports

### Gmail API

- **Purpose**: Email metadata extraction, sender verification
- **Scope**: Read-only access to email headers

### ICANN RDAP/WHOIS

- **Purpose**: Domain age and registration intelligence
- **Data**: Registrar, creation date, expiration

### DNS (SPF/DKIM/DMARC)

- **Purpose**: Email authentication checks
- **Detection**: Spoofed senders, email forgery

---

## 🔒 Security & Privacy

### Privacy Guarantees

- ✅ **No data collection**: BrowseSight does not store user browsing history
- ✅ **Local processing**: Most analysis happens client-side
- ✅ **Minimal API calls**: Only suspicious content is sent to backend
- ✅ **No tracking**: No analytics, no cookies, no fingerprinting
- ✅ **Transparent**: Open-source code, auditable architecture

### Security Measures

- 🔐 **API key rotation**: Regular key updates
- 🔐 **HTTPS only**: All communications encrypted
- 🔐 **Content Security Policy**: Strict CSP headers
- 🔐 **Input validation**: All user inputs sanitized
- 🔐 **Rate limiting**: Protection against abuse

---

## 🗺️ Roadmap

### Current Status: Development Phase

- [x] Project architecture defined
- [x] Feature set documented (60+ features)
- [x] Repository structure established
- [ ] Browser extension core functionality
- [ ] Backend API implementation
- [ ] Frontend website design & development
- [ ] API integrations (Groq, VirusTotal, etc.)
- [ ] Testing & QA
- [ ] Beta release
- [ ] Public launch

### Future Features (Yellow List)

These features are **not** part of the initial release but represent long-term vision:

- 🔮 Community Scam Trend Feed
- 🔮 Trust Fatigue Monitor
- 🔮 Enterprise/Campus Admin Dashboard
- 🔮 Consent-Based Phishing Simulation Mode
- 🔮 Live Scam Heatmap

---

## 📄 License

**Private Repository** - All rights reserved.

This is a private project. The source code is not licensed for public use, modification, or distribution.

A separate public repository will be created for extension distribution with appropriate licensing.

---

## 👨‍💻 Author

**Rishi Shah**
GitHub: [@rishis26](https://github.com/rishis26)

---

## 🙏 Acknowledgments

- **Groq** for fast AI inference
- **VirusTotal** for comprehensive threat intelligence
- **Google Safe Browsing** for baseline security
- **OpenAI** for natural language processing
- The open-source community for inspiration and tools

---

## 📞 Contact & Support

For questions, issues, or collaboration:

- **GitHub Issues**: [browsesight/issues](https://github.com/rishis26/browsesight/issues)
- **Email**: TBD

---

<div align="center">

**Made with ❤️ for safer browsing**

[Website](https://browsesight.vercel.app) • [Download](https://browsesight.vercel.app/#download)

</div>
