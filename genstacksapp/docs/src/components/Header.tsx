import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import GenStacksLogo from "@/assets/Genstacks.png";

export function Header() {
  const navigation = [
    { name: "Docs", href: "/docs" },
    { name: "Components", href: "/components" },
    { name: "Examples", href: "/examples" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-center">
        <div className="flex h-16 w-full max-w-7xl items-center px-4">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <img src={GenStacksLogo} alt="GenStacks" className="h-10 w-10" />
              <span className="font-bold text-lg sm:text-xl">GenStacks</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <ModeToggle />
            {/* Mobile Navigation removed */}
          </div>
        </div>
      </div>
    </header>
  );
}
