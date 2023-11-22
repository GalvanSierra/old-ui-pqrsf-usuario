import { useOptions } from "../useOptions";

/* eslint-disable react/prop-types */
const SectionGestion = ({ form, derechos }) => {
  const { register } = form;
  const [derechosSelected, setDerechosSelected] = derechos;

  const { options: estadoOptions } = useOptions("/estados");
  const { options: clasePeticionOptions } = useOptions("/clases_peticion");
  const { options: complejidadOptions } = useOptions("/complejidades");
  const { options: liderOptions } = useOptions("/lideres");
  const { options: canalOptions } = useOptions("/canales");
  const { options: calidadOptions } = useOptions("/calidad");
  const { options: derechoOptions } = useOptions("/derechos_paciente");

  const currentDate = new Date().toISOString().split("T")[0];

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
            {...register("seGestiono", { valueAsNumber: true })}
          />
          <label>Si</label>
          <input
            className="input--radio"
            type="radio"
            value="0"
            {...register("seGestiono", { valueAsNumber: true })}
          />
          <label>No</label>
        </div>
      </div>

      <div className="input-box form__input">
        <label>Fecha de recepción por Atención al Usuario</label>
        <input
          className="input"
          type="date"
          defaultValue={currentDate}
          {...register("fechaDiligencia", {
            validate: (value) => {
              return value < currentDate && value
                ? "La fecha debe ser posterior o igual al día de hoy"
                : true;
            },
          })}
        />
      </div>

      <div className="input-box form__input">
        <label>Estado de la solicitud</label>
        <select
          className="input"
          {...register("estadoId", {
            valueAsNumber: true,
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
        <label>Canal de recepción</label>
        <select
          className="input"
          {...register("canalId", {
            valueAsNumber: true,
          })}
        >
          <option defaultValue={true} hidden={true} value={5}></option>
          {canalOptions.map(({ id, nombre }) => (
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
          })}
        >
          <option defaultValue={true} hidden={true} value=""></option>
          {liderOptions.map(({ id, cargo }) => (
            <option key={id} value={id}>
              {cargo}
            </option>
          ))}
        </select>
      </div>

      <div className="input-box form__input--textarea">
        <label>Respuesta a solicitud</label>
        <textarea className="input" {...register("respuesta", {})}></textarea>
      </div>

      <div className="input-box form__input">
        <label>¿Se dio respuesta al usuario?</label>
        <div>
          <input
            className="input--radio"
            type="radio"
            value="1"
            {...register("seDioRespuesta", { valueAsNumber: true })}
          />
          <label>Si</label>
          <input
            className="input--radio"
            type="radio"
            value="0"
            {...register("seDioRespuesta", { valueAsNumber: true })}
          />
          <label>No</label>
        </div>
      </div>

      <div className="input-box form__input--textarea">
        <label>Descripcion de la gestión</label>
        <textarea
          className="input"
          {...register("descripcionGestion", {})}
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
            valueAsNumber: true,
          })}
        >
          <option defaultValue={true} value=""></option>
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
          {...register("derechos")}
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
                <strong>Derecho:</strong> {selectedDerecho.derecho}
                <br />
                <strong>Valor:</strong> {selectedDerecho.valor}
                <br />
                <strong>Deber:</strong>
                {selectedDerecho.deber}
                <br />
                <strong>Interpretación:</strong>
                {selectedDerecho.interpretacion}
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
};

export { SectionGestion };
