import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { listPayments } from "../actions/paymentActions";
import axios from "axios";
import "../css/management.css";

const PaymentManagementView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const paymentList = useSelector((state) => state.paymentList);
  const { loading, error, payments = [] } = paymentList;

  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    bookingId: "",
    amount: "",
    method: "MobileMoney",
    transactionId: "",
  });

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
      return;
    }
    dispatch(listPayments());
    fetchBookings();
  }, [dispatch, history, userInfo]);

  const fetchBookings = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("/api/bookings", config);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookings([]);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!form.bookingId || !form.amount) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post("/api/payments", form, config);
      setForm({ bookingId: "", amount: "", method: "MobileMoney", transactionId: "" });
      dispatch(listPayments());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="payment-management">
      <div className="page-header">
        <h1>Payment Management</h1>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Record Payment</h3>
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-4" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Booking</label>
              <select
                className="form-control"
                value={form.bookingId}
                onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
              >
                <option value="">Select booking</option>
                {bookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.bookingCode} - {booking.student?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="col-md-3" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Method</label>
              <select
                className="form-control"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="MobileMoney">Mobile Money</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="BankTransfer">Bank Transfer</option>
              </select>
            </div>
            <div className="col-md-2" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Tx ID</label>
              <input
                type="text"
                className="form-control"
                value={form.transactionId}
                onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Record Payment</button>
        </form>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Recent Payments</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.booking?.bookingCode}</td>
                  <td>{payment.student?.name}</td>
                  <td>UGX {payment.amount}</td>
                  <td>{payment.method}</td>
                  <td>{payment.status}</td>
                  <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagementView;
