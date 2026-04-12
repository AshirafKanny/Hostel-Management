import Room from "../models/room.js";

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ blockNo: 1, roomNo: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const {
      roomNo,
      blockNo,
      floor,
      capacity,
      roomType,
      facilities,
      monthlyRent,
      status,
      acAvailable,
      attachedBathroom,
    } = req.body;

    const roomExists = await Room.findOne({ roomNo });

    if (roomExists) {
      res.status(400).json({ message: "Room already exists" });
      return;
    }

    const room = await Room.create({
      roomNo,
      blockNo,
      floor,
      capacity,
      roomType,
      facilities,
      monthlyRent,
      status,
      acAvailable,
      attachedBathroom,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNo = req.body.roomNo || room.roomNo;
      room.blockNo = req.body.blockNo || room.blockNo;
      room.floor = req.body.floor || room.floor;
      room.capacity = req.body.capacity || room.capacity;
      room.currentOccupancy = req.body.currentOccupancy !== undefined ? req.body.currentOccupancy : room.currentOccupancy;
      room.roomType = req.body.roomType || room.roomType;
      room.facilities = req.body.facilities || room.facilities;
      room.monthlyRent = req.body.monthlyRent || room.monthlyRent;
      room.status = req.body.status || room.status;
      room.acAvailable = req.body.acAvailable !== undefined ? req.body.acAvailable : room.acAvailable;
      room.attachedBathroom = req.body.attachedBathroom !== undefined ? req.body.attachedBathroom : room.attachedBathroom;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: "Room removed" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available rooms
// @route   GET /api/rooms/available
// @access  Private
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [{ status: "Available" }, { status: "Occupied" }],
      $expr: { $lt: ["$currentOccupancy", "$capacity"] },
    }).sort({ blockNo: 1, roomNo: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
};
