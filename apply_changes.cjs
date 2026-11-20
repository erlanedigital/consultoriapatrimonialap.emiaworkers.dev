const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/ERLANE/.gemini/antigravity/scratch/consultoriapatrimonialap';
let html = fs.readFileSync(path.join(basePath, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(basePath, 'styles.css'), 'utf8');

// 1. Header logo strictly 2 lines with whitespace-nowrap and shrink-0
const oldHeaderLogo = 'd("a",{href:"#topo",className:"min-w-0 leading-none",children:[u("span",{className:"font-serif-display block text-lg font-bold tracking-tight text-[#5A1220] sm:text-xl",children:"ERLANE MOTA"}),u("span",{className:"mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A86A] sm:text-[11px]",children:"Consultora Patrimonial"})]})';
const newHeaderLogo = 'd("a",{href:"#topo",className:"shrink-0 flex-shrink-0 whitespace-nowrap leading-none",style:{whiteSpace:"nowrap",flexShrink:0},children:[u("span",{className:"font-serif-display block text-base sm:text-xl font-bold tracking-tight text-[#5A1220] whitespace-nowrap",style:{whiteSpace:"nowrap"},children:"ERLANE MOTA"}),u("span",{className:"mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A86A] sm:text-[11px] whitespace-nowrap",style:{whiteSpace:"nowrap"},children:"Consultora Patrimonial"})]})';

if (html.includes(oldHeaderLogo)) {
  html = html.replace(oldHeaderLogo, newHeaderLogo);
  console.log('1. Header logo replaced successfully');
} else {
  console.log('1. Header logo pattern not found as exact string, searching flexibly');
  const logoRegex = /d\("a",\{href:"#topo",className:"[^"]*",children:\[u\("span",\{className:"[^"]*",children:"ERLANE MOTA"\}\),u\("span",\{className:"[^"]*",children:"Consultora Patrimonial"\}\)\]\}\)/;
  if (logoRegex.test(html)) {
    html = html.replace(logoRegex, newHeaderLogo);
    console.log('1. Header logo replaced via regex');
  } else {
    console.log('1. Header logo NOT replaced');
  }
}

// 2. Unhide PWA button on mobile in header
const oldPwaBtn = 'd("button",{type:"button",onClick:Nd,className:"hidden shrink-0 items-center gap-1.5 rounded-full border border-[#5A1220]/25 bg-white px-3.5 py-2 text-xs font-bold text-[#5A1220] transition hover:bg-[#FFF7E8] md:inline-flex",children:[u(Dt,{className:"h-3.5 w-3.5"})," ",L?"Instalar app":"Instalar app"]})';
const newPwaBtn = 'd("button",{type:"button",onClick:Nd,className:"inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#5A1220]/25 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#5A1220] transition hover:bg-[#FFF7E8]",children:[u(Dt,{className:"h-3.5 w-3.5"})," ",L?"Instalar app":"Instalar app"]})';

if (html.includes(oldPwaBtn)) {
  html = html.replace(oldPwaBtn, newPwaBtn);
  console.log('2. PWA button in header unhidden for mobile');
} else {
  console.log('2. PWA button pattern not found exact, trying regex');
  const pwaRegex = /d\("button",\{type:"button",onClick:Nd,className:"hidden shrink-0[^"]*md:inline-flex",children:\[u\(Dt,\{className:"h-3\.5 w-3\.5"\}\)," ",L\?"Instalar app":"Instalar app"\]\}\)/;
  if (pwaRegex.test(html)) {
    html = html.replace(pwaRegex, newPwaBtn);
    console.log('2. PWA button replaced via regex');
  }
}

// 3. Buttons in #diagnostico: center text inside
const oldRadioMap = '["Aposentadoria","Investir","Renda passiva"].map((C)=>d("label",{className:`flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border px-3 py-3 text-center text-sm font-bold transition ${K===C?"border-[#5A1220] bg-[#5A1220] text-white":"border-[#E7DAC5] bg-[#FAF6EF] text-[#5A1220] hover:border-[#9B7A40]"}`,children:[u("input",{type:"radio",name:"objetivo",value:C,checked:K===C,onChange:()=>f(C),className:"sr-only"}),C]},C))';
const newRadioMap = '["Aposentadoria","Investir","Renda passiva"].map((C)=>d("label",{className:`flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border px-3 py-3 text-center text-sm font-bold transition ${K===C?"border-[#5A1220] bg-[#5A1220] text-white":"border-[#E7DAC5] bg-[#FAF6EF] text-[#5A1220] hover:border-[#9B7A40]"}`,style:{display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",width:"100%"},children:[u("input",{type:"radio",name:"objetivo",value:C,checked:K===C,onChange:()=>f(C),className:"sr-only"}),u("span",{className:"w-full text-center block",style:{textAlign:"center",width:"100%",display:"block"},children:C})]},C))';

if (html.includes(oldRadioMap)) {
  html = html.replace(oldRadioMap, newRadioMap);
  console.log('3. Diagnostic radio buttons centered');
} else {
  console.log('3. Radio map exact string not found, trying partial replacement');
  const target = 'children:[u("input",{type:"radio",name:"objetivo",value:C,checked:K===C,onChange:()=>f(C),className:"sr-only"}),C]}';
  const repl = 'style:{display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",width:"100%"},children:[u("input",{type:"radio",name:"objetivo",value:C,checked:K===C,onChange:()=>f(C),className:"sr-only"}),u("span",{className:"w-full text-center block",style:{textAlign:"center",width:"100%",display:"block"},children:C})]}';
  if (html.includes(target)) {
    html = html.replace(target, repl);
    console.log('3. Diagnostic radio buttons replaced via target string');
  }
}

// 4. Remove "Sem promessa de prazo:"
const oldSubtitle = 'children:"Sem promessa de prazo: você constrói o seu patrimônio aos poucos, decisão após decisão."';
const newSubtitle = 'children:"Você constrói o seu patrimônio aos poucos, decisão após decisão."';
if (html.includes(oldSubtitle)) {
  html = html.replace(oldSubtitle, newSubtitle);
  console.log('4. Removed "Sem promessa de prazo:" subtitle');
}

const oldFormText = 'sem promessa de prazo de contemplação e com atendimento humanizado.';
const newFormText = 'com estratégia clara e atendimento humanizado.';
if (html.includes(oldFormText)) {
  html = html.replace(oldFormText, newFormText);
  console.log('4b. Cleaned form description text');
}

// 5. Service Worker registration before </body>
if (!html.includes('serviceWorker.register')) {
  const swScript = `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function() {});
  });
}
</script>
</body>`;
  html = html.replace('</body>', swScript);
  console.log('5. Service Worker registration injected');
}

// Write index.html
fs.writeFileSync(path.join(basePath, 'index.html'), html, 'utf8');

// 6. Update styles.css
// A. Align "O seu caminho no tempo" and card header to left
// B. Ensure video fills mobile box completely (100% width, height, aspect ratio 16/9, object-fit cover)
// C. Center radio buttons in #diagnostico
const cssAdditions = `
/* ==========================================================================
   AJUSTES SUPREMOS: VÍDEO FULL-BLEED MOBILE, ALINHAMENTO À ESQUERDA & BOTÕES
   ========================================================================== */

/* 1. VÍDEO NO MOBILE E DESKTOP: PREENCHIMENTO COMPLETO DA CAIXA */
#video div[class*="rounded-[2"],
#video div[class*="overflow-hidden"],
#video .relative {
  width: 100% !important;
  max-width: 1140px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

#video video {
  width: 100% !important;
  height: 100% !important;
  min-height: 240px !important;
  max-height: 520px !important;
  aspect-ratio: 16 / 9 !important;
  object-fit: cover !important;
  border-radius: 24px !important;
  display: block !important;
}

@media (max-width: 640px) {
  #video div[class*="rounded-[2"],
  #video div[class*="overflow-hidden"],
  #video .relative {
    width: 100% !important;
    border-radius: 20px !important;
  }
  #video video {
    width: 100% !important;
    height: 100% !important;
    min-height: 200px !important;
    max-height: 380px !important;
    aspect-ratio: 16 / 9 !important;
    object-fit: cover !important;
    border-radius: 20px !important;
  }
}

/* 2. 'O SEU CAMINHO NO TEMPO' (#renda-passiva): JUSTIFICADO À ESQUERDA */
#renda-passiva div[class*="border-white"] {
  text-align: left !important;
}

#renda-passiva div[class*="border-white"] h3 {
  text-align: left !important;
  margin-left: 0 !important;
  margin-right: auto !important;
  font-size: clamp(24px, 3.8vw, 48px) !important;
}

#renda-passiva div[class*="border-white"] p[class*="tracking-"],
#renda-passiva div[class*="border-white"] .eyebrow {
  text-align: left !important;
  margin-left: 0 !important;
  margin-right: auto !important;
  display: block !important;
}

#renda-passiva div[class*="border-white"] div.flex {
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

/* 3. BOTÕES DE OBJETIVO EM #diagnostico: CENTRALIZAÇÃO ABSOLUTA DOS TEXTOS */
#diagnostico fieldset div.grid label,
#diagnostico fieldset label,
#diagnostico div.grid label {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  margin-bottom: 0 !important;
  width: 100% !important;
}

#diagnostico fieldset div.grid label span,
#diagnostico fieldset label span,
#diagnostico div.grid label span {
  display: block !important;
  width: 100% !important;
  text-align: center !important;
  margin: 0 auto !important;
}

/* 4. MARCA NO TOPO: ERLANE MOTA / CONSULTORA PATRIMONIAL RIGOROSAMENTE EM 2 LINHAS */
header a[href="#topo"] {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

header a[href="#topo"] span {
  white-space: nowrap !important;
  display: block !important;
}
`;

css += '\n' + cssAdditions;
fs.writeFileSync(path.join(basePath, 'styles.css'), css, 'utf8');
console.log('6. styles.css updated with all rules');
