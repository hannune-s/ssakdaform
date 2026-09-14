const fs = require('fs');

const files = [
  'src/app/preview/page.tsx',
  'src/app/form/[id]/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the h1 line
  const h1Regex = /<h1 className="relative z-10 text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">\{data\.formTitle\}<\/h1>/;
  
  const h1Replacement = `<h1 className="relative z-10 text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">{data.formTitle}</h1>
          {data.formDescription && (
            <div className="relative z-10 mt-5 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-indigo-50 text-[13.5px] leading-relaxed whitespace-pre-wrap text-left shadow-sm">
              {data.formDescription}
            </div>
          )}`;

  if (content.match(h1Regex)) {
    content = content.replace(h1Regex, h1Replacement);
    fs.writeFileSync(file, content);
    console.log(`Updated formDescription UI in ${file}`);
  } else {
    console.log(`Failed to find h1 in ${file}`);
  }
}
