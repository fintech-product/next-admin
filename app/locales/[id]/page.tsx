import BackButton from "@components/client"
import { Error } from "@components/error"
import { Input, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { getLocaleService } from "@service/locale"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function LocaleForm({ params }: { params: Promise<{ id: string }> }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path") as string
  const account = await getCurrentUser()
  if (!account) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }
  const resource = getResource(account?.language)

  const { id } = await params
  const service = getLocaleService()
  try {
    const locale = await service.load(id)
    if (!locale) {
      logger.warn(`Locale not found: ${id}`)
      return <Error title={resource.error_404_title} message={resource.error_404_message} />
    }
    return (
      <form id="currencyForm" name="currencyForm" className="form" noValidate={true}>
        <header>
          <BackButton id="backBtn" name="backBtn" className="btn-back" />
          <h2>{resource.currency}</h2>
        </header>
        <div className="row">
          <label className="col s12 m6 required">
            {resource.locale_code}
            <Input
              type="text"
              id="code"
              name="code"
              defaultValue={locale.code}
              maxLength={11}
              required={true}
              placeholder={resource.locale_code}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.locale_name}
            <Input
              type="text"
              id="code"
              name="code"
              defaultValue={locale.name}
              maxLength={100}
              required={true}
              placeholder={resource.locale_name}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.locale_native_name}
            <Input
              type="text"
              id="nativeName"
              name="nativeName"
              defaultValue={locale.nativeName}
              maxLength={100}
              required={true}
              placeholder={resource.locale_native_name}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.country_code}
            <Input
              type="text"
              id="countryCode"
              name="countryCode"
              defaultValue={locale.countryCode}
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
              defaultValue={locale.countryName}
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
              defaultValue={locale.nativeCountryName}
              maxLength={100}
              required={true}
              placeholder={resource.country_native_name}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.first_day_of_week}
            <Input
              type="tel"
              id="firstDayOfWeek"
              name="firstDayOfWeek"
              data-type="integer"
              className="text-right"
              defaultValue={locale.firstDayOfWeek}
              maxLength={1}
              required={true}
              placeholder={resource.first_day_of_week}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.date_format}
            <Input
              type="text"
              id="dateFormat"
              name="dateFormat"
              defaultValue={locale.dateFormat}
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
              defaultValue={locale.decimalSeparator}
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
              defaultValue={locale.groupSeparator}
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
              defaultValue={locale.groupSeparator}
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
              defaultValue={locale.currencySymbol}
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
              defaultValue={locale.currencyDecimalDigits}
              maxLength={1}
              min={0}
              max={3}
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
              defaultValue={locale.currencyPattern}
              maxLength={1}
              min={0}
              max={3}
              placeholder={resource.currency_pattern}
            />
          </label>
        </div>
        <footer>
          <SubmitButton type="submit" id="btnSubmit" name="btnSubmit" api="/api/locales">
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
