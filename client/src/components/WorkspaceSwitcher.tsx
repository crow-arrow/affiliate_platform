"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Logo from "@/assets/logo.png";
import { useAppSelector } from "@/redux/hooks";
import { checkRole } from "@/redux/features/auth/authSlice";

type TenantItem = { id: string; name: string; domain: string };

interface WorkspaceSwitcherProps {
  className?: string;
  currentTenant: TenantItem | null;
  tenants?: TenantItem[]; // опционально можно передать готовый список
}

export function WorkspaceSwitcher({ className, currentTenant, tenants: tenantsProp }: WorkspaceSwitcherProps) {
  const [tenants, setTenants] = useState<TenantItem[]>(tenantsProp ?? []);
  const userRole = useAppSelector(checkRole);

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

  const currentLabel = currentTenant?.name
    ? currentTenant.name.length > 18
      ? currentTenant.name.slice(0, 18) + "…"
      : currentTenant.name
    : "No workspace";

  const handleSelect = (t: TenantItem) => {
    if (currentTenant && currentTenant.id === t.id) return;
    if (window.location.host.startsWith("localhost") || window.location.host.startsWith("127.0.0.1")) {
      const params = new URLSearchParams(window.location.search);
      params.set("tenant", t.domain);
      window.location.search = params.toString();
    } else {
      const proto = window.location.protocol + "//";
      const rootParts = window.location.host.split(".");
      const baseHost = rootParts.slice(-2).join(".");
      window.location.href = proto + t.domain + "." + baseHost + window.location.pathname;
    }
  };

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
                <span className="truncate text-xs">{userRole}</span>
              </div>
              
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-[200px]" align="start">
            {tenants.length === 0 && (
              <DropdownMenuItem disabled>No spaces</DropdownMenuItem>
            )}
            {tenants.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onSelect={() => handleSelect(t)}
                className={(currentTenant && t.id === currentTenant.id ? "font-bold bg-muted text-muted-foreground " : "") + " cursor-pointer truncate"}
              >
                {t.name.length > 30 ? t.name.slice(0, 30) + "…" : t.name}
                {currentTenant && t.id === currentTenant.id && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}



