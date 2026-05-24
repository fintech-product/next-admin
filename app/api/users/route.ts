import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { getUserService, User, userModel } from "@service/user"
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

  const user: User = await req.json()

  const errors = validate(user, userModel, resource)
  console.log("Errors " + JSON.stringify(errors))

  if (errors.length > 0) {
    return NextResponse.json({ errors: errors }, { status: 422 })
  }

  const service = getUserService()
  try {
    const res = await service.update(user)
    const status = res > 0 ? 200 : res === 0 ? 410 : 409
    return NextResponse.json(res, { status })
  } catch (err) {
    logger.error(`Error at PUT /users: ${toString(err)}`)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
