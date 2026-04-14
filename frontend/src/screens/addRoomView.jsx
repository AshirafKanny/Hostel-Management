import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";
import "../css/management.css";

const AddRoomView = () => {
  const history = useHistory();
  const { id } = useParams();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [roomNo, setRoomNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [roomType, setRoomType] = useState("Double");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [status, setStatus] = useState("Available");
  const [acAvailable, setAcAvailable] = useState(false);
  const [attachedBathroom, setAttachedBathroom] = useState(false);
  const [facilities, setFacilities] = useState("Bed, Study Table, Wardrobe");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/rooms/${id}`, config);
      setRoomNo(data.roomNo || "");
      setBlockNo(data.blockNo || "");
      setFloor(data.floor || "");
      setCapacity(data.capacity || 2);
      setRoomType(data.roomType || "Double");
      setMonthlyRent(data.monthlyRent || "");
      setStatus(data.status || "Available");
      setAcAvailable(Boolean(data.acAvailable));
      setAttachedBathroom(Boolean(data.attachedBathroom));
      setFacilities((data.facilities || []).join(", "));
      setImage(data.image || "");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load room.");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!roomNo || !blockNo || !floor || !monthlyRent) {
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
        roomNo,
        blockNo,
        floor: Number(floor),
        capacity: Number(capacity),
        roomType,
        monthlyRent: Number(monthlyRent),
        status,
        acAvailable,
        attachedBathroom,
        facilities: facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        image,
      };

      if (isEdit) {
        await axios.put(`/api/rooms/${id}`, payload, config);
        setSuccess("Room updated successfully.");
      } else {
        await axios.post("/api/rooms", payload, config);
        setSuccess("Room added successfully.");
        setRoomNo("");
        setBlockNo("");
        setFloor("");
        setCapacity(2);
        setRoomType("Double");
        setMonthlyRent("");
        setStatus("Available");
        setAcAvailable(false);
        setAttachedBathroom(false);
        setFacilities("Bed, Study Table, Wardrobe");
        setImage("");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to add room.");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    history.push("/login");
    return null;
  }

  return (
    <div className="add-room">
      <div className="page-header">
        <h1>{isEdit ? "Edit Room" : "Add Room"}</h1>
      </div>
      <div className="card" style={{ padding: "1.5rem" }}>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="roomNo">
            <Form.Label>Room Number</Form.Label>
            <Form.Control value={roomNo} onChange={(e) => setRoomNo(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="blockNo">
            <Form.Label>Block</Form.Label>
            <Form.Control value={blockNo} onChange={(e) => setBlockNo(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="floor">
            <Form.Label>Floor</Form.Label>
            <Form.Control type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="capacity">
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="roomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Control as="select" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              {["Single", "Double", "Triple", "Quad"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="monthlyRent">
            <Form.Label>Monthly Rent (UGX)</Form.Label>
            <Form.Control type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {["Available", "Occupied", "Full", "Maintenance"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="facilities">
            <Form.Label>Facilities (comma separated)</Form.Label>
            <Form.Control value={facilities} onChange={(e) => setFacilities(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Room Image Url</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste image link"
            />
          </Form.Group>
          <Form.Group controlId="acAvailable">
            <Form.Check
              type="checkbox"
              label="AC Available"
              checked={acAvailable}
              onChange={(e) => setAcAvailable(e.target.checked)}
            />
          </Form.Group>
          <Form.Group controlId="attachedBathroom">
            <Form.Check
              type="checkbox"
              label="Attached Bathroom"
              checked={attachedBathroom}
              onChange={(e) => setAttachedBathroom(e.target.checked)}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            {isEdit ? "Update Room" : "Add Room"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddRoomView;
