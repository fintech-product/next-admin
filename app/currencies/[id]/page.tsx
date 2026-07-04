import { BackButton } from "@components/client"
import { formatText } from "@components/client-script"
import { Error } from "@components/error"
import { Input, integerOnBlur, integerOnFocus, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { authorize, hasPrivilege } from "@lib/authorizor"
import { logError, logForbidden, logger } from "@lib/logger"
import { getResource, Status } from "@resources"
import { getCurrencyService } from "@service/currency"
import { getLocale, usLocale } from "locale-service"
import { read, write } from "web-one"

export default async function CurrencyForm({ params }: { params: Promise<{ id: string }> }) {
  const account = await getCurrentUser()
  const resource = getResource(account?.language)
  const permission = await authorize(1)
  if (!hasPrivilege(permission, read)) {
    logForbidden(account)
    return <Error title={resource.error_403_title} message={resource.error_403_message} />
  }
  const locale = getLocale(account?.language) || usLocale

  const { id } = await params
  const service = getCurrencyService()
  try {
    const currency = await service.load(id)
    if (!currency) {
      logger.warn(`Currency not found: ${id}`)
      return <Error title={resource.error_404_title} message={resource.error_404_message} />
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
              <dt className="col s6 l3 xl2">{resource.currency_code}</dt>
              <dd className="col s6 l9 xl10">{currency.code}</dd>
              <dt className="col s6 l3 xl2">{resource.currency_symbol}</dt>
              <dd className="col s6 l9 xl10">{currency.symbol}</dd>
              <dt className="col s6 l3 xl2">{resource.currency_decimal_digits}</dt>
              <dd className="col s6 l9 xl10">{currency.decimalDigits}</dd>
              <dt className="col s6 l3 xl2">{resource.status}</dt>
              <dd className="col s6 l9 xl10">{currency.status === "A" ? resource.active : resource.inactive}</dd>
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
            {resource.currency_code}
            <Input
              type="text"
              id="code"
              name="code"
              defaultValue={currency.code}
              maxLength={100}
              required={true}
              requiredError={formatText(resource.error_required, resource.currency_code)}
              placeholder={resource.currency_code}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.currency_symbol}
            <Input
              type="text"
              id="symbol"
              name="symbol"
              defaultValue={currency.symbol}
              maxLength={5}
              required={true}
              requiredError={formatText(resource.error_required, resource.currency_symbol)}
              placeholder={resource.currency_symbol}
            />
          </label>
          <label className="col s12 m6">
            {resource.currency_decimal_digits}
            <Input
              type="tel"
              id="decimalDigits"
              name="decimalDigits"
              className="right-align"
              defaultValue={currency.decimalDigits}
              maxLength={1}
              min={0}
              max={3}
              onFocus={integerOnFocus}
              onBlur={integerOnBlur}
              placeholder={resource.currency_decimal_digits}
            />
          </label>
          <label className="col s12 m6">
            {resource.status}
            <div className="radio-group">
              <label>
                <input type="radio" id="active" name="status" value={Status.Active} defaultChecked={currency.status === Status.Active} />
                {resource.active}
              </label>
              <label>
                <input type="radio" id="inactive" name="status" value={Status.Inactive} defaultChecked={currency.status === Status.Inactive} />
                {resource.inactive}
              </label>
            </div>
          </label>
        </div>
        <footer>
          <SubmitButton type="submit" id="btnSubmit" name="btnSubmit" api="/api/currencies">
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
