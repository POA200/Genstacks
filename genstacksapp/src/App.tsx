// /genstacks/genstacksapp/src/App.tsx 
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard'; 
import Landing from './pages/Landing'; 

function App() {
  // Simple, single selector - essential for preventing the loop
  const isAuth = useAuthStore(state => state.isAuth); 

  if (isAuth) {
    return <Dashboard />;
  }

  return <Landing />;
}

export default App;