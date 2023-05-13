import React, { useState, useEffect } from "react";
import UniqueDropdown from "../components/UniqueDropdown";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import Table from "..components/Table";
import { move } from "lodash";


export default function Crud({ data }) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [showFullText, setShowFullText] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null); // Track the ID of the row being edited
  const [tableData, setTableData] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(true);
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

  const handleCreate = () => {
    setShowCreate((prevShowForm) => !prevShowForm);
    setShowDelete(false);
  };

  const handleDeleteToggle = () => {
    setShowDelete((prevShowDelete) => !prevShowDelete);
    setShowCreate(false);
  };

  const setData = (newData) => {
    setTableData(newData);
  };

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
    const college = row.College;
    const programType = row["Program Type"];
    const category = row.Category;
    const region = row.Region;

    try {
      await axios.delete(
        `http://localhost:8000/api/delete/${college}/${programType}/${category}/${region}`
      );

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
                data={data}
                label="College"
                onChange={handleFormChange}
                error={formErrors.College}
              />
              <UniqueDropdown
                data={data}
                label="Program Name"
                onChange={handleFormChange}
                error={formErrors["Program Name"]}
              />
              <UniqueDropdown
                data={data}
                label="Program Type"
                onChange={handleFormChange}
                error={formErrors["Program Type"]}
              />
              <UniqueDropdown
                data={data}
                label="Category"
                onChange={handleFormChange}
                error={formErrors["Category"]}
              />
              <UniqueDropdown
                data={data}
                label="Region"
                onChange={handleFormChange}
                error={formErrors["Region"]}
              />
              <UniqueDropdown
                data={data}
                label="Hyperlink"
                onChange={handleFormChange}
                error={formErrors["Hyperlink"]}
              />
              <button type="submit" className="btn btn-primary btn-block">
                Submit
              </button>
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
                <Table
                  tableData={tableData}
                  editingRowId={editingRowId}
                  editMode={editMode}
                  handleEdit={handleEdit}
                  handleCancelEdit={handleCancelEdit}
                  handleSaveEdit={handleSaveEdit}
                  handleSortAscending={handleSortAscending}
                  handleSortDescending={handleSortDescending}
                  handleDelete={handleDelete}
                  showFullText={showFullText}
                  handleShowFullText={handleShowFullText}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
