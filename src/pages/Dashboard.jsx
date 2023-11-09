import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import api from "../service/api";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [estadosOptions, setEstadosOptions] = useState([]);
  const [lideresOptions, setLideresOptions] = useState([]);
  const [tipoPeticionOptions, setTipoPeticionOptions] = useState([]);
  const [peticiones, setPeticiones] = useState([]);

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

    await api
      .get("referencias/estados")
      .then((response) => response.data)
      .then((data) => {
        //     const options = data.map((opc) => opc?.nombre);
        setEstadosOptions(data);
      });

    await api
      .get("referencias/lideres")
      .then((response) => response.data)
      .then((data) => {
        //     const options = data.map((opc) => opc?.nombre);
        setLideresOptions(data);
      });

    await api
      .get("referencias/tipos_peticion")
      .then((response) => response.data)
      .then((data) => {
        //     const options = data.map((opc) => opc?.nombre);
        setTipoPeticionOptions(data);
      });

    await console.log(peticiones[0]);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-li ne react-hooks/exhaustive-deps
  });

  const handleEdit = (peticionId) => {
    if (user.role === "atencion")
      navigate(`/management-pqrsf/${peticionId}`, { replace: true });
    if (user.role === "lider")
      navigate(`/management-pqrsf-lider/${peticionId}`, { replace: true });
  };

  const write = () => {
    navigate(`/write-pqrsf`);
  };

  const columns = [
    { field: "id", type: "number", headerName: "ID", width: 40 },
    {
      field: "radicado",
      type: "number",
      headerName: "Radico",
      width: 80,
      valueGetter: (params) => {
        return `${params.row.radicado || "-"}`;
      },
    },
    {
      field: "fechaRecepcion",
      type: "date",
      headerName: "Fecha Recepción",
      width: 140,
      valueGetter: (params) => {
        const fechaRecepcion = new Date(params.row.fechaRecepcion);
        return fechaRecepcion;
      },
    },
    {
      field: "lider",
      headerName: "Líder encargado",
      type: "singleSelect",
      width: 140,
      valueGetter: (params) => {
        return `${params.row.lider?.cargo || "-"}`;
      },
      valueOptions: () => {
        return lideresOptions.map((opc) => opc?.cargo);
      },
    },
    {
      field: "tipoPeticion",
      type: "singleSelect",
      headerName: "Tipo",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.tipoPeticion.nombre}`;
      },
      valueOptions: () => {
        return tipoPeticionOptions.map((opc) => opc?.nombre);
      },
    },
    {
      field: "fechaEnvioResponsableArea",
      type: "date",
      headerName: "Fecha Envio Responsable",
      width: 180,
      valueGetter: (params) => {
        const fechaEnvio = new Date(params.row.fechaEnvioResponsableArea);
        return fechaEnvio;
      },
    },
    {
      field: "dueDate",
      type: "date",
      headerName: "Fecha Vencimiento",
      width: 140,
      valueGetter: (params) => {
        const dueDate = new Date(params.row.dueDate);
        return dueDate;
      },
    },
    {
      field: "estadoId",
      headerName: "Estado",
      type: "singleSelect",
      width: 160,
      valueGetter: (params) => {
        return params.row.estado?.nombre;
      },
      valueOptions: () => {
        return estadosOptions.map((opc) => opc?.nombre);
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
        <h1 className="dashboard-title">
          Sistema de gestión de PQRSF del Hospital Infantil Santa Ana
        </h1>
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
            // showToolbar
            slots={{ toolbar: CustomToolbar }}
            style={{ fontSize: "1.6rem" }}
            initialState={{
              filter: {
                filterModel: {
                  items: [{ field: "estadoId", operator: "is", value: "" }],
                },
              },
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            // autoPageSize // Esto permite que el DataGrid se ajuste automáticamente al ancho del contenedor.
            disableExtendRowFullWidth // Evita que la fila se extienda al ancho total de la pantalla.
          />
        </div>
      </div>
    </>
  );
}

function CustomToolbar() {
  return (
    <GridToolbar
      style={{ fontSize: "1.8rem" }} // Cambia el tamaño de letra de la barra de herramientas
    />
  );
}

export { Dashboard };
