import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const FeeManagementView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      fetchFees();
    }
  }, [history, userInfo, filter]);

  const fetchFees = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const endpoint = filter === "pending" ? "/api/fees/pending" : "/api/fees";
      const { data } = await axios.get(endpoint, config);
      setFees(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fee-management">
      <div className="page-header">
        <h1>Fee Management</h1>
        <div className="filter-buttons">
          {userInfo?.isAdmin && (
            <button className="btn btn-primary" onClick={() => history.push("/fees/add")}>
              + Add Fee
            </button>
          )}
          <button className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter("all")}>
            All Fees
          </button>
          <button className={`btn ${filter === "pending" ? "btn-warning" : "btn-secondary"}`} onClick={() => setFilter("pending")}>
            Pending Fees
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Room No</th>
            <th>Fee Type</th>
            <th>Amount</th>
            <th>Month/Year</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Paid Date</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee._id}>
              <td>{fee.studentName}</td>
              <td>{fee.roomNo}</td>
              <td>{fee.feeType}</td>
              <td>UGX {fee.amount}</td>
              <td>{fee.month} {fee.year}</td>
              <td>
                <span className={`badge ${fee.paymentStatus === "Paid" ? "badge-success" : fee.paymentStatus === "Overdue" ? "badge-danger" : "badge-warning"}`}>
                  {fee.paymentStatus}
                </span>
              </td>
              <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
              <td>{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeManagementView;
