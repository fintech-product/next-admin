import { enLocale, getLocale } from "locale-service"
import { StringMap } from "onecore"
import { en as authenticationEN } from "./authentication/en"
import { vi as authenticationVI } from "./authentication/vi"
import { en as commonEN } from "./en"
import { vi as commonVI } from "./vi"

export const limits = [12, 24, 60, 100, 120, 180, 300, 600]
export const defaultLimit = 12
export const sort = "sort"
export const page = "page"
export const limit = "limit"

export interface Resources {
  [key: string]: StringMap
}

const en: StringMap = {
  ...commonEN,
  ...authenticationEN,
}
const vi: StringMap = {
  ...commonVI,
  ...authenticationVI,
}

export const resources: Resources = {
  en: en,
  vi: vi,
}

export function getDateFormat(lang?: string): string {
  if (!lang) {
    return enLocale.dateFormat
  }
  const locale = getLocale(lang) || enLocale
  return locale.dateFormat
}
export function isDefaultLang(lang?: string): boolean {
  return !lang || lang === "en"
}
export function getLangSearch(lang?: string): string {
  return (!lang || lang === "en") ? "" : `?lang=${lang}`
}

export function getResource(lang?: string | null): StringMap {
  const l = lang ? lang : "en"
  const r = resources[l]
  return r ? r : resources["en"]
}

export function getLangByPath(path?: string | null): string {
  if (!path) {
    return "en"
  }
  return path === "/vi" || path.startsWith("/vi/") ? "vi" : "en"
}
export function getLang(record: Record<string, string | string[] | undefined>): string {
  const x = record["lang"]
  if (!x) {
    return "en"
  }
  if (Array.isArray(x)) {
    if (x.length > 0) {
      return getLangByString(x[x.length - 1])
    } else {
      return "en"
    }
  }
  return getLangByString(x)
}
function getLangByString(s?: string | null): string {
  if (!s) {
    return "en"
  }
  if (s !== "vi") {
    return "en"
  }
  return s
}
