import { getLang, getResource } from "@resources"
import LoginForm from "./LoginForm"

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams
  const lang = getLang(query)
  const resource = getResource(lang)
  return <LoginForm lang={lang} resource={resource} />
}
