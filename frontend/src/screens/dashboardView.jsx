import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/dashboard.css";

const DashboardView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [history, userInfo]);

  const fetchDashboardData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/dashboard/stats", config);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of hostel operations</p>
      </div>

      <div className="stats-grid">
        {/* Student Stats */}
        <div className="stat-card stat-card-students">
          <div className="stat-icon-modern">
            <div className="icon-bg students-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Total Students</div>
            <div className="stat-value">{stats?.students?.total || 0}</div>
            <div className="stat-breakdown">
              <span className="stat-badge success">
                Present: {stats?.students?.present || 0}
              </span>
              <span className="stat-badge warning">
                Absent: {stats?.students?.absent || 0}
              </span>
              <span className="stat-badge info">
                On Leave: {stats?.students?.onLeave || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Room Stats */}
        <div className="stat-card stat-card-rooms">
          <div className="stat-icon-modern">
            <div className="icon-bg rooms-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Rooms</div>
            <div className="stat-value">{stats?.rooms?.total || 0}</div>
            <div className="stat-breakdown">
              <span className="stat-badge success">
                Available: {stats?.rooms?.available || 0}
              </span>
              <span className="stat-badge warning">
                Full: {stats?.rooms?.full || 0}
              </span>
              <span className="stat-badge danger">
                Maintenance: {stats?.rooms?.maintenance || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Stats */}
        <div className="stat-card stat-card-fees">
          <div className="stat-icon-modern">
            <div className="icon-bg fees-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Fees Collected</div>
            <div className="stat-value">
              ₹{stats?.fees?.collected?.toLocaleString() || 0}
            </div>
            <div className="stat-breakdown">
              <span className="stat-badge warning">
                Pending: ₹{stats?.fees?.pending?.toLocaleString() || 0}
              </span>
              <span className="stat-badge danger">
                Overdue: {stats?.fees?.overdue || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Complaint Stats */}
        <div className="stat-card stat-card-complaints">
          <div className="stat-icon-modern">
            <div className="icon-bg complaints-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Complaints</div>
            <div className="stat-value">{stats?.complaints?.total || 0}</div>
            <div className="stat-breakdown">
              <span className="stat-badge danger">
                Open: {stats?.complaints?.open || 0}
              </span>
              <span className="stat-badge warning">
                In Progress: {stats?.complaints?.inProgress || 0}
              </span>
              <span className="stat-badge success">
                Resolved: {stats?.complaints?.resolved || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Visitor Stats */}
        <div className="stat-card stat-card-visitors">
          <div className="stat-icon-modern">
            <div className="icon-bg visitors-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Visitors</div>
            <div className="stat-value">{stats?.visitors?.active || 0}</div>
            <div className="stat-breakdown">
              <span className="stat-badge info">
                Active Now: {stats?.visitors?.active || 0}
              </span>
              <span className="stat-badge">
                Today: {stats?.visitors?.today || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Leave Stats */}
        <div className="stat-card stat-card-leaves">
          <div className="stat-icon-modern">
            <div className="icon-bg leaves-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          <div className="stat-details">
            <div className="stat-title">Leave Requests</div>
            <div className="stat-value">{stats?.leaves?.pending || 0}</div>
            <div className="stat-breakdown">
              <span className="stat-badge warning">
                Pending: {stats?.leaves?.pending || 0}
              </span>
              <span className="stat-badge success">
                On Leave: {stats?.leaves?.activeLeaves || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn btn-students"
            onClick={() => history.push("/")}
          >
            Manage Students
          </button>
          <button
            className="action-btn btn-rooms"
            onClick={() => history.push("/rooms")}
          >
            Room Management
          </button>
          <button
            className="action-btn btn-fees"
            onClick={() => history.push("/fees")}
          >
            Fee Management
          </button>
          <button
            className="action-btn btn-complaints"
            onClick={() => history.push("/complaints")}
          >
            View Complaints
          </button>
          <button
            className="action-btn btn-visitors"
            onClick={() => history.push("/visitors")}
          >
            Visitor Management
          </button>
          <button
            className="action-btn btn-leaves"
            onClick={() => history.push("/leaves")}
          >
            Leave Requests
          </button>
          <button
            className="action-btn btn-notices"
            onClick={() => history.push("/notices")}
          >
            Notice Board
          </button>
          <button
            className="action-btn btn-attendance"
            onClick={() => history.push("/attendance")}
          >
            Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
