const fs = require('fs');
let lines = fs.readFileSync('src/app/landing/page.tsx', 'utf8').split('\n');
lines[1] = "import { QrCode, Sparkles, Users, Smartphone, PlusSquare, CreditCard, BarChart3, ArrowRight, CheckCircle2, Printer, Download } from 'lucide-react';";
fs.writeFileSync('src/app/landing/page.tsx', lines.join('\n'));
