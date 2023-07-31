const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      versionKey: false,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      versionKey: false,
    },
    avatar: {
      type: String,
      required: true,
      versionKey: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
