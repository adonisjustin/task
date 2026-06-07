# AI Flyer & Advertisement Generator

Takes basic business information and automatically generates a complete advertising package — a professional flyer image plus full marketing copy — in under 60 seconds.

---

## What It Does

The user fills in their business name, type, product/service, target city, optional special offer, and contact info. The system runs it through a 4-step AI pipeline and returns a downloadable flyer plus ready-to-use marketing copy for Facebook and WhatsApp.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | Node.js + Express | Local server, orchestrates everything |
| Text AI | Groq (LLaMA 3.3 70B) | Market research, copywriting, design decisions |
| Image Rendering | Puppeteer (headless Chrome) | Renders HTML flyer templates to PNG |
| Frontend | Vanilla HTML/CSS/JS | User interface, no framework needed |

---

## How It Works — 4 Step AI Pipeline

**Step 1 — Market Research (Groq AI)**
User submits business info. AI analyzes the target market, identifies customer pain points, desires, marketing angles, and recommends an advertising style and color psychology.

**Step 2 — Copywriting (Groq AI)**
Research results feed into a copywriting AI that generates the headline, subheadline, body copy, call-to-action, tagline, Facebook caption, and WhatsApp caption — all tailored to the business.

**Step 3 — Design Decisions (Groq AI)**
A third AI call acts as a print designer. It picks one of 4 flyer templates and generates a full color palette (primary, secondary, accent, text colors) based on the business type and advertising style.

**Step 4 — Flyer Rendering (Puppeteer)**
The chosen template is assembled as an HTML/CSS document with all the copy and colors injected. Puppeteer (headless Chrome) screenshots it at 900x1200px at 2x resolution and returns it as a base64 PNG the user can download.

---

## Flyer Templates

**Classic** — Bold zigzag borders, high contrast, Nigerian market energy. Best for food, retail, general services.

**Bold** — Diagonal slash split layout, two dominant colors. Best for fashion, fitness, fast businesses.

**Elegant** — Ornamental frame border, Playfair serif, luxury feel. Best for premium services, real estate, finance.

**Street** — Urban dark background, giant ghost text watermark, neon accent. Best for youth brands, entertainment, tech.

---

## Output Delivered to User

- Downloadable flyer image (PNG, print-ready)
- Headline + subheadline
- Body copy
- Call-to-action
- Brand tagline
- Facebook caption (ready to post)
- WhatsApp caption (ready to send)
- Full market research breakdown (pain points, desires, marketing angles)

---

## Architecture Principle

Every AI service is an isolated function in `server.js`. To swap Groq for Claude or GPT-4, you edit one function. To swap the renderer for an image AI when a good free API becomes available, you replace one function. The orchestrator that connects the steps never changes.

---

## APIs Evaluated During Development

During testing we evaluated the following image generation APIs before settling on the local Puppeteer renderer:

| API | Result |
|---|---|
| Pollinations.ai | Rate limited / queue full |
| Hugging Face | Network blocked (DNS failure) |
| Google Gemini Image API | Free tier discontinued March 2026 |
| Together AI FLUX.1-schnell-Free | Free period expired |

All were either paywalled, region-blocked, or quota-limited from Nigeria. The final solution uses Puppeteer local rendering which has zero API dependency, zero cost, and zero rate limits for the image step.

---

## Project Structure

```
project/
├── server.js              # Express server + AI orchestrator
├── flyer-templates.js     # 4 HTML flyer templates (classic, bold, elegant, street)
├── package.json
├── .env                   # Your API keys (never commit this)
├── node_modules/
└── public/
    └── index.html         # Frontend UI
```

---

## Setup & Installation

### 1. Install Node.js
Download the LTS version from https://nodejs.org and install it.

Verify:
```bash
node --version
npm --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get a Free Groq API Key
1. Go to https://console.groq.com
2. Sign up with Google or email — no credit card required
3. Click API Keys → Create API Key → copy it

### 4. Create Your .env File
Create a file called `.env` in the project root and add:
```
GROQ_API_KEY=gsk_your_key_here
```

### 5. Run the Server

**Mac / Linux:**
```bash
node server.js
```

**Windows CMD:**
```cmd
node server.js
```

You should see:
```
🚀 Running at http://localhost:3000
```

### 6. Open the App
Go to http://localhost:3000 in your browser.

---

## How to Swap APIs (Modular Design)

To replace Groq with another text AI, edit only the `callGroq()` function in `server.js`.

To add a real image generation API when a free one becomes available, replace the `renderFlyer()` function in `server.js` with a fetch call to the image API. The rest of the system stays the same.

---

## Built With

- Node.js
- Express
- Groq API (LLaMA 3.3 70B)
- Puppeteer
- Google Fonts (Oswald, Montserrat, Playfair Display)