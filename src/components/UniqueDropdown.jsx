import React, { useState } from "react";

const UniqueDropdown = ({ data, label, onChange, error }) => {
  const [showSelect, setShowSelect] = useState(true);
  const [formData, setFormData] = useState("");

  const handleToggle = () => {
    setShowSelect(!showSelect);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setFormData(value);
    onChange(label, value); // Pass the selected value to the parent component
  };

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
