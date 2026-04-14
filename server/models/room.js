import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true,
    },
    blockNo: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    currentOccupancy: {
      type: Number,
      required: true,
      default: 0,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Triple", "Quad"],
      default: "Double",
    },
    facilities: {
      type: [String],
      default: ["Bed", "Study Table", "Wardrobe"],
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Occupied", "Full", "Maintenance"],
      default: "Available",
    },
    acAvailable: {
      type: Boolean,
      default: false,
    },
    attachedBathroom: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
