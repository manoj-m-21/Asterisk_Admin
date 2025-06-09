import React, { useState } from 'react';
import "../styles/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "Editor" },
    { id: 3, name: "Charlie", role: "Viewer" },
  ]);

  const [newUser, setNewUser] = useState({ name: '', role: 'Viewer' });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUser.name.trim() !== '') {
      const id = users.length + 1;
      setUsers([...users, { id, ...newUser }]);
      setNewUser({ name: '', role: 'Viewer' });
    }
  };

  return (
    <div className="user-management-container">
      <h1 className="um-title">👨‍💻 USER MANAGEMENT (RBAC)</h1>

      <div className="um-content">
        {/* User List Table */}
        <div className="user-list">
          <h2 className="um-subtitle">Users</h2>
          <table className="um-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Form */}
        <div className="add-user-form">
          <h2 className="um-subtitle">Add New User</h2>
          <form onSubmit={handleAddUser} className="form-card">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter user name"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Add User</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
