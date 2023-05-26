import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";

import "../styles/home.css";

function Home({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [hideLastColumn, setHideLastColumn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [tableData, setTableData] = useState([]);

  /**
   * useEffect hook that filters and sorts table data based on selected filter values and search query.
   * @param {Array} data - The original table data.
   * @param {Array} selectedValues - An array of selected filter values.
   * @param {String} searchQuery - The search query string.
   */
 /**
   * useEffect hook that filters and sorts table data based on selected filter values and search query.
   * @param {Array} data - The original table data.
   * @param {Array} selectedValues - An array of selected filter values.
   * @param {String} searchQuery - The search query string.
   */
 useEffect(() => {
  if (data) {
    let updatedTableData = data;

    // If any filter values are selected or if a search query is present
    if (selectedValues.some((value) => value !== "") || searchQuery) {
      // Filter rows based on dropdown selections
      updatedTableData = updatedTableData
        .filter((row) =>
          selectedValues.every(
            (value, index) =>
              !value || row[Object.keys(data[0])[index + 1]] === value
          )
        )
        // Filter rows based on search query
        .filter((row) => {
          const values = Object.values(row).join("").toLowerCase();
          return values.includes(searchQuery.toLowerCase());
        });
    }

    // Sort the table data by columns 1, 2, 3, and 4
    const sortedData = [...updatedTableData];
    sortedData.sort((a, b) => {
      if (a["College"] !== b["College"]) {
        return a["College"] < b["College"] ? -1 : 1;
      } else if (a["Program Type"] !== b["Program Type"]) {
        return a["Program Type"] < b["Program Type"] ? -1 : 1;
      } else if (a["Program Name"] !== b["Program Name"]) {
        return a["Program Name"] < b["Program Name"] ? -1 : 1;
      } else {
        return a["Category"] < b["Category"] ? -1 : 1;
      }
    });

    setTableData(sortedData);
  }
}, [data, selectedValues, searchQuery]);

  if (data === null) {
    // Data is still loading, show a loading state
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    // Data is empty, show an appropriate message
    return <p>No data available.</p>;
  }

  /**
   * Clears the selected filter values and search query.
   */
  const handleClearFilters = () => {
    setSelectedValues([]);
    setSearchQuery("");
  };

  /**
   * Handles the change event for dropdown filters.
   * @param {Object} event - The event object.
   * @param {number} index - The index of the dropdown filter.
   */
  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
  };

  /**
   * Removes duplicates and filters the data based on selected filter values.
   * @param {string} column - The column name to filter on.
   * @param {number} columnIndex - The index of the current column.
   * @param {Array} columns - An array of column names.
   * @returns {Array} - An array of unique and sorted values for the given column.
   */
  const removeDuplicatesAndFilter = (column, columnIndex, columns) => {
    let filteredData = data;

    selectedValues.forEach((selectedValue, selectedIndex) => {
      if (selectedValue && selectedIndex !== columnIndex) {
        const filterColumn = columns[selectedIndex];
        filteredData = filteredData.filter(
          (row) => row[filterColumn] === selectedValue
        );
      }
    });

    const uniqueValues = Array.from(
      new Set(filteredData.map((row) => row[column]))
    );
    uniqueValues.sort();
    return uniqueValues;
  };

  /**
   * Toggles the visibility of the last column in the table.
   * Updates the state variables hideLastColumn and isVisible.
   */
  const toggleHideLastColumn = () => {
    setHideLastColumn(!hideLastColumn);
    setIsVisible(!isVisible);
  };
  /**
   * Renders the dropdown filters based on the table data.
   * @returns {JSX.Element} - JSX elements representing the dropdown filters.
   */
  const renderDropdowns = () => {
    const columns = Object.keys(data[0] || {}).slice(1);
    const dropdownColumns = columns.slice(0, -1);

    return (
      <>
        {dropdownColumns.slice(0, -2).map((column, index) => (
          <div key={index} className="dropdown-container">
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
              <option id="clear" key="clear" value=""></option>
              {removeDuplicatesAndFilter(column, index, dropdownColumns)
                .filter((value) => value !== "") // Exclude empty values
                .map((value, i) => (
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
              id={`dropdown-${dropdownColumns.length - 2}`}
              name={`dropdown-${dropdownColumns.length - 2}`}
              className={"d-none d-md-block"}
              value={selectedValues[dropdownColumns.length - 2] || ""}
              onChange={(event) =>
                handleDropdownChange(event, dropdownColumns.length - 2)
              }
            >
              <option key="default" value="" disabled defaultValue>
                {dropdownColumns[dropdownColumns.length - 2]}
              </option>
              <option id="clear" key="clear" value="">
                Cancel
              </option>
              {removeDuplicatesAndFilter(
                dropdownColumns[dropdownColumns.length - 2],
                dropdownColumns.length - 2,
                dropdownColumns
              ).map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
        {!hideLastColumn && (
          <div className="dropdown-container">
            <select
              id={`dropdown-${dropdownColumns.length - 1}`}
              name={`dropdown-${dropdownColumns.length - 1}`}
              className={"d-none d-md-block"}
              value={selectedValues[dropdownColumns.length - 1] || ""}
              onChange={(event) =>
                handleDropdownChange(event, dropdownColumns.length - 1)
              }
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
  };

  /**
   * Sorts the table data in ascending order based on the specified column.
   * @param {string} column - The column to sort by.
   */
  const handleSortAscending = (column) => {
    // Perform sorting logic in ascending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      const valueA = a[column] || ""; // Handle empty strings
      const valueB = b[column] || ""; // Handle empty strings
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    setTableData(sortedData);
  };

  /**
   * Sorts the table data in descending order based on the specified column.
   * @param {string} column - The column to sort by.
   */
  const handleSortDescending = (column) => {
    // Perform sorting logic in descending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      const valueA = a[column] || ""; // Handle empty strings
      const valueB = b[column] || ""; // Handle empty strings
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    });

    setTableData(sortedData);
  };

  /**
   * Updates the search query based on the input change event.
   * @param {Object} event - The input change event object.
   */
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Search IT Programs</h1>
        <div className="dropdowns-wrapper">
          {/* Render dropdown filters */}
          {data.length ? renderDropdowns() : <p>Loading...</p>}
          {/* Clear Filters button */}
          <button id="clear-filters" className="d-md-block" onClick={handleClearFilters}>
            Clear Filters
          </button>
          {/* Toggle More Filters button */}
          <button id="toggle-more-filters" className="d-none d-md-block" onClick={toggleHideLastColumn}>
            {isVisible ? "Less Filters" : "More Filters"}
          </button>
        </div>
        {/* Search input */}
        <div className="search-wrapper">
          {isVisible && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              className="search-box d-none d-md-block"
              onChange={handleSearchInputChange}
            />
          )}
        </div>
        <div className="card">
          <h3 className="card-header text-center font-weight-bold text-uppercase py-4" style={{color: '#1c2331'}}>
            IT PROGRAMS
          </h3>
          {/* Table header */}
          <div className="card-body">
            <div id="table" className="table-editable">
              <span className="table-add float-right mb-3 mr-2"></span>
              {/* Table content */}
              <table className="table table-bordered table-responsive-md table-striped text-center table-hover">
                <thead>
                  <tr>
                    {Object.keys(tableData[0] || {}).map((column, index) => {
                      if (
                        index !== 0 &&
                        index !== Object.keys(tableData[0]).length - 1
                      ) {
                        return (
                          <td className="text-center" key={index}>
                            <div className="admin-header">
                              <div id="admin-header-text">{column}</div>
                              <div id="admin-sort">
                                <button
                                  className="sort-button"
                                  onClick={() => handleSortAscending(column)}
                                >
                                  <i className="fa-sharp fa-solid fa-sort-up"></i>
                                </button>
                                <button
                                  className="sort-button"
                                  onClick={() => handleSortDescending(column)}
                                >
                                  <i className="fa-sharp fa-solid fa-sort-down"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                        );
                      }
                      return null; // Exclude the first and last columns
                    })}
                  </tr>
                </thead>
                <tbody className="table-group-divider table-divider-color">
                  {tableData.map((row) => (
                    <tr
                      className="table-header table-Primary"
                      id={`row-${row.id}`}
                      key={row.id}
                    >
                      {Object.entries(row).map(
                        ([column, value], columnIndex) => {
                          if (column !== "id" && column !== "Hyperlink") {
                            return (
                              <td className="pt-3-half" key={columnIndex}>
                                <div id="admin-show-container">
                                  {column === "Program Name" ? (
                                    <a href={row.Hyperlink}>{value}</a>
                                  ) : (
                                    value
                                  )}
                                </div>
                              </td>
                            );
                          }
                          return null; // Exclude the 'Primary ID' and 'Hyperlink' columns
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* {data.length ? renderFilteredData() : null} */}
        <div className="filtered-data-wrapper"></div>
      </div>
    </div>
  );
}

export default Home;
