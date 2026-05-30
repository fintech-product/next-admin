import { Error } from "@components/error"
import { Pagination } from "@components/pagination"
import Search from "@components/search"
import { SortLink } from "@components/sort"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { defaultLimit, getLang, getResource, getStatusName, limits } from "@resources"
import { CountryFilter, getCountryService } from "@service/country"
import Form from "next/form"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { buildFilter, buildSortSearch, getOffset, removeLimit, removePage } from "web-one"

const fields = ["countryCode", "countryName", "nativeCountryName", "decimalSeparator", "groupSeparator", "currencyCode", "currencySymbol", "currencyDecimalDigits", "currencyPattern", "currencySample", "status"]

export default async function CountriesForm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path") as string
  const account = await getCurrentUser()
  if (!account) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }
  const lang = getLang(account?.id)
  const resource = getResource(lang)

  const query = await searchParams
  const filter = buildFilter<CountryFilter>(query, defaultLimit)
  const service = getCountryService()
  try {
    const { list, total } = await service.search(filter, filter.limit, filter.page, fields)

    const search = removePage(query)
    const limitSearch = removeLimit(query)
    const sort = buildSortSearch(query, fields, filter.sort)
    console.log("sort " + JSON.stringify(sort))
    const offset = getOffset(filter.limit, filter.page)

    return (
      <div>
        <header>
          <h2>{resource.countries}</h2>
        </header>
        <div className="main-body">
          <Form id="countriesForm" name="countriesForm" className="form" noValidate={true} action="/countries">
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
              <label className="col s6 l3">
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
              <label className="col s6 l3">
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
            </section>
          </Form>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{resource.number}</th>
                  <th data-field="countryCode">
                    <SortLink id="countryCodeSort" href={sort.countryCode.url} type={sort.countryCode.type} text={resource.country_code} />
                  </th>
                  <th data-field="countryName">
                    <SortLink id="countryNameSort" href={sort.countryName.url} type={sort.countryName.type} text={resource.country_name} />
                  </th>
                  <th data-field="nativeCountryName">
                    <SortLink id="nativeCountryNameSort" href={sort.nativeCountryName.url} type={sort.nativeCountryName.type} text={resource.country_native_name} />
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
                  <th data-field="status">
                    <SortLink id="statusSort" href={sort.status.url} type={sort.status.type} text={resource.status} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-right">{offset + i + 1}</td>
                      <td>{item.countryCode}</td>
                      <td>
                        <Link href={`/countries/${item.countryCode}`} prefetch={false}>{item.countryName}</Link>
                      </td>
                      <td>{item.nativeCountryName}</td>
                      <td>{item.decimalSeparator}</td>
                      <td>{item.groupSeparator}</td>
                      <td>{item.currencyCode}</td>
                      <td>{item.currencySymbol}</td>
                      <td>{item.currencyDecimalDigits}</td>
                      <td>{item.currencyPattern}</td>
                      <td>{item.currencySample}</td>
                      <td>{getStatusName(item.status, resource)}</td>
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
