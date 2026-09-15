const fs = require('fs');
const file = 'src/app/landing/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Find the main wrapper of the LandingPage
// Usually it's `<div className="min-h-screen bg-white font-sans text-gray-900">`
// Let's just add `break-keep` to the outermost div of the component.
// I'll also add it to all `p`, `h1`, `h2`, `h3`, `h4` tags just in case, but adding it to the root wrapper is cleaner.
c = c.replace(/className="min-h-screen/g, 'className="min-h-screen break-keep');

// Also, let's fix any `text-center` elements that might look weird on mobile if they wrap. 
// Adding `break-keep` generally fixes the "one character dropping to the next line" issue for Korean text.

fs.writeFileSync(file, c);
console.log('Successfully added break-keep to root wrapper');
