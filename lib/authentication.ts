import { Authenticator, initializeStatus, SqlAuthTemplateConfig, User, useUserRepository } from "authen-service"
import { compare } from "bcryptjs"
import { db } from "./db"

const authConfig = {
  status: {
    success: 1,
    password_expired: 3,
    locked: 4,
    suspended: 5,
    disabled: 6,
  },
  lockedMinutes: 2,
  maxPasswordFailed: 5,
  account: {
    displayName: "displayname",
  },
  userStatus: {
    activated: "A",
    deactivated: "I",
    disable: "D",
    suspended: "S",
  },
  db: {
    user: "users",
    password: "passwords",
    id: "user_id",
    username: "username",
    status: "status",
    successTime: "success_time",
    failTime: "fail_time",
    failCount: "fail_count",
    lockedUntilTime: "locked_until_time",
  },
  query: `
      select u.user_id, u.username, u.display_name, email, u.status, u.max_password_age, 
        p.password, p.success_time, p.fail_time, p.fail_count, p.locked_until_time, p.changed_time
      from users u
      inner join passwords p
        on u.user_id = p.user_id
      where username = $1`,
  expires: 500,
  template: {
    subject: "Verification Code",
    body: "%s Use this code for verification. This code will expire in %s minutes",
  },
}

const map = {
  user_id: "id",
  display_name: "displayName",
  max_password_age: "maxPasswordAge",
  success_time: "successTime",
  fail_time: "failTime",
  fail_count: "failCount",
  locked_until_time: "lockedUntilTime",
  changed_time: "passwordModifiedTime",
}

let authenticator: Authenticator<User, string> | undefined
export function getAuthenticator(): Authenticator<User, string> {
  console.log("enter getAuthenticator")
  if (!authenticator) {
    const status = initializeStatus(authConfig.status)
    const userRepository = useUserRepository<string, SqlAuthTemplateConfig>(db, authConfig, map)
    authenticator = new Authenticator(status, compare, authConfig.account, userRepository, undefined, authConfig.lockedMinutes, authConfig.maxPasswordFailed)
  }
  return authenticator
}
