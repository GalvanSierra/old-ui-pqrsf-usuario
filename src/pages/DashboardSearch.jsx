/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { useOptions } from "../hooks/useOptions";
import { useAuth } from "../hooks/useAuth";

function DashboardSearch({ data }) {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { options: tipoPeticionOptions } = useOptions("/tipos_peticion");
  const { options: estadoOptions } = useOptions("/estados");

  const handleEdit = (peticionId) => {
    if (user.role === "atencion")
      navigate(`/management-pqrsf/${peticionId}`, { replace: true });
    if (user.role === "lider")
      navigate(`/management-pqrsf-lider/${peticionId}`, { replace: true });
  };

  const columns = [
    {
      field: "radicado",
      type: "number",
      headerName: "Radicado",
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
      field: "estadoId",
      headerName: "Estado",
      type: "singleSelect",
      width: 160,
      valueGetter: (params) => {
        return params.row.estado?.nombre;
      },
      valueOptions: () => {
        return estadoOptions.map((opc) => opc?.nombre);
      },
    },
    // {
    //   field: "peticionario",
    //   headerName: "Peticionario",
    //   width: 120,
    //   valueGetter: (params) => {
    //     return `${params.row.peticionario?.nombre || ""} ${
    //       params.row.peticionario?.apellido || ""
    //     }`;
    //   },
    // },
    {
      field: "paciente",
      headerName: "Paciente",
      width: 400,
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
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            autoHeight
            disableExtendRowFullWidth
            slots={{ toolbar: CustomToolbar }}
            style={{ fontSize: "1.6rem" }}
            initialState={{
              filter: {
                filterModel: {
                  items: [
                    { field: "paciente", operator: "contains", value: "" },
                  ],
                },
              },
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: {
                sortModel: [{ field: "fechaRecepcion", sort: "desc" }],
              },
            }}
            pageSizeOptions={[5, 10, 25]} // Aquí agregamos la propiedad pageSizeOptions
          />
        </div>
      </div>
    </>
  );
}

function CustomToolbar() {
  return <GridToolbar />;
}

export { DashboardSearch };
