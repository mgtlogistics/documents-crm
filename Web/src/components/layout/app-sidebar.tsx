"use client"

import * as React from "react"
import {
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileChartColumn,
  FolderOpen,
  LayoutDashboard,
  MapPinned,
  PanelsTopLeft,
  ReceiptText,
  ShieldCheck,
  Store,
  User,
} from "lucide-react"

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

const data = {
  projects: [
    {
      name: "Inicio",
      url: "/",
      moduleName: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Roles",
      url: "/roles",
      icon: ShieldCheck,
      moduleName: "Roles",
    },
    {
      name: "Páginas",
      url: "/pages",
      icon: PanelsTopLeft,
      moduleName: "Pages",
    },
    {
      name: "Tiendas",
      url: "/stores",
      icon: Store,
      moduleName: "Stores",
    },
    {
      name: "Usuarios",
      url: "/staff",
      icon: User,
      moduleName: "Staff",
    },
    {
      name: "Clientes",
      url: "/clients",
      icon: BriefcaseBusiness,
      moduleName: "Staff",
    },
    {
      name: "Inventario",
      url: "/inventory",
      icon: Boxes,
      moduleName: "Inventory",
    },
    {
      name: "Ventas y facturación",
      url: "/sales",
      icon: ReceiptText,
      moduleName: "Sales",
    },
    {
      name: "Horarios",
      url: "/schedule",
      icon: CalendarDays,
      moduleName: "Schedule",
    },
    {
      name: "Documentos",
      url: "/documents",
      icon: FileChartColumn,
      moduleName: "Documents",
    },
    {
      name: "Carpetas de documentos",
      url: "/document-folders",
      icon: FolderOpen,
      moduleName: "Documents",
    },
    {
      name: "Documentación",
      url: "/requests",
      icon: ClipboardList,
      moduleName: "Requests",
    },
    {
      name: "Información fiscal",
      url: "/profileInformation",
      icon: MapPinned,
      moduleName: "Requests",
    },
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
