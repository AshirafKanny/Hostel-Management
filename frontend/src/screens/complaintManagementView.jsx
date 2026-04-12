import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const ComplaintManagementView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      fetchComplaints();
    }
  }, [history, userInfo]);

  const fetchComplaints = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/api/complaints", config);
      setComplaints(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="complaint-management">
      <div className="page-header">
        <h1>Complaint Management</h1>
        <button className="btn btn-primary" onClick={() => history.push("/complaints/add")}>
          + Submit New Complaint
        </button>
      </div>

      <div className="complaints-list">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="card complaint-card">
            <div className="complaint-header">
              <div>
                <h3>{complaint.title}</h3>
                <p className="text-muted">{complaint.studentName} - Room {complaint.roomNo}</p>
              </div>
              <div className="complaint-badges">
                <span className={`badge ${complaint.status === "Resolved" ? "badge-success" : complaint.status === "Open" ? "badge-danger" : "badge-warning"}`}>
                  {complaint.status}
                </span>
                <span className={`badge ${complaint.priority === "Urgent" ? "badge-danger" : complaint.priority === "High" ? "badge-warning" : "badge-info"}`}>
                  {complaint.priority}
                </span>
              </div>
            </div>
            <div className="complaint-body">
              <p><strong>Category:</strong> {complaint.category}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
              {complaint.remarks && <p><strong>Remarks:</strong> {complaint.remarks}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintManagementView;
