const fs = require('fs');

const path = 'C:/Users/ERLANE/.gemini/antigravity/scratch/consultoriapatrimonialbe/index.html';
if (!fs.existsSync(path)) {
  console.log('File does not exist at:', path);
  // Check where consultoriapatrimonialbe is
  process.exit(1);
}

const html = fs.readFileSync(path, 'utf8');
console.log('File length:', html.length);

['transparência', 'transparencia', 'Por que construir patrimônio', 'Sobre a Erlane', 'Erlane Mota'].forEach(term => {
  let pos = 0;
  let count = 0;
  while ((pos = html.indexOf(term, pos)) !== -1 && count < 3) {
    console.log(`Found "${term}" at ${pos}:`);
    console.log(html.substring(Math.max(0, pos - 100), Math.min(html.length, pos + 300)));
    console.log('---');
    pos += term.length;
    count++;
  }
});
