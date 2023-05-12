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

      <div class="card">
        <h3 class="card-header text-center font-weight-bold text-uppercase py-4">
          Delete Rows
        </h3>
        <div class="card-body">
          <div id="table" class="table-editable">
            <span class="table-add float-right mb-3 mr-2">
              <a href="#!" class="text-success">
                <i class="fas fa-plus fa-2x" aria-hidden="true"></i>
              </a>
            </span>
            <table class="table table-bordered table-responsive-md table-striped text-center">
              <thead>
                <tr>
                  {Object.keys(data[0] || {})
                    .slice(0, -1)
                    .map((column, index) => (
                      <th className="text-center" key={index}>
                        {column}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>

               
                       
                <tr class="hide">
                  <td class="pt-3-half" contenteditable="true">
                    Elisa Gallagher
                  </td>
                  <td class="pt-3-half" contenteditable="true">
                    31
                  </td>
                  <td class="pt-3-half" contenteditable="true">
                    Portica
                  </td>
                  <td class="pt-3-half" contenteditable="true">
                    United Kingdom
                  </td>
                  <td class="pt-3-half" contenteditable="true">
                    London
                  </td>
                  <td class="pt-3-half">
                    <span class="table-up">
                      <a href="#!" class="indigo-text">
                        <i
                          class="fas fa-long-arrow-alt-up"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </span>
                    <span class="table-down">
                      <a href="#!" class="indigo-text">
                        <i
                          class="fas fa-long-arrow-alt-down"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </span>
                  </td>
                  <td>
                    <span class="table-remove">
                      <button
                        type="button"
                        class="btn btn-danger btn-rounded btn-sm my-0"
                      >
                        Remove
                      </button>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
