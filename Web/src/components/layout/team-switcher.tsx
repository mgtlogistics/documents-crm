"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore"

import { ChevronsUpDown, Home } from "lucide-react"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { access, activeStore, setActiveStore } = useAuthStore()

  const stores = access?.stores ?? []
  const selectedStore = activeStore ?? stores[0] ?? null
  const selectedStoreId = selectedStore?._id ?? selectedStore?.id ?? ""
  const selectedStoreLabel = selectedStore ? selectedStore.name : "Selecciona una sede"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={selectedStoreLabel}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                <Home className="h-4 w-4" />
              </div>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">Sede activa</span>
                <span className="truncate text-xs text-muted-foreground">{selectedStoreLabel}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={8}
          >
            <DropdownMenuLabel>Sedes disponibles</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={selectedStoreId}
              onValueChange={setActiveStore}
            >
              {stores.map((store) => {
                const storeId = store._id ?? store.id ?? ""

                if (!storeId) {
                  return null
                }

                return (
                  <DropdownMenuRadioItem key={storeId} value={storeId}>
                    {store.name}
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
