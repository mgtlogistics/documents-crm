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
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <ProtectedModule key={item.name} page={item.moduleName} type="read" method="hide">
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="shrink-0" aria-hidden="true" />
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
