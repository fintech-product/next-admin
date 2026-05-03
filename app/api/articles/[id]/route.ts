import { getCurrentUser } from "@lib/account"
import { getArticleService } from "@service/article"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const account = await getCurrentUser()
  if (!account) {
    return new NextResponse("Require authentication", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
  const { id } = await params
  const service = getArticleService()
  const res = await service.save(account.id, id)
  const status = res > 0 ? 200 : res === 0 ? 409 : 422
  return NextResponse.json(res, { status })
}
