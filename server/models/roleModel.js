const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["SuperAdmin", "Admin", "Staff", "Customer"],
    unique: true,
  },
  permissions: [
    {
      type: String,
    },
  ],
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
