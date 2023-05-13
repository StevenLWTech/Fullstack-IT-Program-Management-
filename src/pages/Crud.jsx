import React, { useState, useEffect } from "react";
import UniqueDropdown from "../components/UniqueDropdown";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { move } from "lodash";

export default function Crud({ data }) {
  // Check if the environment is development
  const isDevelopment = process.env.NODE_ENV === "development";

  // State variable to control whether to show full text or not
  const [showFullText, setShowFullText] = useState(false);

  // State variable to track the ID of the row being edited
  const [editingRowId, setEditingRowId] = useState(null);

  // State variable to store the table data
  const [tableData, setTableData] = useState([]);

  // State variable to manage the edit mode of rows
  const [editMode, setEditMode] = useState({});

  // State variable to control whether to show the create form or not
  const [showCreate, setShowCreate] = useState(false);

  // State variable to control whether to show the delete option or not
  const [showDelete, setShowDelete] = useState(true);

  // State variable to store a success message
  const [successMessage, setSuccessMessage] = useState("");

  // State variable to store / clear form data
  const [formData, setFormData] = useState({
    College: "",
    "Program Type": "",
    "Program Name": "",
    Category: "",
    Region: "",
    Hyperlink: "",
  });

  const [formErrors, setFormErrors] = useState({
    College: false,
    "Program Type": false,
    "Program Name": false,
    Category: false,
    Region: false,
    Hyperlink: false,
  });
  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);
  if (data === null) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>No data available.</p>;
  }
  // Resets the child select and error labels in form
  const clearForm = () => {
    setFormData({
      College: "",
      "Program Type": "",
      "Program Name": "",
      Category: "",
      Region: "",
      Hyperlink: "",
    });
    setFormErrors({
      College: false,
      "Program Type": false,
      "Program Name": false,
      Category: false,
      Region: false,
      Hyperlink: false,
    });
  };

  /**
   * Function to handle the creation of a new entry.
   * It toggles the display of the create form, hides the delete option, and clears the form fields and errors.
   */
  const handleCreate = () => {
    setShowCreate((prevShowForm) => !prevShowForm);
    setShowDelete(false);
    clearForm();
  };

  /**
   * Function to toggle the display of the delete option.
   * It toggles the value of `showDelete` and hides the create form.
   */
  const handleDeleteToggle = () => {
    setShowDelete((prevShowDelete) => !prevShowDelete);
    setShowCreate(false);
  };

  /**
   * Function to update the table data with new data.
   * @param {Array} newData - The new data to set as the table data.
   */
  const setData = (newData) => {
    setTableData(newData);
  };

  /**
   * Function to toggle the display of full text.
   * It toggles the value of `showFullText`.
   */
  const handleShowFullText = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation
    const validateForm = () => {
      let hasErrors = false;
      const updatedFormErrors = { ...formErrors };

      Object.keys(formData).forEach((field) => {
        if (!formData[field]) {
          updatedFormErrors[field] = true;
          hasErrors = true;
        } else {
          updatedFormErrors[field] = false;
        }
      });

      return { hasErrors, updatedFormErrors };
    };

    const { hasErrors, updatedFormErrors } = validateForm();

    if (hasErrors) {
      setFormErrors(updatedFormErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/insert", formData);
      console.log("Data inserted successfully!");
      setSuccessMessage("Success!");
      clearForm();
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      const response = await axios.get("http://localhost:8000/api/data");
      const newData = response.data;
      setData(newData);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [row.id]: true,
    }));

    // Add 'contenteditable' attribute to the <td> elements of the clicked row
    const tableDataRow = document.getElementById(`row-${row.id}`);

    const tableDataCells = tableDataRow.querySelectorAll("td.pt-3-half");
    tableDataCells.forEach((tableDataCell) => {
      tableDataCell.setAttribute("contenteditable", "true");
    });
  };

  const handleCancelEdit = (row) => {
    const originalData = tableData.map((originalRow) => {
      if (originalRow.id === row.id) {
        return originalRow;
      }
      return originalRow;
    });

    setData(originalData);
    setEditingRowId(null);
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [row.id]: false,
    }));

    // Remove 'contenteditable' attribute from the <td> elements with class name "pt-3-half"
    if (isDevelopment) {
      const targetElements = document.querySelectorAll("td.pt-3-half");
      targetElements.forEach((element) => {
        element.removeAttribute("contenteditable");
      });
    }
  };

  /**
   * Handles the save edit action for a row.
   * @param {object} row - The row object being edited.
   */
  const handleSaveEdit = async (row) => {
    try {
      // Get the row element and its cells
      const tableDataRow = document.getElementById(`row-${row.id}`);
      const tableDataCells = tableDataRow.querySelectorAll("td.pt-3-half");
      tableDataCells.forEach((element) => {
        element.removeAttribute("contenteditable");
      });
      // Create a copy of the row object
      const updatedRow = { ...row };

      // Update the values of the row object with the edited cell contents
      tableDataCells.forEach((tableDataCell, columnIndex) => {
        const columnName = Object.keys(updatedRow)[columnIndex - 1]; // Subtract 1 to exclude the 'Action' column

        if (columnName) {
          updatedRow[columnName] = tableDataCell.textContent.trim();
        }
      });

      console.log(updatedRow);

      // Send the updated row data to the server
      await axios.put(`http://localhost:8000/api/data/${row.id}`, updatedRow);
      console.log("Data updated successfully!");

      // Reset editing state and retrieve the updated data from the server
      setEditingRowId(null);
      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        [row.id]: false,
      }));
      const response = await axios.get("http://localhost:8000/api/data");
      const newData = response.data;

      // Move the updated row to the top of the table
      const updatedTableData = move(
        [...newData],
        newData.findIndex((data) => data.id === row.id),
        0
      );

      setData(updatedTableData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleSortAscending = (column) => {
    // Perform sorting logic in ascending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });

    setTableData(sortedData);
  };

  const handleSortDescending = (column) => {
    // Perform sorting logic in descending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      if (a[column] > b[column]) return -1;
      if (a[column] < b[column]) return 1;
      return 0;
    });

    setTableData(sortedData);
  };

  const handleDelete = async (row) => {
    const id = row.id;

    try {
      await axios.delete(`http://localhost:8000/api/delete/${id}`);
      console.log("Data deleted successfully!");

      const response = await axios.get("http://localhost:8000/api/data");
      const newData = response.data;
      setData(newData);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleFormChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: false,
    }));
  };

  return (
    <div className="container">
      <div className="crud-container">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button className="btn btn-dark" onClick={handleCreate}>
            {showCreate ? "Close Add Form" : "Add Program"}
          </button>

          <button className="btn btn-dark" onClick={handleDeleteToggle}>
            {showDelete ? "Close Edit/Delete" : "Edit / Delete Program"}
          </button>
        </div>
        <div className="button-form">
          {showCreate && (
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
              <UniqueDropdown
                data={tableData}
                label="College"
                onChange={handleFormChange}
                error={formErrors.College}
              />
              <UniqueDropdown
                data={tableData}
                label="Program Name"
                onChange={handleFormChange}
                error={formErrors["Program Name"]}
              />
              <UniqueDropdown
                data={tableData}
                label="Program Type"
                onChange={handleFormChange}
                error={formErrors["Program Type"]}
              />
              <UniqueDropdown
                data={tableData}
                label="Category"
                onChange={handleFormChange}
                error={formErrors["Category"]}
              />
              <UniqueDropdown
                data={tableData}
                label="Region"
                onChange={handleFormChange}
                error={formErrors["Region"]}
              />
              <UniqueDropdown
                data={tableData}
                label="Hyperlink"
                onChange={handleFormChange}
                error={formErrors["Hyperlink"]}
              />
              <button type="submit" className="btn btn-primary btn-block">
                Submit
              </button>
              {successMessage && (
                <p className="text-success mt-2">{successMessage}</p>
              )}
            </form>
          )}
        </div>

        <div className="card">
          {showDelete && (
            <>
              <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
                IT PROGRAMS
              </h3>
              <div className="card-body">
                <div id="table" className="table-editable">
                  <span className="table-add float-right mb-3 mr-2"></span>
                  <table className="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                      <tr>
                        {Object.keys(tableData[0] || {}).map(
                          (column, index) => {
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
                                        onClick={() =>
                                          handleSortAscending(column)
                                        }
                                      >
                                        <i className="fa-sharp fa-solid fa-sort-up"></i>
                                      </button>
                                      <button
                                        className="sort-button"
                                        onClick={() =>
                                          handleSortDescending(column)
                                        }
                                      >
                                        <i className="fa-sharp fa-solid fa-sort-down"></i>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              );
                            }
                            return null; // Exclude the first column
                          }
                        )}
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
                            editingRowId === row.id && editMode[row.id]
                              ? "highlighted"
                              : ""
                          }`}
                          key={row.id}
                          suppressContentEditableWarning
                        >
                          {Object.entries(row).map(
                            ([column, value], columnIndex) => {
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
                                              onClick={() =>
                                                handleShowFullText()
                                              }
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
                            }
                          )}

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
                                  className="btn btn-info btn-sm"
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
