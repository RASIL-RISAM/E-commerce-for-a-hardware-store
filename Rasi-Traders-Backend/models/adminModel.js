import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required:true,
    unique:true
  },
  email: {
    type: String,
    unique:true,
    required:true
  },
  password: {
    type: String,
    required:true
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
