/* eslint-disable react/prop-types */
function DataGridInfoAvg({ data }) {
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.year, a.mounth - 1);
    const dateB = new Date(b.year, b.mounth - 1);
    return dateA - dateB;
  });

  const getUniqueProperties = () => {
    const uniqueProperties = new Set();
    sortedData.forEach((item) => {
      uniqueProperties.add(item.tipo);
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
        count: 0,
      };
      uniqueProperties.forEach((prop) => {
        acc[key][prop] = 0;
      });
    }
    acc[key][item.tipo] = item.promedio;
    acc[key].total_general += item.promedio;
    acc[key].count++;
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
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <td>{`${row.mes} ${row.year}`}</td>
              {uniqueProperties.map((prop, idx) => (
                <td key={idx}>{row[prop]}</td>
              ))}
              <td>{(row.total_general / row.count).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataGridInfoAvg };
