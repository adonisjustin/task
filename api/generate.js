const fetch = require("node-fetch");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const { getTemplate } = require("./flyer-templates");

// ─── CONFIG ───────────────────────────────────────────────────
const CONFIG = {
  groqApiKey:   process.env.GROQ_API_KEY || "",
  groqModel:    "llama-3.3-70b-versatile",
  groqEndpoint: "https://api.groq.com/openai/v1/chat/completions",
};

// ─── HELPER: Call Groq ────────────────────────────────────────
async function callGroq(system, user) {
  const res = await fetch(CONFIG.groqEndpoint, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${CONFIG.groqApiKey}`,
    },
    body: JSON.stringify({
      model:       CONFIG.groqModel,
      temperature: 0.8,
      max_tokens:  1500,
      messages: [
        { role: "system", content: system },
        { role: "user",   content: user   },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${res.status}`);
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || "")
    .replace(/```json\n?|\n?```/g, "").trim();
}

// ─── STEP 1: Market Research ──────────────────────────────────
async function runMarketResearch(info) {
  const raw = await callGroq(
    "You are an expert market research analyst. Return only valid raw JSON, no markdown.",
    `Analyze this business. Return ONLY this JSON shape:
{
  "targetAudience": "...",
  "painPoints": ["...","...","..."],
  "desires": ["...","...","..."],
  "marketingAngles": ["...","...","..."],
  "advertisingStyle": "...",
  "colorPsychology": "...",
  "competitiveEdge": "..."
}
Business: ${info.businessName} | ${info.businessType} | ${info.productService} | ${info.targetCity} | Offer: ${info.specialOffer || "none"}`
  );
  return JSON.parse(raw);
}

// ─── STEP 2: Copywriting ──────────────────────────────────────
async function runCopywriting(info, research) {
  const raw = await callGroq(
    "You are an expert advertising copywriter. Return only valid raw JSON, no markdown.",
    `Create ad copy. Return ONLY this JSON shape:
{
  "headline": "MAX 6 words ALL CAPS punchy headline",
  "subheadline": "benefit statement 8-12 words",
  "bodyText": "2 short punchy persuasive sentences",
  "callToAction": "MAX 5 words e.g. CALL NOW ORDER TODAY",
  "facebookCaption": "80-120 word Facebook post with emojis",
  "whatsappCaption": "40-60 word WhatsApp message with emojis",
  "tagline": "under 6 word memorable brand tagline"
}
Business: ${info.businessName} (${info.businessType}) | Product: ${info.productService}
City: ${info.targetCity} | Offer: ${info.specialOffer || "none"} | Contact: ${info.contact}
Angle: ${research.marketingAngles[0]} | Style: ${research.advertisingStyle} | Edge: ${research.competitiveEdge}`
  );
  return JSON.parse(raw);
}

// ─── STEP 3: Design Decisions ─────────────────────────────────
async function runDesign(info, research) {
  const raw = await callGroq(
    "You are a professional print designer. Return only valid raw JSON, no markdown.",
    `Pick design settings for a printed advertising flyer. Return ONLY this JSON:
{
  "template": "one of: classic | bold | elegant | street",
  "primaryColor": "#hex — main background",
  "secondaryColor": "#hex — header/footer background",
  "accentColor": "#hex — buttons and highlights",
  "textColor": "#hex — main text color",
  "lightColor": "#hex — subtle tint for panels"
}
Business type: ${info.businessType}
Advertising style: ${research.advertisingStyle}
Color psychology: ${research.colorPsychology}`
  );
  return JSON.parse(raw);
}

// ─── STEP 4: Render Flyer via Puppeteer ───────────────────────
async function renderFlyer(info, copy, design) {
  const colors = {
    primary:   design.primaryColor,
    secondary: design.secondaryColor,
    accent:    design.accentColor,
    text:      design.textColor,
    light:     design.lightColor,
  };

  const body = getTemplate(design.template, info, copy, colors);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
<style>* { margin:0; padding:0; box-sizing:border-box; } body { width:900px; overflow:hidden; }</style>
</head>
<body>${body}</body>
</html>`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 900, height: 1200, deviceScaleFactor: 2 },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const png = await page.screenshot({ type: "png", encoding: "base64", fullPage: false });
    return `data:image/png;base64,${png}`;
  } finally {
    await browser.close();
  }
}

// ─── VERCEL HANDLER ───────────────────────────────────────────
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!CONFIG.groqApiKey) return res.status(500).json({ error: "GROQ_API_KEY not set in Vercel environment variables" });

    const info = req.body;
    for (const k of ["businessName", "businessType", "productService", "targetCity", "contact"]) {
      if (!info[k]?.trim()) return res.status(400).json({ error: `Missing field: ${k}` });
    }

    console.log(`Generating for: ${info.businessName}`);

    const research    = await runMarketResearch(info);
    const copy        = await runCopywriting(info, research);
    const design      = await runDesign(info, research);
    const flyerBase64 = await renderFlyer(info, copy, design);

    res.status(200).json({ research, copy, design, flyerBase64 });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};