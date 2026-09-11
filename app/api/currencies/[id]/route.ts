import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { Currency, currencyModel, getCurrencyService } from "@service/currency"
import { NextRequest, NextResponse } from "next/server"
import { validate } from "validation-core"
import { isSuccessful } from "web-one"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const account = await getCurrentUser()
  if (!account) {
    return new NextResponse("Require authentication", {
      status: 401,
      headers: { "Content-Type": "text/plain" },
    })
  }
  const { id } = await params
  const resource = getResource(account.language)
  const currency: Currency = await req.json()

  const errors = validate(currency, currencyModel, resource)
  if (errors.length > 0) {
    return NextResponse.json(errors, { status: 422 })
  }

  const service = getCurrencyService()
  try {
    let res: number
    if (id === "new") {
      res = await service.create(currency)
    } else {
      res = await service.update(currency)
    }
    const status = isSuccessful(res) ? 200 : 410
    return NextResponse.json(res, { status })
  } catch (err) {
    logger.error(`Error at POST /currencies: ${toString(err)}`)
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
