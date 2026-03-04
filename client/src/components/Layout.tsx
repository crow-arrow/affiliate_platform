import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/navigation/Header";

export const Layout: React.FC = () => {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex h-full flex-col overflow-y-auto">
        <Header />
        <div className="min-h-0 flex-1 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
