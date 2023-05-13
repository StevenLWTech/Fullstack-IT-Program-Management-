import React, { useState } from "react";

export default function Crud({ data }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    college: "",
    programName: "",
    category: "",
    programType: "",
    region: "",
  });
  console.log(data);
  if (data === null) {
    // Data is still loading, show a loading state
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    // Data is empty, show an appropriate message
    return <p>No data available.</p>;
  }
  const handleCreate = () => {
    setShowForm((prevShowForm) => !prevShowForm); // Toggle the value of showForm
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    console.log(formData);
    // Reset the form
    setFormData({
      college: "",
      programName: "",
      category: "",
      programType: "",
      region: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
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
        <button className="btn btn-dark" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div className="button-form">
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="form-outline mb-4">
              <select
                id="college"
                name="college"
                className="form-select"
                value={formData.college}
                onChange={handleChange}
              >
                <option value="" disabled defaultValue>
                  Select a College
                </option>
                {data &&
                  Object.values(data)
                    .map((item) => item.College)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .map((college, index) => (
                      <option key={index} value={college}>
                        {college}
                      </option>
                    ))}
              </select>
            </div>
            <div className="form-outline mb-4">
              <input
                type="text"
                id="programName"
                name="programName"
                className="form-control"
                value={formData.programName}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="programName">
                Program Name
              </label>
            </div>
            <div className="form-outline mb-4">
              <input
                type="text"
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="category">
                Category
              </label>
            </div>
            <div className="form-outline mb-4">
              <input
                type="text"
                id="programType"
                name="programType"
                className="form-control"
                value={formData.programType}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="programType">
                Program Type
              </label>
            </div>
            <div className="form-outline mb-4">
              <input
                type="text"
                id="region"
                name="region"
                className="form-control"
                value={formData.region}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="region">
                Region
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
