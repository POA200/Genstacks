import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

export function DocsLayout() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <Sidebar />
          </aside>
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
