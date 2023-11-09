import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="container ">
      <div className="logout__container">
        <div className="logout__form">
          <label>¿Deseas cerrar sesión?</label>

          <button
            className="logout__button button"
            onClick={() => auth.logout()}
          >
            Si
          </button>
          <button
            className="logout__button button"
            onClick={() => navigate(-1)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export { Logout };
