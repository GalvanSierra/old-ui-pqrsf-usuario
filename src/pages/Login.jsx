import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Login() {
  const auth = useAuth();
  const [isInvalido, setIsInvalido] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await auth.login(data);

    if (!response) setIsInvalido(true);
  };

  return (
    <div className="container login__container">
      <div>
        <h1 className="login__title">Sistema de Gestión de PQRSFs</h1>
        <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box login-input">
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="text"
              {...register("email", {
                required: "Campo requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Por favor, ingresa un email válida",
                },
              })}
            />
            {errors.email && (
              <p className="alert" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="input-box login-input">
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              {...register("password", {
                required: "Campo requerido",
              })}
            />
            {errors.password && (
              <p className="alert" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <input
            className="button login__button"
            type="submit"
            value="Iniciar sesión"
          />
        </form>
        {isInvalido && (
          <p className="alert login__alert">email y/o contraseña inválidos</p>
        )}
      </div>
    </div>
  );
}

export { Login };
