import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { move } from "lodash";
import CrudForm from "../components/CrudComponents/CrudForm";

export default function Crud({ data }) {
  // State variable to store the table data
  const [tableData, setTableData] = useState([]);


  // State variable to control whether to show the create form or not
  const [showCreate, setShowCreate] = useState(false);

  // State variable to control whether to show the delete option or not
  const [showDelete, setShowDelete] = useState(true);

  // State variable to store a success message
  const [successMessage, setSuccessMessage] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [editableRows, setEditableRows] = useState({});
  const [rowUpdates, setRowUpdates] = useState({});


  const handleEditClick = (rowId) => {
    const currentRowData = tableData.find(row => row._id === rowId);
    if (!currentRowData) {
      console.error("Row data not found");
      return;
    }

    setEditableRows(prevEditableRows => ({
      ...prevEditableRows,
      [rowId]: true
    }));

    // Initialize rowUpdates with the current row data
    setRowUpdates(prevRowUpdates => ({
      ...prevRowUpdates,
      [rowId]: { ...currentRowData }
    }));
  };
  const handleCellChange = (rowId, fieldName, value) => {
    setRowUpdates(prevRowUpdates => ({
      ...prevRowUpdates,
      [rowId]: {
        ...prevRowUpdates[rowId],
        [fieldName]: value
      }
    }));
  };

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
      // Sort the table data by the first column in ascending order
      const sortedData = [...data].sort((a, b) => {
        const valueA = a["College"]; // Handle empty strings
        const valueB = b["College"]; // Handle empty strings
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      });

      setTableData(sortedData);
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
    setHasSubmitted(false);
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

  const isRowChanged = (rowId) => {
    const originalRowData = tableData.find(row => row._id === rowId);
    const updatedRowData = rowUpdates[rowId];

    return Object.keys(originalRowData).some(key => {
      // Assuming that rowUpdates only contains keys that are editable
      return updatedRowData[key] !== undefined && updatedRowData[key] !== originalRowData[key];
    });
  };

  const handleCancelEdit = (rowId) => {

    setEditableRows(prevEditableRows => ({
      ...prevEditableRows,
      [rowId]: false
    }));
    return; // Exit the function if no changes
  };


  /**
   * Handles the save edit action for a row.
   * @param {object} rowId - The row object being edited.
   */
  const handleSaveClick = async (rowId) => {
    if (!isRowChanged(rowId)) {
      console.log("No changes to save for row:", rowId);
      setEditableRows(prevEditableRows => ({
        ...prevEditableRows,
        [rowId]: false
      }));
      return; // Exit the function if no changes
    }
    try {
      const updatedValues = getUpdatedValuesForRow(rowId);
      if (!updatedValues) {
        console.error("Updated values not found");
        return;
      }

      // Send the updated row data to the server
      const response = await axios.put(`http://localhost:8000/api/data/${rowId}`, updatedValues);
      console.log("Data updated successfully!", response.data);

      // Update the local state with the new data
      setTableData(prevTableData =>
        prevTableData.map(row => row._id === rowId ? { ...row, ...updatedValues } : row)
      );

      // Set the success message and reset the form
      setSuccessMessage("Row updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000); // Clear the success message after 5 seconds

      // Remove the row from the editableRows state
      setEditableRows(prevEditableRows => ({
        ...prevEditableRows,
        [rowId]: false
      }));

      // Optionally, clear the row updates for the saved row
      setRowUpdates(prevRowUpdates => {
        const newRowUpdates = { ...prevRowUpdates };
        delete newRowUpdates[rowId];
        return newRowUpdates;
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };


  const getUpdatedValuesForRow = (rowId) => {
    return rowUpdates[rowId] || {};
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
      setHasSubmitted(true);
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
            <CrudForm
              formData={formData}
              formErrors={formErrors}
              handleFormChange={handleFormChange}
              handleSubmit={handleSubmit}
              hasSubmitted={hasSubmitted}
              tableData={tableData}
              successMessage={successMessage}
            />
          )}
        </div>

        <div className="card">
          {showDelete && (
            <>
              <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
                Search technology programs
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
                        <tr key={row._id}>
                          {Object.keys(row)
                            .filter(key => key !== '_id') // Filter out the '_id' key
                            .map(key => (
                              <td key={key}>
                                {editableRows[row._id] ? (
                                  <input
                                    type="text"
                                    value={rowUpdates[row._id] && rowUpdates[row._id][key] !== undefined ? String(rowUpdates[row._id][key]) : String(row[key] || "")}
                                    onChange={(e) => handleCellChange(row._id, key, e.target.value)}
                                  />
                                ) : (
                                  row[key] || ""
                                )}
                              </td>
                            ))}
                          <td className="button-container">
                            {/* Toggle button text and functionality based on whether the row is being edited */}
                            <button
                              className="edit-cancel-btn"
                              onClick={() => editableRows[row._id] ? handleCancelEdit(row._id) : handleEditClick(row._id)}>
                              {editableRows[row._id] ? 'Cancel' : 'Edit'}
                            </button>


                            {/* Save button - onClick, handle saving and remove editable status */}
                            {editableRows[row._id] && (
                              <button onClick={() => handleSaveClick(row._id)}>Save</button>
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
