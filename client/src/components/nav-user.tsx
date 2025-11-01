"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { checkIsAuth, checkRole, logout } from "../redux/features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { RootState } from "@/redux/store";
import { extractTenantSlugFromPath, addTenantSlugToPath } from "@/constants/routes";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  function getInitials(fullName: string): string {
    const names = fullName.trim().split(" ");
    const initials = names
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");

    return initials || "U";
  }

  const isAuth = useAppSelector(checkIsAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const tenant = useAppSelector((state: RootState) => state.tenant.current);

  const logoutHandler = async () => {
    try {
      await signOut();
      dispatch(logout());
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/sign-in", { replace: true });
    }
  };

  // Получаем tenant slug из Redux или из URL
  const tenantSlug = useMemo(() => {
    // Приоритет 1: из Redux state
    if (tenant?.slug) {
      return tenant.slug;
    }
    // Приоритет 2: из URL пути (для development)
    return extractTenantSlugFromPath(location.pathname);
  }, [tenant?.slug, location.pathname]);

  // Функция для навигации с учетом tenant slug
  const navigateWithTenant = (path: string) => {
    const fullPath = addTenantSlugToPath(path, tenantSlug);
    navigate(fullPath);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigateWithTenant("/settings/account")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateWithTenant("/settings")}>
                <Settings />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
