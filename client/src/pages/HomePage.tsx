"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { checkIsAuth } from "@/redux/features/auth/authSlice";
import { resolveTenant } from "@/redux/features/tenant/tenantSlice";
import { WorkspaceSwitcher } from "@/components/profile/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import { Building2, Sparkles } from "lucide-react";
import { useAuthTenantResolver } from "@/hooks/useAuthTenantResolver";
import { MenuBar } from "@/components/navigation/MenuBar";
import { Typography } from "@/theme";
import { FieldSeparator } from "@/components/ui/field";

type TenantItem = { id: string; name: string; domain: string };

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(checkIsAuth);
  const { user } = useAppSelector((state) => state.auth);
  const [currentTenant, setCurrentTenant] = useState<TenantItem | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
  const [availableTenants, setAvailableTenants] = useState<TenantItem[]>([]);
  const { isLoading } = useAuthTenantResolver();

  useEffect(() => {
    // Если не авторизован - редиректим на страницу входа
    // НО только если это действительно страница HomePage, а не перезагрузка tenant-scoped маршрута
    // Проверяем, что мы действительно на HomePage (не на tenant-scoped маршруте)
    const pathname = window.location.pathname;
    const isOnHomePage = pathname === "/" || pathname === "";

    if (isOnHomePage && !isLoading && !isAuth) {
      navigate("/sign-in", { replace: true });
      return;
    }

    // Если не на HomePage или еще загружается - не редиректим
    if (isLoading) {
      return;
    }

    // Загружаем информацию о tenants
    async function loadTenants() {
      try {
        const axios = (await import("@/utils/axios")).default;
        const res = await axios.get<TenantItem[]>("/auth/my-tenants");
        const tenantsList = Array.isArray(res.data) ? res.data : [];
        setAvailableTenants(tenantsList);

        // Если у пользователя есть tenantId, находим его в списке
        if (user?.tenantId && tenantsList.length > 0) {
          const tenant = tenantsList.find((t) => t.id === user.tenantId);
          if (tenant) {
            setCurrentTenant(tenant);
            setSelectedTenant(tenant); // Устанавливаем как выбранный по умолчанию
          }
        } else if (tenantsList.length > 0) {
          // Если нет текущего tenant, но есть доступные - выбираем первый
          setSelectedTenant(tenantsList[0]);
        }
      } catch (error) {
        console.error("Failed to load tenants:", error);
      }
    }

    loadTenants();
  }, [isAuth, user, navigate]);

  const handleConnect = async () => {
    if (!selectedTenant) {
      console.log("❌ No tenant selected");
      return;
    }

    // Извлекаем slug из domain (убираем .com и другие доменные суффиксы)
    // Например: "jinn-travel.com" -> "jinn-travel"
    const slug = selectedTenant.domain.split(".")[0];
    console.log("🔗 Connecting to tenant:", slug, "from domain:", selectedTenant.domain);

    // Резолвим tenant в Redux перед редиректом
    try {
      const result = await dispatch(resolveTenant({ slug })).unwrap();
      console.log("✅ Tenant resolved:", result);
    } catch (error) {
      console.error("❌ Failed to resolve tenant:", error);
      // Продолжаем редирект даже если не удалось резолвить (tenant будет разрешен в App.tsx)
    }

    const targetPath = `/${slug}/overview`;
    console.log("🚀 Navigating to:", targetPath);

    // Path-based роутинг везде - используем navigate для сохранения состояния Redux
    navigate(targetPath, { replace: true });
  };

  const handleSelectTenant = (tenant: TenantItem) => {
    setSelectedTenant(tenant);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <header className="my-6 self-center hidden md:block">
        <MenuBar />
      </header>
      <div className="flex flex-col flex-1 items-center justify-between w-full h-full max-w-2xl my-20 mx-auto text-center">
        {/* Welcome Message */}
        <Typography.h2 className="text-4xl font-bold tracking-tight">
          Welcome back{user?.first_name ? `, ${user.first_name}` : ""}!
        </Typography.h2>

        {/* User Email */}
        {user?.email && (
          <div className="bg-muted/50 rounded-lg px-4 py-2.5 text-sm text-muted-foreground border border-border inline-block">
            Signed in as - <span className="font-medium text-foreground">{user?.email}</span>
          </div>
        )}

        {/* Workspace Selection */}
        {availableTenants.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
              <WorkspaceSwitcher
                currentTenant={currentTenant}
                tenants={availableTenants}
                variant="standalone"
                redirectTo="dashboard"
                userRole={false}
                onSelectTenant={handleSelectTenant}
                autoRedirect={false}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleConnect();
                }}
                type="button"
                disabled={!selectedTenant}
                size="lg"
              >
                Connect
              </Button>
            </div>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or
            </FieldSeparator>
            <Button onClick={() => navigate("/create-workspace")} size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create a Workspace
            </Button>
          </div>
        )}
        {availableTenants.length === 0 && (
          <div>
            <Typography.bodySm className="text-muted-foreground">
              You don't have any workspaces yet. Create one to get started.
            </Typography.bodySm>
            <Button onClick={() => navigate("/create-workspace")} size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create a Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
