import { BackButton } from "@components/client"
import { Error } from "@components/error"
import { digitOnKeyDown, Input, integerOnBlur, integerOnFocus, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { authorize, hasPrivilege } from "@lib/authorizor"
import { logError, logForbidden, logger } from "@lib/logger"
import { getResource, Status } from "@resources"
import { Country, getCountryService } from "@service/country"
import { getLocale, usLocale } from "locale-service"
import { read, write } from "web-one"

function createCountry(): Country {
  const country = { status: Status.Active }
  return country as Country
}
export default async function CountryForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const newMode = id === "new"
  const account = await getCurrentUser()
  const resource = getResource(account?.language)
  const permission = await authorize(1)
  const canRead = hasPrivilege(permission, read)
  const canWrite = hasPrivilege(permission, write)

  if (!canRead || (newMode && !canWrite)) {
    logForbidden(account)
    return <Error title={resource.error_403_title} message={resource.error_403_message} />
  }
  const locale = getLocale(account?.language) || usLocale

  const service = getCountryService()
  try {
    let country: Country | null = createCountry()
    if (!newMode) {
      country = await service.load(id)
      if (!country) {
        logger.warn(`Country not found: ${id}`)
        return <Error title={resource.error_404_title} message={resource.error_404_message} />
      }
    }

    if (!canWrite) {
      return (
        <form id="countryForm" name="countryForm" className="form" noValidate={true}>
          <header>
            <h2>{resource.country}</h2>
          </header>
          <div>
            <dl className="data-list row">
              <dt className="col s6 m3 xl2">{resource.country_code}</dt>
              <dd className="col s6 m3 xl4">{country.countryCode}</dd>
              <dt className="col s6 m3 xl2">{resource.country_name}</dt>
              <dd className="col s6 m3 xl4">{country.countryName}</dd>
              <dt className="col s6 m3 xl2">{resource.country_native_name}</dt>
              <dd className="col s6 m3 xl4">{country.nativeCountryName}</dd>
              <dt className="col s6 m3 xl2">{resource.date_format}</dt>
              <dd className="col s6 m3 xl4">{country.dateFormat}</dd>
              <hr />
              <dt className="col s6 m3 xl2">{resource.decimal_separator}</dt>
              <dd className="col s6 m3 xl4">{country.decimalSeparator}</dd>
              <dt className="col s6 m3 xl2">{resource.group_separator}</dt>
              <dd className="col s6 m3 xl4">{country.groupSeparator}</dd>
              <hr />
              <dt className="col s6 m3 xl2">{resource.currency_code}</dt>
              <dd className="col s6 m3 xl4">{country.currencyCode}</dd>
              <dt className="col s6 m3 xl2">{resource.currency_symbol}</dt>
              <dd className="col s6 m3 xl4">{country.currencySymbol}</dd>
              <dt className="col s6 m3 xl2">{resource.currency_decimal_digits}</dt>
              <dd className="col s6 m3 xl4">{country.currencyDecimalDigits}</dd>
              <dt className="col s6 m3 xl2">{resource.currency_pattern}</dt>
              <dd className="col s6 m3 xl4">{country.currencyPattern}</dd>
              <dt className="col s6 m3 xl2">{resource.currency_sample}</dt>
              <dd className="col s6 m3 xl4">{country.currencySample}</dd>
              <dt className="col s6 m3 xl2">{resource.status}</dt>
              <dd className="col s6 m3 xl4">{country.status === "A" ? resource.active : resource.inactive}</dd>
            </dl>
          </div>
          <footer>
            <BackButton type="submit" id="closeBtn" name="closeBtn">
              {resource.close}
            </BackButton>
          </footer>
        </form>
      )
    }
    return (
      <form
        id="countryForm"
        name="countryForm"
        className="form"
        noValidate={true}
        data-required-error={resource.error_required}
        data-integer-error={resource.error_integer}
        data-min-error={resource.error_min}
        data-max-error={resource.error_max}
        data-group-separator={locale.groupSeparator}
      >
        <header>
          <BackButton id="backBtn" name="backBtn" className="btn-back" />
          <h2>{resource.country}</h2>
        </header>
        <div className="row">
          <label className="col s12 m6 required">
            {resource.country_code}
            <Input
              type="text"
              id="countryCode"
              name="countryCode"
              defaultValue={country.countryCode}
              readOnly={!newMode}
              maxLength={2}
              required={true}
              placeholder={resource.country_code}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.country_name}
            <Input
              type="text"
              id="countryName"
              name="countryName"
              defaultValue={country.countryName}
              maxLength={100}
              required={true}
              placeholder={resource.country_name}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.country_native_name}
            <Input
              type="text"
              id="nativeCountryName"
              name="nativeCountryName"
              defaultValue={country.nativeCountryName}
              maxLength={100}
              required={true}
              placeholder={resource.country_native_name}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.date_format}
            <Input
              type="text"
              id="dateFormat"
              name="dateFormat"
              defaultValue={country.dateFormat}
              maxLength={13}
              required={true}
              placeholder={resource.date_format}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.decimal_separator}
            <Input
              type="text"
              id="decimalSeparator"
              name="decimalSeparator"
              defaultValue={country.decimalSeparator}
              maxLength={1}
              required={true}
              placeholder={resource.decimal_separator}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.group_separator}
            <Input
              type="text"
              id="groupSeparator"
              name="groupSeparator"
              defaultValue={country.groupSeparator}
              maxLength={1}
              required={true}
              placeholder={resource.group_separator}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.currency_code}
            <Input
              type="text"
              id="currencyCode"
              name="currencyCode"
              defaultValue={country.groupSeparator}
              maxLength={1}
              required={true}
              placeholder={resource.currency_code}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.currency_symbol}
            <Input
              type="text"
              id="currencySymbol"
              name="currencySymbol"
              defaultValue={country.currencySymbol}
              maxLength={4}
              required={true}
              placeholder={resource.currency_symbol}
            />
          </label>
          <label className="col s12 m6">
            {resource.currency_decimal_digits}
            <Input
              type="tel"
              id="currencyDecimalDigits"
              name="currencyDecimalDigits"
              data-type="integer"
              className="text-right"
              defaultValue={country.currencyDecimalDigits}
              maxLength={1}
              min={0}
              max={3}
              onKeyDown={digitOnKeyDown}
              onFocus={integerOnFocus}
              onBlur={integerOnBlur}
              placeholder={resource.currency_decimal_digits}
            />
          </label>
          <label className="col s12 m6">
            {resource.currency_pattern}
            <Input
              type="tel"
              id="currencyPattern"
              name="currencyPattern"
              data-type="integer"
              className="text-right"
              defaultValue={country.currencyPattern}
              maxLength={1}
              min={0}
              max={3}
              onKeyDown={digitOnKeyDown}
              onFocus={integerOnFocus}
              onBlur={integerOnBlur}
              placeholder={resource.currency_pattern}
            />
          </label>
          <label className="col s12 m6">
            {resource.status}
            <div className="radio-group">
              <label>
                <input type="radio" id="active" name="status" value={Status.Active} defaultChecked={country.status === Status.Active} />
                {resource.active}
              </label>
              <label>
                <input type="radio" id="inactive" name="status" value={Status.Inactive} defaultChecked={country.status === Status.Inactive} />
                {resource.inactive}
              </label>
            </div>
          </label>
        </div>
        <footer>
          <SubmitButton
            type="submit"
            id="btnSubmit"
            name="btnSubmit"
            api={`/api/countries/${id}`}
            confirmMessage={resource.msg_confirm_save}
            successMessage={resource.msg_save_success}
            parsingError={resource.error_response_body}
            networkError={resource.error_network}
          >
            {resource.submit}
          </SubmitButton>
        </footer>
      </form>
    )
  } catch (err) {
    logError(err)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
