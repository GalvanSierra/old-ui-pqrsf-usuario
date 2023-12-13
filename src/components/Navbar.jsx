import { NavLink } from "react-router-dom";
import logo from "./../assets/logo.jpg";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const auth = useAuth();

  const routes = [
    { to: "/dashboard-pqrsf", text: "GESTIÓN Y CONSULTA PQRSF", private: true },
    { to: "/login", text: "INICIA SESIÓN", private: false, publicOnly: true },
    {
      to: "/dashboard-pqrsf-admin",
      text: "INDICADORES",
      private: true,
      isAdmin: true,
    },
    { to: "/Logout", text: "CERRAR SESIÓN", private: true },
  ];

  return (
    <header className="header">
      <nav className=" container nav">
        <NavLink to="/dashboard-pqrsf">
          <img src={logo} alt="logo" className="nav__logo" />
        </NavLink>
        <ul className="nav__list">
          {routes.map((route) => {
            if (route.publicOnly && auth.user) return null;

            if (route.private && !auth.user) return null;

            return (
              <NavLink
                key={route.to}
                to={route.to}
                className={({ isActive }) =>
                  isActive ? "nav__item nav__item--active" : "nav__item"
                }
              >
                <li>{route.text}</li>
              </NavLink>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export { Navbar };
