import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import renderDropDowns from "./";

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [hideLastColumn, setHideLastColumn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setSelectedValues([]);
    setSearchQuery("");
  };

  const fetchData = async () => {
    //console.log("Fetching data...");
    try {
      const response = await axios.get(
        "https://sbctcfunction.azurewebsites.net/api/sbctcAPI",
        {
          headers: {
            "Access-Control-Allow-Origin":
              "https://sbctc.z13.web.core.windows.net",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
        }
      );
      const modifiedData = response.data.map((item) => {
        const keys = Object.keys(item);
        const programNameIndex = keys.indexOf("Program Name");
        keys.splice(programNameIndex, 1);
        keys.splice(-1, 0, "Program Name");
        const entries = keys.map((key) => [key, item[key]]);
        return Object.fromEntries(entries);
      });
      console.log("Data fetched:", modifiedData);
      setData(modifiedData);
    } catch (error) {
      //console.error("Error fetching data:", error);
    }
  };
  

  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
    setSearchQuery("");
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
    const columns = Object.keys(data[0] || {});
    const dropdownColumns = columns.slice(0, -1);
    // dropdownColumns = [
    //   ...dropdownColumns.slice(0, 2),
    //   ...dropdownColumns.slice(3),
    //   dropdownColumns[2],
    // ];

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
              <option id="clear" key="clear" value="">
                
              </option>
              {removeDuplicatesAndFilter(column, index, dropdownColumns).map(
                (value, i) => (
                  <option key={i} value={value}>
                    {value}
                  </option>
                )
              )}
            </select>
          </div>
        ))}
        {hideLastColumn ? null : (
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

  const renderFilteredData = () => {
    const columns = Object.keys(data[0] || {});
    
    if (selectedValues.some((value) => value) || searchQuery) {
      const filteredData = data
        .filter((row) =>
          selectedValues.every(
            (value, index) => !value || row[columns[index]] === value
          )
        )
        .filter((row) => {
          const values = Object.values(row).join("").toLowerCase();
          return values.includes(searchQuery.toLowerCase());
        });
      return (
        <div className="filtered-data">
          <table className="filtered-data-table">
            <thead>
              <tr>
                {columns.slice(0, -1).map((column, index) => (
                  <th className="table-header" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.slice(0, -1).map((column, columnIndex) => {
                    if (row[column] === null) {
                      return (
                        <td className="table-row" key={columnIndex}>
                          <a
                            href={row[columns[5]]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row[columns[columnIndex - 1]]}
                          </a>
                        </td>
                      );
                    } else if (columnIndex === 2) {
                      return (
                        <td className="table-row" key={columnIndex}>
                          <a
                            href={row[columns[5]]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row[column]}
                          </a>
                        </td>
                      );
                    } else {
                      return (
                        <td className="table-row" key={columnIndex}>
                          {row[column]}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="filtered-data">
          <table className="filtered-data-table">
            <thead>
              <tr>
                {columns.slice(0, -1).map((column, index) => (
                  <th className="table-header" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.slice(0, -1).map((column, columnIndex) => {
                    if (row[column] === null) {
                      return (
                        <td className="table-row" key={columnIndex}>
                          <a
                            href={row[columns[5]]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row[columns[columnIndex - 1]]}
                          </a>
                        </td>
                      );
                    } else if (columnIndex === 2) {
                      return (
                        <td className="table-row" key={columnIndex}>
                          <a
                            href={row[columns[5]]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row[column]}
                          </a>
                        </td>
                      );
                    } else {
                      return (
                        <td className="table-row" key={columnIndex}>
                          {row[column]}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
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
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
        <div className="search-wrapper">
          {isVisible && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            
            onChange={handleSearchInputChange}
          />)}
          <div id = "toggle-more">
            
          </div>
          <button id = "toggle-more-filters" onClick={toggleHideLastColumn}>{isVisible ? "Less Filters" : "More Filters"}</button>
        </div>
        <div className="filtered-data-wrapper">
          
          {data.length ? renderFilteredData() : null}
        </div>
      </div>
    </div>
  );
}

export default App;
