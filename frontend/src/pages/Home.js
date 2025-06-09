import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css";
import axios from 'axios';
import defaultUserImage from '../assets/default_user.png';

function Home() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [imageErrors, setImageErrors] = useState({});

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/extensions');
            setTableData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    // Fetch data and start polling
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Navigate to modify page
    const handleEdit = (rowData) => {
        navigate('/modify', { state: { data: rowData } });
    };

    // Delete row and refresh data
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/extensions/${id}`);
            fetchData();
            alert('Extension deleted successfully');
        } catch (error) {
            console.error('Error deleting extension:', error);
            alert('Failed to delete extension');
        }
    };

    // Handle image error
    const handleImageError = (id) => {
        setImageErrors(prev => ({
            ...prev,
            [id]: true
        }));
    };

    return (
        <>
            <button
                className="add-extension"
                onClick={() => navigate('/extension')}
            >
                ADD EXTENSION
            </button>
            <div className="content">
                <h1>EXTENSIONS</h1>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Username</th>
                                <th>Extension</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item) => (
                                <tr key={item._id}>
                                    <td className="profile-cell">
                                        <img 
                                            src={!imageErrors[item._id] && item.profilePicture 
                                                ? `http://localhost:5000${item.profilePicture}?t=${Date.now()}` 
                                                : defaultUserImage} 
                                            alt={item.username}
                                            className="profile-image"
                                            onError={() => handleImageError(item._id)}
                                            loading="lazy"
                                        />
                                    </td>
                                    <td>{item.username}</td>
                                    <td>{item.extension}</td>
                                    <td>{item.mobile || 'N/A'}</td>
                                    <td><a href={`mailto:${item.email}`}>{item.email || 'N/A'}</a></td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleEdit(item)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tableData.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Home;
