/* eslint-disable react/prop-types */
function DataGridInfoEPSandType({ data }) {
  const getUniqueProperties = () => {
    const uniqueProperties = new Set();
    data.forEach((item) => {
      uniqueProperties.add(item["eps"]);
    });
    return Array.from(uniqueProperties);
  };

  const uniqueProperties = getUniqueProperties();

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.tipo]) {
      acc[item.tipo] = {
        tipo: item.tipo,
        total_general: 0,
        // Inicializar recuento para cada EPS
        ...Object.fromEntries(uniqueProperties.map((prop) => [prop, 0])),
      };
    }
    acc[item.tipo][item["eps"]] += item["total"];
    acc[item.tipo].total_general += item["total"];
    return acc;
  }, {});

  const tableRows = Object.values(groupedData);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Tipo de solicitud</th>
            {uniqueProperties.map((prop) => (
              <th key={prop}>{prop}</th>
            ))}
            <th>Total General</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <td>{row.tipo}</td>
              {uniqueProperties.map((prop, idx) => (
                <td key={idx}>{row[prop]}</td>
              ))}
              <td>{row.total_general}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataGridInfoEPSandType };
