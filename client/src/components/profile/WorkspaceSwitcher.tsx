"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  redirectTo?: "root" | "dashboard"; // куда редиректить: root (/) или dashboard (/overview)
  onSelectTenant?: (tenant: TenantItem) => void; // callback при выборе tenant (если передан, автоматический редирект не происходит)
  autoRedirect?: boolean; // автоматический редирект при выборе (по умолчанию true, если onSelectTenant не передан)
  isMobile?: boolean; // передаём из Sidebar, чтобы управлять направлением дропдауна
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
  isMobile = false,
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

    // Автоматический редирект (path-based роутинг везде)
    const slug = t.domain.split(".")[0]; // Извлекаем slug из domain
    const path = redirectTo === "dashboard" ? "/overview" : "";
    window.location.href = `/${slug}${path}`;
  };

  // Sidebar вариант (в стиле TeamSwitcher)
  if (variant === "sidebar") {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  {Logo && <img src={Logo} alt="Workspace logo" className="h-6 w-6" />}
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium max-w-[180px]">{currentLabel}</span>
                  {userRole && <span className="truncate text-xs">{userRole}</span>}
                </div>

                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>

              {tenants.length === 0 && <DropdownMenuItem disabled>No spaces</DropdownMenuItem>}

              {tenants.map((t) => (
                <DropdownMenuItem key={t.id} onSelect={() => handleSelect(t)}>
                  <div className="flex size-6 items-center justify-center rounded-md">
                    {Logo && <img src={Logo} alt={t.name} className="h-4 w-4" />}
                  </div>

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
            className="w-full h-auto sm:w-auto justify-between gap-3 px-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                {Logo && <img src={Logo} alt="Workspace logo" className="h-6 w-6" />}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-medium truncate">{currentLabel}</span>
              </div>
            </div>
            <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {tenants.length === 0 && <DropdownMenuItem disabled>No spaces</DropdownMenuItem>}
          {tenants.map((t) => (
            <DropdownMenuItem key={t.id} onSelect={() => handleSelect(t)}>
              <div className="flex items-center gap-3 w-full">
                <div className="lex aspect-square size-6 items-center justify-center rounded-lg flex-shrink-0">
                  {Logo && <img src={Logo} alt={t.name} />}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="font-medium truncate">{t.name}</span>
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
