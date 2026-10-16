const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state
page = page.replace(
  "const [copied, setCopied] = useState(false);",
  "const [copied, setCopied] = useState(false);\n  const [isQrModalOpen, setIsQrModalOpen] = useState(false);"
);

// 2. Add download function
const downloadFn = `
  const downloadQrCode = async () => {
    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app';
      const storeLink = \`\${currentOrigin}/store/demo\`;
      const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=\${encodeURIComponent(storeLink)}\`;
      
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ssakdaform_qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };
`;

page = page.replace(
  "const handleCopy = async () => {",
  downloadFn + "\n  const handleCopy = async () => {"
);

// 3. Update the QR button onClick
page = page.replace(
  "onClick={() => alert('QR 코드 이미지 다운로드가 실행됩니다.\\n(데모 버전 안내)')}",
  "onClick={() => setIsQrModalOpen(true)}"
);

// 4. Add the modal at the bottom
const modalHtml = `
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">우리 매장 QR 코드</h3>
              <p className="text-sm text-gray-500 mb-6">고객이 스캔하면 매장 통합 링크로 연결됩니다.</p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex justify-center">
                <img 
                  src={\`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=\${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'https://ssakdaform-9cqv.vercel.app')}/store/demo\`} 
                  alt="Store QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsQrModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
                <button 
                  onClick={downloadQrCode}
                  className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      )}`;

page = page.replace(
  "    </div>\n  );\n}",
  modalHtml + "\n    </div>\n  );\n}"
);

fs.writeFileSync('src/app/page.tsx', page);
console.log('Added QR Modal successfully');
