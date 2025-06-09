import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExtensionDetails = () => {
    const { id } = useParams();
    const [extension, setExtension] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExtension = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/extensions/${id}`);
                setExtension(res.data);
            } catch (error) {
                console.error('Error fetching extension:', error);
                alert('Extension not found!');
                navigate('/');
            }
        };

        fetchExtension();
    }, [id, navigate]);

    if (!extension) return <p>Loading extension details...</p>;

    return (
        <div className="container mt-4">
            <h3>Extension Details</h3>
            <table className="table table-bordered w-50 mt-3">
                <tbody>
                    <tr>
                        <th>username</th>
                        <td>{extension.username}</td>
                    </tr>
                    <tr>
                        <th>Extension</th>
                        <td>{extension.extension}</td>
                    </tr>
                    <tr>
                        <th>Mobile</th>
                        <td>{extension.mobile}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{extension.email}</td>
                    </tr>
                    <tr>
                        <th>Password</th>
                        <td>{extension.password}</td>
                    </tr>
                </tbody>
            </table>
            <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
                ← Back
            </button>
        </div>
    );
};

export default ExtensionDetails;
