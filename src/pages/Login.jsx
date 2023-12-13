import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/form/Input";
import { emailValidation, required } from "../components/form/validate";

function Login() {
  const auth = useAuth();
  const methods = useForm();

  const [isInvalido, setIsInvalido] = useState(false);

  const onSubmit = async (data) => {
    const response = await auth.login(data);
    if (!response) setIsInvalido(true);
  };

  return (
    <div className="container login__container">
      <div>
        <h1 className="login__title">Sistema de Gestión de PQRSFs</h1>

        <FormProvider {...methods}>
          <form
            className="login__form"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="input-box login-input">
              <label className="label">Correo electrónico</label>
              <Input name="email" type={"text"} options={emailValidation} />
            </div>

            <div className="input-box login-input">
              <label className="label">Contraseña</label>
              <Input name="password" type={"password"} options={required} />
            </div>

            <input
              className="button login__button"
              type="submit"
              value="Iniciar sesión"
            />
          </form>
        </FormProvider>

        <Link to="/recovery-password" className="login__link">
          <p>¿Olvídate tu contraseña?</p>
        </Link>

        {isInvalido && (
          <p className="alert login__alert">email y/o contraseña inválidos</p>
        )}
      </div>
    </div>
  );
}

export { Login };
