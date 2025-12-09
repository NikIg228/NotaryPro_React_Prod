const fs = require('fs');

const file = 'src/data/documents.json';
console.log('Loading...');

const content = fs.readFileSync(file, 'utf8');
const docs = JSON.parse(content);

let count = 0;
const titles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const personalFields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

docs.forEach(doc => {
  if (!doc.parsed?.steps) return;
  
  doc.parsed.steps.forEach((step, idx) => {
    if (step.type === 'input-mode') return;
    
    const matchTitle = step.title && titles.some(t => step.title.includes(t));
    const matchFields = step.fields?.some(f => 
      personalFields.some(pf => (f.name || '').toLowerCase().includes(pf))
    );
    
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
      doc.parsed.steps[idx] = newStep;
      count++;
    }
  });
});

console.log(`Converted ${count} steps`);
fs.writeFileSync(file, JSON.stringify(docs, null, 2), 'utf8');
console.log('Saved!');


