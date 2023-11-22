import { useEffect, useState } from "react";
import { useOptions } from "../useOptions";

/* eslint-disable react/prop-types */
const SectionInformacion = ({
  form,
  data: peticion,
  options: isDisableSection,
}) => {
  const {
    setValue,
    register,
    formState: { errors },
  } = form;

  const { options: areaOptions } = useOptions("/areas");
  const { options: servicioOptions } = useOptions("/servicios");

  const [tutelaOpen, setTutelaOpen] = useState(false);
  const openTutelaModal = () => setTutelaOpen(true);
  const closeTutelaModal = () => setTutelaOpen(false);

  useEffect(() => {
    setValue("areaId", peticion?.areaId);
    setValue("servicioId", peticion?.servicioId);
    setValue("dirigidaA", peticion?.dirigidaA);
    setValue("tutela", peticion?.tutela ? "1" : "0");
    setValue("radicadoTutela", peticion?.radicadoTutela);
    setValue("motivo", peticion?.motivo);
  }, [peticion, setValue]);

  return (
    <fieldset>
      <legend>información de la Petición</legend>
      <div className="input-box form__input">
        <label>Area a informar</label>
        <select
          className="input"
          {...register("areaId", {
            valueAsNumber: true,
            required: "Campo requerido",
            disabled: isDisableSection,
          })}
        >
          <option defaultValue={true} hidden={true} value=""></option>
          {areaOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
        {errors.areaId && (
          <p role="alert" className="alert">
            {errors.areaId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Servicio</label>
        <select
          className="input"
          {...register("servicioId", {
            valueAsNumber: true,
            required: "Campo requerido",
            disabled: isDisableSection,
          })}
        >
          <option defaultValue={true} hidden={true} value=""></option>
          {servicioOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
        {errors.servicioId && (
          <p role="alert" className="alert">
            {errors.servicioId.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>Solicitud dirigida a</label>
        <input
          className="input"
          type="text"
          {...register("dirigidaA", {
            required: "Campo requerido",
            disabled: isDisableSection,
          })}
        />
        {errors.dirigidaA && (
          <p role="alert" className="alert">
            {errors.dirigidaA.message}
          </p>
        )}
      </div>

      <div className="input-box form__input">
        <label>¿Aplica tutela?</label>
        <div>
          <input
            className="input--radio"
            type="radio"
            value="1"
            {...register("tutela", {
              valueAsNumber: true,
              disabled: isDisableSection,
            })}
            onClick={openTutelaModal}
          />
          <label>Si</label>
          <input
            className="input--radio"
            type="radio"
            value="0"
            {...register("tutela", {
              valueAsNumber: true,
              disabled: isDisableSection,
            })}
            onClick={closeTutelaModal}
          />
          <label>No</label>
        </div>
      </div>

      {tutelaOpen && (
        <div className="input-box form__input">
          <label>Radicado de la tutela</label>
          <input
            className="input"
            {...register("radicadoTutela", {
              disabled: isDisableSection,
            })}
          />
        </div>
      )}

      <div className="input-box form__input--textarea">
        <label>Motivo de la solicitud</label>
        <textarea
          className="input"
          {...register("motivo", {
            required: "Campo requerido",
            disabled: isDisableSection,
          })}
        ></textarea>
        {errors.motivo && (
          <p role="alert" className="alert">
            {errors.motivo.message}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export { SectionInformacion };
