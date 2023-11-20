import { useEffect, useState } from "react";
import api from "../service/api";

function useSelects() {
  const [opciones, setOpciones] = useState([]);

  const endPoints = {
    tipoPeticionOptions: "/referencias/tipos_peticion",
    epsOptions: "referencias/eps",
    regimenOptions: "referencias/regimenes",
    tipoIdOptions: "/referencias/tipos_identificacion",
    departamentoOptions: "/referencias/departamentos",
    areaOptions: "/referencias/areas",
    servicioOptions: "/referencias/servicios",
    estadoOptions: "/referencias/estados",
    clasePeticionOptions: "/referencias/clases_peticion",
    complejidadOptions: "/referencias/complejidades",
    liderOptions: "/referencias/lideres",
    calidadOptions: "/referencias/calidad",
    canalOptions: "referencias/canales",
    derechoOptions: "/referencias/derechos_paciente",
  };

  const fetchDataReference = async (url) => {
    const response = await api.get(url).then((response) => response.data);
    return response;
  };

  useEffect(() => {
    const urls = Object.values(endPoints);
    const names = Object.keys(endPoints);

    Promise.all(urls.map(fetchDataReference))
      .then((results) => {
        const referenceData = {};
        results.forEach((result, index) => {
          referenceData[names[index]] = result;
        });
      })
      .then((data) => setOpciones(data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { opciones };
}

export { useSelects };
