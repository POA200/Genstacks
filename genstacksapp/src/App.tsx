import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard'; 
import Landing from './pages/Landing';
import { ThemeProvider } from "@/components/theme-provider"

function App() {

  const isAuth = useAuthStore(state => state.isAuth);
  const showDashboard = useAuthStore(state => state.showDashboard);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        {isAuth && showDashboard ? <Dashboard /> : <Landing />}
      </>
    </ThemeProvider>
  );
}

export default App;