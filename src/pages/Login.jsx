import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    auth.login(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Correo electrónico</label>
        <input
          type="text"
          {...register("email", {
            required: "Campo requerido",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Por favor, ingresa un email válida",
            },
          })}
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}

        <label>Contraseña</label>
        <input
          type="password"
          {...register("password", {
            required: "Campo requerido",
          })}
        />
        {errors.password && <p role="alert">{errors.password.message}</p>}

        <input type="submit" value="Iniciar sesión" />
      </form>
    </>
  );
}

export { Login };
