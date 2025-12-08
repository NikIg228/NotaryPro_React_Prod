// Загрузка справочников для multiselect и optionsFrom

import citiesData from '../config/dictionaries/cities.json'

export type DictionaryType = 'cities' | 'cities_kz_reference' | 'countries_world'

// Локальный список стран (сокращённый, можно расширить при необходимости)
const countriesData: string[] = [
  'Австралия',
  'Австрия',
  'Азербайджан',
  'Албания',
  'Алжир',
  'Ангола',
  'Аргентина',
  'Армения',
  'Афганистан',
  'Беларусь',
  'Бельгия',
  'Болгария',
  'Бразилия',
  'Великобритания',
  'Венгрия',
  'Вьетнам',
  'Германия',
  'Греция',
  'Грузия',
  'Дания',
  'Египет',
  'Израиль',
  'Индия',
  'Индонезия',
  'Ирландия',
  'Испания',
  'Италия',
  'Казахстан',
  'Канада',
  'Катар',
  'Кения',
  'Китай',
  'Мексика',
  'Нидерланды',
  'Новая Зеландия',
  'Норвегия',
  'Объединенные Арабские Эмираты',
  'Пакистан',
  'Перу',
  'Польша',
  'Португалия',
  'Россия',
  'Румыния',
  'Саудовская Аравия',
  'Сербия',
  'Сингапур',
  'Словакия',
  'Словения',
  'Соединенные Штаты Америки',
  'Таиланд',
  'Турция',
  'Узбекистан',
  'Украина',
  'Филиппины',
  'Финляндия',
  'Франция',
  'Хорватия',
  'Чехия',
  'Чили',
  'Швейцария',
  'Швеция',
  'Эстония',
  'Япония'
]

const dictionaries: Record<DictionaryType, string[]> = {
  cities: citiesData,
  cities_kz_reference: citiesData,
  countries_world: countriesData
}

export const getDictionary = (name: string): string[] => {
  return dictionaries[name as DictionaryType] || []
}

export const getDictionaryOptions = (name: string): Array<{ value: string; label: string }> => {
  const items = getDictionary(name)
  return items.map(item => ({
    value: item.toLowerCase().replace(/\s+/g, '_'),
    label: item
  }))
}

