import { NavLink } from "react-router-dom";
import logo from "./../assets/react.svg";

function Navbar() {
  const routes = [
    { to: "/dashboard-pqrsf", text: "Dashboard" },
    { to: "/login", text: "Login" },
    { to: "/Logout", text: "Logout" },
  ];

  return (
    <header>
      <nav>
        <img src={logo} alt="logo" />
        <ul>
          {routes.map((route) => {
            return (
              <li key={route.to}>
                <NavLink
                  to={route.to}
                  className={({ isActive }) =>
                    isActive ? "navbar__item--active" : ""
                  }
                >
                  {route.text}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export { Navbar };
