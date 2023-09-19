const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema(
  {
    name: String,
    data: Buffer,
    username: String,
  },

  { timestamps: true }
);
module.exports = mongoose.model('File', FileSchema);
