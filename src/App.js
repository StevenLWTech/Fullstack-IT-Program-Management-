import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import renderDropDowns from "./"

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setSelectedValues([]);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
    setSearchQuery("");
  };

  const handleResetDropdownChange = (event) => {
    setSelectedValues([]);
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

  const renderDropdowns = () => {
    const columns = Object.keys(data[0] || {});
    const dropdownColumns = columns.slice(0, -1);

    return dropdownColumns.map((column, index) => (
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
          {removeDuplicatesAndFilter(column, index, dropdownColumns).map(
            (value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            )
          )}
        </select>
      </div>
    ));
  };

  const renderResetDropdown = () => (
    <div className="dropdown-container">
      <select
        id="dropdown-reset"
        name="dropdown-reset"
        onChange={handleResetDropdownChange}
      >
        <option key="default" value="" disabled selected>
          Clear Choices
        </option>
        <option key="reset" value="reset">
          Clear
        </option>
      </select>
    </div>
  );

  const renderFilteredData = () => {
    if (selectedValues.some((value) => value) || searchQuery) {
      const columns = Object.keys(data[0] || {});
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
      //console.log(filteredData);
      return (
        <div className="filtered-data">
          <table className="filtered-data-table">
            <thead>
              <tr>
                {columns.slice(0,-1).map((column, index) => (
                  <th className="table-header" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.slice(0,-1).map((column, columnIndex) => {
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
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="dropdowns-wrapper">
          {data.length ? renderDropdowns() : <p>Loading...</p>}
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
        <div className="filtered-data-wrapper">
          {data.length ? renderFilteredData() : null}
        </div>
      </div>
    </div>
  );
}

export default App;
