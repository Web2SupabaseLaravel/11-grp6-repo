import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditUserModal] = useState(false); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  const API_BASE_URL = 'http://localhost:8000/api';


  const roles = [
    { value: 'admin', label: 'Admin', color: '#6f42c1' }, 
    { value: 'moderator', label: 'Moderator', color: '#fd7e14' }, 
    { value: 'user', label: 'User', color: '#20c997' } 
  ];

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true); 
    setError(''); 
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.data || response.data);
      setFilteredUsers(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => (user.role || 'user') === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]); 

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { role: newRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setSuccess('User role updated successfully!');
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError('Failed to update user role. Please try again.');
      console.error('Error updating role:', err);
      setTimeout(() => setError(''), 3000); 
    }
  };

  const handleStatusToggle = async (userId) => {
    const user = users.find(u => u.id === userId);
    const newStatus = (user.status || 'active') === 'active' ? 'inactive' : 'active';
    
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { status: newStatus });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setSuccess('User status updated successfully!');
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating status:', err);
      setTimeout(() => setError(''), 3000); 
    }
  };

  const openDeleteConfirmModal = (userId) => {
    setUserToDeleteId(userId); 
    setShowConfirmModal(true); 
  };

  const confirmDeleteUser = async () => {
    if (!userToDeleteId) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${userToDeleteId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDeleteId));
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
      setTimeout(() => setError(''), 3000); 
    } finally {
      setShowConfirmModal(false); 
      setUserToDeleteId(null); 
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Please fill in all required fields.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, newUser);
      const addedUser = response.data.user || response.data;
      setUsers(prevUsers => [...prevUsers, addedUser]);
      setNewUser({ name: '', email: '', role: 'user', password: '' });
      setShowAddModal(false); 
      setSuccess('User added successfully!');
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError('Failed to add user. Please check the information and try again.');
      console.error('Error adding user:', err);
      setTimeout(() => setError(''), 3000); 
    }
  };

  const handleEditUser = async () => {
    if (!currentUser.name || !currentUser.email) {
      setError('Please fill in all required fields.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === currentUser.id ? currentUser : user
        )
      );
      setShowEditUserModal(false); 
      setCurrentUser(null); 
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
      setTimeout(() => setError(''), 3000); 
    }
  };

  const openEditModal = (user) => {
    setCurrentUser({ ...user }); 
    setShowEditUserModal(true); 
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : '#6c757d'; 
  };

  const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US');
    } catch (e) {
        console.error("Invalid date string:", dateString, e);
        return 'N/A'; 
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Bootstrap CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        xintegrity="sha384-rqS2i0W3S2A8F3m9Q1d0r1Q2+G+N2R1a0b5a6c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z" // تم تصحيح integrity
        crossOrigin="anonymous" 
      />
      {/* Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <div className="row">
        <div className="col-12">
          {/* Success/Error Messages */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm" role="alert"> {/* تم استخدام rounded-3 */}
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
            </div>
          )}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm" role="alert"> {/* تم استخدام rounded-3 */}
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
            </div>
          )}

          {/* Header */}
          <div className="card shadow-sm mb-4" style={{ border: 'none', borderRadius: '15px' }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
                  <h2 className="mb-0" style={{ color: '#6f42c1', fontWeight: 'bold' }}>
                    <i className="fas fa-users me-2"></i>
                    User Management
                  </h2>
                  <p className="text-muted mb-0">Manage users and assign roles</p>
                </div>
                <div className="col-lg-6 col-md-12 text-lg-end text-center">
                  <button
                    className="btn fw-bold py-3 px-6 rounded-pill shadow-lg w-100 w-lg-auto" 
                    style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1', color: 'white' }}
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    <span className="d-none d-sm-inline">Add New User</span>
                    <span className="d-inline d-sm-none">Add User</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card shadow-sm mb-4" style={{ border: 'none', borderRadius: '15px' }}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <label htmlFor="search" className="form-label">Search</label>
                    <input
                      type="text"
                      id="search"
                      className="form-control rounded-3 shadow-sm" 
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <label htmlFor="roleFilter" className="form-label">Filter by Role</label>
                    <select
                      id="roleFilter"
                      className="form-select rounded-3 shadow-sm" 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card shadow-sm" style={{ border: 'none', borderRadius: '15px' }}>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" style={{ color: '#6f42c1' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading users...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="d-none d-lg-table-cell">User</th>
                        <th className="d-table-cell d-lg-none">User Info</th>
                        <th className="d-none d-md-table-cell">Email</th>
                        <th>Role</th>
                        <th className="d-none d-sm-table-cell">Status</th>
                        <th className="d-none d-xl-table-cell">Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          {/* Desktop User Column */}
                          <td className="d-none d-lg-table-cell">
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: getRoleColor(user.role || 'user'),
                                  color: 'white',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="fw-bold">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Mobile User Info Column */}
                          <td className="d-table-cell d-lg-none">
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                style={{
                                  width: '35px',
                                  height: '35px',
                                  backgroundColor: getRoleColor(user.role || 'user'),
                                  color: 'white',
                                  fontSize: '14px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="fw-bold" style={{ fontSize: '14px' }}>{user.name}</div>
                                <div className="text-muted small d-md-none">{user.email}</div>
                                <div className="d-sm-none">
                                  <span
                                    className={`badge rounded-pill ${
                                      (user.status || 'active') === 'active' ? 'bg-success' : 'bg-secondary'
                                    }`}
                                    style={{ fontSize: '10px' }}
                                  >
                                    {(user.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="d-none d-md-table-cell">{user.email}</td>
                          <td>
                            <select
                              className="form-select form-select-sm rounded-pill"
                              value={user.role || 'user'}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              style={{
                                backgroundColor: getRoleColor(user.role || 'user'),
                                color: 'white',
                                border: 'none',
                                fontSize: '12px',
                                maxWidth: '120px'
                              }}
                            >
                              {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <span
                              className={`badge rounded-pill ${
                                (user.status || 'active') === 'active' ? 'bg-success' : 'bg-secondary'
                              }`}
                            >
                              {(user.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="d-none d-xl-table-cell">{formatDate(user.created_at || new Date())}</td>
                          <td>
                            {/* Mobile Action Buttons (vertical) */}
                            <div className="btn-group-vertical btn-group-sm d-block d-sm-none" role="group">
                              <button
                                className="btn btn-sm mb-1 rounded-pill"
                                style={{ backgroundColor: '#4a90e2', borderColor: '#4a90e2', color: 'white' }}
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className={`btn btn-sm mb-1 rounded-pill ${
                                  (user.status || 'active') === 'active' ? 'btn-warning' : 'btn-success'
                                }`}
                                style={{ 
                                  backgroundColor: (user.status || 'active') === 'active' ? '#fd7e14' : '#20c997', 
                                  borderColor: (user.status || 'active') === 'active' ? '#fd7e14' : '#20c997',
                                  color: 'white'
                                }}
                                onClick={() => handleStatusToggle(user.id)}
                                title={(user.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                <i className={`fas ${(user.status || 'active') === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger rounded-pill"
                                style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => openDeleteConfirmModal(user.id)}
                                title="Delete User"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            
                            {/* Desktop Action Buttons (horizontal) */}
                            <div className="btn-group d-none d-sm-block" role="group">
                              <button
                                className="btn btn-sm rounded-pill me-1"
                                style={{ backgroundColor: '#4a90e2', borderColor: '#4a90e2', color: 'white' }}
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className={`btn btn-sm rounded-pill me-1 ${
                                  (user.status || 'active') === 'active' ? 'btn-warning' : 'btn-success'
                                }`}
                                style={{ 
                                  backgroundColor: (user.status || 'active') === 'active' ? '#fd7e14' : '#20c997', 
                                  borderColor: (user.status || 'active') === 'active' ? '#fd7e14' : '#20c997',
                                  color: 'white'
                                }}
                                onClick={() => handleStatusToggle(user.id)}
                                title={(user.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                <i className={`fas ${(user.status || 'active') === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger rounded-pill"
                                style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => openDeleteConfirmModal(user.id)}
                                title="Delete User"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && !loading && (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            <i className="fas fa-users fa-3x text-secondary mb-3"></i>
                            <p>No users found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-3 shadow-lg" style={{ border: 'none' }}> 
              <div className="modal-header text-white" style={{ backgroundColor: '#6f42c1', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                <h5 className="modal-title">Add New User</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="newName" className="form-label">Name *</label>
                    <input
                      type="text"
                      id="newName"
                      className="form-control rounded-3 shadow-sm" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="newEmail" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="newEmail"
                      className="form-control rounded-3 shadow-sm" // تم استخدام rounded-3
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="newPassword" className="form-label">Password *</label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control rounded-3 shadow-sm" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="newRole" className="form-label">Role</label>
                    <select
                      id="newRole"
                      className="form-select rounded-3 shadow-sm" 
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-column flex-sm-row">
                <button
                  type="button"
                  className="btn btn-secondary w-100 w-sm-auto order-2 order-sm-1 mt-2 mt-sm-0 rounded-pill"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn fw-bold w-100 w-sm-auto order-1 order-sm-2 rounded-pill"
                  style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1', color: 'white' }}
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-3 shadow-lg" style={{ border: 'none' }}> 
              <div className="modal-header text-white" style={{ backgroundColor: '#6f42c1', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditUserModal(false)} 
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="editName" className="form-label">Name *</label>
                    <input
                      type="text"
                      id="editName"
                      className="form-control rounded-3 shadow-sm"
                      value={currentUser.name}
                      onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label htmlFor="editEmail" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="editEmail"
                      className="form-control rounded-3 shadow-sm" 
                      value={currentUser.email}
                      onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="editRole" className="form-label">Role</label>
                    <select
                      id="editRole"
                      className="form-select rounded-3 shadow-sm" 
                      value={currentUser.role || 'user'}
                      onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-column flex-sm-row">
                <button
                  type="button"
                  className="btn btn-secondary w-100 w-sm-auto order-2 order-sm-1 mt-2 mt-sm-0 rounded-pill"
                  onClick={() => setShowEditUserModal(false)} 
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn fw-bold w-100 w-sm-auto order-1 order-sm-2 rounded-pill"
                  style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1', color: 'white' }}
                  onClick={handleEditUser}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showConfirmModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-3 shadow-lg" style={{ border: 'none' }}> 
              <div className="modal-header text-white" style={{ backgroundColor: '#dc3545', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="text-gray-700">Are you sure you want to delete this user?</p>
                <p className="text-danger fw-bold">This action cannot be undone.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill me-2"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill"
                  onClick={confirmDeleteUser}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;