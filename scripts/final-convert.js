const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/documents.json');

console.log('Loading documents...');
const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const titles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const fieldNames = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let count = 0;

docs.forEach(doc => {
  if (!doc.parsed?.steps) return;
  
  doc.parsed.steps.forEach((step, idx) => {
    if (step.type === 'input-mode') return;
    
    const matchTitle = step.title && titles.some(t => step.title.includes(t));
    const matchFields = step.fields?.some(f => {
      const n = (f.name || '').toLowerCase();
      return fieldNames.some(pf => n.includes(pf));
    });
    
    if (matchTitle || matchFields) {
      const manual = (step.fields || []).filter(f => f.type !== 'file');
      
      const newStep = Object.assign({}, step, {
        type: 'input-mode',
        input_mode_field: `${step.id}_mode`,
        min: step.min !== undefined ? step.min : 1,
        max: step.max !== undefined ? step.max : (step.type === 'array' ? 2 : 1),
        manual_fields: manual
      });
      
      delete newStep.fields;
      doc.parsed.steps[idx] = newStep;
      count++;
    }
  });
});

console.log(`Converting ${count} steps...`);
fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
console.log('Conversion complete!');


