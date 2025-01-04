import React, { useState, useEffect } from 'react';
import { getUsersList } from '../utils/api'; // Importing the API call
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2'; // Importing the Bar chart component from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'; // Import Chart.js components
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Report = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsersList(token, currentPage, limit);
        setUsers(response.users);
        setTotalUsers(response.total);
      } catch (error) {
        console.error('Error fetching users for report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit, token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  // Chart.js Data
  const chartData = {
    labels: users.map((user) => user.name), // Use user names as labels
    datasets: [
      {
        label: 'Users Count per Page', // Example label
        data: users.map((user) => Math.floor(Math.random() * 100)), // Placeholder random data
        backgroundColor: '#007bff', // Bootstrap primary color
        borderColor: '#0056b3',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Report</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Chart Section */}
          <div className="row mb-4 d-flex justify-content-center align-items-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">User Statistics (Bar Chart)</h5>
                </div>
                <div className="card-body">
                  <Bar data={chartData} />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Users List</h5>
                </div>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.status || 'Active'}</td> {/* Example of user status */}
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
                <ul className="pagination">
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

export default Report;
