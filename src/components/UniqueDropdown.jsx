import React from "react";

const UniqueDropdown = ({ data, property, label, value, onChange }) => {
  const uniqueValues = data
    ? Object.values(data)
        .map((item) => item[property])
        .filter((value, index, self) => self.indexOf(value) === index)
    : [];

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="form-outline mb-4">
      <select
        id={property}
        name={property}
        className="form-select"
        value={value}
        onChange={handleChange}
      >
        <option value="" disabled>
          {label}
        </option>
        {uniqueValues.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label className="form-label" htmlFor={property}>
        {label}
      </label>
      {value && (
        <div className="selected-value">Selected: {value}</div>
      )}
    </div>
  );
};

export default UniqueDropdown;
