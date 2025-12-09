const fs = require('fs');

const file = 'src/data/documents.json';

const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const personalTitles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const personalFields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let total = 0;

for (const doc of data) {
  if (!doc.parsed?.steps) continue;
  
  for (let i = 0; i < doc.parsed.steps.length; i++) {
    const step = doc.parsed.steps[i];
    
    if (step.type === 'input-mode') continue;
    
    const matchTitle = step.title && personalTitles.some(t => step.title.includes(t));
    const matchFields = step.fields?.some(f => {
      const name = (f.name || '').toLowerCase();
      return personalFields.some(pf => name.includes(pf));
    });
    
    if (matchTitle || matchFields) {
      const manualFields = (step.fields || []).filter(f => f.type !== 'file');
      
      const newStep = {
        ...step,
        type: 'input-mode',
        input_mode_field: `${step.id}_mode`,
        min: step.min !== undefined ? step.min : 1,
        max: step.max !== undefined ? step.max : (step.type === 'array' ? 2 : 1),
        manual_fields: manualFields
      };
      
      delete newStep.fields;
      doc.parsed.steps[i] = newStep;
      total++;
    }
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
process.stdout.write(`Converted ${total} steps\n`);


