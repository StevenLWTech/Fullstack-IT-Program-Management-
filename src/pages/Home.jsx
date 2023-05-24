import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";

import "../styles/home.css";

function Home({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [hideLastColumn, setHideLastColumn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [tableData, setTableData] = useState([]);

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

      // Sort the table data by each column in ascending order (ignoring empty strings)
      const sortedData = [...updatedTableData];
      Object.keys(data[0])
        .slice(1)
        .forEach((column) => {
          sortedData.sort((a, b) => {
            const valueA = a["College"] ;
            const valueB = b["College"] ; 
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
          });
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

  const handleClearFilters = () => {
    setSelectedValues([]);
    setSearchQuery("");
  };

  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
  };

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
  const toggleHideLastColumn = () => {
    setHideLastColumn(!hideLastColumn);
    setIsVisible(!isVisible);
  };
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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Search IT Programs</h1>
        <div className="dropdowns-wrapper">
          {data.length ? renderDropdowns() : <p>Loading...</p>}
          <button id="clear-filters" onClick={handleClearFilters}>
            Clear Filters
          </button>
          <button id="toggle-more-filters" onClick={toggleHideLastColumn}>
            {isVisible ? "Less Filters" : "More Filters"}
          </button>
        </div>
        <div className="search-wrapper">
          {isVisible && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              className="search-box"
              onChange={handleSearchInputChange}
            />
          )}
        </div>
        <div className="card">
          <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
            IT PROGRAMS
          </h3>
          <div className="card-body">
            <div id="table" className="table-editable">
              <span className="table-add float-right mb-3 mr-2"></span>
              <table className="table table-bordered table-responsive-md table-striped text-center table-hover">
                <thead>
                  <tr >
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
        ;
        <div className="filtered-data-wrapper">
          {/* {data.length ? renderFilteredData() : null} */}
        </div>
      </div>
    </div>
  );
}

export default Home;
