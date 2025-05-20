import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployeeLeaveForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Check if this is the built-in employee
      if (currentUser && currentUser.id === 998) {
        // Create a new leave request
        const newLeaveRequest = {
          id: Date.now(), // Use timestamp as unique ID
          userId: 998,
          fullName: 'Built-in Employee',
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          status: 'pending',
          managerComment: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Get existing employee requests
        const existingRequests = JSON.parse(localStorage.getItem('employee-leave-requests') || '[]');
        
        // Add new request
        existingRequests.push(newLeaveRequest);
        
        // Save to localStorage
        localStorage.setItem('employee-leave-requests', JSON.stringify(existingRequests));
        
        // Also add to manager's pending requests
        const existingManagerRequests = JSON.parse(localStorage.getItem('manager-pending-requests') || '[]');
        existingManagerRequests.push(newLeaveRequest);
        localStorage.setItem('manager-pending-requests', JSON.stringify(existingManagerRequests));
        
        // Show success message
        setSuccess('Leave request submitted successfully!');
        
        // Clear form
        setFormData({
          startDate: '',
          endDate: '',
          reason: '',
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/leave/my-requests');
        }, 2000);
        
        setLoading(false);
        return;
      }
      
      // Check if this is the built-in manager
      if (currentUser && currentUser.id === 999) {
        // Simulate a successful request without API call
        setTimeout(() => {
          setSuccess('Leave request submitted successfully!');
          
          // Clear form
          setFormData({
            startDate: '',
            endDate: '',
            reason: '',
          });
          
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/leave/my-requests');
          }, 2000);
          
          setLoading(false);
        }, 500);
        return;
      }
      
      // Regular API call
      await leaveService.createLeaveRequest(formData);
      setSuccess('Leave request submitted successfully!');
      
      // Clear form
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/leave/my-requests');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="card-title mb-4">Request Leave</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Disable past dates
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">Reason for Leave</label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  rows="4"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button 
                  type="button" 
                  className="btn btn-secondary me-md-2"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveForm; 