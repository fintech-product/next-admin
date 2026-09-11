import { getCurrentUser } from "@lib/account"
import { logger, toString } from "@lib/logger"
import { getResource } from "@resources"
import { getUserService, User, userModel } from "@service/user"
import { NextRequest, NextResponse } from "next/server"
import { validate } from "validation-core"

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
  const user: User = await req.json()

  const errors = validate(user, userModel, resource)
  if (errors.length > 0) {
    return NextResponse.json(errors, { status: 422 })
  }

  const service = getUserService()
  try {
    let res: number
    if (id === "new") {
      res = await service.create(user)
    } else {
      res = await service.update(user)
    }
    const status = res > 0 ? 200 : res === 0 ? 410 : 409
    return NextResponse.json(res, { status })
  } catch (err) {
    logger.error(`Error at POST /users/${id}: ${toString(err)}`)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
