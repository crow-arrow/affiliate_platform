import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/ui/search-form";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

import { TopBar } from "@/components/navigation/top-bar";

export const Header = () => {
  return (
    <>
      <header className="w-full border-b border-border">
        <div className="mx-auto w-full px-4">
          <TopBar />
        </div>
      </header>
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="mx-auto w-full px-4 flex h-16 shrink-0 items-center gap-2">
          <SidebarTrigger className="-ml-1 text-foreground" />
          <DynamicBreadcrumb hideOnMobile={true} showHomeIcon={false} maxItems={4} />
          <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        </div>
      </div>
    </>
  );
};
