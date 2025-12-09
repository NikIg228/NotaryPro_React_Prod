#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/documents.json');

console.log('Loading documents...');
const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(`Loaded ${docs.length} documents`);

const personalTitles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
const personalFields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

let totalConverted = 0;
const report = [];

for (const doc of docs) {
  if (!doc.parsed?.steps) continue;
  
  let docConverted = 0;
  const convertedSteps = [];
  
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
      
      docConverted++;
      totalConverted++;
      convertedSteps.push(step.id);
    }
  }
  
  if (docConverted > 0) {
    report.push({ code: doc.code, count: docConverted, steps: convertedSteps });
  }
}

console.log(`\nConverting ${totalConverted} steps...`);
fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');

console.log(`\n=== CONVERSION COMPLETE ===`);
console.log(`Total steps converted: ${totalConverted}`);
console.log(`Documents modified: ${report.length}`);
console.log('\nTop 10 documents:');
report.slice(0, 10).forEach(r => {
  console.log(`  ${r.code}: ${r.count} steps`);
});
if (report.length > 10) {
  console.log(`  ... and ${report.length - 10} more documents`);
}


