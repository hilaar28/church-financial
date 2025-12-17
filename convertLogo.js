const fs = require('fs');
const path = require('path');

// Read the image file
const imagePath = path.join(__dirname, 'pictures', 'afm_logo-removebg-preview.png');
const imageBuffer = fs.readFileSync(imagePath);

// Convert to base64
const base64Image = 'data:image/png;base64,' + imageBuffer.toString('base64');

// Save to a temporary file
fs.writeFileSync('logo_base64.txt', base64Image);
console.log('Logo converted to base64 and saved to logo_base64.txt');