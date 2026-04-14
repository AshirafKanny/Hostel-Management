import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { listBookings } from "../actions/bookingActions";
import axios from "axios";
import "../css/management.css";

const BookingManagementView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const bookingList = useSelector((state) => state.bookingList);
  const { loading, error, bookings = [] } = bookingList;

  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    totalAmount: "",
  });

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
      return;
    }
    dispatch(listBookings());
    fetchRooms();
    fetchStudents();
  }, [dispatch, history, userInfo]);

  const fetchRooms = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("/api/rooms", config);
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setRooms([]);
    }
  };

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
    if (!form.studentId || !form.roomId || !form.checkInDate || !form.checkOutDate || !form.totalAmount) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post("/api/bookings", form, config);
      setForm({ studentId: "", roomId: "", checkInDate: "", checkOutDate: "", totalAmount: "" });
      dispatch(listBookings());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="booking-management">
      <div className="page-header">
        <h1>Booking Management</h1>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Create Booking</h3>
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Student</label>
              <select
                className="form-control"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.roomNo || "No room"})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Room</label>
              <select
                className="form-control"
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNo} - {room.blockNo} ({room.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Total Amount</label>
              <input
                type="number"
                className="form-control"
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Check-In</label>
              <input
                type="date"
                className="form-control"
                value={form.checkInDate}
                onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
              />
            </div>
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Check-Out</label>
              <input
                type="date"
                className="form-control"
                value={form.checkOutDate}
                onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
              />
            </div>
            <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Create Booking
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Recent Bookings</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Student</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingCode}</td>
                  <td>{booking.student?.name}</td>
                  <td>{booking.room?.roomNo}</td>
                  <td>
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "-"}
                    {" "}-{" "}
                    {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "-"}
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingManagementView;
