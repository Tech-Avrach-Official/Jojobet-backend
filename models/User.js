const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "finance", "financeAdmin"], default: "user" },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    phone: { type: String },
    countryCode: { type: String },
    address: { type: String },
    birthdate: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"],
    },
    bankAccount: { type: String },
    ipAdress: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
