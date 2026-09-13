const fs = require('fs');

const files = [
  'src/app/form/[id]/page.tsx',
  'src/app/preview/page.tsx'
];

const stateInjection = `  const [addressValues, setAddressValues] = useState<Record<number, string>>({});
  const [timeValues, setTimeValues] = useState<Record<number, { ampm: string, hour: string, minute: string }>>({});
  
  const handleTimeChange = (fieldId: number, part: 'ampm' | 'hour' | 'minute', value: string) => {
    setTimeValues(prev => ({
      ...prev,
      [fieldId]: {
        ampm: prev[fieldId]?.ampm || '오후',
        hour: prev[fieldId]?.hour || '12',
        minute: prev[fieldId]?.minute || '00',
        [part]: value
      }
    }));
  };`;

const timeInputRegex = /<input[^>]*type="time"[\s\S]*?step="600"[\s\S]*?\/>/s;

const customTimeUI = `<div className="flex gap-1.5 sm:gap-2">
                          <input 
                            type="hidden" 
                            name={field.label} 
                            value={\`\${timeValues[field.id]?.ampm || '오후'} \${timeValues[field.id]?.hour || '12'}:\${timeValues[field.id]?.minute || '00'}\`} 
                          />
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.ampm || '오후'}
                            onChange={(e) => handleTimeChange(field.id, 'ampm', e.target.value)}
                          >
                            <option value="오전">오전</option>
                            <option value="오후">오후</option>
                          </select>
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.hour || '12'}
                            onChange={(e) => handleTimeChange(field.id, 'hour', e.target.value)}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                              <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                          <select
                            className={inputClass + " !px-1 sm:!px-2 text-center !pr-6"}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em', appearance: 'none' }}
                            value={timeValues[field.id]?.minute || '00'}
                            onChange={(e) => handleTimeChange(field.id, 'minute', e.target.value)}
                          >
                            {['00', '10', '20', '30', '40', '50'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Inject state (only if not already there)
  if (!content.includes('const [timeValues, setTimeValues] = useState')) {
      content = content.replace(/const \[addressValues, setAddressValues\] = useState<Record<number, string>>\(\{\}\);/, stateInjection);
  }

  // Inject time UI
  if (timeInputRegex.test(content)) {
      content = content.replace(timeInputRegex, customTimeUI);
      console.log('Time inputs replaced in ' + file);
  } else {
      console.log('Could not find time input in ' + file);
  }

  fs.writeFileSync(file, content);
}
