import { Error } from "@components/error"
import { Input } from "@components/form"
import { Pagination } from "@components/pagination"
import Search from "@components/search"
import { SortLink } from "@components/sort"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { defaultLimit, getLang, getResource, limits } from "@resources"
import { getLocaleService, LocaleFilter } from "@service/locale"
import Form from "next/form"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { buildFilter, buildSortSearch, getOffset, removeLimit, removePage } from "web-one"

const fields = ["code", "name", "nativeName", "countryName", "nativeCountryName", "dateFormat", "firstDayOfWeek", "decimalSeparator", "groupSeparator", "currencyCode", "currencySymbol", "currencyDecimalDigits", "currencyPattern", "currencySample", "status"]

export default async function LocalesForm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path") as string
  const account = await getCurrentUser()
  if (!account) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }
  const lang = getLang(account?.id)
  const resource = getResource(lang)

  const query = await searchParams
  const filter = buildFilter<LocaleFilter>(query, defaultLimit)
  const service = getLocaleService()
  try {
    const { list, total } = await service.search(filter, filter.limit, filter.page, fields)

    const search = removePage(query)
    const limitSearch = removeLimit(query)
    const sort = buildSortSearch(query, fields, filter.sort)
    const offset = getOffset(filter.limit, filter.page)

    return (
      <div>
        <header>
          <h2>{resource.locales}</h2>
        </header>
        <div className="main-body">
          <Form id="localesForm" name="localesForm" className="form" noValidate={true} action="/locales">
            <section className="row search-group">
              <Search
                className="col s12 m6 l4 xl6 search-input"
                limit={filter.limit}
                limits={limits}
                limitSearch={limitSearch}
                id="q"
                name="q"
                defaultValue={filter.q}
                maxLength={40}
                placeholder={resource.keyword}
              />
              <Pagination className="col s12 l4 xl3" total={total} size={filter.limit} page={filter.page} search={search} />
            </section>
            <section className="row search-group advance-search" hidden>
              <label className="col s6 m3">
                {resource.decimal_separator}
                <Input
                  type="text"
                  id="decimalSeparator"
                  name="decimalSeparator"
                  defaultValue={filter.decimalSeparator}
                  maxLength={1}
                  placeholder={resource.decimal_separator}
                />
              </label>
              <label className="col s6 m3">
                {resource.group_separator}
                <Input
                  type="text"
                  id="groupSeparator"
                  name="groupSeparator"
                  defaultValue={filter.groupSeparator}
                  maxLength={1}
                  placeholder={resource.group_separator}
                />
              </label>
              <label className="col s6 m3">
                {resource.date_format}
                <input
                  type="text"
                  id="dateFormat"
                  name="dateFormat"
                  defaultValue={filter.dateFormat}
                  maxLength={12}
                  placeholder={resource.date_format}
                />
              </label>
              <label className="col s6 m3">
                {resource.currency_decimal_digits}
                <input
                  type="tel"
                  id="currencyDecimalDigits"
                  name="currencyDecimalDigits"
                  data-type="integer"
                  className="text-right"
                  defaultValue={filter.currencyDecimalDigits}
                  maxLength={1}
                  placeholder={resource.currency_decimal_digits}
                />
              </label>
              <label className="col s6 m3">
                {resource.currency_pattern}
                <input
                  type="tel"
                  id="currencyPattern"
                  name="currencyPattern"
                  data-type="integer"
                  className="text-right"
                  defaultValue={filter.currencyPattern}
                  maxLength={1}
                  placeholder={resource.currency_pattern}
                />
              </label>
              <label className="col s6 m3">
                {resource.first_day_of_week}
                <input
                  type="text"
                  id="groupSeparator"
                  name="groupSeparator"
                  data-type="integer"
                  className="text-right"
                  defaultValue={filter.groupSeparator}
                  maxLength={1}
                  placeholder={resource.first_day_of_week}
                />
              </label>
            </section>
          </Form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{resource.number}</th>
                  <th data-field="code">
                    <SortLink id="codeSort" href={sort.code.url} type={sort.code.type} text={resource.locale_code} />
                  </th>
                  <th data-field="name">
                    <SortLink id="nameSort" href={sort.name.url} type={sort.name.type} text={resource.locale_name} />
                  </th>
                  <th data-field="nativeName">
                    <SortLink id="nativeNameSort" href={sort.nativeName.url} type={sort.nativeName.type} text={resource.locale_native_name} />
                  </th>
                  <th data-field="countryName">
                    <SortLink id="countryNameSort" href={sort.countryName.url} type={sort.countryName.type} text={resource.country_name} />
                  </th>
                  <th data-field="nativeCountryName">
                    <SortLink id="nativeCountryNameSort" href={sort.nativeCountryName.url} type={sort.nativeCountryName.type} text={resource.country_native_name} />
                  </th>
                  <th data-field="dateFormat">
                    <SortLink id="dateFormatSort" href={sort.dateFormat.url} type={sort.dateFormat.type} text={resource.date_format} />
                  </th>
                  <th data-field="firstDayOfWeek">
                    <SortLink id="firstDayOfWeekSort" href={sort.firstDayOfWeek.url} type={sort.firstDayOfWeek.type} text={resource.first_day_of_week} />
                  </th>
                  <th data-field="decimalSeparator">
                    <SortLink id="decimalSeparatorSort" href={sort.decimalSeparator.url} type={sort.decimalSeparator.type} text={resource.decimal_separator} />
                  </th>
                  <th data-field="groupSeparator">
                    <SortLink id="groupSeparatorSort" href={sort.groupSeparator.url} type={sort.groupSeparator.type} text={resource.group_separator} />
                  </th>
                  <th data-field="currencyCode">
                    <SortLink id="currencyCodeSort" href={sort.currencyCode.url} type={sort.currencyCode.type} text={resource.currency_code} />
                  </th>
                  <th data-field="currencySymbol">
                    <SortLink id="currencySymbolSort" href={sort.currencySymbol.url} type={sort.currencySymbol.type} text={resource.currency_symbol} />
                  </th>
                  <th data-field="currencyDecimalDigits">
                    <SortLink id="currencyDecimalDigitsSort" href={sort.currencyDecimalDigits.url} type={sort.currencyDecimalDigits.type} text={resource.currency_decimal_digits} />
                  </th>
                  <th data-field="currencyPattern">
                    <SortLink id="currencyPatternSort" href={sort.currencyPattern.url} type={sort.currencyPattern.type} text={resource.currency_pattern} />
                  </th>
                  <th data-field="currencySample">
                    <SortLink id="currencySampleSort" href={sort.currencySample.url} type={sort.currencySample.type} text={resource.currency_sample} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-right">{offset + i + 1}</td>
                      <td>{item.code}</td>
                      <td>
                        <Link href={`/locales/${item.code}`} prefetch={false}>{item.name}</Link>
                      </td>
                      <td>{item.nativeName}</td>
                      <td>{item.countryName}</td>
                      <td>{item.nativeCountryName}</td>
                      <td>{item.dateFormat}</td>
                      <td>{item.firstDayOfWeek}</td>
                      <td>{item.decimalSeparator}</td>
                      <td>{item.groupSeparator}</td>
                      <td>{item.currencyCode}</td>
                      <td>{item.currencySymbol}</td>
                      <td>{item.currencyDecimalDigits}</td>
                      <td>{item.currencyPattern}</td>
                      <td>{item.currencySample}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    logger.error(`Error at ${pathname}: ${toString(err)}`)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
