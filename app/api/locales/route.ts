
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { getLocaleService, Locale, localeModel } from "@service/locale"
import { NextRequest, NextResponse } from "next/server"
import { validate } from "validation-core"

export async function POST(req: NextRequest) {
  const account = await getCurrentUser()
  if (!account) {
    return new NextResponse("Require authentication", {
      status: 401,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const lang = account.language
  const resource = getResource(lang)
  const locale: Locale = await req.json()

  const errors = validate(locale, localeModel, resource)
  if (errors.length > 0) {
    return NextResponse.json(errors, { status: 422 })
  }

  const service = getLocaleService()
  try {
    const res = await service.update(locale)
    const status = res > 0 ? 200 : res === 0 ? 410 : 409
    return NextResponse.json(res, { status })
  } catch (err) {
    logger.error(`Error at POST /locales: ${toString(err)}`)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
