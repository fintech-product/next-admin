import { Attributes, Filter, SearchResult } from "onecore"

export interface Country {
  countryCode: string
  countryName?: string
  nativeCountryName?: string
  dateFormat?: string
  decimalSeparator?: string
  groupSeparator?: string
  currencyCode?: string
  currencySymbol?: string
  currencyDecimalDigits?: number
  currencyPattern?: number
  currencySample?: string
  status?: string
}
export interface CountryFilter extends Filter {
  countryCode?: string
  countryName?: string
  nativeCountryName?: string
  dateFormat?: string
  decimalSeparator?: string
  groupSeparator?: string
  currencyCode?: string
  currencySymbol?: string
  currencyDecimalDigits?: number
  currencyPattern?: number
  currencySample?: string
  status?: string
}

export interface CountryRepository {
  search(filter: CountryFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Country>>
  load(id: string): Promise<Country | null>
  create(country: Country): Promise<number>
  update(country: Country): Promise<number>
  patch(country: Partial<Country>): Promise<number>
  delete(id: string): Promise<number>
}
export interface CountryService {
  search(filter: CountryFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Country>>
  load(id: string): Promise<Country | null>
  create(country: Country): Promise<number>
  update(country: Country): Promise<number>
  patch(country: Partial<Country>): Promise<number>
  delete(id: string): Promise<number>
}

export const countryModel: Attributes = {
  countryCode: {
    key: true,
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
    length: 13,
    resource: "date_format",
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
  status: {
    length: 1,
    operator: "=",
    resource: "status",
  },
}
