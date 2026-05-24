
import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { getRoleService, Role, roleModel } from "@service/role"
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

  const role: Role = await req.json()

  const errors = validate(role, roleModel, resource)
  console.log("Errors " + JSON.stringify(errors))

  if (errors.length > 0) {
    return NextResponse.json({ errors: errors }, { status: 422 })
  }

  const service = getRoleService()
  try {
    const res = await service.update(role)
    const status = res > 0 ? 200 : res === 0 ? 410 : 409
    return NextResponse.json(res, { status })
  } catch (err) {
    logger.error(`Error at POST /roles: ${toString(err)}`)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
