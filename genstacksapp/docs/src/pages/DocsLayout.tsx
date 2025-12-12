import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function DocsLayout() {
  return (
    <div className="flex w-full justify-center px-4 sm:px-6">
      <div className="w-full max-w-7xl pb-10 pt-4 md:pb-12 md:pt-6">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Menu className="h-4 w-4" />
                  Browse docs
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader className="px-0 pt-2">
                  <SheetTitle className="sr-only">Docs navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Browse documentation sections
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-2">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <aside className="hidden md:sticky md:top-16 md:z-30 md:block">
            <div className="-ml-2 h-[calc(100vh-3.5rem)] w-full shrink-0">
              <Sidebar />
            </div>
          </aside>

          <main className="relative rounded-lg bg-background/40 px-1 py-4 shadow-sm ring-1 ring-border/60 sm:px-3 sm:py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] xl:px-6">
            <div className="mx-auto w-full min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
