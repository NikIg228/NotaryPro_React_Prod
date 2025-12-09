const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/documents.json');

console.log('Loading documents...');
const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(`Found ${docs.length} documents`);

const personalTitles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const personalFields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let totalConverted = 0;

for (const doc of docs) {
  if (!doc.parsed?.steps) continue;
  
  for (let i = 0; i < doc.parsed.steps.length; i++) {
    const step = doc.parsed.steps[i];
    
    if (step.type === 'input-mode') continue;
    
    const hasTitle = step.title && personalTitles.some(t => step.title.includes(t));
    const hasFields = step.fields?.some(f => {
      const name = (f.name || '').toLowerCase();
      return personalFields.some(pf => name.includes(pf));
    });
    
    if (hasTitle || hasFields) {
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
      totalConverted++;
    }
  }
}

console.log(`Converting ${totalConverted} steps...`);
fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
console.log(`Successfully converted ${totalConverted} steps!`);


