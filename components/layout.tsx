import { Nav } from "@components/nav";
import { getMenu } from "@lib/menu";
import { getLangByPath, getResource } from "@resources";
import { headers } from "next/headers";
import { cloneArray, rebuildPath } from "web-one";
import { LayoutClient } from "./client";
import PageHeader from "./page-header";

export default async function LayoutPage({ children }: { children: React.ReactNode }) {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path")
  const lang = getLangByPath(pathname)
  const resource = getResource(lang)
  const rootItems = await getMenu()
  const items = lang !== "en" ? cloneArray(rootItems) : rootItems
  if (lang !== "en") {
    rebuildPath(items, lang)
  }
  const pageHeader = <PageHeader resource={resource} />
  const nav = (
    <>
      <div className="top-banner">
        <div className="logo-banner-wrapper">
          <img
            src="https://fptsoftware.com/-/media/project/fpt-software/fso/industries/industries-healthcare/healthcare-lp_banner.png"
            alt="Banner of The Company"
          />
          <img
            src="https://fptsoftware.com/-/media/project/fpt-software/fso/industries/banner/media-desktop.webp"
            className="banner-logo-title"
            alt="Logo of The Company"
          />
        </div>
      </div>
      <div className="menu sidebar">
        <Nav items={items} resource={resource} />
      </div>
    </>
  )
  return (
    <LayoutClient nav={nav} header={pageHeader}>
      {children}
    </LayoutClient>
  )
}
