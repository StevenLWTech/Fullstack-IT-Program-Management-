import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import renderDropDowns from "./";

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
    console.log("Fetching data...");
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
      console.log("Data fetched:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
    
    // Disable the "Program Name" dropdown until at least one other dropdown has been selected
    const programNameDropdown = document.getElementById("dropdown-2");
    var anySelected = "";
    var dropdown = "dropdown-";
    var count = 0;
    while(true){
      const currentDropDown = document.getElementById(dropdown+count)
      if(currentDropDown){
        anySelected += currentDropDown.value;
      }else{
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
  
    return dropdownColumns.map((column, index) => {
      const uniqueValues = Array.from(
        new Set(data.map((row) => row[column]))
      );
      uniqueValues.sort();
  
      return (
        <div key={index} className="dropdown-container">
          <select
            id={`dropdown-${index}`}
            name={`dropdown-${index}`}
            value={selectedValues[index] || ""}
            onChange={(event) => handleDropdownChange(event, index)}
            disabled={index === 2 || (index === 2 && selectedValues[0] === "" && selectedValues[1] === "")}
          >
            <option key="default" value="" disabled defaultValue>
              {column}
            </option>
            <option id="clear" key="clear" value="">
              Cancel
            </option>
            {uniqueValues.map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      );
    });
  };
  
  
  
  
  
  


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
