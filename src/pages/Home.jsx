import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import SortableTable from "../components/HomeComponents/ProgramTable";
import "../styles/home.css";
import Dropdowns from "../components/HomeComponents/ProgramDropdown";

/**
 * Removes duplicates and filters data based on selected values from other columns.
 *
 * @param {Array} data - The input data that contains rows of information.
 * @param {string} column - The name of the column to be filtered for unique values.
 * @param {number} columnIndex - The index of the 'column' parameter in the 'columns' array.
 * @param {Array} columns - An array of column names.
 * @param {Array} selectedValues - An array of selected values for each column.
 * @returns {Array} - An array of unique values from the specified 'column' that satisfy the selected values from other columns.
 */
function removeDuplicatesAndFilter(
  data,
  column,
  columnIndex,
  columns,
  selectedValues
) {
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
  ).filter((value) => value !== null); // Exclude empty values
  uniqueValues.sort();


  return uniqueValues;
}

// Moved outside the component
function sortTableData(data) {
  return [...data].sort((a, b) => {
    if (a["College"] !== b["College"]) {
      return a["College"] < b["College"] ? -1 : 1;
    } else if (a["Category"] !== b["Category"]) {
      return a["Category"] < b["Category"] ? -1 : 1;
    } else if (a["Program Type"] !== b["Program Type"]) {
      return a["Program Type"] < b["Program Type"] ? -1 : 1;
    } else {
      return a["Program Name"] < b["Program Name"] ? -1 : 1;
    }
  });
}
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
      setTableData(sortTableData(sortedData));
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
   * Toggles the visibility of the last column in the table.
   * Updates the state variables hideLastColumn and isVisible.
   */
  const toggleHideLastColumn = () => {
    setHideLastColumn(!hideLastColumn);
    setIsVisible(!isVisible);
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
        <div className="dropdowns-wrapper">
          {/* Render dropdown filters */}
          {data.length ? (
            <Dropdowns
              data={data}
              selectedValues={selectedValues}
              handleDropdownChange={handleDropdownChange}
              removeDuplicatesAndFilter={(column, columnIndex, columns) =>
                removeDuplicatesAndFilter(
                  data,
                  column,
                  columnIndex,
                  columns,
                  selectedValues
                )
              }
              hideLastColumn={hideLastColumn}
            />
          ) : (
            <p>Loading...</p>
          )}
          {/* Clear Filters button */}
          <button
            id="clear-filters"
            className="d-md-block"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
          {/* Toggle More Filters button */}
          <button
            id="toggle-more-filters"
            className="d-none d-md-block"
            onClick={toggleHideLastColumn}
          >
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
        <SortableTable
          tableData={tableData}
          handleSortAscending={handleSortAscending}
          handleSortDescending={handleSortDescending}
        />
      </div>
    </div>
  );
}

export default Home;
