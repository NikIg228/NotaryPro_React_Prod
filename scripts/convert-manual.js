const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/documents.json');

console.log('Загрузка документов...');
const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(`Найдено документов: ${docs.length}`);

const personalTitles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель', 'Доверитель 1', 'Поверенный 1', 'Поверенный 2'];
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
    
    const hasTitle = step.title && personalTitles.some(t => {
      const titleLower = step.title.toLowerCase();
      const tLower = t.toLowerCase();
      return titleLower.includes(tLower) || tLower.includes(titleLower);
    });
    const hasFields = step.fields?.some(f => {
      const name = (f.name || '').toLowerCase();
      return personalFields.some(pf => name.includes(pf));
    }) || step.title?.toLowerCase().includes('поверенный') || step.title?.toLowerCase().includes('доверитель');
    
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

console.log(`\nПреобразование ${totalConverted} шагов...`);
fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');

console.log(`\n=== ПРЕОБРАЗОВАНИЕ ЗАВЕРШЕНО ===`);
console.log(`Всего преобразовано шагов: ${totalConverted}`);
console.log(`Документов изменено: ${report.length}`);
if (report.length > 0) {
  console.log('\nПервые 10 документов:');
  report.slice(0, 10).forEach(r => {
    console.log(`  ${r.code}: ${r.count} шагов (${r.steps.join(', ')})`);
  });
  if (report.length > 10) {
    console.log(`  ... и еще ${report.length - 10} документов`);
  }
}

