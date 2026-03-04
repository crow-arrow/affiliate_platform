"use client";

import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    title: "Account",
    href: "account",
    icon: User,
    description: "Profile & personal info",
  },
  {
    title: "Security",
    href: "security",
    icon: Lock,
    description: "Password & 2FA",
  },
  {
    title: "Notifications",
    href: "notifications",
    icon: Bell,
    description: "Email & alerts",
  },
];

export const SettingsLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "";

  return (
    <>
      <Card className="space-y-6">
        <CardHeader>
          <div className="flex items-center gap-2 text-xl font-semibold">Settings</div>
          <CardDescription>Manage your account preferences and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                      <div
                        className={cn(
                          "text-sm",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
          <Outlet />
        </CardContent>
      </Card>
    </>
  );
};
