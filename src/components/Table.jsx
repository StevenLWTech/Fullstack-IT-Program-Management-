import React from "react";

const Table = ({
  tableData,
  editingRowId,
  editMode,
  handleEdit,
  handleCancelEdit,
  handleSaveEdit,
  handleSortAscending,
  handleSortDescending,
  handleDelete,
  showFullText,
  handleShowFullText,
}) => {
  return (
    <div id="table" className="table-editable">
      <span className="table-add float-right mb-3 mr-2"></span>
      <table className="table table-bordered table-responsive-md table-striped text-center">
        <thead>
          <tr>
            {Object.keys(tableData[0] || {}).map((column, index) => {
              if (index !== 0) {
                return (
                  <td
                    className="text-center"
                    contentEditable="true"
                    key={index}
                  >
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
              return null; // Exclude the first column
            })}
            <th className="text-center" id="action-header">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              id={`row-${row.id}`}
              className={`hide ${
                editingRowId === row.id && editMode[row.id] ? "highlighted" : ""
              }`}
              key={row.id}
              suppressContentEditableWarning
            >
              {Object.entries(row).map(([column, value], columnIndex) => {
                if (column !== "id") {
                  return (
                    <td className="pt-3-half" key={columnIndex}>
                      {value &&
                      column === "Hyperlink" &&
                      value.length > 30 &&
                      !showFullText ? (
                        <>
                          <div id="admin-show-container">
                            <span className="value">
                              {value.substring(0, 15)}...
                            </span>
                            <button
                              id="admin-show-button"
                              type="button"
                              className="btn btn-link btn-sm ml-2"
                              onClick={() => handleShowFullText()}
                            >
                              Show
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="value">
                          {value}
                          {value &&
                            column === "Hyperlink" &&
                            value.length > 30 &&
                            showFullText && (
                              <button
                                type="button"
                                className="btn btn-link btn-sm ml-2"
                                onClick={() => handleShowFullText()}
                              >
                                Hide
                              </button>
                            )}
                        </span>
                      )}
                    </td>
                  );
                }
                return null; // Exclude the 'Primary ID' column
              })}

              <td>
                {editingRowId === row.id && editMode[row.id] ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleSaveEdit(row)}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => handleCancelEdit(row)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-default btn-sm"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => handleDelete(row)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
