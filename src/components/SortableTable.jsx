import React from "react";
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
function SortableTable({
  tableData,
  handleSortAscending,
  handleSortDescending,
}) {
  const header = "Search Technology programs";
  const noPrograms = "View All Programs";

  const columns = Object.keys(tableData[0] || {}).filter(
    (key, index) =>
      key !== "uuid" &&
      key !== "program_id" &&
      key !== "HyperLink" &&
      key !== "id" &&
      key !== "hyperlink" &&
      key !== "featured_image"
  );

  return (
    <div className="card">
      <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
        {header}
      </h3>
      {/* Table header */}
      <div className="card-body">
        <div id="table" className="table-editable">
          <span className="table-add float-right mb-3 mr-2"></span>
          {/* Table content */}
          <table className="table table-bordered table-responsive-md table-striped text-center table-hover">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <td className="text-center" key={column}>
                    <div className="admin-header">
                      <div id="admin-header-text">{getColumnLabel(column)}</div>
                      <div id="admin-sort">
                        <button
                          className="sort-button"
                          onClick={() => handleSortAscending(column)}
                        >
                          <p
                            className="triangle-up"
                            aria-label="Sort by Ascending"
                          >
                            &#9650;
                          </p>
                        </button>
                        <button
                          className="sort-button"
                          onClick={() => handleSortDescending(column)}
                        >
                          <p
                            className="triangle-down"
                            aria-label="Sort by Descending"
                          >
                            &#9660;
                          </p>
                        </button>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="table-group-divider table-divider-color">
              {tableData.map((row) => (
                <tr
                  className="table-header table-Primary"
                  id={`row-${row.uuid}`}
                  key={row.uuid}
                >
                  {columns.map((column, columnIndex) => {
                    const value = row[column];
                    return (
                      <td
                        className="pt-3-half"
                        key={row.uuid + "_" + columnIndex}
                      >
                        <div id="admin-show-container">
                          {column === "program_name" &&
                          "value !==  noPrograms" &&
                          row.hyperlink ? (
                            <a href={row.hyperlink}>{value}</a>
                          ) : column === "program_type" &&
                            value === noPrograms &&
                            row.hyperlink ? (
                            <a href={row.hyperlink}>{value}</a>
                          ) : (
                            value
                          )}

                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SortableTable;
