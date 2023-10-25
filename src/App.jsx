import { BrowserRouter, useRoutes } from "react-router-dom";

import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { Logout } from "./pages/Logout";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

import { AuthRoute } from "./components/AuthRoute";
import { Management } from "./components/Management";

const AppRoute = () => {
  const routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    {
      path: "/logout",
      element: (
        <AuthRoute>
          <Logout />
        </AuthRoute>
      ),
    },
    {
      path: "/dashboard-pqrsf",
      element: (
        <AuthRoute>
          <Dashboard />
        </AuthRoute>
      ),
    },
    { path: "/management-pqrsf/:id", element: <Management /> },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoute />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
