"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import Logo from "@/assets/logo.png";
import { useAppSelector } from "@/redux/hooks";
import { checkRole } from "@/redux/features/auth/authSlice";

type TenantItem = { id: string; name: string; domain: string };

interface WorkspaceSwitcherProps {
  className?: string;
  currentTenant: TenantItem | null;
  tenants?: TenantItem[]; // опционально можно передать готовый список
  userRole?: string | false; // если false - не показывать, если undefined - использовать из Redux
  variant?: "sidebar" | "standalone"; // вариант отображения
  redirectTo?: "root" | "dashboard"; // куда редиректить: root (/) или dashboard (/my-account)
  onSelectTenant?: (tenant: TenantItem) => void; // callback при выборе tenant (если передан, автоматический редирект не происходит)
  autoRedirect?: boolean; // автоматический редирект при выборе (по умолчанию true, если onSelectTenant не передан)
}

export function WorkspaceSwitcher({
  className,
  currentTenant,
  tenants: tenantsProp,
  userRole: userRoleProp,
  variant = "sidebar",
  redirectTo = "root",
  onSelectTenant,
  autoRedirect = true,
}: WorkspaceSwitcherProps) {
  const [tenants, setTenants] = useState<TenantItem[]>(tenantsProp ?? []);
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(currentTenant);
  const userRoleFromRedux = useAppSelector(checkRole);

  // Обновляем selectedTenant при изменении currentTenant
  useEffect(() => {
    setSelectedTenant(currentTenant);
  }, [currentTenant]);

  // Используем проп если передан, иначе берем из Redux (но только если проп !== false)
  const userRole =
    userRoleProp !== undefined ? (userRoleProp === false ? null : userRoleProp) : userRoleFromRedux;

  useEffect(() => {
    if (tenantsProp && tenantsProp.length >= 0) {
      setTenants(tenantsProp);
      return;
    }
    async function loadTenants() {
      try {
        const axios = (await import("@/utils/axios")).default;
        const res = await axios.get<TenantItem[]>("/auth/my-tenants");
        setTenants(Array.isArray(res.data) ? res.data : []);
      } catch {
        setTenants([]);
      }
    }
    loadTenants();
  }, [tenantsProp]);

  const displayTenant = selectedTenant || currentTenant;
  const currentLabel = displayTenant?.name
    ? displayTenant.name.length > 18
      ? displayTenant.name.slice(0, 18) + "…"
      : displayTenant.name
    : "Select a workspace";

  const handleSelect = (t: TenantItem) => {
    if (selectedTenant && selectedTenant.id === t.id) return;

    setSelectedTenant(t);

    // Если передан callback - вызываем его и не делаем редирект
    if (onSelectTenant) {
      onSelectTenant(t);
      return;
    }

    // Если autoRedirect выключен - не делаем редирект
    if (!autoRedirect) {
      return;
    }

    // Автоматический редирект (старое поведение)
    const host = window.location.host.toLowerCase();
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const path = redirectTo === "dashboard" ? "/my-account" : "";

    if (isLocal) {
      // DEV: path-based роутинг
      window.location.href = `/${t.domain}${path}`;
    } else {
      // PRODUCTION: subdomain-based роутинг
      const parts = host.split(".");
      const baseHost = parts.slice(-2).join(".");
      window.location.href = `${window.location.protocol}//${t.domain}.${baseHost}${path}`;
    }
  };

  // Sidebar вариант
  if (variant === "sidebar") {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full gap-2 px-2 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-0 data-[state=open]:ring-0"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {Logo && <img src={Logo} alt="Workspace logo" className="h-6 w-6" />}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium truncate max-w-[180px]">{currentLabel}</span>
                  {userRole && <span className="truncate text-xs">{userRole}</span>}
                </div>

                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-[200px]"
              align="start"
            >
              {tenants.length === 0 && <DropdownMenuItem disabled>No spaces</DropdownMenuItem>}
              {tenants.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onSelect={() => handleSelect(t)}
                  className={
                    (currentTenant && t.id === currentTenant.id
                      ? "font-bold bg-muted text-muted-foreground "
                      : "") + " cursor-pointer truncate"
                  }
                >
                  {t.name.length > 30 ? t.name.slice(0, 30) + "…" : t.name}
                  {currentTenant && t.id === currentTenant.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Standalone вариант (для homepage)
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[280px] justify-between gap-3 h-auto py-4 px-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex aspect-square size-10 items-center justify-center rounded-lg">
                {Logo && <img src={Logo} alt="Workspace logo" className="h-6 w-6" />}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-medium text-base">{currentLabel}</span>
                {selectedTenant && (
                  <span className="text-xs text-muted-foreground">{selectedTenant.domain}</span>
                )}
              </div>
            </div>
            <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[300px]">
          {tenants.length === 0 && <DropdownMenuItem disabled>No spaces</DropdownMenuItem>}
          {tenants.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onSelect={() => handleSelect(t)}
              className="cursor-pointer py-3"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-primary/10 flex aspect-square size-8 items-center justify-center rounded-lg flex-shrink-0">
                  {Logo && <img src={Logo} alt={t.name} className="h-5 w-5" />}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="font-medium truncate">{t.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{t.domain}</span>
                </div>
                {selectedTenant && selectedTenant.id === t.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
