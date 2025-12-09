const fs = require('fs');

try {
  const filePath = 'src/data/documents.json';
  console.log('Reading file...');
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Documents: ${data.length}`);
  
  const personalTitles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель'];
  const personalFieldNames = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document'];
  
  let converted = 0;
  
  for (const doc of data) {
    if (!doc.parsed?.steps) continue;
    
    for (let i = 0; i < doc.parsed.steps.length; i++) {
      const step = doc.parsed.steps[i];
      
      // Пропускаем уже преобразованные
      if (step.type === 'input-mode') continue;
      
      // Проверяем по названию
      const hasTitle = step.title && personalTitles.some(t => step.title.includes(t));
      
      // Проверяем по полям
      const hasFields = step.fields?.some(f => {
        const name = (f.name || '').toLowerCase();
        return personalFieldNames.some(pf => name.includes(pf));
      });
      
      if (hasTitle || hasFields) {
        // Извлекаем поля без file
        const manualFields = (step.fields || []).filter(f => f.type !== 'file');
        
        // Преобразуем шаг
        doc.parsed.steps[i] = {
          ...step,
          type: 'input-mode',
          input_mode_field: `${step.id}_mode`,
          min: step.min ?? 1,
          max: step.max ?? (step.type === 'array' ? 2 : 1),
          manual_fields: manualFields
        };
        
        delete doc.parsed.steps[i].fields;
        converted++;
      }
    }
  }
  
  console.log(`Converted ${converted} steps`);
  console.log('Writing file...');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Done!');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}


