import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "../css/management.css";

const RoomManagementView = () => {
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='100%25' height='100%25' fill='%23f1f3f4'/><text x='50%25' y='50%25' fill='%23666' font-size='20' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>No room image</text></svg>";
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
            <div className="room-image-wrap">
              <img
                src={room.image && room.image.trim() ? room.image.trim() : fallbackImage}
                alt={`Room ${room.roomNo}`}
                className="room-image"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </div>
            <div className="room-header">
              <h3>
                <Link to={`/rooms/edit/${room._id}`} className="room-link">
                  Room {room.roomNo}
                </Link>
              </h3>
              <span className={`badge ${room.status === "Available" ? "badge-success" : room.status === "Full" ? "badge-danger" : "badge-warning"}`}>
                {room.status}
              </span>
            </div>
            <div className="room-details">
              <p><strong>Block:</strong> {room.blockNo}</p>
              <p><strong>Floor:</strong> {room.floor}</p>
              <p><strong>Type:</strong> {room.roomType}</p>
              <p><strong>Capacity:</strong> {room.currentOccupancy}/{room.capacity}</p>
              <p><strong>Rent:</strong> UGX {room.monthlyRent}/month</p>
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
