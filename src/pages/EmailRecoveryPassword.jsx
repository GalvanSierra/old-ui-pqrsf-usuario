import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../service/api";
import { Link } from "react-router-dom";

function EmailRecoveryPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isOkay, setIsOkay] = useState(false);
  const onSubmit = async (data) => {
    await api
      .post("/auth/recovery", data)
      .then((response) => {
        if (response.status === 200) setIsOkay(true);
      })
      .catch((error) => {
        console.error("Error en la solicitud POST", error);
      });
  };
  return (
    <div className="container">
      <div className="small-container">
        <h1>Recuperar contraseña</h1>
        <p>Ingresa el email de la cuenta a recuperar</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box login-input">
            <input
              className="input"
              type="email"
              placeholder="example@hisantaana.com"
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
          <input
            className="button recovery-button"
            type="submit"
            value="Enviar"
          />
        </form>
        <Link to="/login" className="login__link">
          Regresar al inicio de sesión
        </Link>
        {isOkay && <p>El email se envió exitosamente a tu correo registrado</p>}
      </div>
    </div>
  );
}

export { EmailRecoveryPassword };
