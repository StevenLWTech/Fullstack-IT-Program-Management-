import React from "react";

const FormValidation = ({ formData, formErrors, setFormErrors }) => {
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

  const handleFormValidation = () => {
    const { hasErrors, updatedFormErrors } = validateForm();
    setFormErrors(updatedFormErrors);
    return hasErrors;
  };

  return null;
};

export default FormValidation;
