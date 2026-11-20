const fs = require('fs');
const html = fs.readFileSync('C:/Users/ERLANE/.gemini/antigravity/scratch/consultoriapatrimonialap/index.html', 'utf8');

// Find all u("section",{id:"..."}) or d("section",{id:"..."})
const regex = /[ud]\("section",\{id:"([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Section id:', match[1], 'at index:', match.index);
}
