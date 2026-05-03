"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { StringMap } from "onecore"
import { SubmitEvent, useActionState, useEffect, useState } from "react"
import { loginAction, LoginState } from "./actions"

export interface Props {
  resource: StringMap
  lang?: string
}

export default function LoginForm({ lang, resource }: Props) {
  const router = useRouter()

  const initialState: LoginState = {
    success: false,
    lang
  }
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const [clientError, setClientError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (state.success) {
      // ✅ client-side redirect only on success
      if (state.lang === "vi") {
        router.push("/vi/")
      } else {
        router.push("/")
      }
    }
  }, [state.success, router])

  function validateClient(): boolean {
    if (!username.trim()) {
      setClientError(resource.username + " is required")
      return false
    }

    if (!password.trim()) {
      setClientError(resource.password + " is required")
      return false
    }

    setClientError("")
    return true
  }

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    if (!validateClient()) {
      e.preventDefault()
    }
  }

  return (
    <div className="central-full">
      <form action={formAction} onSubmit={onSubmit} className="form" noValidate autoComplete="off">
        <div className="view-body row">
          <img className="logo" src="/logo192.png" alt="logo" />
          <h1>{resource.signin}</h1>
          {(clientError || state.message) && (<div className="message alert-error">{clientError || state.message}</div>)}
          <label className="col s12">
            {resource.username}
            <input
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={100}
              placeholder={resource.placeholder_username}
            />
          </label>
          <label className="col s12">
            {resource.password}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={100}
              placeholder={resource.placeholder_password}
            />
          </label>
          <label className="col s12 checkbox-container">
            <input type="checkbox" name="remember" />
            {resource.signin_remember_me}
          </label>
          <button type="submit" disabled={pending}>
            {pending ? "Signing in..." : resource.button_signin}
          </button>
          <Link href="/forgot-password">{resource.button_forgot_password}</Link>
          <Link href="/signup">{resource.button_signup}</Link>
          <Link href="/">{resource.button_home}</Link>
        </div>
      </form>
    </div>
  )
}
