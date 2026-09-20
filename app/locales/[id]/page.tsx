import { BackButton } from "@components/client"
import { Error } from "@components/error"
import { digitOnKeyDown, Input, integerOnBlur, integerOnFocus, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { authorize, hasPrivilege } from "@lib/authorizor"
import { logError, logForbidden, logger } from "@lib/logger"
import { getResource, Status } from "@resources"
import { getLocaleService, Locale } from "@service/locale"
import { create, read, write } from "web-one"

export default async function LocaleForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const newMode = id === Status.New
  const account = await getCurrentUser()
  const resource = getResource(account?.language)
  const permission = await authorize(1)
  const canRead = hasPrivilege(permission, read)
  const canWrite = hasPrivilege(permission, write)

  if (!canRead || (newMode && !canWrite)) {
    logForbidden(account)
    return <Error title={resource.error_403_title} message={resource.error_403_message} />
  }

  const service = getLocaleService()
  try {
    let locale: Locale | null = create<Locale>()
    if (!newMode) {
      locale = await service.load(id)
      if (!locale) {
        logger.warn(`Locale not found: ${id}`)
        return <Error title={resource.error_404_title} message={resource.error_404_message} />
      }
    }

    const canWrite = hasPrivilege(permission, write)
    if (!canWrite) {
      return (
        <form id="currencyForm" name="currencyForm" className="form" noValidate={true}>
          <header>
            <h2>{resource.currency}</h2>
          </header>
          <div>
            <dl className="data-list row">
              <dt className="col s6 m3 l2 xl2">{resource.locale_code}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.code}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.locale_name}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.name}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.locale_native_name}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.nativeName}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.country_code}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.countryCode}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.country_name}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.countryName}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.country_native_name}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.nativeCountryName}</dd>
              <hr />
              <dt className="col s6 m3 l2 xl2">{resource.decimal_separator}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.decimalSeparator}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.group_separator}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.groupSeparator}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.currency_pattern}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.currencyPattern}</dd>
              <hr />
              <dt className="col s6 m3 l2 xl2">{resource.currency_code}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.currencyCode}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.currency_symbol}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.currencySymbol}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.currency_decimal_digits}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.currencyDecimalDigits}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.currency_sample}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.currencySample}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.date_format}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.dateFormat}</dd>
              <dt className="col s6 m3 l2 xl2">{resource.first_day_of_week}</dt>
              <dd className="col s6 m3 l4 xl2">{locale.firstDayOfWeek}</dd>
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
        id="currencyForm"
        name="currencyForm"
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
              readOnly={!newMode}
              maxLength={11}
              required={true}
              placeholder={resource.locale_code}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.locale_name}
            <Input type="text" id="code" name="code" defaultValue={locale.name} maxLength={100} required={true} placeholder={resource.locale_name} />
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
              min={1}
              max={7}
              onKeyDown={digitOnKeyDown}
              onFocus={integerOnFocus}
              onBlur={integerOnBlur}
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
              onKeyDown={digitOnKeyDown}
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
              onKeyDown={digitOnKeyDown}
              placeholder={resource.currency_pattern}
            />
          </label>
        </div>
        <footer>
          <SubmitButton
            type="submit"
            id="btnSubmit"
            name="btnSubmit"
            api={`/api/locales/${id}`}
            confirmMessage={resource.msg_confirm_save}
            successMessage={resource.msg_save_success}
            forbiddenError={resource.error_403}
            parsingError={resource.error_response_body}
            networkError={resource.error_network}
            conflictError={resource.error_409}
            goneError={resource.error_410}
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
