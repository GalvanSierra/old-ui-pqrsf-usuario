import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../service/api";

function Write() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const departamentoSelected = watch("paciente.departamentoId") || 0;
  const epsSelected = watch("paciente.epsId");

  const changeRegimen = () => {
    if (epsSelected === 15) {
      const REGIMEN_NA = 1;

      setValue("paciente.regimenId", REGIMEN_NA);
      setIsDisable(true);
    } else {
      setIsDisable(false);
      setValue("paciente.regimenId", null);
    }
  };
  //   Traer las opciones para los distintos selects

  const [peticionWrite, setPeticionWrite] = useState(null);

  const [tipoPeticionOptions, seTipoPeticionOptions] = useState([]);
  const [epsOption, setEpsOption] = useState([]);
  const [regimenOption, setRegimenOption] = useState([]);
  const [tipoIdOptions, setTipoIdOptions] = useState([]);
  const [departamentoOptions, setDepartamentoOptions] = useState([]);
  const [municipioOptions, setMunicipioOptions] = useState([]);
  const [areasOptions, setAreasOptions] = useState([]);
  const [serviciosOptions, setServiciosOptions] = useState([]);
  const [estadoOptions, setEstadoOptions] = useState([]);
  const [clasePeticionOptions, setClasePeticionOptions] = useState([]);
  const [complejidadOptions, setComplejidadOptions] = useState([]);
  const [lideresOptions, setLideresOptions] = useState([]);
  const [calidadOptions, setCalidadOptions] = useState([]);
  const [canalOptions, setCanalOptions] = useState([]);
  const [derechosOptions, setDerechosOptions] = useState([]);
  const [derechosSelected, setDerechosSelected] = useState([]);

  const urls = {
    tipoPeticion: "/referencias/tipos_peticion",
    eps: "referencias/eps",
    regimen: "referencias/regimenes",
    tipoId: `/referencias/tipos_identificacion`,
    departamentos: `/referencias/departamentos`,
    areas: "/referencias/areas",
    servicios: "/referencias/servicios",
    estado: `/referencias/estados`,
    clasePeticion: `/referencias/clases_peticion`,
    complejidad: `/referencias/complejidades`,
    lideres: `/referencias/lideres`,
    calidad: `/referencias/calidad`,
    canales: "referencias/canales",
    derechos: "/referencias/derechos_paciente",
  };

  const fetchDataReference = async (url) => {
    const response = await api.get(url).then((response) => response.data);
    return response;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMunicipiosByDepId = async () => {
    const municipios = await fetchDataReference(
      `referencias/departamentos/${departamentoSelected}/municipios`
    );

    setMunicipioOptions(municipios);
  };

  const fetchSelectedOptions = async (apiReferences) => {
    const urls = Object.values(apiReferences);
    const names = Object.keys(apiReferences);

    Promise.all(urls.map(fetchDataReference)).then((results) => {
      const referenceData = {};
      results.forEach((result, index) => {
        referenceData[names[index]] = result;
      });

      seTipoPeticionOptions(referenceData.tipoPeticion);
      setTipoIdOptions(referenceData.tipoId);
      setEpsOption(referenceData.eps);
      setRegimenOption(referenceData.regimen);
      setDepartamentoOptions(referenceData.departamentos);
      setAreasOptions(referenceData.areas);
      setServiciosOptions(referenceData.servicios);
      setEstadoOptions(referenceData.estado);
      setClasePeticionOptions(referenceData.clasePeticion);
      setComplejidadOptions(referenceData.complejidad);
      setLideresOptions(referenceData.lideres);
      setCalidadOptions(referenceData.calidad);
      setCanalOptions(referenceData.canales);
      setDerechosOptions(referenceData.derechos);
    });
  };

  const [isPeticionarioRequiere, setIsPeticionarioRequiere] = useState(false);
  const [isPacienteRequiere, setIsPacienteRequiere] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [tutelaOpen, setTutelaOpen] = useState(false);
  const [pacienteOpen, setPacienteOpen] = useState(false);
  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);
  const [identificador, setIdentificador] = useState(false);

  const openTutelaModal = () => {
    setTutelaOpen(true);
  };

  const closeTutelaModal = () => {
    setTutelaOpen(false);
  };

  useEffect(() => {
    fetchSelectedOptions(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMunicipiosByDepId();
  }, [fetchMunicipiosByDepId]);

  const returnToDashboard = () => {
    navigate("/dashboard-pqrsf");
  };
  const onSubmit = async (data) => {
    data.tutela = Boolean(data.tutela);
    data.seGestiono = Boolean(data.seGestiono);
    data.seDioRespuesta = Boolean(data.seDioRespuesta);

    console.log(data);
    if (!data.peticionario?.id) {
      delete data.peticionario;
    }
    if (!data.paciente?.id) {
      delete data.paciente;
    }

    delete data.derechos;

    for (let key in data) {
      if (
        data[key] === "" ||
        data[key] === null ||
        data[key] === undefined ||
        (typeof data[key] === "number" && isNaN(data[key]))
      )
        delete data[key];
    }

    setPeticionWrite(data);
    setIsOpenModalConfirm(true);
  };

  const saveChanges = async () => {
    let id = null;
    await api
      .post("/peticiones", peticionWrite)
      .then((response) => {
        console.log("éxito", response.data);
        return response.data;
      })
      .then((data) => {
        id = data.id;
        setIdentificador(data.id);
        setIsOpenModalSuccess(true);
      })
      .catch((error) => {
        console.error("Error en la solicitud POST", error);
      });
    console.log(id);

    Promise.all(
      derechosSelected.map(async (derecho) => {
        console.log(derecho);
        return await api
          .post("/peticiones/add-item", {
            peticionId: id,
            derechoId: derecho,
          })
          .then((response) => {
            console.log("éxito de derecho", response);
          })
          .catch((error) => {
            console.error("Error en la solicitud DERECHO", error);
          });
      })
    );

    setIsOpenModalConfirm(false);
  };
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);

  return (
    <div className="container container-form">
      <h2>Tipo:{isDisable}</h2>
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
                validate: (v) => {
                  if (v != null && v != "NA" && v != "")
                    setIsPeticionarioRequiere(true);
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
              {...register("peticionario.id", {
                required: {
                  value: isPeticionarioRequiere,
                  message: "Campo requerido",
                },
                pattern: {
                  value: /^(\d+|[a-zA-Z0-9]+)$/, // Patrón que permite alfanuméricos
                  message: "Ingresa solo números o caracteres alfanuméricos",
                },
                validate: (v) => {
                  if (v != null && v != "") setIsPeticionarioRequiere(true);
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

        <input type="checkbox" onClick={() => setPacienteOpen(!pacienteOpen)} />
        <label> Agregar paciente</label>

        {pacienteOpen && (
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
                  validate: (v) => {
                    if (v != null && v != "NA" && v != "")
                      setIsPacienteRequiere(true);
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
                {...register("paciente.id", {
                  required: {
                    value: isPacienteRequiere,
                    message: "Campo requerido",
                  },
                  pattern: {
                    value: /^(\d+|[a-zA-Z0-9]+)$/, // Patrón que permite alfanuméricos
                    message: "Ingresa solo números o caracteres alfanuméricos",
                  },
                  validate: (v) => {
                    if (v != null && v != "") setIsPacienteRequiere(true);
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
                onClick={changeRegimen}
              >
                <option defaultValue={true} value=""></option>
                {epsOption.map(({ id, nombre }) => (
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
                {...register("paciente.regimenId", {
                  valueAsNumber: true,
                  required: {
                    value: isPacienteRequiere,
                    message: "Campo requerido",
                  },
                  disabled: isDisable,
                })}
              >
                {regimenOption.map(({ id, nombre }) => (
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
        )}

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
              {areasOptions.map(({ id, nombre }) => (
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
              {serviciosOptions.map(({ id, nombre }) => (
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
                {...register("tutela", { valueAsNumber: true })}
                onClick={openTutelaModal}
              />
              <label>Si</label>
              <input
                className="input--radio"
                type="radio"
                value="0"
                {...register("tutela", { valueAsNumber: true })}
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
                type="number"
                {...register("radicadoTutela", {})}
              />
            </div>
          )}

          <div className="input-box form__input--textarea">
            <label>Motivo de la solicitud</label>
            <textarea
              className="input"
              {...register("motivo", {
                required: "Campo requerido",
                minLength: {
                  value: 20,
                  message: "Mínimo 20 caracteres",
                },
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
          {/* fechaRecepcion:"2023-10-04T14:42:34.312Z" */}
          {/* <div className="input-box form__input">
            <label>Fecha de recepción</label>
            <input
              className="input"
              type="date"
              {...register("fechaRecepcion", {})}
            />
          </div> */}

          {/* seGestiono:false */}
          <div className="input-box form__input">
            <label>¿Se va a gestiono?</label>
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

          {/* fechaDiligencia:"2023-10-19T00:00:00.000Z" */}
          <div className="input-box form__input">
            <label>Fecha de diligencia de la solicitud</label>
            <input
              className="input"
              type="date"
              {...register("fechaDiligencia", {})}
            />
          </div>

          {/* estadoId:1 */}
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

          {/* canalId:5 */}
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

          {/* clasePeticionId:1 */}
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

          {/* complejidadId:1 */}
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

          {/* dueDate:"2023-10-26T12:18:09.194Z" */}
          {/* liderId:3 */}
          <div className="input-box form__input">
            <label>Lider a asignar</label>
            <select
              className="input"
              {...register("liderId", {
                valueAsNumber: true,
              })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
              {lideresOptions.map(({ id, cargo }) => (
                <option key={id} value={id}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>

          {/* fechaEnvioResponsableArea:"2023-10-24" */}
          {/* respuesta:"wqwqwqwqwqwqwqwqwq" */}
          <div className="input-box form__input--textarea">
            <label>Respuesta a solicitud</label>
            <textarea
              className="input"
              {...register("respuesta", {})}
            ></textarea>
          </div>

          {/* seDioRespuesta:true */}
          <div className="input-box form__input">
            <label>¿Se dio respuesta?</label>
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

          {/* fechaRespuesta:null */}
          {/* descripcionGestion:null */}
          <div className="input-box form__input--textarea">
            <label>Descripcion de la gestión</label>
            <textarea
              className="input"
              {...register("descripcionGestion", {})}
            ></textarea>
          </div>

          {/* calidadId:null */}
          <div className="input-box form__input">
            <label>Calidad</label>
            <select
              className="input"
              {...register("calidadId", {
                valueAsNumber: true,
              })}
            >
              <option defaultValue={true} hidden={true} value=""></option>
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
              value={derechosSelected}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions).map(
                  (option) => {
                    return option.value;
                  }
                );
                setDerechosSelected(selectedValues);
              }}
            >
              {derechosOptions.map((derecho) => (
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

        <div className="form-grid">
          <input
            className="button form__button"
            type="submit"
            value="Enviar petición"
          />
          <button
            className="button form__button button--red"
            onClick={returnToDashboard}
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
