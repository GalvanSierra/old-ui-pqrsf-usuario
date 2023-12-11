import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { useOptions } from "../hooks/useOptions";
import { useAuth } from "../hooks/useAuth";

import api from "../service/api";

function Dashboard() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");
  const { options: estadoOptions } = useOptions("/estados");
  const { options: liderOptions } = useOptions("/lideres");

  const [peticiones, setPeticiones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        user.role === "atencion" ? "/pqrsf" : "/profile/mis-peticiones";

      await api
        .get(endpoint)
        .then((response) => response.data)
        .then((data) => setPeticiones(data))
        .catch((error) => console.error("Error:", error));
    };

    fetchData();
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
    { field: "id", type: "number", headerName: "ID", width: 60 },
    {
      field: "radicado",
      type: "number",
      headerName: "Radico",
      width: 100,
      valueGetter: (params) => {
        return `${params.row.radicado || ""}`;
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
      width: 240,
      valueGetter: (params) => {
        return `${params.row.lider?.cargo || ""}`;
      },
      valueOptions: () => {
        return liderOptions.map((opc) => opc?.cargo);
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
      width: 200,
      valueGetter: (params) => {
        return params.row.fechaEnvioResponsableArea
          ? new Date(params.row.fechaEnvioResponsableArea)
          : null;
      },
    },
    // {
    //   field: "dueDate",
    //   type: "date",
    //   headerName: "Fecha Vencimiento",
    //   width: 140,
    //   valueGetter: (params) => {
    //     const dueDate = params.row.dueDate
    //       ? new Date(params.row.dueDate)
    //       : null;
    //     return dueDate;
    //   },
    // },
    {
      field: "estadoId",
      headerName: "Estado",
      type: "singleSelect",
      width: 120,
      valueGetter: (params) => {
        return params.row.estado?.nombre;
      },
      valueOptions: () => {
        return estadoOptions.map((opc) => opc?.nombre);
      },
    },
    {
      field: "peticionario",
      headerName: "Peticionario",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.peticionario?.nombre || ""} ${
          params.row.peticionario?.apellido || ""
        }`;
      },
    },
    {
      field: "paciente",
      headerName: "Paciente",
      width: 120,
      valueGetter: (params) => {
        return `${params.row.paciente?.nombre || ""} ${
          params.row.paciente?.apellido || ""
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
            rows={peticiones}
            columns={columns}
            autoHeight
            disableExtendRowFullWidth
            slots={{ toolbar: CustomToolbar }}
            style={{ fontSize: "1.6rem" }}
            initialState={{
              filter: {
                filterModel: {
                  items: [{ field: "estadoId", operator: "is", value: "" }],
                },
              },
              pagination: { paginationModel: { pageSize: 25 } },
              sorting: {
                sortModel: [
                  {
                    field: "fechaRecepcion",
                    sort: "desc",
                  },
                ],
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

function CustomToolbar() {
  return <GridToolbar />;
}

export { Dashboard };
