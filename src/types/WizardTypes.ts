// Типы для универсального Wizard на основе JSON-структур из docs_structure.txt

export type StepType = 
  | 'form' 
  | 'radio' 
  | 'number' 
  | 'array' 
  | 'checkbox-group' 
  | 'validation' 
  | 'final' 
  | 'input-mode'
  | 'multiselect'

export interface FieldDefinition {
  name: string
  type: 'text' | 'number' | 'date' | 'file' | 'checkbox' | 'multiselect'
  label: string
  min?: number
  max?: number
  dictionary?: string
  show_if?: string
}

export interface ManualField extends FieldDefinition {
  name: string
  type: 'text' | 'number' | 'date' | 'file'
  label: string
}

export interface RadioOption {
  value: string | number | boolean
  label: string
}

export interface CheckboxOption {
  value: string
  label: string
}

export interface StepDefinition {
  id: string
  type: StepType
  title?: string
  label?: string
  input_mode_field?: string
  min?: number
  max?: number
  dynamicCountFrom?: string
  item_label?: string
  fields?: FieldDefinition[]
  manual_fields?: ManualField[]
  options?: RadioOption[] | CheckboxOption[]
  optionsFrom?: string
  select_all?: boolean
  validation?: {
    min?: number
    max?: number
    required?: string[]
  }
  rules?: string[]
  next?: string | { [key: string]: string } | string[]
  output?: string
}

export interface DocumentSchema {
  id: number
  code: string
  title: string
  category: string
  dev_notes?: string[]
  rules_for_cursor?: string[]
  parsed: {
    steps: StepDefinition[]
    placeholders: string[]
  }
}

export interface WizardFormData {
  [key: string]: any
}

