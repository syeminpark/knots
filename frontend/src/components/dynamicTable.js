import React, { useState, useEffect } from 'react';

// Dynamic Table Component
function DynamicTable({ columns, data, onEdit, onAdd, onDelete }) {
    const [tableData, setTableData] = useState(data);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, colIndex: null });
    const [editedValues, setEditedValues] = useState({});
    const [originalValues, setOriginalValues] = useState({});
    const [newRowValues, setNewRowValues] = useState({});

    useEffect(() => {
        setTableData(data);
    }, [data]);

    // Function to handle cell click to enter edit mode
    const handleCellClick = (rowIndex, colIndex) => {
        setEditingCell({ rowIndex, colIndex });
        setEditedValues(tableData[rowIndex]);
        setOriginalValues(tableData[rowIndex]); // Store the original values when the cell is clicked
    };

    // Function to handle change in input fields
    const handleInputChange = (e, column) => {
        setEditedValues({
            ...editedValues,
            [column]: e.target.value,
        });
    };

    // Function to save edited cell
    const handleSave = async () => {
        const { rowIndex, colIndex } = editingCell;
        const column = columns[colIndex].accessor;
        const updatedData = [...tableData];
        const originalValue = originalValues[column];
        const newValue = editedValues[column];

        // Only update if the value has changed
        if (newValue !== originalValue) {
            updatedData[rowIndex][column] = newValue;

            // Optimistically update the UI
            setTableData(updatedData);
            setEditingCell({ rowIndex: null, colIndex: null });

            try {
                // Attempt to update the backend
                await onEdit(updatedData[rowIndex]);
            } catch (error) {
                console.error('Failed to save changes:', error);
                // Revert to original state on error
                setTableData(data);
                alert(error);
            }
        } else {
            // If no changes were made, exit edit mode without sending data
            setEditingCell({ rowIndex: null, colIndex: null });
        }
    };

    // Function to handle row deletion
    const handleDelete = async (rowIndex) => {
        const rowToDelete = tableData[rowIndex];
        const originalData = [...tableData];
        const updatedData = tableData.filter((_, index) => index !== rowIndex);

        setTableData(updatedData);

        try {
            await onDelete(rowToDelete.ID);
        } catch (error) {
            console.error('Failed to delete row:', error);
            setTableData(originalData);
            alert(error);
        }
    };

    // Function to handle adding a new row
    const handleAddNewRow = async () => {
        const originalData = [...tableData];
        const updatedData = [...tableData, newRowValues];

        setTableData(updatedData);

        try {
            await onAdd(newRowValues);
        } catch (error) {
            console.error('Failed to add new row:', error);
            setTableData(originalData);
            alert(error);
        }

        setNewRowValues({});
    };

    // Function to handle change in new row input fields
    const handleNewRowChange = (e, column) => {
        setNewRowValues({
            ...newRowValues,
            [column]: e.target.value,
        });
    };

    return (
        <div>
            <h2>Dynamic Table</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            (column.accessor !== 'ID' && column.accessor !== '_id') && (
                                <th key={index}>{column.header}</th>
                            )
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                (column.accessor !== 'ID' && column.accessor !== '_id') && (
                                    <td
                                        key={colIndex}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                    >
                                        {editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex ? (
                                            <input
                                                type="text"
                                                value={editedValues[column.accessor] || ''}
                                                onChange={(e) => handleInputChange(e, column.accessor)}
                                                onBlur={handleSave}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                                autoFocus
                                            />
                                        ) : (
                                            row[column.accessor]
                                        )}
                                    </td>
                                )
                            ))}
                            <td>
                                <button onClick={() => handleDelete(rowIndex)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {/* Row for adding new entries */}
                    <tr>
                        {columns.map((column, index) => (
                            (column.accessor !== 'ID' && column.accessor !== '_id') && (
                                <td key={index}>
                                    <input
                                        type="text"
                                        placeholder={`Enter ${column.header}`}
                                        value={newRowValues[column.accessor] || ''}
                                        onChange={(e) => handleNewRowChange(e, column.accessor)}
                                    />
                                </td>
                            )
                        ))}
                        <td>
                            <button onClick={handleAddNewRow}>Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DynamicTable;