import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import api from "../service/api";
import { useOptions } from "../hooks/useOptions";
import { EPS_NA, REGIMEN_NA, TIPOS_NA } from "./constants";

function Write() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");
  const { options: epsOptions } = useOptions("/eps");
  const { options: regimenOptions } = useOptions("/regimenes");
  const { options: tipoIdOptions } = useOptions("/tipos_identificacion");
  const { options: departamentoOptions } = useOptions("/departamentos");
  const { options: areaOptions } = useOptions("/areas");
  const { options: servicioOptions } = useOptions("/servicios");
  const { options: estadoOptions } = useOptions("/estados");
  const { options: clasePeticionOptions } = useOptions("/clases_peticion");
  const { options: complejidadOptions } = useOptions("/complejidades");
  const { options: liderOptions } = useOptions("/lideres");
  const { options: calidadOptions } = useOptions("/calidad");
  const { options: canalOptions } = useOptions("/canales");
  const { options: derechosOptions } = useOptions("/derechos_paciente");
  const { options: municipioOptions } = useOptions(
    `/departamentos/${watch("paciente.departamentoId") || 0}/municipios`
  );

  useEffect(() => {
    Promise.all([
      tipoPeticionOptions,
      epsOptions,
      regimenOptions,
      tipoIdOptions,
      departamentoOptions,
      areaOptions,
      servicioOptions,
      estadoOptions,
      clasePeticionOptions,
      complejidadOptions,
      liderOptions,
      calidadOptions,
      canalOptions,
      derechosOptions,
      municipioOptions,
    ]);
  }, [
    tipoPeticionOptions,
    epsOptions,
    regimenOptions,
    tipoIdOptions,
    departamentoOptions,
    areaOptions,
    servicioOptions,
    estadoOptions,
    clasePeticionOptions,
    complejidadOptions,
    liderOptions,
    calidadOptions,
    canalOptions,
    derechosOptions,
    municipioOptions,
  ]);

  // deshabilitar campos  campos
  const [isPeticionarioRequiere, setIsPeticionarioRequiere] = useState(false);
  const [isDisabledIdPeticionario, setIsDisabledIdPeticionario] =
    useState(false);

  const [isPacienteRequiere, setIsPacienteRequiere] = useState(false);
  const [isDisabledIdPaciente, setIsDisabledIdPaciente] = useState(false);
  const [isDisableRegimen, setIsDisableRegimen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [newPeticion, setNewPeticion] = useState(null);
  const [identificador, setIdentificador] = useState(false);

  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [derechosSelected, setDerechosSelected] = useState([]);

  const CURRENT_DATE = new Date().toISOString().split("T")[0];

  const peticionarioTipoIdSelected = watch("peticionario.tipoId");

  const pacienteTipoIdSelected = watch("paciente.tipoId");
  const epsSelected = watch("paciente.epsId");

  useEffect(() => {
    if (TIPOS_NA.includes(peticionarioTipoIdSelected)) {
      setIsDisabledIdPeticionario(true);
      setIsPeticionarioRequiere(true);
      setValue("peticionario.id", "NA");
    } else {
      setIsDisabledIdPeticionario(false);
    }
  }, [peticionarioTipoIdSelected, setValue]);

  useEffect(() => {
    if (TIPOS_NA.includes(pacienteTipoIdSelected)) {
      setIsDisabledIdPaciente(true);
      setIsPacienteRequiere(true);
      setValue("paciente.id", "NA");
    } else {
      setIsDisabledIdPaciente(false);
    }
  }, [pacienteTipoIdSelected, setValue]);

  useEffect(() => {
    if (EPS_NA.includes(epsSelected)) {
      setValue("paciente.regimenId", REGIMEN_NA);
      setIsDisableRegimen(true);
    } else {
      setIsDisableRegimen(false);
    }
  }, [epsSelected, setValue]);

  const [tutelaInput, setTutelaInput] = useState(false);
  const openTutelaInput = () => setTutelaInput(true);
  const closeTutelaInput = () => setTutelaInput(false);

  const onSubmit = async (data) => {
    console.log("data", data);
    data.tutela = Boolean(data.tutela);
    data.seGestiono = Boolean(data.seGestiono || false);
    data.seDioRespuesta = Boolean(data.seDioRespuesta);

    if (!data.peticionario?.tipoId && !data.peticionario?.id)
      delete data.peticionario;
    if (!data.paciente?.tipoId && !data.paciente?.id) delete data.paciente;
    delete data.derechos;

    for (let key in data) {
      if (!data[key]) delete data[key];
    }
    console.log("data_API", data);

    setNewPeticion(data);
    setIsOpenModalConfirm(true);
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log(newPeticion);
      setLoading(true);
      const idPeticion = await api
        .post("/peticiones", newPeticion, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data)
        .then((data) => {
          setIdentificador(data.id);
          setIsOpenModalSuccess(true);

          return data.id;
        })
        .catch((error) => {
          console.error("Error en la solicitud POST", error);
        });

      await Promise.all(
        derechosSelected.map(async (derecho) => {
          const newDerecho = {
            peticionId: idPeticion,
            derechoId: derecho,
          };
          await api
            .post("/peticiones/add-item", newDerecho, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {})
            .catch((error) =>
              console.error("Error en la solicitud DERECHO", error)
            );
        })
      );

      setIsOpenModalConfirm(false);
    } catch (error) {
      console.error("Error en la función saveChanges", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box form__input">
          <label>Tipo de solicitud</label>
          <select
            className="input"
            {...register("tipoPeticionId", {
              valueAsNumber: true,
              required: "Campo requerido",
            })}
          >
            <option defaultValue={true} hidden={true} value=""></option>
            {tipoPeticionOptions.map(({ id, nombre }) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
          {errors.tipoPeticionId && (
            <p role="alert" className="alert">
              {errors.tipoPeticionId.message}
            </p>
          )}
        </div>

        <fieldset>
          <legend>Información del Peticionario</legend>
          <div className="input-box form__input">
            <label>Tipo identificación</label>
            <select
              className="input"
              {...register("peticionario.tipoId", {
                required: {
                  value: isPeticionarioRequiere,
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
              disabled={isDisabledIdPeticionario}
              className="input"
              {...register("peticionario.id", {
                required: {
                  value: isPeticionarioRequiere,
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
                  value: isPeticionarioRequiere,
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
                  value: isPeticionarioRequiere,
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
                  value: isPeticionarioRequiere,
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

        <fieldset>
          <legend>Información del Paciente</legend>
          <div className="input-box form__input">
            <label>Tipo de identificación</label>
            <select
              className="input"
              {...register("paciente.tipoId", {
                required: {
                  value: isPacienteRequiere,
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
              disabled={isDisabledIdPaciente}
              {...register("paciente.id", {
                required: {
                  value: isPacienteRequiere,
                  message: "Campo requerido",
                },
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
                  value: isPacienteRequiere,
                  message: "Campo requerido",
                },
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
                  value: isPacienteRequiere,
                  message: "Campo requerido",
                },
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
                  value: isPacienteRequiere,
                  message: "Campo requerido",
                },
              })}
            >
              <option defaultValue={true} hidden value=""></option>
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
                  value: isPacienteRequiere,
                  message: "Campo requerido",
                },
              })}
            >
              <option defaultValue={true} hidden value=""></option>
              {regimenOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
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
              {...register("paciente.departamentoId", {
                valueAsNumber: true,
              })}
            >
              <option defaultValue={true} hidden value=""></option>
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
              })}
            >
              <option defaultValue={true} hidden value=""></option>
              {municipioOptions.map(({ id, nombre }) => (
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
              {...register("areaId", {
                valueAsNumber: true,
                required: "Campo requerido",
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
            <label id="labelDirigidaA">Solicitud dirigida a</label>
            <input
              className="input"
              type="text"
              {...register("dirigidaA", {
                required: "Campo requerido",
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
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="1"
                  {...register("tutela", { valueAsNumber: true })}
                  onClick={openTutelaInput}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="0"
                  {...register("tutela", { valueAsNumber: true })}
                  onClick={closeTutelaInput}
                />
                No
              </label>
            </div>
          </div>

          {tutelaInput && (
            <div className="input-box form__input">
              <label>Radicado de la tutela</label>
              <input className="input" {...register("radicadoTutela", {})} />
            </div>
          )}

          <div className="input-box form__input--textarea">
            <label>Motivo de la solicitud</label>
            <textarea
              className="input"
              {...register("motivo", {
                required: "Campo requerido",
              })}
            ></textarea>
            {errors.motivo && (
              <p role="alert" className="alert">
                {errors.motivo.message}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>Gestión de la solicitud</legend>
          <div className="input-box form__input">
            <label>¿Se va a radicar?</label>
            <div>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value={true}
                  {...register("seGestiono")}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value=""
                  {...register("seGestiono")}
                />
                No
              </label>
            </div>
          </div>

          <div className="input-box form__input">
            <label>Fecha de recepción por Atención al Usuario</label>
            <input
              className="input"
              type="date"
              defaultValue={CURRENT_DATE}
              {...register("fechaDiligencia", {
                validate: (value) => {
                  if (value < CURRENT_DATE && value) {
                    return "La fecha debe ser posterior o igual al día de hoy";
                  } else {
                    return true;
                  }
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
              <option defaultValue={true} value=""></option>
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
              {...register("respuesta", {})}
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
                  {...register("seDioRespuesta", { valueAsNumber: true })}
                />
                Si
              </label>
              <label>
                <input
                  className="input--radio"
                  type="radio"
                  value="0"
                  {...register("seDioRespuesta", { valueAsNumber: true })}
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
              <option defaultValue={true} hidden value=""></option>
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
                  (option) => {
                    if (!option.value) return null;
                    return option.value;
                  }
                );
                setDerechosSelected(selectedValues);
              }}
            >
              <option value=""></option>
              {derechosOptions.map((derecho) => (
                <option key={derecho.id} value={derecho.id}>
                  {derecho.derecho}
                </option>
              ))}
            </select>
            <ul className="derechos-list">
              {derechosSelected &&
                derechosSelected.map((selectedId) => {
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
            value="Enviar petición"
          />
          <button
            className="button form__button button--red"
            onClick={() => navigate("/dashboard-pqrsf")}
          >
            Regresar
          </button>
        </div>
      </form>
      {isOpenModalConfirm && (
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
                onClick={() => setIsOpenModalConfirm(false)}
              >
                Regresar
              </button>
            </div>
            {loading && <CircularProgress />}
          </div>
        </div>
      )}
      {isOpenModalSuccess && (
        <div className="modal-container">
          <div className="modal">
            <p>
              Petición guardada exitosamente con identificador {identificador}
            </p>
            <div className="modal-grid">
              <button
                className="button form__button button--red"
                onClick={() => {
                  setIsOpenModalSuccess(false);
                  navigate("/dashboard-pqrsf");
                }}
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

export { Write };
