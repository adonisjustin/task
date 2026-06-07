// ── FLYER TEMPLATES — each returns a complete HTML string ────
// All look like real printed advertisements, not websites

function getTemplate(templateId, info, copy, colors) {
  const templates = { classic, bold, elegant, street };
  const fn = templates[templateId] || templates.classic;
  return fn(info, copy, colors);
}

// ── TEMPLATE 1: CLASSIC NIGERIAN MARKET STYLE ───────────────
function classic(info, copy, colors) {
  const { primary, secondary, accent, text, light } = colors;
  const offer = info.specialOffer
    ? `<div class="offer-strip">🔥 ${info.specialOffer.toUpperCase()} 🔥</div>` : "";

  return `
  <div style="
    width:900px;height:1200px;overflow:hidden;position:relative;
    background:${primary};font-family:'Montserrat',sans-serif;
  ">
    <!-- TOP ZIGZAG BORDER -->
    <svg style="position:absolute;top:0;left:0;width:100%" viewBox="0 0 900 40" preserveAspectRatio="none">
      <polygon points="0,0 900,0 900,40 870,20 840,40 810,20 780,40 750,20 720,40 690,20 660,40 630,20 600,40 570,20 540,40 510,20 480,40 450,20 420,40 390,20 360,40 330,20 300,40 270,20 240,40 210,20 180,40 150,20 120,40 90,20 60,40 30,20 0,40" fill="${secondary}"/>
    </svg>

    <!-- HEADER -->
    <div style="
      background:${secondary};padding:55px 50px 22px;text-align:center;
      border-bottom:6px solid ${accent};
    ">
      <div style="font-size:13px;font-weight:800;letter-spacing:6px;color:${accent};text-transform:uppercase;margin-bottom:6px">
        ✦ Official Advertisement ✦
      </div>
      <div style="font-size:52px;font-weight:900;color:${text};letter-spacing:2px;text-transform:uppercase;line-height:1;font-family:'Oswald',sans-serif">
        ${info.businessName}
      </div>
      <div style="font-size:14px;font-weight:600;color:${accent};letter-spacing:4px;text-transform:uppercase;margin-top:6px">
        ${info.businessType} • ${info.targetCity}
      </div>
    </div>

    <!-- OFFER STRIP -->
    ${info.specialOffer ? `
    <div style="
      background:${accent};color:${secondary};font-size:20px;font-weight:900;
      text-align:center;padding:14px;letter-spacing:3px;text-transform:uppercase;
      font-family:'Oswald',sans-serif;
    ">
      🔥 ${info.specialOffer.toUpperCase()} 🔥
    </div>` : ""}

    <!-- MAIN VISUAL AREA -->
    <div style="
      background:linear-gradient(160deg,${light}18,${secondary}40);
      padding:36px 50px;text-align:center;border-bottom:4px dashed ${accent}40;
    ">
      <!-- BIG HEADLINE -->
      <div style="
        font-size:78px;font-weight:900;font-family:'Oswald',sans-serif;
        text-transform:uppercase;line-height:0.9;letter-spacing:-1px;
        color:${text};text-shadow:4px 4px 0px ${accent}50;margin-bottom:16px;
      ">
        ${copy.headline.split(" ").slice(0,3).join("<br>")}
      </div>
      <div style="
        font-size:78px;font-weight:900;font-family:'Oswald',sans-serif;
        text-transform:uppercase;line-height:0.9;letter-spacing:-1px;
        color:${accent};text-shadow:4px 4px 0px ${secondary};
      ">
        ${copy.headline.split(" ").slice(3).join(" ")}
      </div>

      <!-- HORIZONTAL RULE -->
      <div style="display:flex;align-items:center;gap:12px;margin:20px 0">
        <div style="flex:1;height:2px;background:${accent}"></div>
        <div style="font-size:22px">⭐⭐⭐⭐⭐</div>
        <div style="flex:1;height:2px;background:${accent}"></div>
      </div>

      <div style="font-size:22px;font-weight:600;color:${text};line-height:1.4;max-width:680px;margin:0 auto">
        ${copy.subheadline}
      </div>
    </div>

    <!-- PRODUCT INFO BOX -->
    <div style="
      margin:28px 50px;background:${light}15;
      border:2px solid ${accent}60;border-radius:6px;padding:22px 28px;
    ">
      <div style="font-size:13px;font-weight:800;color:${accent};letter-spacing:4px;text-transform:uppercase;margin-bottom:10px">
        ▶ About Our Service
      </div>
      <div style="font-size:17px;color:${text};line-height:1.7;font-weight:400">
        ${copy.bodyText}
      </div>
    </div>

    <!-- 3-COLUMN FEATURES -->
    <div style="display:flex;margin:0 50px 24px;gap:12px">
      ${["✅ Quality Guaranteed","⚡ Fast Delivery","💯 Best Prices"].map(f => `
        <div style="
          flex:1;background:${secondary};border:2px solid ${accent};
          border-radius:4px;padding:14px 10px;text-align:center;
        ">
          <div style="font-size:13px;font-weight:700;color:${text};letter-spacing:1px">${f}</div>
        </div>
      `).join("")}
    </div>

    <!-- CTA BUTTON -->
    <div style="text-align:center;margin:0 50px 24px">
      <div style="
        display:inline-block;background:${accent};color:${secondary};
        font-size:28px;font-weight:900;font-family:'Oswald',sans-serif;
        padding:20px 60px;letter-spacing:4px;text-transform:uppercase;
        border:4px solid ${text}30;
        box-shadow:6px 6px 0px ${secondary};
      ">
        📞 ${copy.callToAction}
      </div>
    </div>

    <!-- BOTTOM ZIGZAG -->
    <svg style="position:absolute;bottom:80px;left:0;width:100%" viewBox="0 0 900 20" preserveAspectRatio="none">
      <polygon points="0,20 30,0 60,20 90,0 120,20 150,0 180,20 210,0 240,20 270,0 300,20 330,0 360,20 390,0 420,20 450,0 480,20 510,0 540,20 570,0 600,20 630,0 660,20 690,0 720,20 750,0 780,20 810,0 840,20 870,0 900,20" fill="${secondary}"/>
    </svg>

    <!-- FOOTER CONTACT BAND -->
    <div style="
      position:absolute;bottom:0;left:0;right:0;
      background:${secondary};border-top:6px solid ${accent};
      padding:16px 50px;display:flex;justify-content:space-between;align-items:center;
    ">
      <div>
        <div style="font-size:11px;font-weight:700;color:${accent};letter-spacing:3px;text-transform:uppercase">Contact Us</div>
        <div style="font-size:22px;font-weight:800;color:${text};font-family:'Oswald',sans-serif;letter-spacing:1px">${info.contact}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;font-weight:700;color:${accent};letter-spacing:3px;text-transform:uppercase">Location</div>
        <div style="font-size:16px;font-weight:700;color:${text}">📍 ${info.targetCity}</div>
      </div>
    </div>
  </div>`;
}

// ── TEMPLATE 2: BOLD SPLIT DESIGN ───────────────────────────
function bold(info, copy, colors) {
  const { primary, secondary, accent, text } = colors;
  return `
  <div style="width:900px;height:1200px;overflow:hidden;position:relative;font-family:'Montserrat',sans-serif;background:${primary}">

    <!-- LEFT COLOR BLOCK -->
    <div style="position:absolute;left:0;top:0;width:420px;height:100%;background:${secondary}"></div>

    <!-- DIAGONAL SLASH -->
    <svg style="position:absolute;left:340px;top:0;height:100%;width:160px;z-index:2" viewBox="0 0 160 1200" preserveAspectRatio="none">
      <polygon points="80,0 160,0 80,1200 0,1200" fill="${primary}"/>
      <polygon points="60,0 100,0 40,1200 0,1200" fill="${accent}" opacity="0.3"/>
    </svg>

    <!-- LEFT SIDE CONTENT -->
    <div style="position:absolute;left:0;top:0;width:400px;height:100%;padding:50px 40px;z-index:3;display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div style="font-size:11px;font-weight:800;color:${accent};letter-spacing:5px;text-transform:uppercase;margin-bottom:20px">✦ Est. ${new Date().getFullYear()}</div>
        <div style="font-size:44px;font-weight:900;color:${text};font-family:'Oswald',sans-serif;text-transform:uppercase;line-height:1;letter-spacing:1px;margin-bottom:8px">
          ${info.businessName}
        </div>
        <div style="font-size:13px;font-weight:700;color:${accent};letter-spacing:3px;text-transform:uppercase;border-top:2px solid ${accent};padding-top:10px;margin-top:10px">
          ${info.businessType}
        </div>
      </div>

      <div>
        <div style="font-size:72px;font-weight:900;font-family:'Oswald',sans-serif;color:${text};text-transform:uppercase;line-height:0.9;letter-spacing:-2px">
          ${copy.headline.replace(/ /g,"<br>")}
        </div>
      </div>

      <div>
        <div style="height:3px;background:${accent};margin-bottom:16px"></div>
        <div style="font-size:16px;color:${text};opacity:0.85;line-height:1.6;margin-bottom:20px">${copy.bodyText}</div>
        <div style="font-size:11px;font-weight:800;color:${accent};letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Contact</div>
        <div style="font-size:20px;font-weight:700;color:${text}">${info.contact}</div>
        <div style="font-size:13px;color:${text};opacity:0.7;margin-top:4px">📍 ${info.targetCity}</div>
      </div>
    </div>

    <!-- RIGHT SIDE CONTENT -->
    <div style="position:absolute;right:0;top:0;width:440px;height:100%;padding:50px 40px 50px 60px;z-index:3;display:flex;flex-direction:column;justify-content:space-between">
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:700;color:${accent};letter-spacing:3px;text-transform:uppercase">Premium Quality</div>
        <div style="font-size:72px;margin:10px 0">⭐</div>
      </div>

      <div>
        <div style="font-size:18px;font-weight:700;color:${text};font-style:italic;margin-bottom:24px;line-height:1.4">"${copy.subheadline}"</div>

        ${info.specialOffer ? `
        <div style="background:${accent};padding:16px 20px;margin-bottom:24px;border-radius:4px">
          <div style="font-size:11px;font-weight:800;color:${secondary};letter-spacing:3px;text-transform:uppercase">Special Offer</div>
          <div style="font-size:22px;font-weight:900;color:${secondary};font-family:'Oswald',sans-serif;text-transform:uppercase">${info.specialOffer}</div>
        </div>` : ""}

        ${["Quality","Speed","Value","Trust"].map(w => `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:8px;height:8px;background:${accent};flex-shrink:0"></div>
            <div style="font-size:14px;font-weight:600;color:${text}">${w} Guaranteed</div>
          </div>
        `).join("")}
      </div>

      <div style="background:${accent};padding:20px;text-align:center">
        <div style="font-size:13px;font-weight:800;color:${secondary};letter-spacing:3px;text-transform:uppercase;margin-bottom:6px">Act Now</div>
        <div style="font-size:26px;font-weight:900;color:${secondary};font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:2px">
          ${copy.callToAction}
        </div>
      </div>
    </div>
  </div>`;
}

// ── TEMPLATE 3: ELEGANT LUXURY ───────────────────────────────
function elegant(info, copy, colors) {
  const { primary, secondary, accent, text, light } = colors;
  return `
  <div style="width:900px;height:1200px;overflow:hidden;position:relative;font-family:'Montserrat',sans-serif;background:${primary}">

    <!-- BORDER FRAME -->
    <div style="position:absolute;inset:16px;border:1px solid ${accent}50;pointer-events:none;z-index:10"></div>
    <div style="position:absolute;inset:22px;border:1px solid ${accent}25;pointer-events:none;z-index:10"></div>

    <!-- CORNER ORNAMENTS -->
    ${["top:12px;left:12px","top:12px;right:12px","bottom:12px;left:12px","bottom:12px;right:12px"].map(pos => `
      <div style="position:absolute;${pos};font-size:20px;color:${accent};z-index:11">✦</div>
    `).join("")}

    <!-- CONTENT -->
    <div style="position:absolute;inset:40px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center">

      <!-- TOP -->
      <div style="width:100%">
        <div style="font-size:11px;font-weight:700;color:${accent};letter-spacing:8px;text-transform:uppercase;margin-bottom:16px">
          ✦ &nbsp; Presenting &nbsp; ✦
        </div>
        <div style="font-size:58px;font-weight:900;color:${text};font-family:'Playfair Display',serif;line-height:1;margin-bottom:8px">
          ${info.businessName}
        </div>
        <div style="font-size:13px;color:${accent};letter-spacing:5px;text-transform:uppercase">
          ${info.businessType} &nbsp;|&nbsp; ${info.targetCity}
        </div>
        <div style="height:1px;background:linear-gradient(90deg,transparent,${accent},transparent);margin:20px auto;width:60%"></div>
      </div>

      <!-- MIDDLE -->
      <div style="width:100%">
        <div style="font-size:68px;font-weight:900;font-family:'Playfair Display',serif;color:${text};line-height:1;margin-bottom:8px">
          ${copy.headline}
        </div>
        <div style="font-size:20px;color:${accent};font-style:italic;margin-bottom:24px">${copy.subheadline}</div>

        ${info.specialOffer ? `
        <div style="
          border:2px solid ${accent};padding:16px 32px;display:inline-block;margin-bottom:24px;
          background:${accent}15;
        ">
          <div style="font-size:11px;font-weight:700;color:${accent};letter-spacing:4px;text-transform:uppercase;margin-bottom:4px">Exclusive Offer</div>
          <div style="font-size:24px;font-weight:800;color:${text}">${info.specialOffer}</div>
        </div>` : ""}

        <div style="font-size:16px;color:${text};opacity:0.8;line-height:1.8;max-width:580px;margin:0 auto 24px">
          ${copy.bodyText}
        </div>
      </div>

      <!-- BOTTOM -->
      <div style="width:100%">
        <div style="height:1px;background:linear-gradient(90deg,transparent,${accent},transparent);margin-bottom:24px"></div>
        <div style="
          background:${accent};color:${primary};
          font-size:22px;font-weight:800;letter-spacing:4px;text-transform:uppercase;
          padding:18px 48px;display:inline-block;margin-bottom:24px;font-family:'Oswald',sans-serif;
        ">
          ${copy.callToAction}
        </div>
        <div style="font-size:14px;color:${accent};font-style:italic;margin-bottom:8px">"${copy.tagline}"</div>
        <div style="font-size:18px;font-weight:700;color:${text}">${info.contact}</div>
        <div style="font-size:12px;color:${text};opacity:0.5;margin-top:4px">📍 ${info.targetCity}</div>
      </div>
    </div>
  </div>`;
}

// ── TEMPLATE 4: STREET/URBAN ─────────────────────────────────
function street(info, copy, colors) {
  const { primary, secondary, accent, text } = colors;
  return `
  <div style="width:900px;height:1200px;overflow:hidden;position:relative;font-family:'Montserrat',sans-serif;background:${primary}">

    <!-- BACKGROUND PATTERN: BIG REPEATED LETTERS -->
    <div style="
      position:absolute;inset:0;font-family:'Oswald',sans-serif;font-size:120px;font-weight:900;
      color:${text}06;text-transform:uppercase;word-break:break-all;line-height:1;
      overflow:hidden;padding:20px;letter-spacing:-2px;
    ">
      ${(info.businessName + " ").repeat(20)}
    </div>

    <!-- TOP ACCENT BAR -->
    <div style="height:12px;background:${accent}"></div>

    <!-- HEADER -->
    <div style="padding:30px 50px;border-bottom:2px solid ${accent}40">
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div>
          <div style="font-size:11px;font-weight:800;color:${accent};letter-spacing:5px;text-transform:uppercase">Official Ad</div>
          <div style="font-size:46px;font-weight:900;color:${text};font-family:'Oswald',sans-serif;text-transform:uppercase;line-height:1">
            ${info.businessName}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:13px;font-weight:700;color:${accent};letter-spacing:2px;text-transform:uppercase">${info.businessType}</div>
          <div style="font-size:13px;color:${text};opacity:0.6">📍 ${info.targetCity}</div>
        </div>
      </div>
    </div>

    <!-- BIG HEADLINE BLOCK -->
    <div style="padding:40px 50px 20px;position:relative">
      <div style="
        font-size:100px;font-weight:900;font-family:'Oswald',sans-serif;
        text-transform:uppercase;line-height:0.85;letter-spacing:-3px;
        color:${text};position:relative;z-index:1;
      ">
        ${copy.headline.split(" ").map((w,i) => 
          `<span style="color:${i%2===0 ? text : accent}">${w} </span>`
        ).join("")}
      </div>
    </div>

    <!-- OFFER TAG -->
    ${info.specialOffer ? `
    <div style="margin:0 50px;padding:14px 20px;background:${accent};display:inline-flex;align-items:center;gap:12px">
      <span style="font-size:24px">🔥</span>
      <div style="font-size:20px;font-weight:900;color:${primary};font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:2px">${info.specialOffer}</div>
    </div>` : ""}

    <!-- SUBHEADLINE + BODY -->
    <div style="padding:24px 50px;border-left:6px solid ${accent};margin:24px 50px;background:${text}08">
      <div style="font-size:20px;font-weight:700;color:${text};margin-bottom:10px">${copy.subheadline}</div>
      <div style="font-size:16px;color:${text};opacity:0.75;line-height:1.7">${copy.bodyText}</div>
    </div>

    <!-- GRID FEATURES -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin:0 50px 30px;background:${accent}30">
      ${[
        {e:"✅",l:"Quality"},
        {e:"⚡",l:"Speed"},
        {e:"💰",l:"Best Price"},
        {e:"🏆",l:"Top Rated"},
      ].map(f => `
        <div style="background:${primary};padding:16px 20px;display:flex;align-items:center;gap:12px">
          <span style="font-size:24px">${f.e}</span>
          <div style="font-size:14px;font-weight:700;color:${text};letter-spacing:1px;text-transform:uppercase">${f.l} Guaranteed</div>
        </div>
      `).join("")}
    </div>

    <!-- BOTTOM BAR -->
    <div style="position:absolute;bottom:0;left:0;right:0">
      <div style="background:${accent};padding:20px 50px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:28px;font-weight:900;color:${primary};font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:3px">
          ${copy.callToAction}
        </div>
        <div style="text-align:right">
          <div style="font-size:20px;font-weight:800;color:${primary}">${info.contact}</div>
        </div>
      </div>
      <div style="height:8px;background:${secondary}"></div>
    </div>
  </div>`;
}

module.exports = { getTemplate };