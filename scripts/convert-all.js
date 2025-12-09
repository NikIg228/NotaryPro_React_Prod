const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/documents.json');
console.log('Reading file...');

let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(`Found ${data.length} documents`);

const titles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const fields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let total = 0;

data.forEach(doc => {
  if (!doc.parsed?.steps) return;
  
  doc.parsed.steps.forEach((step, i) => {
    if (step.type === 'input-mode') return;
    
    const hasTitle = step.title && titles.some(t => step.title.includes(t));
    const hasFields = step.fields?.some(f => 
      fields.some(pf => (f.name || '').includes(pf))
    );
    
    if (hasTitle || hasFields) {
      const manualFields = (step.fields || []).filter(f => f.type !== 'file');
      
      doc.parsed.steps[i] = {
        ...step,
        type: 'input-mode',
        input_mode_field: `${step.id}_mode`,
        min: step.min ?? 1,
        max: step.max ?? (step.type === 'array' ? 2 : 1),
        manual_fields: manualFields
      };
      
      delete doc.parsed.steps[i].fields;
      total++;
    }
  });
});

console.log(`Converting ${total} steps...`);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Done!');


