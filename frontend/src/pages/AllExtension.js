import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/AllExtension.css";

const AllExtensions = () => {
    const [extensions, setExtensions] = useState([]);

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

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value).then(() => {
            alert('Copied to clipboard!');
        }).catch((err) => {
            console.error('Error copying to clipboard:', err);
        });
    };

    return (
        <div className="container">
            <h1 className="mb-3">📒 ALL EXTENSIONS</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Extension</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {extensions.map((extension) => (
                        <tr key={extension._id}>
                            <td>
                                <Link to={`/extension/${extension._id}`} className="text-decoration-none">
                                    {extension.username}
                                </Link>
                            </td>
                            <td>
                                {extension.extension}
                                <button
                                    className="btn btn-light btn-sm ms-2"
                                    onClick={() => handleCopy(extension.extension)}
                                    title="Copy Extension"
                                >
                                    📋
                                </button>
                            </td>
                            <td>{extension.mobile}</td>
                            <td>{extension.email}</td>
                            <td>
                                {extension.password}
                                <button
                                    className="btn btn-light btn-sm ms-2"
                                    onClick={() => handleCopy(extension.password)}
                                    title="Copy Password"
                                >
                                    📋
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllExtensions;
