import { Nav } from "@components/nav";
import { getMenu } from "@lib/menu";
import { getLangByPath, getResource } from "@resources";
import { headers } from "next/headers";
import Link from "next/link";
import { cloneArray, rebuildPath } from "web-one";
import { ToggleMenu, ToggleUniversalSearch } from "./client";
import { ToggleSidebar, ToggleTheme } from "./menu";

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
  return (
    <div id="root">
      <div className="sidebar-parent menu-on">
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
        <div className="page-container">
          <div className="page-header">
            <form>
              <div className="search-group">
                <section>
                  <ToggleMenu className="toggle-menu" />
                  <ToggleUniversalSearch className="toggle-search"/>
                  <ToggleUniversalSearch className="close-search"/>
                </section>
                <div className="logo-wrapper">
                  <img className="logo" src="../logo192.png" alt="Logo of The Company" />
                </div>
                <label className="search-input">
                  <input type="text" id="q" name="q" maxLength={80} placeholder={resource.keyword} autoComplete="off" />
                  <button type="button" hidden className="btn-remove-text"></button>
                  <button type="button" className="btn-search"></button>
                </label>
                <section className="quick-nav">
                  <div className="dropdown-menu-profile">
                    <i className="material-icons">person</i>
                    <ul id="dropdown-basic" className="dropdown-content-profile">
                      <ToggleSidebar className="menu" mode="menu" sidebarText={resource.sidebar} sidebarIcon="view_list" menuText={resource.menu} menuIcon="credit_card" />
                      <hr />
                      <ToggleTheme theme="light" darkText={resource.dark_mode} darkIcon="timelapse" lightText={resource.light_mode} lightIcon="radio_button_checked" />
                      <hr />
                      <li>
                        <i className="material-icons">account_circle</i>
                        <Link href="/settings">kaka</Link>
                      </li>
                      <hr />
                      <li>
                        <i className="material-icons">exit_to_app</i>
                        <button>Sign out</button>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </form>
          </div>
          <div id="pageBody" className="page-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
