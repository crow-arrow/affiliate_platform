"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  FileText,
  Package,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import {} from "react";

import { NavMain } from "@/components/navigation/nav-main";
import { NavSecondary } from "@/components/navigation/nav-secondary";
import { NavUser } from "@/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/redux/hooks";
import { checkRole } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import { Link, useLocation } from "react-router-dom";

import LogoWhite from "@/assets/jinn.svg";
import LogoDark from "@/assets/jinn-dark.svg";
import {} from "@/components/ui/dropdown-menu";
import {} from "lucide-react";
import { WorkspaceSwitcher } from "../profile/WorkspaceSwitcher";
import { useMemo } from "react";
import { extractTenantSlugFromPath, addTenantSlugToPath } from "@/constants/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  const avatar = user?.avatarUrl ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}` : "";
  const userName = user?.first_name ?? "Guest User";
  const userEmail = user?.email ?? "exemple@jinn-travel.com";
  const tenant = useAppSelector((state: RootState) => state.tenant.current);
  const location = useLocation();
  const isAdmin = useAppSelector(checkRole) === "ADMIN";

  // Получаем tenant slug из Redux или из URL пути
  const tenantSlug = useMemo(() => {
    // Приоритет 1: из Redux state
    if (tenant?.slug) {
      return tenant.slug;
    }
    // Приоритет 2: из URL пути
    return extractTenantSlugFromPath(location.pathname);
  }, [tenant?.slug, location.pathname]);

  // Функция для добавления tenant slug к относительным путям
  const getUrl = useMemo(
    () => (path: string) => addTenantSlugToPath(path, tenantSlug),
    [tenantSlug]
  );

  const navMain = [
    {
      title: "Dashboard",
      url: getUrl("/my-account"),
      icon: SquareTerminal, // или LayoutDashboard
    },
    {
      title: "Trips",
      url: getUrl("/trips"),
      icon: BookOpen,
    },
    {
      title: "Clicks list",
      url: getUrl("/clicks-list"),
      icon: Settings2,
    },
    {
      title: "Documents",
      url: getUrl("/documents"),
      icon: BookOpen,
    },
  ].map((item) => ({
    ...item,
    isActive: location.pathname === item.url || location.pathname.startsWith(`${item.url}/`),
  }));

  const adminNav = [
    {
      title: "Dashboard",
      url: getUrl("/admin/dashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "Team",
      url: getUrl("/admin/team"),
      icon: Users,
    },
    {
      title: "Orders",
      url: getUrl("/admin/orders"),
      icon: Package,
    },
    {
      title: "Calendar",
      url: getUrl("/admin/calendar"),
      icon: Calendar,
    },
    {
      title: "Invoices",
      url: getUrl("/admin/invoices"),
      icon: FileText,
    },
  ].map((item) => ({
    ...item,
    isActive: location.pathname === item.url || location.pathname.startsWith(`${item.url}/`),
  }));

  const data = {
    user: {
      name: userName,
      email: userEmail,
      avatar: avatar,
    },
    adminNav,
    navMain,
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <WorkspaceSwitcher
                currentTenant={
                  tenant ? { id: tenant.id, name: tenant.name, domain: tenant.slug } : null
                }
              />
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Overview" />
        {isAdmin && <NavMain items={adminNav} label="Admin Panel" />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
