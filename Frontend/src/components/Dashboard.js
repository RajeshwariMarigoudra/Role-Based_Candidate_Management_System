import React, { useState, useEffect } from 'react';
import { getUsersList, createUser, deleteUser } from '../utils/api';  // Using the API functions
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', mobile: '' });  // Added mobile field
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersList(token, currentPage, limit);
      setRegisteredUsers(response);
      setTotalUsers(response.length);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit, token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = totalUsers ? Math.ceil(totalUsers / limit) : 0;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser.username, newUser.email, newUser.password, newUser.mobile);  // Include mobile in API call
      alert('User created successfully!');
      setNewUser({ username: '', email: '', password: '', mobile: '' });
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(token, userId);
      alert('User deleted successfully!');
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const filteredRegisteredUsers = registeredUsers.filter(user => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.mobile.toLowerCase().includes(searchTerm.toLowerCase());  // Include mobile in search
  });

  const sortTable = (key) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...filteredRegisteredUsers].sort((a, b) => {
      if (key === 'username' || key === 'email' || key === 'mobile') {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });

    setRegisteredUsers(sortedData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Admin Dashboard</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Create User Form */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title">Create User</h5>
                </div>
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Mobile Number"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  />
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button className="btn btn-success" onClick={handleCreateUser}>Create User</button>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Users Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title">Registered Users</h5>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by username, email, or mobile number..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="card-body">
                  <table className="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">
                          <button className="btn btn-link" onClick={() => sortTable('username')}>
                            Username {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">
                          <button className="btn btn-link" onClick={() => sortTable('email')}>
                            Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">
                          <button className="btn btn-link" onClick={() => sortTable('mobile')}>
                            Mobile {sortConfig.key === 'mobile' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                          </button>
                        </th>
                        <th scope="col">Profile Image</th>
                        <th scope="col">Password</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegisteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.mobile}</td> {/* Show mobile number */}
                          <td>
                            {user.profileImage ? (
                              <img src={user.profileImage} alt="Profile" className="rounded-circle" style={{ width: 50, height: 50 }} />
                            ) : (
                              'No Profile Image'
                            )}
                          </td>
                          <td>
                            {showPassword ? user.password : 'Encrypted'}
                            <button onClick={togglePasswordVisibility} className="btn btn-sm btn-info ml-2">
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Section */}
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
