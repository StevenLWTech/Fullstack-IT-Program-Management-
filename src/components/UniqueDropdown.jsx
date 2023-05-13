import React, { useState } from "react";

/**
 * Component representing a unique dropdown input.
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data array to populate the dropdown options.
 * @param {string} props.label - The label of the dropdown.
 * @param {function} props.onChange - The callback function to handle value changes.
 * @param {boolean} props.error - Flag indicating whether there is an error with the dropdown.
 * @returns {JSX.Element} - The rendered UniqueDropdown component.
 */
const UniqueDropdown = ({ data, label, onChange, error }) => {
  const [showSelect, setShowSelect] = useState(true);
  const [formData, setFormData] = useState("");

  /**
   * Toggle the display of the dropdown or input field.
   */
  const handleToggle = () => {
    setShowSelect(!showSelect);
  };

  /**
   * Handle the change event of the dropdown or input field.
   * @param {Object} event - The change event object.
   */
  const handleChange = (event) => {
    const { value } = event.target;
    setFormData(value);
    onChange(label, value); // Pass the selected value to the parent component
  };

  // Define the class names based on the error flag
  const containerClass = error ? "form-outline has-error" : "form-outline";
  const fieldClass = error ? "form-select error" : "form-select";

  return (
    <div className={containerClass}>
      {showSelect ? (
        <select
          name={label}
          className={fieldClass}
          value={formData}
          onChange={handleChange}
        >
          <option value="" disabled defaultValue>
            Select {label}
          </option>
          {data &&
            Object.values(data)
              .map((item) => item[label])
              .filter(
                (value, index, self) => self.indexOf(value) === index
              )
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
        </select>
      ) : (
        <input
          type="text"
          className={fieldClass}
          value={formData}
          onChange={handleChange}
        />
      )}
      <button className="btn-add" onClick={handleToggle}>
        +
      </button>
      {error && <div className="error-message">Please select a {label}.</div>}
    </div>
  );
};

export default UniqueDropdown;
