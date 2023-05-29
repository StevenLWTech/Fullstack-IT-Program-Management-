// Column labels
const columnLabels = {
  program_name: "Program Name",
  region: "Region",
  program_type: "Program Type",
  category: "Category",
  college: "College",
};

// Get column label
function getColumnLabel(column) {
  return columnLabels[column] || column;
}
// Ignored columns
const ignoredColumns = [
  "uuid",
  "program_id",
  "HyperLink",
  "id",
  "hyperlink",
  "featured_image",
];

// Dropdown component
function Dropdown({
  id,
  data,
  value,
  onChange,
  removeDuplicatesAndFilter,
  column,
  columns,
}) {
  return (
    <div className="dropdown-container">
      <select
        id={`dropdown-${id}`}
        name={`dropdown-${id}`}
        value={value || ""}
        onChange={onChange}
      >
        <option key="default" value="" disabled defaultValue>
          {getColumnLabel(column)}
        </option>
        <option id="clear" key="clear" value="">
          Clear
        </option>
        {removeDuplicatesAndFilter(column, id, columns)
          .filter((value) => value !== "") // Exclude empty values
          .map((value, i) => (
            <option key={data[i].id} value={value}>
              {value}
            </option>
          ))}
      </select>
    </div>
  );
}

// Dropdowns component
function Dropdowns({
  data,
  selectedValues,
  handleDropdownChange,
  removeDuplicatesAndFilter,
  hideLastColumn,
}) {
  // Filter columns
  const columns = Object.keys(data[0] || {}).filter(
    (key) => !ignoredColumns.includes(key)
  );
  
  return (
    <>
      {columns.slice(0, -2).map((column, index) => (
        <Dropdown
          key={index}
          id={index}
          data={data}
          value={selectedValues[index]}
          onChange={(event) => handleDropdownChange(event, index)}
          removeDuplicatesAndFilter={removeDuplicatesAndFilter}
          column={column}
          columns={columns}
        />
      ))}
      {!hideLastColumn &&
        [columns.length - 2, columns.length - 1].map((index) => (
          <Dropdown
            key={index}
            id={index}
            data={data}
            value={selectedValues[index]}
            onChange={(event) => handleDropdownChange(event, index)}
            removeDuplicatesAndFilter={removeDuplicatesAndFilter}
            column={columns[index]}
            columns={columns}
          />
        ))}
    </>
  );
}

export default Dropdowns;
