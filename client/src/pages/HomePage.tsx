"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { checkIsAuth } from "@/redux/features/auth/authSlice";
import { resolveTenant } from "@/redux/features/tenant/tenantSlice";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import { Building2, Sparkles } from "lucide-react";

type TenantItem = { id: string; name: string; domain: string };

export function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(checkIsAuth);
  const { user } = useAppSelector((state) => state.auth);
  const [currentTenant, setCurrentTenant] = useState<TenantItem | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
  const [availableTenants, setAvailableTenants] = useState<TenantItem[]>([]);

  useEffect(() => {
    // Если не авторизован - редиректим на страницу входа
    // НО только если это действительно страница HomePage, а не перезагрузка tenant-scoped маршрута
    // Проверяем, что мы действительно на HomePage (не на tenant-scoped маршруте)
    const pathname = window.location.pathname;
    const isOnHomePage = pathname === "/" || pathname === "";

    if (isOnHomePage && (!isAuth || !user)) {
      navigate("/sign-in", { replace: true });
      return;
    }

    // Если не на HomePage или еще загружается - не редиректим
    if (!isAuth || !user) {
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

    const host = window.location.host.toLowerCase();
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

    // Резолвим tenant в Redux перед редиректом
    try {
      const result = await dispatch(resolveTenant({ slug })).unwrap();
      console.log("✅ Tenant resolved:", result);
    } catch (error) {
      console.error("❌ Failed to resolve tenant:", error);
      // Продолжаем редирект даже если не удалось резолвить (tenant будет разрешен в App.tsx)
    }

    const targetPath = `/${slug}/my-account`;
    console.log("🚀 Navigating to:", targetPath);

    if (isLocal) {
      // DEV: path-based роутинг - используем navigate для сохранения состояния Redux
      navigate(targetPath, { replace: true });
    } else {
      // PRODUCTION: subdomain-based роутинг - нужна полная перезагрузка для смены домена
      const parts = host.split(".");
      const baseHost = parts.slice(-2).join(".");
      window.location.href = `${window.location.protocol}//${slug}.${baseHost}/my-account`;
    }
  };

  const handleSelectTenant = (tenant: TenantItem) => {
    setSelectedTenant(tenant);
  };

  // Показываем загрузку пока проверяем авторизацию
  if (!isAuth || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {Logo && <img src={Logo} alt="Logo" className="h-12 w-12" />}
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back{user.first_name ? `, ${user.first_name}` : ""}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a workspace and connect to continue
          </p>
        </div>

        {/* User Email */}
        {user.email && (
          <div className="bg-muted/50 rounded-lg px-4 py-2.5 text-sm text-muted-foreground border inline-block">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
          </div>
        )}

        {/* Workspace Selection */}
        {availableTenants.length > 0 ? (
          <div className="py-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                size="lg"
                disabled={!selectedTenant}
                className="w-full sm:w-auto min-w-[120px]"
              >
                Connect
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <p className="text-muted-foreground">
              You don't have any workspaces yet. Create one to get started.
            </p>
            <Button onClick={() => navigate("/business-sign-up")} size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create a Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
