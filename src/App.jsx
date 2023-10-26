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

import "./style.css";
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
    { path: "/write-pqrsf", element: <Write /> },
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
