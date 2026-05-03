import { getAuthenticator } from "@lib/authentication"
import { getResource } from "@resources"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Attributes, StringMap } from "onecore"
import { validate } from "validation-core"
import { fromFormData } from "web-one"
import { config } from "../../config"

export const userModel: Attributes = {
  username: {
    required: true,
    length: 100,
    resource: "username",
  },
  password: {
    required: true,
    length: 100,
    resource: "password",
  },
  message: {},
}
export interface User {
  username: string
  password: string
  passcode: string
  message: string
}

export const map: StringMap = {
  "2": "fail_authentication",
  "3": "fail_expired_password",
  "4": "fail_locked_account",
  "9": "fail_disabled_account",
}

export default async function Login({ searchParams }: { searchParams: Promise<{ username?: string; message?: string }> }) {
  const resource = getResource()
  const query = await searchParams

  async function login(formData: FormData) {
    "use server"
    const obj = fromFormData<User>(formData, userModel)
    const errors = validate<User>(obj, userModel, resource)
    if (errors.length > 0) {
      const message = errors[0].message || ""
      redirect(`/login?username=${encodeURI(obj.username)}&message=${encodeURI(message)}`)
    } else {
      const service = getAuthenticator()
      const result = await service.authenticate(obj)
      console.log("Result " + result.status)
      if (result.status === 1) {
        const account = result.user
        if (account) {
          const cookie = await cookies()
          if (!account.displayName) {
            account.displayName = account.username ? account.username : account.email ? account.email : account.id
          }
          const secret = process.env.TOKEN_SECRET || config.token.secret
          const token = sign(
            {
              id: account.id, 
              username: obj.username,
              displayName: account.displayName,
              language: account.language,
              dateFormat: account.dateFormat 
            },
            secret,
            {
              expiresIn: config.token.expires,
            },
          )
          cookie.set("token", token, { httpOnly: true, path: "/" })
        }
        redirect("/news")
      } else {
        let key: string | undefined = map["" + result.status]
        const message = key ? resource[key] : resource.fail_authentication
        redirect(`/login?username=${encodeURI(obj.username)}&message=${encodeURI(message)}`)
      }
    }
  }

  return (
    <div className="central-full">
      <form id="signinForm" name="signinForm" className="form" noValidate={true} autoComplete="off" action={login}>
        <div className="view-body row">
          <img className="logo" src="/logo192.png" alt="logo" />
          <h1>{resource.signin}</h1>
          <div className="message alert-error">{query.message}</div>
          <label className="col s12">
            {resource.username}
            <input type="text" id="username" name="username" defaultValue={query.username} maxLength={100} placeholder={resource.placeholder_username} />
          </label>
          <label className="col s12">
            {resource.password}
            <input type="password" id="password" name="password" maxLength={100} placeholder={resource.placeholder_password} />
          </label>
          <label className="col s12" hidden>
            {resource.passcode}
            <input type="password" id="passcode" name="passcode" maxLength={10} placeholder={resource.placeholder_passcode} />
          </label>
          <label className="col s12 checkbox-container">
            <input type="checkbox" id="remember" name="remember" />
            {resource.signin_remember_me}
          </label>
          <button type="submit" id="btnSignin" name="btnSignin">
            {resource.button_signin}
          </button>
          <Link id="btnForgotPassword" href="/forgot-password">
            {resource.button_forgot_password}
          </Link>
          <Link id="btnSignup" href="/signup">
            {resource.button_signup}
          </Link>
          <Link id="btnHome" href="/">
            {resource.button_home}
          </Link>
        </div>
      </form>
    </div>
  )
}