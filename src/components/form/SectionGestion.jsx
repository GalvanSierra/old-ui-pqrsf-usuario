import { useEffect, useState } from "react";
import { useOptions } from "../useOptions";

/* eslint-disable react/prop-types */
const SectionGestion = ({
  form,
  data: peticion,
  derechos,
  options: isDisableSection,
}) => {
  const { register, setValue } = form;

  const [derechosSelected, setDerechosSelected] = derechos;
  const [isResponded, setIsResponded] = useState(false);
  const [isDone, setIsDone] = useState(false);

  console.log(isResponded);
  console.log(isDone);

  const { options: estadoOptions } = useOptions("/estados");
  const { options: clasePeticionOptions } = useOptions("/clases_peticion");
  const { options: complejidadOptions } = useOptions("/complejidades");
  const { options: liderOptions } = useOptions("/lideres");
  const { options: canalOptions } = useOptions("/canales");
  const { options: calidadOptions } = useOptions("/calidad");
  const { options: derechoOptions } = useOptions("/derechos_paciente");

  const currentDate = new Date().toISOString().split("T")[0];

  const convertISOToDate = (isoDate) => {
    if (!isoDate) return;
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setValue("fechaRecepcion", convertISOToDate(peticion?.fechaRecepcion));
    setValue("seGestiono", peticion?.seGestiono ? "1" : "0");
    setValue("fechaDiligencia", convertISOToDate(peticion?.fechaDiligencia));
    setValue("estadoId", peticion?.estadoId);
    setValue("canalId", peticion?.canalId);
    setValue("clasePeticionId", peticion?.clasePeticionId);
    setValue("complejidadId", peticion?.complejidadId);
    setValue("dueDate", peticion?.dueDate);
    setValue("liderId", peticion?.liderId);
    setValue("derechos", peticion?.derechos);
    setValue("respuesta", peticion?.respuesta);
    setValue("seDioRespuesta", peticion?.seDioRespuesta ? "1" : "0");
    setValue("fechaRespuesta", convertISOToDate(peticion?.fechaRespuesta));
    setValue("descripcionGestion", peticion?.descripcionGestion);
    setValue("calidadId", peticion?.calidadId);
    setValue("nota", peticion?.nota);

    const STATES_DONE = [5, 6];
    if (STATES_DONE.includes(peticion?.estadoId)) setIsDone(true);

    const STATES_RESPONDED = [4];
    if (STATES_RESPONDED.includes(peticion?.estadoId)) setIsResponded(true);
  }, [peticion, setValue]);

  return (
    <fieldset>
      <legend>Gestión de la solicitud</legend>

      <div className="input-box form__input">
        <label>¿Se va a radicar?</label>
        <div>
          <input
            className="input--radio"
            type="radio"
            value="1"
            {...register("seGestiono", {
              valueAsNumber: true,
              disabled: isDone || isResponded,
            })}
          />
          <label>Si</label>
          <input
            className="input--radio"
            type="radio"
            value="0"
            {...register("seGestiono", {
              valueAsNumber: true,
              disabled: isDone || isResponded,
            })}
          />
          <label>No</label>
        </div>
      </div>

      <div className="input-box form__input">
        <label>Canal de recepción</label>
        <select
          className="input"
          {...register("canalId", {
            disabled: isDone || isDisableSection,
          })}
        >
          {canalOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input">
        <label>Fecha de Creación</label>
        <input
          className="input"
          type="date"
          {...register("fechaRecepcion", {
            disabled: isDisableSection || isDone || isResponded,
          })}
        />
      </div>

      <div className="input-box form__input">
        <label>Fecha de recepción por Atención al Usuario</label>
        <input
          className="input"
          type="date"
          defaultValue={currentDate}
          {...register("fechaDiligencia", {
            disabled: isDone,
            // validate: (value) => {
            //   return value < currentDate && value
            //     ? "La fecha debe ser posterior o igual al día de hoy"
            //     : true;
            // },
          })}
        />
      </div>

      <div className="input-box form__input">
        <label>Estado de la solicitud</label>
        <select
          className="input"
          {...register("estadoId", {
            valueAsNumber: true,
            disabled: isDone,
          })}
        >
          <option defaultValue={true} hidden={true} value="1">
            Sin comenzar
          </option>

          {estadoOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input">
        <label>Clase de peticion</label>
        <select
          className="input"
          {...register("clasePeticionId", {
            valueAsNumber: true,
            disabled: isDone || isResponded,
          })}
        >
          <option defaultValue={true} hidden={true} value=""></option>
          {clasePeticionOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input">
        <label>Complejidad</label>
        <select
          className="input"
          {...register("complejidadId", {
            valueAsNumber: true,
            disabled: isDone || isResponded,
          })}
        >
          <option defaultValue={true} hidden={true} value=""></option>
          {complejidadOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input">
        <label>Lider a asignar</label>
        <select
          className="input"
          {...register("liderId", {
            valueAsNumber: true,
            disabled: isDone || isResponded,
          })}
        >
          <option defaultValue={true} value=""></option>
          {liderOptions.map(({ id, cargo }) => (
            <option key={id} value={id}>
              {cargo}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input--textarea">
        <label>Respuesta a solicitud</label>
        <textarea
          className="input"
          {...register("respuesta", { disabled: isDone || isResponded })}
        ></textarea>
      </div>

      <div className="input-box form__input">
        <label>¿Se dio respuesta al usuario?</label>
        <div>
          <input
            className="input--radio"
            type="radio"
            value="1"
            {...register("seDioRespuesta", {
              valueAsNumber: true,
              disabled: isDone,
            })}
          />
          <label>Si</label>
          <input
            className="input--radio"
            type="radio"
            value="0"
            {...register("seDioRespuesta", {
              valueAsNumber: true,
              disabled: isDone,
            })}
          />
          <label>No</label>
        </div>
      </div>

      <div className="input-box form__input--textarea">
        <label>Descripcion de la gestión</label>
        <textarea
          className="input"
          {...register("descripcionGestion", { disabled: isDone })}
        ></textarea>
      </div>

      <div className="input-box form__input--textarea">
        <label>Notas de la petición</label>
        <textarea className="input" {...register("nota", {})}></textarea>
      </div>

      <div className="input-box form__input">
        <label>Calidad</label>
        <select
          className="input"
          {...register("calidadId", {
            disabled: isDone,
          })}
        >
          <option defaultValue={true} value={null}></option>
          {calidadOptions.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="input-box form__input--textarea">
        <label>Derechos del paciente</label>
        <select
          multiple
          className="input--multi-select"
          hidden={isDone}
          {...register("derechos", { disabled: isDone })}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions).map(
              (option) => (!option.value ? null : option.value)
            );
            setDerechosSelected(selectedValues);
          }}
        >
          {derechoOptions.map((derecho) => (
            <option key={derecho.id} value={derecho.id}>
              {derecho.derecho}
            </option>
          ))}
        </select>
        <ul className="derechos-list">
          {derechosSelected.map((selectedId) => {
            const selectedDerecho = derechoOptions.find(
              (derecho) => derecho.id === parseInt(selectedId, 10)
            );
            return (
              <li className="derecho" key={selectedId}>
                <strong>Derecho:</strong> {selectedDerecho?.derecho}
                <br />
                <strong>Valor:</strong> {selectedDerecho?.valor}
                <br />
                <strong>Deber:</strong>
                {selectedDerecho?.deber}
                <br />
                <strong>Interpretación:</strong>
                {selectedDerecho?.interpretacion}
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
};

export { SectionGestion };
