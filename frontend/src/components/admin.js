import React, { useEffect, useState } from 'react'; // Import necessary hooks from React
import { useNavigate } from 'react-router-dom';
import DynamicTable from './dynamicTable';
import apiRequest from '../utility/apiRequest';

const Admin = (props) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { users } = await apiRequest('getAllUsers', 'GET')
                setData(users);

                let temp = []
                for (let key of Object.keys(users[0])) {
                    temp.push({ header: key, accessor: key })
                }
                setColumns(temp)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleEdit = async (updatedRow) => {
        console.log('handleEdit', updatedRow)
        try {
            const response = await apiRequest('/updateUser', 'PUT', updatedRow);
            // Update state with the updated row
            const updatedData = data.map(row => (row.ID === updatedRow.ID ? updatedRow : row));
            setData(updatedData);
            console.log('User updated successfully:', response);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleAdd = async (newRow) => {
        console.log('handleAdd', newRow)
        try {
            const response = await apiRequest('/createUser', 'POST', newRow);
            // Update state with the new row added
            console.log(response, 'r,')
            setData([...data, response.user]);
            console.log('User added successfully:', response);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDelete = async (rowID) => {
        console.log('handleDelete', rowID)
        try {
            const response = await apiRequest(`/deleteUser`, 'DELETE', { ID: rowID });
            // Update state by removing the deleted row
            const updatedData = data.filter(row => row.ID !== rowID);
            setData(updatedData);
            console.log('User deleted successfully:', response);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="mainContainer">
            <div className={'titleContainer'}>
                <div>Admin</div>
            </div>
            <div>This is the admin page used to manage participants.</div>
            {/* Pass the columns and data as props to the DynamicTable component */}
            <DynamicTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
        </div>
    );
};

export default Admin;