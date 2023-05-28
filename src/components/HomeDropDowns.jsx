import React, { useState } from "react";

function Dropdowns({ data, selectedValues, handleDropdownChange, removeDuplicatesAndFilter, hideLastColumn }) {
  const columns = Object.keys(data[0] || {}).slice(1);
  const dropdownColumns = columns.slice(0, -1);

  return (
    <>
      {dropdownColumns.slice(0, -2).map((column, index) => (
        <div key={data[index].uuid} className="dropdown-container">
          <select
            id={`dropdown-${index}`}
            name={`dropdown-${index}`}
            value={selectedValues[index] || ""}
            onChange={(event) => handleDropdownChange(event, index)}
            disabled={
              index === dropdownColumns.length - 1 &&
              (!selectedValues[0] || !selectedValues[1])
            }
          >
            <option key="default" value="" disabled defaultValue>
              {column}
            </option>
            <option id="clear" key="clear" value="">
              Clear
            </option>
            {removeDuplicatesAndFilter(column, index, dropdownColumns)
              .filter((value) => value !== "") // Exclude empty values
              .map((value, i) => (
                <option key={data[i].uuid} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      ))}
      {!hideLastColumn && (
        <>
          {[dropdownColumns.length - 2, dropdownColumns.length - 1].map(
            (index) => (
              <div key={data[index].uuid} className="dropdown-container">
                <select
                  id={`dropdown-${index}`}
                  name={`dropdown-${index}`}
                  className={"d-none d-md-block"}
                  value={selectedValues[index] || ""}
                  onChange={(event) => handleDropdownChange(event, index)}
                >
                  <option key="default" value="" disabled defaultValue>
                    {dropdownColumns[index]}
                  </option>
                  <option id="clear" key="clear" value="">
                    Clear
                  </option>
                  {removeDuplicatesAndFilter(
                    dropdownColumns[index],
                    index,
                    dropdownColumns
                  ).map((value, i) => {
                    // console.log(`Dropdown ${index + 1} - Value: ${value}`);
                    return (
                      <option key={data[i].uuid} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            )
          )}
        </>
      )}
    </>
  );
}

export default Dropdowns;
