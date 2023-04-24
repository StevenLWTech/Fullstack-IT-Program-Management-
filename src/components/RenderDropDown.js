function RenderDropDown({ columns, data, selectedValues, handleDropdownChange }) {
  const removeDuplicatesAndFilter = (column, columnIndex, columns) => {
    let filteredData = data;

    selectedValues.forEach((selectedValue, selectedIndex) => {
      if (selectedValue && selectedIndex !== columnIndex) {
        const filterColumn = columns[selectedIndex];
        filteredData = filteredData.filter(
          (row) => row[filterColumn] === selectedValue
        );
      }
    });

    const uniqueValues = Array.from(
      new Set(filteredData.map((row) => row[column]))
    );
    uniqueValues.sort();
    return uniqueValues;
  };

  return (
    <>
      {columns.map((column, index) => (
        <div key={index} className="dropdown-container">
          <select
            id={`dropdown-${index}`}
            name={`dropdown-${index}`}
            value={selectedValues[index] || ""}
            onChange={(event) => handleDropdownChange(event, index)}
          >
            <option key="default" value="" disabled defaultValue>
              {column}
            </option>
            <option id="clear" key="clear" value="">
              Cancel
            </option>
            {removeDuplicatesAndFilter(column, index, columns).map(
              (value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              )
            )}
          </select>
        </div>
      ))}
    </>
  );
}

export default RenderDropDown;
