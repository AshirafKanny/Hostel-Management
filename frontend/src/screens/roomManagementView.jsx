import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const RoomManagementView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      fetchRooms();
    }
  }, [history, userInfo]);

  const fetchRooms = async () => {
    try {
      setError("");
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/api/rooms", config);
      if (!Array.isArray(data)) {
        throw new Error("Invalid rooms response from server");
      }
      setRooms(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Unable to load rooms right now.");
      setRooms([]);
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="room-management">
      <div className="page-header">
        <h1>Room Management</h1>
        {userInfo?.isAdmin && (
          <button className="btn btn-primary" onClick={() => history.push("/rooms/add")}>
            + Add New Room
          </button>
        )}
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room._id} className="card room-card">
            <div className="room-header">
              <h3>Room {room.roomNo}</h3>
              <span className={`badge ${room.status === "Available" ? "badge-success" : room.status === "Full" ? "badge-danger" : "badge-warning"}`}>
                {room.status}
              </span>
            </div>
            <div className="room-details">
              <p><strong>Block:</strong> {room.blockNo}</p>
              <p><strong>Floor:</strong> {room.floor}</p>
              <p><strong>Type:</strong> {room.roomType}</p>
              <p><strong>Capacity:</strong> {room.currentOccupancy}/{room.capacity}</p>
              <p><strong>Rent:</strong> ₹{room.monthlyRent}/month</p>
              <p><strong>AC:</strong> {room.acAvailable ? "Yes" : "No"}</p>
              <p><strong>Attached Bathroom:</strong> {room.attachedBathroom ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagementView;
