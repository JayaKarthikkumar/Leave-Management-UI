import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const ManagerLeaveList = () => {
  const { currentUser } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState('');

  // Sample data for built-in manager
  const sampleLeaveRequests = [
    {
      id: 1,
      userId: 2,
      fullName: 'John Doe',
      startDate: '2023-10-15',
      endDate: '2023-10-20',
      reason: 'Family vacation',
      status: 'pending',
      managerComment: null,
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2023-10-01T00:00:00Z'
    },
    {
      id: 2,
      userId: 3,
      fullName: 'Jane Smith',
      startDate: '2023-11-05',
      endDate: '2023-11-07',
      reason: 'Medical appointment',
      status: 'pending',
      managerComment: null,
      createdAt: '2023-10-20T00:00:00Z',
      updatedAt: '2023-10-20T00:00:00Z'
    },
    {
      id: 3,
      userId: 4,
      fullName: 'Alice Johnson',
      startDate: '2023-09-10',
      endDate: '2023-09-15',
      reason: 'Personal leave',
      status: 'approved',
      managerComment: 'Approved as requested',
      createdAt: '2023-08-25T00:00:00Z',
      updatedAt: '2023-08-28T00:00:00Z'
    },
    {
      id: 4,
      userId: 5,
      fullName: 'Bob Brown',
      startDate: '2023-08-01',
      endDate: '2023-08-05',
      reason: 'Family emergency',
      status: 'rejected',
      managerComment: 'Insufficient staffing during this period',
      createdAt: '2023-07-20T00:00:00Z',
      updatedAt: '2023-07-22T00:00:00Z'
    }
  ];

  // Fetch all leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        // Check if this is the built-in manager
        if (currentUser && currentUser.id === 999) {
          // Get employee leave requests from localStorage
          const employeeRequests = JSON.parse(localStorage.getItem('employee-leave-requests') || '[]');
          
          // Combine with sample data
          const allRequests = [...sampleLeaveRequests, ...employeeRequests];
          
          setLeaveRequests(allRequests);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const response = await leaveService.getAllLeaveRequests();
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

  // Handle status update
  const handleStatusUpdate = async (status) => {
    if (!selectedRequest) return;

    setActionLoading(true);

    try {
      // Check if this is the built-in manager
      if (currentUser && currentUser.id === 999) {
        // Check if this is an employee request
        if (selectedRequest.userId === 998) {
          // Get existing employee requests
          const employeeRequests = JSON.parse(localStorage.getItem('employee-leave-requests') || '[]');
          
          // Update the specific request
          const updatedEmployeeRequests = employeeRequests.map(req => 
            req.id === selectedRequest.id 
              ? { ...req, status, managerComment: comment, updatedAt: new Date().toISOString() } 
              : req
          );
          
          // Save back to localStorage
          localStorage.setItem('employee-leave-requests', JSON.stringify(updatedEmployeeRequests));
        }
        
        // Update local state regardless of request source
        setTimeout(() => {
          setLeaveRequests(leaveRequests.map(req => 
            req.id === selectedRequest.id 
              ? { ...req, status, managerComment: comment, updatedAt: new Date().toISOString() } 
              : req
          ));
          
          // Reset selected request and comment
          setSelectedRequest(null);
          setComment('');
          setActionLoading(false);
        }, 500); // Simulate API delay
        return;
      }
      
      // Normal API call
      await leaveService.updateLeaveRequestStatus(selectedRequest.id, {
        status,
        managerComment: comment,
      });

      // Update the local state
      setLeaveRequests(leaveRequests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status, managerComment: comment } 
          : req
      ));

      // Reset selected request and comment
      setSelectedRequest(null);
      setComment('');
      
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

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
          <h5>No leave requests found.</h5>
        </div>
      </div>
    );
  }

  // Filter pending requests
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const otherRequests = leaveRequests.filter(req => req.status !== 'pending');

  return (
    <div>
      <h3 className="mb-4">Manage Leave Requests</h3>

      {/* Pending Requests Section */}
      <div className="card shadow mb-4">
        <div className="card-header bg-warning text-white">
          <h5 className="mb-0">Pending Requests ({pendingRequests.length})</h5>
        </div>
        <div className="table-responsive">
          {pendingRequests.length === 0 ? (
            <div className="card-body text-center py-3">
              <p className="mb-0">No pending requests.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.fullName}</td>
                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                    <td>{request.reason}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => setSelectedRequest(request)}
                        data-bs-toggle="modal"
                        data-bs-target="#reviewModal"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Previous Requests Section */}
      <div className="card shadow">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Previously Reviewed Requests</h5>
        </div>
        <div className="table-responsive">
          {otherRequests.length === 0 ? (
            <div className="card-body text-center py-3">
              <p className="mb-0">No previously reviewed requests.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comment</th>
                  <th>Requested On</th>
                </tr>
              </thead>
              <tbody>
                {otherRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.fullName}</td>
                    <td>
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td>{request.reason}</td>
                    <td>
                      <span className={`badge ${request.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td>{request.managerComment || '-'}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <div className="modal fade" id="reviewModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Review Leave Request</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedRequest && (
                <>
                  <div className="mb-3">
                    <p><strong>Employee:</strong> {selectedRequest.fullName}</p>
                    <p><strong>Dates:</strong> {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment (Optional)</label>
                    <textarea
                      className="form-control"
                      id="comment"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={actionLoading}
                data-bs-dismiss="modal"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={() => handleStatusUpdate('approved')}
                disabled={actionLoading}
                data-bs-dismiss="modal"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLeaveList; 