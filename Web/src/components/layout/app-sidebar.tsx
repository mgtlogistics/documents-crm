"use client"

import * as React from "react"
import {
  FileChartColumn,
  // ShoppingCart,
  SquareTerminal,
  User,
  CalendarDays,


} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Administración",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        // {
        //   title: "Tiendas",
        //   url: "/stores",
        // },
      ],
    },
  ],
  projects: [

    {
      name: "Inicio",
      url: "/",
      moduleName: "Dashboard",
      icon: FileChartColumn,
    },
    {
      name: "Roles",
      url: "/roles",
      icon: SquareTerminal,
      moduleName: "Roles",
    },
    {
      name: "Páginas",
      url: "/pages",
      icon: SquareTerminal,
      moduleName: "Pages",
    },
    {
      name: "Usuarios",
      url: "/staff",
      icon: User,
      moduleName: "Staff",
    },
    {
      name: "Documentos",
      url: "/documents",
      icon: FileChartColumn,
      moduleName: "Documents",
    },
    {
      name: "Documentación",
      url: "/requests",
      icon: CalendarDays,
      moduleName: "Requests",
    },
    
    {
      name: "Información fiscal",
      url: "/profileInformation",
      icon: User,
      moduleName: "Requests",
    }
    // {
    //   name: "Clientes",
    //   url: "/clients",
    //   icon: Users,
    // },
    // {
    //   name: "Inventario",
    //   url: "/inventory",
    //   icon: FileChartColumn,
    // },
    // {
    //   name: "Ventas y Facturación",
    //   url: "/sales",
    //   icon: ShoppingCart,
    // },
    // {
    //   name: "Horarios",
    //   url: "/schedule",
    //   icon: CalendarDays,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getProfile } = useAuthStore()
  const userData = getProfile()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
