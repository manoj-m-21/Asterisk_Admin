import React, { useState } from 'react';
import "../styles/SystemSettings.css";

function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: "My Company PBX",
    adminEmail: "admin@example.com",
    timezone: "UTC",
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Settings:", settings);
    alert("Settings updated successfully!");
  };

  return (
    <div className="system-settings-container">
      <h1 className="ss-title">⚙️ SYSTEM SETTINGS</h1>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>System Name</label>
          <input
            type="text"
            name="systemName"
            value={settings.systemName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Administrator Email</label>
          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Timezone</label>
          <select
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="form-control"
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
            Enable Maintenance Mode
          </label>
        </div>

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default SystemSettings;
