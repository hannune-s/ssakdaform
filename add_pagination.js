const fs = require('fs');
const files = [
  'src/app/delivery-list/page.tsx',
  'src/app/reservation-list/page.tsx',
  'src/app/order-list/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add pagination states right before useEffect(() => { loadData(); }, []);
  // Make sure not to duplicate if ran twice
  if (!content.includes('const [currentPage, setCurrentPage] = useState(1);')) {
    const stateHookInsert = `
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {`;
    content = content.replace(/useEffect\(\(\) => \{\s*loadData\(\);\s*\}, \[\]\);/, stateHookInsert.trim());
  }

  // 2. Change mapping from filteredResponses to paginatedResponses
  content = content.replace(/filteredResponses\.length > 0 \?/g, 'paginatedResponses.length > 0 ?');
  content = content.replace(/filteredResponses\.map\(\(res\)/g, 'paginatedResponses.map((res)');

  // 3. Add Pagination UI at the end of the table wrapper
  const paginationUI = `
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={\`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-colors \${
                  currentPage === pageNum 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }\`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      )}
      </div>

      {/* 모달 */}`;

  if (!content.includes('Pagination Controls')) {
    content = content.replace(/<\/div>\s*<\/div>\s*\{\/\* 모달 \*\/\}/s, paginationUI);
  }

  fs.writeFileSync(file, content);
}
console.log('Done!');
