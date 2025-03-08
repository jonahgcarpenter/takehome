// Role schema/model
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Admin", "Staff", "Customer"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the updatedAt field
roleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
