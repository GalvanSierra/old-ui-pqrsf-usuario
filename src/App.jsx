import { BrowserRouter, useRoutes } from "react-router-dom";

import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { Logout } from "./pages/Logout";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

import { AuthRoute } from "./components/AuthRoute";
import { Management } from "./components/Management";
import { Write } from "./components/Write";
import { DashboardAdmin } from "./pages/DashboardAdmin";

import "./style.css";
import { ManagementLider } from "./components/ManagementLider";
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { EmailRecoveryPassword } from "./pages/EmailRecoveryPassword";

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
    {
      path: "/management-pqrsf/:id",
      element: (
        <AuthRoute>
          <Management />
        </AuthRoute>
      ),
    },
    {
      path: "/management-pqrsf-lider/:id",
      element: (
        <AuthRoute>
          <ManagementLider />
        </AuthRoute>
      ),
    },
    {
      path: "/write-pqrsf",
      element: (
        <AuthRoute>
          <Write />
        </AuthRoute>
      ),
    },
    {
      path: "/dashboard-pqrsf-admin",
      element: (
        <AuthRoute>
          <DashboardAdmin />
        </AuthRoute>
      ),
    },
    {
      path: "/recovery",
      element: <RecoveryPassword />,
    },
    {
      path: "/recovery-password",
      element: <EmailRecoveryPassword />,
    },
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
