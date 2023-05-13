import React from 'react'

// Dropdowns.js

export function renderDropdowns(columns, selectedValues, hideLastColumn, handleDropdownChange, removeDuplicatesAndFilter) {
    const dropdownColumns = columns.slice(0, -1);
  
    return (
      <>
        {dropdownColumns.slice(0, -1).map((column, index) => (
          <div key={index} className="dropdown-container">
            <select
              id={`dropdown-${index}`}
              name={`dropdown-${index}`}
              value={selectedValues[index] || ""}
              onChange={(event) => handleDropdownChange(event, index)}
            >
              <option key="default" value="" disabled defaultValue>
                {column}
              </option>
              <option id="clear" key="clear" value=""></option>
              {removeDuplicatesAndFilter(column, index, dropdownColumns).map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
        {!hideLastColumn && (
          <div className="dropdown-container">
            <select
              id={`dropdown-${dropdownColumns.length - 1}`}
              name={`dropdown-${dropdownColumns.length - 1}`}
              value={selectedValues[dropdownColumns.length - 1] || ""}
              onChange={(event) => handleDropdownChange(event, dropdownColumns.length - 1)}
            >
              <option key="default" value="" disabled defaultValue>
                {dropdownColumns[dropdownColumns.length - 1]}
              </option>
              <option id="clear" key="clear" value="">
                Cancel
              </option>
              {removeDuplicatesAndFilter(
                dropdownColumns[dropdownColumns.length - 1],
                dropdownColumns.length - 1,
                dropdownColumns
              ).map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
      </>
    );
  }
  