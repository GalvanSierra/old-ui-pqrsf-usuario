import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import api from "../service/api";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [peticiones, setPeticiones] = useState([]);

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const endpoint =
    user.role === "atencion" ? "/pqrsf" : "profile/mis-peticiones";

  const fetchData = async () => {
    await api
      .get(endpoint)
      .then((response) => response.data)
      .then((data) =>
        data.map((peticion) => {
          peticion.tipoPeticion = peticion.tipoPeticion.nombre;
          peticion.estado = peticion.estado.nombre;
          peticion.lider = peticion.lider?.cargo || "N/A";
          peticion.radicado = peticion.radicado || "N/A";

          peticion.paciente =
            peticion.paciente?.nombre + " " + peticion.paciente?.apellido ||
            "N/A";

          peticion.peticionario =
            peticion.peticionario?.nombre +
              " " +
              peticion.peticionario?.apellido || "N/A";

          peticion.fechaRecepcion = formatDate(peticion.fechaRecepcion);
          peticion.fechaEnvioResponsableAreas = formatDate(
            peticion.fechaEnvioResponsableAreas
          );
          peticion.dueDate = formatDate(peticion.dueDate);

          return peticion;
        })
      )
      .then((data) => setPeticiones(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log(peticiones[0]);
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-li ne react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (peticionId) => {
    navigate(`/management-pqrsf/${peticionId}`);
  };

  const write = () => {
    navigate(`/write-pqrsf`);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "radicado", headerName: "Radico", width: 80 },
    { field: "fechaRecepcion", headerName: "Fecha Recepción", width: 140 },
    { field: "lider", headerName: "Líder encargado", width: 140 },
    { field: "tipoPeticion", headerName: "Tipo", width: 120 },
    {
      field: "fechaEnvioResponsableArea",
      headerName: "Fecha Envio Responsable",
      width: 180,
    },
    { field: "estado", headerName: "Estado", width: 180 },
    { field: "dueDate", headerName: "Fecha Vencimiento", width: 120 },
    { field: "peticionario", headerName: "Peticionario", width: 120 },
    { field: "paciente", headerName: "Paciente", width: 120 },
    {
      field: "actions",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            aria-label="Edit"
            onClick={() => handleEdit(params.id)}
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container dashboard-container">
        <h1 className="dashboard-title">Hospital Infantil Santa Ana</h1>
        {user.role === "atencion" && (
          <button className="button dashboard-button" onClick={write}>
            Redactar PQRSF a nombre del paciente
          </button>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DataGrid
            // No es necesario aplicar estilos para width aquí, ya que se adaptará al ancho del contenedor.
            rows={peticiones}
            columns={columns}
            autoHeight
            style={{ fontSize: "1.6rem" }}
            // autoPageSize // Esto permite que el DataGrid se ajuste automáticamente al ancho del contenedor.
            disableExtendRowFullWidth // Evita que la fila se extienda al ancho total de la pantalla.
          />
        </div>
      </div>
    </>
  );
}

export { Dashboard };
