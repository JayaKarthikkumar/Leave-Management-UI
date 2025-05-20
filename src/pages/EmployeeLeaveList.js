import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveService } from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const LeaveStatusBadge = ({ status }) => {
  const badgeClass = {
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
  };

  return (
    <span className={`badge ${badgeClass[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EmployeeLeaveList = () => {
  const { currentUser } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample data for built-in manager
  const managerSampleRequests = [
    {
      id: 5,
      userId: 999,
      startDate: '2023-12-24',
      endDate: '2023-12-31',
      reason: 'End of year vacation',
      status: 'approved',
      managerComment: 'Have a good holiday!',
      createdAt: '2023-11-15T00:00:00Z',
      updatedAt: '2023-11-16T00:00:00Z'
    },
    {
      id: 6,
      userId: 999,
      startDate: '2023-07-01',
      endDate: '2023-07-10',
      reason: 'Summer vacation',
      status: 'approved',
      managerComment: null,
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2023-06-02T00:00:00Z'
    },
    {
      id: 7,
      userId: 999,
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      reason: 'Personal leave',
      status: 'pending',
      managerComment: null,
      createdAt: '2023-12-20T00:00:00Z',
      updatedAt: '2023-12-20T00:00:00Z'
    }
  ];

  // Sample data for built-in employee
  const employeeSampleRequests = [
    {
      id: 10,
      userId: 998,
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      reason: 'Family vacation',
      status: 'pending',
      managerComment: null,
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    }
  ];

  // Check for new employee requests in localStorage
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        // Check if this is the built-in manager
        if (currentUser && currentUser.id === 999) {
          // Use sample data for built-in manager
          setLeaveRequests(managerSampleRequests);
          setLoading(false);
          return;
        }
        
        // Check if this is the built-in employee
        if (currentUser && currentUser.id === 998) {
          // Get any stored employee requests
          const storedRequests = JSON.parse(localStorage.getItem('employee-leave-requests') || '[]');
          
          // Combine with sample requests
          const combinedRequests = [...employeeSampleRequests, ...storedRequests];
          setLeaveRequests(combinedRequests);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const response = await leaveService.getUserLeaveRequests();
        setLeaveRequests(response.data);
      } catch (err) {
        setError('Failed to fetch leave requests. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (leaveRequests.length === 0) {
    return (
      <div className="card shadow">
        <div className="card-body text-center py-5">
          <h5 className="mb-3">You don't have any leave requests yet.</h5>
          <Link to="/leave/new" className="btn btn-primary">
            Request Leave
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Leave Requests</h3>
        <Link to="/leave/new" className="btn btn-primary">
          New Request
        </Link>
      </div>

      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Manager Comment</th>
                <th>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave) => (
                <tr key={leave.id}>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <LeaveStatusBadge status={leave.status} />
                  </td>
                  <td>{leave.managerComment || '-'}</td>
                  <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveList; 