const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

// Replace manifest: "/manifest.json" with manifest: "/manifest.json?v=2"
if (layout.includes('manifest: "/manifest.json"')) {
    layout = layout.replace('manifest: "/manifest.json"', 'manifest: "/manifest.json?v=2"');
    fs.writeFileSync('src/app/layout.tsx', layout);
    console.log('Updated manifest link cache buster');
} else if (layout.includes('manifest: "/manifest.json?v=2"')) {
    console.log('Already updated cache buster');
} else {
    console.log('Could not find manifest link');
}
