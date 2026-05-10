import { formatText } from "@components/client-script"
import { Error } from "@components/error"
import Input from "@components/form"
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { email, getLang, getResource } from "@resources"
import { getUserService } from "@service/user"
import { headers } from "next/headers"
import { formatPhone } from "web-one"

export default async function Leadership({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const account = await getCurrentUser()
  const lang = getLang(account?.id)
  const resource = getResource(lang)
  const service = getUserService()
  try {
    const contact = await service.load(id)
    if (!contact) {
      logger.warn(`User not found: ${id}`)
      return <Error title={resource.error_404_title} message={resource.error_404_message} />
    }
    return (
      <form id="contactForm" name="contactForm" className="form" noValidate={true}>
        <header>
          <h2>{resource.contact}</h2>
        </header>
        <div className="row">
          <label className="col s12 m6 required">
            {resource.user_id}
            <Input
              type="text"
              id="userId"
              name="userId"
              defaultValue={contact.userId}
              maxLength={100}
              required={true}
              requiredError={formatText(resource.error_required, resource.user_id)}
              placeholder={resource.user_id}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.username}
            <Input
              type="text"
              id="username"
              name="username"
              defaultValue={contact.username}
              maxLength={100}
              required={true}
              requiredError={formatText(resource.error_required, resource.username)}
              placeholder={resource.username}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.email}
            <Input
              type="text"
              id="email"
              name="email"
              data-type="email"
              defaultValue={contact.email}
              maxLength={120}
              required={true}
              requiredError={formatText(resource.error_required, resource.email)}
              pattern={email}
              error={formatText(resource.error_email, resource.email)}
              placeholder={resource.email}
            />
          </label>
          <label className="col s12 m6 required">
            {resource.phone}
            <Input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={formatPhone(contact.phone)}
              maxLength={17}
              required={true}
              requiredError={formatText(resource.error_required, resource.phone)}
              placeholder={resource.phone}
            />
          </label>
        </div>
        <footer>
          <button type="submit" id="btnSubmit" name="btnSubmit">
            {resource.submit}
          </button>
        </footer>
      </form>
    )
  } catch (err) {
    const headerList = await headers()
    const pathname = headerList.get("x-current-path")
    logger.error(`Error at ${pathname}: ${toString(err)}`)
    return <Error title={resource.error_500_title} message={resource.error_500_message} />
  }
}
