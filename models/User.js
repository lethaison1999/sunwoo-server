const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 20,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 50,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
