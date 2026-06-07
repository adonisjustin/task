const fetch    = require("node-fetch");
const satori   = require("satori").default;
const sharp    = require("sharp");
const fs       = require("fs");
const path     = require("path");
const https    = require("https");

const CONFIG = {
  groqApiKey:   process.env.GROQ_API_KEY || "",
  groqModel:    "llama-3.3-70b-versatile",
  groqEndpoint: "https://api.groq.com/openai/v1/chat/completions",
};

// ─── Download font as buffer ──────────────────────────────────
function downloadFont(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// ─── Load fonts once ─────────────────────────────────────────
let fontsCache = null;
async function getFonts() {
  if (fontsCache) return fontsCache;
  const [montserratBold, montserratBlack, oswaldBold] = await Promise.all([
    downloadFont("https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff"),
    downloadFont("https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459WdhyyTh89Y.woff"),
    downloadFont("https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs169vsUZiYA.woff"),
  ]);
  fontsCache = [
    { name: "Montserrat", data: montserratBold,  weight: 700, style: "normal" },
    { name: "Montserrat", data: montserratBlack, weight: 900, style: "normal" },
    { name: "Oswald",     data: oswaldBold,      weight: 700, style: "normal" },
  ];
  return fontsCache;
}

// ─── Call Groq ────────────────────────────────────────────────
async function callGroq(system, user) {
  const res = await fetch(CONFIG.groqEndpoint, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${CONFIG.groqApiKey}`,
    },
    body: JSON.stringify({
      model: CONFIG.groqModel, temperature: 0.8, max_tokens: 1500,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
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

// ─── Step 1: Market Research ──────────────────────────────────
async function runMarketResearch(info) {
  const raw = await callGroq(
    "You are an expert market research analyst. Return only valid raw JSON, no markdown.",
    `Analyze this business. Return ONLY this JSON:
{
  "targetAudience": "...", "painPoints": ["...","...","..."],
  "desires": ["...","...","..."], "marketingAngles": ["...","...","..."],
  "advertisingStyle": "...", "colorPsychology": "...", "competitiveEdge": "..."
}
Business: ${info.businessName} | ${info.businessType} | ${info.productService} | ${info.targetCity} | Offer: ${info.specialOffer || "none"}`
  );
  return JSON.parse(raw);
}

// ─── Step 2: Copywriting ──────────────────────────────────────
async function runCopywriting(info, research) {
  const raw = await callGroq(
    "You are an expert advertising copywriter. Return only valid raw JSON, no markdown.",
    `Create ad copy. Return ONLY this JSON:
{
  "headline": "MAX 5 words ALL CAPS",
  "subheadline": "8-12 word benefit statement",
  "bodyText": "2 short punchy sentences",
  "callToAction": "MAX 4 words e.g. CALL NOW",
  "facebookCaption": "80-120 word Facebook post with emojis",
  "whatsappCaption": "40-60 word WhatsApp message with emojis",
  "tagline": "under 5 word brand tagline"
}
Business: ${info.businessName} (${info.businessType}) | Product: ${info.productService}
City: ${info.targetCity} | Offer: ${info.specialOffer || "none"} | Contact: ${info.contact}
Angle: ${research.marketingAngles[0]} | Style: ${research.advertisingStyle}`
  );
  return JSON.parse(raw);
}

// ─── Step 3: Design ───────────────────────────────────────────
async function runDesign(info, research) {
  const raw = await callGroq(
    "You are a professional print designer. Return only valid raw JSON, no markdown.",
    `Pick a design theme for a printed advertising flyer. Return ONLY this JSON:
{
  "style": "3 word design description",
  "primary": "#hex dark background color",
  "secondary": "#hex header/footer color (different from primary)",
  "accent": "#hex bright highlight color that contrasts with both primary and secondary",
  "textLight": "#ffffff or very light hex for text on dark backgrounds",
  "textDark": "#111111 or very dark hex for text on light backgrounds"
}
Rules: primary should be dark/rich. accent must pop. secondary can be slightly lighter than primary.
Business type: ${info.businessType}
Color psychology: ${research.colorPsychology}
Advertising style: ${research.advertisingStyle}`
  );
  return JSON.parse(raw);
}

// ─── Step 4: Render flyer with Satori ────────────────────────
async function renderFlyer(info, copy, design) {
  const fonts  = await getFonts();
  const W      = 900;
  const H      = 1200;
  const offer  = info.specialOffer?.trim();

  // Build JSX-like object tree for Satori
  const node = {
    type: "div",
    props: {
      style: {
        width: W, height: H, display: "flex", flexDirection: "column",
        background: design.primary, fontFamily: "Montserrat", position: "relative",
        overflow: "hidden",
      },
      children: [

        // ── TOP ACCENT LINE ──
        { type: "div", props: { style: { width: "100%", height: 10, background: design.accent } } },

        // ── HEADER ──
        {
          type: "div",
          props: {
            style: {
              background: design.secondary, padding: "32px 50px 24px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: `5px solid ${design.accent}`,
            },
            children: [
              {
                type: "div", props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    { type: "div", props: { style: { fontSize: 44, fontWeight: 900, color: design.textLight, fontFamily: "Oswald", letterSpacing: 2, textTransform: "uppercase" }, children: info.businessName } },
                    { type: "div", props: { style: { fontSize: 13, fontWeight: 700, color: design.accent, letterSpacing: 4, textTransform: "uppercase", marginTop: 4 }, children: info.businessType } },
                  ],
                },
              },
              { type: "div", props: { style: { fontSize: 13, fontWeight: 700, color: design.textLight, opacity: 0.6, letterSpacing: 2, textTransform: "uppercase" }, children: info.targetCity } },
            ],
          },
        },

        // ── OFFER STRIP (if exists) ──
        ...(offer ? [{
          type: "div",
          props: {
            style: { background: design.accent, padding: "14px 50px", display: "flex", alignItems: "center", gap: 12 },
            children: [
              { type: "div", props: { style: { fontSize: 20, fontWeight: 900, color: design.primary, fontFamily: "Oswald", textTransform: "uppercase", letterSpacing: 2 }, children: `🔥 ${offer.toUpperCase()} 🔥` } },
            ],
          },
        }] : []),

        // ── HEADLINE BLOCK ──
        {
          type: "div",
          props: {
            style: { padding: "44px 50px 24px", display: "flex", flexDirection: "column" },
            children: [
              { type: "div", props: { style: { fontSize: 11, fontWeight: 700, color: design.accent, letterSpacing: 6, textTransform: "uppercase", marginBottom: 16 }, children: "✦  Advertisement  ✦" } },
              { type: "div", props: { style: { fontSize: 86, fontWeight: 900, color: design.textLight, fontFamily: "Oswald", textTransform: "uppercase", lineHeight: 0.9, letterSpacing: -2 }, children: copy.headline } },
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 16, margin: "20px 0" },
                  children: [
                    { type: "div", props: { style: { flex: 1, height: 2, background: design.accent } } },
                    { type: "div", props: { style: { fontSize: 18, color: design.accent }, children: "★★★★★" } },
                    { type: "div", props: { style: { flex: 1, height: 2, background: design.accent } } },
                  ],
                },
              },
              { type: "div", props: { style: { fontSize: 22, fontWeight: 700, color: design.textLight, opacity: 0.85, lineHeight: 1.4 }, children: copy.subheadline } },
            ],
          },
        },

        // ── BODY TEXT BOX ──
        {
          type: "div",
          props: {
            style: { margin: "0 50px", padding: "20px 24px", border: `2px solid ${design.accent}50`, display: "flex", flexDirection: "column", gap: 8 },
            children: [
              { type: "div", props: { style: { fontSize: 12, fontWeight: 700, color: design.accent, letterSpacing: 4, textTransform: "uppercase" }, children: "▶  About Our Service" } },
              { type: "div", props: { style: { fontSize: 17, color: design.textLight, opacity: 0.8, lineHeight: 1.65 }, children: copy.bodyText } },
            ],
          },
        },

        // ── FEATURES ROW ──
        {
          type: "div",
          props: {
            style: { display: "flex", margin: "24px 50px", gap: 10 },
            children: ["✅ Quality", "⚡ Speed", "💯 Best Price", "🏆 Top Rated"].map(f => ({
              type: "div",
              props: {
                style: { flex: 1, background: design.secondary, border: `2px solid ${design.accent}60`, padding: "12px 8px", display: "flex", alignItems: "center", justifyContent: "center" },
                children: [{ type: "div", props: { style: { fontSize: 12, fontWeight: 700, color: design.textLight, textAlign: "center" }, children: f } }],
              },
            })),
          },
        },

        // ── CTA BUTTON ──
        {
          type: "div",
          props: {
            style: { display: "flex", justifyContent: "center", margin: "0 50px 24px" },
            children: [{
              type: "div",
              props: {
                style: { background: design.accent, padding: "22px 60px", display: "flex", alignItems: "center", justifyContent: "center" },
                children: [{ type: "div", props: { style: { fontSize: 28, fontWeight: 900, color: design.primary, fontFamily: "Oswald", letterSpacing: 4, textTransform: "uppercase" }, children: `📞 ${copy.callToAction}` } }],
              },
            }],
          },
        },

        // ── SPACER ──
        { type: "div", props: { style: { flex: 1 } } },

        // ── BOTTOM ACCENT ──
        { type: "div", props: { style: { width: "100%", height: 6, background: design.accent } } },

        // ── FOOTER ──
        {
          type: "div",
          props: {
            style: { background: design.secondary, padding: "18px 50px", display: "flex", justifyContent: "space-between", alignItems: "center" },
            children: [
              {
                type: "div", props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    { type: "div", props: { style: { fontSize: 11, fontWeight: 700, color: design.accent, letterSpacing: 3, textTransform: "uppercase" }, children: "Contact Us" } },
                    { type: "div", props: { style: { fontSize: 22, fontWeight: 900, color: design.textLight, fontFamily: "Oswald", letterSpacing: 1 }, children: info.contact } },
                  ],
                },
              },
              {
                type: "div", props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
                  children: [
                    { type: "div", props: { style: { fontSize: 11, fontWeight: 700, color: design.accent, letterSpacing: 3, textTransform: "uppercase" }, children: "Location" } },
                    { type: "div", props: { style: { fontSize: 16, fontWeight: 700, color: design.textLight }, children: `📍 ${info.targetCity}` } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(node, { width: W, height: H, fonts });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

// ─── Vercel Handler ───────────────────────────────────────────
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!CONFIG.groqApiKey) return res.status(500).json({ error: "GROQ_API_KEY not set in Vercel environment variables" });

    const info = req.body;
    for (const k of ["businessName","businessType","productService","targetCity","contact"]) {
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