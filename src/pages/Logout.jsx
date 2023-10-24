import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

function Logout() {
  const { handleSubmit } = useForm();

  const auth = useAuth();

  const onSubmit = () => {
    auth.logout();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">¿Deseas cerrar sesión?</label>

        <input type="submit" value="Salir" />
      </form>
    </>
  );
}

export { Logout };
