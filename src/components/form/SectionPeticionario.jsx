import { useEffect, useState } from "react";
import { useOptions } from "../useOptions";

/* eslint-disable react/prop-types */
const SectionPeticionario = ({ form }) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const { options: tipoIdOptions } = useOptions("/tipos_identificacion");

  const [isDisableId, setIsDisableId] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  const tipoIdSelected = watch("peticionario.tipoId");
  const id = watch("peticionario.id");

  useEffect(() => {
    const TIPOS_NA = ["AS", "MS", "NA"];

    if (TIPOS_NA.includes(tipoIdSelected)) {
      setIsDisableId(true);
      setValue("peticionario.id", "NA");
    } else {
      setIsDisableId(false);
    }

    if (tipoIdSelected && id) {
      setIsRequired(true);
    } else {
      setIsRequired(false);
    }
  }, [tipoIdSelected, id, setValue]);

  return (
    <fieldset>
      <legend>Información del Peticionario</legend>
      <div className="input-box form__input">
        <label>Tipo identificación</label>
        <select
          className="input"
          {...register("peticionario.tipoId", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
          })}
        >
          <option defaultValue={true} value=""></option>
          {tipoIdOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
        {errors.peticionario?.tipoId && (
          <p role="alert" className="alert">
            {errors.peticionario?.tipoId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Numero de identificacion</label>
        <input
          className="input"
          disabled={isDisableId}
          {...register("peticionario.id", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            pattern: {
              value: /^(\d+|[a-zA-Z0-9]+)$/,
              message: "Ingresa solo números o caracteres alfanuméricos",
            },
          })}
        />
        {errors.peticionario?.id && (
          <p role="alert" className="alert">
            {errors.peticionario?.id.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Nombre(s)</label>
        <input
          className="input"
          type="text"
          {...register("peticionario.nombre", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
          })}
        />
        {errors.peticionario?.nombre && (
          <p role="alert" className="alert">
            {errors.peticionario?.nombre.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Apellido(s)</label>
        <input
          className="input"
          type="text"
          {...register("peticionario.apellido", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
          })}
        />
        {errors.peticionario?.apellido && (
          <p role="alert" className="alert">
            {errors.peticionario?.apellido.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Telefono</label>
        <input
          className="input"
          type="tel"
          {...register("peticionario.telefono", {
            minLength: {
              value: 7,
              message: "Mínimo 7 caracteres",
            },
            maxLength: {
              value: 10,
              message: "Máximo 10 caracteres",
            },
            pattern: {
              value: /^\d+$/,
              message: "Por favor, ingresa solo números",
            },
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
          })}
        />
        {errors.peticionario?.telefono && (
          <p role="alert" className="alert">
            {errors.peticionario?.telefono.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Correo electrónico</label>
        <input
          className="input"
          type="email"
          {...register("peticionario.email", {
            pattern: {
              maxLength: {
                value: 125,
                message: "Máximo 125 caracteres",
              },
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message:
                "Por favor, ingresa una dirección de correo electrónico válida",
            },
          })}
        />
        {errors.peticionario?.email && (
          <p role="alert" className="alert">
            {errors.peticionario?.email.message}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export { SectionPeticionario };
