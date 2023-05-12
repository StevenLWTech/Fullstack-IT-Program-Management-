import React, { useState } from "react";
import UniqueDropdown from "../components/UniqueDropdown";
import axios from "axios";

export default function Crud({ data }) {
  const [showForm, setShowForm] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);
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

  if (data === null) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>No data available.</p>;
  }

  const handleCreate = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation
    let hasErrors = false;
    const updatedFormErrors = { ...formErrors };

    // Check if any field is empty or null
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        updatedFormErrors[field] = true;
        hasErrors = true;
      } else {
        updatedFormErrors[field] = false;
      }
    });

    if (hasErrors) {
      setFormErrors(updatedFormErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/insert", formData);
      console.log("Data inserted successfully!");
      setUpdateCounter((prevCounter) => prevCounter + 1);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
  const handleDelete = async (row) => {
    const college = row.College;
    const programType = row["Program Type"];
    const category = row.Category;
    const region = row.Region;
    
    try {
      await axios.delete(`http://localhost:8000/api/delete/${college}/${programType}/${category}/${region}`);

      console.log("Data deleted successfully!");
      setUpdateCounter((prevCounter) => prevCounter + 1);
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
    <div className="crud-container">
      <div className="btn-group" role="group" aria-label="Basic example">
        <button className="btn btn-dark" onClick={handleCreate}>
          {showForm ? "Close Form" : "Create"}
        </button>
        <button className="btn btn-dark">Edit</button>
        <button className="btn btn-dark">Delete</button>
      </div>
      <div className="button-form">
        {showForm && (
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
        <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
          Delete Rows
        </h3>
        <div className="card-body">
          <div id="table" className="table-editable">
            <span className="table-add float-right mb-3 mr-2">
              <a href="#!" className="text-success">
                <i className="fas fa-plus fa-2x" aria-hidden="true"></i>
              </a>
            </span>
            <table className="table table-bordered table-responsive-md table-striped text-center">
              <thead>
                <tr>
                  {Object.keys(data[0] || {}).map((column, index) => (
                    <th className="text-center" key={index}>
                      {column}
                    </th>
                  ))}
                  <th className="text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => {
                  const modifiedRow = Object.entries(row).reduce(
                    (acc, [key, value]) => {
                      if (key === "Program Name") {
                        acc.splice(1, 0, ["Program Name", value]);
                      } else {
                        acc.push([key, value]);
                      }
                      return acc;
                    },
                    []
                  );

                  return (
                    <tr className="hide" key={rowIndex}>
                      {modifiedRow.map(([column, value], columnIndex) => (
                        <td className="pt-3-half" key={columnIndex}>
                          {value}
                        </td>
                      ))}
                      <td>
                        <span className="table-remove">
                          <button
                            type="button"
                            className="btn btn-danger btn-rounded btn-sm my-0"
                            onClick={() => handleDelete(row)}
                          >
                            Remove
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
