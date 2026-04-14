import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";
import "../css/management.css";

const AddNoticeView = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [validTill, setValidTill] = useState("");
  const [attachments, setAttachments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !content || !validTill) {
      setError("Please fill all required fields.");
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
        title,
        content,
        category,
        priority,
        validTill,
        postedByName: userInfo.name,
        attachments: attachments
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await axios.post("/api/notices", payload, config);
      setSuccess("Notice posted successfully.");
      setTitle("");
      setContent("");
      setCategory("General");
      setPriority("Medium");
      setValidTill("");
      setAttachments("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to post notice.");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    history.push("/login");
    return null;
  }

  return (
    <div className="add-notice">
      <div className="page-header">
        <h1>Post Notice</h1>
      </div>
      <div className="card" style={{ padding: "1.5rem" }}>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {["General", "Important", "Event", "Maintenance", "Fee", "Rules"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="priority">
            <Form.Label>Priority</Form.Label>
            <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {["Low", "Medium", "High"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="validTill">
            <Form.Label>Valid Till</Form.Label>
            <Form.Control type="date" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="attachments">
            <Form.Label>Attachments (comma separated links)</Form.Label>
            <Form.Control value={attachments} onChange={(e) => setAttachments(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary">
            Post Notice
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddNoticeView;
