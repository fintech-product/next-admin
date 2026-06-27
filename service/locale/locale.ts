import { Attributes, Filter, SearchResult } from "onecore"

export interface Locale {
  code: string
  name?: string
  nativeName?: string
  countryCode?: string
  countryName?: string
  nativeCountryName?: string
  dateFormat?: string
  firstDayOfWeek?: number
  decimalSeparator?: string
  groupSeparator?: string
  currencyCode?: string
  currencySymbol?: string
  currencyDecimalDigits?: number
  currencyPattern?: number
  currencySample?: string
}

export interface LocaleFilter extends Filter {
  code?: string
  name?: string
  nativeName?: string
  countryCode?: string
  countryName?: string
  nativeCountryName?: string
  dateFormat?: string
  firstDayOfWeek?: number
  decimalSeparator?: string
  groupSeparator?: string
  currencyCode?: string
  currencySymbol?: string
  currencyDecimalDigits?: number
  currencyPattern?: number
  currencySample?: string
}

export interface LocaleRepository {
  search(filter: LocaleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Locale>>
  load(id: string): Promise<Locale | null>
  create(locale: Locale): Promise<number>
  update(locale: Locale): Promise<number>
  patch(locale: Partial<Locale>): Promise<number>
  delete(id: string): Promise<number>
}
export interface LocaleService {
  search(filter: LocaleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Locale>>
  load(id: string): Promise<Locale | null>
  create(locale: Locale): Promise<number>
  update(locale: Locale): Promise<number>
  patch(locale: Partial<Locale>): Promise<number>
  delete(id: string): Promise<number>
}

export const localeModel: Attributes = {
  code: {
    key: true,
    length: 40,
    resource: "locale_code",
  },
  name: {
    length: 255,
    resource: "locale_name",
  },
  nativeName: {
    column: "native_name",
    length: 255,
    resource: "locale_native_name",
  },
  countryCode: {
    column: "country_code",
    length: 5,
    resource: "country_code",
  },
  countryName: {
    column: "country_name",
    length: 255,
    resource: "country_name",
  },
  nativeCountryName: {
    column: "native_country_name",
    length: 255,
    resource: "country_native_name",
  },
  dateFormat: {
    column: "date_format",
    length: 14,
    resource: "date_format",
  },
  firstDayOfWeek: {
    column: "first_day_of_week",
    type: "integer",
    operator: "=",
    resource: "first_day_of_week",
  },
  decimalSeparator: {
    column: "decimal_separator",
    length: 3,
    operator: "=",
    resource: "decimal_separator",
  },
  groupSeparator: {
    column: "group_separator",
    length: 3,
    operator: "=",
    resource: "group_separator",
  },
  currencyCode: {
    column: "currency_code",
    length: 3,
    resource: "currency_code",
  },
  currencySymbol: {
    column: "currency_symbol",
    length: 6,
    operator: "=",
    resource: "currency_symbol",
  },
  currencyDecimalDigits: {
    column: "currency_decimal_digits",
    type: "integer",
    operator: "=",
    resource: "currency_decimal_digits",
  },
  currencyPattern: {
    column: "currency_pattern",
    type: "integer",
    operator: "=",
    resource: "currency_pattern",
  },
  currencySample: {
    column: "currency_sample",
    length: 40,
    resource: "currency_sample",
  },
}
