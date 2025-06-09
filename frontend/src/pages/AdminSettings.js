import React, { useState } from 'react';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [notifications, setNotifications] = useState(false);
    
    // Handle updating username & password
    const handleUpdateCredentials = () => {
        alert(`Credentials Updated:\nUsername: ${username}\nPassword: ${password}`);
    };

    // Handle API Key Generation
    const handleGenerateApiKey = () => {
        const newKey = `API-${Date.now().toString(36)}`;
        setApiKey(newKey);
        alert('New API Key Generated!');
    };

    return (
        <div className="admin-settings-container">
            <h1>⚙️ADMIN PANEL SETTINGS</h1>

            {/* Update Username & Password */}
            <section className="settings-section">
                <h3>🔐 Change Username & Password</h3>
                <label>Username</label>
                <input
                    className='username-update'
                    type="text"
                    placeholder="New Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    className='password-update'
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <button onClick={handleUpdateCredentials}>Update Credentials</button>
            </section>

            {/* Manage API Keys */}
            <section className="settings-section">
                <h3>🔑 API Key Management</h3>
                <button onClick={handleGenerateApiKey}>Generate API Key</button>
                {apiKey && <p>New API Key: <strong>{apiKey}</strong></p>}
            </section>

            {/* Email Notifications */}
            <section className="settings-section">
                <h3>📧 Email Notifications</h3>
                <label className='email-notifications'>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={() => setNotifications(!notifications)}
                    />
                    Enable Email Alerts
                </label>
            </section>
        </div>
    );
};

export default AdminSettings;
