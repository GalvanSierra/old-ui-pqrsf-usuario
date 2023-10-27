import { NavLink } from "react-router-dom";
import logo from "./../assets/react.svg";

function Navbar() {
  const routes = [
    { to: "/dashboard-pqrsf", text: "Dashboard" },
    { to: "/login", text: "Login" },
    { to: "/Logout", text: "Logout" },
  ];

  return (
    <header className="header">
      <nav className=" container nav">
        <img src={logo} alt="logo" className="nav__logo" />
        <ul className="nav__list">
          {routes.map((route) => {
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
