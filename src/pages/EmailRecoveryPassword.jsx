import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../service/api";
import { Link } from "react-router-dom";
import { SetMealSharp } from "@mui/icons-material";

function EmailRecoveryPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const onSubmit = async (data) => {
    setLoading(true);
    await api
      .post("/auth/recovery", data)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setIsOpen(true);
          setMessage("Se envió un email para restablecer la contraseña");
        }
      })
      .catch((error) => {
        setLoading(false);
        setIsOpen(true);
        setMessage("error al enviar el email");

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
        {loading && <p>Enviando...🔁</p>}
        {isOpen && <p>{message}</p>}
      </div>
    </div>
  );
}

export { EmailRecoveryPassword };
