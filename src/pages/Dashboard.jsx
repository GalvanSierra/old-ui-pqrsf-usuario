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

  const fetchData = async () => {
    await api
      .get(`pqrsf`)
      .then((response) => response.data)
      .then((data) =>
        data.map((peticion) => {
          peticion.tipoPeticion = peticion.tipoPeticion.nombre;
          peticion.estado = peticion.estado.nombre;
          peticion.lider = peticion.lider?.cargo || "N/A";

          const date = new Date(peticion.fechaRecepcion);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();

          peticion.fechaRecepcion = `${day}/${month}/${year}`;

          return peticion;
        })
      )
      .then((data) => setPeticiones(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-li ne react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "radicado", headerName: "Radico", width: 150 },
    { field: "fechaRecepcion", headerName: "Fecha Recepción", width: 150 },
    { field: "lider", headerName: "Líder encargado", width: 150 },
    { field: "tipoPeticion", headerName: "Tipo de petición", width: 150 },
    { field: "estado", headerName: "Estado", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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

  const handleEdit = (peticionId) => {
    navigate(`/management-pqrsf/${peticionId}`);
  };

  const write = () => {
    navigate(`/write-pqrsf`);
  };

  return (
    <>
      <h1>ManagementPage</h1>
      {user.role === "atencion" && (
        <button onClick={write}>Redactar PQRSF a nombre del paciente</button>
      )}

      <div style={{ width: "90%" }}>
        <DataGrid rows={peticiones} columns={columns} />
      </div>
    </>
  );
}

export { Dashboard };
