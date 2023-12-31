import { utils, writeFile } from "xlsx";
import api from "../service/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { DataGridInfo } from "../components/DataGridInfo";
import { DataGridInfoEPSandType } from "../components/DataGridInfoEPSandType";
import { DataGridInfoAvg } from "../components/DataGridInfoAverage";

function DashboardAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [paramsQuery, setParamsQuery] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  function formatDateToDdMmYyyy(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const parsePeticion = (p) => {
    return {
      id: p.id,
      radicado: p.radicado,
      "fecha de recepción": formatDateToDdMmYyyy(p.fechaRecepcion),
      estado: p.estado.nombre,
      "tipo de solicitud": p.tipoPeticion.nombre,
      servicio: p.servicio.nombre,
      area: p.area.nombre,
      motivo: p.motivo,
      "solicitud dirigida a": p.dirigidaA,
      canal: p.canal.nombre,
      "aplica tutela": p.tutela,
      "radicado tutela": p.radicadoTutela,
      "fecha de diligencia": formatDateToDdMmYyyy(p.fechaDiligencia),
      "clase de peticion": p.clasePeticion?.nombre,
      complejidad: p.complejidad?.nombre,
      dueDate: formatDateToDdMmYyyy(p.dueDate),
      "lider asignado": p.lider?.cargo,

      envió: formatDateToDdMmYyyy(p.fechaEnvioResponsableArea),
      "se dio respuesta": p.seDioRespuesta,
      "fecha de respuesta": formatDateToDdMmYyyy(p.fechaRespuesta),
      respuesta: p.respuesta,

      "identificación del paciente": p.paciente?.id,
      "tipo identificación del paciente": p.paciente?.tipoId,
      "nombre del paciente": p.paciente?.nombre,
      "apellido del paciente": p.paciente?.apellido,
      "eps del paciente": p.paciente?.epsId,
      "regimen del paciente": p.paciente?.regimen.nombre,
      "departamento del paciente": p.paciente?.departamento.nombre,
      "municipio del paciente": p.paciente?.municipio.nombre,

      "identificación del peticionario": p.peticionario?.id,
      "tipo identificación del peticionario": p.peticionario?.tipoId,
      "nombre del peticionario": p.peticionario?.nombre,
      "apellido del peticionario": p.peticionario?.apellido,
      "email del peticionario": p.peticionario?.email,
      "telefono del peticionario": p.peticionario?.telefono,
    };
  };

  const handleDownload = async () => {
    const peticiones = await api
      .post("/peticiones/export/xlsx", paramsQuery)
      .then((response) => response.data)
      .then((data) => data.map((peticion) => parsePeticion(peticion)));
    const libro = utils.book_new();
    const hoja = utils.json_to_sheet(peticiones);
    utils.book_append_sheet(libro, hoja, "peticiones");
    await writeFile(libro, "reporte-pqrsf.xlsx");
  };
  const [dataEPS, setDataEPS] = useState([]);
  const [dataServicio, setDataServicio] = useState([]);
  const [dataTipo, setDataTipo] = useState([]);
  const [dataTipoAndEps, setDataTipoAndEps] = useState([]);
  const [dataAvg, setDataAvg] = useState([]);

  const getData = async (paramQuery) => {
    try {
      const token = localStorage.getItem("token");

      const requests = [
        api.post("/indicadores/por_eps", paramQuery, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.post("/indicadores/por_servicio", paramQuery, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.post("/indicadores/por_tipo", paramQuery, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.post("/indicadores/por_tipo_y_eps", paramQuery, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.post("/indicadores/promedio_respuesta", paramQuery, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ];

      const [dataEPS, dataServicio, dataTipo, dataTipoAndEps, dataAvg] =
        await Promise.all(
          requests.map((request) => request.then((response) => response.data))
        );

      setDataEPS(dataEPS);
      setDataServicio(dataServicio);
      setDataTipo(dataTipo);
      setDataTipoAndEps(dataTipoAndEps);
      setDataAvg(dataAvg);
    } catch (error) {
      // Manejar errores aquí si es necesario
      console.error("Error al obtener datos:", error);
    }
  };

  const onSubmit = async (paramQuery) => {
    setParamsQuery(paramQuery);

    await getData(paramQuery);
    setIsOpen(true);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-container admin__container">
          <p>
            Señor usuario por favor seleccione las fechas y luego de clic en
            GENERAR INFORME para ver los resultados. Nota: agrega un día de más
            en el campos de fecha de finalización.
          </p>
          <div className="input-box admin__input">
            <label>Fecha de inicio</label>
            <input
              className="input"
              type="date"
              {...register("startDate", {
                required: "Campo requerido",
                valueAsDate: true,
              })}
            />
            {errors.startDate && (
              <p role="alert" className="alert">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="input-box admin__input">
            <label>Fecha de finalización</label>
            <input
              className="input"
              type="date"
              {...register("endDate", {
                required: "Campo requerido",
                valueAsDate: true,
              })}
            />
            {errors.endDate && (
              <p role="alert" className="alert">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <input
            type="submit"
            value="Generar informe"
            className="button admin-button"
          />
        </div>
      </form>

      {isOpen && (
        <div>
          <button
            className="button admin-button"
            onClick={() => handleDownload()}
          >
            Exportar datos
          </button>
          <h2>Indicadores por EPS y Mes</h2>
          <DataGridInfo data={dataEPS} atributo={"eps"} />

          <h2>Indicadores por Servicio y Mes</h2>
          <DataGridInfo data={dataServicio} atributo={"servicio"} />

          <h2>Indicadores por Tipo de Solicitud y Mes</h2>
          <DataGridInfo data={dataTipo} atributo={"tipo"} />

          <h2>Indicadores por Tipo de Solicitud y EPS</h2>
          <DataGridInfoEPSandType data={dataTipoAndEps} atributo={"eps"} />

          <h2>Indicadores Promedio de Tiempo de Respuesta</h2>
          <DataGridInfoAvg data={dataAvg} atributo={"tipo"} />
          <br />
        </div>
      )}
    </div>
  );
}
export { DashboardAdmin };
