import json
import sys

file_path = 'src/data/documents.json'

personal_titles = ['Доверитель', 'Поверенный', 'Супруг', 'Супруга', 'Заявитель']
personal_fields = ['full_name', 'iin', 'iin_bin', 'birth_date', 'address', 'document']

print('Loading documents...')
with open(file_path, 'r', encoding='utf-8') as f:
    docs = json.load(f)

print(f'Found {len(docs)} documents')

count = 0

for doc in docs:
    if not doc.get('parsed') or not doc['parsed'].get('steps'):
        continue
    
    for i, step in enumerate(doc['parsed']['steps']):
        if step.get('type') == 'input-mode':
            continue
        
        # Check by title
        has_title = step.get('title') and any(t in step['title'] for t in personal_titles)
        
        # Check by fields
        has_fields = False
        if step.get('fields'):
            for field in step['fields']:
                field_name = (field.get('name') or '').lower()
                if any(pf in field_name for pf in personal_fields):
                    has_fields = True
                    break
        
        if has_title or has_fields:
            # Extract manual fields (exclude file type)
            manual_fields = [f for f in step.get('fields', []) if f.get('type') != 'file']
            
            # Convert step
            new_step = {**step}
            new_step['type'] = 'input-mode'
            new_step['input_mode_field'] = f"{step['id']}_mode"
            new_step['min'] = step.get('min', 1)
            new_step['max'] = step.get('max', 2 if step.get('type') == 'array' else 1)
            new_step['manual_fields'] = manual_fields
            
            if 'fields' in new_step:
                del new_step['fields']
            
            doc['parsed']['steps'][i] = new_step
            count += 1

print(f'Converting {count} steps...')
sys.stdout.flush()

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)

print(f'Successfully converted {count} steps!')
sys.stdout.flush()


