import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
    contact: {
      type: Number,
      required: true,
    },
    fatherName: {
      type: String,
      required: false,
    },
    fatherContact: {
      type: Number,
      required: true,
    },
    motherName: {
      type: String,
      required: false,
    },
    motherContact: {
      type: Number,
      required: false,
    },
    guardianName: {
      type: String,
      required: false,
    },
    guardianContact: {
      type: Number,
      required: false,
    },
    emergencyContact: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: false,
    },
    course: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false,
    },
    institution: {
      type: String,
      required: false,
    },
    roomNo: {
      type: String,
      required: true,
    },
    blockNo: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      default: "Present",
    },
    medicalInfo: {
      type: String,
      required: false,
    },
    allergies: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
