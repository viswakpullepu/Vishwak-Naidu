const fs = require('fs');
const path = require('path');

const result = {};

function getImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
}

result['squad'] = getImages('assets/squad_group').map(f => 'assets/squad_group/' + f);

const friendsDir = 'assets/friends';
if (fs.existsSync(friendsDir)) {
  fs.readdirSync(friendsDir).forEach(friend => {
    const friendPath = path.join(friendsDir, friend);
    if (fs.statSync(friendPath).isDirectory()) {
      result[friend] = getImages(friendPath).map(f => 'assets/friends/' + friend + '/' + f);
    }
  });
}

// Export as window.galleryAssets so it's globally accessible in script.js
const jsContent = 'window.galleryAssets = ' + JSON.stringify(result, null, 2) + ';';
fs.writeFileSync('assets.js', jsContent);

console.log('Successfully updated assets.js with new photos!');
