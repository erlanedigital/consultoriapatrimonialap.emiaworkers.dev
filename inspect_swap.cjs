const fs = require('fs');
const html = fs.readFileSync('C:/Users/ERLANE/.gemini/antigravity/scratch/consultoriapatrimonialap/index.html', 'utf8');

// Inspect around faq at 2623537
console.log('=== FAQ SECTION ===');
console.log(html.substring(2623500, 2624470));

// Find simulador host
const simIdx = html.indexOf('simulador-host');
console.log('=== SIMULADOR HOST ===');
console.log(html.substring(simIdx - 300, simIdx + 300));
