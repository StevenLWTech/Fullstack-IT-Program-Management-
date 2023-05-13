import React, { useState } from "react";
import './App.css';

function Home({data}) {
 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [hideLastColumn, setHideLastColumn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
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
        {dropdownColumns.slice(0, -1).map((column, index) => (
          <div key={index} className="dropdown-container">
            <select
              id={`dropdown-${index}`}
              name={`dropdown-${index}`}
              class={`${(index === 1 || index === 2 || index === 3)? 'hidden' : ''}`}
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
    const columns = Object.keys(data[0] || {}).slice(1); 
    
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
                        <td className="table-row"  key={columnIndex}>
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
                        <td className="table-row"  key={columnIndex}>
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
                  <th className="table-header" class={`table-header${(index === 1 || index === 2 || index === 3)? ' hidden' : ''}`} key={index}>
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
                        <td className="table-row" class={`table-header${columnIndex === 0 ? ' hidden' : ''}`} key={columnIndex}>
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
                        <td className="table-row" class={`table-header${columnIndex === 2 ? ' hidden' : ''}`} key={columnIndex}>
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
                        <td className="table-row" class={`table-header${(columnIndex === 3 || columnIndex === 1)? ' hidden' : ''}`} key={columnIndex}>
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
          <button id = "clear-filters" onClick={handleClearFilters}>Clear Filters</button>
          <button id = "toggle-more-filters" onClick={toggleHideLastColumn}>{isVisible ? "Less Filters" : "More Filters"}</button>
        </div>
        <div className="search-wrapper">
          {isVisible && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            className="search-box"
            onChange={handleSearchInputChange}
          />)}
          
        </div>
        <div className="filtered-data-wrapper">
          
          {data.length ? renderFilteredData() : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
