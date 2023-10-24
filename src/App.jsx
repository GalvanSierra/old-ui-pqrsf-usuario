import { BrowserRouter, useRoutes } from "react-router-dom";

import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { Logout } from "./pages/Logout";
import { Navbar } from "./components/Navbar";

const AppRoute = () => {
  const routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/logout", element: <Logout /> },
    { path: "/dashboard-pqrsf", element: <Dashboard /> },
    // { path: "/management-pqrsf", element: <Login /> },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
