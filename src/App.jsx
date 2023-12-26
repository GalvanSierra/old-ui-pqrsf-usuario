import { BrowserRouter, useRoutes } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

import { AuthRoute } from "./components/AuthRoute";

import "./style.css";
import {
  Dashboard,
  DashboardAdmin,
  EmailRecoveryPassword,
  Login,
  Logout,
  Management,
  ManagementLider,
  NotFound,
  RecoveryPassword,
  Write,
} from "./pages";

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
