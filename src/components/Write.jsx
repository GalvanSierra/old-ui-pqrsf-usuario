import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../service/api";

function Write() {
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const departamentoSelected = watch("paciente.departamentoId") || 0;
  //   Traer las opciones para los distintos selects

  const [tipoPeticionOptions, seTipoPeticionOptions] = useState([]);
  const [epsOption, setEpsOption] = useState([]);
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

  const urls = {
    tipoPeticion: "/referencias/tipos_peticion",
    eps: "referencias/eps",
    tipoId: `/referencias/tipos_identificacion`,
    departamentos: `/referencias/departamentos`,
    municipios: `referencias/departamentos/${departamentoSelected}/municipios`,
    areas: "/referencias/areas",
    servicios: "/referencias/servicios",
    estado: `/referencias/estados`,
    clasePeticion: `/referencias/clases_peticion`,
    complejidad: `/referencias/complejidades`,
    lideres: `/referencias/lideres`,
    calidad: `/referencias/calidad`,
  };

  const fetchDataReference = async (url) => {
    const response = await api.get(url).then((response) => response.data);
    return response;
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
      setDepartamentoOptions(referenceData.departamentos);
      setMunicipioOptions(referenceData.municipios);
      setAreasOptions(referenceData.areas);
      setServiciosOptions(referenceData.servicios);
      setEstadoOptions(referenceData.estado);
      setClasePeticionOptions(referenceData.clasePeticion);
      setComplejidadOptions(referenceData.complejidad);
      setLideresOptions(referenceData.lideres);
      setCalidadOptions(referenceData.calidad);
    });
  };

  useEffect(() => {
    fetchSelectedOptions(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnToPage = () => {
    navigate("/management-pqrsf");
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <h2>Tipo:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*"radicado": 8, */}
        <div>
          <label>Radicado</label>
          <input type="number" {...register("radicado", { disabled: true })} />
        </div>
        {/*"tipoPeticionId": 1, */}
        <div>
          <label>Tipo de solicitud</label>
          <select
            {...register("tipoPeticionId", {
              valueAsNumber: true,
            })}
          >
            {tipoPeticionOptions.map(({ id, nombre }) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>Información del Peticionario</legend>
          {/*"peticionario.tipoId": "MS", */}
          <div>
            <label>Tipo identificación</label>
            <select
              {...register("peticionario.tipoId", {
                valueAsNumber: true,
              })}
            >
              {tipoIdOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/*"peticionario.id": "da12", */}
          <div>
            <label>Numero de identificacion</label>
            <input type="number" {...register("peticionario.id", {})} />
          </div>
          {/*"peticionario.nombre": "da", */}
          <div>
            <label>Nombre(s)</label>
            <input type="text" {...register("peticionario.nombre", {})} />
          </div>
          {/*"peticionario.apellido": "da", */}
          <div>
            <label>Apellido(s)</label>
            <input type="text" {...register("peticionario.apellido", {})} />
          </div>
          {/*"peticionario.telefono": "112da" */}
          <div>
            <label>Telefono</label>
            <input type="tel" {...register("peticionario.telefono", {})} />
          </div>
          {/*"peticionario.email": "da@gmail.com", */}
          <div>
            <label>Correo electrónico</label>
            <input type="email" {...register("peticionario.email", {})} />
          </div>
        </fieldset>
        <fieldset>
          <legend>Información del Paciente</legend>
          {/*"paciente.tipoId": "CD", */}
          <div>
            <label>Tipo de identificación</label>
            <select
              {...register("paciente.tipoId", {
                valueAsNumber: true,
              })}
            >
              {tipoIdOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/*"paciente.id": "12", */}
          <div>
            <label>Numero de identificación</label>
            <input type="number" {...register("paciente.id", {})} />
          </div>
          {/*"paciente.nombre": "12d", */}
          <div>
            <label>Nombre(s)</label>
            <input type="text" {...register("paciente.nombre", {})} />
          </div>
          {/*"paciente.apellido": "a", */}
          <div>
            <label>Apellido(s)</label>
            <input type="text" {...register("paciente.apellido", {})} />
          </div>
          {/*"paciente.epsId": 13, */}
          <div>
            <label>EPS</label>
            <select
              {...register("paciente.epsId", {
                valueAsNumber: true,
              })}
            >
              {epsOption.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/*"paciente.regimenId": 2, */}
          <div>
            <label>Regimen</label>
            <select
              {...register("paciente.regimenId", {
                valueAsNumber: true,
              })}
            ></select>
          </div>
          {/*"paciente.departamentoId": 44, */}
          <div>
            <label>Departamento</label>
            <select
              {...register("paciente.departamentoId", {
                valueAsNumber: true,
              })}
            >
              {departamentoOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Municipio</label>
            <select
              {...register("paciente.municipioId", {
                valueAsNumber: true,
              })}
            >
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
          {/*"areaId": 8, */}
          <div>
            <label>Area a informar</label>
            <select
              {...register("areaId", {
                valueAsNumber: true,
              })}
            >
              {areasOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/*"servicioId": 1, */}
          <div>
            <label>Servicio</label>
            <select
              {...register("servicioId", {
                valueAsNumber: true,
              })}
            >
              {serviciosOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/*"dirigidaA": "wq", */}
          <div>
            <label>Solicitud dirigida a</label>
            <input type="text" {...register("dirigidaA", {})} />
          </div>
          {/*"tutela": false, */}
          <div>
            <label>¿Aplica tutela?</label>
            <div>
              <input
                type="radio"
                value="1"
                {...register("tutela", { valueAsNumber: true })}
              />
              <label>Si</label>
              <input
                type="radio"
                value="0"
                {...register("tutela", { valueAsNumber: true })}
              />
              <label>No</label>
            </div>
          </div>
          {/*"radicadoTutela": null, */}
          <div>
            <label>Radicado de la tutela</label>
            <input type="number" {...register("radicadoTutela", {})} />
          </div>
          {/*"motivo": "wq", */}
          <div>
            <label>Motivo de la solicitud</label>
            <textarea {...register("motivo", {})}></textarea>
          </div>
        </fieldset>
        <fieldset>
          <legend>Gestión</legend>
          {/* fechaRecepcion:"2023-10-04T14:42:34.312Z" */}
          <div>
            <label>Fecha de recepción</label>
            <input
              type="date"
              {...register("fechaRecepcion", {
                valueAsDate: true,
              })}
            />
          </div>
          {/* seGestiono:false */}
          <div>
            <label>¿Se va a gestiono?</label>
            <div>
              <input
                type="radio"
                value="1"
                {...register("seGestiono", { valueAsNumber: true })}
              />
              <label>Si</label>
              <input
                type="radio"
                value="0"
                {...register("seGestiono", { valueAsNumber: true })}
              />
              <label>No</label>
            </div>
          </div>
          {/* fechaDiligencia:"2023-10-19T00:00:00.000Z" */}
          <div>
            <label>Fecha de diligencia de la solicitud</label>
            <input
              type="date"
              {...register("fechaDiligencia", {
                valueAsDate: true,
              })}
            />
          </div>
          {/* estadoId:1 */}
          <div>
            <label>Estado de la solicitud</label>
            <select
              {...register("estadoId", {
                valueAsNumber: true,
              })}
            >
              {estadoOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/* canalId:5 */}
          <div>
            <label>Canal de recepción</label>
            <select
              {...register("canalId", {
                valueAsNumber: true,
              })}
            ></select>
          </div>
          {/* clasePeticionId:1 */}
          <div>
            <label>Clase de peticion</label>
            <select
              {...register("clasePeticionId", {
                valueAsNumber: true,
              })}
            >
              {clasePeticionOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/* complejidadId:1 */}
          <div>
            <label>Complejidad</label>
            <select
              {...register("complejidadId", {
                valueAsNumber: true,
              })}
            >
              {complejidadOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          {/* dueDate:"2023-10-26T12:18:09.194Z" */}
          {/* liderId:3 */}
          <div>
            <label>Lider a asignar</label>
            <select
              {...register("liderId", {
                valueAsNumber: true,
              })}
            >
              {lideresOptions.map(({ id, cargo }) => (
                <option key={id} value={id}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>
          {/* fechaEnvioResponsableArea:"2023-10-24" */}
          {/* respuesta:"wqwqwqwqwqwqwqwqwq" */}
          <div>
            <label>Respuesta a solicitud</label>
            <textarea {...register("respuesta", {})}></textarea>
          </div>
          {/* seDioRespuesta:true */}
          <div>
            <label>¿Se dio respuesta?</label>
            <div>
              <input
                type="radio"
                value="1"
                {...register("seDioRespuesta", { valueAsNumber: true })}
              />
              <label>Si</label>
              <input
                type="radio"
                value="0"
                {...register("seDioRespuesta", { valueAsNumber: true })}
              />
              <label>No</label>
            </div>
          </div>
          {/* fechaRespuesta:null */}
          {/* descripcionGestion:null */}
          <div>
            <label>Descripcion de la gestión</label>
            <textarea {...register("descripcionGestion", {})}></textarea>
          </div>
          {/* calidadId:null */}
          <div>
            <label>Calidad</label>
            <select
              {...register("calidadId", {
                valueAsNumber: true,
              })}
            >
              {calidadOptions.map(({ id, nombre }) => (
                <option key={id} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
        <input type="submit" value="Enviar petición" />
      </form>

      <button onClick={returnToPage}> Regresar</button>
    </>
  );
}

export { Write };
