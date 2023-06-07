// ProgramForm.js

import React from 'react';
import UniqueDropdown from './UniqueDropdown';

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
      <UniqueDropdown
        data={tableData}
        label="College"
        onChange={handleFormChange}
        error={formErrors.College}
        showError={hasSubmitted}
      />
      <UniqueDropdown
        data={tableData}
        label="Program Name"
        onChange={handleFormChange}
        error={formErrors["Program Name"]}
        showError={hasSubmitted}
      />
      <UniqueDropdown
        data={tableData}
        label="Program Type"
        onChange={handleFormChange}
        error={formErrors["Program Type"]}
        showError={hasSubmitted}
      />
      <UniqueDropdown
        data={tableData}
        label="Category"
        onChange={handleFormChange}
        error={formErrors["Category"]}
        showError={hasSubmitted}
      />
      <UniqueDropdown
        data={tableData}
        label="Region"
        onChange={handleFormChange}
        error={formErrors["Region"]}
        showError={hasSubmitted}
      />
      <UniqueDropdown
        data={tableData}
        label="HyperLink"
        onChange={handleFormChange}
        error={formErrors["HyperLink"]}
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
