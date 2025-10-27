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
import { Link } from "react-router-dom";

import LogoWhite from "@/assets/jinn.svg";
import LogoDark from "@/assets/jinn-dark.svg";
import Logo from "@/assets/logo.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth);
  const avatar = user?.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}`
    : "";
  console.log("User Avatar URL from Redux:", avatar);
  const userName = user?.first_name ?? "Guest User";
  const userEmail = user?.email ?? "exemple@jinn-travel.com";
  const userRole = useAppSelector(checkRole);

  const data = {
    user: {
      name: userName,
      email: userEmail,
      avatar: avatar,
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/my-account",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Dashboard Copy",
        url: "/test/my-account",
        icon: Bot,
      },
      {
        title: "Trips",
        url: "/trips",
        icon: BookOpen,
      },
      {
        title: "Clicks list",
        url: "/clicks-list",
        icon: Settings2,
      },
      {
        title: "Documents",
        url: "/documents",
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {Logo && (
                    <img src={Logo} alt="Jinn Logo" className="h-6 w-6" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Jinn Community</span>
                  <span className="truncate text-xs">{userRole}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
