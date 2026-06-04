const fs = require('fs');
let lines = fs.readFileSync('script.js', 'utf8').split('\n');
let first = -1;
let second = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '// --- EASTER EGG LOGIC ---') {
    if (first === -1) first = i;
    else { second = i; break; }
  }
}

console.log('First:', first, 'Second:', second);

if (first !== -1 && second !== -1) {
  // Delete from first to just before second
  lines.splice(first, second - first);
  fs.writeFileSync('script.js', lines.join('\n'));
  console.log('Fixed script.js');
} else {
  console.log('Markers not found');
}
