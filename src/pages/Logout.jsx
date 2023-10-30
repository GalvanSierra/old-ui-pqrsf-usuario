import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

function Logout() {
  const { handleSubmit } = useForm();

  const auth = useAuth();

  const onSubmit = () => {
    auth.logout();
  };

  return (
    <div className="container ">
      <div className="logout__container">
        <form className="logout__form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">¿Deseas cerrar sesión?</label>

          <input
            className="logout__button button"
            type="submit"
            value="Salir"
          />
        </form>
      </div>
    </div>
  );
}

export { Logout };
