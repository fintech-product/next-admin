import { BackButton } from "@components/client"
import { Error } from "@components/error"
import { Input, integerOnBlur, integerOnFocus, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource, Status } from "@resources"
import { getCountryService } from "@service/country"
import { getLocale, usLocale } from "locale-service"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function CountryForm({ params }: { params: Promise<{ id: string }> }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path") as string
  const account = await getCurrentUser()
  if (!account) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }
  const locale = getLocale(account?.language) || usLocale
  const resource = getResource(account?.language)

  const { id } = await params
  const service = getCountryService()
  try {
    const country = await service.load(id)
    if (!country) {
      logger.warn(`Country not found: ${id}`)
      return <Error title={resource.error_404_title} message={resource.error_404_message} />
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
          <SubmitButton type="submit" id="btnSubmit" name="btnSubmit" api="/api/countries">
            {resource.submit}
          </SubmitButton>
        </footer>
      </form>
    )
  } catch (err) {
    logger.error(`Error at ${pathname}: ${toString(err)}`)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
