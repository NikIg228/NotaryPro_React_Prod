const fs = require('fs');

const file = 'src/data/documents.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const titles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const fields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let converted = 0;

data.forEach(doc => {
  if (!doc.parsed?.steps) return;
  
  doc.parsed.steps.forEach((step, i) => {
    if (step.type === 'input-mode') return;
    
    const hasTitle = step.title && titles.some(t => step.title.includes(t));
    const hasFields = step.fields?.some(f => {
      const n = (f.name || '').toLowerCase();
      return fields.some(pf => n.includes(pf));
    });
    
    if (hasTitle || hasFields) {
      const manual = (step.fields || []).filter(f => f.type !== 'file');
      
      const newStep = {
        ...step,
        type: 'input-mode',
        input_mode_field: `${step.id}_mode`,
        min: step.min ?? 1,
        max: step.max ?? (step.type === 'array' ? 2 : 1),
        manual_fields: manual
      };
      
      delete newStep.fields;
      doc.parsed.steps[i] = newStep;
      converted++;
    }
  });
});

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
process.stdout.write(`Converted ${converted} steps\n`);


