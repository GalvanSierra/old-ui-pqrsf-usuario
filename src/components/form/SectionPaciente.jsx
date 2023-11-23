import { useEffect, useState } from "react";
import { useOptions } from "../useOptions";

/* eslint-disable react/prop-types */
const SectionPaciente = ({
  form,
  data: paciente,
  options: isDisableSection,
}) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const { options: tipoIdOptions } = useOptions("/tipos_identificacion");
  const { options: epsOptions } = useOptions("/eps");
  const { options: regimenOptions } = useOptions("/regimenes");
  const { options: departamentoOptions } = useOptions("/departamentos");
  const { options: municipioOptions } = useOptions(
    `/departamentos/${watch("paciente.departamentoId") || 0}/municipios`
  );

  const [isRequired, setIsRequired] = useState(false);
  const [isDisableId, setIsDisableId] = useState(false);
  const [isDisableRegimen, setIsDisableRegimen] = useState(false);

  const tipoIdSelected = watch("paciente.tipoId");
  const id = watch("paciente.id");
  const epsSelected = watch("paciente.epsId");

  useEffect(() => {
    setValue("paciente.tipoId", paciente?.tipoId);
    setValue("paciente.id", paciente?.id);
    setValue("paciente.nombre", paciente?.nombre);
    setValue("paciente.apellido", paciente?.apellido);
    setValue("paciente.epsId", paciente?.epsId);
    setValue("paciente.regimenId", paciente?.regimenId);
    setValue("paciente.departamentoId", paciente?.departamentoId);
    setValue("paciente.municipioId", paciente?.municipioId);
  }, [paciente, setValue]);

  useEffect(() => {
    const TIPOS_NA = ["AS", "MS", "NA"];

    if (TIPOS_NA.includes(tipoIdSelected)) {
      setIsDisableId(true);
      setValue("paciente.id", "NA");
    } else {
      setIsDisableId(false);
    }

    if (tipoIdSelected && id) {
      setIsRequired(true);
    } else {
      setIsRequired(false);
    }
  }, [tipoIdSelected, id, setValue]);

  useEffect(() => {
    const EPS_NA = 15;
    const REGIMEN_NA = 5;

    if (epsSelected === EPS_NA) {
      setValue("paciente.regimenId", REGIMEN_NA);
      setIsDisableRegimen(true);
    } else {
      setIsDisableRegimen(false);
      setValue("paciente.regimenId", null);
    }
  }, [epsSelected, setValue]);

  return (
    <fieldset>
      <legend>Información del Paciente</legend>
      <div className="input-box form__input">
        <label>Tipo de identificación</label>
        <select
          className="input"
          {...register("paciente.tipoId", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
          })}
        >
          <option defaultValue={true} value=""></option>
          {tipoIdOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
        {errors.paciente?.tipoId && (
          <p role="alert" className="alert">
            {errors.paciente?.tipoId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Numero de identificación</label>
        <input
          className="input"
          disabled={isDisableId}
          {...register("paciente.id", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
            pattern: {
              value: /^(\d+|[a-zA-Z0-9]+)$/,
              message: "Ingresa solo números o caracteres alfanuméricos",
            },
          })}
        />
      </div>

      <div className="input-box form__input">
        <label>Nombre(s)</label>
        <input
          className="input"
          type="text"
          {...register("paciente.nombre", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
          })}
        />
        {errors.paciente?.nombre && (
          <p role="alert" className="alert">
            {errors.paciente?.nombre.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Apellido(s)</label>
        <input
          className="input"
          type="text"
          {...register("paciente.apellido", {
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
          })}
        />
        {errors.paciente?.apellido && (
          <p role="alert" className="alert">
            {errors.paciente?.apellido.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>EPS</label>
        <select
          className="input"
          {...register("paciente.epsId", {
            valueAsNumber: true,
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
          })}
        >
          <option defaultValue={true} value=""></option>
          {epsOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
        {errors.paciente?.epsId && (
          <p role="alert" className="alert">
            {errors.paciente?.epsId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Regimen</label>
        <select
          className="input"
          disabled={isDisableRegimen}
          {...register("paciente.regimenId", {
            valueAsNumber: true,
            required: {
              value: isRequired,
              message: "Campo requerido",
            },
            disabled: isDisableSection,
          })}
        >
          {regimenOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
          <option defaultValue={true} value=""></option>
        </select>
        {errors.paciente?.regimenId && (
          <p role="alert" className="alert">
            {errors.paciente?.regimenId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Departamento</label>
        <select
          className="input"
          disabled={isDisableSection}
          {...register("paciente.departamentoId", {
            valueAsNumber: true,
          })}
        >
          <option defaultValue={true} value=""></option>
          {departamentoOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input">
        <label>Municipio</label>
        <select
          className="input"
          {...register("paciente.municipioId", {
            valueAsNumber: true,
            disabled: isDisableSection,
          })}
        >
          <option defaultValue={true} value=""></option>
          {municipioOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
};

export { SectionPaciente };
