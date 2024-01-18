// ProgramForm.js

import React from 'react';
import Dropdown from './CrudDropdown';

function ProgramForm({
  formData,
  formErrors,
  handleFormChange,
  handleSubmit,
  hasSubmitted,
  tableData,
  successMessage
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="needs-validation"
      noValidate
    >
      <Dropdown
        data={tableData}
        label="College"
        onChange={handleFormChange}
        error={formErrors.College}
        showError={hasSubmitted}
      />
      <Dropdown
        data={tableData}
        label="Program Name"
        onChange={handleFormChange}
        error={formErrors["Program Name"]}
        showError={hasSubmitted}
      />
      <Dropdown
        data={tableData}
        label="Program Type"
        onChange={handleFormChange}
        error={formErrors["Program Type"]}
        showError={hasSubmitted}
      />
      <Dropdown
        data={tableData}
        label="Category"
        onChange={handleFormChange}
        error={formErrors["Category"]}
        showError={hasSubmitted}
      />
      <Dropdown
        data={tableData}
        label="Region"
        onChange={handleFormChange}
        error={formErrors["Region"]}
        showError={hasSubmitted}
      />
      <Dropdown
        data={tableData}
        label="Hyperlink"
        onChange={handleFormChange}
        error={formErrors["Hyperlink"]}
        showError={hasSubmitted}
      />
      <button type="submit" className="btn btn-primary btn-block">
        Submit
      </button>
      {successMessage && (
        <p className="text-success mt-2">{successMessage}</p>
      )}
    </form>
  );
}

export default ProgramForm;
