import { formatText } from "@components/client-script"
import { Error } from "@components/error"
import { Input, SubmitButton } from "@components/form"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getLang, getResource, Status } from "@resources"
import { getCurrencyService } from "@service/currency"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function CurrencyForm({ params }: { params: Promise<{ id: string }> }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path") as string
  const account = await getCurrentUser()
  if (!account) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }
  const lang = getLang(account?.id)
  const resource = getResource(lang)

  const { id } = await params
  const service = getCurrencyService()
  try {
    const currency = await service.load(id)
    if (!currency) {
      logger.warn(`Currency not found: ${id}`)
      return <Error title={resource.error_404_title} message={resource.error_404_message} />
    }
    return (
      <form id="contactForm" name="contactForm" className="form" noValidate={true}>
        <header>
          <h2>{resource.contact}</h2>
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
              requiredError={formatText(resource.error_required, resource.currency_id)}
              placeholder={resource.currency_id}
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
              requiredError={formatText(resource.error_required, resource.currency_name)}
              placeholder={resource.currency_name}
            />
          </label>
          <label className="col s12 m6">
            {resource.currency_decimal_digits}
            <Input
              type="tel"
              id="decimalDigits"
              name="decimalDigits"
              defaultValue={currency.decimalDigits}
              maxLength={1}
              min={0}
              max={3}
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
    logger.error(`Error at ${pathname}: ${toString(err)}`)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
