const fs = require('fs');
const file = 'src/app/form/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `      <div className="mb-6 text-stone-400 text-xs font-mono">
        Form ID: {params.id}
      </div>`;

if (c.includes(target)) {
    c = c.replace(target, '');
    fs.writeFileSync(file, c);
    console.log('Successfully removed Form ID text');
} else {
    // try line by line or with different line endings
    const target2 = /<div className="mb-6 text-stone-400 text-xs font-mono">[\s\S]*?Form ID: \{params\.id\}[\s\S]*?<\/div>/;
    if (target2.test(c)) {
        c = c.replace(target2, '');
        fs.writeFileSync(file, c);
        console.log('Successfully removed Form ID text via regex');
    } else {
        console.log('Target string not found');
    }
}
