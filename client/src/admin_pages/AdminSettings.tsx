"use client";

import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Key, Map, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    title: "Level Settings",
    href: "level-settings",
    icon: Layers,
    description: "Manage user levels and requirements",
  },
  {
    title: "API Keys",
    href: "api-keys",
    icon: Key,
    description: "Manage API keys for integrations",
  },
  {
    title: "Field Mappings",
    href: "field-mappings",
    icon: Map,
    description: "Map external field names to internal fields",
  },
];

export const AdminSettings = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription>Manage your workspace settings and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href || location.pathname.endsWith(item.href);
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "w-full h-auto p-4 flex flex-col items-start gap-2",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">{item.title}</div>
                      <div className={cn("text-sm", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </div>
  );
};

