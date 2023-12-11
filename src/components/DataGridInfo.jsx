/* eslint-disable react/prop-types */
function DataGridInfo({ data, atributo: columna }) {
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.year, a.mes - 1);
    const dateB = new Date(b.year, b.mes - 1);
    return dateA - dateB;
  });

  const getUniqueProperties = () => {
    const uniqueProperties = new Set();
    sortedData.forEach((item) => {
      uniqueProperties.add(item[columna]);
    });
    return Array.from(uniqueProperties);
  };

  const uniqueProperties = getUniqueProperties();

  const groupedData = sortedData.reduce((acc, item) => {
    const key = `${item.mounth_name} ${item.year}`;
    if (!acc[key]) {
      acc[key] = {
        mes: item.mounth_name,
        year: item.year,
        total_general: 0,
      };
      uniqueProperties.forEach((prop) => {
        acc[key][prop] = 0;
      });
    }
    acc[key][item[columna]] = item.total;
    acc[key].total_general += item.total;
    return acc;
  }, {});

  const tableRows = Object.values(groupedData);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            {uniqueProperties.map((prop) => (
              <th key={prop}>{prop}</th>
            ))}
            <th>Total General</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <td>{`${row.mes} ${row.year}`}</td>
              {uniqueProperties.map((prop, idx) => (
                <td key={idx}>{row[prop]}</td>
              ))}
              <td>{row.total_general}</td>
            </tr>
          ))}

          {/* Nueva fila para la sumatoria de cada columna */}
          <tr>
            <td>Total</td>
            {uniqueProperties.map((prop, idx) => (
              <td key={idx}>
                {tableRows.reduce((total, row) => total + (row[prop] || 0), 0)}
              </td>
            ))}
            <td>
              {tableRows.reduce((total, row) => total + row.total_general, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { DataGridInfo };
