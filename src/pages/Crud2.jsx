import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import CrudForm from "../components/CrudComponents/CrudForm";
import { move } from "lodash";

// import { ObjectId } from 'mongodb'; // Ensure you have this import if you are using ObjectId

export default function Crud({ data }) {
    // State and environment setup
    const [showFullText, setShowFullText] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [editableRows, setEditableRows] = useState({}); // Manage editable status of rows
    const [formData, setFormData] = useState({
        College: "",
        "Program Type": "",
        "Program Name": "",
        Category: "",
        Region: "",
        Hyperlink: "",
    });
    const [formErrors, setFormErrors] = useState({
        College: false,
        "Program Type": false,
        "Program Name": false,
        Category: false,
        Region: false,
        Hyperlink: false,
    });

    // useEffect to sort data
    useEffect(() => {
        if (data) {
            const sortedData = [...data].sort((a, b) => {
                const valueA = a["College"];
                const valueB = b["College"];
                return valueA.localeCompare(valueB);
            });
            setTableData(sortedData);
        }
    }, [data]);

    // Loading and empty data handling
    if (data === null) {
        return <p>Loading...</p>;
    }

    if (data.length === 0) {
        return <p>No data available.</p>;
    }

    // Form and table actions
    const clearForm = () => {
        setFormData({
            College: "",
            "Program Type": "",
            "Program Name": "",
            Category: "",
            Region: "",
            Hyperlink: "",
        });
        setFormErrors({
            College: false,
            "Program Type": false,
            "Program Name": false,
            Category: false,
            Region: false,
            Hyperlink: false,
        });
    };

    const handleCreate = () => {
        setShowCreate(!showCreate);
        setShowDelete(false);
        clearForm();
        setHasSubmitted(false);
    };

    const handleDeleteToggle = () => {
        setShowDelete(!showDelete);
        setShowCreate(false);
    };

    const setData = (newData) => {
        setTableData(newData);
    };

    const handleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    // Handler to make a row editable
    const handleEditClick = (rowId) => {
        setEditableRows(prevEditableRows => ({
            ...prevEditableRows,
            [rowId]: true
        }));
    };
    const handleSaveClick = async (rowId) => {
        try {
            // Get the current data for the row that's being edited
            const currentRowData = tableData.find(row => row._id === rowId);
            if (!currentRowData) {
                throw new Error("Row data not found");
            }

            // Assume you have a function to get the updated values from the form or editable fields
            const updatedValues = getUpdatedValuesForRow(rowId);

            // Create a new row object with updated values
            const updatedRow = { ...currentRowData, ...updatedValues };

            // Send the updated row data to the server
            await axios.put(`http://localhost:8000/api/data/${rowId}`, updatedRow);
            console.log("Data updated successfully!");

            // Update the local state with the new data
            const newData = tableData.map(row => row._id === rowId ? updatedRow : row);
            setTableData(newData);

            // Set the success message and reset the form
            setSuccessMessage("Row updated successfully!");
            setTimeout(() => setSuccessMessage(""), 5000); // Clear the success message after 5 seconds

            // Remove the row from the editableRows state
            setEditableRows(prevEditableRows => ({
                ...prevEditableRows,
                [rowId]: false
            }));
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    // Handler to save changes and make the row non-editable
    // const handleSaveClick = async (rowId) => {
    //     // Your save logic here
    //     try {
    //         // Get the row element and its cells
    //         const tableDataRow = document.getElementById(`row-${rowId.id}`);
    //         const tableDataCells = tableDataRow.querySelectorAll("td.pt-3-half");
    //         tableDataCells.forEach((element) => {
    //             element.removeAttribute("contenteditable");
    //         });
    //         // Create a copy of the row object
    //         const updatedRow = { ...rowId };

    //         // Update the values of the row object with the edited cell contents
    //         tableDataCells.forEach((tableDataCell, columnIndex) => {
    //             const columnName = Object.keys(updatedRow)[columnIndex - 1]; // Subtract 1 to exclude the 'Action' column

    //             if (columnName) {
    //                 updatedRow[columnName] = tableDataCell.textContent.trim();
    //             }
    //         });

    //         console.log(updatedRow);

    //         // Send the updated row data to the server
    //         await axios.put(`http://localhost:8000/api/data/${rowId.id}`, updatedRow);
    //         console.log("Data updated successfully!");

    //         // Reset editing state and retrieve the updated data from the server
    //         setEditingRowId(null);
    //         setEditMode((prevEditMode) => ({
    //             ...prevEditMode,
    //             [rowId.id]: false,
    //         }));
    //         const response = await axios.get("http://localhost:8000/api/data");
    //         const newData = response.data;

    //         // Move the updated row to the top of the table
    //         const updatedTableData = move(
    //             [...newData],
    //             newData.findIndex((data) => data.id === rowId.id),
    //             0
    //         );

    //         setData(updatedTableData);
    //     } catch (error) {
    //         console.error("Error updating data:", error);
    //     }
    //     // After updating server:
    //     setEditableRows(prevEditableRows => ({
    //         ...prevEditableRows,
    //         [rowId]: false
    //     }));
    // };
    return (
        <div className="container">
            {/* ... Your component JSX */}
            <table>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row._id}>
                            {Object.keys(row)
                                .filter(key => key !== '_id') // Filter out the '_id' key
                                .map(key => (
                                    <td
                                        key={key}
                                        contentEditable={editableRows[row._id] || false}
                                    >
                                        {row[key]}
                                    </td>
                                ))}
                            <td>
                                {/* Edit button - onClick, set the row to be editable */}
                                <button onClick={() => handleEditClick(row._id)}>Edit</button>

                                {/* Save button - onClick, handle saving and remove editable status */}
                                <button onClick={() => handleSaveClick(row._id)}>Save</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* ... Rest of your component JSX */}
        </div>
    );
}