import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const NoticeBoardView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const config = userInfo ? {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      } : {};
      const { data } = await axios.get("/notices", config);
      setNotices(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="notice-board">
      <div className="page-header">
        <h1>📢 Notice Board</h1>
        {userInfo?.isAdmin && (
          <button className="btn btn-primary" onClick={() => history.push("/notices/add")}>
            + Post New Notice
          </button>
        )}
      </div>

      <div className="notices-grid">
        {notices.map((notice) => (
          <div key={notice._id} className={`card notice-card priority-${notice.priority.toLowerCase()}`}>
            <div className="notice-header">
              <span className={`badge badge-${notice.category === "Important" ? "danger" : "info"}`}>
                {notice.category}
              </span>
              <span className={`badge badge-${notice.priority === "High" ? "danger" : notice.priority === "Medium" ? "warning" : "info"}`}>
                {notice.priority}
              </span>
            </div>
            <h3>{notice.title}</h3>
            <p className="notice-content">{notice.content}</p>
            <div className="notice-footer">
              <small>Posted by: {notice.postedByName}</small>
              <small>Valid till: {new Date(notice.validTill).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoardView;
