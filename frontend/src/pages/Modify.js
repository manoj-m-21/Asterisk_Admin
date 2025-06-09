import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Modify.css';

function Modify({ onUpdate }) {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.data || {};

    const [formData, setFormData] = useState({
        username: rowData.username || '',
        extension: rowData.extension || '',
        mobile: rowData.mobile || '',
        email: rowData.email || '',
        server_ip: rowData.server_ip || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/extensions/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Extension updated successfully!');
                navigate('/home');
            } else {
                alert('Failed to update extension');
            }
        } catch (error) {
            console.error('Error updating extension:', error);
            alert('Error while updating data');
        }
    };

    return (
        <>
            <Navbar />
            <div className="extension-container">
                <div className="form-box">
                    <h1 className="form-title">MODIFY EXTENSION</h1>
                    <form className="extension-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="extension">Extension Number</label>
                            <input
                                type="text"
                                name="extension"
                                id="extension"
                                value={formData.extension}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile"
                                id="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Modify;
