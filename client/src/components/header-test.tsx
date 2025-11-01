import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "./ui/search-form";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";

import { TopBar } from "./top-bar";

export const HeaderTest = () => {
  return (
    <div>
      <header className="w-full border-b">
        <div className="mx-auto w-full px-4">
          <TopBar />
          <div className="flex h-16 shrink-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb hideOnMobile={true} showHomeIcon={false} maxItems={4} />
            <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          </div>
        </div>
      </header>
    </div>
  );
};
