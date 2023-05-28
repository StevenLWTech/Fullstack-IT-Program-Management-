import React from 'react';

function SortableTable({ tableData, handleSortAscending, handleSortDescending }) {
  return (
    <div className="card">
      <h3 className="card-header text-center font-weight-bold text-uppercase py-4" style={{ color: "#1c2331" }}>
        Search Technology programs
      </h3>
      {/* Table header */}
      <div className="card-body">
        <div id="table" className="table-editable">
          <span className="table-add float-right mb-3 mr-2"></span>
          {/* Table content */}
          <table className="table table-bordered table-responsive-md table-striped text-center table-hover">
            <thead>
              <tr>
                {Object.keys(tableData[0] || {}).map((column, index) => {
                  if (
                    index !== 0 &&
                    index !== Object.keys(tableData[0]).length - 1
                  ) {
                    return (
                      <td className="text-center" key={index}>
                        <div className="admin-header">
                          <div id="admin-header-text">{column}</div>
                          <div id="admin-sort">
                            <button
                              className="sort-button"
                              onClick={() => handleSortAscending(column)}
                            >
                              <i className="fa-sharp fa-solid fa-sort-up"></i>
                            </button>
                            <button
                              className="sort-button"
                              onClick={() => handleSortDescending(column)}
                            >
                              <i className="fa-sharp fa-solid fa-sort-down"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  }
                  return null; // Exclude the first and last columns
                })}
              </tr>
            </thead>
            <tbody className="table-group-divider table-divider-color">
              {tableData.map((row) => (
                <tr
                  className="table-header table-Primary"
                  id={`row-${row.uuid}`}
                  key={row.uuid}
                >
                  {Object.entries(row).map(
                    ([column, value], columnIndex) => {
                      if (column !== "id" && column !== "HyperLink") {
                        return (
                          <td
                            className="pt-3-half"
                            key={row.uuid + "_" + columnIndex}
                          >
                            <div id="admin-show-container">
                              {column === "Program Name" &&
                              value !== "View All Programs" &&
                              row.HyperLink ? (
                                <a href={row.HyperLink}>{value}</a>
                              ) : column === "Program Type" &&
                                value === "View All Programs" &&
                                row.HyperLink ? (
                                <a href={row.HyperLink}>{value}</a>
                              ) : (
                                value
                              )}
                            </div>
                          </td>
                        );
                      }
                      return null; // Exclude the 'Primary ID' and 'HyperLink' columns
                    }
                  )}
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
