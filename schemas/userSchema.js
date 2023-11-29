const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema({
  email: { type: "String", unique: true },
  firstName: { type: String },
  surName: { type: String },
  mobileNo: { type: Number, minlength: 10, maxlength: 10 },
  password: { type: String, minlength: 8 },
  customerReference: { type: String, sparse: true },
  created_at: { type: Date, default: new Date() },
  customerCases: [{ type: String }],
});

// Old database "User" with customerReference null issue
// const User = mongoose.model("User", schema);
const User = mongoose.model("User", schema);

module.exports = User;
