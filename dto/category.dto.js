const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
