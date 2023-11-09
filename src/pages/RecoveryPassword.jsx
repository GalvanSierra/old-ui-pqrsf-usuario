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
    <div className="container">
      <div className="small-container">
        <h1>Nueva contraseña</h1>
        <p>Ingresa la nueva contraseña para la cuenta</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box recovery-input">
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

          <div className="input-box recovery-input">
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

          <input
            type="submit"
            value="Guardar"
            className=" button recovery-button"
          />
        </form>
        <Link to="/login" className="login__link">
          Regresar al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

export { RecoveryPassword };
