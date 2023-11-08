import { utils, writeFile } from "xlsx";
import api from "../service/api";

function DashboardAdmin() {
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
      .get("/peticiones")
      .then((response) => response.data)
      .then((data) => data.map((peticion) => parsePeticion(peticion)));

    const libro = utils.book_new();
    const hoja = utils.json_to_sheet(peticiones);

    utils.book_append_sheet(libro, hoja, "peticiones");

    await writeFile(libro, "reporte-pqrsf.xlsx");
  };

  return (
    <div>
      <button onClick={handleDownload}>default export</button>
    </div>
  );
}
export { DashboardAdmin };
