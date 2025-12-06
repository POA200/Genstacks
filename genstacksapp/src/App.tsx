import { useAuthStore } from "./store/authStore";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const showDashboard = useAuthStore((state) => state.showDashboard);

  // If the user navigates directly to /docs, render the Docs page.
  // This keeps the app simple (no router required) and allows the footer /docs link
  // to open the docs page as a standalone route.
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        {pathname === "/docs" ? (
          <Docs />
        ) : isAuth && showDashboard ? (
          <Dashboard />
        ) : (
          <Landing />
        )}
        <Toaster />
      </>
    </ThemeProvider>
  );
}

export default App;
