const fs = require('fs');
const path = require('path');

const projectDir = 'C:/Users/ERLANE/.gemini/antigravity/scratch/consultoriapatrimonialap';
let html = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf8');

// 1. SWAP SIMULADOR AND FAQ IN index.html
// Find FAQ section:
const faqStart = html.indexOf('u("section",{id:"faq"');
if (faqStart !== -1) {
  // find the end of this section
  const faqEnd = html.indexOf('u("section",{id:"diagnostico"', faqStart);
  if (faqEnd !== -1) {
    const faqCode = html.substring(faqStart, faqEnd);
    
    // Find simulador host:
    const simTarget = 'u("div",{id:"simulador-host",className:"mt-12 w-full"})';
    const simIdx = html.indexOf(simTarget);
    
    if (simIdx !== -1) {
      // Remove FAQ from original position and put simulador-host there wrapped in section
      const simSectionCode = 'u("section",{id:"simulador",className:"bg-[#FAF7F2] py-16 sm:py-24",children:d("div",{className:"mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",children:[u(TA,{eyebrow:"Simulação personalizada",title:d(Ot,{children:["Descubra o valor ideal, ",u("br",{}),u("em",{className:"italic text-[#9B7A40]",children:"para a sua\u00A0tranquilidade."})]})}),u("div",{id:"simulador-host",className:"mt-8 w-full"})]})}),';
      
      // Replace FAQ section with simSectionCode
      html = html.substring(0, faqStart) + simSectionCode + html.substring(faqEnd);
      
      // Replace original simulador-host in estrategia-agio with faqCode (without trailing comma if needed)
      // Note: adjust comma if needed
      html = html.replace(simTarget, faqCode.replace(/,\s*$/, ''));
      console.log('1. Simulador and FAQ swapped successfully in DOM');
    }
  }
}

// 2. NAV MENU VISIBLE ON BOTH DESKTOP AND MOBILE (SINCRONIA TOTAL)
// Change "flex lg:hidden" to "flex" on the quick nav bar so desktop has it too!
html = html.replace(
  'className:"flex lg:hidden items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2.5',
  'className:"flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2.5 justify-start lg:justify-center'
);
console.log('2. Quick navigation menu synced for both mobile and desktop');

// 3. TRANSPARENCY NOTICE: NÃO GARANTIMOS PRAZO DE CONTEMPLAÇÃO
const disclaimerHtml = 'u("div",{className:"mx-auto max-w-4xl px-4 py-3 my-4 rounded-2xl bg-[#5A1220]/5 border border-[#C9A86A]/40 text-center",children:[u("p",{className:"text-xs sm:text-sm font-semibold text-[#5A1220] leading-relaxed",children:"⚖️ Aviso de Transparência e Conformidade: A consultoria patrimonial atua exclusivamente com planejamento estratégico através de consórcio. Não há garantia nem promessa de prazo para contemplação. A contemplação ocorre exclusivamente por sorteio ou lance, conforme as regras oficiais da administradora e do Banco Central do Brasil."})]}),';

if (!html.includes('Aviso de Transparência e Conformidade')) {
  // Place before diagnostic form
  const formTrigger = 'd("form",{onSubmit:';
  if (html.includes(formTrigger)) {
    html = html.replace(formTrigger, disclaimerHtml + formTrigger);
    console.log('3. Transparency disclaimer added before diagnostic form');
  }
}

// 4. HEADER LOGO IN STRICTLY 2 LINES
const logoTarget = 'd("a",{href:"#topo",className:"min-w-0 leading-none",children:[u("span",{className:"font-serif-display block text-lg font-bold tracking-tight text-[#5A1220] sm:text-xl",children:"ERLANE MOTA"}),u("span",{className:"mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A86A] sm:text-[11px]",children:"Consultora Patrimonial"})]})';
const logoReplacement = 'd("a",{href:"#topo",className:"shrink-0 flex-shrink-0 whitespace-nowrap leading-none",style:{whiteSpace:"nowrap",flexShrink:0},children:[u("span",{className:"font-serif-display block text-base sm:text-xl font-bold tracking-tight text-[#5A1220] whitespace-nowrap",style:{whiteSpace:"nowrap"},children:"ERLANE MOTA"}),u("span",{className:"mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A86A] sm:text-[11px] whitespace-nowrap",style:{whiteSpace:"nowrap"},children:"Consultora Patrimonial"})]})';
if (html.includes(logoTarget)) {
  html = html.replace(logoTarget, logoReplacement);
  console.log('4. Header logo updated to strictly 2 lines');
}

// 5. SERVICE WORKER WITH AUTO-UPDATE & CONTROLLER RELOAD
if (!html.includes('serviceWorker.register')) {
  const swCode = `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      reg.update();
    }).catch(function() {});
  });
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    window.location.reload();
  });
}
</script>
</body>`;
  html = html.replace('</body>', swCode);
  console.log('5. Service Worker auto-update registered in HTML');
}

fs.writeFileSync(path.join(projectDir, 'index.html'), html, 'utf8');

// 6. UPDATE styles.css FOR FULL DESKTOP/MOBILE MENU SYNC
const cssNavRules = `
/* MENU SINCRONIZADO PERFEITAMENTE EM DESKTOP E MOBILE */
header nav[aria-label="Navegação rápida"] {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  overflow-x: auto !important;
  white-space: nowrap !important;
  justify-content: center !important;
}

@media (max-width: 1024px) {
  header nav[aria-label="Navegação rápida"] {
    justify-content: flex-start !important;
  }
}
`;
if (!css.includes('MENU SINCRONIZADO PERFEITAMENTE EM DESKTOP E MOBILE')) {
  css += '\n' + cssNavRules;
  fs.writeFileSync(path.join(projectDir, 'styles.css'), css, 'utf8');
  console.log('6. CSS updated for desktop menu visibility');
}

// 7. _headers FILE TO PREVENT STALE CACHING OF HTML
const headersContent = `/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()

/index.html
  Cache-Control: no-cache, no-store, must-revalidate

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

/
  Cache-Control: no-cache, no-store, must-revalidate
`;
fs.writeFileSync(path.join(projectDir, '_headers'), headersContent, 'utf8');
console.log('7. _headers updated for zero-stale cache');
