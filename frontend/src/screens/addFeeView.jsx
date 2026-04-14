import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";
import "../css/management.css";

const AddFeeView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [feeType, setFeeType] = useState("Room Rent");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
      return;
    }
    fetchStudents();
  }, [history, userInfo]);

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
    setError("");
    setSuccess("");

    if (!studentId || !amount || !month || !dueDate) {
      setError("Please fill all required fields.");
      return;
    }

    const student = students.find((item) => item._id === studentId);
    if (!student) {
      setError("Student not found.");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const payload = {
        studentId: student._id,
        studentName: student.name,
        roomNo: student.roomNo,
        amount: Number(amount),
        feeType,
        month,
        year: Number(year),
        dueDate,
        remarks,
      };

      await axios.post("/api/fees", payload, config);
      setSuccess("Fee record created.");
      setStudentId("");
      setFeeType("Room Rent");
      setAmount("");
      setMonth("");
      setYear(new Date().getFullYear());
      setDueDate("");
      setRemarks("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create fee record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-fee">
      <div className="page-header">
        <h1>Add Fee</h1>
      </div>
      <div className="card" style={{ padding: "1.5rem" }}>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="studentId">
            <Form.Label>Student</Form.Label>
            <Form.Control as="select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.roomNo})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="feeType">
            <Form.Label>Fee Type</Form.Label>
            <Form.Control as="select" value={feeType} onChange={(e) => setFeeType(e.target.value)}>
              {[
                "Room Rent",
                "Mess Fee",
                "Maintenance",
                "Security Deposit",
                "Other",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount (UGX)</Form.Label>
            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="month">
            <Form.Label>Month</Form.Label>
            <Form.Control value={month} onChange={(e) => setMonth(e.target.value)} placeholder="e.g. April" />
          </Form.Group>
          <Form.Group controlId="year">
            <Form.Label>Year</Form.Label>
            <Form.Control type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="dueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="remarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary">
            Create Fee
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddFeeView;
