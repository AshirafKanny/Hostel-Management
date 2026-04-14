import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { listNotifications } from "../actions/notificationActions";
import axios from "axios";
import "../css/management.css";

const NotificationManagementView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const notificationList = useSelector((state) => state.notificationList);
  const { loading, error, notifications = [] } = notificationList;

  const [form, setForm] = useState({
    recipientType: "Student",
    recipientId: "",
    channel: "InApp",
    subject: "",
    message: "",
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
      return;
    }
    dispatch(listNotifications());
    fetchStudents();
  }, [dispatch, history, userInfo]);

  const fetchStudents = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("/api/student/all", config);
      setStudents(data?.students || data || []);
    } catch (err) {
      setStudents([]);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!form.recipientId || !form.message) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post("/api/notifications", form, config);
      setForm({ recipientType: "Student", recipientId: "", channel: "InApp", subject: "", message: "" });
      dispatch(listNotifications());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-management">
      <div className="page-header">
        <h1>Notification Center</h1>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Send Notification</h3>
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Recipient</label>
              <select
                className="form-control"
                value={form.recipientId}
                onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Channel</label>
              <select
                className="form-control"
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
              >
                <option value="InApp">In-App</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            <div className="col-md-5" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              ></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Send Notification</button>
        </form>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Recent Notifications</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Channel</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((note) => (
                <tr key={note._id}>
                  <td>{note.recipientId}</td>
                  <td>{note.channel}</td>
                  <td>{note.subject || "-"}</td>
                  <td>{note.status}</td>
                  <td>{note.createdAt ? new Date(note.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationManagementView;
