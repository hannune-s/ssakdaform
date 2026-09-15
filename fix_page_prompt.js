const fs = require('fs');

function fixPage(file) {
  let c = fs.readFileSync(file, 'utf8');

  // We don't need the useEffect anymore, but we can leave it or remove it.
  // The core is changing handleInstallApp to check window.deferredPrompt
  const oldHandlerStart = `const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {`;
      
  const newHandler = `const handleInstallApp = () => {
    // @ts-ignore
    const prompt = window.deferredPrompt || deferredPrompt;
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          // @ts-ignore
          window.deferredPrompt = null;
          setDeferredPrompt(null);
        }
      });
    } else {
      alert('📱 안드로이드: 구글 크롬(Chrome) 브라우저에서 열어주세요.\\n아이폰: 하단의 공유(보내기) ⍗ 버튼을 누른 후 "홈 화면에 추가"를 직접 선택해주세요.');
    }
  };`;

  // Use a more robust replace by regex
  const regex = /const handleInstallApp = \(\) => \{[\s\S]*?alert\('📱 [^\)]*\);[\s\S]*?\};/;
  c = c.replace(regex, newHandler);
  fs.writeFileSync(file, c);
  console.log('Fixed ' + file);
}

fixPage('src/app/page.tsx');
fixPage('src/app/demo/page.tsx');
