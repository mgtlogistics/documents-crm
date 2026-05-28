"use client"

import {
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router-dom"


import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import ProtectedModule from "../global/ProtectedModule"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    moduleName: string
  }[]
}) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => (
          <ProtectedModule key={item.name} page={item.moduleName} type="read" method="hide">
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </ProtectedModule>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
