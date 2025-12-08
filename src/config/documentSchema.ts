// Типы для схемы документа
export interface FieldSchema {
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'upload' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required?: boolean
  options?: { value: string | number; label: string }[]
  min?: number
  max?: number
  show_if?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface StepSchema {
  id: string
  type: 'form' | 'array' | 'radio' | 'checkbox-group' | 'number' | 'conditional'
  title: string
  description?: string
  fields?: FieldSchema[]
  options?: { value: string | number | boolean; label: string }[]
  item_label?: string
  min?: number
  max?: number
  dynamicCountFrom?: string
  show_if?: string
  next?: string | { [key: string]: string } | string[]
  validation?: {
    min?: number
    max?: number
    required?: string[]
  }
}

export interface DocumentSchema {
  id: string
  title: string
  steps: StepSchema[]
}

// Пример схемы для документа "Сопровождение ребёнка вне РК"
export const childTravelSchema: DocumentSchema = {
  id: 'child_travel',
  title: 'Сопровождение ребёнка вне РК',
  steps: [
    {
      id: 'trustor_count',
      type: 'radio',
      title: 'Количество доверителей',
      description: 'Выберите количество родителей',
      options: [
        { value: 1, label: '1 родитель' },
        { value: 2, label: '2 родителя' }
      ],
      next: {
        '1': 'trustor_single',
        '2': 'trustor_array'
      }
    },
    {
      id: 'trustor_single',
      type: 'form',
      title: 'Доверитель',
      fields: [
        { name: 'trustors[0].full_name', type: 'text', label: 'ФИО', required: true },
        { name: 'trustors[0].iin', type: 'text', label: 'ИИН', required: true },
        { name: 'trustors[0].birth_date', type: 'date', label: 'Дата рождения', required: true },
        { name: 'trustors[0].address', type: 'text', label: 'Адрес', required: true },
        { name: 'trustors[0].document.type', type: 'text', label: 'Тип документа', required: true },
        { name: 'trustors[0].document.number', type: 'text', label: 'Серия/номер', required: true },
        { name: 'trustors[0].document.issued_by', type: 'text', label: 'Кем выдан', required: true },
        { name: 'trustors[0].document.issued_date', type: 'date', label: 'Дата выдачи', required: true },
        { name: 'trustors[0].attachments', type: 'upload', label: 'Загрузить 2 скана документа', required: true }
      ],
      next: 'attorney_count'
    },
    {
      id: 'trustor_array',
      type: 'array',
      title: 'Доверители',
      item_label: 'Доверитель',
      min: 2,
      max: 2,
      fields: [
        { name: 'trustors[].full_name', type: 'text', label: 'ФИО', required: true },
        { name: 'trustors[].iin', type: 'text', label: 'ИИН', required: true },
        { name: 'trustors[].birth_date', type: 'date', label: 'Дата рождения', required: true },
        { name: 'trustors[].address', type: 'text', label: 'Адрес', required: true },
        { name: 'trustors[].document.type', type: 'text', label: 'Тип документа', required: true },
        { name: 'trustors[].document.number', type: 'text', label: 'Серия/номер', required: true },
        { name: 'trustors[].document.issued_by', type: 'text', label: 'Кем выдан', required: true },
        { name: 'trustors[].document.issued_date', type: 'date', label: 'Дата выдачи', required: true },
        { name: 'trustors[].attachments', type: 'upload', label: 'Загрузить 2 скана документа', required: true }
      ],
      next: 'attorney_count'
    },
    {
      id: 'attorney_count',
      type: 'radio',
      title: 'Количество поверенных',
      options: [
        { value: 1, label: '1 поверенный' },
        { value: 2, label: '2 поверенных' }
      ],
      next: {
        '1': 'attorney_single',
        '2': 'attorney_array'
      }
    },
    {
      id: 'attorney_single',
      type: 'form',
      title: 'Поверенный',
      fields: [
        { name: 'attorneys[0].full_name', type: 'text', label: 'ФИО', required: true },
        { name: 'attorneys[0].iin', type: 'text', label: 'ИИН', required: true },
        { name: 'attorneys[0].birth_date', type: 'date', label: 'Дата рождения', required: true },
        { name: 'attorneys[0].citizenship', type: 'text', label: 'Гражданство' },
        { name: 'attorneys[0].address', type: 'text', label: 'Адрес', required: true },
        { name: 'attorneys[0].document.type', type: 'text', label: 'Тип документа', required: true },
        { name: 'attorneys[0].document.number', type: 'text', label: 'Серия/номер', required: true },
        { name: 'attorneys[0].document.issued_by', type: 'text', label: 'Кем выдан', required: true },
        { name: 'attorneys[0].document.issued_date', type: 'date', label: 'Дата выдачи', required: true },
        { name: 'attorneys[0].attachments', type: 'upload', label: 'Загрузить 2 скана документа', required: true }
      ],
      next: 'child_count'
    },
    {
      id: 'attorney_array',
      type: 'array',
      title: 'Поверенные',
      item_label: 'Поверенный',
      min: 2,
      max: 2,
      fields: [
        { name: 'attorneys[].full_name', type: 'text', label: 'ФИО', required: true },
        { name: 'attorneys[].iin', type: 'text', label: 'ИИН', required: true },
        { name: 'attorneys[].birth_date', type: 'date', label: 'Дата рождения', required: true },
        { name: 'attorneys[].citizenship', type: 'text', label: 'Гражданство' },
        { name: 'attorneys[].address', type: 'text', label: 'Адрес', required: true },
        { name: 'attorneys[].document.type', type: 'text', label: 'Тип документа', required: true },
        { name: 'attorneys[].document.number', type: 'text', label: 'Серия/номер', required: true },
        { name: 'attorneys[].document.issued_by', type: 'text', label: 'Кем выдан', required: true },
        { name: 'attorneys[].document.issued_date', type: 'date', label: 'Дата выдачи', required: true },
        { name: 'attorneys[].attachments', type: 'upload', label: 'Загрузить 2 скана документа', required: true }
      ],
      next: 'child_count'
    },
    {
      id: 'child_count',
      type: 'number',
      title: 'Количество детей',
      description: 'Укажите количество детей (от 1 до 10)',
      min: 1,
      max: 10,
      next: 'child_form'
    },
    {
      id: 'child_form',
      type: 'array',
      title: 'Данные детей',
      item_label: 'Ребёнок',
      dynamicCountFrom: 'child_count',
      fields: [
        { name: 'children[].full_name', type: 'text', label: 'ФИО', required: true },
        { name: 'children[].iin', type: 'text', label: 'ИИН', required: true },
        { name: 'children[].birth_date', type: 'date', label: 'Дата рождения', required: true },
        { name: 'children[].citizenship', type: 'text', label: 'Гражданство' },
        { name: 'children[].document.number', type: 'text', label: 'Свидетельство/паспорт №', required: true }
      ],
      next: 'country_choice'
    },
    {
      id: 'country_choice',
      type: 'radio',
      title: 'Выбор стран',
      options: [
        { value: 'world', label: 'Весь мир' },
        { value: 'manual', label: 'Выбрать страны вручную' }
      ],
      next: {
        'world': 'term_choice',
        'manual': 'country_list'
      }
    },
    {
      id: 'country_list',
      type: 'checkbox-group',
      title: 'Страны поездки',
      options: [
        { value: 'turkey', label: 'Турция' },
        { value: 'uae', label: 'ОАЭ' },
        { value: 'georgia', label: 'Грузия' },
        { value: 'azerbaijan', label: 'Азербайджан' },
        { value: 'china', label: 'Китай' },
        { value: 'south_korea', label: 'Южная Корея' },
        { value: 'germany', label: 'Германия' }
      ],
      validation: { min: 1 },
      next: 'term_choice'
    },
    {
      id: 'term_choice',
      type: 'radio',
      title: 'Срок доверенности',
      options: [
        { value: 'days', label: 'Дни' },
        { value: 'months', label: 'Месяцы' }
      ],
      next: {
        'days': 'term_days',
        'months': 'term_months'
      }
    },
    {
      id: 'term_days',
      type: 'form',
      title: 'Срок в днях',
      fields: [
        { name: 'term.days', type: 'number', label: 'Количество дней', required: true, min: 1, max: 31 }
      ],
      next: 'review'
    },
    {
      id: 'term_months',
      type: 'form',
      title: 'Срок в месяцах',
      fields: [
        { name: 'term.months', type: 'number', label: 'Количество месяцев', required: true, min: 1, max: 36 }
      ],
      next: 'review'
    },
    {
      id: 'review',
      type: 'form',
      title: 'Проверка данных',
      description: 'Проверьте введённые данные перед отправкой',
      fields: [],
      next: 'submit'
    }
  ]
}

