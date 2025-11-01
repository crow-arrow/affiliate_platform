"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {} from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAppSelector } from "@/redux/hooks";
import { checkRole } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import { Link, useLocation } from "react-router-dom";

import LogoWhite from "@/assets/jinn.svg";
import LogoDark from "@/assets/jinn-dark.svg";
import {} from "@/components/ui/dropdown-menu";
import {} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useMemo } from "react";
import { extractTenantSlugFromPath, addTenantSlugToPath } from "@/constants/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  const avatar = user?.avatarUrl ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}` : "";
  const userName = user?.first_name ?? "Guest User";
  const userEmail = user?.email ?? "exemple@jinn-travel.com";
  const tenant = useAppSelector((state: RootState) => state.tenant.current);
  const location = useLocation();

  // Получаем tenant slug из Redux или из URL пути
  const tenantSlug = useMemo(() => {
    // Приоритет 1: из Redux state
    if (tenant?.slug) {
      return tenant.slug;
    }
    // Приоритет 2: из URL пути (для development)
    return extractTenantSlugFromPath(location.pathname);
  }, [tenant?.slug, location.pathname]);

  // Функция для добавления tenant slug к относительным путям
  const getUrl = useMemo(
    () => (path: string) => addTenantSlugToPath(path, tenantSlug),
    [tenantSlug]
  );

  // Workspace switching handled inside WorkspaceSwitcher component

  const data = {
    user: {
      name: userName,
      email: userEmail,
      avatar: avatar,
    },
    navMain: [
      {
        title: "Dashboard",
        url: getUrl("/my-account"),
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Dashboard Copy",
        url: getUrl("/test/my-account"),
        icon: Bot,
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
    ],
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
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
