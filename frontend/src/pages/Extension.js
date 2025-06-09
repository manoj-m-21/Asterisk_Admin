import React, { useState, useEffect, useCallback } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import defaultUserImage from '../assets/default_user.png';
import "../styles/Extension.css";

const Extension = () => {
    const [extensions, setExtensions] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        extension: '',
        mobile: '',
        email: '',
        profilePicture: null,
    });

    const [editingId, setEditingId] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch all extensions
    const fetchExtensions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/extensions');
            setExtensions(res.data);
        } catch (error) {
            console.error('Error fetching extensions:', error);
        }
    };

    useEffect(() => {
        fetchExtensions();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePicture: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const validateForm = useCallback(() => {
        const mobilePattern = /^[0-9]{10}$/;
        const extensionPattern = /^[0-9]{1,4}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isMobileValid = !formData.mobile || mobilePattern.test(formData.mobile);
        const isExtensionValid = extensionPattern.test(formData.extension) && 
                               parseInt(formData.extension) >= 0 && 
                               parseInt(formData.extension) <= 9999;
        const isEmailValid = !formData.email || emailPattern.test(formData.email);
        const isUsernameValid = formData.username.trim().length > 0;

        setIsValid(isUsernameValid && isExtensionValid && isMobileValid && isEmailValid);
    }, [formData]);

    useEffect(() => {
        validateForm();
    }, [formData, validateForm]);

    // Add or update extension
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid) {
            alert('Please fill in all required fields correctly');
            return;
        }

        const duplicateExtension = extensions.find(ext => ext.extension === formData.extension);
        if (duplicateExtension && !editingId) {
            alert('Error: Extension already exists!');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('extension', formData.extension);
            formDataToSend.append('mobile', formData.mobile);
            formDataToSend.append('email', formData.email);
            if (formData.profilePicture) {
                formDataToSend.append('profilePicture', formData.profilePicture);
            }

            if (editingId) {
                await axios.put(`http://localhost:5000/api/extensions/${editingId}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Extension updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/extensions', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Extension added successfully!');
            }
            fetchExtensions();
            setFormData({ username: '', extension: '', mobile: '', email: '', profilePicture: null });
            setPreviewImage(null);
            setEditingId(null);
        } catch (error) {
            console.error('Error adding/updating extension:', error);
            alert('Error adding/updating extension: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="extension-container">
            <form onSubmit={handleSubmit} className="form-full-screen">
                <h1 className="mt-4 mb-3">{editingId ? 'UPDATE EXTENSION' : 'ADD NEW EXTENSION'} <FaUser /></h1>
                <div className="form-container">
                    <div className="form-left">
                        <div className="mb-3">
                            <label className="form-label required-asterisk">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username || ''}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label required-asterisk">Extension</label>
                            <input
                                type="text"
                                name="extension"
                                value={formData.extension || ''}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder="Enter extension number (1-4 digits)"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile || ''}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter 10-digit mobile number"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>
                    <div className="form-right">
                        <div className="profile-picture">
                            <img
                                src={previewImage || defaultUserImage}
                                alt="Profile"
                                className="profile-img"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="profile-control"
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={!isValid}>
                    {editingId ? 'Update' : 'Add'} Extension
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({ username: '', extension: '', mobile: '', email: '', profilePicture: null });
                            setPreviewImage(null);
                            setEditingId(null);
                        }}
                        className="btn btn-secondary ms-2"
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default Extension;
