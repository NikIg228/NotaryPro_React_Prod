const fs = require('fs');
const path = require('path');

const documentsPath = path.join(__dirname, '../src/data/documents.json');

const PERSONAL_DATA_TITLES = [
  'Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель',
  'Принципал', 'Агент', 'Ребёнок', 'Ребенок', 'Доверительница',
  'Поверенная', 'Заявительница'
];

const PERSONAL_DATA_FIELDS = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];

function hasPersonalDataByTitle(step) {
  if (!step.title) return false;
  const title = step.title.toLowerCase();
  return PERSONAL_DATA_TITLES.some(kw => title.includes(kw.toLowerCase()));
}

function hasPersonalDataByFields(step) {
  const fields = step.fields || step.manual_fields || [];
  return fields.some(field => {
    const name = (field.name || '').toLowerCase();
    return PERSONAL_DATA_FIELDS.some(pf => name.includes(pf));
  });
}

function hasPersonalData(step) {
  if (step.type === 'input-mode') return false;
  return hasPersonalDataByTitle(step) || hasPersonalDataByFields(step);
}

function extractManualFields(fields) {
  if (!fields || !Array.isArray(fields)) return [];
  return fields.filter(f => f.type !== 'file');
}

function convertFormStep(step) {
  const converted = { ...step };
  converted.type = 'input-mode';
  converted.input_mode_field = `${step.id}_mode`;
  converted.manual_fields = extractManualFields(step.fields);
  if (converted.min === undefined) converted.min = 1;
  if (converted.max === undefined) converted.max = 1;
  delete converted.fields;
  return converted;
}

function convertArrayStep(step) {
  const converted = { ...step };
  converted.type = 'input-mode';
  converted.input_mode_field = `${step.id}_mode`;
  converted.manual_fields = extractManualFields(step.fields);
  if (converted.min === undefined) converted.min = 1;
  if (converted.max === undefined) converted.max = 2;
  delete converted.fields;
  return converted;
}

function convertStep(step) {
  if (step.type === 'form') return convertFormStep(step);
  if (step.type === 'array') return convertArrayStep(step);
  return step;
}

// Основная функция
try {
  process.stdout.write('Загрузка documents.json...\n');
  const fileContent = fs.readFileSync(documentsPath, 'utf8');
  const documents = JSON.parse(fileContent);
  
  process.stdout.write(`Загружено документов: ${documents.length}\n`);
  
  let totalConverted = 0;
  const conversionReport = [];
  
  documents.forEach((doc) => {
    if (!doc.parsed || !doc.parsed.steps) return;
    
    const docSteps = doc.parsed.steps;
    let docConverted = 0;
    const convertedSteps = [];
    
    docSteps.forEach((step, stepIndex) => {
      if (hasPersonalData(step)) {
        const converted = convertStep(step);
        docSteps[stepIndex] = converted;
        docConverted++;
        convertedSteps.push({
          id: step.id,
          title: step.title || step.id,
          oldType: step.type
        });
      }
    });
    
    if (docConverted > 0) {
      totalConverted += docConverted;
      conversionReport.push({
        docCode: doc.code,
        convertedCount: docConverted,
        steps: convertedSteps
      });
    }
  });
  
  process.stdout.write('Сохранение файла...\n');
  fs.writeFileSync(documentsPath, JSON.stringify(documents, null, 2), 'utf8');
  
  process.stdout.write(`\n=== ОТЧЕТ ===\n`);
  process.stdout.write(`Всего преобразовано: ${totalConverted} шагов\n`);
  process.stdout.write(`Документов изменено: ${conversionReport.length}\n\n`);
  
  conversionReport.slice(0, 10).forEach(r => {
    process.stdout.write(`${r.docCode}: ${r.convertedCount} шагов\n`);
  });
  
  if (conversionReport.length > 10) {
    process.stdout.write(`... и еще ${conversionReport.length - 10} документов\n`);
  }
  
  process.stdout.write('\nГотово!\n');
} catch (error) {
  process.stderr.write(`Ошибка: ${error.message}\n`);
  process.exit(1);
}


