import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import { move } from "lodash";
import "./home.css";

function Home({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [hideLastColumn, setHideLastColumn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      let updatedTableData = data.map(({ Hyperlink, ...rest }) => rest);

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

      setTableData(updatedTableData);
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

    const programNameDropdown = document.getElementById("dropdown-2");
    var anySelected = "";
    var dropdown = "dropdown-";
    var count = 0;
    while (true) {
      const currentDropDown = document.getElementById(dropdown + count);
      if (currentDropDown) {
        anySelected += currentDropDown.value;
      } else {
        break;
      }
      count++;
    }

    if (anySelected === "") {
      programNameDropdown.disabled = true;
      programNameDropdown.value = "";
    } else {
      programNameDropdown.disabled = false;
    }
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
    const handleSortAscending = (column) => {
      // Perform sorting logic in ascending order based on the column
      // Update the table data with the sorted data
      const sortedData = [...tableData].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });

      setTableData(sortedData);
    };

    const handleSortDescending = (column) => {
      // Perform sorting logic in descending order based on the column
      // Update the table data with the sorted data
      const sortedData = [...tableData].sort((a, b) => {
        if (a[column] > b[column]) return -1;
        if (a[column] < b[column]) return 1;
        return 0;
      });
      setTableData(sortedData);
    };
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

    if (!data || data.length === 0) {
      return null; // Don't render anything if data is null or empty
    }

    return (
      <>
        {dropdownColumns.map((column, index) => {
          const filteredValues = removeDuplicatesAndFilter(
            column,
            index,
            dropdownColumns
          );

          if (filteredValues.length === 0) {
            return null; // Skip rendering the dropdown if filtered values array is empty
          }

          return (
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
                <option id="clear" key="clear" value="">
                  Cancel
                </option>
                {filteredValues.map((value, i) =>
                  value ? (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  ) : null
                )}
              </select>
            </div>
          );
        })}
        {/* Rest of the code */}
      </>
    );
  };
  const handleSortAscending = (column) => {
    // Perform sorting logic in ascending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });

    setTableData(sortedData);
  };

  const handleSortDescending = (column) => {
    // Perform sorting logic in descending order based on the column
    // Update the table data with the sorted data
    const sortedData = [...tableData].sort((a, b) => {
      if (a[column] > b[column]) return -1;
      if (a[column] < b[column]) return 1;
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
              <table className="table table-bordered table-responsive-md table-striped text-center">
                <thead>
                  <tr>
                    {Object.keys(tableData[0] || {}).map((column, index) => {
                      if (index !== 0) {
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
                      return null; // Exclude the first column
                    })}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr
                      className="table-header"
                      id={`row-${row.id}`}
                      key={row.id}
                    >
                      {Object.entries(row).map(
                        ([column, value], columnIndex) => {
                          if (column !== "id") {
                            return (
                              <td className="pt-3-half" key={columnIndex}>
                                <div id="admin-show-container">{value}</div>
                              </td>
                            );
                          }
                          return null; // Exclude the 'Primary ID' column
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
