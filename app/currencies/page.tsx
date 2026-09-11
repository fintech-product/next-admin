import { Error } from "@components/error"
import { digitOnKeyDown, Input } from "@components/form"
import { Pagination } from "@components/pagination"
import Search from "@components/search"
import { SortLink } from "@components/sort"
import { getCurrentUser } from "@lib/account"
import { authorize, hasPrivilege } from "@lib/authorizor"
import { logError, logForbidden } from "@lib/logger"
import { defaultLimit, getResource, getStatusName, limits } from "@resources"
import { CurrencyFilter, getCurrencyService } from "@service/currency"
import Form from "next/form"
import Link from "next/link"
import { buildFilter, buildSortSearch, getOffset, read, removeLimit, removePage, write } from "web-one"

const fields = ["code", "symbol", "decimalDigits", "status"]

export default async function CurrenciesForm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const account = await getCurrentUser()
  const resource = getResource(account?.language)
  const permission = await authorize()
  const canRead = hasPrivilege(permission, read)
  const canWrite = hasPrivilege(permission, write)
  if (!canRead) {
    logForbidden(account)
    return <Error title={resource.error_403_title} message={resource.error_403_message} />
  }

  const query = await searchParams
  const filter = buildFilter<CurrencyFilter>(query, defaultLimit)
  const service = getCurrencyService()
  try {
    const { list, total } = await service.search(filter, filter.limit, filter.page, fields)

    const search = removePage(query)
    const limitSearch = removeLimit(query)
    const sort = buildSortSearch(query, fields, filter.sort)
    const offset = getOffset(filter.limit, filter.page)

    return (
      <div>
        <header>
          <h2>{resource.currencies}</h2>
          {canWrite && <Link href="/currencies/new" id="newBtn" className="btn-new" prefetch={false} />}
        </header>
        <div className="main-body">
          <Form id="currenciesForm" name="currenciesForm" className="form" noValidate={true} action="/currencies">
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
              <label className="col s12 m6 l4 xl6">
                {resource.currency_decimal_digits}
                <Input
                  type="tel"
                  id="decimalDigits"
                  name="decimalDigits"
                  dataType="integer"
                  className="text-right"
                  defaultValue={filter.decimalDigits}
                  maxLength={1}
                  onKeyDown={digitOnKeyDown}
                  placeholder={resource.currency_decimal_digits}
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
                    <SortLink id="codeSort" href={sort.code.url} type={sort.code.type} text={resource.currency_code} />
                  </th>
                  <th data-field="symbol">
                    <SortLink id="symbolSort" href={sort.symbol.url} type={sort.symbol.type} text={resource.currency_symbol} />
                  </th>
                  <th data-field="decimalDigits">
                    <SortLink id="decimalDigitsSort" href={sort.decimalDigits.url} type={sort.decimalDigits.type} text={resource.currency_decimal_digits} />
                  </th>
                  <th data-field="status">
                    <SortLink id="statusSort" href={sort.status.url} type={sort.status.type} text={resource.status} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((currency, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-right">{offset + i + 1}</td>
                      <td>
                        <Link href={`/currencies/${currency.code}`} prefetch={false}>
                          {currency.code}
                        </Link>
                      </td>
                      <td>{currency.symbol}</td>
                      <td className="text-right">{currency.decimalDigits}</td>
                      <td>{getStatusName(currency.status, resource)}</td>
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
    logError(err)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
