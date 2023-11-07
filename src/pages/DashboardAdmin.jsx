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
      fechaRecepcion: formatDateToDdMmYyyy(p.fechaRecepcion),
      estado: p.estado.nombre,
      tipoPeticion: p.tipoPeticion.nombre,
      servicio: p.servicio.nombre,
      area: p.area.nombre,
      motivo: p.motivo,
      dirigidaA: p.dirigidaA,
      canal: p.canal.nombre,
      tutela: p.tutela,
      radicadoTutela: p.radicadoTutela,
      fechaDiligencia: formatDateToDdMmYyyy(p.fechaDiligencia),
      clasePeticion: p.clasePeticion?.nombre,
      complejidad: p.complejidad?.nombre,
      dueDate: formatDateToDdMmYyyy(p.dueDate),
      lider: p.lider?.cargo,

      fechaEnvioResponsableArea: formatDateToDdMmYyyy(
        p.fechaEnvioResponsableArea
      ),
      seDioRespuesta: p.seDioRespuesta,
      fechaRespuesta: formatDateToDdMmYyyy(p.fechaRespuesta),

      pacienteId: p.paciente?.id,
      pacienteTipoId: p.paciente?.tipoId,
      pacienteNombre: p.paciente?.nombre,
      pacienteApellido: p.paciente?.apellido,
      pacienteEps: p.paciente?.epsId,
      pacienteRegimen: p.paciente?.regimen.nombre,
      pacienteDepartamento: p.paciente?.departamento.nombre,
      pacienteMunicipio: p.paciente?.municipio.nombre,

      peticionarioId: p.peticionario?.id,
      peticionarioTipoId: p.peticionario?.tipoId,
      peticionarioNombre: p.peticionario?.nombre,
      peticionarioApellido: p.peticionario?.apellido,
      peticionarioEmail: p.peticionario?.email,
      peticionarioTelefono: p.peticionario?.telefono,
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

    writeFile(libro, "reporte-pqrsf.xlsx");
  };

  return (
    <div>
      <button onClick={handleDownload}>default export</button>
    </div>
  );
}
export { DashboardAdmin };
