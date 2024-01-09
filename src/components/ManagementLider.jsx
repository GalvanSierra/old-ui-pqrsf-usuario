import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../service/api";
import { useAuth } from "../hooks/useAuth";
import { useOptions } from "../hooks/useOptions";

function ManagementLider() {
  const { id } = useParams();
  const auth = useAuth();

  const { user } = auth;
  const [isDisabled, setIsDisabled] = useState(false);

  const [changes, setChanges] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [peticionData, setPeticionData] = useState(null);
  //   Traer las opciones para los distintos selects

  const { options: all } = useOptions("/all");

  const {
    tipoPeticionOptions,
    epsOptions,
    regimenOptions,
    tipoIdOptions,
    departamentoOptions,
    areaOptions,
    servicioOptions,
    estadoOptions2,
    clasePeticionOptions,
    complejidadOptions,
    liderOptions,
    calidadOptions,
    canalOptions,
  } = all;

  // const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");
  // const { options: epsOptions } = useOptions("/eps");
  // const { options: regimenOptions } = useOptions("/regimenes");
  // const { options: tipoIdOptions } = useOptions("/tipos_identificacion");
  // const { options: departamentoOptions } = useOptions("/departamentos");
  // const { options: areaOptions } = useOptions("/areas");
  // const { options: servicioOptions } = useOptions("/servicios");
  // const { options: estadoOptions2 } = useOptions("/estados");
  const estadoOptions = estadoOptions2?.slice(1, 4);

  // const { options: clasePeticionOptions } = useOptions("/clases_peticion");
  // const { options: complejidadOptions } = useOptions("/complejidades");
  // const { options: liderOptions } = useOptions("/lideres");
  // const { options: calidadOptions } = useOptions("/calidad");
  // const { options: canalOptions } = useOptions("/canales");
  const { options: municipioOptions } = useOptions(
    `/departamentos/${watch("paciente.departamentoId") || 0}/municipios`
  );

  const [derechosOptions] = useState([]);

  const [derechosSelected, setDerechosSelected] = useState([]);

  const convertISOToDate = (isoDate) => {
    if (!isoDate) return;

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  console.log(areaOptions);
  //   Traer toda la información de la petición
  const fetchPeticionData = async () => {
    const token = localStorage.getItem("token");

    const peticion = await api
      .get(`/peticiones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setPeticionData(data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setValue("radicado", peticion?.radicado);
    setValue("tipoPeticionId", peticion.tipoPeticionId);
    setValue("peticionario.tipoId", peticion.peticionario?.tipoId);
    setValue("peticionario.id", peticion.peticionario?.id);
    setValue("peticionario.nombre", peticion.peticionario?.nombre);
    setValue("peticionario.apellido", peticion.peticionario?.apellido);
    setValue("peticionario.telefono", peticion.peticionario?.telefono);
    setValue("peticionario.email", peticion.peticionario?.email);

    setValue("paciente.tipoId", peticion.paciente?.tipoId);
    setValue("paciente.id", peticion.paciente?.id);
    setValue("paciente.nombre", peticion.paciente?.nombre);
    setValue("paciente.apellido", peticion.paciente?.apellido);
    setValue("paciente.epsId", peticion.paciente?.epsId);
    setValue("paciente.regimenId", peticion.paciente?.regimenId);
    setValue("paciente.departamentoId", peticion.paciente?.departamentoId);
    setValue("paciente.municipioId", peticion.paciente?.municipioId);

    setValue("areaId", peticion.areaId);
    setValue("servicioId", peticion.servicioId);
    setValue("dirigidaA", peticion.dirigidaA);
    setValue("tutela", peticion.tutela ? "1" : "0");
    setValue("radicadoTutela", peticion.radicadoTutela);
    setValue("motivo", peticion.motivo);
    setValue("fechaRecepcion", convertISOToDate(peticion.fechaRecepcion));
    setValue("seGestiono", peticion.seGestiono ? "1" : "0");
    setValue("fechaDiligencia", convertISOToDate(peticion.fechaDiligencia));
    setValue("estadoId", peticion.estadoId);
    setValue("canalId", peticion.canalId);
    setValue("clasePeticionId", peticion.clasePeticionId);
    setValue("complejidadId", peticion.complejidadId);
    setValue("dueDate", peticion.dueDate);
    setValue("liderId", peticion.liderId);

    setValue("derechos", peticion.derechos);

    setValue("respuesta", peticion.respuesta);
    setValue("seDioRespuesta", peticion.seDioRespuesta ? "1" : "0");
    setValue("fechaRespuesta", convertISOToDate(peticion.fechaRespuesta));
    setValue("descripcionGestion", peticion.descripcionGestion);
    setValue("calidadId", peticion.calidadId);
    setValue("nota", peticion.nota);

    setDerechosSelected(peticion.derechos.map((derecho) => derecho.id));
    if ([4, 5, 6].includes(peticion.estadoId)) setIsCompleted(true);
  };

  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {
    // fetchSelectedOptions(urls);
    fetchPeticionData();
    if (user.role === "atencion") setIsDisabled(false);
    else setIsDisabled(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnToDashboard = () => {
    navigate("/dashboard-pqrsf", { replace: true });
  };

  const findChangesToUpdate = (obj1, obj2) => {
    const differences = {};

    // Itera a través de las propiedades de obj1
    for (let key in obj1) {
      if (obj1[key] !== obj2[key] && obj2[key] != undefined && obj2[key] != "")
        differences[key] = obj2[key];
    }

    delete differences.paciente;
    delete differences.peticionario;
    delete differences.derechos;

    return differences;
  };

  const onSubmit = async (data) => {
    const changes = findChangesToUpdate(peticionData, data);

    changes.seGestiono = Boolean(changes.seGestiono);
    changes.seDioRespuesta = Boolean(changes.seDioRespuesta);

    setChanges(changes);
    setIsOpenModal(true);
  };

  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    await api
      .patch(`/peticiones/${id}`, changes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("éxito", response);
        setIsOpenModal(false);
        navigate("/dashboard-pqrsf", { replace: true });
      })
      .catch((error) => {
        console.error("Error en la solicitud PATCH", error);
      });

    Promise.all(
      derechosSelected.map(async (derecho) => {
        return await api
          .post(
            "/peticiones/add-item",
            {
              peticionId: id,
              derechoId: derecho,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          .catch((error) => {
            console.error("Error en la solicitud DERECHO", error);
          });
      })
    );
  };

  return (
    <div className="container form-container">
      <h2>Tipo: {peticionData?.tipoPeticion.nombre}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box form__input">
          <label>Radicado</label>
          <input
            className="input"
            type="number"
            {...register("radicado", { disabled: true })}
          />
        </div>

        <div className="input-box form__input">
          <label>Tipo de solicitud</label>
          <select
            className="input"
            {...register("tipoPeticionId", {
              disabled: true,
            })}
          >
            <option defaultValue={true} hidden={true} value=""></option>
            {tipoPeticionOptions &&
              tipoPeticionOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
          </select>
        </div>

        <fieldset>
          <legend>Información del Peticionario</legend>

          <div className="input-box form__input">
            <label>Tipo identificación</label>
            <select
              className="input"
              {...register("peticionario.tipoId", { disabled: true })}
            >
              <option defaultValue={true} value=""></option>
              {tipoIdOptions &&
                tipoIdOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Numero de identificacion</label>
            <input
              className="input"
              {...register("peticionario.id", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Nombre(s)</label>
            <input
              className="input"
              type="text"
              {...register("peticionario.nombre", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Apellido(s)</label>
            <input
              className="input"
              type="text"
              {...register("peticionario.apellido", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Telefono</label>
            <input
              className="input"
              type="tel"
              {...register("peticionario.telefono", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Correo electrónico</label>
            <input
              className="input"
              type="email"
              {...register("peticionario.email", { disabled: true })}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Información del Paciente</legend>

          <div className="input-box form__input">
            <label>Tipo de identificación</label>
            <select
              className="input"
              {...register("paciente.tipoId", { disabled: true })}
            >
              <option defaultValue={true} value=""></option>
              {tipoIdOptions &&
                tipoIdOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Numero de identificación</label>
            <input
              className="input"
              {...register("paciente.id", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Nombre(s)</label>
            <input
              className="input"
              type="text"
              {...register("paciente.nombre", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Apellido(s)</label>
            <input
              className="input"
              type="text"
              {...register("paciente.apellido", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>EPS</label>
            <select
              className="input"
              {...register("paciente.epsId", { disabled: true })}
            >
              <option defaultValue={true} value=""></option>
              {epsOptions &&
                epsOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Regimen</label>
            <select
              className="input"
              {...register("paciente.regimenId", { disabled: true })}
            >
              {regimenOptions &&
                regimenOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              <option defaultValue={true} value=""></option>
            </select>
          </div>

          <div className="input-box form__input">
            <label>Departamento</label>
            <select
              className="input"
              {...register("paciente.departamentoId", { disabled: true })}
            >
              <option defaultValue={true} value=""></option>
              {departamentoOptions &&
                departamentoOptions.map(({ id, nombre }) => (
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
              {...register("paciente.municipioId", { disabled: true })}
            >
              <option value={peticionData?.paciente?.municipio?.id}>
                {peticionData?.paciente?.municipio?.nombre}
              </option>
              {municipioOptions &&
                municipioOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>información de la Petición</legend>

          <div className="input-box form__input">
            <label>Area a informar</label>
            <select
              className="input"
              {...register("areaId", { disabled: true })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {areaOptions &&
                areaOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Servicio</label>
            <select
              className="input"
              {...register("servicioId", { disabled: true })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {servicioOptions &&
                servicioOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Solicitud dirigida a</label>
            <input
              className="input"
              type="text"
              {...register("dirigidaA", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>¿Aplica tutela?</label>
            <div>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="1"
                  {...register("tutela", { disabled: true })}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="0"
                  {...register("tutela", { disabled: true })}
                />
                No
              </label>
            </div>
          </div>

          <div className="input-box form__input">
            <label>Radicado de la tutela</label>
            <input
              className="input"
              type="text"
              {...register("radicadoTutela", { disabled: true })}
            />
          </div>

          <div className="input-box form__input--textarea">
            <label>Motivo de la solicitud</label>
            <textarea
              className="input"
              {...register("motivo", { disabled: true })}
            ></textarea>
          </div>
        </fieldset>

        <fieldset>
          <legend>Gestión de la solicitud</legend>

          <div className="input-box form__input">
            <label>Fecha de recepción</label>
            <input
              className="input"
              type="date"
              {...register("fechaRecepcion", { disabled: true })}
            />
          </div>

          <div className="input-box form__input">
            <label>Fecha de recepción por Atención al Usuario</label>
            <input
              className="input"
              type="date"
              {...register("fechaDiligencia", {
                required: "Campo requerido",
                disabled: isDisabled || isCompleted,
                // validate: (value) => {
                // if (value < today) {
                //   return "La fecha debe ser posterior o igual al día de hoy";
                // }
                // return true;
                // },
              })}
            />
            {errors.fechaDiligencia && (
              <p role="alert" className="alert">
                {errors.fechaDiligencia.message}
              </p>
            )}
          </div>

          <div className="input-box form__input">
            <label>Canal de recepción</label>
            <select
              className="input"
              {...register("canalId", {
                disabled: true,
              })}
            >
              {canalOptions &&
                canalOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>¿Se va a radicar?</label>
            <div>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="1"
                  {...register("seGestiono", {
                    valueAsNumber: true,
                    disabled: isDisabled,
                  })}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="0"
                  {...register("seGestiono", {
                    valueAsNumber: true,
                    disabled: isDisabled,
                  })}
                />
                No
              </label>
            </div>
          </div>

          <div className="input-box form__input">
            <label>Clase de peticion</label>
            <select
              className="input"
              {...register("clasePeticionId", {
                valueAsNumber: true,
                disabled: isDisabled || isCompleted,
              })}
            >
              {clasePeticionOptions &&
                clasePeticionOptions.map(({ id, nombre }) => (
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
                disabled: isDisabled || isCompleted,
              })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {complejidadOptions &&
                complejidadOptions.map(({ id, nombre }) => (
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
                disabled: isDisabled || isCompleted,
              })}
            >
              <option defaultValue={true} value=""></option>
              {liderOptions &&
                liderOptions.map(({ id, cargo }) => (
                  <option key={id} value={id}>
                    {cargo}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input">
            <label>Estado de la solicitud</label>
            <select
              className="input"
              {...register("estadoId", {
                valueAsNumber: true,
                required: "Campo requerido",
                disabled: isCompleted,
              })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {estadoOptions &&
                estadoOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
            {errors.estadoId && (
              <p role="alert" className="alert">
                {errors.estadoId.message}
              </p>
            )}
          </div>

          <div className="input-box form__input--textarea">
            <label>Respuesta a solicitud</label>
            <textarea
              className="input"
              {...register("respuesta", {
                disabled: isCompleted,
              })}
            ></textarea>
          </div>

          <div className="input-box form__input">
            <label>¿Se dio respuesta al usuario?</label>
            <div>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="1"
                  {...register("seDioRespuesta", {
                    valueAsNumber: true,
                    disabled: isDisabled || isCompleted,
                  })}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="0"
                  {...register("seDioRespuesta", {
                    valueAsNumber: true,
                    disabled: isDisabled || isCompleted,
                  })}
                />
                No
              </label>
            </div>
          </div>

          <div className="input-box form__input">
            <label>Fecha de respuesta de las solicitud</label>
            <input
              className="input"
              type="date"
              {...register("fechaRespuesta", {
                disabled: isDisabled || isCompleted,
                // validate: (value) => {
                //   if (value < today) {
                //     return "La fecha debe ser posterior o igual al día de hoy";
                //   }
                //   return true;
                // },
              })}
            />
          </div>

          <div className="input-box form__input--textarea">
            <label>Descripcion de la gestión</label>
            <textarea
              className="input"
              {...register("descripcionGestion", {
                disabled: isDisabled || isCompleted,
              })}
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
                disabled: isDisabled || isCompleted,
              })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {calidadOptions &&
                calidadOptions.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-box form__input--textarea">
            <label>Derechos del paciente: </label>
            <select
              hidden
              multiple
              className="input--multi-select"
              {...register("derechos", {
                disabled: isDisabled || isCompleted,
              })}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions).map(
                  (option) => {
                    return option.value;
                  }
                );
                setDerechosSelected(selectedValues);
              }}
            >
              {derechosOptions &&
                derechosOptions.map((derecho) => (
                  <option key={derecho.id} value={derecho.id}>
                    {derecho.derecho}
                  </option>
                ))}
            </select>
            <ul className="derechos-list">
              {derechosSelected.map((selectedId) => {
                const selectedDerecho = derechosOptions.find(
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

        <div className="form-grid">
          <input
            className="button form__button"
            type="submit"
            value="Guardar"
          />
          <button
            className="button form__button button--red"
            onClick={returnToDashboard}
          >
            Regresar
          </button>
        </div>
      </form>

      {isOpenModal && (
        <div className="modal-container">
          <div className="modal">
            <p>Desea guardar los cambios realizados</p>
            <div className="modal-grid">
              <button
                className="button form__button"
                onClick={() => saveChanges()}
              >
                Si, guardar
              </button>
              <button
                className="button form__button button--red"
                onClick={() => setIsOpenModal(false)}
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ManagementLider };
