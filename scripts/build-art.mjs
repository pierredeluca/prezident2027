import { mkdirSync, writeFileSync } from "node:fs";

const dir = new URL("../public/art/", import.meta.url);
mkdirSync(dir, { recursive: true });

function svg(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img">${body}</svg>\n`;
}

function person(x, y, coat) {
  return `<g transform="translate(${x} ${y})">
    <circle cx="0" cy="0" r="26" fill="#e7c7a8"/>
    <circle cx="-8" cy="-2" r="2.2" fill="#2a241e"/>
    <circle cx="8" cy="-2" r="2.2" fill="#2a241e"/>
    <path d="M-48 34 Q0 10 48 34 L56 168 H-56 Z" fill="${coat}"/>
  </g>`;
}

function shell(wall, floor, extra) {
  return svg(`
    <rect width="800" height="500" fill="#0e1216"/>
    <polygon points="60,28 740,28 800,500 0,500" fill="${wall}"/>
    <polygon points="0,318 800,292 800,500 0,500" fill="${floor}"/>
    <rect x="70" y="48" width="220" height="150" fill="#0b1014" stroke="#e7a04a" stroke-width="8"/>
    <rect x="86" y="64" width="188" height="118" fill="#173246"/>
    <circle cx="690" cy="58" r="16" fill="#e7a04a"/>
    <rect x="682" y="58" width="16" height="70" fill="#4a3424"/>
    ${extra}
  `);
}

const rooms = {
  "redaction.svg": shell("#3a332c", "#2a2118", `
    ${person(560, 150, "#5c2a24")}
    <rect x="250" y="300" width="280" height="18" fill="#6b4a32"/>
    <rect x="270" y="250" width="120" height="50" fill="#f3ead7"/>
    <rect x="300" y="268" width="70" height="6" fill="#c4493a"/>
    <rect x="40" y="210" width="16" height="120" fill="#4a3424"/>
    <rect x="28" y="220" width="40" height="26" fill="#1d3557"/>
  `),
  "hall.svg": shell("#2c3844", "#3a3430", `
    ${person(600, 160, "#1d3557")}
    <rect x="80" y="70" width="70" height="110" fill="#f3ead7"/>
    <rect x="160" y="70" width="70" height="110" fill="#f6d776"/>
    <rect x="240" y="300" width="90" height="120" fill="#2f6f4e"/>
    <rect x="520" y="300" width="160" height="16" fill="#6b4a32"/>
  `),
  "couloir.svg": shell("#34323a", "#2a2724", `
    <g fill="#1b1a1f" stroke="#e7a04a" stroke-width="4">
      <rect x="70" y="80" width="90" height="150"/>
      <rect x="180" y="80" width="90" height="150"/>
      <rect x="290" y="80" width="90" height="150"/>
      <rect x="400" y="80" width="90" height="150"/>
      <rect x="70" y="250" width="90" height="120"/>
      <rect x="180" y="250" width="90" height="120"/>
      <rect x="290" y="250" width="90" height="120"/>
      <rect x="400" y="250" width="90" height="120"/>
    </g>
    <rect x="620" y="300" width="70" height="90" rx="8" fill="#8a8f93"/>
    <rect x="632" y="318" width="46" height="18" fill="#c4493a"/>
  `),
  "loge-philippe.svg": shell("#243044", "#2c2824", `
    ${person(600, 150, "#1e3a5f")}
    <rect x="180" y="250" width="120" height="80" fill="#101820" stroke="#8ec4bb"/>
    <text x="196" y="294" fill="#8ec4bb" font-size="16" font-family="Georgia">Fessenheim</text>
    <rect x="330" y="250" width="130" height="70" fill="#101820"/>
    <text x="346" y="290" fill="#f3ead7" font-size="16" font-family="Georgia">pilier</text>
  `),
  "loge-attal.svg": shell("#3d3424", "#32281e", `
    ${person(610, 150, "#f2d15a")}
    <rect x="150" y="230" width="150" height="110" fill="#1c3d34"/>
    <text x="166" y="280" fill="#f3ead7" font-size="16" font-family="Georgia">niveau</text>
    <path d="M166 286 H250" stroke="#c4493a" stroke-width="3"/>
    <text x="166" y="312" fill="#e7a04a" font-size="16" font-family="Georgia">besoins</text>
    <rect x="330" y="250" width="100" height="70" fill="#6b4a32"/>
    <rect x="342" y="262" width="76" height="46" fill="#f3ead7"/>
  `),
  "loge-melenchon.svg": shell("#3a2744", "#2a222c", `
    ${person(610, 150, "#5c2d82")}
    <rect x="150" y="240" width="140" height="90" fill="#101018" stroke="#c9b6e0"/>
    <text x="166" y="290" fill="#c9b6e0" font-size="18" font-family="Georgia">1992</text>
    <rect x="320" y="250" width="110" height="80" fill="#f3ead7"/>
    <text x="336" y="294" fill="#5c2d82" font-size="16" font-family="Georgia">60 ans</text>
  `),
  "loge-lepen.svg": shell("#2a3144", "#26242a", `
    ${person(610, 150, "#1c2744")}
    <rect x="150" y="250" width="80" height="100" fill="#8d1d2c"/>
    <text x="162" y="300" fill="#f3ead7" font-size="14" font-family="Georgia">2017</text>
    <rect x="250" y="250" width="80" height="100" fill="#16325c"/>
    <text x="262" y="300" fill="#f3ead7" font-size="14" font-family="Georgia">2022</text>
    <rect x="360" y="280" width="70" height="70" fill="none" stroke="#e7a04a"/>
  `),
  "loge-glucksmann.svg": shell("#44282c", "#2e2424", `
    ${person(610, 150, "#c4493a")}
    <rect x="140" y="300" width="280" height="36" fill="#6b3a32"/>
    <rect x="160" y="250" width="90" height="60" fill="#f3ead7"/>
    <rect x="270" y="250" width="90" height="60" fill="#1c1a18"/>
    <text x="182" y="284" fill="#44282c" font-size="14" font-family="Georgia">A</text>
    <text x="304" y="284" fill="#f3ead7" font-size="14" font-family="Georgia">B</text>
  `),
  "loge-retailleau.svg": shell("#24324a", "#28262a", `
    ${person(610, 150, "#2a4b8d")}
    <rect x="160" y="250" width="70" height="90" fill="#f3ead7"/>
    <rect x="250" y="270" width="110" height="70" fill="#6b4a32"/>
    <path d="M400 240 h70 l20 30 h-90 z" fill="#1e3a5f"/>
  `),
  "loge-lisnard.svg": shell("#1d3332", "#24302a", `
    <rect x="300" y="90" width="280" height="190" fill="#101816" stroke="#8ec4bb" stroke-width="8"/>
    ${person(440, 150, "#1f6f6a")}
    <rect x="150" y="250" width="16" height="90" fill="#6b4a32"/>
    <ellipse cx="158" cy="230" rx="36" ry="16" fill="#2f6f4e"/>
    <rect x="150" y="300" width="80" height="50" fill="#f3ead7"/>
    <rect x="160" y="318" width="50" height="4" fill="#1f6f6a"/>
  `),
  "regie.svg": shell("#1a1e24", "#181614", `
    ${person(620, 150, "#3a2a2a")}
    <rect x="80" y="80" width="120" height="80" fill="#101820" stroke="#8ec4bb"/>
    <rect x="210" y="80" width="120" height="80" fill="#101820" stroke="#e7a04a"/>
    <rect x="340" y="80" width="120" height="80" fill="#101820" stroke="#c4493a"/>
    <rect x="120" y="300" width="320" height="28" fill="#2a241c"/>
    <circle cx="180" cy="314" r="8" fill="#c4493a"/>
    <circle cx="220" cy="314" r="8" fill="#e7a04a"/>
    <circle cx="260" cy="314" r="8" fill="#8ec4bb"/>
  `),
  "epilogue.svg": shell("#1b2830", "#1a2420", `
    <rect x="0" y="300" width="800" height="40" fill="#3d4c55"/>
    <circle cx="640" cy="120" r="36" fill="#e7a04a" opacity="0.8"/>
    <rect x="180" y="250" width="70" height="90" fill="#101418"/>
    <rect x="200" y="270" width="30" height="40" fill="#e7a04a"/>
  `),
};

for (const [name, contents] of Object.entries(rooms)) {
  writeFileSync(new URL(name, dir), contents);
}
