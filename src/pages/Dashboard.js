import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, isManager } = useAuth();

  return (
    <div>
      <h2>Welcome, {currentUser?.fullName}!</h2>
      <p className="lead mb-4">
        {isManager 
          ? "Manage leave requests from your team members." 
          : "Manage your leave requests and apply for new leave."}
      </p>

      <div className="row g-4 py-3">
        {/* Card to request new leave */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 border-primary">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Request Leave</h5>
              <p className="card-text flex-grow-1">
                Submit a new leave request for approval.
              </p>
              <Link to="/leave/new" className="btn btn-primary mt-2">
                Request Leave
              </Link>
            </div>
          </div>
        </div>

        {/* Card to view my leave requests */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 border-info">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">My Leave Requests</h5>
              <p className="card-text flex-grow-1">
                View all your leave requests and their status.
              </p>
              <Link to="/leave/my-requests" className="btn btn-info mt-2 text-white">
                View My Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Manager-only card */}
        {isManager && (
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-success">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Manage Requests</h5>
                <p className="card-text flex-grow-1">
                  Review and manage leave requests from employees.
                </p>
                <Link to="/leave/all" className="btn btn-success mt-2">
                  Manage Requests
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 