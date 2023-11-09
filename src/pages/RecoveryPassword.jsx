import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../service/api";

function RecoveryPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  useEffect(() => {
    // Función para extraer el token de la URL
    const extractTokenFromURL = () => {
      const urlParams = new URLSearchParams(document.location.search);
      setToken(urlParams.get("token"));
    };
    extractTokenFromURL();
  }, []);

  const password = watch("password");

  const onSubmit = async ({ newPassword }) => {
    await api
      .post("/auth/change-password", {
        token,
        newPassword,
      })
      .then((response) => {
        if (response.status === 200) navigate("/");
      })
      .catch((error) => {
        console.error("Error en la solicitud POST", error);
      });
  };

  return (
    <>
      <h1>Nueva contraseña</h1>
      <p>Ingresa el email de la cuenta a recuperar</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box login-input">
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            name="password"
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

        <div className="input-box login-input">
          <label className="label">Confirmar contraseña</label>
          <input
            className="input"
            type="password"
            name="newPassword"
            {...register("newPassword", {
              required: "Campo requerido",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.newPassword && (
            <p className="alert" role="alert">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <input type="submit" value="enviar" />
      </form>
      <Link to="/login">Regresar al inicio de sesión</Link>
    </>
  );
}

export { RecoveryPassword };
