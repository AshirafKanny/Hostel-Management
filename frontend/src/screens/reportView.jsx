import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const ReportView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [summary, setSummary] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
      return;
    }
    fetchReports();
  }, [history, userInfo]);

  const fetchReports = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const [summaryRes, evaluationRes] = await Promise.all([
        axios.get("/api/reports/summary", config),
        axios.get("/api/reports/evaluation", config),
      ]);
      setSummary(summaryRes.data);
      setEvaluation(evaluationRes.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="report-view">
      <div className="page-header">
        <h1>Reports & Evaluation</h1>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Summary</h3>
        <div className="row">
          <div className="col-md-4">
            <strong>Bookings</strong>
            <div>Total: {summary?.bookings?.total || 0}</div>
            <div>Confirmed: {summary?.bookings?.confirmed || 0}</div>
            <div>Pending: {summary?.bookings?.pending || 0}</div>
          </div>
          <div className="col-md-4">
            <strong>Payments</strong>
            <div>Total: {summary?.payments?.total || 0}</div>
            <div>Completed: {summary?.payments?.completed || 0}</div>
            <div>Pending: {summary?.payments?.pending || 0}</div>
          </div>
          <div className="col-md-4">
            <strong>Rooms</strong>
            <div>Total: {summary?.rooms?.total || 0}</div>
            <div>Available: {summary?.rooms?.available || 0}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Evaluation Metrics</h3>
        <div className="row">
          <div className="col-md-3">
            <strong>Accuracy</strong>
            <div>{evaluation?.accuracy || 0}%</div>
          </div>
          <div className="col-md-3">
            <strong>Precision</strong>
            <div>{evaluation?.precision || 0}%</div>
          </div>
          <div className="col-md-3">
            <strong>Recall</strong>
            <div>{evaluation?.recall || 0}%</div>
          </div>
          <div className="col-md-3">
            <strong>Total Bookings</strong>
            <div>{evaluation?.totalBookings || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
