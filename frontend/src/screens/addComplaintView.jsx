import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";
import "../css/management.css";

const AddComplaintView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
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

    if (!studentId || !title || !description) {
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
        category,
        title,
        description,
        priority,
      };

      await axios.post("/api/complaints", payload, config);
      setSuccess("Complaint submitted successfully.");
      setStudentId("");
      setCategory("Electrical");
      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-complaint">
      <div className="page-header">
        <h1>Submit Complaint</h1>
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
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Electrical", "Plumbing", "Furniture", "Cleanliness", "Security", "Other"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="priority">
            <Form.Label>Priority</Form.Label>
            <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {["Low", "Medium", "High", "Urgent"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit Complaint
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddComplaintView;
