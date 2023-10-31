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
    {
      field: "radicado",
      headerName: "Radico",
      width: 80,
      valueGetter: (params) => {
        return `${params.row.radicado || "-"}`;
      },
    },
    {
      field: "fechaRecepcion",
      headerName: "Fecha Recepción",
      width: 140,
      valueGetter: (params) => {
        return formatDate(params.row.fechaRecepcion);
      },
    },
    {
      field: "lider",
      headerName: "Líder encargado",
      width: 140,
      valueGetter: (params) => {
        return `${params.row.lider?.cargo || "-"}`;
      },
    },
    {
      field: "tipoPeticion",
      headerName: "Tipo",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.tipoPeticion.nombre}`;
      },
    },
    {
      field: "fechaEnvioResponsableArea",
      headerName: "Fecha Envio Responsable",
      width: 180,
      valueGetter: (params) => {
        return formatDate(params.row.fechaEnvioResponsableArea);
      },
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 180,
      valueGetter: (params) => {
        return params.row.estado.nombre;
      },
    },
    {
      field: "dueDate",
      headerName: "Fecha Vencimiento",
      width: 120,
      valueGetter: (params) => {
        return formatDate(params.row.dueDate);
      },
    },
    {
      field: "peticionario",
      headerName: "Peticionario",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.peticionario?.nombre || "-"} ${
          params.row.peticionario?.apellido || "-"
        }`;
      },
    },
    {
      field: "paciente",
      headerName: "Paciente",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.paciente?.nombre || "-"} ${
          params.row.paciente?.apellido || "-"
        }`;
      },
    },
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
