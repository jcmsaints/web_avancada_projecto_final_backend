//imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expenseRouter = require("./controllers/expense.controller");
const categoryRouter = require("./controllers/category.controller");
const dashboardRouter = require("./controllers/dasboard.controller");
const app = express();
const port = process.env.PORT || 5000;
const uri =
  "mongodb+srv://jsantos:Santos.21@expensejs-k7rg6.gcp.mongodb.net/expensejs?retryWrites=true&w=majority";
const connection = mongoose.connection;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Conexão Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Rotas
app.use("/despesa", expenseRouter);
app.use("/categoria", categoryRouter);
app.use("/dashboard", dashboardRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
