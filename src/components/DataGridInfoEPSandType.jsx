/* eslint-disable react/prop-types */
function DataGridInfoEPSandType({ data }) {
  const getUniqueTypes = () => {
    const uniqueTypes = new Set();
    data.forEach((item) => {
      uniqueTypes.add(item["tipo"]);
    });
    return Array.from(uniqueTypes);
  };

  const uniqueTypes = getUniqueTypes();

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item["eps"]]) {
      acc[item["eps"]] = {
        eps: item["eps"],
        total_general: 0,
        // Inicializar recuento para cada tipo de solicitud
        ...Object.fromEntries(uniqueTypes.map((type) => [type, 0])),
      };
    }
    acc[item["eps"]][item["tipo"]] += item["total"];
    acc[item["eps"]].total_general += item["total"];
    return acc;
  }, {});

  const tableRows = Object.values(groupedData);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>EPS</th>
            {uniqueTypes.map((type) => (
              <th key={type}>{type}</th>
            ))}
            <th>Total General</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <td>{row.eps}</td>
              {uniqueTypes.map((type, idx) => (
                <td key={idx}>{row[type]}</td>
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
