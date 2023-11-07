import { useState } from "react";
import { utils, writeFile } from "xlsx";
import api from "../service/api";

function DashboardAdmin() {
  const handleDownload = async () => {
    const peticiones = await api
      .get("/peticiones")
      .then((response) => response.data);

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
