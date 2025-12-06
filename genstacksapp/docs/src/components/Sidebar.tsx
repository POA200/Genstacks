import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Code, Home, Layout } from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

const sidebarNav: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs",
    icon: <Home className="mr-2 h-4 w-4" />,
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Architecture",
    href: "/components",
    icon: <Layout className="mr-2 h-4 w-4" />,
  },
  {
    title: "Examples",
    href: "/examples",
    icon: <Code className="mr-2 h-4 w-4" />,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("pb-12", className)}>
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-6 pr-6 lg:py-8">
        <div className="space-y-4">
          {sidebarNav.map((section) => (
            <div key={section.href}>
              <Link
                to={section.href}
                className={cn(
                  "flex items-center py-2 text-sm font-semibold transition-colors hover:text-primary",
                  location.pathname === section.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {section.icon}
                {section.title}
              </Link>
              {section.items && (
                <div className="ml-6 space-y-1 border-l pl-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "block py-2 text-sm transition-colors hover:text-primary",
                        location.pathname === item.href
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
