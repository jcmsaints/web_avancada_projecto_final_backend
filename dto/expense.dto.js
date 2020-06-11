const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: false,
      trim: false,
    },
    categoryId: {
      type: String,
      required: true,
      unique: false,
      trim: false,
    },
    categoryName: {
      type: String,
      required: true,
      unique: false,
      trim: false,
    },
    value: {
      type: Number,
      required: true,
      unique: false,
      trim: false,
    },
    description: {
      type: String,
      required: false,
      unique: false,
      trim: false,
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

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
